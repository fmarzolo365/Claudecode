---
name: marzi-call-art-direction
description: Enforce MARZI’s premium call-screen art direction and visual-quality process. Use whenever work touches the live call screen, call-stage composition, contact characters, scenario backgrounds, Marzi call poses, speech bubbles, inline text, translation, contextual help, call controls, call states, or responsive call behavior.
when_to_use: Apply for call-screen redesigns, visual corrections, character-asset integration, screenshot review, responsive fixes, RTL fixes, and any task that could change the visual hierarchy or interaction model of a MARZI call.
argument-hint: "[screen or task scope]"
user-invocable: true
---

# MARZI Call Art Direction

Treat the live call as MARZI’s hero product experience. Passing tests is necessary but never sufficient for visual acceptance.

## Canonical references

Before editing, locate and inspect:

1. `02_call.png` or the repository’s canonical call blueprint.
2. Current rendered call screenshots.
3. Canonical Marzi artwork and logo references.
4. `docs/design/MARZI_CALL_ASSET_SPEC.md`.
5. Existing runtime contracts and focused call tests.

When a reference is absent, report the missing reference and continue with the strongest repository evidence. Never invent that a temporary asset is canonical.

## Product intent

The call must feel:

- immersive;
- premium;
- character-led;
- warm;
- educational;
- mobile-native;
- emotionally clear;
- recognizably MARZI.

Reject results that resemble:

- a generic web page;
- a chatbot;
- a video-call clone;
- a debug interface;
- a portrait with controls layered around it;
- unrelated cards or overlays;
- rough placeholder art presented as final.

## Non-negotiable interaction model

- `Text` shows or hides inline dialogue inside the call screen.
- Translation expands inline beneath the relevant message.
- No live-call transcript modal, bottom sheet, drawer, or separate transcript screen.
- `Need help?` stays inside the call and reveals progressive support.
- Visible `Auto` control is removed; preserve the supported default behavior internally.
- Preserve speaker ownership, word tap, saved vocabulary, translation, slow replay, normal replay, timer, plan allowance, session lifecycle, and provider contracts.

## Visual hierarchy

Build the screen around:

1. compact call identity;
2. premium contact-character stage;
3. optional inline dialogue;
4. deliberate Marzi companion zone;
5. contextual help;
6. simplified controls;
7. integrated connection and time status.

At 390×844, every region must look intentional and balanced.

## Character stage

- The contact’s profession must be legible from the art and scene, not only the title.
- Preserve face safe zones; never cover eyes, mouth, or important professional cues.
- Use scenario-appropriate environment, crop, framing, and color treatment.
- Reserve clear regions for character text, learner text, and Marzi.
- If final art is missing, implement production-ready slots and use the strongest temporary asset without mislabeling it as final.

## Marzi

Marzi is an active companion, not a badge.

- Keep Marzi clearly visible at the primary viewport.
- Do not collide with faces, bubbles, or controls.
- Support pose/state slots: idle, listening, thinking, helping, success, retry, error/disconnected.
- Use subtle motion during speech and stronger motion for success.
- Honor reduced motion.

## Dialogue and translation

- Use true speech-bubble composition, not transcript-document formatting.
- Character and learner bubbles must be visually distinct.
- Use controlled line lengths and natural wrapping.
- Keep translations subordinate and connected to their source message.
- Preserve correct bidi behavior: target-language phrases can remain LTR inside RTL UI.
- Avoid exaggerated word spacing, one-word-per-line wrapping, and large empty blocks.

## Controls

- One unmistakable primary microphone action.
- Hang-up is clear but not visually dominant over learning.
- Secondary actions have distinct value: Text, Need help, Slow, Replay.
- No duplicate microphones or speakers.
- No truncated primary labels.
- Minimum target: 48×48 CSS px.
- Avoid hiding essential controls behind horizontal scrolling at the primary viewport.

## Required quality loop

Before committing:

1. Capture the current baseline at 390×844.
2. Implement the change.
3. Capture the result at 390×844.
4. Validate 360×640, 320×568, and 200% text.
5. Validate German, Spanish or English, and Arabic RTL.
6. Invoke `marzi-visual-director` for independent review.
7. Correct every BLOCKER and HIGH finding.
8. Correct meaningful MEDIUM findings.
9. Run focused and full relevant tests.
10. Report remaining `ASSET REQUIRED` items precisely.

## Visual rejection criteria

Do not finalize when any of these remain at 390×844:

- transcript sheet in the live call;
- translation in an unrelated overlay;
- visible Auto control;
- important face obstruction;
- Marzi treated as a tiny badge;
- overlapping controls;
- labels clipped or ellipsized without necessity;
- profession unclear;
- generic or inconsistent illustration treatment;
- no obvious improvement from the baseline;
- layout technically passing but visually weak.

## Asset honesty

Classify assets as:

- PRODUCTION READY
- USABLE BUT NEEDS IMPROVEMENT
- TEMPORARY
- MISSING
- STYLE-INCONSISTENT

Do not call inline SVG stand-ins final art. Use `docs/design/MARZI_CALL_ASSET_SPEC.md` for exact production requirements.

## Required final evidence

Report:

- before/after screenshot paths;
- primary viewport result;
- RTL and 200% status;
- interaction changes;
- tests and exact counts;
- visual-director disposition;
- production-ready assets used;
- temporary assets remaining;
- exact missing-asset IDs.
