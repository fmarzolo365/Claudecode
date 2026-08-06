# Call asset inventory — status ledger

Honest per-asset status for the call experience. Categories follow the
call art direction skill: PRODUCTION READY · USABLE BUT NEEDS IMPROVEMENT ·
TEMPORARY · MISSING · STYLE-INCONSISTENT.

All "generated vector v1" entries below are original, code-generated
layered SVG illustrations (tools/call-art) matching the reference-board
language. They are shipped as the app's first production art generation:
**USABLE, first production generation** — approved to render in the app,
still below the reference board's fully hand-finished bar; each slot
remains open for a hand-finished replacement that drops in by filename
with no code change.

## Contact character scenes (5 states each: idle/listening/speaking/thinking/success)

| Contact | Persona (matches server.js) | Status |
|---|---|---|
| arzt | doctor/receptionist, woman 30s, coat + stethoscope | USABLE v1 |
| amt | citizens'-office clerk, man 40s | USABLE v1 |
| werkstatt | mechanic, man 30s, cap + overalls | USABLE v1 |
| friseur | stylist, woman 20s, auburn bob | USABLE v1 |
| restaurant | waiter, man 30s, vest + bowtie | USABLE v1 |
| apotheke | pharmacist, woman 40s, bun + glasses + coat | USABLE v1 |
| paket | call-center agent, young man, headset | USABLE v1 |
| vermieter | property manager, man 50s, grey + beard | USABLE v1 |
| bank | bank employee, man 30s, suit + tie | USABLE v1 |
| kita | kindergarten teacher, woman 30s, cardigan | USABLE v1 |
| every `<id>2` handover persona | — | **MISSING** (generated `/api/avatar/<id>2` portrait remains the TEMPORARY stand-in) |
| custom / random scenario contacts | — | TEMPORARY (generated portrait / emoji) |

## Scenario backgrounds

clinic · workshop · pharmacy · office · school · restaurant · reception ·
public-office · utility · retail — all USABLE v1.

## Marzi call art

| Asset | Status |
|---|---|
| 10 brief poses (`/assets/marzi/call/<pose>.svg`) | USABLE v1 |
| 24 stage-aware registry files (`stage-4..6-<pose>.svg`, incl. `error`) | USABLE v1, registered at boot |
| Outfit call variants: base, university, explorer, graduate | USABLE v1 (not yet worn in-call; resolver shipped) |
| Outfit call variants: sporty, rainbow, classic, artistic, professional, adventurer | **MISSING** |
| Stage 1–3 call art | Not in scope by design (MARZI-018: flat `marziArt` fallback) |

## Still open (unchanged from MARZI_CALL_ASSET_SPEC)

- Hand-finished soft-3D renders at the 02_call.png bar, per character and
  per state, with recorded safe-zone metadata — the generated vector v1
  scenes occupy those slots until then.
- Share-card templates, store-listing imagery (see
  WORLD_CLASS_ASSET_MANIFEST.md).
- RTL pose mirroring: Marzi's pointing poses point away from the suggestion
  bubble in Arabic RTL (visual-director LOW) — mirrored variants or a CSS
  flip in a future pass.

Update this ledger with every asset change; the suite enforces that
whatever is REGISTERED also exists on disk, but only this file records
finality honestly.
