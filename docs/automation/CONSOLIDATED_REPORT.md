# Consolidated report for Codex — MARZI-009 … MARZI-012

**Branch:** `claude/german-phone-app-setup-bx0cr1` · **not merged, not deployed**
**Queue commit:** `a3d7ba5` · **Range under review:** `12b81ae..9ffe9cd`
**Suite:** 26 → **30 checks, all green** · `node --check server.js` clean

| # | Package | Commit | Suite |
|---|---|---|---|
| — | Queue + specifications | `a3d7ba5` | 26/26 |
| 1 | MARZI-009 · Plan-limit experience | `b224001` | 27/27 |
| 2 | MARZI-010 · RTL + accessibility sweep | `f4630ec` | 28/28 |
| 3 | MARZI-011 · Offline + storage resilience | `ec2b915` | 29/29 |
| 4 | MARZI-012 · Quality gates + consolidation | `9ffe9cd` | 30/30 |

Rules honoured: one package at a time, one commit each, full suite after every
package, never merged, never deployed. Queue state persisted in
`docs/automation/queue-state.json` (all four `done`).

## Package selection
The four packages were derived from the documented board-reconciliation
deviations and known-debt lists, restricted to items that need **no new
artwork** and touch **none** of the standing exclusions (Premium, internet/MB
economy, new backend, new characters, production art, logo, XP/coin rates, the
six thresholds, providers, prompts).

## What each package changed

**MARZI-009 — plan-limit experience (deviation H6).**
Full-screen dark limit modal per board `02_call.png` panel 2: Marzi in the
`sad` mood, localized message, reset countdown, and a plan meter reading
used/limit minutes from the **existing** plan math. `PLAN_SECONDS`,
`COIN_PACKS`, prices and `buyPack` asserted unchanged. Dialog semantics, focus
management, `aria-live`, dismissal by button/backdrop/Escape, background
scroll locked, zero controls under 48px.

**MARZI-010 — RTL and accessibility.**
Arabic shipped as a help language from day one but the document never changed
direction. `applyLangDirection()` now sets `lang`/`dir` at boot and on every
change, and mirrored components use logical properties, so one stylesheet
serves both directions. An automated sweep over seven screens found zero
unlabelled controls and seven kinds of undersized target; after fixes **every
screen reports zero**. Compact chrome keeps its board size via a 48px
`::after` hit area; segmented controls, routine chips and legal links were
raised directly.

**MARZI-011 — offline and storage resilience.**
The app never consulted `navigator.onLine`. Added a sticky offline banner,
refusal to start a call while offline with the reason surfaced, offline vs
server-error differentiation inside a call (both existing alerts kept), and
non-silent storage failures. Service-worker policy unchanged and asserted.

**MARZI-012 — quality gates.**
CI ran only on `main` and PRs, so **nothing pushed to this branch was ever
gated**; it now runs both commands on every branch. A release-gates check
fails on debug leftovers, an unversioned or API-caching service worker, a CI
workflow missing a gate, a missing/unindexed canonical document, or any
runtime dependency — ADR-3 is now enforced, not just documented.
`docs/README.md` indexes everything in reading order.

## Defects found and fixed during verification
1. **`goCall` wrote to a hidden element** — the offline refusal used
   `alertMsg`, which targets `#alert` *inside* the call screen and would have
   been invisible on the Talk tab. Routed through the banner.
2. **Background scroll bled behind the full-screen limit overlay** — locked
   with `body.modal-lock`, verified with a real wheel gesture after a
   `scrollTo` probe proved misleading.
3. **Seven classes of sub-48px target** across shipped screens.
4. **CI never ran on the development branch.**

## Verification method
Every claim is measured, not asserted: Chromium at **390×844 and 360×640** for
each package, DOM geometry for touch targets and mirroring, real wheel input
for the scroll lock, `context.setOffline` for connectivity, and storage stubs
that throw for persistence failures.

## Unresolved — asset-blocked, unchanged by this queue
1. All Marzi artwork is still the **placeholder** SVG; `happy` and
   `celebrating` fall back to neutral (asset spec P0/P1).
2. Nine store outfits render a neutral silhouette (P3).
3. Yellow hoodie and backpack do not exist in the implementation.
4. Character portraits remain flat-cartoon, not the board's painterly style
   (deviation H5).
5. Logo/icon replacement (M5) and the Premium screen (M3) remain out of scope.

## Open questions for Codex
1. Coin economics: outfits cost 800–1200 while a call pays 20, so a first
   outfit is ~40 calls away. That is the board's pricing, implemented exactly —
   flagging it as a product decision, not a defect.
2. The fine type ramp (23 sizes) is tokenized but not consolidated;
   consolidation changes pixels and needs board sign-off.
3. 33 single-use `rgba()` overlays remain inline pending `color-mix()` support
   on the oldest Android WebView the TWA must serve.
