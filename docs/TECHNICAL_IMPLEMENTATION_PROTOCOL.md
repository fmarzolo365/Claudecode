# Technical Implementation Protocol

The technical problem to avoid is mixing business logic, visual layout and art fallbacks in one renderer.

V2 separates six layers:

1. routing/shell mechanics
2. action adapters
3. UI models
4. renderers/components
5. production-art resolver
6. tokens/CSS

The repository may stay single-file. These can be clearly labelled blocks inside `public/index.html`; a framework migration is forbidden.

Existing behavior remains authoritative. Do not clone business logic already implemented by functions such as `show`, `startPrep`, `startDialog`, `startVocab`, `startDrill`, `renderMistakes`, `openDrawer`, `openPlanScreen`, CALL_ART, call/session/history code.

A root-screen model adapter reads current app data and returns a small UI model. Renderers consume only the model + action map.

If a requested visual element requires functionality or an asset that is not real:
- omit/disable it cleanly
- report the missing slot
- never invent mock behavior
- never substitute emoji or cheap SVG for approved art
