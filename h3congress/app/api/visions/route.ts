import { NextResponse } from "next/server";
import { createSign, randomUUID } from "node:crypto";

export const runtime = "nodejs";

type VisionPayload = {
  vision?: unknown;
  role?: unknown;
  email?: unknown;
  website?: unknown;
  formLoadedAt?: unknown;
};

type RateRecord = {
  count: number;
  resetAt: number;
};

const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_SCOPE = "https://www.googleapis.com/auth/spreadsheets";
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 4;
const rateLimit = new Map<string, RateRecord>();

let cachedToken: { accessToken: string; expiresAt: number } | null = null;

function base64Url(value: string | Buffer) {
  return Buffer.from(value)
    .toString("base64")
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function normalizePrivateKey(privateKey: string) {
  return privateKey.replace(/\\n/g, "\n");
}

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return (
    forwardedFor ||
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    "unknown"
  );
}

function isRateLimited(ip: string) {
  const now = Date.now();
  const current = rateLimit.get(ip);

  if (!current || current.resetAt < now) {
    rateLimit.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  current.count += 1;
  return current.count > RATE_LIMIT_MAX;
}

function isValidEmail(email: string) {
  if (!email) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function getGoogleAccessToken() {
  const now = Math.floor(Date.now() / 1000);
  if (cachedToken && cachedToken.expiresAt > now + 60) {
    return cachedToken.accessToken;
  }

  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY;

  if (!clientEmail || !privateKey) {
    throw new Error("Google Sheets service account env vars are not configured.");
  }

  const header = base64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = base64Url(
    JSON.stringify({
      iss: clientEmail,
      scope: GOOGLE_SCOPE,
      aud: GOOGLE_TOKEN_URL,
      exp: now + 3600,
      iat: now
    })
  );
  const unsignedJwt = `${header}.${claim}`;
  const signature = createSign("RSA-SHA256")
    .update(unsignedJwt)
    .sign(normalizePrivateKey(privateKey));
  const jwt = `${unsignedJwt}.${base64Url(signature)}`;

  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt
    })
  });

  if (!response.ok) {
    throw new Error(`Google token request failed with status ${response.status}.`);
  }

  const token = (await response.json()) as {
    access_token?: string;
    expires_in?: number;
  };

  if (!token.access_token) {
    throw new Error("Google token response did not include an access token.");
  }

  cachedToken = {
    accessToken: token.access_token,
    expiresAt: now + (token.expires_in || 3600)
  };

  return cachedToken.accessToken;
}

async function appendToSheet(row: string[]) {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  const tabName = process.env.GOOGLE_SHEETS_TAB_NAME || "Submissions";

  if (!spreadsheetId) {
    throw new Error("GOOGLE_SHEETS_SPREADSHEET_ID is not configured.");
  }

  const accessToken = await getGoogleAccessToken();
  const safeTabName = tabName.replaceAll("'", "''");
  const range = encodeURIComponent(`'${safeTabName}'!A:E`);
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ values: [row] })
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Google Sheets append failed with status ${response.status}: ${errorText}`);
  }
}

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as VisionPayload | null;
  const vision = typeof payload?.vision === "string" ? payload.vision.trim() : "";
  const role = typeof payload?.role === "string" ? payload.role.trim() : "";
  const email = typeof payload?.email === "string" ? payload.email.trim() : "";
  const website = typeof payload?.website === "string" ? payload.website.trim() : "";
  const formLoadedAt =
    typeof payload?.formLoadedAt === "number" && Number.isFinite(payload.formLoadedAt)
      ? payload.formLoadedAt
      : 0;
  const ip = getClientIp(request);
  const now = Date.now();

  if (website) {
    return NextResponse.json({ ok: true });
  }

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { ok: false, message: "Too many submissions. Please try again in a few minutes." },
      { status: 429 }
    );
  }

  if (!formLoadedAt || now - formLoadedAt < 2500 || now - formLoadedAt > 24 * 60 * 60 * 1000) {
    return NextResponse.json(
      { ok: false, message: "Please try submitting the form again." },
      { status: 400 }
    );
  }

  if (vision.length < 10) {
    return NextResponse.json(
      { ok: false, message: "Please share a little more input for the project." },
      { status: 400 }
    );
  }

  if (vision.length > 5000 || role.length > 200 || email.length > 254) {
    return NextResponse.json(
      { ok: false, message: "Please shorten your submission and try again." },
      { status: 400 }
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { ok: false, message: "Please enter a valid email address or leave it blank." },
      { status: 400 }
    );
  }

  const receivedAt = new Date().toISOString();
  const contributionId = randomUUID();

  try {
    await appendToSheet([receivedAt, contributionId, vision, role, email]);
  } catch (error) {
    console.error("Unable to save vision submission", error);
    return NextResponse.json(
      { ok: false, message: "We could not save your input. Please try again later." },
      { status: 502 }
    );
  }

  return NextResponse.json({
    ok: true,
    contribution: {
      id: contributionId,
      vision,
      role,
      email,
      receivedAt
    }
  });
}
