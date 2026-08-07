# MARZI Home — Production Product Spec

## Job to be done
Home answers one question:

> What should I do now to get better at the real conversations that matter to me?

It is not:
- a feature index
- a stats dashboard
- a second Practice screen
- a second Talk screen

## First viewport priority

1. Contextual greeting + Marzi companion
2. One next-best recommendation
3. Journey/progression
4. Today's focus

Everything else is secondary.

## Recommendation
Home shows exactly one primary recommended action.

Examples:
- Practise yesterday's mistakes
- Call the doctor again
- Continue the pharmacy scenario
- Review words due today

The renderer does not calculate pedagogical priority. It consumes the existing recommendation/state logic through an adapter.

## Journey
Show useful progress, not raw telemetry.

Good:
B1 · Confident Converser
320 / 600 XP
visual progress

Avoid:
a wall of "85 coins / 1 streak / 0 calls / 0 min..." as the main Home identity.

## Marzi
Marzi is a contextual companion on Home.
Use the best canonical art available.
Do not use a low-fidelity tadpole/temporary vector as a large hero.
If the necessary art asset is not good enough, use a restrained slot and report `HOME_MARZI_HERO_ASSET_MISSING`.

## Gold character recommendation art
When recommendation character is arzt/apotheke/werkstatt, use CALL_ART production art.
Never emoji.
