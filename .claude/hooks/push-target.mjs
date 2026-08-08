#!/usr/bin/env node
/* MARZI Engineering OS V3.2 - shared push-target parser.
   SINGLE deterministic source of push-destination truth, imported by BOTH
   .claude/hooks/role-policy.mjs (PreToolUse) and .claude/hooks/quality-gate.mjs
   (@PUSH_TARGET_CHECK) so the two protections can never diverge.

   analyzePush() is pure: it takes the command string and a resolver object,
   and returns a list of violation strings ([] = allowed). All I/O (upstream
   lookup) is injected so the parser is directly unit-testable. */

const PROTECTED = new Set(["main", "master"]);

/* Forbidden option tokens. Long options may arrive as --opt=value. */
const FORBIDDEN_FLAGS = new Map([
  ["--force", "force push"],
  ["-f", "force push"],
  ["--force-with-lease", "force push (lease)"],
  ["--force-if-includes", "force push (if-includes)"],
  ["--no-verify", "gate bypass (--no-verify)"],
  ["--mirror", "mirror push"],
  ["--all", "push --all"],
  ["--delete", "push deletion"],
  ["-d", "push deletion"],
  ["--prune", "push --prune"],
]);

/* Options that consume the following token as their value, so that value is
   never mistaken for a remote or a refspec. */
const VALUE_OPTS = new Set([
  "-o", "--push-option", "--repo", "--receive-pack", "--exec",
  "--recurse-submodules", "--signed", "--force-with-lease",
]);

export function normalizeRef(ref) {
  return String(ref || "")
    .replace(/^refs\/heads\//, "")
    .replace(/^heads\//, "");
}

export function isProtectedRef(ref) {
  return PROTECTED.has(normalizeRef(ref));
}

/* Split a shell string into the git-push argument list. Returns null when the
   command is not a git push at all. Chained commands are split on ; && || |
   so that `x && git push origin main` is still analysed. */
export function extractPushInvocations(cmd) {
  const out = [];
  for (const seg of String(cmd || "").split(/(?:&&|\|\||[;|\n])/)) {
    const toks = seg.trim().split(/\s+/).filter(Boolean);
    const gi = toks.findIndex((t, i) => t === "git" && toks[i + 1] === "push");
    if (gi === -1) continue;
    out.push(toks.slice(gi + 2));
  }
  return out;
}

/* Parse `git push` arguments into { flags, remote, refspecs }. */
export function parsePushArgs(args) {
  const flags = [];
  const positional = [];
  let expectValue = false;
  for (const raw of args) {
    if (expectValue) { expectValue = false; continue; }
    if (raw === "--") continue;
    if (raw.startsWith("-")) {
      const bare = raw.includes("=") ? raw.slice(0, raw.indexOf("=")) : raw;
      flags.push(bare);
      if (VALUE_OPTS.has(bare) && !raw.includes("=")) expectValue = true;
      /* bundled short flags: -fu -> -f, -u */
      if (/^-[a-zA-Z]{2,}$/.test(raw)) for (const c of raw.slice(1)) flags.push("-" + c);
      continue;
    }
    positional.push(raw);
  }
  const remote = positional.length ? positional[0] : null;
  const refspecs = positional.slice(1);
  return { flags, remote, refspecs };
}

/* resolver: { upstream: () => "origin/main" | null, currentBranch: () => "x" }
   Both are optional; when absent the upstream inspection is skipped and a
   violation is recorded only if it can be proven. */
export function analyzePush(cmd, resolver = {}) {
  const violations = [];
  const invocations = extractPushInvocations(cmd);
  if (!invocations.length) return violations;

  for (const args of invocations) {
    const { flags, remote, refspecs } = parsePushArgs(args);

    for (const f of flags) {
      const label = FORBIDDEN_FLAGS.get(f);
      if (label) violations.push(`${label}: forbidden option ${f}`);
    }

    /* A remote positional that is itself a protected ref name is treated
       conservatively as a destination (`git push main`). */
    if (remote && !refspecs.length && isProtectedRef(remote) && !remote.includes(":"))
      violations.push(`push targeting main/master: ${remote}`);

    for (const spec of refspecs) {
      if (spec.startsWith("+")) { violations.push(`leading + refspec is a force push: ${spec}`); }
      const body = spec.replace(/^\+/, "");
      const ci = body.indexOf(":");
      if (ci >= 0) {
        const src = body.slice(0, ci);
        const dst = body.slice(ci + 1);
        if (src === "") violations.push(`deletion refspec: ${spec}`);
        if (dst === "") violations.push(`deletion refspec (empty destination): ${spec}`);
        if (isProtectedRef(dst)) violations.push(`push to main/master via refspec: ${spec}`);
      } else {
        if (isProtectedRef(body)) violations.push(`push targeting main/master: ${spec}`);
        if (body === "HEAD") {
          const cur = resolver.currentBranch ? resolver.currentBranch() : null;
          if (cur && isProtectedRef(cur)) violations.push(`HEAD resolves to protected branch ${cur}`);
        }
      }
    }

    /* No explicit refspec: the destination is decided by the configured
       upstream / push default, so it must be inspected explicitly. */
    if (!refspecs.length) {
      const up = resolver.upstream ? resolver.upstream() : null;
      if (up) {
        const dest = up.includes("/") ? up.slice(up.indexOf("/") + 1) : up;
        if (isProtectedRef(dest)) violations.push(`configured upstream destination is protected: ${up}`);
      } else {
        const cur = resolver.currentBranch ? resolver.currentBranch() : null;
        if (cur && isProtectedRef(cur)) violations.push(`implicit push from protected branch ${cur}`);
      }
    }
  }
  return violations;
}

export default { analyzePush, parsePushArgs, extractPushInvocations, normalizeRef, isProtectedRef };
