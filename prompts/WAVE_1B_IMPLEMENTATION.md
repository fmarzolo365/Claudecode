# MARZI — WAVE 1B PREMIUM APP SHELL
# ART-DIRECTED IMPLEMENTATION

The Product Owner rejected the visual/product shell of Wave 1 commit `495b69b`.
Its routing/state mechanics remain useful technical reference.

## Canonical references
Read completely:
- reference/MARZI_PREMIUM_SHELL_MASTER_BOARD.png
- reference/MARZI_PREMIUM_SHELL_COMPONENT_SYSTEM.png
- contracts/design-tokens.json
- contracts/navigation-contract.json
- contracts/screen-contracts.json
- docs/ART_DIRECTION.md
- docs/MECHANICS_TO_PRESERVE.md
- docs/COMPONENT_CONTRACT.md
- docs/SCOPE_AND_ACCEPTANCE.md

The PNGs are binding art direction, not optional moodboards.
Recreate with live UI. Do not bake screenshots/text from the boards into the app.

## Baseline safety
Fetch origin.
Verify:
- clean Gold pre-IA baseline `940bdee`
- Wave-1 technical reference `495b69b`

Create:
`claude/marzi-ia-wave1b-premium-shell`

Preserve/reuse mechanics from 495b69b, but do not preserve rejected visuals for convenience.
No force-push. No merge. No deploy.

If mechanics cannot be safely separated from rejected visual markup, stop and report before broad edits.

## Design system first
Centralize:
colors, typography, spacing, radii, card elevation, shell spacing, tab states.
No framework migration.
No per-screen styling hacks.

## Global shell
Tabs:
Home · Practice · Talk · Store · Profile

Preserve:
#learn→#home
selected-tab state
hash/back mechanics
Gold Call immersive hide
onboarding chromeless
storage keys

Keep removed:
hamburger, global gear, duplicate Home controls.

Bottom nav:
premium cream surface, icon+label, stable five-item geometry,
non-color selected state, 48px targets, safe-area, no scroll,
no clipped labels in supported locales.
Talk may be subtly emphasized, not a giant FAB.

## Header/status
Do not repeat the rejected permanent `Marzi + 3 big counters` bar.
Use contextual headers.
Coins/streak/minutes are subordinate status.
Do not remove their underlying functionality.
Minutes may still open plan sheet.

## Home
Using existing data only:
- contextual greeting / learner context
- Marzi companion hero
- Recommended for you
- journey/progress
- today's focus/milestone
- continue recent activity when available

Question answered: `What should I do now?`
Deep-link to owners; do not duplicate destination UIs.

## Practice
Using real reachable destinations only.
Hierarchy:
- Continue/recommended practice
- Prepare: Prepare call, Guided dialogue, Key vocabulary, Pronunciation if real
- Improve/Review: mistakes/review
- Library: Saved words if currently reachable

No fake features.
No six identical cards.
My Progress belongs conceptually to Home.

## Talk
Do NOT execute Wave 2.
Improve root first impression with current reachable data:
- Real conversations hero
- Continue conversation
- People & places if safely available
- Recommended situations
- entry to existing full setup/situation flow

Do not rewrite registry/session logic.
If legacy setup cannot safely move one level deeper without Wave-2 state changes, preserve behavior and report limitation instead of hacking.

## Store
Do not change economy.
Root should feel like customization:
- Marzi today/preview
- categories
- featured/available collection
- owned/equipped affordance
Designed placeholders if art missing.
Minutes secondary.

## Profile
Do not migrate storage/data.
Visually group real existing settings:
- learner summary
- Learning
- Speech & Voice
- Sound & Motion
- Account & Plan
- Privacy & Support
Do not invent nonfunctional settings.

## Gold Call protection
ZERO visual/runtime changes to:
Gold Call, characters, state runtime, Help/Text/Translate/Speed/Replay/mic/footer/ConversationSession.
Only prove shell disappears correctly.

## Responsive/accessibility focused checks
- 390×844
- 360×640
- 200% text
- RTL representative locale
- reduced motion
No clipped nav labels, horizontal overflow, focus/touch regression.

## Visual gate before broad testing
Capture exactly:
1. Home 390×844
2. Practice 390×844
3. Talk 390×844
4. Store 390×844
5. Profile 390×844
6. Gold Call 390×844
7. one contact sheet of the five root screens

STOP for Product Owner visual approval.
Do not start Wave 2.
Do not run the full product suite before this visual review unless repository policy requires a bounded preservation check.

If preservation requires commit/push:
only `claude/marzi-ia-wave1b-premium-shell`.

Final report:
- baseline strategy
- mechanics reused from 495b69b
- rejected visuals discarded/replaced
- files changed
- token/component system
- screenshots
- contact sheet
- focused responsive/accessibility results
- commit SHA if required

End exactly:
READY FOR MARZI PREMIUM SHELL REVIEW
