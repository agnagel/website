# Syncing the site from the Google Sheet

All of the site's Three-Horizons content comes from one source of truth: the
**"H3 Idea Database"** Google Sheet. `scripts/sync-system.mjs` reads it and writes
one generated artifact:

- **`app/data/problemSpace.ts`** — the typed module both React tabs import
  (`PROBLEM_AREAS` + `H2_IDEAS` + `DOMAIN_LABELS`). Every row carries its
  `domains` (how the **Domains** tab groups it) and its `bucket` (how the
  **System Diagram** tab groups it), so both tabs render the same cards from the
  same data.

Commit the changed `problemSpace.ts` — that committed file is what ships. The
System Diagram is now a native React component (`app/components/tabs/
SystemDiagramTab.tsx`); its structural scaffold — the diagram's nodes and blocks
("buckets") — is hand-authored in `app/data/systemDiagram.ts`, not generated.

| Command | Source | When to use |
| --- | --- | --- |
| `npm run sync-system` | The live Google Sheet (needs credentials) | Normal updates |
| `npm run fetch-sheet` | Dumps every tab/column to `scripts/sheet-data.json` | Inspecting the raw sheet |

`sync-system` also refreshes `scripts/sheet-data.json` on each live run and will
fall back to that cached copy (or a `--from-file <dump>` path) when no
credentials are present.

---

## One-time setup for `npm run sync-system` (live Sheet)

You need a Google Cloud **service account** with read access to the sheet. This
is a machine credential, so no human login / OAuth screen is involved.

### 1. Create a service account + key

1. Go to <https://console.cloud.google.com/> and pick a project (or create one).
2. **APIs & Services → Library →** search "Google Sheets API" → **Enable**.
3. **APIs & Services → Credentials → Create credentials → Service account**.
   - Name it e.g. `h3-sheet-reader`. No roles are needed. Click **Done**.
4. Open the new service account → **Keys → Add key → Create new key → JSON**.
   A `.json` file downloads. This is the private key.

### 2. Install the key

Put the downloaded JSON where the script looks for it:

```bash
mv ~/Downloads/<that-file>.json scripts/service-account.json
```

`scripts/service-account.json` is gitignored — never commit it. (Alternatively,
set `GOOGLE_APPLICATION_CREDENTIALS=/abs/path/to/key.json` and the script uses
that instead.)

### 3. Share the sheet with the service account

The service account is its own identity with its own email, like
`h3-sheet-reader@<project>.iam.gserviceaccount.com` (it's the `client_email`
field inside the JSON key).

Open the sheet and **Share** it with that email as a **Viewer**. Without this
step the API returns a 403.

> Sheet used by the script: ID `1cD9ZaHkAHYUuPZVX-OnWqeGUJmBupHQU8rfpXwhKVTI`
> (see `SHEET_ID` in `fetch-sheet.mjs`).

### 4. Run it

```bash
npm run sync-system
```

You should see e.g.
`Wrote app/data/problemSpace.ts (13 problem areas, 19 H2 ideas)`.
Review the diff and commit.

---

## What the sheet must contain

The generator reads exactly two tabs and ignores the rest (the
`DRAFTS - CLAUDE IGNORE` tab is skipped by name).

### Tab `H1 & H3` — one row per problem area

Rows without a numeric `ID` are skipped.

| Column | Notes |
| --- | --- |
| `ID` | Integer. The key H2 ideas link back to. |
| `Domain` | Comma-separated. Each maps to a `DomainKey`: Institutional Capacity → `capacity`, Staffing & Talent → `staffing`, Information → `information`, Technology & Systems → `technology`, Oversight → `oversight`. |
| `Block` | Places the area on the diagram: Community Engagement, Culture, Technology, Oversight, Personnel, Law. |
| `Additional Tags` | Comma-separated chip labels. |
| `H1 Time` / `H1 Statement` / `H1 Description` | The status quo. |
| `H3 Time` / `H3 Statement` / `H3 Description` | The vision. |

### Tab `H2 Problem Space` — one row per H2−/H2+ idea

Rows without a numeric `ID` are skipped.

| Column | Notes |
| --- | --- |
| `ID` | Integer. |
| `Domain` / `Block` / `Additional Tags` | Same meaning as above. |
| `Horizon Classification` | `H2-` or `H2+`. |
| `Time Horizon` | Year. |
| `H1/H3 ID(s)` | Comma-separated IDs into the `H1 & H3` tab. The first one supplies the H1/H3 framing shown in the idea's detail view. |
| `Problem Statement` / `Problem Description` | |
| `Solution Statement` / `Solution Description` | |
| `Horizon Justification` | |
| `Path to H2+` | |
| `Current Status (Optional)` | |
| `Sources` | |

### Scaffolding that is NOT in the sheet

The sheet has no columns for the diagram's structural chrome:

- `NODES` / `BUCKETS` — the three nodes and the diagram's blocks (labels +
  blurbs), including display-only blocks that have no sheet rows yet — live in
  the hand-authored `app/data/systemDiagram.ts`.
- `BLOCK_TO_BUCKET` / `DOMAIN_TO_KEY` / `DOMAIN_LABELS` — the maps from sheet
  values to internal keys — live in `sync-system.mjs`.

Unrecognized `Block`/`Domain` values, or an `H1/H3 ID(s)` that points at a
missing row, print a `!` warning during sync. A `Block` that maps to a bucket id
must have a matching entry in `app/data/systemDiagram.ts` for it to appear on
the diagram.

---

## Fallback behavior

`sync-system` reads the live sheet, or falls back to the cached
`scripts/sheet-data.json` (or a `--from-file <dump>`) when no credentials are
present. Always run it before committing so the shipped `problemSpace.ts` has the
latest data.
