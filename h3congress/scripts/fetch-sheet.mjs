#!/usr/bin/env node
// Pull EVERYTHING from the Google Sheet and dump it to JSON, unfiltered.
//
//   node scripts/fetch-sheet.mjs            # -> scripts/sheet-data.json
//   node scripts/fetch-sheet.mjs out.json   # custom output path
//
// Unlike sync-system.mjs (which reads only the columns the diagram renders and
// skips non-numeric-ID rows), this captures every tab, every column, and every
// non-empty row, keyed by header name. Use it as the raw source when wiring up
// new fields.
//
// Auth: same service-account key as sync-system.mjs. Point
// GOOGLE_APPLICATION_CREDENTIALS at the key, or drop it at
// scripts/service-account.json. See scripts/SYNC_SYSTEM.md.

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { buildExport } from "./build-export.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

export const SHEET_ID = "1cD9ZaHkAHYUuPZVX-OnWqeGUJmBupHQU8rfpXwhKVTI";

export async function getAccessToken(keyFile) {
  const key = JSON.parse(fs.readFileSync(keyFile, "utf8"));
  const now = Math.floor(Date.now() / 1000);
  const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
  const unsigned = `${b64({ alg: "RS256", typ: "JWT" })}.${b64({
    iss: key.client_email,
    scope: "https://www.googleapis.com/auth/spreadsheets.readonly",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  })}`;
  const sig = crypto.createSign("RSA-SHA256").update(unsigned).sign(key.private_key).toString("base64url");
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${unsigned}.${sig}`,
    }),
  });
  if (!res.ok) throw new Error(`Token request failed (${res.status}): ${await res.text()}`);
  return (await res.json()).access_token;
}

// Column index -> spreadsheet letter (0 -> A, 26 -> AA), for headerless columns.
function colLetter(i) {
  let s = "";
  for (i += 1; i > 0; i = Math.floor((i - 1) / 26)) s = String.fromCharCode(65 + ((i - 1) % 26)) + s;
  return s;
}

// Turn a tab's raw grid into { headers, rows, raw }. Row 0 is treated as the
// header row; every subsequent row with any non-empty cell becomes an object
// keyed by the (trimmed) header. Blank/duplicate headers fall back to the
// column letter so no column is ever dropped. `_row` is the 1-based sheet row.
// `raw` is the untouched 2D grid — the ground-truth fallback for any tab that
// doesn't fit the header/row shape (e.g. a header-less brainstorm list).
function tabToObjects(values) {
  if (!values.length) return { headers: [], headersRaw: [], rows: [], raw: [] };
  const headersRaw = values[0].map((c) => (c == null ? "" : String(c)));
  const width = Math.max(headersRaw.length, ...values.map((r) => r.length));

  const keys = [];
  const seen = new Map();
  for (let c = 0; c < width; c++) {
    let name = (headersRaw[c] || "").trim();
    if (!name) name = colLetter(c);
    if (seen.has(name)) {
      const n = seen.get(name) + 1;
      seen.set(name, n);
      name = `${name} (${n})`;
    } else {
      seen.set(name, 1);
    }
    keys.push(name);
  }

  const rows = [];
  for (let r = 1; r < values.length; r++) {
    const row = values[r] || [];
    if (!row.some((c) => c != null && String(c).trim() !== "")) continue; // skip fully blank rows
    const obj = { _row: r + 1 };
    for (let c = 0; c < width; c++) {
      const v = row[c];
      obj[keys[c]] = v == null ? "" : v;
    }
    rows.push(obj);
  }
  return { headers: keys, headersRaw, rows, raw: values };
}

// Break a single cell into ordered segments of { text, url? } using its rich-text
// link runs (or a whole-cell hyperlink). Returns null when the cell carries no
// links, so callers can fall back to the plain formatted string. This is what
// lets source/"Learn More" links keep their titles instead of collapsing to URLs.
function cellSegments(cell) {
  const text = cell && cell.formattedValue != null ? String(cell.formattedValue) : "";
  if (!text) return null;
  const runs = cell && cell.textFormatRuns;
  if (runs && runs.length) {
    const segs = [];
    const first = runs[0].startIndex || 0;
    if (first > 0) segs.push({ text: text.slice(0, first) });
    for (let k = 0; k < runs.length; k++) {
      const start = runs[k].startIndex || 0;
      const end = k + 1 < runs.length ? runs[k + 1].startIndex || 0 : text.length;
      const uri = runs[k].format && runs[k].format.link && runs[k].format.link.uri;
      const seg = { text: text.slice(start, end) };
      if (uri) seg.url = uri;
      segs.push(seg);
    }
    return segs;
  }
  if (cell && cell.hyperlink) return [{ text, url: cell.hyperlink }];
  return null;
}

export async function fetchAll(token) {
  const auth = { headers: { Authorization: `Bearer ${token}` } };
  // One grid-data pull carries both the formatted values AND the hyperlink runs,
  // so titled links survive the round-trip (see cellSegments / linkCells).
  const fields =
    "properties.title,sheets(properties.title,data.rowData.values(formattedValue,hyperlink,textFormatRuns(startIndex,format.link.uri)))";
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}?includeGridData=true&fields=${encodeURIComponent(fields)}`;
  const meta = await (await fetch(url, auth)).json();

  const tabs = {};
  for (const s of meta.sheets) {
    const title = s.properties.title;
    const rowData = (s.data && s.data[0] && s.data[0].rowData) || [];
    const values = rowData.map((row) =>
      (row.values || []).map((c) => (c && c.formattedValue != null ? c.formattedValue : ""))
    );
    const tab = tabToObjects(values);

    // linkCells[<1-based sheet row>][<header>] = ordered { text, url? } segments,
    // recorded only for cells that actually contain a hyperlink.
    const linkCells = {};
    for (let r = 1; r < rowData.length; r++) {
      const cells = rowData[r].values || [];
      for (let c = 0; c < cells.length; c++) {
        const segs = cellSegments(cells[c]);
        if (segs && segs.some((sg) => sg.url)) {
          (linkCells[r + 1] ||= {})[tab.headers[c]] = segs;
        }
      }
    }
    tab.linkCells = linkCells;
    tabs[title] = tab;
  }

  return {
    spreadsheetId: SHEET_ID,
    title: meta.properties?.title || "",
    fetchedAt: new Date().toISOString(),
    tabs,
  };
}

async function main() {
  const outArg = process.argv[2];
  const outPath = outArg ? path.resolve(outArg) : path.join(__dirname, "sheet-data.json");

  const keyFile = process.env.GOOGLE_APPLICATION_CREDENTIALS || path.join(__dirname, "service-account.json");
  if (!fs.existsSync(keyFile)) {
    console.error(
      `\nNo service-account credentials found.\n` +
        `  Set GOOGLE_APPLICATION_CREDENTIALS or place the key at\n` +
        `  ${path.relative(ROOT, keyFile)}\n` +
        `  See scripts/SYNC_SYSTEM.md for setup.\n`
    );
    process.exit(1);
  }

  console.log("Authenticating to Google Sheets…");
  const token = await getAccessToken(keyFile);
  const data = await fetchAll(token);

  fs.writeFileSync(outPath, JSON.stringify(data, null, 2));

  console.log(`\nWrote ${path.relative(ROOT, outPath)} (${data.title})`);
  for (const [name, t] of Object.entries(data.tabs)) {
    console.log(`  • ${name}: ${t.rows.length} rows × ${t.headers.length} columns`);
    console.log(`      columns: ${t.headers.join(", ")}`);
  }

  // Regenerate the downloadable data bundle (public/exports/*.zip) so the
  // site's Export button always serves the freshly pulled sheet.
  const exp = buildExport(data);
  console.log(`\nWrote ${path.relative(ROOT, exp.zipPath)} (export bundle: ${exp.files.join(", ")})`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
