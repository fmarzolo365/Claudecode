#!/usr/bin/env node
/* MARZI Engineering OS V3.2 - deterministic role policy (PreToolUse).
   Defense-in-depth behind agent-frontmatter tool allowlists: even if
   permission behavior changes, this hook denies prohibited operations.
   Input: PreToolUse JSON on stdin. Deny = exit 2 with reason on stderr
   (supported blocking mechanism); allow = exit 0 (defer to the normal
   permission flow). This is policy enforcement, NOT an OS sandbox: shell
   analysis is pattern-based and can be evaded by a determined agent; the
   primary controls are role tool allowlists + review. */
import { readFileSync } from "node:fs";
import { execSync } from "node:child_process";
import path from "node:path";

let input = {};
try { input = JSON.parse(readFileSync(0, "utf8")); } catch (e) { process.exit(0); }

const tool = input.tool_name || "";
const agentRaw = input.agent_type || input.agentType || "";
const agent = String(agentRaw).toLowerCase();
const cwd = input.cwd || process.cwd();
const OS_BRANCH = "claude/marzi-engineering-os-v3-2";

const deny = (reason) => { process.stderr.write("MARZI role-policy DENY: " + reason + "\n"); process.exit(2); };
const allow = () => process.exit(0);

function repoRoot() {
  try { return execSync("git rev-parse --show-toplevel", { cwd, stdio: ["ignore", "pipe", "ignore"] }).toString().trim(); }
  catch (e) { return null; }
}
function currentBranch() {
  try { return execSync("git branch --show-current", { cwd, stdio: ["ignore", "pipe", "ignore"] }).toString().trim(); }
  catch (e) { return ""; }
}
function relToRepo(p) {
  const root = repoRoot();
  if (!root || !p) return null;
  const abs = path.isAbsolute(p) ? path.normalize(p) : path.resolve(cwd, p);
  const rel = path.relative(root, abs);
  if (rel.startsWith("..") || path.isAbsolute(rel)) return null; // outside repo
  return rel.split(path.sep).join("/");
}

/* role table: unknown/absent agent_type falls back to the untyped policy
   defined by the V3.2 spec (never unrestricted product authority) */
const ROLES = {
  "marzi-principal-coordinator": { edit: "none", bash: "readonly" },
  "marzi-architect": { edit: "none", bash: "readonly" },
  "marzi-test-red-team": { edit: "tests", bash: "redteam" },
  "marzi-implementer": { edit: "product", bash: "implementer" },
  "marzi-release-auditor": { edit: "none", bash: "readonly" },
};
const role = ROLES[agent] || { edit: "installer", bash: "installer" };

const CONTROL_PLANE = [
  /^\.claude\//,
  /^\.ai\/agents\/MARZI_PRINCIPAL_ENGINEER\.md$/,
  /^\.ai\/ENGINEERING_OS_V3_2\.md$/,
  /^CLAUDE\.md$/,
];
const OS_INSTALL_ALLOWED = [
  /^CLAUDE\.md$/,
  /^\.claude\/settings\.json$/,
  /^\.claude\/quality-gates\.json$/,
  /^\.claude\/agents\//,
  /^\.claude\/skills\//,
  /^\.claude\/hooks\//,
  /^\.claude\/validation\//,
  /^\.ai\/ENGINEERING_OS_V3_2\.md$/,
];
const isControlPlane = (rel) => CONTROL_PLANE.some((r) => r.test(rel));
const isTestPath = (rel) => rel.startsWith("test/");

/* ---------------- Edit / Write / NotebookEdit ---------------- */
if (tool === "Edit" || tool === "Write" || tool === "NotebookEdit" || tool === "MultiEdit") {
  const target = (input.tool_input && (input.tool_input.file_path || input.tool_input.notebook_path)) || "";
  const rel = relToRepo(target);
  if (role.edit === "none") deny(`${agent || "read-only role"} may not use ${tool}`);
  if (rel === null) allow(); // outside the repository (scratchpad) - not repo mutation
  if (role.edit === "tests") {
    if (isTestPath(rel)) allow();
    deny(`red team may edit only test/** (attempted: ${rel})`);
  }
  if (role.edit === "product") {
    if (isControlPlane(rel)) deny(`implementer may not edit the control plane (${rel})`);
    allow();
  }
  if (role.edit === "installer") {
    if (currentBranch() === OS_BRANCH) {
      if (OS_INSTALL_ALLOWED.some((r) => r.test(rel))) allow();
      deny(`untyped session on the OS branch may edit only Engineering OS installation paths (attempted: ${rel})`);
    }
    deny(`untyped session has no repository edit authority (attempted: ${rel}); use the V3.2 role agents`);
  }
  allow();
}

/* ---------------- Bash / shell ---------------- */
if (tool === "Bash" || tool === "PowerShell") {
  const cmd = String((input.tool_input && input.tool_input.command) || "");

  /* absolute Git safety - every role, no exceptions */
  const GIT_FORBIDDEN = [
    [/git\s+push\b[^\n]*(\s--force\b|\s-f\b|\s--force-with-lease\b)/, "force push"],
    [/git\s+reset\s+--hard\b/, "hard reset"],
    [/git\s+clean\s+-\w*f/, "git clean -f*"],
    [/git\s+branch\s+(-D|--delete\s+--force)\b/, "force branch delete"],
    [/git\s+update-ref\b/, "update-ref"],
    [/git\s+commit-tree\b/, "commit-tree"],
    [/git\s+(commit|push)\b[^\n]*--no-verify\b/, "--no-verify"],
    [/git\s+rebase\b/, "rebase"],
    [/git\s+merge\b/, "merge (requires explicit Product Owner authorization)"],
    [/git\s+push\b[^\n]*\s(origin\s+)?(main|master)\b/, "push to main/master"],
    [/git\s+checkout\b[^\n]*\s--\s/, "destructive checkout of paths"],
    [/git\s+restore\b(?![^\n]*--staged)/, "destructive restore"],
  ];
  for (const [re, label] of GIT_FORBIDDEN) if (re.test(cmd)) deny(`forbidden git operation (${label}): ${cmd.slice(0, 120)}`);

  const MUTATION_SIGNALS =
    /(>>?\s*[^&|\s]|\btee\b|\bsed\s+-i\b|\bperl\s+-p?i\b|\brm\s|\bmv\s|\bcp\s|\btouch\s|\btruncate\b|\bnpm\s+(i|install|add|update)\b|\byarn\s+(add|install)\b|\bpnpm\s+(add|install)\b|\bpip3?\s+install\b|\bnode\s+-e\b|\bpython3?\s+-c\b|\bchmod\b|\bchown\b|\bln\s)/;
  const REPO_REF = /(public\/|server\.js|test\/|contracts\/|\.github\/|\.ai\/|\.claude\/|CLAUDE\.md|tools\/)/;
  const CONTROL_REF = /(\.claude\/|\.ai\/agents\/MARZI_PRINCIPAL_ENGINEER|\.ai\/ENGINEERING_OS_V3_2|CLAUDE\.md)/;
  const GIT_WRITE = /git\s+(add|commit|push|tag|stash|apply|am|mv|rm|cherry-pick|revert|switch|checkout)\b/;

  if (role.bash === "readonly") {
    if (MUTATION_SIGNALS.test(cmd) && REPO_REF.test(cmd)) deny("read-only role: shell mutation of repository paths");
    if (GIT_WRITE.test(cmd)) deny("read-only role: git write operations are not permitted");
    const READ_OK = /^\s*(cd\s+[^;&|]+\s*(;|&&)\s*)?(git\s+(status|diff|show|log|rev-parse|branch\s+--show-current|ls-files|ls-tree|shortlog|describe)\b|grep\b|rg\b|find\b(?![^\n]*(-delete|-exec))|cat\b|head\b|tail\b|wc\b|ls\b|pwd\b|echo\b|sha256sum\b|node\s+--check\b|node\s+test\/|node\s+\.claude\/validation\/|python3\s+tools\/validate_|claude\s+--version\b|df\b|du\b|sort\b|uniq\b|cut\b|diff\b)/;
    if (!READ_OK.test(cmd)) deny("read-only role: command is not on the read/audit allowlist: " + cmd.slice(0, 120));
    allow();
  }
  if (role.bash === "redteam") {
    if (GIT_WRITE.test(cmd)) deny("red team may not perform git write operations (no commit/push/history changes)");
    if (MUTATION_SIGNALS.test(cmd) && REPO_REF.test(cmd)) deny("red team: file changes must use Edit/Write under test/**, not shell writes");
    allow();
  }
  if (role.bash === "implementer" || role.bash === "installer") {
    if (MUTATION_SIGNALS.test(cmd) && CONTROL_REF.test(cmd)) deny("control-plane mutation via shell is prohibited");
    if (role.bash === "installer" && MUTATION_SIGNALS.test(cmd) && REPO_REF.test(cmd) && currentBranch() !== OS_BRANCH)
      deny("untyped session: repository mutation via shell requires the V3.2 role agents");
    if (/git\s+commit\b/.test(cmd) && process.env.MARZI_GATE_RUNNING !== "1") {
      try {
        execSync(`node "${path.join(repoRoot() || cwd, ".claude/hooks/quality-gate.mjs")}" commit`, {
          cwd, stdio: ["ignore", "inherit", "inherit"], env: { ...process.env, MARZI_GATE_RUNNING: "1" },
        });
      } catch (e) { deny("COMMIT DENIED - quality gate failed (see output above)"); }
    }
    if (/git\s+push\b/.test(cmd) && process.env.MARZI_GATE_RUNNING !== "1") {
      try {
        execSync(`node "${path.join(repoRoot() || cwd, ".claude/hooks/quality-gate.mjs")}" push`, {
          cwd, stdio: ["ignore", "inherit", "inherit"],
          env: { ...process.env, MARZI_GATE_RUNNING: "1", MARZI_GIT_COMMAND: cmd },
        });
      } catch (e) { deny("PUSH DENIED - quality gate failed (see output above)"); }
    }
    allow();
  }
  allow();
}

allow();
