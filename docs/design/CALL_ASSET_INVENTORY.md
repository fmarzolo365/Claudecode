# Call asset inventory — status ledger

Honest per-asset status for the call experience. Categories follow the
call art direction skill: PRODUCTION READY · USABLE BUT NEEDS IMPROVEMENT ·
TEMPORARY · MISSING · STYLE-INCONSISTENT.

**Product Owner directive (2026-08-06): every generated SVG below is
FALLBACK ONLY.** Final production artwork will be supplied externally as
transparent PNG/WebP assets (first delivery: the Doctor Gold Pack). The
generated vector art keeps rendering until each external asset lands and
is integrated; no further generated-art variants will be produced. The
resolver, registry, state mapping, fallback chain and tests from commit
5881a02 are frozen as the integration surface.

## Contact character scenes (5 states each: idle/listening/speaking/thinking/success)

| Contact | Persona (matches server.js) | Status |
|---|---|---|
| arzt | doctor/receptionist, woman 30s, coat + stethoscope | FALLBACK ONLY — awaiting Doctor Gold Pack |
| amt | citizens'-office clerk, man 40s | FALLBACK ONLY |
| werkstatt | mechanic, man 30s, cap + overalls | FALLBACK ONLY |
| friseur | stylist, woman 20s, auburn bob | FALLBACK ONLY |
| restaurant | waiter, man 30s, vest + bowtie | FALLBACK ONLY |
| apotheke | pharmacist, woman 40s, bun + glasses + coat | FALLBACK ONLY |
| paket | call-center agent, young man, headset | FALLBACK ONLY |
| vermieter | property manager, man 50s, grey + beard | FALLBACK ONLY |
| bank | bank employee, man 30s, suit + tie | FALLBACK ONLY |
| kita | kindergarten teacher, woman 30s, cardigan | FALLBACK ONLY |
| every `<id>2` handover persona | — | **MISSING** (generated `/api/avatar/<id>2` portrait remains the TEMPORARY stand-in) |
| custom / random scenario contacts | — | TEMPORARY (generated portrait / emoji) |

## Scenario backgrounds

clinic · workshop · pharmacy · office · school · restaurant · reception ·
public-office · utility · retail — all FALLBACK ONLY.

## Marzi call art

| Asset | Status |
|---|---|
| 10 brief poses (`/assets/marzi/call/<pose>.svg`) | FALLBACK ONLY |
| 24 stage-aware registry files (`stage-4..6-<pose>.svg`, incl. `error`) | FALLBACK ONLY, registered at boot |
| Outfit call variants: base, university, explorer, graduate | FALLBACK ONLY (not yet worn in-call; resolver shipped) |
| Outfit call variants: sporty, rainbow, classic, artistic, professional, adventurer | **MISSING** |
| Stage 1–3 call art | Not in scope by design (MARZI-018: flat `marziArt` fallback) |

## External production delivery (pending)

- Format: transparent PNG/WebP per MARZI_CALL_ASSET_SPEC §3 (runtime
  exports, safe-zone metadata per §4).
- First pack: **Doctor Gold Pack** — on arrival, integration only: drop
  files into the registered slots, extend the path resolution to the
  delivered extensions, register, bump the SW cache, screenshot-verify.
  No redesign, no new generated art.

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
