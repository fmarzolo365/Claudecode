# Moderated Android study protocol

**Review ID:** `marzi-review:marzi-061:android-study:v1`
**Status:** PENDING · **Moderator:** NOT_APPOINTED · **Decision:** NOT_REVIEWED

This is a protocol. **No participant has been recruited, no consent obtained, no
session run, and no result exists.** The machine-readable form is
[`data/android-study-plan.json`](data/android-study-plan.json), whose participant,
observation, timing, and result collections are empty by design and are validated
to stay that way.

## 1. Objective

Establish whether learners understand the MARZI-021 objective, completion, and
mastery language on a small Android device, in Spanish and Arabic, with and
without increased text size.

## 2. Research questions

1. Do learners understand what an objective asks before a call begins?
2. Do they read Partial and Insufficient Evidence as recoverable rather than as
   failure?
3. Do they distinguish XP from mastery?
4. Do they understand how assistance is attributed to their work?
5. Do they understand that a non-audio route exists and is equitable?
6. Can they complete a call end to end without moderator help?
7. Do they recover from an interruption, offline state, or provider failure?
8. Is Arabic right-to-left content readable at the narrowest supported size?

## 3. Participants

**Inclusion:** adult learner of the target language at or below the stated band;
uses an Android phone as a primary device; reads one of the six supported
interface languages.

**Exclusion:** anyone who contributed to authoring the reviewed contracts; anyone
unable to give informed consent; anyone under the age of majority in their
jurisdiction.

Participant count, compensation, and recruitment channel require Product Owner
approval and are deliberately unset. No demographics are collected.

## 4. Consent and privacy checklist

Every item must be satisfied **before** recruitment begins:

- [ ] Legal and privacy approval of recruitment, consent wording, retention, and legal basis.
- [ ] Product Owner approval of compensation and participant count.
- [ ] A written withdrawal route that removes a participant's data.
- [ ] A recording policy capturing screen and audio only with explicit consent.
- [ ] A data-minimization rule storing no identifier beyond a study-local pseudonym.

Current state: legal `NOT_OBTAINED`, privacy `NOT_OBTAINED`, consent wording
`NOT_APPROVED`, retention `NOT_APPROVED`, legal basis `NOT_DETERMINED`, personal
data stored `false`.

## 5. Moderator script

Introduce yourself and the purpose. State that the product is being tested, not
the participant, and that they may stop at any time. Confirm consent aloud and
record that consent was given — never who gave it. Ask the participant to think
aloud. **Do not lead**: if they hesitate, wait, then ask "what are you thinking?"
and record the hesitation rather than resolving it. Close by thanking them and
confirming the withdrawal route.

## 6. Observer guide

One observer records only what is said and done: the task ID, the observed state,
the time to first action, whether the participant proceeded unaided, and any
verbatim phrase that reveals a misunderstanding. Interpretation happens after the
session, not during it. Never record a name, contact detail, demographic, or
health fact.

## 7. Task sequence

| Task | Instruction | Observed states |
|---|---|---|
| 001 | Open the app and reach the objective for a chosen scenario. | listening, processing |
| 002 | Read the objective aloud and restate it in your own words. | — |
| 003 | Start a call and reach the listening state. | listening |
| 004 | Speak or type one contribution and observe the processing state. | processing, speaking |
| 005 | Reach a completion state and explain what it means. | — |
| 006 | Encounter and recover from an induced offline or error state. | offline, error, recovery |
| 007 | Handle an induced interruption and return to the task. | interruption, recovery |
| 008 | Locate and describe the non-audio route. | — |
| 009 | Describe what mastery would mean and whether XP is the same thing. | — |

**Success:** the participant completes the task unaided and describes it
accurately in their own words. **Failure:** they cannot proceed, proceed
incorrectly, or describe the outcome in a way that contradicts the contract.

## 8. Device and condition matrix

| Condition | Viewport | Text | Orientation | Locale | Direction | Connectivity | Accessibility |
|---|---|---|---|---|---|---|---|
| 001 | 320×568 | 100% | portrait | es | ltr | online | none |
| 002 | 320×568 | 200% | portrait | ar | rtl | online | none |
| 003 | 390×844 | 100% | portrait | es | ltr | degraded | none |
| 004 | 390×844 | 200% | landscape | ar | rtl | online | TalkBack |
| 005 | 390×844 | 100% | portrait | es | ltr | offline | system font scaling |

Android versions: 10, 12, 14.

Condition 002 deliberately reproduces the situation behind
`MARZI-A11Y-KNOWN-001`; that issue is open and is not fixed before the study.

## 9. Scenario selection

The moderator selects one German and one English-pilot scenario per session from
[`data/learning-evidence-matrix.json`](data/learning-evidence-matrix.json),
recording only the variant identifier.

## 10. Evidence capture

Allowed: moderator note, issue-log entry, timing-sheet entry, and — with explicit
consent — screen recording. Forbidden: participant name, contact detail,
demographic record, health data, raw account identifier. Evidence IDs match
`^marzi-evidence:marzi-061:android-study:[0-9]{3}$`.

Timing sheet: task ID, condition ID, time to first action, time to completion,
unaided or assisted. Issue log: [`templates/ISSUE_LOG.md`](templates/ISSUE_LOG.md).
Feedback form: [`templates/PARTICIPANT_FEEDBACK.md`](templates/PARTICIPANT_FEEDBACK.md).

## 11. Severity rubric

| Severity | Meaning |
|---|---|
| `BLOCKER` | The participant cannot proceed, or the product states something untrue about their learning. |
| `HIGH` | They proceed but misunderstand completion, mastery, or assistance attribution. |
| `MEDIUM` | They hesitate or need a second reading but recover unaided. |
| `LOW` | A wording or layout nuisance that does not change understanding. |
| `INFORMATIONAL` | An observation worth recording that implies no defect. |

## 12. Summary and decision

Summarize with [`templates/REVIEW_SUMMARY.md`](templates/REVIEW_SUMMARY.md) and
record the outcome with
[`templates/DECISION_RECORD.md`](templates/DECISION_RECORD.md). Report sample
size and its limits honestly; a small moderated study evidences comprehension
problems well and evidences their absence poorly. Your permitted decisions are
`APPROVED`, `APPROVED_WITH_CONDITIONS`, `CHANGES_REQUIRED`, `BLOCKED`, and
`NOT_REVIEWED`; none is pre-populated.
