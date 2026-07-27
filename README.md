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

## Credentials

The server reads them from the environment or from `./.env` and never sends them to the
browser:

| Variable | Purpose |
| --- | --- |
| `ANTHROPIC_AUTH_TOKEN` | Sent as `Authorization: Bearer`. Use this for a gateway or router. |
| `ANTHROPIC_API_KEY` | Sent as `x-api-key`. Use this for a direct Anthropic key. |
| `ANTHROPIC_BASE_URL` | Optional. Defaults to `https://api.anthropic.com`. |
| `TRAINER_MODEL` | Optional. Defaults to `claude-sonnet-4-6`. |
| `PORT` | Optional. Defaults to `5173`. |

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
- **Levels A1–B2**: B2 speaks fast, throws in real complications and may transfer you
  to a colleague.

## Changing the scenarios

`public/index.html`, the `SCENARIOS` array at the top of the script. Each entry needs
`role`, `place` and a `goals` array in English (those go into the prompt) and the
display strings in German plus your help language.
