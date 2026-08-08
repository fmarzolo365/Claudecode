---
name: marzi-release-gate
description: Release-audit method: diff-first adversarial review ending in a disposition. Use for every release-auditor task.
---

# MARZI Release Gate

WHEN TO USE
Auditing a finished change set before external review.

AUTHORITATIVE QUESTIONS (in this order)
1. Original requirement - what was actually asked?
2. Raw diff - every hunk mapped to the requirement? Scope creep? Control-plane touches?
3. Affected current code - ownership captured before awaits? cleanup synchronous?
   transactions single-boundary? success UI gated on durable results? comments honest?
4. Direct tests - do they fail on the defective baseline (red evidence present)? Do they
   assert storage, not just UI? Order-independent?
5. Broader evidence - gates green, executed==registered, residual debt updated?
6. Implementer report LAST - discrepancies between report and diff are findings.

DEFAULT HYPOTHESIS
The change is NOT proven safe.

FAILURE MODES
- Report-first anchoring; accepting green without red; tests narrower than the fix;
  idempotency markers blocking repair; mutable shared result leakage; prefix-based trust.

MANDATORY PROOFS
- Written disposition per finding with evidence classification.

INVALID PROOFS
- Implementer self-assessment; test count; passing unrelated suites.

STOP CONDITIONS
- Verdict is exactly one of: READY FOR EXTERNAL REVIEW / CHANGES REQUIRED.
  Never PRODUCTION APPROVED.