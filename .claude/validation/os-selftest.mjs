#!/usr/bin/env node
/* MARZI Engineering OS V3.2 self-test.
   Mechanically verifies the control plane: agent files + frontmatter, tool
   authority, skills, settings, hooks, gate definitions, and synthetic role
   policy decisions (spawning the real role-policy hook with crafted
   PreToolUse input). Never mutates product code; every synthetic test is
   input-only. Exit 0 = pass, 1 = fail. */
import { readFileSync, existsSync, readdirSync, mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { execSync, spawnSync } from "node:child_process";
import path from "node:path";
import os from "node:os";
import { analyzePush, parsePushArgs, normalizeRef } from "../hooks/push-target.mjs";

const root = execSync("git rev-parse --show-toplevel").toString().trim();
const P = (...p) => path.join(root, ...p);
let failures = 0;
let total = 0;
const ok = (name) => console.log("  ok  " + name);
const fail = (name, detail) => { failures++; console.error("FAIL  " + name + (detail ? " - " + detail : "")); };
const check = (name, fn) => { total++; try { fn() === false ? fail(name) : ok(name); } catch (e) { fail(name, e.message); } };

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
for (const f of ["hooks/role-policy.mjs", "hooks/quality-gate.mjs", "hooks/push-target.mjs", "hooks/subagent-stop-gate.mjs", "validation/os-selftest.mjs"]) {
  check("syntax: .claude/" + f, () => { execSync(`node --check "${P(".claude", f)}"`); });
}
check("quality-gates.json: single canonical source, real commands", () => {
  const g = JSON.parse(readFileSync(P(".claude/quality-gates.json"), "utf8"));
  for (const gate of ["CONTROL_PLANE_GATE", "CONTROL_PLANE_PUSH_GATE", "PRODUCT_PRE_COMMIT_GATE", "PRODUCT_PRE_PUSH_GATE"])
    if (!Array.isArray(g[gate]) || !g[gate].length) throw new Error("gate missing: " + gate);
  /* every push gate must run the shared push-target check */
  for (const gate of ["CONTROL_PLANE_PUSH_GATE", "PRODUCT_PRE_PUSH_GATE"])
    if (!g[gate].includes("@PUSH_TARGET_CHECK")) throw new Error(gate + " missing @PUSH_TARGET_CHECK");
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
/* same hook, but evaluated from an arbitrary working directory (used by the
   temporary /tmp git fixtures - never against the MARZI worktree) */
function policyAt(dir, agentType, toolName, toolInput) {
  return policyRaw(JSON.stringify({ agent_type: agentType, tool_name: toolName, tool_input: toolInput, cwd: dir }));
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
  /* TEMPORARY_INSTALLER_FALLBACK CLOSED: unknown/absent agent_type is
     read-only and holds NO repository mutation authority anywhere. */
  ["untyped control-plane edit denied (on the OS branch too)", () => policy("", "Edit", { file_path: P(".claude/agents/example.md") }) === 2],
  ["untyped control-plane Write denied", () => policy("", "Write", { file_path: P(".claude/settings.json") }) === 2],
  ["untyped CLAUDE.md edit denied", () => policy("", "Edit", { file_path: P("CLAUDE.md") }) === 2],
  ["untyped OS-record edit denied", () => policy("", "Edit", { file_path: P(".ai/ENGINEERING_OS_V3_2.md") }) === 2],
  ["untyped product edit denied", () => policy("", "Edit", { file_path: P("public/index.html") }) === 2],
  ["untyped MultiEdit denied", () => policy("", "MultiEdit", { file_path: P("public/index.html") }) === 2],
  ["untyped NotebookEdit denied", () => policy("", "NotebookEdit", { notebook_path: P("x.ipynb") }) === 2],
  ["unrecognized agent name edit denied", () => policy("some-other-agent", "Edit", { file_path: P(".claude/settings.json") }) === 2],
  ["untyped git commit denied", () => policy("", "Bash", { command: "git commit -m x" }) === 2],
  ["untyped git push denied", () => policy("", "Bash", { command: "git push origin claude/x" }) === 2],
  ["untyped shell repo mutation denied", () => policy("", "Bash", { command: "echo x > .claude/settings.json" }) === 2],
  ["untyped git add denied", () => policy("", "Bash", { command: "git add -A" }) === 2],
  ["untyped safe git status allowed", () => policy("", "Bash", { command: "git status --short" }) === 0],
  ["untyped safe git log allowed", () => policy("", "Bash", { command: "git log --oneline -5" }) === 0],
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
  ["TEMPORARY_INSTALLER_FALLBACK marker absent from policy and OS record", () => {
    const src = readFileSync(P(".claude/hooks/role-policy.mjs"), "utf8");
    const rec = readFileSync(P(".ai/ENGINEERING_OS_V3_2.md"), "utf8");
    if (src.includes("TEMPORARY_INSTALLER_FALLBACK")) throw new Error("marker still in role-policy.mjs");
    if (rec.includes("TEMPORARY_INSTALLER_FALLBACK")) throw new Error("marker still in the OS record");
    if (/edit:\s*"installer"|bash:\s*"installer"/.test(src)) throw new Error("installer authority still mapped");
    return existsSync(P(".claude/agents/marzi-os-maintainer.md"));
  }],
  ["maintainer shell mutation of repo paths denied (Edit/Write only)", () => policy("marzi-os-maintainer", "Bash", { command: "echo x > .claude/settings.json" }) === 2],
  ["red-team non-detached switch denied", () => policy("marzi-test-red-team", "Bash", { command: "git switch main" }) === 2],
  ["read-only role may inspect main via git show", () => policy("marzi-architect", "Bash", { command: "git show main --stat" }) === 0],
];
for (const [name, fn] of cases) check("policy: " + name, () => { if (!fn()) throw new Error("unexpected decision"); });

/* ---------- shared push-target parser (unit) ---------- */
const PUSH_CASES = [
  ["--force rejected", "git push --force origin x", true],
  ["-f rejected", "git push -f origin x", true],
  ["--force-with-lease rejected", "git push --force-with-lease origin x", true],
  ["--no-verify rejected", "git push --no-verify origin x", true],
  ["--mirror rejected", "git push --mirror origin", true],
  ["--all rejected", "git push --all origin", true],
  ["--delete rejected", "git push --delete origin x", true],
  ["-d rejected", "git push -d origin x", true],
  ["leading + refspec rejected", "git push origin +HEAD:x", true],
  ["deletion refspec rejected", "git push origin :main", true],
  ["deletion refspec (branch) rejected", "git push origin :feature", true],
  ["destination main rejected", "git push origin main", true],
  ["destination master rejected", "git push origin master", true],
  ["HEAD:main rejected", "git push origin HEAD:main", true],
  ["HEAD:refs/heads/main rejected", "git push origin HEAD:refs/heads/main", true],
  ["HEAD:refs/heads/master rejected", "git push origin HEAD:refs/heads/master", true],
  ["refs/heads/x:refs/heads/main rejected", "git push origin refs/heads/x:refs/heads/main", true],
  ["bundled -fu rejected", "git push -fu origin x", true],
  ["chained push to main rejected", "true && git push origin main", true],
  ["safe feature push accepted", "git push -u origin claude/feature-x", false],
  ["safe refspec push accepted", "git push origin HEAD:refs/heads/claude/feature-x", false],
];
for (const [name, cmd, shouldReject] of PUSH_CASES) {
  check("push parser: " + name, () => {
    const v = analyzePush(cmd, { currentBranch: () => "claude/feature-x", upstream: () => "origin/claude/feature-x" });
    if (shouldReject !== v.length > 0) throw new Error(`expected ${shouldReject ? "reject" : "accept"}, got [${v.join("; ")}]`);
  });
}
check("push parser: implicit push inspects configured upstream (main rejected)", () => {
  const v = analyzePush("git push", { currentBranch: () => "work", upstream: () => "origin/main" });
  if (!v.length) throw new Error("upstream destination main was not rejected");
});
check("push parser: implicit push inspects configured upstream (master rejected)", () => {
  const v = analyzePush("git push", { currentBranch: () => "work", upstream: () => "origin/refs/heads/master" });
  if (!v.length) throw new Error("upstream destination master was not rejected");
});
check("push parser: implicit push with safe upstream accepted", () => {
  const v = analyzePush("git push", { currentBranch: () => "work", upstream: () => "origin/claude/x" });
  if (v.length) throw new Error("unexpected: " + v.join("; "));
});
check("push parser: implicit push from protected branch without upstream rejected", () => {
  const v = analyzePush("git push", { currentBranch: () => "main", upstream: () => null });
  if (!v.length) throw new Error("implicit push from main was not rejected");
});
check("push parser: non-push command yields no violations", () => {
  if (analyzePush("git status", {}).length) throw new Error("false positive");
});
check("push parser: parsePushArgs separates flags/remote/refspecs", () => {
  const p = parsePushArgs(["-u", "origin", "HEAD:refs/heads/x"]);
  if (p.remote !== "origin" || p.refspecs.length !== 1 || !p.flags.includes("-u")) throw new Error(JSON.stringify(p));
});
check("push parser: normalizeRef strips refs/heads/", () => {
  if (normalizeRef("refs/heads/main") !== "main") throw new Error("normalizeRef broken");
});
check("quality gate performs its own push-target check via the shared parser", () => {
  const src = readFileSync(P(".claude/hooks/quality-gate.mjs"), "utf8");
  if (!src.includes("push-target.mjs")) throw new Error("quality gate does not import the shared parser");
  if (/git\\s\+push\\b\[\^\\n\]\*/.test(src)) throw new Error("quality gate still uses a private push regex");
});

/* ---------- DIRECT behavioral tests: worktree alignment, OS-branch and
     protected-branch policy, using throwaway git fixtures under /tmp.
     Source-string assertions are NOT accepted as proof for these rules. ---- */
let fixture = null;
try {
  fixture = mkdtempSync(path.join(os.tmpdir(), "marzi-os-selftest-"));
  const REPO = path.join(fixture, "repo");
  const WT = path.join(fixture, "linked-wt");
  const G = (dir, args) => execSync(
    `git -c user.name=selftest -c user.email=selftest@marzi.invalid -c commit.gpgsign=false ${args}`,
    { cwd: dir, stdio: ["ignore", "pipe", "pipe"] }).toString().trim();

  mkdirSync(REPO, { recursive: true });
  G(REPO, "init -q");
  G(REPO, "symbolic-ref HEAD refs/heads/main");
  writeFileSync(path.join(REPO, "seed.txt"), "seed\n");
  mkdirSync(path.join(REPO, ".claude"), { recursive: true });
  writeFileSync(path.join(REPO, ".claude", "settings.json"), "{}\n");
  G(REPO, "add -A");
  G(REPO, 'commit -q -m "fixture baseline"');
  const SHA = G(REPO, "rev-parse HEAD");
  const SHORT = SHA.slice(0, 12);
  const GHOST = "0123456789abcdef0123456789abcdef01234567";
  G(REPO, "branch claude/marzi-engineering-os-v3-2");
  G(REPO, "branch feature/x");
  G(REPO, "branch master");
  G(REPO, `worktree add -q --detach "${WT}" HEAD`);

  const RT = "marzi-test-red-team";
  const align = (dir, cmd, agentType = RT) => policyAt(dir, agentType, "Bash", { command: cmd });

  /* A - the ONLY permitted form, in a clean linked worktree */
  check("worktree A: red-team `git switch --detach <full sha>` in clean linked worktree ALLOWED",
    () => align(WT, `git switch --detach ${SHA}`) === 0);
  check("worktree A2: equivalent `git checkout --detach <full sha>` ALLOWED",
    () => align(WT, `git checkout --detach ${SHA}`) === 0);
  /* B - main checkout is never eligible */
  check("worktree B: same command in the MAIN checkout DENIED",
    () => align(REPO, `git switch --detach ${SHA}`) === 2);
  /* C/D - SHA form and existence */
  check("worktree C: short SHA DENIED", () => align(WT, `git switch --detach ${SHORT}`) === 2);
  check("worktree D: non-existent full SHA DENIED", () => align(WT, `git switch --detach ${GHOST}`) === 2);
  check("worktree D2: uppercase/40-char non-hex DENIED", () => align(WT, `git switch --detach ${SHA.toUpperCase()}`) === 2);
  /* E - dirty linked worktree */
  check("worktree E: dirty linked worktree DENIED", () => {
    const dirt = path.join(WT, "dirty.txt");
    writeFileSync(dirt, "uncommitted\n");
    try { return align(WT, `git switch --detach ${SHA}`) === 2; }
    finally { rmSync(dirt, { force: true }); }
  });
  check("worktree E2: still ALLOWED once the linked worktree is clean again",
    () => align(WT, `git switch --detach ${SHA}`) === 0);
  /* F/G/H - forbidden switch/checkout forms */
  check("worktree F: branch switch DENIED", () => align(WT, "git switch feature/x") === 2);
  check("worktree F2: branch checkout DENIED", () => align(WT, "git checkout feature/x") === 2);
  check("worktree G: branch creation -c DENIED", () => align(WT, `git switch -c newbr ${SHA}`) === 2);
  check("worktree G2: branch creation -C DENIED", () => align(WT, `git switch -C newbr ${SHA}`) === 2);
  check("worktree G3: branch creation -b DENIED", () => align(WT, `git checkout -b newbr ${SHA}`) === 2);
  check("worktree G4: branch creation -B DENIED", () => align(WT, `git checkout -B newbr ${SHA}`) === 2);
  check("worktree H: path checkout DENIED", () => align(WT, "git checkout -- seed.txt") === 2);
  check("worktree H2: --discard-changes DENIED", () => align(WT, "git switch --discard-changes feature/x") === 2);
  /* I/J - chaining and redirection */
  check("worktree I: command chaining DENIED", () => align(WT, `git switch --detach ${SHA} && echo pwned`) === 2);
  check("worktree I2: semicolon chaining DENIED", () => align(WT, `git switch --detach ${SHA}; echo pwned`) === 2);
  check("worktree J: redirection DENIED", () => align(WT, `git switch --detach ${SHA} > /tmp/marzi-selftest-out`) === 2);
  check("worktree J2: command substitution DENIED", () => align(WT, "git switch --detach $(git rev-parse HEAD)") === 2);
  /* the exception belongs to the red team alone */
  check("worktree K: untyped session gets NO alignment exception",
    () => align(WT, `git switch --detach ${SHA}`, "") === 2);
  check("worktree K2: red-team commit still DENIED in the linked worktree",
    () => align(WT, "git commit -m x") === 2);
  check("worktree K3: red-team push still DENIED in the linked worktree",
    () => align(WT, "git push origin HEAD") === 2);

  /* OS-maintainer branch restriction (direct, fixture-driven) */
  const cpFile = path.join(REPO, ".claude", "settings.json");
  G(REPO, "checkout -q claude/marzi-engineering-os-v3-2");
  check("maintainer branch: control-plane Edit ALLOWED on the OS branch",
    () => policyAt(REPO, "marzi-os-maintainer", "Edit", { file_path: cpFile }) === 0);
  check("maintainer branch: product Edit DENIED even on the OS branch",
    () => policyAt(REPO, "marzi-os-maintainer", "Edit", { file_path: path.join(REPO, "seed.txt") }) === 2);
  G(REPO, "checkout -q feature/x");
  check("maintainer branch: control-plane Edit DENIED off the OS branch",
    () => policyAt(REPO, "marzi-os-maintainer", "Edit", { file_path: cpFile }) === 2);
  check("maintainer branch: git commit DENIED off the OS branch",
    () => policyAt(REPO, "marzi-os-maintainer", "Bash", { command: "git commit -m x" }) === 2);
  check("maintainer branch: git push DENIED off the OS branch",
    () => policyAt(REPO, "marzi-os-maintainer", "Bash", { command: "git push origin feature/x" }) === 2);

  /* protected local branches */
  for (const prot of ["main", "master"]) {
    G(REPO, `checkout -q ${prot}`);
    check(`protected branch: implementer commit on ${prot} DENIED`,
      () => policyAt(REPO, "marzi-implementer", "Bash", { command: "git commit -m x" }) === 2);
    check(`protected branch: os-maintainer commit on ${prot} DENIED`,
      () => policyAt(REPO, "marzi-os-maintainer", "Bash", { command: "git commit -m x" }) === 2);
    check(`protected branch: read-only inspection on ${prot} still ALLOWED`,
      () => policyAt(REPO, "marzi-implementer", "Bash", { command: `git log --oneline -1 ${prot}` }) === 0);
  }
  G(REPO, "checkout -q feature/x");
  check("protected branch: implementer commit on a feature branch ALLOWED",
    () => policyAt(REPO, "marzi-implementer", "Bash", { command: "git commit -m x" }) === 0);
  for (const mv of ["git switch main", "git switch master", "git checkout main", "git checkout master"]) {
    check(`protected branch: '${mv}' DENIED (implementer)`,
      () => policyAt(REPO, "marzi-implementer", "Bash", { command: mv }) === 2);
    check(`protected branch: '${mv}' DENIED (os-maintainer)`,
      () => policyAt(REPO, "marzi-os-maintainer", "Bash", { command: mv }) === 2);
  }
  for (const ro of ["git show main --stat", "git log main --oneline -3", "git diff main --stat"]) {
    check(`protected branch: read-only '${ro}' ALLOWED`,
      () => policyAt(REPO, "marzi-implementer", "Bash", { command: ro }) === 0);
  }
} catch (e) {
  fail("temporary git fixture harness", e.message);
} finally {
  /* clean up ONLY the /tmp fixture; the MARZI worktree is never touched */
  if (fixture) rmSync(fixture, { recursive: true, force: true });
  rmSync("/tmp/marzi-selftest-out", { force: true });
}

/* ---------- installation scope + canon integrity (OS branch only) ---------- */
const branch = execSync("git branch --show-current", { cwd: root }).toString().trim();
const BASELINE = "a9af88baac16ea00eab73ba95f50fd666183862c";
const OS_ALLOWED_PATH = /^(CLAUDE\.md|\.claude\/(settings\.json|quality-gates\.json|agents\/|skills\/|hooks\/|validation\/)|\.ai\/ENGINEERING_OS_V3_2\.md)/;
if (branch === "claude/marzi-engineering-os-v3-2") {
  check("OS-branch changed paths within installation allowlist", () => {
    // -uall expands untracked directories; NO whole-output trim (it would
    // strip the first line's status column and corrupt the path slice)
    const changed = execSync("git status --porcelain -uall", { cwd: root }).toString().split("\n")
      .filter((l) => l.length > 3).map((l) => l.slice(3).trim().replace(/^"|"$/g, ""));
    const bad = changed.filter((p) => !OS_ALLOWED_PATH.test(p));
    if (bad.length) throw new Error("out-of-scope paths: " + bad.join(", "));
  });
  /* the COMMITTED range must obey the same allowlist - a working tree that is
     clean says nothing about what earlier commits on this branch changed */
  check("CONTROL_PLANE_SCOPE: every committed path in baseline..HEAD is in the OS allowlist", () => {
    const changed = execSync(`git diff --no-renames --name-only ${BASELINE} HEAD`, { cwd: root })
      .toString().split("\n").map((s) => s.trim()).filter(Boolean);
    const bad = changed.filter((p) => !OS_ALLOWED_PATH.test(p));
    if (bad.length) throw new Error("CONTROL_PLANE_SCOPE_VIOLATION - committed out-of-scope paths: " + bad.join(", "));
    if (!changed.length) throw new Error("expected a non-empty committed control-plane range");
  });
  check("CONTROL_PLANE_SCOPE: allowlist actually rejects out-of-scope paths", () => {
    for (const p of ["public/index.html", "server.js", "sw.js", "test/run.js", "contracts/x.json",
      ".github/workflows/ci.yml", ".ai/agents/MARZI_PRINCIPAL_ENGINEER.md", "package.json", "tools/x.py"])
      if (OS_ALLOWED_PATH.test(p)) throw new Error("allowlist wrongly accepts " + p);
    for (const p of ["CLAUDE.md", ".claude/hooks/push-target.mjs", ".claude/settings.json",
      ".claude/agents/marzi-os-maintainer.md", ".ai/ENGINEERING_OS_V3_2.md"])
      if (!OS_ALLOWED_PATH.test(p)) throw new Error("allowlist wrongly rejects " + p);
  });
  check("Constitution V2 byte-identical to baseline", () => {
    execSync("git diff --quiet a9af88baac16ea00eab73ba95f50fd666183862c -- .ai/agents/MARZI_PRINCIPAL_ENGINEER.md", { cwd: root });
  });
  check("product code and product tests unchanged vs baseline", () => {
    const out = execSync("git diff --name-only a9af88baac16ea00eab73ba95f50fd666183862c -- public server.js test contracts .github", { cwd: root }).toString().trim();
    if (out) throw new Error("product paths differ: " + out);
  });
}

console.log(failures
  ? `\n${failures} OS self-test failure(s) (${total - failures}/${total} passed)`
  : `\nOS SELF-TEST PASSED (${total}/${total} checks)`);
process.exit(failures ? 1 : 0);
