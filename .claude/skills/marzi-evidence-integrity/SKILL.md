---
name: marzi-evidence-integrity
description: Evidence classification and packaging discipline for critical reports. Use when assembling or auditing any evidence package.
---

# MARZI Evidence Integrity

WHEN TO USE
Writing or auditing any critical claim, report or review package.

AUTHORITATIVE QUESTIONS
- Classify EVERY claim: REPRODUCED / RED TEST PROVEN / FIXED / INDIRECTLY VERIFIED /
  NOT PROVEN. For P1/P2: INDIRECTLY VERIFIED != FIXED unless direct proof is technically
  impossible and that limit is disclosed to external review.
- Are sources extracted from exact git objects with explicit SHAs? Diffs untruncated?
- Is the final archive hash DETACHED (.sha256 or external report), never a claimed
  final hash inside the archive it describes?
- Does every history claim carry the exact command and output?
- Does test scope match implementation scope (no sibling-flow extrapolation)?
- Do source comments overstate guarantees (e.g. "atomic" for best-effort rollback)?

FAILURE MODES
- Scope inflation; self-referential hashes; count-based confidence ("N tests pass");
  unverifiable history claims; buried uncertainty.

MANDATORY PROOFS
- Complete artifact manifest with per-file SHA-256; explicit uncertainty section.

INVALID PROOFS
- "All checks passed" as sole release evidence; screenshots as behavioral proof.

STOP CONDITIONS
- A claim cannot be classified: mark NOT PROVEN, never upgrade it silently.