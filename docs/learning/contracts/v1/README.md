# Marzi learning contracts — v1

**Contract family:** `marzi.learning.*.v1`

**Curriculum version:** `v1-draft`

**Source baseline:** `ee88e0e2ecde8bcccb38c37ef7710c7e4f31bad4`

**Runtime effect:** none. Nothing in this directory is loaded, imported,
bundled, cached or rendered by `public/index.html` or `server.js`.

**Review status:** every pedagogical item is marked
`pending_specialist_review`. No learning specialist has been named. This
directory is not educational, linguistic, accessibility, or production
approval, and the validator refuses to treat it as release-ready.

## What this is

A versioned, machine-validatable statement of what Marzi teaches and what
evidence may support participation, objective completion, mastery, placement
and review. It exists so that later packages (evaluation, rewards, learning
map, recommendations) share one vocabulary instead of inventing their own.

It is authored under the Product Owner approvals recorded in
`docs/MARZI_DECISION_REGISTER.md` on 2026-08-03: MARZI-D009 option A
(optional, bounded placement calibration) and MARZI-D016 option A
(objective-based completion with explicit Partial and Insufficient Evidence
states), plus in-principle approval of the taxonomy, objective families,
stable identifiers and mastery presentation states.

## Files

| File | Contract | What it fixes |
|---|---|---|
| `competencies.json` | `marzi.learning.competencies.v1` | 25 language-neutral competencies in six families |
| `levels.json` | `marzi.learning.levels.v1` | The internal `A0`–`C1` bands and their opportunity design |
| `prerequisites.json` | `marzi.learning.prerequisites.v1` | 18 recommended, acyclic competency edges |
| `evidence.json` | `marzi.learning.evidence.v1` | Opportunity, observation outcomes, allowed and rejected evidence, assistance, accessibility accommodation |
| `completion.json` | `marzi.learning.completion.v1` | MARZI-D016 option A: participation, meaningful attempt, the five result states, learner-facing copy |
| `mastery.json` | `marzi.learning.mastery.v1` | The five mastery states, confidence dimensions, forbidden inputs, learner-facing copy |
| `placement.json` | `marzi.learning.placement.v1` | MARZI-D009 option A boundary only — no UI, no content, no persistence |
| `review.json` | `marzi.learning.review.v1` | Review-candidate rules and the things review may never do |
| `scenarios.de.json` | `marzi.learning.scenario-objectives.v1` | 19 German scenarios, 61 objective variants |
| `scenarios.en.json` | `marzi.learning.scenario-objectives.v1` | 10 English-pilot scenarios, 33 objective variants |
| `source-inventory.json` | `marzi.learning.source-inventory.v1` | The frozen baseline totals and the drift rule |
| `schema/*.schema.json` | `marzi.schema-subset.v1` | The strict structural contract for each file above |

`schema/objective-result.schema.json` describes the record a **future**
evaluator would emit. Nothing emits it yet; it exists so the fixtures can
prove the completion semantics are deterministic.

## Coverage

| Target | Scenarios | Goal variants |
|---|---:|---:|
| German (live) | 19 | 61 |
| English (pilot) | 10 | 33 |
| **Total** | **29** | **94** |

`random` and `custom` are excluded from finite coverage. `random` selects one
production scenario at call time and inherits that scenario's objectives;
`custom` is a learner-authored goal with no production objective. Both
exclusions are recorded in `source-inventory.json` and enforced by the
validator.

## Identifier scheme

```text
competency          COM.KEY_DETAIL
scenario objective  de.arzt.book_appointment
objective variant   de.arzt.book_appointment.cough
```

Identifiers are immutable once learner evidence can reference them. A
correction publishes a new curriculum version with an explicit `supersedes`
mapping; an identifier's meaning is never changed in place.

## Rules the validator enforces

`node test/learning-contracts.js` runs 36 checks and exits non-zero on any
failure. It parses `public/index.html` as text rather than executing it. Among
the rules:

- exactly 19/61 German and 10/33 English coverage, and 94 identifiers total;
- every production goal is mapped exactly once, by index **and** by exact
  text, so adding, removing, reordering or editing a goal fails the build;
- every competency reference resolves and the declared competency set equals
  the set derived from the objective's criteria;
- the prerequisite graph is acyclic, has no self or duplicate edges, and
  supports only the `recommended` kind;
- exactly six explanation languages per objective title;
- no criterion may use an activity, time, reward or fluency proxy;
- no XP, coin, price, entitlement or reward value appears anywhere;
- no acoustic or pronunciation evidence is accepted;
- assistance mode and accessibility accommodation may never be conflated;
- `insufficient_evidence` is a first-class result in completion and mastery;
- the five completion states are mutually exclusive and exhaustive, derived by
  one canonical function over required criteria only;
- optional criteria never gate completion and an accommodation never changes a
  derived result;
- a review status may only leave `pending_specialist_review` when the canonical
  review record carries a complete, version-matched row for that gate — a
  structural check, not identity verification (see below);
- `supersedes` is `null` in v1, because v1 has no predecessor registry;
- every negative fixture fails for **exactly** its declared reason code; and
- the current draft set is **refused** by release-mode validation.

## The completion truth table

Completion is derived from required criterion outcomes only, in this
precedence. The order is recorded in `completion.json` as
`derivationPrecedence` and the validator asserts the contract and the code
agree, so there is one rule set rather than two.

| Order | Condition | Result |
|---:|---|---|
| 1 | any required observation is invalid, or the evaluation context is invalid, stale, duplicated, or cross-session | `invalid` |
| 2 | otherwise any required outcome is `not_demonstrated` | `not_complete` |
| 3 | otherwise any required criterion is absent, `not_observed`, or `insufficient_evidence` | `insufficient_evidence` |
| 4 | otherwise every required outcome is `demonstrated` | `complete` |
| 5 | otherwise at least one is `partially_demonstrated` and the rest are `demonstrated` or `partially_demonstrated` | `partial` |

Anything not covered is a validation error, never a silent default. Only
`complete` is completion success; every other state keeps remediation and
further evidence available and removes no earned value. Absence of evidence is
never converted into `not_demonstrated`.

## Why release mode fails on purpose

`curriculumVersion` is `v1-draft`, every pedagogical item is
`pending_specialist_review`, and four numeric or content decisions are open
gates:

| Gate | What is deliberately absent |
|---|---|
| `MARZI-021-MASTERY-THRESHOLDS` | Minimum opportunities, minimum contexts, recency window, aggregation weights |
| `MARZI-021-REVIEW-RECENCY` | The review recency window |
| `MARZI-021-PLACEMENT-CONTENT` | Validated per-target calibration items |
| `MARZI-021-COMPETENCY-COPY` | Localized learner-facing competency labels |

No default was invented for any of them. Check 25 of the validator asserts
that release-mode validation reports every one of these gates, so quietly
closing one fails the build.

## What the validator's assurances actually bound

Three of its guarantees are deliberately narrower than they might read, and are
stated here so no reader over-trusts them.

**External review is checked structurally, not authentically.** The check proves
that the canonical record in `docs/learning/SPECIALIST_REVIEW.md` has the right
columns, that a row's review type is one of `specialist`, `linguistic` or
`accessibility`, that every required field is filled rather than a placeholder,
that the declared contract version or hash is well formed and matches, and that
a row of one gate is never counted for another. It **cannot** verify that a
named reviewer exists, is qualified, actually performed a review, or signed
anything. A filled-in row is a declaration, not proof. Evidence-backed
lifecycle transitions for the three review gates are a later pre-runtime
governance requirement, not something this package implements. Today every gate
is pending and the record is empty.

**The no-write guarantee is scoped.** The validator refuses the filesystem,
network and execution routes it wraps, and it fingerprints a declared protected
scope — the learning contracts, the learning fixtures, and its own source — by
path, file type, content hash, permission mode, and symlink target, comparing
before and after. Each deliberate probe must be refused *by the guard that owns
it*; an incidental `ENOENT` does not count. This is a scoped self-check. It is
not operating-system confinement, not a sandbox, and it does not prove that no
JavaScript program could write a file anywhere.

**Dynamic-execution detection is a bounded source scan.** It rejects direct
`eval` calls, `Function` and `new Function` construction, `AsyncFunction`,
`GeneratorFunction`, `vm` module requests, and the `runIn*Context` and
`compileFunction` execution APIs appearing in validator source, and the module
loader refuses `vm` outright. Indirect eval, computed global access, reflective
constructor lookup, and dynamic `import()` are **outside** the scan and are not
claimed to be covered. Executable-looking syntax inside a comment is rejected
too: the scan is textual by design, and that is treated as policy rather than a
false positive.

## What v1 supersession does not prove

`supersedes` is `null` for all 94 objectives, and every non-null value is
refused. That is the whole guarantee. Existence across immutable earlier
versions, version ordering, duplicate-successor policy, and cycle detection are
**not** implemented, so this is not a version-graph integrity check. All four
must be designed before non-null supersession is enabled in a later versioned
migration.

## Formatting

The JSON is written with one-space indentation. That is a size decision, not a
style preference: MARZI-021 section 18 caps the aggregate contract JSON at
250 KiB uncompressed and the set is 236 KiB at one space.

## What this directory does not do

It changes no runtime file, no prompt, no provider, no storage key, no reward
value and no scenario identity. It never reads or rewrites learner data, and
the legacy `scenariosDone` counter keeps its existing meaning as activity
history. Runtime integration belongs to a later package and to the ownership
boundaries MARZI-022 will fix.
