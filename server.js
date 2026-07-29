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

// AI portrait photos for the call characters. Generated once per character
// with the same OpenAI key as TTS (~1 cent each, cached on disk), served
// from /api/avatar/<id>. Without TTS_API_KEY the client keeps emoji avatars.
const os = require("os");
const AVATAR_DIR = path.join(os.tmpdir(), "telefontrainer-avatars");
// v2 framing: tight, centered face so the animated mouth overlay lands right
const AVATAR_STYLE = "Warm friendly close-up face portrait photo, head centered and filling most of the frame, looking straight at the camera, mouth closed with a slight natural smile, soft light, plain warm beige background, photorealistic, natural skin, no text, no watermark: ";
const AVATARS = {
  arzt: "a German medical practice receptionist, woman in her 30s, white polo shirt",
  amt: "a municipal citizens' office clerk, man in his 40s, light shirt",
  werkstatt: "a car mechanic, man in his 30s, dark work overalls",
  friseur: "a hairdresser, stylish woman in her 20s",
  restaurant: "a waiter, man in his 30s, white shirt and dark apron",
  apotheke: "a pharmacist, woman in her 40s, white coat",
  paket: "a parcel-service call-center agent, young man wearing a headset",
  vermieter: "a property manager, man in his 50s with a short beard, jacket",
  bank: "a bank service employee, man in his 30s, suit and tie",
  kita: "a kindergarten teacher, woman in her 30s, colorful cardigan",
  nachbar: "a friendly retired German man in his 70s, grey hair, cardigan, very warm smile",
  baecker: "a bakery saleswoman in her 40s, apron, cheerful",
  supermarkt: "a supermarket employee, young woman in a store vest",
  kollegen: "a friendly office colleague, woman in her 30s, casual smart clothes",
  empfang: "a doctor's practice front-desk receptionist, woman in her 20s",
  // second person who may take over the conversation mid-call
  arzt2: "a German family doctor, man in his 50s, white coat, glasses",
  amt2: "a senior municipal office supervisor, woman in her 50s, blazer",
  werkstatt2: "a master mechanic and workshop owner, man in his 50s, grey hair",
  friseur2: "a salon owner, woman in her 40s, elegant",
  restaurant2: "a restaurant manager, woman in her 40s, dark blazer",
  apotheke2: "a senior pharmacist, man in his 50s, white coat",
  paket2: "a customer service shift supervisor, woman in her 40s, headset",
  vermieter2: "a building caretaker (Hausmeister), man in his 40s, work jacket",
  bank2: "a bank branch advisor, woman in her 40s, business dress",
  kita2: "a kindergarten director, woman in her 50s, warm cardigan",
  nachbar2: "a friendly retired German woman in her 70s, grey hair, blouse, kind smile",
  baecker2: "a master baker, man in his 50s, white baker's jacket, flour dust",
  supermarkt2: "a supermarket store manager, man in his 40s, shirt with name badge",
  kollegen2: "a department boss, man in his 50s, shirt and tie",
  empfang2: "a German doctor, man in his 50s, white coat, stethoscope",
  dtz1: "a warm professional German language exam examiner, woman in her 40s, glasses, cardigan",
  dtz2: "a friendly German language exam examiner, woman in her 40s, blazer",
  dtz3: "an encouraging German language exam examiner, woman in her 30s",
  dtz12: "a German language exam co-examiner, man in his 50s, glasses",
  dtz22: "a German language exam co-examiner, man in his 50s, jacket",
  dtz32: "a German language exam co-examiner, man in his 40s",
};

// Talking clips: pre-rendered lip-sync videos for fixed sentences, built from
// a character portrait + our own TTS audio via an open lip-sync model on
// Replicate. Rendered once per (character, sentence), cached on disk.
// Without REPLICATE_API_TOKEN the feature stays off (client hides it).
const crypto = require("crypto");
const REPLICATE_TOKEN = process.env.REPLICATE_API_TOKEN || "";
const CLIP_MODEL = process.env.CLIP_MODEL || "cjwbw/sadtalker";
const CLIP_IMAGE_KEY = process.env.CLIP_IMAGE_KEY || "source_image";
const CLIP_AUDIO_KEY = process.env.CLIP_AUDIO_KEY || "driven_audio";
const CLIP_DAILY_LIMIT = parseInt(process.env.CLIP_DAILY_LIMIT || "60", 10);
const CLIP_DIR = path.join(os.tmpdir(), "telefontrainer-clips");
let clipDay = "", clipCount = 0;

/* shared builders (used by /api/tts, /api/avatar and /api/clip) */
const VOICES = ["alloy", "ash", "ballad", "coral", "echo", "fable", "nova", "onyx", "sage", "shimmer"];
function ttsRequestBody(text, voice, pace, char) {
  const useVoice = VOICES.includes(voice) ? voice : TTS_VOICE;
  const body = { model: TTS_MODEL, voice: useVoice, input: text, response_format: "mp3" };
  if (TTS_MODEL.startsWith("gpt-")) {
    // slow speech is asked from the model (natural pauses, real prosody)
    // instead of time-stretching the audio afterwards, which sounds robotic
    const PACE = {
      slow: "Speak VERY slowly and extra clearly, like a warm, patient native German speaker talking to a beginner: unhurried, clearly articulated, with small natural pauses between phrases. Keep the intonation lively and human - slow must never mean flat or robotic.",
      fast: "Speak briskly, like a busy native German employee in a hurry - quick natural conversational pace, but still clearly articulated.",
      normal: "Speak at a relaxed natural conversational pace.",
    };
    const cleanChar = typeof char === "string" ? char.replace(/[^a-z0-9]/g, "") : "";
    const persona = AVATARS[cleanChar]
      ? " You are " + AVATARS[cleanChar] + " - let age, gender and personality come through in the voice." : "";
    body.instructions = "You are a friendly German native speaker in a real conversation. Natural, warm, human intonation - never monotone." +
      persona + " " + (PACE[pace] || PACE.normal);
  }
  return body;
}
async function synthesizeTts(text, voice, pace, char) {
  const upstream = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: { authorization: `Bearer ${TTS_KEY}`, "content-type": "application/json" },
    body: JSON.stringify(ttsRequestBody(text, voice, pace, char)),
  });
  if (!upstream.ok) {
    console.error("TTS failed:", upstream.status, (await upstream.text()).slice(0, 200));
    return null;
  }
  return Buffer.from(await upstream.arrayBuffer());
}
async function getAvatarBuffer(id) {
  const desc = AVATARS[id];
  if (!desc || !TTS_KEY) return null;
  const file = path.join(AVATAR_DIR, id + "-v2.png");
  try { return fs.readFileSync(file); } catch (e) { /* generate below */ }
  // gpt-image-1 is cheapest but needs a verified OpenAI org;
  // DALL-E 3 works on every account, so fall back to it.
  for (const model of ["gpt-image-1", "dall-e-3"]) {
    const body = model === "gpt-image-1"
      ? { model, prompt: AVATAR_STYLE + desc, size: "1024x1024", quality: "low", n: 1 }
      : { model, prompt: AVATAR_STYLE + desc, size: "1024x1024", response_format: "b64_json", n: 1 };
    const upstream = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: { authorization: `Bearer ${TTS_KEY}`, "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!upstream.ok) {
      console.error("Avatar gen failed:", model, upstream.status, (await upstream.text()).slice(0, 200));
      continue;
    }
    const data = await upstream.json();
    if (data.data && data.data[0] && data.data[0].b64_json) {
      const buf = Buffer.from(data.data[0].b64_json, "base64");
      try { fs.mkdirSync(AVATAR_DIR, { recursive: true }); fs.writeFileSync(file, buf); } catch (e) {}
      return buf;
    }
  }
  return null;
}

// Free-tier protection: daily request caps (global + per IP) so a public
// link can never drain the API credits. Counters reset at midnight UTC.
const DAILY_LIMIT = parseInt(process.env.TRAINER_DAILY_LIMIT || "500", 10);
const IP_LIMIT = parseInt(process.env.TRAINER_IP_LIMIT || "150", 10);
let usageDay = "", usageTotal = 0, usageByIp = {};
function overLimit(req) {
  const today = new Date().toISOString().slice(0, 10);
  if (usageDay !== today) { usageDay = today; usageTotal = 0; usageByIp = {}; }
  const ip = String(req.headers["x-forwarded-for"] || req.socket.remoteAddress || "?").split(",")[0].trim();
  usageTotal++;
  usageByIp[ip] = (usageByIp[ip] || 0) + 1;
  return usageTotal > DAILY_LIMIT || usageByIp[ip] > IP_LIMIT;
}

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
    if (overLimit(req)) {
      res.writeHead(429, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: "limit" }));
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

  if (req.method === "GET" && req.url.startsWith("/api/avatar/")) {
    const [p, q] = req.url.split("?");
    const id = p.slice("/api/avatar/".length).replace(/[^a-z0-9]/g, "");
    const params = new URLSearchParams(q || "");
    if (PIN && params.get("pin") !== PIN) {
      res.writeHead(401, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: "pin_required" }));
      return;
    }
    const desc = AVATARS[id];
    if (!desc || !TTS_KEY) {
      res.writeHead(404, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: "no_avatar" }));
      return;
    }
    const file = path.join(AVATAR_DIR, id + "-v2.png");
    const serve = (buf) => {
      res.writeHead(200, { "content-type": "image/png", "content-length": buf.length, "cache-control": "public, max-age=604800" });
      res.end(buf);
    };
    try {
      const buf = await getAvatarBuffer(id);
      if (!buf) {
        res.writeHead(502, { "content-type": "application/json" });
        res.end(JSON.stringify({ error: "avatar_failed" }));
        return;
      }
      serve(buf);
    } catch (err) {
      console.error("Avatar proxy failed:", err.message);
      res.writeHead(502, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  if (req.method === "GET" && req.url.startsWith("/api/clip")) {
    const params = new URLSearchParams((req.url.split("?")[1]) || "");
    if (PIN && params.get("pin") !== PIN) {
      res.writeHead(401, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: "pin_required" }));
      return;
    }
    if (!REPLICATE_TOKEN || !TTS_KEY) {
      res.writeHead(501, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: "clips_unconfigured" }));
      return;
    }
    const char = (params.get("char") || "").replace(/[^a-z0-9]/g, "");
    const voice = params.get("voice") || "";
    const text = (params.get("text") || "").trim();
    if (!AVATARS[char] || !text || text.length > 140) {
      res.writeHead(400, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: "bad_request" }));
      return;
    }
    const hash = crypto.createHash("sha1").update(char + "|" + voice + "|" + text).digest("hex");
    const file = path.join(CLIP_DIR, hash + ".mp4");
    const serve = (buf) => {
      res.writeHead(200, { "content-type": "video/mp4", "content-length": buf.length, "cache-control": "public, max-age=2592000" });
      res.end(buf);
    };
    try { serve(fs.readFileSync(file)); return; } catch (e) { /* render below */ }
    const today = new Date().toISOString().slice(0, 10);
    if (clipDay !== today) { clipDay = today; clipCount = 0; }
    if (++clipCount > CLIP_DAILY_LIMIT) {
      res.writeHead(429, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: "limit" }));
      return;
    }
    try {
      const [imgBuf, audioBuf] = [await getAvatarBuffer(char), await synthesizeTts(text, voice, "slow", char)];
      if (!imgBuf || !audioBuf) throw new Error("assets_failed");
      const input = {};
      input[CLIP_IMAGE_KEY] = "data:image/png;base64," + imgBuf.toString("base64");
      input[CLIP_AUDIO_KEY] = "data:audio/mpeg;base64," + audioBuf.toString("base64");
      let pred = await (await fetch(`https://api.replicate.com/v1/models/${CLIP_MODEL}/predictions`, {
        method: "POST",
        headers: { authorization: `Bearer ${REPLICATE_TOKEN}`, "content-type": "application/json", prefer: "wait=60" },
        body: JSON.stringify({ input }),
      })).json();
      const started = Date.now();
      while (pred && pred.status && !["succeeded", "failed", "canceled"].includes(pred.status) && Date.now() - started < 120000) {
        await new Promise((r) => setTimeout(r, 3000));
        pred = await (await fetch(pred.urls.get, { headers: { authorization: `Bearer ${REPLICATE_TOKEN}` } })).json();
      }
      let out = pred && pred.output;
      if (Array.isArray(out)) out = out.find((x) => typeof x === "string" && x.includes(".mp4")) || out[out.length - 1];
      if (!pred || pred.status !== "succeeded" || typeof out !== "string") {
        console.error("Clip gen failed:", pred && pred.status, pred && JSON.stringify(pred.error || "").slice(0, 200));
        res.writeHead(502, { "content-type": "application/json" });
        res.end(JSON.stringify({ error: "clip_failed" }));
        return;
      }
      const video = Buffer.from(await (await fetch(out)).arrayBuffer());
      try { fs.mkdirSync(CLIP_DIR, { recursive: true }); fs.writeFileSync(file, video); } catch (e) {}
      serve(video);
    } catch (err) {
      console.error("Clip proxy failed:", err.message);
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
    if (overLimit(req)) {
      res.writeHead(429, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: "limit" }));
      return;
    }
    if (!TTS_KEY) {
      res.writeHead(501, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: "tts_unconfigured" }));
      return;
    }
    try {
      const { text, voice, pace, char } = JSON.parse(await readBody(req));
      if (!text || typeof text !== "string" || text.length > 1200) {
        res.writeHead(400, { "content-type": "application/json" });
        res.end(JSON.stringify({ error: "bad_text" }));
        return;
      }
      const buf = await synthesizeTts(text, voice, pace, char);
      if (!buf) {
        res.writeHead(502, { "content-type": "application/json" });
        res.end(JSON.stringify({ error: "tts_failed" }));
        return;
      }
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
