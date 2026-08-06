# MARZI visual DNA — extracted from the concept boards

Source of truth: `docs/design/concept-boards/` (02_call.png is the bar).
This file is the style bible for anyone producing MARZI art.

## 1. The two renders that define the app

**Doctora Anna (02_call.png, panel 1)** — the human-character bar:
- Stylized soft-3D render, not photoreal: slightly oversized eyes, gentle
  facial proportions, warm friendly expression.
- Mid-chest portrait crop, facing camera, eye contact with the learner.
- Real setting rendered with depth: clinic wall, charts, soft depth of field.
- Costume tells the role instantly (white coat, teal scrubs, stethoscope,
  round glasses).
- Warm key light + soft rim; nothing harsh, nothing gloomy.

**Marzi (every panel)** — the mascot bar:
- Round green frog; body one soft blob, no neck; big head ratio (~50%).
- Enormous glossy eyes: white sclera, huge dark pupils, two specular dots.
- Thin round dark-brown glasses sitting ON the eyes.
- Mustard/yellow hoodie with visible drawstrings, sleeves cover the arms to
  little green hands.
- Green skin two-tone: body #7cab4e-range, lighter belly/muzzle.
- Emotions are the whole face: mouth line + eyelids + brow tilt +
  hand pose (wave, shrug, point, hold heart). One clear read per pose.
- Rendered Marzi (boards) is soft-3D like the doctor; in-app fallback Marzi
  is flat vector (see `marziSVG` in `public/index.html`) — same DNA, flatter
  finish. Both are canonical; never mix finishes in one composition.

## 2. Palette

UI tokens (use the CSS custom properties in code; hexes here for renders):
- Cream surface family: #f6f1e3 / #f4ecd6 (cards, backgrounds)
- MARZI green: primary ~#547c2c, active ~#3f6120, soft leaf tints
- Marzi body greens: #79a94c body, #97c162 light, #33461f dark line work
- Hoodie mustard: #e8b64c-range with darker stitch lines
- Coin gold: #c99a12 / #f5a524
- Signal red (hang-up, alerts): #d9453a-range — used sparingly
- Charcoal panels: #232323-range with cream text
Never introduce a new hue family without PO sign-off; the app must stay
warm cream + green + gold with red as a signal only.

## 3. Composition rules (from the boards)

- The character lives in a bounded stage, never as a full-screen backdrop
  with UI floating on the face.
- Marzi is the companion: bottom-left, smaller than the contact, grounded
  (sits/stands on something), never a badge or a chip.
- Speech bubbles: white rounded cards with a soft shadow and a small tail
  toward the speaker; text dark, generous line height.
- One primary action per screen, green pill; destructive stays small + red.
- Empty/limit/offline states: Marzi carries the emotion (worried, sad),
  cream card explains, actions below — the emotion never blocks the exit.

## 4. Master style prompt (rendered characters)

Use this as the base for the image pipeline or offline generation; append
the character/scene sentence per asset. Keep it verbatim so renders match:

> Warm, friendly mobile-app illustration in soft 3D render style. Stylized
> character with slightly oversized expressive eyes and gentle proportions,
> facing the camera at mid-chest crop. Soft warm key light with subtle rim
> light, pastel cream-and-green product palette, shallow depth of field
> background that tells the location. Clean, high-detail, production-grade
> render for a language-learning app. No text, no watermark, no logos.

Scene sentence examples:
- Doctor: "A kind young female doctor in a white coat and teal scrubs with a
  stethoscope and round glasses, in a bright clinic with anatomy charts."
- Baker: "A cheerful middle-aged baker in an apron behind a bread counter in
  a warm German bakery."

For Marzi renders, add: "A cute round green cartoon frog with huge glossy
eyes, thin round glasses and a mustard-yellow hoodie with drawstrings" plus
the pose/emotion sentence. Same light, same palette.

## 5. Vector art rules (in-app SVG)

- ViewBoxes: Marzi art 120×120; outfit glyphs 64×64; icons follow `IC`/`ic()`
  conventions (24 grid, stroke or filled to match neighbours).
- Colours: reuse the palette above; inside `public/index.html` CSS use
  tokens, inline SVG fills may use the listed hexes.
- Geometry: few nodes, round joins, no gradients unless the neighbouring
  art already uses them; silhouettes must read at 22 px.
- Every glyph = one silhouette + one distinguishing motif (see
  `OUTFIT_GLYPHS`) — that is what keeps nine shirts readable as nine
  products.
- Accessibility: decorative SVG gets `aria-hidden="true"`; meaningful art
  gets a real label at the component level, not inside the SVG.
