# MARZI-021 Current Learning and Scenario Audit

**Inspected baseline:** `ee88e0e2ecde8bcccb38c37ef7710c7e4f31bad4`

**Inspection date:** 2026-08-03

**Status:** Source-backed discovery; mappings below are provisional and require

Product Owner plus learning-specialist approval.

## 1. Executive finding

Marzi has substantial usable scenario content, but no shared typed curriculum
contract. The baseline contains:

- 19 production German scenarios with 61 free-text goal variants;
- 10 production English-pilot scenarios with 33 free-text goal variants;
- `random` and `custom` entry points in each target pack, correctly excluded
  from a finite production-objective coverage requirement;
- three German guided dialogues with four steps each;
- three 12-item basics decks for German and three 12-item basics decks for
  English;
- dynamic pre-call vocabulary/preparation and a generated six-item speaking
  test; and
- six runtime difficulty bands in order `A0`, `A1`, `A2`, `B1`, `B2`, `C1`.

The 94 production goal strings have no stable variant IDs, typed competencies,
prerequisite references, evidence rules, level ranges, completion criteria, or
mastery meaning. Current “done” map state is a scenario call count, not a
validated learning outcome.

## 2. Exact source evidence

| Evidence | Location at baseline | Finding |
|---|---|---|
| German base scenarios | `public/index.html:1953-2015` | Ten phone scenarios with English free-text `goals[]`. |
| Runtime bands | `public/index.html:2017-2030`, `2555-2569` | A0–C1 changes prompt length/rate/style; it is not objective mastery. |
| German face scenarios | `public/index.html:2593-2646` | Six in-person scenarios. |
| German DTZ scenarios | `public/index.html:2648-2677` | Three exam scenarios. |
| German groups | `public/index.html:2687-2697` | Seven groups including non-production free mode. |
| Guided dialogues | `public/index.html:2699-2802` | Three four-step scripted German dialogues. |
| English pilot pack | `public/index.html:2804-2886` | Ten production scenarios plus random/custom. |
| English groups | `public/index.html:2888-2905` | Six groups including free mode; active target swaps pack at load. |
| Scenario selection | `public/index.html:6841-6864` | One free-text goal is selected randomly and passed to ConversationSession. |
| Basics decks | `public/index.html:5207-5319` | Three 12-item decks per active target; schema is content-oriented, not competency-oriented. |
| Pre-call preparation | `public/index.html:6526-6667` | Dynamic vocabulary/repetition path; completion currently awards values independently of objective evidence. |
| Journey source | `public/index.html:4077-4115` | `scenariosDone[id] > 0` produces `done`; it is a visit/completion proxy. |
| Current call recording | `public/index.html:3269-3288` | Any call with a learner turn can record scenario completion after reward claim. |
| Post-call evaluation | `public/index.html:6269-6323` | LLM returns `true`/`false`/`partial` from transcript/goal; no typed criteria or cited opportunity evidence. |
| Weekly test | `public/index.html:6386-6463` | Generated six-item holistic 0–100/CEFR result; not validated per-competency placement. |
| Existing tests | `test/run.js:194-222`, `1430-1454` | Validate levels, scenario shape/group coverage, and call-count map behavior, not learning validity. |
| Product history | `docs/IMPLEMENTATION_REPORT.md:1047-1106` | MARZI-016 intentionally calls `scenariosDone` real completion data, creating terminology that MARZI-021 must disambiguate without rewriting history. |

## 3. German live-pack coverage

“Proposed primary competencies” supplies discovery coverage only. Final
objective criteria and mapping are subject to MARZI-D016 and specialist review.

| Scenario | Mode/group | Goal variants | Proposed primary competencies |
|---|---|---:|---|
| `arzt` | phone / Health | 4 | `FUN.ARRANGE`, `INT.STATE_PURPOSE`, `INT.PROVIDE_DETAIL`, `INT.NEGOTIATE` |
| `apotheke` | phone / Health | 3 | `FUN.REQUEST_INFORMATION`, `FUN.REQUEST_REMEDY`, `INT.PROVIDE_DETAIL` |
| `amt` | phone / Bureaucracy & money | 3 | `FUN.ARRANGE`, `FUN.REQUEST_INFORMATION`, `INT.PROVIDE_DETAIL` |
| `bank` | phone / Bureaucracy & money | 3 | `FUN.REPORT_PROBLEM`, `FUN.REQUEST_REMEDY`, `FUN.ARRANGE` |
| `vermieter` | phone / Home & daily life | 3 | `FUN.REPORT_PROBLEM`, `FUN.REQUEST_REMEDY`, `FUN.REQUEST_INFORMATION` |
| `paket` | phone / Home & daily life | 3 | `FUN.REPORT_PROBLEM`, `FUN.REQUEST_REMEDY`, `INT.NEGOTIATE` |
| `werkstatt` | phone / Home & daily life | 3 | `FUN.ARRANGE`, `FUN.REPORT_PROBLEM`, `FUN.REQUEST_INFORMATION` |
| `kita` | phone / Home & daily life | 3 | `INT.PROVIDE_DETAIL`, `FUN.REQUEST_INFORMATION`, `FUN.ARRANGE` |
| `friseur` | phone / Leisure & bookings | 3 | `FUN.ARRANGE`, `INT.NEGOTIATE`, `INT.CONFIRM` |
| `restaurant` | phone / Leisure & bookings | 3 | `FUN.ARRANGE`, `FUN.REQUEST_INFORMATION`, `INT.NEGOTIATE` |
| `nachbar` | face / Face to face | 5 | `FUN.SOCIAL_EXCHANGE`, `INT.ASK_INFORMATION`, `INT.NEGOTIATE`, `SOC.REGISTER` |
| `baecker` | face / Face to face | 3 | `FUN.TRANSACT`, `FUN.REQUEST_INFORMATION`, `FUN.ARRANGE` |
| `supermarkt` | face / Face to face | 3 | `FUN.REQUEST_INFORMATION`, `FUN.REPORT_PROBLEM`, `FUN.REQUEST_REMEDY` |
| `kollegen` | face / Face to face | 4 | `FUN.SOCIAL_EXCHANGE`, `INT.ASK_INFORMATION`, `SOC.REGISTER` |
| `empfang` | face / Face to face | 3 | `INT.PROVIDE_DETAIL`, `FUN.REPORT_PROBLEM`, `FUN.REQUEST_REMEDY` |
| `einkaufen` | face / Face to face | 3 | `FUN.TRANSACT`, `FUN.REQUEST_INFORMATION`, `FUN.REQUEST_REMEDY` |
| `dtz1` | exam / DTZ | 3 | `FUN.PRESENT`, `INT.PROVIDE_DETAIL`, `COM.KEY_DETAIL`, `LNG.COHERENCE` |
| `dtz2` | exam / DTZ | 3 | `FUN.PRESENT`, `COM.MULTISTEP`, `LNG.COHERENCE` |
| `dtz3` | exam / DTZ | 3 | `FUN.COLLABORATIVE_PLAN`, `INT.NEGOTIATE`, `INT.CONFIRM`, `COM.CONSTRAINT` |
| **Total** | 19 scenarios | **61** | All scenarios provisionally covered |

## 4. English pilot-pack coverage

| Scenario | Mode/group | Goal variants | Proposed primary competencies |
|---|---|---:|---|
| `endoctor` | phone / Health & money | 4 | `FUN.ARRANGE`, `INT.STATE_PURPOSE`, `INT.PROVIDE_DETAIL`, `INT.NEGOTIATE` |
| `enbank` | phone / Health & money | 3 | `FUN.REPORT_PROBLEM`, `FUN.REQUEST_REMEDY`, `FUN.ARRANGE` |
| `enlandlord` | phone / Home & daily life | 3 | `FUN.REPORT_PROBLEM`, `FUN.REQUEST_REMEDY`, `FUN.REQUEST_INFORMATION` |
| `endelivery` | phone / Home & daily life | 3 | `FUN.REPORT_PROBLEM`, `FUN.REQUEST_REMEDY`, `INT.NEGOTIATE` |
| `enservice` | phone / Home & daily life | 3 | `FUN.REPORT_PROBLEM`, `FUN.REQUEST_REMEDY`, `FUN.REQUEST_INFORMATION` |
| `enrestaurant` | phone / Leisure & bookings | 3 | `FUN.ARRANGE`, `FUN.REQUEST_INFORMATION`, `INT.NEGOTIATE` |
| `enhair` | phone / Leisure & bookings | 3 | `FUN.ARRANGE`, `INT.NEGOTIATE`, `INT.CONFIRM` |
| `enjob` | phone / Work | 3 | `FUN.INTERVIEW`, `FUN.PRESENT`, `FUN.REQUEST_INFORMATION`, `SOC.REGISTER` |
| `enneighbor` | face / Face to face | 5 | `FUN.SOCIAL_EXCHANGE`, `INT.ASK_INFORMATION`, `INT.NEGOTIATE`, `SOC.REGISTER` |
| `encafe` | face / Face to face | 3 | `FUN.TRANSACT`, `FUN.REQUEST_INFORMATION`, `FUN.REQUEST_REMEDY` |
| **Total** | 10 scenarios | **33** | All scenarios provisionally covered |

## 5. Other learning surfaces

| Surface | Current content/evidence | MARZI-021 treatment |
|---|---|---|
| Guided dialogues | Three German dialogues (`jonas`, `termin`, `tisch`), four scripted responses each; forgiving text match and scaffold after misses. | Map steps to the same competencies after scenario mappings; retain as supported practice, not automatic broad mastery. |
| Basics decks | Three 12-item decks per target (72 items total across German and English packs). | Treat as vocabulary/form practice; do not infer scenario completion or speaking mastery. |
| Pre-call preparation | Scenario-generated words/short sentences, reveal/repeat flow, up to five batches. | Record opportunity/support only after later event contracts; full reveal cannot prove independent retrieval. |
| Mistake review | Stored corrections and saved words. | Candidate review evidence only when linked to stable source/competency; legacy unlinked items stay reviewable without fabricated mappings. |
| Weekly speaking test | Six generated prompts, ASR/typed response, holistic AI score and CEFR label. | Do not treat as validated placement/mastery. MARZI-D009 and specialist-approved calibrated content are required. |
| Free/random conversation | Custom goal or randomly selected production scenario. | Random inherits the selected production objective; custom remains unclassified unless a safe later classifier yields explicit `insufficient_evidence` on uncertainty. |

## 6. Coverage gap report

| Contract element | Current coverage | Required MARZI-021 result |
|---|---:|---:|
| Production scenarios with stable objective metadata | 0 / 29 | 29 / 29 |
| Goal variants with stable IDs | 0 / 94 | 94 / 94 |
| Goal variants with typed competency references | 0 / 94 | 94 / 94 |
| Scenarios with explicit completion criteria | 0 / 29 | 29 / 29 after MARZI-D016 |
| Scenarios with level interval/rubric boundaries | 0 / 29 | 29 / 29 |
| Scenarios with prerequisite references | 0 / 29 | Deliberate coverage or explicit none |
| Objective titles localized in six explanation languages | 0 / 94 | 94 / 94 |
| Objective evidence tied to canonical response IDs | 0 / 94 | Schema-valid contract; runtime later |
| Assistance-sensitive evidence | 0 / 94 | Schema-valid contract; runtime later |
| Valid acoustic/pronunciation evidence | 0 | Remains 0 in v1 by design |
| “Not enough evidence” learning result | 0 | Required in all result schemas |

## 7. Confirmed terminology conflict

`docs/IMPLEMENTATION_REPORT.md` and current UI logic describe a rewarded call
count as scenario “completion.” MARZI-016 was internally accurate for that
implementation, but MARZI-021 introduces a stricter pedagogical term.

The safe migration is additive:

- preserve `scenariosDone` and its existing reader as legacy activity history;
- call it `attempted before` or equivalent presentation only in a later
  approved integration package;
- add a separate versioned objective/scenario result only after MARZI-D016;
- never rewrite old counts into objective completion or mastery; and
- never reset or destroy existing learner data.

No runtime terminology or storage migration occurs in this specification task.

## 8. Product and specialist gates

The discovery is complete enough to prepare implementation, but the learning
contract is not approved. The exact blockers are:

1. **MARZI-D009:** choose placement option and modalities.
2. **MARZI-D016:** choose completion semantics.
3. Product Owner approval of taxonomy, objective families, mastery states, and
   learner-facing presentation.
4. Learning-specialist review of all 94 variant mappings, band boundaries,
   rubrics, and negative fixtures.

Economy decisions MARZI-D014–D019 are not selected here. MARZI-021 supplies
future evidence inputs only and preserves every current XP/reward value.
