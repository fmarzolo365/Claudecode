# MARZI-021-R1 — DEFINITIVE CORRECTION MANDATE

## 1. Role and mission

You are Claude Code, the senior implementation engineer responsible for the bounded MARZI-021-R1 correction sprint.

Correct the static MARZI-021 learning-contract implementation introduced by:

4ec0123198ba830320fdca7e20b25b53c84bb0d1

Governance baseline:

0798cd894865b57d67cff6e824f3264ccf673bc0

Development branch:

claude/marzi-017-product-refinement

Your mission is to make the corrected implementation eligible for a new independent Codex verdict of:

APPROVED FOR SPECIALIST REVIEW

Implement the approved correction architecture. Do not redesign it, reinterpret Product Owner decisions, introduce educational policy, or implement runtime integration.

Continue through synchronization, correction, validation, one isolated commit, one final normal push, synchronization verification, and the final report.

Do not stop after planning.

## 2. Zero-interruption implementation protocol

Minimize host approval dialogs aggressively:

1. Plan once.
2. Inspect correction-owned files once.
3. Batch related reads.
4. Reuse all inspection output.
5. Batch edits into coherent groups.
6. Batch validations.
7. Avoid repeated raw commands and changing command prefixes.
8. Prefer stable `.ai/bin/*` wrappers where applicable.
9. Use `.ai/bin/repo-inspect` once and reuse its result.
10. Use `.ai/bin/commit-inspect` for commit verification.
11. Use `.ai/bin/file-inspect` for repeated file metadata or content inspection.
12. Use `.ai/bin/docs-validate` once in the final validation batch.
13. Avoid intermediate pushes.
14. Avoid intermediate commits unless an actual recovery need makes one unavoidable.
15. Do not issue intermediate progress reports.
16. Ask no routine Product Owner questions.
17. Confirm existing canonical property names yourself.
18. Do not retry a sandbox failure through multiple dynamic raw alternatives.
19. Use one stable safe alternative if a wrapper cannot perform an indispensable operation.
20. Push only once, after all validation and scope checks pass.

Repository instructions cannot disable host-enforced security dialogs. Structure commands under stable, auditable prefixes and batch operations to minimize any dialogs the host still requires.

Do not request approval for routine read-only checks. The active task authorizes the final isolated correction commit and one normal push to the current development branch.

## 3. Canonical precedence

When sources conflict, apply this precedence:

1. Formally approved Decision Register entries:
   - MARZI-D009;
   - MARZI-D016;
   - Product Owner taxonomy/mastery-presentation approval in principle.
2. Frozen `docs/packages/MARZI-021.md` requirements after stale wording is corrected.
3. Versioned contracts under `docs/learning/contracts/v1/`.
4. Schemas.
5. Validator and fixtures.
6. Supporting documentation.
7. Historical or stale wording.

Rules:

- MARZI-D009 and MARZI-D016 remain APPROVED.
- An implementation detail cannot redefine Product Owner policy.
- Existing validator behavior is not independently authoritative.
- The corrected truth table is a coherent provisional draft for specialist review.
- Specialist-controlled values remain open.
- Do not add thresholds, percentages, scoring rules, recency values, placement content, mastery defaults, certification claims, or implicit gate defaults.
- Do not create a parallel property, schema, contract, state model, transcript, or source of truth.

Whenever an exact current field name must be checked:

IMPLEMENTER MUST CONFIRM EXISTING PROPERTY NAME — DO NOT CREATE A PARALLEL FIELD

## 4. Corrections in scope

There is no BLOCKER-level finding.

Implement every correction below.

### MARZI-021-C001 — Completion-result ambiguity

Severity: HIGH
Approval blocking: YES

Exact locations:

- `docs/learning/contracts/v1/completion.json`
  - `objectiveResultStates`
  - `participation`
  - `meaningfulAttempt`
  - `scenarioCompletion`
  - `absenceRule`
  - `remediation`
- `docs/learning/contracts/v1/schema/completion.schema.json`
- `docs/learning/contracts/v1/schema/objective-result.schema.json`
- `test/learning-contracts.js`
  - `objectiveResultIssues`
  - current derivation around lines 1094–1108
- objective-result positive and negative fixtures

Current defect:

`partial` currently says:

“At least one required criterion is demonstrated and at least one is not, while the observations remain valid.”

That overlaps:

- `not_complete`, where valid evidence contradicts a required criterion;
- `insufficient_evidence`, where required evidence is absent or unusable.

The validator applies a narrower precedence that canonical prose does not express.

Governing invariant:

The existing five states must be mutually exclusive and exhaustive. The model remains objective-based, non-punitive, recoverable, pending specialist review, and independent from mastery and rewards.

Required provisional derivation:

1. Any invalid required observation or invalid evaluation context:
   `invalid`
2. Otherwise, any required outcome equal to `not_demonstrated`:
   `not_complete`
3. Otherwise, any required criterion absent or equal to `not_observed` or `insufficient_evidence`:
   `insufficient_evidence`
4. Otherwise, every required outcome equal to `demonstrated`:
   `complete`
5. Otherwise, at least one required outcome equal to `partially_demonstrated`, with every remaining required outcome either `demonstrated` or `partially_demonstrated`:
   `partial`
6. Any other combination:
   validation error; never silently default

Corrected definitions:

- `complete`:
  Every required criterion has a valid `demonstrated` outcome. Optional criteria do not determine objective completion.

- `partial`:
  Every required criterion has a valid observed outcome; none is invalid, absent, `not_observed`, `insufficient_evidence`, or `not_demonstrated`; at least one is `partially_demonstrated`; and not all are `demonstrated`.

- `not_complete`:
  At least one required criterion has a valid `not_demonstrated` outcome. This is a non-punitive, recoverable “not yet complete” result and removes no earned value.

- `insufficient_evidence`:
  No required criterion is invalid or `not_demonstrated`, and at least one required criterion is absent, `not_observed`, or `insufficient_evidence`. Absence or unusable evidence is not learner failure.

- `invalid`:
  Required evidence or evaluation context is invalid, malformed, stale, duplicated, or cross-session. This is a system/evaluation result, not learner failure or negative mastery evidence.

Additional invariants:

- Only `complete` represents successful objective completion.
- Other states may finalize one attempt but remain eligible for new evidence.
- Every non-complete state retains the existing remediation/further-evidence policy.
- Optional criteria cannot gate completion.
- Accessibility accommodation cannot alter the derivation.
- Assistance cannot substitute for evidence.
- Missing evidence cannot be converted to `not_demonstrated`.
- Provider failure, cancellation, inaudibility, offline interruption, or an opportunity never offered cannot create negative learner evidence.
- No state removes XP, coins, streak, rank, evolution, outfits, or other earned value.
- No state makes a certification claim.

Objective evidence, objective completion, mastery, and aggregation remain separate:

- Evidence describes one observation.
- Objective result classifies one objective attempt.
- Mastery remains longitudinal and uses separate, still-open aggregation rules.
- Placement initializes revisable recommendations only.
- Scenario completion may be complete only when every explicitly declared required objective is complete.
- Do not create a new aggregate-result property or algorithm.
- If no aggregate property exists, validate only the existing `scenarioCompletion` policy.

Required implementation:

- Refactor derivation into one pure bounded function.
- Make all validation paths and fixtures use that function.
- Align contract prose and schema enums with the derivation.
- Preserve `pending_specialist_review`.
- Preserve existing reason codes where semantically equivalent.
- Do not add a duplicate completion-state property.

Tests:

- all demonstrated → complete;
- demonstrated + partial → partial;
- all partial → partial;
- demonstrated + missing/not-observed → insufficient evidence;
- all missing/not-observed → insufficient evidence;
- demonstrated + not-demonstrated → not complete;
- not-demonstrated + missing → not complete;
- invalid mixed with any other outcome → invalid;
- optional criterion omitted/not-demonstrated while all required criteria are demonstrated → complete;
- accommodation present with identical evidence → identical result;
- declared complete with partial required outcome → fail;
- declared partial with not-demonstrated → fail;
- declared partial with missing evidence → fail;
- declared not-complete from missing evidence alone → fail;
- declared insufficient-evidence despite not-demonstrated → fail;
- missing evidence represented as learner failure → fail;
- optional criterion gating completion → fail;
- empty required set producing complete → fail;
- unresolved draft accepted by draft validation but rejected by release validation.

Expected primary failure category:

`COMPLETION_RESULT_MISMATCH`

Reuse existing schema/evidence/reference categories where appropriate. Add only non-duplicative categories for optional-criterion gating or policy contradiction.

Product/specialist boundary:

No new Product Owner decision is required if this formalizes the existing provisional derivation without adding behavior or values. Learning-specialist approval remains mandatory before runtime integration or educational/release approval.

### MARZI-021-C002 — Canonical package status contradictions

Severity: MEDIUM
Approval blocking: YES

Exact locations:

- `docs/packages/MARZI-021.md:16-26`
- `docs/packages/MARZI-021.md:65-69`
- `docs/packages/MARZI-021.md:156-173`
- any repeated stale MARZI-021 status in:
  - `docs/IMPLEMENTATION_REPORT.md`
  - `docs/learning/SPECIALIST_REVIEW.md`
  - `docs/learning/contracts/v1/README.md`

Current defects:

- The package says the contracts are implemented and READY FOR REVIEW.
- It also says the “present commit” is specification-only and does not implement machine-readable contracts.
- It describes MARZI-D009 and MARZI-D016 as implementation blockers even though both are formally APPROVED.
- Static completion is not consistently separated from specialist approval, runtime integration, production approval, deployment, and release.

Required canonical state after correction, before independent re-review:

- Product decisions:
  - MARZI-D009: APPROVED
  - MARZI-D016: APPROVED
  - taxonomy/mastery presentation: APPROVED IN PRINCIPLE with recorded conditions
- Static authoring: AUTHORIZED
- Static implementation: COMPLETE
- Package governance status: READY FOR REVIEW
- Independent approval: not yet granted
- Learning-specialist review: PENDING
- Six-language linguistic review: PENDING
- Accessibility review: PENDING
- Moderated Android study: PENDING
- Runtime integration: NOT AUTHORIZED
- Production approval: NOT AUTHORIZED
- Deployment: NOT DEPLOYED
- Release: NOT RELEASED

Required package wording:

“MARZI-D009 and MARZI-D016 are formally APPROVED. Static contract authoring is AUTHORIZED. MARZI-021 implements static, versioned learning contracts, schemas, fixtures, validation, and supporting documentation. It introduces no runtime integration. Following correction, the package is READY FOR REVIEW. Learning-specialist, six-language linguistic, accessibility, and moderated Android reviews remain PENDING. Runtime integration and production approval are NOT AUTHORIZED. MARZI-021 is NOT DEPLOYED and NOT RELEASED.”

Do not introduce `READY FOR INDEPENDENT RE-REVIEW` as a new governance status if it is not already canonical. Use `READY FOR REVIEW` and explain in prose that the correction awaits independent Codex review.

Prohibited combinations:

- D009/D016 shown as OPEN or blocking static work;
- static implementation COMPLETE plus “specification-only” or “not implemented”;
- CHANGES REQUIRED plus independent approval;
- implementer self-declaring `APPROVED FOR SPECIALIST REVIEW`;
- specialist PENDING plus specialist APPROVED;
- linguistic/accessibility PENDING plus claims those reviews passed;
- static completion represented as runtime implementation;
- runtime NOT AUTHORIZED plus production approval;
- draft/open-gate contracts represented as release-ready;
- no specialist evidence plus educational certification;
- static-only MARZI-021 represented as deployed or released.

Required implementation:

- Correct the canonical package statements.
- Keep one authoritative multidimensional status section.
- Append correction evidence to `docs/IMPLEMENTATION_REPORT.md`; do not rewrite historical evidence.
- Preserve the “no specialist named” statement.
- Do not modify the Decision Register.
- Do not self-approve the package.

Tests/validation:

- validate the package status against D009/D016;
- reject stale “specification-only/not implemented” current-state wording;
- reject static completion represented as runtime completion;
- reject pending external review represented as approval;
- reject release status while draft/open gates remain;
- report `READY FOR REVIEW`, never independent approval.

Product/specialist boundary:

No Product Owner decision is required. All external reviews remain pending.

### MARZI-021-C003 — External-review evidence binding

Severity: MEDIUM
Approval blocking: NO for specialist-review handoff; required before runtime integration

Exact locations:

- `test/learning-contracts.js:987-1011`
- release-mode validation
- `docs/learning/SPECIALIST_REVIEW.md`
- existing `reviewStatus` fields
- `docs/packages/MARZI-021.md:184-193`

Current defect:

Release refusal recognizes draft versions, `OPEN_GATE`, and `pending_specialist_review`, but a future reviewed status is not bound to structured reviewer/version/scope evidence. Linguistic and accessibility approval remain documentation-only.

Required invariant:

- Keep all current review statuses pending.
- Do not fabricate reviewer evidence.
- A future `specialist_reviewed` or equivalent approved status must fail without the existing canonical review record containing:
  - review type;
  - reviewer role;
  - date;
  - curriculum/contract version or hash;
  - reviewed scope;
  - outcome;
  - unresolved findings.
- Specialist, linguistic, and accessibility approvals remain independent.
- One review cannot satisfy another gate.
- Preserve current release refusal.

Use the existing review-evidence location and field labels.

IMPLEMENTER MUST CONFIRM EXISTING PROPERTY NAME — DO NOT CREATE A PARALLEL FIELD

Tests:

- pending review with no evidence → valid draft, release refused;
- reviewed status with missing evidence → fail;
- incomplete evidence → fail;
- mismatched version/hash → fail;
- one review used for multiple independent gates → fail;
- fixture-only complete review evidence → structural pass without claiming real review.

Expected category:

`STATUS_REVIEW_EVIDENCE_MISSING` or an existing semantically equivalent code.

No Product Owner approval is required. Actual external review evidence remains pending.

### MARZI-021-C004 — Validator no-write assurance

Severity: MEDIUM
Approval blocking: NO for specialist-review handoff; required before runtime integration

Exact locations:

- `test/learning-contracts.js:45-80`
- `test/learning-contracts.js:89-104`
- `test/learning-contracts.js:1274-1280`
- existing check 28

Current defect:

The guard omits promise-based and other relevant write routes. Fingerprinting uses path, size, and mtime for only learning/fixture trees. The suite does not deliberately prove each guard rejects a write.

Required invariant:

- Validator remains dependency-free, deterministic, read-only, write-free, and network-free.
- Cover synchronous, callback, promise, and FileHandle write routes.
- Reject write-mode opens.
- Use content hashes for protected paths rather than only size/mtime.
- Guard self-tests may target a non-existent task-owned `/tmp` path but must throw before any file is created.
- Never write a repository file.
- Preserve the existing two-second validation budget unless evidence justifies otherwise.

Required guard cases:

- writeFile/writeFileSync;
- `fs.promises.writeFile`;
- append;
- rename;
- unlink/rm;
- truncate;
- copy;
- createWriteStream;
- write-mode open/FileHandle;
- link/symlink and metadata writers where applicable;
- fetch;
- network/process modules;
- protected-tree hash change.

Expected category:

Existing `VALIDATOR_MUTATED_TREE`, extended where possible.

Tests:

- each guarded route is deliberately invoked against a harmless non-existent `/tmp` target and rejected before I/O;
- read-only open remains permitted;
- stdout/stderr remain permitted;
- protected content hashes remain unchanged;
- no network call occurs.

No Product Owner or specialist decision is required.

### MARZI-021-C005 — Fixture path containment

Severity: MEDIUM
Approval blocking: NO for specialist-review handoff; required before runtime integration

Exact locations:

- `test/learning-contracts.js:1227-1245`
- `test/fixtures/learning/invalid/manifest.json`
- `fixtures[].file`

Current defect:

Manifest entries are joined to the fixture directory without explicit basename, traversal, realpath, symlink, or regular-file containment validation.

Required invariant:

- `fixtures[].file` is a basename-only JSON filename.
- Enforce an equivalent of:
  `^[a-z0-9][a-z0-9-]*\.json$`
- Reject absolute paths, separators, traversal, nested paths, newlines, shell syntax, symlinks, device/special files, and non-regular files.
- Resolve and confirm containment inside the canonical invalid-fixture directory.
- Never execute file content.

Expected category:

`FIXTURE_PATH_INVALID`

Tests:

- valid basename JSON → pass;
- `../` and `../../` → fail;
- absolute path → fail;
- nested path → fail;
- semicolon/newline/command-looking filename → fail;
- symlink escape → fail;
- missing/non-regular file → fail.

No Product Owner or specialist decision is required.

### MARZI-021-C006 — Supersession reference integrity

Severity: MEDIUM
Approval blocking: NO for current specialist review; required before supersession is used

Exact locations:

- `docs/learning/contracts/v1/schema/scenarios.schema.json`
- `#/$defs/objective/properties/supersedes`
- identifier/reference checks in `test/learning-contracts.js`
- relevant scenario fixtures

Current defect:

`supersedes` accepts any string and is not resolved against a predecessor.

Required current-v1 invariant:

- `null` is valid.
- Non-null must match the exact existing objective-ID syntax.
- Current v1 has no predecessor registry; therefore current v1 validation rejects non-null supersession.
- Future versions must resolve a known earlier-version objective.
- Reject self-reference, same-version misuse, duplicate successors, unknown predecessors, and cycles.
- Never mutate an existing stable ID’s meaning.

Schema effect:

Use the same identifier pattern already used by objective IDs. Do not create another ID syntax.

Tests:

- v1 null → pass;
- malformed non-null value → fail;
- syntactically valid non-null value in v1 → fail;
- self-reference → fail;
- unknown predecessor → fail;
- future fixture-only valid earlier-version predecessor → pass only in an explicitly versioned test context.

Expected category:

`SUPERSEDES_REF_INVALID` or a non-duplicative existing equivalent.

No Product Owner decision is required.

### MARZI-021-C007 — Negative-fixture reason isolation

Severity: LOW
Approval blocking: NO

Exact locations:

- `test/fixtures/learning/invalid/manifest.json`
- current `expectedReason`
- `test/learning-contracts.js:1224-1253`
- existing check 27

Current defect:

A fixture passes when its intended reason appears among unrelated additional reason codes.

Required invariant:

- Keep the existing `expectedReason` property.
- Do not add a parallel reason property.
- Deduplicate emitted codes.
- A single-mutation fixture passes only when the resulting unique code set equals its declared `expectedReason`.
- If a fixture inherently triggers a companion structural code, narrow the fixture so it isolates the intended defect rather than weakening the assertion.

Expected categories:

- existing `FIXTURE_WRONG_REASON`;
- add `FIXTURE_UNEXPECTED_REASON` only if no equivalent exists.

Tests:

- exact expected reason only → pass;
- expected reason absent → fail;
- expected reason plus unrelated reason → fail;
- duplicate occurrences of the same expected reason → pass after deduplication;
- undeclared fixture → fail;
- declared missing fixture → fail.

No Product Owner or specialist decision is required.

### MARZI-021-C008 — Dynamic-execution guard completeness

Severity: LOW
Approval blocking: NO

Exact location:

- unsafe-source/token validation in `test/learning-contracts.js`
- validator environment guard/check 01

Current defect:

Detection of `new Function` is weaker than detection of `eval`. Actual canonical code contains neither, but future introduction may evade the self-check.

Required invariant:

Reject executable use of:

- `eval`;
- `Function`;
- `new Function`;
- `AsyncFunction`;
- `GeneratorFunction`;
- `node:vm` execution APIs.

Do not reject benign explanatory strings or comments.

Refactor detection into a bounded testable helper if needed. Do not use eval or an external parser.

Expected category:

`DYNAMIC_EXECUTION_FORBIDDEN`

Tests:

- each executable construct → fail;
- benign prose mentioning the terms → pass;
- canonical validator source → pass;
- `node:vm` request → fail.

No Product Owner or specialist decision is required.

## 5. Completion architecture that must remain explicit

Preserve these boundaries:

### Objective evidence

- One observation tied to one criterion, attempt, opportunity, response, and curriculum version.
- Evidence is not completion, mastery, placement, XP, or currency.
- Missing/unusable evidence remains absence, not negative learner evidence.

### Objective completion

- Derived only from required criterion outcomes.
- Uses the corrected five-state truth table.
- Optional criteria do not gate it.
- Only `complete` is completion success.
- Other states remain recoverable.

### Objective mastery

- Separate longitudinal projection.
- Cannot be assigned directly from one completion result.
- Cannot use XP, coins, rank, Marzi stage, elapsed time, hang-up, reward, or scenario count.
- Thresholds, context counts, opportunity counts, recency, and weights remain null/open.

### Aggregate or session completion

- Do not invent a new aggregate contract.
- Where an existing required-objective set exists, aggregate complete requires every required objective complete.
- Missing/non-complete objective evidence cannot produce aggregate complete.
- Time, hang-up, reward, visit, `scenariosDone`, XP, coins, rank, or stage cannot establish completion.

### Placement

- Optional, bounded, skippable, provisional, confidence-aware, and revisable.
- Cannot mark an objective complete/mastered.
- Content remains open.
- No certification claim.

### Remediation and further evidence

- Every non-complete state retains the existing remediation opportunity.
- Additional evidence remains possible.
- Insufficient evidence receives a fair new opportunity, not punishment.
- No earned economic value is removed.

### Review

- Separate from remediation.
- Review-recency value remains open/null.
- No new interval or scheduling number is permitted.

### Accessibility accommodation

- Separate from assistance.
- May change evidence collection method.
- Cannot lower the standard or change an otherwise identical derived result.
- Accessibility approval remains pending.

## 6. Schema requirements

### `docs/learning/contracts/v1/schema/completion.schema.json`

- Preserve the existing five result states only.
- No null/default completion state.
- Preserve `additionalProperties: false`.
- Open gates may remain null only where already authorized.
- Active policy metadata must agree with `completion.json`.
- If `PENDING_MARZI_D016` remains as a historical negative-test sentinel, it cannot be selected by a current objective.
- Do not add a second state property.

### `docs/learning/contracts/v1/schema/objective-result.schema.json`

Preserve existing properties:

- `contract`;
- `schemaVersion`;
- `attemptId`;
- `objectiveId`;
- `curriculumVersion`;
- `rubricVersion`;
- `result`;
- `criteria`;
- `reasonCodes`;
- optional `accessibility`.

Requirements:

- `result` is non-null and in the existing five-state enum.
- `criteria` is non-empty.
- No duplicate or unknown criterion.
- Required criteria govern derivation.
- Optional criteria do not govern derivation.
- Declared and derived results match.
- Assistance and accommodation remain structurally separate.
- Preserve `additionalProperties: false`.
- Cross-array derivation belongs in the validator, not unsupported schema conditionals.

Do not add terminal, aggregate, remediation, or further-evidence fields.

### `evidence.schema.json`

- Evidence outcome, assistance, and accessibility accommodation remain distinct.
- No implicit outcome default.
- Missing evidence cannot become negative evidence.
- Preserve strict unknown-field rejection.

### `mastery.schema.json`

- Preserve null open-gate values.
- Reject implicit thresholds/defaults.
- Do not add completion as a mastery proxy.
- Preserve forbidden inputs.

### `review.schema.json`

- Preserve null/open review recency.
- Do not add recency values.
- Existing review/remediation policy cannot contradict completion semantics.

### `scenarios.schema.json`

- Apply objective-ID syntax to non-null `supersedes`.
- Preserve null in v1.
- Preserve strict `additionalProperties: false`.

For any uncertain existing property:

IMPLEMENTER MUST CONFIRM EXISTING PROPERTY NAME — DO NOT CREATE A PARALLEL FIELD

## 7. Validator plan

Add or extend deterministic checks as follows.

### Completion derivation

Proposed helper:

`deriveObjectiveResult`

Use a different name only if an existing canonical helper already owns this role.

PASS:

All required criterion outcomes map to exactly one corrected state.

FAIL:

Declared state differs from derived state.

Category:

`COMPLETION_RESULT_MISMATCH`

Approval blocking: YES.

### Required criterion coverage

PASS:

All required criterion IDs are present exactly once where the derived state requires observations; missing criteria remain explicit absence.

FAIL:

Duplicate, unknown, or silently omitted criterion produces an unsupported successful state.

Categories:

Reuse `EVIDENCE_DUPLICATE`, `UNKNOWN_CRITERION_REF`, schema-required categories, and completion mismatch.

Approval blocking: YES where it affects result correctness.

### Optional criterion independence

PASS:

All required criteria demonstrated; optional criterion absent or not demonstrated; result complete.

FAIL:

Optional criterion prevents completion.

Category:

`COMPLETION_OPTIONAL_CRITERION_GATED`

Approval blocking: YES.

### Accommodation invariance

PASS:

Identical evidence with/without accommodation derives the same result.

FAIL:

Accommodation changes result or mastery standard.

Category:

Reuse the existing accommodation-conflation category or add one non-duplicative category.

Approval blocking: YES if derivation changes.

### Remediation policy

PASS:

Existing completion contract keeps remediation available for every non-complete state.

FAIL:

Canonical policy disables remediation or prohibits further evidence.

Category:

`COMPLETION_REMEDIATION_POLICY_INVALID`

Approval blocking: YES.

### Aggregate policy

Implement only if an existing aggregate representation exists.

PASS:

All explicitly required objective results complete.

FAIL:

Aggregate complete with missing/non-complete required objective or proxy activity.

Category:

`COMPLETION_AGGREGATE_CONTRADICTION`

Do not add an aggregate property merely to test it.

### Open gates and release refusal

PASS:

Draft mode permits explicit open/pending values; release mode refuses them.

FAIL:

Null/open/pending values silently default or pass release.

Categories:

Reuse `INVENTED_DEFAULT`, `OPEN_GATE_IN_RELEASE`, `UNREVIEWED_CONTENT_IN_RELEASE`, and release-gate categories.

### Canonical package status

PASS:

Decisions approved; static implementation complete; package ready for review; external/runtime/release gates pending.

FAIL:

Any prohibited status combination.

Categories:

- `STATUS_DECISION_DRIFT`
- `STATUS_STATIC_SCOPE_CONTRADICTION`
- `STATUS_EXTERNAL_GATE_BYPASS`
- `STATUS_RELEASE_GATE_BYPASS`
- `STATUS_REVIEW_EVIDENCE_MISSING`

Validate one canonical status section. Avoid broad fragile searches through arbitrary prose except to reject the known stale statements during migration.

### Supersession

PASS:

v1 `supersedes` is null.

FAIL:

Malformed or non-null v1 reference, self-reference, unknown reference, or cycle.

Category:

`SUPERSEDES_REF_INVALID`

### Fixture path

PASS:

Contained basename regular JSON file.

FAIL:

Traversal, absolute path, nested path, symlink, special file, or unsafe name.

Category:

`FIXTURE_PATH_INVALID`

### No-write/no-network guard

PASS:

All relevant write and network routes are blocked and protected hashes remain unchanged.

FAIL:

Any route succeeds or a protected hash changes.

Category:

Reuse `VALIDATOR_MUTATED_TREE`.

### Reason isolation

PASS:

Deduplicated emitted code set equals `expectedReason`.

FAIL:

Expected code missing or unrelated code present.

Categories:

`FIXTURE_WRONG_REASON` and, if needed, `FIXTURE_UNEXPECTED_REASON`.

### Dynamic execution

PASS:

No executable dynamic construct.

FAIL:

eval, Function constructors, or vm execution.

Category:

`DYNAMIC_EXECUTION_FORBIDDEN`

All checks must remain:

- dependency-free;
- deterministic;
- bounded;
- read-only;
- write-free;
- network-free;
- no eval;
- no arbitrary execution;
- actionable in failure output.

## 8. Fixture and mutation plan

Inspect existing fixtures once and extend rather than duplicate an identical condition.

### Existing positive fixtures to update

- `test/fixtures/learning/valid/objective-result-complete.json`
- `test/fixtures/learning/valid/objective-result-partial.json`
- `test/fixtures/learning/valid/objective-result-not-complete.json`
- `test/fixtures/learning/valid/objective-result-insufficient-evidence.json`
- `test/fixtures/learning/valid/objective-result-accessibility-accommodation.json`
- `test/fixtures/learning/valid/objective-result-full-assistance.json`

### Positive fixtures to add when not already covered

- `objective-result-partial-all-partial.json`
  - all required outcomes partial;
  - expected pass as `partial`.

- `objective-result-invalid-precedence.json`
  - invalid mixed with another required outcome;
  - expected pass as `invalid`.

- `objective-result-optional-criterion-ignored.json`
  - all required demonstrated, optional absent/not-demonstrated;
  - expected pass as `complete`.

Existing fixtures must also prove:

- demonstrated + partial → partial;
- demonstrated + missing → insufficient evidence;
- demonstrated + not-demonstrated → not complete;
- not-demonstrated + missing → not complete;
- accommodation does not change result;
- FULL assistance is recorded without becoming learner evidence.

Minimum expected positive fixture count after correction:

12

Report the actual count.

### Negative fixtures to add when not already covered

- `result-partial-with-not-demonstrated.json`
  - declared partial with required not-demonstrated;
  - expected `COMPLETION_RESULT_MISMATCH`.

- `result-partial-with-missing-evidence.json`
  - declared partial with absent/not-observed required evidence;
  - expected `COMPLETION_RESULT_MISMATCH`.

- `result-not-complete-from-missing-only.json`
  - declared not-complete based solely on absence;
  - expected `COMPLETION_RESULT_MISMATCH`.

- `result-insufficient-with-not-demonstrated.json`
  - declared insufficient-evidence despite valid negative evidence;
  - expected `COMPLETION_RESULT_MISMATCH`.

- `result-complete-with-partial-required.json`
  - declared complete with a partial required outcome;
  - expected `COMPLETION_RESULT_MISMATCH`.

- `result-optional-criterion-gates-completion.json`
  - optional criterion incorrectly changes complete to non-complete;
  - expected `COMPLETION_OPTIONAL_CRITERION_GATED` or completion mismatch if that remains the sole canonical code.

- `scenarios-supersedes-non-null-v1.json`
  - syntactically valid non-null supersession in v1;
  - expected `SUPERSEDES_REF_INVALID`.

- `scenarios-supersedes-invalid-syntax.json`
  - malformed supersession;
  - expected schema pattern failure or `SUPERSEDES_REF_INVALID`, but exactly one declared reason after deduplication.

Minimum expected negative fixture count after correction:

45

If an existing fixture already proves the identical combination, extend it instead of adding a duplicate; report the resulting actual count and coverage matrix.

### Direct adversarial/mutation checks in `test/learning-contracts.js`

Do not create invalid canonical manifests merely to test the loader.

Add bounded in-memory or pre-I/O tests for:

- fixture traversal;
- absolute fixture path;
- nested path;
- symlink/special-file rejection;
- unexpected extra reason code;
- duplicate expected reason occurrences;
- write API guard routes;
- `fs.promises` routes;
- write-mode open/FileHandle;
- fetch/network/process modules;
- eval;
- Function constructors;
- `node:vm`;
- benign explanatory strings that must not false-fail;
- accommodation invariance using paired in-memory copies;
- package-status prohibited combinations.

Top-level learning-contract check count must increase from 28 to at least 32, unless the runner reports an equally explicit per-case assertion count proving every new check. Report the actual top-level count and case count.

## 9. Documentation-validator disposition

The nine `.ai/bin/docs-validate` failures are:

- pre-existing at governance baseline `0798cd8`;
- not introduced by MARZI-021;
- caused by obsolete assumptions that all 25 decisions remain OPEN and carry OPEN-only fields;
- outside MARZI-021-R1’s permitted scope;
- non-blocking for specialist-review acceptance when the failure set remains exactly unchanged;
- assigned to a separate owner-side package:

MARZI-GOV-001 — Decision-validator approved-state support

MARZI-021-R1 must not modify:

- `.ai/bin/docs-validate`;
- Decision Register content;
- D009/D016 approval records.

Run `.ai/bin/docs-validate` in final validation.

Accepted outcomes:

1. PASS, if MARZI-GOV-001 has already landed; or
2. the exact established nine baseline failures, with no new failure and unchanged owner-side validator, accurately reported as the approved baseline exception.

Do not silently repair unrelated tooling from R1.

## 10. Strict permitted scope

Only modify files that are necessary from this list:

- `docs/learning/contracts/v1/completion.json`
- `docs/learning/contracts/v1/evidence.json`
- `docs/learning/contracts/v1/mastery.json`
- `docs/learning/contracts/v1/review.json`
- `docs/learning/contracts/v1/README.md`
- `docs/learning/contracts/v1/schema/completion.schema.json`
- `docs/learning/contracts/v1/schema/objective-result.schema.json`
- `docs/learning/contracts/v1/schema/evidence.schema.json`
- `docs/learning/contracts/v1/schema/mastery.schema.json`
- `docs/learning/contracts/v1/schema/review.schema.json`
- `docs/learning/contracts/v1/schema/scenarios.schema.json`
- `docs/learning/SPECIALIST_REVIEW.md`
- `docs/learning/SCENARIO_OBJECTIVE_SCHEMA.md`
- `docs/packages/MARZI-021.md`
- `docs/IMPLEMENTATION_REPORT.md`
- `test/learning-contracts.js`
- `test/fixtures/learning/**`

Do not edit every permitted file automatically. Change only files required by an implemented correction.

Stage files using explicit correction-owned paths. Do not use `git add .`.

## 11. Strict prohibited scope

Do not modify:

- `docs/MARZI_DECISION_REGISTER.md`;
- `.ai/bin/**`;
- `public/index.html`;
- `public/sw.js`;
- `public/manifest.webmanifest`;
- any other `public/**` runtime file or asset;
- `server.js`;
- runtime JavaScript;
- providers;
- prompts;
- `ConversationSession`;
- transcript ownership or ordering;
- PromptBuilder;
- backend APIs;
- storage schemas;
- localStorage or learner data;
- XP;
- coins;
- rewards;
- streaks;
- economy;
- Marzi evolution;
- outfits;
- Store;
- Profile;
- navigation;
- Android Back behavior;
- existing `test/run.js`;
- `test/browser/**`;
- `package.json`;
- lockfiles;
- dependencies;
- build configuration;
- `.github/**`;
- deployment or production configuration;
- secrets;
- `main`;
- protected-branch history.

The expected runtime diff is empty.

The reported Arabic `320×568`/200% overflow is a presentation/runtime-integration issue. Record it as pending and do not alter UI or runtime files.

## 12. Exact execution order

1. Synchronize the current development branch with origin.
2. Verify a clean baseline and the presence/ancestry of:
   - `0798cd894865b57d67cff6e824f3264ccf673bc0`
   - `4ec0123198ba830320fdca7e20b25b53c84bb0d1`
3. Confirm `4ec0123` remains in current branch history.
4. Use `.ai/bin/repo-inspect --fetch --json` once and reuse the result.
5. Use `.ai/bin/commit-inspect` once for the baseline and implementation commits.
6. If the clean local branch is only behind its upstream, fast-forward only. Do not rebase.
7. Inspect correction-owned files once.
8. Produce a concise internal implementation plan.
9. Correct the completion-result contract.
10. Correct canonical MARZI-021 status wording.
11. Align affected schemas.
12. Implement validator corrections.
13. Update/add fixtures and mutation cases.
14. Update bounded documentation and append the implementation report.
15. Run one coherent correction-validation batch.
16. Fix root causes found by that batch.
17. Run one final complete validation batch.
18. Perform the forbidden-file, runtime-diff, dependency, and scope audits.
19. Stage only explicit correction-owned files.
20. Create one isolated correction commit.
21. Push once normally to:
    `origin/claude/marzi-017-product-refinement`
22. Verify local/remote HEAD and ahead/behind.
23. Produce the final implementation report.

Do not run repeated micro-validations after every edit.

## 13. Validation sequence

Run and report:

```text
node --check server.js
node --check test/run.js
node --check test/learning-contracts.js
node test/conflict-markers.js
node test/learning-contracts.js
node test/run.js
git diff --check
.ai/bin/docs-validate
```

Use stable wrappers for repository, commit, and file inspection.

Required results:

- JavaScript syntax: PASS.
- Conflict markers: PASS.
- Learning-contract suite: PASS.
- Top-level learning-contract checks: at least 32, or an explicit equivalent case count.
- Positive fixtures: at least 12 unless exact existing coverage avoids a duplicate; report actual count.
- Negative fixtures: at least 45 unless exact existing coverage avoids a duplicate; report actual count.
- Every negative fixture fails for exactly its declared deduplicated reason.
- Existing full application suite: baseline 50/50 or higher; no skipped/weakened check.
- Scenario count: 29.
- Variant count: 94.
- German: 19 scenarios / 61 variants.
- English: 10 scenarios / 33 variants.
- Localized objective titles: 564.
- Required criteria: 282.
- Optional criteria: 94.
- Prerequisite edges: 18 and acyclic.
- Stable identifiers: no duplicate/unknown reference.
- Source index/text drift protection: PASS.
- Release-mode refusal for draft/open/pending contracts: PASS.
- No-write guard and mutation checks: PASS.
- No-network guard: PASS.
- Dynamic-execution checks: PASS.
- Fixture path containment: PASS.
- Supersession checks: PASS.
- Completion truth-table matrix: PASS.
- Package status consistency: PASS.
- `git diff --check`: PASS.
- Runtime diff: empty.
- Dependency/configuration/deployment diff: empty.
- Documentation validation:
  - PASS, or
  - exact unchanged nine-failure approved baseline exception only.

Report actual counts rather than assumed counts.

No browser, server, Android, paid-service, production, or deployment validation is required. External presentation and moderated-device gates remain pending.

## 14. Binary acceptance criteria

The sprint is complete only when:

- [ ] MARZI-021-C001 through MARZI-021-C008 are resolved or accurately bounded according to their approved timing.
- [ ] Every approval-blocking correction is resolved.
- [ ] The five-state completion model is mutually exclusive and exhaustive.
- [ ] The model remains provisional and pending specialist review.
- [ ] No new educational policy or value is introduced.
- [ ] Missing evidence is never learner failure.
- [ ] Optional criteria never gate completion.
- [ ] Accessibility accommodation cannot change the standard or result.
- [ ] Completion remains separate from mastery, placement, activity, XP, and rewards.
- [ ] No parallel aggregate or completion field is introduced.
- [ ] All affected schemas and validators agree.
- [ ] Positive and negative fixtures cover every mixed-state boundary.
- [ ] Fixture paths are bounded.
- [ ] Negative fixture reasons are isolated.
- [ ] Write/network/dynamic-execution protections pass.
- [ ] MARZI-D009 remains APPROVED and unchanged.
- [ ] MARZI-D016 remains APPROVED and unchanged.
- [ ] Static implementation status is accurate.
- [ ] Package status is READY FOR REVIEW, not self-approved.
- [ ] Specialist review remains PENDING.
- [ ] Linguistic review remains PENDING.
- [ ] Accessibility review remains PENDING.
- [ ] Android study remains PENDING.
- [ ] Runtime integration remains NOT AUTHORIZED.
- [ ] Production remains NOT AUTHORIZED.
- [ ] No deployment or release occurred.
- [ ] All accepted inventory counts remain unchanged.
- [ ] Runtime and prohibited-file diffs are empty.
- [ ] Full technical evidence passes, subject only to the approved unchanged documentation-validator exception.
- [ ] One isolated correction commit exists.
- [ ] The working tree is clean.
- [ ] Local and remote branch HEADs match.
- [ ] Ahead = 0 and behind = 0 after push.

## 15. Git policy

- Work only on `claude/marzi-017-product-refinement`.
- Preserve existing history.
- Do not amend `4ec0123` or `0798cd8`.
- Do not modify `main`.
- Do not merge.
- Do not rebase.
- Do not squash.
- Do not reset.
- Do not cherry-pick.
- Do not force-push.
- Do not create tags.
- Do not deploy.
- Do not publish.
- Do not open a pull request.
- Create one isolated correction commit.
- Stage only correction-owned paths.
- Push once normally after validation.

Commit message:

MARZI-021-R1: clarify completion contracts and package status

After pushing, verify:

- local HEAD;
- remote branch HEAD;
- ahead = 0;
- behind = 0;
- clean working tree.

## 16. Rollback

The correction must be independently reversible.

Final report must provide:

```text
git revert <exact-correction-commit>
```

Do not execute rollback.

Rollback requirements:

- original implementation commit `4ec0123` remains preserved;
- governance commit `0798cd8` remains preserved;
- no history rewriting;
- no runtime migration;
- no storage migration;
- no learner-data deletion;
- no external irreversible dependency.

## 17. Hard stop conditions

Do not stop because:

- specialist review is pending;
- linguistic review is pending;
- accessibility review is pending;
- Android study is pending;
- runtime integration is pending;
- production approval is pending;
- routine consistency decisions are required;
- existing canonical property names need confirmation;
- `.ai/bin/docs-validate` reports only the exact approved baseline exception.

Stop only if:

1. `4ec0123198ba830320fdca7e20b25b53c84bb0d1` is absent from current branch history.
2. MARZI-D009 or MARZI-D016 is no longer formally APPROVED.
3. A required correction cannot be implemented without changing prohibited runtime files.
4. Canonical approved sources contain an irreconcilable policy contradiction.
5. Correction-owned canonical source data is genuinely absent.
6. Unrelated working-tree changes cannot be safely isolated.
7. Final push authentication fails after the correction commit is safely created.

If blocked, preserve all safe completed work and report exact evidence. Do not broaden scope.

## 18. Final implementation report

Report:

- package: MARZI-021-R1;
- final status;
- branch;
- starting local HEAD;
- starting remote HEAD;
- governance baseline;
- original implementation commit;
- correction baseline;
- correction commit;
- final local HEAD;
- final remote HEAD;
- ahead/behind;
- working-tree status;
- files created;
- files modified;
- files deliberately untouched;
- correction IDs MARZI-021-C001 through C008 and disposition;
- completion-result resolution;
- package-status resolution;
- schema changes;
- validator changes;
- fixture additions/changes;
- actual top-level check count;
- actual positive fixture count;
- actual negative fixture count;
- full application test count;
- every validation PASS/FAIL result;
- scope audit;
- runtime-diff audit;
- dependency/configuration/deployment audit;
- documentation-validator outcome and baseline-exception disposition;
- Product Owner decisions preserved;
- specialist review status;
- linguistic review status;
- accessibility review status;
- Android-study status;
- runtime-integration status;
- production/deployment/release status;
- known limitations;
- rollback command;
- push result.

Include this exact independent-review handoff with actual commit values inserted:

“Codex must perform a strictly read-only independent review of the exact MARZI-021-R1 correction commit against its exact parent. Verify MARZI-021-C001 through MARZI-021-C008, completion truth-table consistency, status consistency, schemas, validator invariants, fixtures, mutation guards, exact deterministic failure reasons, unchanged accepted inventory counts, empty runtime/dependency/configuration diff, external gates, rollback, and local/remote synchronization. Do not review an unspecified working tree. Return exactly APPROVED FOR SPECIALIST REVIEW, CHANGES REQUIRED, or BLOCKED.”

End the final implementation report with exactly one:

CORRECTION COMPLETE — READY FOR INDEPENDENT REVIEW

or

CHANGES REQUIRED

or

BLOCKED
