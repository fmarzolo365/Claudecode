# Learning-contract fixtures

Static fixtures for `node test/learning-contracts.js`. Nothing here is loaded
by the application; these files exist so the validator's rules have provable
failure modes instead of being assertions about themselves.

## `valid/` — 9 fixtures that must pass with zero issues

| Fixture | What it proves |
|---|---|
| `objective-result-complete.json` | Every required criterion demonstrated derives `complete` |
| `objective-result-partial.json` | A partially demonstrated required criterion derives `partial`, not failure |
| `objective-result-not-complete.json` | A contradicted required criterion derives `not_complete` |
| `objective-result-insufficient-evidence.json` | Missing evidence derives `insufficient_evidence`, not failure |
| `objective-result-accessibility-accommodation.json` | A screen reader, extended time and a non-audio route do not change the derived result |
| `objective-result-full-assistance.json` | `FULL` assistance can complete an objective while independent retrieval stays unclaimed |
| `scenarios-fragment-minimal.json` | A single real scenario record validates in isolation |
| `prerequisites-minimal.json` | A minimal acyclic recommended graph validates |
| `levels-boundary.json` | The exact `A0`–`C1` ordering is the boundary case |

## `invalid/` — 37 fixtures that must each fail for a declared reason

`invalid/manifest.json` binds every file to the reason code the validator has
to report. Check 27 fails if a fixture is accepted, if it fails for a different
reason, if a fixture has no manifest entry, or if a manifest entry has no file.
It also fails if the suite stops covering any of the 29 reason codes check 27
names as mandatory. The manifest currently proves 32 distinct codes, so three
are covered above the mandatory floor.

The reason codes proved here are stable identifiers, not prose. They fall into
five groups:

- **Structure** — `SCHEMA_ENUM_INVALID`, `SCHEMA_REQUIRED_MISSING`,
  `SCHEMA_UNKNOWN_FIELD`, `UNSAFE_CONTENT`.
- **Identity and reference** — `DUPLICATE_ID`, `UNKNOWN_COMPETENCY_REF`,
  `UNKNOWN_OBJECTIVE_REF`, `UNKNOWN_CRITERION_REF`.
- **Graph and level** — `PREREQ_CYCLE`, `PREREQ_SELF_EDGE`,
  `PREREQ_DUPLICATE_EDGE`, `PREREQ_UNKNOWN_NODE`, `PREREQ_KIND_UNSUPPORTED`,
  `LEVEL_RANGE_REVERSED`, `LEVEL_ORDER_INVALID`.
- **Source fidelity** — `SOURCE_TEXT_DRIFT`, `SOURCE_COVERAGE_DUPLICATE`,
  `SCENARIO_EXCLUDED`, `LOCALE_PARITY`.
- **Learning integrity** — `ACOUSTIC_EVIDENCE_REJECTED`,
  `EVIDENCE_TYPE_UNSUPPORTED`, `REWARD_VALUE_PRESENT`,
  `CRITERION_PROXY_REJECTED`, `DRAFT_POLICY_IN_RELEASE`, `EVIDENCE_DUPLICATE`,
  `EVIDENCE_STALE`, `EVIDENCE_CROSS_SESSION`, `EVIDENCE_UNSOURCED`,
  `ASSISTANCE_ACCOMMODATION_CONFLATED`, `COMPLETION_RESULT_MISMATCH`,
  `INVENTED_DEFAULT`, `MASTERY_FORBIDDEN_INPUT_MISSING`.

## Adding a fixture

1. Add the JSON file to `valid/` or `invalid/`.
2. For an invalid fixture, add a `manifest.json` entry with `file`,
   `expectedReason` and a one-line `description`.
3. Run `node test/learning-contracts.js` and confirm it stays at 28/28.

A fixture that fails for the wrong reason is a bug in the fixture or in the
validator, never something to paper over by relaxing the expected reason.
