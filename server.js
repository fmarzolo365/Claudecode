/**
 * Telefontrainer — local server.
 *
 * Serves ./public and proxies /api/chat to the Anthropic Messages API.
 * The token stays in this process. It never reaches the browser.
 *
 * Run:  node server.js      then open  http://localhost:5173
 */

const http = require("http");
const fs = require("fs");
const path = require("path");

// Load ./.env (KEY=VALUE per line) so the key survives closing Termux.
// Real environment variables always win over the file.
try {
  const lines = fs.readFileSync(path.join(__dirname, ".env"), "utf8").split("\n");
  for (const line of lines) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
} catch (e) { /* no .env file — fine */ }

const PORT = process.env.PORT || 5173;
const BASE = (process.env.ANTHROPIC_BASE_URL || "https://api.anthropic.com").replace(/\/$/, "");
const AUTH_TOKEN = process.env.ANTHROPIC_AUTH_TOKEN || "";
const API_KEY = process.env.ANTHROPIC_API_KEY || "";
const MODEL = process.env.TRAINER_MODEL || "claude-sonnet-4-6";
// Optional access PIN. Set TRAINER_PIN when hosting publicly so strangers
// can't spend your API credits. Unset (local use) = no PIN asked.
const PIN = process.env.TRAINER_PIN || "";
// Optional neural voice. Set TTS_API_KEY (an OpenAI API key) to upgrade from
// the device robot voice to a natural one; unset = device voice fallback.
const TTS_KEY = process.env.TTS_API_KEY || "";
const TTS_MODEL = process.env.TTS_MODEL || "gpt-4o-mini-tts";
const TTS_VOICE = process.env.TTS_VOICE || "coral";

if (!AUTH_TOKEN && !API_KEY) {
  console.error("No credentials found.");
  console.error("Set ANTHROPIC_AUTH_TOKEN (router / gateway) or ANTHROPIC_API_KEY (direct),");
  console.error("or run ./start.sh once to store the key in ./.env");
  process.exit(1);
}

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
};

function authHeaders() {
  const h = {
    "content-type": "application/json",
    "anthropic-version": "2023-06-01",
  };
  if (AUTH_TOKEN) h["authorization"] = `Bearer ${AUTH_TOKEN}`;
  else h["x-api-key"] = API_KEY;
  return h;
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (c) => {
      data += c;
      if (data.length > 2e6) req.destroy();
    });
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  if (req.method === "POST" && req.url === "/api/chat") {
    if (PIN && req.headers["x-trainer-pin"] !== PIN) {
      res.writeHead(401, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: "pin_required" }));
      return;
    }
    try {
      const { system, messages } = JSON.parse(await readBody(req));
      const upstream = await fetch(`${BASE}/v1/messages`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ model: MODEL, max_tokens: 1000, system, messages }),
      });
      const text = await upstream.text();
      res.writeHead(upstream.status, { "content-type": "application/json; charset=utf-8" });
      res.end(text);
    } catch (err) {
      console.error("Proxy failed:", err.message);
      res.writeHead(502, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  if (req.method === "POST" && req.url === "/api/tts") {
    if (PIN && req.headers["x-trainer-pin"] !== PIN) {
      res.writeHead(401, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: "pin_required" }));
      return;
    }
    if (!TTS_KEY) {
      res.writeHead(501, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: "tts_unconfigured" }));
      return;
    }
    try {
      const { text, voice } = JSON.parse(await readBody(req));
      if (!text || typeof text !== "string" || text.length > 1200) {
        res.writeHead(400, { "content-type": "application/json" });
        res.end(JSON.stringify({ error: "bad_text" }));
        return;
      }
      // per-character voices from the client, whitelisted
      const VOICES = ["alloy", "ash", "ballad", "coral", "echo", "fable", "nova", "onyx", "sage", "shimmer"];
      const useVoice = VOICES.includes(voice) ? voice : TTS_VOICE;
      const body = { model: TTS_MODEL, voice: useVoice, input: text, response_format: "mp3" };
      if (TTS_MODEL.startsWith("gpt-")) {
        body.instructions = "Speak natural, native German as a friendly, professional employee answering a phone call. Natural pacing and intonation, slightly warm.";
      }
      const upstream = await fetch("https://api.openai.com/v1/audio/speech", {
        method: "POST",
        headers: { authorization: `Bearer ${TTS_KEY}`, "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!upstream.ok) {
        console.error("TTS failed:", upstream.status, (await upstream.text()).slice(0, 200));
        res.writeHead(502, { "content-type": "application/json" });
        res.end(JSON.stringify({ error: "tts_failed" }));
        return;
      }
      const buf = Buffer.from(await upstream.arrayBuffer());
      res.writeHead(200, { "content-type": "audio/mpeg", "content-length": buf.length });
      res.end(buf);
    } catch (err) {
      console.error("TTS proxy failed:", err.message);
      res.writeHead(502, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  const rel = req.url === "/" ? "/index.html" : req.url.split("?")[0];
  const file = path.join(__dirname, "public", path.normalize(rel).replace(/^(\.\.[/\\])+/, ""));
  fs.readFile(file, (err, buf) => {
    if (err) {
      res.writeHead(404, { "content-type": "text/plain" });
      res.end("Not found");
      return;
    }
    res.writeHead(200, { "content-type": MIME[path.extname(file)] || "application/octet-stream" });
    res.end(buf);
  });
});

server.listen(PORT, () => {
  console.log(`Telefontrainer on http://localhost:${PORT}`);
  console.log(`Model: ${MODEL}   Endpoint: ${BASE}`);
  console.log(`Auth: ${AUTH_TOKEN ? "bearer token" : "x-api-key"}`);
});
