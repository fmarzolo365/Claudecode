---
name: marzi-transaction-durability
description: Durable-write and logical-transaction analysis for localStorage state. Use for rewards, purchases, counters and any multi-key persistence.
---

# MARZI Transaction & Durability

WHEN TO USE
Any durable mutation: stats, ledger, purchases, learning records.

AUTHORITATIVE QUESTIONS
- What is the logical transaction boundary? How many keys, in what order?
- At which write can HALF the transaction exist? What restores it? Can rollback fail?
- Multi-key localStorage rollback is BEST-EFFORT, never hard atomicity - is that stated?
- Can an idempotency marker (ledger entry, guard flag) survive a failure and block repair?
- Can a retry duplicate state after a partial commit or a partial rollback?
- Does the caller receive an explicit result? Is success UI gated on it?

FAILURE MODES
- Split writes; guard set before commit; rollback that rewrites with the same failing
  storage; shared mutable result state leaking between operations; silent catch.

MANDATORY PROOFS
- Fault injection at EVERY write boundary (first/middle/last) and at rollback;
  retry-after-failure test proving repair without duplication; single-write count proof
  for one-commit designs.

INVALID PROOFS
- "Rollback code exists"; a single happy-path write test; calling multi-key writes atomic.

STOP CONDITIONS
- True atomicity is required but impossible with the storage primitive: report the exact
  best-effort limit instead of claiming a guarantee; schema changes need PRODUCT_DECISION_REQUIRED.