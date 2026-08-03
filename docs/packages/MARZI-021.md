# MARZI-021 — Learning Competency, Curriculum, and Mastery Model

## 1. Package identity

| Field | Value |
|---|---|
| Package ID | MARZI-021 |
| Canonical title | Learning Competency, Curriculum, and Mastery Model |
| Program area | Foundation / learning system |
| Specification owner | Codex |
| Implementation owner | Claude Code |
| Product decision owner | Product Owner with learning lead |
| Independent reviewer | Codex |
| Specification baseline | `ee88e0e2ecde8bcccb38c37ef7710c7e4f31bad4` |
| Specification status | COMPLETE |
| Implementation status | **READY FOR REVIEW** — the static contracts, schemas, fixtures, validator, and documentation are implemented; specialist, accessibility, and localization sign-off remain required before runtime integration or release |
| Implementation commit | Recorded in `docs/IMPLEMENTATION_REPORT.md` under "Implementation Report — MARZI-021" |
| Implementation baseline | `0798cd894865b57d67cff6e824f3264ccf673bc0` |
| Curriculum version delivered | `v1-draft` — release-mode validation refuses it by design |
| Learning specialist status | Not yet named; assignment/sign-off was not a blocker for static contract authoring and remains mandatory before educational approval, runtime integration, or production release. See `docs/learning/SPECIALIST_REVIEW.md` |
| Runtime changes | None. `public/**` and `server.js` have an empty diff |

This is the first package after MARZI-020. Its title and purpose are copied from
the canonical roadmap and are not reinterpreted.

### Canonical status

This table is the single authoritative statement of where MARZI-021 stands.
Any other wording in this repository that contradicts it is stale.

| Dimension | State |
|---|---|
| MARZI-D009 | APPROVED |
| MARZI-D016 | APPROVED |
| Taxonomy and mastery presentation | APPROVED IN PRINCIPLE |
| Static authoring | AUTHORIZED |
| Static implementation | COMPLETE |
| Package governance status | READY FOR REVIEW |
| Independent approval | NOT GRANTED |
| Learning-specialist review | PENDING |
| Six-language linguistic review | PENDING |
| Accessibility review | PENDING |
| Moderated Android study | PENDING |
| Runtime integration | NOT AUTHORIZED |
| Production approval | NOT AUTHORIZED |
| Deployment | NOT DEPLOYED |
| Release | NOT RELEASED |

MARZI-D009 and MARZI-D016 are formally APPROVED. Static contract authoring is
AUTHORIZED. MARZI-021 implements static, versioned learning contracts, schemas,
fixtures, validation, and supporting documentation. It introduces no runtime
integration. Following correction, the package is READY FOR REVIEW.
Learning-specialist, six-language linguistic, accessibility, and moderated
Android reviews remain PENDING. Runtime integration and production approval are
NOT AUTHORIZED. MARZI-021 is NOT DEPLOYED and NOT RELEASED.

READY FOR REVIEW means the MARZI-021-R1 correction awaits an independent Codex
review. It is not an approval, and the implementer does not grant one.

## 2. Objective

Define what Marzi teaches and the evidence required for participation,
objective completion, scenario completion, mastery, placement, and review.
Produce a versioned, target-language-neutral competency taxonomy and map every
current production scenario goal to a stable measurable objective without
changing runtime behavior, prompts, rewards, storage, or scenario identity.

## 3. User problem

Learners currently see activity, XP, map completion, a holistic speaking score,
and post-call AI feedback, but those signals do not share a validated learning
model. A learner can therefore appear to have completed a scenario without
evidence that its real-world outcome was achieved, while XP can be mistaken for
mastery. Placement, review, assistance, and future recommendations cannot be
trustworthy until these concepts have explicit boundaries.

## 4. Current evidence

All line references describe baseline `ee88e0e`.

| Evidence | Location | Architectural implication |
|---|---|---|
| German scenario pack | `public/index.html:1953-2015`, `2593-2677` | 19 production scenarios; goals are free-text strings. |
| English pilot pack | `public/index.html:2804-2886` | 10 production scenarios; same untyped goal shape. |
| Target selection | `public/index.html:2897-2905` | Active pack swaps by target at load; objective IDs must be target-qualified. |
| Current inventory | `docs/learning/CURRENT_SCENARIO_AUDIT.md` | 29 production scenarios and 94 goal variants require mapping. |
| Runtime levels | `public/index.html:2017-2030`, `2555-2569` | A0–C1 affects conversational difficulty, not demonstrated mastery. |
| Goal selection/session start | `public/index.html:6841-6864` | A free-text goal is randomly selected and passed into ConversationSession. |
| Scenario map state | `public/index.html:4077-4115` | `scenariosDone > 0` marks a node done. |
| Call recording | `public/index.html:3269-3288` | Any call with a learner turn can increment the scenario count after reward claim. |
| Post-call evaluation | `public/index.html:6269-6323` | Free-form AI returns true/false/partial, with no typed criteria or cited opportunity evidence. |
| Weekly test | `public/index.html:6386-6463` | Generated holistic CEFR/0–100 output is not a calibrated competency placement model. |
| Guided practice | `public/index.html:2699-2802`, `6526-6740` | Scripted dialogue/preparation have support signals but no common evidence contract. |
| Existing tests | `test/run.js:194-222`, `1430-1454` | Structural scenario and call-count behavior is covered; learning validity is not. |
| Canonical product principle | `docs/MARZI_PRODUCT_BIBLE.md:60-74` | XP is not mastery; insufficient evidence and acoustic integrity are required. |
| Canonical package scope | `docs/MARZI_MASTER_ROADMAP.md:58-80` | Requires taxonomy, schema, prerequisites, completion, mastery, placement, review, and assistance-sensitive evidence. |
| Product decisions | `docs/MARZI_DECISION_REGISTER.md:185-200`, `304-319` | MARZI-D009 and MARZI-D016 are recorded as APPROVED; they no longer block static implementation. |

Discovery conclusion: the architecture is stable enough for static contract
work, and the governing product decisions are now approved. There is still no
justification for runtime work before learning-specialist, linguistic, and
accessibility review.

## 5. In scope

The blocking product gates are satisfied. MARZI-021 implements only:

1. A versioned competency taxonomy matching the approved
   `docs/learning/LEARNING_MODEL.md` direction.
2. A versioned scenario-objective schema and dependency-free schemas.
3. One stable mapping for every current production goal variant:
   - German: 19 scenarios / 61 goal variants;
   - English pilot: 10 scenarios / 33 goal variants;
   - `random` and `custom` excluded from finite coverage.
4. Acyclic recommended prerequisite metadata.
5. Approved participation, meaningful-attempt, partial/full completion, and
   `insufficient_evidence` semantics.
6. Mastery state/confidence policy data approved by the Product Owner and
   learning specialist.
7. The approved placement contract boundary from MARZI-D009; no onboarding UI.
8. Review-candidate rules based on evidence quality, recency policy, transfer,
   and assistance.
9. Assistance-sensitive evidence fields for OFF/HINT/FULL without choosing an
   assistance default.
10. Dependency-free schema/coverage/negative-fixture validation.
11. Documentation of every mapping, validation result, decision, limitation,
    and specialist sign-off.

## 6. Explicitly out of scope

- Any change to `public/index.html`, `server.js`, PWA files, assets, providers,
  prompts, `ConversationSession`, `PromptBuilder`, or backend interfaces.
- Runtime loading or rendering of the new learning contracts.
- Changing current free-text goals or their random selection.
- Changing `scenariosDone`, journey state, existing learner storage, or map UI.
- Placement/onboarding UI, microphone permission timing, or calibration content
  delivery.
- XP/reward/coin/streak formula, eligibility, anti-farming, economy, prices,
  rank, Marzi stage, Premium, usage, or Store behavior.
- Pronunciation scoring, acoustic processing, raw-audio storage, accent claims,
  or speech-rate grading.
- New scenarios, characters, target languages, dialogue content, or generated
  production content.
- Hard-locking scenarios through prerequisites.
- Analytics, accounts, cloud synchronization, research, or retention changes.
- Product decisions not already approved and recorded.

## 7. Frozen contracts

The implementation must preserve, byte-for-byte where practical and otherwise
semantically with existing regression guards:

- `ConversationSession` as canonical session/transcript authority;
- `createTranscript` and ordered utterance semantics;
- provider registry, AIProvider, SpeechProvider, VoiceProvider;
- PromptBuilder, system prompt, and role-play prompt;
- backend API interfaces;
- scenario and character IDs, roles, places, voices, current goal strings, and
  target selection;
- reward ledger and idempotency;
- learner rank separately from Marzi evolution;
- Marzi XP thresholds `0, 150, 400, 800, 1500, 2600`;
- current XP formula and reward values, including 20 coins on the existing path;
- outfit and minute-pack prices, `buyPack`, usage minutes, and 10 MB/minute
  presentation relationship;
- existing localStorage schemas and all learner data;
- `isPremium() === false` and presentation-only Premium;
- current UI, accessibility behavior, PWA behavior, and production assets.

The word “completion” in new learning contracts must not silently change the
legacy `scenariosDone` reader or historical data.

## 8. Product decisions already approved

The canonical documents establish:

- conversation practice serves explicit competencies/objectives;
- participation, completion, mastery, XP, and currency are distinct;
- XP is not evidence of mastery;
- “not enough evidence” is valid;
- learner speech stays exact and correction stays separate;
- pronunciation claims require valid acoustic evidence;
- target, interface, and explanation languages are independent axes;
- German is live and English is pilot at this baseline;
- existing scenario/character identities remain unchanged;
- accessibility accommodation must not reduce learning/reward standing; and
- static curriculum work may not change reward/business rules.

The Product Owner approved the following on 2026-08-03:

- MARZI-D009 Option A: optional, bounded placement calibration, with skip,
  revisable recommendations, confidence/insufficient-evidence states,
  accessibility accommodations separated from mastery standards, and no
  certification claim.
- MARZI-D016 Option A: objective-based completion with explicit Partial and
  Insufficient Evidence states, non-punitive copy, remediation/further-evidence
  opportunities, accessibility accommodations separated from mastery evidence,
  and no certification claim.
- In-principle static-contract use of the competency taxonomy, objective
  families, stable competency/objective identifiers, mastery presentation
  states, objective-based completion copy, and six-language-compatible domain
  architecture.

These approvals release MARZI-021 static, versioned, dependency-free contract
authoring. They do not authorize runtime integration or constitute educational,
linguistic, accessibility, or production approval.

## 9. Remaining gates and later decisions

### Static authoring authorization

A learning specialist is not yet named. Product Owner authorization permits
static contract authoring and dependency-free validation before specialist
assignment or sign-off. Unreviewed pedagogical content must remain explicitly
marked as pending specialist review.

### Specialist and release gates

Before educational approval, runtime integration, or production release:

- a learning specialist must review the 94 variant mappings, A0–C1 boundaries,
  rubrics, evidence rules, prerequisite graph, aggregation policy, and fixtures;
- qualified six-language linguistic review remains mandatory;
- accessibility review remains mandatory; and
- specialist findings must be incorporated as versioned corrections without
  silently changing stable identifier meaning.

### Decisions supported but not selected by this package

- MARZI-D011 assistance default/persistence;
- MARZI-D014–D019 XP eligibility, meaningful reward call, numeric economy,
  anti-farming, and pronunciation;
- MARZI-D021/D022/D024 analytics, sync, and retention.

Those decisions do not prevent static schema design, but their behavior and
values must remain absent. MARZI-D008 governs onboarding length and is not a
MARZI-021 blocker; this package defines no onboarding flow.

## 10. Asset requirements

None. No artwork, audio, portrait, icon, board crop, or generated asset is
allowed. Objective content is text/data and must be authored/reviewed by the
learning/content team rather than inferred from concept-board artwork.

## 11. Architecture

MARZI-021 creates static, versioned learning contracts only.

```text
current scenario source (read-only inventory)
  -> versioned competency and objective contracts
  -> dependency-free validation + negative fixtures

future approved flow (not implemented here):
ConversationSession events
  -> offered opportunity / response references
  -> learning evidence evaluator
  -> objective result
  -> mastery and review projection
  -> presentation adapter

objective result + later approved economy policy
  -> reward calculation (MARZI-043, not MARZI-021)
```

Dependency direction rules:

- Curriculum contracts do not import application/UI modules.
- Validation reads current scenario source only to detect coverage/drift.
- Learning contracts contain no provider invocation or prompt text builder.
- Learning evidence references canonical turn/response IDs; it does not create
  another transcript.
- Rewards may later consume approved learning results, never the reverse.
- MARZI-022 owns final runtime domain/event boundaries before integration.

## 12. State ownership

| State | Canonical owner in/after this package |
|---|---|
| Scenario and current free-text goal | Existing target scenario registry; unchanged |
| Competency/objective/prerequisite definitions | Versioned static MARZI learning contracts |
| Ordered utterances | ConversationSession; unchanged |
| UI turn mirror | Existing presentation path; unchanged in this package |
| Opportunity/observation/objective result | Schema only in MARZI-021; future learning-domain owner finalized in MARZI-022 |
| Mastery/review projection | Schema/policy only; no runtime state yet |
| Placement result | Contract boundary only after D009; no runtime state yet |
| Assistance UI/default | Existing/future call UI; MARZI-021 records only evidence shape |
| XP/coins/reward ledger | Existing reward domain; unchanged |
| Legacy `scenariosDone` | Existing stats storage; unchanged and never backfilled as mastery |

## 13. Data/storage changes

Permitted data is repository-static JSON under
`docs/learning/contracts/v1/**`. Every artifact declares `schemaVersion` and
`curriculumVersion`; all IDs are stable and unique.

No runtime storage, localStorage key, cookie, IndexedDB database, server table,
analytics event, transcript record, or user migration is permitted. Static
contracts contain no personal data, audio, transcript, credentials, secrets,
or reward values.

Proposed schemas and examples are defined in
`docs/learning/SCENARIO_OBJECTIVE_SCHEMA.md`.

## 14. Migration strategy

MARZI-021 uses an additive, non-runtime migration:

1. Freeze a source inventory for baseline `ee88e0e`.
2. Map every current production goal string to an immutable target-qualified
   objective variant ID.
3. Validate exact one-to-one source index/text coverage.
4. Keep existing runtime goal arrays, PromptBuilder inputs, scenario selection,
   map state, and storage untouched.
5. Publish no release contract while a completion policy is pending.
6. In a later integration package, introduce a versioned adapter with legacy
   reader parity and rollback.
7. Never infer mastery or approved completion from historical
   `scenariosDone`; retain the count as legacy activity evidence only.

Rollback for this package is simply reverting its static contracts/tests/docs;
there is no learner-data rollback.

## 15. Accessibility

- Learning outcomes and states use plain localized language, not internal IDs.
- `not_enough_evidence`, partial progress, and review rationale are conveyed in
  text and semantics, not color, position, sound, or animation alone.
- The contract supports speech, typed, and deterministic interaction evidence
  where the construct does not specifically require speech.
- Accessibility accommodations are recorded separately from learning help and
  never treated as weak/invalid evidence merely because they were used.
- Placement must have a non-audio path, explained permissions, and extended-
  time usability after D009.
- Moderated review includes TalkBack users or accessibility specialist review
  of objective/progress phrasing.
- No learner is given a pronunciation failure from ASR text.

## 16. Localization/RTL

- Competency IDs are language-neutral; scenario/objective IDs are target-
  qualified.
- Learner-facing objective titles require `es`, `en`, `it`, `tr`, `ar`, `uk`
  parity for the current product.
- Target-language content is not substituted with explanation-language copy.
- Arabic is reviewed in logical reading order with mixed-direction target text,
  numbers, dates, and IDs isolated correctly at presentation time.
- Long translated strings must not be shortened by changing learning meaning.
- Proper names and frozen scenario identities remain unchanged.
- English-pilot objectives are independently authored/validated; German text is
  not assumed to be a culturally complete one-to-one translation.

## 17. Responsive requirements

This static-contract package changes no rendered surface. It may not claim UI
layout acceptance.

Before learning-state copy is approved for later integration, a temporary,
non-production content prototype must demonstrate understandable wrapping at:

- 320×568;
- 360×640;
- 390×844;
- 412×915;
- Arabic RTL;
- 200% text zoom/increased system font; and
- TalkBack reading order.

The prototype is evidence only and must live under a task-owned `/tmp`
directory; it cannot become an unreviewed runtime implementation.

## 18. Performance budget

- Validation must run dependency-free under the repository's supported Node
  runtime and complete within 2 seconds on the current CI class for this
  29-scenario baseline.
- Current v1 contract JSON should remain at or below 250 KiB uncompressed in
  aggregate; exceeding this requires evidence and architect review.
- Validation reads source/contracts once and reuses parsed structures.
- No browser bundle, startup path, provider request, service-worker cache, or
  runtime memory is changed.

These budgets constrain contract quality work; they are not permission to omit
localized or accessibility content.

## 19. Security/privacy

- Direct JSON parsing and argument arrays only; no `eval`, dynamic code, shell
  interpolation, or dependency installation.
- Static contract fields cannot contain executable HTML, JavaScript, event
  handlers, external URLs, or secrets.
- Validator rejects malformed types, unknown IDs, duplicate IDs, cycles,
  unsupported evidence, and unsafe unexpected fields.
- No raw audio, transcript copy, device confidence, credentials, personal
  profile data, analytics, or remote request.
- Objective results are data-minimized references in the future design; exact
  retention remains blocked by MARZI-D024.
- Generated AI prose cannot alter typed evidence/results or satisfy validation.

## 20. Files permitted to change

For the later approved MARZI-021 implementation, Claude Code may change only:

- `docs/learning/**`;
- `docs/packages/MARZI-021.md` only to record approved decisions/status without
  changing scope;
- `test/learning-contracts.js` (new, dependency-free validator/test runner);
- `test/fixtures/learning/**` (new valid/invalid static fixtures);
- `docs/IMPLEMENTATION_REPORT.md` (append MARZI-021 implementation evidence);
- `.ai/quality/IMPLEMENTATION_REPORT.md` if required by active governance; and
- `.ai/quality/ACCEPTANCE_CHECKLIST.md` if required by active governance.

Any additional path requires a written change request and Codex/Product Owner
scope approval before editing.

For this specification commit, only these files are permitted:

- `docs/packages/MARZI-021.md`;
- `docs/learning/README.md`;
- `docs/learning/LEARNING_MODEL.md`;
- `docs/learning/SCENARIO_OBJECTIVE_SCHEMA.md`; and
- `docs/learning/CURRENT_SCENARIO_AUDIT.md`.

## 21. Files forbidden to change

- `public/**`, including `public/index.html`, assets, manifest, and service worker;
- `server.js` and all backend/API/provider code;
- existing `test/run.js`, `test/browser/**`, and frozen regression fixtures;
- `package.json`, lockfiles, dependencies, scripts, build configuration;
- prompts, ConversationSession, createTranscript, PromptBuilder;
- reward, XP, coin, Store, Premium, usage, rank, evolution, and storage code;
- existing scenario/character content and identifiers;
- deployment, CI, secrets, credentials, production configuration;
- main or any protected branch; and
- canonical roadmap/Product Bible/Decision Register except a separately
  approved decision-record task performed by its owner.

## 22. Implementation sequence

1. **Gate check:** Verify MARZI-D009 and MARZI-D016 are APPROVED in the Decision
   Register and the Product Owner approval-in-principle for taxonomy/mastery
   presentation is recorded. Confirm static authoring is the only active scope;
   a named learning specialist is not required to begin this static work.
2. **Baseline check:** Confirm clean branch, expected implementation base, and
   exact scenario inventory (19/61 German, 10/33 English).
3. **Taxonomy authoring:** Encode the approved-in-principle proposed competency
   definitions and A0–C1 boundaries, explicitly marking every item still
   pending specialist review; do not claim educational approval.
4. **Schema creation:** Add v1 schemas with strict fields/enums and release/draft
   mode distinction.
5. **Scenario mapping:** Author 94 stable objective variants, exact source
   mapping, localized titles, competencies, criteria, levels, and review tags.
6. **Completion policy:** Encode only the recorded MARZI-D016 choice; do not
   infer reward semantics.
7. **Placement boundary:** Encode only the recorded MARZI-D009 choice; no UI,
   persistence, or generated assessment content.
8. **Prerequisites/mastery/review:** Add only the documented proposed DAG and
   policy definitions; unresolved numeric constants remain explicit policy
   gates with boundary fixtures rather than invented defaults.
9. **Validator and fixtures:** Add dependency-free structural, coverage,
   negative, drift, level, and DAG tests.
10. **Specialist handoff:** Record that no specialist is yet named and prepare
    the mappings, policies, and evidence for later specialist review. Specialist
    sign-off is mandatory before educational approval, runtime integration, or
    production release, but its absence does not block static authoring.
11. **Repository verification:** Run all required checks, prove runtime diff is
    empty, update implementation evidence, and hand the exact commit to Codex.

No step may be skipped by calling the schema “documentation”; it becomes a
program dependency for later learning/reward work.

## 23. Automated tests

The implementation must run:

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

`test/learning-contracts.js` must independently assert:

1. all contract JSON parses and matches the strict schema;
2. exactly 19/61 German and 10/33 English production coverage;
3. `random`/`custom` excluded and random inheritance explicitly documented;
4. every source goal index/text appears exactly once and drift is detected;
5. unique valid IDs and all references resolve;
6. prerequisite graph acyclic; self/duplicate/unknown edges rejected;
7. exactly six localized objective titles per current language parity;
8. valid A0–C1 ordering and boundary fixtures; unknown/reversed values rejected;
9. `insufficient_evidence` accepted and represented in completion/mastery;
10. unknown/acoustic/pronunciation evidence rejected in v1;
11. XP, coins, prices, entitlements, and reward values absent from contracts;
12. draft policies fail release-mode validation;
13. malformed/duplicate/stale/cross-session evidence fixtures fail with stable
    reason codes;
14. assistance mode/use and accessibility accommodation remain distinct;
15. no file is written and no network/provider call occurs during validation.

Tests that only search source strings are insufficient for schema behavior.
Negative fixtures must be executed and proven to fail for the expected reason.

## 24. Rendered-browser matrix

Production browser testing is not applicable because MARZI-021 must produce no
runtime/browser change. The implementation report must explicitly state “no
runtime browser claims.”

For comprehension evidence only, render approved objective/mastery copy in a
task-owned `/tmp` prototype at:

| Viewport | Language/direction | Required evidence |
|---|---|---|
| 320×568 | Spanish LTR | No clipped copy; semantic state labels readable |
| 360×640 | Spanish LTR | Long partial/insufficient-evidence copy wraps |
| 390×844 | Arabic RTL | Logical mixed-language order and no overflow |
| 412×915 | English LTR | Increased-font/200% zoom remains readable |

No screenshot alone proves comprehension. Report measured width/overflow and
the moderated findings; do not copy prototype code into `public/**`.

## 25. Real-device matrix

At least one small Android device must be used for moderated copy comprehension
after Product Owner approval:

- Spanish LTR and Arabic RTL;
- TalkBack on for at least one pass;
- normal and increased system font;
- objective, partial, complete, not-enough-evidence, developing, secure, and
  review-due explanations;
- confirmation that users do not interpret XP as mastery;
- confirmation that users understand assistance attribution; and
- confirmation that non-audio placement/assessment is described clearly.

This validates wording and semantics only. It does not claim production layout,
runtime scoring, or PWA behavior.

## 26. Regression requirements

- Runtime tree under `public/**` and `server.js` has no diff.
- Prompts, scenario arrays, goal strings/order, providers, and engine have no
  diff.
- Existing complete test suite passes at its baseline count or higher; no test
  is skipped or weakened.
- Frozen reward/economy/XP/storage tests remain unchanged and pass.
- Existing 19-node German journey and English target behavior remain unchanged.
- New validation fails if a production scenario/goal is added, removed,
  reordered, or changed without curriculum mapping review.
- No existing learner data is read, written, reset, or reclassified.
- No service-worker cache bump is made because no runtime asset changes.

## 27. Rollback strategy

Before runtime consumption, rollback is a clean revert of MARZI-021 contract,
fixture, validator, and appended report files. There is no data migration,
cache bump, deployment, or learner-state rollback.

After a later package consumes v1, that package must retain the previous reader
and specify its own feature flag/parity/rollback. MARZI-021 itself cannot
authorize removal of the legacy scenario-goal path.

If content is corrected after approval, publish a new curriculum version with
explicit `supersedes` mappings. Never mutate an ID's meaning in place.

## 28. Evidence required

The implementation handoff must contain:

- exact implementation commit and baseline;
- recorded MARZI-D009 and MARZI-D016 approvals;
- Product Owner approval of taxonomy/objectives/mastery presentation;
- exact learning-specialist assignment/sign-off status, explicitly recording that no specialist is yet named and that sign-off remains mandatory before educational approval, runtime integration, or production release;
- machine-readable coverage report: 29 scenarios / 94 variants;
- complete competency, objective, prerequisite, level, localization, and policy
  validation output;
- proof each invalid fixture failed for the intended reason;
- source-drift report and hashes of approved contract artifacts;
- automated suite output with exact check/test count;
- temporary browser measurement and moderated Android findings;
- `git diff --check` and docs validator output;
- changed-file list proving no runtime/dependency/config/asset change;
- implementation report listing omissions and unverified claims; and
- rollback command/commit identification without executing it.

## 29. Stop conditions

Claude Code must stop and update the approved change-request path if any of the
following occurs:

- MARZI-D009 or MARZI-D016 is missing, contradictory, or no longer APPROVED;
- Product Owner taxonomy/mastery approval-in-principle is missing or changed;
- implementation attempts to claim specialist approval, educational approval,
  runtime integration readiness, or production release readiness before the
  required specialist, accessibility, and localization reviews;
- a source scenario/goal inventory differs from 19/61 German and 10/33 English;
- objective mapping requires changing a scenario identity, prompt, or goal;
- a requested rule would choose XP, coins, rewards, anti-farming, pronunciation,
  placement UI, assistance default, or retention behavior;
- runtime, provider, backend, asset, dependency, test-runner, deployment, or
  protected-branch changes appear necessary;
- a completion rule cannot be expressed deterministically from approved
  criteria;
- localization cannot preserve meaning or a required target is missing;
- validator needs external network, new dependency, secret, or generated AI
  response;
- prerequisite metadata creates a cycle or hard-lock behavior; or
- existing runtime/test files are modified unexpectedly.

Do not guess, reinterpret, simplify, or silently broaden scope.

## 30. Definition of done

MARZI-021 is done only when:

- blocking decisions and approvals are recorded;
- every current production scenario and all 94 goal variants are mapped;
- all taxonomy/schema/prerequisite/mastery/placement/review contracts are
  versioned and internally consistent, with every unreviewed pedagogical item
  explicitly marked pending specialist review;
- specialist, accessibility, and localization gates remain explicit, and no
  runtime integration or release proceeds until their required sign-offs;
- “not enough evidence” is a first-class result;
- mastery is demonstrably independent from XP/rewards/activity counts;
- pronunciation/acoustic claims are absent and rejected;
- assistance and accessibility accommodation are correctly distinguished;
- required positive/negative/drift/level/DAG tests pass;
- existing full suite passes without weakened coverage;
- no runtime, storage, prompt, provider, reward, economy, dependency, asset,
  cache, or deployment file changed;
- required comprehension/device evidence is complete and accurately bounded;
- implementation report and rollback evidence are complete;
- exact commit receives independent Codex approval; and
- status advances from READY FOR IMPLEMENTATION through READY FOR REVIEW under governance.

This governance update alone does not satisfy Definition of Done. It makes
MARZI-021 static contract implementation ready now. Specialist sign-off remains
mandatory before educational approval, runtime integration, or production
release.

## 31. Independent review handoff

Codex must review the exact implementation commit against its recorded base and
return one governance verdict. The review must independently verify:

1. commit/branch/working-tree integrity and changed-file scope;
2. MARZI-D009/D016 approval records, Product Owner taxonomy/mastery approval, accurate specialist-status disclosure, and preservation of the later specialist/runtime/release gates;
3. exact 19/61 German and 10/33 English source coverage;
4. stable IDs, schema strictness, reference integrity, and acyclic graph;
5. correctness and completeness of all 94 authored mappings, with pending specialist-review status represented accurately;
6. completion/mastery/placement semantics match recorded decisions exactly;
7. no mastery from XP, coins, rank, stage, time, hang-up, reward, or map count;
8. no pronunciation/acoustic claim and no raw-audio field;
9. assistance evidence does not penalize accessibility accommodation;
10. negative fixtures can fail real broken behavior and report stable reasons;
11. all required test commands actually execute and pass;
12. temporary-browser and real-device evidence is correctly bounded;
13. no runtime, prompt, provider, reward, economy, storage, asset, dependency,
    configuration, cache, deployment, main, merge, or release change; and
14. implementation report accurately states every omission and limitation.

If a required product decision is absent, the correct review result is
**CHANGES REQUIRED / BLOCKED**, not an inferred product choice. If all criteria
pass, Codex may advance the package to the next governance state; it may not
merge or deploy as part of the review.
