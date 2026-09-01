# H3 Congress Microsite

A Next.js implementation of the H3 "Three Horizons Vision for Congress" microsite prototype.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The Reform Map is embedded as a section on the main page.

## Checks

```bash
npm run typecheck
npm run build
npm audit --omit=dev
```

## Contribution Form

The form posts to `POST /api/visions`, validates the submission, applies lightweight
spam protection, and appends accepted rows to Google Sheets.

Target spreadsheet:
`1TSTNBj5u08xhYvBPfr9Dbz_fWQg5X1m0Wid5kyd8hoE`

Expected sheet columns:

1. `Received At`
2. `Contribution ID`
3. `Input`
4. `Role / Org`
5. `Email`

Deployment environment variables:

```bash
GOOGLE_SHEETS_CLIENT_EMAIL=
GOOGLE_SHEETS_PRIVATE_KEY=
GOOGLE_SHEETS_SPREADSHEET_ID=1TSTNBj5u08xhYvBPfr9Dbz_fWQg5X1m0Wid5kyd8hoE
GOOGLE_SHEETS_TAB_NAME=Submissions
```

Google setup notes:

- Create a Google Cloud service account with access to the Google Sheets API.
- Copy the service account email into `GOOGLE_SHEETS_CLIENT_EMAIL`.
- Create a JSON key and copy its `private_key` into `GOOGLE_SHEETS_PRIVATE_KEY`.
- Share the target Google Sheet with the service account email as an editor.
- Create or rename a tab to match `GOOGLE_SHEETS_TAB_NAME`; the default is `Submissions`.
- In hosting providers that require one-line env vars, keep the private key as a single
  value with escaped newlines (`\n`). The app normalizes those at runtime.

Spam protection is intentionally lightweight for launch:

- Hidden honeypot field.
- Minimum time-on-form check.
- Max length and email format validation.
- Best-effort per-IP rate limiting.

## Notes

- The production app lives in `app/` and serves assets from `public/assets/`.
- The original handoff is preserved in `mdh_microsite_prototype/`.
- The H3 brand source package is preserved in `H3Congress-brand/`; deployed logo and favicon assets are copied into `public/`.
- The newer combined design handoff is preserved in `design_handoff_three_horizons/`, including the Reform Map and brand sheet references.
- The updated multi-page design handoff is preserved in `design_handoff_three_horizons4/`.
