/* MARZI-063 — staging infrastructure and browser-verification package validator.
 *
 * Dependency-free, read-only, network-free. No eval, no `new Function`, no vm,
 * no dynamic execution of repository content: every input is read as text or
 * parsed as JSON.
 *
 * What it proves and what it cannot: it reads SOURCE. It can prove that the
 * staging declaration names only the staging service, that the deploy script
 * has no service argument, that the workflow pins every action by commit SHA,
 * and that production files are byte-identical to their baseline. It cannot
 * prove that a Render service exists, that a deployment happened, or that a
 * screenshot looks right. Those belong to the independent runner and to a human
 * reviewer, and are never asserted here.
 *
 * Failure codes are deterministic and prefixed MARZI063_.
 */
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

/* ---- immutable identities this package is contracted to carry ---- */
const TARGET_COMMIT = "d75a10bb96e83045090190777dda5c8a692bed55";
const PARENT_COMMIT = "e2e90925aa1b83ecaae4dbf0e39ccfade49546b1";
const PROTECTED_MAIN = "7395cd0a75fc206077e19ecc60e4c1e978dd2c89";
const STAGING_SERVICE = "marzi-staging-r4a";
const PRODUCTION_SERVICE = "telefontrainer";
const PRODUCTION_URL = "https://telefontrainer.onrender.com";
const BRANCH = "claude/marzi-017-product-refinement";
const BUILD_ID = "MARZI-062-PREVIEW-1";

const ROADMAP = "docs/MARZI_MASTER_ROADMAP.md";
const REGISTER = "docs/MARZI_DECISION_REGISTER.md";
const PACKAGE = "docs/packages/MARZI-063.md";
const RUNBOOK = "docs/staging/MARZI-063_STAGING_INFRA_BROWSER_RUNBOOK.md";
const HANDOFF = "docs/staging/MARZI-063_INDEPENDENT_REVIEW_HANDOFF.md";
const WORKFLOW = ".github/workflows/marzi-063-independent-staging.yml";
const DEPLOY_SCRIPT = ".github/scripts/marzi-063-render-staging.mjs";
const BLUEPRINT = "render.staging.yaml";
const RUNNER = "test/independent/marzi-063/run.mjs";
const TOOL_PKG = "test/independent/marzi-063/package.json";
const TOOL_LOCK = "test/independent/marzi-063/package-lock.json";

/* The production Blueprint's hash at the MARZI-063 baseline a83422b. A drift
   here is a package failure, not a preference. */
const PRODUCTION_RENDER_YAML_SHA256 = "f710e1c0d1b1aab517da73aa355bf8e535240fe0edc8c9357acdcbc193c6dbab";

let pass = 0;
const failures = [];
const ids = [];

function check(id, name, fn) {
  ids.push(id);
  let problems;
  try { problems = fn() || []; }
  catch (e) { problems = ["MARZI063_CHECK_THREW: " + e.message]; }
  if (problems.length === 0) { pass++; console.log("PASS  " + id + "  " + name); return; }
  console.log("FAIL  " + id + "  " + name);
  for (const p of problems) { console.log("        " + p); failures.push(id + ": " + p); }
}

/* ---------------------------------------------------------------- */

check("M063-001", "MARZI-063 is allocated exactly once and displaces no package", () => {
  const roadmap = readTracked(ROADMAP);
  const problems = [];
  const headings = [...roadmap.matchAll(/^## (MARZI-\d{3}) — ([^\n]*)/gm)].map((m) => ({ id: m[1], title: m[2].trim() }));
  const mine = headings.filter((h) => h.id === "MARZI-063");
  if (mine.length !== 1) problems.push("MARZI063_ALLOCATION_NOT_UNIQUE: " + mine.length + " MARZI-063 headings, expected 1");
  const all = headings.map((h) => h.id);
  if (new Set(all).size !== all.length) problems.push("MARZI063_ALLOCATION_NOT_UNIQUE: a package id is declared twice");
  /* the packages this one depends on must keep their own identity */
  for (const [id, pattern] of Object.entries({
    "MARZI-022": /domain ownership/i, "MARZI-061": /external review readiness/i,
    "MARZI-062": /family visual staging preview/i
  })) {
    const m = roadmap.match(new RegExp("^## " + id + " — ([^\\n]*)", "m"));
    if (!m) problems.push("MARZI063_PACKAGE_DISPLACED: " + id + " has no heading");
    else if (!pattern.test(m[1])) problems.push("MARZI063_PACKAGE_DISPLACED: " + id + " is titled " + JSON.stringify(m[1].trim()));
  }
  if (!/MARZI-020 through MARZI-063/.test(roadmap)) {
    problems.push("MARZI063_RANGE_NOT_EXTENDED: the roadmap range does not record the extension to MARZI-063");
  }
  if (!exists(PACKAGE)) problems.push("MARZI063_PACKAGE_SPEC_MISSING: " + PACKAGE);
  return problems;
});

check("M063-002", "the exact target, parent and protected-main SHAs are carried everywhere", () => {
  const problems = [];
  for (const rel of [WORKFLOW, DEPLOY_SCRIPT, RUNNER, PACKAGE, RUNBOOK]) {
    const text = readTracked(rel);
    if (!text.includes(TARGET_COMMIT)) problems.push("MARZI063_TARGET_SHA_MISSING: " + rel);
  }
  for (const rel of [WORKFLOW, DEPLOY_SCRIPT, RUNNER]) {
    if (!read(rel).includes(PARENT_COMMIT)) problems.push("MARZI063_ROLLBACK_SHA_MISSING: " + rel);
    if (!read(rel).includes(PROTECTED_MAIN)) problems.push("MARZI063_PROTECTED_MAIN_MISSING: " + rel);
  }
  /* an abbreviated SHA is not an exact target */
  for (const rel of [WORKFLOW, DEPLOY_SCRIPT]) {
    const text = read(rel);
    for (const m of text.matchAll(/\b[0-9a-f]{7,39}\b/g)) {
      if (/^[0-9a-f]+$/.test(m[0]) && m[0].length < 40 && m[0].length >= 7 && !/^[0-9]+$/.test(m[0])) {
        /* action pins are 40 chars; anything shorter that looks like a SHA is suspect */
        if (TARGET_COMMIT.startsWith(m[0]) || PARENT_COMMIT.startsWith(m[0]) || PROTECTED_MAIN.startsWith(m[0])) {
          problems.push("MARZI063_ABBREVIATED_SHA: " + rel + " uses the abbreviated form " + m[0]);
        }
      }
    }
  }
  return problems;
});

check("M063-003", "the target SHA is a workflow constant, never an input", () => {
  const wf = readTracked(WORKFLOW);
  const problems = [];
  if (!new RegExp("MARZI063_TARGET_COMMIT:\\s*" + TARGET_COMMIT).test(wf)) {
    problems.push("MARZI063_TARGET_NOT_CONSTANT: the target commit is not a literal env constant");
  }
  if (/ref:\s*\$\{\{\s*(inputs|github\.event\.inputs)/.test(wf)) {
    problems.push("MARZI063_TARGET_FROM_INPUT: a checkout ref comes from a user-supplied input");
  }
  const inputBlock = wf.slice(wf.indexOf("inputs:"), wf.indexOf("concurrency:"));
  for (const bad of ["commit", "sha", "ref", "service", "url", "environment", "branch"]) {
    if (new RegExp("^\\s{6}" + bad + ":", "m").test(inputBlock)) {
      problems.push("MARZI063_UNSAFE_INPUT: the workflow accepts a " + bad + " input");
    }
  }
  if (!new RegExp("ref:\\s*" + TARGET_COMMIT).test(wf)) {
    problems.push("MARZI063_TARGET_NOT_CHECKED_OUT: no checkout pins the exact target SHA");
  }
  return problems;
});

check("M063-004", "two separate checkout roots, with no tooling inside the source under test", () => {
  const wf = readTracked(WORKFLOW);
  const problems = [];
  if (!/path:\s*control\b/.test(wf)) problems.push("MARZI063_CHECKOUT_SEPARATION: no control checkout path");
  if (!/path:\s*sut\b/.test(wf)) problems.push("MARZI063_CHECKOUT_SEPARATION: no sut checkout path");
  if (!/npm ci --prefix control\/test\/independent\/marzi-063/.test(wf)) {
    problems.push("MARZI063_TOOLING_PATH: dependencies are not installed under control/test/independent/marzi-063");
  }
  if (!/test ! -e sut\/node_modules/.test(wf)) {
    problems.push("MARZI063_TOOLING_LEAK_UNCHECKED: the workflow does not prove tooling stayed out of sut");
  }
  const runner = readTracked(RUNNER);
  for (const [label, pattern] of Object.entries({
    "sut head proof": /SUT_HEAD_MISMATCH/, "parent proof": /SUT_PARENT_MISMATCH/,
    "merge rejection": /SUT_IS_MERGE/, "clean-tree proof": /SUT_DIRTY/,
    "main protection": /MAIN_MOVED/, "checkout separation": /CHECKOUTS_NOT_SEPARATE/,
    "sut contamination": /SUT_CONTAMINATED/, "artifact path containment": /ARTIFACT_PATH_INSIDE_WORKTREE/
  })) {
    if (!pattern.test(runner)) problems.push("MARZI063_RUNNER_PROOF_MISSING: " + label);
  }
  return problems;
});

check("M063-005", "the verification job receives no secrets and no environment", () => {
  const wf = readTracked(WORKFLOW);
  const problems = [];
  const verify = wf.slice(wf.indexOf("  verify:"), wf.indexOf("  deploy:"));
  if (/secrets\./.test(verify)) problems.push("MARZI063_VERIFY_HAS_SECRETS: the verification job references a secret");
  if (/^\s{4}environment:/m.test(verify)) problems.push("MARZI063_VERIFY_HAS_ENVIRONMENT: the verification job declares an environment");
  if (!/permissions:\s*\n\s*contents: read\s*\n\s*actions: read/.test(verify)) {
    problems.push("MARZI063_VERIFY_PERMISSIONS: the verification job is not limited to contents+actions read");
  }
  if (!/^permissions: \{\}/m.test(wf)) problems.push("MARZI063_DEFAULT_PERMISSIONS: workflow-level permissions are not empty by default");
  if (/pull_request_target/.test(wf)) problems.push("MARZI063_PULL_REQUEST_TARGET: pull_request_target is prohibited");
  if (!/persist-credentials:\s*false/.test(verify)) problems.push("MARZI063_CREDENTIALS_PERSISTED: a checkout persists credentials");
  return problems;
});

check("M063-006", "the deployment job is separate, gated and dependent on verification", () => {
  const wf = readTracked(WORKFLOW);
  const problems = [];
  const deploy = wf.slice(wf.indexOf("  deploy:"));
  if (!/needs:\s*verify/.test(deploy)) problems.push("MARZI063_DEPLOY_NOT_GATED: the deploy job does not depend on verification");
  if (!new RegExp("environment:\\s*\\n\\s*name:\\s*" + STAGING_SERVICE).test(deploy)) {
    problems.push("MARZI063_DEPLOY_ENVIRONMENT: the deploy job does not use the protected " + STAGING_SERVICE + " environment");
  }
  if (!/download-artifact/.test(deploy)) problems.push("MARZI063_DEPLOY_NO_EVIDENCE: the deploy job does not download the verification evidence");
  if (!/sha256sum -c SHA256SUMS/.test(deploy)) problems.push("MARZI063_DEPLOY_NO_MANIFEST_CHECK: the deploy job does not re-verify the artifact manifest");
  if (!/verdict !== "PASS"/.test(deploy)) problems.push("MARZI063_DEPLOY_NO_VERDICT_CHECK: the deploy job does not re-read the verification verdict");
  for (const n of [51, 36, 30, 24, 675, 107]) {
    if (!new RegExp("\\b" + n + "\\b").test(deploy)) problems.push("MARZI063_DEPLOY_COUNT_UNCHECKED: the deploy gate does not re-read the count " + n);
  }
  if (!/concurrency:\s*\n\s*group:\s*marzi-063-staging/.test(wf)) {
    problems.push("MARZI063_CONCURRENCY: no MARZI-063-specific staging concurrency group");
  }
  return problems;
});

check("M063-007", "every action and the runner image are pinned immutably", () => {
  const wf = readTracked(WORKFLOW);
  const problems = [];
  const uses = [...wf.matchAll(/uses:\s*([^\s@]+)@([^\s#]+)/g)];
  if (uses.length === 0) problems.push("MARZI063_NO_ACTIONS_FOUND: the workflow declares no actions to check");
  for (const [, action, ref] of uses) {
    if (!/^[0-9a-f]{40}$/.test(ref)) {
      problems.push("MARZI063_FLOATING_ACTION: " + action + " is pinned to " + JSON.stringify(ref) + ", not a full commit SHA");
    }
  }
  for (const m of wf.matchAll(/runs-on:\s*([^\s]+)/g)) {
    if (/latest/.test(m[1])) problems.push("MARZI063_FLOATING_RUNNER: runs-on " + m[1] + " is a moving label");
  }
  if (/image:\s*[^\s]+:latest/.test(wf)) problems.push("MARZI063_FLOATING_CONTAINER: a container tag is unpinned");
  if (!/node-version:\s*22\.22\.2/.test(wf)) problems.push("MARZI063_NODE_NOT_PINNED: Node is not pinned to an exact patch version");
  if (!/npm --version.*10\.9\.7|MARZI063_NPM_VERSION: 10\.9\.7/.test(wf)) {
    problems.push("MARZI063_NPM_NOT_PINNED: npm is not pinned to the version bundled with the pinned Node");
  }
  return problems;
});

check("M063-008", "the dedicated lockfile is present, exact and free of surprises", () => {
  const problems = [];
  if (!exists(TOOL_PKG) || !exists(TOOL_LOCK)) return ["MARZI063_LOCKFILE_MISSING: the dedicated tooling manifest or lockfile is absent"];
  const pkg = JSON.parse(readTracked(TOOL_PKG));
  const lock = JSON.parse(readTracked(TOOL_LOCK));
  if (pkg.private !== true) problems.push("MARZI063_TOOLING_NOT_PRIVATE: the tooling package is not marked private");
  for (const [name, range] of Object.entries(pkg.dependencies || {})) {
    if (!/^\d+\.\d+\.\d+$/.test(range)) problems.push("MARZI063_DEPENDENCY_NOT_EXACT: " + name + "@" + range + " is a range, not an exact version");
  }
  for (const key of Object.keys(pkg.devDependencies || {})) {
    problems.push("MARZI063_UNEXPECTED_DEV_DEPENDENCY: " + key);
  }
  const entries = Object.entries(lock.packages || {}).filter(([k]) => k);
  const allowed = new Set(Object.keys(pkg.dependencies || {}).map((n) => "node_modules/" + n));
  for (const [name, meta] of entries) {
    if (!allowed.has(name)) problems.push("MARZI063_UNEXPECTED_PACKAGE: the lockfile contains " + name);
    if (!meta.integrity) problems.push("MARZI063_NO_INTEGRITY: " + name + " has no integrity hash");
    if (!/^\d+\.\d+\.\d+$/.test(String(meta.version))) problems.push("MARZI063_LOCK_VERSION_NOT_EXACT: " + name);
  }
  /* the root package.json must not gain a dependency because of this package */
  const rootPkg = JSON.parse(readTracked("package.json"));
  if (rootPkg.dependencies && Object.keys(rootPkg.dependencies).length) {
    problems.push("MARZI063_RUNTIME_DEPENDENCY_ADDED: the application gained a runtime dependency");
  }
  if (!read(PACKAGE).includes("newly generated")) {
    problems.push("MARZI063_LOCKFILE_PROVENANCE: the report does not record that the lockfile is new");
  }
  return problems;
});

check("M063-009", "a skipped suite can never be read as a pass", () => {
  const runner = readTracked(RUNNER);
  const problems = [];
  if (!/\bNOT_RUN\b/.test(runner) || !/SKIP/.test(runner)) {
    problems.push("MARZI063_SKIP_NOT_REJECTED: the runner does not scan for not-run markers");
  }
  /* the scan must cover the marker the suite under test actually prints */
  if (!/no playwright available/i.test(runner)) {
    problems.push("MARZI063_SKIP_MARKER_UNCOVERED: the runner does not recognise the browser suite's own SKIP text");
  }
  if (!/SUITE_SKIPPED/.test(runner)) problems.push("MARZI063_SKIP_NOT_REJECTED: no failure code for a skipped suite");
  if (!/SUITE_SUMMARY_MISSING/.test(runner)) {
    problems.push("MARZI063_SUMMARY_NOT_REQUIRED: a missing summary line is not treated as failure");
  }
  if (!/SUITE_COUNT_MISMATCH/.test(runner) || !/SUITE_PASSED_MISMATCH/.test(runner) || !/SUITE_FAILURES/.test(runner)) {
    problems.push("MARZI063_COUNTS_NOT_ENFORCED: total, passed and failed are not all enforced");
  }
  if (!/BROWSER_ENVIRONMENT_UNAVAILABLE/.test(runner)) {
    problems.push("MARZI063_MISSING_BROWSER_NOT_BLOCKING: a missing browser is not treated as BLOCKED");
  }
  return problems;
});

check("M063-010", "the exact mandatory counts are enforced by the runner", () => {
  const runner = readTracked(RUNNER);
  const problems = [];
  const required = { application: 51, "learning-contracts": 36, "marzi-061": 30, "marzi-062-package": 24, "browser-full": 675, "browser-marzi062": 107 };
  for (const [id, count] of Object.entries(required)) {
    const row = new RegExp('id:\\s*"' + id + '"[^\\n]*expected:\\s*' + count + '\\b');
    if (!row.test(runner)) problems.push("MARZI063_COUNT_NOT_PINNED: " + id + " is not pinned to " + count);
  }
  for (const cmd of ["test/conflict-markers.js", "test/run.js", "test/learning-contracts.js",
    "test/marzi-061-external-review-readiness.js", "test/marzi-062-visual-staging.js", "test/browser/run.js"]) {
    if (!runner.includes(cmd)) problems.push("MARZI063_COMMAND_MISSING: " + cmd);
  }
  if (!runner.includes('"--check"')) problems.push("MARZI063_SYNTAX_GATE_MISSING: no node --check gate");
  if (!runner.includes('"diff", "--check"')) problems.push("MARZI063_DIFF_CHECK_MISSING: no git diff --check gate");
  return problems;
});

check("M063-011", "the artifact contract is complete and hashed", () => {
  const runner = readTracked(RUNNER);
  const wf = readTracked(WORKFLOW);
  const problems = [];
  const required = ["provenance.json", "verification-summary.json", "suite-results.json", "junit.xml",
    "visual-results.json", "accessibility-results.json", "interaction-results.json", "browser-console.jsonl",
    "page-errors.jsonl", "network-failures.jsonl", "staging-smoke.json", "production-non-change.json",
    "deploy-record.json", "rollback-record.json", "SHA256SUMS"];
  for (const f of required) {
    if (!runner.includes(f)) problems.push("MARZI063_ARTIFACT_NOT_PRODUCED: " + f);
    if (!wf.includes(f)) problems.push("MARZI063_ARTIFACT_NOT_CHECKED: the workflow does not require " + f);
  }
  for (const d of ["screenshots/layout", "screenshots/states", "screenshots/interactions"]) {
    if (!runner.includes(d)) problems.push("MARZI063_SCREENSHOT_DIR_MISSING: " + d);
  }
  if (!/if-no-files-found:\s*error/.test(wf)) problems.push("MARZI063_UPLOAD_NOT_STRICT: artifact upload does not fail when empty");
  if (!/retention-days:\s*30/.test(wf)) problems.push("MARZI063_RETENTION_UNSET: the approved 30-day retention is not declared");
  if (!/ARTIFACT_INCOMPLETE/.test(runner)) problems.push("MARZI063_ARTIFACT_COMPLETENESS_UNCHECKED");
  return problems;
});

check("M063-012", "the staging Blueprint declares only the staging service", () => {
  const problems = [];
  if (!exists(BLUEPRINT)) return ["MARZI063_BLUEPRINT_MISSING: " + BLUEPRINT];
  const bp = readTracked(BLUEPRINT);
  const names = [...bp.matchAll(/^\s*-?\s*name:\s*([^\s#]+)/gm)].map((m) => m[1]);
  const services = [...bp.matchAll(/^\s*-\s*type:\s*\w+/gm)];
  if (services.length !== 1) problems.push("MARZI063_BLUEPRINT_SERVICE_COUNT: " + services.length + " services declared, expected 1");
  if (!names.includes(STAGING_SERVICE)) problems.push("MARZI063_STAGING_SERVICE_MISSING: " + STAGING_SERVICE);
  /* the production service name must not appear as a declared name anywhere */
  const serviceName = (bp.match(/^\s*-\s*type:\s*\w+[\s\S]*?name:\s*([^\s#]+)/m) || [])[1];
  if (serviceName !== STAGING_SERVICE) problems.push("MARZI063_BLUEPRINT_SERVICE_NAME: declared service is " + JSON.stringify(serviceName));
  for (const [label, pattern] of Object.entries({
    "auto-deploy disabled": /autoDeploy:\s*false/,
    "branch restriction": new RegExp("branch:\\s*" + BRANCH.replace(/\//g, "\\/")),
    "health check": /healthCheckPath:/,
    "staging environment marker": /MARZI_ENV[\s\S]{0,60}staging/,
    "expected commit marker": new RegExp("MARZI_EXPECTED_COMMIT[\\s\\S]{0,80}" + TARGET_COMMIT)
  })) {
    if (!pattern.test(bp)) problems.push("MARZI063_BLUEPRINT_INCOMPLETE: " + label);
  }
  for (const [label, pattern] of Object.entries({
    "database": /^\s*databases:/m, "disk": /^\s*disk:/m,
    "custom domain": /^\s*domains?:/m, "environment group": /envVarGroups?:/,
    "production service name": new RegExp("name:\\s*" + PRODUCTION_SERVICE + "\\b"),
    "production URL": new RegExp(PRODUCTION_URL.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
  })) {
    if (pattern.test(bp)) problems.push("MARZI063_BLUEPRINT_FORBIDDEN: the staging Blueprint declares a " + label);
  }
  /* secret declarations only, never values */
  for (const m of bp.matchAll(/key:\s*(\w+)\s*\n\s*value:\s*([^\n]+)/g)) {
    const [, key, value] = m;
    if (/KEY|TOKEN|SECRET|PIN|PASSWORD/i.test(key)) problems.push("MARZI063_SECRET_VALUE_IN_BLUEPRINT: " + key + " has an inline value");
    if (/sk-|rnd_/.test(value)) problems.push("MARZI063_SECRET_VALUE_IN_BLUEPRINT: " + key);
  }
  return problems;
});

check("M063-013", "production render.yaml is byte-identical to its baseline", () => {
  const problems = [];
  if (!exists("render.yaml")) return ["MARZI063_PRODUCTION_BLUEPRINT_MISSING: render.yaml"];
  const actual = sha256("render.yaml");
  inspected.add("render.yaml");
  if (actual !== PRODUCTION_RENDER_YAML_SHA256) {
    problems.push("MARZI063_PRODUCTION_BLUEPRINT_CHANGED: render.yaml sha256 is " + actual);
  }
  const prod = read("render.yaml");
  if (prod.includes(STAGING_SERVICE)) {
    problems.push("MARZI063_STAGING_IN_PRODUCTION_BLUEPRINT: the staging service was added to the production Blueprint");
  }
  return problems;
});

check("M063-014", "the deploy script is staging-specific and has no generic target argument", () => {
  const s = readTracked(DEPLOY_SCRIPT);
  const problems = [];
  for (const [label, pattern] of Object.entries({
    "expected service constant": new RegExp('EXPECTED_SERVICE_NAME = "' + STAGING_SERVICE + '"'),
    "forbidden service constant": new RegExp('FORBIDDEN_SERVICE_NAME = "' + PRODUCTION_SERVICE + '"'),
    "forbidden production URL constant": new RegExp('FORBIDDEN_PRODUCTION_URL = "' + PRODUCTION_URL.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + '"'),
    "deploy commit constant": new RegExp('DEPLOY_COMMIT = "' + TARGET_COMMIT + '"'),
    "rollback commit constant": new RegExp('ROLLBACK_COMMIT = "' + PARENT_COMMIT + '"'),
    "service name proof": /SERVICE_NAME_MISMATCH/,
    "production URL refusal": /PRODUCTION_URL_REFUSED/,
    "branch proof": /BRANCH_NOT_ALLOWED/,
    "auto-deploy proof": /AUTO_DEPLOY_ENABLED/,
    "exact-commit deploy payload": /commitId: DEPLOY_COMMIT/,
    "deployed-commit readback": /DEPLOYED_COMMIT_MISMATCH/,
    "forbidden target refusal": /FORBIDDEN_DEPLOY_TARGETS/,
    "redaction": /function redact/
  })) {
    if (!pattern.test(s)) problems.push("MARZI063_DEPLOY_SCRIPT_INCOMPLETE: " + label);
  }
  /* no generic argument may select a service, environment, url, branch or commit */
  for (const bad of ["--service", "--env", "--environment", "--url", "--branch", "--commit", "--sha"]) {
    if (s.includes(bad)) problems.push("MARZI063_GENERIC_DEPLOY_ARGUMENT: the script accepts " + bad);
  }
  const argvUses = [...s.matchAll(/process\.argv\[(\d+)\]/g)].map((m) => Number(m[1]));
  for (const i of argvUses) if (i > 2) problems.push("MARZI063_GENERIC_DEPLOY_ARGUMENT: process.argv[" + i + "] is read");
  if (!/PROTECTED_MAIN = "/.test(s) || !s.includes(PROTECTED_MAIN)) {
    problems.push("MARZI063_DEPLOY_SCRIPT_INCOMPLETE: protected main is not a refused deploy target");
  }
  /* rollback must be restricted to the prior staging deploy or the parent */
  if (!/ROLLBACK_TARGET_NOT_PERMITTED/.test(s)) {
    problems.push("MARZI063_ROLLBACK_UNRESTRICTED: rollback targets are not restricted");
  }
  return problems;
});

check("M063-015", "production is denied by name, URL, branch and SHA everywhere it could be reached", () => {
  const problems = [];
  const wf = readTracked(WORKFLOW);
  const s = read(DEPLOY_SCRIPT);
  /* the workflow must never name the production service as a target */
  for (const line of wf.split("\n")) {
    if (new RegExp("\\b" + PRODUCTION_SERVICE + "\\b").test(line)) {
      problems.push("MARZI063_PRODUCTION_REFERENCED: the workflow mentions the production service: " + JSON.stringify(line.trim().slice(0, 70)));
    }
  }
  if (/branches:\s*\[?\s*['"]?main/.test(wf)) problems.push("MARZI063_MAIN_TRIGGER: the workflow can be triggered from main");
  if (/\bpush:\s*$/m.test(wf)) problems.push("MARZI063_PUSH_TRIGGER: a push trigger could deploy without approval");
  /* the script's deny list must cover every production identity */
  for (const needle of [PRODUCTION_SERVICE, PRODUCTION_URL, PROTECTED_MAIN]) {
    if (!s.includes(needle)) problems.push("MARZI063_DENY_RULE_MISSING: the deploy script does not deny " + needle);
  }
  return problems;
});

check("M063-016", "post-deploy smoke, production proof and rollback are required by the documents", () => {
  const problems = [];
  const runbook = readTracked(RUNBOOK);
  for (const [label, pattern] of Object.entries({
    "staging service": new RegExp(STAGING_SERVICE),
    "post-deploy smoke": /smoke/i,
    "build id assertion": new RegExp(BUILD_ID),
    "service-worker check": /service worker/i,
    "production non-change": /production non-change/i,
    "protected main sha": new RegExp(PROTECTED_MAIN),
    "rollback procedure": /rollback/i,
    "rollback target": new RegExp(PARENT_COMMIT),
    "redirect rejection": /redirect/i,
    "emergency stop": /emergency stop/i
  })) {
    if (!pattern.test(runbook)) problems.push("MARZI063_RUNBOOK_INCOMPLETE: " + label);
  }
  const handoff = readTracked(HANDOFF);
  for (const [label, pattern] of Object.entries({
    "artifact inventory": /provenance\.json/,
    "download instructions": /download/i,
    "reviewer checklist": /checklist/i,
    "final status template": /APPROVED — STAGING PREVIEW READY FOR FAMILY FEEDBACK/,
    "deployment still disabled": /deployment .{0,30}disabled/i
  })) {
    if (!pattern.test(handoff)) problems.push("MARZI063_HANDOFF_INCOMPLETE: " + label);
  }
  return problems;
});

check("M063-017", "no secret, production credential or real learner data can enter an artifact", () => {
  const problems = [];
  const SECRET = [
    ["anthropic key", /sk-ant-[A-Za-z0-9]/], ["openai key", /\bsk-[A-Za-z0-9]{20,}/],
    ["render key", /\brnd_[A-Za-z0-9]{10,}/], ["github token", /\bgh[pousr]_[A-Za-z0-9]{20,}/],
    ["private key", /-----BEGIN [A-Z ]*PRIVATE KEY-----/]
  ];
  for (const rel of [WORKFLOW, DEPLOY_SCRIPT, RUNNER, BLUEPRINT, PACKAGE, RUNBOOK, HANDOFF]) {
    const text = readTracked(rel);
    for (const [label, pattern] of SECRET) {
      if (pattern.test(text)) problems.push("MARZI063_SECRET_PRESENT: " + rel + " contains a " + label);
    }
  }
  /* the runner declares redact as an arrow const, the deploy script as a
     function declaration; either shape satisfies the contract, but the
     redaction must actually cover the credential families we can name */
  const runner = read(RUNNER);
  if (!/\bredact\s*=\s*\(|function redact/.test(runner)) {
    problems.push("MARZI063_NO_REDACTION: the runner declares no redaction helper");
  }
  for (const [label, pattern] of Object.entries({
    "render keys": /rnd_/, "provider keys": /sk-/, "github tokens": /gh\[pousr\]_|gh_/,
    "bearer headers": /Bearer/, "generic key=value": /api\[_-\]\?key\|token\|secret\|password/
  })) {
    if (!pattern.test(runner)) problems.push("MARZI063_REDACTION_INCOMPLETE: the runner does not redact " + label);
  }
  /* the verification job must never see a provider or deploy credential */
  const wf = read(WORKFLOW);
  const verify = wf.slice(wf.indexOf("  verify:"), wf.indexOf("  deploy:"));
  for (const name of ["RENDER_API_KEY", "RENDER_STAGING_SERVICE_ID", "ANTHROPIC_API_KEY", "TTS_API_KEY"]) {
    if (new RegExp(name + ":\\s*\\$\\{\\{").test(verify)) {
      problems.push("MARZI063_VERIFY_CREDENTIAL: the verification job receives " + name);
    }
  }
  /* the local server under verification is started by the runner, so that is
     where the obviously-synthetic key has to be */
  if (!/ANTHROPIC_API_KEY:\s*"dummy[^"]*"/.test(read(RUNNER))) {
    problems.push("MARZI063_STUB_KEY_MISSING: the verification server does not use an obviously synthetic key");
  }
  if (/ANTHROPIC_API_KEY:\s*\$\{\{\s*secrets/.test(read(RUNNER) + verify)) {
    problems.push("MARZI063_VERIFY_CREDENTIAL: a real provider key reaches the verification server");
  }
  return problems;
});

check("M063-018", "the sixteen-case matrix, six states and interaction evidence are all required", () => {
  const runner = readTracked(RUNNER);
  const problems = [];
  for (const p of ["german", "spanish", "arabic", "long-german"]) {
    if (!runner.includes('"' + p + '"') && !runner.includes(p + ":")) problems.push("MARZI063_PROFILE_MISSING: " + p);
  }
  for (const vp of ["390", "844", "320", "568"]) {
    if (!runner.includes(vp)) problems.push("MARZI063_VIEWPORT_MISSING: " + vp);
  }
  if (!/VISUAL_MATRIX_INCOMPLETE/.test(runner)) problems.push("MARZI063_MATRIX_NOT_ENFORCED: the 16-case matrix size is not enforced");
  if (!/STATE_MATRIX_INCOMPLETE/.test(runner)) problems.push("MARZI063_STATES_NOT_ENFORCED");
  for (const s of ["ready", "listening", "processing", "speaking", "error", "disconnected"]) {
    if (!runner.includes(s + ":")) problems.push("MARZI063_STATE_MISSING: " + s);
  }
  for (const [label, needle] of Object.entries({
    "horizontal overflow": "horizontalOverflowPx", "page scroll": "pageScrollY",
    "outside viewport": "criticalBoxesOutsideViewport", "small targets": "visibleTargetsBelow48By48",
    "Marzi face overlap": "marziFaceOverlapCount", "identity text": "identityTextIssues",
    "scroll ownership": "innerScrollOwners", "Krankschreibung": "Krankschreibung",
    "translation": "translationText", "slow repeat": "slowCalls", "normal replay": "replayReturned",
    "timer": "timerAfter", "plan allowance": "planAllowanceText", "focus": "focusVisible",
    "qualitative review": "qualitativeReview"
  })) {
    if (!runner.includes(needle)) problems.push("MARZI063_MEASUREMENT_MISSING: " + label);
  }
  if (!/result: "PENDING"/.test(runner)) {
    problems.push("MARZI063_QUALITATIVE_AUTO_PASS: the qualitative review is not left for a human");
  }
  return problems;
});

check("M063-019", "only allowed paths exist for this package and no prohibited file is claimed", () => {
  const pkg = readTracked(PACKAGE);
  const problems = [];
  const allowed = [ROADMAP, REGISTER, PACKAGE, RUNBOOK, HANDOFF, WORKFLOW, DEPLOY_SCRIPT, BLUEPRINT,
    TOOL_PKG, TOOL_LOCK, RUNNER, "test/marzi-063-staging-infra-browser.js", ".ai/bin/docs-validate"];
  for (const rel of allowed) {
    if (!exists(rel)) problems.push("MARZI063_ALLOWED_FILE_MISSING: " + rel);
    if (!pkg.includes(rel)) problems.push("MARZI063_SCOPE_UNDOCUMENTED: " + rel + " is not listed in the package spec");
  }
  const prohibited = ["render.yaml", ".github/workflows/ci.yml", "package.json", "public/index.html",
    "public/sw.js", "public/manifest.webmanifest", "server.js", "test/run.js", "test/browser/run.js",
    "test/learning-contracts.js", "test/marzi-061-external-review-readiness.js", "test/marzi-062-visual-staging.js"];
  for (const rel of prohibited) {
    if (!pkg.includes(rel)) problems.push("MARZI063_PROHIBITED_NOT_DOCUMENTED: " + rel + " is not named as forbidden");
  }
  return problems;
});

check("M063-020", "the Product Owner decisions are recorded and no approval is invented", () => {
  const register = readTracked(REGISTER);
  const problems = [];
  const required = ["MARZI-D026", "MARZI-D027", "MARZI-D028", "MARZI-D029", "MARZI-D030"];
  for (const id of required) {
    if (!new RegExp("^### " + id + " —", "m").test(register)) problems.push("MARZI063_DECISION_MISSING: " + id + " has no detail record");
    if (!new RegExp("^\\| " + id + " \\|", "m").test(register)) problems.push("MARZI063_DECISION_MISSING: " + id + " has no index row");
  }
  /* an APPROVED decision must carry an approver, a date and the selected option */
  for (const id of required) {
    const start = register.indexOf("### " + id + " —");
    if (start < 0) continue;
    const nextIdx = register.indexOf("### MARZI-D", start + 5);
    const section = register.slice(start, nextIdx < 0 ? register.length : nextIdx);
    if (/\*\*APPROVED\*\*/.test(section)) {
      for (const field of ["Selected option", "Approver role", "Approval date"]) {
        if (!section.includes("| " + field + " |")) problems.push("MARZI063_APPROVAL_INCOMPLETE: " + id + " is APPROVED without " + field);
      }
    }
  }
  /* nothing may claim an external result that has not happened */
  const CLAIM = /\b(codex approved|independently approved|family (approved|confirmed)|deployment succeeded|staging is live|participants reported)\b/i;
  for (const rel of [PACKAGE, RUNBOOK, HANDOFF]) {
    for (const paragraph of read(rel).split(/\n\s*\n/)) {
      const flat = paragraph.replace(/\s+/g, " ").trim();
      for (const sentence of flat.split(/(?<=[.!?])\s+/)) {
        if (CLAIM.test(sentence) && !/\b(not|never|no|cannot|until|before|once|when|must|would|pending)\b/i.test(sentence)) {
          problems.push("MARZI063_UNSUPPORTED_CLAIM at " + rel + ": " + JSON.stringify(sentence.slice(0, 80)));
        }
      }
    }
  }
  return problems;
});

check("M063-021", "the validator itself is read-only, network-free and free of dynamic execution", () => {
  const self = read("test/marzi-063-staging-infra-browser.js");
  const problems = [];
  for (const [label, pattern] of [
    ["eval", new RegExp("(^|[^.\\w])" + "eval" + "\\s*\\(")],
    ["new Function", new RegExp("\\bnew\\s+" + "Function" + "\\s*\\(")],
    ["vm require", new RegExp("require\\s*\\(\\s*[\"'`]" + "(node:)?vm" + "[\"'`]")],
    ["network require", new RegExp("require\\s*\\(\\s*[\"'`]" + "(node:)?(http|https|net|dgram|tls)" + "[\"'`]")],
    ["write route", /fs\.(write|append|mkdir|rm|unlink|copy|rename|chmod|chown|truncate)/]
  ]) {
    if (pattern.test(self)) problems.push("MARZI063_FORBIDDEN_ROUTE: the validator source contains " + label);
  }
  return problems;
});

/* ---------------------------------------------------------------- */

console.log("");
console.log("MARZI-063 staging infrastructure: " + pass + "/" + ids.length + " checks passed");
console.log("files inspected: " + inspected.size + " — " + [...inspected].sort().join(", "));
if (failures.length) {
  console.error(failures.length + " failure(s).");
  process.exit(1);
}
console.log("Source and configuration contracts hold. No Render service, deployment or screenshot is asserted here.");
