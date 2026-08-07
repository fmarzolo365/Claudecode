# MARZI — APOTHEKE PAINTERLY GOLD V2 INTEGRATION
# INTEGRATION ONLY — DO NOT DESIGN

This pack replaces the rejected flat-vector Apotheke art with the externally supplied painterly Gold assets.

MANDATORY BASELINE GATE

Before editing:

git fetch origin

Verify that:
origin/claude/marzi-doctor-wagner-states-v1-i5o6eq
contains commit:
4ba3d15

If that baseline cannot be verified, STOP.

Create a NEW integration branch from that verified Wagner Gold state baseline:

claude/marzi-apotheke-painterly-gold-v2

Do not modify or rewrite the Wagner branch.
Do not merge the old flat Apotheke branch.
Do not cherry-pick commit 2a0161a.
The old flat pack is reference-only and is NOT production art.

Extract this pack at the repository root and read:
- asset-manifest.json
- reference/APOTHEKE_GOLD_ART_DIRECTION.png

Verify checksums before integration.

REQUIRED ASSETS

- public/assets/call/characters/apotheke/idle.webp
- public/assets/call/characters/apotheke/listening.webp
- public/assets/call/characters/apotheke/thinking.webp
- public/assets/call/characters/apotheke/speaking.webp
- public/assets/call/characters/apotheke/success.webp
- public/assets/call/backgrounds/pharmacy.webp

If any are missing, STOP.

IMPLEMENTATION

Add only the minimal CALL_ART registry entry for `apotheke`, using the existing Wagner production-art architecture.

State mapping:
ready        -> idle
listening    -> listening
processing   -> thinking
speaking     -> speaking
success      -> success
error        -> idle
disconnected -> idle

Reuse unchanged:
- production-first no-flash behavior
- preload idle + listening before first reveal
- warm thinking + speaking + success after start
- decode-before-swap
- 150ms wall-clock crossfade
- 0ms reduced-motion swap
- same Gold stage geometry
- same focal/crop policy
- real-failure-only fallback
- no production-art scale pulse

DO NOT:
- modify supplied artwork
- regenerate SVGs
- change the Gold call shell
- change Text / Help / Translate / Speed / Replay / mic / footer
- touch MARZI-006
- integrate `apotheke2` yet
- merge
- deploy

FOCUSED REVIEW GATE

Run focused checks only:
1. all six asset URLs return 200
2. registry resolves every Apotheke state
3. no emoji/generated/SVG flash at first reveal
4. no fallback/blank/veil between valid production states
5. stage height and crop remain identical
6. state transition timing remains Gold-compatible
7. reduced-motion swap remains immediate

Capture exactly five 390x844 screenshots:
- idle
- listening
- thinking
- speaking
- success

Also capture one Text ON + Help ON screenshot for the pharmacy scenario to confirm the existing Gold shell overlays the new art correctly.

STOP for Product Owner review.

Do not run the full suite before approval.
If the stop hook requires preservation, commit and push only to the new dedicated integration branch.

Final report:
- baseline verification
- exact files changed
- checksum verification
- registry entry
- focused validation
- screenshot paths
- commit SHA if preservation required

End exactly:

READY FOR APOTHEKE PAINTERLY GOLD REVIEW
