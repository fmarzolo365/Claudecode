# MARZI — WERKSTATT PAINTERLY GOLD V1 INTEGRATION
# DATA/REGISTRY INTEGRATION ONLY

This pack contains the approved Gold production pilot for:
contactId: `werkstatt`
display: `KFZ-Werkstatt Reuter`
family: `workshop`

DO NOT integrate `werkstatt2` yet.

==================================================
BASELINE GATE
==================================================

Before editing:

git fetch origin

Preferred baseline:
`origin/claude/marzi-apotheke-gold-v1-freeze`

Verify that the selected baseline contains approved Apotheke runtime commit:
`92875df`

If the freeze branch does not exist, use only a verified Apotheke Gold branch that contains 92875df.

Do not start from:
- main
- the rejected flat Apotheke branch
- a branch containing unrelated MARZI-006 changes

If no clean verified Gold baseline exists, STOP and report.

Create a new dedicated branch:

`claude/marzi-werkstatt-painterly-gold-v1`

Do not rewrite or force-push any existing Gold branch.

==================================================
PACK GATE
==================================================

Read:
- `asset-manifest.json`
- `SHA256_MANIFEST.json`
- `reference/WERKSTATT_GOLD_ART_DIRECTION.png`

Verify every checksum before integration.

Required assets:

- public/assets/call/characters/werkstatt/idle.webp
- public/assets/call/characters/werkstatt/listening.webp
- public/assets/call/characters/werkstatt/thinking.webp
- public/assets/call/characters/werkstatt/speaking.webp
- public/assets/call/characters/werkstatt/success.webp
- public/assets/call/backgrounds/workshop.webp

If any asset or checksum fails, STOP.

==================================================
IMPLEMENTATION
==================================================

Add only the minimal `werkstatt` CALL_ART registry entry.

Use:

werkstatt: {
  background: "/assets/call/backgrounds/workshop.webp",
  dir: "/assets/call/characters/werkstatt/",
  states: <same approved Gold states mapping>,
  ext: ".webp"
}

Mapping exactly:

ready        -> idle
listening    -> listening
processing   -> thinking
speaking     -> speaking
success      -> success
error        -> idle
disconnected -> idle

Reuse the approved Wagner/Apotheke Gold runtime unchanged:

- 1600×1800 transparent production character canvas
- focal point 0.5 / 0.34
- bottom aligned
- 253.2px Gold stage at 390×844
- production-first no-flash
- preload idle + listening before reveal
- warm thinking + speaking + success after start
- resident/warm layers
- decode before swap
- 150ms wall-clock crossfade
- <=180ms isolated settle target
- 0ms reduced-motion visual transition
- no production-art scale pulse
- fallback only on real load failure

Do NOT:
- change shell HTML/CSS
- change state machine
- change server.js
- change Text / Help / Translate / Speed / Replay / mic / footer
- touch MARZI-006
- modify supplied artwork
- generate SVG replacements
- integrate werkstatt2
- merge
- deploy

==================================================
FOCUSED REVIEW GATE
==================================================

Run focused checks only.

Verify:
1. all six production asset URLs return 200;
2. every Werkstatt call state resolves to the required WebP;
3. first reveal never shows emoji/generated/SVG mechanic;
4. no fallback, blank or veil between valid production states;
5. settled stage/portrait geometry is stable;
6. isolated state transitions settle <=180ms after warm-up;
7. reduced motion swaps immediately;
8. existing Gold Help/Text/Translate interaction still overlays correctly.

Capture exactly six 390×844 screenshots:

1. idle
2. listening
3. thinking
4. speaking
5. success
6. Text ON + Help ON for a Werkstatt scenario

STOP for Product Owner review.

Do not run the full suite before visual approval.
Do not merge or deploy.

If the repository stop hook requires preservation:
commit/push only to the dedicated Werkstatt branch.

Final report:
- baseline used and verification
- checksum verification
- exact files changed
- registry entry
- focused results
- screenshot paths
- commit SHA if preservation required

End exactly:

READY FOR WERKSTATT PAINTERLY GOLD REVIEW
