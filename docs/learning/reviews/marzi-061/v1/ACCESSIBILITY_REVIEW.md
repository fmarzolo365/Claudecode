# Accessibility review protocol

**Review ID:** `marzi-review:marzi-061:accessibility:v1`
**Status:** PENDING · **Reviewer:** NOT_APPOINTED · **Decision:** NOT_REVIEWED

This protocol lists conditions to examine. It is **not** a compliance result and
claims no WCAG, accessibility, or legal conformance.

## 1. Charter

Judge whether the MARZI-021 learner-facing language — objective titles,
completion states, mastery states — and the surfaces that will present them can
be perceived, operated, and understood by learners using assistive technology,
increased text size, right-to-left scripts, and small screens.

## 2. Conditions

| Axis | Values |
|---|---|
| Viewports | 320×568, 390×844 |
| Text scale | 100%, 200% |
| Orientation | portrait, landscape |
| Locales | `es`, `en`, `it`, `tr`, `ar`, `uk` |
| Direction | `ltr`, `rtl` |
| Assistive technology | TalkBack, external keyboard, switch access, system font scaling, reduced-motion setting |

The machine-readable check list is
[`data/accessibility-plan.json`](data/accessibility-plan.json).

## 3. What to examine

**Semantic structure.** Headings, landmarks, lists, and tables carry real
structure rather than a visual approximation.

**Screen-reader interpretation.** Every state and label is announced meaningfully
and in a sensible order; nothing important is announced only as punctuation or
position.

**Focus order and keyboard operation.** Focus follows reading order, never traps,
and every interactive element is reachable and operable without a pointer.

**Touch targets.** At least 48 × 48 CSS pixels wherever a touch target applies.

**Contrast and visible focus.** Text and meaningful non-text contrast against the
intended background; a visible focus indicator on every focusable element.

**Text scaling and zoom.** Usable and unclipped at 200% text; page zoom loses no
content or function.

**Localization expansion and RTL.** Longer translations do not clip, truncate, or
change meaning. Arabic renders in logical order with mixed-direction content
correctly isolated.

**Reduced motion.** The preference is honoured and no essential meaning is
carried by motion alone.

**Audio and speech alternatives.** Synthetic speech and audio have an equitable
non-audio route; where speech is not the construct being assessed, a typed or
deterministic route exists. Examine transcripts or captions wherever recorded or
synthetic audio carries meaning.

**Error identification and state communication.** Errors are identified in text,
associated with their control, and describe the correction. Every state change is
conveyed in text and semantics — never by colour, position, sound, or motion
alone.

**Cognitive accessibility, plain language, time limits.** Copy is plain and
non-punitive; simultaneous demands are reasonable; no essential task depends on a
time limit the learner cannot extend.

**Orientation.** Portrait and landscape both work; neither is locked without
justification.

## 4. Known issue — do not fix here

`MARZI-A11Y-KNOWN-001 — Arabic at 320×568 with 200% text can overflow.`

Status: **OPEN**. Measured during MARZI-021-R2: a long unbreakable Latin proper
noun inside a narrow right-to-left box overflows the viewport. It is recorded,
not resolved, and it is deferred to the presentation and runtime-integration
package. MARZI-061 must not fix it, and confirming it exists is not a finding
against this package.

Treat it as a starting point: examine whether the same failure mode appears
elsewhere in the six locales.

## 5. Evidence

Record evidence with [`templates/EVIDENCE_CAPTURE.md`](templates/EVIDENCE_CAPTURE.md)
using IDs of the form `marzi-evidence:marzi-061:accessibility:NNN`. A measurement
(scroll width, target size, contrast ratio) is stronger evidence than a
screenshot; a screenshot alone proves nothing about comprehension.

## 6. Assistive-technology matrix

For each condition in the plan, record the assistive technology used, the
viewport, the text scale, the orientation, the locale, the direction, the
expected behaviour, and what you actually observed. An unobserved condition stays
`NOT_REVIEWED` rather than being assumed to pass.

## 7. Severity, decision, remediation

Use the shared severity scale. A learner unable to perceive or operate something
essential is a `BLOCKER`. Your permitted decisions are `APPROVED`,
`APPROVED_WITH_CONDITIONS`, `CHANGES_REQUIRED`, `BLOCKED`, and `NOT_REVIEWED`;
none is pre-populated. Hand remediation over with
[`templates/REMEDIATION_HANDOFF.md`](templates/REMEDIATION_HANDOFF.md).
