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
