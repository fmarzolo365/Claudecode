# Six-language linguistic review protocol

**Review ID:** `marzi-review:marzi-061:linguistic:v1`
**Status:** PENDING · **Reviewers:** NOT_APPOINTED · **Decision:** NOT_REVIEWED

## 1. Charter

Judge whether the 564 localized objective titles are correct, natural, and
culturally appropriate in each of the six interface and correction languages,
and whether they say the same thing as the source they describe.

## 2. Scope and qualifications

One qualified native or near-native reviewer per locale, with experience
reviewing learner-facing product copy. Each reviewer reviews **their own locale
only**; a reviewer of one language never signs off another. Reviewers are not
named here; appointment is recorded in `docs/learning/SPECIALIST_REVIEW.md`.

## 3. Workflow for the 564 titles

Work from [`data/linguistic-matrix.json`](data/linguistic-matrix.json): 94
objective titles × 6 locales. Filter to your `locale`, then work in `entryId`
order so coverage is provable.

Each entry gives you:

| Field | Use |
|---|---|
| `entryId` | Stable navigation: `marzi-061:linguistic:<variantId>:<locale>` |
| `variantId`, `scenarioObjectiveId`, `scenarioId` | Where the title lives |
| `sourceText` | The production goal string the title describes |
| `localizedText` | The string under review, copied verbatim |
| `targetLanguage` | `de` or `en` — the language being *taught* |
| `locale` | The language the title is *written in* |
| `direction` | `ltr` or `rtl` |
| `learnerLevel` | The band interval the objective supports |
| `protectedTerms`, `retainedSourceLanguageTerms` | Terms that must survive |

## 4. Target language versus review locale

These are different axes and conflating them is the most common error here. The
**target language** is what the learner is practising: German or English. The
**review locale** is the language the interface and corrections are written in:
`es`, `en`, `it`, `tr`, `ar`, `uk`. A Spanish title describing a German scenario
is correct; a Spanish title that silently translates the German target content
into Spanish is not.

## 5. Review dimensions

For each entry record a status against each dimension:

| Dimension | Question |
|---|---|
| Grammar | Is it grammatical in your locale? |
| Spelling | Including diacritics and locale-specific orthography. |
| Register | Right level of formality and address for a learner-facing product? |
| Naturalness | Would a native speaker write this, or does it read as translation? |
| Cultural | Appropriate and non-offensive in the cultures that use your locale? |
| Consistency | Does one concept use one term across all 94 titles? |
| Ambiguity | Could a learner reasonably read this two ways? |

## 6. Placeholders and protected terms

No title currently contains a placeholder; if one appears, it must survive
translation unchanged and in a grammatical position.

Protected terms — `Marzi`, `DTZ`, `Krankschreibung` — and any retained German or
English proper noun must be preserved exactly. `Krankschreibung` in particular is
deliberately retained inside otherwise-localized titles; do not translate it. Flag
a retained term only if retaining it makes the sentence ungrammatical.

## 7. Proposed corrections

Record a correction as **data** in `suggestedCorrection` on a finding. Do not
edit `localizedText`, and never edit a production string: the matrix is compared
against the canonical contracts on every validator run, so an edit here is
detected as drift rather than accepted as a fix. Applying a correction is a
separate versioned MARZI-021 change.

## 8. Severity and evidence

Use the shared severity scale in [`REVIEW_GOVERNANCE.md`](REVIEW_GOVERNANCE.md).
A wrong meaning is at least `HIGH`; a register slip is usually `MEDIUM`; a
stylistic preference is `LOW`. Cite evidence IDs of the form
`marzi-evidence:marzi-061:linguistic:NNN`.

## 9. Cross-language consistency

After the per-locale passes, compare across locales: does one source concept map
to one consistent term everywhere, and do the six titles for a single objective
still describe the same outcome? Divergence here is a finding even when each
individual title is defensible.

## 10. Locale checklists

[`languages/es.md`](languages/es.md) · [`languages/en.md`](languages/en.md) ·
[`languages/it.md`](languages/it.md) · [`languages/tr.md`](languages/tr.md) ·
[`languages/ar.md`](languages/ar.md) · [`languages/uk.md`](languages/uk.md)

Each is an instruction sheet. None contains a translation, a correction, or an
approval.
