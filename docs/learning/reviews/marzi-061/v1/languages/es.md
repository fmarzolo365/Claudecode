# Spanish (`es`) linguistic checklist

**Locale:** `es` · **Language:** Spanish · **Direction:** `ltr`

**Variant expected:** es-ES and Latin American usage

**Status:** PENDING · **Reviewer:** NOT_APPOINTED · **Decision:** NOT_REVIEWED

This is an instruction sheet for a qualified Spanish reviewer. It contains no
translation, no correction, and no approval. Read
[`../LINGUISTIC_REVIEW.md`](../LINGUISTIC_REVIEW.md) first.

## Scope

All 94 objective titles in `es`, filtered from
[`../data/linguistic-matrix.json`](../data/linguistic-matrix.json) by
`locale == "es"`. Work in `entryId` order so your coverage is provable.

## Spanish-specific checks

- Spanish expands roughly 15–25% against English; check the longest titles at 320 px first.
- Use `tú` or `usted` consistently with the register the objective implies, and flag any drift between the two.
- Check inverted opening punctuation (¿ ¡) where a title becomes a question or exclamation.
- Watch gendered agreement where the learner's own gender is unknown; prefer constructions that avoid assuming it.
- Accents and ñ must survive; a missing accent can change the word.

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
