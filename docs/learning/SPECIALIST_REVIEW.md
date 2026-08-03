# Marzi learning-specialist review handoff

**Package:** MARZI-021 — Learning Competency, Curriculum, and Mastery Model

**Specialist status:** **NOT YET NAMED.** No learning specialist has been
assigned, and no specialist has reviewed any item in
`docs/learning/contracts/v1`.

**Effect of that status:** Product Owner authorization released *static
contract authoring* only. Specialist sign-off remains mandatory before
educational approval, runtime integration, or production release. Nothing in
this repository may be presented as pedagogically validated until this
document records a named reviewer and an outcome.

This file is the structure that review will be recorded in. It is deliberately
empty of findings, because there are none yet.

## 1. What is waiting for review

| Item | Where | Volume | Current marking |
|---|---|---:|---|
| Competency definitions | `contracts/v1/competencies.json` | 25 competencies, 6 families | `pending_specialist_review` |
| Band boundaries A0–C1 | `contracts/v1/levels.json` | 6 bands | `pending_specialist_review` |
| Prerequisite graph | `contracts/v1/prerequisites.json` | 18 recommended edges | `pending_specialist_review` |
| German objective variants | `contracts/v1/scenarios.de.json` | 19 scenarios / 61 variants | `pending_specialist_review` |
| English pilot variants | `contracts/v1/scenarios.en.json` | 10 scenarios / 33 variants | `pending_specialist_review` |
| Objective criteria | both scenario files | 282 required, 94 optional | `pending_specialist_review` |
| Localized objective titles | both scenario files | 94 × 6 languages = 564 strings | `pending_specialist_review` |
| Completion semantics and copy | `contracts/v1/completion.json` | 5 states × 6 languages | `pending_specialist_review` |
| Mastery states and copy | `contracts/v1/mastery.json` | 5 states × 6 languages | `pending_specialist_review` |
| Placement boundary | `contracts/v1/placement.json` | 1 contract | `pending_specialist_review` |
| Review rules | `contracts/v1/review.json` | 6 candidate rules | `pending_specialist_review` |
| Negative fixtures | `test/fixtures/learning/invalid/` | 45 fixtures | `pending_specialist_review` |

## 2. Questions the specialist has to answer

1. Are the 25 competencies observable, non-overlapping, and sufficient for the
   29 production scenarios?
2. Do the A0–C1 opportunity descriptors match how the bands are actually used
   at runtime, and is `A0` defensible as an internal pre-A1 label?
3. Are the 18 prerequisite edges pedagogically sound as *recommendations*, and
   is anything important missing?
4. For each of the 94 variants: are the required criteria the right terminal
   evidence for that real-world outcome, and is anything required that a
   learner could not have had an opportunity to know?
5. Are the declared `supportedLevels` intervals right, particularly the
   `B1`–`C1` floor applied to the nine DTZ exam variants and the `A0` floor
   applied to the six simplest transactional and small-talk variants?
6. Is the English pilot content independently correct rather than a German
   calque?
7. Is the completion rule `all_required` fair for every variant, or do some
   variants need an explicitly approved alternative rule over criterion IDs?
8. Are the five mastery states and their learner-facing explanations
   understandable and non-punitive?

## 3. Decisions the specialist is expected to close

These are recorded as open gates in the contracts. No default has been
invented for any of them, and release-mode validation fails while they are
open.

| Gate | Owner | What must be decided |
|---|---|---|
| `MARZI-021-MASTERY-THRESHOLDS` | Product Owner with learning specialist | Minimum distinct opportunities, minimum distinct contexts, recency window, aggregation weights |
| `MARZI-021-REVIEW-RECENCY` | Product Owner with learning specialist | The recency window after which secure evidence becomes `review_due` |
| `MARZI-021-PLACEMENT-CONTENT` | Learning specialist with content | Validated per-target calibration items and their localized instructions |
| `MARZI-021-COMPETENCY-COPY` | Product Owner with localization | Whether competencies are ever surfaced to learners and, if so, their localized labels |

## 4. Reviews that are separate from this one

| Review | Status | Why it is separate |
|---|---|---|
| Six-language linguistic review | **NOT PERFORMED** | The 564 localized titles and 60 localized state strings were authored by the implementer, not by qualified reviewers of `es`, `en`, `it`, `tr`, `ar`, `uk` |
| Accessibility review | **NOT PERFORMED** | Wording comprehension, screen-reader phrasing and non-colour semantics need a specialist and real assistive technology |
| Moderated small-Android comprehension study | **NOT PERFORMED** | Requires a device and participants; see the implementation report for what was and was not measured |
| Privacy and retention review | **BLOCKED** by MARZI-D021, D022, D024 | No learner evidence is persisted by this package |

## 5. How findings must be applied

1. A finding never changes the meaning of an existing identifier in place.
2. A correction publishes a new `curriculumVersion` and records an explicit
   `supersedes` mapping on every changed objective.
3. `reviewStatus` moves from `pending_specialist_review` to
   `specialist_reviewed` only for items the named specialist actually reviewed.
4. Closing an open gate requires the numeric or content decision to be recorded
   in `docs/MARZI_DECISION_REGISTER.md` first; check 25 of
   `test/learning-contracts.js` fails if a gate disappears without one.
5. Every change must keep `node test/learning-contracts.js` at 36/36 and must
   keep the runtime diff empty.
6. Recording a review means filling in a row of the table in section 6. A status
   change without a complete matching row fails validation with
   `STATUS_REVIEW_EVIDENCE_MISSING`; the three review gates are independent and
   one row never satisfies another.

## 6. Review record

This table is the canonical review record for MARZI-021. It is the only place a
completed review is recorded, and `test/learning-contracts.js` reads it: any
contract whose `reviewStatus` leaves `pending_specialist_review` must have a row
here whose every column is filled and whose contract version matches the version
being claimed, or validation fails with `STATUS_REVIEW_EVIDENCE_MISSING`. While
a gate is still pending, a row claiming it is done fails with
`STATUS_REVIEW_EVIDENCE_UNEXPECTED`, and an unrecognised review type fails with
`STATUS_REVIEW_TYPE_INVALID`.

`Review type` is one of `specialist`, `linguistic`, or `accessibility`. The
three gates are independent: a row of one type never satisfies another.

**What that validation is and is not.** It is structural: columns, review type,
filled-versus-placeholder fields, version or hash syntax and match, and internal
consistency with the canonical status. It **cannot** verify that a named
reviewer exists, holds the stated qualification, actually carried out the
review, or signed anything, and it makes no cryptographic provenance claim. A
completed row is a declaration by whoever wrote it. Genuine evidence-backed
transitions for these three gates are a later pre-runtime governance
requirement. Any synthetic row used inside the test suite is a structural
fixture and is never evidence that a review occurred.

*No entries. This table stays empty until a reviewer is named and has actually
reviewed the items in section 1. Nothing here may be filled in speculatively.*

| Date | Review type | Reviewer | Role and qualification | Contract version or hash | Items reviewed | Outcome | Findings reference |
|---|---|---|---|---|---|---|---|
| — | — | — | — | — | — | — | — |
