# MARZI-021-R2 — FINAL INDEPENDENT READ-ONLY REVIEW

## ABSOLUTE ZERO-INTERRUPTION AND SINGLE-INSPECTION POLICY

Complete this independent review with ZERO avoidable interruptions.

Permission-dialog target: ZERO.
Maximum acceptable host approval budget: ONE approval for one bounded read-only shell operation, only if the host requires it.

Do not issue multiple shell commands through separate tool calls.
Do not request separate approvals for git show, git diff, git log, git rev-list, git cat-file, test commands, checksum commands, or file reads.
Do not use /review.
Do not provide intermediate progress updates.
Do not ask routine questions.

Do not modify, create, delete, rename, stage, commit, push, merge, rebase, squash, reset, clean, tag, deploy, or open a pull request.
Do not modify the working tree.
Do not write temporary files inside the repository.
Do not use external network access except a single fetch only when the exact commits are genuinely unavailable locally.
Do not use tool-enabled subagents.

Subagents may reason only from evidence already collected by the principal reviewer and may not execute shell, Git, filesystem, network, or test operations.

### Single bounded inspection operation

Collect all required repository evidence through ONE bounded read-only shell invocation.

That invocation may contain multiple read-only commands internally, but it must be submitted as one operation rather than separate tool calls.

Prefer one structure equivalent to:

bash -lc 'set -euo pipefail; ...all bounded read-only checks...'

The one operation may use only bounded read-only commands such as:

- git status --porcelain
- git rev-parse
- git merge-base --is-ancestor
- git diff
- git show
- git log
- git ls-tree
- git cat-file
- git grep
- sha256sum
- wc -c
- node --check
- explicitly identified repository test scripts

Do not use filesystem-wide find, searches outside the repository, git clean, git reset, git checkout of files, git switch, git commit, git push, rm, mv, cp, sed -i, tee, redirection into files, package installation, dependency installation, or deployment commands.

Before running a test, determine from source inspection whether it writes repository files. Run only tests proven to be repository-read-only.

When a desired test cannot be proven read-only, inspect its implementation and existing deterministic evidence instead. State the limitation in the report; do not request another approval.

After the single inspection operation, perform all reconciliation and final reporting in memory.

Do not execute another command unless the exact target commits were absent from the local repository. In that exceptional case, one fetch may replace the inspection attempt, but do not start a chain of repeated approvals.

## ROLE

Act as the independent Principal Technical Reviewer for MARZI-021-R2.

This is not an implementation task.

Do not trust the Claude Code implementation report merely because its tests passed.

Independently verify its material claims against the exact commits and authoritative mandate.

## EXACT TARGET

Development branch:

claude/marzi-017-product-refinement

R2 baseline:

23f217924f4bd795eee94adc7c519326f45e1fa9

R2 mandate-transfer commit:

1531c310e5efb1a6a6980bc351fe3bf8c195d52d

Exact R2 correction commit:

f20f805dc01cd8ff68f4862266b21bd5bf50dbc4

Protected main reference:

7395cd0a75fc206077e19ecc60e4c1e978dd2c89

Authoritative mandate:

MARZI-021-R2_CLAUDE_CODE_MANDATE.md

Expected mandate size:

42955 bytes

Expected mandate SHA-256:

55c3adb06c18a1ae67b8ec4ea1f567bd9d175d138ad3256180d32914ef27ae89

Use two distinct comparisons:

1. Correction implementation diff:
1531c310e5efb1a6a6980bc351fe3bf8c195d52d..f20f805dc01cd8ff68f4862266b21bd5bf50dbc4

2. Complete R2 lineage and package impact:
23f217924f4bd795eee94adc7c519326f45e1fa9..f20f805dc01cd8ff68f4862266b21bd5bf50dbc4

Treat the mandate file introduced by 1531c31 as a transfer artifact, not as part of the correction implementation diff.

Do not review an unspecified working tree.

## TARGET VERIFICATION

Verify all three R2 commits exist; 1531c31 is a descendant of 23f2179; f20f805 is the direct child or correct isolated successor of 1531c31; the correction commit contains no merge; the mandate exists at 1531c31 with exact size 42955 and exact SHA-256; the development branch tip equals f20f805 when measurable; the working tree is clean when measurable; main remains at 7395cd0a75fc206077e19ecc60e4c1e978dd2c89; no correction-owned file changed outside allowed scope; and the mandate-transfer file was not rewritten by the correction commit.

Return BLOCKED only when the exact target cannot be accessed or verified.

## MANDATORY R2 CORRECTION REVIEW

### R2-C001 — False specialist-approval claims

Verify that no correction-owned canonical document, status table, report, fixture, validator expectation, or example states or implies that learning-specialist approval occurred.

Required truthful state:

- learning-specialist review: PENDING
- named specialist: NONE
- specialist sign-off: NOT PERFORMED

Confirm that legitimate statements such as “specialist sign-off remains mandatory” are not incorrectly rejected.

Verify that the status-claim scan is bounded, deterministic, and meaningfully tests prohibited claims rather than only one exact formatting variant.

### R2-C002 — Canonical status validation

Verify every required status dimension appears exactly once; duplicate, unknown, and missing dimensions are rejected; exact values are enforced; row order cannot silently overwrite prior values; independent technical approval is not self-granted; runtime, production, deployment, and release remain unauthorized or unperformed; and Named learning specialist | NONE is enforced correctly.

### R2-C003 — Completion-rule binding

Verify one canonical COMPLETION_RULES representation supplies rule order, result, condition, and executable predicate; executable derivation does not maintain a second independent expected-result table; condition-only mutations are detected; contract projection and executable derivation agree mechanically; the full five-state model remains deterministic; partial, not_complete, and insufficient_evidence do not overlap; optional criteria cannot gate completion; accommodations cannot alter completion; absence is not silently converted into failure; invalid combinations fail rather than default; and no threshold, score, percentage, weighting, or aggregate learner result was invented.

### R2-C004 — External-review claims

Verify the package claims only structural validation of review records and does not claim identity verification, authenticity verification, authorization-chain verification, cryptographic provenance, or external organizational verification. Check unsupported or fabricated structural records fail deterministically within the stated bounded guarantee.

### R2-C005 — Bounded no-write assurance

Verify the documented guarantee matches the implemented check; it is a scoped self-check, not OS-level confinement; MUST_GUARD cannot shrink automatically when a guard is deleted; incidental ENOENT does not count as proof of safe guarding; permission-mode-only changes are detected when claimed; promises, FileHandle, link, and metadata routes are handled exactly as documented; and no universal “cannot write anything” claim remains.

### R2-C006 — Supersession claims

Verify the package truthfully states the current v1 guarantee: supersedes is null for all 94 variants. It must not falsely claim full referential integrity, target existence, cycle detection, semantic compatibility, or complete version-graph integrity.

### R2-C007 — Fixture documentation

Verify fixture documentation matches actual behavior and deterministic reason isolation. No fixture may pass because its assertion was weakened.

### R2-C008 — Dynamic-execution detection

Verify documentation and implementation describe a bounded source scan and acknowledge non-guarantees such as indirect eval, computed global access, reflective construction, dynamic import, and native or external execution. Confirm no universal prevention claim remains.

### R2-C009 — Implementation provenance

Verify the implementation report and package identify the correct baseline and correction commit; no artifact claims independent approval; transfer and correction commits remain distinguishable; and provenance statements are internally consistent.

## VALIDATOR, TEST, AND MUTATION REVIEW

Independently verify the material evidence behind:

- 36/36 learning-contract checks
- 50/50 application regression tests
- 12 positive fixtures
- 45 negative fixtures
- 35 distinct reason codes
- 12 meaningful mutations

Inspect especially specialist approval bypass, completion condition drift, independent guard-policy inventory, incidental ENOENT, permission-mode-only modification, and bounded dynamic-execution detection.

Determine whether each mutation genuinely proves its stated invariant. Do not accept a mutation merely because an unrelated check failed.

## INVENTORY AND OPEN-GATE REVIEW

Verify exact preservation of:

- 29 scenarios
- 94 variants
- 19 German scenarios
- 61 German variants
- 10 English scenarios
- 33 English variants
- 564 localized titles
- 282 required criteria
- 94 optional criteria
- 18 prerequisite edges
- acyclic prerequisite graph
- 94 of 94 supersedes values null
- 179 release-mode open-gate/unreviewed findings
- all four educational gates null

Verify no new threshold, percentage, weight, score, review interval, placement content, competency content, certification claim, or aggregate learner property.

## DOCUMENTATION-VALIDATOR EXCEPTION

Independently determine whether the nine .ai/bin/docs-validate failures predate R2, are unchanged relative to 23f2179, are byte-identical in deterministic failure representation, were not introduced or expanded by f20f805, remain outside authorized R2 scope, and are coherently assigned to MARZI-GOV-001.

If R2 introduced or altered any failure, report a finding.

Do not approve the exception solely because Claude Code described it as pre-existing.

## SCOPE AND REGRESSION

Verify the reported eight correction-owned modified files.

Confirm no correction diff to public/index.html, server.js, sw.js, manifest.webmanifest, package.json, runtime JavaScript, providers, prompts, ConversationSession, transcript behavior, storage, learner data, XP, coins, rewards, streaks, economy, timers, Marzi evolution, outfits, store, profile, navigation, Android back behavior, dependencies, lockfiles, deployment configuration, .github/, or main.

Confirm runtime, dependency, configuration, and deployment diffs are empty.

Confirm the Arabic 320×568 / 200%-text issue remains deferred.

## FINDINGS AND APPROVAL RULE

Classify findings as BLOCKER, HIGH, MEDIUM, LOW, or INFORMATIONAL.

For each non-informational finding include:

- review finding ID
- related R2 correction ID
- exact file and location
- observed defect
- violated invariant
- reproducible evidence
- required correction
- whether Product Owner or specialist input is required

Return APPROVED FOR SPECIALIST REVIEW only when R2-C001 through R2-C009 are genuinely resolved; no BLOCKER or HIGH technical finding remains; no false specialist approval claim remains; completion semantics are coherent and mechanically bound; every status dimension is exact and unique; bounded guarantees match actual enforcement; tests and mutations provide meaningful evidence; accepted inventories remain exact; external gates remain pending; no educational policy was invented; runtime, dependency, configuration, and deployment diffs are empty; the nine documentation-validator failures are proven pre-existing and unchanged; and Git lineage and rollback are coherent.

Return CHANGES REQUIRED when the target is reviewable but a blocking or approval-relevant defect remains.

Return BLOCKED only when the exact review target or required evidence cannot be accessed.

## FINAL OUTPUT

Produce one final report containing:

1. Exact target verification.
2. Executive conclusion.
3. Findings ordered by severity.
4. R2-C001 through R2-C009 disposition matrix.
5. Completion-rule review.
6. Canonical-status and specialist-claim review.
7. Bounded-guarantee review.
8. Validator, fixture, and mutation review.
9. Inventory and open-gate review.
10. Documentation-validator exception review.
11. Scope and regression audit.
12. Git integrity and rollback.
13. Remaining external reviews.
14. Final approval rationale.

Do not modify the repository.

Do not provide implementation instructions unless changes are required.

End with exactly one line:

APPROVED FOR SPECIALIST REVIEW

or

CHANGES REQUIRED

or

BLOCKED
