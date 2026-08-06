# MARZI-061 external-review fixtures

Static fixtures for `node test/marzi-061-external-review-readiness.js`. Nothing
here is loaded by the application or by any review, and none of it is evidence
that a review happened. These files exist so that the readiness validator's
rules have provable failure modes instead of being assertions about themselves.

Every fixture is **data**. It is parsed with `JSON.parse` and never executed.

## `valid/` — 6 fixtures that must pass with zero issues

| Fixture | What it proves |
|---|---|
| `package-prepared.json` | A package whose preparation is complete and whose four tracks are all pending is a legal state |
| `review-status-pending.json` | `NOT_APPOINTED` / `NOT_STARTED` / `NOT_COLLECTED` / `NOT_RECORDED` with no decision is internally consistent |
| `learning-matrix-fragment.json` | A single learning-evidence entry validates in isolation against the MARZI-021 objective it cites |
| `linguistic-six-locale-fragment.json` | One localized title carried across exactly `es`, `en`, `it`, `tr`, `ar`, `uk`, with `ar` marked `rtl`, validates |
| `accessibility-known-issue.json` | The Arabic 320×568 / 200 % overflow may be carried as an **open** known issue; an open issue is a legal state, not a defect in the record |
| `android-study-plan-no-results.json` | A protocol with no participants, no sessions and no observations is the correct shape for a study that has not been run |

The valid fixtures are deliberately unexciting. Their job is to prove the
validator is not simply refusing everything: if a rule were written so broadly
that a legitimate pending package could not be expressed, one of these six
would fail.

## `invalid/` — 30 fixtures that must each fail with one declared first reason

`invalid/manifest.json` binds every file to the reason code the validator has
to report. The fixture check fails if a fixture is accepted, if the **first**
reported reason is not the declared one, if a fixture has no manifest entry, or
if a manifest entry has no file.

Reasons are ordered, not merely present: the first code the validator emits for
a fixture must equal its `expectedReason`. A fixture that trips an earlier,
unrelated rule fails the check even though it did fail, so each fixture is
narrowed until it isolates the one defect it is named for rather than the
assertion being weakened. Where two rules could both fire, exactly one owns the
case: the schemas own unknown properties, enum values and patterns; the
semantic checks own state consistency, evidence, inventory and locale rules.

| Fixture | First reason | Defect it isolates |
|---|---|---|
| `android-fake-participant.json` | `M061_ER_PARTICIPANT_DATA_FORBIDDEN` | inserts a participant into a protocol that has not been run |
| `android-fake-result.json` | `M061_ER_STUDY_RESULT_FORBIDDEN` | records a study observation that never happened |
| `appointed-with-null-reviewer.json` | `M061_ER_APPOINTMENT_INCONSISTENT` | declares a reviewer appointed while the reviewer object is null |
| `approved-with-conditions-empty.json` | `M061_ER_CONDITIONS_REQUIRED` | approves with conditions while listing none |
| `approved-without-evidence.json` | `M061_ER_EVIDENCE_REQUIRED` | grants a decision without a completed, evidenced review |
| `arabic-not-rtl.json` | `M061_ER_DIRECTION_INVALID` | declares Arabic as left to right |
| `audit-history-inconsistent.json` | `M061_ER_AUDIT_HISTORY_INVALID` | records an external-review event while the gate is pending |
| `blocked-without-reason.json` | `M061_ER_BLOCK_REASON_REQUIRED` | blocks a review without recording a blocking rationale |
| `changes-required-without-remediation.json` | `M061_ER_REMEDIATION_REQUIRED` | requires changes without an open finding, remediation or re-review |
| `completed-without-reviewer.json` | `M061_ER_REVIEWER_REQUIRED` | marks a review completed with no reviewer recorded |
| `decision-from-file-presence.json` | `M061_ER_DECISION_INFERRED` | treats the existence of a matrix entry as a review outcome |
| `duplicate-review-id.json` | `M061_ER_REVIEW_ID_DUPLICATE` | uses one review identifier for two tracks |
| `external-authority-claim.json` | `M061_ER_AUTHORITY_CLAIM_UNSUPPORTED` | claims the package is WCAG compliant and certified |
| `fabricated-specialist-approval.json` | `M061_ER_FALSE_APPROVAL` | records an approval with no appointed reviewer behind it |
| `fixture-path-escape.json` | `M061_ER_FIXTURE_PATH_ESCAPE` | declares an artifact path that escapes the repository |
| `inventory-drift.json` | `M061_ER_INVENTORY_DRIFT` | records a variant count that contradicts the approved inventory |
| `known-accessibility-issue-missing.json` | `M061_ER_KNOWN_ISSUE_MISSING` | removes the open Arabic overflow issue from the accessibility plan |
| `learning-matrix-drift.json` | `M061_ER_LEARNING_MATRIX_DRIFT` | changes a source goal index so the matrix no longer matches the contract |
| `linguistic-missing-locale.json` | `M061_ER_LOCALE_SET_INVALID` | drops Ukrainian from the declared locale set |
| `linguistic-string-drift.json` | `M061_ER_LINGUISTIC_TEXT_DRIFT` | edits a localized title instead of proposing a correction |
| `locale-name-mismatch.json` | `M061_ER_LOCALE_NAME_INVALID` | names Ukrainian incorrectly in the locale table |
| `missing-review-track.json` | `M061_ER_TRACK_SET_INVALID` | drops one of the four required review tracks |
| `open-gate-closed.json` | `M061_ER_OPEN_GATE_CLOSED` | declares fewer open educational gates than remain open |
| `package-id-collision.json` | `M061_ER_PACKAGE_ID_COLLISION` | claims the MARZI-022 package identity for external review readiness |
| `pending-with-review-date.json` | `M061_ER_PENDING_STATE_INCONSISTENT` | records a review date while the gate is still pending |
| `privacy-data-present.json` | `M061_ER_PERSONAL_DATA_FORBIDDEN` | stores a contact detail in the study protocol |
| `supersession-invalid.json` | `M061_ER_SUPERSESSION_INVALID` | supersedes itself |
| `unexpected-property.json` | `M061_ER_UNEXPECTED_PROPERTY` | adds an undeclared property to a controlled object |
| `unknown-artifact-reference.json` | `M061_ER_ARTIFACT_REFERENCE_UNKNOWN` | references a reviewed artifact that does not exist |
| `unknown-review-type.json` | `M061_ER_REVIEW_TYPE_UNKNOWN` | declares a review type outside the approved four |

## Path containment

`manifest.json` entries are bare filenames. The fixture-loading check rejects
traversal, absolute paths, nested paths, symlinks, non-regular files and unsafe
names, and it resolves every path under
`test/fixtures/marzi-061-external-reviews/` before reading it. A fixture that
names a path outside that root is refused rather than read.

## What these fixtures are not

- They are **not** reviews. `fabricated-specialist-approval.json` and
  `android-fake-result.json` exist precisely because the validator must refuse
  such records; their presence in this directory asserts nothing about any
  reviewer, participant, or outcome.
- They are **not** evidence for any gate. The four MARZI-061 review tracks are
  pending, and no fixture changes that.
- The named people, sessions and observations inside the negative fixtures are
  synthetic and are constructed to be refused. None of them refers to a real
  person.
