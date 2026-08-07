# MARZI — WERKSTATT GOLD ART V2 FINAL
# REPLACE FIVE ASSETS ONLY

The existing Werkstatt integration at `953e659` is technically approved.
The previous V1 artwork was rejected only because thinking/speaking/success lost torso continuity or changed apparent scale.

This V2 task is ARTWORK REPLACEMENT ONLY.

## BASELINE

git fetch origin

Verify:

origin/claude/marzi-werkstatt-painterly-gold-v1

contains:

953e659

If not, STOP.

Create:

claude/marzi-werkstatt-gold-art-v2

from that verified baseline.

Do not rewrite V1.

## EXTRACT + VERIFY

Extract:

MARZI_WERKSTATT_GOLD_ART_V2_FINAL.zip

at repository root.

Read:
- asset-manifest.json
- SHA256_MANIFEST.json
- reference/WERKSTATT_GOLD_V2_REFERENCE.png

Verify all checksums.

## STRICT CHANGE SCOPE

Replace ONLY:

public/assets/call/characters/werkstatt/idle.webp
public/assets/call/characters/werkstatt/listening.webp
public/assets/call/characters/werkstatt/thinking.webp
public/assets/call/characters/werkstatt/speaking.webp
public/assets/call/characters/werkstatt/success.webp

DO NOT change:

- workshop.webp
- CALL_ART
- state mapping
- preload logic
- crossfade logic
- no-flash logic
- stage geometry
- CSS crop/object-position
- Gold shell
- Text / Help / Translate / Speed / Replay
- microphone
- footer
- server.js
- MARZI-006
- werkstatt2

Do not compensate with CSS or transforms.

If repository convention requires it because the five existing URLs changed bytes, bump ONLY the service-worker cache constant.

## FOCUSED VALIDATION

Run focused validation only.

Verify:

1. five replacement URLs return 200
2. file hashes equal this pack
3. production-first reveal unchanged
4. state mapping unchanged
5. runtime timings remain within the already-approved Werkstatt envelope
6. no blank / fallback / emoji / veil between states
7. stage geometry unchanged

Capture exactly six 390×844 screenshots:

- idle
- listening
- thinking
- speaking
- success
- Text ON + Help ON

VISUAL GATE:

The same mechanic must be obvious in every state.

Specifically:
- head scale consistent
- shoulders/torso consistent
- dark REUTER overalls visible in all five
- listening retains full torso
- thinking retains full torso
- speaking retains full torso
- success is not zoomed
- no floating head, hand or arm
- workshop background unchanged

STOP after screenshots.

Do not run full suite.
Do not merge.
Do not deploy.

If stop hook requires preservation, commit and push only to:
claude/marzi-werkstatt-gold-art-v2

End exactly:

READY FOR WERKSTATT GOLD ART V2 REVIEW
