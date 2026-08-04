# Italian (`it`) linguistic checklist

**Locale:** `it` · **Language:** Italian · **Direction:** `ltr`

**Variant expected:** it-IT

**Status:** PENDING · **Reviewer:** NOT_APPOINTED · **Decision:** NOT_REVIEWED

This is an instruction sheet for a qualified Italian reviewer. It contains no
translation, no correction, and no approval. Read
[`../LINGUISTIC_REVIEW.md`](../LINGUISTIC_REVIEW.md) first.

## Scope

All 94 objective titles in `it`, filtered from
[`../data/linguistic-matrix.json`](../data/linguistic-matrix.json) by
`locale == "it"`. Work in `entryId` order so your coverage is provable.

## Italian-specific checks

- Italian expands roughly 15–20% against English.
- Check article and preposition contractions (`del`, `nella`, `all'`) for correctness after any edit.
- Use the infinitive form consistently where the title names an action, as the existing titles do.
- Watch gendered agreement in participles and adjectives where the subject is the learner.
- Apostrophes must be typographic and must not be swapped for primes.

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
