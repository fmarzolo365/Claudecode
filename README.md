# Telefontrainer

German phone-call practice. The other side speaks German out loud, you answer with your
voice, and you get a correction after every line.

No build step, no dependencies, two files.

## Run

```bash
node server.js
```

Then open **http://localhost:5173** in Chrome.

`localhost` counts as a secure origin, so Chrome asks for microphone permission normally.
Allow it once. This is the whole reason for running it locally.

## Credentials

The server reads them from the environment and never sends them to the browser:

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
- Hang up to see every correction from the call on one page.

## Changing the scenarios

`public/index.html`, the `SCENARIOS` array at the top of the script. Each entry needs
`role`, `place` and `goal` in English (those go into the prompt) and the display strings
in German plus your help language.
