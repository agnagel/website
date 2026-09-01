#!/usr/bin/env node
// Single source-of-truth generator for the H3 site's horizon data.
//
// Reads the two content tabs of the (private) Google Sheet —
//   • "H1 & H3"          : one row per problem-area, with H1 status-quo and H3
//                          vision statements/descriptions/times.
//   • "H2 Problem Space" : one row per H2−/H2+ idea, linked back to the problem
//                          area(s) it addresses via the "H1/H3 ID(s)" column.
// The "DRAFTS - CLAUDE IGNORE" tab is intentionally ignored.
//
// From those it writes the typed data module app/data/problemSpace.ts
// (PROBLEM_AREAS + H2_IDEAS) that the React tabs import. Each row carries its
// diagram `bucket` (from the sheet's "Block" column) so the System Diagram tab
// can group the same data by block, exactly as the Domains tab groups it by
// domain. The diagram's structural scaffold (nodes/buckets) lives in the
// hand-authored app/data/systemDiagram.ts, not here.
//
//   node scripts/sync-system.mjs                  # read the live sheet (needs credentials)
//   node scripts/sync-system.mjs --from-file x    # read a local fetch-sheet.mjs dump
//
// Auth: a Google Cloud service account with read access to the sheet. Point
// GOOGLE_APPLICATION_CREDENTIALS at its JSON key, or drop the key at
// scripts/service-account.json (gitignored). See scripts/SYNC_SYSTEM.md.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { fetchAll, getAccessToken } from "./fetch-sheet.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PROBLEM_SPACE_TS = path.join(ROOT, "app/data/problemSpace.ts");
const SHEET_DATA_JSON = path.join(__dirname, "sheet-data.json");

const H1H3_TAB = "H1 & H3";
const H2_TAB = "H2 Problem Space";

// ---------------------------------------------------------------------------
// Mapping tables from raw sheet values to the internal keys the React tabs use.
// The diagram's structural scaffold (nodes + buckets) it once injected into
// system.html now lives in app/data/systemDiagram.ts; this script only needs to
// resolve each row's Block to a bucket id (stamped onto every emitted row).
// ---------------------------------------------------------------------------
// Sheet "Block" value -> diagram bucket id. The Block cell is comma-separated
// (like Domain), so a row can land in several buckets; each token is looked up
// here. Every id must have a matching entry in app/data/systemDiagram.ts to
// actually appear on the diagram.
const BLOCK_TO_BUCKET = {
  // Inputs
  "Constituent Engagement": "community",
  "Elections": "elections",
  "Stakeholder Engagement": "stakeholder",
  "Funding Requests": "appropriationsRequests",
  "Casework": "casework",
  // Institution
  "Culture": "culture",
  "Technology": "technology",
  "Oversight": "oversight",
  "Personnel": "personnel",
  "Members": "members",
  "Structure": "structure",
  "Processes": "processes",
  "House": "house",
  "Senate": "senate",
  "Support Agencies": "supportAgencies",
  "District Offices": "districtOffices",
  "Committees": "committees",
  // Outputs
  "Legislation": "law",
  "Appropriations": "appropriations",
  "Confirmations": "confirmations",
};

// Sheet "Domain" value -> DomainKey used by the React tabs.
const DOMAIN_TO_KEY = {
  "Institutional Capacity": "capacity",
  "Staffing & Talent": "staffing",
  "Information": "information",
  "Technology & Systems": "technology",
  "Oversight": "oversight",
};

const DOMAIN_LABELS = {
  capacity: "Institutional Capacity",
  staffing: "Staffing & Talent",
  information: "Information",
  technology: "Technology & Systems",
  oversight: "Oversight",
};

// ---------------------------------------------------------------------------
// Cell parsing helpers.
// ---------------------------------------------------------------------------
const str = (v) => (v == null ? "" : String(v).trim());

// Row IDs are digit-led, optionally suffixed with letters (e.g. "1", "1a", "1b").
// This deliberately rejects spreadsheet error cells like "#VALUE!" and blanks.
const isId = (v) => /^\d+[a-z]*$/i.test(str(v));

function parseYear(v) {
  const m = str(v).match(/\d{4}/);
  return m ? Number(m[0]) : null;
}

function splitList(v) {
  return str(v)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

// A URL's host, sans "www." — the fallback title for a bare (untitled) link.
function hostTitle(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

// Parse a Sources / Learn More cell into [{ title, url? }] link items. Prefers the
// sheet's hyperlink runs (from fetch-sheet's linkCells) so linked text keeps its
// title; a bare URL is titled by its host. Falls back to splitting the plain
// string on commas/newlines when no link runs are present. Plain (unlinked) text
// like "Interview with House staff" is kept as a title-only item.
function parseLinks(raw, segments) {
  const items = [];
  const push = (text, url) => {
    const t = str(text);
    if (url) {
      const title = t && !/^https?:\/\//i.test(t) ? t : hostTitle(url);
      items.push({ title, url });
    } else if (/^https?:\/\//i.test(t)) {
      items.push({ title: hostTitle(t), url: t });
    } else if (t) {
      items.push({ title: t });
    }
  };
  if (segments && segments.length) {
    for (const seg of segments) {
      if (seg.url) push(seg.text, seg.url);
      else for (const tok of str(seg.text).split(/[\n,]+/)) push(tok);
    }
  } else {
    for (const tok of str(raw).split(/[\n,]+/)) push(tok);
  }
  return items;
}

function toDomainKeys(domainRaw, warnings, rowLabel) {
  const keys = [];
  for (const name of splitList(domainRaw)) {
    const key = DOMAIN_TO_KEY[name];
    if (!key) {
      warnings.push(`${rowLabel}: unrecognized Domain "${name}" — dropped`);
      continue;
    }
    if (!keys.includes(key)) keys.push(key);
  }
  return keys;
}

function toBuckets(blockRaw, warnings, rowLabel) {
  const buckets = [];
  for (const name of splitList(blockRaw)) {
    const bucket = BLOCK_TO_BUCKET[name];
    if (!bucket) {
      warnings.push(`${rowLabel}: unrecognized Block "${name}" — not placed on the diagram`);
      continue;
    }
    if (!buckets.includes(bucket)) buckets.push(bucket);
  }
  return buckets;
}

function toHorizonKey(classification) {
  const c = str(classification).replace(/\s+/g, "");
  if (c === "H2-" || c === "H2−") return { horizon: "H2-", horizonKey: "h2neg" };
  if (c === "H2+") return { horizon: "H2+", horizonKey: "h2pos" };
  return { horizon: str(classification), horizonKey: "" };
}

// ---------------------------------------------------------------------------
// Transform: the two sheet tabs -> problemAreas + h2Ideas.
// ---------------------------------------------------------------------------
function buildData(tabs) {
  const warnings = [];

  const areaRows = (tabs[H1H3_TAB] && tabs[H1H3_TAB].rows) || [];
  const ideaRows = (tabs[H2_TAB] && tabs[H2_TAB].rows) || [];
  if (!areaRows.length) warnings.push(`Tab "${H1H3_TAB}" has no rows`);
  if (!ideaRows.length) warnings.push(`Tab "${H2_TAB}" has no rows`);

  const problemAreas = [];
  for (const r of areaRows) {
    const id = str(r.ID);
    if (!isId(id)) continue;
    problemAreas.push({
      id,
      domainsRaw: str(r.Domain),
      domains: toDomainKeys(r.Domain, warnings, `H1&H3 row ${id}`),
      block: str(r.Block),
      buckets: toBuckets(r.Block, warnings, `H1&H3 row ${id}`),
      additionalTags: str(r["Additional Tags"]),
      h1Time: parseYear(r["H1 Time"]),
      h1Statement: str(r["H1 Statement"]),
      h1Description: str(r["H1 Description"]),
      h3Time: parseYear(r["H3 Time"]),
      h3Statement: str(r["H3 Statement"]),
      h3Description: str(r["H3 Description"]),
    });
  }
  const areaById = new Map(problemAreas.map((a) => [a.id, a]));

  const h2LinkCells = (tabs[H2_TAB] && tabs[H2_TAB].linkCells) || {};
  const h2Ideas = [];
  for (const r of ideaRows) {
    const id = str(r.ID);
    if (!isId(id)) continue;
    const { horizon, horizonKey } = toHorizonKey(r["Horizon Classification"]);
    if (!horizonKey) warnings.push(`H2 row ${id}: unrecognized Horizon Classification "${str(r["Horizon Classification"])}"`);
    const h1h3Ids = splitList(r["H1/H3 ID(s)"]);
    for (const linkId of h1h3Ids) {
      if (!areaById.has(linkId)) warnings.push(`H2 row ${id}: links to H1/H3 ID "${linkId}" which has no row in "${H1H3_TAB}"`);
    }
    const rowLinks = h2LinkCells[r._row] || {};
    h2Ideas.push({
      id,
      domainsRaw: str(r.Domain),
      domains: toDomainKeys(r.Domain, warnings, `H2 row ${id}`),
      block: str(r.Block),
      buckets: toBuckets(r.Block, warnings, `H2 row ${id}`),
      additionalTags: str(r["Additional Tags"]),
      horizon,
      horizonKey,
      year: parseYear(r["Time Horizon"]),
      h1h3Ids,
      problemStatement: str(r["Problem Statement"]),
      problemDescription: str(r["Problem Description"]),
      solutionStatement: str(r["Solution Statement"]),
      solutionDescription: str(r["Solution Description"]),
      horizonJustification: str(r["Horizon Justification"]),
      pathToH2plus: str(r["Path to H2+"]),
      currentStatus: str(r["Current Status (Optional)"]),
      sources: parseLinks(r.Sources, rowLinks["Sources"]),
      learnMore: parseLinks(r["Learn More"], rowLinks["Learn More"]),
    });
  }

  for (const w of warnings) console.warn("  ! " + w);
  return { problemAreas, h2Ideas, areaById, warnings };
}

// ---------------------------------------------------------------------------
// Emit app/data/problemSpace.ts
// ---------------------------------------------------------------------------
function emitProblemSpace({ problemAreas, h2Ideas }) {
  const j = (v) => JSON.stringify(v, null, 2);

  // Both React tabs consume these fields. `buckets` places the row on the System
  // Diagram (empty array = not placed); `domains` groups it on the Domains tab.
  // The raw Block/domainsRaw values are internal to this script and left out.
  const areasOut = problemAreas.map((a) => ({
    id: a.id,
    domains: a.domains,
    buckets: a.buckets,
    h1Time: a.h1Time,
    h1Statement: a.h1Statement,
    h1Description: a.h1Description,
    h3Time: a.h3Time,
    h3Statement: a.h3Statement,
    h3Description: a.h3Description,
  }));
  const ideasOut = h2Ideas.map((i) => ({
    id: i.id,
    domains: i.domains,
    buckets: i.buckets,
    additionalTags: i.additionalTags,
    horizon: i.horizon,
    horizonKey: i.horizonKey,
    year: i.year,
    h1h3Ids: i.h1h3Ids,
    problemStatement: i.problemStatement,
    problemDescription: i.problemDescription,
    solutionStatement: i.solutionStatement,
    solutionDescription: i.solutionDescription,
    horizonJustification: i.horizonJustification,
    pathToH2plus: i.pathToH2plus,
    currentStatus: i.currentStatus,
    sources: i.sources,
    learnMore: i.learnMore,
  }));

  return `// AUTO-GENERATED by scripts/sync-system.mjs from the "H1 & H3" and
// "H2 Problem Space" tabs of the H3 Idea Database Google Sheet. Do not edit by
// hand — re-run \`npm run sync-system\` (or \`npm run fetch-sheet && npm run sync-system\`).
//
// PROBLEM_AREAS  — one per H1 & H3 row: the H1 status quo and H3 vision for a
//                  slice of the system, keyed by sheet ID.
// H2_IDEAS       — one per H2 Problem Space row: a near-term (H2−) or
//                  capacity-building (H2+) idea, linked back to the problem
//                  area(s) it addresses via h1h3Ids.

export type DomainKey = "capacity" | "staffing" | "information" | "technology" | "oversight";

// A source / "Learn more" reference. \`url\` is omitted for plain-text entries
// (e.g. "Interview with House staff"); when present, \`title\` is the link's label.
export type SourceLink = {
  title: string;
  url?: string;
};

export type ProblemArea = {
  id: string;
  domains: DomainKey[];
  buckets: string[];
  h1Time: number | null;
  h1Statement: string;
  h1Description: string;
  h3Time: number | null;
  h3Statement: string;
  h3Description: string;
};

export type H2Idea = {
  id: string;
  domains: DomainKey[];
  buckets: string[];
  additionalTags: string;
  horizon: "H2-" | "H2+";
  horizonKey: "h2neg" | "h2pos";
  year: number | null;
  h1h3Ids: string[];
  problemStatement: string;
  problemDescription: string;
  solutionStatement: string;
  solutionDescription: string;
  horizonJustification: string;
  pathToH2plus: string;
  currentStatus: string;
  sources: SourceLink[];
  learnMore: SourceLink[];
};

export const DOMAIN_LABELS: Record<DomainKey, string> = ${j(DOMAIN_LABELS)};

export const PROBLEM_AREAS: ProblemArea[] = ${j(areasOut)};

export const H2_IDEAS: H2Idea[] = ${j(ideasOut)};
`;
}

// ---------------------------------------------------------------------------
async function loadTabs(args) {
  const i = args.indexOf("--from-file");
  if (i >= 0) {
    const dump = JSON.parse(fs.readFileSync(args[i + 1], "utf8"));
    return dump.tabs;
  }
  const keyFile = process.env.GOOGLE_APPLICATION_CREDENTIALS || path.join(__dirname, "service-account.json");
  if (fs.existsSync(keyFile)) {
    console.log("Authenticating to Google Sheets…");
    const token = await getAccessToken(keyFile);
    const dump = await fetchAll(token);
    fs.writeFileSync(SHEET_DATA_JSON, JSON.stringify(dump, null, 2));
    console.log(`Refreshed ${path.relative(ROOT, SHEET_DATA_JSON)}`);
    return dump.tabs;
  }
  if (fs.existsSync(SHEET_DATA_JSON)) {
    console.warn(`No credentials — falling back to cached ${path.relative(ROOT, SHEET_DATA_JSON)}`);
    return JSON.parse(fs.readFileSync(SHEET_DATA_JSON, "utf8")).tabs;
  }
  throw new Error(
    "No service-account credentials and no cached scripts/sheet-data.json.\n" +
      "  Set GOOGLE_APPLICATION_CREDENTIALS or place the key at scripts/service-account.json,\n" +
      "  or pass --from-file <fetch-sheet dump>. See scripts/SYNC_SYSTEM.md."
  );
}

async function generate(tabs) {
  const data = buildData(tabs);

  fs.writeFileSync(PROBLEM_SPACE_TS, emitProblemSpace(data));
  console.log(
    `Wrote ${path.relative(ROOT, PROBLEM_SPACE_TS)} ` +
      `(${data.problemAreas.length} problem areas, ${data.h2Ideas.length} H2 ideas)`
  );
}

async function main() {
  const tabs = await loadTabs(process.argv.slice(2));
  await generate(tabs);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
