# MARZI-063 — Staging infrastructure and independent verification runbook

Provisioning, verification, deployment, smoke, production proof, rollback and
family handoff for the MARZI-062 staging preview. Nothing here may be used
against production.

## 1. Identities

| Field | Value |
|---|---|
| Staging service | `marzi-staging-r4a` |
| Staging Blueprint | `render.staging.yaml` |
| Branch | `claude/marzi-017-product-refinement` |
| Deploy commit (forward) | `d75a10bb96e83045090190777dda5c8a692bed55` |
| Rollback commit (first deploy only) | `e2e90925aa1b83ecaae4dbf0e39ccfade49546b1` |
| Visible build ID | `MARZI STAGING PREVIEW · MARZI-062 · BUILD MARZI-062-PREVIEW-1` |
| Protected main | `7395cd0a75fc206077e19ecc60e4c1e978dd2c89` |
| Production service | `telefontrainer` — **never a target of this runbook** |
| Production URL | `https://telefontrainer.onrender.com` — read-only observation only |
| Protected environment | `marzi-staging-r4a` (GitHub) |
| Workflow | `.github/workflows/marzi-063-independent-staging.yml` |
| Deploy script | `.github/scripts/marzi-063-render-staging.mjs` |

## 2. Gate A — authorization and baseline

1. Confirm MARZI-D026 to MARZI-D030 are recorded APPROVED in
   `docs/MARZI_DECISION_REGISTER.md`.
2. Confirm the branch is `claude/marzi-017-product-refinement` and the tree is
   clean.
3. Confirm `origin/main` is `7395cd0a75fc206077e19ecc60e4c1e978dd2c89`.
4. Record the production baseline **read-only**:
   - `sha256sum render.yaml`
   - production service name and URL as documented, without authenticating
   - the current production deployment identity, if it can be read without a
     production credential
5. Do not authenticate to production. Do not place a production credential in
   any CI job. If the production deployment identity cannot be read without one,
   record that limitation rather than acquiring the credential.

## 3. Gate B — control-plane review

Run locally, from the control checkout:

    node test/marzi-063-staging-infra-browser.js
    node --check test/independent/marzi-063/run.mjs
    node --check .github/scripts/marzi-063-render-staging.mjs
    node .ai/bin/docs-validate
    git diff --check d75a10bb96e83045090190777dda5c8a692bed55 HEAD

Confirm `render.yaml` is byte-identical to its baseline and that only the
thirteen allowed paths changed. Codex reviews this commit **before** any staging
action. Local output is a static check, not the independent verdict.

## 4. Gate C — independent verification

Trigger `MARZI-063 independent staging verification` with `run_deploy` **false**.

The verification job holds no secrets and no environment. It checks out the
control plane into `control/` and exactly `d75a10b` into `sut/`, installs the
pinned tooling only under `control/test/independent/marzi-063`, and runs every
gate. Required results, all of which must be read from the machine record and
not from any narrative:

| Gate | Required |
|---|---:|
| Application suite | 51/51 |
| Learning-contract suite | 36/36 |
| MARZI-061 suite | 30/30 |
| MARZI-062 package suite | 24/24 |
| Complete browser suite | 675/675 |
| MARZI-062 browser group | 107/107 |
| Conflict markers, syntax, both diff ranges | PASS |

A suite that exits zero after printing `SKIP` is a failure, not a pass. The
runner requires exit zero **and** no not-run marker **and** the exact summary
line **and** the exact total **and** the exact passed count **and** zero
failures, for every gate.

Then confirm the artifact: sixteen layout cases, eight state records, the
interaction set, and a `SHA256SUMS` that verifies.

## 5. Gate D — staging provisioning

1. In Render, create a **new Blueprint** from `render.staging.yaml`. Do not add
   the service to the production Blueprint and do not import production.
2. Confirm the created service:
   - name is exactly `marzi-staging-r4a`;
   - URL is distinct from and does not alias `https://telefontrainer.onrender.com`;
   - branch is `claude/marzi-017-product-refinement`;
   - **auto-deploy is disabled**;
   - no database, disk, custom domain, production environment group, or
     production deploy hook is attached.
3. Provision staging-only values by hand, in this service only:
   `ANTHROPIC_API_KEY`, `TTS_API_KEY`, `TRAINER_PIN`. A key production also uses
   is a production credential whatever name it is given here.
4. Store the service ID and a staging-scoped API key as
   `RENDER_STAGING_SERVICE_ID` and `RENDER_STAGING_API_KEY` in the **protected**
   `marzi-staging-r4a` GitHub Environment, which must require Product Owner or
   platform-owner approval.
5. Capture any existing successful staging deployment as the preferred rollback
   target. For a newly created service there is none, so
   `e2e90925aa1b83ecaae4dbf0e39ccfade49546b1` is the only permitted first-deploy
   rollback, and Render must be able to deploy it.
6. Keep family access closed until Gate G.

Prove the target before deploying anything:

    node .github/scripts/marzi-063-render-staging.mjs verify

## 6. Gate E — exact deployment

Re-run the workflow with `run_deploy` **true** and approve the protected
environment. The deploy job re-downloads the Gate C artifact, re-verifies its
hashes, re-reads every exact count, then:

    node .github/scripts/marzi-063-render-staging.mjs deploy
    node .github/scripts/marzi-063-render-staging.mjs status

The deploy payload names the full 40-character SHA. A deploy hook that merely
builds branch HEAD is insufficient and is not used. `status` fails unless Render
reports the deployment live **and** running exactly
`d75a10bb96e83045090190777dda5c8a692bed55`. Never deploy the MARZI-063 control
commit.

## 7. Gate F — post-deployment smoke

Against the recorded staging URL only:

- reject any redirect or canonical link to production; record the final URL and
  TLS origin;
- assert the exact visible build ID;
- assert no production hostname appears in an active request;
- check service-worker scope and that the cache updates;
- clear staging-origin state before each synthetic case;
- exercise one selected scenario, transcript open, translation, slow repeat,
  normal replay, timer and plan allowance;
- capture all six states;
- capture 390×844 and 320×568 at 100% and 200% text;
- capture Spanish, Arabic RTL and long German with `Krankschreibung`;
- upload results **even on failure**, then exit non-zero.

Use no real learner identity. Provider-dependent checks use only approved
staging credentials; if they are absent, do not fall back to production — mark
provider-dependent family readiness BLOCKED.

## 8. Gate G — production non-change and handoff

Prove, before and after:

- `origin/main` is still `7395cd0a75fc206077e19ecc60e4c1e978dd2c89`;
- `render.yaml` hash is unchanged;
- production service name, URL, deployment identity and public health match the
  Gate A capture;
- no production deploy event occurred during the window;
- no production credential entered any job;
- staging and production origins are distinct.

If production non-change cannot be proven, the final status is BLOCKED.

## 9. Rollback

Staging-only. It must never target production.

Trigger rollback when health fails, the deployed commit differs, staging
redirects to production, the build ID is absent or wrong, smoke fails
materially, the service worker leaves the preview stale or unusable, browser
errors or provider configuration create unsafe family exposure, or production
non-change evidence suggests a possible production effect.

    node .github/scripts/marzi-063-render-staging.mjs rollback

The script targets the prior successful staging deployment, or
`e2e90925aa1b83ecaae4dbf0e39ccfade49546b1` when the service has never deployed.
No other revision is reachable from it. After rollback, repeat health, build
identity, URL separation and production non-change checks, and record the
rollback ID, requested and observed revisions, result, timestamps, actor and
reason in `rollback-record.json`.

Do not delete any resource. Deletion needs a separate Product Owner and
infrastructure authorization.

## 10. Code rollback

    git revert <MARZI-063 control commit>

This removes the infrastructure and verification control plane. It does not
touch the application, which is unchanged by MARZI-063, and it does not delete
learner data or alter any entitlement.

## 11. Emergency stop

Stop immediately, deploy nothing, and preserve all evidence when:

- the resolved service is not exactly `marzi-staging-r4a`;
- the resolved URL matches or aliases production;
- the branch is not `claude/marzi-017-product-refinement`;
- auto-deploy is enabled;
- `main` moves from `7395cd0a75fc206077e19ecc60e4c1e978dd2c89`;
- `render.yaml` changes;
- a production credential would be required;
- the deployed commit is not the exact target SHA;
- a required artifact or exact count is missing;
- any suite reports SKIP;
- creating or operating the service would introduce a new fixed recurring
  charge — stop before it is incurred.

## 12. Privacy-safe evidence

Record only: URLs, build label, commit SHAs, deployment and service IDs,
viewport, device-pixel ratio, locale and direction, text-scale method and
measured computed font size, geometry, target dimensions, focus and state
results, timings, screenshot filenames and hashes, and command output.

Never record a name, email address, phone number, health detail, voice
recording, credential, token, account identifier, private conversation, or a
photograph of a person. All artifacts carry synthetic data only.
