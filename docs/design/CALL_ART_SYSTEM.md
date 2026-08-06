# MARZI Call Art System

Status: frozen — generated vector art is FALLBACK ONLY (PO directive
2026-08-06); final production artwork arrives externally as transparent
PNG/WebP (Doctor Gold Pack first). No further generated variants.
Canonical visual target: the call-screen art-direction reference board
(warm · friendly · premium · clear · encouraging) and
`docs/design/concept-boards/02_call.png`.
Producer: `tools/call-art/` (dependency-free Node generator — the asset
pipeline lives in code and regenerates every file deterministically).

## 1. Visual language

- **Form** — rounded geometry, big readable eyes, friendly proportions,
  simplified anatomy, clean silhouettes. No sketch lines, no photoreal
  textures, no uncanny detail.
- **Line** — one warm dark-brown outline per family (`#4a3427` for humans,
  canonical `#33461f` for Marzi), consistent width, round caps/joins.
- **Colour** — cream `#f6f1e7`, Marzi greens `#7baf45/#5e8e32/#a8c97a`,
  warm shadow beige `#e8ddcb`, text `#2e2b26`, muted `#7c7468`; skin and
  hair in 2–3-step warm flat ramps; red stays a signal colour.
- **Shading** — soft-3D through layering: subtle linear/radial gradients,
  one ambient shadow under every character, chin/hair shadows, small rim
  highlight. No blur filters, no realistic rendering.
- **Depth** — background → shadow → body → clothing → face → accessory →
  highlight layer order in every asset.

## 2. Asset families and file structure

```text
public/assets/call/characters/<contactId>/<state>.svg   (10 × 5)
public/assets/call/backgrounds/<family>.svg             (10)
public/assets/marzi/call/<pose>.svg                     (10 brief poses)
public/assets/marzi/call/stage-<4|5|6>-<pose>.svg       (21, MARZI-018 registry)
public/assets/marzi/outfits/<outfit>.svg                (base, university,
                                                         explorer, graduate)
```

- Contact states: `idle, listening, speaking, thinking, success` — full
  illustrated scenes (backdrop + bust) in `0 0 512 512`, faces placed for
  the stage card's cover crop (`object-position: 50% 22%`).
- Backgrounds: `0 0 512 256` soft backdrops, 2–4 large low-noise objects,
  one per scenario family.
- Marzi poses: `0 0 120 120` (shipped Marzi vector convention), canonical
  DNA — round green frog, huge glossy eyes, thin round glasses, light
  hoodie with the green M. Stage 4 renders plain (no glasses/outfit),
  stage 6 adds the graduation cap.

## 3. Deterministic resolution (public/index.html)

- `resolveContactPortrait({contactId, state, speaker})` → scene path or
  `""`. Speaker 2 (mid-call handover persona) has no drawn art yet and
  falls back to the generated `/api/avatar/<id>2` portrait.
- `resolveScenarioBackground({scenarioId})` → family backdrop or `""`
  (family map in `CALL_ART.families`).
- `resolveMarziCallPose({callState, helpState, suggestionVisible, outcome})`
  → brief-vocabulary pose file. The live companion continues to render
  through the stage-aware `marziCallArt(stage, state)` single entry point,
  whose registry now ships with all 21 stage files registered.
- `resolveMarziOutfitAsset(outfitId)` → call variant for the four shipped
  outfits, `""` otherwise.
- Live state mapping: `CONTACT_STATE_FOR_CALL` (ready→idle,
  listening→listening, processing→thinking, speaking→speaking,
  error/disconnected→idle). `renderCallStatus` swaps the portrait scene on
  state change; `success` art is reserved for future summary use.
- Fallback chain is unchanged and test-guarded: production scene →
  generated portrait → scenario backdrop + emoji.

## 4. Regenerating / extending

```sh
node tools/call-art/generate.js            # rewrite all 95 SVGs
node tools/call-art/generate.js --preview p.html   # + review sheet
```

Add a contact in `tools/call-art/characters.js` (persona must match the
`server.js` AVATARS description), a family in `backgrounds.js`, or a pose
in `marzi.js`, regenerate, then add the id to `CALL_ART` in
`public/index.html` and to the inventory below. Bump the service-worker
`CACHE` whenever generated files change.

## 5. Quality gates

- `node test/run.js` — registry ↔ disk consistency (every registered path
  must exist), resolver determinism, fallback behaviour.
- Rendered screenshots at 390×844 (+360/320, RTL, 200%) before commit.
- `marzi-visual-director` review before any call-art change ships.

See `CALL_ASSET_INVENTORY.md` for the per-asset status ledger.
