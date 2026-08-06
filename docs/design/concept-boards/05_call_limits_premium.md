# Board 05 — Call, limits and Premium

Product and UX specification derived from
`docs/design/concept-boards/05_call_limits_premium.jpg` (709×1067, seven
surfaces plus an explanatory strip and a footer band).

**Status of this document.** It converts the board into a product system. The
board is canonical for **visual and product direction**, not for pixels and
not as a source of production raster assets (ADR-10, decision 2 below). Where
the board and the shipped product disagree, §4 records the deviation; it does
not silently pick a winner.

> **Two things on the board are NOT canonical and must not be copied.**
> 1. The board spells the mascot **"Marzy"** (step 4 of the explanatory strip)
>    and **"Marcy"** (footer band). Both are wrong. ADR-10 and decision 1
>    below: the name is always **Marzi**, in every surface, string, filename
>    and asset path.
> 2. The board's bottom navigation reads **Clases · Conversar · Tienda ·
>    Perfil**. The canonical tab set is **Learn · Talk · Store · Profile**
>    (Spanish: *Aprender · Hablar · Tienda · Perfil*), fixed in MARZI-002 and
>    reaffirmed in MARZI-017. The board's labels are a concept variant, not an
>    instruction to rename.

---

## 1. Screen-by-screen analysis

### 1.1 Active call

| | |
|---|---|
| **Purpose** | Hold a real spoken conversation with an AI character, with Marzi coaching alongside. |
| **Primary goal** | Say the next thing successfully and be understood. |
| **Entry** | Talk → *Practise now* / *Recommended now* / a journey node; Learn → primary CTA. |
| **Exits** | Hang up (red control) → reward summary; close (×, top-left) → minimise/leave; daily limit exhausted → §1.2. |
| **Flow** | Character greets → learner speaks → correction/reply → repeat until goal or hang-up. |

**Information hierarchy** (top to bottom): kicker "Hablando con" → character
name (largest) → place/organisation → character portrait (full-bleed) →
character speech bubble → **Marzi + Marzi's suggestion bubble** → controls →
timer.

**Primary interaction** the microphone. **Secondary** mute, speaker,
transcript, repeat, free-talk.

**Marzi's role** — the board is unambiguous and this is its most important
instruction: Marzi is **in the scene**, bottom-left, occupying roughly a
third of the frame width and clearly overlapping the portrait plane. He is a
companion standing next to the learner in the room, not a badge. His bubble
sits to his inline-end side and contains **what the learner could say next**
("Ich möchte einen Termin reservieren."), visually distinct from the
character's bubble, which contains **what was just said to the learner**
("Guten Tag! Wie kann ich Ihnen helfen?").

**Character role** — a painterly, warm, photoreal-adjacent portrait filling
the frame, eyes toward the learner, environment legible behind (clinic).
**No emoji is present anywhere on this screen.**

**Emotional intent** — "a real person is waiting, and a friend is next to
you." Nerves reduced by Marzi's presence and by always having a suggested line.

**Gamification** none on-screen during the call. Rewards land after hang-up.
**Economy** the call consumes the daily minute allowance; the timer is the
only economic signal shown. **Premium** absent from the call itself — the
board deliberately keeps the upsell out of the conversation.

**Animation opportunities** portrait micro-parallax; Marzi's per-state motion
(lean in when listening, small think-bob, talk motion); bubble enter/exit;
control press feedback. All behind `prefers-reduced-motion`.

**Empty/error/locked** connection lost, AI error, microphone denied,
allowance exhausted mid-call. The board shows none of these — §2 requires
they never be hidden.

**Transitions** → reward summary on hang-up; → §1.2 when the allowance runs
out; → transcript sheet from a secondary tool.

**Onboarding implications** a first-time learner must understand within
seconds that Marzi's bubble is *theirs to say*. Consider a one-time coach mark
on the first call only.

**Accessibility** the status must be announced, not colour-only; both bubbles
need reachable text; controls ≥48px with labels; safe-area insets top and
bottom; Back closes overlays before ending the call.

**Extensibility** two-speaker handovers, more characters, per-character
environments — all fit without changing the composition.

### 1.2 Daily limit reached

**Purpose** stop the session honestly and kindly. **Goal** understand what
happened and what to do next. **Entry** allowance hits zero. **Exit** one
primary action, *Entendido*.

Hierarchy: clock illustration → "¡Ups! Tu tiempo se acabó" → "Has usado tus
30 minutos diarios de llamadas." → **Marzi, sad and apologetic, arms open,
centre stage** → Marzi's bubble "Lo siento, no puedes seguir hablando por
ahora. / Vuelve mañana para más llamadas." → green *Entendido*.

**Emotional intent** — non-punitive. Marzi apologises *on the product's
behalf*; the learner is never blamed. The board pointedly does **not** put a
Premium button on this screen — the upgrade path is offered on the calmer
status screen (§1.3), not at the moment of frustration. That is a deliberate
anti-dark-pattern choice and is binding.

**Economy** no purchase here. **Premium** none. **States** this *is* the
blocked state. **Transitions** → Learn/Talk on dismiss; the learner reaches
§1.3 on their own.

### 1.3 Time and internet status

**Purpose** one honest place showing what is left and what can be done.
**Entry** minutes chip in the top bar, or the limit sheet. **Exit** ×, or one
of the two action rows.

Hierarchy: header (× · "Tu tiempo e internet" · coin balance) → **call-time
card**: "Tiempo de llamadas", `0 / 30 min` with the number dominant, progress
bar, **"Se reinicia en 10:15:32"** → **internet card**: "Internet (5G)",
`0 MB restantes` in red, "No puedes hacer más llamadas.", progress bar →
"¿Qué quieres hacer?" → two rows: *Comprar más internet / Usa tus monedas*
and *Hazte Premium / Llamadas ilimitadas* → Marzi peeking in from the bottom,
subdued.

**Canonical rule** the two cards are **two presentations of one value**. See
§2 "Internet/minutes".

### 1.4 Buy more internet

**Purpose** convert coins into more call time. **Entry** §1.3 or §1.6.
**Exit** × or a purchase.

Hierarchy: header → large green 5G mark → "Elige cuánto internet quieres
comprar para seguir llamando." → four package rows, each **MB-primary** with
a minute equivalence beneath (`100 MB / Para ~10 min de llamadas`) and a coin
price chip → current balance chip ("Tus monedas / 1.250") → Marzi,
encouraging, finger raised.

Board packages, and their exact match to the shipped economy:

| Board | Minutes | Price | Shipped `COIN_PACKS` |
|---|---|---|---|
| 100 MB | ~10 min | 200 | `min10` / 10 min / 200 |
| 250 MB | ~25 min | 450 | `min25` / 25 min / 450 |
| 500 MB | ~50 min | 800 | `min50` / 50 min / 800 |
| 1 GB | ~100 min | 1500 | `min100` / 100 min / 1500 |

At 10 MB = 1 minute every row is consistent, and **no price changes**. The
only difference is presentation order: the board leads with MB.

### 1.5 Premium offer

**Purpose** present the paid tier honestly. **Entry** §1.3, §1.6, Profile card.
**Exit** *Continuar* or *Más tarde*.

Hierarchy: header → crown → "¡Llamadas ilimitadas!" → subtitle → four ticked
benefits (unlimited minutes · 5G always available · special characters ·
faster AI) → two plan cards, **Mensual $4.99/por mes** and **Anual
$39.99/por año** with a *MEJOR OFERTA* badge and *Ahorra 33%* → *Continuar* →
*Más tarde*.

**Premium implications** presentation only in this build (decision 5).
*Continuar* must state plainly that Premium is not yet available; *Más tarde*
dismisses without penalty and must be a real, reachable control — not a
low-contrast afterthought.

### 1.6 No internet

**Purpose** explain a blocked action caused by connectivity, not by the
product. Hierarchy: "Internet 5G" kicker → **"¡Sin internet!"** in red →
"No puedes hacer más llamadas." → Marzi, sad, flanked by greyed signal bars →
"¿Qué quieres hacer?" with the same two recovery rows → **bottom navigation
remains visible**.

This is the key structural difference from the current build: the board
treats no-internet as a **state with recovery actions and navigation intact**,
not a passive banner.

### 1.7 "¿Cómo funciona?" explanatory strip

Six steps: 1 talk to AI people → 2 you get 30 minutes a day → 3 when time or
5G runs out → 4 Marzi tells you you cannot continue → 5 you can buy more
internet with coins → 6 or go Premium for unlimited calls.

**Purpose** teach the whole economy in one glance. **Where it belongs** first-run
onboarding and/or a "How it works" entry in Profile — *not* an interruption.
It is the plain-language contract for the limit system and should be
reachable whenever a learner hits a limit for the first time.

### 1.8 Footer band

Marzi with hearts: "…te acompaña siempre para que sigas aprendiendo alemán /
¡Habla, practica y crece cada día!" — **tone reference**, not a screen. It
fixes the emotional register for every string above: warm, encouraging, never
scolding. (Spelling on the band is non-canonical, see the warning at the top.)

---

## 2. Canonical design rules

### Active call

- **Portrait framing** full-bleed, `object-fit: cover`, face in the upper
  third, environment legible. A scrim keeps text readable over any portrait.
- **Top identity** three lines in one block: kicker (small, muted) → name
  (largest) → place (small). Never collides with the top safe area.
- **Character bubble** upper area, inline-start, tail toward the character;
  contains what was just said to the learner.
- **Marzi placement** bottom inline-start, **in the scene**, overlapping the
  portrait plane. Minimum prominence: **≈30% of viewport width and ≈25% of
  viewport height**; never reduced to a badge or a chip.
- **Marzi bubble** anchored to Marzi's inline-end, visually connected (shared
  baseline or tail), always containing a sayable line.
- **Timer** below the controls, monospaced, low-emphasis. It is information,
  not pressure.
- **Primary controls** exactly three: **microphone/mute · hang-up · speaker**.
  Hang-up is red and larger. Nothing else competes at this level.
- **Secondary tools** transcript, repeat, free-talk — a distinct, smaller row
  above the primary controls.
- **Dark overlay** a vertical gradient scrim, strongest top and bottom.
- **Safe areas** `100dvh` with `env(safe-area-inset-*)`; controls clear of the
  gesture area; page scroll locked behind the call.
- **Visual balance** portrait occupies the upper two thirds, Marzi and the
  controls anchor the lower third.

### Marzi

- **Body scale** substantial. On the call, the largest single character
  element after the portrait.
- **Default call appearance** the **mustard hoodie**, with the backpack where
  the pose allows. Per MARZI-ASSET-SPEC this is Marzi's *default call look*,
  **not** a purchasable outfit slot.
- **Expressions by state** see §3.
- **Relationship to the bubble** the bubble belongs to Marzi and must read as
  his speech; if they separate visually, the composition has failed.
- **Relationship to guidance** Marzi never states the correction. He offers
  the next thing to say. Corrections stay in the transcript and the summary.
- **Minimum prominence** stated above; if the viewport cannot honour it,
  reduce the tools row, not Marzi.

### Limit experience

- Full-screen interruption, not a toast.
- Plain explanation of what was used and what the allowance is.
- **Non-punitive**: Marzi apologises; the learner is never at fault.
- **Exactly one primary action** (*Entendido*).
- **The upgrade path is optional and lives elsewhere** — never on the moment
  of frustration.
- A clear return path to normal navigation.

### Internet / minutes

- **Minutes are the canonical resource.** One stored value, one wallet.
- **MB is a presentation of minutes at 10 MB = 1 minute.** No second
  consumable, no second balance, no independent MB arithmetic.
- Package comparison shows MB, the minute equivalence and the coin price.
- Current coin balance always visible while purchasing.
- **Reset time** shown as a countdown on the status screen.
- Purchase confirmation is explicit and idempotent; the reward/wallet
  semantics are frozen (decision 6).

### Premium

- Presentation only; no entitlement is granted in this build.
- Monthly and annual, annual marked as best value with the saving stated.
- Benefits ordered by real value: unlimited minutes first.
- *Continuar* → honest "not available yet". *Más tarde* → dismiss, no penalty.
- **No dark pattern**: no fake countdown, no pre-selected purchase, no
  hidden dismiss, no guilt copy, and no upsell on the limit screen.

### No internet

- Name the state ("¡Sin internet!") and the blocked action.
- Offer the same two recovery rows plus a retry.
- Keep navigation available; the rest of the app still works offline.
- Provide the accessible text alternative — never signal by colour or icon
  alone.
- Offline-safe: no request is attempted, and nothing is silently swallowed.

---

## 3. Marzi visual states

Fallback for **every** state while production art is missing: the existing
approved `marziSVG` at the earned stage, driven through `marziArt(stage,
state)`. `MARZI_ASSETS` ships empty so no request is ever made for a file that
does not exist. **Concept-board crops are never production assets.**

| State | Expression | Pose | Message type | Animation |
|---|---|---|---|---|
| `ready` | calm, attentive | standing, hands relaxed | "you can start" | idle breathe |
| `listening` | wide-eyed, leaning in | slight forward lean | none — the learner is speaking | subtle lean |
| `thinking` | eyes up, one hand near chin | weight shifted | none | slow think-bob |
| `speaking` | open mouth, animated | gesturing | the character's line is playing | talk motion |
| `encouraging` | bright smile, finger raised | upright, arm up | "try this next" / suggestion | small bounce |
| `limit reached` | sad, apologetic | arms open, palms up | "sorry, not now — come back tomorrow" | none/slow |
| `offline` | worried | shoulders drawn in | "no connection" | none |
| `premium` | delighted | crown-adjacent, celebratory | "unlimited calls" | sparkle |
| `purchase success` | joyful | arms up | "you have more time" | celebrate |
| `purchase failure` | concerned | one hand out | "that did not work — try again" | none |

Mapping to the eight canonical `MARZI_STATES` shipped in MARZI-013
(`neutral · happy · listening · thinking · speaking · sad · error ·
celebrating`):

| Board state | Shipped state |
|---|---|
| ready | `neutral` |
| listening | `listening` |
| thinking | `thinking` |
| speaking | `speaking` |
| encouraging | `happy` |
| limit reached | `sad` |
| offline | `sad` |
| premium | `celebrating` |
| purchase success | `celebrating` |
| purchase failure | `error` |

**No new state vocabulary is required.** `encouraging`, `limit reached`,
`offline`, `premium`, `purchase success` and `purchase failure` are *contexts*
that select an existing state. Adding them as new states would fork a
suite-guarded vocabulary for no behavioural gain.

### Missing assets

Against `docs/design/MARZI_ASSET_SPEC.md` and
`docs/design/MARZI_ASSET_DELIVERY_CHECKLIST.md`, still **not delivered**:

1. **Call-pose Marzi in the hoodie** at stages 4–6 for `listening`,
   `thinking`, `speaking`, `neutral`, `happy` — the single largest gap; it is
   what makes §1.1 work.
2. **`sad` / `error` poses** for the limit and offline screens (spec limits
   these to stages 4–6).
3. **`celebrating`** for Premium and purchase success.
4. **Header mark** `public/assets/marzi/stage-6/header-neutral.svg`
   (MARZI-017 contract, currently falling back).
5. **Outfit previews** `public/assets/marzi/outfits/<slug>.svg` ×9 (all nine
   currently render one neutral shirt silhouette).
6. **Painterly character portraits** matching the board's warmth — the
   existing `/api/avatar/<id>` pipeline generates these, but the board's style
   target is not yet pinned in the spec.

---

## 4. Deviation audit against `53929a5`

Severity: **Critical** (blocks or misleads) · **High** (clearly wrong to a
user) · **Medium** (noticeably off) · **Low** (polish).
Complexity: **XS** < 1 h · **S** ~ half a day · **M** ~ 1–2 days · **L** ~ 3–5
days · **XL** > 1 week or art-blocked.

| ID | Surface | Board requirement | Current implementation | Sev | User impact | Recommended correction | Cx | Asset dep. | Runtime/business risk |
|---|---|---|---|---|---|---|---|---|---|
| **D-01** | Active call | No emoji anywhere; the portrait *is* the character | `#vcEmoji` (`.call-emoji`, 🎧/character emoji) is rendered at `top:30%` **and is never hidden when the portrait loads** — `.call-portrait.ok` only sets `display:block` on the image | **Critical** | A giant emoji floats over the doctor's face — the exact defect decision 7 forbids | Hide `#vcEmoji` whenever `#vcImg` has `.ok`; keep it as the pre-load/failed fallback | XS | none | none — CSS only |
| **D-02** | Active call | Marzi ≈30% width, in-scene, bottom inline-start | `#vcMarzi` renders inside `.call-mid`, sized by avatar tokens, well below the board's prominence | **High** | Marzi reads as a badge, not a companion; the board's core emotional idea is lost | Re-anchor Marzi to the lower inline-start of the call stage and raise to the stated minimum | M | placeholder OK; production art for full effect | none — layout only |
| **D-03** | No internet | Full state: title, Marzi, two recovery rows, nav intact | `#netBanner` status strip with `offlineTitle`/`offlineMsg`; no recovery actions | **High** | Offline learners are told "no" without being told what they *can* do | Add a no-internet state reusing the §1.3 action rows; keep the banner for transient loss | M | placeholder OK | none — no economy change |
| **D-04** | Buy internet | MB-primary rows with minute equivalence, 5G mark, balance chip | Store renders `+10 min` with a clock icon; prices/ids identical | **Medium** | Two different mental models for one resource across screens | Re-present packs as `100 MB` + `Para ~10 min`; **do not touch** `buyPack`, ids or prices | S | none | **must not** change `COIN_PACKS` or wallet |
| **D-05** | Limit reached | Marzi centre stage, sad, with an apology bubble | Limit sheet shows `limitMarzi` + title + note; copy matches verbatim | **Medium** | Right words, weaker staging — less warmth than the board | Enlarge Marzi, move the apology into a Marzi bubble | S | placeholder OK | none |
| **D-06** | Status screen | Reset shown as a live countdown (`10:15:32`) | `#planReset` shows `Se reinicia en H h MM min`, static per render | **Low** | Slightly less precise; no live tick | Optional 1 s countdown while the screen is open | XS | none | none |
| **D-07** | Active call | Latest character line stays visible while Marzi thinks | Bubble visibility follows call state; the previous line can disappear during `processing` | **Medium** | The learner loses the sentence they are answering | Preserve the last character utterance until the next one arrives | S | none | must not touch transcript source |
| **D-08** | Board text | — | Board reads **"Marzy"** and **"Marcy"** | **High** *(board defect)* | Copying either would break ADR-10 across the product | Never transcribe; treat as a board erratum. Ask the family for a corrected board | XS | n/a | none |
| **D-09** | Board nav | — | Board reads *Clases · Conversar · Tienda · Perfil* | **Medium** *(board defect)* | Renaming would contradict MARZI-002/017 | Keep Learn/Talk/Store/Profile; log the variant as a naming idea only | XS | n/a | none |
| **D-10** | Premium | Benefits promise 5G, special characters, faster AI | Same four strings ship verbatim | **Medium** | These describe entitlements that do not exist and cannot be delivered today | Keep presentation-only, but the *Continuar* disclaimer must be unmissable | XS | none | **frozen** — no entitlement |
| **D-11** | Explanatory strip | Six-step "how it works" | Not present anywhere | **Medium** | The limit system is never explained before it bites | Add to onboarding and/or Profile → How it works | M | icons only | none |
| **D-12** | Portraits | Warm painterly style, eyes to camera | `/api/avatar/<id>` generated, style not pinned to the board | **Low** | Inconsistent character warmth | Pin the style target in the asset spec, then re-generate | S | prompt/style work | server prompt change — out of scope here |
| **D-13** | Call chrome | Immersive, no browser chrome | Standalone honoured; a normal tab still shows browser chrome | **Low** | Immersion lost outside the installed PWA | Already handled as far as the web allows (ADR-12); TWA is the real fix | — | n/a | none |
| **D-14** | Active call | Whole composition | **Never verified in a live call in Chromium** (MARZI-017 report states this explicitly) | **High** | Every call-screen claim above is analytical, not measured | Build a stubbed-provider call harness and verify at 360×640 and 390×844 | M | none | none |

**Totals — 14 deviations:** Critical **1**, High **4**, Medium **6**, Low **3**.

### Status classification

- **Already implemented and board-correct** — limit copy (verbatim), Premium
  copy/prices/badges (verbatim), the 10 MB = 1 min relationship, pack prices
  and minute values, the plan screen's two-card structure, reset line, coin
  chip, the eight-state Marzi vocabulary, the asset-path contracts.
- **Partially implemented** — D-04 (right data, wrong framing), D-05 (right
  words, weaker staging), D-06, D-11.
- **Visually incorrect** — **D-01** (emoji over the portrait), D-02 (Marzi
  too small), D-03 (banner instead of a state), D-07.
- **Blocked by artwork** — the full effect of D-02, D-05 and every §3 state;
  see the missing-asset list.
- **Intentionally frozen by business rules** — D-10, and the economy touched
  by D-04: prices, `buyPack`, wallet, reward ledger, XP thresholds, Premium
  entitlement (decisions 3–6).
- **Unverified** — **D-14, and by extension every call-screen row above.** The
  MARZI-017 report states plainly that live-call Chromium verification was not
  performed. Nothing in §1.1 or §2 "Active call" should be treated as measured.

> **Correction to the MARZI-017 report.** That report said the emoji fix meant
> "no doctor emoji on top of a doctor". That is true for the Talk character
> card (`.char-face:has(img.ok) > span`) but **not** for the call screen, which
> uses a different element (`#vcEmoji` / `.call-emoji`) that nothing hides.
> D-01 records the real state.

---

## 5. Approved product decisions

1. **Marzi is always spelled "Marzi"** — every surface, string, filename and
   asset path. The board's "Marzy"/"Marcy" are errata (ADR-10).
2. **The board is canonical for visual direction, not for raster production
   assets.** No crop, extract or upscale from it ever ships.
3. **Minutes are the canonical resource** — one stored value, one wallet.
4. **MB is a visual conversion only**, at 10 MB = 1 minute. No second
   consumable.
5. **Premium remains presentation-only** — no entitlement, no payment, no
   activation switch.
6. **ConversationSession, providers, prompts and rewards remain unchanged.**
7. **No emoji overlay where a portrait already represents the character.**
8. **Transcript and auxiliary tools are secondary** to the three primary
   controls.
9. **Primary call controls are microphone, hang-up and speaker.**
10. **Marzi must be a substantial in-scene companion**, never a badge.
11. **Production artwork arrives through stable asset paths** —
    `public/assets/marzi/**` — registered, never inlined or fabricated.
12. **Browser chrome cannot be hidden from a normal tab**; the installed
    standalone PWA is the preferred experience, TWA is the Play path (ADR-12).

---

## 6. Implementation roadmap

### Phase 1 — no new art required

**Deliverables** D-01 (hide the call emoji behind the loaded portrait) ·
D-07 (preserve the last character line while thinking) · identity hierarchy
and safe-area pass on the call top bar · confirm exactly three primary
controls with the tools row clearly secondary · D-06 live countdown ·
D-04 MB-primary package presentation · align limit/plan/Premium layouts on
the shared sheet component · D-11 "how it works" · regression tests for all
of the above.

**Dependencies** none. **Risks** D-04 touches purchase *presentation* next to
frozen economy code — the guard is that `buyPack`, ids and prices are
assertion-locked. **Tests** emoji hidden only when `.ok` is present and still
shown as fallback; last-utterance retention across a `processing` transition;
pack rows show MB and minutes with unchanged prices; ≥48px targets; no
horizontal overflow at 360×640 and 390×844.
**Acceptance** all of the above green, plus economy assertions unchanged.
**Rollback** each item is an independent commit; revert individually.

### Phase 2 — temporary asset contracts

**Deliverables** state-aware Marzi placeholders wired through
`marziArt(stage, state)` for all ten board contexts · stable call asset paths
registered but empty · outfit preview fallbacks behind
`public/assets/marzi/outfits/<slug>.svg` · D-02 re-anchoring and sizing of
Marzi with the placeholder · D-03 no-internet state · portrait treatment
(scrim, framing) · state-transition and purchase/limit animation hooks behind
`prefers-reduced-motion`.

**Dependencies** Phase 1. **Risks** enlarging Marzi competes with the controls
on 360×640 — the tools row yields, never Marzi (§2). **Tests** every state
resolves to a shipped fallback with zero network requests; reduced-motion
gives `animationDuration: 0s`; offline state reachable and dismissible with
navigation intact. **Acceptance** all ten contexts render at both viewports in
LTR and RTL. **Rollback** the asset registries ship empty — clearing a
registration restores the previous rendering exactly.

### Phase 3 — production art integration

**Deliverables** hoodie/backpack Marzi call poses (stages 4–6) ·
listening/thinking/speaking expressions · limit/offline/Premium poses ·
painterly character portraits matching the board · final logo, header mark and
app-icon consistency.

**Dependencies** family sign-off (ADR-5), the delivery checklist, Phase 2's
contracts. **Risks** artwork that misses the spec's crop/safe-area rules will
not drop in cleanly; portrait restyling touches server prompts and is a
separate, explicitly-scoped change. **Tests** every registered asset resolves;
byte-level visual diffs against the approved files; no layout shift versus the
placeholder. **Acceptance** every §3 state served by approved art, no
placeholder reachable in production, D-14 verification passing.
**Rollback** unregister the asset — the placeholder path is permanent and
always present.

---

## 7. Documentation relationships

| Document | Relationship |
|---|---|
| `docs/design/concept-boards/README.md` | Boards are the canonical visual source of truth; this board is registered there. |
| `docs/DESIGN_SYSTEM.md` | Components realising this board: `marziAvatar`, `characterAvatar`, `speechBubble`, `callControl`, `callIdentity`, `callSheet`, `storeItem`, `modal`, `emptyState`, `errorState`, `brandLockup`. This document adds **no** new component; it constrains how existing ones compose. |
| `docs/DECISIONS.md` | ADR-5 (art sign-off), ADR-6 (cartoon, no fake mouths), ADR-10 (asset governance, "Marzi" spelling), ADR-12 (browser chrome / TWA), ADR-13 (interface copy follows the help language). §5 introduces no ADR — every decision restates an existing one or is a scoped product ruling. |
| `docs/IMPLEMENTATION_REPORT.md` | MARZI-006 (call layer), MARZI-013 (states), MARZI-014 (plan/Premium), MARZI-017 (structure). §4 audits against `53929a5` and corrects one MARZI-017 claim. |
| `docs/design/MARZI_ASSET_SPEC.md` | Source of pose/outfit/expression definitions and the path conventions. §3's missing-asset list is expressed in its terms; **nothing here supersedes it**. |
| `docs/design/MARZI_ASSET_DELIVERY_CHECKLIST.md` | The vendor-facing list. §3 identifies which P0 items remain outstanding. |

**No contradictory rules were introduced.** Where the board disagrees with a
standing decision — the mascot's spelling and the tab labels — the standing
decision wins and the board is recorded as having an erratum.
