#!/usr/bin/env node
/* MARZI Engineering OS V3.2 - deterministic role policy (PreToolUse).
   Defense-in-depth behind agent-frontmatter tool allowlists: even if
   permission behavior changes, this hook denies prohibited operations.
   Input: PreToolUse JSON on stdin; malformed or incomplete input for a
   protected tool DENIES (fail closed). Deny = exit 2 with reason on stderr
   (supported blocking mechanism); allow = exit 0 (defer to the normal
   permission flow). This is policy enforcement, NOT an OS sandbox: shell
   analysis is pattern-based and can be evaded by a determined agent; the
   primary controls are role tool allowlists + review. */
import { readFileSync } from "node:fs";
import { execSync } from "node:child_process";
import path from "node:path";
import { analyzePush } from "./push-target.mjs";

const deny = (reason) => { process.stderr.write("MARZI role-policy DENY: " + reason + "\n"); process.exit(2); };
const allow = () => process.exit(0);

let input = null;
try { input = JSON.parse(readFileSync(0, "utf8")); } catch (e) { input = null; }
if (!input || typeof input !== "object") deny("malformed PreToolUse hook input for a protected tool (fail closed)");

const tool = input.tool_name || "";
const agentRaw = input.agent_type || input.agentType || "";
const agent = String(agentRaw).toLowerCase();
const cwd = input.cwd || process.cwd();
const OS_BRANCH = "claude/marzi-engineering-os-v3-2";

function repoRoot() {
  try { return execSync("git rev-parse --show-toplevel", { cwd, stdio: ["ignore", "pipe", "ignore"] }).toString().trim(); }
  catch (e) { return null; }
}
function currentBranch() {
  try { return execSync("git branch --show-current", { cwd, stdio: ["ignore", "pipe", "ignore"] }).toString().trim(); }
  catch (e) { return ""; }
}
function git(args) {
  return execSync("git " + args, { cwd, stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
}
/* Linked-worktree detection from Git metadata (NOT a path-name guess):
   in a linked worktree the per-worktree git dir is <common>/worktrees/<name>,
   so --absolute-git-dir differs from --git-common-dir and is nested under it. */
function isLinkedWorktree() {
  try {
    const gitDir = path.resolve(cwd, git("rev-parse --absolute-git-dir"));
    const common = path.resolve(cwd, git("rev-parse --git-common-dir"));
    if (gitDir === common) return false;                       // main checkout
    const wtRoot = path.join(common, "worktrees") + path.sep;
    return gitDir.startsWith(wtRoot);
  } catch (e) { return false; }
}
function worktreeClean() {
  try { return git("status --porcelain") === ""; } catch (e) { return false; }
}
function relToRepo(p) {
  const root = repoRoot();
  if (!root || !p) return null;
  const abs = path.isAbsolute(p) ? path.normalize(p) : path.resolve(cwd, p);
  const rel = path.relative(root, abs);
  if (rel.startsWith("..") || path.isAbsolute(rel)) return null; // outside repo
  return rel.split(path.sep).join("/");
}

/* Role table. Unknown or absent agent_type is READ-ONLY: it receives no
   repository mutation authority of any kind (no Edit/Write, no shell
   mutation, no commit, no push) and only verified read/audit commands.
   The former branch-scoped installer fallback was CLOSED by the
   marzi-os-maintainer closeout; no untyped write authority remains. */
const ROLES = {
  "marzi-principal-coordinator": { edit: "none", bash: "readonly" },
  "marzi-architect": { edit: "none", bash: "readonly" },
  "marzi-test-red-team": { edit: "tests", bash: "redteam" },
  "marzi-implementer": { edit: "product", bash: "implementer" },
  "marzi-release-auditor": { edit: "none", bash: "readonly" },
  "marzi-os-maintainer": { edit: "controlplane", bash: "maintainer" },
};
const UNTYPED = { edit: "none", bash: "readonly" };
const role = ROLES[agent] || UNTYPED;

const CONTROL_PLANE = [
  /^\.claude\//,
  /^\.ai\/agents\/MARZI_PRINCIPAL_ENGINEER\.md$/,
  /^\.ai\/ENGINEERING_OS_V3_2\.md$/,
  /^CLAUDE\.md$/,
];
/* the ONLY paths the OS maintainer may write, and only on the OS branch */
const OS_MAINTAINER_ALLOWED = [
  /^CLAUDE\.md$/,
  /^\.claude\//,
  /^\.ai\/ENGINEERING_OS_V3_2\.md$/,
];
const CONSTITUTION = /^\.ai\/agents\/MARZI_PRINCIPAL_ENGINEER\.md$/;
const isControlPlane = (rel) => CONTROL_PLANE.some((r) => r.test(rel));
const isTestPath = (rel) => rel.startsWith("test/");

/* RED-TEAM BASELINE ALIGNMENT - narrow, mechanically verified exception.
   Claude Code isolation starts a linked worktree from the repository default
   branch, not necessarily from the delegated BASELINE_SHA, so the red team
   must be able to detach onto the exact delegated commit inside ITS OWN
   worktree. Permitted form (exactly, nothing else):
       git switch   --detach <40-hex-sha>
       git checkout --detach <40-hex-sha>
   All ten conditions must hold: red-team role, linked (non-main) worktree,
   clean worktree, single full 40-hex SHA that resolves to an existing commit,
   no branch creation, no pathspec, no chaining, no redirection. */
function isRedTeamBaselineAlignment(cmd) {
  if (agent !== "marzi-test-red-team") return false;                    // (1)
  if (/[;&|><`\n]|\$\(/.test(cmd)) return false;                        // (9)(10) no chaining/redirection/substitution
  const t = cmd.trim().split(/\s+/);
  if (t.length !== 4) return false;                                     // (7)(8) no extra args, no pathspec
  if (t[0] !== "git") return false;
  if (t[1] !== "switch" && t[1] !== "checkout") return false;
  if (t[2] !== "--detach") return false;                                // (7) never -b/-B/-c/-C/--discard-changes
  const sha = t[3];
  if (!/^[0-9a-f]{40}$/.test(sha)) return false;                        // (5) full 40-hex only
  if (!isLinkedWorktree()) return false;                                // (2)(3) linked worktree, not main checkout
  if (!worktreeClean()) return false;                                   // (4)
  try { if (git(`cat-file -t ${sha}`) !== "commit") return false; }     // (6) resolves to a real commit
  catch (e) { return false; }
  return true;
}

/* ---------------- Edit / Write / NotebookEdit ---------------- */
if (tool === "Edit" || tool === "Write" || tool === "NotebookEdit" || tool === "MultiEdit") {
  const target = (input.tool_input && (input.tool_input.file_path || input.tool_input.notebook_path)) || "";
  if (!target) deny(tool + " hook input has no target path (fail closed)");
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
  if (role.edit === "controlplane") {
    if (CONSTITUTION.test(rel)) deny("Constitution V2 is immutable to every role");
    const br = currentBranch();
    if (br !== OS_BRANCH)
      deny(`os-maintainer may write only on ${OS_BRANCH} (current branch: ${br || "detached/unknown"})`);
    if (OS_MAINTAINER_ALLOWED.some((r) => r.test(rel))) allow();
    deny(`os-maintainer may edit only CLAUDE.md, .claude/** and .ai/ENGINEERING_OS_V3_2.md (attempted: ${rel})`);
  }
  deny(`no repository edit authority for '${agent || "untyped session"}' (attempted: ${rel})`);
}

/* ---------------- Bash / shell ---------------- */
if (tool === "Bash" || tool === "PowerShell") {
  const cmd = String((input.tool_input && input.tool_input.command) || "");
  if (!cmd) deny("Bash hook input has no command (fail closed)");

  /* absolute Git safety - every role, no exceptions */
  const GIT_FORBIDDEN = [
    [/git\s+push\b[^\n]*(\s--force\b|\s-f\b|\s--force-with-lease\b)/, "force push"],
    [/git\s+push\b[^\n]*(\s--delete\b|\s-d\b)/, "push deletion"],
    [/git\s+reset\s+--hard\b/, "hard reset"],
    [/git\s+clean\s+-\w*f/, "git clean -f*"],
    [/git\s+branch\s+(-D|--delete\s+--force)\b/, "force branch delete"],
    [/git\s+update-ref\b/, "update-ref"],
    [/git\s+commit-tree\b/, "commit-tree"],
    [/git\s+(commit|push)\b[^\n]*--no-verify\b/, "--no-verify"],
    [/git\s+rebase\b/, "rebase"],
    [/git\s+merge\b/, "merge (requires explicit Product Owner authorization)"],
    [/git\s+checkout\b[^\n]*\s--\s/, "destructive checkout of paths"],
    [/git\s+restore\b(?![^\n]*--staged)/, "destructive restore"],
  ];
  for (const [re, label] of GIT_FORBIDDEN) if (re.test(cmd)) deny(`forbidden git operation (${label}): ${cmd.slice(0, 120)}`);

  /* push destination hardening via the SHARED parser (same module the
     quality gate uses, so the two protections cannot diverge): forbidden
     options, leading + refspecs, deletion refspecs, protected destinations
     and - when no refspec is given - the configured upstream target. */
  if (/git\s+push\b/.test(cmd)) {
    const v = analyzePush(cmd, {
      currentBranch: () => currentBranch(),
      upstream: () => { try { return git("rev-parse --abbrev-ref --symbolic-full-name @{upstream}"); } catch (e) { return null; } },
    });
    if (v.length) deny("push target check: " + v.join("; "));
  }

  /* local main/master protection: never commit on, or move onto, the
     protected branches. Read-only inspection (show/log/diff) stays allowed. */
  const PROTECTED_MOVE = /git\s+(switch|checkout)\b[^\n]*(\s|=)(main|master|refs\/heads\/main|refs\/heads\/master)(\s|$)/;

  const MUTATION_SIGNALS =
    /(>>?\s*[^&|\s]|\btee\b|\bsed\s+-i\b|\bperl\s+-p?i\b|\brm\s|\bmv\s|\bcp\s|\btouch\s|\btruncate\b|\bnpm\s+(i|install|add|update)\b|\byarn\s+(add|install)\b|\bpnpm\s+(add|install)\b|\bpip3?\s+install\b|\bnode\s+-e\b|\bpython3?\s+-c\b|\bchmod\b|\bchown\b|\bln\s)/;
  const REPO_REF = /(public\/|server\.js|test\/|contracts\/|\.github\/|\.ai\/|\.claude\/|CLAUDE\.md|tools\/)/;
  const CONTROL_REF = /(\.claude\/|\.ai\/agents\/MARZI_PRINCIPAL_ENGINEER|\.ai\/ENGINEERING_OS_V3_2|CLAUDE\.md)/;
  const GIT_WRITE = /git\s+(add|commit|push|tag|stash|apply|am|mv|rm|cherry-pick|revert|switch|checkout)\b/;

  if (role.bash === "readonly") {
    if (MUTATION_SIGNALS.test(cmd) && REPO_REF.test(cmd)) deny("read-only role: shell mutation of repository paths");
    if (GIT_WRITE.test(cmd)) deny("read-only role: git write operations are not permitted");
    const READ_OK = /^\s*(cd\s+[^;&|]+\s*(;|&&)\s*)?(git\s+(status|diff|show|log|rev-parse|branch\s+--show-current|ls-files|ls-tree|shortlog|describe)\b|grep\b|rg\b|find\b(?![^\n]*(-delete|-exec))|cat\b|head\b|tail\b|wc\b|ls\b|pwd\b|echo\b|sha256sum\b|node\s+--check\b|node\s+test\/|node\s+\.claude\/validation\/|python3\s+tools\/validate_|claude\s+--version\b|node\s+\.claude\/hooks\/quality-gate\.mjs\b|mkdir\s+-p\s+\/tmp|df\b|du\b|sort\b|uniq\b|cut\b|diff\b)/;
    if (!READ_OK.test(cmd)) deny("read-only role: command is not on the read/audit allowlist: " + cmd.slice(0, 120));
    allow();
  }
  if (role.bash === "redteam") {
    if (GIT_WRITE.test(cmd)) {
      if (isRedTeamBaselineAlignment(cmd)) allow();  // narrow detached-worktree exception
      deny("red team may not perform git write operations (only `git switch|checkout --detach <full-40-hex-sha>` inside a clean linked worktree)");
    }
    if (MUTATION_SIGNALS.test(cmd) && REPO_REF.test(cmd)) deny("red team: file changes must use Edit/Write under test/**, not shell writes");
    allow();
  }
  if (role.bash === "implementer" || role.bash === "maintainer") {
    if (role.bash === "implementer" && MUTATION_SIGNALS.test(cmd) && CONTROL_REF.test(cmd))
      deny("control-plane mutation via shell is prohibited");
    if (role.bash === "maintainer" && MUTATION_SIGNALS.test(cmd) && REPO_REF.test(cmd))
      deny("os-maintainer: repository file changes must use Edit/Write, not shell writes");
    if (PROTECTED_MOVE.test(cmd)) deny("moving onto main/master is forbidden: " + cmd.slice(0, 120));
    if (/git\s+commit\b/.test(cmd)) {
      const br = currentBranch();
      if (br === "main" || br === "master") deny(`committing directly on '${br}' is forbidden`);
      if (role.bash === "maintainer" && br !== OS_BRANCH)
        deny(`os-maintainer may commit only on ${OS_BRANCH} (current branch: ${br || "detached/unknown"})`);
    }
    if (/git\s+push\b/.test(cmd) && role.bash === "maintainer") {
      const br = currentBranch();
      if (br !== OS_BRANCH) deny(`os-maintainer may push only ${OS_BRANCH} (current branch: ${br || "detached/unknown"})`);
    }
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

deny("unrecognized protected tool for role policy (fail closed): " + tool);
