# Launching a new target language (sister app)

## Status

| Target | Status | Notes |
| --- | --- | --- |
| DE (Deutsch) | **live** | default experience; full scenario pack, DTZ module. Prompts must stay byte-identical (suite-guarded). |
| EN (English) | **pilot** | feature-flagged via `S.targetLang` (set in the onboarding language-pair picker); 10 scenarios (8 phone + 2 face), 3 basics decks, `exam:"IELTS"` field. No exam module yet. |
| FR / ES / IT / PT / NL | planned | shown as "coming soon" chips in onboarding; a tap stores the wish in `localStorage` (`telefontrainer.wish`). |

Two independent axes — do not mix them up:

- **Target language** = the language being TAUGHT. Driven by the `TARGETS`
  registry at the top of the script in `public/index.html` (`code`, `locale`,
  `name`, `nativeName`, `exam`, plus per-target charset, seed message, prompt
  snippets and content refs `scenarios`/`groups`/`decks`). `const TARGET =
  TARGETS[S.targetLang || "de"]` resolves ONCE at load from the persisted
  settings; switching targets saves and reloads. All logic — speech
  recognition locale, device-TTS locale, voice picking, every AI prompt —
  reads from `TARGET`. `test/run.js` asserts this stays true for both
  registry entries.
- **Help languages** = the 6 UI/correction languages (es, en, it, tr, ar, uk)
  in the `T` object. A French sister app keeps the same 6 help languages
  unless the market says otherwise. Changing one axis never touches the other.

## Checklist per new target (e.g. French)

1. **New `TARGETS` entry** — a registry entry keyed by the language code, e.g.
   `fr: { code:"fr", locale:"fr-FR", name:"French", nativeName:"Français",
   exam:"DELF", charset:…, seed:…, fixEx:…, scenarios:…, groups:…, decks:… }`.
   German's entry must stay byte-identical (suite-guarded). Review prompt
   phrases that interpolate `${TARGET.name}` as a nationality ("a kind
   German") for grammar.
2. **Scenario pack translated** — every `SCENARIOS` entry: `de:` title (the
   target-language field name is historical), `who`, `place`, `role`, plus
   culturally correct businesses (Bürgeramt → mairie/préfecture). Also the
   in-target seed message `[Das Telefon klingelt. Nimm ab.]`, the correction
   example inside the role-play prompt ("Man sagt übrigens…"), the A0 guide's
   example options ('Montag oder Dienstag?'), and `normDe`'s character class
   (currently `a-zäöüß`) for the target's alphabet (é, ç, ñ, ij…).
3. **Basics decks** — the 3 `BASIC_DECKS` (12 items each) rebuilt natively for
   the target, not word-for-word translated; keep all 6 help translations.
4. **Voices & personas in `server.js`** — `AVATARS` portrait descriptions say
   "a German medical practice receptionist" etc.: rewrite per target so
   portraits look local. Re-check the per-scenario `voice`/`voice2` OpenAI
   voice choices against the target accent, and keep voice/portrait genders
   matched (tested).
5. **TTS pace instructions in `server.js`** — `ttsRequestBody`'s
   `instructions` and `PACE` strings say "native German speaker": swap the
   nationality and re-tune slow/fast phrasing per language (Romance languages
   tolerate faster "slow" speech than German).
6. **Exam module** — replace the DTZ scenarios + "DTZ exam (B1)" deck with the
   local equivalent: FR **DELF/TCF** (and TEF for Canada), ES **DELE/SIELE**,
   EN **IELTS / Cambridge B1 Preliminary**, IT **CILS/CELI (cittadinanza B1)**,
   PT **CELPE-Bras / CIPLE**, NL **inburgeringsexamen / NT2**. Same 3-part
   speaking-exam structure, examiner personas renamed.
7. **Store listing per country** — new app id/name (Telefontrainer is
   German-specific), icons, screenshots in the target, localized store copy
   per help language, `manifest.webmanifest` + PWA metadata, and a separate
   deploy per store listing. Note that a deployment is not locked to one
   target: the onboarding language-pair picker writes `S.targetLang`, and
   because `TARGET` resolves once at load, switching saves the setting and
   reloads. A per-country listing is a store/marketing decision, not a
   technical limit.

## Recommended rollout order

1. **EN** — by far the largest learner market; crowded, but few speaking-first
   phone-call apps; every help language applies.
2. **ES** — second-largest market, strong US demand, low direct competition
   in role-play calling.
3. **FR** — big market (DELF/TCF/TEF demand, Canada immigration), moderate
   competition.
4. **NL** — small market but the inburgering exam creates captive demand and
   almost no competition (mirrors the DTZ story that works today).
5. **IT** — mid-size, citizenship B1 exam niche.
6. **PT** — smallest of the six in learner volume; do last unless Brazil
   focus emerges.

## Deferred: layered-SVG dialogue characters (pose/mouth system)

The family's "Dialogue Characters Add-on" (2026-07, ChatGPT-produced React
concept) proposed per-character layered SVG assets — body poses, facial
expressions and mouth-closed/mouth-speaking overlays animated while audio
plays (see its `DIALOGUE_CHARACTER_ART_SPEC.md`). **Deferred**: the SVG
assets do not exist yet, and mouth animation was rejected by the family
(ADR-6 "cartoon world, no fake mouths"). The guided-dialogue mode
(`DIALOGUES` in `public/index.html`, entry card "Guided dialogue") instead
ships with the existing AI cartoon portrait pipeline (`/api/avatar/<id>` +
speaking glow). Revisit only with family-approved layered art and sign-off
on mouth animation.
