# HARDENING-02 — Data Integrity · Recovery · Upgrade · Offline · Test Trust

Baseline: 52c14ecf5f2763d358ac17fe91da58e44e3079b6
Branch: claude/marzi-production-hardening-02
Scope: reliability/state-safety only — no product values, thresholds,
visuals or features changed.

## Baseline trust check

All HARDENING-01 protections verified present in the baseline as code
(engine late-failure drop, UI/ASR/TTS session guards, backupSnapshot /
applyBackup with rollback, trimmed migration map, DOM-safety regression,
stub classList.contains, HARDENING_01.md). No collateral changes found.

## Persistence map (key → class → owner)

- marzi.settings.v1 — USER_SETTING — loadSettings/saveSettings (per-field
  whitelist validation; junk enums fall back without poisoning siblings)
- marzi.stats.v1 — USER_VALUE — loadStats/normalizeStats (single wallet+
  wardrobe write via commitStats; corrupt shapes normalize, suite-proven)
- marzi.reward-ledger.v1 — USER_VALUE — claimReward/loadRewardLedger
  (idempotent, atomic with stats, malformed → {} and re-claimable)
- marzi.celebrated-stage.v1 / marzi.stage.v1 — DERIVED_CACHE (celebration
  markers; stage AUTHORITY is always marziStageForXp(xp) — a stale stage
  key can only affect the celebration animation, never progression,
  unlocks or artwork)
- telefontrainer.fixes / .words / .tests — USER_VALUE — loadStoredList
  boundary (HARDENING-02): non-array payloads and non-object entries
  degrade to empty, isolating one broken key from unrelated screens
- telefontrainer.pin — SESSION_SUPPORT; telefontrainer.wish —
  USER_VALUE (write-only by design: recorded language wish, product
  promise "we will notify you"; classified LEGACY_PRESERVE, do not drop)
- telefontrainer.vocab.* — DERIVED_CACHE (rebuildable; validated
  Array.isArray on read)

## Fixed (evidence-backed)

- HARD02-01 (P1) Malformed learning lists crashed screens: loadFixes /
  loadWords / loadTests returned any truthy JSON (`{}`, `5`) and
  consumers used array methods / read entry fields unguarded — one bad
  aux key (possible via hand-edited or truncated backup) took Practice /
  Profile / mistakes down. Fix: `loadStoredList` authoritative boundary
  (array + object-entry filter). Suite: malformed payload matrix +
  consumer survival + sibling-family isolation.
- HARD02-02 (P1) Suite false-green: `node test/run.js` could exit 0 with
  NO output if an async check hung (event loop drains before the
  summary), and escaped async failures crashed the run half-finished —
  CI's only gate is the exit code. Fix: registered-vs-executed counting,
  unhandledRejection/uncaughtException → counted failures + exitCode 1,
  exit-guard refusing green without a printed summary, summary shows
  "(N/N executed)". `test/harness-selftest.js` proves all four escape
  classes fail (sync throw, async reject, escaped rejection, hung
  check) and is wired into CI.
- HARD02-03 (P2) Drill/vocab completion rewards were paid inside the
  terminal-state RENDER (economy mutation as render side effect; any
  re-render of the done card paid again — red-proven: 145 XP after two
  re-renders). Fix: completion-transition guards `D.rewarded` /
  `V.rewarded`, mirroring prep's existing `P.awarded` convention. Fresh
  sessions still pay (repeatable practice rewards unchanged).
- HARD02-04 (P2) Durable-value writes (saveFix, saveFixes,
  saveWordsList, saveTestResult, recordCall counters, addXp, addCoins)
  swallowed persistence failure silently while the UI claimed success.
  Fix: route failures through the established notifyStorageFailure()
  channel (same convention as saveSettings).

## Verified sound (no change needed)

- Fresh install: pure boot writes ZERO keys; first-run START writes
  exactly marzi.settings.v1 (explicit save) + marzi.stage.v1 (the Home
  hero celebration cache whose SEMANTIC is "last stage rendered" —
  the render-time write is that feature's documented design and is
  value-idempotent). All tabs, Store defaults, Profile (no fabricated
  identity, no undefined/NaN) verified in-browser.
- Legacy upgrade (telefontrainer.settings/stats/marzi + fixes/words):
  migration copies exactly settings/stats/stage, no orphan keys, XP/
  coins/wardrobe/speed/level preserved, legacy keys left untouched,
  Profile reads the migrated XP correctly.
- Corruption isolation matrix (5 fixtures in-browser): fixes-as-object,
  stats-as-array, junk setting enums beside valid sound=false,
  equipped-not-owned, corrupt ledger — all boot, render Practice +
  Profile, and never poison sibling families.
- Reward ledger: single caller namespace ("call:" + UUID per call), no
  cross-activity collision (other flows use the documented
  ledger-bypassing addXp/addCoins primitives); malformed ledger reads as
  {} and never permanently blocks claims; ledger restores via backup.
- Stats: recordCall counters gated by the idempotent claim (double
  endCall cannot double-count); markDay is boolean-idempotent; dialogue
  and prep awards fire in one-shot transitions; call-eval +25 and test
  +15 fire once per async completion.
- Cross-screen consistency: coins render identically in topbar, Store
  and Profile from one loadStats source (browser-verified 640/640/640);
  stage derives only from marziStageForXp (11 call sites, no independent
  formula); rank only from rankFor. Home hero XP (rank window) vs
  Profile XP (stage window) are INTENTIONALLY different derivations.
- Language switching (es→ar→en→ar→es via the real onboarding path):
  dir/lang attributes, persisted locale, no overflow, single-fire nav
  afterwards. RTL verified live.
- Backup: semantic round-trip suite test (settings/stats/wardrobe/words/
  fixes/ledger restored to exact values after wipe); invalid candidates
  leave storage byte-identical; mid-apply failure rolls back
  (HARDENING-01 test still green). Vocab caches are backup-INCLUDED
  (telefontrainer.vocab.*) and rebuildable regardless.
- Stress: 10× five-tab cycles, 5× Profile→Store, 3× Talk drawer
  open/close — semantic state signature byte-identical after, no
  runtime errors, single navigation firing.
- Offline/PWA: SW installs, exactly one cache (telefontrainer-v51),
  "/" precached; offline reload boots the shell, Store/Profile render
  from local state. CACHE bumped v51 because the precached "/" shell
  changed (project convention).

## Debt / observations (unchanged)

- OBS-BUYPACK-DOUBLE-TAP — untouched, awaiting product ruling (per
  sprint instruction).
- HARD02-OBS-RECORDCALL-SPLIT-WRITE — claimReward commits reward, then
  recordCall writes counters in a second setItem; a quota failure
  between them leaves reward-without-counters and the ledger prevents a
  retry. Now surfaced via notifyStorageFailure; merging the writes
  means restructuring claimReward's contract — recommended for a future
  reward-architecture milestone. Owner: recordCall()/claimReward().
- Existing registry unchanged (plan-UI dark sheet, stage-3 vector,
  Store stage-art, outfit art, Talk legacy setup, hero-art slots,
  saveWordTap late render).
- I CANNOT CONFIRM: installed-PWA update behavior on a physical device
  (static + Playwright-observable checks only).
