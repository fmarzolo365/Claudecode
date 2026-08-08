# AUDIT-FIXES-01 — Independent Audit Remediation

Baseline: 152b8ec3086b1caa31bc57652f94f0bf4a1a0563 (audited candidate)
Branch: claude/marzi-production-audit-fixes-01
Scope: externally reproduced defects only; no product values, rewards,
thresholds, artwork or UI redesigned.

## Fixed

- AUD-01 (P1) ASR lifecycle. Root causes: (a) endCall relied on the
  session-bound onEnd to clear listening state, but that callback rightly
  ignores events for an ended call; (b) listen() captured the owning
  session only AFTER awaiting getUserMedia, so a pending permission
  dialog resolved into a newer call. Fix: `stopRecognition()` is the one
  synchronous owner of mic teardown (called by endCall and
  startConversation); listen() captures the session before its first
  async boundary and every continuation — permission grant, permission
  denial, provider start, callbacks — is a no-op once stale. Direct
  suite coverage: AUDIT-01 (endCall clears listening/recognizer; stale
  grant cannot start recognition in call B; stale denial stays silent;
  stale onResult/onError/onEnd cannot mutate a newer call). Closes the
  HARD-04 coverage gap with controlled getUserMedia/provider stubs.
- AUD-02 (P1) Backup schema validation. `applyBackup` now validates each
  known family against its actual container contract (object keys:
  settings/stats/ledger incl. legacy; array keys: fixes/words/tests/
  vocab; numeric strings: stage/celebrated/legacy stage; plain text:
  wish + unknown future keys) BEFORE any write. A candidate carrying
  "NOT-JSON" as stats is rejected with zero storage mutation. Suite:
  AUDIT-02 (11 malformed candidates leave storage byte-identical;
  partial legacy objects still restore).
- AUD-03 (P2) Record contracts. loadFixes/loadWords/loadTests now apply
  minimum-safe per-family record predicates derived from real consumers
  (fix: text+fix strings for exportAnki/renderMistakes; word: de+tr
  strings; test: date string + finite score). Malformed entries drop
  individually; valid siblings survive. Suite: AUDIT-03 (exportAnki no
  longer throws on `[{}]`; chart/test-history consumers survive).
- AUD-04 (P1/P2) Durable-write truthfulness. buyPack commits through the
  authoritative commitStats and, on failure, keeps the old balance,
  shows save-failed, and never plays success feedback. markDay returns
  its commit result and notifies. saveFix/saveFixes/saveWordsList/
  saveTestResult return explicit success; saveWordTap only stars a word
  that truly persisted. Suite: AUDIT-04.
- AUD-05 (P2) Completion coherence. New `applyStatsMutation` gives one
  logical completion exactly ONE stats commit. Drill (xp+drillDay),
  vocab (xp+coins+vocabDay), prep batches and guided dialogue all use
  it; the once-only guard is set only on authoritative success; a failed
  commit renders an honest save-failed chip and a later re-render
  retries, paying exactly once. Suite: AUDIT-05 (forced failure: no XP,
  honest card; recovery: pays once; vocab: exactly one STAT_KEY write).
- AUD-06 (P2) recordCall atomicity. claimReward accepts a `mutateStats`
  hook so call counters (calls/seconds/days/secDays/scenariosDone)
  commit in the SAME snapshot as xp/coins/ledger — together or rolled
  back together; a failed transaction leaves the ledger unclaimed so a
  retry repairs everything. Reward-without-counters states are
  structurally impossible. Suite: AUDIT-06 (failed ledger write commits
  nothing; retry commits everything coherently; duplicates still pay 0).
  Retires HARD02-OBS-RECORDCALL-SPLIT-WRITE.
- AUD-07 (P2) Service-worker cache poisoning. The fetch handler caches
  only complete `ok && status === 200` responses; 404/500/206 are
  delivered but can no longer overwrite a good cached copy (incl. "/");
  cache-write failure never breaks delivery; /api/ untouched; offline
  fallback preserved. CACHE bumped v52 (sw behavior changed). Suite:
  AUDIT-07 executes the real sw.js fetch handler under a mocked SW
  environment (poisoning, partials, /api/ bypass, fragile cache write,
  offline fallback).
- AUD-08 (SEC) Backup PIN exclusion. telefontrainer.pin is excluded from
  backupSnapshot AND ignored by applyBackup, so new exports never carry
  the access credential and old backup files can no longer overwrite the
  currently entered PIN. Suite: AUDIT-08.

## Test contract changes (documented per policy)

- MARZI-015 / HARDENING-02 fixture fixes gained the `fix` field: the
  AUD-03 record contract requires text+fix strings, which every real
  writer has always produced; the old fixtures were unrealistic.
- HARDENING-01 rollback case now uses schema-valid payloads with a
  forced write failure, because AUD-02 rejects non-JSON candidates
  before the write phase (the rollback path still has direct coverage).

## Red proofs

Reverting the guards in a scratch tree reproduces the audited
signatures exactly: "endCall left listening=true" (AUD-01),
"NOT-JSON accepted" (AUD-02), "retry incoherent: [17,20,0,0]" (AUD-06),
plus the earlier reward/conversation red-proofs.

## Unchanged debt

OBS-BUYPACK-DOUBLE-TAP (product ruling pending — only transaction
truthfulness fixed here), static validators outside CI, uncommitted
browser harness, installed-PWA physical update testing, Stage-3 vector,
Plan dark UI, hero-art slots, Talk legacy setup.
