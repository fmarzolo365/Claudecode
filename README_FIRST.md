# MARZI APOTHEKE GOLD PACK V1

Second production-grade Gold call-art pack: the Adler-Apotheke pharmacist
(`apotheke`), matching the Dr. Wagner Gold state contract at `4ba3d15`
(`marzi-doctor-wagner-state-pack-v1`) on the frozen Gold Call shell
(`claude/marzi-gold-call-v1-freeze` @ `e94c4d1`).

## Contents

- `public/assets/call/characters/apotheke/{idle,listening,thinking,speaking,success}.webp`
  — five approved character states, 1600x1800, transparent, bottom-aligned,
  focal point x 0.5 / y 0.34. Identical canvas and integration geometry in
  every state so state changes never visually jump.
- `public/assets/call/backgrounds/pharmacy.webp` — 1800x1000 German pharmacy
  interior (apothecary drawer cabinet, medicine shelves, red Apotheke "A"
  roundel with a small gold Adler cue, counter with medicine boxes,
  prescription, terminal, and desk phone). Supports the same Gold stage crop
  as the Dr. Wagner clinic background.
- `asset-manifest.json` — pack declaration, state mapping, preload, transition
  and geometry contract.
- `SHA256_MANIFEST.json` — bytes + sha256 for every pack file.
- `STATE_PACK_PREVIEW.png` — five-state consistency sheet over the pharmacy
  background at the Gold stage crop.
- `source-masters/apotheke-*-master.svg`, `source-masters/pharmacy-background-master.svg`
  — the vector masters the WebP files were rasterized from (flat-cartoon,
  cream/green MARZI palette).

## State mapping (unchanged from Dr. Wagner Gold)

ready → idle, listening → listening, processing → thinking,
speaking → speaking, success → success, error → idle, disconnected → idle.

## Integration

Integrate only on top of the frozen Gold Call shell. The one required code
change is a single `CALL_ART` registry entry in `public/index.html`:

```
apotheke: {
  background: "/assets/call/backgrounds/pharmacy.webp",
  dir: "/assets/call/characters/apotheke/",
  states: { ready: "idle", listening: "listening", processing: "thinking",
            speaking: "speaking", success: "success",
            error: "idle", disconnected: "idle" },
  ext: ".webp",
},
```

Do not modify the artwork.
Do not redesign the shell.
Do not show generated/emoji fallbacks between valid production states.
