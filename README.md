# LG Skill Olympiad 2026 — Theory Test

Cloudflare Pages + Pages Functions + D1.

- `public/index.html` — the test page (examinee + supervisor screens).
- `functions/api/questions.js` — GET questions **without** correct answers.
- `functions/api/submit.js` — POST answers; scored on the server and saved to D1.
- `functions/api/results/` — supervisor only (header `x-supervisor-pin`): list, details, delete.
- `lib/questions.js` — the question bank and answer key (server side only).
- `schema.sql` — optional; the table is created automatically.

## Cloudflare settings
- Build command: *(empty)* · Build output directory: `public`
- D1 binding: variable name `DB`
- Secret: `SUPERVISOR_PIN`
- Optional variable: `PASS_MARK` (default 80)
