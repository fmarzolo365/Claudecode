# Ukrainian (`uk`) linguistic checklist

**Locale:** `uk` · **Language:** Ukrainian · **Direction:** `ltr`

**Variant expected:** uk-UA — the locale code is `uk`, never `ua`

**Status:** PENDING · **Reviewer:** NOT_APPOINTED · **Decision:** NOT_REVIEWED

This is an instruction sheet for a qualified Ukrainian reviewer. It contains no
translation, no correction, and no approval. Read
[`../LINGUISTIC_REVIEW.md`](../LINGUISTIC_REVIEW.md) first.

## Scope

All 94 objective titles in `uk`, filtered from
[`../data/linguistic-matrix.json`](../data/linguistic-matrix.json) by
`locale == "uk"`. Work in `entryId` order so your coverage is provable.

## Ukrainian-specific checks

- Ukrainian expands roughly 10–20% against English.
- Case endings must agree with the syntactic role the title implies; a nominative where an accusative belongs reads as an error.
- Use the apostrophe (ʼ) correctly; it is a letter-level mark, not punctuation to be stripped.
- Check that the aspect of each verb matches the completed or ongoing sense the objective intends.
- Do not import Russian calques; flag any that appear.

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
