---
name: marzi-completion-integrity
description: Completion-flow integrity for Prep, Drill, Vocab, Guided Dialogue, Weekly Test and Call Evaluation. Use for any reward-bearing completion.
---

# MARZI Completion Integrity

WHEN TO USE
Any flow that ends an activity and awards XP/coins/records.

AUTHORITATIVE QUESTIONS
- Where is the ONE completion transition? Is it a state machine step or a render?
- Can the completion path run twice (re-render, duplicate async resolution, double tap,
  repeated recognition callback, retry)? What is the reward identity?
- Is the once-only guard set ONLY after the durable result is known?
- Does failed durability show honest UI (no chips/fanfare/confetti), and can the same
  session retry without double payout?
- Can a stale async completion (evaluation, test scoring) outlive its activity?

FAILURE MODES
- Award-inside-render; guard-before-commit; separate persistence of record and reward;
  success celebration on failure; non-idempotent done transitions.

MANDATORY PROOFS
- Duplicate-invocation test (pays once); forced-durability-failure test (honest UI, no
  guard set, retry pays once); per-flow coverage - Drill/Vocab evidence does NOT prove
  Prep/Dialogue/Test/Evaluation.

INVALID PROOFS
- One flow's test cited for a sibling flow; UI text asserted without storage assertion.

STOP CONDITIONS
- Reward semantics ambiguous (repeatability is a product question): PRODUCT_DECISION_REQUIRED.