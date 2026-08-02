# Rendered-browser regression suite

Answers Codex finding **R2-TEST-01**: the Node suite runs against DOM stubs and
can stay green while rendered-layout and interaction defects are present. These
tests drive the real application in a real browser and measure rendered
geometry, focus and events.

## Run

    ANTHROPIC_API_KEY=dummy PORT=5173 node server.js &
    node test/browser/run.js            # everything
    node test/browser/run.js topbar     # one group

Requires `playwright-core` and a Chromium binary. Neither is a runtime
dependency of the app (ADR-3 is unaffected): the runner skips with a clear
message and a non-blocking exit code when they are unavailable, which is why it
is not wired into the Node suite or CI.

## Groups

| Group | Covers |
|---|---|
| `history` | native `window.history`, transcript history entry, Back order, call survival |
| `async` | latest-utterance retention across a real observed `processing` transition |
| `stages` | all six earned stages, rendered artwork geometry |
| `portrait` | success hides the fallback; failure announces it, once |
| `overlays` | dialog names, focus entry, Tab/Shift+Tab containment, background inert, Escape, focus restore |
| `targets` | every interactive target ≥48×48 including transcript controls and words |
| `layout` | horizontal overflow, background scrolling, duplicate ids, page errors |
| `safearea` | non-zero insets applied once per edge, no collision |
| `topbar` | balances × widths matrix, measured rightmost edge |

Each group runs at 360×640 and 390×844, in Spanish and Arabic, with normal and
reduced motion where the group is motion-sensitive.
