# MARZI-021-R2 — Definitive Claude Code Correction Mandate

## 1. Role and mission

You are Claude Code, the senior implementation engineer for the bounded static correction package MARZI-021-R2.

Implement this mandate; do not redesign the learning architecture or introduce educational policy. Resolve the independently verified MARZI-021-R1 findings against baseline commit `23f217924f4bd795eee94adc7c519326f45e1fa9` on branch `claude/marzi-017-product-refinement`.

The successful outcome is one isolated correction commit that is eligible for a new independent Codex review. It is not learning-specialist approval, linguistic approval, accessibility approval, Android-study validation, runtime-integration authorization, production authorization, deployment, release, or certification.

No Product Owner decision is required for this package.

## 2. Zero-interruption implementation protocol

Work autonomously until correction, validation, commit, one final push, synchronization verification, and the final report are complete.

1. Fetch once and synchronize the current development branch once.
2. Verify the branch, clean tree, exact baseline, remote tip, and protected main before editing.
3. Inspect only the correction-owned files listed in this mandate, once.
4. Produce a concise internal plan; do not stop after planning and do not send progress reports.
5. Batch related reads, edits, and validations.
6. Use stable `.ai/bin/*` wrappers where they support the required operation. Reuse their output.
7. Do not ask routine technical or Product Owner questions.
8. Do not create intermediate commits or push intermediate work.
9. Repair root causes; do not add temporary workarounds, parallel contracts, or duplicate state.
10. Run one correction-focused validation batch, repair failures, then run one final complete validation batch.
11. Create one isolated R2 commit and push once normally only after every required validation passes.
12. Verify local HEAD equals the remote branch tip and ahead/behind is 0/0.
13. Produce one final report only.

Repository instructions cannot disable host-enforced approval dialogs. Structure commands under stable prefixes, batch them, and avoid dynamic command variants so that any unavoidable host approval is minimized.

### Hard stop conditions

Stop only if one of these occurs:

- commit `23f217924f4bd795eee94adc7c519326f45e1fa9` is absent or is not the exact synchronized baseline;
- the active branch is not `claude/marzi-017-product-refinement`;
- unrelated working-tree changes cannot be isolated safely;
- MARZI-D009 or MARZI-D016 has been formally superseded;
- a required correction-owned source file is absent;
- a correction requires a prohibited runtime, dependency, deployment, Decision Register, or `.ai/bin/**` change;
- canonical sources contain an irreconcilable Product Owner policy contradiction;
- final push authentication fails after the correction commit has been safely created.

Do not stop because specialist, linguistic, accessibility, Android, runtime, production, deployment, or release gates are pending. Do not stop for routine implementation choices.

## 3. Authoritative baseline and frozen decisions

- Development branch: `claude/marzi-017-product-refinement`
- R2 baseline: `23f217924f4bd795eee94adc7c519326f45e1fa9`
- R2 baseline parent: `b47a9eb7db9e8b4e1476f5eb799b9610ada794c1`
- Original MARZI-021 implementation: `4ec0123198ba830320fdca7e20b25b53c84bb0d1`
- Governance baseline: `0798cd894865b57d67cff6e824f3264ccf673bc0`
- Protected main: `7395cd0a75fc206077e19ecc60e4c1e978dd2c89`
- Prior independent verdict: `CHANGES REQUIRED`

Preserve:

- MARZI-D009 Option A: optional, bounded, skippable, recommendation-oriented placement with confidence and insufficient-evidence states, later revision, no permanent label, and no certification claim;
- MARZI-D016 Option A: objective-based completion with explicit Partial and Insufficient Evidence states, absence not treated as failure, remediation and further evidence, accommodation separated from mastery evidence, non-punitive copy, and no certification claim;
- Product Owner approval-in-principle for static taxonomy and mastery presentation, subject to specialist, linguistic, and accessibility review;
- every open specialist-controlled value;
- all existing stable competency, objective, scenario, character, provider, prompt, storage, reward, economy, and runtime contracts.

Do not add thresholds, percentages, scoring rules, weights, recency intervals, placement content, competency copy, certification implications, or new pedagogy.

## 4. Exact R2 correction matrix

### MARZI-021-R2-C001 — Remove false learning-specialist approval claims

- Related original correction: MARZI-021-C002
- Severity: HIGH
- Approval blocking: YES
- Files:
  - `docs/packages/MARZI-021.md`, current lines 118–119 and 126–127
  - `docs/IMPLEMENTATION_REPORT.md`, C002 disposition and status narrative
- Observed defect:
  - The package says mastery state/confidence policy data is “approved by the Product Owner and learning specialist.”
  - It also describes documentation of every “specialist sign-off” as implemented scope.
  - These claims contradict the same package’s canonical status, which records no named specialist and a pending specialist review, and contradict `docs/learning/SPECIALIST_REVIEW.md`.
- Violated invariant: an implementation agent cannot grant or imply external specialist approval.
- Required correction:
  - State that the taxonomy and mastery presentation are Product Owner-approved in principle for static authoring and remain `pending_specialist_review`.
  - Replace “specialist sign-off” with an accurate description of the pending specialist-review status and prepared specialist handoff.
  - Keep “named learning specialist: NONE” and “learning-specialist review: PENDING.”
  - Change the implementation report’s C002 disposition only after the corrected package and validator prove consistency.
- Prohibited interpretation:
  - Do not imply that a Product Owner approval-in-principle is educational approval.
  - Do not imply that authored contracts, a review table, or passing validators constitute specialist sign-off.
- Schema impact: none.
- Validator impact:
  - Normalize whitespace and deterministically reject the exact obsolete claims about approval “by the Product Owner and learning specialist” and completed specialist sign-off.
  - Use a stable code such as `STATUS_EXTERNAL_GATE_BYPASS`.
  - Avoid a broad regex that rejects legitimate statements such as “specialist sign-off remains mandatory.”
- Positive proof: canonical table and prose say no specialist is named and review remains pending.
- Negative proof: an in-memory package-document mutation restoring either obsolete approval claim fails with `STATUS_EXTERNAL_GATE_BYPASS`.
- Acceptance criterion: no current-state sentence anywhere in correction-owned documents says or implies that specialist review or sign-off occurred.
- Product Owner boundary: no new decision required.
- Specialist boundary: specialist review remains pending.

### MARZI-021-R2-C002 — Make canonical status validation exact

- Related original correction: MARZI-021-C002
- Severity: MEDIUM
- Approval blocking: YES
- File: `test/learning-contracts.js`
- Locations:
  - `STATUS_EXPECTED`
  - `parseStatusTable`
  - `packageStatusIssues`
  - check 33
- Observed defect:
  - `STATUS_EXPECTED` contains exact values, but the validator checks only that every dimension exists.
  - Duplicate dimensions overwrite earlier rows.
  - Unknown dimensions are accepted.
  - Several invalid values can pass, including a rejected taxonomy state or incomplete static implementation.
  - The production/runtime conditional has misleading inverted wording even though a later check catches the current production state.
- Violated invariant: the canonical status table must be one deterministic, non-duplicated current-state record.
- Required correction:
  - Parse the table without silent overwrites.
  - Reject duplicate dimensions with `STATUS_DUPLICATE_DIMENSION`.
  - Reject unknown dimensions with `STATUS_UNKNOWN_DIMENSION`.
  - Reject missing dimensions with `STATUS_STATIC_SCOPE_CONTRADICTION`.
  - Compare every current dimension to its exact R2 expected value.
  - Preserve these exact current states:
    - MARZI-D009: `APPROVED`
    - MARZI-D016: `APPROVED`
    - Taxonomy and mastery presentation: `APPROVED IN PRINCIPLE`
    - Static authoring: `AUTHORIZED`
    - Static implementation: `COMPLETE`
    - Package governance status: `READY FOR REVIEW`
    - Independent approval: `NOT GRANTED`
    - Learning-specialist review: `PENDING`
    - Named learning specialist: `NONE` either as an explicit canonical dimension or an unambiguous adjacent canonical statement; use the existing representation and do not create a competing table
    - Six-language linguistic review: `PENDING`
    - Accessibility review: `PENDING`
    - Moderated Android study: `PENDING`
    - Runtime integration: `NOT AUTHORIZED`
    - Production approval: `NOT AUTHORIZED`
    - Deployment: `NOT DEPLOYED`
    - Release: `NOT RELEASED`
  - Correct the misleading runtime/production conditional and its diagnostic.
- Prohibited interpretation: this R2 snapshot validator is not a permanent workflow engine for future external approvals. A future evidence-backed transition requires a later versioned package update.
- Schema impact: none.
- Validator proof:
  - canonical table passes;
  - every individual wrong value fails;
  - duplicate row fails;
  - unknown row fails;
  - missing row fails;
  - false external approval fails;
  - runtime or production authorization fails;
  - deployment or release fails.
- Mutations: one in-memory mutation per unchecked dimension, plus duplicate and unknown dimensions.
- Acceptance criterion: no prohibited or malformed canonical status map can pass check 33.
- Product Owner/specialist boundary: no new decision; all external states remain pending.

### MARZI-021-R2-C003 — Bind completion contract conditions to executable derivation

- Related original correction: MARZI-021-C001
- Severity: HIGH
- Approval blocking: YES
- Files:
  - `docs/learning/contracts/v1/completion.json`
  - `docs/learning/contracts/v1/schema/completion.schema.json`
  - `docs/learning/contracts/v1/schema/objective-result.schema.json` only if an existing constraint needs alignment
  - `docs/learning/contracts/v1/README.md`
  - `test/learning-contracts.js`
  - `docs/IMPLEMENTATION_REPORT.md`
- Locations:
  - `objectiveResultStates`
  - `derivationPrecedence`
  - `derivationRules`
  - `deriveObjectiveResult`
  - checks 29–31
- Observed defect:
  - Current contract prose and executable derivation agree.
  - Check 30 validates only precedence order and result names; it does not validate the semantic `condition` values.
  - A condition-only contract mutation can contradict the executable derivation and still pass.
  - README and implementation report overstate check 30 as proof of complete contract/code agreement.
- Governing completion model:
  1. Any invalid required observation or invalid evaluation context → `invalid`.
  2. Otherwise any required `not_demonstrated` outcome → `not_complete`.
  3. Otherwise any absent, `not_observed`, or `insufficient_evidence` required criterion → `insufficient_evidence`.
  4. Otherwise every required outcome `demonstrated` → `complete`.
  5. Otherwise at least one required `partially_demonstrated` outcome and every other required outcome demonstrated or partially demonstrated → `partial`.
  6. Unknown or structurally impossible input → deterministic validation error; never a default.
- Required invariants:
  - `partial` cannot overlap `not_complete`.
  - `partial` cannot overlap `insufficient_evidence`.
  - Only required criteria participate.
  - Optional criteria cannot gate completion.
  - Accommodation data cannot change evidence meaning, completion, or mastery.
  - Assistance cannot substitute for evidence.
  - Absence is not converted to `not_demonstrated`.
  - Only `complete` is successful objective completion.
  - Every other state remains recoverable and eligible for remediation and further evidence.
  - No aggregate learner-state property is created.
- Required correction:
  - Keep existing property names and the existing five-state vocabulary.
  - Make condition semantics mechanically verifiable, not merely manually consistent.
  - Use one bounded rule descriptor or equivalent single implementation mechanism so `deriveObjectiveResult`, precedence validation, and exhaustive truth-table tests consume the same rule definitions.
  - Validate the existing JSON projection’s order, result, and normalized condition semantics.
  - Remove duplicate hardcoded expected arrays where the shared descriptor can own them.
  - If exact prose remains intentionally human-readable, bind it to stable existing rule descriptors without creating a second completion field or parallel contract.
- Prohibited interpretation:
  - Do not add a second result property, alternate truth table, threshold, percentage, weighting, score, review window, placement content, or certification rule.
- Schema impact:
  - Retain strict `additionalProperties: false`.
  - Retain the current state enums and non-null result.
  - If the existing schema needs a tighter condition constraint, change only the existing `condition` property; do not create a parallel semantic field unless no existing-property solution is technically possible, in which case stop because that would exceed this mandate.
- Validator impact:
  - A condition-only drift must produce `COMPLETION_POLICY_CONTRADICTION`.
  - Declared result versus derived result mismatch remains `COMPLETION_RESULT_MISMATCH`.
  - Empty required criteria and unknown observation outcomes remain deterministic contradictions.
- Positive proof:
  - all demonstrated → complete;
  - demonstrated plus partial → partial;
  - all partial → partial;
  - missing/not-observed with no negative → insufficient evidence;
  - negative evidence → not complete;
  - negative plus missing → not complete;
  - invalid plus any other state → invalid;
  - optional failure with all required demonstrated → complete;
  - identical evidence with and without accommodation → identical result.
- Negative proof:
  - partial with negative evidence;
  - partial with missing evidence;
  - insufficient evidence despite negative evidence;
  - not complete from absence alone;
  - complete with partial or missing required evidence;
  - optional criterion gating;
  - unknown outcome;
  - empty required set;
  - condition-only contract drift.
- Required mutation: clone the completion contract in memory, change only one `derivationPrecedence[].condition` while retaining order and result, and require check 30 or its replacement to fail.
- Acceptance criterion: current contract, schema projection, derivation function, exhaustive truth table, fixtures, and condition-only mutation all prove one identical model.
- Product Owner boundary: no new decision.
- Specialist boundary: the model remains provisional and pending learning-specialist review.

### MARZI-021-R2-C004 — Bound external-review evidence claims accurately

- Related original correction: MARZI-021-C003
- Severity: MEDIUM
- Approval blocking: required for claim accuracy; it does not grant any external approval
- Files:
  - `docs/learning/SPECIALIST_REVIEW.md`
  - `docs/learning/contracts/v1/README.md`
  - `docs/packages/MARZI-021.md`
  - `docs/IMPLEMENTATION_REPORT.md`
  - `test/learning-contracts.js`
- Locations:
  - review record table;
  - `parseReviewRecords`;
  - `reviewEvidenceIssues`;
  - check 32;
  - package external-gate wording.
- Observed defect:
  - The current empty/pending state is represented honestly.
  - The report overstates this as full future evidence binding.
  - Validation cannot authenticate reviewer identity or cryptographically prove that a human review occurred.
  - Current checks do not provide a complete independent transition model for specialist, linguistic, and accessibility reviews.
- Required bounded guarantee:
  - The validator may prove table structure, required fields, review type, declared version/hash relationship, declared scope, declared outcome, and internal status consistency.
  - It must never claim to verify a human identity, qualification, signature, truthfulness, or cryptographic provenance unless a later approved system actually provides that evidence.
  - Current review rows remain empty.
  - Current specialist, linguistic, and accessibility statuses remain pending.
  - A row for one review type cannot satisfy another.
  - Runtime and release remain refused.
- Required correction:
  - Narrow README and implementation-report claims to the structural guarantee actually implemented.
  - Describe full evidence-backed lifecycle transitions as a later pre-runtime governance requirement.
  - Ensure no synthetic “R. Example” test is described as proof of a real review.
  - Validate allowed review types and reject unknown types deterministically.
  - Validate complete versus placeholder fields and version/hash syntax consistently with the column label.
  - If R2 retains future-row helper tests, label them structural fixture tests only.
- Deterministic codes:
  - missing/incomplete structural evidence: `STATUS_REVIEW_EVIDENCE_MISSING`;
  - unexpected row while all canonical gates are pending: use `STATUS_REVIEW_EVIDENCE_UNEXPECTED` or an existing semantically exact code;
  - unknown review type: use `STATUS_REVIEW_TYPE_INVALID` or an existing semantically exact code.
- Positive proof: empty canonical table plus all external gates pending passes draft validation and release remains refused.
- Negative proof:
  - unexpected row while canonical state remains pending;
  - missing field;
  - placeholder field;
  - mismatched version/hash;
  - unknown review type;
  - one gate’s row reused for another.
- Prohibited interpretation: structural validation is not identity verification, specialist approval, linguistic approval, accessibility approval, or authorization.
- Schema impact: none unless an existing review-record schema already owns these fields; do not create a parallel review store.
- Acceptance criterion: every document states the same bounded structural guarantee and no validator/report claims external authenticity or approval.
- External boundary: actual reviews remain pending.

### MARZI-021-R2-C005 — Make no-write assurance both effective and bounded

- Related original correction: MARZI-021-C004
- Severity: MEDIUM
- Approval blocking: YES under the R2 correction review
- Files:
  - `test/learning-contracts.js`
  - `docs/learning/contracts/v1/README.md`
  - `docs/IMPLEMENTATION_REPORT.md`
- Locations:
  - `WRITE_METHODS`;
  - `PROMISE_WRITE_METHODS`;
  - `blockWrite`;
  - `fingerprint` and `protectedFingerprint`;
  - checks 28 and 36.
- Observed defects:
  - Check 36 treats any thrown error as guard success.
  - The nonexistent probe parent lets an unguarded filesystem call throw `ENOENT`.
  - The recorded-violation assertion tolerates one unrecorded route.
  - Applicable descriptor/FileHandle metadata routes are not fully covered.
  - Content-only regular-file fingerprints cannot detect permission metadata changes.
  - Documentation overstates protected-tree checks as universal impossibility of writes.
- Required correction:
  - Give every deliberate probe an expected guard category and assert that the guard itself produced it.
  - An incidental `ENOENT`, `TypeError`, or other native error must fail the probe.
  - Treat unavailable `fetch` explicitly as not applicable rather than allowing an unexplained missing violation.
  - Do not tolerate an unrecorded applicable route.
  - Cover applicable callback, sync, promises, descriptor, write-mode open, link/symlink, and metadata routes.
  - Prevent acquisition of a writable FileHandle. If the validator does not require `fs.promises.open`, refusing that API entirely is acceptable and narrower than attempting incomplete FileHandle monkey-patching.
  - Guard applicable `fchmod`, `fchown`, `futimes`, and platform-available link metadata methods, or explicitly exclude unavailable APIs after feature detection.
  - Fingerprint the declared protected scope using path, file type, content hash for regular files, mode where it matters, and symlink target for links.
  - State the exact protected scope: correction-owned learning contracts, learning fixtures, and validator source. Do not claim the mechanism proves that no possible JavaScript program can write anywhere.
- Deterministic codes:
  - missing guard interception: `WRITE_GUARD_NOT_TRIGGERED`;
  - protected-scope mutation: `VALIDATOR_MUTATED_TREE`;
  - prohibited network/process route: retain the current stable category or introduce one exact non-duplicative category.
- Positive proof:
  - read-only sync open works;
  - stdout/stderr work;
  - protected fingerprints remain identical;
  - validator completes without write/network violations.
- Negative/mutation proof:
  - disable one guard route at a time in an isolated in-memory or disposable-copy mutation test;
  - each mutation fails because the expected guard record is absent, not because native I/O incidentally throws;
  - metadata mutation path is refused;
  - write-mode open/FileHandle acquisition is refused;
  - a protected hash/type/mode/link-target change is detected.
- Prohibited interpretation: do not claim cryptographic sandboxing, operating-system confinement, or universal prevention.
- Schema/fixture impact: no contract schema change. Prefer in-code adversarial cases; do not create JSON fixtures for filesystem operations.
- Acceptance criterion: every applicable route has a one-to-one expected guard result, no unexplained tolerance remains, and documentation states only the bounded proven assurance.
- Product Owner/specialist boundary: none.

### MARZI-021-R2-C006 — Bound supersession integrity to what v1 proves

- Related original correction: MARZI-021-C006
- Severity: MEDIUM
- Approval blocking: claim accuracy required; non-null supersession remains prohibited
- Files:
  - `docs/learning/contracts/v1/schema/scenarios.schema.json`
  - `docs/learning/SCENARIO_OBJECTIVE_SCHEMA.md`
  - `docs/learning/contracts/v1/README.md`
  - `docs/IMPLEMENTATION_REPORT.md`
  - `test/learning-contracts.js`
  - existing supersession fixtures and manifest entries
- Locations:
  - `supersedes` property;
  - `supersedesIssues`;
  - check 34.
- Observed defect:
  - Current v1 correctly permits only null.
  - The future-version test accepts membership in a caller-supplied predecessor set but does not prove immutable earlier-version ownership, complete existence checks, duplicate-successor policy, or graph acyclicity.
  - The report overstates structural checks as complete referential integrity.
- Required R2 guarantee:
  - v1 null passes.
  - malformed non-null fails schema validation.
  - every syntactically valid non-null v1 value fails with `SUPERSEDES_REF_INVALID`.
  - self-reference and unknown reference fail.
  - no v1 artifact claims a predecessor registry exists.
- Required correction:
  - Preserve current null-only v1.
  - Remove or clearly relabel the synthetic v2 membership test so it cannot be cited as full version-graph integrity.
  - Document that existence across immutable earlier versions, version ordering, duplicate successor behavior, and cycle detection are required before non-null supersession is enabled.
  - Do not invent split/merge policy.
- Positive proof: all 94 current objectives have `supersedes: null`.
- Negative proof:
  - malformed value;
  - syntactically valid non-null v1 value;
  - self-reference;
  - unknown reference.
- Mutation: set one real v1 objective’s value non-null and require deterministic failure.
- Prohibited interpretation: do not claim future version graph validation is complete.
- Schema impact: retain the existing objective-ID pattern and null type; no parallel identity syntax.
- Acceptance criterion: documentation and tests claim exactly null-only v1 safety, and all non-null use remains blocked pending a later versioned migration design.
- Product Owner boundary: no decision is needed to keep non-null disabled.

### MARZI-021-R2-C007 — Align negative-fixture documentation with exact isolation

- Related original correction: MARZI-021-C007
- Severity: LOW
- Approval blocking: required for internal consistency
- Files:
  - `test/fixtures/learning/invalid/manifest.json`, top-level `note`
  - `test/fixtures/learning/README.md`
  - `docs/IMPLEMENTATION_REPORT.md`
- Observed defect: the manifest says the expected reason merely has to appear among reported codes, while check 27 correctly requires the deduplicated emitted-code set to equal the single declared reason.
- Required correction:
  - State that each fixture must fail for exactly its declared `expectedReason`, with no unrelated distinct reason code.
  - Keep the existing scalar property; do not add a parallel reason field.
  - Preserve duplicate occurrences of the same code as acceptable after deduplication.
- Validator impact: retain exact-set behavior and `FIXTURE_UNEXPECTED_REASON`.
- Proof:
  - exact single code passes;
  - absent expected code fails;
  - expected plus unrelated code fails;
  - repeated same code passes after deduplication;
  - undeclared or missing fixture fails.
- Acceptance criterion: manifest, README, validator, and implementation report describe the same exact-isolation behavior.

### MARZI-021-R2-C008 — Bound dynamic-execution detection accurately

- Related original correction: MARZI-021-C008
- Severity: LOW
- Approval blocking: required for claim accuracy
- Files:
  - `test/learning-contracts.js`
  - `docs/learning/contracts/v1/README.md`
  - `docs/IMPLEMENTATION_REPORT.md`
- Locations:
  - `DYNAMIC_EXECUTION_PATTERNS`;
  - `dynamicExecutionIssues`;
  - module-loader guard;
  - checks 01 and 36.
- Observed defect:
  - Direct listed constructs are detected.
  - The implementation is a bounded regex/source-policy scan, not universal dynamic-execution prevention.
  - Executable-looking syntax in comments may false-fail.
  - Indirect eval, computed global access, reflective Function construction, or dynamic VM import can be outside current detection.
- Required correction:
  - State the exact supported guarantee: direct prohibited constructs in validator source are rejected; direct `vm` module requests are blocked; repository contract data is parsed and never executed.
  - Do not claim universal detection of every JavaScript metaprogramming path.
  - Either make the source scan token/comment aware for the supported syntax or document executable-looking comments as intentionally rejected policy syntax.
  - Add adversarial tests for each construct the implementation claims to detect.
  - Include indirect forms as negative assurance tests only if the implementation is extended to support them; otherwise list them explicitly outside the bounded scan and ensure no documentation claims they are covered.
- Deterministic code: `DYNAMIC_EXECUTION_FORBIDDEN`.
- Positive proof:
  - canonical validator source passes;
  - benign ordinary prose passes according to the documented policy;
  - static JSON extraction remains read-only.
- Negative proof:
  - direct eval call;
  - Function constructor;
  - new Function;
  - AsyncFunction;
  - GeneratorFunction;
  - direct node:vm require;
  - supported VM execution API.
- Required mutation: introduce one directly prohibited construct into an isolated copy and prove deterministic detection. Do not execute the construct.
- Acceptance criterion: tests, helper behavior, README, and report describe the same bounded set, with no universal-prevention claim.
- Product Owner/specialist boundary: none.

### MARZI-021-R2-C009 — Correct implementation provenance

- Related finding: R1 documentation provenance finding
- Severity: MEDIUM
- Approval blocking: YES for auditable handoff
- File: `docs/IMPLEMENTATION_REPORT.md`, current R1 header around lines 1861–1868 and rollback section
- Observed defect: commit `4ec0123198ba830320fdca7e20b25b53c84bb0d1` is labeled “Corrected implementation” although it is the original MARZI-021 implementation under correction.
- Required correction:
  - Label `4ec0123` “Original MARZI-021 implementation under correction.”
  - Preserve `b47a9eb7` as the mandate-transfer commit.
  - Describe `23f2179` as the MARZI-021-R1 correction baseline reviewed with verdict `CHANGES REQUIRED`.
  - Append R2 evidence; do not rewrite earlier historical evidence.
  - Because a commit cannot contain its own final SHA in advance, call it “the commit containing this MARZI-021-R2 report” inside the committed document. The final external report must supply the actual SHA.
- Validator/schema impact: none.
- Acceptance criterion: every historical commit has one accurate role and rollback provenance is unambiguous.

## 5. Completion and evidence boundaries

The implementation must preserve these separations:

- Objective evidence: one observation tied to an objective criterion, attempt, opportunity, response, and curriculum version.
- Objective completion: derived from required criterion outcomes only under the five-state precedence.
- Objective mastery: a separate longitudinal projection; one completion result cannot directly assign mastery.
- Scenario completion: only the conjunction of declared required objective completion results; no new aggregate learner property.
- Placement: optional, bounded, skippable, recommendation-only, revisable, and unable to mark completion or mastery.
- Review/remediation: independent of reward removal; non-complete states retain further-evidence opportunities.
- Accessibility accommodation: may change collection method, never evidence meaning, completion derivation, or mastery standards.
- Assistance: recorded separately and cannot silently substitute for independent evidence.
- XP, coins, rewards, streaks, rank, evolution, Store state, elapsed time, hang-up, visit count, and `scenariosDone`: never evidence of objective completion or mastery.

## 6. Allowed file scope

R2 may modify only:

- `docs/packages/MARZI-021.md`
- `docs/IMPLEMENTATION_REPORT.md`
- `docs/learning/SPECIALIST_REVIEW.md`
- `docs/learning/SCENARIO_OBJECTIVE_SCHEMA.md`
- `docs/learning/contracts/v1/README.md`
- `docs/learning/contracts/v1/completion.json`
- `docs/learning/contracts/v1/schema/completion.schema.json`
- `docs/learning/contracts/v1/schema/objective-result.schema.json`
- `docs/learning/contracts/v1/schema/scenarios.schema.json`
- `test/learning-contracts.js`
- `test/fixtures/learning/README.md`
- `test/fixtures/learning/invalid/manifest.json`
- existing JSON fixtures under `test/fixtures/learning/valid/` and `test/fixtures/learning/invalid/` only when directly required to prove an R2 invariant;
- new JSON fixtures in those same two directories only if an R2 invariant cannot be proven by extending an existing fixture or by a bounded in-memory validator adversarial case.

Stage only R2-owned files. Do not mechanically reformat unchanged contracts or fixtures.

## 7. Prohibited scope

Do not change:

- `public/index.html`
- `server.js`
- `public/sw.js` or any `sw.js`
- `public/manifest.webmanifest` or any manifest
- `package.json`
- lockfiles
- runtime JavaScript
- providers
- prompts
- `ConversationSession`
- transcript behavior
- storage or learner data
- XP
- coins
- rewards
- streaks
- economy
- timers
- Marzi evolution
- outfits
- Store
- Profile
- navigation
- Android Back behavior
- icons or assets
- dependencies
- deployment configuration
- `.github/**`
- `.ai/bin/**`
- `docs/MARZI_DECISION_REGISTER.md`
- `main`

Expected runtime diff: EMPTY.

Expected dependency diff: EMPTY.

Expected configuration diff: EMPTY.

Expected deployment diff: EMPTY.

The Arabic 320×568 / 200%-text overflow remains deferred to presentation/runtime integration. Do not modify UI to address it.

## 8. Schema, validator, fixture, and mutation rules

1. Reuse existing property names and schemas.
2. Do not create a parallel result, status, evidence, review, or identity field.
3. Keep `additionalProperties: false` wherever it is already strict.
4. Add no defaults for open educational gates.
5. Do not silently coerce unknown values.
6. Do not weaken a fixture to make validation pass.
7. Each negative fixture must isolate its declared unique reason-code set.
8. Every validator helper must be deterministic, dependency-free, network-free, and bounded to repository inputs.
9. Validator self-tests must not write repository files.
10. Mutation tests must operate on in-memory clones or a documented isolated disposable copy and must be reverted before final scope validation.
11. Report actual post-correction check and fixture counts. Do not assume that the R1 counts remain unchanged if tests are added.
12. Keep accepted curriculum inventory counts exact.

## 9. Documentation-validator baseline exception

The nine `.ai/bin/docs-validate` failures are a verified pre-existing governance-tooling mismatch:

- the same validator blob exists at governance baseline and R1;
- the same Decision Register blob exists at governance baseline and R1;
- D009 and D016 are correctly approved;
- the obsolete validator expects four OPEN-only fields for each approved decision and exactly 25 OPEN index records;
- this yields eight obsolete-field failures plus one OPEN-count failure.

R2 must:

- preserve D009 and D016 as approved;
- preserve the exact nine-failure exception unless an unrelated new failure is introduced;
- not modify `.ai/bin/**`;
- not modify `docs/MARZI_DECISION_REGISTER.md`;
- keep the owner-side follow-up `MARZI-GOV-001 — Decision-validator approved-state support` separate;
- fail R2 validation if the documentation-validator failure set changes or grows.

The exception is non-blocking only when it remains exactly the verified baseline set.

## 10. Accepted static inventories

Preserve exactly:

- 29 scenarios;
- 94 variants;
- 19 German scenarios and 61 German variants;
- 10 English scenarios and 33 English variants;
- 564 localized objective titles;
- 282 required criteria;
- 94 optional criteria;
- 18 prerequisite edges;
- an acyclic prerequisite graph;
- four explicit open gates;
- release-mode refusal of the provisional draft.

Do not change scenario identity, goal text, mapping, ordering, stable identifiers, competency meaning, or open gate values.

## 11. Execution order

1. Fetch the current development branch once.
2. Verify clean tree, exact branch, local/remote baseline `23f2179`, protected main, and ancestry.
3. Inspect the allowed files once.
4. Produce one concise internal execution plan.
5. Apply R2-C001 and R2-C002 status corrections.
6. Apply R2-C003 completion contract/validator binding.
7. Apply R2-C004 bounded external-review claim corrections.
8. Apply R2-C005 no-write guard and proof corrections.
9. Apply R2-C006 supersession claim correction.
10. Apply R2-C007 fixture-documentation correction.
11. Apply R2-C008 bounded dynamic-execution correction.
12. Apply R2-C009 provenance correction.
13. Update only directly affected schemas, fixtures, README material, and the appended implementation report.
14. Run one correction-focused validation batch.
15. Fix root causes without unrelated refactoring.
16. Run one final complete validation batch.
17. Perform exact scope, runtime, dependency, configuration, deployment, and Git audits.
18. Stage only R2-owned files.
19. Create one isolated commit.
20. Push once normally.
21. Verify local/remote equality and ahead/behind 0/0.
22. Produce the final implementation report.

Do not run micro-validations after every edit.

## 12. Required validation

### Correction-focused batch

Run and report:

- JavaScript syntax for `test/learning-contracts.js`;
- schema parsing and strict validation for every changed contract/schema;
- completion truth-table exhaustiveness;
- contract condition/executable derivation agreement;
- condition-only drift mutation;
- optional-criterion invariance;
- accommodation invariance;
- exact package-status validation;
- duplicate, unknown, missing, and incorrect status mutations;
- false specialist-approval claim mutations;
- external-review bounded-claim checks;
- exact guard-interception checks;
- one-disabled-guard mutations;
- v1 null-only supersession checks;
- exact fixture reason isolation;
- bounded dynamic-execution cases and mutation;
- release-mode refusal and open-gate preservation.

### Final complete batch

Run and report actual commands, exit codes, counts, and PASS/FAIL:

- `node --check server.js`
- `node --check test/run.js`
- `node --check test/learning-contracts.js`
- `node test/conflict-markers.js`
- `node test/learning-contracts.js`
- `node test/run.js`
- `git diff --check`
- documentation validation, preserving only the exact approved nine-failure baseline exception;
- required static inventory counts;
- positive fixture count;
- negative fixture count;
- distinct negative reason-code count;
- mutation count and result for every mutation;
- release-mode issue count and categories;
- runtime-diff audit;
- dependency-diff audit;
- configuration-diff audit;
- deployment-diff audit;
- changed-file scope audit;
- branch, HEAD, upstream, ahead, behind, and clean-tree verification.

The application regression suite must remain at its existing count or higher and have zero failures. Learning-contract checks may increase but must have zero failures. Report actual counts; do not copy expected values into the result column.

## 13. Binary acceptance criteria

R2 is complete only if all statements are true:

1. The branch started at exact synchronized baseline `23f217924f4bd795eee94adc7c519326f45e1fa9`.
2. Every R2 correction ID C001 through C009 is implemented.
3. No sentence claims or implies that a learning specialist approved MARZI-021.
4. The canonical status table contains every required dimension exactly once and no unknown dimension.
5. Every canonical current status has the exact approved R2 value.
6. A condition-only completion-contract mutation fails deterministically.
7. Contract, schema projection, executable derivation, truth table, fixtures, and documentation express the same five-state model.
8. Partial, not-complete, and insufficient-evidence semantics do not overlap.
9. Optional criteria and accommodations cannot change completion improperly.
10. Missing evidence is never converted into learner failure.
11. No educational threshold, percentage, weight, score, interval, content, certification claim, or aggregate learner property was invented.
12. External-review claims are explicitly structural and do not claim identity or authenticity verification.
13. No-write checks require the expected guard interception rather than any incidental thrown error.
14. No applicable guard route is silently tolerated.
15. No-write documentation states only the exact protected scope.
16. Supersession remains null-only in v1 and no complete future graph guarantee is claimed.
17. Fixture documentation matches exact reason isolation.
18. Dynamic-execution documentation matches the bounded constructs actually detected.
19. Implementation commit provenance is accurate.
20. All accepted inventory counts remain exact.
21. All four open gates remain open.
22. Release mode continues to refuse the provisional draft.
23. The documentation-validator failure set remains exactly the approved nine-failure baseline.
24. Runtime, dependency, configuration, and deployment diffs are empty.
25. No prohibited file changed.
26. All required technical validations pass, apart from the exact approved documentation-validator exception.
27. One isolated R2 commit exists.
28. The commit was pushed once normally.
29. The working tree is clean.
30. Local HEAD equals remote HEAD, with ahead 0 and behind 0.

## 14. Git and delivery policy

- Work only on `claude/marzi-017-product-refinement`.
- Baseline must be `23f217924f4bd795eee94adc7c519326f45e1fa9`.
- Never modify `main`.
- No merge.
- No rebase.
- No squash.
- No force push.
- No tag.
- No deployment.
- No publishing.
- No PR creation.
- Stage only R2-owned files.
- Create exactly one isolated correction commit.
- Recommended commit message:

`MARZI-021-R2: resolve review findings and specialist status claims`

- Push once normally only after validation passes.
- End with a clean tree and local/remote ahead 0, behind 0.

## 15. Rollback

The R2 correction must remain independently reversible.

- Preserve the governance baseline, original MARZI-021 implementation, mandate-transfer commit, and R1 correction.
- Introduce no runtime or user-data migration.
- Delete no learner data.
- Document the actual 40-character R2 commit SHA.
- In the final report, provide an executable rollback command consisting of `git revert ` followed immediately by the actual R2 commit SHA. Do not leave angle brackets or a placeholder in the reported command.
- Do not execute rollback.

## 16. Final implementation report

Report:

- package status;
- branch;
- protected-main SHA;
- R2 baseline;
- original implementation commit;
- R1 correction commit;
- R2 correction commit;
- local HEAD;
- remote HEAD;
- ahead/behind;
- clean or dirty state;
- files created;
- files modified;
- files deliberately untouched;
- every R2 correction ID and disposition;
- completion-condition binding implementation;
- canonical-status corrections;
- external-review bounded guarantee;
- no-write bounded guarantee;
- supersession bounded guarantee;
- dynamic-execution bounded guarantee;
- schema changes;
- validator changes;
- fixture changes;
- actual positive/negative/reason-code counts;
- mutation inventory and result;
- exact validation commands, exit codes, counts, and results;
- accepted curriculum inventories;
- open-gate and release-refusal results;
- documentation-validator baseline disposition;
- runtime/dependency/configuration/deployment diff results;
- scope audit;
- remaining specialist, linguistic, accessibility, Android, runtime, production, deployment, and release gates;
- exact rollback command using the real R2 commit SHA;
- push result;
- synchronization result.

Include a self-contained independent Codex-review handoff that instructs Codex to review only the exact range from `23f217924f4bd795eee94adc7c519326f45e1fa9` to the actual R2 correction SHA, verify R2-C001 through R2-C009, confirm all prohibited diffs remain empty, and return one of:

- `APPROVED FOR SPECIALIST REVIEW`
- `CHANGES REQUIRED`
- `BLOCKED`

The successful report must end exactly:

`CORRECTION COMPLETE — READY FOR INDEPENDENT REVIEW`

If implementation or validation is incomplete, end exactly:

`CHANGES REQUIRED`

If a hard stop condition occurs, end exactly:

`BLOCKED`
