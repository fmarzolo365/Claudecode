# PRODUCT-AUTOMATION-002 — Consolidated Report for Codex

Queue: **MARZI-013 → MARZI-016**, executed sequentially, one commit per
package, full suite plus Chromium verification after each.
Branch `claude/german-phone-app-setup-bx0cr1`. **Not merged. Not deployed.**

## Queue integrity

All four packages were implemented under their original names and their
original scopes. **Nothing was substituted, renamed, reinterpreted or
derived.** The verbatim scopes are in `PRODUCT_AUTOMATION_002.md`; the state
file records each package as `done`.

| # | Package | Commit | Suite |
|---|---|---|---|
| 1 | MARZI-013 — Marzi States & Emotions | `d061e9f` | 31/31 |
| 2 | MARZI-014 — Premium + Internet/Minutes | `9855bb9` | 32/32 |
| 3 | MARZI-015 — Profile & Progress | `769c1d2` | 33/33 |
| 4 | MARZI-016 — Map / Learning Journey | `109ba28` | 34/34 |

Suite grew 30 → 34 checks. `node --check server.js` clean throughout.
Service worker cache v31 → v35.

## What each package delivered

**MARZI-013 — Marzi States & Emotions.** Eight canonical states mapped
deterministically from state the app already owns (`callStateFor` and the
reward summary); unknown input falls back to `neutral` and never throws.
`marziArt()` is the single artwork entry point and `MARZI_ASSETS` **ships
empty**, so every lookup falls back to the existing SVG and no request is made
for a file that does not exist. Approved production files can be registered
later without touching a call site. No artwork was invented.

**MARZI-014 — Premium + Internet/Minutes.** `planSnapshot()` is the single
source: the same seconds render as minutes and as MB at the approved board
ratio (10 MB = 1 minute). No second consumable; `buyPack()`, pack prices,
wallet and minute consumption untouched. Premium is presentation only —
`isPremium()` is unconditionally `false`, the purchase action states it is not
available yet, and there is no user-facing activation switch (a test-only hook
drives the visual state).

**MARZI-015 — Profile & Progress.** `profileSnapshot()` is the single reader;
every figure is a counter the app already writes. Marzi's stage and localized
description are primary, the learner rank is a separate secondary line, and
the six XP thresholds are unchanged. Achievements are pure functions of the
snapshot — a fresh profile earns exactly zero and locked ones show real
progress. Settings and Accessibility are now two labelled groups; the new
reduce-motion control is persisted, applied at boot, and additive only.

**MARZI-016 — Map / Learning Journey.** A path over the existing groups and
playable scenarios (19 nodes) with four states — done, here, open, future.
`future` is a look-ahead marker, never a lock: no node is disabled and tapping
any of them behaves exactly like the picker. One recommended next action. A
Map / List toggle gives an accessible alternative that writes every state out
in text. The map lives inside Learn, below the existing content; the four tabs
are unchanged.

## Approved decisions, as implemented

- **Premium: presentation only.** Plans render as approved; the purchase
  action says Premium is not yet available; nothing is unlocked; no
  user-facing activation switch; a test-only hook verifies the visual state.
  No backend, payment, subscription, entitlement or economy change.
- **MB: a presentation of the existing minutes allowance** at 10 MB = 1
  minute, from one canonical underlying value — not a second consumable.

## New persisted data

One field was added, in MARZI-016: `stats.scenariosDone` — a per-scenario
completion count written by `recordCall` **after** the reward claim succeeds,
so ledger semantics are untouched. Ad-hoc `custom` / `random` topics are not
recorded. It is normalized with the rest of stats and starts empty for
existing learners; nothing is back-filled or estimated.

`settings.reduceMotion` was added in MARZI-015 (accessibility control).

## Standing exclusions — all held

Server, prompts, providers, ConversationSession, XP rates, coin rates, the six
XP thresholds (`0,150,400,800,1500,2600`, suite-asserted), existing package
prices (`200,450,800,1500`, suite-asserted), `buyPack` (asserted unchanged by
source match), wallet transaction integrity and reward-ledger semantics are
all untouched.

## Defects found during verification and fixed

Each is disclosed in `IMPLEMENTATION_REPORT.md` at its package.

1. **Plan/Premium overlays mounted inside `<section id="store">`** (MARZI-014,
   introduced and caught within the package). A fixed overlay inside a hidden
   section is `display: none` with it, so the plan screen was unreachable
   unless Store was the active tab. Both hosts moved to top level.

2. **The 48px touch-target pseudo-element overflowed the viewport**
   (pre-existing, MARZI-010 era). `.chip-res::after` used
   `inset-inline: 0; min-width: 48px`, so on a chip narrower than 48px the hit
   box grew outwards only and the last top-bar chip pushed it past the right
   edge — a real 6px horizontal page scroll, reproduced with a `mouse.wheel`
   gesture, not inferred from `scrollWidth`. The box is now centred on its
   control and still measures ≥ 48×48.

3. **The top bar did not fit four resource chips on a 360px phone** with a
   four-digit coin balance (pre-existing). A `@media (max-width: 380px)` rule
   tightens the row gap and chip padding; 390px and up render unchanged.

4. **An achievement card overflowed a 360px viewport by 4px** (MARZI-015,
   caught within the package) because its name and state were flex siblings
   rather than one shrinkable text column.

## Open — needs a product decision, not implemented

**The top bar has zero slack left at 360px.** With a *three-digit* streak
(about a year of daily practice) alongside a four-digit coin balance the row
still overflows: measured `scrollX = 9` at 360px and `scrollX = 3` at 390px
with a 400-day streak. Further tightening does not make this robust — at some
value something must give, and choosing what is a product/branding call:

- compact the streak the way `compactNum` compacts coins (loses the exact day
  count, which is the point of a streak), **or**
- hide the "Marzi" wordmark below ~380px (governed by ADR-10), **or**
- move one chip (most likely minutes) out of the top bar on small phones.

Every other measured case is clean.

## Verification method

Every package was verified the same way: `node --check server.js`, the full
suite, then Chromium (`/opt/pw-browsers/chromium`) at **390×844 and 360×640**
with `/api/*` stubbed and seeded `localStorage`. Claims about layout come from
measured bounding boxes, computed styles and **real `mouse.wheel` gestures** —
never from `scrollWidth` alone, which produced two false positives earlier in
this work. RTL was checked in `ar` for every screen that changed.

## Not done, by instruction

Not merged to `main`. Not deployed. No pull request opened.
