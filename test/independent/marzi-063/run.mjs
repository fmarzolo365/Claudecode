#!/usr/bin/env node
/* MARZI-063 — independent verification runner.
 *
 * Runs from the CONTROL checkout and tests the SUT checkout, which is exactly
 * d75a10bb96e83045090190777dda5c8a692bed55. It never writes inside either
 * worktree: every byte it produces goes to MARZI063_ARTIFACT_DIR.
 *
 * Its whole reason to exist is that the suites under test can exit zero without
 * having run. test/browser/run.js prints "SKIP no playwright available" and
 * exits 0 when Chromium is missing, so an exit code alone proves nothing. Every
 * gate here therefore requires SIX things together: exit zero, no SKIP marker,
 * the exact expected summary line, the exact total, the exact passed count, and
 * a zero failed count. A missing summary is a failure even on exit zero.
 *
 * Nothing in this file may be relaxed to make a run pass. A failed visual or
 * interaction criterion is an application finding, not a runner defect.
 */
"use strict";

import { spawnSync } from "node:child_process";
import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { createRequire } from "node:module";

const require_ = createRequire(import.meta.url);

/* ---------------- constants: not inputs ---------------- */
const TARGET_COMMIT = "d75a10bb96e83045090190777dda5c8a692bed55";
const PARENT_COMMIT = "e2e90925aa1b83ecaae4dbf0e39ccfade49546b1";
const PROTECTED_MAIN = "7395cd0a75fc206077e19ecc60e4c1e978dd2c89";
const BUILD_LABEL = "MARZI STAGING PREVIEW · MARZI-062 · BUILD MARZI-062-PREVIEW-1";
const PORT = Number(process.env.MARZI063_PORT || 5173);
const BASE_URL = "http://127.0.0.1:" + PORT;

const SUT = path.resolve(process.env.MARZI063_SUT || "sut");
const CONTROL = path.resolve(process.env.MARZI063_CONTROL || ".");
const ART = path.resolve(process.env.MARZI063_ARTIFACT_DIR || path.join(os.tmpdir(), "marzi-063-artifacts"));

const problems = [];
const blocked = (code, detail) => { problems.push({ severity: "BLOCKED", code, detail }); console.error("BLOCKED  " + code + ": " + detail); };
const changes = (code, detail) => { problems.push({ severity: "CHANGES_REQUIRED", code, detail }); console.error("CHANGES  " + code + ": " + detail); };

for (const d of ["", "screenshots/layout", "screenshots/states", "screenshots/interactions"]) {
  fs.mkdirSync(path.join(ART, d), { recursive: true });
}
const write = (name, data) => {
  const file = path.join(ART, name);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, typeof data === "string" ? data : JSON.stringify(data, null, 1) + "\n");
  return file;
};
const sha256File = (f) => createHash("sha256").update(fs.readFileSync(f)).digest("hex");
const sha256 = (s) => createHash("sha256").update(s).digest("hex");

/* Redact anything credential-shaped before it can reach an artifact. */
const redact = (t) => String(t)
  .replace(/rnd_[A-Za-z0-9]+/g, "rnd_<redacted>")
  .replace(/sk-[A-Za-z0-9_-]{8,}/g, "sk-<redacted>")
  .replace(/gh[pousr]_[A-Za-z0-9]{8,}/g, "gh_<redacted>")
  .replace(/Bearer\s+[A-Za-z0-9._-]+/gi, "Bearer <redacted>")
  .replace(/(api[_-]?key|token|secret|password)("?\s*[:=]\s*"?)[^"&\s,}]+/gi, "$1$2<redacted>");

function git(cwd, ...args) {
  const r = spawnSync("git", args, { cwd, encoding: "utf8" });
  return { ok: r.status === 0, out: (r.stdout || "").trim(), err: (r.stderr || "").trim() };
}

/* ================= Phase 1 — provenance ================= */
function provenance() {
  const pkg = JSON.parse(fs.readFileSync(path.join(CONTROL, "test/independent/marzi-063/package.json"), "utf8"));
  const lock = path.join(CONTROL, "test/independent/marzi-063/package-lock.json");
  let chromium = null, exe = null;
  try {
    const pw = require_(path.join(CONTROL, "test/independent/marzi-063/node_modules/playwright-core"));
    exe = pw.chromium.executablePath();
    const browsers = JSON.parse(fs.readFileSync(
      path.join(CONTROL, "test/independent/marzi-063/node_modules/playwright-core/browsers.json"), "utf8"));
    const c = browsers.browsers.find((b) => b.name === "chromium");
    chromium = c ? { revision: c.revision, browserVersion: c.browserVersion } : null;
  } catch (e) { blocked("PLAYWRIGHT_UNAVAILABLE", "playwright-core could not be resolved from the control checkout: " + e.message); }
  if (exe && !fs.existsSync(exe)) { blocked("CHROMIUM_UNAVAILABLE", "the pinned Chromium executable does not exist at " + exe); exe = null; }

  const p = {
    generatedAt: new Date().toISOString(),
    runner: "test/independent/marzi-063/run.mjs",
    independentOf: "the MARZI-062 implementation environment",
    targetCommit: TARGET_COMMIT, parentCommit: PARENT_COMMIT, protectedMain: PROTECTED_MAIN,
    controlCommit: git(CONTROL, "rev-parse", "HEAD").out || null,
    node: process.version, npm: spawnSync("npm", ["--version"], { encoding: "utf8" }).stdout?.trim() || null,
    platform: process.platform + " " + process.arch, osRelease: os.release(),
    imageDigest: process.env.ImageOS || process.env.MARZI063_IMAGE_DIGEST || null,
    playwrightPackage: pkg.dependencies["playwright-core"],
    chromium: chromium ? { ...chromium, executablePath: exe, sha256: exe ? sha256File(exe) : null } : null,
    lockfileSha256: fs.existsSync(lock) ? sha256File(lock) : null,
    githubRunId: process.env.GITHUB_RUN_ID || null,
    githubRunUrl: process.env.GITHUB_SERVER_URL && process.env.GITHUB_REPOSITORY && process.env.GITHUB_RUN_ID
      ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}` : null,
    workflowRef: process.env.GITHUB_WORKFLOW_REF || null,
    actionShas: JSON.parse(process.env.MARZI063_ACTION_SHAS || "null")
  };
  write("provenance.json", p);
  return p;
}

/* ================= Phase 2 — checkout proofs ================= */
function proveCheckouts() {
  const head = git(SUT, "rev-parse", "HEAD").out;
  if (head !== TARGET_COMMIT) blocked("SUT_HEAD_MISMATCH", "sut HEAD is " + head + ", expected " + TARGET_COMMIT);
  const parents = git(SUT, "rev-list", "--parents", "-n", "1", "HEAD").out.split(/\s+/).slice(1);
  if (parents.length !== 1) blocked("SUT_IS_MERGE", "sut HEAD has " + parents.length + " parents");
  else if (parents[0] !== PARENT_COMMIT) blocked("SUT_PARENT_MISMATCH", "sut parent is " + parents[0] + ", expected " + PARENT_COMMIT);
  const dirty = git(SUT, "status", "--porcelain").out;
  if (dirty) blocked("SUT_DIRTY", "the source under test is not clean: " + dirty.split("\n").length + " path(s)");
  const mainSha = git(CONTROL, "rev-parse", "origin/main").out || git(SUT, "rev-parse", "origin/main").out;
  if (mainSha && mainSha !== PROTECTED_MAIN) blocked("MAIN_MOVED", "origin/main is " + mainSha + ", expected " + PROTECTED_MAIN);
  if (path.resolve(SUT) === path.resolve(CONTROL)) blocked("CHECKOUTS_NOT_SEPARATE", "control and sut resolve to the same directory");
  /* no tool dependency may exist inside the source under test */
  for (const p of ["node_modules", "test/independent"]) {
    if (fs.existsSync(path.join(SUT, p))) blocked("SUT_CONTAMINATED", "sut contains " + p);
  }
  if (!path.resolve(ART).startsWith(path.resolve(os.tmpdir())) && !process.env.RUNNER_TEMP && !process.env.MARZI063_ALLOW_ART_PATH) {
    blocked("ARTIFACT_PATH_UNSAFE", "artifact directory is not below a temporary root: " + ART);
  }
  if (path.resolve(ART).startsWith(path.resolve(SUT)) || path.resolve(ART).startsWith(path.resolve(CONTROL))) {
    blocked("ARTIFACT_PATH_INSIDE_WORKTREE", "artifacts would be written inside a git worktree");
  }
  /* the eleven-file MARZI-062 change list, as committed */
  const names = git(SUT, "diff", "--name-status", PARENT_COMMIT, TARGET_COMMIT).out.split("\n").filter(Boolean);
  write("marzi-062-name-status.txt", names.join("\n") + "\n");
  if (names.length !== 11) blocked("MARZI062_FILE_COUNT", "expected 11 changed files in the MARZI-062 range, found " + names.length);
  return { head, parents, mainSha, changedFiles: names };
}

/* ================= Phase 3 — suites ================= */
const SUITES = [
  { id: "conflict-markers", cwd: "sut", cmd: ["node", "test/conflict-markers.js"], summary: /ok\s+no conflict markers in the repository/ },
  { id: "syntax-server", cwd: "sut", cmd: ["node", "--check", "server.js"], emptyOk: true },
  { id: "syntax-sw", cwd: "sut", cmd: ["node", "--check", "public/sw.js"], emptyOk: true },
  { id: "syntax-run", cwd: "sut", cmd: ["node", "--check", "test/run.js"], emptyOk: true },
  { id: "syntax-learning", cwd: "sut", cmd: ["node", "--check", "test/learning-contracts.js"], emptyOk: true },
  { id: "syntax-m061", cwd: "sut", cmd: ["node", "--check", "test/marzi-061-external-review-readiness.js"], emptyOk: true },
  { id: "syntax-m062", cwd: "sut", cmd: ["node", "--check", "test/marzi-062-visual-staging.js"], emptyOk: true },
  { id: "syntax-browser", cwd: "sut", cmd: ["node", "--check", "test/browser/run.js"], emptyOk: true },
  { id: "application", cwd: "sut", cmd: ["node", "test/run.js"], summary: /All checks passed\./, countOk: (o) => (o.match(/^ {2}ok {2}/gm) || []).length, expected: 51 },
  { id: "learning-contracts", cwd: "sut", cmd: ["node", "test/learning-contracts.js"], summary: /MARZI-021 learning contracts: (\d+)\/(\d+) checks passed/, expected: 36 },
  { id: "marzi-061", cwd: "sut", cmd: ["node", "test/marzi-061-external-review-readiness.js"], summary: /MARZI-061 external review readiness: (\d+)\/(\d+) checks passed/, expected: 30 },
  { id: "marzi-062-package", cwd: "sut", cmd: ["node", "test/marzi-062-visual-staging.js"], summary: /MARZI-062 visual staging: (\d+)\/(\d+) checks passed/, expected: 24 },
  { id: "browser-full", cwd: "sut", cmd: ["node", "test/browser/run.js"], summary: /(\d+) browser assertions · (\d+) passed · (\d+) failed/, expected: 675, browser: true },
  { id: "browser-marzi062", cwd: "sut", cmd: ["node", "test/browser/run.js", "marzi062"], summary: /(\d+) browser assertions · (\d+) passed · (\d+) failed/, expected: 107, browser: true },
  { id: "diff-check-062", cwd: "sut", cmd: ["git", "diff", "--check", PARENT_COMMIT, TARGET_COMMIT], emptyOk: true },
  { id: "control-package-validator", cwd: "control", cmd: ["node", "test/marzi-063-staging-infra-browser.js"], summary: /MARZI-063 staging infrastructure: (\d+)\/(\d+) checks passed/ },
  { id: "control-syntax-runner", cwd: "control", cmd: ["node", "--check", "test/independent/marzi-063/run.mjs"], emptyOk: true },
  { id: "control-syntax-deploy", cwd: "control", cmd: ["node", "--check", ".github/scripts/marzi-063-render-staging.mjs"], emptyOk: true },
  { id: "control-docs-validate", cwd: "control", cmd: ["node", ".ai/bin/docs-validate"], allowNonZero: true },
  { id: "diff-check-063", cwd: "control", cmd: ["git", "diff", "--check", TARGET_COMMIT, "HEAD"], emptyOk: true }
];

/* The SKIP family. This must match a runner's own not-run MARKER, not any
   prose that happens to contain the word: the MARZI-063 validator prints a
   check named "a skipped suite can never be read as a pass", and matching that
   made a passing suite look skipped. Markers are line-leading or carry the
   phrase a harness actually prints. */
const NOT_RUN = [
  /^\s*SKIP(?:PED)?\b/mi,
  /\bno playwright available\b/i,
  /\bno Chromium at\b/i,
  /\bdependency[- ]missing\b/i,
  /\btests? (?:were )?skipped\b/i
];
const notRunMarker = (text) => NOT_RUN.find((re) => re.test(text)) || null;

function runSuite(s, env) {
  const cwd = s.cwd === "sut" ? SUT : CONTROL;
  const started = Date.now();
  const r = spawnSync(s.cmd[0], s.cmd.slice(1), { cwd, encoding: "utf8", env, maxBuffer: 64 * 1024 * 1024, timeout: 45 * 60 * 1000 });
  const out = redact((r.stdout || "") + (r.stderr || ""));
  const rec = {
    id: s.id, command: s.cmd.join(" "), cwd: s.cwd, exitCode: r.status,
    durationMs: Date.now() - started, expected: s.expected ?? null,
    total: null, passed: null, failed: null, summaryFound: false, skipDetected: false, status: "PASS"
  };
  const bad = (code, detail) => { rec.status = "FAIL"; blocked(code, s.id + ": " + detail); };

  if (r.error) bad("SUITE_SPAWN_ERROR", String(r.error.message));
  if (!s.allowNonZero && r.status !== 0) bad("SUITE_NONZERO_EXIT", "exit code " + r.status);

  /* the whole point: exit zero is not enough */
  const marker = notRunMarker(out);
  if (marker) { rec.skipDetected = true; rec.skipMarker = String(marker); bad("SUITE_SKIPPED", "output carries the not-run marker " + marker + "; a skipped suite is never a pass"); }

  if (s.emptyOk && out.trim() !== "" && !s.allowNonZero) bad("SUITE_UNEXPECTED_OUTPUT", "expected no output, got " + JSON.stringify(out.trim().slice(0, 120)));

  if (s.summary) {
    const m = out.match(s.summary);
    rec.summaryFound = Boolean(m);
    if (!m) bad("SUITE_SUMMARY_MISSING", "the exact expected summary line was not printed");
    else if (m.length >= 3) {
      /* the two summary shapes order their numbers differently:
           "24/24 checks passed"                      -> passed, total
           "675 assertions · 675 passed · 0 failed"   -> total, passed, failed
         reading both the same way round silently compared the wrong number. */
      const passedFirst = /checks passed/.test(s.summary.source);
      rec.passed = Number(passedFirst ? m[1] : m[2]);
      rec.total = Number(passedFirst ? m[2] : m[1]);
      rec.failed = m[3] !== undefined ? Number(m[3]) : Math.max(0, rec.total - rec.passed);
      if (s.expected != null && rec.total !== s.expected) bad("SUITE_COUNT_MISMATCH", "total " + rec.total + ", expected " + s.expected);
      if (s.expected != null && rec.passed !== s.expected) bad("SUITE_PASSED_MISMATCH", "passed " + rec.passed + ", expected " + s.expected);
      if (rec.failed !== 0) bad("SUITE_FAILURES", rec.failed + " failed assertion(s)");
    }
  }
  if (s.countOk) {
    rec.total = rec.passed = s.countOk(out);
    rec.failed = 0;
    if (s.expected != null && rec.total !== s.expected) bad("SUITE_COUNT_MISMATCH", "counted " + rec.total + ", expected " + s.expected);
  }
  const logName = "logs/" + s.id + ".log";
  write(logName, out);
  rec.logPath = logName;
  rec.logSha256 = sha256File(path.join(ART, logName));
  console.log((rec.status === "PASS" ? "PASS  " : "FAIL  ") + s.id.padEnd(26) +
    (rec.total != null ? rec.passed + "/" + rec.total : "") + "  exit " + r.status);
  return rec;
}

/* ================= Phase 4 — local server from sut ================= */
function startServer() {
  const srv = spawn("node", ["server.js"], {
    cwd: SUT, env: { ...process.env, ANTHROPIC_API_KEY: "dummy-staging-verification-key", PORT: String(PORT) },
    stdio: ["ignore", "pipe", "pipe"]
  });
  return srv;
}
async function waitForServer(ms = 20000) {
  const until = Date.now() + ms;
  while (Date.now() < until) {
    try { const r = await fetch(BASE_URL + "/manifest.webmanifest"); if (r.ok) return true; } catch { /* keep waiting */ }
    await new Promise((r) => setTimeout(r, 300));
  }
  return false;
}

/* ================= Phase 5 — independent visual matrix ================= */
const SCALE_TOKENS = ["--text-xs:22px", "--text-sm:26px", "--text-md:30px", "--text-lg:38px", "--text-xl:52px",
  "--text-f8:16px", "--text-f9:18px", "--text-f10:20px", "--text-f10-5:21px", "--text-f11:22px",
  "--text-f11-5:23px", "--text-f12:24px", "--text-f12-5:25px", "--text-f13:26px", "--text-f13-5:27px",
  "--text-f14:28px", "--text-f15-5:31px", "--text-f16:32px", "--text-f17:34px", "--text-f18:36px",
  "--text-f20:40px", "--text-f21:42px", "--text-f24:48px", "--text-f27:54px", "--text-f64:128px"];
const SCALE_CSS = `:root{${SCALE_TOKENS.join(";")}}html{font-size:200%}`;

/* German is the TAUGHT target language, not one of the six interface locales,
   so the German profiles exercise German content with an interface locale. */
const PROFILES = {
  german: { lang: "en", scenario: "arzt", reply: "Guten Tag, Praxis Dr. Wagner. Wie kann ich Ihnen helfen?", hint: "Ich möchte einen Termin vereinbaren." },
  spanish: { lang: "es", scenario: "arzt", reply: "Guten Tag, Praxis Dr. Wagner. Wie kann ich Ihnen helfen?", hint: "Ich möchte einen Termin vereinbaren." },
  arabic: { lang: "ar", scenario: "arzt", reply: "Guten Tag, Praxis Dr. Wagner. Wie kann ich Ihnen helfen?", hint: "Ich möchte einen Termin vereinbaren." },
  "long-german": { lang: "en", scenario: "empfang", reply: "Guten Tag, Praxis Dr. Wagner. Brauchen Sie eine Krankschreibung für Ihren Arbeitgeber?", hint: "Ja, ich brauche eine Krankschreibung für meinen Arbeitgeber." }
};
const VIEWPORTS = [{ w: 390, h: 844 }, { w: 320, h: 568 }];
const SCALES = [1, 2];

const PNG = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAFElEQVR4AWP8z8Dwn4GBgQnEBgAOEwIB1n1FZQAAAABJRU5ErkJggg==", "base64");

const MEASURE_FN = String(function measure() {
  const de = document.documentElement, vw = de.clientWidth, vh = de.clientHeight;
  const q = (s) => document.querySelector(s);
  const box = (s) => {
    const e = q(s); if (!e) return null;
    const cs = getComputedStyle(e);
    if (cs.display === "none" || cs.visibility === "hidden" || e.classList.contains("hidden")) return null;
    const r = e.getBoundingClientRect();
    return r.width && r.height ? { x: +r.x.toFixed(1), y: +r.y.toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1), right: +r.right.toFixed(1), bottom: +r.bottom.toFixed(1) } : null;
  };
  const over = (a, b) => { if (!a || !b) return 0; const w = Math.min(a.right, b.right) - Math.max(a.x, b.x), h = Math.min(a.bottom, b.bottom) - Math.max(a.y, b.y); return w > 0 && h > 0 ? Math.round(w * h) : 0; };
  const SEL = { portrait: ".call-portrait.ok", marzi: ".call-marzi .vc-marzi-art", identity: "#callId",
    state: "#callStatus", charLine: "#vcSay", hint: "#vcBubble", controls: "#callControls",
    tools: ".call-tools", meta: ".call-meta", close: "#callMinBtn" };
  const boxes = {}; for (const [k, s] of Object.entries(SEL)) boxes[k] = box(s);
  /* the shell places the portrait's face fallback at top:30%, so that is the
     face region — taken from the application's own geometry, not invented */
  const band = (f) => boxes.portrait ? { x: boxes.portrait.x, y: boxes.portrait.y, right: boxes.portrait.right, bottom: boxes.portrait.y + boxes.portrait.h * f } : null;
  const face = band(0.30), upper45 = band(0.45);
  const reachable = (s) => { let e = q(s); while (e && e !== document.body) { const cs = getComputedStyle(e); if (/auto|scroll/.test(cs.overflowY) && e.scrollHeight > e.clientHeight + 1) return true; e = e.parentElement; } return false; };
  const outside = [];
  for (const [k, b] of Object.entries(boxes)) {
    if (!b) continue;
    if (b.x < -1 || b.y < -1 || b.right > vw + 1 || b.bottom > vh + 1) { if (!reachable(SEL[k])) outside.push(k); }
  }
  const targets = [...document.querySelectorAll('button,[role="button"],a[href],input')].filter((e) => {
    const cs = getComputedStyle(e); if (cs.display === "none" || cs.visibility === "hidden") return false;
    const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < vh;
  }).map((e) => { const r = e.getBoundingClientRect(), a = getComputedStyle(e, "::after");
    return { id: e.id || String(e.className).slice(0, 30),
      w: +Math.max(r.width, parseFloat(a.width) || 0, parseFloat(a.minWidth) || 0).toFixed(1),
      h: +Math.max(r.height, parseFloat(a.height) || 0).toFixed(1) }; });
  const small = targets.filter((t) => t.w < 47.5 || t.h < 47.5);
  const textIssues = [];
  for (const s of ["#callId", "#callId .call-id-name", "#callId .call-id-place", "#vcSay"]) {
    const e = q(s); if (!e) continue;
    const overX = e.scrollWidth > e.clientWidth + 1, overY = e.scrollHeight > e.clientHeight + 1;
    const cs = getComputedStyle(e);
    if (overX) textIssues.push({ selector: s, kind: "sideways-overflow", scrollWidth: e.scrollWidth, clientWidth: e.clientWidth });
    else if (overY && !/auto|scroll/.test(cs.overflowY)) textIssues.push({ selector: s, kind: "vertically-clipped", scrollHeight: e.scrollHeight, clientHeight: e.clientHeight });
    else if (overY) textIssues.push({ selector: s, kind: "owned-inner-scroll", owner: s, scrollHeight: e.scrollHeight, clientHeight: e.clientHeight });
    if (/ellipsis/.test(cs.textOverflow) && overX) textIssues.push({ selector: s, kind: "ellipsised" });
  }
  const scrollOwners = [...document.querySelectorAll(".callscreen *")].filter((e) => {
    const cs = getComputedStyle(e); return /auto|scroll/.test(cs.overflowY) && e.scrollHeight > e.clientHeight + 1;
  }).map((e) => e.id || String(e.className).slice(0, 34));
  const chip = q("#callStatus");
  return {
    direction: getComputedStyle(document.body).direction,
    rootFontSize: getComputedStyle(de).fontSize,
    identityFontSize: q("#callId .call-id-name") ? getComputedStyle(q("#callId .call-id-name")).fontSize : null,
    devicePixelRatio: window.devicePixelRatio,
    documentWidth: de.scrollWidth, viewportWidth: vw, documentHeight: de.scrollHeight, viewportHeight: vh,
    horizontalOverflowPx: Math.max(0, de.scrollWidth - vw),
    pageScrollX: Math.max(0, de.scrollWidth - de.clientWidth),
    pageScrollY: Math.max(0, de.scrollHeight - de.clientHeight),
    criticalBoxes: boxes, criticalBoxesOutsideViewport: outside.length, outsideNames: outside,
    visibleTargetCount: targets.length, visibleTargetsBelow48By48: small.length, smallTargets: small,
    marziFaceOverlapPx2: over(boxes.marzi, face), marziFaceOverlapCount: over(boxes.marzi, face) > 0 ? 1 : 0,
    marziUpper45OverlapPx2: over(boxes.marzi, upper45),
    marziCharLineOverlapPx2: over(boxes.marzi, boxes.charLine),
    marziIdentityOverlapPx2: over(boxes.marzi, boxes.identity),
    marziControlsOverlapPx2: over(boxes.marzi, boxes.controls),
    stateCharLineOverlapPx2: over(boxes.state, boxes.charLine),
    identityTextIssues: textIssues,
    innerScrollOwners: scrollOwners,
    stateName: chip ? chip.dataset.state : null,
    stateText: chip ? chip.textContent.trim() : null,
    stateHasIcon: chip ? Boolean(chip.querySelector("svg")) : false,
    liveRegionText: q("#callStatusLive") ? q("#callStatusLive").textContent : null,
    buildLabel: q("[data-marzi-build]") ? q("[data-marzi-build]").textContent.trim() : null,
    buildLabelAccessibleName: q("[data-marzi-build]") ? q("[data-marzi-build]").getAttribute("aria-label") : null,
    buildLabelPointerEvents: q("[data-marzi-build]") ? getComputedStyle(q("[data-marzi-build]")).pointerEvents : null,
    timerText: q("#timer") ? q("#timer").textContent : null,
    planAllowanceText: q("#vcLeft") ? q("#vcLeft").textContent : null,
    krankschreibungPresent: document.body.innerHTML.includes("Krankschreibung")
  };
});

async function browserEvidence(chromium, exePath) {
  const consoleLog = [], pageErrors = [], networkFailures = [];
  const visual = [], states = [], interactions = [], a11y = [];
  const browser = await chromium.launch({ executablePath: exePath });

  const ctxFor = async ({ w, h, profile, scale, reduced = false }) => {
    const P = PROFILES[profile];
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: true,
      reducedMotion: reduced ? "reduce" : "no-preference" });
    let providerCalls = 0;
    await ctx.route("**/api/avatar/**", (r) => r.fulfill({ status: 200, contentType: "image/png", body: PNG }));
    await ctx.route("**/api/tts**", (r) => { providerCalls++; return r.fulfill({ status: 404, body: "" }); });
    await ctx.route("**/api/chat", async (r) => {
      providerCalls++;
      const post = r.request().postData() || "";
      const body = /dictionary form/.test(post)
        ? { de: "die Krankschreibung", tr: "sick note" }
        : { reply: P.reply, suggestion: P.hint, speaker: "first", done: false };
      await new Promise((z) => setTimeout(z, 350));
      r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ content: [{ type: "text", text: JSON.stringify(body) }] }) });
    });
    await ctx.addInitScript(() => { window.SpeechRecognition = function () { this.start = () => {}; this.stop = () => {}; this.abort = () => {}; }; });
    const page = await ctx.newPage();
    const tag = `${w}x${h}/${profile}@${scale * 100}%`;
    page.on("console", (m) => { if (m.type() === "error") consoleLog.push({ case: tag, type: m.type(), text: redact(m.text()) }); });
    page.on("pageerror", (e) => pageErrors.push({ case: tag, message: redact(String(e.message)) }));
    page.on("requestfailed", (r) => networkFailures.push({ case: tag, url: redact(r.url()), failure: r.failure()?.errorText || null }));
    await page.goto(BASE_URL, { waitUntil: "domcontentloaded" });
    await page.evaluate(([lg, sc]) => {
      localStorage.clear();
      localStorage.setItem("marzi.settings.v1", JSON.stringify({ lang: lg, targetLang: "de", scenario: sc, level: "A1", sound: false }));
      localStorage.setItem("marzi.onboarding.v1", JSON.stringify({ version: 1, done: true, goal: "daily", dailyMin: 10 }));
      localStorage.setItem("marzi.stats.v1", JSON.stringify({ days: {}, xp: 1600, calls: 4, seconds: 300, coins: 1250 }));
    }, [P.lang, P.scenario]);
    await page.reload({ waitUntil: "domcontentloaded" });
    if (scale === 2) await page.addStyleTag({ content: SCALE_CSS });
    await page.waitForTimeout(500);
    return { ctx, page, tag, providerCalls: () => providerCalls };
  };
  const enterCall = async (page, ms = 1800) => {
    await page.evaluate(() => showTab("talk")); await page.waitForTimeout(200);
    await page.evaluate(() => document.getElementById("callBtn").click()); await page.waitForTimeout(ms);
  };
  const shot = async (page, dir, name, full = false) => {
    const rel = `screenshots/${dir}/${name}.png`;
    await page.screenshot({ path: path.join(ART, rel), fullPage: full });
    return { path: rel, sha256: sha256File(path.join(ART, rel)) };
  };

  /* ---- 10.1 sixteen-case core layout matrix ---- */
  for (const vp of VIEWPORTS) for (const scale of SCALES) for (const profile of Object.keys(PROFILES)) {
    const caseId = `${vp.w}x${vp.h}-${scale * 100}-${profile}`;
    const { ctx, page, tag, providerCalls } = await ctxFor({ ...vp, profile, scale });
    await enterCall(page);
    const m = await page.evaluate("(" + MEASURE_FN + ")()");
    const viewportShot = await shot(page, "layout", caseId + "-viewport");
    const fullShot = await shot(page, "layout", caseId + "-full", true);
    const snapshot = await page.accessibility.snapshot({ interestingOnly: true });
    write(`accessibility/${caseId}.json`, snapshot || {});
    a11y.push({ case: caseId, path: `accessibility/${caseId}.json`, nodeCount: JSON.stringify(snapshot || {}).length });
    write(`geometry/${caseId}.json`, m);

    const fails = [];
    if (m.horizontalOverflowPx > 0) fails.push("horizontalOverflowPx=" + m.horizontalOverflowPx);
    if (m.pageScrollX > 0) fails.push("pageScrollX=" + m.pageScrollX);
    if (m.pageScrollY > 0) fails.push("pageScrollY=" + m.pageScrollY);
    if (m.criticalBoxesOutsideViewport > 0) fails.push("outside=" + m.outsideNames.join(","));
    if (m.visibleTargetsBelow48By48 > 0) fails.push("smallTargets=" + JSON.stringify(m.smallTargets.slice(0, 4)));
    if (m.marziFaceOverlapCount > 0) fails.push("marziFaceOverlapPx2=" + m.marziFaceOverlapPx2);
    if (m.marziCharLineOverlapPx2 > 0) fails.push("marziCharLine=" + m.marziCharLineOverlapPx2);
    if (m.marziControlsOverlapPx2 > 0) fails.push("marziControls=" + m.marziControlsOverlapPx2);
    if (m.buildLabel !== BUILD_LABEL) fails.push("buildLabel=" + JSON.stringify(m.buildLabel));
    if (m.buildLabelPointerEvents !== "none") fails.push("buildLabelPointerEvents=" + m.buildLabelPointerEvents);
    for (const t of m.identityTextIssues) if (t.kind === "sideways-overflow" || t.kind === "vertically-clipped" || t.kind === "ellipsised") fails.push("text:" + t.selector + ":" + t.kind);
    if (profile === "long-german" && !m.krankschreibungPresent) fails.push("Krankschreibung absent");
    const errs = pageErrors.filter((e) => e.case === tag).length + consoleLog.filter((c) => c.case === tag).length;
    if (errs > 0) fails.push("browserErrorCount=" + errs);

    visual.push({
      case: caseId, viewport: `${vp.w}x${vp.h}`, textScale: scale === 2 ? "200%" : "100%",
      contentProfile: profile, interfaceLocale: PROFILES[profile].lang, scenario: PROFILES[profile].scenario,
      textScaleMethod: scale === 2 ? "all absolute type tokens doubled plus html{font-size:200%}" : "none",
      ...m, browserErrorCount: errs, providerCallCount: providerCalls(),
      viewportScreenshot: viewportShot, fullPageScreenshot: fullShot,
      accessibilityPath: `accessibility/${caseId}.json`, geometryPath: `geometry/${caseId}.json`,
      automatedResult: fails.length === 0 ? "PASS" : "FAIL", automatedFailures: fails,
      qualitativeReview: { requiredOf: "independent visual reviewer", result: "PENDING",
        note: "Numeric zeroes are necessary, not sufficient. A reviewer must open both screenshots at readable size and judge cramping, clipping, legibility and reachability." }
    });
    if (fails.length) changes("VISUAL_CRITERION_FAILED", caseId + ": " + fails.join("; "));
    await ctx.close();
  }

  /* ---- 10.2 six conversation states ---- */
  const stateRuns = [
    { vp: VIEWPORTS[0], scale: 1, only: null },
    { vp: VIEWPORTS[1], scale: 2, only: ["error", "disconnected"] }
  ];
  for (const run of stateRuns) {
    const { ctx, page } = await ctxFor({ ...run.vp, profile: "german", scale: run.scale });
    await enterCall(page, 2200);
    await page.evaluate(() => { S.handsFree = false; alertMsg(null); renderCallStatus(); });
    const drive = {
      ready: () => page.evaluate(() => { S.listening = false; S.busy = false; S.speaking = false; alertMsg(null); renderCallStatus(); }),
      listening: () => page.evaluate(() => { S.listening = true; renderCallStatus(); }),
      processing: () => page.evaluate(() => { S.listening = false; S.busy = true; renderCallStatus(); }),
      speaking: () => page.evaluate(() => { S.busy = false; S.speaking = true; renderCallStatus(); }),
      error: () => page.evaluate(() => { S.speaking = false; alertMsg("Synthetic verification error"); }),
      disconnected: () => page.evaluate(() => { alertMsg(null); S.session.end(); renderCallStatus(); })
    };
    for (const [want, go] of Object.entries(drive)) {
      if (run.only && !run.only.includes(want)) continue;
      await go(); await page.waitForTimeout(160);
      const m = await page.evaluate(() => {
        const c = document.getElementById("callStatus");
        const ctrl = (id) => { const e = document.getElementById(id); return e ? { present: true, disabled: Boolean(e.disabled), name: e.getAttribute("aria-label") || e.textContent.trim().slice(0, 40) } : { present: false }; };
        return { state: c.dataset.state, text: c.textContent.trim(), icon: Boolean(c.querySelector("svg")),
          live: document.getElementById("callStatusLive").textContent,
          background: getComputedStyle(c).backgroundColor,
          controls: { mic: ctrl("micBtn"), hangUp: ctrl("hangBtn"), replay: ctrl("playBtn"), transcript: ctrl("sheetBtn") },
          alertVisible: !document.getElementById("alert").classList.contains("hidden"),
          alertText: document.getElementById("alert").textContent.trim().slice(0, 60) };
      });
      const id = `${want}-${run.vp.w}x${run.vp.h}-${run.scale * 100}`;
      const s = await shot(page, "states", id);
      const fails = [];
      if (m.state !== want) fails.push("state=" + m.state);
      if (!m.icon) fails.push("no icon");
      if (!m.text) fails.push("no text label");
      if (m.live !== m.text) fails.push("live region says " + JSON.stringify(m.live));
      if ((want === "error" || want === "disconnected") && !m.controls.hangUp.present) fails.push("recovery control missing");
      states.push({ state: want, viewport: `${run.vp.w}x${run.vp.h}`, textScale: run.scale === 2 ? "200%" : "100%",
        ...m, screenshot: s, result: fails.length === 0 ? "PASS" : "FAIL", failures: fails });
      if (fails.length) changes("STATE_CRITERION_FAILED", id + ": " + fails.join("; "));
    }
    await ctx.close();
  }

  /* ---- 10.3 interaction evidence ---- */
  for (const profile of ["german", "arabic"]) {
    const { ctx, page, providerCalls } = await ctxFor({ ...VIEWPORTS[0], profile, scale: 1 });
    /* scenario selection: keyboard reaches the same path as pointer */
    await page.evaluate(() => showTab("talk")); await page.waitForTimeout(400);
    const before = await shot(page, "interactions", `scenario-before-${profile}`);
    const sel = await page.evaluate(async () => {
      const cards = [...document.querySelectorAll(".scn-card")];
      const other = cards.find((c) => c.getAttribute("aria-pressed") === "false");
      if (other) other.focus();
      const focusedId = document.activeElement.dataset.scn;
      const focusVisible = getComputedStyle(document.activeElement).outlineStyle !== "none";
      return { cards: cards.length, focusedId, focusVisible };
    });
    await page.keyboard.press("Enter"); await page.waitForTimeout(350);
    const selAfter = await page.evaluate(() => {
      const c = document.querySelector('.scn-card[aria-pressed="true"]');
      return { selectedId: c ? c.dataset.scn : null, ariaPressed: c ? c.getAttribute("aria-pressed") : null,
        nonColourCue: c ? getComputedStyle(c.querySelector(".scn-on")).display !== "none" : false,
        borderColor: c ? getComputedStyle(c).borderColor : null };
    });
    const after = await shot(page, "interactions", `scenario-after-${profile}`);
    interactions.push({ id: "scenario-keyboard-selection", profile, ...sel, ...selAfter,
      keyboardReachedSamePath: sel.focusedId === selAfter.selectedId,
      before, after, result: sel.focusedId === selAfter.selectedId && selAfter.ariaPressed === "true" && selAfter.nonColourCue ? "PASS" : "FAIL" });

    /* transcript, translation, slow repeat, normal replay, timer, plan */
    await enterCall(page, 2000);
    const r = await page.evaluate(async () => {
      const out = { voiceCalls: [], slowCalls: [] };
      const real = ENGINE.get.bind(ENGINE);
      const patched = Object.create(ENGINE.get("voice"));
      patched.speak = (a) => { out.voiceCalls.push({ slow: Boolean(a.slow), text: String(a.text).slice(0, 40) }); return Promise.resolve(); };
      ENGINE.get = (k) => (k === "voice" ? patched : real(k));
      out.replayReturned = replayLastCharacterLine();
      ENGINE.get = real;
      const origSpeak = window.speak;
      window.speak = (text, slow) => { out.slowCalls.push({ slow: Boolean(slow), text: String(text).slice(0, 40) }); };
      document.getElementById("repeatBtn").click();
      window.speak = origSpeak;
      document.getElementById("sheetBtn").click();
      await new Promise((z) => setTimeout(z, 400));
      const turns = [...document.querySelectorAll("#log .turn")];
      out.dialogOpen = !document.getElementById("callSheet").classList.contains("hidden");
      out.turnCount = turns.length;
      out.characterTurnFirst = turns.length > 0 && !turns[0].classList.contains("me");
      out.turnOwnership = turns.map((t) => ({ side: t.classList.contains("me") ? "learner" : "character",
        tag: (t.querySelector(".tag") || {}).textContent || "", x: Math.round(t.querySelector(".bub").getBoundingClientRect().x) }));
      out.direction = getComputedStyle(document.getElementById("log")).direction;
      out.wordButtons = document.querySelectorAll("#log .w").length;
      out.transcriptTextRendered = !/<script|onerror=/i.test(document.getElementById("log").innerHTML);
      out.timerText = document.getElementById("timer").textContent;
      out.planText = document.getElementById("vcLeft").textContent;
      return out;
    });
    const transcriptShot = await shot(page, "interactions", `transcript-${profile}`);
    /* focus containment inside the transcript dialog, then restoration */
    const focusTrap = await page.evaluate(async () => {
      const sheet = document.getElementById("callSheet");
      const inside = () => sheet.contains(document.activeElement);
      document.getElementById("sheetClose").focus();
      return { focusInsideDialog: inside(), dialogRole: sheet.getAttribute("role"), modal: sheet.getAttribute("aria-modal") };
    });
    const t0 = r.timerText;
    await page.waitForTimeout(2200);
    const t1 = await page.evaluate(() => document.getElementById("timer").textContent);
    /* word tap opens the existing translation path */
    await page.evaluate(() => { const w = document.querySelector("#log .w"); if (w) w.click(); });
    await page.waitForTimeout(900);
    const translated = await page.evaluate(() => { const e = document.querySelector("#log .wsave"); return e ? e.textContent.trim().slice(0, 60) : null; });
    const translationShot = await shot(page, "interactions", `translation-${profile}`);

    const fails = [];
    if (!r.replayReturned || r.voiceCalls.length !== 1 || r.voiceCalls[0].slow !== false) fails.push("normal replay did not go through the voice provider exactly once");
    if (r.slowCalls.length !== 1 || r.slowCalls[0].slow !== true) fails.push("slow repeat did not use the slow speech path");
    if (!r.characterTurnFirst || r.turnCount < 1) fails.push("transcript ownership/order wrong");
    if (!r.transcriptTextRendered) fails.push("transcript is not text-rendered");
    if (!translated) fails.push("word tap did not open translation");
    if (t0 === t1) fails.push("timer did not progress (" + t0 + " -> " + t1 + ")");
    if (!/\d/.test(r.planText)) fails.push("plan allowance not shown");
    if (profile === "arabic" && r.direction !== "rtl") fails.push("transcript direction is " + r.direction);

    interactions.push({ id: "call-interactions", profile, ...r, focusTrap,
      timerBefore: t0, timerAfter: t1, translationText: translated,
      providerCallCount: providerCalls(), transcriptShot, translationShot,
      result: fails.length === 0 ? "PASS" : "FAIL", failures: fails });
    if (fails.length) changes("INTERACTION_CRITERION_FAILED", profile + ": " + fails.join("; "));
    await ctx.close();
  }

  await browser.close();
  write("visual-results.json", { generatedAt: new Date().toISOString(), targetCommit: TARGET_COMMIT, caseCount: visual.length, cases: visual });
  write("accessibility-results.json", { generatedAt: new Date().toISOString(), snapshots: a11y });
  write("interaction-results.json", { generatedAt: new Date().toISOString(), interactions });
  write("browser-console.jsonl", consoleLog.map((l) => JSON.stringify(l)).join("\n") + "\n");
  write("page-errors.jsonl", pageErrors.map((l) => JSON.stringify(l)).join("\n") + "\n");
  write("network-failures.jsonl", networkFailures.map((l) => JSON.stringify(l)).join("\n") + "\n");
  write("states-results.json", { generatedAt: new Date().toISOString(), states });
  if (visual.length !== 16) blocked("VISUAL_MATRIX_INCOMPLETE", "expected 16 layout cases, produced " + visual.length);
  if (states.length !== 8) blocked("STATE_MATRIX_INCOMPLETE", "expected 8 state records, produced " + states.length);
  return { visual, states, interactions, consoleLog, pageErrors, networkFailures };
}

/* ================= main ================= */
(async () => {
  const started = Date.now();
  const prov = provenance();
  const checkouts = proveCheckouts();

  const env = { ...process.env,
    MARZI_URL: BASE_URL,
    MARZI_PLAYWRIGHT: path.join(CONTROL, "test/independent/marzi-063/node_modules/playwright-core"),
    CHROMIUM: prov.chromium ? prov.chromium.executablePath : "" };

  let server = null;
  if (prov.chromium && typeof prov.chromium.executablePath === "string" && prov.chromium.executablePath) {
    server = startServer();
    if (!(await waitForServer())) blocked("SERVER_UNAVAILABLE", "the local server from sut did not become healthy on " + BASE_URL);
  } else {
    blocked("BROWSER_ENVIRONMENT_UNAVAILABLE", "no pinned Chromium, so no browser gate can run; this is never downgraded to a skip");
  }

  const suiteResults = [];
  for (const s of SUITES) {
    if (s.browser && !(prov.chromium && typeof prov.chromium.executablePath === "string" && prov.chromium.executablePath)) {
      suiteResults.push({ id: s.id, command: s.cmd.join(" "), status: "BLOCKED", reason: "pinned Chromium unavailable" });
      blocked("SUITE_NOT_RUN", s.id + " could not run without the pinned browser");
      continue;
    }
    suiteResults.push(runSuite(s, env));
  }
  write("suite-results.json", { generatedAt: new Date().toISOString(), targetCommit: TARGET_COMMIT, suites: suiteResults });

  /* the documentation validator's nine known MARZI-GOV-001 failures are
     recorded by identity, never repaired here */
  const docs = suiteResults.find((s) => s.id === "control-docs-validate");
  if (docs && docs.logPath) {
    const text = fs.readFileSync(path.join(ART, docs.logPath), "utf8");
    const lines = text.split("\n").filter((l) => /missing field|must have exactly/.test(l));
    write("docs-validate-baseline.json", { failureCount: lines.length, failures: lines, expectedBaseline: 9, matchesBaseline: lines.length === 9 });
    if (lines.length !== 9) blocked("DOCS_VALIDATE_NEW_FAILURE", "expected the nine MARZI-GOV-001 baseline failures, found " + lines.length);
  }

  let evidence = { visual: [], states: [], interactions: [] };
  const chromiumReady = Boolean(prov.chromium && typeof prov.chromium.executablePath === "string" && prov.chromium.executablePath);
  if (chromiumReady && !problems.some((p) => p.code === "SERVER_UNAVAILABLE")) {
    try { evidence = await browserEvidence(require_(path.join(CONTROL, "test/independent/marzi-063/node_modules/playwright-core")).chromium, prov.chromium.executablePath); }
    catch (e) { blocked("BROWSER_EVIDENCE_FAILED", redact(e && e.stack ? e.stack.split("\n")[0] : String(e))); }
  }
  if (server) server.kill("SIGTERM");

  /* junit for CI surfaces */
  const cases = suiteResults.map((s) =>
    `    <testcase classname="marzi-063" name="${s.id}" time="${((s.durationMs || 0) / 1000).toFixed(2)}">` +
    (s.status === "PASS" ? "" : `<failure message="${s.status}">${(s.reason || "see suite-results.json")}</failure>`) + "</testcase>").join("\n");
  write("junit.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<testsuites>\n  <testsuite name="marzi-063-independent" tests="${suiteResults.length}" failures="${suiteResults.filter((s) => s.status !== "PASS").length}">\n${cases}\n  </testsuite>\n</testsuites>\n`);

  /* placeholders the deploy stage fills in; present so the manifest is complete */
  /* the browser records always exist; when the stage could not run they say so
     rather than going missing, so a reviewer sees WHY and the manifest is whole */
  for (const [name, body] of [
    ["visual-results.json", { status: "BLOCKED", reason: "the pinned browser stage did not run", caseCount: 0, cases: [] }],
    ["accessibility-results.json", { status: "BLOCKED", reason: "the pinned browser stage did not run", snapshots: [] }],
    ["interaction-results.json", { status: "BLOCKED", reason: "the pinned browser stage did not run", interactions: [] }],
    ["states-results.json", { status: "BLOCKED", reason: "the pinned browser stage did not run", states: [] }],
    ["browser-console.jsonl", JSON.stringify({ status: "BLOCKED", reason: "the pinned browser stage did not run" }) + "\n"],
    ["page-errors.jsonl", JSON.stringify({ status: "BLOCKED", reason: "the pinned browser stage did not run" }) + "\n"],
    ["network-failures.jsonl", JSON.stringify({ status: "BLOCKED", reason: "the pinned browser stage did not run" }) + "\n"],
    ["staging-smoke.json", { status: "NOT_RUN", reason: "post-deployment smoke runs only in the gated deploy job" }],
    ["production-non-change.json", { protectedMainExpected: PROTECTED_MAIN, protectedMainObserved: checkouts.mainSha || null,
      renderYamlChanged: false, productionDeployEventsDuringWindow: 0,
      note: "the verification job holds no production credential and only compares recorded identity" }],
    ["deploy-record.json", { status: "NOT_RUN", reason: "deployment is a separate protected-environment job" }],
    ["rollback-record.json", { status: "NOT_RUN", permittedTargets: ["prior successful staging deployment", PARENT_COMMIT] }]
  ]) if (!fs.existsSync(path.join(ART, name))) write(name, body);

  const summary = {
    generatedAt: new Date().toISOString(), durationMs: Date.now() - started,
    targetCommit: TARGET_COMMIT, controlCommit: prov.controlCommit, protectedMain: PROTECTED_MAIN,
    provenance: prov, checkouts,
    requiredCounts: { application: 51, learningContracts: 36, marzi061: 30, marzi062Package: 24, browserFull: 675, marzi062BrowserGroup: 107 },
    suites: suiteResults.map((s) => ({ id: s.id, command: s.command, exitCode: s.exitCode ?? null, expected: s.expected ?? null,
      total: s.total ?? null, passed: s.passed ?? null, failed: s.failed ?? null, status: s.status, logPath: s.logPath || null, logSha256: s.logSha256 || null })),
    visualCases: evidence.visual.length, stateCases: evidence.states.length, interactionCases: evidence.interactions.length,
    problems,
    verdict: problems.some((p) => p.severity === "BLOCKED") ? "BLOCKED"
      : problems.length ? "CHANGES REQUIRED" : "PASS"
  };
  write("verification-summary.json", summary);

  /* SHA256SUMS covers every uploaded file except itself */
  const all = [];
  (function walk(dir) {
    for (const e of fs.readdirSync(dir)) {
      const full = path.join(dir, e);
      if (fs.statSync(full).isDirectory()) walk(full);
      else if (path.relative(ART, full) !== "SHA256SUMS") all.push(path.relative(ART, full));
    }
  })(ART);
  write("SHA256SUMS", all.sort().map((rel) => sha256File(path.join(ART, rel)) + "  " + rel).join("\n") + "\n");

  const REQUIRED = ["provenance.json", "verification-summary.json", "suite-results.json", "junit.xml",
    "visual-results.json", "accessibility-results.json", "interaction-results.json", "browser-console.jsonl",
    "page-errors.jsonl", "network-failures.jsonl", "staging-smoke.json", "production-non-change.json",
    "deploy-record.json", "rollback-record.json", "SHA256SUMS"];
  const missing = REQUIRED.filter((f) => { const p = path.join(ART, f); return !fs.existsSync(p) || fs.statSync(p).size === 0; });
  if (missing.length) blocked("ARTIFACT_INCOMPLETE", "missing or empty: " + missing.join(", "));

  console.log("\nMARZI-063 independent verification: " + summary.verdict);
  console.log("artifact dir: " + ART + "  files: " + all.length + "  manifest sha256: " + sha256(fs.readFileSync(path.join(ART, "SHA256SUMS"))));
  for (const p of problems) console.log("  " + p.severity + "  " + p.code + ": " + p.detail);
  process.exit(problems.length ? 1 : 0);
})().catch((e) => { console.error("BLOCKED  RUNNER_CRASHED: " + redact(e && e.stack ? e.stack : String(e))); process.exit(1); });
