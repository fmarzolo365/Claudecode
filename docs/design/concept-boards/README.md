The files in this directory are the canonical visual source of truth for the Marzi application.

Whenever implementation differs from these concept boards, implementation must be adapted to the boards rather than redesigning the concept.

## Registered boards

| Board | Covers | Specification |
| --- | --- | --- |
| `01_home.png` | Home / Learn: Marzi hero, stage, XP, mission | — |
| `02_call.png` | Live call composition | — |
| `04_progress.png` | Progress and store panel | — |
| `05_call_limits_premium.jpg` | Call, daily limit, time and internet, buy internet, Premium, no-internet, "how it works" | [`05_call_limits_premium.md`](05_call_limits_premium.md) |

`03_store.png` does not exist yet.

A board is visual and product direction only. **No board is a source of
production raster assets** — nothing is cropped, extracted or upscaled from
one (ADR-10). Where a board contradicts a standing decision, the decision
wins and the board is recorded as carrying an erratum; board 05 carries two
(the mascot's spelling and the tab labels), both documented in its
specification.
