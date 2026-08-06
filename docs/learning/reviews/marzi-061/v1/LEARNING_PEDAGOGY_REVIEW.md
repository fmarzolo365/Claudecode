# Learning and pedagogy review protocol

**Review ID:** `marzi-review:marzi-061:learning-pedagogy:v1`
**Status:** PENDING · **Reviewer:** NOT_APPOINTED · **Decision:** NOT_REVIEWED

## 1. Charter

Judge whether the MARZI-021 static learning contracts describe a defensible
learning model: whether the competencies are observable, the objectives are the
right real-world outcomes, the criteria are fair evidence, and the completion
semantics are honest about what they do and do not know.

## 2. Reviewer qualifications expected

Applied linguistics or second-language acquisition background; practical
experience designing or assessing spoken-interaction curricula; familiarity with
CEFR banding and its limits. No individual is named here — appointment is a
Product Owner act recorded in `docs/learning/SPECIALIST_REVIEW.md`.

## 3. Artifact scope

| Artifact | What to examine |
|---|---|
| `contracts/v1/competencies.json` | 25 competencies in 6 families |
| `contracts/v1/levels.json` | The A0–C1 bands and their opportunity design |
| `contracts/v1/prerequisites.json` | 18 recommended, acyclic edges |
| `contracts/v1/scenarios.de.json` | 19 scenarios, 61 variants |
| `contracts/v1/scenarios.en.json` | 10 scenarios, 33 variants |
| `contracts/v1/completion.json` | The five-state completion model |
| `contracts/v1/mastery.json` | Mastery states and forbidden inputs |
| `contracts/v1/placement.json` | The MARZI-D009 boundary |
| `contracts/v1/review.json` | Review-candidate rules |

Work from [`data/learning-evidence-matrix.json`](data/learning-evidence-matrix.json),
which lists all 94 variants with their competencies, criteria, level interval,
evidence types, and prerequisite references.

## 4. What to review

**Competencies and objectives.** Is each competency observable rather than
inferred? Are the six families non-overlapping? Do the objectives describe the
outcome a learner actually needs in that situation?

**All 94 scenario variants.** For each: is the required-criteria set the right
terminal evidence? Does any criterion require a fact the learner never had an
opportunity to know? Is any criterion an activity proxy in disguise?

**Required versus optional criteria.** Required criteria decide completion;
optional ones never do. Is that split right for each variant?

**Completion semantics.** The precedence is invalid → not_complete →
insufficient_evidence → complete → partial. Is that ordering pedagogically
right? Are `partial` and `insufficient_evidence` meaningfully distinct to a
learner? Is absence of evidence correctly never treated as failure?

**Evidence versus mastery.** One observation is not completion; one completion is
not mastery. Is that separation maintained everywhere you look?

**Remediation and further evidence.** Every non-complete state stays eligible for
new evidence and removes no earned value. Is that sufficient and fair?

**Prerequisite progression.** Are the 18 recommended edges sound as
*recommendations*? What is missing? Nothing here may hard-lock a scenario.

**MARZI-D009 placement.** Optional, bounded, skippable, provisional, revisable,
non-audio route required, no certification claim. Is the boundary right?

**MARZI-D016 objective-based completion.** Does the recorded option match what
the contracts actually implement?

**Learner appropriateness.** Age and audience suitability, cognitive load per
objective, feedback quality, scenario realism, and difficulty progression across
the bands.

## 5. The four open educational gates

These are deliberately unset. Do not treat their absence as an oversight, and do
not fill them in from this protocol — closing one requires a recorded decision.

| Gate | What is absent |
|---|---|
| `MARZI-021-MASTERY-THRESHOLDS` | Minimum opportunities, minimum contexts, recency window, aggregation weights |
| `MARZI-021-REVIEW-RECENCY` | The review recency window |
| `MARZI-021-PLACEMENT-CONTENT` | Validated per-target calibration items |
| `MARZI-021-COMPETENCY-COPY` | Localized learner-facing competency labels |

## 6. Known risks and unresolved questions

- Per-variant rubrics do not exist: criteria say what to observe, not how well.
- The `B1`–`C1` floor on the nine DTZ exam variants and the `A0` floor on the
  simplest transactional variants are the implementer's reading, not yours.
- The English pilot content was authored independently of German; confirm it is
  not a calque.
- `all_required` is applied uniformly; some variants may warrant an explicitly
  approved alternative rule over criterion IDs.

## 7. Evidence

Record evidence with [`templates/EVIDENCE_CAPTURE.md`](templates/EVIDENCE_CAPTURE.md),
using IDs of the form `marzi-evidence:marzi-061:learning-pedagogy:NNN`. Every
finding cites at least one, and every finding names the exact artifact path and
location it concerns.

## 8. Decision checklist

- [ ] Every competency is observable and the families do not overlap.
- [ ] All 94 variants reviewed against their required and optional criteria.
- [ ] No criterion is an activity, time, reward, or fluency proxy.
- [ ] Completion precedence is pedagogically defensible.
- [ ] Absence of evidence is never learner failure.
- [ ] Evidence, completion, and mastery stay separate.
- [ ] The prerequisite graph is sound as recommendation only.
- [ ] The placement boundary matches MARZI-D009.
- [ ] Open gates remain open.
- [ ] Every finding cites evidence and an exact location.

## 9. Workflow

Issues → [`templates/ISSUE_LOG.md`](templates/ISSUE_LOG.md).
Recommendations → [`templates/RECOMMENDATION_LOG.md`](templates/RECOMMENDATION_LOG.md).
Summary → [`templates/REVIEW_SUMMARY.md`](templates/REVIEW_SUMMARY.md).
Decision → [`templates/DECISION_RECORD.md`](templates/DECISION_RECORD.md).
Remediation → [`templates/REMEDIATION_HANDOFF.md`](templates/REMEDIATION_HANDOFF.md).

Your permitted decisions are `APPROVED`, `APPROVED_WITH_CONDITIONS`,
`CHANGES_REQUIRED`, `BLOCKED`, and `NOT_REVIEWED`. None is pre-populated.
