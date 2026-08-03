# Marzi Learning Contracts

**Package:** MARZI-021 — Learning Competency, Curriculum, and Mastery Model

**Contract status:** AUTHORED v1 (`v1-draft`), pending specialist review

**Package status:** IMPLEMENTED (static contracts only)

**Baseline:** `ee88e0e2ecde8bcccb38c37ef7710c7e4f31bad4`

This directory is the specification source for what Marzi teaches, how a
learning opportunity is identified, and what evidence may support completion,
mastery, placement, and review. It does not own conversation history, rewards,
XP, coins, provider behavior, prompts, or runtime UI state.

## Authority and approval

The hierarchy in `docs/MARZI_PROGRAM_GOVERNANCE.md` applies. In particular:

- `docs/MARZI_PRODUCT_BIBLE.md` supplies the permanent product principles;
- `docs/MARZI_MASTER_ROADMAP.md` supplies MARZI-021 scope and dependencies;
- `docs/MARZI_DECISION_REGISTER.md` supplies unresolved Product Owner gates;
- `docs/packages/MARZI-021.md` is the implementation handoff;
- the files in this directory refine the learning contract without overriding
  any of those sources.

The Product Owner recorded the following on 2026-08-03, which released static
contract authoring:

1. MARZI-D009 option A — optional, bounded placement calibration;
2. MARZI-D016 option A — objective-based completion with explicit Partial and
   Insufficient Evidence states; and
3. in-principle approval of the taxonomy, objective families, stable
   identifiers, and mastery presentation states.

That authorization is not educational approval. A qualified learning
specialist has **not** been named and has signed off nothing. Specialist,
six-language linguistic, and accessibility review all remain mandatory before
educational approval, runtime integration, or production release, and every
pedagogical item in `contracts/v1/` is marked `pending_specialist_review`
until then. See `SPECIALIST_REVIEW.md`.

MARZI-D008 affects onboarding packages but is not a MARZI-021 blocker. This
package therefore defines no onboarding step count and makes no
onboarding-flow change.

## Documents

- `LEARNING_MODEL.md` — the competency taxonomy, evidence vocabulary,
  prerequisite graph, mastery confidence, placement boundary, review rules,
  and assistance-sensitive evidence.
- `SCENARIO_OBJECTIVE_SCHEMA.md` — the versioned, machine-validatable
  scenario/objective contract and its migration rules.
- `CURRENT_SCENARIO_AUDIT.md` — source-backed inventory and provisional
  coverage map for the current German and English production scenario packs.
- `SPECIALIST_REVIEW.md` — what is waiting for the learning specialist, which
  gates they close, and the empty record their findings go into.
- `contracts/v1/` — the machine-readable contracts, their schemas, and
  `contracts/v1/README.md` describing the whole set.
- `../packages/MARZI-021.md` — exact implementation scope, gates, acceptance
  criteria, tests, evidence, rollback, and review handoff.

The contracts are validated by `node test/learning-contracts.js`, which is
dependency-free, writes nothing, and fails the build if a production scenario
or goal string drifts away from its mapping.

## Terms that must remain distinct

| Term | Meaning | Not equivalent to |
|---|---|---|
| Participation | The learner made a valid contribution. | Completion, mastery, XP |
| Meaningful learning attempt | At least one assessable learner response is linked to an offered objective opportunity. | A call start, elapsed time, hang-up |
| Objective completion | The approved terminal evidence for one scenario objective is present. | Ending the call, scenario visit count |
| Scenario completion | The approved combination of objective results for that scenario. | `scenariosDone > 0` under the current runtime |
| Mastery | Supported, repeated, sufficiently independent evidence for a competency. | XP, coins, rank, Marzi stage |
| Confidence | How much valid evidence supports a mastery state. | A probability of personal ability |
| Review due | Evidence suggests useful review because performance is weak, old, or overly assisted. | Punishment or loss of earned XP |
| Not enough evidence | The system cannot make the claimed learning judgment. | Failure |

## Versioning rule

Every future machine-readable learning artifact must declare a schema version
and a curriculum version. IDs are immutable once learner evidence references
them. Corrections create a new version and an explicit supersession mapping;
they never silently reuse an ID with a different meaning.

The MARZI-021 implementation is additive. Existing runtime data and prompt goal
strings remain readable and unchanged until a later approved integration
package supplies a tested migration and rollback path.
