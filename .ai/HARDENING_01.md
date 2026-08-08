# HARDENING-01 — Production Hardening Sprint 01

Baseline: f6f64d778633dc78262052251a80794fd9063b01
Branch: claude/marzi-production-hardening-01
Scope: reliability/state-safety only — no product behavior, visuals,
economy values, thresholds or features changed.

## Architecture ownership (discovered / confirmed)

- Conversation: `createConversationSession` owns call state + canonical
  transcript; UI mirrors it in `S.turns`. Session identity for async
  continuations = the captured session object vs `S.session`.
- Economy: `commitStats` is the single wallet/wardrobe write;
  `purchaseOutfit`/`equipOutfit`/`unequipOutfit` are idempotent by
  re-checking committed state. Rewards: `claimReward` idempotent via
  `marzi.reward-ledger.v1` + per-call `S.callId`.
- Persistence families: `telefontrainer.*` (fixes, words, tests, pin,
  wish, vocab caches via VOCAB_NS) and `marzi.*` (settings, stats,
  reward-ledger, celebrated-stage, stage). Backup = `backupSnapshot()` /
  `applyBackup()` (authoritative pair, both families).
- Global listeners (hashchange, popstate, online/offline, keydown,
  click-delegate, sheet touch) are wired once at boot; per-render wiring
  uses `.onclick` assignment — no accumulation path found.
- Timers: call timer `S.timerId` (cleared in endCall + on start), SFX
  ring interval (ringStop), crossfade `CALL_XFADE_TIMER` (cleared before
  reuse), guarded avatar-retry timeouts.

## Fixed (evidence-backed)

- HARD-01 (P1) Backup omitted all `marzi.*` user data (XP, coins,
  wardrobe, settings, reward ledger): export filter predated the brand
  keys. Now `backupSnapshot()` covers both families; old backup files
  stay restorable.
- HARD-02 (P1) Restore could partially mutate storage (per-entry apply,
  quota failure mid-loop) and reported success for useless payloads.
  `applyBackup()` validates the complete candidate first, applies
  all-or-nothing with snapshot rollback, ignores foreign keys.
- HARD-03 (P1) A stale AI-request FAILURE from an ended/replaced call
  propagated into the newer call's UI (error banner, busy flag,
  re-render). Engine now drops late failures like late replies; the UI
  `ask()` guards every continuation (incl. the TTS `done`→`listen`
  chain) with session identity.
- HARD-04 (P2) ASR callbacks bound to `S.session` at fire time: a late
  result could inject text into, or clear listening state of, a newer
  call. `listen()` now captures the owning session; stale events are
  no-ops.
- HARD-05 (P2) `STORAGE_MIGRATIONS` minted unread `marzi.*.v1` copies
  (fixes/words/tests/pin/wish/vocab): orphaned quota and a stale-copy
  data-loss trap for any future rename (the exists-guard would keep the
  stale copy). Map trimmed to the names the app reads
  (settings/stats/stage); suite asserts migration creates no unread keys.
- HARD-06 (P2, test infrastructure) The suite's DOM stub lacked
  `classList.contains`, crashing the process mid-run and silently
  skipping the async checks (MARZI-004, MARZI-006 never executed).
  Fixed; the suite now completes with its summary line.

## Verified sound (no change needed)

Purchase/equip idempotency incl. double-invocation; reward ledger
idempotency; transcript/hint/word rendering escapes AI text (regression
test added); tap-word attributes escaped; global listener wiring;
timer ownership; sw.js coherent (audit-only; CACHE bumped v50 because
the precached "/" shell changed — project convention).

## Observations / debt (not changed)

- OBS-BUYPACK-DOUBLE-TAP: `buyPack` (minute packs) is atomic per call
  but two rapid taps buy two packs. Packs are legitimately repeatable
  purchases, so distinguishing intent is a PRODUCT decision. Owner:
  `buyPack()`. Future: product ruling, then guard if desired.
- OBS-SAVEWORD-LATE-RENDER: `saveWordTap`'s continuation re-renders the
  (hidden) call screen after a call ends; the word save itself is
  intended user data. Harmless; owner `saveWordTap()`.
- Existing debt registry unchanged: PROFILE_EXTERNAL_PLAN_UI_DEBT,
  PROFILE_STAGE_3_CANONICAL_VECTOR_INCORRECT, GLOBAL_STAGE_ART_DEBT_STORE,
  STORE_OUTFIT_ART_MISSING, TALK_LEGACY_SETUP_VISUAL_STATUS,
  HOME/STORE Marzi hero TEMPORARY_ACCEPTED slots.

## Regression coverage added

`HARDENING-01 conversation` (engine drops late failures + UI stale-guard,
red-proven against unguarded code), `HARDENING-01 backup` (family
coverage, invalid-candidate immutability, foreign-key rejection,
mid-apply rollback), `HARDENING-01 DOM safety` (hostile AI text renders
as text), migration no-unread-keys assertions in MARZI-001.
