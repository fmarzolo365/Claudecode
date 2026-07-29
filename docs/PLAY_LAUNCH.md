# Google Play Launch Guide — Telefontrainer

The complete, ordered path from today to "live on Google Play". Steps marked
**[YOU]** need a human with a credit card or a phone; steps marked **[DONE]**
are already built into the repo.

---

## 0. What this costs

| Item | Cost | When |
| --- | --- | --- |
| Google Play developer account | **$25 USD (≈ €23), once, forever** | At signup, by credit/debit card |
| Everything else in this guide | €0 | — |

There are no yearly fees (that's Apple). Google takes a revenue share only
when you sell something — which the app doesn't yet.

---

## 1. [YOU] Create the developer account (~20 min + verification wait)

1. Go to **https://play.google.com/console/signup** and sign in with the
   Google account you want to own the app (this matters — transfers are
   possible but tedious).
2. Choose **"Yourself"** (individual account) — no company needed for a free
   app.
3. Pay the **$25** registration fee with any credit/debit card. This is the
   only payment in the whole process.
4. **Identity verification**: Google asks for an official ID (Personalausweis
   or passport) and verifies your address. This can take **1–3 days** — start
   it today, do the rest while you wait.
5. Declare your **DSA status as "non-trader"** (truthful: the app is free,
   you sell nothing). When you later add subscriptions, switch to trader.

## 2. [YOU] Before packaging: production hygiene (~10 min)

- Fill the yellow placeholders in `public/impressum.html` and
  `public/datenschutz.html` (name, address, email) — required before a public
  listing. Tell Claude the values or edit on GitHub directly.
- In Render, confirm env vars are set: `ANTHROPIC_API_KEY`, `TTS_API_KEY`,
  `TRAINER_PIN` (decide: keep the PIN for launch = closed beta feel, or
  remove it for open access — the daily caps protect your credits either way).

## 3. [YOU] Package the app with PWABuilder (~15 min)

The app is a PWA; PWABuilder wraps it into an Android package (a "TWA") in
the browser — no coding:

1. Go to **https://www.pwabuilder.com**, enter
   `https://telefontrainer.onrender.com`, let it scan.
2. Click **Package for Stores → Android**.
3. Settings that matter:
   - **Package ID**: e.g. `de.marzolo.telefontrainer` — ⚠️ **permanent, can
     never change**. Use a domain-style id you're happy with forever.
   - **App name**: `Telefontrainer` · **Launcher name**: `Telefontrainer`
   - **Signing key**: choose **"Create new"** and let PWABuilder generate it.
     **Download and keep the whole zip** — it contains your signing key
     (`signing.keystore` + passwords). Store it like a password; losing it is
     survivable (Play App Signing) but annoying.
4. Download the package: you get an **`.aab`** file (the thing you upload)
   plus signing info.

## 4. [YOU] Create the app in Play Console (~30 min)

1. Play Console → **Create app**: name `Telefontrainer`, default language
   **German (Germany)**, type **App**, **Free**.
2. Complete the **Dashboard checklist** (each item ~2 min; exact answers in
   §6 and §7 below).
3. **Testing first (recommended)**: Release → **Internal testing** → create
   release → upload the `.aab` → add your own email as tester → publish
   internally. You'll get the app on your phone within minutes and can check
   everything before the public sees it. (Note: for **personal accounts
   created after Nov 2023**, Google requires a closed test with 12+ testers
   for 14 days before production — plan the beta group for this; your future
   beta users are exactly these testers.)
4. **Production**: same upload, submit for review. First review typically
   takes 1–7 days.

## 5. [DONE] Link the app to the website (assetlinks) — 5 min when ready

After the first upload, Play Console → **App integrity → App signing** shows
a **SHA-256 certificate fingerprint**. Copy it, then in Render add:

```
TWA_PACKAGE_NAME     = de.marzolo.telefontrainer   (your package id)
TWA_SHA256_FINGERPRINT = AA:BB:CC:...              (the fingerprint)
```

Save → the server then answers at
`https://telefontrainer.onrender.com/.well-known/assetlinks.json`, which
removes the browser bar from the Android app. Verify the URL returns JSON
after the deploy.

## 6. Store listing — copy-paste texts

**App name (30 chars max):**
```
Telefontrainer: Deutsch üben
```

**Short description (80 chars max):**
```
Sprich echtes Deutsch: Anrufe, Gespräche & DTZ-Training mit KI-Charakteren.
```

**Full description (4000 chars max):**
```
Du verstehst Deutsch – aber wenn das Telefon klingelt, wird dir heiß?
Telefontrainer ist die App für den Moment, vor dem alle Deutschlerner Angst
haben: echte Gespräche mit echten Menschen.

📞 ECHTE SITUATIONEN, ECHTE GESPRÄCHE
Übe die Anrufe, die dein Leben in Deutschland wirklich verlangt: Termin beim
Hausarzt, Bürgeramt, Bank, Vermieter, Paketdienst, Kita – und Gespräche von
Angesicht zu Angesicht: mit dem Nachbarn im Treppenhaus, beim Bäcker, im
Supermarkt, mit Kollegen. Jeder Charakter hat ein Gesicht und eine eigene,
natürliche Stimme. Manchmal wirst du sogar weiterverbunden – wie im echten
Leben.

🎓 DTZ-PRÜFUNGSTRAINING
Alle drei Teile des mündlichen DTZ (Deutsch-Test für Zuwanderer) mit einer
realistischen Prüferin: sich vorstellen, über ein Thema sprechen, gemeinsam
planen.

💬 KORREKTUREN WIE VON NETTEN MUTTERSPRACHLERN
Die Charaktere verstehen dich, korrigieren freundlich mitten im Gespräch
("Man sagt übrigens: …") und nach jedem Gespräch bekommst du eine
Auswertung: Was war gut, was kannst du verbessern, welche Wörter haben dir
gefehlt – mit einem Tipp zum Speichern.

🗣️ SPRECHEN STEHT IMMER IM MITTELPUNKT
– Level A0 bis C1: von allerersten Wörtern bis zu schnellen, idiomatischen
  Gesprächen
– Vorbereitung vor jedem Anruf: erst die kleinen Wörter, dann Sätze, dann
  das Gespräch
– Notfall-Sätze mit einem Tipp: "Wie bitte?", "Langsamer, bitte"
– Aussprache-Training mit Mikrofon-Feedback
– Vokabeln pro Situation, Fragewörter, Überlebenssätze am Telefon
– Tippe im Gespräch auf jedes unbekannte Wort und speichere es

📈 DEIN FORTSCHRITT, SICHTBAR
Wöchentlicher Sprechtest mit Punktzahl und Niveau-Einschätzung – und einer
Kurve, die zeigt, wo du angefangen hast, wo du stehst und wohin du kommst,
wenn du dranbleibst. Dazu: Serien, XP und eine tägliche 3-Schritte-Routine.

🌍 KORREKTUREN IN DEINER SPRACHE
Español · English · Italiano · Türkçe · العربية · Українська

🔒 PRIVAT
Keine Konten, keine Werbung, kein Tracking. Deine Lerndaten bleiben auf
deinem Gerät.

Telefontrainer wurde von einem Deutschlerner gebaut, der genau diese Angst
kannte. Der beste Moment, sie loszuwerden, ist ein Gespräch, das nicht
zählt – und davon gibt dir Telefontrainer so viele, wie du willst.
```

**Category:** Education · **Tags:** Language learning
**Contact email:** your email (public on the listing as a trader; for
non-trader only reachable via Play).

## 7. Questionnaires — recommended answers

**Data safety** (Play Console → App content → Data safety):
- Does your app collect or share user data? → **Yes** (be honest: speech
  goes to processors)
- Data types: **Audio → Voice or sound recordings**: collected, **processed
  ephemerally**, required for app functionality, **not shared for
  advertising**, encrypted in transit, users can request deletion (nothing is
  stored server-side; learning data is on-device only).
- No account creation, no location, no ads, no tracking SDKs.

**Content rating (IARC):** educational reference app; no violence, no user
content visible to others, no gambling → typically **PEGI 3 / Everyone**.
Answer "no" to everything except "does the app allow users to interact?" —
the AI chat is not user-to-user interaction, so still **no**.

**Ads:** No. **Target audience:** 18+ (simplest; avoids child-directed
requirements). **News app:** No. **COVID app:** No. **Government app:** No.

## 8. Graphics you need [YOU, ~30 min]

| Asset | Size | Source |
| --- | --- | --- |
| App icon | 512×512 PNG | `public/icons/icon-512.png` — done ✔ |
| Feature graphic | 1024×500 | Ask Claude — will generate |
| Phone screenshots | 2–8, ≥ 320px | Take on your phone: home, video call with Herr Schmidt, corrections, progress chart, DTZ menu |

Screenshot tips: German UI moments look best; show the video-call screen
with a character portrait — it's the app's most distinctive visual.

## 9. Launch-day order

1. Account verified → 2. Impressum/Datenschutz filled → 3. `.aab` built →
4. App created + questionnaires → 5. Internal test on your phone →
6. assetlinks env vars set → 7. Closed test with the beta group (12+
testers · 14 days if the account is new) → 8. **Production release** →
9. Announce in one expat/learner group → 10. Watch the reviews roll in.
