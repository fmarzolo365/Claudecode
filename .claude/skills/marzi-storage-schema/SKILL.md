---
name: marzi-storage-schema
description: Persistence key schema, validation-boundary and legacy-compatibility analysis. Use when touching any localStorage family or its readers/writers.
---

# MARZI Storage Schema

WHEN TO USE
Any change near a persisted key, its reader, writer or validator.

AUTHORITATIVE QUESTIONS
- Exact key name (frozen - never rename)? Container contract (object/array/string/number)?
- Record contract: which fields do CONSUMERS actually dereference? (derive validators
  from consumers, prove writers via `git log -S` history, not inference)
- What does the reader return for: missing, "null", wrong container, junk entries,
  partial objects, unknown future fields? One malformed key must not break siblings.
- Are limits needed (length caps exist: fixes 300, words 200, tests 52)?
- Legacy shapes: which are real (repository evidence) vs hypothetical?

FAILURE MODES
- Structurally-valid-semantically-unusable values; validators stricter than real history
  (data loss) or looser than consumers (crashes); normalization that silently rewrites.

MANDATORY PROOFS
- Malformed-matrix reads degrade to safe defaults with siblings intact; consumer-survival
  tests (the exact crash path); history command+output for any "all writers" claim.

INVALID PROOFS
- "Every writer always did X" without git evidence; object-shape check alone.

STOP CONDITIONS
- A required migration or schema change: PRODUCT_DECISION_REQUIRED.