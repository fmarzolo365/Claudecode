# MARZI-061 — shared review governance

One model shared by all four tracks. Where a track protocol and this document
disagree, this document governs.

## 1. State machine

Every review record carries eleven status dimensions. They move together, never
independently.

| Dimension | Values |
|---|---|
| `preparationStatus` | `NOT_PREPARED`, `PREPARED` |
| `externalGateStatus` | `PENDING`, `DECIDED` |
| `appointmentStatus` | `NOT_APPOINTED`, `APPOINTED` |
| `executionStatus` | `NOT_STARTED`, `IN_PROGRESS`, `COMPLETED` |
| `evidenceStatus` | `NOT_COLLECTED`, `PARTIAL`, `COMPLETE` |
| `findingsStatus` | `NOT_RECORDED`, `RECORDED` |
| `completionStatus` | `NOT_COMPLETED`, `COMPLETED` |
| `decisionStatus` | `NOT_GRANTED`, `GRANTED` |
| `decision` | `NOT_REVIEWED`, `APPROVED`, `APPROVED_WITH_CONDITIONS`, `CHANGES_REQUIRED`, `BLOCKED` |
| `remediationStatus` | `NOT_DETERMINED`, `NOT_REQUIRED`, `REQUIRED`, `IN_PROGRESS`, `COMPLETE` |
| `rereviewStatus` | `NOT_DETERMINED`, `NOT_REQUIRED`, `REQUIRED`, `COMPLETE` |

## 2. Allowed transitions

```text
PREPARED + PENDING + NOT_APPOINTED
  -> APPOINTED            (Product Owner records a named reviewer)
  -> IN_PROGRESS          (reviewer begins; evidence may become PARTIAL)
  -> COMPLETED execution  (evidence COMPLETE, findings RECORDED or zero attested)
  -> COMPLETED review     (review date recorded, evidence references non-empty)
  -> DECIDED + GRANTED    (a decision other than NOT_REVIEWED)
```

No step may be skipped, and no later state may exist without every earlier one.
The validator enforces this; the following are rejected outright:

- a pending gate that carries a decision or a review date;
- `NOT_APPOINTED` with a reviewer object, or `APPOINTED` without one;
- `NOT_STARTED` carrying evidence, findings, or a date;
- a completed review without an appointed reviewer, completed execution,
  complete evidence, a date, and at least one evidence reference;
- a granted decision without a completed review.

## 3. Reviewer appointment

A reviewer object records a stable reviewer ID, display name, role,
qualification description, nullable organization, a conflict-of-interest
declaration, and an identity-verification state.

That state is always `NOT_VERIFIED_EXTERNALLY`. **No schema in this repository
can authenticate a person or validate a qualification.** A filled-in reviewer
object is a declaration by whoever wrote it, not proof. Appointment is a Product
Owner act recorded in the canonical review record at
`docs/learning/SPECIALIST_REVIEW.md`.

Anyone who contributed to authoring the reviewed artifact must declare that
conflict and must not decide their own work.

## 4. Evidence

Evidence IDs match
`^marzi-evidence:marzi-061:(learning-pedagogy|linguistic|accessibility|android-study):[0-9]{3}$`.

Every finding and every completed review cites at least one. Evidence is a
reference to something observable — a note, a measurement, a screen recording
captured with consent — never a restatement of an opinion. Evidence that cannot
be pointed at does not exist.

## 5. Findings

Finding IDs match
`^marzi-finding:marzi-061:(learning-pedagogy|linguistic|accessibility|android-study):[0-9]{3}$`.

| Severity | Meaning |
|---|---|
| `BLOCKER` | The artifact is wrong in a way that would harm or mislead a learner. |
| `HIGH` | A substantive defect that must be resolved before approval. |
| `MEDIUM` | A real defect that may be scheduled. |
| `LOW` | A minor improvement. |
| `INFORMATIONAL` | An observation implying no defect. |

| Disposition | Meaning |
|---|---|
| `OPEN` | Recorded, not yet addressed. |
| `ACCEPTED` | Acknowledged and accepted as-is with rationale. |
| `REMEDIATION_PLANNED` | A fix is scheduled. |
| `RESOLVED` | Fixed and verified. |
| `DEFERRED` | Deliberately postponed with rationale. |
| `REJECTED_WITH_RATIONALE` | Not a defect; the reasoning is recorded. |

`APPROVED` cannot coexist with an unresolved `BLOCKER` or `HIGH` finding.

## 6. Decisions and conditions

- `APPROVED` — the artifact is fit for its stated purpose in your discipline.
- `APPROVED_WITH_CONDITIONS` — requires at least one condition **and** a
  re-review or expiration trigger.
- `CHANGES_REQUIRED` — requires an open approval-relevant finding, required
  remediation, and required re-review.
- `BLOCKED` — requires a written blocking rationale.
- `NOT_REVIEWED` — the only valid value before a review happens.

A decision belongs to the appointed reviewer. It is never produced by this
package, by a validator, or by the existence of a file.

## 7. Remediation and re-review

Remediation is tracked separately from the finding that caused it. A resolved
finding still requires re-review when the original decision demanded it.
Remediation never edits a MARZI-021 contract directly: it becomes a versioned
curriculum change with explicit supersession.

## 8. Audit history

Every record carries an ordered audit history. Event IDs are unique, timestamps
increase, and each event's prior state equals the previous event's next state. A
record whose gate is still `PENDING` may contain only the package-preparation
event. Anything else is a fabricated history and fails validation.

## 9. Data minimization

Store no participant, learner, transcript, credential, contact, demographic,
consent, or health data anywhere in this package. Evidence references point at
material held under an approved retention policy; they do not embed it.

## 10. What structural validation does and does not establish

It **can** establish: the record has the right shape; statuses are mutually
consistent; references resolve; matrices match the canonical contracts; the
locale set is exact; no participant or result data is present; no unsupported
approval or compliance claim appears.

It **cannot** establish: that a reviewer exists, is qualified, or did the work;
that consent was valid; that content is pedagogically or linguistically correct;
that the product is accessible, usable, legally compliant, or releasable.

Technical preparation and human judgment are separate, and only the second can
close a gate.
