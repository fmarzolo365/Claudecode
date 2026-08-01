# Marzi — Artist Delivery Checklist (P0)

One-page brief. Full reference: `MARZI_ASSET_SPEC.md`.
Visual source of truth: `concept-boards/01_home.png`, `02_call.png`,
`04_progress.png`.

**Draw original artwork using the boards as reference. Never trace, extract,
upscale or re-colour board pixels.**

---

## 1 · Mandatory P0 files — exactly 18

All are the **`hero` pose** (full body, front, slight 3/4) in three
expressions, one set per stage. Deliver SVG; PNG @2x and @3x alongside.

| # | Filename (`.svg`) |
|---|---|
| 1 | `marzi_01_eggs_hero_neutral.svg` |
| 2 | `marzi_01_eggs_hero_happy.svg` |
| 3 | `marzi_01_eggs_hero_sad.svg` |
| 4 | `marzi_02_tadpole_hero_neutral.svg` |
| 5 | `marzi_02_tadpole_hero_happy.svg` |
| 6 | `marzi_02_tadpole_hero_sad.svg` |
| 7 | `marzi_03_tadpole_legs_hero_neutral.svg` |
| 8 | `marzi_03_tadpole_legs_hero_happy.svg` |
| 9 | `marzi_03_tadpole_legs_hero_sad.svg` |
| 10 | `marzi_04_young_frog_hero_neutral.svg` |
| 11 | `marzi_04_young_frog_hero_happy.svg` |
| 12 | `marzi_04_young_frog_hero_sad.svg` |
| 13 | `marzi_05_studious_frog_hero_neutral.svg` |
| 14 | `marzi_05_studious_frog_hero_happy.svg` |
| 15 | `marzi_05_studious_frog_hero_sad.svg` |
| 16 | `marzi_06_expert_frog_hero_neutral.svg` |
| 17 | `marzi_06_expert_frog_hero_happy.svg` |
| 18 | `marzi_06_expert_frog_hero_sad.svg` |

Plus, for each: `…@2x.png` and `…@3x.png`.

**Stage content (from the boards)**
- **01 eggs** — a *cluster* of eggs on a leaf. Never a single egg.
- **02 tadpole** — tadpole, no limbs, small bubbles.
- **03 tadpole with legs** — tadpole with hind legs.
- **04 young frog** — full frog, **no glasses, no accessories**.
- **05 studious frog** — glasses + blue "Deutsch" book + brown backpack.
- **06 expert frog** — glasses + graduation cap + pencil + backpack.

Stages 1–3 are **undressed** — no hoodie, no clothing. The yellow hoodie is
the default *call* look for stages 4–6 only and is **not** part of P0.

## 2 · Naming convention

```
marzi_<stage>_<pose>_<expression>[_<outfit>][@2x|@3x].<ext>
```
Lowercase, underscores only. Stage slugs exactly as listed above.

⚠️ The product is **Marzi**. "Marcy" appears in one board and is a typo — it
must never appear in a filename, folder, layer name or metadata field.

## 3 · Dimensions

| Deliverable | Size |
|---|---|
| SVG master | `viewBox="0 0 512 512"` |
| PNG @3x | **512 × 512 px** |
| PNG @2x | 342 × 342 px |

Largest on-screen use is the 132 px Home hero (396 px at @3x), so 512 px
leaves headroom. Never deliver below these numbers.

## 4 · Transparency

- True alpha, transparent background (PNG-32).
- **No** baked background, card, halo, glow or drop shadow — the app applies
  shadows itself.
- Clean anti-aliased edges; no white fringing from a flattened background.

## 5 · Padding

- **8 % safe margin** (≥ 41 px on a 512 canvas) on all four sides.
- Nothing touches the canvas edge — backpack, cap and raised arms included.

## 6 · Anchor rules

- **Full-body poses** (`hero`, `evolution`, `store_thumb`): feet on the
  baseline at **y = 470**, figure centred on **x = 256**.
- **Waist-up poses** (`call`, `empty`, `error`, `reward`): eye line at
  **y = 190**, centred on **x = 256**, cropped at y = 512.
- **Stages 1–3**: optical centre at **(256, 300)**, sized so their optical
  weight matches stage 4 in the evolution strip.
- Across expressions of the same pose the anchor must not move more than
  **± 2 px** — expressions are swapped live and any shift shows as a jump.
- All six stages must share one baseline so the evolution strip aligns with
  no per-file adjustment.

## 7 · Colour references

Match the shipped design tokens:

| Use | Value |
|---|---|
| Marzi green (primary) | `#547c2c` |
| Deep green (outlines, dark accents) | `#2f5f1c` |
| XP / bright green | `#709820` |
| App background (context only — never drawn in) | `#fcf8f0` |
| Coin gold | `#f2b72f` |

Flat cartoon with soft shading. One light source, upper-left, consistent
across every file. **Never photorealistic**; never generic corporate/Material
styling.

## 8 · Acceptance criteria

1. All 18 P0 files present, named exactly as §1.
2. SVG + PNG @2x + PNG @3x for each.
3. Transparent background, no baked shadow or backdrop.
4. 8 % safe padding respected.
5. Anchors within ± 2 px across expressions; shared baseline across stages.
6. Colours match §7.
7. Character identity consistent across stages 4–6 (same eye size, glasses
   shape, body proportion) so evolution reads as growth, not replacement.
8. SVG hygiene: `viewBox` present, single root, **no** `<script>`, no event
   handlers, no `<foreignObject>`, no external references, no embedded raster,
   no live fonts (text converted to paths).
9. File size: SVG ≤ 40 KB, PNG @3x ≤ 120 KB.
10. Editable source file included (`.ai` / `.fig` / layered `.svg`).
11. Family sign-off recorded before the assets are wired into the app.

## 9 · Rejection criteria

A delivery is returned if any of the following is true:

- Artwork traced, extracted, upscaled or re-coloured from the concept boards.
- Opaque or non-transparent background; baked shadow, halo or card behind the
  figure.
- Below the §3 dimensions, or upscaled from a smaller original.
- Anchor drift > 2 px between expressions, or stages that do not share a
  baseline.
- Any file, folder, layer or metadata field containing **"Marcy"**.
- Stage content wrong: a single egg instead of a cluster; glasses on stage 4;
  a missing backpack on 5/6; a missing cap or pencil on 6; clothing on
  stages 1–3.
- Photorealistic, 3D-rendered, or generic corporate/Material styling.
- SVG containing scripts, event handlers, `<foreignObject>`, external
  references, embedded raster images or live fonts.
- Colours outside §7 without written approval.
- Size budget exceeded.
- Missing editable source file.

---

**After P0 is accepted**, the remaining tiers follow (see `MARZI_ASSET_SPEC.md`
§5): P1 call + reward poses (24 files, hoodie on stages 4–6), P2 empty/error
for stages 4–6 only (6 files), P3 the nine store outfits as complete
precomposed figures (9–18 files).
