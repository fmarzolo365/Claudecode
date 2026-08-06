# MARZI — PREMIUM CALL-SCREEN EXECUTION

Use Fable 5 + Ultracode at maximum available effort.

Work only on MARZI’s live call experience and its supporting visual-quality system.

## Required persistent resources

First verify or create:

- `.claude/skills/marzi-call-art-direction/SKILL.md`
- `.claude/agents/marzi-visual-director.md`
- `docs/design/MARZI_CALL_ASSET_SPEC.md`

Read them completely and treat them as binding.

Inspect all attached/canonical references, especially:

- `02_call.png`
- premium doctor reference
- current call screenshots
- canonical Marzi references

## Binding Product Owner decisions

1. Remove the live-call Transcript bottom sheet/modal entirely.
2. `Text` shows/hides inline dialogue inside the call screen.
3. Translation expands inline below the relevant message.
4. Remove visible `Auto`; preserve supported default behavior internally.
5. Keep `Need help?` inside the call, with progressive support.
6. Deeply re-engineer the visual composition; do not make a cosmetic patch.
7. Make the call screen MARZI’s highest-quality hero screen.
8. Create clean drop-in slots for final contact, background, Marzi-pose, and outfit assets.
9. Do not misrepresent temporary SVG or placeholder art as final.
10. Preserve runtime/session/provider/translation/reward/timer/storage contracts.

## Target composition

1. Compact call identity
2. Premium profession-specific character stage
3. Optional inline character and learner bubbles
4. Marzi companion/support zone
5. Inline help
6. Simplified controls
7. Integrated connection/time state

## Visual direction

- premium polished cartoon;
- warm cream and MARZI green;
- scenario-specific environment;
- clear profession cues;
- face safe zones;
- strong Marzi integration;
- elegant bubbles;
- mobile-native spacing;
- no debug/utility appearance;
- no generic chatbot/video-call look.

## Controls

Visible controls should be limited to distinct-value actions:

- primary Speak/microphone;
- Hang up;
- Text;
- Need help;
- Slow;
- Replay.

No visible Auto. No duplicated microphones or speakers. All targets at least 48×48.

## Required validation

Primary acceptance:

- 390×844 normal text.

Also validate:

- 360×640;
- 320×568;
- 390×844 at 200%;
- 320×568 at 200%;
- German;
- English or Spanish;
- Arabic RTL;
- long German including `Krankschreibung`.

Run focused and full affected suites.

Before committing, invoke `marzi-visual-director`. Correct all BLOCKER and HIGH findings and meaningful MEDIUM findings.

## Delivery

- Focus only on call-screen work and persistent art resources.
- Do not deploy.
- Do not modify main.
- Do not create a PR.
- Create one coherent commit.
- Push once to `origin/claude/marzi-017-product-refinement`.
- Verify clean and synchronized branch.

Commit message:

`MARZI: rebuild premium call experience and inline learning support`

Final report must include:

- commit hash;
- files changed;
- before/after transformation;
- transcript-sheet removal;
- inline Text and Translation behavior;
- Auto removal;
- character-stage and Marzi improvements;
- tests and counts;
- screenshot paths;
- visual-director decision;
- production-ready assets;
- temporary/missing asset IDs;
- exact commit for manual `marzi-staging-r4a` deployment;
- rollback command.

End exactly:

`READY FOR PREMIUM CALL-SCREEN VISUAL REVIEW`
