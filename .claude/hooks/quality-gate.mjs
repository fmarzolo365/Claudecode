#!/usr/bin/env node
/* MARZI Engineering OS V3.2 - canonical quality-gate runner.
   Usage: node quality-gate.mjs <commit|push|control-plane|product>
   Reads the single gate source .claude/quality-gates.json. On the
   Engineering OS branch, commit/push run CONTROL_PLANE_GATE (the OS
   installer must not be forced through product gates that depend on files
   it is forbidden to change); elsewhere they run the product gates.
   Child validation processes run with MARZI_GATE_RUNNING=1 so the git
   PreToolUse hook never re-enters this runner recursively. */
import { readFileSync } from "node:fs";
import { execSync } from "node:child_process";
import path from "node:path";

const mode = process.argv[2] || "commit";
const cwd = process.cwd();
const root = execSync("git rev-parse --show-toplevel", { cwd }).toString().trim();
const branch = execSync("git branch --show-current", { cwd: root }).toString().trim();
const OS_BRANCH = "claude/marzi-engineering-os-v3-2";
const gates = JSON.parse(readFileSync(path.join(root, ".claude/quality-gates.json"), "utf8"));

function gateName() {
  if (mode === "control-plane") return "CONTROL_PLANE_GATE";
  if (branch === OS_BRANCH) return "CONTROL_PLANE_GATE";
  return mode === "push" ? "PRODUCT_PRE_PUSH_GATE" : "PRODUCT_PRE_COMMIT_GATE";
}

function resolveCommands(name, seen = new Set()) {
  if (seen.has(name)) throw new Error("gate reference cycle: " + name);
  seen.add(name);
  const out = [];
  for (const c of gates[name] || []) {
    if (c === "@PUSH_TARGET_CHECK") { out.push(c); continue; }
    if (c.startsWith("@")) out.push(...resolveCommands(c.slice(1), seen));
    else out.push(c);
  }
  return out;
}

function pushTargetCheck() {
  if (["main", "master", ""].includes(branch)) throw new Error("push target check: pushing from '" + branch + "' is forbidden");
  const gitCmd = process.env.MARZI_GIT_COMMAND || "";
  if (/(--force\b|\s-f\b|--force-with-lease\b|--no-verify\b)/.test(gitCmd)) throw new Error("push target check: force/no-verify options are forbidden");
  if (/git\s+push\b[^\n]*\s(origin\s+)?(main|master)\b/.test(gitCmd)) throw new Error("push target check: pushing to main/master is forbidden");
  const dirty = execSync("git status --porcelain", { cwd: root }).toString().trim();
  if (dirty) throw new Error("push target check: worktree not fully committed:\n" + dirty);
}

const name = gateName();
const commands = resolveCommands(name);
console.log(`MARZI quality gate: ${name} (${commands.length} steps, branch ${branch})`);
for (const cmd of commands) {
  if (cmd === "@PUSH_TARGET_CHECK") {
    try { pushTargetCheck(); console.log("  ok  push target check"); }
    catch (e) { console.error("  FAIL push target check - " + e.message); process.exit(1); }
    continue;
  }
  try {
    execSync(cmd, { cwd: root, stdio: ["ignore", "pipe", "pipe"], env: { ...process.env, MARZI_GATE_RUNNING: "1" }, timeout: 600000 });
    console.log("  ok  " + cmd);
  } catch (e) {
    console.error("  FAIL " + cmd + " (exit " + (e.status ?? "?") + ")");
    if (e.stdout) console.error(String(e.stdout).slice(-2000));
    if (e.stderr) console.error(String(e.stderr).slice(-2000));
    process.exit(1);
  }
}
console.log("MARZI quality gate: " + name + " PASSED");
