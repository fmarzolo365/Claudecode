"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const EXIT = Object.freeze({
  OK: 0,
  VALIDATION: 1,
  USAGE: 2,
  UNAVAILABLE: 3,
  INTERNAL: 4
});

class ToolError extends Error {
  constructor(message, exitCode = EXIT.INTERNAL, details = undefined) {
    super(message);
    this.name = "ToolError";
    this.exitCode = exitCode;
    this.details = details;
  }
}

function assertSafeArgument(value, label = "argument") {
  if (typeof value !== "string" || value.length === 0) {
    throw new ToolError(label + " must be a non-empty string", EXIT.USAGE);
  }
  if (value.length > 4096) {
    throw new ToolError(label + " is too long", EXIT.USAGE);
  }
  const forbidden = [
    [";", "semicolon"],
    ["&&", "logical AND"],
    ["||", "logical OR"],
    ["|", "pipe"],
    [String.fromCharCode(96), "backtick"],
    ["$(", "command substitution"],
    ["\n", "newline"],
    ["\r", "carriage return"],
    ["\0", "NUL byte"]
  ];
  for (const pair of forbidden) {
    if (value.includes(pair[0])) {
      throw new ToolError(label + " contains forbidden " + pair[1] + " syntax", EXIT.USAGE);
    }
  }
  return value;
}

function assertSafeRef(value, label = "commit or ref") {
  assertSafeArgument(value, label);
  if (value.startsWith("-")) {
    throw new ToolError(label + " must not begin with an option prefix", EXIT.USAGE);
  }
  if (value.includes("..") || value.includes("@{") || value.endsWith(".lock")) {
    throw new ToolError(label + " contains an unsupported revision expression", EXIT.USAGE);
  }
  if (!/^[A-Za-z0-9][A-Za-z0-9._/@+~^/-]{0,199}$/.test(value)) {
    throw new ToolError(label + " contains unsupported characters", EXIT.USAGE);
  }
  return value;
}

function safeEnvironment(extra = {}) {
  const env = {
    ...process.env,
    ...extra,
    GIT_OPTIONAL_LOCKS: "0",
    GIT_PAGER: "cat",
    GIT_TERMINAL_PROMPT: "0",
    LANG: "C",
    LC_ALL: "C",
    NO_COLOR: "1",
    PAGER: "cat"
  };
  for (const key of [
    "BASH_ENV",
    "ENV",
    "GH_TOKEN",
    "GITHUB_TOKEN",
    "GIT_ASKPASS",
    "GIT_ALTERNATE_OBJECT_DIRECTORIES",
    "GIT_CEILING_DIRECTORIES",
    "GIT_CONFIG_COUNT",
    "GIT_CONFIG_PARAMETERS",
    "GIT_DIR",
    "GIT_EXTERNAL_DIFF",
    "GIT_INDEX_FILE",
    "GIT_NAMESPACE",
    "GIT_OBJECT_DIRECTORY",
    "GIT_PROXY_COMMAND",
    "GIT_SSH",
    "GIT_SSH_COMMAND",
    "GIT_WORK_TREE",
    "LD_LIBRARY_PATH",
    "LD_PRELOAD",
    "SSH_ASKPASS",
    "SSH_ASKPASS_REQUIRE"
  ]) {
    delete env[key];
  }
  for (const key of Object.keys(env)) {
    if (
      key.startsWith("DYLD_")
      || key.startsWith("GIT_CONFIG_KEY_")
      || key.startsWith("GIT_CONFIG_VALUE_")
    ) {
      delete env[key];
    }
  }
  return env;
}

function runFile(command, args, options = {}) {
  if (typeof command !== "string" || !Array.isArray(args)) {
    throw new ToolError("invalid direct-process invocation", EXIT.INTERNAL);
  }
  const timeout = options.timeout === undefined ? 30000 : options.timeout;
  const allowedExitCodes = options.allowedExitCodes || [0];
  const env = options.env || safeEnvironment();
  const maxBuffer = options.maxBuffer || 16 * 1024 * 1024;
  const result = spawnSync(command, args, {
    cwd: options.cwd,
    encoding: "utf8",
    shell: false,
    windowsHide: true,
    timeout,
    maxBuffer,
    env
  });
  if (result.error) {
    const code = result.error.code === "ENOENT" ? EXIT.UNAVAILABLE : EXIT.INTERNAL;
    throw new ToolError(command + " could not run: " + result.error.message, code);
  }
  const status = Number.isInteger(result.status) ? result.status : EXIT.INTERNAL;
  const response = {
    status,
    stdout: result.stdout || "",
    stderr: result.stderr || ""
  };
  if (!allowedExitCodes.includes(status)) {
    throw new ToolError(
      command + " exited with status " + status,
      EXIT.VALIDATION,
      response
    );
  }
  return response;
}

function git(repoRoot, args, options = {}) {
  return runFile("git", ["--no-optional-locks", "-C", repoRoot].concat(args), {
    cwd: repoRoot,
    ...options
  });
}

function resolveRepoRoot(start = process.cwd()) {
  const result = runFile("git", [
    "--no-optional-locks",
    "-C",
    start,
    "rev-parse",
    "--show-toplevel"
  ], {
    cwd: start,
    allowedExitCodes: [0]
  });
  const root = result.stdout.trim();
  if (!root) {
    throw new ToolError("Git returned an empty repository root", EXIT.VALIDATION);
  }
  return fs.realpathSync(root);
}

function splitNull(value) {
  return value.split("\0").filter((item) => item.length > 0);
}

function parseNameStatusZ(value) {
  const fields = splitNull(value);
  const entries = [];
  for (let index = 0; index < fields.length;) {
    const status = fields[index++];
    const pathOne = fields[index++];
    if (!status || !pathOne) {
      throw new ToolError("Git returned malformed name-status data", EXIT.INTERNAL);
    }
    if (status.startsWith("R") || status.startsWith("C")) {
      const pathTwo = fields[index++];
      if (!pathTwo) {
        throw new ToolError("Git returned an incomplete rename record", EXIT.INTERNAL);
      }
      entries.push({ status, from: pathOne, path: pathTwo });
    } else {
      entries.push({ status, path: pathOne });
    }
  }
  return entries;
}

function redactSensitiveText(value) {
  return String(value)
    .replace(/(https?:\/\/)[^/@\s]+@/gi, "$1***@")
    .replace(/([?&](?:access_token|auth|key|password|secret|token)=)[^&#\s]+/gi, "$1***")
    .replace(/(Authorization:\s*(?:Basic|Bearer)\s+)[^\s]+/gi, "$1***");
}

function isInside(root, candidate) {
  const relative = path.relative(root, candidate);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

function emitJson(value, stream = process.stdout) {
  stream.write(JSON.stringify(value, null, 2) + "\n");
}

function emitError(error, tool) {
  const normalized = error instanceof ToolError
    ? error
    : new ToolError(error && error.message ? error.message : String(error), EXIT.INTERNAL);
  emitJson({
    status: "FAIL",
    tool,
    error: normalized.message,
    details: normalized.details
      ? {
          exitStatus: normalized.details.status,
          stderr: redactSensitiveText(normalized.details.stderr || "").trim()
        }
      : null
  }, process.stderr);
  process.exitCode = normalized.exitCode;
}

function guardMain(tool, main) {
  Promise.resolve()
    .then(main)
    .catch((error) => emitError(error, tool));
}

module.exports = {
  EXIT,
  ToolError,
  assertSafeArgument,
  assertSafeRef,
  emitError,
  emitJson,
  git,
  guardMain,
  isInside,
  parseNameStatusZ,
  redactSensitiveText,
  resolveRepoRoot,
  runFile,
  safeEnvironment,
  splitNull
};
