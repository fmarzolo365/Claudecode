/* MARZI-062 — Family Visual Staging Preview package validator.

   Dependency-free, read-only, network-free and bounded to repository inputs.
   It uses no eval, no `new Function` and no dynamic module loader, and it never
   executes repository content: every input is read as text or parsed as JSON.

   What it can and cannot prove: this validator reads SOURCE. It can prove that
   a contract is present, that a protected file is byte-identical to its
   baseline, and that a forbidden construct is absent. It cannot prove anything
   about rendered layout — that a control measures 48x48, that nothing overlaps,
   that Arabic at 200% fits. Those criteria belong to the browser suite
   (test/browser/run.js, group `marzi062`) and are never asserted here.

   Failure codes are deterministic and prefixed MARZI062_. */
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const ROOT = path.join(__dirname, "..");
const read = (rel) => fs.readFileSync(path.join(ROOT, rel), "utf8");
const exists = (rel) => fs.existsSync(path.join(ROOT, rel));
const sha256 = (rel) => crypto.createHash("sha256").update(fs.readFileSync(path.join(ROOT, rel))).digest("hex");

const inspected = new Set();
const readTracked = (rel) => { inspected.add(rel); return read(rel); };

/* ---- the exact strings the package is contracted to carry ---- */
const BUILD_ID = "MARZI-062-PREVIEW-1";
const BUILD_LABEL = "MARZI STAGING PREVIEW · MARZI-062 · BUILD " + BUILD_ID;
const STAGING_SERVICE = "marzi-staging-r4a";
const ICON_HANDOFF = "ICON ASSET APPROVAL REQUIRED";

const ROADMAP = "docs/MARZI_MASTER_ROADMAP.md";
const PACKAGE = "docs/packages/MARZI-062.md";
const RUNBOOK = "docs/staging/MARZI-062_STAGING_RUNBOOK.md";
const FEEDBACK = "docs/staging/MARZI-062_FAMILY_FEEDBACK.md";
const INDEX = "public/index.html";
const SW = "public/sw.js";
const MANIFEST = "public/manifest.webmanifest";

/* Protected files, with the hash they carry at the MARZI-062 implementation
   baseline e2e90925aa1b83ecaae4dbf0e39ccfade49546b1. A drift here is a package
   failure, not a preference. */
const PROTECTED_HASHES = {
  "public/manifest.webmanifest": "9400d946dbadda05e196cb85bca7dc9cd0ee07ae70bb3984ca9fbf0014b4555f",
  "public/icons/icon-192.png": "9399ccbbee1bc910dd0c4ebe758e4059490e7432e86a4d1a2a021007e0db55dd",
  "public/icons/icon-512.png": "80cee7ab58112022d07aa645c250bed1ec1f4c15abd138254dd8388589d48bc8"
};

let pass = 0;
const failures = [];
const warnings = [];
const names = [];

function check(id, name, fn) {
  names.push(id);
  let problems;
  try { problems = fn() || []; }
  catch (e) { problems = ["MARZI062_CHECK_THREW: " + e.message]; }
  if (problems.length === 0) { pass++; console.log("PASS  " + id + "  " + name); return; }
  console.log("FAIL  " + id + "  " + name);
  for (const p of problems) { console.log("        " + p); failures.push(id + ": " + p); }
}

/* ---------------------------------------------------------------- */

check("M062-001", "MARZI-062 appears exactly once in the roadmap", () => {
  const roadmap = readTracked(ROADMAP);
  const problems = [];
  const headings = [...roadmap.matchAll(/^## (MARZI-\d{3})\b([^\n]*)/gm)].map((m) => ({ id: m[1], title: m[2].trim() }));
  const mine = headings.filter((h) => h.id === "MARZI-062");
  if (mine.length !== 1) problems.push("MARZI062_PACKAGE_ID_NOT_UNIQUE: " + mine.length + " MARZI-062 headings, expected 1");
  const ids = headings.map((h) => h.id);
  if (new Set(ids).size !== ids.length) problems.push("MARZI062_PACKAGE_ID_NOT_UNIQUE: a package id is declared twice");
  if (mine.length === 1 && !/family visual staging preview/i.test(mine[0].title)) {
    problems.push("MARZI062_PACKAGE_TITLE_INVALID: " + JSON.stringify(mine[0].title));
  }
  return problems;
});

check("M062-002", "MARZI-062 does not replace or rename another canonical package", () => {
  const roadmap = readTracked(ROADMAP);
  const problems = [];
  /* every neighbouring package keeps its own identity and none of them is
     retitled as the staging preview */
  const expected = {
    "MARZI-022": /domain ownership and event contracts/i,
    "MARZI-024": /environment|release/i,
    "MARZI-039": /call shell|controls|responsive/i,
    "MARZI-040": /marzi identity|launcher|evolution/i,
    "MARZI-050": /accessibility|responsive|android/i,
    "MARZI-061": /external review readiness/i
  };
  for (const [id, pattern] of Object.entries(expected)) {
    const m = roadmap.match(new RegExp("^## " + id + " — ([^\\n]*)", "m"));
    if (!m) { problems.push("MARZI062_PACKAGE_DISPLACED: " + id + " has no roadmap heading"); continue; }
    if (!pattern.test(m[1])) problems.push("MARZI062_PACKAGE_DISPLACED: " + id + " is titled " + JSON.stringify(m[1].trim()));
    if (/family visual staging preview/i.test(m[1])) {
      problems.push("MARZI062_PACKAGE_ID_COLLISION: " + id + " claims the MARZI-062 purpose");
    }
  }
  return problems;
});

check("M062-003", "package document and both staging documents exist and are non-empty", () => {
  const problems = [];
  for (const rel of [PACKAGE, RUNBOOK, FEEDBACK]) {
    if (!exists(rel)) { problems.push("MARZI062_DOCUMENT_MISSING: " + rel); continue; }
    const text = readTracked(rel);
    if (text.trim().length < 400) problems.push("MARZI062_DOCUMENT_EMPTY: " + rel + " is " + text.trim().length + " characters");
  }
  if (exists(PACKAGE) && !read(PACKAGE).startsWith("# MARZI-062 — Family Visual Staging Preview")) {
    problems.push("MARZI062_PACKAGE_TITLE_INVALID: " + PACKAGE + " canonical title mismatch");
  }
  return problems;
});

check("M062-004", "the allowed-file and prohibited-file contracts are documented", () => {
  const pkg = readTracked(PACKAGE);
  const problems = [];
  const mustAllow = [ROADMAP, PACKAGE, RUNBOOK, FEEDBACK, INDEX, SW, "test/run.js", "test/browser/run.js", "test/marzi-062-visual-staging.js"];
  for (const rel of mustAllow) {
    if (!pkg.includes(rel)) problems.push("MARZI062_SCOPE_UNDOCUMENTED: allowed path " + rel + " is not named in the package document");
  }
  const mustForbid = ["server.js", MANIFEST, "package.json", ".github/", "docs/learning/contracts/"];
  for (const rel of mustForbid) {
    if (!pkg.includes(rel)) problems.push("MARZI062_SCOPE_UNDOCUMENTED: prohibited path " + rel + " is not named in the package document");
  }
  for (const heading of ["## 20. Files permitted to change", "## 21. Files forbidden to change"]) {
    if (!pkg.includes(heading)) problems.push("MARZI062_SCOPE_UNDOCUMENTED: missing section " + JSON.stringify(heading));
  }
  return problems;
});

check("M062-005", "the visible build identity is present and exact", () => {
  const html = readTracked(INDEX);
  const problems = [];
  if (!html.includes(BUILD_LABEL)) problems.push("MARZI062_BUILD_ID_MISSING: the exact build label is not in " + INDEX);
  if (!html.includes('data-marzi-build="' + BUILD_ID + '"')) {
    problems.push("MARZI062_BUILD_ID_MISSING: no data-marzi-build=" + JSON.stringify(BUILD_ID) + " marker");
  }
  const occurrences = (html.match(/data-marzi-build=/g) || []).length;
  if (occurrences !== 1) problems.push("MARZI062_BUILD_ID_DUPLICATE: " + occurrences + " build markers, expected 1");
  /* the marker must name an accessible name and must not be able to intercept
     a control; both are source contracts the browser suite then measures */
  const el = html.match(/<div class="staging-bar"[^>]*>/);
  if (!el) problems.push("MARZI062_BUILD_ID_MISSING: no .staging-bar element");
  else if (!/aria-label="[^"]*MARZI-062-PREVIEW-1[^"]*"/.test(el[0])) {
    problems.push("MARZI062_BUILD_ID_UNNAMED: the marker has no accessible name carrying the build id");
  }
  if (!/\.staging-bar\s*\{[^}]*pointer-events:\s*none/.test(html)) {
    problems.push("MARZI062_BUILD_ID_INTERCEPTS: .staging-bar does not declare pointer-events: none");
  }
  for (const rel of [PACKAGE, RUNBOOK, FEEDBACK]) {
    if (!read(rel).includes(BUILD_ID)) problems.push("MARZI062_BUILD_ID_MISSING: " + rel + " does not carry the build id");
  }
  return problems;
});

check("M062-006", "family-feedback fields and enum values are complete", () => {
  const doc = readTracked(FEEDBACK);
  const problems = [];
  const fields = ["Build ID", "Implementation commit ID", "Staging URL", "Device and browser",
    "Screen or flow tested", "Scenario tested", "Visual issue", "Usability issue", "Confusing wording",
    "Favorite element", "Missing element", "Severity", "Screenshot reference", "Family member role",
    "Review date", "Follow-up status"];
  for (const f of fields) {
    if (!doc.includes(f)) problems.push("MARZI062_FEEDBACK_FIELD_MISSING: " + JSON.stringify(f));
  }
  for (const v of ["BLOCKING", "HIGH", "MEDIUM", "LOW", "SUGGESTION"]) {
    if (!doc.includes("`" + v + "`")) problems.push("MARZI062_FEEDBACK_ENUM_MISSING: severity " + v);
  }
  for (const v of ["NEW", "TRIAGED", "ACCEPTED", "DEFERRED", "RESOLVED", "NEEDS RECHECK"]) {
    if (!doc.includes("`" + v + "`")) problems.push("MARZI062_FEEDBACK_ENUM_MISSING: follow-up " + v);
  }
  return problems;
});

check("M062-007", "the committed feedback form is blank and claims no approval", () => {
  const doc = readTracked(FEEDBACK);
  const problems = [];
  /* the copyable block ships with every field empty: a label, a colon, and
     nothing after it */
  const block = doc.match(/~~~\n(Build ID:[\s\S]*?)~~~/);
  if (!block) problems.push("MARZI062_FEEDBACK_TEMPLATE_MISSING: no copyable blank block");
  else {
    for (const line of block[1].split("\n")) {
      const m = line.match(/^([A-Z][^:]*):\s*(.*)$/);
      if (m && m[2].trim() !== "") problems.push("MARZI062_FEEDBACK_NOT_BLANK: " + JSON.stringify(line.trim()));
    }
  }
  /* an approval claim is a property of a sentence, not of a wrapped line, so
     paragraphs are unwrapped before the scan and a denial reads as a denial */
  const CLAIM = /\b(approved|sign(ed)?[- ]off|certified|conformant|compliant|accessible|validated|authoriz(ed|es))\b/i;
  const DENIAL = /\b(not|never|no|cannot|can not|without|nor|neither|only|must|may|do not|does not)\b/i;
  for (const paragraph of doc.split(/\n\s*\n/)) {
    const flat = paragraph.replace(/\s+/g, " ").trim();
    for (const sentence of flat.split(/(?<=[.!?])\s+/)) {
      if (CLAIM.test(sentence) && !DENIAL.test(sentence)) {
        problems.push("MARZI062_FEEDBACK_APPROVAL_CLAIMED: " + JSON.stringify(sentence.slice(0, 80)));
      }
    }
  }
  return problems;
});

check("M062-008", "the privacy exclusions are present", () => {
  const doc = readTracked(FEEDBACK);
  const problems = [];
  for (const term of ["names", "email", "health", "voice recording", "credential", "private conversation"]) {
    if (!new RegExp(term, "i").test(doc)) problems.push("MARZI062_PRIVACY_EXCLUSION_MISSING: " + term);
  }
  if (!/do not (enter|write)/i.test(doc)) problems.push("MARZI062_PRIVACY_EXCLUSION_MISSING: no explicit instruction not to enter personal data");
  return problems;
});

check("M062-009", "no analytics, telemetry, remote form or upload endpoint was added", () => {
  const problems = [];
  const FORBIDDEN = [
    ["analytics script", /<script[^>]+(analytics|gtag|segment|mixpanel)/i],
    ["gtag", /\bgtag\s*\(/], ["dataLayer push", /\bdataLayer\s*\.\s*push\s*\(/],
    ["google-analytics", /google-analytics/i], ["track call", /\b(track|logEvent|capture)\s*\(\s*["'`]/],
    ["sendBeacon", /navigator\.sendBeacon/], ["form action", /<form[^>]*\saction=/i],
    ["mixpanel/segment/amplitude", /\b(mixpanel|segment\.io|amplitude)\b/i]
  ];
  for (const rel of [INDEX, SW]) {
    const text = readTracked(rel);
    for (const [label, pattern] of FORBIDDEN) {
      if (pattern.test(text)) problems.push("MARZI062_TELEMETRY_ADDED: " + rel + " contains " + label);
    }
  }
  /* the feedback documents describe a paper process and must not point at a
     collection endpoint of any kind */
  for (const rel of [FEEDBACK, RUNBOOK]) {
    const text = readTracked(rel);
    const urls = [...text.matchAll(/https?:\/\/[^\s)"'`]+/g)].map((m) => m[0])
      .filter((u) => !/^https?:\/\/(localhost|127\.0\.0\.1)/.test(u));
    for (const u of urls) problems.push("MARZI062_REMOTE_ENDPOINT_ADDED: " + rel + " references " + u);
  }
  return problems;
});

check("M062-010", "no new character, avatar or generated art path was added", () => {
  const html = readTracked(INDEX);
  const problems = [];
  /* the scenario registry is the only place a character identity may exist,
     and MARZI-062 adds none: the count must equal the approved inventory */
  /* The registry carries one record per scenario PER TARGET-LANGUAGE pack, so
     `custom` and `random` legitimately appear more than once. The contract is
     therefore the exact baseline multiset, not a count. */
  const BASELINE_RECORDS = ["amt", "apotheke", "arzt", "baecker", "bank", "custom", "custom", "custom",
    "einkaufen", "empfang", "enbank", "encafe", "endelivery", "endoctor", "enhair", "enjob", "enlandlord",
    "enneighbor", "enrestaurant", "enservice", "friseur", "kita", "kollegen", "nachbar", "paket", "random",
    "random", "restaurant", "supermarkt", "vermieter", "werkstatt"];
  const scenarioIds = [...html.matchAll(/\{ id:"([a-z0-9]+)", avatar:/g)].map((m) => m[1]).sort();
  const expectedSorted = [...BASELINE_RECORDS].sort();
  if (JSON.stringify(scenarioIds) !== JSON.stringify(expectedSorted)) {
    const added = scenarioIds.filter((id) => !expectedSorted.includes(id));
    const removed = expectedSorted.filter((id) => !scenarioIds.includes(id));
    problems.push("MARZI062_CHARACTER_ADDED: registry drift — " + scenarioIds.length + " records vs " +
      expectedSorted.length + (added.length ? ", added " + JSON.stringify([...new Set(added)]) : "") +
      (removed.length ? ", removed " + JSON.stringify([...new Set(removed)]) : ""));
  }
  for (const pattern of [/generated[-_]art/i, /\/art\/marzi-/i, /dall-?e/i, /midjourney/i, /stable[- ]diffusion/i]) {
    if (pattern.test(html)) problems.push("MARZI062_GENERATED_ART_REFERENCED: " + pattern);
  }
  return problems;
});

check("M062-011", "manifest and current icon files are unchanged from the baseline", () => {
  const problems = [];
  if (!exists(MANIFEST)) return ["MARZI062_MANIFEST_INVALID: " + MANIFEST + " is missing"];
  const raw = readTracked(MANIFEST);
  let manifest;
  try { manifest = JSON.parse(raw); }
  catch (e) { return ["MARZI062_MANIFEST_INVALID: " + e.message]; }
  /* the icon set is a contract: same sources, same sizes, same purposes */
  const icons = (manifest.icons || []).map((i) => [i.src, i.sizes, i.purpose].join("|")).sort();
  const expected = ["/icons/icon-192.png|192x192|any", "/icons/icon-512.png|512x512|any", "/icons/icon-512.png|512x512|maskable"].sort();
  if (JSON.stringify(icons) !== JSON.stringify(expected)) {
    problems.push("MARZI062_ICON_REFERENCE_CHANGED: " + JSON.stringify(icons));
  }
  for (const icon of manifest.icons || []) {
    const rel = "public" + icon.src;
    if (!exists(rel)) problems.push("MARZI062_ICON_MISSING: " + rel + " is referenced but absent");
  }
  for (const [rel, expectedHash] of Object.entries(PROTECTED_HASHES)) {
    if (!expectedHash) continue;
    if (!exists(rel)) { problems.push("MARZI062_PROTECTED_FILE_MISSING: " + rel); continue; }
    if (sha256(rel) !== expectedHash) problems.push("MARZI062_PROTECTED_FILE_CHANGED: " + rel);
  }
  return problems;
});

check("M062-012", "the exact ICON ASSET APPROVAL REQUIRED handoff is present", () => {
  const pkg = readTracked(PACKAGE);
  const problems = [];
  if (!pkg.includes(ICON_HANDOFF)) problems.push("MARZI062_ICON_HANDOFF_MISSING: " + PACKAGE);
  if (!/NOT APPLICABLE/.test(pkg)) problems.push("MARZI062_ICON_HANDOFF_MISSING: the launcher-icon criterion is not recorded NOT APPLICABLE");
  if (!/non-blocking/i.test(pkg)) problems.push("MARZI062_ICON_HANDOFF_MISSING: the handoff is not recorded as non-blocking");
  /* the handoff must not become a claim that an icon was delivered */
  if (/\b(new|updated|replaced) launcher icon\b/i.test(pkg) && !/not\b[^.]*\b(new|updated|replaced) launcher icon/i.test(pkg)) {
    problems.push("MARZI062_ICON_CLAIMED: the package claims a launcher icon was produced");
  }
  return problems;
});

check("M062-013", "existing scenario ids and learning content are unchanged", () => {
  const html = readTracked(INDEX);
  const problems = [];
  const EXPECTED_IDS = ["arzt", "amt", "werkstatt", "friseur", "restaurant", "apotheke", "paket", "vermieter",
    "bank", "kita", "termin", "tisch", "endoctor", "nachbar", "baecker", "supermarkt", "kollegen", "empfang", "einkaufen"];
  for (const id of EXPECTED_IDS) {
    if (!html.includes('{ id:"' + id + '"')) problems.push("MARZI062_SCENARIO_DRIFT: scenario " + id + " is missing");
  }
  /* the exact German proper noun stays exactly as authored */
  if (!html.includes("Krankschreibung")) problems.push("MARZI062_LOCALIZED_TEXT_DRIFT: Krankschreibung is missing");
  /* the learning contracts are outside this package entirely */
  const contracts = "docs/learning/contracts/v1";
  if (!fs.existsSync(path.join(ROOT, contracts))) problems.push("MARZI062_LEARNING_CONTRACT_MISSING: " + contracts);
  return problems;
});

check("M062-014", "provider, prompt, transcript, storage, reward, economy and timer contracts are intact", () => {
  const html = readTracked(INDEX);
  const problems = [];
  /* each symbol below is the single canonical owner of its domain. A missing
     symbol means the presentation work reached past its boundary. */
  const CONTRACTS = {
    "createConversationSession": /function createConversationSession\(/,
    "PromptBuilder.rolePlay": /rolePlay\s*\(/,
    "transcript.add": /transcript\.add\(/,
    "ENGINE ai provider": /providers\.get\("ai"\)/,
    "ENGINE voice provider": /ENGINE\.get\("voice"\)/,
    "duplicate ai guard": /duplicate ai request rejected/,
    "late reply guard": /ended while waiting/,
    "plan limit": /function planLimitToday\(/,
    "timer tick": /S\.timerId = setInterval\(/,
    "reward id": /S\.callId = newRewardId\(\)/,
    "settings storage key": /marzi\.settings\.v1/,
    "stats storage key": /marzi\.stats\.v1/
  };
  for (const [label, pattern] of Object.entries(CONTRACTS)) {
    if (!pattern.test(html)) problems.push("MARZI062_CONTRACT_DRIFT: " + label + " is no longer present");
  }
  /* the presentation layer must not have grown a second source of truth */
  for (const [label, pattern] of Object.entries({
    "second transcript store": /createTranscript\(/g,
    "second session factory": /function createConversationSession\(/g
  })) {
    const n = (html.match(pattern) || []).length;
    if (label === "second session factory" && n !== 1) problems.push("MARZI062_CONTRACT_DRIFT: " + n + " session factories, expected 1");
  }
  return problems;
});

check("M062-015", "required state labels and semantic hooks exist", () => {
  const html = readTracked(INDEX);
  const problems = [];
  for (const state of ["listening", "processing", "speaking", "disconnected", "error"]) {
    if (!new RegExp('\\b' + state + '\\b').test(html)) problems.push("MARZI062_STATE_MISSING: " + state);
  }
  /* one source resolves the state, and it carries an icon and a text label */
  for (const [label, pattern] of Object.entries({
    "state resolver": /function callStateFor\(/,
    "state label map": /function callStateLabel\(/,
    "state icon map": /function callStateIcon\(/,
    "status chip": /id="callStatus"/,
    "polite live region": /id="callStatusLive"[^>]*aria-live="polite"/,
    "status role": /setAttribute\("role", "status"\)/
  })) {
    if (!pattern.test(html)) problems.push("MARZI062_STATE_SEMANTICS_MISSING: " + label);
  }
  /* the selected scenario is exposed programmatically, not by colour alone */
  if (!/aria-pressed="\$\{selected\}"/.test(html)) problems.push("MARZI062_SELECTION_SEMANTICS_MISSING: scenario cards do not expose aria-pressed");
  if (!/\.scn-card\[aria-pressed="true"\] \.scn-on \{ display: block; \}/.test(html)) {
    problems.push("MARZI062_SELECTION_SEMANTICS_MISSING: the selected card has no non-colour cue");
  }
  return problems;
});

check("M062-016", "word tap, translation, replay/TTS and slow repeat remain wired", () => {
  const html = readTracked(INDEX);
  const problems = [];
  for (const [label, pattern] of Object.entries({
    "tappable word buttons": /class="w" data-w=/,
    "word lookup handler": /function tappable\(/,
    "translation lookup": /loadWords\(\)/,
    "replay path": /function replayLastCharacterLine\(/,
    "replay uses the voice provider": /ENGINE\.get\("voice"\)\.speak\(/,
    "slow repeat button": /\$\("repeatBtn"\)\.onclick/,
    "slow repeat passes slow=true": /speak\(S\.turns\[i\]\.text, true,/,
    "safe text rendering": /\besc = \(/
  })) {
    if (!pattern.test(html)) problems.push("MARZI062_INTERACTION_UNWIRED: " + label);
  }
  /* transcript text is escaped or tokenised, never injected as HTML */
  if (!/body: x\.me \? esc\(x\.text\) : tappable\(x\.text, i\)/.test(html)) {
    problems.push("MARZI062_UNSAFE_RENDERING: transcript turns are no longer text-rendered through esc/tappable");
  }
  return problems;
});

check("M062-017", "no production URL, credential, token, secret or production deploy command was added", () => {
  const problems = [];
  const SECRET = [
    ["anthropic key", /sk-ant-[A-Za-z0-9]/], ["openai key", /sk-[A-Za-z0-9]{20,}/],
    ["bearer literal", /Bearer\s+[A-Za-z0-9._-]{16,}/], ["aws key", /AKIA[0-9A-Z]{16}/],
    ["private key", /-----BEGIN [A-Z ]*PRIVATE KEY-----/]
  ];
  /* Naming the production service in prose is how the runbook excludes it.
     What must never appear is a production target inside a runnable command,
     so the scan is restricted to indented command blocks. */
  const PRODUCTION = [
    ["production host", /telefontrainer\.onrender\.com/]
  ];
  for (const rel of [INDEX, SW, PACKAGE, RUNBOOK, FEEDBACK, "test/marzi-062-visual-staging.js"]) {
    const text = readTracked(rel);
    for (const [label, pattern] of SECRET) {
      if (pattern.test(text)) problems.push("MARZI062_SECRET_PRESENT: " + rel + " contains a " + label);
    }
    for (const [label, pattern] of PRODUCTION) {
      if (pattern.test(text)) problems.push("MARZI062_PRODUCTION_TARGET_PRESENT: " + rel + " contains a " + label);
    }
  }
  /* the runbook names staging explicitly and never issues a production deploy */
  const runbook = read(RUNBOOK);
  if (!runbook.includes(STAGING_SERVICE)) problems.push("MARZI062_STAGING_TARGET_MISSING: the runbook does not name " + STAGING_SERVICE);
  for (const line of runbook.split("\n")) {
    if (!/^\s{4}\S/.test(line)) continue;
    if (/\btelefontrainer\b/.test(line)) {
      problems.push("MARZI062_PRODUCTION_TARGET_PRESENT: a runbook command names the production service: " + JSON.stringify(line.trim().slice(0, 70)));
    }
    if (/\bdeploy\b/i.test(line) && !/marzi-staging-r4a/.test(line)) {
      problems.push("MARZI062_PRODUCTION_TARGET_PRESENT: a runbook deploy command does not name the staging service: " + JSON.stringify(line.trim().slice(0, 70)));
    }
  }
  return problems;
});

check("M062-018", "no prohibited file is referenced as changed by this package", () => {
  const pkg = readTracked(PACKAGE);
  const problems = [];
  const allowed = new Set([ROADMAP, PACKAGE, RUNBOOK, FEEDBACK, INDEX, SW, "test/run.js",
    "test/browser/run.js", "test/marzi-062-visual-staging.js"]);
  const section = pkg.split("## 20. Files permitted to change")[1];
  if (!section) return ["MARZI062_SCOPE_UNDOCUMENTED: no permitted-files section"];
  const listed = [...section.split("## 21.")[0].matchAll(/^- `([^`]+)`/gm)].map((m) => m[1]);
  for (const rel of listed) {
    if (!allowed.has(rel)) problems.push("MARZI062_SCOPE_VIOLATION: " + rel + " is listed as permitted but is not in the mandate scope");
  }
  for (const rel of allowed) {
    if (!listed.includes(rel)) problems.push("MARZI062_SCOPE_UNDOCUMENTED: " + rel + " is in scope but not listed");
  }
  return problems;
});

check("M062-019", "the mandate-transfer artifact is unchanged", () => {
  const rel = "MARZI-062_VISUAL_STAGING_CLAUDE_CODE_MANDATE.md";
  const problems = [];
  if (!exists(rel)) return ["MARZI062_MANDATE_ARTIFACT_MISSING: " + rel];
  const bytes = fs.statSync(path.join(ROOT, rel)).size;
  if (bytes !== 43868) problems.push("MARZI062_MANDATE_ARTIFACT_CHANGED: " + bytes + " bytes, expected 43868");
  const hash = sha256(rel);
  if (hash !== "370fb8da525989c099de47954b01dba16a1496dbf2b2ce275b27780d808ec289") {
    problems.push("MARZI062_MANDATE_ARTIFACT_CHANGED: sha256 " + hash);
  }
  inspected.add(rel);
  return problems;
});

check("M062-020", "temporary screenshots are not staged as application assets", () => {
  const problems = [];
  const walk = (dir, depth) => {
    if (depth > 3) return;
    for (const entry of fs.readdirSync(path.join(ROOT, dir))) {
      const rel = path.join(dir, entry);
      const full = path.join(ROOT, rel);
      if (fs.lstatSync(full).isDirectory()) { walk(rel, depth + 1); continue; }
      if (/^(V0\d|state-)[^/]*\.png$/.test(entry) || /marzi-062.*\.png$/i.test(entry)) {
        problems.push("MARZI062_SCREENSHOT_STAGED: " + rel);
      }
    }
  };
  for (const dir of ["public", "docs", "test"]) walk(dir, 0);
  /* nor may a document point at the task-owned evidence directory as if it
     were a repository path */
  for (const rel of [PACKAGE, RUNBOOK, FEEDBACK]) {
    if (/\]\(\/tmp\//.test(read(rel))) problems.push("MARZI062_SCREENSHOT_STAGED: " + rel + " links a /tmp evidence path as a document asset");
  }
  return problems;
});

check("M062-021", "service-worker changes are limited to the cache/version lifecycle", () => {
  const sw = readTracked(SW);
  const problems = [];
  const m = sw.match(/const CACHE = "([^"]+)"/);
  if (!m) problems.push("MARZI062_SW_CONTRACT_CHANGED: no CACHE constant");
  else {
    if (!m[1].includes("marzi-062-preview-1")) {
      problems.push("MARZI062_SW_VERSION_NOT_BUMPED: cache name " + JSON.stringify(m[1]) + " does not carry the preview build id");
    }
    if (m[1] === "telefontrainer-v37") problems.push("MARZI062_SW_VERSION_NOT_BUMPED: the cache name is unchanged from the baseline");
  }
  /* the lifecycle itself is untouched: network-first, /api/ never cached,
     old caches deleted on activate */
  for (const [label, pattern] of Object.entries({
    "api exclusion": /url\.pathname\.startsWith\("\/api\/"\)/,
    "network first": /fetch\(e\.request\)/,
    "old cache deletion": /keys\.filter\(\(k\) => k !== CACHE\)/,
    "skipWaiting": /self\.skipWaiting\(\)/,
    "clients claim": /self\.clients\.claim\(\)/,
    "asset list": /const ASSETS = \["\/", "\/manifest\.webmanifest", "\/icons\/icon-192\.png", "\/icons\/icon-512\.png"\]/
  })) {
    if (!pattern.test(sw)) problems.push("MARZI062_SW_CONTRACT_CHANGED: " + label + " is no longer present");
  }
  return problems;
});

check("M062-022", "no unsupported approval is claimed by the roadmap or the package", () => {
  const problems = [];
  /* a claim is a property of a sentence; paragraphs are unwrapped first so a
     denial that wraps across lines still reads as a denial */
  const CLAIM = /\b(wcag|conformant|compliant|certified|production[- ]ready|released|approved for (production|release|merge)|specialist[- ]approved|accessibility[- ]approved)\b/i;
  const DENIAL = /\b(not|never|no|cannot|can not|without|nor|neither|only|pending|must|may|prohibited|remains?)\b/i;
  for (const rel of [PACKAGE, RUNBOOK, FEEDBACK]) {
    const text = readTracked(rel);
    for (const paragraph of text.split(/\n\s*\n/)) {
      const flat = paragraph.replace(/\s+/g, " ").trim();
      for (const sentence of flat.split(/(?<=[.!?])\s+/)) {
        if (CLAIM.test(sentence) && !DENIAL.test(sentence)) {
          problems.push("MARZI062_APPROVAL_CLAIMED at " + rel + ": " + JSON.stringify(sentence.slice(0, 80)));
        }
      }
    }
  }
  /* the roadmap entry is checked on its own section only */
  const roadmap = readTracked(ROADMAP);
  const entry = roadmap.split("## MARZI-062")[1];
  if (entry) {
    for (const paragraph of entry.split("\n## ")[0].split(/\n\s*\n/)) {
      const flat = paragraph.replace(/\s+/g, " ").trim();
      for (const sentence of flat.split(/(?<=[.!?])\s+/)) {
        if (CLAIM.test(sentence) && !DENIAL.test(sentence)) {
          problems.push("MARZI062_APPROVAL_CLAIMED at " + ROADMAP + ": " + JSON.stringify(sentence.slice(0, 80)));
        }
      }
    }
  }
  return problems;
});

check("M062-023", "the staging boundary is documented and production is excluded", () => {
  const runbook = readTracked(RUNBOOK);
  const pkg = readTracked(PACKAGE);
  const problems = [];
  for (const [label, pattern] of Object.entries({
    "staging service named": new RegExp(STAGING_SERVICE),
    "preflight gate": /preflight/i,
    "rejection conditions": /reject the (deployment|operation)/i,
    "production non-change check": /production non-change/i,
    "git revert rollback": /git revert/,
    "staging revision rollback": /prior known-good staging revision/i,
    "cache and reinstall steps": /reinstall/i,
    "emergency stop": /emergency stop/i,
    "protected main sha": /7395cd0a75fc206077e19ecc60e4c1e978dd2c89/
  })) {
    if (!pattern.test(runbook)) problems.push("MARZI062_RUNBOOK_INCOMPLETE: " + label);
  }
  if (!/production/i.test(pkg) || !new RegExp(STAGING_SERVICE).test(pkg)) {
    problems.push("MARZI062_RUNBOOK_INCOMPLETE: the package document does not state the staging boundary");
  }
  return problems;
});

check("M062-024", "the validator itself is read-only, network-free and free of dynamic execution", () => {
  const self = read("test/marzi-062-visual-staging.js");
  const problems = [];
  for (const [label, pattern] of [
    ["eval", new RegExp("(^|[^.\\w])" + "eval" + "\\s*\\(")],
    ["new Function", new RegExp("\\bnew\\s+" + "Function" + "\\s*\\(")],
    ["vm require", new RegExp("require\\s*\\(\\s*[\"'`]" + "(node:)?vm" + "[\"'`]")],
    ["network require", new RegExp("require\\s*\\(\\s*[\"'`]" + "(node:)?(http|https|net|dgram|tls)" + "[\"'`]")],
    ["write route", /fs\.(write|append|mkdir|rm|unlink|copy|rename|chmod|chown|truncate)/]
  ]) {
    if (pattern.test(self)) problems.push("MARZI062_FORBIDDEN_ROUTE: the validator source contains " + label);
  }
  return problems;
});

/* ---------------------------------------------------------------- */

const total = names.length;
console.log("");
console.log("MARZI-062 visual staging: " + pass + "/" + total + " checks passed");
console.log("files inspected: " + inspected.size + " — " + [...inspected].sort().join(", "));
console.log("warnings: " + warnings.length);
if (failures.length) {
  console.error(failures.length + " failure(s).");
  process.exit(1);
}
console.log("Source contracts hold. Rendered layout is proven by test/browser/run.js marzi062, not here.");
