# Turkish (`tr`) linguistic checklist

**Locale:** `tr` · **Language:** Turkish · **Direction:** `ltr`

**Variant expected:** tr-TR

**Status:** PENDING · **Reviewer:** NOT_APPOINTED · **Decision:** NOT_REVIEWED

This is an instruction sheet for a qualified Turkish reviewer. It contains no
translation, no correction, and no approval. Read
[`../LINGUISTIC_REVIEW.md`](../LINGUISTIC_REVIEW.md) first.

## Scope

All 94 objective titles in `tr`, filtered from
[`../data/linguistic-matrix.json`](../data/linguistic-matrix.json) by
`locale == "tr"`. Work in `entryId` order so your coverage is provable.

## Turkish-specific checks

- Turkish agglutination produces long single words; check the narrowest viewport for unbreakable tokens.
- Vowel harmony must be correct in every suffix; a wrong suffix reads as a spelling error.
- Dotted and dotless i (`i`/`ı`, `İ`/`I`) are distinct letters — never normalize between them.
- Verify the verbal noun form used across titles is consistent (`almak` versus `alma`).
- Watch for Turkish-specific casing behaviour if any title is ever upper-cased at presentation time.

## Shared checks

Apply the seven review dimensions from the consolidated protocol to every
entry: grammar, spelling, register, naturalness, cultural appropriateness,
consistency, and ambiguity.

## Directionality and typography

This locale renders left to right. Expansion against the English source is
the main layout risk; report a title that cannot fit at 320 px as a finding
rather than shortening it yourself.

## Retained terms

`Marzi`, `DTZ`, and `Krankschreibung` are protected and must survive unchanged.
Flag a retained term only when retaining it makes the sentence ungrammatical.

## Evidence

Cite evidence IDs of the form `marzi-evidence:marzi-061:linguistic:NNN`. Record a
correction as data in a finding's `suggestedCorrection`; never edit
`localizedText`, which is compared against the canonical contract on every
validator run.
