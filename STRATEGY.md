# Telefontrainer — Product & Go-to-Market Strategy

*Working document. Owner: Franco. Last updated: 2026-07-27.*

## 1. What we have and why it can win

A voice-first German phone-call trainer: realistic bureaucratic/everyday scenarios
(doctor, Bürgeramt, landlord, bank…), hands-free conversation, per-line corrections,
adaptive practice that targets the learner's recurring mistakes, mistake history with
Anki export, streaks, CEFR levels A1–B2, installable PWA.

**Positioning:** not "chat with an AI tutor" (crowded: Talkpal, Praktika, Langua,
Gliglish, Speak, Duolingo roleplay). The wedge is **"survive real German phone
calls"** — the single scariest task for immigrants and expats in DACH countries.
Phone calls are the moment German learners actually panic: Termin beim Amt,
calling the landlord, the Kita, the doctor. No major app owns this niche.

**Target user:** adult immigrants/expats in Germany, Austria, Switzerland (millions,
constantly renewed), plus B1/B2 exam takers (telc/Goethe have phone-like speaking
parts). They already pay for language apps and have concrete, urgent pain.

**Differentiators to defend:**
1. Phone-call realism (audio-only pressure, real bureaucracy vocabulary)
2. Adaptive correction loop (the app remembers your weaknesses)
3. Post-call debrief: goal achieved + corrections + tips (like a coach)
4. Cheap to run → aggressive pricing or generous free tier

## 2. Business model

**Recommended: freemium subscription.**

- **Free:** 1 call per day, A1–A2, 3 scenarios. Enough to hook, not enough to prepare
  for your real Amt call tomorrow.
- **Pro (~€5.99/month or €39.99/year):** unlimited calls, all scenarios & levels,
  evaluation reports, Anki export, (later) premium neural voices.

**Unit economics:** one call ≈ 6–10 model turns ≈ €0.02–0.05 API cost. A heavy user
doing 5 calls/day ≈ €5/month worst case; the median subscriber will cost well under
€2/month. Healthy margin at €5.99, and costs drop with cheaper models (Haiku-class
for A1/A2 is fine and ~5x cheaper).

**Not recommended:** ads (kills the immersion), pay-per-call (friction), lifetime
deals (API costs are ongoing).

## 3. What must change technically before charging money

Current architecture = one API key, one shared PIN. Fine for friends; not for
customers. The productization checklist, in order:

1. **User accounts** (email magic-link or Google/Apple sign-in — Supabase or
   Firebase Auth gets this in a weekend).
2. **Server-side metering**: count calls per user per day; enforce free-tier limits;
   the API key stays on the server (as today).
3. **Payments**: Stripe for the web app. For store builds, Google Play Billing /
   Apple IAP are mandatory for digital subscriptions (stores take 15% up to $1M/yr
   via the small-business programs).
4. **Abuse controls**: rate limits per user/IP, max tokens per day, model routing
   (cheap model for low tiers).
5. **Legal minimum (Germany!):** Impressum, Datenschutzerklärung (GDPR), AGB,
   privacy policy URL for the stores. Process no more personal data than needed;
   corrections history can stay client-side (nice selling point: "your data stays
   on your device").
6. **Telemetry**: anonymous product analytics (Plausible/PostHog) + your own
   API-cost dashboard per user.

## 4. Path to the stores

**Phase A — now (free, no stores): PWA.**
Already done: installable, HTTPS, icon. Shareable link is the fastest distribution
that exists. Use it for the first 20–100 users and feedback.

**Phase B — Google Play (weeks, low risk).**
Package the PWA as a **TWA (Trusted Web Activity)** with Bubblewrap or PWABuilder:
the Play app is a thin wrapper around the hosted site.
- One-time $25 developer account.
- Needs: privacy policy URL, data-safety form, content rating, store listing
  (screenshots, feature graphic), Digital Asset Links file on the domain.
- Web Speech API works in the TWA because it runs on Chrome.
- Reviews are lenient with TWAs. Realistic effort: a focused week including listing
  assets.

**Phase C — Apple App Store (harder, do after traction).**
iOS Safari/WebKit has no usable Web Speech *recognition*, and Apple rejects thin
website wrappers (guideline 4.2). The honest path:
- **Capacitor** shell + native plugins: `@capacitor-community/speech-recognition`
  (SFSpeechRecognizer) and native TTS (AVSpeechSynthesizer has excellent German
  voices). The web UI stays; only the speech layer becomes native.
- Apple developer account $99/year; StoreKit for subscriptions.
- Budget several weeks incl. review iterations. Do it when Play/PWA numbers prove
  demand.

**Phase D — quality moat (parallel, when revenue starts):**
Neural voices via API (OpenAI TTS / ElevenLabs / Azure): dramatically more human
than device TTS, multiple personas per scenario (~€0.01–0.03 extra per call — a Pro
feature). Also: German dialect/accent options (Austrian! Swiss!), noise simulation
("bad line" mode), exam-prep packs (telc B1 speaking).

## 5. Marketing (zero → first 1,000 users)

- **Community-first:** r/German, r/germany expat threads, Facebook expat groups,
  Ausländerbehörde-adjacent Discord/Telegram groups. The pitch writes itself:
  *"I built an app to practise the phone call you're scared of making."* Show a
  30-second screen recording of a Bürgeramt call.
- **Content loop:** short TikToks/Reels of the AI receptionist saying very German
  things; "can you survive this call?" challenges.
- **Integration honeypot:** the Anki export earns goodwill in the (huge) Anki
  language-learning community.
- **ASO basics:** name like "Telefontrainer: German phone call practice"; keywords
  around "German speaking practice", "Termin", "B1 Sprechen". Localize the listing
  in EN, ES, TR, AR, UK/RU (the actual immigrant languages in DACH).
- **Pricing psychology:** position against tutor lessons (€25/h), not other apps —
  "a month of unlimited phone practice for the price of 15 minutes with a tutor."

## 6. Phased roadmap

| Phase | Goal | Definition of done |
|---|---|---|
| 0. Polish (now) | App feels commercial | Speed control, streaks, settings persistence, SW ✅ |
| 1. Closed beta | 10–30 real users via link+PIN | Feedback loop, fix top 5 complaints |
| 2. Accounts + limits | Multi-user safe | Auth, per-user metering, free tier enforced |
| 3. Play launch | Public, free with Pro waitlist | TWA live, legal pages, analytics |
| 4. Monetize | First € | Stripe/Play Billing, Pro tier on |
| 5. iOS + voices | Premium quality | Capacitor build, neural voices for Pro |

**KPIs to watch from day one:** calls per user per week (activation), day-7
retention, % of calls where goal achieved (learning outcome!), API cost per user,
free→paid conversion.

## 7. Honest risks

- **Platform TTS/STT quality varies** by device — the native/neural-voice upgrade
  (Phase C/D) is the fix and is also the paywall-worthy feature.
- **Big apps could copy the niche** — speed and community focus are the defense;
  own "German phone calls" before anyone notices it's a category.
- **API price/policy changes** — multi-model abstraction is already trivial
  (`TRAINER_MODEL` env var); keep it that way.
- **Store review friction on iOS** — planned last, after demand is proven.
