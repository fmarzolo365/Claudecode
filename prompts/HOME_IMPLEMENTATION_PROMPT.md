# MARZI — HOME PRODUCTION PHASE V1
# REFERENCE-DRIVEN, CODE-GUIDED IMPLEMENTATION

PREREQUISITE:
MARZI UI Production V2 Phase 0 technical shell has been visually approved by the Product Owner.

Do not execute this prompt before that approval.

==================================================
READ FIRST
==================================================

Read completely:

- reference/HOME_REFERENCE_390x844.png
- docs/HOME_PRODUCT_SPEC.md
- docs/HOME_STATE_SPEC.md
- docs/HOME_I18N_ACCESSIBILITY.md
- contracts/HOME_MODEL.schema.json
- contracts/HOME_RECOMMENDATION_POLICY.json
- contracts/HOME_ANALYTICS_CONTRACT.json
- contracts/HOME_QUALITY_BUDGET.json
- reference-code/js/home-model-adapter.js
- reference-code/js/home-renderer.js
- reference-code/css/home-v1.css
- reference-code/tests/home-contract-snippet.js

The 390×844 PNG is the structural visual reference.
The supplied JS/CSS is reference implementation code: adapt to current symbols/DOM where necessary, but do not discard the architecture and improvise a new renderer.

==================================================
SCOPE
==================================================

Implement HOME ONLY.

Do not modify Practice, Talk, Store or Profile root content.
Do not start Wave 2.
Do not modify Gold Call or character runtime.
Do not rename storage keys.
Do not add third-party dependencies.
Do not install analytics.

Use the currently approved UI V2 shell/components.

==================================================
DATA ADAPTER — CRITICAL
==================================================

Before changing Home markup, inspect the CURRENT Home/Learn data sources and identify:

- learner/display-name source, if real
- current selected/recommended scenario source
- current character id associated with recommendation
- XP/current stage source
- journey/next-stage target
- streak/current mission/focus source
- current useful recent activity, if any

Do not create a second recommendation algorithm.

Build ONE thin adapter that maps existing live state to the HomeModel schema.

The renderer must not:
- read localStorage directly
- select scenarios
- calculate rewards
- mutate stats
- mutate ConversationSession

==================================================
RECOMMENDATION
==================================================

Show exactly ONE primary recommendation.

Use existing product state/recommendation logic and apply the provided policy only to resolve ambiguous existing candidates.

The CTA deep-links/calls the existing owner behavior.

When the recommendation character is:
arzt / apotheke / werkstatt

use approved production CALL_ART artwork.

No emoji.

==================================================
MARZI HERO
==================================================

Use the best existing canonical Marzi asset in the repository.

Do not:
- invent a new SVG Marzi
- use emoji
- upscale a soft temporary asset into a giant hero

If there is no suitable production-quality Marzi Home asset:
render a restrained art slot that does not look broken,
report:
HOME_MARZI_HERO_ASSET_MISSING

Do not burn tokens generating surrogate art in Claude Code.

==================================================
HOME COMPOSITION
==================================================

Above the first main scroll fold, prioritize:

1. contextual greeting / Home context
2. one recommendation
3. journey/progression
4. today's focus

Do not reintroduce a dominant permanent stats toolbar.

Do not create six equal cards.

Use live text/i18n, never strings copied from the PNG.

==================================================
STATES
==================================================

Implement graceful:
- new learner
- returning learner
- no recommendation
- progress unavailable
- offline/local fallback

Do not block entire Home with a spinner.

No layout jump above the main recommendation after first render.

==================================================
ACCESSIBILITY / LOCALIZATION
==================================================

Validate:
- 390×844
- 360×640
- 200% text
- Arabic/RTL representative state
- reduced motion

No horizontal overflow.
48px primary CTA.
Progress has accessible value.
Decorative art has empty alt.
No hardcoded English/Spanish.

==================================================
ANALYTICS
==================================================

Do NOT install a vendor.

If an existing internal analytics/event hook is already present, add only the vendor-neutral Home event names in the contract without raw transcript/free-text.
If no analytics system exists, document the proposed hooks and make no runtime analytics change.

==================================================
PERFORMANCE
==================================================

No new dependency.
No unnecessary network fetch caused by Home renderer.
Use existing asset URLs.
Art images use async decode/lazy behavior appropriately.
Primary CTA must not wait for analytics.

==================================================
VALIDATION
==================================================

Run focused Home tests only first.

Run:
python MARZI_HOME_PRODUCTION_PACK_V1/tools/validate_home_static.py public/index.html

Capture exactly:
1. Home 390×844 — returning learner
2. Home 360×640
3. Home 200% text
4. Home RTL
5. Home new/empty learner if practical via test fixture

Also capture one DOM geometry report:
- hero rect
- recommendation rect
- primary CTA size
- journey rect
- document scrollWidth/clientWidth

STOP for Product Owner review.

Do not automatically continue to Practice.

No deploy.

End exactly:

READY FOR MARZI HOME PRODUCTION REVIEW
