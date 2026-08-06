# MARZI Call Asset Specification

Status: canonical production-art specification  
Scope: live call characters, backgrounds, Marzi poses, dialogue-safe composition, and shareable call-review art  
Brand rule: language-neutral MARZI identity; no permanent country flag or target-language tagline

---

## 1. Quality objective

The call screen is MARZI’s hero experience. Assets must be suitable for prominent full-screen mobile use and must not look like placeholders, rough sketches, generic avatars, or mixed illustration packs.

All final call assets must share:

- premium stylized cartoon rendering;
- warm, expressive faces;
- soft dimensional lighting;
- coherent line, shape, texture, and shading treatment;
- family-friendly emotional tone;
- profession- and scenario-specific visual cues;
- safe composition for responsive speech bubbles and Marzi;
- reproducible ownership and provenance.

Temporary inline SVG or low-resolution stand-ins must be labeled `TEMPORARY` in the registry.

---

## 2. Canonical style

### Visual language

- Warm cream and natural contextual backgrounds.
- MARZI greens used as product accents, not painted over every scene.
- Rounded, friendly forms.
- Expressive eyes and readable facial emotion.
- Moderate dimensionality: more polished than flat icons, less photorealistic than 3D cinema characters.
- Consistent proportions across all people and Marzi.
- No generic stock-avatar look.
- No anime, photorealism, sketch, or unrelated illustration style mixed into the same character system.

### Character framing

Preferred call-stage composition:

- portrait/three-quarter character view;
- face centered within a protected face safe zone;
- professional cue visible;
- scenario background recognizable but uncluttered;
- one bubble-safe region;
- one optional Marzi-safe region;
- mobile crop remains meaningful at 320 px width.

---

## 3. Technical formats

### Master art

Preferred source:

- layered PSD, layered SVG, or equivalent editable source;
- minimum master canvas: 2048×2048 for square character sources;
- color profile: sRGB;
- transparent background where the character must be composited;
- retain separated character, prop, foreground, and background layers where possible.

### Runtime exports

Use:

- **WebP** for full-color characters and backgrounds;
- **PNG** when lossless alpha or tooling compatibility is required;
- **SVG** only for true vector logos, UI marks, and simple decorative shapes;
- no rough code-generated SVG portraits as final character art.

Suggested sizes:

| Asset | Primary export | Secondary export |
|---|---:|---:|
| Call character composite | 1200×1200 WebP | 720×720 WebP |
| Character transparent cutout | 1200×1400 WebP/PNG | 720×840 |
| Scenario background | 1440×1600 WebP | 720×800 |
| Marzi call pose | 768×768 WebP/PNG | 384×384 |
| Speech-tail decoration | SVG | — |
| Logo head mark | 1024×1024 PNG/WebP + SVG if genuinely vector | 512×512 |
| Share-card illustration | 1200×1500 WebP/PNG | 600×750 |

Target runtime compression must preserve faces, eyes, text-free edges, and alpha quality.

---

## 4. Safe zones

All character assets must include metadata or documentation for:

- `faceSafeZone`
- `bubbleSafeZonePrimary`
- `bubbleSafeZoneSecondary`
- `marziSafeZone`
- `mobileCrop`
- `rtlBubblePreference`

Express safe zones as normalized coordinates (`x`, `y`, `width`, `height`, values 0–1).

### Face rules

- No default bubble over eyes, eyebrows, nose, or mouth.
- A bubble may overlap low-value background areas only.
- Professional props that establish the role must remain visible when practical.
- Mobile crops must not remove role identity.

### Marzi rules

- Marzi may overlap low-detail foreground/background areas.
- Marzi must not cover the contact’s face.
- Marzi must not compete with the learner bubble.
- Marzi should remain recognizable at 390×844 without becoming a badge.

---

## 5. Naming convention

Suggested canonical IDs:

```text
public/assets/call/characters/<character-id>/<character-id>--<pose>--<variant>@<size>.webp
public/assets/call/backgrounds/<scenario-id>--<locale>--<variant>@<size>.webp
public/assets/call/marzi/marzi--stage-<n>--<state>--<outfit-id>@<size>.webp
public/assets/call/share/<template-id>--<locale>@<size>.webp
```

Examples:

```text
doctor-wagner--listening--default@1200.webp
doctor-wagner--speaking--default@1200.webp
doctor-wagner-clinic--de-DE--day@1440.webp
mechanic-reuter--listening--default@1200.webp
mechanic-reuter-workshop--de-DE--day@1440.webp
marzi--stage-1--helping--none@768.webp
```

Verify the repository’s existing registry and IDs before creating new paths. Preserve stable character and scenario IDs.

---

## 6. Character production slots

For every existing call character, produce at least:

1. `neutral/listening`
2. `speaking`
3. `friendly-confirmation`
4. `concerned/problem`
5. `success/closure` when relevant

Each character record must define:

- stable ID;
- display name;
- role;
- organization/location;
- locale;
- scenario IDs;
- art style version;
- skin tone and cultural representation notes;
- clothing and role props;
- voice profile;
- source/provenance;
- license/ownership;
- safe zones;
- export paths.

### Doctor asset

Required cues:

- clinical/professional clothing;
- white coat or context-appropriate medical clothing;
- stethoscope or equivalent medical cue;
- trustworthy, warm expression;
- clinic/medical office background;
- no exaggerated costume stereotypes;
- role remains obvious in mobile crop.

Required states:

- listening;
- speaking;
- reassuring;
- clarifying;
- closing/confirmation.

### Mechanic asset

Required cues:

- workshop clothing;
- workshop/garage background;
- automotive or tool cue without visual clutter;
- friendly, competent expression;
- role remains obvious in mobile crop.

Required states:

- listening;
- speaking;
- explaining;
- asking for detail;
- confirming pickup/service.

### Other characters

Apply the same profession-clarity standard. Do not rely solely on a title string to communicate role.

---

## 7. Marzi call-pose library

Create stage-aware poses for:

| State ID | Intent |
|---|---|
| `idle` | calm companion presence |
| `greeting` | welcomes user into the call |
| `listening` | attentive, quiet support |
| `thinking` | processing or preparing help |
| `helping` | points toward contextual help |
| `success` | celebrates a good turn |
| `retry` | gentle encouragement |
| `empathy` | supportive response to difficulty |
| `error` | communicates a technical problem without panic |
| `disconnected` | clear connection-loss reaction |
| `reconnecting` | hopeful waiting state |
| `outfit-reveal` | shows equipped outfit |
| `call-complete` | celebrates completed scenario |

Every pose must support:

- transparent export;
- consistent body proportions;
- stage/evolution compatibility;
- optional outfit layers;
- reduced-motion fallback;
- still-image fallback.

### Motion-ready structure

Where feasible, separate:

- eyes/blink;
- mouth;
- head;
- arms;
- body;
- accessory/outfit;
- shadow.

Do not require complex skeletal animation to display a high-quality still.

---

## 8. Outfit integration

Final outfit art must not be represented only by disconnected glyphs.

For each outfit:

- catalog thumbnail;
- try-on preview;
- Marzi full-body or visible-body layer;
- owned/equipped state art;
- applicable stages;
- compatible poses;
- color variants if approved;
- provenance.

Outfit layers must align to a canonical Marzi body rig per evolution stage.

---

## 9. Scenario backgrounds

Each background must:

- communicate setting at a glance;
- remain subordinate to the character;
- preserve bubble-safe and Marzi-safe regions;
- avoid readable trademarked text unless owned/approved;
- support darkening/blur treatment without losing context;
- have mobile and high-resolution crops.

Examples:

- clinic reception;
- doctor consultation room;
- pharmacy counter;
- automotive workshop;
- school office;
- landlord/property context;
- government office;
- bank/service desk.

---

## 10. Dialogue visual assets

Speech bubbles are product UI, not baked into character images.

Provide:

- character bubble style;
- learner bubble style;
- inline translation style;
- hint/help style;
- tails that adapt to logical direction;
- RTL-compatible logical properties;
- selected-word and saved-word states;
- focus and high-contrast states.

Do not bake dialogue text into images.

---

## 11. Logo and brand assets

Canonical brand assets must include:

- Marzi head mark;
- Marzi wordmark with sprout detail;
- M monogram;
- full app icon;
- maskable icon;
- favicon;
- splash mark.

Core brand assets must not permanently include:

- German flag;
- Spanish tagline;
- fixed target-language name.

---

## 12. Asset registry fields

Recommended registry structure:

```json
{
  "id": "doctor-wagner",
  "status": "PRODUCTION_READY",
  "styleVersion": "marzi-character-v1",
  "source": "owned-original",
  "license": "project-owned",
  "character": {
    "listening": "…",
    "speaking": "…"
  },
  "background": "…",
  "safeZones": {
    "face": {"x": 0.30, "y": 0.14, "width": 0.40, "height": 0.42},
    "bubblePrimary": {"x": 0.04, "y": 0.50, "width": 0.46, "height": 0.30},
    "marzi": {"x": 0.02, "y": 0.62, "width": 0.32, "height": 0.34}
  }
}
```

Values above are illustrative only. Measure each final asset.

---

## 13. Acceptance checklist

An asset is `PRODUCTION READY` only when:

- style matches the canonical references;
- profession/scenario is clear;
- mobile crop is approved;
- face safe zone is verified;
- bubble and Marzi zones are usable;
- alpha edges are clean;
- no compression artifacts on face/eyes;
- correct dimensions and format;
- provenance recorded;
- tested in the actual 390×844 call screen;
- reviewed in Arabic RTL and long German;
- approved by Product Owner or designated visual reviewer.

Anything else remains temporary or requires improvement.

---

## 14. Initial required production manifest

At minimum, track:

- `CHAR-DOCTOR-WAGNER`
- `CHAR-MECHANIC-REUTER`
- every current call character ID
- `BG-DOCTOR-CLINIC`
- `BG-MECHANIC-WORKSHOP`
- one background per existing scenario family
- `MARZI-CALL-IDLE`
- `MARZI-CALL-LISTENING`
- `MARZI-CALL-THINKING`
- `MARZI-CALL-HELPING`
- `MARZI-CALL-SUCCESS`
- `MARZI-CALL-RETRY`
- `MARZI-CALL-ERROR`
- `MARZI-CALL-DISCONNECTED`
- `MARZI-CALL-RECONNECTING`
- outfit-on-Marzi layers for every active Store outfit
- logo/icon family
- privacy-safe share-card templates

Keep status truthful. Missing final art must not block layout architecture, but it prevents final art approval.
