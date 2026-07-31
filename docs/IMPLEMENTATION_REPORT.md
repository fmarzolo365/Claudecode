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

## Known risks
- Users mid-progress may see Marzi change stage once (rank-based → XP-based
  mapping differs slightly around old ranks 5–6). One-time, cosmetic.
- The family previously requested an always-recognisable Marzi in calls;
  the circular badge + caption is the agreed compromise pending their
  on-device review.
