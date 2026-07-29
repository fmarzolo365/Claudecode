# Telefontrainer

German phone-call practice. The other side speaks German out loud, you answer with your
voice, and you get a correction after every line.

No build step, no dependencies, two files (plus icons).

## Run

```bash
./start.sh
```

The first run asks for your Anthropic API key and stores it in `.env` (gitignored,
chmod 600) — after that it's a single command. `node server.js` still works too if you
prefer exporting the key yourself.

Then open **http://localhost:5173** in Chrome.

`localhost` counts as a secure origin, so Chrome asks for microphone permission normally.
Allow it once. This is the whole reason for running it locally.

## Run on an Android phone (Termux)

```bash
pkg update && pkg install nodejs-lts git
git clone https://github.com/fmarzolo365/Claudecode.git
cd Claudecode
./start.sh
```

Open http://localhost:5173 in Chrome on the same phone. Keep Termux running
(split screen works well; on aggressive battery managers like MIUI, set Termux to
"No restrictions" and tap "Acquire wakelock" in its notification).

### Install as an app

The page is a PWA: in Chrome open http://localhost:5173 → menu ⋮ → **Add to Home
screen**. You get a real app icon that opens the trainer full-screen. The server still
needs to be running in Termux — the icon is the door, Termux is the engine.

### Update to the latest version

```bash
cd Claudecode && git pull
```

Then restart the server (Ctrl+C, `./start.sh`) and reload the page.

## Host it online (free, no Termux needed)

The repo includes a `render.yaml` blueprint for [Render](https://render.com):

1. Sign up at render.com (log in with GitHub).
2. **New +** → **Blueprint** → select this repository.
3. Render reads `render.yaml` and asks for two values:
   - `ANTHROPIC_API_KEY` — your key
   - `TRAINER_PIN` — any PIN you choose (protects your credits from strangers)
4. Deploy. You get a URL like `https://telefontrainer.onrender.com`.
5. Open it on any phone → Chrome asks for the PIN on the first call → menu ⋮ →
   **Add to Home screen** for the app icon. Works anywhere, HTTPS, no Termux.

Notes: on the free plan the server sleeps after ~15 min idle — the first load after a
pause takes up to a minute, then it's fast. When `TRAINER_PIN` is unset (local use),
no PIN is asked.

## Credentials

The server reads them from the environment or from `./.env` and never sends them to the
browser:

| Variable | Purpose |
| --- | --- |
| `ANTHROPIC_AUTH_TOKEN` | Sent as `Authorization: Bearer`. Use this for a gateway or router. |
| `ANTHROPIC_API_KEY` | Sent as `x-api-key`. Use this for a direct Anthropic key. |
| `ANTHROPIC_BASE_URL` | Optional. Defaults to `https://api.anthropic.com`. |
| `TRAINER_MODEL` | Optional. Defaults to `claude-sonnet-4-6`. |
| `TRAINER_PIN` | Optional. When set, callers must enter this PIN (for public hosting). |
| `TTS_API_KEY` | Optional. An OpenAI API key — enables the natural neural voice. |
| `TTS_VOICE` | Optional. Neural voice name, default `coral` (try `nova`, `alloy`, `ash`). |
| `TTS_MODEL` | Optional. Defaults to `gpt-4o-mini-tts`. |
| `PORT` | Optional. Defaults to `5173`. |

### Natural voice (optional but recommended)

By default the app uses the phone's built-in German TTS, which sounds robotic.
Set `TTS_API_KEY` to an [OpenAI API key](https://platform.openai.com/api-keys)
(costs roughly $0.01 per call) and the receptionist gets a natural, human-sounding
voice — on Render: service → **Environment** → add `TTS_API_KEY` → Save. Locally:
add a `TTS_API_KEY=...` line to `.env`. No key = automatic fallback to the device
voice; nothing breaks.

Set exactly one of the first two. Current model IDs:
https://docs.claude.com/en/docs/about-claude/models

## Using it

- **Manos libres** is on by default: the microphone opens by itself once the other
  person stops talking, so the call runs without touching the screen.
- **Repetir despacio** replays the last line at 0.6 speed.
- **¿Qué puedo decir?** reveals one sentence you could use, only when you ask for it.
- Hang up to see every correction from the call — plus an **evaluation**: did you reach
  the goal, what went well, and up to three tips.
- The screen stays awake during a call (Wake Lock).

## Learning features

- **Mis errores** (on the start screen) collects every correction from every call,
  stored locally in the browser. Review them any time.
- **Exportar para Anki** downloads the collection as a tab-separated file: in Anki use
  File → Import (front = what you said, back = the correction).
- **Adaptive practice**: your most recent corrections are quietly fed back into the
  role-play, so the other person steers the conversation toward what you get wrong.
- **Goal variations**: every scenario has several possible goals, picked at random —
  the same situation never plays out twice.
- **Levels A1–C1**: B2 adds real complications; C1 speaks like a fast native with
  idioms and negotiation.
- **Corrections in 6 languages**: Español, English, Italiano, Türkçe, العربية, Українська.
- **Free mode**: a fully random surprise call, or describe your own situation in
  your words and the app builds the phone call around it.
- **Scenario groups**: calls organised by Health, Bureaucracy & money, Home &
  daily life, Leisure, and Free mode.
- **Streak, XP and ranks**: every call earns XP (bonus when you achieve the call's
  goal), with a 7-day activity strip and German rank titles from Neuling up to
  Telefonlegende.
- **Practicar mis errores**: a flashcard drill over your saved corrections — see
  your sentence, recall the right version, reveal it and hear it spoken. Cards you
  miss come back sooner (spaced-repetition-lite).
- **Vocabulario clave**: before a call, get the 12 words and phone phrases that
  matter for that exact scenario as speaking-first flashcards — tap to guess the
  meaning, hear each word and example sentence in the neural voice, and say it
  out loud while the mic checks your pronunciation. Decks are generated once per
  scenario/level/language and cached on the device. Three built-in decks work
  offline and for every situation: ❓ W-Fragen (question words), ☎️ Am Telefon
  (survival phrases like "Wie bitte?"), and 🕘 Zeit & Termine (times, days,
  rescheduling and cancelling).
- **Mis palabras**: during a call, tap any word the other person says that you
  don't know — the app saves its dictionary form, translation and the sentence
  it appeared in. Saved words become a personal ⭐ flashcard deck in the
  vocabulary chooser (with per-card delete).
- **Face-to-face conversations**: not everything is a phone call — talk to your
  neighbour in the stairwell, order at the bakery, ask in the supermarket,
  small-talk with a colleague, or check in at the doctor's front desk, with
  natural in-person openings instead of phone formulas.
- **SOS phrases**: one-tap rescue lines during any conversation ("Wie bitte?",
  "Langsamer, bitte", "Noch einmal, bitte") — the real-world repair strategies
  that take the fear out of not understanding.
- **Speak your corrections**: the mistake drill opens the microphone after
  revealing the right sentence, so you say it aloud and get instant feedback.
- **Daily routine**: a three-step checklist on the home card (vocabulary →
  conversation → mistakes) that ticks itself off as you practise each day.
- **DTZ exam practice**: the three parts of the Deutsch-Test für Zuwanderer
  speaking exam (introduce yourself, talk about a topic, plan together) with a
  realistic examiner character — the B1 exam every integration-course student
  faces.
- **Talking clips (optional)**: set `REPLICATE_API_TOKEN` (replicate.com, ~$5
  credit) and vocabulary/preparation cards gain a "watch it said" button - a
  lip-synced video of the character speaking the sentence, rendered once via an
  open-source model (~2-5 cents) and cached on disk. `CLIP_MODEL`,
  `CLIP_DAILY_LIMIT` tune it.
- **Backups & legal**: one-tap export/import of all learning data (drawer menu),
  Impressum + Datenschutzerklärung pages (fill in the placeholders before going
  public), daily request caps on the server (`TRAINER_DAILY_LIMIT`,
  `TRAINER_IP_LIMIT`) so a public link can't drain API credits.
- **Mi progreso**: an optional 5-minute speaking pretest (say 6 sentences of
  rising difficulty in German), AI-scored 0–100 with a CEFR estimate. Repeat it
  weekly and the progress screen draws your curve — where you started, where
  you are, and a dashed projection of where you'll be if you keep going.
- **Level A0 + call preparation**: a true zero level (5–8 word replies, only
  the most common words, yes/no questions) and a 🎒 warm-up before any call:
  the meaning appears in your language, you produce the German — tiniest words
  first, then mini-sentences — with "show me" + repeat-after-me when you don't
  know, ending in a START NOW button that launches the call.

## Changing the scenarios

`public/index.html`, the `SCENARIOS` array at the top of the script. Each entry needs
`role`, `place` and a `goals` array in English (those go into the prompt) and the
display strings in German plus your help language.
