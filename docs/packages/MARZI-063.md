# MARZI-063 — Staging Infrastructure and Independent Browser Verification

## 1. Package identity

- Package ID: MARZI-063
- Canonical title: Staging Infrastructure and Independent Browser Verification
- Roadmap category: Environment, verification and release control
- Status: **CONTROL PLANE IMPLEMENTED — staging provisioning, deployment and independent execution BLOCKED**, see section 29
- Specification owner: Codex
- Implementation owner: Claude Code
- Product owner: Marzi Product Owner
- Independent reviewer: Codex, plus an isolated CI runner that did not implement MARZI-062
- Target branch: `claude/marzi-017-product-refinement`
- Approved base commit: `a83422bedaeb7f0ae3a414c138a41e093b2238cf`
- Revision under test: `d75a10bb96e83045090190777dda5c8a692bed55`
- Its implementation parent and permitted first rollback: `e2e90925aa1b83ecaae4dbf0e39ccfade49546b1`
- Protected main: `7395cd0a75fc206077e19ecc60e4c1e978dd2c89`
- Package version: v1 / 2026-08-05
- Supersedes: nothing. It completes no other package and does not merge MARZI-062.

## 2. Objective

A staging service unmistakably separated from production, a pinned and
reproducible independent Chromium verification environment, and a gated path
that deploys exactly `d75a10bb96e83045090190777dda5c8a692bed55` to that service
only after every independent gate has passed — with downloadable evidence a
reviewer can re-check.

## 3. User problem

MARZI-062 is implemented and pushed but has nowhere to run and no verification
from anyone other than the agent that wrote it. Two specific failure modes made
that dangerous:

1. The repository documented exactly one deployment convention — a single
   production Render service — so any deploy attempt would have been aimed at
   production or at an assumed argument.
2. `test/browser/run.js` prints `SKIP no playwright available` and **exits
   zero** when Chromium is missing. A green pipeline could therefore mean the
   browser gate never ran at all.

## 4. Current evidence

| Evidence ID | Source | Observation | Classification | Reproduction |
|---|---|---|---|---|
| E-01 | `render.yaml`, `README.md`, repository search | One Render service, `telefontrainer`, production, auto-deployed from `main`; no staging service declared | environment limitation | `grep -rn marzi-staging-r4a` returns only mandate and MARZI-062/063 documents |
| E-02 | `test/browser/run.js` lines 11–22 at `d75a10b` | Prints `SKIP` and calls `process.exit(0)` when Playwright or Chromium is unavailable | verification hazard | run the suite without Chromium |
| E-03 | repository root | No `package-lock.json`, `npm-shrinkwrap.json` or `yarn.lock` exists | measured baseline fact | `ls package-lock.json` |
| E-04 | `.github/workflows/` | Only `ci.yml` exists | measured baseline fact | directory listing |
| E-05 | this environment | `api.render.com:443` refused by the network policy — gateway answered 403 to CONNECT | environment limitation | `curl -sS "$HTTPS_PROXY/__agentproxy/status"` |
| E-06 | this environment | `telefontrainer.onrender.com:443` refused by the same policy | environment limitation | as above |
| E-07 | this environment | No Render credential, API key, service ID or deployment CLI exists | environment limitation | `env`, `command -v render` |
| E-08 | `git rev-parse` | `d75a10b` is a single-parent successor of `e2e9092`; `origin/main` is the protected SHA; tree clean | confirmed baseline | `git rev-list --parents -n 1 d75a10b` |

E-03 is recorded deliberately. The dedicated lockfile this package adds is
**newly generated**; it is not a pre-existing artifact and must never be
described as one.

## 5. In scope

- A staging-only Render Blueprint declaring exactly one service.
- A two-checkout GitHub Actions workflow: a secret-free verification job and a
  separate deployment job behind a protected environment.
- A staging-specific deploy script with no generic target argument.
- A pinned independent runner with its own dedicated lockfile.
- A dependency-free package validator.
- Roadmap allocation, Product Owner decisions, runbook and review handoff.

Anything not listed is out of scope.

## 6. Explicitly out of scope

- Any application change. The revision under test is not modified.
- Any production change: `render.yaml`, the `telefontrainer` service, production
  environment, domains, deploy hooks, credentials, disks, databases, logs.
- `main`, tags, releases, pull requests, merges, production deployments.
- Every provider, prompt, session, transcript-domain, persistence, learning,
  mastery, reward, plan, entitlement, economy, privacy, analytics and
  learner-data contract.
- Adding a database, or any runtime dependency.
- Weakening a MARZI-062 assertion to make an independent run pass. A failed
  visual or interaction criterion is an application finding.

## 7. Frozen contracts

| Contract | Authority | Required preservation | Verification |
|---|---|---|---|
| Production Blueprint | `render.yaml` | byte-for-byte | `M063-013` SHA-256 `f710e1c0d1b1aab517da73aa355bf8e535240fe0edc8c9357acdcbc193c6dbab` |
| Production service identity | `telefontrainer`, `https://telefontrainer.onrender.com` | never a target | `M063-014`, `M063-015` |
| Protected main | `7395cd0a75fc206077e19ecc60e4c1e978dd2c89` | unmoved, never deployable | `M063-015`, runner `MAIN_MOVED` |
| Revision under test | `d75a10b` | byte-for-byte, never modified | runner `SUT_HEAD_MISMATCH`, `SUT_DIRTY` |
| Application runtime | `public/**`, `server.js` | unchanged | empty diff |
| MARZI-062 suites | `test/run.js`, `test/browser/run.js`, `test/marzi-062-visual-staging.js` | unchanged | empty diff, prohibited-file list |
| MARZI-021 / MARZI-061 contracts | `docs/learning/**` | unchanged | empty diff |
| No runtime dependency | root `package.json` | no `dependencies` key gains entries | `M063-008` |

## 8. Product decisions already approved

Recorded in `docs/MARZI_DECISION_REGISTER.md`, approved 2026-08-05.

| Decision | Outcome |
|---|---|
| MARZI-D026 | Allocate MARZI-063 for staging infrastructure and independent browser verification |
| MARZI-D027 | Create `marzi-staging-r4a` from a separate Blueprint within existing included allowances; a new fixed recurring charge stops the package |
| MARZI-D028 | Staging-only credentials, no production reuse under any variable name |
| MARZI-D029 | Dedicated pinned tooling tree with a newly generated lockfile; 30-day artifact retention |
| MARZI-D030 | Expose the staging URL to family reviewers only after every gate is proven |

## 9. Product decisions still required

| Question | Owner | Blocks |
|---|---|---|
| Who provisions the Render staging service and the protected GitHub Environment, given that this environment has no Render credential and no network path to `api.render.com`? | Product Owner with the platform owner | Gates D, E, F |
| Is a budget-limited staging provider credential funded, or does the preview run without provider access? | Product Owner | provider-dependent family readiness |

## 10. Asset requirements

None. No artwork, icon, or generated asset is created or referenced.

## 11. Architecture

Two planes, deliberately unequal in power.

- **Control plane** — this commit. Infrastructure declarations, workflow, deploy
  script, pinned tooling, validator, documentation. It changes no application
  file and is never the revision deployed to staging.
- **Source under test** — exactly `d75a10b`, checked out into a separate
  directory, never written to, never given a dependency. Dependency direction is
  one-way: control reads and drives sut; sut knows nothing about control.

Failure boundaries: the verification job cannot deploy because it holds no
credential and declares no environment. The deployment job cannot run
unverified because it depends on the verification job, re-downloads its
artifact, re-verifies the hashes and re-reads every count. The deploy script
cannot reach production because the service name, URL, branch, auto-deploy
state and commit are all constants it proves before acting.

## 12. State ownership

| State | Owner | Readers | Writers | Persistence |
|---|---|---|---|---|
| Revision under test | the constant `d75a10b…` in workflow and runner | both jobs | nobody | none |
| Staging service ID and API key | protected `marzi-staging-r4a` GitHub Environment | deploy job only | platform owner | GitHub secret |
| Staging provider credentials | the Render staging service only | staging runtime | platform owner | Render service env |
| Evidence artifacts | CI artifact store | reviewers | verification job | 30 days |

No learner data exists in any of these. The application stores learner data in
origin-scoped `localStorage`; the distinct staging origin is the isolation
boundary and nothing is copied from production.

## 13. Data/storage changes

None. No schema, no key, no migration, no database. The service worker and
manifest are untouched by this package.

## 14. Migration strategy

No data migration. The only authority migration is deployment: staging becomes a
second, separate Render service. Downgrade is symmetric — revert the control
commit and the infrastructure declaration disappears; the staging service is
deleted only under a separate authorization.

## 15. Accessibility

Measured, never certified. The independent matrix measures 390×844 and 320×568
at 100 % and 200 % text across four content profiles, plus six conversation
states and the interaction set, and records focus visibility, focus order,
keyboard activation, live-region text, control naming and reduced motion.

**No WCAG conformance, accessibility approval, or assistive-technology
validation is claimed.** Section 10 of the mandate is explicit that numeric
zeroes are necessary but not sufficient: a human reviewer must judge the
320×568 / 200 % cases and may return CHANGES REQUIRED for a genuine defect.

## 16. Localization/RTL

No localized string is added, removed or altered. German is the taught target
language rather than one of the six interface locales, so the German content
profiles exercise German content strings with an interface locale, and that is
stated in every visual record rather than left implicit. `Krankschreibung` is
exercised in its canonical `empfang` context.

## 17. Responsive requirements

390×844 and 320×568, portrait, at 100 % and 200 % text. Required invariants per
case: `horizontalOverflowPx = 0`, `pageScrollX = 0`, `pageScrollY = 0`,
`criticalBoxesOutsideViewport = 0`, `visibleTargetsBelow48By48 = 0`,
`marziFaceOverlapCount = 0`, `browserErrorCount = 0`, plus the named qualitative
judgements.

## 18. Performance budget

| Metric | Baseline | Target | Evidence |
|---|---|---|---|
| Application runtime dependencies | 0 | 0 | root `package.json` unchanged |
| Runtime files changed | 0 | 0 | empty diff |
| Verification tooling packages | 0 | 1 (`playwright-core`) | dedicated lockfile |
| CI cost | 0 | included allowances only | MARZI-D027 |

## 19. Security/privacy

- The verification job receives **no secret of any kind** and declares no
  environment; workflow-level permissions default to `{}`.
- Deployment credentials exist only in the protected `marzi-staging-r4a`
  environment and are never referenced by the verification job.
- A provider key that production also uses is a production credential whatever
  variable name it is given, and is prohibited in staging.
- Browser verification runs against `localhost` with every API route stubbed; no
  paid or production service is called.
- The runner redacts credential-shaped text from every log and artifact.
- Artifacts carry synthetic identities and synthetic conversation content only.
- The package may observe the production URL read-only; it must never
  authenticate to, mutate, restart, redeploy or reconfigure production.

## 20. Files permitted to change

- `docs/MARZI_MASTER_ROADMAP.md`
- `docs/MARZI_DECISION_REGISTER.md`
- `docs/packages/MARZI-063.md`
- `docs/staging/MARZI-063_STAGING_INFRA_BROWSER_RUNBOOK.md`
- `docs/staging/MARZI-063_INDEPENDENT_REVIEW_HANDOFF.md`
- `.github/workflows/marzi-063-independent-staging.yml`
- `.github/scripts/marzi-063-render-staging.mjs`
- `render.staging.yaml`
- `test/independent/marzi-063/package.json`
- `test/independent/marzi-063/package-lock.json`
- `test/independent/marzi-063/run.mjs`
- `test/marzi-063-staging-infra-browser.js`
- `.ai/bin/docs-validate`

## 21. Files forbidden to change

`render.yaml` · `.github/workflows/ci.yml` · root `package.json` ·
`public/index.html` · `public/sw.js` · `public/manifest.webmanifest` ·
`public/icons` and every brand asset · `server.js` · `test/run.js` ·
`test/browser/run.js` · `test/learning-contracts.js` ·
`test/marzi-061-external-review-readiness.js` ·
`test/marzi-062-visual-staging.js` · every MARZI-062 staging and family-feedback
document except for links · every provider, prompt, session, transcript-domain,
persistence, learning, mastery, reward, plan, entitlement, economy, privacy,
analytics and learner-data contract · production service configuration,
environment groups, deploy hooks, credentials, domains, disks, databases and
logs · `main`, tags, releases, production deployments, PR creation and merges.

## 22. Implementation sequence

1. Verify branch, mandate, exact objects, clean tree, protected main.
2. Record the Product Owner decisions.
3. Implement the thirteen allowed paths.
4. Run the local static gates. **This is not the independent verdict.**
5. One isolated control-plane commit; one push.
6. Codex reviews the control-plane diff.
7. Trigger the secret-free verification job; collect the artifact.
8. Provision the staging service; approve the protected environment.
9. Deploy the exact target commit; smoke; prove production non-change.
10. **Stop at any gate whose prerequisite is unavailable.**

## 23. Automated tests

| Test ID | Layer | Behavior proven | Failure signal | Command |
|---|---|---|---|---|
| T-01 | contract | 21 staging-separation and workflow-safety contracts | `MARZI063_*` | `node test/marzi-063-staging-infra-browser.js` |
| T-02 | orchestration | exact-count enforcement, SKIP rejection, artifact completeness | `BLOCKED …` | `node test/independent/marzi-063/run.mjs` |
| T-03 | syntax | every new JavaScript file parses | non-zero exit | `node --check` |
| T-04 | hygiene | no whitespace damage in either diff range | non-zero exit | `git diff --check` |
| T-05 | documentation | no new documentation-validator failure | new failure line | `.ai/bin/docs-validate` |

## 24. Rendered-browser matrix

Sixteen cases: {390×844, 320×568} × {100 %, 200 %} × {German, Spanish, Arabic
RTL, long German with `Krankschreibung`}. Each preserves a viewport screenshot,
a full-page screenshot, geometry JSON, an accessibility snapshot, console and
page-error logs, and one result record. Text-scale method: every absolute type
token doubled plus `html{font-size:200%}`, with the measured computed font size
recorded.

Plus six conversation states at 390×844 / 100 %, error and disconnected repeated
at 320×568 / 200 %, and the interaction set in German and Arabic.

## 25. Real-device matrix

None in this package. Emulated Chromium is not a device. Device qualification
belongs to MARZI-050 and the family study.

## 26. Regression requirements

The revision under test is unchanged, so there is nothing to regress in the
application. The package's own regressions are covered by T-01 through T-05, and
by the runner refusing to accept a suite that did not actually run.

## 27. Rollback strategy

Code: `git revert <MARZI-063 control commit>`. No data migration, no learner data
deleted, no entitlement changed, no application file affected.

Staging: `node .github/scripts/marzi-063-render-staging.mjs rollback`, which can
only target the prior successful staging deployment or
`e2e90925aa1b83ecaae4dbf0e39ccfade49546b1`. Never production, never a deletion.

## 28. Evidence required

Independent run ID and URL; action SHAs and image digest; Node, npm, Playwright
and Chromium versions with executable and lockfile hashes; the exact suite table
with report paths and hashes; sixteen visual cases with screenshot hashes and a
qualitative verdict; eight state records; the interaction set; the hashed
artifact manifest; the Render deployment ID with requested and observed commit;
smoke results; and production non-change evidence before and after.

## 29. Stop conditions

The control plane is complete. **Gates C, D, E and F are blocked in this
environment**, on measured grounds rather than assumption:

1. **No Render access.** `api.render.com:443` is refused by the network policy —
   the agent proxy returns `connect_rejected … gateway answered 403 to CONNECT`.
   No Render API key, service ID, or deployment CLI exists here. The staging
   service therefore cannot be created, configured, deployed to, or queried.
2. **No protected environment.** The `marzi-staging-r4a` GitHub Environment and
   its secrets must be created in repository settings by the platform owner.
   Nothing in this session can create them, so the deployment job cannot run.
3. **Independence cannot be self-certified.** The mandate is explicit that a
   local run is not independent merely because it is another process. Gate C
   requires the isolated CI runner; local static output is recorded as static
   output and nothing more.
4. **Production non-change cannot be fully measured.** `origin/main` and the
   `render.yaml` hash are provable here, but the production URL is also refused
   by the network policy, so public health evidence cannot be captured.

Per §18 of the mandate, an unavailable staging service, distinct staging URL,
exact-commit deployment, protected-environment approval, or production
non-change evidence is BLOCKED. It is never downgraded because an earlier report
claimed a pass.

## 30. Definition of done

MARZI-063 is done when: the control plane is reviewed and accepted; the
independent runner obtains 51/51, 36/36, 30/30, 24/24, 675/675 and 107/107 with
no SKIP and every exact summary present; sixteen visual cases, eight states and
the interaction set are complete and pass both automated and qualitative review;
the artifact is hashed, downloadable and free of secrets; the staging service is
proven distinct; Render reports `d75a10bb96e83045090190777dda5c8a692bed55` as
the deployed commit; smoke passes; rollback is ready; production and `main` are
proven unchanged; and the Product Owner approves family exposure.

## 31. Independent review handoff

See `docs/staging/MARZI-063_INDEPENDENT_REVIEW_HANDOFF.md`. Codex reviews the
control-plane diff before any staging action; the isolated runner produces the
Gate C evidence; the Product Owner alone authorizes provisioning, spend and
family exposure. No independent approval here authorizes merge or production
release.
