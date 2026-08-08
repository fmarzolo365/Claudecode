# MARZI ENGINEERING OPERATING SYSTEM V3.2 — Control-Plane Record

Status: INSTALLED (activation pending fresh-session verification)
Engineering OS version: 3.2
Claude Code version at installation: 2.1.226
Frozen remediation candidate: a9af88baac16ea00eab73ba95f50fd666183862c —
**NOT Production Candidate approved.**
Canonical engineering constitution (untouched, authoritative):
`.ai/agents/MARZI_PRINCIPAL_ENGINEER.md` — stricter existing rules always win.

## Architecture

Coordinator-orchestrated role separation; no role may silently replace
another; the implementer never final-reviews its own work; a green suite is
necessary but not sufficient.

PRINCIPAL COORDINATOR → ARCHITECT (contract) → RED TEAM (red proof) →
IMPLEMENTER (green proof) → DETERMINISTIC GATES → RELEASE AUDITOR →
EXTERNAL REVIEW.

## Agents (.claude/agents/)

| agent | role | tools | mutation authority |
|---|---|---|---|
| marzi-principal-coordinator | orchestrator (default main agent) | Read, Grep, Glob, Bash(ro), Agent(4 specialists), Skill, TodoWrite | none |
| marzi-architect | read-only architecture contracts | Read, Grep, Glob, Bash(ro), Skill | none |
| marzi-test-red-team | adversarial red proofs, isolated worktree, explicit BASELINE_SHA | + Edit/Write | test/** only; no git writes |
| marzi-implementer | only product editor; red-before-green mandatory | + Edit/Write | product+tests; control plane denied; commit/push gated |
| marzi-release-auditor | diff-first independent audit | Read, Grep, Glob, Bash(ro), Skill | none |

All agents: `model: opus`; no persistent memory; only the coordinator holds
Agent delegation. Frontmatter carries only fields verified supported
(name/description/tools/model); permissionMode-plan, per-agent effort and
isolation-worktree frontmatter were NOT verifiable on 2.1.226 from within
this session, so those requirements are enforced through agent-body
contracts, coordinator delegation instructions (worktree isolation is
requested at delegation time) and hooks
(CLAUDE_CAPABILITY_UNVERIFIED: agent frontmatter permissionMode/effort/isolation).

## Skills (.claude/skills/, 10)

preflight, lifecycle-concurrency, transaction-durability,
completion-integrity, storage-schema, backup-trust-boundary, pwa-lifecycle,
adversarial-proof, evidence-integrity, release-gate. Minimal preload via
role bodies (coordinator/architect/implementer: preflight; red team:
adversarial-proof; auditor: release-gate + evidence-integrity); domain
skills are named explicitly in each delegated task. Discovery verified live
during installation.

## Hooks (.claude/hooks/) + settings

- `role-policy.mjs` — PreToolUse on Bash + Edit|Write|NotebookEdit|MultiEdit.
  agent_type-aware with the spec's untyped fallback (an absent agent_type
  never grants product authority). Absolute git safety for every role:
  force-push, hard reset, clean -f, branch -D, update-ref, commit-tree,
  --no-verify, rebase, merge, push-to-main, destructive checkout/restore →
  DENY (exit 2). Role write policy per §21/§24. Implementer `git commit`
  runs PRODUCT_PRE_COMMIT_GATE, `git push` runs PRODUCT_PRE_PUSH_GATE
  (OS branch → CONTROL_PLANE_GATE); recursion guarded by
  MARZI_GATE_RUNNING.
- `quality-gate.mjs` — canonical runner over `.claude/quality-gates.json`
  (single gate source; push-target check: no main/master, no force, clean
  committed state).
- `subagent-stop-gate.mjs` — SubagentStop evidence-completeness only
  (terminal markers), lenient on missing fields, respects stop_hook_active.
- `.claude/settings.json` — `agent: marzi-principal-coordinator`,
  `autoMemoryEnabled: false`, hook wiring. No pre-existing project settings
  were overwritten (none existed).

ENFORCEMENT LIMITS (explicit): the shell policy is pattern-based
defense-in-depth, not an OS sandbox — a determined agent could construct an
unrecognized mutation command; primary enforcement is the harness-level
per-agent tool allowlists, gates and independent review. Hook activation,
workspace trust, `agent`/`autoMemoryEnabled` acceptance and agent_type
presence in hook input on 2.1.226 CANNOT be verified from inside the
installing session (hooks/settings load at session start; `.claude/` did
not exist when this session began) → CLAUDE CODE RESTART REQUIRED; the
next-session activation test (§38) is the verification point.

## Quality gates (.claude/quality-gates.json)

CONTROL_PLANE_GATE: hook/self-test syntax, OS self-test (43 checks incl.
synthetic role tests), git diff --check.
PRODUCT_PRE_COMMIT_GATE: node --check server.js; node test/run.js;
node test/harness-selftest.js; the three static validators
(tools/validate_{store,profile,talk}_static.py — discovered, real); OS
self-test; git diff --check.
PRODUCT_PRE_PUSH_GATE: pre-commit gate + push-target check.

## Evidence protocol

Claim taxonomy: REPRODUCED / RED TEST PROVEN / FIXED / INDIRECTLY VERIFIED
/ NOT PROVEN. For P1/P2, INDIRECTLY VERIFIED ≠ FIXED unless direct proof is
technically impossible and disclosed. Sources from exact git objects;
untruncated diffs; detached final-archive hashes (never a claimed final
hash inside the archive it describes); history claims carry exact
command+output; no sibling-flow extrapolation; explicit uncertainty.

## Memory decision

Project autoMemoryEnabled: false — release-critical truth comes from
version-controlled canon + current code + current tests + task evidence.
No historical memory deleted; user/global settings untouched; no specialist
has persistent memory.

## Launch mode

Critical sessions: permission mode `default` (never bypassPermissions; do
not design around acceptEdits/auto). Default main agent via project
settings; explicit fallback: `claude --agent marzi-principal-coordinator`.

## Activation procedure (next session — §38)

Verify: active main agent = coordinator; permission mode default;
coordinator Edit/Write DENIED; project auto-memory disabled; hooks ACTIVE
(verified via the hook inspection interface, not file existence); workspace
trust ACTIVE; force-push + hard-reset synthetics BLOCKED; all four
specialists + ten skills DISCOVERABLE; OS self-test PASS. Only then may
production work begin — starting with RESIDUAL PRODUCTION INTEGRITY REVIEW
01 in bounded waves (A → B/C/D → E → F → G), each through the full role
chain; storage-schema/migration choices stop at PRODUCT_DECISION_REQUIRED.

## RESIDUAL-INTEGRITY REGISTER (frozen, unresolved — do not treat as fixed)

- **RESIDUAL-A — ASR exclusion and lifecycle**: same-session mutual
  exclusion unproven (two pending listen() permissions can both resolve →
  two recognizers, orphan recognizer, overwritten S.rec, S.listening
  divergence, incomplete cancellation, reentrancy). Future: explicit
  recognition lifecycle (idle/requesting-permission/listening/stopping) or
  ownership-token model — no design selected.
- **RESIDUAL-B — completion transaction coherence**: Prep failure can still
  show reward-looking UI (P.batch chips render from batch count);
  Guided-Dialogue repeated invocation/idempotency unproven, failure still
  plays fanfare/confetti; Weekly Test result and XP persist separately and
  repeated async handling unproven; Call Evaluation awards through a
  non-idempotent path (addXp), can duplicate on repeat, can celebrate on
  durable failure, and can outlive its originating call. One logical
  completion boundary per flow still required.
- **RESIDUAL-C — reward/idempotency architecture**: claimReward multi-key
  rollback is BEST-EFFORT, not hard-atomic; double fault can yield stats
  committed + ledger absent + rollback failed → later retry may duplicate
  reward and counters. LAST_CLAIM is shared mutable state that can leak a
  previous claim status into a later summary (no-learner-turn call returns
  without resetting it). Future candidates: one-key transaction, embedded
  ledger, recoverable journal, deterministic reconciliation. No report may
  call the current operation fully atomic.
- **RESIDUAL-D — durable-write truthfulness**: not every caller consumes
  saver results (Evaluation→Add Words, My-Words deletion, drill fix
  persistence, drill coins follow-up, Weekly Test result, addXp/addCoins/
  markDay/saveWordsList/saveFixes/saveTestResult callers, any UI mutated
  before durability known). Systemic rule required: durable action →
  explicit result → success UI only on confirmed success.
- **RESIDUAL-E — backup trust boundary**: arbitrary unknown prefixed keys
  still obtain write authority (BACKUP_UNKNOWN_KEY_WRITE); no semantic
  validation of ledger entries/list records/dates/scores; no size, key
  count, list length, string length or depth limits; cache-inclusion
  policy, exact legacy allowlist, future-format policy, rollback-failure
  and double-fault partial-restore behavior unresolved. PIN exclusion must
  be preserved. No claim that partial restore states are impossible.
- **RESIDUAL-F — service-worker event lifetime**: cache update detached
  from fetch-event lifetime (no event.waitUntil); Node-process tests do not
  prove browser worker-lifetime behavior. Future: waitUntil vs response-
  inclusive promise, termination, put-rejection, offline, delivery
  independence.
- **RESIDUAL-G — evidence discipline**: not every AUD remediation was
  independently red-proven against its original baseline (AUD-03/04/05/07/
  08 lack per-defect baseline reds); taxonomy above is now mandatory;
  history claims need exact commands; no self-referential archive hashes;
  scope of tests must match scope of implementation; comments must not
  overstate guarantees; test count is not approval.
