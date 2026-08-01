# Implementation Report — MARZI-001

**Task:** Evolution integrity and call companion consistency
**Date:** 2026-07-31 · **Status:** Complete, tests green, NOT merged to production (awaiting approval)

## Files modified
- `public/index.html` — evolution model + call companion
- `test/run.js` — extended stage/companion checks + DOM stub `setAttribute`
- `docs/IMPLEMENTATION_REPORT.md` — this report

## Behavior changed
1. Canonical six-stage evolution driven by XP thresholds exactly
   0 / 150 / 400 / 800 / 1500 / 2600 (`MARZI_STAGE_XP`, `marziStageForXp`).
   Invalid, non-numeric or negative XP maps safely to stage 1; exact
   threshold values map to the new stage; huge XP caps at stage 6.
2. Learner rank (`rankFor`, 7 levels, titles) is now fully separate from
   Marzi evolution — the old `stageFor(rank)` collapse was removed.
3. Call companion (`renderCallCompanion`): shows the EARNED stage, never
   forced — all `Math.max(5, …)` behavior removed (calls and guided
   dialogues). Stages 1–3 render in the compact circular badge with the
   caption "Marzi · <name> · n/6"; stages 4–6 use the normal presentation.
4. Same earned-stage source now feeds Learn hero, Profile, limit modal and
   onboarding evolution strip (previously rank-derived).

## Not modified (per task scope)
Server behavior, APIs, dependencies, assets, economy, store, navigation,
unrelated UI. `git diff` touches only the files listed above.

## Tests executed
`node --check server.js` — pass.
`node test/run.js` — **14/14 pass**, including new cases:
invalid XP (`NaN`, `"nope"`, `null`, `undefined`), negative XP, every exact
threshold, between-threshold values, large XP (999999 → 6), call-companion
rendering for all six stages via `renderCallCompanion` (asserts
`data-stage` equals the earned stage — stage 5 is not forced), plus the
full pre-existing regression suite (i18n parity, scenarios, voices,
byte-identical German prompts, economy, chart).

## Corrections round (independent review, 2026-07-31)

The reviewer's prose report never reached this environment; the corrections
below were found by re-auditing commit d5cd822 against the five finding
categories named in the correction order (data integrity, accessibility,
regression coverage, scope control, maintainability). Every item is a
verified defect, not an interpretation.

**Critical — data integrity**
- `S.callId` was never reset per call, so after the first call every later
  call hit the reward ledger's duplicate guard: `recordCall()` returned 0 —
  no XP, no coins, no days/calls/seconds recorded. Fixed:
  `startConversation()` now assigns a fresh `newRewardId()` per call.

**High**
- Mic button state regression: the JS still toggled the removed `.live`
  class and never set `data-status`, so the button showed no listening /
  processing feedback at all. Fixed: new `micStatusFor(S)` helper drives
  `data-status` (`processing` wins over `listening`, else `ready`).
- `MARZI_KEY` still pointed at the legacy `telefontrainer.marzi` key after
  the storage migration, so evolution-celebration state diverged from the
  migrated copy. Fixed: `MARZI_KEY = "marzi.stage.v1"`.

**Medium — accessibility**
- `#callStatusLive` (aria-live) existed but was never written. It now
  announces listening/ready via the existing i18n strings (no new keys).
- Learn-hero Marzi: click handlers sat on inner spans while the wrapping
  `<button id="marziBtn">` had none — keyboard activation and padding
  clicks did nothing, and labeling was title-only. Fixed: single handler +
  `aria-label` (stage name + evolution title) on the button itself.
- `renderCallCompanion` now sets `role="img"` so its aria-label is
  announced.
- `sw.js` CACHE bumped v19 → v20 (app shell changed; offline copies of the
  broken shell must be invalidated).

**Scope control (disclosed, not reverted)**
- Commit d5cd822 also carried inherited work beyond MARZI-001's letter
  (brand meta/title, localStorage migration, reward ledger,
  `normalizeStats`, Learn/Store/Profile markup) from an interrupted earlier
  task. Reverting it would break shipped markup; instead the corrections
  above make that inherited code correct and fully wired, and this section
  records the scope excess explicitly.

**Regression coverage added** (suite now 15/15)
- Ledger idempotency (same reward id pays exactly once).
- Two-call recording: re-finalizing the same call pays 0; a fresh call id
  records again; `startConversation` source-checked for the id reset.
- `normalizeStats` hardening (negative/NaN/wrong-shaped fields → safe).
- Migration mapping (stats key, vocab prefix, stage key end-to-end copy);
  `MARZI_KEY` asserted to be the migrated name.
- `micStatusFor` state matrix (busy > listening > ready).
- Test stub gained `localStorage.key()/length` and keeps
  `setAttribute`/`getAttribute`.

## Known risks
- Users mid-progress may see Marzi change stage once (rank-based → XP-based
  mapping differs slightly around old ranks 5–6). One-time, cosmetic.
- The family previously requested an always-recognisable Marzi in calls;
  the circular badge + caption is the agreed compromise pending their
  on-device review.

---

# Implementation Report — MARZI-002

**Task:** Application shell (theme, top bar, navigation, routing, primitives)
**Date:** 2026-07-31 · **Status:** Complete, tests green, NOT merged (awaiting review)

## Scope decision (approved)
Most of the requested shell already shipped natively in the Marzi 2.0
redesign (ADR-11): cream/green theme tokens, shared header/main/nav layout,
four-tab bottom navigation, top bar with wordmark + coins + streak, and
fully built pages. Per approval, existing pages and business logic were NOT
touched, tabs keep their names (Learn/Talk/Store/Profile), and only the
genuine gaps were implemented.

## Implemented
1. **Hash routing + Android back button** — each tab owns a hash
   (`#learn/#talk/#store/#profile`); `tabFromHash` validates, `syncTabHash`
   writes it (first navigation via `history.replaceState` so back exits the
   app cleanly; later ones push entries), a `hashchange` listener drives
   `showTab` on back/forward, and boot honors a deep-linked hash.
   Note: qualified as `window.history` — the app's chat-transcript helper
   `history()` shadows the global.
2. **Top bar** — new daily-minutes chip (clock icon + minutes left from the
   existing plan math, read-only; taps into the Store) and a settings gear
   (new `IC.gear` stroke icon; taps into Profile). Chips are nowrap and
   compact; measured on 390px: no overflow (gear right edge at 378px).
3. **Reusable primitives** — canonical `.card` and `.btn` (+`.btn.primary`)
   base classes for all future screens; additive, zero visual change to
   current pages.
4. **Tokens** — `--space-1..5` and `--text-xs..xl` scales in `:root`;
   shell chrome (top bar, wordmark, chips) now uses them.
5. `sw.js` CACHE v20 → v21 (app shell changed).

## Not touched (per approval)
Tab names and i18n keys, page content, all business logic (XP, evolution,
economy, store, calls, characters), server, dependencies.

## Tests
`node --check server.js` — pass. `node test/run.js` — **16/16**, including
the new MARZI-002 check (hash map + junk-hash rejection, navigation writes
the hash, top-bar coins/minutes render, `.card`/`.btn`/token/chrome presence
in the document). Verified live in Chromium at 390×844: deep link `#store`
renders the Store, gear → `#profile` shows Profile, browser back returns to
`#store`/Store, top bar does not overflow. Test stub gained
`location`/`history`/`addEventListener`.

---

# Implementation Report — MARZI-003

**Task:** Conversation Engine architecture
**Date:** 2026-07-31 · **Status:** Complete, tests green, NOT merged (awaiting review)

## What was built
A provider-agnostic conversation core inside the single-file app (ADR-9:
graft natively — in a no-framework codebase, "interfaces" are documented
duck-typed contracts enforced at registration):

- **ENGINE_CONTRACTS + validateProvider** — the AIProvider
  (`complete({system, messages}) → {text}`), SpeechProvider
  (`start/stop`, STT) and VoiceProvider (`speak/stopAll`, TTS) interfaces.
  Registration rejects implementations with missing methods.
- **createProviderRegistry** — dependency injection: `register/get/has`;
  `get` before registration throws.
- **ScenarioRegistry / CharacterRegistry** — read-only views over the
  canonical `SCENARIOS` data (playable ids, per-speaker character view
  with voice/avatar/kind; speaker 2 maps to the `<id>2` persona).
- **createTranscript** — the transcript model: validated turns
  (learner|character, non-empty text, frozen entries), accessors, and
  `forPrompt(seed)` mapping to provider message shape.
- **PromptBuilder.rolePlay(cfg)** — delegates to `systemPrompt()` (the
  German prompt is byte-frozen by the suite and must not fork); snapshots
  and restores `S`, so building a prompt never leaks state.
- **createConversationSession** — lifecycle `created → active → ended`;
  `send()` only when active, records both turns, feeds the injected AI
  provider the built prompt + seeded transcript, validates the reply
  shape; illegal transitions throw.

## Explicitly NOT done (per task)
No provider implementations, no OpenAI/Anthropic calls, no speech APIs, no
TTS/STT, no rewards/XP, no UI changes. The live call flow (`ask/listen/
speak`) is untouched and still runs on its original path — migrating it
onto the engine is a future task.

## Tests
`node --check server.js` — pass. `node test/run.js` — **17/17**. The new
architecture check covers: contract rejection (missing methods, unknown
kinds), DI throw-before-register and roundtrip, registry views + unknown-id
rejection, transcript turn validation + message mapping, PromptBuilder
content and S-restoration, and the full session lifecycle with a fake
injected AI provider (send-before-start, double-start and send-after-end
all throw; turns recorded; provider receives prompt + seed). The test
harness now settles async checks before the summary/exit code.

---

# Implementation Report — MARZI-004

**Task:** Migrate the live call flow onto the Conversation Engine
**Date:** 2026-07-31 · **Status:** Complete, tests green, NOT merged (awaiting review)

## Adapters (existing flows behind the engine contracts)
- **liveAIProvider.complete** — wraps the existing `chatFetch` (PIN prompt,
  401 retry, 429 limit modal all preserved) plus the strict-JSON parse.
  Returns `{text, raw}`; `raw` carries translation/feedback/corrected/
  suggestion/speaker/done to the UI unchanged.
- **liveSpeechProvider.start/stop** — wraps the Web Speech recognizer
  construction; `onResult/onError/onEnd` hand back to the existing UI error
  handling (mic blocked, no-speech, no-device, aborted) untouched.
- **liveVoiceProvider.speak/stopAll** — wraps the existing `speak()` chain,
  keeping neural TTS + cache, device fallback, slow repeat and portrait glow.
- Registered at boot into `ENGINE = createProviderRegistry()`.

## Single canonical transcript (approval constraint 2)
`ConversationSession.transcript` is now the ONLY source of prompt history.
`history()` is retained but no longer called (marked as the rollback path).
`S.turns` stays a render-only mirror: `send()` writes the canonical
transcript FIRST and returns early if it is rejected, so the mirror can
never diverge from it.

## Guards (approval constraint: concurrency + late responses)
- Concurrent AI requests rejected (`askInFlight`) at the session level.
- A reply arriving after `end()` is dropped: `ask()` returns null, the
  transcript is not mutated, the UI adds nothing.
- Duplicate turns rejected in the transcript (same speaker + same text
  back to back); a legitimate later repeat is still allowed.
- Provider errors reset in-flight state in `finally`, so a failed request
  leaves the session active and the next request succeeds.
- `hangBtn` calls `session.end()` before teardown.

## Preserved (approval constraint 1)
All user-facing error handling in `listen()`, `ask()`, `speak()` and hang-up
is intact — the mic alerts, the generic `t().err` alert, the TTS device
fallback and the full teardown sequence are unchanged. Call UI, character
switching, translations, slow repeat, mic modes, timer, rewards, XP and
end-call review are untouched. The German system prompt is reached only via
`PromptBuilder` → `systemPrompt()` and stays byte-identical (suite-guarded).

## Tests
`node --check server.js` — pass. `node test/run.js` — **18/18**.
New integration check (fake providers): live adapters registered; opening
`ask()` without a learner turn; full learner → AI → transcript lifecycle;
duplicate-turn rejection; concurrent-request rejection; call end during a
pending response (late reply dropped, transcript frozen); provider failure
leaves state clean and recovers; UI wiring routes through `S.session` and
the voice provider, applies character handover (`speaker:"second"`), hint
and translation, and ignores a double submit.
Verified live in Chromium with stubbed `/api/*`: opening line renders,
learner turn round-trips (transcript and render model both 3 turns, log
shows both sides), hang-up mid-flight ends the session, drops the late
reply, shows the review screen and awards XP (+19).

## Rollback
Single commit on the development branch — `git revert` restores the
pre-migration flow; `history()` is still present for that path. `main`
untouched. Pre-MARZI-004 state: 9d45a0b.

---

# Implementation Report — MARZI-005

**Task:** Practice + call experience closer to the concept boards
**Date:** 2026-08-01 · **Status:** Complete, tests green, NOT merged (awaiting review)

## Note on the boards
The concept boards were not readable in this session, so the visual direction
follows the design language already codified from them: family-approved
`marziSVG`, cream/green palette, cartoon-only portraits (ADR-6), rounded
cards, soft shadows, MARZI-002 tokens and `.card`/`.btn` primitives. No new
characters, portraits or avatar identities were created (approval
constraint 2) — every face comes from existing `SCENARIOS` data and the
existing `/api/avatar/<id>?v=3` endpoint.

## Practice screen
- **Scenario cards** (`.scn-rail`) over existing scenario data: emoji,
  German title, localized situation + character. The selected scenario is
  always present in the rail even when picked from the drawer.
- **Selected state** is `aria-pressed` + ring + tint + check icon — never
  colour alone. Exactly one card is selected at a time (asserted in tests).
- **Character identity card**: existing portrait, `who`, and the localized
  situation. Advisory **"Preparation recommended"** chip at A0 only.
  `goCall` gating is byte-unchanged and the call is never blocked
  (approval constraint 1; a test greps `goCall` for prep references).
- The old picked-card became a compact "all situations" opener (the drawer
  and its grouped list are unchanged).

## Call screen
- **Overlap fixed**: identity moved out of the portrait into its own row
  below it; Marzi sits beside the text, not on the portrait (measured:
  no intersection).
- **Truncation fixed**: name and situation each render on one line
  (measured: `scrollWidth === clientWidth`).
- **One screen**: `body.in-call main` is a `100dvh` flex column with the
  transcript as the flexible middle, so alerts or the type row can never
  push the page taller. Measured 756–823px against an 844px viewport in
  every state, `pageScrolls: false`.
- **Transcript bubbles**: character left, learner right; the inner DOM
  (word-tap spans, replay/translation/say-it buttons, translation toggle)
  is unchanged — 20 word-tap spans and the translation toggle verified live.
- **Remaining time** chip from existing plan math (read-only), with a
  low-time variant that changes icon colour *and* stays labelled.
- **Speaker replay** (`playBtn`) replays the last character line at normal
  speed through the existing voice provider — no new TTS path.
- **Five states** (`callStateFor`): listening / processing / speaking /
  disconnected / error, each rendered as icon + text + colour and mirrored
  into the existing `aria-live` region. A stale error (e.g. an earlier mic
  warning) is cleared when a new turn is sent, so the chip shows what is
  happening now.

## Accessibility
All call and practice controls measure **≥48px** (measured: 0 undersized).
ARIA labels on cards, identity, chips and companion; `role="status"` on the
status chip; visible `:focus-visible` rings; a `prefers-reduced-motion`
block that stops the pulse/glow/bob while keeping every state visible.
Known limit: inline word-tap spans inside sentences keep their text size —
they are words in a sentence, not controls, and enlarging them would break
the tap-to-save feature.

## Preserved
ConversationSession, provider adapters, the German system prompt, AI/STT/TTS
APIs, rewards, XP, economy, call timer, character switching, translations,
slow repeat and the end-call review are untouched. Nothing from the
do-not-implement list was added.

## Tests
`node --check server.js` — pass. `node test/run.js` — **19/19**.
New check covers: all six call states + precedence, icon-and-text for every
state, the eight new i18n keys in all six languages, remaining-time math
(never negative), exactly one selected scenario card with a non-colour
indicator, character card from existing data, `goCall` free of prep
references, and the bubble rewrite retaining word-tap/translation/replay.
Chromium walkthrough at 390×844: scenario card selection moves correctly
(kita → arzt, character card follows), a complete call runs (opening line,
learner turn, reply, bubbles char/me/char), hang-up during a pending
response ends the session, drops the late reply, shows the review and
awards XP (+19).

---

# Implementation Report — Marzi Design System

**Task:** Canonical component library + tokens, documented
**Date:** 2026-08-01 · **Status:** Complete, tests green, NOT merged

## What was built
- **19 canonical components** as `UI.*` builders in `public/index.html`:
  marziAvatar, characterAvatar, topBar, coinChip, xpBar, evolutionCard,
  characterCard, scenarioCard, bubble, storeItem, outfitCard,
  buttonPrimary, buttonSecondary, statusBadge, progressCard, rewardPopup,
  modal, emptyState, errorState. Each returns escaped HTML and reads
  sizing/colour only from tokens.
- **New token groups**: animation (`--dur-*`, `--ease`, `--ease-pop`), icon
  sizes (`--icon-*`), touch targets (`--touch-min: 48px`, `--touch-lg`),
  avatar sizes (`--avatar-*`) — alongside the existing colour, spacing,
  typography, radius and shadow scales.
- **New component CSS** for what did not exist yet: status badge (5 tones),
  progress card, reward popup, empty state, error state, modal backdrop.
  `.limit` and `.alert` are aliased as the canonical modal and inline-error
  surfaces so shipped markup keeps working.
- **docs/DESIGN_SYSTEM.md**: token tables, six global rules, and every
  component documented with Purpose / Visual rules / States / Accessibility
  / Responsive / Usage, plus the procedure for adding to the system.

## Extraction, not duplication
Shipped screens were rewired to COMPOSE the components: the scenario rail
(`UI.scenarioCard`), the character card (`UI.characterCard`), the evolution
strip (`UI.evolutionCard`), the call transcript (`UI.bubble`) and the
mistakes empty state (`UI.emptyState`). Rendering is unchanged — verified
pixel-wise in Chromium at 390×844 and by the full suite.

## Enforcement
The new suite check fails if: a component is missing or `UI` grows an
undocumented member; any builder throws on default arguments; a documented
token is absent or `--touch-min` is not 48px; a builder loses its
accessibility contract (`role="img"`, `aria-pressed`, `role="progressbar"`
+ `aria-valuenow`, `role="dialog"`+`aria-modal`, `role="alert"`,
`aria-live`, `data-tone`); values stop clamping or text stops being escaped;
a shipped screen stops composing its component; or DESIGN_SYSTEM.md stops
documenting a component or section.

## Honest notes
- The concept boards were still not readable in this session, so the system
  codifies the shipped, family-approved language and records the boards as
  the overriding source of truth when they disagree.
- `rewardPopup`, `progressCard`, `outfitCard`, `storeItem`, `topBar` and
  `modal` exist, are tested and documented, but some are not yet wired into
  a screen (the shipped equivalents are their instances). Wiring them is
  future work, not a claim of current use.

## Tests
`node --check server.js` — pass. `node test/run.js` — **20/20**.

---

# Implementation Report — Design token reconciliation (findings 1–4)

**Task:** MARZI-DESIGN-RECONCILIATION, mechanical part only
**Date:** 2026-08-01 · **Status:** Complete, tests green, NOT merged

## Blocked / not attempted
The concept boards did **not** reach this environment (no image in the
message; nothing new in the repo or on disk). The board comparison —
Marzi proportions, glasses/book/backpack, stage styling, outfits 4–6,
owned/equipped store states, call-screen composition, overall tone — is
**not** in this commit and remains open. No replacement art was invented.

## Done (findings 1–4)
| Raw values | Before | After |
|---|---|---|
| Hex colours outside `:root` | 65 | **0** |
| Animation timings | 22 | **0** |
| Type sizes (`font-size` + `font:`) | 88 | **0** |
| Icon sizes (`IC.*(px)`) | 64 | **0** |
| One-off `rgba()` overlays | 53 | 33 (documented debt) |

Every replacement is value-exact: where no token matched, a token was added
at the shipped value rather than snapping to a near neighbour. New token
groups: extended palette (33 named surfaces), reused tints, the full
animation scale plus semantic ambient loops (`--loop-glow/pulse/bob/drift`),
the fine type ramp (`--text-f7-5` … `--text-f64`), and the icon scale
mirrored in JS as `ICON` (SVG width/height take numbers, not custom
properties).

## Deliberately NOT tokenized
`marziSVG`'s internal colours are family-approved artwork constants
(ADR-5/ADR-10), not UI chrome. They stay as they are and change only with
approved art.

## Proof of no visual regression
Seven screens captured at 390×844 (deviceScaleFactor 2) before and after,
animations frozen: learn, practice, store, profile, call, done, evolution.
A byte-level pixel comparison reports **0 differing bytes on every screen**
(identical file sizes as a second signal). Method: raw PNG IDAT inflate +
per-byte compare.

## Enforcement added
A new suite check fails on any raw hex, timing, type size or icon size
outside `:root`, and on drift between the JS `ICON` scale and the
`--icon-*` tokens.

## Tests
`node --check server.js` — pass. `node test/run.js` — **21/21**.

---

# Implementation Report — Board reconciliation, Batch 1

**Task:** MARZI-DESIGN-RECONCILIATION Batch 1 (M1, H3, H4, L1, L4)
**Date:** 2026-08-01 · **Status:** Complete, tests green, NOT merged

## Boards are now canonical
`docs/design/concept-boards/{01_home,02_call,04_progress}.png` are the visual
source of truth; a future board is canonical on arrival. The Store panel
inside `04_progress.png` stands in until a dedicated store board exists.

## M1 · Palette (board-measured, high confidence only)
`--bg` `#f7f1e5` → **`#fcf8f0`** · `--primary` `#5f962d` → **`#547c2c`**
(hover `#496b26`, active `#3e5a20`, keeping the original ratios) ·
`--track` `#eae4cd` → **`#e0dcc4`** · new **`--xp-fill: #709820`**.
Per ruling, `--coin` and `--card` are unchanged — coin sampling was
inconclusive (4–8% region dominance) and card sampling would have inverted
page/card elevation.

## H3 + L4 · Stage naming
`MARZI_NAMES` (hard-coded German) → `marziNames()` / `marziDescs()`, backed by
`stageNames` + `stageDescs` + `stageWord` in all six help languages (**78 new
strings**). Spanish is transcribed verbatim from `04_progress.png`; stage 1 is
plural everywhere. The evolution showcase now shows the current stage's
description. All nine call sites migrated. **The six XP thresholds are
untouched** (asserted in the suite).

## H4 + L1 · Home hero
Rebuilt to the board hierarchy: greeting → **Marzi centred at 132px** →
**stage number + stage name** as the primary identity → **XP bar with the
value in a pill inside** → one primary green CTA. Learner rank stays as a
small secondary line — rank and evolution remain separate systems
(MARZI-001). XP bar is now 22px with a solid `--xp-fill`.

## Sparkles
Five CSS-only radial-gradient dots in `--coin` / `--primary`, slow opacity
twinkle, disabled under `prefers-reduced-motion`. **No image assets.**
A real bug was found and fixed during verification: without a per-layer
`background-size`, `background-position` moves a full-size layer, so every
dot rendered in the middle of the card (invisible behind Marzi).

## Verification
`node --check server.js` — pass. `node test/run.js` — **23/23**, including two
new checks: localized stage names/descriptions in all six languages with the
Spanish text asserted against the board and the XP thresholds re-asserted;
and the Home hero (board token values, solid fill, 22px bar, stage identity,
XP-inside-bar, rank still visible, sparkles CSS-only).
Chromium at 390×844: Home (es) shows "Nivel 5 / Rana estudiosa", page
background `rgb(252,248,240)`, XP fill `rgb(112,152,32)`, bar 22px, no page
scroll; Home (en) shows "Level 5 / Studious frog"; the evolution modal lists
all six Spanish names plus the description; the call screen is unregressed
(756px, no scroll, localized companion label, transcript intact).

## Not touched
Call UI, store logic, economy, providers, prompts, backend, rewards, outfit
catalog, logo, progression thresholds.

---

# Implementation Report — MARZI-006

**Task:** Canonical call experience (board `02_call.png`)
**Date:** 2026-08-01 · **Status:** Complete, tests green, NOT merged

## Layout
The call is now a **fixed immersive layer**: dark, full-bleed portrait, no
cream card, app top bar hidden. Sized with `100dvh` + `env(safe-area-inset-*)`
— never hard-coded to 844px.

Structure is a **flex column** (`.call-top` / `.call-mid` / `.call-stack`).
The first attempt positioned everything absolutely against a magic
`--call-stack` offset; measurement showed the tools row wrapping to 104px and
the stack overlapping Marzi. Making the bands flex siblings removed that class
of bug entirely — the stack can grow and nothing can collide.

- Identity: kicker + name + place, centred, three lines, no truncation.
- Character bubble upper-left; Marzi lower-left in-scene; Marzi's suggestion
  bubble attached beside her.
- Circular controls: mic 64px · **hang-up 72px red** · speaker 64px.
- Timer + remaining daily minutes below the controls.

**Bug fixed during verification:** right-anchored shrink-to-fit bubbles
collapsed to *min-content* and clipped their text (`scrollHeight` 99 vs
`clientHeight` 72). Bubbles now carry explicit widths.

## Transcript & tools sheet
Transcript moved into a bottom sheet, opened by a **labelled** control
("Transcript", never icon-only). It keeps word tap, per-line translation,
slow repeat, the SOS quick phrases, the hint box and typed input.
Dismissible **four ways**: close button, swipe down, Escape, and Android back
(a `pushState` entry consumed by `popstate`, so back never leaves the call).
Focus moves to the close button on open and back to the opener on close.

## States
One source (`callStateFor`) drives the chip, the mic button and the aria-live
region: ready / listening / processing / speaking / disconnected / error —
each icon + text + colour. Disconnected and error persist until resolved;
all existing alerts and recovery paths are unchanged.

## New canonical components
`UI.callControl`, `UI.speechBubble`, `UI.callIdentity`, `UI.callSheet` —
documented in `DESIGN_SYSTEM.md`; the suite fails if any loses its contract.

## Preserved
ConversationSession + canonical transcript (S.turns stays render-only),
all three providers, German prompt, rewards, XP, economy, timer logic,
character switching, translation, slow repeat, end-call review, late-response
and duplicate-request guards. No provider is called from an event handler.

## Tests — 24/24
`node --check server.js` pass. New MARZI-006 check covers listening,
processing, speaking, disconnected and error states; sheet open/close/back;
speaker replay; duplicate-turn rejection; late reply after hang-up; and the
layout contracts (`100dvh`, safe-area insets, 64/72px controls, touch floor).
The harness now **serialises async checks** — they share global `S` and were
interleaving, which produced a real false failure.

## Chromium
390×844 and 360×640: no page scroll, top bar hidden, **zero collisions**
between identity, Marzi, bubbles and controls, identity not truncated, zero
targets under 48px, everything inside the viewport. Sheet shows 3 turns, 20
word-tap spans, translation, 3 SOS phrases and the input; Android back closes
the sheet and stays in the call; Escape closes it; hang-up during a pending
response ends the session, drops the late reply, shows the review and awards
XP. Reduced motion: animation durations 0s, states still legible.

## Unresolved asset gaps
1. Marzi in-scene is the **temporary placeholder** SVG at 108px; the board
   shows a ~190px hoodie-wearing figure (spec P1 `call` pose).
2. Yellow hoodie and backpack do not exist in the implementation.
3. No `listening`/`thinking`/`speaking` expressions — state is carried by the
   chip and mic, not by Marzi's face.
4. Character portraits remain flat-cartoon, not the board's painterly style
   (deviation H5, out of scope).

---

# Implementation Report — MARZI-007

**Task:** Canonical store experience (store panel in `04_progress.png`)
**Date:** 2026-08-01 · **Status:** Complete, tests green, NOT merged

## Catalog
Nine outfits with board slugs and **board prices** (800 / 900 / 1200), matching
`MARZI_ASSET_SPEC.md` P3 so approved art drops in by filename. Names are
localized in all six languages; Spanish is transcribed verbatim from the board.
Five categories (`outfits · hats · glasses · backpacks · pants`); only
`outfits` has a catalog — the rest render a friendly **"Coming later"** empty
state and never imply products exist.

## One canonical transaction
`commitStats(next)` is the single writer: one object, one `localStorage` call.
`purchaseOutfit` builds a copy and commits once, so **a failed write changes
neither the balance nor ownership** (verified by stubbing `setItem` to throw).
It is idempotent — an owned item returns `already` before any deduction.
**Buying never auto-equips.** `equipOutfit` writes `equippedItemIds: [id]`, so
at most one outfit is ever worn; equipping another replaces it.

## Migration safety
`normalizeWardrobe` runs inside `normalizeStats` on every load:
legacy ids map to canonical ones (`young-frog-adventurer→explorer`,
`studious-frog-reader→classic`, `expert-frog-graduate→graduate`), and
**unrecognised ids are never deleted** — they move to `legacyUnknownItemIds`
and stay recoverable. Corrupt storage (non-arrays, objects in the list,
equipped-but-not-owned) is filtered without throwing and without ghosts.

## States
`locked` (stage requirement) · `available` (price) · `insufficient` (muted
price) · `owned` (check + "Owned") · `equipped` (check + "Worn" + ring), plus
the selected preview modal. Every state is **icon + text**, never colour alone.
Tapping a card opens the preview with the correct explicit action:
Buy / Equip / Unequip, always with Cancel. Escape and the backdrop close it;
the result is announced through an `aria-live` region.

## Minute packs
Untouched and kept in their own section below the outfit grid. `buyPack`,
prices and behaviour are unchanged; only the button height was raised to the
48px floor (presentation).

## Fixes found while verifying
- Minute-pack buttons were 38px — below the touch floor.
- The top bar overflowed once the balance reached four digits. The brand
  wordmark now never shrinks (a first attempt clipped it to "M…"); chips are
  compact and values ≥ 10000 display as `99k` while the wallet keeps the exact
  number in `aria-label`.
- Minute-pack rows showed the price twice (row text + button).

## Tests — 25/25
`node --check server.js` pass. New MARZI-007 check covers catalog integrity
(9 ids/stages/prices, categories, localized names), the full state machine,
purchase idempotency, locked/insufficient refusals leaving the wallet
untouched, **atomic rollback on save failure**, one-outfit-maximum equipping
and switching, legacy migration with unknown ids preserved, corrupt-storage
recovery, and the rendered grid/tabs/empty state.

Chromium at 390×844 and 360×640: five tabs, nine cards, 3-column grid, zero
targets under 48px, no horizontal scroll. Buy 2000→1200 with `owned` and
**not** equipped; equip then switch leaves exactly one worn; reload persists;
empty category shows "Muy pronto".

## Unresolved asset gaps
1. **All nine outfit visuals** — neutral silhouette placeholder (spec P3).
2. **Preview art** shows the same silhouette, not a dressed Marzi.
3. **Hats / glasses / backpacks / pants** — no catalog, no art; tabs ship empty
   by design.
4. **Category icons** come from the existing `IC` set, not board glyphs.

---

# Implementation Report — MARZI-008

**Task:** Rewards and evolution feedback
**Date:** 2026-08-01 · **Status:** Complete, tests green, NOT merged

## Order of operations
`endCall` now: **persist → summarise → render → animate → celebrate**.
`recordCall()` commits through the existing ledger first; only then is the
summary built **from committed state**. Animation code reads the frozen
summary and touches the DOM only — it never writes XP, coins, the ledger or
ownership (asserted by snapshotting storage around render+animate).

## One canonical frozen summary
`buildRewardSummary()` returns an `Object.freeze`d model: gains, call facts
(duration/turns/corrections), `xpBefore/xpAfter`, `stageBefore/stageAfter`,
`evolved`, stage percentages, `state`, `saved`.

`state` ∈ **normal · high · evolved · none · duplicate · save-failed**.

## High-performance rule (exact, documented, tested)
```
turns >= 4
AND not abandoned          (no AI request pending when the call ended)
AND mistakes <= floor(turns / 4)   (at most one correction per four turns)
```
All three inputs already exist: learner turns from `S.turns`, corrections from
the same turns' `fix` field, abandonment from `S.busy` at hang-up. No new
scoring system, no hidden weights.

## Save-failure integrity
`claimReward` now snapshots `marzi.stats.v1` and the ledger before writing and
**restores both** if either write throws — closing a real pre-existing hazard
where stats could commit while the ledger write failed, which would have
allowed a second award. On failure the summary reports `save-failed`, shows
**no** gain, and reports committed XP. Ledger idempotency is unchanged.

## Evolution celebration
Fires **immediately after the reward summary** for the call that crossed the
threshold: old stage (faded) → new stage, localized name and description,
placeholder art via `UI.marziAvatar`, fanfare + confetti, keyboard-dismissible
(Escape or the Continue button, both ≥48px). Thresholds are read, never
written. A dedicated key `marzi.celebrated-stage.v1` records the celebrated
stage — `MARZI_KEY` keeps its own meaning (last stage the Learn hero
rendered), so the hero does not replay the same evolution.

## Animation
XP counts up over 900ms while the canonical solid bar grows from the pre-call
percentage; the coin chip then flies to the **wallet chip that is actually on
screen** (falls back to the in-card balance, never an off-screen target).
Under `prefers-reduced-motion` both are set to final values immediately and
the gain is still shown as text — measured: transition `0s`, bar starts and
ends at 25%, label `+40 XP`.

## Fixes found while verifying
- The flying coin ghost was cloned with `.rw-gain`, so it counted as a third
  gain chip — it now carries its own class and `aria-hidden`.
- The evolved card repeated the celebration title; it now shows the stage
  description instead.
- `.btn` was 40px — below the documented 48px floor — and surfaced in the
  celebration. Raised to `--touch-min` design-system-wide.
- The celebration overwrote the gains announcement in the live region; it now
  appends, so screen-reader users hear both.

## Tests — 26/26
`node --check server.js` pass. New MARZI-008 check covers: **every one of the
six thresholds** detected as a crossing with correct old→new stages; the
high-performance rule at its boundaries; normal / high / none / duplicate /
save-failed summaries; duplicate completion awarding nothing twice; storage
failure restoring committed state and leaving no ledger entry; render+animate
mutating nothing; and the celebration's localized name, description, dialog
role, dismissal and celebrated-stage key, plus the Learn hero's guard.

Chromium at 390×844 and 360×640, plus reduced motion: normal (+19 XP/+20),
high (6 turns/1 correction), evolved (385→404 crosses 400 → stage 3 with
celebration), zero-reward, Escape dismissal, celebrated key = 3, no horizontal
scroll, zero targets under 48px.

## Unresolved asset gaps
1. **Marzi reactions** — placeholder art has `sad` and neutral only; `happy`
   and `celebrating` fall back to neutral (spec P1/P2). Motion and text carry
   the difference.
2. **Celebration art** — placeholder stages, not the board figures.
3. No coin/XP burst artwork; effects are CSS plus the existing confetti and
   WebAudio fanfare.

---

# Implementation Report — MARZI-009 (queue 1/4)

**Task:** Plan-limit experience (deviation H6)
**Status:** Complete, 27/27 green, NOT merged

Rebuilt the daily-limit moment to board `02_call.png` panel 2: the shared
modal surface gains a **full-screen dark variant** (`.limit-full`) with Marzi
in the `sad` mood, the localized message, the reset countdown, and a plan
meter showing **used / limit minutes from the existing plan math** — no
economy change (`PLAN_SECONDS`, `COIN_PACKS`, prices and `buyPack` asserted
unchanged). The evolution showcase reuses the same surface and explicitly
clears the variant, so it stays a card.

Accessibility: `role="dialog"`, `aria-modal`, `aria-labelledby`, focus to the
primary action, an `aria-live` announcement, dismissal by button, backdrop or
Escape, and zero controls under 48px. Background scroll is locked with
`body.modal-lock` — verified with a real wheel gesture (scrollY stays 0),
after an initial `scrollTo` probe proved misleading.

Chromium 390×844 and 360×640: full-screen, plan `30 / 30 min`, countdown,
Escape dismissal, zero undersized targets. `sw.js` CACHE v29.

---

# Implementation Report — MARZI-010 (queue 2/4)

**Task:** Right-to-left support and accessibility sweep
**Status:** Complete, 28/28 green, NOT merged

**RTL.** Arabic has shipped as a help language since the beginning, but the
document never changed direction. `applyLangDirection()` now sets
`documentElement.lang` and `dir`, at boot and whenever the help language
changes. Mirrored components were converted to **logical properties**
(`inset-inline-*`, `margin-inline-start`, `text-align: start`,
`border-end-start-radius`), so one stylesheet serves both directions.
Verified in Chromium: Arabic renders `dir="rtl"` with the store close button
at x=16 and coins at x=296 (mirrored from 326/16 in English), and the call
companion moves from x=8 to x=256.

**Sweep.** An automated pass over Learn, Talk, Store, Profile, Call, the
transcript sheet and Done found **zero unlabelled controls** and seven kinds
of undersized target. Result after fixes: **zero undersized targets on every
screen**.

- Compact chrome (top-bar chips, menu, drawer close, store close) keeps its
  board size and gains a **48px hit area** via an `::after` extension — the
  visual stays, the target meets the floor.
- Segmented controls (level/speed), the mission routine chips and the legal
  links were raised to `--touch-min` directly.

**Honest note on pixels.** The logical-property conversion is pixel-neutral in
LTR by construction. The touch-target minimums **intentionally** change three
LTR heights: segmented buttons and routine chips 27→48px, legal links 15→48px.
That is the point of the package, not a regression.

`sw.js` CACHE v30.

---

# Implementation Report — MARZI-011 (queue 3/4)

**Task:** Offline and storage resilience
**Status:** Complete, 29/29 green, NOT merged

The app had **no connectivity handling at all** — `navigator.onLine` was never
consulted, and an offline call failed with the developer-oriented "no answer
from the server" message.

- **Offline banner** (`#netBanner`, `role="status"`): sticky under the top
  bar, names the problem and the recovery, appears and clears on the `online`
  / `offline` events.
- **Calls refuse to start offline** with the reason surfaced, instead of
  attempting a request that will fail. The banner is the channel — a first
  attempt used `alertMsg`, which writes to `#alert` **inside the call screen**
  and would have been invisible on the Talk tab.
- **In-call failures now distinguish offline from a server error**, keeping
  both existing alerts and every recovery path.
- **Storage failures are never silent**: `notifyStorageFailure()` surfaces the
  localized `saveFailed` string, and the settings write no longer swallows its
  exception. Purchases and rewards already reported save failures (MARZI-007 /
  008); this closes the last silent path.
- Service-worker policy unchanged — the suite asserts it still never caches
  `/api/`.

Two new i18n keys (`offlineTitle`, `offlineMsg`) in all six languages.

Chromium at 390×844 and 360×640: online → no banner; offline → banner shown,
call refused (`#call` stays hidden), reason displayed; back online → banner
cleared. `sw.js` CACHE v31.
