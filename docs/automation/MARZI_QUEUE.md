# Marzi Automation Queue — MARZI-009 … MARZI-012

Sequential execution queue. **One package at a time · one commit per package ·
full suite after every package · stop immediately on any failure or
ambiguity · never merge to main · never deploy.**

Machine-readable state: `docs/automation/queue-state.json`.
On resume, continue from the first package whose status is not `done`.

## Selection rationale
These four are the remaining items from the board-reconciliation audit and the
project's own known-debt lists that (a) need **no new artwork**, (b) touch none
of the standing exclusions (Premium, internet/MB economy, new backend, new
characters, production art, logo), and (c) are verifiable by the existing test
harness.

Standing exclusions for every package below: XP rates, coin rates, the six XP
thresholds, ConversationSession, AI/STT/TTS providers, the German system
prompt, backend APIs, store purchase logic, reward ledger semantics.

---

## MARZI-009 — Plan-limit experience (deviation H6)
**Goal.** Rebuild the daily-limit moment to the board (`02_call.png`, panels 2
and 3): a full-screen dark modal with Marzi, the localized "time is up"
message, remaining-time detail, and one clear action — replacing the current
light card.

**Implement**
- Full-screen limit modal composed from `UI.modal` + `UI.marziAvatar`
  (`sad` mood) + `UI.buttonPrimary`; dark surface per board.
- Plan status detail: minutes used / daily limit and the reset countdown,
  from the **existing** plan math only.
- Secondary route to the Store (existing minute packs), no new economy.
- Keyboard dismissal, `aria-live` announcement, ≥48px controls,
  reduced-motion safe.

**Do not** change `PLAN_SECONDS`, `COIN_PACKS`, prices, `buyPack`, or any
earning rule. No internet/MB framing.

**Acceptance**
- Limit modal renders dark, full-screen, dismissible by button and Escape.
- Countdown and used/limit values come from existing helpers.
- 390×844 and 360×640: no scroll, zero targets < 48px.
- Suite green with new checks for the limit state and dismissal.

---

## MARZI-010 — Right-to-left and accessibility sweep
**Goal.** Arabic is a shipped help language but the document never switches
direction. Make RTL correct, and close the remaining a11y gaps found by an
automated sweep.

**Implement**
- Set `dir="rtl"` / `lang` on the document when the help language is Arabic,
  and restore on change; logical-property fixes where physical ones break RTL.
- Automated sweep across every screen: missing `aria-label` on icon-only
  controls, focus visibility, and the 48px floor.
- Fix what the sweep finds (presentation/attributes only).

**Do not** change copy, translations, layout semantics for LTR languages, or
any business logic.

**Acceptance**
- Arabic sets `dir="rtl"`; switching back restores `ltr`.
- Sweep reports zero icon-only controls without labels and zero targets
  < 48px on Learn, Talk, Store, Profile, Call and Done.
- LTR screenshots unchanged (pixel comparison).

---

## MARZI-011 — Offline and storage resilience
**Goal.** Make failure states honest and recoverable: no network, no
speech-recognition support, and full storage.

**Implement**
- Offline detection: a persistent, dismissible banner using `UI.errorState`
  semantics; calls refuse to start with a clear recovery path instead of a
  generic failure.
- `/api/chat` failure inside a call already alerts — make the message
  distinguish offline from server error, keeping every existing alert.
- Storage-quota handling: a single user-visible explanation when a write
  fails (reusing the MARZI-008 `saveFailed` string), never silent.
- Service-worker offline shell verified for the app shell only (no API
  caching, unchanged policy).

**Do not** add background sync, new endpoints, retries against the provider,
or any change to prompts or providers.

**Acceptance**
- Offline: starting a call shows the recovery path, not a silent failure.
- Storage failure surfaces the existing localized message.
- Suite green with checks for offline gating and quota messaging.

---

## MARZI-012 — Quality gates and consolidation
**Goal.** Lock in what the previous packages established and leave the branch
reviewable.

**Implement**
- CI: run `node --check server.js` and the full suite on push (extend the
  existing workflow if needed).
- Repository guards in the suite: no `console.log` left in the shipped script,
  no `debugger`, no `TODO`/`FIXME` markers in `public/index.html`, i18n parity
  (already enforced) and design-token purity (already enforced) restated in
  one "release gates" check.
- Consolidate documentation: a single index of ADRs, design system, asset spec
  and implementation reports.
- Produce the consolidated Codex report.

**Do not** reformat the codebase, introduce a build step, add dependencies, or
change any runtime behaviour.

**Acceptance**
- CI workflow runs both commands.
- Release-gates check passes and fails loudly when violated.
- Consolidated report written for Codex.
