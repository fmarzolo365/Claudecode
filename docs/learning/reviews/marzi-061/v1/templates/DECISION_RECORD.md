# Decision record template

A decision is made by an appointed reviewer. It is never produced by a document,
a validator, or the existence of a file.

**Review ID:** `marzi-review:marzi-061:<track>:v1`
**Package:** MARZI-061 · **Reviewed artifact:** MARZI-021 at
`f20f805dc01cd8ff68f4862266b21bd5bf50dbc4`

| Field | Value |
|---|---|
| Decision | `NOT_REVIEWED` until you change it |
| Deciding reviewer | |
| Reviewer role and qualification | |
| Conflict-of-interest declaration | |
| Identity verification | `NOT_VERIFIED_EXTERNALLY` |
| Completed review reference | |
| Grant date | |
| Evidence references | |
| Conditions | |
| Rationale | |
| Re-review or expiration trigger | |
| Supersedes | |

## Rules

- `APPROVED` requires a completed, evidenced review and no unresolved `BLOCKER`
  or `HIGH` finding.
- `APPROVED_WITH_CONDITIONS` requires at least one condition **and** a re-review
  or expiration trigger.
- `CHANGES_REQUIRED` requires an open approval-relevant finding, required
  remediation, and required re-review.
- `BLOCKED` requires a written blocking rationale.
- `NOT_REVIEWED` is the only valid value before a review happens.

## What this decision does not grant

It does not authorize runtime integration, production, deployment, or release; it
is not legal or privacy approval; and it is not certification. Your decision
closes your gate and no other.
