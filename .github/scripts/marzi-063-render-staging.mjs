#!/usr/bin/env node
/* MARZI-063 — staging-only Render control script.
 *
 * This is deliberately NOT a generic deploy script. There is no service
 * argument, no environment argument, no URL argument, no branch argument and no
 * commit argument. Every target is an immutable constant below, reviewed in the
 * diff. A generic script with a service flag is exactly how a staging deploy
 * becomes a production deploy, so the flag does not exist.
 *
 * Commands (no other verb is accepted):
 *   verify    prove the target service is marzi-staging-r4a and not production
 *   deploy    deploy exactly DEPLOY_COMMIT to that service
 *   status    read back the deployment and prove the commit it actually ran
 *   rollback  return staging to the recorded prior deployment, or to
 *             ROLLBACK_COMMIT when the service has never deployed before
 *
 * Credentials come only from the protected marzi-staging-r4a GitHub
 * Environment, as RENDER_API_KEY and RENDER_STAGING_SERVICE_ID. Nothing is read
 * from a production environment group, and no production credential is ever
 * accepted: the script refuses any service whose name or URL matches or aliases
 * production, whatever key was used to reach it.
 */
"use strict";

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

/* ------------------------------------------------------------------ *
 * Immutable constants. Changing any of these is a reviewable diff.    *
 * ------------------------------------------------------------------ */
const EXPECTED_SERVICE_NAME = "marzi-staging-r4a";
const FORBIDDEN_SERVICE_NAME = "telefontrainer";
const FORBIDDEN_PRODUCTION_URL = "https://telefontrainer.onrender.com";
const FORBIDDEN_PRODUCTION_HOST = "telefontrainer.onrender.com";
const DEPLOY_COMMIT = "d75a10bb96e83045090190777dda5c8a692bed55";
const ROLLBACK_COMMIT = "e2e90925aa1b83ecaae4dbf0e39ccfade49546b1";
const PROTECTED_MAIN = "7395cd0a75fc206077e19ecc60e4c1e978dd2c89";
const ALLOWED_BRANCH = "claude/marzi-017-product-refinement";
const EXPECTED_ENVIRONMENT = "marzi-staging-r4a";
const API = "https://api.render.com/v1";

/* A commit that must never be deployed anywhere by this script. */
const FORBIDDEN_DEPLOY_TARGETS = new Set([PROTECTED_MAIN, "main", "HEAD", "refs/heads/main"]);

const OUT_DIR = process.env.MARZI063_ARTIFACT_DIR;

function fail(code, detail) {
  console.error("MARZI063_" + code + ": " + detail);
  process.exit(1);
}

/* Never let a token reach a log, an artifact, or an error message. */
function redact(text) {
  return String(text)
    .replace(/rnd_[A-Za-z0-9]+/g, "rnd_<redacted>")
    .replace(/Bearer\s+[A-Za-z0-9._-]+/gi, "Bearer <redacted>")
    .replace(/(api[_-]?key|token|secret|password)("?\s*[:=]\s*"?)[^"&\s,}]+/gi, "$1$2<redacted>");
}

function record(name, payload) {
  if (!OUT_DIR) return;
  const file = OUT_DIR + "/" + name;
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, JSON.stringify(payload, null, 1) + "\n");
  console.log("wrote " + name);
}

function requireEnv(key) {
  const v = process.env[key];
  if (!v || !v.trim()) fail("MISSING_STAGING_CREDENTIAL", key + " is not set. It must come from the protected " + EXPECTED_ENVIRONMENT + " environment.");
  return v.trim();
}

async function api(path, init = {}) {
  const key = requireEnv("RENDER_API_KEY");
  const res = await fetch(API + path, {
    ...init,
    headers: { Authorization: "Bearer " + key, "Content-Type": "application/json", Accept: "application/json", ...(init.headers || {}) }
  });
  const text = await res.text();
  let body = null;
  try { body = text ? JSON.parse(text) : null; } catch { body = { raw: text.slice(0, 400) }; }
  if (!res.ok) fail("RENDER_API_ERROR", res.status + " on " + path + " — " + redact(JSON.stringify(body).slice(0, 400)));
  return body;
}

/* ------------------------------------------------------------------ *
 * The gate every command passes through first.                        *
 * ------------------------------------------------------------------ */
async function resolveAndProveStaging() {
  const serviceId = requireEnv("RENDER_STAGING_SERVICE_ID");
  if (!/^srv-[A-Za-z0-9]+$/.test(serviceId)) {
    fail("SERVICE_ID_MALFORMED", "the staging service id is not a Render service id");
  }
  const svc = await api("/services/" + encodeURIComponent(serviceId));
  const name = svc && svc.name;
  const url = (svc && (svc.serviceDetails && svc.serviceDetails.url)) || "";
  const branch = (svc && svc.branch) || "";
  const autoDeploy = svc && svc.autoDeploy;

  /* Identity. Any one of these failing means we are not where we think. */
  if (name !== EXPECTED_SERVICE_NAME) {
    fail("SERVICE_NAME_MISMATCH", "resolved service is " + JSON.stringify(name) + ", expected " + EXPECTED_SERVICE_NAME);
  }
  if (String(name).toLowerCase().includes(FORBIDDEN_SERVICE_NAME)) {
    fail("PRODUCTION_SERVICE_REFUSED", "the resolved service name contains the production service name");
  }
  /* URL separation, including aliasing. */
  const host = (() => { try { return new URL(url).host; } catch { return ""; } })();
  if (!url || !host) fail("SERVICE_URL_UNKNOWN", "the service exposes no resolvable URL, so staging/production separation cannot be proven");
  if (url === FORBIDDEN_PRODUCTION_URL || host === FORBIDDEN_PRODUCTION_HOST || host.endsWith("." + FORBIDDEN_PRODUCTION_HOST)) {
    fail("PRODUCTION_URL_REFUSED", "the resolved staging URL matches or aliases production");
  }
  /* Branch and auto-deploy. main must not be able to reach staging. */
  if (branch !== ALLOWED_BRANCH) {
    fail("BRANCH_NOT_ALLOWED", "service branch is " + JSON.stringify(branch) + ", expected " + ALLOWED_BRANCH);
  }
  if (autoDeploy === "yes" || autoDeploy === true) {
    fail("AUTO_DEPLOY_ENABLED", "auto-deploy must be disabled on the staging service");
  }
  return { serviceId, name, url, host, branch, autoDeploy: String(autoDeploy) };
}

function refuseForbiddenCommit(commit, what) {
  if (FORBIDDEN_DEPLOY_TARGETS.has(commit)) fail("FORBIDDEN_DEPLOY_TARGET", what + " resolves to a protected production target");
  if (!/^[0-9a-f]{40}$/.test(commit)) fail("COMMIT_NOT_EXACT", what + " is not a full 40-character SHA");
}

async function latestDeploy(serviceId) {
  const list = await api("/services/" + encodeURIComponent(serviceId) + "/deploys?limit=20");
  const rows = Array.isArray(list) ? list.map((r) => r.deploy || r) : [];
  return rows.find((d) => d && d.status === "live") || rows[0] || null;
}

/* ------------------------------------------------------------------ *
 * Commands                                                            *
 * ------------------------------------------------------------------ */
async function cmdVerify() {
  const svc = await resolveAndProveStaging();
  const prior = await latestDeploy(svc.serviceId);
  record("staging-service.json", {
    checkedAt: new Date().toISOString(),
    serviceName: svc.name, serviceUrl: svc.url, branch: svc.branch, autoDeploy: svc.autoDeploy,
    productionServiceReferenced: false, productionUrlReferenced: false,
    priorSuccessfulDeployId: prior ? prior.id : null,
    priorSuccessfulCommit: prior && prior.commit ? prior.commit.id : null,
    permittedRollbackCommit: prior && prior.commit ? prior.commit.id : ROLLBACK_COMMIT,
    expectedDeployCommit: DEPLOY_COMMIT
  });
  console.log("staging service proven: " + svc.name + " at " + svc.url + " (branch " + svc.branch + ", autoDeploy " + svc.autoDeploy + ")");
}

async function cmdDeploy() {
  refuseForbiddenCommit(DEPLOY_COMMIT, "the forward deploy commit");
  const svc = await resolveAndProveStaging();
  const prior = await latestDeploy(svc.serviceId);
  const requestedAt = new Date().toISOString();
  /* An exact commit id, never a branch-HEAD deploy hook. */
  const deploy = await api("/services/" + encodeURIComponent(svc.serviceId) + "/deploys", {
    method: "POST",
    body: JSON.stringify({ commitId: DEPLOY_COMMIT, clearCache: "do_not_clear" })
  });
  record("deploy-record.json", {
    requestedAt, finishedAt: null,
    serviceName: svc.name, serviceUrl: svc.url,
    deployId: deploy ? deploy.id : null,
    requestedCommit: DEPLOY_COMMIT,
    observedCommit: deploy && deploy.commit ? deploy.commit.id : null,
    status: deploy ? deploy.status : null,
    priorDeployId: prior ? prior.id : null,
    priorCommit: prior && prior.commit ? prior.commit.id : null
  });
  if (!deploy || !deploy.id) fail("DEPLOY_NOT_CREATED", "Render returned no deployment id");
  console.log("deploy requested: " + deploy.id + " -> " + DEPLOY_COMMIT);
}

async function cmdStatus() {
  const svc = await resolveAndProveStaging();
  const deploy = await latestDeploy(svc.serviceId);
  if (!deploy) fail("NO_DEPLOY_FOUND", "the staging service reports no deployment");
  const observed = deploy.commit ? deploy.commit.id : null;
  record("deploy-status.json", {
    checkedAt: new Date().toISOString(),
    serviceName: svc.name, serviceUrl: svc.url,
    deployId: deploy.id, status: deploy.status,
    requestedCommit: DEPLOY_COMMIT, observedCommit: observed,
    commitMatches: observed === DEPLOY_COMMIT
  });
  if (deploy.status !== "live") fail("DEPLOY_NOT_LIVE", "deployment status is " + deploy.status);
  if (observed !== DEPLOY_COMMIT) {
    fail("DEPLOYED_COMMIT_MISMATCH", "staging is running " + observed + ", expected " + DEPLOY_COMMIT);
  }
  console.log("staging is live on the exact target commit " + DEPLOY_COMMIT);
}

async function cmdRollback() {
  const svc = await resolveAndProveStaging();
  const prior = await latestDeploy(svc.serviceId);
  /* Preferred: the exact prior successful staging deployment. For a service
     that has never deployed, the implementation parent is the ONLY permitted
     code rollback. Nothing else is reachable from this script. */
  const target = prior && prior.commit && prior.commit.id && prior.commit.id !== DEPLOY_COMMIT
    ? prior.commit.id
    : ROLLBACK_COMMIT;
  refuseForbiddenCommit(target, "the rollback commit");
  if (target !== ROLLBACK_COMMIT && target !== (prior && prior.commit && prior.commit.id)) {
    fail("ROLLBACK_TARGET_NOT_PERMITTED", "rollback may only target the prior staging deployment or " + ROLLBACK_COMMIT);
  }
  const requestedAt = new Date().toISOString();
  const deploy = await api("/services/" + encodeURIComponent(svc.serviceId) + "/deploys", {
    method: "POST",
    body: JSON.stringify({ commitId: target, clearCache: "do_not_clear" })
  });
  record("rollback-record.json", {
    requestedAt, actor: process.env.GITHUB_ACTOR || "unknown",
    reason: process.env.MARZI063_ROLLBACK_REASON || "not stated",
    serviceName: svc.name, serviceUrl: svc.url,
    requestedRevision: target,
    priorDeployId: prior ? prior.id : null,
    rollbackDeployId: deploy ? deploy.id : null,
    observedRevision: deploy && deploy.commit ? deploy.commit.id : null,
    productionTouched: false
  });
  console.log("staging rollback requested to " + target);
}

const COMMANDS = { verify: cmdVerify, deploy: cmdDeploy, status: cmdStatus, rollback: cmdRollback };
const verb = process.argv[2];
if (!Object.prototype.hasOwnProperty.call(COMMANDS, verb)) {
  fail("UNKNOWN_COMMAND", "expected one of " + Object.keys(COMMANDS).join(", ") + "; there is deliberately no service, url, branch or commit argument");
}
COMMANDS[verb]().catch((e) => fail("UNEXPECTED", redact(e && e.message ? e.message : String(e))));
