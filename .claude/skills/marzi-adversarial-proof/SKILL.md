---
name: marzi-adversarial-proof
description: Red-team proof construction: build tests that FAIL on the defective baseline for the exact claimed defect. Use for every P1/P2 red-team task.
---

# MARZI Adversarial Proof

WHEN TO USE
Constructing or validating red evidence for any P1/P2 finding.

AUTHORITATIVE QUESTIONS
- Exact delegated BASELINE_SHA? Does the worktree HEAD equal it (align detached,
  non-destructively, inside the isolated worktree only)?
- What exact ordering/input triggers the defect? (two-starts-before-first-await, resolve
  after replacement, fault at write N, rollback fault, duplicate resolution, oversized
  payload, poisoned response)
- Does the test fail BECAUSE of the claimed defect (signature match), not incidentally?
- Is the oracle consistent with canonical product behavior?

FAILURE MODES
- Testing the wrong SHA; oracle asserting implementation strings; failure from fixture
  bugs; production files touched; proof scope narrower than the claim.

MANDATORY PROOFS (report contract)
- FINDING ID, BASELINE SHA, test file, untruncated test-only patch + SHA-256, expected vs
  actual, exact failure signature, changed-path list, RED_PROOF_AVAILABLE YES/NO
  (NO requires NOT_PROVEN_REASON).

INVALID PROOFS
- App boots; guard present in source; happy-path pass; one handled failure; literal
  string search; green-only evidence.

STOP CONDITIONS
- Baseline alignment impossible (RED_TEAM_BASELINE_MISMATCH); oracle conflicts with canon.