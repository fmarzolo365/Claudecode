# MARZI — INTEGRATE DR. WAGNER GOLD STATE PACK V1
# REGISTRY / STATE-MAPPING ONLY

Baseline:
- branch: `claude/marzi-gold-call-v1-freeze`
- frozen Gold shell commit: `e94c4d1`

The attached/extracted pack contains the five approved Dr. Wagner state assets.

This is an integration task only.

DO NOT:
- redesign the call shell;
- change Text / Help / Translate / Speed / Replay UX;
- alter stage geometry;
- modify supplied artwork;
- generate new artwork;
- touch MARZI-006;
- add characters or scenarios;
- run a broad visual redesign;
- deploy.

Read:
- `asset-manifest.json`
- `reference/DOCTOR_WAGNER_STATE_REFERENCE.png`

Verify exactly these files exist:

- `public/assets/call/characters/arzt/idle.webp`
- `public/assets/call/characters/arzt/listening.webp`
- `public/assets/call/characters/arzt/thinking.webp`
- `public/assets/call/characters/arzt/speaking.webp`
- `public/assets/call/characters/arzt/success.webp`

If any are missing, STOP.

==================================================
1. BIND STATES
==================================================

Use exactly:

ready       -> idle.webp
listening   -> listening.webp
processing  -> thinking.webp
speaking    -> speaking.webp
success     -> success.webp
error       -> idle.webp
disconnected-> idle.webp

Do not invent additional state mappings.

==================================================
2. PRESERVE GEOMETRY
==================================================

All five assets share the same 1600×1800 transparent canvas.

Render every state with the same:
- object-fit;
- object-position;
- focal point;
- stage height;
- crop policy.

At 390×844 the approved stage remains 253.2 CSS px.

No state may:
- change stage height;
- zoom differently;
- shift the face;
- jump vertically;
- expose a different crop policy.

==================================================
3. PRELOAD
==================================================

Before first stage reveal:
- preload/decode `idle.webp`
- preload/decode `listening.webp`

Immediately after call start:
- warm `thinking.webp`
- warm `speaking.webp`
- warm `success.webp`

The first visible frame follows the existing no-flash production-art rule.

Do not show a generated/emoji/SVG doctor while a valid production state is pending.

==================================================
4. STATE TRANSITIONS
==================================================

When call state changes:

current approved state stays visible
-> next production image decodes
-> crossfade to next image

Target:
160 ms
acceptable range:
120–180 ms

With `prefers-reduced-motion`:
instant swap, 0 ms.

Never show:
- blank frame;
- clinic-only frame between valid state swaps;
- fallback art between valid state swaps;
- loading veil between already-warmed states.

==================================================
5. ARTWORK IMMUTABILITY
==================================================

Do not:
- crop the five supplied files independently;
- alter face scale;
- recolor them;
- add CSS filters that change their art;
- regenerate states;
- replace them with SVGs.

They are the source assets for this state pilot.

==================================================
6. FOCUSED VALIDATION
==================================================

Before full validation, run focused checks only:

A. registry paths all exist;
B. each call state resolves to the required asset;
C. idle/listening decoded before first reveal;
D. thinking/speaking/success warm successfully;
E. simulated state sequence:
   idle -> listening -> thinking -> speaking -> success;
F. no fallback becomes visible between valid states;
G. stage geometry stays exactly stable;
H. reduced-motion swap works.

Capture exactly FIVE 390×844 screenshots using the same call shell:

1. idle
2. listening
3. thinking
4. speaking
5. success

For all five verify:
- doctor face remains in the same visual position;
- same apparent scale;
- coat and stethoscope visible;
- stage height unchanged;
- shell/controls unchanged.

Also capture one short state-transition trace/report showing resolved paths and transition timing. No video required.

STOP for Product Owner visual review.

Do not run the full suite yet.
Do not merge.
Do not deploy.

If the repository stop hook requires preservation, commit/push only to a new dedicated branch:

`claude/marzi-doctor-wagner-states-v1`

Do not update or rewrite `claude/marzi-gold-call-v1-freeze`.

End exactly:

READY FOR DR WAGNER STATE PACK REVIEW
