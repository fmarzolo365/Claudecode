# Launching a new target language (sister app)

Two independent axes — do not mix them up:

- **Target language** = the language being TAUGHT (today: German). Driven by
  the single `TARGET` object at the top of the script in `public/index.html`
  (`code`, `locale`, `name`, `nativeName`, `exam`). All logic — speech
  recognition locale, device-TTS locale, voice picking, every AI prompt —
  reads from it. `test/run.js` asserts this stays true.
- **Help languages** = the 6 UI/correction languages (es, en, it, tr, ar, uk)
  in the `T` object. A French sister app keeps the same 6 help languages
  unless the market says otherwise. Changing one axis never touches the other.

## Checklist per new target (e.g. French)

1. **`TARGET` object** — e.g. `{ code:"fr", locale:"fr-FR", name:"French",
   nativeName:"Français", exam:"DELF" }`. Review prompt phrases that
   interpolate `${TARGET.name}` as a nationality ("a kind German") for grammar.
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
   deploy (one target per deployment; there is no runtime language switch).

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
