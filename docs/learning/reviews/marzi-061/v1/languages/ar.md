# Arabic (`ar`) linguistic checklist

**Locale:** `ar` · **Language:** Arabic · **Direction:** `rtl`

**Variant expected:** Modern Standard Arabic

**Status:** PENDING · **Reviewer:** NOT_APPOINTED · **Decision:** NOT_REVIEWED

This is an instruction sheet for a qualified Arabic reviewer. It contains no
translation, no correction, and no approval. Read
[`../LINGUISTIC_REVIEW.md`](../LINGUISTIC_REVIEW.md) first.

## Scope

All 94 objective titles in `ar`, filtered from
[`../data/linguistic-matrix.json`](../data/linguistic-matrix.json) by
`locale == "ar"`. Work in `entryId` order so your coverage is provable.

## Arabic-specific checks

- Arabic is **rtl**. Read every title in logical order, not visual order.
- Mixed-direction content is the highest risk here: a retained Latin proper noun such as `Krankschreibung` must remain intact and correctly isolated, and must not reverse or split.
- Arabic is typically shorter in character count but taller in rendered line height; check 200% text at 320 px.
- `MARZI-A11Y-KNOWN-001` is an open overflow issue in exactly this combination — confirm the wording is right and leave the layout defect to the accessibility track.
- Do not embed directional control marks in the stored string; direction is a presentation concern.
- Check tāʾ marbūṭa, hamza seating, and shadda where they change meaning.

## Shared checks

Apply the seven review dimensions from the consolidated protocol to every
entry: grammar, spelling, register, naturalness, cultural appropriateness,
consistency, and ambiguity.

## Directionality and typography

This locale renders right to left. Mixed-direction fragments — Latin proper
nouns, digits, identifiers — must remain readable and must not be reordered
or split. Report a mixed-direction problem as a linguistic finding when the
*text* is wrong and as an accessibility finding when the *layout* is wrong.

## Retained terms

`Marzi`, `DTZ`, and `Krankschreibung` are protected and must survive unchanged.
Flag a retained term only when retaining it makes the sentence ungrammatical.

## Evidence

Cite evidence IDs of the form `marzi-evidence:marzi-061:linguistic:NNN`. Record a
correction as data in a finding's `suggestedCorrection`; never edit
`localizedText`, which is compared against the canonical contract on every
validator run.
