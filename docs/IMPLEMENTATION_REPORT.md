# Implementation Report — MARZI-001

**Task:** Evolution integrity and call companion consistency
**Date:** 2026-07-31 · **Status:** Complete, tests green, NOT merged to production (awaiting approval)

## Files modified
- `public/index.html` — evolution model + call companion
- `test/run.js` — extended stage/companion checks + DOM stub `setAttribute`
- `docs/IMPLEMENTATION_REPORT.md` — this report

## Behavior changed
1. Canonical six-stage evolution driven by XP thresholds exactly
   0 / 150 / 400 / 800 / 1500 / 2600 (`MARZI_STAGE_XP`, `marziStageForXp`).
   Invalid, non-numeric or negative XP maps safely to stage 1; exact
   threshold values map to the new stage; huge XP caps at stage 6.
2. Learner rank (`rankFor`, 7 levels, titles) is now fully separate from
   Marzi evolution — the old `stageFor(rank)` collapse was removed.
3. Call companion (`renderCallCompanion`): shows the EARNED stage, never
   forced — all `Math.max(5, …)` behavior removed (calls and guided
   dialogues). Stages 1–3 render in the compact circular badge with the
   caption "Marzi · <name> · n/6"; stages 4–6 use the normal presentation.
4. Same earned-stage source now feeds Learn hero, Profile, limit modal and
   onboarding evolution strip (previously rank-derived).

## Not modified (per task scope)
Server behavior, APIs, dependencies, assets, economy, store, navigation,
unrelated UI. `git diff` touches only the files listed above.

## Tests executed
`node --check server.js` — pass.
`node test/run.js` — **14/14 pass**, including new cases:
invalid XP (`NaN`, `"nope"`, `null`, `undefined`), negative XP, every exact
threshold, between-threshold values, large XP (999999 → 6), call-companion
rendering for all six stages via `renderCallCompanion` (asserts
`data-stage` equals the earned stage — stage 5 is not forced), plus the
full pre-existing regression suite (i18n parity, scenarios, voices,
byte-identical German prompts, economy, chart).

## Corrections round (independent review, 2026-07-31)

The reviewer's prose report never reached this environment; the corrections
below were found by re-auditing commit d5cd822 against the five finding
categories named in the correction order (data integrity, accessibility,
regression coverage, scope control, maintainability). Every item is a
verified defect, not an interpretation.

**Critical — data integrity**
- `S.callId` was never reset per call, so after the first call every later
  call hit the reward ledger's duplicate guard: `recordCall()` returned 0 —
  no XP, no coins, no days/calls/seconds recorded. Fixed:
  `startConversation()` now assigns a fresh `newRewardId()` per call.

**High**
- Mic button state regression: the JS still toggled the removed `.live`
  class and never set `data-status`, so the button showed no listening /
  processing feedback at all. Fixed: new `micStatusFor(S)` helper drives
  `data-status` (`processing` wins over `listening`, else `ready`).
- `MARZI_KEY` still pointed at the legacy `telefontrainer.marzi` key after
  the storage migration, so evolution-celebration state diverged from the
  migrated copy. Fixed: `MARZI_KEY = "marzi.stage.v1"`.

**Medium — accessibility**
- `#callStatusLive` (aria-live) existed but was never written. It now
  announces listening/ready via the existing i18n strings (no new keys).
- Learn-hero Marzi: click handlers sat on inner spans while the wrapping
  `<button id="marziBtn">` had none — keyboard activation and padding
  clicks did nothing, and labeling was title-only. Fixed: single handler +
  `aria-label` (stage name + evolution title) on the button itself.
- `renderCallCompanion` now sets `role="img"` so its aria-label is
  announced.
- `sw.js` CACHE bumped v19 → v20 (app shell changed; offline copies of the
  broken shell must be invalidated).

**Scope control (disclosed, not reverted)**
- Commit d5cd822 also carried inherited work beyond MARZI-001's letter
  (brand meta/title, localStorage migration, reward ledger,
  `normalizeStats`, Learn/Store/Profile markup) from an interrupted earlier
  task. Reverting it would break shipped markup; instead the corrections
  above make that inherited code correct and fully wired, and this section
  records the scope excess explicitly.

**Regression coverage added** (suite now 15/15)
- Ledger idempotency (same reward id pays exactly once).
- Two-call recording: re-finalizing the same call pays 0; a fresh call id
  records again; `startConversation` source-checked for the id reset.
- `normalizeStats` hardening (negative/NaN/wrong-shaped fields → safe).
- Migration mapping (stats key, vocab prefix, stage key end-to-end copy);
  `MARZI_KEY` asserted to be the migrated name.
- `micStatusFor` state matrix (busy > listening > ready).
- Test stub gained `localStorage.key()/length` and keeps
  `setAttribute`/`getAttribute`.

## Known risks
- Users mid-progress may see Marzi change stage once (rank-based → XP-based
  mapping differs slightly around old ranks 5–6). One-time, cosmetic.
- The family previously requested an always-recognisable Marzi in calls;
  the circular badge + caption is the agreed compromise pending their
  on-device review.
