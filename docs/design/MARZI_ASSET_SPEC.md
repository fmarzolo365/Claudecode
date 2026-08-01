# Marzi Production Asset Specification

**Purpose.** Define the exact asset package an illustrator must deliver to
replace the current simplified inline `marziSVG` artwork with the
concept-board Marzi.

**Status.** Specification only. No code, UI, tokens or business logic change
with this document. Swapping the render path from inline SVG to delivered
assets is a separate task (deviation **C1** in the reconciliation audit).

**Canonical reference.** `docs/design/concept-boards/01_home.png`,
`02_call.png`, `04_progress.png`. The boards define proportions, glasses,
book, backpack, hoodie, cap, pencil, expressions and stage styling. This
document defines only *format, coverage and delivery* — it does not
reinterpret the art.

**Non-negotiable (ADR-5, ADR-10).** No asset in this package may be produced
by extracting, redrawing, upscaling or approximating board pixels. Every file
must be original artwork drawn from the boards as reference by the approved
illustrator, and signed off by the family before it ships.

---

## 1 · Where Marzi renders today (measured from the code)

These are the real display sizes in `public/index.html`. They drive every
dimension in §6.

| Context | Selector / call site | CSS px | @2x | @3x |
|---|---|---|---|---|
| Home hero | `.learn-marzi #marzi` | **132** | 264 | **396** |
| Onboarding | `.ob-marzi` | 104 | 208 | 312 |
| Limit modal | `.limit-marzi` | 96 | 192 | 288 |
| Profile identity | `.profile-marzi` | 92 | 184 | 276 |
| Setup / legacy hero | `.marzi` | 74 | 148 | 222 |
| Store wallet | `.wallet-marzi` | 64 | 128 | 192 |
| Evolution card | `.evo-step svg` | 58 | 116 | 174 |
| `UI.marziAvatar` default | `--avatar-md` | 56 | 112 | 168 |
| Call companion | `.vc-marzi-art` | 48 (46 in badge) | 96 | 144 |
| Reward popup | `.ui-reward-art` | 46 | 92 | 138 |
| Guided dialogue | `.dlg-marzi` | 38 | 76 | 114 |

**Largest requirement: 396 px** (Home hero @3x). Masters are specified at
512 px so future uses (store hero, splash, feature graphic) need no re-draw.

## 2 · Stage inventory

Six canonical stages. Slugs are fixed and must be used verbatim in filenames.

| # | Slug | Board name (ES, canonical) | EN | Defining features |
|---|---|---|---|---|
| 1 | `01_eggs` | Huevos de rana | Frog eggs | Cluster of eggs on a leaf — **plural**, never a single egg |
| 2 | `02_tadpole` | Renacuajo | Tadpole | Tadpole, no limbs, bubbles |
| 3 | `03_tadpole_legs` | Renacuajo con patas | Tadpole with legs | Tadpole with hind legs |
| 4 | `04_young_frog` | Ranita joven | Young frog | Full frog, **no** glasses, no accessories |
| 5 | `05_studious_frog` | Rana estudiosa | Studious frog | Glasses + blue "Deutsch" book + backpack |
| 6 | `06_expert_frog` | Rana experta | Expert frog | Glasses + graduation cap + pencil + backpack |

**Cross-stage consistency requirements**
- Identical character identity across 4–6 (same eye size, glasses shape, body
  proportion) so evolution reads as growth, not replacement.
- **Shared baseline and scale**: all six stages must sit on a common ground
  line within a common canvas, so the evolution strip aligns without
  per-file nudging.
- Stages 1–3 are visually smaller subjects; they must still fill the canvas
  to the same optical weight (see §6 padding/anchors).

## 3 · Poses

| Pose slug | Used by | Framing | Notes |
|---|---|---|---|
| `hero` | Home hero, onboarding, profile | Full body, front, slight 3/4 | The signature pose; boards 01/04 hero |
| `evolution` | Evolution card/strip | Full body, front, neutral stance | Must align on the shared baseline |
| `call` | Call companion | **Waist-up**, angled toward the scene | Board 02: Marzi sits in-scene beside the character |
| `empty` | Empty states | Waist-up, searching/looking around | Currently icon-only in code; board style is Marzi-led |
| `error` | Error states, no-internet | Waist-up, concerned, shoulders raised | Board 02 "¡Sin internet!" |
| `reward` | Reward popup | Waist-up, arms up | Board tone: celebratory, not manic |
| `store_thumb` | Store thumbnails | Full body, small, neutral | Simplified silhouette that survives 64 px |

## 4 · Expressions

Eight, exactly as named. Expression changes the **face and hands only** —
body pose, scale and anchor must not shift between expressions of the same
pose, so swapping is flicker-free.

| Slug | Meaning | Board evidence |
|---|---|---|
| `neutral` | Default, calm smile | 01 hero, 04 evolution |
| `happy` | Broad smile, eyes bright | 04 outfit tiles |
| `listening` | Attentive, head tilted, ear forward | Call state `listening` |
| `thinking` | Eyes up, hand near chin | Call state `processing` |
| `speaking` | Mouth open mid-word | Call state `speaking` |
| `sad` | Downturned mouth, lowered brows | 02 limit modal |
| `error` | Worried, shoulders raised, hands together | 02 "¡Sin internet!" |
| `celebrating` | Arms raised, eyes closed with joy | Reward popup |

## 5 · Coverage matrix (what must actually be drawn)

Priority tiers exist so partial delivery is still shippable.

### P0 — required to replace the current artwork (18 files)
`hero` pose × **6 stages** × `neutral`, `happy`, `sad`.
This alone lets Home, onboarding, profile, evolution, store wallet, limit
modal and dialogue render from real assets (all use a full-body pose).

### P1 — call experience and states (24 files)
Stages 4–6 wear the yellow hoodie in these poses; stages 1–3 are undressed.
- `call` pose × 6 stages × `listening`, `thinking`, `speaking` → **18**
- `reward` pose × 6 stages × `celebrating` → **6**

### P2 — remaining states (6 files) — **approved scope**
Dedicated empty/error artwork exists for **stages 4–6 only**:
- `empty` pose × stages 4, 5, 6 × `neutral` → 3
- `error` pose × stages 4, 5, 6 × `error` → 3

**Stages 1–3 use a fallback and are not drawn for these states:** empty falls
back to that stage's P0 `hero_neutral`, error falls back to `hero_sad`. This
is a deliberate decision to keep the package small — do not draw them.

### P3 — outfits, stages 4–6 (9 or 18 files)
Board 04 defines exactly nine, three per stage. Slugs are fixed:

| Stage | Outfits (board names → slugs) |
|---|---|
| 4 `young_frog` | Exploradora → `explorer` · Deportiva → `sporty` · Arcoíris → `rainbow` |
| 5 `studious_frog` | Clásica → `classic` · Universitaria → `university` · Artística → `artistic` |
| 6 `expert_frog` | Profesional → `professional` · Aventurera → `adventurer` → Graduada → `graduate` |

**Architecture (approved):** each outfit is a **complete, precomposed
character figure** delivered as its own approved file. There is **no runtime
layered composition** in the first production release — the app never
assembles a body from parts. Layered outfits may be evaluated later as a
separate architecture task.

Minimum: `hero` + `neutral` per outfit (9 files). Preferred: also
`store_thumb` (9 more) so the store grid does not downscale hero art.

**Board note:** `04_progress.png` prices these at 800 (stage 4), 900 (stage 5)
and 1200 (stage 6) coins. The shipped catalog currently differs; reconciling
it is deviation **H2** and is *not* part of this spec.

### Accessories (§5b)
**Accessories are NOT separate deliverables.** Because outfits and stages ship
as complete precomposed figures (see P3), every accessory is drawn *into* the
figure that needs it. The table below is therefore a **fidelity checklist**:
each item must appear exactly as the boards show it, in every file where that
stage or outfit calls for it.

| Accessory | Slug | Appears on | Anchor requirement |
|---|---|---|---|
| Glasses | `glasses` | Stages 5, 6 (and outfit variants) | Registered to eye line |
| Book ("Deutsch", blue) | `book` | Stage 5 | Held in left hand |
| Backpack | `backpack` | Stages 5, 6 | Behind body, straps over shoulders |
| Pencil | `pencil` | Stage 6 | Held in right hand |
| Graduation cap | `cap` | Stage 6, outfit `graduate` | Registered to crown of head |
| Hoodie (yellow) | — | **Default call-companion look, stages 4–6** | Drawn into the figure; see below |

**Hoodie rule (approved).** The yellow hoodie is the **default
call-companion look**, not a purchasable outfit. It **does not consume one of
the nine store slots**. It is required on the `call`, `empty`, `error` and
`reward` poses for **stages 4–6**, matching board `02_call.png`. **Stages 1–3
remain undressed** in every pose, carrying only their approved
stage-specific features (eggs on the leaf, tadpole bubbles).

**The backpack and hoodie do not exist in the current implementation at all** —
they are board-only and must be drawn.

## 6 · Output requirements

### Format
- **SVG is the deliverable of record.** The app renders Marzi inline today;
  SVG keeps that path, scales to every size in §1 and stays small.
- **PNG-32 accompanies each SVG** at @2x and @3x for any file whose SVG
  exceeds the size budget or uses effects that rasterise unpredictably.
- SVG hygiene (enforced by ADR-10 and the deploy checklist): `viewBox`
  present, single root `<svg>`, **no** `<script>`, no event handlers, no
  `<foreignObject>`, no external references, no embedded raster images, no
  fonts (convert text to paths).

### Canvas, padding, anchors
- **Master canvas: 512 × 512 px**, `viewBox="0 0 512 512"`.
- **Transparent background.** No baked-in background, card, halo or shadow —
  the app applies `drop-shadow` from design tokens.
- **Safe padding: 8 %** (≥ 41 px) on all four sides. Nothing may touch the
  canvas edge; the backpack, cap and raised arms must fit inside the padding.
- **Anchors:**
  - Full-body poses (`hero`, `evolution`, `store_thumb`): **feet on the
    baseline at y = 470** (92 % of canvas), figure **horizontally centred on
    x = 256**.
  - Waist-up poses (`call`, `empty`, `error`, `reward`): **eye line at
    y = 190**, figure centred on x = 256, cropped at y = 512.
  - Stages 1–3 (eggs, tadpoles): **optical centre at (256, 300)**, sized so
    their optical weight matches stage 4 in the evolution strip.
- **Consistency:** the same pose across stages and expressions must not shift
  its anchor by more than ±2 px, so swapping never causes a visible jump.

### Minimum pixel dimensions
| Deliverable | Minimum | Rationale |
|---|---|---|
| SVG master | 512 × 512 viewBox | vector, scales to all of §1 |
| PNG @3x | **512 × 512** | covers Home hero @3x (396 px) with headroom |
| PNG @2x | 342 × 342 | Home hero @2x (264 px) with headroom |
| `store_thumb` PNG @3x | 192 × 192 | store tile 64 px @3x |

Never deliver a PNG smaller than the largest context it serves × 3 (§1).

### Colour and style
- Greens, cream and gold must match the shipped design tokens:
  `--primary #547c2c`, `--marzi-dark #2f5f1c`, `--bg #fcf8f0`,
  `--coin #f2b72f` (see `docs/DESIGN_SYSTEM.md`).
- Flat cartoon with soft shading — **never photorealistic** (ADR-6),
  never generic Material/corporate styling.
- One light source, upper-left, consistent across the whole package.

### File size budget
SVG ≤ 40 KB each · PNG @3x ≤ 120 KB each. Exceeding it is a rejection reason;
simplify paths rather than shipping heavy files.

### Naming convention
```
marzi_<stage>_<pose>_<expression>[_<outfit>][@2x|@3x].<ext>
```
Lowercase, underscores only, stage slugs from §2, outfit slugs from §5.

**The product name is always "Marzi".** "Marcy" appears twice in
`02_call.png` and is a board typo (ADR-10). **No asset, filename, folder,
layer name or metadata field may contain "Marcy".**

Examples:
```
marzi_05_studious_frog_hero_neutral.svg
marzi_05_studious_frog_call_listening.svg
marzi_01_eggs_evolution_neutral.svg
marzi_06_expert_frog_hero_neutral_graduate.svg
marzi_04_young_frog_store_thumb_neutral_explorer@3x.png
```

### Folder structure
```
public/assets/marzi/
├── svg/
│   ├── marzi_01_eggs_hero_neutral.svg
│   └── …
├── png/
│   ├── 2x/marzi_01_eggs_hero_neutral@2x.png
│   └── 3x/marzi_01_eggs_hero_neutral@3x.png
├── outfits/
│   ├── svg/
│   └── png/{2x,3x}/
└── accessories/            ← only if outfits are composed from layers
    └── svg/
```
Concept boards stay in `docs/design/concept-boards/` and are **never** shipped
in `public/`.

## 7 · What can be cropped from the boards — measured verdict

Bounding boxes of each figure were measured directly from the board files:

| Board figure | Measured | Largest context it could serve @3x | Verdict |
|---|---|---|---|
| `01` hero Marzi | **203 × 275** | 91 px | ❌ |
| `04` hero Marzi | **270 × 222** | 74 px | ❌ |
| `02` call Marzi (hoodie) | **210 × 200** | 66 px | ❌ for 132 px hero; would only cover the 48 px companion |
| `02` limit-modal Marzi (sad) | **271 × 168** | 56 px | ❌ (needs 288 px) |
| `02` no-internet Marzi | **137 × 147** | 49 px | ❌ |
| `04` evolution figures 1–6 | **113–159 × 115–151** | 38–50 px | ❌ (needs 174 px) |
| `04` outfit tile | **101 × 131** | 43 px | ❌ |
| `04` store grid tile | **67 × 68** | 22 px | ❌ |
| `04` logo mark | **141 × 138** | — | ❌ (icon needs 512 px) |

**Verdict: nothing in the boards is croppable for production.** Even ignoring
resolution, every figure sits on an opaque background, several overlap
neighbouring artwork, and all are compressed board renders — so none can meet
the transparent-background, clean-edge bar in §6. Separating a figure from its
background is itself an editing operation this spec forbids.

**Therefore: 100 % of the assets in §5 require original source artwork.**
Board crops may be used *only* as reference imagery inside design tooling —
never committed to `public/`, never shipped.

## 8 · Delivery and acceptance

**Deliver:** a single archive mirroring §6's folder structure, plus the
editable source (`.ai`/`.fig`/`.svg` working file) so future expressions and
outfits stay on-model.

**Acceptance checklist:**
1. Every P0 file present and named per §6.
2. Transparent background; no baked shadow, card or halo.
3. Anchors within ±2 px across expressions of the same pose.
4. Evolution set aligns on a shared baseline without per-file adjustment.
5. SVG passes hygiene (no script/handlers/foreignObject/external refs/fonts).
6. Colours match the tokens in §6.
7. Size budgets met.
8. Family sign-off recorded before the swap task (C1) begins.

**Resolved decisions** (approved 2026-08-01 — no longer open)
1. **Empty/error coverage:** dedicated assets for **stages 4–6 only**;
   stages 1–3 fall back to `hero_neutral` / `hero_sad`.
2. **Outfit architecture:** **complete precomposed figures**, one approved
   file per outfit. No runtime layered composition in this release.
3. **Hoodie:** the **default call-companion look for stages 4–6**, not a
   store outfit, and it consumes **no** outfit slot. Stages 1–3 stay
   undressed apart from approved stage-specific features.
4. **Name:** always **Marzi**. "Marcy" is a board typo and must never appear
   in an asset, filename or layer name.

**Vendor hand-off:** `docs/design/MARZI_ASSET_DELIVERY_CHECKLIST.md` is the
one-page brief to send an illustrator. This document remains the full
reference.
