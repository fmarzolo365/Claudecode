# Telefontrainer

Speaking-first German practice app: learners hold phone calls and face-to-face
conversations with AI characters, get corrected, and drill what they got wrong.
Live at https://telefontrainer.onrender.com (Render free tier, auto-deploys
from `main`).

Engineering standard for all implementation work:
`.ai/agents/MARZI_PRINCIPAL_ENGINEER.md` (canonical operating contract;
where it and the docs below both apply, the stricter rule wins).
Control plane: `.ai/ENGINEERING_OS_V3_2.md` (roles, gates, hooks).

## Permanent engineering rules (Engineering OS V3.2)

- **Authoritative state** — one authoritative source per product concept;
  derive every view from it.
- **User value** — XP, coins, rewards, outfits, learning records, settings
  and progress are production user data. Never reset or fabricate them.
- **Durable truthfulness** — never present a durable action as successful
  unless its authoritative durable operation actually succeeded.
- **Async ownership** — capture lifecycle ownership BEFORE the first
  asynchronous boundary that can outlive that lifecycle.
- **Stale event safety** — an event from an old lifecycle must be unable to
  mutate a replacement lifecycle (and stale state must be cleaned, not
  merely ignored).
- **P1/P2 proof** — a P1/P2 may not be reported FIXED without direct
  regression evidence when technically feasible.
- **Red before green** — the exact regression test must fail against the
  defective baseline before it counts as proof.
- **No self-approval** — the implementer is never the final release
  auditor; terminal states are READY FOR EXTERNAL REVIEW or CHANGES
  REQUIRED, never "PRODUCTION APPROVED".
- **Product quality** — preserve i18n parity, RTL, accessibility, mobile
  behavior and canonical MARZI semantics in every change.
- **Git safety** — no destructive git, merge or deployment without explicit
  Product Owner authorization; commits/pushes pass the quality gates in
  `.claude/quality-gates.json`.
- **Quality gates** — required gates are mandatory, not advisory.
- **Roles** — engineering work flows through the V3.2 agents
  (coordinator → architect → red team → implementer → release auditor);
  frozen candidate `a9af88b` is NOT Production Candidate approved.

## Architecture

- `public/index.html` — the entire frontend: one file with inline CSS and JS.
  Installable PWA (`sw.js`, `manifest.webmanifest`, `icons/`).
- `server.js` — dependency-free Node server. Serves `./public`, proxies
  `/api/chat` (Anthropic), `/api/tts` (OpenAI speech, per-character voices) and
  `/api/avatar/<id>` (OpenAI images, lazily generated + disk-cached portraits)
  and `/api/clip` (Replicate lip-sync videos for fixed sentences, disk-cached;
  501 until `REPLICATE_API_TOKEN` is set).
  Keys live in env / `.env`; optional `TRAINER_PIN` gates all API routes.
- All learner data (mistakes, saved words, XP, stats, test history, cached
  vocab decks) lives in `localStorage` — there is no database yet.

## Conventions — read before editing

- **Every user-facing string exists in all 6 languages** (es, en, it, tr, ar,
  uk) in the `T` object. The test suite fails if any language's key set
  diverges. Scenario/level/deck data also carries per-language fields.
- **Taught languages live in the `TARGETS` registry** (`de` live, `en` pilot):
  `TARGET = TARGETS[S.targetLang || "de"]` resolves once at load and swaps in
  that target's scenario/group/deck pack; German stays the default and its
  prompts must remain byte-identical (suite-guarded). See docs/EXPANSION.md.
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
