# World-class transformation — production asset manifest

What the world-class build (Waves 1–4) still wants from the artist, exactly
where each file drops in, and what stands in for it today. Nothing below
blocks the product: every slot has a registry that ships EMPTY and falls back
to approved shipped artwork, so approved files land by filename with no code
changes. Nothing in this list is represented as final art in the app.

## 1. Brand mark

| Slot | Path | Registration | Stand-in today |
| --- | --- | --- | --- |
| Header mark | `/assets/marzi/stage-6/header-neutral.svg` | `__registerBrandMark(true)` | Shipped Marzi SVG (stage art) |

The wordmark ("Marzï" with the sprout over the i) is implemented in code
(`UI.brandLockup`) per the approved logo board: language-neutral, no flag,
no target-language tagline. A production SVG wordmark may replace it 1:1.

## 2. Marzi states (MARZI-013 vocabulary)

8 states × 6 stages, `/assets/marzi/svg/marzi_<stage-slug>_<pose>_<state>.svg`
(see `marziAssetPath`). Registry `MARZI_ASSETS` ships empty; fallback is the
shipped parametric SVG (`marziSVG`).

## 3. Call poses (MARZI-018)

21 files: stages 4–6 × poses ready/listening/thinking/speaking/encouraging/
limit/offline at `/assets/marzi/call/stage-<n>-<pose>.svg`
(`marziCallAssetPath`, registry `MARZI_CALL_ASSETS`). The `sad` mood resolves
to `offline` art when the app is offline and `limit` art otherwise (W3 fix) —
deliver both.

## 4. Store catalog art (spec P3)

9 outfit renders keyed by slug: explorer, sporty, rainbow, classic,
university, artistic, professional, adventurer, graduate.
**Stand-in today (W3):** nine distinct inline-SVG garment glyphs
(`OUTFIT_GLYPHS` in `public/index.html`) — one colour + silhouette detail +
motif per item so the catalog reads as nine products. They are deliberately
simple flat garments and are NOT final art.

## 5. Outfit-on-Marzi layers (new in W3)

The Learn hero carries `data-worn="<outfit-id>"` on the `#marzi` art span and
shows the equipped outfit as a labelled chip. To dress Marzi herself, deliver
per-stage outfit layers (SVG, same 120×120 viewBox as the stage art) and
attach them by the `data-worn` hook; until then the chip is the honest
equipped-state signal.

## 6. Share cards (Wave 4)

Share moments (evolution / streak / goal-hit) currently share localized TEXT
via the native share sheet. For image share cards, deliver three 1200×630
templates (evolution stage, streak count, "I made the call") with a safe area
for localized copy in all six help languages including RTL Arabic.

## 7. Store listing (ASO)

Copy source of truth: `T.<lang>.tagline` (six languages) and the stage/outfit
names already localized in `T`. Screenshots for listing: Talk (single-flow
setup), the call screen with the inline help panel, Learn journey, Store
stage bands, post-call summary — the states captured by the Wave 1–4
screenshot harness.
