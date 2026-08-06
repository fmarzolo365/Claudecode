# English (`en`) linguistic checklist

**Locale:** `en` · **Language:** English · **Direction:** `ltr`

**Variant expected:** en-GB spelling as used elsewhere in the product

**Status:** PENDING · **Reviewer:** NOT_APPOINTED · **Decision:** NOT_REVIEWED

This is an instruction sheet for a qualified English reviewer. It contains no
translation, no correction, and no approval. Read
[`../LINGUISTIC_REVIEW.md`](../LINGUISTIC_REVIEW.md) first.

## Scope

All 94 objective titles in `en`, filtered from
[`../data/linguistic-matrix.json`](../data/linguistic-matrix.json) by
`locale == "en"`. Work in `entryId` order so your coverage is provable.

## English-specific checks

- English is the shortest of the six here; it is the expansion baseline, not a target.
- Keep British spelling consistent with the rest of the product (`apologise`, `colour`, `neighbour`).
- This locale is also a *target language*: an English title describing an English-pilot scenario must still read as interface copy, not as the practice content itself.
- Watch for Americanisms introduced by translation memory.
- Check that imperative phrasing stays consistent across all 94 titles.

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
