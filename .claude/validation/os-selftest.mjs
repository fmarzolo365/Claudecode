#!/usr/bin/env node
/* MARZI Engineering OS V3.2 self-test.
   Mechanically verifies the control plane: agent files + frontmatter, tool
   authority, skills, settings, hooks, gate definitions, and synthetic role
   policy decisions (spawning the real role-policy hook with crafted
   PreToolUse input). Never mutates product code; every synthetic test is
   input-only. Exit 0 = pass, 1 = fail. */
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { execSync, spawnSync } from "node:child_process";
import path from "node:path";

const root = execSync("git rev-parse --show-toplevel").toString().trim();
const P = (...p) => path.join(root, ...p);
let failures = 0;
const ok = (name) => console.log("  ok  " + name);
const fail = (name, detail) => { failures++; console.error("FAIL  " + name + (detail ? " - " + detail : "")); };
const check = (name, fn) => { try { fn() === false ? fail(name) : ok(name); } catch (e) { fail(name, e.message); } };

function frontmatter(file) {
  const src = readFileSync(file, "utf8");
  const m = src.match(/^---\n([\s\S]*?)\n---/);
  if (!m) throw new Error("no frontmatter: " + file);
  const fm = {};
  let listKey = null;
  for (const line of m[1].split("\n")) {
    const li = line.match(/^\s+-\s+(.+)$/);
    if (li && listKey) { fm[listKey].push(li[1].trim()); continue; }
    const kv = line.match(/^([A-Za-z]+):\s*(.*)$/);
    if (kv) {
      if (kv[2] === "") { listKey = kv[1]; fm[listKey] = []; }
      else { fm[kv[1]] = kv[2].trim(); listKey = null; }
    }
  }
  if (!fm.name || !fm.description) throw new Error("frontmatter missing name/description: " + file);
  return fm;
}

function parseTools(raw) {
  const out = { agents: null, tools: [] };
  let rest = String(raw || "");
  const am = rest.match(/Agent\(([^)]*)\)/);
  if (am) { out.agents = am[1].split(",").map((s) => s.trim()).filter(Boolean); rest = rest.replace(am[0], ""); }
  else if (/(^|,)\s*Agent\s*(,|$)/.test(rest)) out.agents = "UNRESTRICTED";
  if (/Agent\([^)]*$/.test(String(raw || ""))) throw new Error("malformed Agent(...) allowlist");
  out.tools = rest.split(",").map((s) => s.trim()).filter(Boolean);
  return out;
}

/* ---------- agent files ---------- */
const AGENTS = {
  "marzi-principal-coordinator": { edit: false, agents: ["marzi-architect", "marzi-test-red-team", "marzi-implementer", "marzi-release-auditor"], permissionMode: "default", effort: "max", skills: ["marzi-preflight"] },
  "marzi-architect": { edit: false, agents: null, permissionMode: "plan", effort: "max", skills: ["marzi-preflight"] },
  "marzi-test-red-team": { edit: true, agents: null, permissionMode: "default", effort: "max", isolation: "worktree", skills: ["marzi-adversarial-proof"] },
  "marzi-implementer": { edit: true, agents: null, permissionMode: "default", effort: "max", skills: ["marzi-preflight"] },
  "marzi-release-auditor": { edit: false, agents: null, permissionMode: "plan", effort: "max", skills: ["marzi-release-gate", "marzi-evidence-integrity"] },
  "marzi-os-maintainer": { edit: true, agents: null, permissionMode: "default", effort: "max", skills: ["marzi-preflight"] },
};
const seenNames = new Set();
for (const [name, expect] of Object.entries(AGENTS)) {
  check("agent native frontmatter: " + name, () => {
    const fm = frontmatter(P(".claude/agents", name + ".md"));
    if (fm.name !== name) throw new Error("frontmatter name mismatch: " + fm.name);
    if (seenNames.has(fm.name)) throw new Error("duplicate agent name");
    seenNames.add(fm.name);
    const t = parseTools(fm.tools);
    if (t.agents === "UNRESTRICTED") throw new Error("bare unrestricted Agent tool present");
    if (expect.agents === null) { if (t.agents) throw new Error("specialist must not delegate: " + fm.tools); }
    else {
      if (!t.agents) throw new Error("coordinator missing Agent(...) allowlist");
      const got = [...t.agents].sort().join(","), want = [...expect.agents].sort().join(",");
      if (got !== want) throw new Error("Agent allowlist mismatch: " + got);
    }
    const hasEdit = t.tools.includes("Edit") || t.tools.includes("Write") || t.tools.includes("NotebookEdit");
    if (hasEdit !== expect.edit) throw new Error("Edit/Write authority wrong: " + fm.tools);
    if (fm.permissionMode !== expect.permissionMode) throw new Error("permissionMode: " + fm.permissionMode);
    if (fm.effort !== expect.effort) throw new Error("effort: " + fm.effort);
    if (expect.isolation && fm.isolation !== expect.isolation) throw new Error("isolation: " + fm.isolation);
    const skills = Array.isArray(fm.skills) ? fm.skills : [];
    if (skills.join(",") !== expect.skills.join(",")) throw new Error("skills preload mismatch: " + skills.join(","));
    if (fm.memory) throw new Error("persistent memory configured");
  });
}

/* ---------- skills ---------- */
const SKILLS = ["marzi-preflight", "marzi-lifecycle-concurrency", "marzi-transaction-durability",
  "marzi-completion-integrity", "marzi-storage-schema", "marzi-backup-trust-boundary",
  "marzi-pwa-lifecycle", "marzi-adversarial-proof", "marzi-evidence-integrity", "marzi-release-gate"];
for (const s of SKILLS) {
  check("skill parses: " + s, () => {
    const fm = frontmatter(P(".claude/skills", s, "SKILL.md"));
    if (fm.name !== s) throw new Error("skill name mismatch");
  });
}

/* ---------- settings ---------- */
check("settings.json parses and wires hooks to real files", () => {
  const st = JSON.parse(readFileSync(P(".claude/settings.json"), "utf8"));
  if (st.disableAllHooks === true) throw new Error("disableAllHooks is enabled");
  const hookCmds = JSON.stringify(st.hooks || {});
  for (const f of ["role-policy.mjs", "subagent-stop-gate.mjs"])
    if (!hookCmds.includes(f)) throw new Error("hook not referenced: " + f);
  for (const f of ["role-policy.mjs", "quality-gate.mjs", "subagent-stop-gate.mjs"])
    if (!existsSync(P(".claude/hooks", f))) throw new Error("hook file missing: " + f);
  if (st.agent !== "marzi-principal-coordinator") throw new Error("project default agent not configured");
  if (st.autoMemoryEnabled !== false) throw new Error("autoMemoryEnabled not false");
});

/* ---------- hook + gate syntax, gate definition ---------- */
for (const f of ["hooks/role-policy.mjs", "hooks/quality-gate.mjs", "hooks/subagent-stop-gate.mjs", "validation/os-selftest.mjs"]) {
  check("syntax: .claude/" + f, () => { execSync(`node --check "${P(".claude", f)}"`); });
}
check("quality-gates.json: single canonical source, real commands", () => {
  const g = JSON.parse(readFileSync(P(".claude/quality-gates.json"), "utf8"));
  for (const gate of ["CONTROL_PLANE_GATE", "PRODUCT_PRE_COMMIT_GATE", "PRODUCT_PRE_PUSH_GATE"])
    if (!Array.isArray(g[gate]) || !g[gate].length) throw new Error("gate missing: " + gate);
  const referenced = [...g.CONTROL_PLANE_GATE, ...g.PRODUCT_PRE_COMMIT_GATE]
    .filter((c) => !c.startsWith("@") && !c.startsWith("git "));
  for (const cmd of referenced) {
    const file = cmd.split(/\s+/).find((w) => w.includes("/") || w.endsWith(".js") || w.endsWith(".mjs"));
    if (file && !existsSync(P(file))) throw new Error("gate references missing file: " + file);
  }
  for (const gate of ["CONTROL_PLANE_GATE", "PRODUCT_PRE_COMMIT_GATE"]) {
    if (!g[gate].includes("git diff --check")) throw new Error(gate + " missing unstaged diff check");
    if (!g[gate].includes("git diff --cached --check")) throw new Error(gate + " missing staged diff check");
  }
});

/* ---------- synthetic role-policy tests ---------- */
function policyRaw(rawInput) {
  const r = spawnSync(process.execPath, [P(".claude/hooks/role-policy.mjs")], { input: rawInput, encoding: "utf8", env: { ...process.env, MARZI_GATE_RUNNING: "1" } });
  return r.status;
}
function policy(agentType, toolName, toolInput) {
  return policyRaw(JSON.stringify({ agent_type: agentType, tool_name: toolName, tool_input: toolInput, cwd: root }));
}
const cases = [
  ["force-push denied (all roles)", () => policy("marzi-implementer", "Bash", { command: "git push --force origin x" }) === 2],
  ["hard-reset denied (all roles)", () => policy("marzi-test-red-team", "Bash", { command: "git reset --hard HEAD~1" }) === 2],
  ["merge denied (all roles)", () => policy("marzi-implementer", "Bash", { command: "git merge feature" }) === 2],
  ["no-verify denied", () => policy("marzi-implementer", "Bash", { command: "git commit --no-verify -m x" }) === 2],
  ["safe git status allowed", () => policy("marzi-principal-coordinator", "Bash", { command: "git status --short" }) === 0],
  ["coordinator product edit denied", () => policy("marzi-principal-coordinator", "Edit", { file_path: P("public/index.html") }) === 2],
  ["coordinator shell mutation denied", () => policy("marzi-principal-coordinator", "Bash", { command: "echo x > public/index.html" }) === 2],
  ["architect write denied", () => policy("marzi-architect", "Write", { file_path: P("test/temp.js") }) === 2],
  ["red-team test edit allowed", () => policy("marzi-test-red-team", "Edit", { file_path: P("test/audit-example.js") }) === 0],
  ["red-team production edit denied", () => policy("marzi-test-red-team", "Edit", { file_path: P("public/index.html") }) === 2],
  ["red-team control-plane edit denied", () => policy("marzi-test-red-team", "Edit", { file_path: P(".claude/settings.json") }) === 2],
  ["red-team push denied", () => policy("marzi-test-red-team", "Bash", { command: "git push origin x" }) === 2],
  ["red-team commit denied", () => policy("marzi-test-red-team", "Bash", { command: "git commit -m x" }) === 2],
  ["implementer product edit allowed", () => policy("marzi-implementer", "Edit", { file_path: P("public/index.html") }) === 0],
  ["implementer control-plane edit denied", () => policy("marzi-implementer", "Edit", { file_path: P(".claude/settings.json") }) === 2],
  ["implementer constitution edit denied", () => policy("marzi-implementer", "Edit", { file_path: P(".ai/agents/MARZI_PRINCIPAL_ENGINEER.md") }) === 2],
  ["auditor edit denied", () => policy("marzi-release-auditor", "Edit", { file_path: P("README.md") }) === 2],
  ["untyped OS-branch control-plane edit allowed", () => {
    const br = execSync("git branch --show-current", { cwd: root }).toString().trim();
    const want = br === "claude/marzi-engineering-os-v3-2" ? 0 : 2;
    return policy("", "Edit", { file_path: P(".claude/agents/example.md") }) === want;
  }],
  ["untyped product edit denied", () => policy("", "Edit", { file_path: P("public/index.html") }) === 2],
  ["fail-closed: malformed hook input denied", () => policyRaw("this is not json") === 2],
  ["fail-closed: Edit without tool_input denied", () => policy("marzi-implementer", "Edit", undefined) === 2],
  ["fail-closed: Bash without command denied", () => policy("marzi-implementer", "Bash", {}) === 2],
  ["refspec: HEAD:main denied", () => policy("marzi-implementer", "Bash", { command: "git push origin HEAD:main" }) === 2],
  ["refspec: HEAD:master denied", () => policy("marzi-implementer", "Bash", { command: "git push origin HEAD:master" }) === 2],
  ["refspec: HEAD:refs/heads/main denied", () => policy("marzi-implementer", "Bash", { command: "git push origin HEAD:refs/heads/main" }) === 2],
  ["refspec: HEAD:refs/heads/master denied", () => policy("marzi-implementer", "Bash", { command: "git push origin HEAD:refs/heads/master" }) === 2],
  ["refspec: src:refs/heads/main denied", () => policy("marzi-implementer", "Bash", { command: "git push origin refs/heads/x:refs/heads/main" }) === 2],
  ["refspec: src:refs/heads/master denied", () => policy("marzi-implementer", "Bash", { command: "git push origin refs/heads/x:refs/heads/master" }) === 2],
  ["refspec: +HEAD:x force denied", () => policy("marzi-implementer", "Bash", { command: "git push origin +HEAD:x" }) === 2],
  ["refspec: +refs/heads/x:refs/heads/y force denied", () => policy("marzi-implementer", "Bash", { command: "git push origin +refs/heads/x:refs/heads/y" }) === 2],
  ["refspec: deletion :main denied", () => policy("marzi-implementer", "Bash", { command: "git push origin :main" }) === 2],
  ["refspec: --delete denied", () => policy("marzi-implementer", "Bash", { command: "git push origin --delete x" }) === 2],
  ["refspec: safe feature push allowed", () => policy("marzi-implementer", "Bash", { command: "git push -u origin claude/feature-x" }) === 0],
  ["maintainer control-plane edit allowed", () => policy("marzi-os-maintainer", "Edit", { file_path: P(".claude/settings.json") }) === 0],
  ["maintainer product edit denied", () => policy("marzi-os-maintainer", "Edit", { file_path: P("public/index.html") }) === 2],
  ["maintainer constitution edit denied", () => policy("marzi-os-maintainer", "Edit", { file_path: P(".ai/agents/MARZI_PRINCIPAL_ENGINEER.md") }) === 2],
  ["installer fallback marked TEMPORARY + maintainer exists", () => {
    const src = readFileSync(P(".claude/hooks/role-policy.mjs"), "utf8");
    return src.includes("TEMPORARY_INSTALLER_FALLBACK") && existsSync(P(".claude/agents/marzi-os-maintainer.md"));
  }],
];
for (const [name, fn] of cases) check("policy: " + name, () => { if (!fn()) throw new Error("unexpected decision"); });

/* ---------- installation scope + canon integrity (OS branch only) ---------- */
const branch = execSync("git branch --show-current", { cwd: root }).toString().trim();
if (branch === "claude/marzi-engineering-os-v3-2") {
  check("OS-branch changed paths within installation allowlist", () => {
    // -uall expands untracked directories; NO whole-output trim (it would
    // strip the first line's status column and corrupt the path slice)
    const changed = execSync("git status --porcelain -uall", { cwd: root }).toString().split("\n")
      .filter((l) => l.length > 3).map((l) => l.slice(3).trim().replace(/^"|"$/g, ""));
    const allowed = /^(CLAUDE\.md|\.claude\/(settings\.json|quality-gates\.json|agents\/|skills\/|hooks\/|validation\/)|\.ai\/ENGINEERING_OS_V3_2\.md)/;
    const bad = changed.filter((p) => !allowed.test(p));
    if (bad.length) throw new Error("out-of-scope paths: " + bad.join(", "));
  });
  check("Constitution V2 byte-identical to baseline", () => {
    execSync("git diff --quiet a9af88baac16ea00eab73ba95f50fd666183862c -- .ai/agents/MARZI_PRINCIPAL_ENGINEER.md", { cwd: root });
  });
  check("product code and product tests unchanged vs baseline", () => {
    const out = execSync("git diff --name-only a9af88baac16ea00eab73ba95f50fd666183862c -- public server.js test contracts .github", { cwd: root }).toString().trim();
    if (out) throw new Error("product paths differ: " + out);
  });
}

console.log(failures ? "\n" + failures + " OS self-test failure(s)" : "\nOS SELF-TEST PASSED");
process.exit(failures ? 1 : 0);
