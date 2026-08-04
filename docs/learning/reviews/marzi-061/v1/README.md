# MARZI-061 — external review readiness

This directory is the single entry point for the four external reviews the
MARZI-021 static learning contracts depend on. It **prepares** those reviews. It
does not perform them, and nothing in it grants a result.

**Package:** MARZI-061 — External Review Readiness Package
**Reviewed artifact:** MARZI-021 static learning contracts at
`f20f805dc01cd8ff68f4862266b21bd5bf50dbc4`, listed with content hashes in
[`data/package-manifest.json`](data/package-manifest.json)
**Preparation status:** PREPARED
**All four review gates:** PENDING

## The four tracks

| Track | Protocol | Review ID | Status |
|---|---|---|---|
| Learning and pedagogy | [`LEARNING_PEDAGOGY_REVIEW.md`](LEARNING_PEDAGOGY_REVIEW.md) | `marzi-review:marzi-061:learning-pedagogy:v1` | PENDING |
| Six-language linguistic | [`LINGUISTIC_REVIEW.md`](LINGUISTIC_REVIEW.md) | `marzi-review:marzi-061:linguistic:v1` | PENDING |
| Accessibility | [`ACCESSIBILITY_REVIEW.md`](ACCESSIBILITY_REVIEW.md) | `marzi-review:marzi-061:accessibility:v1` | PENDING |
| Moderated Android study | [`ANDROID_STUDY.md`](ANDROID_STUDY.md) | `marzi-review:marzi-061:android-study:v1` | PENDING |

No reviewer has been appointed for any track. No review has started. No evidence
exists. No decision has been granted.

## Preparation is not execution

Preparation means the charter, scope, workflow, schema, matrix, evidence
structure, and decision record exist. Execution means a qualified human read the
artifact, recorded evidence, and reached a decision.

**The presence of a file grants nothing.** A template is not a finding. A matrix
entry is not a review. A passing validator proves the preparation is internally
consistent, not that the content is pedagogically correct, linguistically
correct, accessible, usable, legally compliant, or ready for release.

## How a reviewer starts

1. Read [`REVIEW_GOVERNANCE.md`](REVIEW_GOVERNANCE.md) — the shared state
   machine, evidence rules, and decision authority.
2. Read your track's protocol.
3. Ask the Product Owner to record your appointment. Until then your track stays
   `NOT_APPOINTED` and any record naming you is invalid.
4. Create a **separate** evidence record; do not edit the canonical preparation
   data in [`data/`](data). Evidence arrives in its own commits.
5. Record findings with the templates in [`templates/`](templates), each bound to
   an exact artifact path and location.
6. Complete a [`DECISION_RECORD.md`](templates/DECISION_RECORD.md). A decision is
   yours to make; this package pre-populates none.

## Schemas, data, and validation

| Area | Files |
|---|---|
| Schemas | [`schema/`](schema) — manifest, review record, finding, decision, and one per track |
| Canonical data | [`data/`](data) — manifest, review status, learning and linguistic matrices, accessibility plan, Android protocol |
| Locale checklists | [`languages/`](languages) — `es`, `en`, `it`, `tr`, `ar`, `uk` |
| Templates | [`templates/`](templates) |
| Validator | `test/marzi-061-external-review-readiness.js`, 30 checks |
| Fixtures | `test/fixtures/marzi-061-external-reviews/` |

The learning evidence matrix holds 94 entries and the linguistic matrix 564, both
derived from the canonical contracts and verified against them on every run.
They are **derivatives**: where a matrix and a contract disagree, the contract is
right and the matrix is defective.

## Reviews may not modify MARZI-021

A review record never edits a learning contract. A proposed correction is data in
a finding. Applying a correction is a separate, versioned change to MARZI-021
that publishes a new curriculum version with explicit supersession — never an
in-place edit of an identifier's meaning.

## Later gates

These remain outside this package and outside every review recorded here:

- legal and privacy approval before study recruitment or any data collection;
- Product Owner approval of participant count and compensation;
- runtime integration, production authorization, deployment, and release.

## Versioning and supersession

This is `v1`. A later revision creates a new versioned directory and each new
review record names the earlier record it supersedes. Records are never edited in
place once evidence references them, and a superseding record must be the same
review type against the same artifact.

## A note on the superseded planning artifact

An earlier external planning file named `MARZI-022_CLAUDE_CODE_MANDATE.md`
described external review readiness as MARZI-022. The Product Owner decision of
2026-08-04 supersedes it: MARZI-022 remains *Domain Ownership and Event
Contracts*, and External Review Readiness is MARZI-061. That planning artifact is
historical, is not canonical, and is not an executable authority.
