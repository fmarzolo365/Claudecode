# Marzi Design System

The canonical UI library for the Marzi app. **Every future screen composes
these components instead of writing new HTML/CSS.** If a screen needs a
visual that is not here, add it *here* first, then use it.

- **Implementation:** the `UI` object in `public/index.html` (builders return
  HTML strings) plus the component CSS classes in the same file.
- **Enforcement:** `node test/run.js` fails if a component is missing, if a
  builder loses its accessibility contract, if a shipped screen stops
  composing a component, or if this document stops covering one.
- **Source of truth:** the family-approved concept boards in
  `docs/design/concept-boards/` (`01_home.png`, `02_call.png`,
  `04_progress.png`). When a board and this file disagree, **the board wins**
  and this file is updated. A new board is canonical the moment it lands.
  Board panels also stand in for missing boards: the Store panel inside
  `04_progress.png` is canonical until a dedicated store board exists.

## Foundations

### Tokens

Components read **only** from these custom properties (`:root`). No screen
may hard-code a colour, duration, radius, hit area or icon size.

| Group | Tokens | Notes |
|---|---|---|
| **Colors — surface** | `--bg` `--card` `--surface-soft` `--surface-strong` | Warm cream family. `--bg` is the app canvas (**`#fcf8f0`, measured from the boards**), `--card` every raised surface. Cards stay lighter than the page: elevation is preserved until a dedicated card board exists. |
| **Colors — ink** | `--ink` `--muted` `--line` | `--ink` body text, `--muted` secondary, `--line` all hairlines. |
| **Colors — brand** | `--primary` `--primary-hover` `--primary-active` `--primary-soft` `--marzi-dark` | Marzi green, **`#547c2c` measured from the boards** (four independent samples). `--primary` is reserved for the primary action and selected states. |
| **Colors — accent** | `--coin` `--red` `--green` `--xp-fill` `--track` | `--coin` only for currency, `--red` only for destructive/hang-up and errors. `--xp-fill` (`#709820`) and `--track` (`#e0dcc4`) are board-measured. `--coin` is **not** board-aligned yet: sampling was inconclusive (4–8% dominance). |
| **Spacing** | `--space-1: 4px` … `--space-5: 24px` | 4px base grid. Gaps and padding use these, never raw px. |
| **Typography — semantic** | `--font-sans` (Nunito Sans), `--text-xs: 11px` `--text-sm: 13px` `--text-md: 15px` `--text-lg: 19px` `--text-xl: 26px` | Monospace (`JetBrains Mono`) is reserved for labels, timers and counters. Prefer these for new work. |
| **Typography — fine ramp** | `--text-f7-5` … `--text-f64` | The exact sizes shipping today, named so no raw px survives in the CSS. **Transitional:** consolidating them into the semantic scale changes pixels and needs board sign-off — see "Known debt". |
| **Radius** | `--radius-sm: 12px` `--radius: 18px` `--radius-lg: 26px` `--radius-xl: 34px` | Pills use `999px`. |
| **Shadows** | `--shadow-sm` `--shadow` `--shadow-lg` | Soft, warm-tinted. `-sm` for cards in a list, plain for hero surfaces, `-lg` for floating layers. |
| **Colors — extended** | `--white` `--on-primary` `--ink-hover` `--stage-line` `--stage-from` `--stage-to` `--track` `--paper*` `--leaf-soft*` `--sand*` `--danger-ink/-soft` `--info-ink/-soft` `--warn-ink/-soft` `--coin-ink/-deep/-soft` `--disabled-fill` | Named surfaces extracted from the shipped CSS. Every value is the exact colour already in production — naming them changed no pixel. |
| **Colors — tints** | `--tint-primary-04/-12/-35` `--tint-leaf-35` `--tint-danger-35` `--tint-info-28` `--tint-ink-04/-30` `--tint-teal-12` | Alpha overlays reused in more than one place. |
| **Animation** | `--dur-xfast: .1s` `--dur-fast: .15s` `--dur-snap: .2s` `--dur: .25s` `--dur-med: .35s` `--dur-slow: .6s` `--dur-slower: 1s`, `--ease`, `--ease-pop` | Ambient loops have their own semantic tokens: `--loop-glow` (1.3s), `--loop-pulse` (1.4s), `--loop-bob` (3.4s), `--loop-drift` (5.2s). `--ease-pop` only for celebratory motion. |
| **Icon sizes** | `--icon-xxs: 11px` `--icon-xs: 12px` `--icon-sm: 13px` `--icon-chip: 14px` `--icon-btn: 15px` `--icon-md: 16px` `--icon-lg: 18px` `--icon-xl: 20px` `--icon-hero: 22px` `--icon-jumbo: 34px` | Mirrored in JS as the `ICON` scale, because SVG width/height attributes take numbers, not custom properties. The suite fails if the two drift apart. |
| **Touch targets** | `--touch-min: 48px` `--touch-lg: 56px` | **48px is a hard floor** for every interactive control. |
| **Avatars** | `--avatar-sm: 48px` `--avatar-md: 56px` `--avatar-lg: 92px` `--avatar-xl: 112px` | |

### Global rules

1. **State is never colour alone.** Every state carries an icon, text, shape
   or `aria-*` attribute in addition to colour.
2. **48px minimum** for anything tappable. Inline word-tap spans inside
   sentences are the single documented exception — they are words, not
   controls.
3. **One primary action per screen.** Everything else is secondary.
4. **Motion is optional.** All animation sits behind
   `@media (prefers-reduced-motion: reduce)`, which keeps the end state
   visible and drops the movement.
5. **Escaping.** Builders escape all interpolated text. Callers pass plain
   strings; pre-built HTML goes only through documented `body`/`extra`/
   `action` slots.
6. **Mobile-first.** Designed at 390×844; layouts stay fluid up to the
   560px content cap and never scroll horizontally.

---

## Components

### 1. Marzi avatar — `UI.marziAvatar({stage, mood, size, caption, cls})`
**Purpose** The mascot at one of six canonical evolution stages; the emotional
anchor of the product.
**Visual rules** Family-approved layered SVG (`marziSVG`) only — never
re-drawn, re-coloured or replaced (ADR-5, ADR-10). Sized from the avatar
tokens.
**States** `stage` 1–6, clamped (invalid input renders stage 1, >6 renders 6);
optional `mood` (`happy`, `sad`).
**Naming** Stage names and one-line descriptions are **localized** and come
from the boards (`marziNames()` / `marziDescs()`, backed by `stageNames` /
`stageDescs` in every help language). Spanish is transcribed verbatim from
`04_progress.png`; stage 1 is plural ("Huevos de rana" / "Frog eggs"). The six
XP thresholds are unrelated to naming and never change with it.
**Accessibility** Renders `role="img"` with `aria-label="Marzi, <stage name>,
n/6"`. The optional caption repeats this visibly.
**Responsive** Fixed square; the caption wraps rather than truncating.
**Usage** `UI.marziAvatar({ stage: currentMarziStage(), size: "var(--avatar-lg)" })`

### 2. Character avatar — `UI.characterAvatar({scenario, speaker, size, id})`
**Purpose** The face of an **existing** scenario character.
**Visual rules** Flat-cartoon portraits from `/api/avatar/<id>?v=3` (ADR-6).
Never photorealistic, never a newly invented character (ADR-10). Emoji is the
always-present fallback beneath the image.
**States** Portrait pending (emoji shows) → loaded (`.ok` reveals the image);
`speaker: 2` selects the handover persona (`<id>2`).
**Accessibility** Decorative: `aria-hidden="true"`. The character's name is
always adjacent as real text.
**Responsive** Square, `object-fit: cover`.
**Usage** `UI.characterAvatar({ scenario: S.scenario })` — the screen then
copies `data-src` to `src` so loading stays lazy.

### 3. Top bar — `UI.topBar({coins, streak, minutes})`
**Purpose** Persistent shell chrome: identity plus live resources.
**Visual rules** Wordmark left, resource chips right, settings gear last.
Chips never wrap; the bar never overflows 390px.
**States** Values update live; the minutes chip warns when the daily plan
runs low.
**Accessibility** Each chip is labelled; the gear has an explicit
`aria-label`.
**Responsive** Content capped at 560px and centred.
**Usage** The shipped header in `index.html` is this component's instance;
its handlers bind once at boot. Use the builder when constructing a new
shell.

### 4. Coin chip — `UI.coinChip({value, icon, kind, id, label, tag})`
**Purpose** A compact readout of one resource (coins, streak, minutes).
**Visual rules** Pill, `--card` background, icon + value. Coin icon uses
`--coin`, streak `--primary`, minutes `--marzi-dark`.
**States** Interactive (`button`, navigates to the relevant screen) or static
(`span`).
**Accessibility** `aria-label` names the resource; the value is real text.
**Responsive** `white-space: nowrap`; the row sheds gap before size.
**Usage** `UI.coinChip({ id: "tbCoins", value: st.coins, label: "Coins" })`

### 5. XP bar — `UI.xpBar({percent, id})`
**Purpose** Progress toward the next learner rank.
**Visual rules** Board proportion: **22px pill track**, **solid `--xp-fill`**
(never a gradient), `--dur-slow` width transition. On the Home hero the value
sits in a `--card` pill inside the bar's right end (`.xp-val`), as on boards
01/04.
**States** 0–100, clamped both ends.
**Accessibility** `role="progressbar"` with `aria-valuenow/min/max`.
**Responsive** Full width of its container.
**Usage** `UI.xpBar({ percent: 62, id: "xpFill" })`

### 6. Evolution card — `UI.evolutionCard({stage, current, hereLabel})`
**Purpose** One stage in Marzi's six-stage lamina; the strip shows the whole
journey.
**Visual rules** Past = full colour, current = ring + tint + "here" flag,
future = desaturated. Stage number always visible.
**States** `past` / `now` / `future`.
**Accessibility** The current card carries `aria-current="step"`; state is
never colour-only (ring + label + number).
**Responsive** Fixed 84px cards in a horizontally scrollable strip.
**Usage** `MARZI_NAMES.map((_, i) => UI.evolutionCard({ stage: i + 1, current }))`

### 7. Character card — `UI.characterCard({scenario, kindLabel, subtitle, note})`
**Purpose** Who the learner is about to speak to.
**Visual rules** Portrait left, kicker + name + situation right; optional
advisory note chip.
**States** Default; with `note` (e.g. "Preparation recommended" — **advisory
only, never a gate**).
**Accessibility** `aria-label` combines role and name; the portrait is
decorative.
**Responsive** Text truncates with ellipsis; the portrait never shrinks.
**Usage** `UI.characterCard({ scenario: s, kindLabel: L.contact, subtitle: s[S.lang] })`

### 8. Scenario card — `UI.scenarioCard({scenario, selected, subtitle})`
**Purpose** A practisable situation, selectable from a rail.
**Visual rules** Emoji, German title, localized subtitle, check icon when
selected. Selected adds ring + `--primary-soft` tint.
**States** `selected` / unselected; exactly one selected per rail.
**Accessibility** `aria-pressed` carries the selection; the check icon means
selection is not colour-only.
**Responsive** 62% viewport width in a scroll-snapping rail; the selected
card is always present in the rail.
**Usage** `UI.scenarioCard({ scenario: s, selected: s.id === S.scenario.id, subtitle })`

### 9. Conversation bubble — `UI.bubble({side, tag, body, extra})`
**Purpose** One turn of a conversation transcript.
**Visual rules** Character left with `--surface-soft`, learner right with
`--primary-soft`; the tail corner marks the speaker independently of colour.
**States** `side: "char" | "me"`; `extra` carries translation, saved-word,
correction and replay affordances.
**Accessibility** Each bubble is prefixed by a speaker tag as real text.
Actions inside meet the 48px floor.
**Responsive** Max 84% width; the transcript scrolls internally so the screen
never grows.
**Usage** `UI.bubble({ side: "me", tag: L.you, body: esc(text) })`
**Note** `body` accepts pre-built HTML (word-tap markup) — escape before
passing.

### 10. Store item — `UI.storeItem({icon, name, sub, price, action, disabled})`
**Purpose** A purchasable row (today: call-minute packs).
**Visual rules** Icon, name + sub, price in coins, action button.
**States** Affordable / `disabled` (insufficient coins).
**Accessibility** Price is real text next to the name, not colour-coded.
**Responsive** Single row; the name column absorbs remaining width.
**Usage** `UI.storeItem({ name: "25 min", price: 450, action: L.buy })`

### 11. Outfit card — `UI.outfitCard({id, name, price, state, stageLabel, stateLabel, art})`
**Purpose** Catalog entry for a Marzi outfit, in the store grid.
**Visual rules** Square art slot (`data-outfit-art`) above name and footer.
The slot holds a neutral silhouette until approved artwork exists (ADR-10) —
production files replace it **without markup changes**. No technical
placeholder wording is ever shown to a learner.
**States** `locked` (greyscale, stage requirement) / `available` (price) /
`insufficient` (price, muted) / `owned` (check + "Owned") / `equipped`
(check + "Worn", ring). Every state pairs an **icon with text**.
**Accessibility** The card is a button with an `aria-label` combining name and
state; state is never colour-only; the whole card meets the touch floor.
**Responsive** Three-column grid at 390px and 360px.
**Usage** `UI.outfitCard({ id, name, price, state, stageLabel, stateLabel, art })`

### 12. Primary button — `UI.buttonPrimary({label, icon, id, cls, attrs})`
**Purpose** The single most important action on a screen.
**Visual rules** `--primary` fill, white text, pill, `--touch-min` height.
**States** default / hover / active / `disabled` (52% opacity).
**Accessibility** Real text label always present; icons are decorative.
**Responsive** Full width when it is the screen's main call to action.
**Usage** `UI.buttonPrimary({ label: L.call, icon: IC.phone(18) })`

### 13. Secondary button — `UI.buttonSecondary({label, icon, id, cls, attrs})`
**Purpose** Supporting actions.
**Visual rules** `--surface-strong` fill, ink text, same geometry as primary.
**States** as primary.
**Accessibility** as primary.
**Responsive** Sits in rows that wrap before shrinking below 48px.
**Usage** `UI.buttonSecondary({ label: L.repeat })`

### 14. Status badge — `UI.statusBadge({label, icon, tone, id, live})`
**Purpose** Communicate a state: icon + text + colour.
**Visual rules** Pill; tones `neutral` / `success` / `warning` / `danger` /
`info`.
**States** The call screen's `.call-status` is this component's specialised
instance, mapping `listening` / `processing` / `speaking` / `disconnected` /
`error` onto the same shape via `data-state`.
**Accessibility** `live: true` adds `role="status"` so changes are announced;
the call screen also mirrors the label into its `aria-live` region.
**Responsive** Nowrap; truncates before wrapping.
**Usage** `UI.statusBadge({ label: L.listening, icon: IC.wave(13), tone: "success", live: true })`

### 15. Progress card — `UI.progressCard({title, value, max, valueLabel, caption})`
**Purpose** A labelled measure on a card surface (daily plan, deck progress).
**Visual rules** Title left, value right, bar beneath, optional caption.
**States** Empty (0) through full (100%); values clamp.
**Accessibility** Inherits the XP bar's `progressbar` semantics; the numeric
value is also visible text.
**Responsive** Full width of its column.
**Usage** `UI.progressCard({ title: L.minLeft, value: used, max: limit })`

### 16. Reward popup — `UI.rewardPopup({title, xp, coins, stage, id})`
**Purpose** Celebrate what the learner just earned.
**Visual rules** Floating card above the bottom nav, Marzi on the left, gains
as badges; enters with `--ease-pop`.
**States** XP only, coins only, or both (zero values are omitted).
**Accessibility** `role="status"` + `aria-live="polite"`; motion respects
reduced-motion.
**Responsive** Centred, capped at 340px / 92vw.
**Usage** `UI.rewardPopup({ title: L.wellDone, xp: 19, coins: 20, stage })`
**Status** Available and tested; the call-end screen still shows its inline
chips — first use of this component is a future task.

### 17. Modal — `UI.modal({id, title, body, stage, actions, labelledBy})`
**Purpose** A focused decision that must interrupt.
**Visual rules** Centred card on a dimmed backdrop (`.ui-modal-back`),
optional Marzi, title, body, stacked actions.
**States** Hidden / shown. The shipped daily-limit dialog is this component's
instance.
**Accessibility** `role="dialog"`, `aria-modal="true"`, `aria-labelledby`
pointing at the title; the primary action takes focus.
**Responsive** Max 92vw, vertically centred.
**Usage** `UI.modal({ title: L.limitTitle, body: L.limitMsg, stage, actions })`

### 18. Empty state — `UI.emptyState({icon, title, body, action})`
**Purpose** Explain that there is nothing here *yet*, and offer the way
forward.
**Visual rules** Round muted icon, bold title, optional body, optional
action. Never a bare dash.
**States** With or without an action.
**Accessibility** Ordinary content; the icon is decorative.
**Responsive** Centred, comfortable on narrow screens.
**Usage** `UI.emptyState({ icon: IC.list(22), title: L.noMistakes })`

### 19. Error state — `UI.errorState({title, body, action})`
**Purpose** Say what broke and how to recover.
**Visual rules** Red-tinted round icon, title, explanation, recovery action.
Errors explain; they never blame.
**States** With or without a retry action. The call screen's inline `.alert`
is the compact variant of this component.
**Accessibility** `role="alert"` so it is announced immediately.
**Responsive** Centred; text wraps freely.
**Usage** `UI.errorState({ title: L.err, body: L.micBlocked })`

### 20. Call control — `UI.callControl({icon, label, variant, id, size, attrs})`
**Purpose** A circular action on the immersive call layer (board `02_call.png`).
**Visual rules** Circle, translucent white over the portrait; `danger` is the
red hang-up and is the largest control. Icon above a short label.
**States** `secondary` / `danger`; `data-status` drives listening (green +
pulse), processing (neutral, disabled) and failed (red); `disabled` dims.
**Accessibility** `aria-label` always set; the visible label repeats it, so a
state is never colour-only. Minimum 64px, hang-up 72px — both above the 48px
floor.
**Responsive** Fixed circles in a centred row; never shrink below the floor.
**Usage** `UI.callControl({ id: "hangBtn", icon: IC.phone(ICON.xl), label: L.hangUp, variant: "danger" })`

### 21. Speech bubble — `UI.speechBubble({side, text, id, tappable})`
**Purpose** A spoken line on the call layer: the character's line, or Marzi's
suggestion.
**Visual rules** `char` sits upper-left with a left tail; `marzi` attaches to
Marzi lower-right with a right tail. Paper background so it reads over any
portrait.
**States** Hidden when there is nothing to say; `tappable` renders a button
(Marzi's suggestion opens the full hint).
**Accessibility** `aria-label` names the speaker; non-tappable bubbles use
`role="note"`.
**Responsive** Max 62% (char) / 54% (Marzi) of the layer width; wraps freely.
**Usage** `UI.speechBubble({ side: "marzi", text: S.hint, tappable: true })`

### 22. Call identity — `UI.callIdentity({kicker, name, place})`
**Purpose** Who the learner is talking to, at the top of the call layer.
**Visual rules** Three centred lines: kicker ("Talking with"), name, place.
**States** Follows character switching — the handover persona updates it.
**Accessibility** Real text, never truncated; the name is the largest line.
**Responsive** Centred between the close button and the connection indicator.
**Usage** `UI.callIdentity({ kicker: L.talkingWith, name: A.who, place: A[S.lang] })`

### 23. Call sheet — `UI.callSheet({title, closeLabel, body})`
**Purpose** Transcript and tools over the call, without breaking the board
composition.
**Visual rules** Bottom sheet on a dimmed backdrop, grab handle, title row
with a labelled close button, scrolling body capped at 74dvh.
**States** Hidden / shown. Dismissible four ways: close button, swipe down,
Escape, Android back (a `pushState` entry is consumed by `popstate`, so back
never leaves the call).
**Accessibility** `role="dialog"`, `aria-modal="true"`, `aria-labelledby` on
the title; focus moves to close on open and back to the opener on close. The
opening control is **labelled, never icon-only**.
**Responsive** Full width, safe-area padded at the bottom.
**Usage** `UI.callSheet({ title: L.transcript, closeLabel: L.ok, body })`

### 24. Category tabs — `UI.categoryTabs({tabs, active, label})`
**Purpose** One row of filters over a catalog (the store's five categories).
**Visual rules** Pill strip on `--surface-soft`; the active tab is filled with
`--primary`. Scrolls horizontally rather than wrapping.
**States** `active` (filled + `aria-selected="true"`); `empty` dims a category
that has no catalog yet — it stays visible and selectable and shows a
"coming later" empty state, so it never implies products exist.
**Accessibility** `role="tablist"` / `role="tab"` with `aria-selected`; each
tab carries an `aria-label` and a visible label, so selection is not conveyed
by colour alone. Tabs meet the 48px floor.
**Responsive** Equal-width tabs that scroll on narrow screens.
**Usage** `UI.categoryTabs({ tabs, active: STORE_CAT, label: L.storeOutfits })`

---

## Adding to the system

1. Check whether an existing component covers the need (a variant usually
   does).
2. If not, add the builder to `UI`, its CSS to the component block, and a
   section here with all six headings (Purpose, Visual rules, States,
   Accessibility, Responsive, Usage).
3. Extend the design-system check in `test/run.js` — the component list there
   is exhaustive by design, so a new component fails the suite until it is
   documented.
4. Never add a colour, duration, radius or hit area outside the tokens.

## Enforcement

`node test/run.js` fails on **any** raw value in the stylesheet outside
`:root`: hard-coded hex colours, `transition`/`animation` timings, `font-size`
(or the size inside a `font:` shorthand), and raw px in `IC.*()` icon calls.
It also fails if the JS `ICON` scale and the `--icon-*` tokens drift apart.
Adding a screen with a stray `#fff` or `13px` breaks the build.

## Known debt

These are recorded rather than silently carried:

1. **Fine type ramp.** 23 distinct sizes ship today. They are all tokenized,
   but a real scale would have ~6 steps. Consolidation changes pixels →
   needs the concept boards and family sign-off.
2. **Single-use alpha overlays.** 33 one-off `rgba()` values remain inline
   (borders, shadows, glows). Deriving them from base colours needs
   `color-mix()`, which is not safe on the older Android WebView versions our
   TWA must support — deferred deliberately, not overlooked.
3. **Marzi's artwork colours** (`marziSVG` internals: greens, belly, lens)
   are **intentionally not tokenized.** They are family-approved artwork
   constants under ADR-5/ADR-10, not UI chrome, and must only change with
   approved art.
4. Board reconciliation: **Batch 1 done** (palette, stage naming, Home
   hierarchy, XP bar, sparkles). Still open and deliberately not started:
   C1 Marzi artwork, C2 call-screen rebuild, H1 store rebuild, H2 outfit
   catalog, H5 portrait style, H6 limit modal, M2 internet framing,
   M3 Premium, M5 logo.
5. **Home sparkles** are pure CSS radial-gradient dots in `--coin` /
   `--primary` — no image assets. Each layer carries its own
   `background-size`, otherwise `background-position` moves a full-size layer
   and every dot lands in the middle. Motion is a slow opacity twinkle that
   the global reduced-motion block disables.
