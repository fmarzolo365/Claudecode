# Architecture Decision Records — Telefontrainer / Marzi

Short log of the decisions that shape this codebase. New entries go on top.

## ADR-11 · Marzi product redesign grafted natively (2026-07-31)
The "Marzi master product spec" (React/TS target) was implemented **natively
in the single-file app** per ADR-9: design tokens (§6/§17 palette, Nunito
Sans, button hierarchy), four-tab shell (Learn/Talk/Store/Profile with
sticky top bar: Marzi wordmark + coin/streak chips), local coin economy
(§14 rewards; usage packages converted from MB to call minutes — our
metered unit), and the SIX canonical evolution stages (§15; the 7 XP ranks
map onto them, ranks 5+6 share the studious frog; rank titles unchanged).
Outfits ship as catalog data only (ADR-10). Premium is a teaser card —
no payment until Play Billing. The call screen keeps its family-approved
layout; only chrome picked up the new tokens.

## ADR-10 · Asset & logo governance (2026-07-31, converged with external blueprint ADR-009)
Character poses and outfit layering wait for **approved final source SVGs**
from the family — never approximated from screenshots or AI previews.
Outfit identifiers/catalog may exist as data before visuals do (coin-store
phase). Logo/art changes go through the repository only: receive approved
SVG → validate (viewBox present, no scripts/event handlers/foreignObject/
external refs) → test → deploy. The production app must never expose file
upload endpoints, asset-replacement APIs, hidden admin routes, client-side
admin passwords, or runtime SVG injection from user input. Revisit only if
authenticated accounts + server storage + sanitization exist (see ADR-8).
Canonical mascot spelling: **Marzi** (from Marzolo) — never "Marzy".

## ADR-9 · Blueprint adoption strategy (2026-07-30)
An external "Enterprise Blueprint" (React/Firebase monorepo) was evaluated.
Decision: **graft its ideas, do not migrate.** The shipped, in-review app
stays on its stack; we adopt incrementally: this ADR log (now),
server-validated rewards + idempotency (with the Play Billing phase),
accounts/sync (with monetization). Full rewrite rejected: months of cost,
zero user-visible value, launch freeze.

## ADR-8 · Progress lives on-device until money exists (2026-07-30)
XP, streaks, coins-to-be live in localStorage. Cheating only defrauds the
cheater until purchases exist. When Play Billing ships, rewards move to
server-validated with idempotent transactions (Blueprint pattern). Privacy
("your data never leaves your device") stays a marketing advantage.

## ADR-7 · Two-axis language model (2026-07-30)
`TARGETS` registry = language being learned (de live, en pilot; fr/es/it/pt/nl
planned). `T` object = the six help/correction languages, i18n-parity-enforced
by the test suite. The axes never mix; German prompts are byte-frozen by test.

## ADR-6 · Cartoon world, no fake mouths (2026-07-30)
Character portraits are AI-generated flat-cartoon in Marzi's visual family
(server AVATAR_STYLE). Lip-sync/mouth overlays were tried and rejected by the
family ("totally fake"); the /api/clip pipeline stays dormant behind env vars.

## ADR-5 · Marzi is the product's soul (2026-07-30)
Family-designed frog, 7 evolution stages mapped 1:1 to XP ranks, drawn as
layered inline SVG (outfits become overlays later). Marzi's artwork changes
only with family sign-off. In calls she always renders ≥ stage 5 so she is
recognisable; evolution stages show on home and in the evolution showcase.

## ADR-4 · Usage caps as a phone plan (2026-07-30)
30 free call-minutes/day client-side + server daily/IP caps (429). Framed in
the UI as a mobile tariff — thematically native to a phone-training app and
the natural seam for coins/Premium later.

## ADR-3 · Dependency-free single-file app (2026-07)
`public/index.html` is the entire frontend; `server.js` the entire backend.
No frameworks, no build step. Rationale: one-person maintainability, instant
deploys, the test suite evals the real inline script. Revisit only if the
file's size starts hurting contributor velocity.

## ADR-2 · PWA + TWA distribution (2026-07)
The web app is the product; Google Play ships a TWA wrapper (package
`de.marzolo.telefontrainer`, permanent). Content updates deploy via Render
with no store review; only launcher icon/name changes need a new .aab.

## ADR-1 · Strict-JSON AI contracts (2026-07)
Role-play, evaluation, vocab and test prompts return strict JSON; parsing
slices first `{`/`[` to last. The server proxies providers (Anthropic chat,
OpenAI voice/images) and owns all keys; the client never sees them.

## ADR-12 — Browser chrome is not removable; TWA is the packaging path

**Context.** Launched from a link or a custom tab, the app shows browser
chrome (X, URL, Share, overflow menu). Page JavaScript cannot remove it, and
attempts to fake fullscreen produce a worse, less trustworthy result.

**Decision.** Treat standalone as an *install-time* property, not a runtime
one. `manifest.webmanifest` declares `display: standalone` with
`display_override: ["standalone", "minimal-ui"]`; the app detects the mode via
`display-mode` media queries plus the `navigator.standalone` fallback, and
recommends installing **only** when running in a browser. The normal browser
experience stays fully usable — the recommendation is dismissible and its
dismissal persists. **No fake fullscreen.**

For Play Store distribution the recorded path is a **Trusted Web Activity**,
which runs the same origin without browser chrome. Documented in
`docs/PLAY_LAUNCH.md`; not built in MARZI-017.

## ADR-13 — Interface copy follows the help language; only content stays German

**Context.** Learn rendered `Lv. 1 · Neuling` beside a Spanish stage name —
three languages on one screen with no explanation.

**Decision.** Rank titles, stage names, stage descriptions and every label are
**interface copy** and follow the help language. German appears only where it
is the learning content itself: scenario titles, prompts, corrections and
spoken lines. The German rank titles remain in `RANKS` as the fallback and as
the canonical order; `rankNames()` supplies the localized display. Rank
thresholds and Marzi's six XP thresholds are unaffected and suite-frozen.

