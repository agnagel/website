#!/usr/bin/env node
// Build the public data-export bundle: a ZIP holding one CSV per source tab.
//
//   node scripts/build-export.mjs            # from scripts/sheet-data.json
//   node scripts/build-export.mjs data.json  # from a custom sheet-data dump
//
// fetch-sheet.mjs calls buildExport() automatically after every pull, so the
// download the site's "Export" button serves is regenerated whenever the Google
// Sheet is re-pulled. Only the two public content tabs are included — the
// service-account key and the DRAFTS tab are never bundled.
//
// The ZIP is written with a tiny zero-dependency writer (deflate via zlib) so
// the project keeps its no-runtime-deps footprint.

import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// Google Sheet tab title -> CSV file name inside the ZIP.
const EXPORT_TABS = [
  { tab: "H1 & H3", file: "H1-and-H3.csv" },
  { tab: "H2 Problem Space", file: "H2-Database.csv" },
];

const OUT_DIR = path.join(ROOT, "public", "exports");
const ZIP_PATH = path.join(OUT_DIR, "h3-congress-data.zip");

// ---- CSV --------------------------------------------------------------------

function csvCell(v) {
  const s = v == null ? "" : String(v);
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

// Render a tab's raw 2D grid (header row included) to CSV, padding ragged rows
// to a uniform width so every row has the same number of columns.
function gridToCsv(grid) {
  const width = grid.reduce((m, r) => Math.max(m, r.length), 0);
  return (
    grid
      .map((row) => {
        const cells = [];
        for (let c = 0; c < width; c++) cells.push(csvCell(row[c]));
        return cells.join(",");
      })
      .join("\r\n") + "\r\n"
  );
}

// ---- minimal ZIP writer -----------------------------------------------------

function crc32(buf) {
  let crc = ~0;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
  }
  return ~crc >>> 0;
}

// files: [{ name, data: Buffer }] -> a Buffer holding a valid .zip archive.
function zipSync(files) {
  const parts = [];
  const central = [];
  let offset = 0;

  for (const f of files) {
    const nameBuf = Buffer.from(f.name, "utf8");
    const content = f.data;
    const crc = crc32(content);
    const deflated = zlib.deflateRawSync(content);
    const useDeflate = deflated.length < content.length;
    const method = useDeflate ? 8 : 0;
    const stored = useDeflate ? deflated : content;

    const lfh = Buffer.alloc(30);
    lfh.writeUInt32LE(0x04034b50, 0); // local file header signature
    lfh.writeUInt16LE(20, 4); // version needed
    lfh.writeUInt16LE(0, 6); // flags
    lfh.writeUInt16LE(method, 8);
    lfh.writeUInt16LE(0, 10); // mod time (fixed)
    lfh.writeUInt16LE(0x21, 12); // mod date (fixed — 1980-01-01)
    lfh.writeUInt32LE(crc, 14);
    lfh.writeUInt32LE(stored.length, 18);
    lfh.writeUInt32LE(content.length, 22);
    lfh.writeUInt16LE(nameBuf.length, 26);
    lfh.writeUInt16LE(0, 28); // extra length
    parts.push(lfh, nameBuf, stored);

    const cdh = Buffer.alloc(46);
    cdh.writeUInt32LE(0x02014b50, 0); // central dir header signature
    cdh.writeUInt16LE(20, 4); // version made by
    cdh.writeUInt16LE(20, 6); // version needed
    cdh.writeUInt16LE(0, 8); // flags
    cdh.writeUInt16LE(method, 10);
    cdh.writeUInt16LE(0, 12); // mod time
    cdh.writeUInt16LE(0x21, 14); // mod date
    cdh.writeUInt32LE(crc, 16);
    cdh.writeUInt32LE(stored.length, 20);
    cdh.writeUInt32LE(content.length, 24);
    cdh.writeUInt16LE(nameBuf.length, 28);
    cdh.writeUInt16LE(0, 30); // extra length
    cdh.writeUInt16LE(0, 32); // comment length
    cdh.writeUInt16LE(0, 34); // disk number start
    cdh.writeUInt16LE(0, 36); // internal attrs
    cdh.writeUInt32LE(0, 38); // external attrs
    cdh.writeUInt32LE(offset, 42); // local header offset
    central.push({ cdh, nameBuf });

    offset += lfh.length + nameBuf.length + stored.length;
  }

  const centralStart = offset;
  let centralSize = 0;
  for (const c of central) {
    parts.push(c.cdh, c.nameBuf);
    centralSize += c.cdh.length + c.nameBuf.length;
  }

  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0); // end of central directory signature
  eocd.writeUInt16LE(0, 4); // this disk
  eocd.writeUInt16LE(0, 6); // disk with central dir
  eocd.writeUInt16LE(central.length, 8);
  eocd.writeUInt16LE(central.length, 10);
  eocd.writeUInt32LE(centralSize, 12);
  eocd.writeUInt32LE(centralStart, 16);
  eocd.writeUInt16LE(0, 20); // comment length
  parts.push(eocd);

  return Buffer.concat(parts);
}

// ---- build ------------------------------------------------------------------

// Build the export ZIP from a parsed sheet-data object (fetch-sheet.mjs shape).
// Returns { zipPath, files } and writes public/exports/h3-congress-data.zip.
export function buildExport(sheetData) {
  const files = [];
  for (const { tab, file } of EXPORT_TABS) {
    const t = sheetData.tabs?.[tab];
    if (!t) {
      console.warn(`  ! export: tab "${tab}" not found — skipping`);
      continue;
    }
    const grid = t.raw && t.raw.length ? t.raw : [t.headersRaw || t.headers || []];
    files.push({ name: file, data: Buffer.from(gridToCsv(grid), "utf8") });
  }
  if (!files.length) throw new Error("export: no source tabs found to bundle");

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(ZIP_PATH, zipSync(files));
  return { zipPath: ZIP_PATH, files: files.map((f) => f.name) };
}

function main() {
  const srcArg = process.argv[2];
  const src = srcArg ? path.resolve(srcArg) : path.join(__dirname, "sheet-data.json");
  const data = JSON.parse(fs.readFileSync(src, "utf8"));
  const res = buildExport(data);
  console.log(`Wrote ${path.relative(ROOT, res.zipPath)} (${res.files.join(", ")})`);
}

if (import.meta.url === `file://${process.argv[1]}`) main();
