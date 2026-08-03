# Marzi Learning Contracts

**Package:** MARZI-021 — Learning Competency, Curriculum, and Mastery Model

**Contract status:** PROPOSED v1

**Package status:** BLOCKED

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

The proposed v1 contract cannot become implementation-ready until:

1. MARZI-D009 (placement assessment policy) is approved and recorded;
2. MARZI-D016 (conversation/scenario completion) is approved and recorded;
3. the Product Owner approves the objective taxonomy, completion semantics,
   and mastery presentation; and
4. a qualified learning specialist signs off the taxonomy, mappings, CEFR
   interpretation, evidence rules, and rejected-edge-case fixtures.

An OPEN recommendation is not approval. MARZI-D008 affects onboarding packages
but is not listed as a MARZI-021 blocker in the Decision Register. This package
therefore defines no onboarding step count and makes no onboarding-flow change.

## Documents

- `LEARNING_MODEL.md` — proposed competency taxonomy, evidence vocabulary,
  prerequisite graph, mastery confidence, placement boundary, review rules,
  and assistance-sensitive evidence.
- `SCENARIO_OBJECTIVE_SCHEMA.md` — proposed versioned, machine-validatable
  scenario/objective contract and migration rules.
- `CURRENT_SCENARIO_AUDIT.md` — source-backed inventory and provisional
  coverage map for the current German and English production scenario packs.
- `../packages/MARZI-021.md` — exact future implementation scope, gates,
  acceptance criteria, tests, evidence, rollback, and review handoff.

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
