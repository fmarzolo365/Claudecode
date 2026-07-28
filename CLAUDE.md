# Telefontrainer

Speaking-first German practice app: learners hold phone calls and face-to-face
conversations with AI characters, get corrected, and drill what they got wrong.
Live at https://telefontrainer.onrender.com (Render free tier, auto-deploys
from `main`).

## Architecture

- `public/index.html` — the entire frontend: one file with inline CSS and JS.
  Installable PWA (`sw.js`, `manifest.webmanifest`, `icons/`).
- `server.js` — dependency-free Node server. Serves `./public`, proxies
  `/api/chat` (Anthropic), `/api/tts` (OpenAI speech, per-character voices) and
  `/api/avatar/<id>` (OpenAI images, lazily generated + disk-cached portraits).
  Keys live in env / `.env`; optional `TRAINER_PIN` gates all API routes.
- All learner data (mistakes, saved words, XP, stats, test history, cached
  vocab decks) lives in `localStorage` — there is no database yet.

## Conventions — read before editing

- **Every user-facing string exists in all 6 languages** (es, en, it, tr, ar,
  uk) in the `T` object. The test suite fails if any language's key set
  diverges. Scenario/level/deck data also carries per-language fields.
- Scenarios: `SCENARIOS` entries with `goals` are playable; `kind:"face"`
  marks in-person conversations (different prompt register, HABLAR/TERMINAR
  labels, IM GESPRÄCH timer). Each has `avatar` (emoji fallback), `voice` and
  `voice2` (OpenAI voice ids; server whitelists them), and a `<id>2` portrait
  persona in `server.js` for mid-call handovers (`speaker` field in the
  role-play JSON).
- The role-play, evaluation, vocab and test prompts return strict JSON —
  parsing slices from first `{`/`[` to last. Keep that contract.
- Keep the frontend single-file and dependency-free; same for the server.

## Verify

- `node test/run.js` — full suite (extracts the inline script, runs it against
  DOM stubs; checks i18n completeness, deck integrity, matcher, XP math,
  prompts, chart). CI runs this on every PR (`.github/workflows/ci.yml`).
- `node --check server.js` for the server.
- For UI changes, screenshot with playwright-core against a locally running
  server (`ANTHROPIC_API_KEY=dummy PORT=5173 node server.js`; Chromium at
  `/opt/pw-browsers/chromium`), stubbing `/api/*` routes.

## Delivery flow

Work on a feature branch → PR → merge to `main` → Render auto-deploys.
Never commit secrets; `.env` is gitignored. The service worker is
network-first; bump its `CACHE` constant only when static assets change.
