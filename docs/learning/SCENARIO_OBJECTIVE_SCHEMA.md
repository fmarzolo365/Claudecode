# Marzi Scenario Objective Schema

**Schema:** `marzi.learning.scenario-objectives.v1`

**Status:** IMPLEMENTED as `docs/learning/contracts/v1/scenarios.de.json` and
`scenarios.en.json` — a static content contract, not a runtime contract

**Purpose:** Give every production scenario goal a stable, testable learning
identity without changing the existing prompt or scenario identity.

## 1. Principles

1. Scenario ID, character identity, role, place, and current prompt goal text
   remain frozen.
2. A free-text `goals[]` string is content, not a stable evidence key.
3. A stable objective variant maps to exactly one current goal string during
   initial migration.
4. Competency IDs come only from `LEARNING_MODEL.md`.
5. Learner-facing objective copy is localized; schema keys and evidence enums
   are not UI text.
6. Completion is derived from explicit required criteria after MARZI-D016, not
   from call end, reward success, elapsed time, or `scenariosDone`.
7. The schema contains no XP, coin, price, entitlement, or reward values.
8. Pronunciation is not an allowed v1 evidence construct.

## 2. Artifact layout as implemented

```text
docs/learning/contracts/v1/
├── README.md
├── competencies.json      levels.json        prerequisites.json
├── evidence.json          completion.json    mastery.json
├── placement.json         review.json        source-inventory.json
├── scenarios.de.json      scenarios.en.json
└── schema/*.schema.json   (one per artifact, plus objective-result)

test/fixtures/learning/
├── README.md
├── valid/                 12 fixtures that must pass
└── invalid/               45 fixtures + manifest.json, each with one reason code
```

The fixtures live under `test/` rather than beside the contracts because
MARZI-021 section 20 puts them there. These artifacts are content contracts,
not browser runtime modules. Runtime integration belongs to later
architecture and content packages.

## 3. Top-level scenario record

```json
{
  "schemaVersion": 1,
  "curriculumVersion": "v1-draft",
  "targetLanguage": "de",
  "scenarioId": "arzt",
  "mode": "phone",
  "sourceGoalCount": 4,
  "objectives": []
}
```

| Field | Type | Rule |
|---|---|---|
| `schemaVersion` | integer | Exactly `1` for this contract. |
| `curriculumVersion` | string | Immutable release identifier after approval; `*-draft` cannot ship. |
| `targetLanguage` | string | Must identify a registered target pack (`de` live, `en` pilot at the baseline). |
| `scenarioId` | string | Must match exactly one production scenario in that target pack. `random` and `custom` are excluded. |
| `mode` | enum | `phone`, `face`, or `exam`; must agree with current scenario metadata. |
| `sourceGoalCount` | integer | Must equal the current `goals.length`; detects drift. |
| `objectives` | array | One entry per source goal variant, with unique stable IDs. |

One file may contain an array of these records. Ordering is not semantic, but
the validator emits deterministic target/group/scenario order for review.

## 4. Objective variant record

```json
{
  "id": "de.arzt.book_appointment.cough",
  "scenarioObjectiveId": "de.arzt.book_appointment",
  "sourceGoalIndex": 0,
  "sourceGoalText": "book an appointment because of a persistent cough",
  "title": {
    "es": "Pedir una cita por una tos persistente",
    "en": "Book an appointment for a persistent cough",
    "it": "Richiedere un appuntamento per una tos persistente",
    "tr": "Sürekli öksürük için randevu almak",
    "ar": "حجز موعد بسبب سعال مستمر",
    "uk": "Записатися через тривалий кашель"
  },
  "supportedLevels": { "min": "A0", "max": "C1" },
  "competencies": [
    "INT.STATE_PURPOSE",
    "INT.PROVIDE_DETAIL",
    "FUN.ARRANGE"
  ],
  "requiredCriteria": [
    {
      "id": "purpose_understood",
      "competencyId": "INT.STATE_PURPOSE",
      "observation": "learner communicates the need for an appointment"
    },
    {
      "id": "relevant_reason",
      "competencyId": "INT.PROVIDE_DETAIL",
      "observation": "learner communicates a persistent cough or an equivalent relevant symptom"
    },
    {
      "id": "arrangement_resolved",
      "competencyId": "FUN.ARRANGE",
      "observation": "an appointment or truthful next step is mutually established"
    }
  ],
  "optionalCriteria": [
    {
      "id": "appropriate_close",
      "competencyId": "INT.OPEN_CLOSE",
      "observation": "learner closes the exchange appropriately"
    }
  ],
  "allowedEvidence": ["transcript_text", "typed_response", "interaction_event"],
  "completionPolicy": "PENDING_MARZI_D016",
  "reviewTags": ["appointment", "health", "symptom"],
  "supersedes": null
}
```

The localized copy above is an illustrative schema example, not approved
production translation. Learning/content reviewers must author and validate
final copy; implementation must not copy the example as approved content.

## 5. Field rules

### 5.1 IDs

- `id` format: `<target>.<scenario>.<outcome>.<variant>`.
- `scenarioObjectiveId` groups variants that share a real-world outcome.
- IDs use lowercase ASCII letters, digits, and underscores separated by dots.
- IDs are immutable after learner evidence can reference them.
- No ID may be reused after deletion or change of meaning.
- A non-null `supersedes` uses this same identifier syntax — there is no second
  ID syntax — and must resolve to a known objective of an earlier curriculum
  version. v1 has no predecessor registry, so v1 rejects every non-null value
  with `SUPERSEDES_REF_INVALID`; self-reference and unknown predecessors are
  rejected in any version.
- Duplicate IDs across target packs are invalid even when scenarios are
  translations of each other.

### 5.2 Source mapping

- `sourceGoalIndex` is zero-based and must resolve to `sourceGoalText` in the
  exact baseline target pack.
- Each current production goal must be mapped exactly once.
- A missing, duplicated, reordered, or edited source string fails validation
  until a deliberate migration updates the contract.
- Goal text remains the current PromptBuilder input during MARZI-021; the
  mapping does not replace or edit it.

### 5.3 Localization

- `title` requires exactly the six current explanation/interface languages:
  `es`, `en`, `it`, `tr`, `ar`, and `uk`.
- Copy describes the learner outcome, not internal scoring mechanics.
- Target-language phrases remain separate learning content.
- Arabic is reviewed in logical reading order and must not embed layout marks
  that reverse target-language phrases or identifiers.
- Proper names and scenario identities are preserved.

### 5.4 Level range

- Allowed order is exactly `A0`, `A1`, `A2`, `B1`, `B2`, `C1`.
- `min` cannot be after `max`.
- An invalid label such as `A3`, a missing bound, or reversed range fails.
- Range means the objective can be offered at those bands; per-band rubric
  expectations live in the approved learning contract.

### 5.5 Competencies and criteria

- Every `competencies[]` value must exist in the approved taxonomy.
- Every required/optional criterion has a record-local unique ID, known
  competency, and observable behavior.
- Criteria may not use vague proxies such as “spent time,” “ended call,”
  “earned XP,” “used five turns,” or “seemed fluent.”
- Criteria cannot require a fact the learner never had an opportunity to know.
- Required criteria determine objective result only after MARZI-D016 approval.

### 5.6 Evidence

Allowed v1 values are:

- `transcript_text`;
- `typed_response`; and
- `interaction_event`.

`raw_audio`, `pronunciation_score`, `accent`, `speech_rate`, reward records,
wallet state, and UI DOM text are invalid v1 evidence. A speech-recognition
transcript may support language/content judgments but not acoustic claims.

### 5.7 Completion policy

MARZI-D016 option A is recorded, so every authored objective uses
`all_required`: the objective is complete only when every criterion in
`requiredCriteria` has a valid terminal observation of `demonstrated`.

`PENDING_MARZI_D016` is retained in `completion.json` as a non-release-ready
policy so that any pre-decision contract stays detectable; the validator
raises `DRAFT_POLICY_IN_RELEASE` for it. A future alternative rule must be
separately approved and must have criterion IDs as its only operands. No
implicit LLM-only completion rule is permitted.

## 6. Objective result record

The future evaluator emits a derived record; it does not edit the objective or
transcript:

```json
{
  "schemaVersion": 1,
  "attemptId": "attempt-stable-id",
  "objectiveId": "de.arzt.book_appointment.cough",
  "curriculumVersion": "v1",
  "rubricVersion": "v1",
  "result": "insufficient_evidence",
  "criteria": [
    {
      "criterionId": "purpose_understood",
      "outcome": "demonstrated",
      "opportunityIds": ["opp-1"],
      "responseIds": ["turn-2"],
      "assistance": { "mode": "HINT", "exposed": true }
    }
  ],
  "reasonCodes": ["TERMINAL_CRITERION_NOT_OBSERVED"]
}
```

Allowed `result` values are `complete`, `partial`, `not_complete`,
`insufficient_evidence`, and `invalid`. They are mutually exclusive and
exhaustive under the precedence recorded in `contracts/v1/completion.json` as
`derivationPrecedence`, and only required criteria take part in the derivation.
The result must be reproducible from criterion observations and policy data.
Explanatory prose may be generated afterward but cannot alter it.

## 7. Prerequisite contract

```json
{
  "schemaVersion": 1,
  "edges": [
    { "from": "INT.STATE_PURPOSE", "to": "INT.PROVIDE_DETAIL", "kind": "recommended" }
  ]
}
```

- `from` and `to` must be known competency or objective IDs.
- Self-edges, duplicate edges, and cycles fail.
- v1 supports only `recommended`; it cannot hard-lock existing scenarios.
- A future `required` kind needs explicit Product Owner approval and migration
  evidence because it changes access behavior.

## 8. Migration and compatibility

MARZI-021 is additive and documentation/data-only:

1. Inventory the current scenario arrays from the exact implementation
   baseline.
2. Create one stable objective variant for every production `goals[]` entry.
3. Keep existing arrays, prompt strings, indices, runtime selection, and
   `scenariosDone` untouched.
4. Validate mappings in CI without importing them into browser runtime.
5. Later integration adds an adapter that reads the versioned contracts while
   retaining the legacy source path.
6. A later migration can switch readers only after parity, old-data,
   cancellation, rollback, and staging evidence passes.

If source content changes before integration, update the mapping through a
reviewed curriculum version; never “fix” drift by silently changing an ID.

## 9. Required automated validation

The dependency-free MARZI-021 validator must prove:

1. JSON and schema validity.
2. Exactly one record for every production scenario: 19 German and 10 English
   at baseline; `random`/`custom` are excluded.
3. Exactly one objective variant for every current source goal: 61 German and
   33 English at baseline.
4. Unique and valid competency, objective, criterion, and curriculum IDs.
5. Every competency/prerequisite reference exists.
6. Prerequisite graph is acyclic.
7. Source index/text mapping is exact and detects reorder/edit drift.
8. Six-language title parity.
9. Valid level boundaries and rejection of unknown/reversed levels.
10. `insufficient_evidence` is accepted throughout result contracts.
11. Unknown evidence types and all pronunciation/acoustic proxies are rejected.
12. Draft completion policy cannot pass a release-mode check.
13. No XP, coin, price, entitlement, Premium, or reward value appears in the
    curriculum artifacts.
14. Invalid fixtures fail for the intended reason and the validator itself
    exits non-zero on failure.

## 10. Approval boundary

MARZI-D009 and MARZI-D016 are recorded, which released static authoring of the
contracts described above. That is where the authorization stops.

The authored translations, criteria, rubrics, band intervals and mastery
thresholds are **not** approved. No learning specialist is assigned, so every
pedagogical item carries `reviewStatus: "pending_specialist_review"`, the
curriculum version is `v1-draft`, and release-mode validation refuses the set.
A release contract may not be published until a named specialist, a qualified
six-language linguistic review and an accessibility review have signed off and
the open numeric gates are closed in the Decision Register.

Any requested change to scenario identities, prompts, reward behavior, or
runtime storage is outside MARZI-021.
