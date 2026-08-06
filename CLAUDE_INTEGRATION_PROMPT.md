# MARZI DOCTOR GOLD PILOT — INTEGRATION ONLY

The complete production pilot pack is attached and extracted at the repository root.

First verify these exact files:

- `asset-manifest.json`
- `reference/MARZI_CALL_SCREEN_GOLD_REFERENCE.png`
- `public/assets/call/characters/arzt/listening.webp`
- `public/assets/call/backgrounds/clinic.webp`
- `public/assets/marzi/call/stage-1/helping.webp`

If any file is missing, stop.

If all files exist:

1. Read `asset-manifest.json`.
2. Integrate the supplied WebP assets exactly as delivered.
3. Do not generate, redraw, trace, recolor, or replace any artwork.
4. Register WebP/PNG assets ahead of SVG fallbacks.
5. Keep all generated SVG artwork as `FALLBACK_ONLY`.
6. Preserve all call logic, Text, inline Translation, Need Help, timer, rewards, provider behavior, RTL and PWA behavior.
7. Correct the shallow stage geometry:
   `height: clamp(210px, 28dvh, 252px)` at the primary viewport.
8. Use the supplied doctor as a transparent foreground layer over the supplied clinic background.
9. Use the supplied Marzi pose beside the suggestion/help bubble, not alone in a large empty center.
10. Do not run the full browser suite.
11. Do not invoke the visual-director agent.
12. Do not commit, push or deploy.

Run only:

- syntax check for changed JavaScript;
- asset-path existence check;
- one focused fallback check;
- one real Praxis Dr. Wagner render at `390×844`.

The screenshot must show:

- complete doctor face, hair, shoulders and upper torso;
- white coat, green clinical top and stethoscope;
- clinic context;
- Text ON;
- one doctor bubble;
- one learner bubble;
- inline Translation expanded;
- Marzi beside a suggestion;
- Help, Text, Slow, Replay, microphone and Hang Up;
- product-style connection/time footer;
- no transcript sheet;
- no visible Auto;
- no large unused central void.

Capture exactly one screenshot, then stop.

Report only:

1. changed files;
2. exact assets used;
3. resolver changes;
4. focused checks and results;
5. screenshot path;
6. known differences from the Gold Reference.

End exactly:

`READY FOR PRODUCT OWNER GOLD SCREENSHOT APPROVAL`
