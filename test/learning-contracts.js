/**
 * MARZI-021 learning-contract validator — dependency-free, runs with plain
 * `node test/learning-contracts.js`.
 *
 * It validates the static learning contracts under docs/learning/contracts/v1
 * against their schemas, checks the semantic rules the package specification
 * requires, proves coverage of and detects drift from the live production
 * scenario source, runs the positive fixtures, and proves that every negative
 * fixture fails for its intended, stable reason code.
 *
 * It never writes a file, never opens a network connection, never installs or
 * imports a dependency, and never evaluates repository source as code.
 * The final two guards are enforced at runtime by this file and reported as
 * ordinary checks.
 *
 * Exit code 0 means every check passed. Any other exit code means at least one
 * check failed and the failure detail is printed above the summary.
 */
"use strict";

/* ---------------- environment guards (installed before anything else) ------ */

const guardViolations = [];
const Module = require("node:module");
const NETWORK_MODULES = new Set([
  "http", "https", "net", "dgram", "dns", "tls", "http2", "child_process", "worker_threads",
  "node:http", "node:https", "node:net", "node:dgram", "node:dns", "node:tls", "node:http2",
  "node:child_process", "node:worker_threads"
]);
/* MARZI-021-C008: the virtual machine module is an execution route, not a
   network route, and is refused for that reason. */
const EXECUTION_MODULES = new Set(["vm", "node:vm"]);
const originalLoad = Module._load;
Module._load = function (request, parent, isMain) {
  if (NETWORK_MODULES.has(request)) {
    guardViolations.push("network or process module requested: " + request);
    throw new Error("network access is not permitted in the learning-contract validator");
  }
  if (EXECUTION_MODULES.has(request)) {
    guardViolations.push("DYNAMIC_EXECUTION_FORBIDDEN: execution module requested: " + request);
    throw new Error("dynamic execution is not permitted in the learning-contract validator");
  }
  return originalLoad.call(this, request, parent, isMain);
};

const fs = require("node:fs");
const path = require("node:path");

/* MARZI-021-C004: every path-based write route is blocked outright, across the
   synchronous, callback, and promise APIs, including write-mode opens that
   would otherwise yield a writable descriptor or FileHandle.
   fs.write/fs.writeSync stay reachable for descriptors 1 and 2 only, because
   Node itself uses them to flush this process's stdout and stderr when the
   output is a pipe. */
const WRITE_METHODS = [
  "writeFile", "writeFileSync", "appendFile", "appendFileSync", "createWriteStream",
  "mkdir", "mkdirSync", "mkdtemp", "mkdtempSync", "rm", "rmSync", "rmdir", "rmdirSync",
  "unlink", "unlinkSync", "rename", "renameSync", "truncate", "truncateSync",
  "ftruncate", "ftruncateSync", "copyFile", "copyFileSync", "cp", "cpSync",
  "link", "linkSync", "symlink", "symlinkSync", "chmod", "chmodSync",
  "chown", "chownSync", "utimes", "utimesSync", "open", "openSync"
];
const READ_ONLY_FLAGS = new Set(["r", "rs", "sr", 0]);
const isReadOnlyOpen = (flags) => flags === undefined || READ_ONLY_FLAGS.has(flags);
function blockWrite(target, name, label) {
  if (typeof target[name] !== "function") return;
  const original = target[name];
  target[name] = function (...args) {
    if ((name === "open" || name === "openSync") && isReadOnlyOpen(args[1])) {
      return original.apply(target, args);
    }
    guardViolations.push("filesystem write attempted: " + label + "." + name);
    throw new Error("the learning-contract validator must not write files");
  };
  target[name].__original = original;
}
for (const name of WRITE_METHODS) blockWrite(fs, name, "fs");
for (const name of ["write", "writeSync"]) {
  const original = fs[name];
  fs[name] = function (...args) {
    if (args[0] !== 1 && args[0] !== 2) {
      guardViolations.push("filesystem write attempted: fs." + name + " on descriptor " + args[0]);
      throw new Error("the learning-contract validator must not write files");
    }
    return original.apply(fs, args);
  };
  fs[name].__original = original;
}
/* fs.promises is the same object that require("node:fs/promises") resolves to,
   so guarding it once covers both entry points and every FileHandle obtained
   through it. */
const fsp = fs.promises;
const PROMISE_WRITE_METHODS = [
  "writeFile", "appendFile", "mkdir", "mkdtemp", "rm", "rmdir", "unlink", "rename",
  "truncate", "copyFile", "cp", "link", "symlink", "chmod", "chown", "utimes", "open"
];
for (const name of PROMISE_WRITE_METHODS) blockWrite(fsp, name, "fs.promises");
if (typeof globalThis.fetch === "function") {
  globalThis.fetch = function () {
    guardViolations.push("fetch attempted");
    throw new Error("network access is not permitted in the learning-contract validator");
  };
}

/* ---------------- test harness ---------------- */

const ROOT = path.join(__dirname, "..");
const CONTRACTS = path.join(ROOT, "docs/learning/contracts/v1");
const SCHEMAS = path.join(CONTRACTS, "schema");
const FIXTURES = path.join(ROOT, "test/fixtures/learning");

/* MARZI-021-C004: an independent proof that nothing was written. Protected
   trees are fingerprinted by content hash, not by size and mtime, so a
   same-size same-timestamp rewrite cannot pass. */
const crypto = require("node:crypto");
function fingerprint(dir) {
  const entries = [];
  const walk = (current) => {
    for (const name of fs.readdirSync(current).sort()) {
      const full = path.join(current, name);
      const info = fs.lstatSync(full);
      if (info.isDirectory()) walk(full);
      else {
        const digest = info.isFile()
          ? crypto.createHash("sha256").update(fs.readFileSync(full)).digest("hex")
          : "non-regular:" + info.mode;
        entries.push(path.relative(ROOT, full) + ":" + digest);
      }
    }
  };
  walk(dir);
  return entries.join("\n");
}
const PROTECTED_TREES = [path.join(ROOT, "docs/learning"), FIXTURES, __filename];
function protectedFingerprint() {
  return PROTECTED_TREES.map((target) =>
    fs.statSync(target).isDirectory()
      ? fingerprint(target)
      : path.relative(ROOT, target) + ":" + crypto.createHash("sha256").update(fs.readFileSync(target)).digest("hex")
  ).join("\n");
}
const fingerprintBefore = protectedFingerprint();

let failures = 0;
let passes = 0;
function check(name, fn) {
  let problems;
  try {
    problems = fn() || [];
  } catch (error) {
    problems = ["threw: " + (error && error.message ? error.message : String(error))];
  }
  if (problems.length === 0) {
    passes++;
    console.log("  ok  " + name);
    return;
  }
  failures++;
  console.error("FAIL  " + name);
  for (const problem of problems.slice(0, 12)) console.error("        " + problem);
  if (problems.length > 12) console.error("        … and " + (problems.length - 12) + " more");
}

const read = (file) => fs.readFileSync(file, "utf8");
const readJson = (file) => JSON.parse(read(file));

/* ---------------- minimal schema engine ---------------- */
/* Supported keywords: type (string or list), const, enum, pattern, minLength,
   minimum, maximum, items, minItems, maxItems, uniqueItems, properties,
   required, additionalProperties:false, $ref to #/$defs/<name>.
   Everything is checked structurally; no code is generated or evaluated. */

function typeOf(value) {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  if (Number.isInteger(value)) return "integer";
  return typeof value;
}

function schemaCheck(schema, value, where, root, issues) {
  if (schema.$ref) {
    const name = schema.$ref.replace("#/$defs/", "");
    const target = (root.$defs || {})[name];
    if (!target) {
      issues.push({ code: "SCHEMA_REF_UNRESOLVED", where, detail: schema.$ref });
      return issues;
    }
    return schemaCheck(target, value, where, root, issues);
  }

  if (schema.type !== undefined) {
    const allowed = Array.isArray(schema.type) ? schema.type : [schema.type];
    const actual = typeOf(value);
    const ok = allowed.includes(actual) ||
      (allowed.includes("number") && (actual === "integer" || actual === "number"));
    if (!ok) {
      issues.push({ code: "SCHEMA_TYPE_INVALID", where, detail: "expected " + allowed.join("|") + ", got " + actual });
      return issues;
    }
  }
  if (schema.const !== undefined && value !== schema.const) {
    issues.push({ code: "SCHEMA_CONST_INVALID", where, detail: "expected " + JSON.stringify(schema.const) + ", got " + JSON.stringify(value) });
  }
  if (schema.enum !== undefined && !schema.enum.includes(value)) {
    issues.push({ code: "SCHEMA_ENUM_INVALID", where, detail: JSON.stringify(value) + " is not one of " + schema.enum.join(", ") });
  }
  if (typeof value === "string") {
    if (schema.pattern !== undefined && !new RegExp(schema.pattern, "u").test(value)) {
      issues.push({ code: "SCHEMA_PATTERN_INVALID", where, detail: JSON.stringify(value) + " does not match " + schema.pattern });
    }
    if (schema.minLength !== undefined && value.length < schema.minLength) {
      issues.push({ code: "SCHEMA_STRING_TOO_SHORT", where, detail: "length " + value.length + " < " + schema.minLength });
    }
  }
  if (typeof value === "number") {
    if (schema.minimum !== undefined && value < schema.minimum) {
      issues.push({ code: "SCHEMA_NUMBER_OUT_OF_RANGE", where, detail: value + " < " + schema.minimum });
    }
    if (schema.maximum !== undefined && value > schema.maximum) {
      issues.push({ code: "SCHEMA_NUMBER_OUT_OF_RANGE", where, detail: value + " > " + schema.maximum });
    }
  }
  if (Array.isArray(value)) {
    if (schema.minItems !== undefined && value.length < schema.minItems) {
      issues.push({ code: "SCHEMA_ARRAY_TOO_SHORT", where, detail: value.length + " < " + schema.minItems });
    }
    if (schema.maxItems !== undefined && value.length > schema.maxItems) {
      issues.push({ code: "SCHEMA_ARRAY_TOO_LONG", where, detail: value.length + " > " + schema.maxItems });
    }
    if (schema.uniqueItems) {
      const seen = new Set();
      for (const item of value) {
        const key = JSON.stringify(item);
        if (seen.has(key)) issues.push({ code: "SCHEMA_ITEMS_NOT_UNIQUE", where, detail: key });
        seen.add(key);
      }
    }
    if (schema.items) {
      value.forEach((item, index) => schemaCheck(schema.items, item, where + "[" + index + "]", root, issues));
    }
  }
  if (value && typeof value === "object" && !Array.isArray(value)) {
    for (const name of schema.required || []) {
      if (!Object.prototype.hasOwnProperty.call(value, name)) {
        issues.push({ code: "SCHEMA_REQUIRED_MISSING", where, detail: "missing property " + name });
      }
    }
    const properties = schema.properties || {};
    if (schema.additionalProperties === false) {
      for (const key of Object.keys(value)) {
        if (!Object.prototype.hasOwnProperty.call(properties, key)) {
          issues.push({ code: "SCHEMA_UNKNOWN_FIELD", where, detail: "unexpected property " + key });
        }
      }
    }
    for (const [key, subSchema] of Object.entries(properties)) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        schemaCheck(subSchema, value[key], where + "." + key, root, issues);
      }
    }
  }
  return issues;
}

function validateSchema(schema, value, where) {
  return schemaCheck(schema, value, where, schema, []);
}

/* ---------------- shared vocabularies ---------------- */

const LANGS = ["es", "en", "it", "tr", "ar", "uk"];
const LEVEL_ORDER = ["A0", "A1", "A2", "B1", "B2", "C1"];
const ALLOWED_EVIDENCE = ["transcript_text", "typed_response", "interaction_event"];
const ASSISTANCE_MODES = ["OFF", "HINT", "FULL"];
const EXCLUDED_SCENARIOS = ["random", "custom"];
const RESULT_STATES = ["complete", "partial", "not_complete", "insufficient_evidence", "invalid"];
const OBSERVATION_OUTCOMES = [
  "demonstrated", "partially_demonstrated", "not_demonstrated",
  "not_observed", "insufficient_evidence", "invalid"
];
const OBJECTIVE_ID_PATTERN = /^(de|en)\.[a-z0-9_]+\.[a-z0-9_]+\.[a-z0-9_]+$/;

/* MARZI-021-C008: bounded detection of dynamic code execution. The patterns are
   assembled from fragments so that this helper can never match its own source,
   and they target executable syntax rather than the words themselves, so prose
   and comments that merely mention the constructs do not fail. */
const DYNAMIC_EXECUTION_PATTERNS = [
  ["eval", new RegExp("(^|[^.\\w])" + "eval" + "\\s*\\(")],
  ["new Function", new RegExp("\\bnew\\s+" + "Function" + "\\s*\\(")],
  ["Function constructor", new RegExp("(^|[^.\\w])" + "Function" + "\\s*\\(\\s*[\"'`]")],
  ["AsyncFunction", new RegExp("\\b" + "AsyncFunction" + "\\s*\\(")],
  ["GeneratorFunction", new RegExp("\\b" + "GeneratorFunction" + "\\s*\\(")],
  ["node:vm require", new RegExp("require\\s*\\(\\s*[\"'`]" + "(node:)?vm" + "[\"'`]")],
  ["vm execution API", new RegExp("\\.\\s*(runIn[A-Za-z]*Context|compileFunction)\\s*\\(")]
];
function dynamicExecutionIssues(source, where) {
  const issues = [];
  for (const [label, pattern] of DYNAMIC_EXECUTION_PATTERNS) {
    if (pattern.test(source)) {
      issues.push({ code: "DYNAMIC_EXECUTION_FORBIDDEN", where, detail: label });
    }
  }
  return issues;
}

/**
 * MARZI-021-C001 — the single canonical completion derivation.
 *
 * Pure and bounded. Given the required criterion identifiers, the outcome
 * observed for each, and whether the evaluation context itself is unusable, it
 * returns exactly one of the five states or an explicit error. It never
 * defaults silently, and optional criteria are never passed in.
 */
function deriveObjectiveResult(requiredIds, observed, contextInvalid) {
  if (!Array.isArray(requiredIds) || requiredIds.length === 0) {
    return { state: null, error: "COMPLETION_POLICY_CONTRADICTION",
      detail: "an objective with no required criterion cannot produce a completion result" };
  }
  const get = (id) => (observed instanceof Map ? observed.get(id) : (observed || {})[id]);
  const outcomes = requiredIds.map(get);
  for (const outcome of outcomes) {
    if (outcome !== undefined && !OBSERVATION_OUTCOMES.includes(outcome)) {
      return { state: null, error: "COMPLETION_POLICY_CONTRADICTION",
        detail: "unknown observation outcome " + JSON.stringify(outcome) };
    }
  }
  const missing = (o) => o === undefined || o === "not_observed" || o === "insufficient_evidence";
  if (contextInvalid || outcomes.includes("invalid")) return { state: "invalid", outcomes };
  if (outcomes.includes("not_demonstrated")) return { state: "not_complete", outcomes };
  if (outcomes.some(missing)) return { state: "insufficient_evidence", outcomes };
  if (outcomes.every((o) => o === "demonstrated")) return { state: "complete", outcomes };
  if (outcomes.includes("partially_demonstrated") &&
      outcomes.every((o) => o === "demonstrated" || o === "partially_demonstrated")) {
    return { state: "partial", outcomes };
  }
  return { state: null, error: "COMPLETION_POLICY_CONTRADICTION",
    detail: "outcome combination is not covered by the truth table: " + outcomes.map(String).join(",") };
}

/* Tokens that may never appear as an object key or as an identifier-shaped
   value outside a declared denylist. Prose is exempt on purpose: the contracts
   have to be able to say "mastery never reads XP". */
const REWARD_TOKENS = /(^|_)(xp|coin|coins|price|prices|reward|rewards|entitlement|entitlements|premium|wallet)(_|$)/i;
const ACOUSTIC_TOKENS = /(^|_)(raw_?audio|pronunciation|pronunciation_score|accent|speech_?rate|asr_?confidence|device_?confidence|phoneme|prosody)(_|$)/i;
const UNSAFE_VALUE = /(<\s*\/?\s*[a-z]|javascript\s*:|data\s*:|on[a-z]+\s*=|https?:\/\/)/i;

/* Activity proxies that may never appear in a criterion observation. */
const PROXY_PHRASES = [
  "ended the call", "ends the call", "hung up", "hangs up", "hang up",
  "spent time", "time spent", "elapsed time", "call duration", "minutes",
  "earned xp", "xp", "coins", "reward", "streak", "rank",
  "visit count", "visited", "scenariosdone", "seemed fluent", "sounds fluent",
  "pronunciation", "accent", "speech rate", "number of turns", "turn count"
];

/* Paths whose contents are deliberate denylists and are therefore exempt from
   the reward/acoustic identifier scan. */
const DENYLIST_PATHS = {
  "evidence.json": ["rejectedEvidenceTypes"],
  "mastery.json": ["forbiddenInputs"],
  "completion.json": ["participation.doesNotProve", "meaningfulAttempt.excludes", "scenarioCompletion.neverDerivedFrom"],
  "review.json": ["neverRemoves", "neverCreatesNegativeObservation"],
  "placement.json": ["resultContract.mustNotProduce", "outOfScope"]
};

const IDENTIFIER_SHAPE = /^[a-zA-Z][a-zA-Z0-9_]*$/;

/* camelCase and snake_case are normalised to the same shape so that neither
   `xp_value` nor `xpValue` can slip past the economy and acoustic scans. */
const normalizeIdentifier = (name) => name.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase();

function scanTokens(value, where, exemptPrefixes, issues) {
  const exempt = (p) => exemptPrefixes.some((prefix) => p === prefix || p.startsWith(prefix + "."));
  const walk = (node, p) => {
    if (Array.isArray(node)) {
      node.forEach((item, index) => walk(item, p));
      return;
    }
    if (node && typeof node === "object") {
      for (const [key, child] of Object.entries(node)) {
        const childPath = p ? p + "." + key : key;
        const normalizedKey = normalizeIdentifier(key);
        if (REWARD_TOKENS.test(normalizedKey)) {
          issues.push({ code: "REWARD_VALUE_PRESENT", where: where + ":" + childPath, detail: "reward-shaped key " + key });
        }
        if (ACOUSTIC_TOKENS.test(normalizedKey)) {
          issues.push({ code: "ACOUSTIC_EVIDENCE_REJECTED", where: where + ":" + childPath, detail: "acoustic-shaped key " + key });
        }
        walk(child, childPath);
      }
      return;
    }
    if (typeof node === "string" && IDENTIFIER_SHAPE.test(node) && !exempt(p)) {
      const normalized = normalizeIdentifier(node);
      if (REWARD_TOKENS.test(normalized)) {
        issues.push({ code: "REWARD_VALUE_PRESENT", where: where + ":" + p, detail: "reward-shaped value " + node });
      }
      if (ACOUSTIC_TOKENS.test(normalized)) {
        issues.push({ code: "ACOUSTIC_EVIDENCE_REJECTED", where: where + ":" + p, detail: "acoustic-shaped value " + node });
      }
    }
    if (typeof node === "string" && UNSAFE_VALUE.test(node)) {
      issues.push({ code: "UNSAFE_CONTENT", where: where + ":" + p, detail: JSON.stringify(node.slice(0, 60)) });
    }
  };
  walk(value, "");
  return issues;
}

/* ---------------- live production source (parsed, never evaluated) -------- */

/**
 * Reads the production scenario inventory straight out of public/index.html by
 * scanning the source text. The file is never executed and never imported: the
 * parser only slices string literals, so a change to application behaviour can
 * never run inside this validator.
 */
function readLiveInventory() {
  const html = read(path.join(ROOT, "public/index.html"));
  const scriptStart = html.indexOf("<script>");
  const scriptEnd = html.lastIndexOf("</script>");
  if (scriptStart < 0 || scriptEnd < 0) throw new Error("could not locate the inline application script");
  const src = html.slice(scriptStart, scriptEnd);

  const enPackStart = src.indexOf("const EN_SCENARIOS = [");
  if (enPackStart < 0) throw new Error("could not locate the English pilot pack");

  /* Every production scenario is an object literal whose goals are written as
     an array of double-quoted string literals. The one dynamic construction in
     the file (the custom scenario) writes `goals:[topic]` and therefore never
     matches `goals:["`. */
  const packs = { de: [], en: [] };
  const marker = 'goals:["';
  for (let at = src.indexOf(marker); at >= 0; at = src.indexOf(marker, at + 1)) {
    const idAt = src.lastIndexOf('id:"', at);
    if (idAt < 0) throw new Error("goals array without a preceding scenario id at offset " + at);
    const idEnd = src.indexOf('"', idAt + 4);
    const scenarioId = src.slice(idAt + 4, idEnd);
    const body = src.slice(idAt, at);
    const goals = [];
    let cursor = at + "goals:[".length;
    for (;;) {
      while (cursor < src.length && /\s|,/.test(src[cursor])) cursor++;
      if (src[cursor] === "]") { cursor++; break; }
      if (src[cursor] !== '"') throw new Error("unexpected goal literal in scenario " + scenarioId);
      const close = src.indexOf('"', cursor + 1);
      if (close < 0) throw new Error("unterminated goal literal in scenario " + scenarioId);
      const literal = src.slice(cursor + 1, close);
      if (literal.includes("\\")) throw new Error("escaped goal literal is not supported: " + scenarioId);
      goals.push(literal);
      cursor = close + 1;
    }
    const target = at < enPackStart ? "de" : "en";
    packs[target].push({
      scenarioId,
      mode: /kind:"face"/.test(body) ? "face" : "phone",
      goals
    });
  }

  const groupsOf = (blockName) => {
    const start = src.indexOf("const " + blockName + " = [");
    if (start < 0) throw new Error("could not locate " + blockName);
    const end = src.indexOf("\n];", start);
    const block = src.slice(start, end);
    const groups = [];
    const entry = /\{[^{}]*?en:"([^"]+)"[^{}]*?ids:\[([^\]]*)\][^{}]*?\}/g;
    for (const match of block.matchAll(entry)) {
      const ids = match[2].split(",").map((s) => s.trim().replace(/^"|"$/g, "")).filter(Boolean);
      groups.push({ name: match[1], ids });
    }
    return groups;
  };

  const assignGroups = (target, groups) => {
    const byId = new Map();
    for (const group of groups) for (const id of group.ids) byId.set(id, group.name);
    for (const scenario of packs[target]) scenario.scenarioGroup = byId.get(scenario.scenarioId) || null;
  };
  assignGroups("de", groupsOf("GROUPS"));
  assignGroups("en", groupsOf("EN_GROUPS"));

  return packs;
}

/* ---------------- load everything ---------------- */

const schema = {};
for (const file of fs.readdirSync(SCHEMAS).sort()) schema[file] = readJson(path.join(SCHEMAS, file));

const contract = {};
for (const file of fs.readdirSync(CONTRACTS).sort()) {
  if (file.endsWith(".json")) contract[file] = readJson(path.join(CONTRACTS, file));
}

const live = readLiveInventory();

const competencyIds = new Set(contract["competencies.json"].competencies.map((c) => c.id));
const scenarioContracts = { de: contract["scenarios.de.json"], en: contract["scenarios.en.json"] };

const objectiveIndex = new Map();
for (const target of ["de", "en"]) {
  for (const scenario of scenarioContracts[target].scenarios) {
    for (const objective of scenario.objectives) {
      objectiveIndex.set(objective.id, { objective, scenario, target });
    }
  }
}

const fmt = (issues) => issues.map((i) => i.code + " at " + i.where + ": " + i.detail);

/* ---------------- 01 environment ---------------- */

check("01 environment: guards installed, no dependency imported, no dynamic execution", () => {
  const problems = [];
  if (fs.writeFileSync.__original === undefined) problems.push("filesystem write guard is not installed");
  if (fs.promises.writeFile.__original === undefined) problems.push("fs.promises write guard is not installed");
  if (fs.openSync.__original === undefined) problems.push("write-mode open guard is not installed");
  if (Module._load === originalLoad) problems.push("module guard is not installed");
  const loaded = Object.keys(require.cache);
  const outside = loaded.filter((file) => file.includes("node_modules"));
  if (outside.length) problems.push("dependency loaded: " + outside[0]);
  problems.push(...fmt(dynamicExecutionIssues(read(__filename), "test/learning-contracts.js")));
  return problems;
});

/* ---------------- 02 parse ---------------- */

check("02 contracts: every artifact and schema parses as JSON", () => {
  const problems = [];
  const expectedContracts = [
    "competencies.json", "completion.json", "evidence.json", "levels.json", "mastery.json",
    "placement.json", "prerequisites.json", "review.json", "scenarios.de.json",
    "scenarios.en.json", "source-inventory.json"
  ];
  for (const name of expectedContracts) {
    if (!contract[name]) problems.push("missing contract artifact: " + name);
  }
  for (const name of expectedContracts) {
    const schemaName = name.replace(/^scenarios\.(de|en)\.json$/, "scenarios.json").replace(/\.json$/, ".schema.json");
    if (!schema[schemaName]) problems.push("missing schema: " + schemaName);
  }
  return problems;
});

/* ---------------- 03 competencies ---------------- */

check("03 competencies: schema, unique identifiers, family agreement", () => {
  const doc = contract["competencies.json"];
  const problems = fmt(validateSchema(schema["competencies.schema.json"], doc, "competencies.json"));
  const seen = new Set();
  for (const entry of doc.competencies) {
    if (seen.has(entry.id)) problems.push("DUPLICATE_ID at competencies.json: " + entry.id);
    seen.add(entry.id);
    if (entry.id.split(".")[0] !== entry.family) {
      problems.push("FAMILY_PREFIX_MISMATCH at competencies.json: " + entry.id + " declares family " + entry.family);
    }
  }
  const families = new Set(doc.families.map((f) => f.id));
  for (const entry of doc.competencies) {
    if (!families.has(entry.family)) problems.push("UNKNOWN_FAMILY_REF at competencies.json: " + entry.family);
  }
  return problems;
});

/* ---------------- 04 levels ---------------- */

check("04 levels: A0-C1 ordering, contiguous ordinals, no certification claim", () => {
  const doc = contract["levels.json"];
  const problems = fmt(validateSchema(schema["levels.schema.json"], doc, "levels.json"));
  if (doc.order.join(",") !== LEVEL_ORDER.join(",")) {
    problems.push("LEVEL_ORDER_INVALID at levels.json: " + doc.order.join(","));
  }
  doc.bands.forEach((band, index) => {
    if (band.id !== LEVEL_ORDER[index]) problems.push("LEVEL_ORDER_INVALID at levels.json.bands[" + index + "]: " + band.id);
    if (band.ordinal !== index) problems.push("LEVEL_ORDINAL_INVALID at levels.json.bands[" + index + "]: " + band.ordinal);
  });
  if (doc.certificationClaim !== false) problems.push("CERTIFICATION_CLAIM_PRESENT at levels.json");
  return problems;
});

/* ---------------- 05 prerequisites ---------------- */

function prerequisiteIssues(doc, knownNodes) {
  const issues = [];
  const seen = new Set();
  const adjacency = new Map();
  for (const edge of doc.edges) {
    const key = edge.from + "->" + edge.to;
    if (edge.kind !== "recommended") {
      issues.push({ code: "PREREQ_KIND_UNSUPPORTED", where: "prerequisites:" + key, detail: edge.kind });
    }
    if (edge.from === edge.to) {
      issues.push({ code: "PREREQ_SELF_EDGE", where: "prerequisites:" + key, detail: edge.from });
    }
    if (seen.has(key)) {
      issues.push({ code: "PREREQ_DUPLICATE_EDGE", where: "prerequisites:" + key, detail: key });
    }
    seen.add(key);
    for (const node of [edge.from, edge.to]) {
      if (!knownNodes.has(node)) {
        issues.push({ code: "PREREQ_UNKNOWN_NODE", where: "prerequisites:" + key, detail: node });
      }
    }
    if (edge.from === edge.to) continue;
    if (!adjacency.has(edge.from)) adjacency.set(edge.from, []);
    adjacency.get(edge.from).push(edge.to);
  }
  const state = new Map();
  const stack = [];
  const visit = (node) => {
    if (state.get(node) === "done") return;
    if (state.get(node) === "open") {
      issues.push({ code: "PREREQ_CYCLE", where: "prerequisites", detail: stack.concat(node).join(" -> ") });
      return;
    }
    state.set(node, "open");
    stack.push(node);
    for (const next of adjacency.get(node) || []) visit(next);
    stack.pop();
    state.set(node, "done");
  };
  for (const node of adjacency.keys()) visit(node);
  return issues;
}

check("05 prerequisites: acyclic recommended graph, known nodes, no hard lock", () => {
  const doc = contract["prerequisites.json"];
  const problems = fmt(validateSchema(schema["prerequisites.schema.json"], doc, "prerequisites.json"));
  if (doc.hardLock !== false) problems.push("PREREQ_HARD_LOCK at prerequisites.json");
  return problems.concat(fmt(prerequisiteIssues(doc, competencyIds)));
});

/* ---------------- 06 evidence ---------------- */

check("06 evidence: allowed set, rejected acoustic set, assistance separated from accommodation", () => {
  const doc = contract["evidence.json"];
  const problems = fmt(validateSchema(schema["evidence.schema.json"], doc, "evidence.json"));
  const allowed = doc.allowedEvidenceTypes.map((e) => e.id);
  if (allowed.join(",") !== ALLOWED_EVIDENCE.join(",")) {
    problems.push("EVIDENCE_TYPE_UNSUPPORTED at evidence.json: allowed set is " + allowed.join(","));
  }
  const rejected = new Set(doc.rejectedEvidenceTypes.map((e) => e.id));
  for (const required of ["raw_audio", "pronunciation_score", "accent", "speech_rate", "asr_confidence"]) {
    if (!rejected.has(required)) problems.push("ACOUSTIC_EVIDENCE_NOT_REJECTED at evidence.json: " + required);
  }
  for (const id of allowed) {
    if (rejected.has(id)) problems.push("EVIDENCE_SET_OVERLAP at evidence.json: " + id);
  }
  const accommodations = new Set(doc.accessibilityAccommodation.accommodations);
  for (const mode of doc.assistance.modes) {
    if (accommodations.has(mode)) problems.push("ASSISTANCE_ACCOMMODATION_CONFLATED at evidence.json: " + mode);
  }
  for (const field of doc.accessibilityAccommodation.fields) {
    if (doc.assistance.fields.includes(field)) {
      problems.push("ASSISTANCE_ACCOMMODATION_CONFLATED at evidence.json: shared field " + field);
    }
  }
  const outcomes = doc.observationOutcomes.map((o) => o.id);
  if (!outcomes.includes("insufficient_evidence")) {
    problems.push("INSUFFICIENT_EVIDENCE_MISSING at evidence.json");
  }
  return problems;
});

/* ---------------- 07 completion ---------------- */

check("07 completion: MARZI-D016 option A, partial and insufficient evidence are first class", () => {
  const doc = contract["completion.json"];
  const problems = fmt(validateSchema(schema["completion.schema.json"], doc, "completion.json"));
  if (doc.decision.id !== "MARZI-D016" || doc.decision.status !== "APPROVED" || doc.decision.selectedOption !== "A") {
    problems.push("DECISION_RECORD_INVALID at completion.json");
  }
  const states = doc.objectiveResultStates.map((s) => s.id);
  for (const required of ["complete", "partial", "not_complete", "insufficient_evidence", "invalid"]) {
    if (!states.includes(required)) problems.push("RESULT_STATE_MISSING at completion.json: " + required);
    if (!doc.learnerFacingCopy[required]) problems.push("LEARNER_COPY_MISSING at completion.json: " + required);
  }
  const policies = new Map(doc.policies.map((p) => [p.id, p]));
  if (!policies.has("all_required") || policies.get("all_required").releaseReady !== true) {
    problems.push("COMPLETION_POLICY_INVALID at completion.json: all_required must be release ready");
  }
  if (!policies.has("PENDING_MARZI_D016") || policies.get("PENDING_MARZI_D016").releaseReady !== false) {
    problems.push("COMPLETION_POLICY_INVALID at completion.json: the draft policy must exist and be blocked from release");
  }
  for (const forbidden of ["hang_up", "elapsed_time", "reward_success", "visit_count", "scenariosDone", "xp", "coins"]) {
    if (!doc.scenarioCompletion.neverDerivedFrom.includes(forbidden)) {
      problems.push("COMPLETION_INPUT_NOT_EXCLUDED at completion.json: " + forbidden);
    }
  }
  if (doc.remediation.alwaysAvailable !== true) problems.push("REMEDIATION_UNAVAILABLE at completion.json");
  return problems;
});

/* ---------------- 08 mastery ---------------- */

check("08 mastery: independent from XP and activity, thresholds remain an explicit open gate", () => {
  const doc = contract["mastery.json"];
  const problems = fmt(validateSchema(schema["mastery.schema.json"], doc, "mastery.json"));
  const states = doc.states.map((s) => s.id);
  for (const required of ["not_enough_evidence", "emerging", "developing", "secure", "review_due"]) {
    if (!states.includes(required)) problems.push("MASTERY_STATE_MISSING at mastery.json: " + required);
    if (!doc.learnerFacingCopy[required]) problems.push("LEARNER_COPY_MISSING at mastery.json: " + required);
  }
  if (doc.defaultState !== "not_enough_evidence") problems.push("MASTERY_DEFAULT_INVALID at mastery.json");
  for (const forbidden of ["xp", "coins", "rank", "marzi_stage", "elapsed_time", "hang_up", "reward_claim", "scenariosDone", "map_node_count", "streak"]) {
    if (!doc.forbiddenInputs.includes(forbidden)) {
      problems.push("MASTERY_FORBIDDEN_INPUT_MISSING at mastery.json: " + forbidden);
    }
  }
  if (doc.thresholds.status !== "OPEN_GATE") problems.push("THRESHOLD_GATE_CLOSED at mastery.json");
  for (const key of ["minimumDistinctOpportunities", "minimumDistinctContexts", "recencyWindowDays", "aggregationWeights"]) {
    if (doc.thresholds[key] !== null) {
      problems.push("INVENTED_DEFAULT at mastery.json.thresholds." + key + ": " + JSON.stringify(doc.thresholds[key]));
    }
  }
  return problems;
});

/* ---------------- 09 placement ---------------- */

check("09 placement: MARZI-D009 option A boundary, non-audio route, no certification claim", () => {
  const doc = contract["placement.json"];
  const problems = fmt(validateSchema(schema["placement.schema.json"], doc, "placement.json"));
  if (doc.decision.id !== "MARZI-D009" || doc.decision.status !== "APPROVED" || doc.decision.selectedOption !== "A") {
    problems.push("DECISION_RECORD_INVALID at placement.json");
  }
  for (const [key, expected] of [["optional", true], ["skippable", true], ["bounded", true],
    ["resultIsProvisional", true], ["revisableByLaterEvidence", true],
    ["producesPermanentLabel", false], ["externalCertificationClaim", false]]) {
    if (doc.boundary[key] !== expected) problems.push("PLACEMENT_BOUNDARY_INVALID at placement.json." + key);
  }
  if (doc.speechModality.microphonePermissionBeforeExplanation !== false) {
    problems.push("PLACEMENT_CONSENT_INVALID at placement.json");
  }
  if (doc.nonAudioRoute.required !== true) problems.push("PLACEMENT_NON_AUDIO_ROUTE_MISSING at placement.json");
  for (const forbidden of ["single_cefr_truth_claim", "certification", "permanent_label", "reward", "xp", "coins"]) {
    if (!doc.resultContract.mustNotProduce.includes(forbidden)) {
      problems.push("PLACEMENT_CLAIM_NOT_FORBIDDEN at placement.json: " + forbidden);
    }
  }
  if (!doc.resultContract.mustSupport.includes("not_enough_evidence")) {
    problems.push("INSUFFICIENT_EVIDENCE_MISSING at placement.json");
  }
  if (doc.calibrationContent.status !== "OPEN_GATE") problems.push("PLACEMENT_CONTENT_GATE_CLOSED at placement.json");
  for (const forbidden of ["onboarding UI", "onboarding step count"]) {
    if (!doc.outOfScope.includes(forbidden)) problems.push("PLACEMENT_SCOPE_INVALID at placement.json: " + forbidden);
  }
  return problems;
});

/* ---------------- 10 review ---------------- */

check("10 review: evidence-driven candidates, no punitive effects, recency is an open gate", () => {
  const doc = contract["review.json"];
  const problems = fmt(validateSchema(schema["review.schema.json"], doc, "review.json"));
  for (const required of ["connectivity_failure", "provider_failure", "missing_microphone_permission", "accessibility_alternative_use"]) {
    if (!doc.neverCreatesNegativeObservation.includes(required)) {
      problems.push("REVIEW_NEGATIVE_OBSERVATION_ALLOWED at review.json: " + required);
    }
  }
  for (const required of ["xp", "coins", "streak", "rank"]) {
    if (!doc.neverRemoves.includes(required)) problems.push("REVIEW_REMOVES_EARNED_VALUE at review.json: " + required);
  }
  if (doc.recencyPolicy.status !== "OPEN_GATE" || doc.recencyPolicy.windowDays !== null) {
    problems.push("INVENTED_DEFAULT at review.json.recencyPolicy");
  }
  return problems;
});

/* ---------------- 11 source inventory ---------------- */

check("11 source inventory: frozen baseline totals are 29 scenarios and 94 variants", () => {
  const doc = contract["source-inventory.json"];
  const problems = fmt(validateSchema(schema["source-inventory.schema.json"], doc, "source-inventory.json"));
  if (doc.totals.scenarios !== 29) problems.push("COVERAGE_TOTAL_INVALID at source-inventory.json: " + doc.totals.scenarios);
  if (doc.totals.variants !== 94) problems.push("COVERAGE_TOTAL_INVALID at source-inventory.json: " + doc.totals.variants);
  if (doc.excludedScenarioIds.join(",") !== EXCLUDED_SCENARIOS.join(",")) {
    problems.push("SCENARIO_EXCLUSION_INVALID at source-inventory.json");
  }
  if (!/random/.test(doc.exclusionReason) || !/inherits/.test(doc.exclusionReason)) {
    problems.push("RANDOM_INHERITANCE_UNDOCUMENTED at source-inventory.json");
  }
  return problems;
});

/* ---------------- 12 scenario contracts: schema ---------------- */

check("12 scenario contracts: both target packs match the strict schema", () => {
  const problems = [];
  for (const target of ["de", "en"]) {
    problems.push(...fmt(validateSchema(schema["scenarios.schema.json"], scenarioContracts[target], "scenarios." + target + ".json")));
  }
  return problems;
});

/* ---------------- 13 identifiers ---------------- */

check("13 identifiers: unique, well formed, and consistent between variant and objective", () => {
  const problems = [];
  const seen = new Set();
  for (const target of ["de", "en"]) {
    const doc = scenarioContracts[target];
    for (const scenario of doc.scenarios) {
      if (EXCLUDED_SCENARIOS.includes(scenario.scenarioId)) {
        problems.push("SCENARIO_EXCLUDED at scenarios." + target + ".json: " + scenario.scenarioId);
      }
      for (const objective of scenario.objectives) {
        if (seen.has(objective.id)) problems.push("DUPLICATE_ID at scenarios." + target + ".json: " + objective.id);
        seen.add(objective.id);
        if (!objective.id.startsWith(objective.scenarioObjectiveId + ".")) {
          problems.push("ID_FORMAT_INVALID at " + objective.id + ": does not extend " + objective.scenarioObjectiveId);
        }
        const expectedPrefix = target + "." + scenario.scenarioId + ".";
        if (!objective.id.startsWith(expectedPrefix)) {
          problems.push("ID_FORMAT_INVALID at " + objective.id + ": expected prefix " + expectedPrefix);
        }
        const criterionIds = new Set();
        for (const criterion of objective.requiredCriteria.concat(objective.optionalCriteria)) {
          if (criterionIds.has(criterion.id)) {
            problems.push("DUPLICATE_ID at " + objective.id + ": criterion " + criterion.id);
          }
          criterionIds.add(criterion.id);
        }
      }
    }
  }
  return problems;
});

/* ---------------- 14 references ---------------- */

check("14 references: every competency reference resolves and matches the declared set", () => {
  const problems = [];
  for (const { objective } of objectiveIndex.values()) {
    const fromCriteria = new Set();
    for (const criterion of objective.requiredCriteria.concat(objective.optionalCriteria)) {
      if (!competencyIds.has(criterion.competencyId)) {
        problems.push("UNKNOWN_COMPETENCY_REF at " + objective.id + "." + criterion.id + ": " + criterion.competencyId);
      }
      fromCriteria.add(criterion.competencyId);
    }
    for (const declared of objective.competencies) {
      if (!competencyIds.has(declared)) {
        problems.push("UNKNOWN_COMPETENCY_REF at " + objective.id + ": " + declared);
      }
    }
    const declaredSorted = objective.competencies.slice().sort().join(",");
    const derivedSorted = Array.from(fromCriteria).sort().join(",");
    if (declaredSorted !== derivedSorted) {
      problems.push("COMPETENCY_SET_MISMATCH at " + objective.id + ": declared " + declaredSorted + " vs criteria " + derivedSorted);
    }
  }
  return problems;
});

/* ---------------- 15 localization ---------------- */

function localeIssues(objective) {
  const issues = [];
  const keys = Object.keys(objective.title);
  if (keys.length !== LANGS.length || !LANGS.every((lang) => keys.includes(lang))) {
    issues.push({ code: "LOCALE_PARITY", where: objective.id, detail: "titles present for " + keys.join(",") });
    return issues;
  }
  for (const lang of LANGS) {
    const value = objective.title[lang];
    if (typeof value !== "string" || value.trim().length === 0) {
      issues.push({ code: "LOCALE_PARITY", where: objective.id + "." + lang, detail: "empty title" });
      continue;
    }
    if (value !== value.trim()) {
      issues.push({ code: "LOCALE_PARITY", where: objective.id + "." + lang, detail: "untrimmed title" });
    }
    if (value === objective.id || value === objective.scenarioObjectiveId) {
      issues.push({ code: "LOCALE_PARITY", where: objective.id + "." + lang, detail: "title is an internal identifier" });
    }
  }
  return issues;
}

check("15 localization: exactly six explanation languages per objective title", () => {
  const problems = [];
  for (const { objective } of objectiveIndex.values()) problems.push(...fmt(localeIssues(objective)));
  return problems;
});

/* ---------------- 16 levels on objectives ---------------- */

function levelIssues(objective) {
  const issues = [];
  const min = LEVEL_ORDER.indexOf(objective.supportedLevels.min);
  const max = LEVEL_ORDER.indexOf(objective.supportedLevels.max);
  /* An unknown band is rejected by the schema enum, which owns that rule; this
     semantic check owns interval ordering only, so a single defect reports a
     single reason code (MARZI-021-C007). */
  if (min < 0 || max < 0) return issues;
  if (min > max) {
    issues.push({ code: "LEVEL_RANGE_REVERSED", where: objective.id, detail: objective.supportedLevels.min + " > " + objective.supportedLevels.max });
  }
  return issues;
}

check("16 levels: every objective declares a valid, non-reversed A0-C1 interval", () => {
  const problems = [];
  for (const { objective } of objectiveIndex.values()) problems.push(...fmt(levelIssues(objective)));
  return problems;
});

/* ---------------- 17 evidence on objectives ---------------- */

check("17 evidence: objectives allow only the three v1 types and no acoustic proxy", () => {
  const problems = [];
  const rejected = new Set(contract["evidence.json"].rejectedEvidenceTypes.map((e) => e.id));
  for (const { objective } of objectiveIndex.values()) {
    for (const type of objective.allowedEvidence) {
      if (rejected.has(type)) {
        problems.push("ACOUSTIC_EVIDENCE_REJECTED at " + objective.id + ": " + type);
      } else if (!ALLOWED_EVIDENCE.includes(type)) {
        problems.push("EVIDENCE_TYPE_UNSUPPORTED at " + objective.id + ": " + type);
      }
    }
  }
  return problems;
});

/* ---------------- 18 completion policy on objectives ---------------- */

check("18 completion policy: every objective uses the approved MARZI-D016 rule", () => {
  const problems = [];
  const known = new Set(contract["completion.json"].policies.map((p) => p.id));
  for (const { objective } of objectiveIndex.values()) {
    if (!known.has(objective.completionPolicy)) {
      problems.push("COMPLETION_POLICY_INVALID at " + objective.id + ": " + objective.completionPolicy);
    }
    if (objective.completionPolicy !== "all_required") {
      problems.push("COMPLETION_POLICY_UNAPPROVED at " + objective.id + ": " + objective.completionPolicy);
    }
  }
  return problems;
});

/* ---------------- 19 criterion quality ---------------- */

function proxyIssues(objective) {
  const issues = [];
  for (const criterion of objective.requiredCriteria.concat(objective.optionalCriteria)) {
    const observation = criterion.observation.toLowerCase();
    for (const phrase of PROXY_PHRASES) {
      const boundary = new RegExp("(^|[^a-z])" + phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "($|[^a-z])");
      if (boundary.test(observation)) {
        issues.push({ code: "CRITERION_PROXY_REJECTED", where: objective.id + "." + criterion.id, detail: phrase });
      }
    }
    if (!/\blearner\b|\bmutually established\b/.test(observation)) {
      issues.push({ code: "CRITERION_NOT_OBSERVABLE", where: objective.id + "." + criterion.id, detail: "observation names no observable party" });
    }
  }
  return issues;
}

check("19 criteria: no activity, reward, time, or fluency proxy is used as evidence", () => {
  const problems = [];
  for (const { objective } of objectiveIndex.values()) problems.push(...fmt(proxyIssues(objective)));
  return problems;
});

/* ---------------- 20 economy isolation ---------------- */

check("20 economy: no XP, coin, price, entitlement, or reward value in any contract", () => {
  const problems = [];
  for (const [name, doc] of Object.entries(contract)) {
    const issues = scanTokens(doc, name, DENYLIST_PATHS[name] || [], []);
    problems.push(...fmt(issues.filter((i) => i.code === "REWARD_VALUE_PRESENT")));
  }
  return problems;
});

/* ---------------- 21 acoustic isolation and safe content ---------------- */

check("21 safety: no acoustic evidence, executable markup, or external URL in any contract", () => {
  const problems = [];
  for (const [name, doc] of Object.entries(contract)) {
    const issues = scanTokens(doc, name, DENYLIST_PATHS[name] || [], []);
    problems.push(...fmt(issues.filter((i) => i.code !== "REWARD_VALUE_PRESENT")));
  }
  return problems;
});

/* ---------------- 22 coverage ---------------- */

check("22 coverage: 19/61 German and 10/33 English production variants, random and custom excluded", () => {
  const problems = [];
  const expected = { de: { scenarios: 19, variants: 61 }, en: { scenarios: 10, variants: 33 } };
  for (const target of ["de", "en"]) {
    const doc = scenarioContracts[target];
    const scenarios = doc.scenarios.length;
    const variants = doc.scenarios.reduce((n, s) => n + s.objectives.length, 0);
    if (scenarios !== expected[target].scenarios) {
      problems.push("COVERAGE_SCENARIO_COUNT at scenarios." + target + ".json: " + scenarios + " != " + expected[target].scenarios);
    }
    if (variants !== expected[target].variants) {
      problems.push("COVERAGE_VARIANT_COUNT at scenarios." + target + ".json: " + variants + " != " + expected[target].variants);
    }
    const liveIds = new Set(live[target].map((s) => s.scenarioId));
    const mappedIds = new Set(doc.scenarios.map((s) => s.scenarioId));
    for (const id of liveIds) {
      if (!mappedIds.has(id)) problems.push("SOURCE_COVERAGE_MISSING at scenarios." + target + ".json: " + id);
    }
    for (const id of mappedIds) {
      if (!liveIds.has(id)) problems.push("SCENARIO_ID_UNKNOWN at scenarios." + target + ".json: " + id);
      if (EXCLUDED_SCENARIOS.includes(id)) problems.push("SCENARIO_EXCLUDED at scenarios." + target + ".json: " + id);
    }
    for (const excluded of EXCLUDED_SCENARIOS) {
      if (!doc.excludedScenarioIds.includes(excluded)) {
        problems.push("SCENARIO_EXCLUSION_INVALID at scenarios." + target + ".json: " + excluded);
      }
    }
  }
  const total = ["de", "en"].reduce((n, t) => n + scenarioContracts[t].scenarios.reduce((m, s) => m + s.objectives.length, 0), 0);
  if (total !== 94) problems.push("COVERAGE_VARIANT_COUNT: total is " + total + " != 94");
  return problems;
});

/* ---------------- 23 source drift ---------------- */

check("23 drift: every production goal maps exactly once, by index and by exact text", () => {
  const problems = [];
  for (const target of ["de", "en"]) {
    const liveById = new Map(live[target].map((s) => [s.scenarioId, s]));
    for (const scenario of scenarioContracts[target].scenarios) {
      const source = liveById.get(scenario.scenarioId);
      if (!source) continue;
      if (scenario.sourceGoalCount !== source.goals.length) {
        problems.push("GOAL_COUNT_MISMATCH at " + target + "/" + scenario.scenarioId + ": contract " + scenario.sourceGoalCount + " vs source " + source.goals.length);
      }
      const covered = new Map();
      for (const objective of scenario.objectives) {
        const index = objective.sourceGoalIndex;
        if (index < 0 || index >= source.goals.length) {
          problems.push("SOURCE_INDEX_MISMATCH at " + objective.id + ": index " + index + " is outside the source array");
          continue;
        }
        if (covered.has(index)) {
          problems.push("SOURCE_COVERAGE_DUPLICATE at " + objective.id + ": index " + index + " already mapped by " + covered.get(index));
        }
        covered.set(index, objective.id);
        if (objective.sourceGoalText !== source.goals[index]) {
          problems.push("SOURCE_TEXT_DRIFT at " + objective.id + ": contract " + JSON.stringify(objective.sourceGoalText) +
            " vs source " + JSON.stringify(source.goals[index]));
        }
      }
      for (let index = 0; index < source.goals.length; index++) {
        if (!covered.has(index)) {
          problems.push("SOURCE_COVERAGE_MISSING at " + target + "/" + scenario.scenarioId + ": goal index " + index + " is not mapped");
        }
      }
    }
  }
  return problems;
});

/* ---------------- 24 scenario metadata ---------------- */

check("24 metadata: mode and group agree with the frozen production scenario registry", () => {
  const problems = [];
  for (const target of ["de", "en"]) {
    const liveById = new Map(live[target].map((s) => [s.scenarioId, s]));
    for (const scenario of scenarioContracts[target].scenarios) {
      const source = liveById.get(scenario.scenarioId);
      if (!source) continue;
      if (scenario.mode !== source.mode) {
        problems.push("MODE_MISMATCH at " + target + "/" + scenario.scenarioId + ": contract " + scenario.mode + " vs source " + source.mode);
      }
      if (scenario.scenarioGroup !== source.scenarioGroup) {
        problems.push("GROUP_MISMATCH at " + target + "/" + scenario.scenarioId + ": contract " + scenario.scenarioGroup + " vs source " + source.scenarioGroup);
      }
      if (scenario.targetLanguage !== target) {
        problems.push("TARGET_MISMATCH at " + target + "/" + scenario.scenarioId + ": " + scenario.targetLanguage);
      }
    }
  }
  return problems;
});

/* ---------------- 25 release mode ---------------- */

function releaseIssues() {
  const issues = [];
  for (const [name, doc] of Object.entries(contract)) {
    if (typeof doc.curriculumVersion === "string" && doc.curriculumVersion.endsWith("-draft")) {
      issues.push({ code: "DRAFT_CURRICULUM_VERSION_IN_RELEASE", where: name, detail: doc.curriculumVersion });
    }
    const walk = (node, p) => {
      if (Array.isArray(node)) { node.forEach((item) => walk(item, p)); return; }
      if (!node || typeof node !== "object") return;
      if (node.status === "OPEN_GATE") {
        issues.push({ code: "OPEN_GATE_IN_RELEASE", where: name + ":" + p, detail: node.gate });
      }
      if (node.reviewStatus === "pending_specialist_review") {
        issues.push({ code: "UNREVIEWED_CONTENT_IN_RELEASE", where: name + ":" + p, detail: "pending specialist review" });
      }
      for (const [key, child] of Object.entries(node)) walk(child, p ? p + "." + key : key);
    };
    walk(doc, "");
  }
  for (const { objective } of objectiveIndex.values()) {
    if (objective.completionPolicy === "PENDING_MARZI_D016") {
      issues.push({ code: "DRAFT_POLICY_IN_RELEASE", where: objective.id, detail: objective.completionPolicy });
    }
  }
  return issues;
}

check("25 release mode: the current draft contract set is correctly refused for release", () => {
  const problems = [];
  const issues = releaseIssues();
  if (issues.length === 0) {
    problems.push("RELEASE_MODE_NOT_ENFORCED: a draft contract set passed release validation");
    return problems;
  }
  const codes = new Set(issues.map((i) => i.code));
  for (const expected of ["DRAFT_CURRICULUM_VERSION_IN_RELEASE", "OPEN_GATE_IN_RELEASE", "UNREVIEWED_CONTENT_IN_RELEASE"]) {
    if (!codes.has(expected)) problems.push("RELEASE_GATE_MISSING: " + expected + " was not raised");
  }
  const gates = new Set(issues.filter((i) => i.code === "OPEN_GATE_IN_RELEASE").map((i) => i.detail));
  for (const gate of ["MARZI-021-MASTERY-THRESHOLDS", "MARZI-021-PLACEMENT-CONTENT", "MARZI-021-REVIEW-RECENCY", "MARZI-021-COMPETENCY-COPY"]) {
    if (!gates.has(gate)) problems.push("RELEASE_GATE_MISSING: open gate " + gate + " was not reported");
  }
  return problems;
});

/* ---------------- objective-result validation ---------------- */

function objectiveResultIssues(doc, where) {
  const issues = scanTokens(doc, where, [], []);
  issues.push(...validateSchema(schema["objective-result.schema.json"], doc, where));
  if (issues.some((i) => i.code === "SCHEMA_TYPE_INVALID" && i.where === where)) return issues;

  const entry = objectiveIndex.get(doc.objectiveId);
  if (!entry) {
    issues.push({ code: "UNKNOWN_OBJECTIVE_REF", where, detail: String(doc.objectiveId) });
  }
  const knownCriteria = entry
    ? new Map(entry.objective.requiredCriteria.concat(entry.objective.optionalCriteria).map((c) => [c.id, c]))
    : new Map();
  const requiredIds = entry ? entry.objective.requiredCriteria.map((c) => c.id) : [];

  const accommodations = new Set(contract["evidence.json"].accessibilityAccommodation.accommodations);
  const observed = new Map();
  const seen = new Set();
  /* An unusable evaluation context makes the attempt invalid rather than a
     learner failure (MARZI-021-C001 precedence step 1). */
  let contextInvalid = false;

  for (const [index, observation] of (Array.isArray(doc.criteria) ? doc.criteria : []).entries()) {
    const at = where + ".criteria[" + index + "]";
    if (!observation || typeof observation !== "object") continue;
    if (seen.has(observation.criterionId)) {
      issues.push({ code: "EVIDENCE_DUPLICATE", where: at, detail: observation.criterionId });
      contextInvalid = true;
    }
    seen.add(observation.criterionId);
    if (entry && !knownCriteria.has(observation.criterionId)) {
      issues.push({ code: "UNKNOWN_CRITERION_REF", where: at, detail: observation.criterionId + " is not a criterion of " + doc.objectiveId });
    }
    if (observation.attemptId !== undefined && observation.attemptId !== doc.attemptId) {
      issues.push({ code: "EVIDENCE_CROSS_SESSION", where: at, detail: observation.attemptId + " != " + doc.attemptId });
      contextInvalid = true;
    }
    if (observation.curriculumVersion !== undefined && observation.curriculumVersion !== doc.curriculumVersion) {
      issues.push({ code: "EVIDENCE_STALE", where: at, detail: observation.curriculumVersion + " != " + doc.curriculumVersion });
      contextInvalid = true;
    }
    if (["demonstrated", "partially_demonstrated", "not_demonstrated"].includes(observation.outcome)) {
      if (!Array.isArray(observation.responseIds) || observation.responseIds.length === 0) {
        issues.push({ code: "EVIDENCE_UNSOURCED", where: at, detail: "outcome " + observation.outcome + " cites no response identifier" });
      }
      if (!Array.isArray(observation.opportunityIds) || observation.opportunityIds.length === 0) {
        issues.push({ code: "EVIDENCE_UNSOURCED", where: at, detail: "outcome " + observation.outcome + " cites no opportunity identifier" });
      }
    }
    const assistance = observation.assistance || {};
    if (accommodations.has(assistance.mode)) {
      issues.push({ code: "ASSISTANCE_ACCOMMODATION_CONFLATED", where: at, detail: "accommodation " + assistance.mode + " used as an assistance mode" });
    }
    if (accommodations.has(assistance.helpItemId)) {
      issues.push({ code: "ASSISTANCE_ACCOMMODATION_CONFLATED", where: at, detail: "accommodation " + assistance.helpItemId + " recorded as a learning-help item" });
    }
    observed.set(observation.criterionId, observation.outcome);
  }

  if (doc.accessibility && Array.isArray(doc.accessibility.accommodations)) {
    for (const value of doc.accessibility.accommodations) {
      if (ASSISTANCE_MODES.includes(value)) {
        issues.push({ code: "ASSISTANCE_ACCOMMODATION_CONFLATED", where: where + ".accessibility", detail: "assistance mode " + value + " declared as an accommodation" });
      } else if (!accommodations.has(value)) {
        issues.push({ code: "UNKNOWN_ACCOMMODATION_REF", where: where + ".accessibility", detail: value });
      }
    }
  }

  /* MARZI-021-C001: one canonical derivation, applied here and nowhere else.
     Only required criteria are passed in, so an optional criterion can never
     gate completion, and accessibility accommodation is never an input, so
     using one can never change the derived result. A declared result outside
     the five-state enum is left to the schema so the reason stays isolated. */
  if (entry && RESULT_STATES.includes(doc.result)) {
    if (entry.objective.completionPolicy !== "all_required") {
      issues.push({ code: "COMPLETION_POLICY_INVALID", where, detail: entry.objective.completionPolicy });
    } else {
      const derived = deriveObjectiveResult(requiredIds, observed, contextInvalid);
      if (derived.error) {
        issues.push({ code: derived.error, where, detail: derived.detail });
      } else if (derived.state !== doc.result) {
        const optionalBlocking = entry.objective.optionalCriteria
          .some((c) => observed.has(c.id) && observed.get(c.id) !== "demonstrated");
        if (derived.state === "complete" && optionalBlocking) {
          issues.push({ code: "COMPLETION_OPTIONAL_CRITERION_GATED", where,
            detail: "optional criteria cannot gate completion; declared " + doc.result + ", derived complete" });
        } else {
          issues.push({ code: "COMPLETION_RESULT_MISMATCH", where, detail: "stored " + doc.result + ", derived " + derived.state });
        }
      }
    }
  }
  return issues;
}

/* MARZI-021-C006: v1 has no predecessor registry, so a non-null supersession
   cannot resolve. Syntax is owned by the schema pattern, which reuses the
   objective identifier syntax; this check owns resolution only. */
function supersedesIssues(objective, curriculumVersion, predecessors) {
  const issues = [];
  const value = objective.supersedes;
  if (value === null || value === undefined) return issues;
  if (typeof value !== "string" || !OBJECTIVE_ID_PATTERN.test(value)) return issues;
  if (value === objective.id) {
    issues.push({ code: "SUPERSEDES_REF_INVALID", where: objective.id, detail: "an objective cannot supersede itself" });
    return issues;
  }
  if (!predecessors || predecessors.size === 0) {
    issues.push({ code: "SUPERSEDES_REF_INVALID", where: objective.id,
      detail: "curriculum " + curriculumVersion + " has no predecessor registry, so " + value + " cannot resolve" });
    return issues;
  }
  if (!predecessors.has(value)) {
    issues.push({ code: "SUPERSEDES_REF_INVALID", where: objective.id, detail: "unknown predecessor " + value });
  }
  return issues;
}

/* ---------------- contract-fragment validation for fixtures --------------- */

const FRAGMENT_DENYLIST = {
  "marzi.learning.mastery.v1": DENYLIST_PATHS["mastery.json"],
  "marzi.learning.completion.v1": DENYLIST_PATHS["completion.json"],
  "marzi.learning.evidence.v1": DENYLIST_PATHS["evidence.json"],
  "marzi.learning.review.v1": DENYLIST_PATHS["review.json"],
  "marzi.learning.placement.v1": DENYLIST_PATHS["placement.json"]
};

function fragmentIssues(doc, where) {
  const exempt = (doc && FRAGMENT_DENYLIST[doc.contract]) || [];
  const issues = scanTokens(doc, where, exempt, []);
  if (doc && doc.contract === "marzi.learning.scenario-objectives.v1") {
    issues.push(...validateSchema(schema["scenarios.schema.json"], doc, where));
    const seen = new Set();
    for (const scenario of doc.scenarios || []) {
      if (EXCLUDED_SCENARIOS.includes(scenario.scenarioId)) {
        issues.push({ code: "SCENARIO_EXCLUDED", where: where + ":" + scenario.scenarioId, detail: scenario.scenarioId });
      }
      const source = (live[doc.targetLanguage] || []).find((s) => s.scenarioId === scenario.scenarioId);
      for (const objective of scenario.objectives || []) {
        if (seen.has(objective.id)) issues.push({ code: "DUPLICATE_ID", where: where, detail: objective.id });
        seen.add(objective.id);
        issues.push(...localeIssues(objective));
        issues.push(...levelIssues(objective));
        issues.push(...proxyIssues(objective));
        for (const criterion of (objective.requiredCriteria || []).concat(objective.optionalCriteria || [])) {
          if (!competencyIds.has(criterion.competencyId)) {
            issues.push({ code: "UNKNOWN_COMPETENCY_REF", where: where + ":" + objective.id, detail: criterion.competencyId });
          }
        }
        const rejected = new Set(contract["evidence.json"].rejectedEvidenceTypes.map((e) => e.id));
        for (const type of objective.allowedEvidence || []) {
          if (rejected.has(type)) issues.push({ code: "ACOUSTIC_EVIDENCE_REJECTED", where: where + ":" + objective.id, detail: type });
          else if (!ALLOWED_EVIDENCE.includes(type)) issues.push({ code: "EVIDENCE_TYPE_UNSUPPORTED", where: where + ":" + objective.id, detail: type });
        }
        if (source) {
          const index = objective.sourceGoalIndex;
          if (index >= 0 && index < source.goals.length && objective.sourceGoalText !== source.goals[index]) {
            issues.push({ code: "SOURCE_TEXT_DRIFT", where: where + ":" + objective.id, detail: "goal index " + index });
          }
        }
        if (objective.completionPolicy === "PENDING_MARZI_D016") {
          issues.push({ code: "DRAFT_POLICY_IN_RELEASE", where: where + ":" + objective.id, detail: objective.completionPolicy });
        }
        issues.push(...supersedesIssues(objective, doc.curriculumVersion, null));
      }
      const covered = new Map();
      for (const objective of scenario.objectives || []) {
        if (covered.has(objective.sourceGoalIndex)) {
          issues.push({ code: "SOURCE_COVERAGE_DUPLICATE", where: where + ":" + scenario.scenarioId, detail: "index " + objective.sourceGoalIndex });
        }
        covered.set(objective.sourceGoalIndex, objective.id);
      }
    }
    return issues;
  }
  if (doc && doc.contract === "marzi.learning.prerequisites.v1") {
    issues.push(...validateSchema(schema["prerequisites.schema.json"], doc, where));
    issues.push(...prerequisiteIssues(doc, competencyIds));
    return issues;
  }
  if (doc && doc.contract === "marzi.learning.levels.v1") {
    issues.push(...validateSchema(schema["levels.schema.json"], doc, where));
    if ((doc.order || []).join(",") !== LEVEL_ORDER.join(",")) {
      issues.push({ code: "LEVEL_ORDER_INVALID", where, detail: (doc.order || []).join(",") });
    }
    (doc.bands || []).forEach((band, index) => {
      if (band.id !== LEVEL_ORDER[index]) issues.push({ code: "LEVEL_ORDER_INVALID", where: where + ".bands[" + index + "]", detail: band.id });
    });
    return issues;
  }
  if (doc && doc.contract === "marzi.learning.competencies.v1") {
    issues.push(...validateSchema(schema["competencies.schema.json"], doc, where));
    const seen = new Set();
    for (const entry of doc.competencies || []) {
      if (seen.has(entry.id)) issues.push({ code: "DUPLICATE_ID", where, detail: entry.id });
      seen.add(entry.id);
    }
    return issues;
  }
  if (doc && doc.contract === "marzi.learning.mastery.v1") {
    issues.push(...validateSchema(schema["mastery.schema.json"], doc, where));
    for (const key of ["minimumDistinctOpportunities", "minimumDistinctContexts", "recencyWindowDays", "aggregationWeights"]) {
      if (doc.thresholds && doc.thresholds[key] !== null && doc.thresholds[key] !== undefined) {
        issues.push({ code: "INVENTED_DEFAULT", where: where + ".thresholds." + key, detail: JSON.stringify(doc.thresholds[key]) });
      }
    }
    for (const forbidden of ["xp", "coins", "rank", "marzi_stage"]) {
      if (!(doc.forbiddenInputs || []).includes(forbidden)) {
        issues.push({ code: "MASTERY_FORBIDDEN_INPUT_MISSING", where, detail: forbidden });
      }
    }
    return issues;
  }
  if (doc && doc.contract === "marzi.learning.objective-result.v1") {
    return objectiveResultIssues(doc, where);
  }
  issues.push({ code: "UNKNOWN_CONTRACT", where, detail: String(doc && doc.contract) });
  return issues;
}


/* ---------------- MARZI-021-C005: fixture path containment ---------------- */

const FIXTURE_NAME_PATTERN = /^[a-z0-9][a-z0-9-]*\.json$/;

/**
 * A manifest entry names a fixture, never a path. The name is checked against a
 * strict pattern, then the resolved real path is confirmed to be a regular file
 * directly inside the canonical fixture directory. Fixture content is data and
 * is never executed.
 */
function fixturePathIssues(name, directory) {
  const at = "invalid/manifest.json";
  if (typeof name !== "string" || name.length === 0) {
    return [{ code: "FIXTURE_PATH_INVALID", where: at, detail: "fixture name is not a string" }];
  }
  if (name !== path.basename(name) || !FIXTURE_NAME_PATTERN.test(name)) {
    return [{ code: "FIXTURE_PATH_INVALID", where: at, detail: JSON.stringify(name) + " is not a bare lowercase .json filename" }];
  }
  const resolved = path.resolve(directory, name);
  if (path.dirname(resolved) !== path.resolve(directory)) {
    return [{ code: "FIXTURE_PATH_INVALID", where: at, detail: JSON.stringify(name) + " escapes the fixture directory" }];
  }
  let info;
  try {
    info = fs.lstatSync(resolved);
  } catch (error) {
    return [{ code: "FIXTURE_PATH_INVALID", where: at, detail: JSON.stringify(name) + " does not exist" }];
  }
  if (info.isSymbolicLink()) {
    return [{ code: "FIXTURE_PATH_INVALID", where: at, detail: JSON.stringify(name) + " is a symbolic link" }];
  }
  if (!info.isFile()) {
    return [{ code: "FIXTURE_PATH_INVALID", where: at, detail: JSON.stringify(name) + " is not a regular file" }];
  }
  const real = fs.realpathSync(resolved);
  if (path.dirname(real) !== fs.realpathSync(directory)) {
    return [{ code: "FIXTURE_PATH_INVALID", where: at, detail: JSON.stringify(name) + " resolves outside the fixture directory" }];
  }
  return [];
}

/* ---------------- MARZI-021-C003: external review evidence ---------------- */

const REVIEW_GATES = ["specialist", "linguistic", "accessibility"];
const REVIEW_COLUMNS = [
  "Date", "Review type", "Reviewer", "Role and qualification",
  "Contract version or hash", "Items reviewed", "Outcome", "Findings reference"
];
const PLACEHOLDER = /^[\s—-]*$/;

/**
 * Reads the one canonical review record — the table in the existing
 * docs/learning/SPECIALIST_REVIEW.md handoff — and returns its rows. No parallel
 * review store is introduced.
 */
function parseReviewRecords(markdown) {
  const marker = "## 6. Review record";
  const start = markdown.indexOf(marker);
  if (start < 0) return { columns: [], rows: [], missingSection: true };
  const section = markdown.slice(start);
  const lines = section.split("\n").filter((line) => line.trim().startsWith("|"));
  if (lines.length < 2) return { columns: [], rows: [], missingSection: true };
  const cells = (line) => line.trim().replace(/^\||\|$/g, "").split("|").map((cell) => cell.trim());
  const columns = cells(lines[0]);
  const rows = lines.slice(2).map((line) => {
    const values = cells(line);
    const row = {};
    columns.forEach((column, index) => { row[column] = values[index] === undefined ? "" : values[index]; });
    return row;
  }).filter((row) => !REVIEW_COLUMNS.every((column) => PLACEHOLDER.test(row[column] || "")));
  return { columns, rows, missingSection: false };
}

/**
 * An approved review status is only credible when the canonical record carries
 * complete evidence for that specific gate at the current contract version.
 * One review never satisfies another gate.
 */
function reviewEvidenceIssues(gate, status, record, version, where) {
  const issues = [];
  if (status === "PENDING" || status === "pending_specialist_review") return issues;
  const rows = (record.rows || []).filter((row) => (row["Review type"] || "").toLowerCase() === gate);
  if (rows.length === 0) {
    issues.push({ code: "STATUS_REVIEW_EVIDENCE_MISSING", where, detail: "no " + gate + " review record for status " + status });
    return issues;
  }
  const complete = rows.some((row) => {
    if (REVIEW_COLUMNS.some((column) => PLACEHOLDER.test(row[column] || ""))) return false;
    return row["Contract version or hash"] === version;
  });
  if (!complete) {
    issues.push({ code: "STATUS_REVIEW_EVIDENCE_MISSING", where,
      detail: gate + " review record is incomplete or does not match contract version " + version });
  }
  return issues;
}

/* ---------------- MARZI-021-C002: canonical package status ---------------- */

const STATUS_EXPECTED = {
  "MARZI-D009": "APPROVED",
  "MARZI-D016": "APPROVED",
  "Taxonomy and mastery presentation": "APPROVED IN PRINCIPLE",
  "Static authoring": "AUTHORIZED",
  "Static implementation": "COMPLETE",
  "Package governance status": "READY FOR REVIEW",
  "Independent approval": "NOT GRANTED",
  "Learning-specialist review": "PENDING",
  "Six-language linguistic review": "PENDING",
  "Accessibility review": "PENDING",
  "Moderated Android study": "PENDING",
  "Runtime integration": "NOT AUTHORIZED",
  "Production approval": "NOT AUTHORIZED",
  "Deployment": "NOT DEPLOYED",
  "Release": "NOT RELEASED"
};
const STALE_STATUS_PHRASES = [
  "does not implement the machine-readable learning contracts",
  "explicitly block implementation",
  "learning/product decisions are not approved",
  "After the blocking gates are satisfied"
];

function parseStatusTable(markdown) {
  const marker = "### Canonical status";
  const start = markdown.indexOf(marker);
  if (start < 0) return null;
  const lines = markdown.slice(start).split("\n");
  const status = {};
  for (const line of lines.slice(1)) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("|")) { if (Object.keys(status).length) break; else continue; }
    const cells = trimmed.replace(/^\||\|$/g, "").split("|").map((cell) => cell.trim());
    if (cells.length < 2 || cells[0] === "Dimension" || /^-+$/.test(cells[0])) continue;
    status[cells[0]] = cells[1].replace(/\*\*/g, "");
  }
  return status;
}

/**
 * Rejects every prohibited status combination. Pure over a parsed status map so
 * the adversarial cases can exercise it without touching the repository.
 */
function packageStatusIssues(status, where) {
  const issues = [];
  if (!status) {
    return [{ code: "STATUS_STATIC_SCOPE_CONTRADICTION", where, detail: "no canonical status section" }];
  }
  const at = (dimension) => where + ":" + dimension;
  for (const [dimension, expected] of Object.entries(STATUS_EXPECTED)) {
    if (!(dimension in status)) {
      issues.push({ code: "STATUS_STATIC_SCOPE_CONTRADICTION", where: at(dimension), detail: "dimension is absent" });
    }
  }
  for (const decision of ["MARZI-D009", "MARZI-D016"]) {
    if (status[decision] !== undefined && status[decision] !== "APPROVED") {
      issues.push({ code: "STATUS_DECISION_DRIFT", where: at(decision), detail: "recorded as " + status[decision] });
    }
  }
  if (status["Static implementation"] === "COMPLETE" && status["Static authoring"] !== "AUTHORIZED") {
    issues.push({ code: "STATUS_STATIC_SCOPE_CONTRADICTION", where, detail: "static implementation complete without authorized authoring" });
  }
  if (status["Static implementation"] === "COMPLETE" && status["Runtime integration"] !== "NOT AUTHORIZED") {
    issues.push({ code: "STATUS_STATIC_SCOPE_CONTRADICTION", where, detail: "static completion represented as runtime completion" });
  }
  if (status["Package governance status"] !== "READY FOR REVIEW") {
    issues.push({ code: "STATUS_STATIC_SCOPE_CONTRADICTION", where, detail: "governance status is " + status["Package governance status"] });
  }
  if (status["Independent approval"] !== "NOT GRANTED") {
    issues.push({ code: "STATUS_EXTERNAL_GATE_BYPASS", where, detail: "independent approval is self-declared" });
  }
  for (const gate of ["Learning-specialist review", "Six-language linguistic review", "Accessibility review", "Moderated Android study"]) {
    if (status[gate] !== undefined && status[gate] !== "PENDING") {
      issues.push({ code: "STATUS_EXTERNAL_GATE_BYPASS", where: at(gate), detail: "external gate recorded as " + status[gate] });
    }
  }
  if (status["Runtime integration"] !== "NOT AUTHORIZED" && status["Production approval"] === "AUTHORIZED") {
    issues.push({ code: "STATUS_RELEASE_GATE_BYPASS", where, detail: "production approved without runtime authorization" });
  }
  for (const [gate, expected] of [["Production approval", "NOT AUTHORIZED"], ["Deployment", "NOT DEPLOYED"], ["Release", "NOT RELEASED"]]) {
    if (status[gate] !== undefined && status[gate] !== expected) {
      issues.push({ code: "STATUS_RELEASE_GATE_BYPASS", where: at(gate), detail: gate + " is " + status[gate] });
    }
  }
  return issues;
}

/* ---------------- 26 positive fixtures ---------------- */

check("26 fixtures: every valid fixture passes with no issue", () => {
  const problems = [];
  const dir = path.join(FIXTURES, "valid");
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json")).sort();
  if (files.length < 5) problems.push("FIXTURE_SUITE_TOO_SMALL: " + files.length + " valid fixtures");
  for (const file of files) {
    const doc = readJson(path.join(dir, file));
    const issues = fragmentIssues(doc, "valid/" + file);
    problems.push(...fmt(issues));
  }
  return problems;
});

/* ---------------- 27 negative fixtures ---------------- */

check("27 fixtures: every invalid fixture fails for exactly its declared reason code", () => {
  const problems = [];
  const dir = path.join(FIXTURES, "invalid");
  const manifest = readJson(path.join(dir, "manifest.json"));
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json") && f !== "manifest.json").sort();
  const declared = new Set(manifest.fixtures.map((f) => f.file));
  for (const file of files) {
    if (!declared.has(file)) problems.push("FIXTURE_UNDECLARED: " + file + " has no manifest entry");
  }
  for (const entry of manifest.fixtures) {
    const pathIssues = fixturePathIssues(entry.file, dir);
    if (pathIssues.length) {
      problems.push(...fmt(pathIssues));
      continue;
    }
    if (!files.includes(entry.file)) {
      problems.push("FIXTURE_MISSING: " + entry.file + " is declared but absent");
      continue;
    }
    let doc;
    try {
      doc = readJson(path.join(dir, entry.file));
    } catch (error) {
      problems.push("FIXTURE_UNPARSEABLE: " + entry.file + ": " + error.message);
      continue;
    }
    const issues = fragmentIssues(doc, "invalid/" + entry.file);
    if (issues.length === 0) {
      problems.push("FIXTURE_DID_NOT_FAIL: " + entry.file + " was accepted but must fail with " + entry.expectedReason);
      continue;
    }
    /* MARZI-021-C007: the deduplicated code set must equal the declared reason,
       so a fixture can neither miss its defect nor smuggle in an unrelated one. */
    const unique = Array.from(new Set(issues.map((i) => i.code))).sort();
    if (!unique.includes(entry.expectedReason)) {
      problems.push("FIXTURE_WRONG_REASON: " + entry.file + " expected " + entry.expectedReason + ", got " + unique.join(", "));
    } else if (unique.length !== 1) {
      problems.push("FIXTURE_UNEXPECTED_REASON: " + entry.file + " must isolate " + entry.expectedReason +
        " but also reported " + unique.filter((c) => c !== entry.expectedReason).join(", "));
    }
  }
  const reasons = new Set(manifest.fixtures.map((f) => f.expectedReason));
  for (const required of [
    "DUPLICATE_ID", "UNKNOWN_COMPETENCY_REF", "PREREQ_CYCLE", "PREREQ_SELF_EDGE",
    "PREREQ_DUPLICATE_EDGE", "PREREQ_UNKNOWN_NODE", "LEVEL_RANGE_REVERSED", "LOCALE_PARITY",
    "SOURCE_TEXT_DRIFT", "SOURCE_COVERAGE_DUPLICATE", "SCENARIO_EXCLUDED",
    "ACOUSTIC_EVIDENCE_REJECTED", "REWARD_VALUE_PRESENT", "CRITERION_PROXY_REJECTED",
    "DRAFT_POLICY_IN_RELEASE", "EVIDENCE_DUPLICATE", "EVIDENCE_STALE", "EVIDENCE_CROSS_SESSION",
    "EVIDENCE_UNSOURCED", "ASSISTANCE_ACCOMMODATION_CONFLATED", "COMPLETION_RESULT_MISMATCH",
    "UNKNOWN_OBJECTIVE_REF", "UNKNOWN_CRITERION_REF", "SCHEMA_ENUM_INVALID",
    "SCHEMA_REQUIRED_MISSING", "SCHEMA_UNKNOWN_FIELD", "UNSAFE_CONTENT",
    "INVENTED_DEFAULT", "LEVEL_ORDER_INVALID", "SUPERSEDES_REF_INVALID",
    "COMPLETION_OPTIONAL_CRITERION_GATED", "SCHEMA_PATTERN_INVALID"
  ]) {
    if (!reasons.has(required)) problems.push("FIXTURE_COVERAGE_MISSING: no negative fixture proves " + required);
  }
  return problems;
});

/* ---------------- 28 guards held ---------------- */

check("28 guards: no file was written and no network call was attempted", () => {
  const problems = guardViolations.slice();
  if (protectedFingerprint() !== fingerprintBefore) {
    problems.push("VALIDATOR_MUTATED_TREE: a protected file's content hash changed while validating");
  }
  return problems;
});

/* ---------------- 29 completion truth table ---------------- */

const TRUTH_TABLE = [
  { name: "all demonstrated", outcomes: ["demonstrated", "demonstrated", "demonstrated"], expected: "complete" },
  { name: "demonstrated + partial", outcomes: ["demonstrated", "demonstrated", "partially_demonstrated"], expected: "partial" },
  { name: "all partial", outcomes: ["partially_demonstrated", "partially_demonstrated", "partially_demonstrated"], expected: "partial" },
  { name: "demonstrated + not observed", outcomes: ["demonstrated", "not_observed", "demonstrated"], expected: "insufficient_evidence" },
  { name: "demonstrated + criterion absent", outcomes: ["demonstrated", undefined, "demonstrated"], expected: "insufficient_evidence" },
  { name: "all not observed", outcomes: ["not_observed", "not_observed", "not_observed"], expected: "insufficient_evidence" },
  { name: "all insufficient evidence", outcomes: ["insufficient_evidence", "insufficient_evidence", "insufficient_evidence"], expected: "insufficient_evidence" },
  { name: "partial + not observed", outcomes: ["partially_demonstrated", "not_observed", "demonstrated"], expected: "insufficient_evidence" },
  { name: "demonstrated + not demonstrated", outcomes: ["demonstrated", "not_demonstrated", "demonstrated"], expected: "not_complete" },
  { name: "not demonstrated + missing", outcomes: ["not_demonstrated", undefined, "demonstrated"], expected: "not_complete" },
  { name: "not demonstrated + partial", outcomes: ["not_demonstrated", "partially_demonstrated", "demonstrated"], expected: "not_complete" },
  { name: "invalid + demonstrated", outcomes: ["invalid", "demonstrated", "demonstrated"], expected: "invalid" },
  { name: "invalid + not demonstrated", outcomes: ["invalid", "not_demonstrated", "demonstrated"], expected: "invalid" },
  { name: "invalid + missing", outcomes: ["invalid", undefined, "demonstrated"], expected: "invalid" },
  { name: "invalid context with all demonstrated", outcomes: ["demonstrated", "demonstrated", "demonstrated"], contextInvalid: true, expected: "invalid" }
];

check("29 completion: the five-state truth table is mutually exclusive and exhaustive", () => {
  const problems = [];
  const ids = ["c1", "c2", "c3"];
  for (const row of TRUTH_TABLE) {
    const observed = new Map();
    row.outcomes.forEach((outcome, index) => { if (outcome !== undefined) observed.set(ids[index], outcome); });
    const derived = deriveObjectiveResult(ids, observed, Boolean(row.contextInvalid));
    if (derived.error) {
      problems.push("COMPLETION_POLICY_CONTRADICTION at truth table '" + row.name + "': " + derived.detail);
    } else if (derived.state !== row.expected) {
      problems.push("COMPLETION_RESULT_MISMATCH at truth table '" + row.name + "': expected " + row.expected + ", derived " + derived.state);
    }
  }
  /* Exhaustive over every combination of the six outcomes across three
     required criteria plus absence: each must land on exactly one state. */
  const domain = OBSERVATION_OUTCOMES.concat([undefined]);
  let covered = 0;
  for (const a of domain) for (const b of domain) for (const c of domain) {
    const observed = new Map();
    [a, b, c].forEach((outcome, index) => { if (outcome !== undefined) observed.set(ids[index], outcome); });
    const derived = deriveObjectiveResult(ids, observed, false);
    if (derived.error || !RESULT_STATES.includes(derived.state)) {
      problems.push("COMPLETION_POLICY_CONTRADICTION at [" + [a, b, c].map(String).join(",") + "]: " + (derived.detail || derived.state));
    } else covered++;
  }
  if (covered !== domain.length ** 3) {
    problems.push("COMPLETION_POLICY_CONTRADICTION: only " + covered + " of " + domain.length ** 3 + " combinations resolved");
  }
  /* An empty required set can never produce a result, least of all complete. */
  const empty = deriveObjectiveResult([], new Map(), false);
  if (empty.error !== "COMPLETION_POLICY_CONTRADICTION") {
    problems.push("COMPLETION_POLICY_CONTRADICTION: an empty required set produced " + JSON.stringify(empty.state));
  }
  /* An unknown outcome is an error, never a silent default. */
  const unknown = deriveObjectiveResult(ids, new Map([["c1", "passed"], ["c2", "demonstrated"], ["c3", "demonstrated"]]), false);
  if (unknown.error !== "COMPLETION_POLICY_CONTRADICTION") {
    problems.push("COMPLETION_POLICY_CONTRADICTION: an unknown outcome produced " + JSON.stringify(unknown.state));
  }
  return problems;
});

/* ---------------- 30 contract prose matches the derivation ---------------- */

check("30 completion: contract precedence, states, and remediation match the derivation", () => {
  const doc = contract["completion.json"];
  const problems = [];
  const precedence = doc.derivationPrecedence;
  const orders = precedence.map((rule) => rule.order);
  if (orders.join(",") !== "1,2,3,4,5") problems.push("COMPLETION_POLICY_CONTRADICTION at completion.json: precedence order is " + orders.join(","));
  const expectedResults = ["invalid", "not_complete", "insufficient_evidence", "complete", "partial"];
  precedence.forEach((rule, index) => {
    if (rule.result !== expectedResults[index]) {
      problems.push("COMPLETION_POLICY_CONTRADICTION at completion.json.derivationPrecedence[" + index + "]: " +
        rule.result + " != " + expectedResults[index]);
    }
  });
  /* The contract states and the validator states are one set, not two. */
  const contractStates = doc.objectiveResultStates.map((state) => state.id).sort();
  if (contractStates.join(",") !== RESULT_STATES.slice().sort().join(",")) {
    problems.push("COMPLETION_POLICY_CONTRADICTION at completion.json: state set is " + contractStates.join(","));
  }
  const schemaStates = schema["objective-result.schema.json"].properties.result.enum.slice().sort();
  if (schemaStates.join(",") !== contractStates.join(",")) {
    problems.push("COMPLETION_POLICY_CONTRADICTION: schema result enum is " + schemaStates.join(","));
  }
  for (const state of RESULT_STATES.filter((value) => value !== "complete")) {
    if (!doc.remediation.appliesToStates.includes(state)) {
      problems.push("COMPLETION_REMEDIATION_POLICY_INVALID at completion.json: " + state + " has no remediation");
    }
  }
  if (doc.remediation.appliesToStates.includes("complete")) {
    problems.push("COMPLETION_REMEDIATION_POLICY_INVALID at completion.json: complete is not a remediation state");
  }
  if (doc.remediation.alwaysAvailable !== true) {
    problems.push("COMPLETION_REMEDIATION_POLICY_INVALID at completion.json: remediation is not always available");
  }
  if (!/never converted to not_demonstrated/.test(doc.absenceRule)) {
    problems.push("COMPLETION_POLICY_CONTRADICTION at completion.json.absenceRule: absence may become learner failure");
  }
  /* No aggregate algorithm exists; only the conjunction of required objectives. */
  if (!/every declared required objective is complete/.test(doc.scenarioCompletion.derivedFrom)) {
    problems.push("COMPLETION_AGGREGATE_CONTRADICTION at completion.json.scenarioCompletion");
  }
  return problems;
});

/* ---------------- 31 optional criteria and accommodation invariance -------- */

check("31 completion: optional criteria never gate, accommodation never changes the result", () => {
  const problems = [];
  const entry = objectiveIndex.get("de.arzt.book_appointment.cough");
  if (!entry) return ["UNKNOWN_OBJECTIVE_REF: de.arzt.book_appointment.cough is absent"];
  const requiredIds = entry.objective.requiredCriteria.map((c) => c.id);
  const optionalIds = entry.objective.optionalCriteria.map((c) => c.id);
  if (optionalIds.length === 0) return ["the invariance fixture objective declares no optional criterion"];

  /* Every required criterion demonstrated: the objective is complete no matter
     what the optional criteria did, because they are never passed in. */
  const observed = new Map(requiredIds.map((id) => [id, "demonstrated"]));
  const base = deriveObjectiveResult(requiredIds, observed, false);
  if (base.state !== "complete") problems.push("COMPLETION_RESULT_MISMATCH: required-only baseline derived " + base.state);
  for (const outcome of ["not_demonstrated", "not_observed", "insufficient_evidence", "invalid"]) {
    const withOptional = new Map(observed);
    for (const id of optionalIds) withOptional.set(id, outcome);
    const derived = deriveObjectiveResult(requiredIds, withOptional, false);
    if (derived.state !== "complete") {
      problems.push("COMPLETION_OPTIONAL_CRITERION_GATED: optional " + outcome + " changed the result to " + derived.state);
    }
  }

  /* Identical evidence with and without an accommodation must validate
     identically, including the derived result. */
  const plain = readJson(path.join(FIXTURES, "valid/objective-result-complete.json"));
  const accommodated = JSON.parse(JSON.stringify(plain));
  accommodated.accessibility = {
    accommodations: ["screen_reader", "extended_time"],
    declaredBy: "learner",
    appliesToConstruct: false
  };
  const plainIssues = objectiveResultIssues(plain, "invariance/plain");
  const accommodatedIssues = objectiveResultIssues(accommodated, "invariance/accommodated");
  if (plainIssues.length !== 0 || accommodatedIssues.length !== 0) {
    problems.push("ASSISTANCE_ACCOMMODATION_CONFLATED: accommodation changed validation outcome (" +
      plainIssues.length + " vs " + accommodatedIssues.length + ")");
  }
  return problems;
});

/* ---------------- 32 external review evidence binding ---------------- */

check("32 review evidence: an approved review status requires a complete canonical record", () => {
  const problems = [];
  const markdown = read(path.join(ROOT, "docs/learning/SPECIALIST_REVIEW.md"));
  const record = parseReviewRecords(markdown);
  if (record.missingSection) return ["STATUS_REVIEW_EVIDENCE_MISSING: SPECIALIST_REVIEW.md has no review record table"];
  for (const column of REVIEW_COLUMNS) {
    if (!record.columns.includes(column)) {
      problems.push("STATUS_REVIEW_EVIDENCE_MISSING at SPECIALIST_REVIEW.md: the record has no '" + column + "' column");
    }
  }
  const version = contract["source-inventory.json"].curriculumVersion;
  /* Every contract is still pending, so no evidence is required and none is
     fabricated; the record is expected to be empty. */
  for (const [name, doc] of Object.entries(contract)) {
    if (doc.reviewStatus && doc.reviewStatus !== "pending_specialist_review") {
      problems.push(...fmt(reviewEvidenceIssues("specialist", doc.reviewStatus, record, version, name)));
    }
  }
  if (record.rows.length !== 0) {
    problems.push("STATUS_REVIEW_EVIDENCE_MISSING: the review record claims " + record.rows.length +
      " review(s) while every contract is still pending_specialist_review");
  }
  /* Adversarial: an approved status without evidence, with incomplete
     evidence, with a mismatched version, or borrowed from another gate. */
  const full = {
    "Date": "2026-08-03", "Review type": "specialist", "Reviewer": "R. Example",
    "Role and qualification": "Learning specialist", "Contract version or hash": version,
    "Items reviewed": "94 variants", "Outcome": "approved", "Findings reference": "none"
  };
  const cases = [
    ["no evidence", { columns: REVIEW_COLUMNS, rows: [] }, "specialist"],
    ["incomplete evidence", { columns: REVIEW_COLUMNS, rows: [Object.assign({}, full, { Outcome: "—" })] }, "specialist"],
    ["mismatched version", { columns: REVIEW_COLUMNS, rows: [Object.assign({}, full, { "Contract version or hash": "v9" })] }, "specialist"],
    ["one review reused for another gate", { columns: REVIEW_COLUMNS, rows: [full] }, "linguistic"]
  ];
  for (const [label, fakeRecord, gate] of cases) {
    const issues = reviewEvidenceIssues(gate, "specialist_reviewed", fakeRecord, version, "adversarial/" + label);
    if (!issues.some((issue) => issue.code === "STATUS_REVIEW_EVIDENCE_MISSING")) {
      problems.push("STATUS_REVIEW_EVIDENCE_MISSING was not raised for: " + label);
    }
  }
  /* A structurally complete record passes without claiming a real review. */
  const accepted = reviewEvidenceIssues("specialist", "specialist_reviewed", { columns: REVIEW_COLUMNS, rows: [full] }, version, "adversarial/complete");
  if (accepted.length !== 0) problems.push("a structurally complete review record was rejected: " + fmt(accepted).join("; "));
  return problems;
});

/* ---------------- 33 canonical package status ---------------- */

check("33 status: the canonical MARZI-021 status admits no prohibited combination", () => {
  const problems = [];
  const packageDoc = read(path.join(ROOT, "docs/packages/MARZI-021.md"));
  const status = parseStatusTable(packageDoc);
  problems.push(...fmt(packageStatusIssues(status, "docs/packages/MARZI-021.md")));
  for (const phrase of STALE_STATUS_PHRASES) {
    if (packageDoc.includes(phrase)) {
      problems.push("STATUS_STATIC_SCOPE_CONTRADICTION at docs/packages/MARZI-021.md: stale statement " + JSON.stringify(phrase));
    }
  }
  const required = "MARZI-D009 and MARZI-D016 are formally APPROVED.";
  if (!packageDoc.includes(required)) {
    problems.push("STATUS_DECISION_DRIFT at docs/packages/MARZI-021.md: the canonical status wording is absent");
  }
  /* The satellite documents must not restate a contradicting status. */
  for (const relative of ["docs/learning/SPECIALIST_REVIEW.md", "docs/learning/contracts/v1/README.md"]) {
    const text = read(path.join(ROOT, relative));
    for (const phrase of STALE_STATUS_PHRASES) {
      if (text.includes(phrase)) {
        problems.push("STATUS_STATIC_SCOPE_CONTRADICTION at " + relative + ": stale statement " + JSON.stringify(phrase));
      }
    }
    if (/\bspecialist[- ]approved\b/i.test(text) || /APPROVED FOR SPECIALIST REVIEW/.test(text)) {
      problems.push("STATUS_EXTERNAL_GATE_BYPASS at " + relative + ": self-declared external approval");
    }
  }
  /* Adversarial: each prohibited combination must be refused. */
  const good = Object.assign({}, STATUS_EXPECTED);
  const prohibited = [
    ["D009 open", { "MARZI-D009": "OPEN" }, "STATUS_DECISION_DRIFT"],
    ["D016 blocking", { "MARZI-D016": "BLOCKING" }, "STATUS_DECISION_DRIFT"],
    ["static complete plus runtime authorized", { "Runtime integration": "AUTHORIZED" }, "STATUS_STATIC_SCOPE_CONTRADICTION"],
    ["self-approved", { "Independent approval": "GRANTED" }, "STATUS_EXTERNAL_GATE_BYPASS"],
    ["specialist approved", { "Learning-specialist review": "APPROVED" }, "STATUS_EXTERNAL_GATE_BYPASS"],
    ["linguistic approved", { "Six-language linguistic review": "APPROVED" }, "STATUS_EXTERNAL_GATE_BYPASS"],
    ["production authorized", { "Production approval": "AUTHORIZED" }, "STATUS_RELEASE_GATE_BYPASS"],
    ["deployed", { "Deployment": "DEPLOYED" }, "STATUS_RELEASE_GATE_BYPASS"],
    ["released", { "Release": "RELEASED" }, "STATUS_RELEASE_GATE_BYPASS"]
  ];
  for (const [label, patch, expected] of prohibited) {
    const issues = packageStatusIssues(Object.assign({}, good, patch), "adversarial/" + label);
    if (!issues.some((issue) => issue.code === expected)) {
      problems.push(expected + " was not raised for prohibited combination: " + label);
    }
  }
  if (packageStatusIssues(good, "adversarial/canonical").length !== 0) {
    problems.push("the canonical status map was rejected by its own rules");
  }
  return problems;
});

/* ---------------- 34 supersession ---------------- */

check("34 supersession: v1 accepts only null and resolves nothing else", () => {
  const problems = [];
  for (const { objective } of objectiveIndex.values()) {
    if (objective.supersedes !== null) {
      problems.push("SUPERSEDES_REF_INVALID at " + objective.id + ": v1 must declare null, found " + JSON.stringify(objective.supersedes));
    }
    problems.push(...fmt(supersedesIssues(objective, "v1-draft", null)));
  }
  const sample = objectiveIndex.get("de.arzt.book_appointment.cough").objective;
  const cases = [
    ["syntactically valid predecessor in v1", "de.arzt.book_appointment.legacy", null],
    ["self reference", sample.id, new Set([sample.id])],
    ["unknown predecessor", "de.arzt.book_appointment.absent", new Set(["de.arzt.book_appointment.other"])]
  ];
  for (const [label, value, predecessors] of cases) {
    const issues = supersedesIssues(Object.assign({}, sample, { supersedes: value }), "v1-draft", predecessors);
    if (!issues.some((issue) => issue.code === "SUPERSEDES_REF_INVALID")) {
      problems.push("SUPERSEDES_REF_INVALID was not raised for: " + label);
    }
  }
  /* A known predecessor in an explicitly versioned context resolves. */
  const resolved = supersedesIssues(
    Object.assign({}, sample, { supersedes: "de.arzt.book_appointment.legacy" }),
    "v2-draft", new Set(["de.arzt.book_appointment.legacy"]));
  if (resolved.length !== 0) problems.push("a known predecessor was rejected: " + fmt(resolved).join("; "));
  if (supersedesIssues(Object.assign({}, sample, { supersedes: null }), "v1-draft", null).length !== 0) {
    problems.push("null supersession was rejected");
  }
  return problems;
});

/* ---------------- 35 fixture path containment ---------------- */

check("35 fixtures: manifest entries are contained basename JSON files", () => {
  const problems = [];
  const dir = path.join(FIXTURES, "invalid");
  const hostile = [
    "../manifest.json", "../../learning-contracts.js", "/etc/passwd",
    "nested/result.json", "result.json; rm -rf /", "result\nname.json",
    "Result-Upper.json", "-leading-dash.json", "result.txt", "", "absent-fixture.json"
  ];
  for (const name of hostile) {
    const issues = fixturePathIssues(name, dir);
    if (!issues.some((issue) => issue.code === "FIXTURE_PATH_INVALID")) {
      problems.push("FIXTURE_PATH_INVALID was not raised for: " + JSON.stringify(name));
    }
  }
  const manifest = readJson(path.join(dir, "manifest.json"));
  for (const entry of manifest.fixtures) {
    problems.push(...fmt(fixturePathIssues(entry.file, dir)));
  }
  return problems;
});

/* ---------------- 36 write, network and execution guard routes ------------- */

check("36 guards: every write, network and dynamic-execution route is refused", () => {
  const problems = [];
  /* A path that does not exist and never will: the guard must throw before any
     filesystem work, so nothing is created even if a guard were missing. */
  const target = path.join("/tmp", "marzi-021-r1-guard-probe", "must-never-exist.txt");
  const before = guardViolations.length;
  const routes = [
    ["fs.writeFileSync", () => fs.writeFileSync(target, "x")],
    ["fs.appendFileSync", () => fs.appendFileSync(target, "x")],
    ["fs.mkdirSync", () => fs.mkdirSync(target)],
    ["fs.rmSync", () => fs.rmSync(target)],
    ["fs.unlinkSync", () => fs.unlinkSync(target)],
    ["fs.renameSync", () => fs.renameSync(target, target + "2")],
    ["fs.truncateSync", () => fs.truncateSync(target)],
    ["fs.copyFileSync", () => fs.copyFileSync(target, target + "2")],
    ["fs.linkSync", () => fs.linkSync(target, target + "2")],
    ["fs.symlinkSync", () => fs.symlinkSync(target, target + "2")],
    ["fs.chmodSync", () => fs.chmodSync(target, 0o600)],
    ["fs.utimesSync", () => fs.utimesSync(target, 0, 0)],
    ["fs.createWriteStream", () => fs.createWriteStream(target)],
    ["fs.openSync write mode", () => fs.openSync(target, "w")],
    ["fs.openSync append mode", () => fs.openSync(target, "a")],
    ["fs.writeSync on a data descriptor", () => fs.writeSync(9, "x")],
    ["fs.promises.writeFile", () => fs.promises.writeFile(target, "x")],
    ["fs.promises.appendFile", () => fs.promises.appendFile(target, "x")],
    ["fs.promises.mkdir", () => fs.promises.mkdir(target)],
    ["fs.promises.rm", () => fs.promises.rm(target)],
    ["fs.promises.rename", () => fs.promises.rename(target, target + "2")],
    ["fs.promises.open write mode (FileHandle)", () => fs.promises.open(target, "w")],
    ["fetch", () => globalThis.fetch("https://example.invalid")],
    ["require node:http", () => require("node:http")],
    ["require child_process", () => require("child_process")],
    ["require node:vm", () => require("node" + ":vm")]
  ];
  for (const [label, invoke] of routes) {
    let threw = false;
    try { invoke(); } catch (error) { threw = true; }
    if (!threw) problems.push("guard did not refuse: " + label);
  }
  if (fs.existsSync(path.dirname(target))) {
    problems.push("VALIDATOR_MUTATED_TREE: the guard probe created " + path.dirname(target));
  }
  /* Read-only routes stay usable, otherwise the validator could not work. */
  try {
    const descriptor = fs.openSync(path.join(CONTRACTS, "levels.json"), "r");
    fs.closeSync(descriptor);
  } catch (error) {
    problems.push("read-only open was refused: " + error.message);
  }
  /* Those deliberate probes are the only recorded violations; drop them so the
     final guard check reports genuine ones. */
  const recorded = guardViolations.length - before;
  if (recorded < routes.length - 1) {
    problems.push("guard violations recorded (" + recorded + ") do not account for every refused route");
  }
  guardViolations.length = before;

  /* MARZI-021-C008: executable constructs are refused, prose is not. */
  /* Assembled from fragments so this file never contains a literal executable
     construct that its own self-scan in check 01 would have to flag. */
  const executable = [
    "const value = " + "eval" + "(payload);",
    "const fn = new " + "Function" + "('a', 'return a');",
    "const fn = " + "Function" + "('return 1');",
    "const fn = new " + "AsyncFunction" + "('await x');",
    "const fn = new " + "GeneratorFunction" + "('yield 1');",
    "const sandbox = require('" + "node:vm" + "');",
    "sandbox." + "runInNewContext" + "(source);"
  ];
  for (const sample of executable) {
    if (dynamicExecutionIssues(sample, "adversarial").length === 0) {
      problems.push("DYNAMIC_EXECUTION_FORBIDDEN was not raised for: " + sample);
    }
  }
  const benign = [
    "The validator never evaluates repository source as code.",
    "Section 19 forbids eval, dynamic code, and shell interpolation.",
    "A Function is a first-class value in JavaScript.",
    "See the note about vm isolation in the design document."
  ];
  for (const sample of benign) {
    const issues = dynamicExecutionIssues(sample, "adversarial");
    if (issues.length !== 0) {
      problems.push("benign prose was rejected as dynamic execution: " + sample + " (" + issues[0].detail + ")");
    }
  }
  return problems;
});

/* ---------------- summary ---------------- */

const total = passes + failures;
console.log("");
console.log("MARZI-021 learning contracts: " + passes + "/" + total + " checks passed");
console.log("coverage: " +
  scenarioContracts.de.scenarios.length + " German scenarios / " +
  scenarioContracts.de.scenarios.reduce((n, s) => n + s.objectives.length, 0) + " variants, " +
  scenarioContracts.en.scenarios.length + " English scenarios / " +
  scenarioContracts.en.scenarios.reduce((n, s) => n + s.objectives.length, 0) + " variants, " +
  objectiveIndex.size + " objective identifiers total");
console.log("curriculum version: " + contract["source-inventory.json"].curriculumVersion +
  " (release mode refused: " + releaseIssues().length + " open gates and unreviewed items)");

if (failures) {
  console.error("");
  console.error(failures + " check(s) failed.");
  process.exit(1);
}
console.log("All learning-contract checks passed.");
