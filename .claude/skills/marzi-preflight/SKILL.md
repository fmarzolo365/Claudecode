---
name: marzi-preflight
description: Baseline, scope and ownership preflight for any MARZI engineering task. Use before designing, testing or editing anything.
---

# MARZI Preflight

WHEN TO USE
Before any engineering action: verify repository truth first.

AUTHORITATIVE QUESTIONS
- Exact SHA? (`git rev-parse HEAD`) Exact branch? Clean worktree (`git status --short`)?
- Does HEAD equal the delegated BASELINE_SHA? If not: STOP, report mismatch.
- What is the assigned scope (files, finding IDs)? What is explicitly out of scope?
- Who is the authoritative owner of each touched concept (state, action, persistence key)?
- Which persistence keys are involved? Who reads/writes them? (trace code, not docs)
- Which existing tests protect the touched paths?
- Which product invariants apply (i18n parity, RTL, a11y, frozen keys, reward values)?

FAILURE MODES
- Working from a stale or wrong SHA; assuming architecture from names; scope creep;
  editing before ownership is traced; trusting reports over code.

MANDATORY PROOFS
- Recorded SHA/branch/worktree output; owner map for every touched concept.

INVALID PROOFS
- "The report said so"; memory of a previous session; file existence without content check.

STOP CONDITIONS
- Baseline mismatch; dirty worktree not created by the current task; scope conflict;
  missing source contract. Report exactly what blocked.