/* MARZI call-art generator — writes every production SVG asset.
   Usage: node tools/call-art/generate.js [--preview <out.html>]
   Dependency-free; deterministic output (same input → same bytes). */
"use strict";
const fs = require("fs");
const path = require("path");
const { CONTACTS, STATES, portrait } = require("./characters");
const { standalone, FAMILY_NAMES } = require("./backgrounds");
const { marziPose, POSES } = require("./marzi");

const ROOT = path.join(__dirname, "..", "..");
const OUT = (...p) => path.join(ROOT, "public", ...p);
const written = [];
function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content + "\n");
  written.push(path.relative(ROOT, file));
}

/* Layer A — contact portraits: 10 contacts × 5 states */
for (const c of CONTACTS) {
  for (const st of STATES) {
    write(OUT("assets", "call", "characters", c.id, `${st}.svg`), portrait(c, st));
  }
}

/* Layer B — scenario backgrounds */
for (const fam of FAMILY_NAMES) {
  write(OUT("assets", "call", "backgrounds", `${fam}.svg`), standalone(fam, `${fam} backdrop`));
}

/* Layer C — Marzi call poses (brief vocabulary, canonical stage-5 look) */
const BRIEF_POSES = ["idle", "listening", "thinking", "helping", "suggesting",
  "celebrating", "confused", "error", "disconnected", "retry"];
for (const p of BRIEF_POSES) {
  write(OUT("assets", "marzi", "call", `${p}.svg`), marziPose(p));
}

/* Shipped stage-aware registry files (MARZI-018 contract):
   stages 4-6 × ready/listening/thinking/speaking/encouraging/limit/offline */
const REGISTRY_POSES = ["ready", "listening", "thinking", "speaking", "encouraging", "limit", "offline", "error"];
for (const stage of [4, 5, 6]) {
  for (const p of REGISTRY_POSES) {
    write(OUT("assets", "marzi", "call", `stage-${stage}-${p}.svg`), marziPose(p, { stage }));
  }
}

/* Layer D — outfit-on-Marzi call variants */
for (const outfit of ["base", "university", "explorer", "graduate"]) {
  write(OUT("assets", "marzi", "outfits", `${outfit}.svg`), marziPose("idle", { outfit }));
}

console.log(`wrote ${written.length} assets`);

/* optional preview sheet for visual review */
const pi = process.argv.indexOf("--preview");
if (pi > -1) {
  const out = process.argv[pi + 1] || "call-art-preview.html";
  const cell = (t, inner, w = 200) =>
    `<figure style="margin:6px;display:inline-block;text-align:center"><div style="width:${w}px;background:#f6f1e7;border:1px solid #ddd;border-radius:8px;overflow:hidden">${inner}</div><figcaption style="font:11px sans-serif">${t}</figcaption></figure>`;
  let html = "<body style='background:#eee'>";
  for (const c of CONTACTS) {
    html += `<h3 style="font:14px sans-serif">${c.id}</h3>`;
    for (const st of STATES) html += cell(st, portrait(c, st), 170);
  }
  html += `<h3 style="font:14px sans-serif">backgrounds</h3>`;
  for (const fam of FAMILY_NAMES) html += cell(fam, standalone(fam, fam), 260);
  html += `<h3 style="font:14px sans-serif">marzi poses</h3>`;
  for (const p of BRIEF_POSES) html += cell(p, marziPose(p), 140);
  html += `<h3 style="font:14px sans-serif">marzi stages + outfits</h3>`;
  for (const stage of [4, 5, 6]) html += cell("stage " + stage, marziPose("ready", { stage }), 140);
  for (const o of ["base", "university", "explorer", "graduate"]) html += cell(o, marziPose("idle", { outfit: o }), 140);
  fs.writeFileSync(out, html);
  console.log("preview: " + out);
}
