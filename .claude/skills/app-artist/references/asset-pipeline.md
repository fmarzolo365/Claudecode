# Where MARZI art comes from and where it goes

Everything integrates by FILENAME through registries that ship empty and
fall back to shipped art — no call-site edits, ever.

## Rendered character portraits (runtime pipeline)

- `server.js` → `/api/avatar/<id>` generates a portrait per scenario contact
  with OpenAI images, using per-character persona prompts defined in
  `server.js` (each scenario id, plus `<id>2` for the mid-call handover
  persona). Results are disk-cached (`.avatar-cache/`).
- To raise portrait quality: refine the persona prompts in `server.js` with
  the master style prompt (style-guide §4). The cache means regenerating
  requires clearing the cached file for that id.
- Approved static renders can instead be committed and served from
  `public/assets/` — if you do that, keep `/api/avatar` as fallback and bump
  the service-worker `CACHE` constant in `public/sw.js` (static assets
  changed). Never commit API keys, never commit the cache directory.

## Marzi stage/state art (MARZI-013)

- Path: `/assets/marzi/svg/marzi_<stage-slug>_<pose>_<state>.svg`
  (`marziAssetPath` in `public/index.html`), 8 states × 6 stages.
- Registry `MARZI_ASSETS` ships empty → fallback is `marziSVG` (parametric
  flat vector). Register real files via the registration helpers; the single
  entry point `marziArt(stage, state)` picks them up everywhere.

## Call poses (MARZI-018)

- 21 files: stages 4–6 × ready/listening/thinking/speaking/encouraging/
  limit/offline at `/assets/marzi/call/stage-<n>-<pose>.svg`
  (`marziCallAssetPath`, registry `MARZI_CALL_ASSETS`).
- `sad` resolves to `offline` art when offline, `limit` otherwise — always
  deliver both poses.

## Outfits (spec P3) and outfit-on-Marzi

- Store catalog: 9 slugs — explorer, sporty, rainbow, classic, university,
  artistic, professional, adventurer, graduate. Today rendered by
  `OUTFIT_GLYPHS`/`OUTFIT_ART` (distinct inline-SVG garments, declared
  stand-ins). Approved renders replace them per slug.
- The Learn hero carries `data-worn="<outfit-id>"` on the `#marzi` art span —
  the hook for per-stage outfit layers (SVG, 120×120, aligned to stage art).

## Brand

- Mark slot: `/assets/marzi/stage-6/header-neutral.svg`
  (`BRAND_MARK_ASSET`, `__registerBrandMark`). Wordmark is code
  (`UI.brandLockup`): "Marzï" with a sprout over the i — language-neutral,
  no flag. A production SVG may replace it 1:1.

## The open-slot ledger

`docs/design/WORLD_CLASS_ASSET_MANIFEST.md` lists every slot and its current
stand-in. Update it whenever an asset ships or a new slot appears.

## Verification (required after any integration)

1. `node test/run.js` — must stay green (registries, i18n, pins).
2. Screenshot the touched screens against a local server:
   `ANTHROPIC_API_KEY=dummy PORT=5173 node server.js`, Chromium at
   `/opt/pw-browsers/chromium`, playwright at
   `/opt/node22/lib/node_modules/playwright`; stub `/api/*` routes. A
   reusable harness pattern lives in the repo history (`screens.js`:
   groups tabs/call/post/store; args outdir, groups, lang, WxH).
3. Look at the screenshots yourself before declaring the art integrated;
   compare against the matching concept-board panel.
4. For UI-affecting changes also run the browser suite group that covers the
   screen (`node test/browser/run.js <group>`).
