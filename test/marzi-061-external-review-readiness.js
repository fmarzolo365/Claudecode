/**
 * MARZI-061 external review readiness validator — dependency-free, runs with
 * plain `node test/marzi-061-external-review-readiness.js`.
 *
 * It proves that the four external reviews are *prepared* and that nothing in
 * the preparation can be mistaken for a review having happened. It is
 * deterministic, read-only, network-free, and bounded to repository inputs, and
 * it contains no eval, Function construction, node:vm, shell interpolation, or
 * dynamic module loading.
 *
 * What it deliberately cannot do: judge whether content is pedagogically
 * correct, linguistically correct, accessible, usable, legally compliant, or
 * production-ready; verify a reviewer's identity or qualification; or validate
 * consent. Those are human and external-system responsibilities.
 *
 * Exit code 0 means 30/30 checks passed.
 */
"use strict";

const guardViolations = [];
const Module = require("node:module");
const FORBIDDEN_MODULES = new Set([
  "http", "https", "net", "dgram", "dns", "tls", "http2", "child_process", "worker_threads", "vm",
  "node:http", "node:https", "node:net", "node:dgram", "node:dns", "node:tls", "node:http2",
  "node:child_process", "node:worker_threads", "node:vm"
]);
const originalLoad = Module._load;
Module._load = function (request, parent, isMain) {
  if (FORBIDDEN_MODULES.has(request)) {
    guardViolations.push({ code: "M061_ER_FORBIDDEN_ROUTE", route: "require " + request });
    throw new Error("network, process and execution modules are not permitted here");
  }
  return originalLoad.call(this, request, parent, isMain);
};

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const WRITE_METHODS = [
  "writeFile", "writeFileSync", "appendFile", "appendFileSync", "createWriteStream",
  "mkdir", "mkdirSync", "rm", "rmSync", "rmdir", "rmdirSync", "unlink", "unlinkSync",
  "rename", "renameSync", "truncate", "truncateSync", "copyFile", "copyFileSync",
  "cp", "cpSync", "link", "linkSync", "symlink", "symlinkSync", "chmod", "chmodSync",
  "chown", "chownSync", "utimes", "utimesSync", "open", "openSync"
];
const READ_ONLY_FLAGS = new Set(["r", "rs", "sr", 0]);
function blockWrite(target, name, label) {
  if (typeof target[name] !== "function") return;
  const original = target[name];
  target[name] = function (...args) {
    if ((name === "open" || name === "openSync") && label === "fs" &&
        (args[1] === undefined || READ_ONLY_FLAGS.has(args[1]))) {
      return original.apply(target, args);
    }
    guardViolations.push({ code: "M061_ER_FORBIDDEN_ROUTE", route: label + "." + name });
    throw new Error("this validator must not write files: " + label + "." + name);
  };
  target[name].__original = original;
}
for (const name of WRITE_METHODS) blockWrite(fs, name, "fs");
for (const name of WRITE_METHODS) blockWrite(fs.promises, name, "fs.promises");
for (const name of ["write", "writeSync"]) {
  const original = fs[name];
  fs[name] = function (...args) {
    if (args[0] !== 1 && args[0] !== 2) {
      guardViolations.push({ code: "M061_ER_FORBIDDEN_ROUTE", route: "fs." + name });
      throw new Error("this validator must not write files");
    }
    return original.apply(fs, args);
  };
  fs[name].__original = original;
}
if (typeof globalThis.fetch === "function") {
  globalThis.fetch = function () {
    guardViolations.push({ code: "M061_ER_FORBIDDEN_ROUTE", route: "fetch" });
    throw new Error("network access is not permitted here");
  };
}

/* ---------------- paths and helpers ---------------- */

const ROOT = path.join(__dirname, "..");
const V1 = path.join(ROOT, "docs/learning/reviews/marzi-061/v1");
const CONTRACTS = path.join(ROOT, "docs/learning/contracts/v1");
const FIXTURES = path.join(ROOT, "test/fixtures/marzi-061-external-reviews");

const read = (file) => fs.readFileSync(file, "utf8");
const readJson = (file) => JSON.parse(read(file));
const sha256 = (buffer) => crypto.createHash("sha256").update(buffer).digest("hex");

/* Protected canonical inputs must be byte-identical before and after. */
const PROTECTED = [
  path.join(ROOT, "docs/learning/contracts/v1"),
  path.join(ROOT, "test/learning-contracts.js"),
  path.join(ROOT, "docs/MARZI_DECISION_REGISTER.md")
];
function fingerprint(target) {
  const info = fs.lstatSync(target);
  if (!info.isDirectory()) return path.relative(ROOT, target) + ":" + sha256(fs.readFileSync(target));
  const entries = [];
  const walk = (dir) => {
    for (const name of fs.readdirSync(dir).sort()) {
      const full = path.join(dir, name);
      if (fs.lstatSync(full).isDirectory()) walk(full);
      else entries.push(path.relative(ROOT, full) + ":" + sha256(fs.readFileSync(full)));
    }
  };
  walk(target);
  return entries.join("\n");
}
const protectedBefore = PROTECTED.map(fingerprint).join("\n");

let passes = 0;
let failures = 0;
function check(id, name, fn) {
  let problems;
  try {
    problems = fn() || [];
  } catch (error) {
    problems = ["threw: " + (error && error.message ? error.message : String(error))];
  }
  if (problems.length === 0) {
    passes++;
    console.log("PASS  " + id + "  " + name);
    return;
  }
  failures++;
  console.error("FAIL  " + id + "  " + name);
  for (const problem of problems.slice(0, 10)) console.error("        " + problem);
  if (problems.length > 10) console.error("        … and " + (problems.length - 10) + " more");
}

/* ---------------- minimal schema engine ---------------- */

function typeOf(value) {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  if (Number.isInteger(value)) return "integer";
  return typeof value;
}
function schemaCheck(schema, value, where, issues) {
  if (schema.type !== undefined) {
    const allowed = Array.isArray(schema.type) ? schema.type : [schema.type];
    const actual = typeOf(value);
    const ok = allowed.includes(actual) || (allowed.includes("number") && (actual === "integer" || actual === "number"));
    if (!ok) {
      issues.push({ code: "M061_ER_SCHEMA_TYPE_INVALID", where, detail: "expected " + allowed.join("|") + ", got " + actual });
      return issues;
    }
  }
  if (schema.const !== undefined && value !== schema.const) {
    issues.push({ code: "M061_ER_SCHEMA_CONST_INVALID", where, detail: "expected " + JSON.stringify(schema.const) + ", got " + JSON.stringify(value) });
  }
  if (schema.enum !== undefined && !schema.enum.includes(value)) {
    issues.push({ code: "M061_ER_SCHEMA_ENUM_INVALID", where, detail: JSON.stringify(value) + " is not one of " + schema.enum.join(", ") });
  }
  if (typeof value === "string") {
    if (schema.pattern !== undefined && !new RegExp(schema.pattern, "u").test(value)) {
      issues.push({ code: "M061_ER_SCHEMA_PATTERN_INVALID", where, detail: JSON.stringify(value.slice(0, 60)) + " does not match " + schema.pattern });
    }
    if (schema.minLength !== undefined && value.length < schema.minLength) {
      issues.push({ code: "M061_ER_SCHEMA_STRING_TOO_SHORT", where, detail: "length " + value.length + " < " + schema.minLength });
    }
  }
  if (typeof value === "number") {
    if (schema.minimum !== undefined && value < schema.minimum) {
      issues.push({ code: "M061_ER_SCHEMA_RANGE_INVALID", where, detail: value + " < " + schema.minimum });
    }
    if (schema.maximum !== undefined && value > schema.maximum) {
      issues.push({ code: "M061_ER_SCHEMA_RANGE_INVALID", where, detail: value + " > " + schema.maximum });
    }
  }
  if (Array.isArray(value)) {
    if (schema.minItems !== undefined && value.length < schema.minItems) {
      issues.push({ code: "M061_ER_SCHEMA_ARRAY_INVALID", where, detail: value.length + " < " + schema.minItems });
    }
    if (schema.maxItems !== undefined && value.length > schema.maxItems) {
      issues.push({ code: "M061_ER_SCHEMA_ARRAY_INVALID", where, detail: value.length + " > " + schema.maxItems });
    }
    if (schema.uniqueItems) {
      const seen = new Set();
      for (const item of value) {
        const key = JSON.stringify(item);
        if (seen.has(key)) issues.push({ code: "M061_ER_SCHEMA_ARRAY_INVALID", where, detail: "duplicate item " + key.slice(0, 60) });
        seen.add(key);
      }
    }
    if (schema.items) value.forEach((item, index) => schemaCheck(schema.items, item, where + "[" + index + "]", issues));
  }
  if (value && typeof value === "object" && !Array.isArray(value)) {
    for (const name of schema.required || []) {
      if (!Object.prototype.hasOwnProperty.call(value, name)) {
        issues.push({ code: "M061_ER_SCHEMA_REQUIRED_MISSING", where, detail: "missing property " + name });
      }
    }
    const properties = schema.properties || {};
    if (schema.additionalProperties === false) {
      for (const key of Object.keys(value)) {
        if (!Object.prototype.hasOwnProperty.call(properties, key)) {
          issues.push({ code: "M061_ER_UNEXPECTED_PROPERTY", where, detail: "unexpected property " + key });
        }
      }
    }
    for (const [key, subSchema] of Object.entries(properties)) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        schemaCheck(subSchema, value[key], where + "." + key, issues);
      }
    }
  }
  return issues;
}
const validateSchema = (schema, value, where) => schemaCheck(schema, value, where, []);

/* ---------------- canonical vocabulary ---------------- */

const LOCALE_ORDER = ["ar", "en", "es", "it", "tr", "uk"];
const LOCALE_NAMES = { es: "Spanish", en: "English", it: "Italian", tr: "Turkish", ar: "Arabic", uk: "Ukrainian" };
const LOCALE_DIRECTION = { es: "ltr", en: "ltr", it: "ltr", tr: "ltr", ar: "rtl", uk: "ltr" };
const TRACK_TYPES = ["learning_pedagogy", "linguistic", "accessibility", "android_study"];
const TRACK_IDS = [
  "marzi-review:marzi-061:learning-pedagogy:v1",
  "marzi-review:marzi-061:linguistic:v1",
  "marzi-review:marzi-061:accessibility:v1",
  "marzi-review:marzi-061:android-study:v1"
];
const KNOWN_ISSUE = "MARZI-A11Y-KNOWN-001";
const PENDING_TUPLE = {
  preparationStatus: "PREPARED", externalGateStatus: "PENDING", appointmentStatus: "NOT_APPOINTED",
  executionStatus: "NOT_STARTED", evidenceStatus: "NOT_COLLECTED", findingsStatus: "NOT_RECORDED",
  completionStatus: "NOT_COMPLETED", decisionStatus: "NOT_GRANTED", decision: "NOT_REVIEWED",
  remediationStatus: "NOT_DETERMINED", rereviewStatus: "NOT_DETERMINED"
};

/* Claims a preparation package may never make about itself. */
const UNSUPPORTED_CLAIM = /\b(wcag[- ]?(a|aa|aaa)?\s*compliant|legally compliant|certified|certification granted|specialist[- ]approved|approved by (a|the) (learning )?specialist|identity verified|cryptographically verified|production ready|ready for release)\b/i;
const PERSONAL_DATA_KEY = /(^|_)(participant_?name|full_?name|email|phone|address|dob|date_?of_?birth|gender|ethnicity|health|diagnosis|contact|nationalId|ssn)(_|$)/i;

/* ---------------- load ---------------- */

const schema = {};
for (const file of fs.readdirSync(path.join(V1, "schema")).sort()) {
  schema[file] = readJson(path.join(V1, "schema", file));
}
const data = {};
for (const file of fs.readdirSync(path.join(V1, "data")).sort()) {
  data[file] = readJson(path.join(V1, "data", file));
}
const contracts = {
  de: readJson(path.join(CONTRACTS, "scenarios.de.json")),
  en: readJson(path.join(CONTRACTS, "scenarios.en.json")),
  prerequisites: readJson(path.join(CONTRACTS, "prerequisites.json")),
  completion: readJson(path.join(CONTRACTS, "completion.json")),
  mastery: readJson(path.join(CONTRACTS, "mastery.json")),
  placement: readJson(path.join(CONTRACTS, "placement.json")),
  evidence: readJson(path.join(CONTRACTS, "evidence.json")),
  review: readJson(path.join(CONTRACTS, "review.json")),
  competencies: readJson(path.join(CONTRACTS, "competencies.json")),
  sourceInventory: readJson(path.join(CONTRACTS, "source-inventory.json"))
};
const roadmap = read(path.join(ROOT, "docs/MARZI_MASTER_ROADMAP.md"));

const objectiveIndex = new Map();
for (const doc of [contracts.de, contracts.en]) {
  for (const scenario of doc.scenarios) {
    for (const objective of scenario.objectives) {
      objectiveIndex.set(objective.id, { objective, scenario, target: doc.targetLanguage });
    }
  }
}
const fmt = (issues) => issues.map((i) => i.code + " at " + i.where + ": " + i.detail);

/* ---------------- shared record validation ---------------- */

/**
 * The cross-field invariants of section 7.4. Ordered so that a fixture fails
 * first for the defect it was written to prove.
 */
function reviewRecordIssues(record, where) {
  const issues = [];
  if (record.packageId !== "MARZI-061") {
    issues.push({ code: "M061_ER_PACKAGE_ID_COLLISION", where, detail: "packageId is " + JSON.stringify(record.packageId) });
  }
  if (!TRACK_TYPES.includes(record.reviewType)) {
    issues.push({ code: "M061_ER_REVIEW_TYPE_UNKNOWN", where, detail: String(record.reviewType) });
  }
  if (typeof record.reviewId === "string" && record.reviewType &&
      !record.reviewId.includes(record.reviewType.replace(/_/g, "-"))) {
    issues.push({ code: "M061_ER_REVIEW_TYPE_UNKNOWN", where, detail: "reviewId does not match reviewType" });
  }
  /* Fabricated or self-granted approval. */
  if (record.decision === "APPROVED" || record.decision === "APPROVED_WITH_CONDITIONS") {
    if (record.appointmentStatus !== "APPOINTED" || !record.reviewer) {
      issues.push({ code: "M061_ER_FALSE_APPROVAL", where, detail: "approval without an appointed reviewer" });
    }
  }
  if (record.externalGateStatus === "PENDING") {
    if (record.decisionStatus !== "NOT_GRANTED" || record.decision !== "NOT_REVIEWED") {
      issues.push({ code: "M061_ER_PENDING_STATE_INCONSISTENT", where, detail: "a pending gate carries a decision" });
    }
    if (record.reviewDate !== null) {
      issues.push({ code: "M061_ER_PENDING_STATE_INCONSISTENT", where, detail: "a pending gate carries a review date" });
    }
  }
  if (record.appointmentStatus === "NOT_APPOINTED" && record.reviewer !== null) {
    issues.push({ code: "M061_ER_APPOINTMENT_INCONSISTENT", where, detail: "reviewer present while NOT_APPOINTED" });
  }
  if (record.appointmentStatus === "APPOINTED" && !record.reviewer) {
    issues.push({ code: "M061_ER_APPOINTMENT_INCONSISTENT", where, detail: "APPOINTED with a null reviewer" });
  }
  if (record.executionStatus === "NOT_STARTED") {
    if ((record.evidenceReferences || []).length || (record.findings || []).length || record.reviewDate) {
      issues.push({ code: "M061_ER_PENDING_STATE_INCONSISTENT", where, detail: "NOT_STARTED carries evidence, findings, or a date" });
    }
  }
  if (record.completionStatus === "COMPLETED") {
    if (!record.reviewer) {
      issues.push({ code: "M061_ER_REVIEWER_REQUIRED", where, detail: "completed review without a reviewer" });
    }
    if (record.executionStatus !== "COMPLETED" || record.evidenceStatus !== "COMPLETE") {
      issues.push({ code: "M061_ER_EVIDENCE_REQUIRED", where, detail: "completed review without completed execution or evidence" });
    }
    if (!record.reviewDate) {
      issues.push({ code: "M061_ER_REVIEWER_REQUIRED", where, detail: "completed review without a review date" });
    }
    if (!(record.evidenceReferences || []).length) {
      issues.push({ code: "M061_ER_EVIDENCE_REQUIRED", where, detail: "completed review without evidence references" });
    }
    if (record.findingsStatus !== "RECORDED" && record.zeroFindingsAttestation !== true) {
      issues.push({ code: "M061_ER_EVIDENCE_REQUIRED", where, detail: "completed review without findings or a zero-findings attestation" });
    }
  }
  if (record.decisionStatus === "GRANTED" && record.completionStatus !== "COMPLETED") {
    issues.push({ code: "M061_ER_EVIDENCE_REQUIRED", where, detail: "granted decision without a completed review" });
  }
  if (record.decision === "APPROVED_WITH_CONDITIONS") {
    if (!(record.conditions || []).length) {
      issues.push({ code: "M061_ER_CONDITIONS_REQUIRED", where, detail: "approved with conditions but no condition recorded" });
    }
    if (!record.expirationOrRereviewTrigger && record.rereviewStatus !== "REQUIRED") {
      issues.push({ code: "M061_ER_CONDITIONS_REQUIRED", where, detail: "conditional approval without a re-review or expiration trigger" });
    }
  }
  if (record.decision === "CHANGES_REQUIRED") {
    const openFinding = (record.findings || []).some((f) => f.disposition === "OPEN");
    if (!openFinding || record.remediationStatus !== "REQUIRED" || record.rereviewStatus !== "REQUIRED") {
      issues.push({ code: "M061_ER_REMEDIATION_REQUIRED", where, detail: "changes required without an open finding, remediation and re-review" });
    }
  }
  if (record.decision === "BLOCKED" && !record.blockingRationale) {
    issues.push({ code: "M061_ER_BLOCK_REASON_REQUIRED", where, detail: "blocked without a rationale" });
  }
  if (record.decision === "APPROVED") {
    const unresolved = (record.findings || []).some((f) =>
      (f.severity === "BLOCKER" || f.severity === "HIGH") &&
      !["RESOLVED", "ACCEPTED", "REJECTED_WITH_RATIONALE"].includes(f.disposition));
    if (unresolved) {
      issues.push({ code: "M061_ER_FALSE_APPROVAL", where, detail: "approved with an unresolved BLOCKER or HIGH finding" });
    }
  }
  /* Supersession. */
  if (record.supersedes !== null && record.supersedes !== undefined) {
    if (record.supersedes === record.reviewId) {
      issues.push({ code: "M061_ER_SUPERSESSION_INVALID", where, detail: "self-reference" });
    } else {
      const sameType = TRACK_TYPES.some((type) => record.supersedes.includes(type.replace(/_/g, "-")) && record.reviewType === type);
      if (!sameType) {
        issues.push({ code: "M061_ER_SUPERSESSION_INVALID", where, detail: "supersedes a different review type" });
      }
      if (/:v1$/.test(record.supersedes)) {
        issues.push({ code: "M061_ER_SUPERSESSION_INVALID", where, detail: "v1 has no earlier record to supersede" });
      }
    }
  }
  /* Audit history. */
  const events = record.auditHistory || [];
  const eventIds = new Set();
  let previousTimestamp = "";
  let previousNext = null;
  for (const event of events) {
    if (eventIds.has(event.eventId)) {
      issues.push({ code: "M061_ER_AUDIT_HISTORY_INVALID", where, detail: "duplicate event " + event.eventId });
    }
    eventIds.add(event.eventId);
    if (previousTimestamp && event.timestamp < previousTimestamp) {
      issues.push({ code: "M061_ER_AUDIT_HISTORY_INVALID", where, detail: "timestamps out of order at " + event.eventId });
    }
    previousTimestamp = event.timestamp;
    if (previousNext !== null && event.priorState !== previousNext) {
      issues.push({ code: "M061_ER_AUDIT_HISTORY_INVALID", where, detail: "state discontinuity at " + event.eventId });
    }
    previousNext = event.nextState;
  }
  if (record.externalGateStatus === "PENDING" && events.some((e) => e.event !== "PACKAGE_PREPARED")) {
    issues.push({ code: "M061_ER_AUDIT_HISTORY_INVALID", where, detail: "a pending record records an external-review event" });
  }
  /* Artifact references must resolve. */
  const artifact = record.reviewedArtifact || {};
  for (const relative of artifact.paths || []) {
    if (!fs.existsSync(path.join(ROOT, relative))) {
      issues.push({ code: "M061_ER_ARTIFACT_REFERENCE_UNKNOWN", where, detail: relative });
    }
  }
  return issues;
}

/* Unsupported claims and personal data, applied to any document. */
function claimIssues(node, where, issues, at) {
  if (Array.isArray(node)) {
    node.forEach((item, index) => claimIssues(item, where, issues, at));
    return issues;
  }
  if (node && typeof node === "object") {
    for (const [key, child] of Object.entries(node)) {
      if (PERSONAL_DATA_KEY.test(key)) {
        issues.push({ code: "M061_ER_PERSONAL_DATA_FORBIDDEN", where: where + ":" + (at ? at + "." : "") + key, detail: "personal-data field" });
      }
      claimIssues(child, where, issues, at ? at + "." + key : key);
    }
    return issues;
  }
  if (typeof node === "string" && UNSUPPORTED_CLAIM.test(node)) {
    issues.push({ code: "M061_ER_AUTHORITY_CLAIM_UNSUPPORTED", where: where + ":" + at, detail: JSON.stringify(node.slice(0, 70)) });
  }
  return issues;
}

/* ---------------- document dispatch (used by fixtures too) ---------------- */

function documentIssues(doc, where) {
  const issues = [];
  if (!doc || typeof doc !== "object") {
    return [{ code: "M061_ER_SCHEMA_TYPE_INVALID", where, detail: "not an object" }];
  }
  claimIssues(doc, where, issues, "");
  switch (doc.contract) {
    case "marzi.review.package-manifest.v1": {
      issues.push(...manifestIssues(doc, where));
      issues.push(...validateSchema(schema["package-manifest.schema.json"], doc, where));
      return issues;
    }
    case "marzi.review.review-status.v1": {
      issues.push(...reviewStatusIssues(doc, where));
      return issues;
    }
    case "marzi.review.learning-matrix.v1": {
      issues.push(...learningMatrixIssues(doc, where));
      issues.push(...validateSchema(schema["learning-review.schema.json"], doc, where));
      return issues;
    }
    case "marzi.review.linguistic-matrix.v1": {
      issues.push(...linguisticMatrixIssues(doc, where));
      issues.push(...validateSchema(schema["linguistic-review.schema.json"], doc, where));
      return issues;
    }
    case "marzi.review.accessibility-plan.v1": {
      issues.push(...accessibilityIssues(doc, where));
      issues.push(...validateSchema(schema["accessibility-review.schema.json"], doc, where));
      return issues;
    }
    case "marzi.review.android-study-plan.v1": {
      issues.push(...androidIssues(doc, where));
      issues.push(...validateSchema(schema["android-study.schema.json"], doc, where));
      return issues;
    }
    case "marzi.review.record.v1": {
      const record = doc.record || {};
      issues.push(...reviewRecordIssues(record, where));
      issues.push(...validateSchema(schema["review-record.schema.json"], record, where + ".record"));
      return issues;
    }
    default:
      issues.push({ code: "M061_ER_UNKNOWN_CONTRACT", where, detail: String(doc.contract) });
      return issues;
  }
}

function manifestIssues(doc, where) {
  const issues = [];
  if (doc.packageId !== "MARZI-061") {
    issues.push({ code: "M061_ER_PACKAGE_ID_COLLISION", where, detail: "packageId is " + JSON.stringify(doc.packageId) });
  }
  const types = (doc.tracks || []).map((t) => t.reviewType);
  const ids = (doc.tracks || []).map((t) => t.reviewId);
  for (const type of types) {
    if (!TRACK_TYPES.includes(type)) issues.push({ code: "M061_ER_REVIEW_TYPE_UNKNOWN", where, detail: String(type) });
  }
  if (new Set(ids).size !== ids.length) {
    issues.push({ code: "M061_ER_REVIEW_ID_DUPLICATE", where, detail: "duplicate review identifier" });
  }
  if (types.length !== 4 || new Set(types).size !== 4) {
    issues.push({ code: "M061_ER_TRACK_SET_INVALID", where, detail: types.join(",") });
  }
  const seenPath = new Set();
  for (const artifact of doc.artifacts || []) {
    const relative = String(artifact.path);
    if (relative.startsWith("/") || relative.includes("..")) {
      issues.push({ code: "M061_ER_FIXTURE_PATH_ESCAPE", where, detail: relative });
      continue;
    }
    if (seenPath.has(relative)) {
      issues.push({ code: "M061_ER_ARTIFACT_REFERENCE_UNKNOWN", where, detail: "duplicate artifact " + relative });
    }
    seenPath.add(relative);
    const full = path.join(ROOT, relative);
    if (!fs.existsSync(full)) {
      issues.push({ code: "M061_ER_ARTIFACT_REFERENCE_UNKNOWN", where, detail: relative });
    } else if (sha256(fs.readFileSync(full)) !== artifact.sha256) {
      issues.push({ code: "M061_ER_ARTIFACT_REFERENCE_UNKNOWN", where, detail: "hash mismatch for " + relative });
    }
  }
  issues.push(...localeSetIssues(doc.locales, where));
  issues.push(...inventoryIssues(doc.acceptedInventories, where));
  const known = (doc.knownIssues || []).filter((i) => i.issueId === KNOWN_ISSUE);
  if (known.length !== 1 || known[0].status !== "OPEN") {
    issues.push({ code: "M061_ER_KNOWN_ISSUE_MISSING", where, detail: "the known Arabic issue must appear once and remain OPEN" });
  }
  return issues;
}

function localeSetIssues(locales, where) {
  const issues = [];
  const list = locales || [];
  const codes = list.map((l) => l.locale).slice().sort();
  if (codes.join(",") !== LOCALE_ORDER.join(",")) {
    issues.push({ code: "M061_ER_LOCALE_SET_INVALID", where, detail: codes.join(",") });
    return issues;
  }
  for (const entry of list) {
    if (entry.languageName !== LOCALE_NAMES[entry.locale]) {
      issues.push({ code: "M061_ER_LOCALE_NAME_INVALID", where, detail: entry.locale + " is named " + JSON.stringify(entry.languageName) });
    }
    if (entry.direction !== LOCALE_DIRECTION[entry.locale]) {
      issues.push({ code: "M061_ER_DIRECTION_INVALID", where, detail: entry.locale + " is " + entry.direction });
    }
  }
  return issues;
}

function inventoryIssues(inventories, where) {
  const expected = {
    scenarios: 29, variants: 94, germanScenarios: 19, germanVariants: 61,
    englishScenarios: 10, englishVariants: 33, localizedTitles: 564,
    requiredCriteria: 282, optionalCriteria: 94, prerequisiteEdges: 18,
    nullSupersessions: 94
  };
  const issues = [];
  /* The open-gate count is a statement about educational gates, not about
     inventory, so it carries its own reason code. */
  if ((inventories || {}).openEducationalGates !== 4) {
    issues.push({ code: "M061_ER_OPEN_GATE_CLOSED", where, detail: "openEducationalGates is " + JSON.stringify((inventories || {}).openEducationalGates) + ", expected 4" });
  }
  for (const [key, value] of Object.entries(expected)) {
    if ((inventories || {})[key] !== value) {
      issues.push({ code: "M061_ER_INVENTORY_DRIFT", where, detail: key + " is " + JSON.stringify((inventories || {})[key]) + ", expected " + value });
    }
  }
  return issues;
}

function reviewStatusIssues(doc, where) {
  const issues = [];
  if (doc.packageId !== "MARZI-061") {
    issues.push({ code: "M061_ER_PACKAGE_ID_COLLISION", where, detail: String(doc.packageId) });
  }
  const reviews = doc.reviews || [];
  const ids = reviews.map((r) => r.reviewId);
  if (new Set(ids).size !== ids.length) {
    issues.push({ code: "M061_ER_REVIEW_ID_DUPLICATE", where, detail: "duplicate review identifier" });
  }
  const types = reviews.map((r) => r.reviewType);
  for (const type of types) {
    if (!TRACK_TYPES.includes(type)) issues.push({ code: "M061_ER_REVIEW_TYPE_UNKNOWN", where, detail: String(type) });
  }
  if (reviews.length !== 4 || new Set(types).size !== 4 || !TRACK_TYPES.every((t) => types.includes(t))) {
    issues.push({ code: "M061_ER_TRACK_SET_INVALID", where, detail: "expected exactly four distinct tracks, found " + types.join(",") });
  }
  reviews.forEach((record, index) => {
    const at = where + ".reviews[" + index + "]";
    issues.push(...reviewRecordIssues(record, at));
    issues.push(...validateSchema(schema["review-record.schema.json"], record, at));
  });
  return issues;
}

function learningMatrixIssues(doc, where) {
  const issues = [];
  const entries = doc.entries || [];
  if (entries.length !== 94) {
    issues.push({ code: "M061_ER_LEARNING_MATRIX_DRIFT", where, detail: entries.length + " entries, expected 94" });
  }
  const seen = new Set();
  for (const entry of entries) {
    if (seen.has(entry.entryId)) {
      issues.push({ code: "M061_ER_LEARNING_MATRIX_DRIFT", where, detail: "duplicate entry " + entry.entryId });
    }
    seen.add(entry.entryId);
    const found = objectiveIndex.get(entry.variantId);
    if (!found) {
      issues.push({ code: "M061_ER_LEARNING_MATRIX_DRIFT", where, detail: "unknown variant " + entry.variantId });
      continue;
    }
    const objective = found.objective;
    const compare = [
      ["scenarioObjectiveId", objective.scenarioObjectiveId],
      ["sourceGoalIndex", objective.sourceGoalIndex],
      ["scenarioId", found.scenario.scenarioId],
      ["targetLanguage", found.target]
    ];
    for (const [key, expected] of compare) {
      if (entry[key] !== expected) {
        issues.push({ code: "M061_ER_LEARNING_MATRIX_DRIFT", where, detail: entry.variantId + "." + key + " is " + JSON.stringify(entry[key]) });
      }
    }
    const lists = [
      ["competencyIds", objective.competencies],
      ["requiredCriterionIds", objective.requiredCriteria.map((c) => c.id)],
      ["optionalCriterionIds", objective.optionalCriteria.map((c) => c.id)],
      ["allowedEvidenceTypes", objective.allowedEvidence]
    ];
    for (const [key, expected] of lists) {
      if ((entry[key] || []).join(",") !== expected.join(",")) {
        issues.push({ code: "M061_ER_LEARNING_MATRIX_DRIFT", where, detail: entry.variantId + "." + key + " differs from the contract" });
      }
    }
    if (entry.supersedes !== null) {
      issues.push({ code: "M061_ER_LEARNING_MATRIX_DRIFT", where, detail: entry.variantId + " supersedes is not null" });
    }
    if (entry.reviewStatus !== "NOT_REVIEWED") {
      issues.push({ code: "M061_ER_DECISION_INFERRED", where, detail: entry.variantId + " carries a review status" });
    }
  }
  return issues;
}

function linguisticMatrixIssues(doc, where) {
  const issues = [];
  issues.push(...localeSetIssues(doc.locales, where));
  const entries = doc.entries || [];
  const perLocale = new Map();
  const seen = new Set();
  for (const entry of entries) {
    perLocale.set(entry.locale, (perLocale.get(entry.locale) || 0) + 1);
    if (seen.has(entry.entryId)) {
      issues.push({ code: "M061_ER_LINGUISTIC_TEXT_DRIFT", where, detail: "duplicate entry " + entry.entryId });
    }
    seen.add(entry.entryId);
    if (entry.languageName !== LOCALE_NAMES[entry.locale]) {
      issues.push({ code: "M061_ER_LOCALE_NAME_INVALID", where, detail: entry.entryId + " names " + entry.locale + " as " + JSON.stringify(entry.languageName) });
    }
    if (entry.direction !== LOCALE_DIRECTION[entry.locale]) {
      issues.push({ code: "M061_ER_DIRECTION_INVALID", where, detail: entry.entryId + " direction " + entry.direction });
    }
    const found = objectiveIndex.get(entry.variantId);
    if (!found) {
      issues.push({ code: "M061_ER_LINGUISTIC_TEXT_DRIFT", where, detail: "unknown variant " + entry.variantId });
      continue;
    }
    if (entry.localizedText !== found.objective.title[entry.locale]) {
      issues.push({ code: "M061_ER_LINGUISTIC_TEXT_DRIFT", where, detail: entry.entryId + " localized text differs from the contract" });
    }
    if (entry.sourceText !== found.objective.sourceGoalText) {
      issues.push({ code: "M061_ER_LINGUISTIC_TEXT_DRIFT", where, detail: entry.entryId + " source text differs from the contract" });
    }
    if (entry.decision !== "NOT_REVIEWED") {
      issues.push({ code: "M061_ER_DECISION_INFERRED", where, detail: entry.entryId + " carries a decision" });
    }
  }
  const localesPresent = Array.from(perLocale.keys()).sort();
  if (localesPresent.join(",") !== LOCALE_ORDER.join(",")) {
    issues.push({ code: "M061_ER_LOCALE_SET_INVALID", where, detail: "entries cover " + localesPresent.join(",") });
  }
  if (entries.length !== 564) {
    issues.push({ code: "M061_ER_LINGUISTIC_TEXT_DRIFT", where, detail: entries.length + " entries, expected 564" });
  }
  return issues;
}

function accessibilityIssues(doc, where) {
  const issues = [];
  const known = (doc.knownIssues || []).filter((i) => i.issueId === KNOWN_ISSUE);
  if (known.length !== 1) {
    issues.push({ code: "M061_ER_KNOWN_ISSUE_MISSING", where, detail: "expected exactly one " + KNOWN_ISSUE + ", found " + known.length });
  } else if (known[0].status !== "OPEN" || known[0].fixedByThisPackage !== false) {
    issues.push({ code: "M061_ER_KNOWN_ISSUE_MISSING", where, detail: KNOWN_ISSUE + " is not OPEN and unfixed" });
  }
  if (doc.complianceClaim !== false) {
    issues.push({ code: "M061_ER_AUTHORITY_CLAIM_UNSUPPORTED", where, detail: "compliance is claimed" });
  }
  for (const check of doc.checks || []) {
    if (check.reviewStatus !== "NOT_REVIEWED" || check.observedBehavior !== null || check.severity !== null) {
      issues.push({ code: "M061_ER_DECISION_INFERRED", where, detail: check.checkId + " carries a review outcome" });
    }
  }
  const required = ["semantic", "input", "visual", "motion", "audio", "cognitive", "localization", "responsive"];
  const present = new Set((doc.checks || []).map((c) => c.category));
  for (const category of required) {
    if (!present.has(category)) {
      issues.push({ code: "M061_ER_TRACK_SET_INVALID", where, detail: "accessibility category missing: " + category });
    }
  }
  return issues;
}

function androidIssues(doc, where) {
  const issues = [];
  if ((doc.participants || []).length) {
    issues.push({ code: "M061_ER_PARTICIPANT_DATA_FORBIDDEN", where, detail: "participant data present" });
  }
  if ((doc.observations || []).length || (doc.timings || []).length) {
    issues.push({ code: "M061_ER_STUDY_RESULT_FORBIDDEN", where, detail: "observation or timing data present" });
  }
  if (doc.results !== null) {
    issues.push({ code: "M061_ER_STUDY_RESULT_FORBIDDEN", where, detail: "results present" });
  }
  if (doc.decision !== "NOT_REVIEWED") {
    issues.push({ code: "M061_ER_DECISION_INFERRED", where, detail: "study decision is " + doc.decision });
  }
  const privacy = doc.consentAndPrivacy || {};
  if (privacy.personalDataStored !== false) {
    issues.push({ code: "M061_ER_PERSONAL_DATA_FORBIDDEN", where, detail: "personal data is declared as stored" });
  }
  return issues;
}

/* ---------------- checks ---------------- */

check("M061-ER-001", "roadmap keeps MARZI-022 and adds MARZI-061 exactly once", () => {
  const problems = [];
  const headings = Array.from(roadmap.matchAll(/^## MARZI-([0-9]{3}) — (.+)$/gm));
  const ids = headings.map((m) => m[1]);
  if (new Set(ids).size !== ids.length) problems.push("M061_ER_PACKAGE_ID_COLLISION: duplicate roadmap package heading");
  /* MARZI-062: 42 is the count of the canonical MARZI-020..061 range this
     package owns. Later packages are appended by design, so the floor is what
     matters; a heading disappearing is still caught. */
  if (ids.length < 42) problems.push("M061_ER_TRACK_SET_INVALID: roadmap has " + ids.length + " package headings, expected at least 42");
  const byId = new Map(headings.map((m) => [m[1], m[2].trim()]));
  if (byId.get("022") !== "Domain Ownership and Event Contracts") {
    problems.push("M061_ER_PACKAGE_ID_COLLISION: MARZI-022 is titled " + JSON.stringify(byId.get("022")));
  }
  if (byId.get("061") !== "External Review Readiness Package") {
    problems.push("M061_ER_PACKAGE_ID_COLLISION: MARZI-061 is titled " + JSON.stringify(byId.get("061")));
  }
  if (/MARZI-022[^\n]*External Review Readiness/.test(roadmap)) {
    problems.push("M061_ER_PACKAGE_ID_COLLISION: MARZI-022 is associated with External Review Readiness");
  }
  if (/MARZI-061[^\n]*Domain Ownership/.test(roadmap)) {
    problems.push("M061_ER_PACKAGE_ID_COLLISION: MARZI-061 is associated with Domain Ownership");
  }
  const graph = roadmap.slice(roadmap.indexOf("# Dependency graph"), roadmap.indexOf("# Critical path"));
  if (!graph.includes("MARZI-061")) problems.push("M061_ER_TRACK_SET_INVALID: dependency graph does not cover MARZI-061");
  /* the declared range must still start at MARZI-020 and reach at least
     MARZI-061; it may extend further as packages are appended */
  const range = roadmap.match(/MARZI-020 through MARZI-(\d{3})/);
  if (!range || Number(range[1]) < 61) {
    problems.push("M061_ER_INVENTORY_DRIFT: roadmap package range does not cover MARZI-020 through MARZI-061");
  }
  return problems;
});

check("M061-ER-002", "package manifest, identity, artifact paths and hashes are valid", () => {
  const doc = data["package-manifest.json"];
  const problems = fmt(manifestIssues(doc, "package-manifest.json"));
  problems.push(...fmt(validateSchema(schema["package-manifest.schema.json"], doc, "package-manifest.json")));
  const manifestPath = "docs/learning/reviews/marzi-061/v1/data/package-manifest.json";
  if ((doc.artifacts || []).some((a) => a.path === manifestPath)) {
    problems.push("M061_ER_ARTIFACT_REFERENCE_UNKNOWN: the manifest must not hash itself");
  }
  return problems;
});

check("M061-ER-003", "exactly four review tracks with unique package-bound identifiers", () => {
  const problems = [];
  const ids = data["review-status.json"].reviews.map((r) => r.reviewId).slice().sort();
  if (ids.join("|") !== TRACK_IDS.slice().sort().join("|")) {
    problems.push("M061_ER_TRACK_SET_INVALID: " + ids.join(", "));
  }
  const manifestIds = data["package-manifest.json"].tracks.map((t) => t.reviewId).slice().sort();
  if (manifestIds.join("|") !== ids.join("|")) {
    problems.push("M061_ER_TRACK_SET_INVALID: manifest and status tracks differ");
  }
  return problems;
});

check("M061-ER-004", "shared status tuples are schema-valid", () => {
  const problems = [];
  for (const [index, record] of data["review-status.json"].reviews.entries()) {
    problems.push(...fmt(validateSchema(schema["review-record.schema.json"], record, "review-status.reviews[" + index + "]")));
  }
  return problems;
});

check("M061-ER-005", "transitions and cross-field invariants hold", () => {
  const problems = [];
  for (const [index, record] of data["review-status.json"].reviews.entries()) {
    problems.push(...fmt(reviewRecordIssues(record, "review-status.reviews[" + index + "]")));
    for (const [key, expected] of Object.entries(PENDING_TUPLE)) {
      if (record[key] !== expected) {
        problems.push("M061_ER_PENDING_STATE_INCONSISTENT at " + record.reviewId + ": " + key + " is " + record[key] + ", expected " + expected);
      }
    }
  }
  return problems;
});

check("M061-ER-006", "no completion or decision lacks reviewer, date and evidence", () => {
  const problems = [];
  for (const record of data["review-status.json"].reviews) {
    if (record.completionStatus === "COMPLETED" || record.decisionStatus === "GRANTED" || record.decision !== "NOT_REVIEWED") {
      problems.push("M061_ER_FALSE_APPROVAL at " + record.reviewId + ": a canonical preparation record claims completion or a decision");
    }
    if (record.reviewer !== null || record.reviewDate !== null || record.evidenceReferences.length || record.findings.length) {
      problems.push("M061_ER_PENDING_STATE_INCONSISTENT at " + record.reviewId + ": reviewer, date, evidence or findings present");
    }
  }
  return problems;
});

check("M061-ER-007", "no canonical record contains fabricated reviewer, participant, result or approval data", () => {
  const problems = [];
  for (const [name, doc] of Object.entries(data)) {
    problems.push(...fmt(claimIssues(doc, name, [], "")));
  }
  const android = data["android-study-plan.json"];
  problems.push(...fmt(androidIssues(android, "android-study-plan.json")));
  return problems;
});

check("M061-ER-008", "condition, remediation, blocking and re-review rules hold", () => {
  const problems = [];
  const base = data["review-status.json"].reviews[0];
  const clone = () => JSON.parse(JSON.stringify(base));
  const cases = [
    ["approved with conditions but none listed", (r) => {
      r.appointmentStatus = "APPOINTED"; r.reviewer = structuralReviewer();
      r.decision = "APPROVED_WITH_CONDITIONS"; r.conditions = [];
    }, "M061_ER_CONDITIONS_REQUIRED"],
    ["changes required without remediation", (r) => {
      r.decision = "CHANGES_REQUIRED"; r.remediationStatus = "NOT_DETERMINED";
    }, "M061_ER_REMEDIATION_REQUIRED"],
    ["blocked without a rationale", (r) => { r.decision = "BLOCKED"; }, "M061_ER_BLOCK_REASON_REQUIRED"],
    ["granted without completion", (r) => { r.decisionStatus = "GRANTED"; }, "M061_ER_EVIDENCE_REQUIRED"]
  ];
  for (const [label, mutate, expected] of cases) {
    const record = clone();
    mutate(record);
    const codes = reviewRecordIssues(record, "adversarial").map((i) => i.code);
    if (!codes.includes(expected)) problems.push(expected + " was not raised for: " + label);
  }
  return problems;
});

function structuralReviewer() {
  return {
    reviewerId: "marzi-reviewer:structural-fixture",
    displayName: "structural-fixture",
    role: "structural-fixture",
    qualificationDescription: "structural-fixture",
    organization: null,
    conflictOfInterestDeclaration: "structural-fixture",
    identityVerificationState: "NOT_VERIFIED_EXTERNALLY"
  };
}

check("M061-ER-009", "audit history and supersession are internally consistent", () => {
  const problems = [];
  for (const record of data["review-status.json"].reviews) {
    if (record.auditHistory.length !== 1 || record.auditHistory[0].event !== "PACKAGE_PREPARED") {
      problems.push("M061_ER_AUDIT_HISTORY_INVALID at " + record.reviewId + ": expected only the package-preparation event");
    }
    if (record.supersedes !== null) {
      problems.push("M061_ER_SUPERSESSION_INVALID at " + record.reviewId + ": v1 supersedes nothing");
    }
  }
  const base = JSON.parse(JSON.stringify(data["review-status.json"].reviews[0]));
  base.auditHistory = base.auditHistory.concat([Object.assign({}, base.auditHistory[0], {
    eventId: "marzi-audit:marzi-061:learning-pedagogy:002",
    event: "REVIEW_COMPLETED", timestamp: "2020-01-01T00:00:00Z",
    priorState: "SOMETHING_ELSE", nextState: "COMPLETED"
  })]);
  const codes = reviewRecordIssues(base, "adversarial").map((i) => i.code);
  if (!codes.includes("M061_ER_AUDIT_HISTORY_INVALID")) {
    problems.push("M061_ER_AUDIT_HISTORY_INVALID was not raised for an out-of-order discontinuous event");
  }
  return problems;
});

check("M061-ER-010", "all 94 learning entries match canonical identifiers and source indexes", () => {
  return fmt(learningMatrixIssues(data["learning-evidence-matrix.json"], "learning-evidence-matrix.json"))
    .concat(fmt(validateSchema(schema["learning-review.schema.json"], data["learning-evidence-matrix.json"], "learning-evidence-matrix.json")));
});

check("M061-ER-011", "approved completion, evidence, mastery, placement and prerequisite contracts are unchanged", () => {
  const problems = [];
  const manifest = data["package-manifest.json"];
  const byPath = new Map(manifest.artifacts.map((a) => [a.path, a.sha256]));
  for (const name of ["completion.json", "evidence.json", "mastery.json", "placement.json", "prerequisites.json", "review.json"]) {
    const relative = "docs/learning/contracts/v1/" + name;
    const declared = byPath.get(relative);
    const actual = sha256(fs.readFileSync(path.join(CONTRACTS, name)));
    if (declared !== actual) {
      problems.push("M061_ER_ARTIFACT_REFERENCE_UNKNOWN at " + relative + ": hash differs from the manifest");
    }
  }
  if (contracts.completion.decision.status !== "APPROVED" || contracts.completion.decision.id !== "MARZI-D016") {
    problems.push("M061_ER_INVENTORY_DRIFT: MARZI-D016 is no longer recorded as approved");
  }
  if (contracts.placement.decision.status !== "APPROVED" || contracts.placement.decision.id !== "MARZI-D009") {
    problems.push("M061_ER_INVENTORY_DRIFT: MARZI-D009 is no longer recorded as approved");
  }
  return problems;
});

check("M061-ER-012", "locale set is exactly ar,en,es,it,tr,uk", () => {
  const problems = [];
  for (const [name, doc] of [["package-manifest.json", data["package-manifest.json"]], ["linguistic-matrix.json", data["linguistic-matrix.json"]]]) {
    problems.push(...fmt(localeSetIssues(doc.locales, name)));
  }
  const planLocales = data["accessibility-plan.json"].conditions.locales.slice().sort();
  if (planLocales.join(",") !== LOCALE_ORDER.join(",")) {
    problems.push("M061_ER_LOCALE_SET_INVALID at accessibility-plan.json: " + planLocales.join(","));
  }
  return problems;
});

check("M061-ER-013", "language names and directionality are exact", () => {
  const problems = [];
  for (const entry of data["package-manifest.json"].locales) {
    if (entry.languageName !== LOCALE_NAMES[entry.locale]) {
      problems.push("M061_ER_LOCALE_NAME_INVALID: " + entry.locale + " is " + JSON.stringify(entry.languageName));
    }
    if (entry.direction !== LOCALE_DIRECTION[entry.locale]) {
      problems.push("M061_ER_DIRECTION_INVALID: " + entry.locale + " is " + entry.direction);
    }
  }
  if (LOCALE_DIRECTION.ar !== "rtl") problems.push("M061_ER_DIRECTION_INVALID: Arabic must be rtl");
  return problems;
});

check("M061-ER-014", "linguistic matrix has exactly 564 unique entries", () => {
  const problems = [];
  const entries = data["linguistic-matrix.json"].entries;
  if (entries.length !== 564) problems.push("M061_ER_LINGUISTIC_TEXT_DRIFT: " + entries.length + " entries, expected 564");
  if (new Set(entries.map((e) => e.entryId)).size !== entries.length) {
    problems.push("M061_ER_LINGUISTIC_TEXT_DRIFT: duplicate entry identifier");
  }
  if (data["linguistic-matrix.json"].entryCount !== entries.length) {
    problems.push("M061_ER_LINGUISTIC_TEXT_DRIFT: declared entryCount does not match");
  }
  const perLocale = {};
  for (const entry of entries) perLocale[entry.locale] = (perLocale[entry.locale] || 0) + 1;
  for (const locale of LOCALE_ORDER) {
    if (perLocale[locale] !== 94) {
      problems.push("M061_ER_LOCALE_SET_INVALID: " + locale + " has " + perLocale[locale] + " entries, expected 94");
    }
  }
  return problems;
});

check("M061-ER-015", "every copied source and localized value equals its canonical contract value", () => {
  return fmt(linguisticMatrixIssues(data["linguistic-matrix.json"], "linguistic-matrix.json"))
    .concat(fmt(validateSchema(schema["linguistic-review.schema.json"], data["linguistic-matrix.json"], "linguistic-matrix.json")));
});

check("M061-ER-016", "six language checklists and consolidated instructions exist", () => {
  const problems = [];
  for (const locale of LOCALE_ORDER) {
    const file = path.join(V1, "languages", locale + ".md");
    if (!fs.existsSync(file)) {
      problems.push("M061_ER_LOCALE_SET_INVALID: missing checklist for " + locale);
      continue;
    }
    const text = read(file);
    if (!text.includes(LOCALE_NAMES[locale])) {
      problems.push("M061_ER_LOCALE_NAME_INVALID: " + locale + ".md does not name " + LOCALE_NAMES[locale]);
    }
    if (!text.includes(LOCALE_DIRECTION[locale])) {
      problems.push("M061_ER_DIRECTION_INVALID: " + locale + ".md does not state its direction");
    }
  }
  for (const name of ["LINGUISTIC_REVIEW.md", "LEARNING_PEDAGOGY_REVIEW.md", "ACCESSIBILITY_REVIEW.md", "ANDROID_STUDY.md", "REVIEW_GOVERNANCE.md", "README.md"]) {
    if (!fs.existsSync(path.join(V1, name))) problems.push("M061_ER_TRACK_SET_INVALID: missing " + name);
  }
  return problems;
});

check("M061-ER-017", "accessibility categories and evidence fields are complete", () => {
  return fmt(accessibilityIssues(data["accessibility-plan.json"], "accessibility-plan.json"))
    .concat(fmt(validateSchema(schema["accessibility-review.schema.json"], data["accessibility-plan.json"], "accessibility-plan.json")));
});

check("M061-ER-018", "MARZI-A11Y-KNOWN-001 exists once and remains open", () => {
  const problems = [];
  const plan = data["accessibility-plan.json"].knownIssues.filter((i) => i.issueId === KNOWN_ISSUE);
  if (plan.length !== 1) problems.push("M061_ER_KNOWN_ISSUE_MISSING: plan lists " + plan.length);
  else if (plan[0].status !== "OPEN") problems.push("M061_ER_KNOWN_ISSUE_MISSING: status is " + plan[0].status);
  const manifest = data["package-manifest.json"].knownIssues.filter((i) => i.issueId === KNOWN_ISSUE);
  if (manifest.length !== 1 || manifest[0].status !== "OPEN") {
    problems.push("M061_ER_KNOWN_ISSUE_MISSING: manifest does not carry the open issue once");
  }
  const doc = read(path.join(V1, "ACCESSIBILITY_REVIEW.md"));
  const occurrences = (doc.match(/MARZI-A11Y-KNOWN-001/g) || []).length;
  if (occurrences < 1) problems.push("M061_ER_KNOWN_ISSUE_MISSING: the protocol does not record the issue");
  if (/MARZI-A11Y-KNOWN-001[^\n]*RESOLVED/i.test(doc)) {
    problems.push("M061_ER_KNOWN_ISSUE_MISSING: the protocol marks the issue resolved");
  }
  return problems;
});

check("M061-ER-019", "viewport, scaling, RTL, motion, audio, orientation and assistive-technology conditions exist", () => {
  const problems = [];
  const conditions = data["accessibility-plan.json"].conditions;
  for (const viewport of ["320x568", "390x844"]) {
    if (!conditions.viewports.includes(viewport)) problems.push("M061_ER_TRACK_SET_INVALID: missing viewport " + viewport);
  }
  for (const scale of ["100%", "200%"]) {
    if (!conditions.textScales.includes(scale)) problems.push("M061_ER_TRACK_SET_INVALID: missing text scale " + scale);
  }
  for (const orientation of ["portrait", "landscape"]) {
    if (!conditions.orientations.includes(orientation)) problems.push("M061_ER_TRACK_SET_INVALID: missing orientation " + orientation);
  }
  if (!conditions.directions.includes("rtl")) problems.push("M061_ER_DIRECTION_INVALID: rtl is not a review condition");
  if (!conditions.assistiveTechnologies.length) problems.push("M061_ER_TRACK_SET_INVALID: no assistive technology listed");
  const names = new Set(data["accessibility-plan.json"].checks.map((c) => c.name));
  for (const required of ["reduced_motion", "audio_alternative", "orientation", "text_scaling_200", "rtl_layout", "touch_target_size"]) {
    if (!names.has(required)) problems.push("M061_ER_TRACK_SET_INVALID: missing accessibility check " + required);
  }
  return problems;
});

check("M061-ER-020", "Android protocol is complete and holds no participant, observation, timing, result or decision data", () => {
  const doc = data["android-study-plan.json"];
  const problems = fmt(androidIssues(doc, "android-study-plan.json"));
  problems.push(...fmt(validateSchema(schema["android-study.schema.json"], doc, "android-study-plan.json")));
  const viewports = new Set(doc.deviceConditions.map((c) => c.viewport));
  for (const viewport of ["320x568", "390x844"]) {
    if (!viewports.has(viewport)) problems.push("M061_ER_TRACK_SET_INVALID: study lacks viewport " + viewport);
  }
  const scales = new Set(doc.deviceConditions.map((c) => c.textScale));
  for (const scale of ["100%", "200%"]) {
    if (!scales.has(scale)) problems.push("M061_ER_TRACK_SET_INVALID: study lacks text scale " + scale);
  }
  const localesUsed = new Set(doc.deviceConditions.map((c) => c.locale));
  for (const locale of ["es", "ar"]) {
    if (!localesUsed.has(locale)) problems.push("M061_ER_LOCALE_SET_INVALID: study lacks locale " + locale);
  }
  const orientations = new Set(doc.deviceConditions.map((c) => c.orientation));
  if (orientations.size < 2) problems.push("M061_ER_TRACK_SET_INVALID: study lacks both orientations");
  const connectivity = new Set(doc.deviceConditions.map((c) => c.connectivity));
  for (const state of ["online", "degraded", "offline"]) {
    if (!connectivity.has(state)) problems.push("M061_ER_TRACK_SET_INVALID: study lacks connectivity state " + state);
  }
  const states = new Set(doc.moderatorTasks.flatMap((t) => t.observedStates));
  for (const state of ["listening", "processing", "speaking", "offline", "error", "interruption", "recovery"]) {
    if (!states.has(state)) problems.push("M061_ER_TRACK_SET_INVALID: study lacks observed state " + state);
  }
  return problems;
});

check("M061-ER-021", "privacy and consent preparation exists without personal data", () => {
  const problems = [];
  const privacy = data["android-study-plan.json"].consentAndPrivacy;
  const expected = {
    legalApprovalStatus: "NOT_OBTAINED", privacyApprovalStatus: "NOT_OBTAINED",
    consentWordingStatus: "NOT_APPROVED", retentionPolicyStatus: "NOT_APPROVED",
    legalBasisStatus: "NOT_DETERMINED", personalDataStored: false
  };
  for (const [key, value] of Object.entries(expected)) {
    if (privacy[key] !== value) problems.push("M061_ER_PERSONAL_DATA_FORBIDDEN: " + key + " is " + JSON.stringify(privacy[key]));
  }
  if (!privacy.readinessChecklist.length) problems.push("M061_ER_TRACK_SET_INVALID: no privacy readiness checklist");
  const forbidden = data["android-study-plan.json"].evidenceCapture.forbidden;
  for (const item of ["participant_name", "contact_detail", "demographic_record", "health_data"]) {
    if (!forbidden.includes(item)) problems.push("M061_ER_PERSONAL_DATA_FORBIDDEN: " + item + " is not forbidden by the capture rules");
  }
  return problems;
});

/* ---------------- fixtures ---------------- */

const FIXTURE_NAME = /^[a-z0-9][a-z0-9-]*\.json$/;
function fixturePathIssues(name, directory) {
  const at = "invalid/manifest.json";
  if (typeof name !== "string" || name !== path.basename(name) || !FIXTURE_NAME.test(name)) {
    return [{ code: "M061_ER_FIXTURE_PATH_ESCAPE", where: at, detail: JSON.stringify(String(name)) + " is not a bare lowercase .json filename" }];
  }
  const resolved = path.resolve(directory, name);
  if (path.dirname(resolved) !== path.resolve(directory)) {
    return [{ code: "M061_ER_FIXTURE_PATH_ESCAPE", where: at, detail: name + " escapes the fixture directory" }];
  }
  let info;
  try { info = fs.lstatSync(resolved); } catch (error) {
    return [{ code: "M061_ER_FIXTURE_PATH_ESCAPE", where: at, detail: name + " does not exist" }];
  }
  if (info.isSymbolicLink() || !info.isFile()) {
    return [{ code: "M061_ER_FIXTURE_PATH_ESCAPE", where: at, detail: name + " is not a regular file" }];
  }
  if (path.dirname(fs.realpathSync(resolved)) !== fs.realpathSync(directory)) {
    return [{ code: "M061_ER_FIXTURE_PATH_ESCAPE", where: at, detail: name + " resolves outside the fixture directory" }];
  }
  return [];
}

check("M061-ER-022", "positive fixtures pass and every negative fixture fails first for its declared reason", () => {
  const problems = [];
  const validDir = path.join(FIXTURES, "valid");
  const validFiles = fs.readdirSync(validDir).filter((f) => f.endsWith(".json")).sort();
  if (validFiles.length !== 6) problems.push("M061_ER_TRACK_SET_INVALID: expected 6 positive fixtures, found " + validFiles.length);
  for (const file of validFiles) {
    const issues = documentIssues(readJson(path.join(validDir, file)), "valid/" + file);
    problems.push(...fmt(issues));
  }
  const invalidDir = path.join(FIXTURES, "invalid");
  const manifest = readJson(path.join(invalidDir, "manifest.json"));
  const files = fs.readdirSync(invalidDir).filter((f) => f.endsWith(".json") && f !== "manifest.json").sort();
  const declared = new Set(manifest.fixtures.map((f) => f.file));
  for (const file of files) {
    if (!declared.has(file)) problems.push("M061_ER_FIXTURE_PATH_ESCAPE: " + file + " has no manifest entry");
  }
  for (const entry of manifest.fixtures) {
    const pathProblems = fixturePathIssues(entry.file, invalidDir);
    if (pathProblems.length) { problems.push(...fmt(pathProblems)); continue; }
    const issues = documentIssues(readJson(path.join(invalidDir, entry.file)), "invalid/" + entry.file);
    if (issues.length === 0) {
      problems.push("M061_ER_DECISION_INFERRED: " + entry.file + " was accepted but must fail with " + entry.expectedReason);
      continue;
    }
    if (issues[0].code !== entry.expectedReason) {
      problems.push("M061_ER_UNEXPECTED_PROPERTY: " + entry.file + " expected first reason " + entry.expectedReason +
        ", got " + issues[0].code);
    }
  }
  return problems;
});

check("M061-ER-023", "fixture paths are contained and fixture loading cannot mutate source", () => {
  const problems = [];
  const invalidDir = path.join(FIXTURES, "invalid");
  const hostile = ["../manifest.json", "/etc/passwd", "nested/x.json", "x.json; rm -rf /", "X.json", "x.txt", "", "absent.json"];
  for (const name of hostile) {
    if (!fixturePathIssues(name, invalidDir).some((i) => i.code === "M061_ER_FIXTURE_PATH_ESCAPE")) {
      problems.push("M061_ER_FIXTURE_PATH_ESCAPE was not raised for " + JSON.stringify(name));
    }
  }
  const manifest = readJson(path.join(invalidDir, "manifest.json"));
  for (const entry of manifest.fixtures) problems.push(...fmt(fixturePathIssues(entry.file, invalidDir)));
  if (PROTECTED.map(fingerprint).join("\n") !== protectedBefore) {
    problems.push("M061_ER_FORBIDDEN_ROUTE: protected canonical inputs changed while loading fixtures");
  }
  return problems;
});

check("M061-ER-024", "accepted inventories are unchanged", () => {
  const problems = [];
  const counts = { de: { s: 0, v: 0 }, en: { s: 0, v: 0 } };
  let required = 0;
  let optional = 0;
  let titles = 0;
  for (const [target, doc] of [["de", contracts.de], ["en", contracts.en]]) {
    for (const scenario of doc.scenarios) {
      counts[target].s++;
      for (const objective of scenario.objectives) {
        counts[target].v++;
        required += objective.requiredCriteria.length;
        optional += objective.optionalCriteria.length;
        titles += Object.keys(objective.title).length;
      }
    }
  }
  const actual = {
    scenarios: counts.de.s + counts.en.s, variants: counts.de.v + counts.en.v,
    germanScenarios: counts.de.s, germanVariants: counts.de.v,
    englishScenarios: counts.en.s, englishVariants: counts.en.v,
    localizedTitles: titles, requiredCriteria: required, optionalCriteria: optional,
    prerequisiteEdges: contracts.prerequisites.edges.length
  };
  const expected = {
    scenarios: 29, variants: 94, germanScenarios: 19, germanVariants: 61,
    englishScenarios: 10, englishVariants: 33, localizedTitles: 564,
    requiredCriteria: 282, optionalCriteria: 94, prerequisiteEdges: 18
  };
  for (const [key, value] of Object.entries(expected)) {
    if (actual[key] !== value) problems.push("M061_ER_INVENTORY_DRIFT: " + key + " is " + actual[key] + ", expected " + value);
  }
  /* The prerequisite graph must still be acyclic. */
  const adjacency = new Map();
  for (const edge of contracts.prerequisites.edges) {
    if (edge.from === edge.to) continue;
    if (!adjacency.has(edge.from)) adjacency.set(edge.from, []);
    adjacency.get(edge.from).push(edge.to);
  }
  const state = new Map();
  const visit = (node) => {
    if (state.get(node) === "done") return;
    if (state.get(node) === "open") { problems.push("M061_ER_INVENTORY_DRIFT: prerequisite cycle at " + node); return; }
    state.set(node, "open");
    for (const next of adjacency.get(node) || []) visit(next);
    state.set(node, "done");
  };
  for (const node of adjacency.keys()) visit(node);
  return problems;
});

check("M061-ER-025", "all 94 supersession values remain null", () => {
  const problems = [];
  let counted = 0;
  for (const doc of [contracts.de, contracts.en]) {
    for (const scenario of doc.scenarios) {
      for (const objective of scenario.objectives) {
        counted++;
        if (objective.supersedes !== null) {
          problems.push("M061_ER_INVENTORY_DRIFT: " + objective.id + " supersedes is not null");
        }
      }
    }
  }
  if (counted !== 94) problems.push("M061_ER_INVENTORY_DRIFT: counted " + counted + " objectives, expected 94");
  for (const entry of data["learning-evidence-matrix.json"].entries) {
    if (entry.supersedes !== null) problems.push("M061_ER_LEARNING_MATRIX_DRIFT: " + entry.entryId + " supersedes is not null");
  }
  return problems;
});

check("M061-ER-026", "four educational gates remain open and release mode refuses the provisional package", () => {
  const problems = [];
  const gates = [];
  const walk = (node) => {
    if (Array.isArray(node)) { node.forEach(walk); return; }
    if (!node || typeof node !== "object") return;
    if (node.status === "OPEN_GATE") gates.push(node.gate);
    for (const child of Object.values(node)) walk(child);
  };
  for (const doc of Object.values(contracts)) walk(doc);
  const expected = ["MARZI-021-MASTERY-THRESHOLDS", "MARZI-021-REVIEW-RECENCY", "MARZI-021-PLACEMENT-CONTENT", "MARZI-021-COMPETENCY-COPY"];
  for (const gate of expected) {
    if (!gates.includes(gate)) problems.push("M061_ER_OPEN_GATE_CLOSED: " + gate + " is no longer an open gate");
  }
  if (gates.length !== 4) problems.push("M061_ER_OPEN_GATE_CLOSED: found " + gates.length + " open gates, expected 4");
  for (const key of ["minimumDistinctOpportunities", "minimumDistinctContexts", "recencyWindowDays", "aggregationWeights"]) {
    if (contracts.mastery.thresholds[key] !== null) {
      problems.push("M061_ER_OPEN_GATE_CLOSED: mastery." + key + " has an invented value");
    }
  }
  if (contracts.review.recencyPolicy.windowDays !== null) {
    problems.push("M061_ER_OPEN_GATE_CLOSED: review recency window has an invented value");
  }
  if (!String(contracts.sourceInventory.curriculumVersion).endsWith("-draft")) {
    problems.push("M061_ER_OPEN_GATE_CLOSED: the learning package is no longer a refused draft");
  }
  if (data["package-manifest.json"].acceptedInventories.openEducationalGates !== 4) {
    problems.push("M061_ER_INVENTORY_DRIFT: the manifest does not record four open gates");
  }
  return problems;
});

check("M061-ER-027", "no decision follows from file presence and no unsupported claim appears", () => {
  const problems = [];
  for (const [name, doc] of Object.entries(data)) {
    problems.push(...fmt(claimIssues(doc, name, [], "")));
  }
  const markdown = [];
  const walkDir = (dir) => {
    for (const entry of fs.readdirSync(dir).sort()) {
      const full = path.join(dir, entry);
      if (fs.lstatSync(full).isDirectory()) walkDir(full);
      else if (entry.endsWith(".md")) markdown.push(full);
    }
  };
  walkDir(V1);
  markdown.push(path.join(ROOT, "docs/packages/MARZI-061.md"));
  for (const file of markdown) {
    const text = read(file);
    const relative = path.relative(ROOT, file);
    /* A claim is a property of a sentence, not of a rendered line: prose here
       wraps, so a disclaimer's negation often sits on the previous line.
       Paragraphs are unwrapped before the scan so a denial is read as a denial. */
    for (const paragraph of text.split(/\n\s*\n/)) {
      const unwrapped = paragraph.replace(/\s+/g, " ").trim();
      for (const sentence of unwrapped.split(/(?<=[.!?])\s+/)) {
        if (UNSUPPORTED_CLAIM.test(sentence) &&
            !/\b(not|never|cannot|can not|no|without|nor|neither|only)\b/i.test(sentence)) {
          problems.push("M061_ER_AUTHORITY_CLAIM_UNSUPPORTED at " + relative + ": " + JSON.stringify(sentence.slice(0, 70)));
        }
      }
    }
    if (/\breview (has been|was) (completed|performed)\b/i.test(text)) {
      problems.push("M061_ER_DECISION_INFERRED at " + relative + ": claims a review happened");
    }
  }
  return problems;
});

check("M061-ER-028", "controlled objects reject unknown properties and internal references resolve", () => {
  const problems = [];
  for (const [name, doc] of Object.entries(schema)) {
    if (doc.type === "object" && doc.additionalProperties !== false) {
      problems.push("M061_ER_UNEXPECTED_PROPERTY: " + name + " is not strict at the top level");
    }
    if (typeof doc.$id !== "string" || !doc.$id.includes("marzi-061")) {
      problems.push("M061_ER_UNEXPECTED_PROPERTY: " + name + " has no marzi-061 $id");
    }
  }
  const withExtra = JSON.parse(JSON.stringify(data["package-manifest.json"]));
  withExtra.unexpectedField = true;
  if (!validateSchema(schema["package-manifest.schema.json"], withExtra, "adversarial").some((i) => i.code === "M061_ER_UNEXPECTED_PROPERTY")) {
    problems.push("M061_ER_UNEXPECTED_PROPERTY was not raised for an unknown manifest field");
  }
  for (const record of data["review-status.json"].reviews) {
    for (const relative of record.reviewedArtifact.paths) {
      if (!fs.existsSync(path.join(ROOT, relative))) {
        problems.push("M061_ER_ARTIFACT_REFERENCE_UNKNOWN: " + relative);
      }
    }
  }
  return problems;
});

check("M061-ER-029", "protected canonical inputs are identical and no write or network route was used", () => {
  const problems = guardViolations.map((v) => v.code + ": " + v.route);
  if (PROTECTED.map(fingerprint).join("\n") !== protectedBefore) {
    problems.push("M061_ER_FORBIDDEN_ROUTE: a protected canonical input changed during validation");
  }
  const self = read(__filename);
  for (const [label, pattern] of [
    ["eval", new RegExp("(^|[^.\\w])" + "eval" + "\\s*\\(")],
    ["new Function", new RegExp("\\bnew\\s+" + "Function" + "\\s*\\(")],
    ["vm require", new RegExp("require\\s*\\(\\s*[\"'`]" + "(node:)?vm" + "[\"'`]")]
  ]) {
    if (pattern.test(self)) problems.push("M061_ER_FORBIDDEN_ROUTE: validator source contains " + label);
  }
  return problems;
});

check("M061-ER-030", "reason codes are unique, deterministic, and cover every intended failure class", () => {
  const problems = [];
  const manifest = readJson(path.join(FIXTURES, "invalid", "manifest.json"));
  const reasons = manifest.fixtures.map((f) => f.expectedReason);
  const files = manifest.fixtures.map((f) => f.file);
  if (new Set(files).size !== files.length) problems.push("M061_ER_UNEXPECTED_PROPERTY: duplicate fixture file in the manifest");
  if (new Set(reasons).size !== reasons.length) {
    problems.push("M061_ER_UNEXPECTED_PROPERTY: a reason code is declared by more than one fixture");
  }
  const required = [
    "M061_ER_PACKAGE_ID_COLLISION", "M061_ER_REVIEW_TYPE_UNKNOWN", "M061_ER_REVIEW_ID_DUPLICATE",
    "M061_ER_TRACK_SET_INVALID", "M061_ER_REVIEWER_REQUIRED", "M061_ER_APPOINTMENT_INCONSISTENT",
    "M061_ER_PENDING_STATE_INCONSISTENT", "M061_ER_EVIDENCE_REQUIRED", "M061_ER_CONDITIONS_REQUIRED",
    "M061_ER_REMEDIATION_REQUIRED", "M061_ER_BLOCK_REASON_REQUIRED", "M061_ER_DECISION_INFERRED",
    "M061_ER_FALSE_APPROVAL", "M061_ER_AUTHORITY_CLAIM_UNSUPPORTED", "M061_ER_ARTIFACT_REFERENCE_UNKNOWN",
    "M061_ER_SUPERSESSION_INVALID", "M061_ER_AUDIT_HISTORY_INVALID", "M061_ER_LEARNING_MATRIX_DRIFT",
    "M061_ER_LOCALE_SET_INVALID", "M061_ER_LINGUISTIC_TEXT_DRIFT", "M061_ER_LOCALE_NAME_INVALID",
    "M061_ER_DIRECTION_INVALID", "M061_ER_KNOWN_ISSUE_MISSING", "M061_ER_PARTICIPANT_DATA_FORBIDDEN",
    "M061_ER_STUDY_RESULT_FORBIDDEN", "M061_ER_PERSONAL_DATA_FORBIDDEN", "M061_ER_INVENTORY_DRIFT",
    "M061_ER_OPEN_GATE_CLOSED", "M061_ER_FIXTURE_PATH_ESCAPE", "M061_ER_UNEXPECTED_PROPERTY"
  ];
  for (const code of required) {
    if (!reasons.includes(code)) problems.push("M061_ER_UNEXPECTED_PROPERTY: no fixture proves " + code);
  }
  if (manifest.fixtures.length !== 30) {
    problems.push("M061_ER_UNEXPECTED_PROPERTY: expected 30 negative fixtures, found " + manifest.fixtures.length);
  }
  /* Determinism: the same input yields the same ordered codes. */
  const sample = readJson(path.join(FIXTURES, "invalid", manifest.fixtures[0].file));
  const first = documentIssues(sample, "determinism").map((i) => i.code).join("|");
  const second = documentIssues(sample, "determinism").map((i) => i.code).join("|");
  if (first !== second) problems.push("M061_ER_UNEXPECTED_PROPERTY: validation output is not deterministic");
  return problems;
});

/* ---------------- summary ---------------- */

const total = passes + failures;
console.log("");
console.log("MARZI-061 external review readiness: " + passes + "/" + total + " checks passed");
console.log("tracks: 4 prepared, 4 pending, 0 appointed, 0 started, 0 decided");
console.log("matrices: " + data["learning-evidence-matrix.json"].entries.length + " learning entries, " +
  data["linguistic-matrix.json"].entries.length + " linguistic entries across " + LOCALE_ORDER.join(","));
if (failures) {
  console.error("");
  console.error(failures + " check(s) failed.");
  process.exit(1);
}
console.log("All MARZI-061 readiness checks passed. No external review has been performed.");
