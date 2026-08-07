# Home State Specification

## New / empty learner
Show:
- greeting
- Marzi
- first meaningful recommendation
- lightweight journey start
Do not show empty dashboards.

## Returning learner
Show:
- recommendation
- current journey
- daily focus
- recent activity only when useful

## No recommendation
Fallback hierarchy:
1. Continue selected available scenario
2. Practice due mistakes
3. Talk discovery CTA
Never leave the primary area blank.

## Loading
Do not block the entire screen behind a spinner.
Render stable shell/skeleton geometry, then populate data.
Avoid layout shift above the fold.

## Error
Home should still allow navigation to Practice/Talk even if recommendation/progress fails.
Use a compact recoverable notice, not a fatal page.

## Offline
Local progress and existing local actions remain visible.
Network-dependent recommendations should degrade to locally available actions.
