# Marzi — documentation index

Canonical documents for the app. Read in this order when picking up the work.

## Decisions and architecture
- **[DECISIONS.md](DECISIONS.md)** — architecture decision records (ADR-1…11).
  Start here: they explain why the app is a single dependency-free file, why
  external blueprints were grafted rather than migrated, and how assets are
  governed.
- **[IMPLEMENTATION_REPORT.md](IMPLEMENTATION_REPORT.md)** — one section per
  delivered package (MARZI-001 … MARZI-012), with what changed, what was
  verified and what is still open.

## Design
- **[design/concept-boards/README.md](design/concept-boards/README.md)** —
  the family-approved boards. **Visual source of truth**: when a board and any
  document disagree, the board wins.
- **[DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)** — tokens and the canonical `UI.*`
  component library. Every screen composes these; the suite enforces it.
- **[design/MARZI_ASSET_SPEC.md](design/MARZI_ASSET_SPEC.md)** — the full
  production asset package required to replace the placeholder artwork.
- **[design/MARZI_ASSET_DELIVERY_CHECKLIST.md](design/MARZI_ASSET_DELIVERY_CHECKLIST.md)** —
  one-page brief to hand an illustrator (P0 files, acceptance and rejection).

## Process
- **[automation/MARZI_QUEUE.md](automation/MARZI_QUEUE.md)** — the sequential
  package queue and its rules; `automation/queue-state.json` holds the state.
- **[automation/PRODUCT_AUTOMATION_002.md](automation/PRODUCT_AUTOMATION_002.md)** —
  the MARZI-013…016 product queue and its approved decisions;
  `automation/product-queue-state.json` holds the state.
- **[automation/CONSOLIDATED_REPORT_002.md](automation/CONSOLIDATED_REPORT_002.md)** —
  the review report for that queue: what shipped, what is open, how it was
  verified.
- **[EXPANSION.md](EXPANSION.md)** — multi-language groundwork (TARGETS).

## Gates
`node --check server.js` and `node test/run.js` must both pass. CI runs them on
every branch. The suite additionally enforces: i18n parity across all six help
languages, byte-identical German prompts, design-token purity (no raw colours,
timings, type or icon sizes), component and accessibility contracts, and the
release gates in this index.
