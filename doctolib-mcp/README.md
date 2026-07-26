# doctolib-mcp

An [MCP](https://modelcontextprotocol.io) server that lets Claude search practitioners on
[Doctolib](https://www.doctolib.de), check open appointment slots, and hand you a link to
confirm the booking.

It talks to the same unauthenticated JSON endpoints Doctolib's own booking widget uses
(`api/searchbar/autocomplete.json`, `booking/<slug>.json`, `availabilities.json`). There is
no official public Doctolib API, so treat this as best-effort: response shapes can change,
and the endpoints sit behind Datadome bot protection (browser-like headers at human-paced
volume are normally fine).

**The final booking step stays with you.** Confirming an appointment requires your
logged-in Doctolib account (with SMS verification), and automating that would break
Doctolib's terms of service. The flow ends with a deep link: Claude finds the doctor and
the exact free slot, you tap once to confirm.

## Tools

| Tool | What it does |
| --- | --- |
| `search_doctors` | Free-text search (name, clinic, speciality), or directory search by speciality slug + city |
| `get_booking_options` | A practitioner's visit motives (public/private insurance variants), locations, agendas |
| `get_availabilities` | Open slots for a practitioner + visit motive from a start date; falls back to the next known free slot |
| `get_booking_link` | The practitioner's page URL where you confirm the chosen slot yourself |

All tools accept a `country` parameter (`de`, `fr`, `it`); the default comes from the
`DOCTOLIB_COUNTRY` environment variable, falling back to `de`.

## Setup

```bash
cd doctolib-mcp
npm install
npm run build
```

Register with Claude Code:

```bash
claude mcp add doctolib -- node /absolute/path/to/doctolib-mcp/dist/index.js
```

Or add it to any MCP client config (Claude Desktop etc.):

```json
{
  "mcpServers": {
    "doctolib": {
      "command": "node",
      "args": ["/absolute/path/to/doctolib-mcp/dist/index.js"],
      "env": { "DOCTOLIB_COUNTRY": "de" }
    }
  }
}
```

## Example conversation

> Find me a dermatologist in Langenfeld with an appointment before October.

Claude will chain `search_doctors` → `get_booking_options` → `get_availabilities` and
reply with the free slots plus the booking link for the one you pick.

## Notes

- Run it from a normal residential/office connection. Data-center IPs are more likely to
  be challenged by Datadome; the server surfaces 403s with a clear message when that happens.
- Slots and availability data are fetched live on every call — nothing is stored.
