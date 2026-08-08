---
name: marzi-backup-trust-boundary
description: Backup export/restore trust-boundary analysis. Use for backupSnapshot/applyBackup or any import of external data.
---

# MARZI Backup Trust Boundary

WHEN TO USE
Any change to export, restore, or their validation.

AUTHORITATIVE QUESTIONS
- EXACT allowlist: which keys/patterns obtain write authority? Prefix match is not an
  allowlist - can an arbitrary telefontrainer.*/marzi.* key be created? (currently YES -
  BACKUP_UNKNOWN_KEY_WRITE debt)
- Credential exclusion: telefontrainer.pin never exported, never applied on import.
- Per-key container AND semantic validation (ledger entries, record fields, date/score
  ranges)? Size/count/length/depth limits?
- Complete-candidate validation BEFORE any write; what happens on mid-apply failure and
  on rollback failure (double fault)? Never claim partial states impossible under all
  storage-failure combinations.
- Legacy backup files (prefix-only era, pin-carrying) stay restorable minus exclusions.

FAILURE MODES
- Write authority via prefix; structurally valid garbage restoring; resource abuse via
  oversized payloads; success reported for useless payloads; cache-vs-value confusion.

MANDATORY PROOFS
- Reject-matrix with byte-identical storage after every rejection; per-family malformed
  candidates; pin export+import assertions; forced mid-apply failure with rollback proof.

INVALID PROOFS
- One happy-path round-trip; "typeof value === string".

STOP CONDITIONS
- Allowlist tightening that could orphan real user data: PRODUCT_DECISION_REQUIRED.