# Remediation handoff template

Hands a finding to whoever will act on it. Filing this changes no MARZI-021
contract.

**Review ID:** `marzi-review:marzi-061:<track>:v1`

| Finding ID | Severity | Owner role | Proposed remediation | Affects MARZI-021? | Requires new curriculum version | Re-review required | Target |
|---|---|---|---|---|---|---|---|
| | | | | | | | |

## Rules

- A correction to a learning contract is a **versioned** MARZI-021 change that
  publishes a new curriculum version with explicit supersession. An identifier's
  meaning is never changed in place.
- A correction to a localized string is proposed as data; it is never applied by
  editing the linguistic matrix, which is compared against the canonical contract
  on every validator run.
- Remediation of `MARZI-A11Y-KNOWN-001` belongs to the presentation and
  runtime-integration package, not to any review recorded here.
- Re-review is required whenever the original decision demanded it, even after a
  finding is marked `RESOLVED`.
