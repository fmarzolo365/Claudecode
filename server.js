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

const PORT = process.env.PORT || 5173;
const BASE = (process.env.ANTHROPIC_BASE_URL || "https://api.anthropic.com").replace(/\/$/, "");
const AUTH_TOKEN = process.env.ANTHROPIC_AUTH_TOKEN || "";
const API_KEY = process.env.ANTHROPIC_API_KEY || "";
const MODEL = process.env.TRAINER_MODEL || "claude-sonnet-4-6";

if (!AUTH_TOKEN && !API_KEY) {
  console.error("No credentials found.");
  console.error("Set ANTHROPIC_AUTH_TOKEN (router / gateway) or ANTHROPIC_API_KEY (direct).");
  process.exit(1);
}

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
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
