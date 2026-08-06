# MARZI-063 — Staging Infrastructure and Independent Browser Verification

## Definitive Claude Code implementation mandate

Status: DRAFT — PRODUCT OWNER DECISION REQUIRED BEFORE IMPLEMENTATION OR INFRASTRUCTURE CREATION

Package ID: MARZI-063

Implementation owner: Claude Code, after explicit Product Owner authorization

Independent technical reviewer: Codex

Independent execution authority: an isolated CI browser runner that did not participate in the MARZI-062 implementation

Product authority: Product Owner

Target development branch: claude/marzi-017-product-refinement

MARZI-062 implementation commit under test and staging deployment:

    d75a10bb96e83045090190777dda5c8a692bed55

Implementation parent and permitted staging rollback revision:

    e2e90925aa1b83ecaae4dbf0e39ccfade49546b1

Protected production main:

    7395cd0a75fc206077e19ecc60e4c1e978dd2c89

Production service and URL, which this package must not modify:

    telefontrainer
    https://telefontrainer.onrender.com

Required new staging service identity:

    marzi-staging-r4a

Required visible application build identity:

    MARZI STAGING PREVIEW · MARZI-062 · BUILD MARZI-062-PREVIEW-1

## 1. Package-ID resolution

The canonical roadmap currently ends at MARZI-062 and allocates every package ID through MARZI-062. The package inventory contains no MARZI-063 package or mandate. MARZI-063 is therefore the next sequential, non-conflicting package ID.

This allocation extends the currently recorded roadmap range. It is not silently approved by this mandate. Before implementation, the Product Owner must approve:

1. allocation of MARZI-063 for the purpose defined here;
2. creation and possible cost of an independent Render staging service;
3. the staging-only credential and provider-cost policy;
4. the independent CI dependency and artifact-retention policy;
5. exposure of the validated staging URL to family reviewers.

Until those decisions are recorded, package status is BLOCKED.

## 2. Repository facts this mandate preserves

The mandate was designed from the synchronized local repository at d75a10bb96e83045090190777dda5c8a692bed55. The following facts are authoritative inputs:

- the current branch and its origin remote-tracking ref both point to d75a10bb96e83045090190777dda5c8a692bed55;
- the working tree was clean at mandate design time;
- d75a10bb96e83045090190777dda5c8a692bed55 is a single-parent successor of e2e90925aa1b83ecaae4dbf0e39ccfade49546b1;
- origin/main points to 7395cd0a75fc206077e19ecc60e4c1e978dd2c89;
- production is documented as one Render web service, telefontrainer, auto-deployed from main;
- render.yaml exists, but the repository does not define an independently safe marzi-staging-r4a service;
- the only existing GitHub workflow is the normal CI workflow;
- the repository has no npm lockfile;
- Playwright and Chromium are test-only requirements and are not repository runtime dependencies;
- the existing browser runner can print SKIP and exit successfully when Playwright or Chromium is unavailable;
- the exact MARZI-062 browser group exists at d75a10b, but its original implementation-run results are not independent evidence.

The missing lockfile is a measured baseline fact. Claude Code must not describe a new lockfile as pre-existing.

## 3. Objective

Implement one bounded infrastructure-and-verification package that:

1. defines a real staging service unmistakably separated from production;
2. creates a reproducible independent Chromium and Playwright verification environment;
3. checks out and tests the exact MARZI-062 implementation commit, not the later MARZI-063 control commit;
4. preserves downloadable screenshots and machine-readable reports;
5. permits deployment of exactly d75a10bb96e83045090190777dda5c8a692bed55 to staging only after all independent gates pass;
6. validates the deployed staging URL;
7. proves that production main, production configuration, and the production service remained unchanged;
8. provides the validated staging URL and evidence handoff for Product Owner and family feedback.

This package establishes infrastructure and independent evidence. It does not merge MARZI-062, approve production release, change the application, or manufacture family feedback.

## 4. Authority and separation of duties

Claude Code may implement the bounded repository files only after Product Owner approval. Claude Code may run local static checks, but its local output is not the independent browser verdict.

The independent CI job must:

- run on infrastructure isolated from the original Claude Code implementation environment;
- start from a fresh workspace;
- check out the exact target object by full SHA;
- install only the approved pinned verification dependencies;
- receive no production secrets;
- produce a deterministic non-zero exit for every missing dependency, SKIP, count mismatch, assertion failure, browser error, missing artifact, or checkout mismatch;
- upload its own evidence.

Codex independently reviews the MARZI-063 implementation diff, workflow safety, infrastructure separation, exact-SHA controls, test output, visual evidence, artifact manifest, staging result, and production non-change evidence.

The Product Owner alone authorizes staging-service creation, staging provider expenditure, family exposure, and the final family-feedback preview.

No implementation report, Claude Code statement, local screenshot, or prior MARZI-062 assertion count can substitute for the independent runner.

## 5. Exact allowed files

Only the following repository paths may be added or changed:

1. docs/MARZI_MASTER_ROADMAP.md
   - allocate MARZI-063 exactly once;
   - state that it extends the prior MARZI-020 through MARZI-062 range;
   - record prerequisites, Product Owner gate, and dependency on MARZI-062.

2. docs/MARZI_DECISION_REGISTER.md
   - only the Product Owner decisions listed in section 1;
   - no decision may be marked approved without an explicit recorded approval.

3. docs/packages/MARZI-063.md
   - authoritative package specification and implementation report.

4. docs/staging/MARZI-063_STAGING_INFRA_BROWSER_RUNBOOK.md
   - provisioning, verification, deploy, smoke-test, production-proof, rollback, and family-handoff procedure.

5. docs/staging/MARZI-063_INDEPENDENT_REVIEW_HANDOFF.md
   - artifact inventory, download instructions, reviewer checklist, and final-status template.

6. .github/workflows/marzi-063-independent-staging.yml
   - independent verification and gated staging deployment workflow only.

7. .github/scripts/marzi-063-render-staging.mjs
   - staging-only service validation, exact-commit deploy, deploy-status capture, and staging-only rollback.

8. render.staging.yaml
   - a new staging-only Render Blueprint or equivalent staging declaration;
   - it must never be linked to the existing production Blueprint.

9. test/independent/marzi-063/package.json
   - test-tool dependencies only, with exact versions and private true.

10. test/independent/marzi-063/package-lock.json
    - a newly generated dedicated lockfile for the independent tooling;
    - it must be generated by the pinned Node and npm toolchain and reviewed for unexpected packages.

11. test/independent/marzi-063/run.mjs
    - independent orchestration, exact-count enforcement, browser evidence, artifact manifest, and deterministic exit.

12. test/marzi-063-staging-infra-browser.js
    - dependency-free package validator for staging separation and workflow safety.

13. .ai/bin/docs-validate
    - only the smallest range or uniqueness update necessary for the recorded MARZI-063 roadmap allocation.

No other path is in scope. If the actual Render integration cannot be safely expressed with render.staging.yaml, stop with BLOCKED and request a new narrowly scoped infrastructure decision. Do not move the staging service into production render.yaml as a workaround.

## 6. Prohibited files and changes

The following are explicitly prohibited:

- render.yaml;
- .github/workflows/ci.yml;
- package.json at repository root;
- public/index.html;
- public/sw.js;
- public/manifest.webmanifest;
- public/icons and every other icon or brand asset;
- server.js;
- test/run.js;
- test/browser/run.js;
- test/learning-contracts.js;
- test/marzi-061-external-review-readiness.js;
- test/marzi-062-visual-staging.js;
- every MARZI-062 staging and family-feedback document except for links from the new MARZI-063 documents;
- every provider, prompt, session, transcript-domain, persistence, learning, mastery, reward, plan, entitlement, economy, privacy, analytics, or learner-data contract;
- production service configuration, production environment groups, production deploy hooks, production credentials, production domains, production disks, production databases, and production logs;
- main, tags, releases, production deployments, PR creation, and merges.

Do not add a database. The application stores learner data in origin-scoped localStorage. The separate staging origin is the isolation boundary; no learner data is copied from production.

Do not add runtime dependencies. The dedicated independent-runner dependency tree must stay below test/independent/marzi-063 and must never be installed into the exact d75a10b source-under-test directory.

Do not alter MARZI-062 assertions to make the independent run pass. A failed visual or interaction criterion is an application finding and ends in CHANGES REQUIRED.

## 7. Required implementation shape

The MARZI-063 implementation commit is a control-plane commit. It contains only the allowed infrastructure, workflow, test-tooling, and documentation changes. It is not the application revision deployed to staging.

The workflow must create two separate checkout roots:

    control/
      the reviewed MARZI-063 control-plane commit

    sut/
      exactly d75a10bb96e83045090190777dda5c8a692bed55

All existing MARZI-062 application and browser suites run from sut. The new independent artifact driver runs from control and targets the local server launched from sut. Tool dependencies are installed only under control/test/independent/marzi-063.

Before any test, the workflow must prove:

- sut HEAD equals the full target SHA;
- sut HEAD has exactly parent e2e90925aa1b83ecaae4dbf0e39ccfade49546b1;
- sut HEAD is not a merge;
- the source tree is clean;
- origin/main still resolves to protected SHA 7395cd0a75fc206077e19ecc60e4c1e978dd2c89;
- the eleven-file MARZI-062 name-status list matches the committed package report;
- control and sut are different directories;
- no test dependency exists inside sut;
- all artifact output paths resolve below the CI temporary or artifact directory.

Any mismatch is BLOCKED, not a warning.

## 8. Independent CI and browser design

### 8.1 Trigger and permissions

The workflow must use workflow_dispatch and an optional non-secret repository event used only for verification. It must not use pull_request_target.

The target application SHA is a literal constant in the workflow and runner. It is not a user-supplied input.

The verification job permissions must be:

    contents: read
    actions: read

All other permissions are none unless GitHub requires a narrower explicit read permission. The verification job receives no environment and no secrets.

The deployment job must be separate, depend on the completed verification job, download and validate the signed or hashed artifact manifest, and use the protected GitHub Environment marzi-staging-r4a. That environment must require Product Owner or designated platform-owner approval.

The workflow must use a concurrency group specific to MARZI-063 staging, with no overlap with production workflows.

### 8.2 Pinned execution environment

The repository currently has no lockfile, so this package may add only the dedicated lockfile listed in section 5. The implementation report must explicitly record that it is new.

The independent job must pin:

- every GitHub Action by full immutable commit SHA, not a floating tag;
- an exact Node patch version;
- an exact npm version or the npm version bundled with that exact Node release;
- an exact Playwright or Playwright Core version in the dedicated package.json;
- the complete dependency graph in the dedicated package-lock.json;
- the Playwright Chromium revision;
- either an immutable CI container digest or a recorded SHA-256 for the resolved Chromium executable and all required browser metadata.

No placeholder version, latest tag, unpinned container tag, or mutable major-only action is acceptable in the final implementation.

The installation step is:

    npm ci --prefix control/test/independent/marzi-063

It must use the committed lockfile, fail on lock drift, and produce an installed dependency inventory. Browser installation must be the Playwright command associated with the pinned package and must install Chromium only. If system packages or a browser binary cannot be pinned or attested, status is BLOCKED.

The runner must record:

- operating-system image and immutable digest when available;
- Node and npm versions;
- Playwright package version;
- Chromium product version, revision, executable path, and SHA-256;
- lockfile SHA-256;
- action SHAs;
- workflow commit;
- target application commit;
- UTC timestamps and GitHub run ID.

### 8.3 No false success on SKIP

The d75a10b browser runner exits zero after printing SKIP when Playwright or Chromium is missing. The independent orchestrator must treat this as failure.

For every mandatory suite, it must require all of:

1. process exit code zero;
2. absence of SKIP, TODO, unavailable, or dependency-missing output;
3. presence of the exact expected suite summary;
4. exact total and passed counts;
5. zero failed count;
6. creation of the required machine-readable record.

A missing expected summary is BLOCKED even when the child process exits zero.

### 8.4 Network and privacy

Browser verification runs against localhost. Existing API routes must be deterministically stubbed as established by the browser harness. The verification job must not receive provider keys, deployment credentials, production cookies, real learner data, or analytics credentials.

Screenshots and logs must contain only synthetic test identities and synthetic conversation content. The runner must redact URLs containing secrets, headers, cookies, tokens, and environment values. No artifact may contain a credential.

## 9. Exact independent commands and mandatory counts

The runner must execute these commands from the exact sut checkout, with artifact output redirected outside sut:

    node test/conflict-markers.js
    node --check server.js
    node --check public/sw.js
    node --check test/run.js
    node --check test/learning-contracts.js
    node --check test/marzi-061-external-review-readiness.js
    node --check test/marzi-062-visual-staging.js
    node --check test/browser/run.js
    node test/run.js
    node test/learning-contracts.js
    node test/marzi-061-external-review-readiness.js
    node test/marzi-062-visual-staging.js
    node test/browser/run.js
    node test/browser/run.js marzi062
    git diff --check e2e90925aa1b83ecaae4dbf0e39ccfade49546b1 d75a10bb96e83045090190777dda5c8a692bed55

The control checkout must separately run:

    node test/marzi-063-staging-infra-browser.js
    node --check test/independent/marzi-063/run.mjs
    node --check .github/scripts/marzi-063-render-staging.mjs
    node .ai/bin/docs-validate
    git diff --check d75a10bb96e83045090190777dda5c8a692bed55 HEAD

The mandatory exact results are:

| Gate | Exact required result |
|---|---:|
| Application suite | 51/51 |
| Learning-contract suite | 36/36 |
| MARZI-061 suite | 30/30 |
| MARZI-062 package suite | 24/24 |
| Complete browser suite | 675/675 |
| MARZI-062 browser group | 107/107 |
| Conflict-marker check | PASS |
| JavaScript syntax | PASS for every listed and newly added JavaScript file |
| MARZI-062 range git diff --check | PASS |
| MARZI-063 control diff --check | PASS |

The documentation validator must introduce no new failure. If the same nine MARZI-GOV-001 baseline failures remain, record all nine exact codes and paths and prove the result is byte-for-byte equivalent in failure identity to the baseline. Do not repair those unrelated failures here.

The package validator must test at least:

- unique MARZI-063 allocation;
- exact target and rollback SHAs;
- exact production main SHA;
- immutable target-SHA workflow constant;
- two-checkout separation;
- no secrets in verification;
- staging-only environment protection;
- no pull_request_target;
- no floating action or container references;
- lockfile integrity;
- SKIP rejection;
- exact suite-count parsing;
- artifact completeness;
- staging service name and URL separation;
- auto-deploy disabled;
- branch restriction;
- production render.yaml unchanged;
- production service name absent from deploy-script targets;
- no generic service or commit argument;
- exact-commit deploy payload;
- rollback restricted to prior staging revision or the stated implementation parent;
- post-deploy smoke requirement;
- production proof requirement;
- forbidden runtime and contract diffs empty.

## 10. Independent visual evidence matrix

Source-string assertions are not visual evidence. Every visual criterion must be measured in real pinned Chromium by the independent runner.

### 10.1 Core layout matrix

Generate the full cross-product below, for sixteen core cases:

| Viewport | Text scale | Content profile |
|---|---:|---|
| 390×844 | 100% | German |
| 390×844 | 100% | Spanish |
| 390×844 | 100% | Arabic RTL |
| 390×844 | 100% | long German containing Krankschreibung |
| 390×844 | 200% | German |
| 390×844 | 200% | Spanish |
| 390×844 | 200% | Arabic RTL |
| 390×844 | 200% | long German containing Krankschreibung |
| 320×568 | 100% | German |
| 320×568 | 100% | Spanish |
| 320×568 | 100% | Arabic RTL |
| 320×568 | 100% | long German containing Krankschreibung |
| 320×568 | 200% | German |
| 320×568 | 200% | Spanish |
| 320×568 | 200% | Arabic RTL |
| 320×568 | 200% | long German containing Krankschreibung |

For each case preserve a full-page screenshot, a viewport screenshot, DOM geometry JSON, accessibility snapshot, console log, page-error log, and one result record.

For every applicable case measure and report:

- document horizontal overflow in pixels;
- page-level vertical and horizontal scroll in pixels;
- every critical box outside the viewport;
- every visible target smaller than 48×48 CSS pixels;
- Marzi overlap with the character face region and every critical control;
- browser console errors, uncaught exceptions, failed local resources, and page errors;
- visibility, reachability, naming, and usability of controls;
- identity-line wrapping, clipping, ellipsis, sideways overflow, and line visibility;
- scenario-card selected state;
- transcript left/right ownership and RTL direction;
- word-tap translation behavior;
- slow repeat through the existing slow speech path;
- normal TTS replay through the existing voice-provider path;
- timer visibility and progression;
- plan allowance visibility and truthfulness;
- focus visibility, focus order, keyboard activation, modal containment, and reduced motion;
- owned inner scrolling and the exact element that owns it.

Automated geometry must report:

    horizontalOverflowPx = 0
    pageScrollX = 0
    pageScrollY = 0
    criticalBoxesOutsideViewport = 0
    visibleTargetsBelow48By48 = 0
    marziFaceOverlapCount = 0
    browserErrorCount = 0

These zeroes are necessary but not sufficient. An independent reviewer must inspect every screenshot at readable size. The reviewer must explicitly judge the 320×568 at 200% cases, including owned inner scrolling, identity-line visibility, Marzi size, suggestion readability, and control reachability. If the result is technically measurable but materially cramped, ambiguous, clipped, hard to operate, or visually unacceptable, the result is CHANGES REQUIRED.

### 10.2 Conversation-state evidence

At minimum, capture and measure these states at 390×844, 100% text, in German:

1. ready;
2. listening;
3. processing;
4. speaking;
5. error;
6. disconnected.

Each state screenshot must show the visible state icon and label. The machine record must prove that the accessible live region exposes the same state and that controls have the correct enabled or disabled behavior.

Repeat error and disconnected at 320×568, 200% text to prove recovery controls remain reachable.

### 10.3 Interaction evidence

Preserve before-and-after screenshots and event records for:

- keyboard activation of scenario selection;
- visible scenario selected state;
- opening the transcript;
- character and learner turn ownership;
- tapping a transcript word and opening translation;
- slow repeat;
- normal TTS replay;
- timer progression;
- plan allowance;
- focus entering and remaining within the transcript dialog;
- closing the dialog and restoring focus;
- Arabic RTL transcript and control order;
- disconnected recovery;
- error recovery.

Provider calls must remain stubbed and must be counted. The evidence must distinguish the slow speech path from normal replay.

## 11. Artifact contract

All generated material lives outside both Git worktrees during execution and is uploaded as immutable CI artifacts. No screenshot, report, dependency directory, browser cache, or generated result may appear in git status.

The uploaded artifact must contain:

    provenance.json
    verification-summary.json
    suite-results.json
    junit.xml
    visual-results.json
    accessibility-results.json
    interaction-results.json
    browser-console.jsonl
    page-errors.jsonl
    network-failures.jsonl
    staging-smoke.json
    production-non-change.json
    deploy-record.json
    rollback-record.json
    SHA256SUMS
    screenshots/layout/
    screenshots/states/
    screenshots/interactions/

verification-summary.json must include every required count, command, exit code, duration, target SHA, runner SHA, and artifact-relative path.

visual-results.json must have one object per matrix case with all measurements named in section 10. It must not reduce a failed qualitative review to pass merely because numeric assertions are zero.

SHA256SUMS must cover every uploaded file except itself. The artifact upload step must fail when a required file is absent or empty. The workflow must report the artifact name, retention period, byte count, SHA-256 manifest hash, run ID, and downloadable GitHub URL.

Use a Product Owner-approved retention period. Default to 30 days only after approval. Artifacts must contain synthetic data only.

## 12. Staging infrastructure design

### 12.1 Separate Blueprint and service

Create render.staging.yaml as a new staging-only Blueprint. Do not edit render.yaml. The new Blueprint must be registered in Render as a separate Blueprint or service and must not manage, import, or reference the production service.

The staging declaration must encode:

- service name marzi-staging-r4a;
- a unique Render service ID recorded only as a protected staging environment value when it is sensitive;
- a unique default Render URL or Product Owner-approved staging URL;
- source repository restricted to claude/marzi-017-product-refinement;
- auto-deploy disabled;
- manual exact-commit deployment only;
- the existing dependency-free Node start command, without changing runtime application files;
- a staging health-check path;
- no custom production domain;
- no production environment group;
- no production deploy hook;
- no shared disk;
- no database;
- no production learner data;
- no production cookies or session material;
- no production analytics destination;
- a distinct staging environment marker;
- staging-only provider credentials when separately approved;
- budget and rate limits appropriate for family feedback;
- an optional staging-only TRAINER_PIN or equivalent access gate when approved.

The Blueprint must not contain secret values. It may contain secret declarations marked for manual staging-only provisioning.

The service must never be named telefontrainer and its resolved URL must not equal or alias https://telefontrainer.onrender.com.

If Render cannot use a separate Blueprint path, cannot keep auto-deploy off, cannot deploy an exact commit, or cannot prevent the staging credential from reaching production, stop with BLOCKED. Do not place a second service in production render.yaml without a new Product Owner and infrastructure mandate.

### 12.2 Environment separation

The staging environment may contain only staging-scoped values. At minimum record names, not values, for:

- MARZI_ENV=staging;
- MARZI_EXPECTED_COMMIT=d75a10bb96e83045090190777dda5c8a692bed55;
- staging service identity;
- staging origin;
- staging-only access control;
- any staging-only provider credential explicitly approved by the Product Owner.

No production credential may be copied, renamed, referenced, inherited, or shared. A generic provider key already used by production is a production credential even if supplied under a different environment-variable name.

If functional family calls require provider access and no separate budget-limited staging credential exists, browser verification may still use local stubs, but family-feedback readiness remains BLOCKED.

### 12.3 Dedicated deploy implementation

.github/scripts/marzi-063-render-staging.mjs must be staging-specific. It must not be a generic deploy script with service, environment, URL, branch, or commit supplied as arguments.

The following must be immutable constants in reviewed code:

    expected service name: marzi-staging-r4a
    forbidden service name: telefontrainer
    forbidden production URL: https://telefontrainer.onrender.com
    deploy commit: d75a10bb96e83045090190777dda5c8a692bed55
    rollback commit: e2e90925aa1b83ecaae4dbf0e39ccfade49546b1

The script may read only a staging-scoped service identifier and credential from the protected marzi-staging-r4a GitHub Environment. Before deploy it must query the target and prove service name, URL, branch, auto-deploy setting, and environment identity. It must refuse any target that matches or aliases production.

The exact-commit deployment request must name the full d75a10b SHA. A deploy hook that merely deploys branch HEAD is insufficient.

If the hosting API cannot select and later report the exact commit, status is BLOCKED.

## 13. Gate order

Execute in this order:

### Gate A — authorization and baseline

- Product Owner decisions recorded;
- branch and exact objects verified;
- clean control worktree;
- main protected;
- production configuration hash captured;
- production public URL and current deployment identity captured without placing production credentials in CI;
- staging Blueprint and workflow reviewed but not yet activated.

### Gate B — MARZI-063 static implementation

- only allowed files changed;
- production render.yaml byte-identical;
- runtime and frozen-contract diffs empty;
- package validator passes;
- syntax and diff-whitespace pass;
- documentation validator introduces no new failure;
- Codex reviews the control-plane commit before any staging action.

### Gate C — independent exact-commit verification

- independent runner provisions pinned tooling;
- exact d75a10b checkout proven;
- all required non-browser suites pass at exact counts;
- full browser suite passes 675/675;
- MARZI-062 browser group passes 107/107;
- all matrix, state, interaction, accessibility, and qualitative reviews pass;
- complete artifact is uploaded and its manifest verified.

Any missing dependency, SKIP, count mismatch, absent artifact, unavailable exact checkout, or failed visual criterion ends Gate C with BLOCKED or CHANGES REQUIRED. Deployment remains disabled.

### Gate D — staging provisioning

- create only marzi-staging-r4a from the separate staging Blueprint;
- record service ID, service name, URL, branch, environment, and auto-deploy state;
- confirm no production resource is referenced;
- confirm exact-commit deploy and rollback mechanisms;
- capture any existing successful staging deployment as the preferred rollback target;
- if no prior staging deployment exists, record e2e90925aa1b83ecaae4dbf0e39ccfade49546b1 as the only permitted first-deploy rollback revision and prove that Render can deploy it;
- keep family access closed.

### Gate E — exact staging deployment

- protected environment approval obtained;
- Gate C artifact downloaded and hashes verified;
- every exact count re-read from machine results;
- deploy only d75a10bb96e83045090190777dda5c8a692bed55;
- wait for successful health;
- query Render and prove the deployed commit equals the full target SHA;
- record deployment ID and prior staging deployment;
- do not deploy the MARZI-063 control commit.

### Gate F — post-deployment staging validation

- validate the distinct staging URL;
- verify visible MARZI-062 staging build ID;
- run browser smoke tests against staging;
- validate service-worker update and installed-PWA origin separation;
- validate 390×844 at 100% and 200%;
- validate 320×568 at 100% and 200%;
- validate German, Spanish, Arabic RTL, and Krankschreibung;
- validate ready, listening, processing, speaking, error, and disconnected;
- validate transcript, translation, slow repeat, normal replay, timer, and plan allowance without real learner data;
- upload staging-smoke.json and screenshots.

### Gate G — production non-change and handoff

- origin/main remains exactly 7395cd0a75fc206077e19ecc60e4c1e978dd2c89;
- local main, if present, is not changed;
- production render.yaml hash is unchanged;
- production service name, URL, deployment ID, commit, domain, and public health evidence match the Gate A capture;
- no production deploy event occurred during the package window;
- no production credential entered any job;
- staging and production origins are distinct;
- rollback is ready;
- Product Owner receives staging URL, artifact URL, checksums, limitations, and feedback instructions.

If production non-change cannot be proven, final status is BLOCKED.

## 14. Post-deployment browser smoke

The staging smoke job is not a substitute for the localhost independent suite. It is an additional deployment check.

It must:

- open only the recorded staging URL;
- reject redirects or canonical links to production;
- record final URL and TLS origin;
- assert the exact visible build ID;
- assert no production hostname appears in active requests;
- check service-worker scope and cache update;
- clear staging-origin state before each synthetic case;
- use no real learner identity;
- capture console errors and failed resources;
- exercise one selected scenario, transcript open, translation, slow repeat, normal replay, timer, plan allowance, and the six states;
- capture the four viewport and text-scale combinations;
- capture Spanish and Arabic RTL;
- capture long German with Krankschreibung;
- upload results even on failure, followed by a non-zero job exit.

Provider-dependent calls must use only approved staging credentials. If those credentials are absent, do not fall back to production; mark the provider-dependent family-readiness portion BLOCKED.

## 15. Production protection

The workflow and deployment script must contain explicit deny rules for:

- service name telefontrainer;
- URL https://telefontrainer.onrender.com;
- main;
- protected SHA 7395cd0a75fc206077e19ecc60e4c1e978dd2c89 as a deploy target;
- any service ID not validated as marzi-staging-r4a;
- any environment other than marzi-staging-r4a;
- any configurable commit other than d75a10bb96e83045090190777dda5c8a692bed55 for forward deploy and the recorded prior staging revision or e2e90925aa1b83ecaae4dbf0e39ccfade49546b1 for rollback.

Do not reuse a production deployment command by substituting a service argument. Do not define one generic production-or-staging matrix. Staging has a separate workflow, separate script, separate Blueprint, separate protected environment, separate secrets, separate service ID, and separate URL.

The package may publicly inspect the production URL for non-change evidence but must not authenticate to, mutate, restart, clear, redeploy, or reconfigure production.

## 16. Rollback

Before forward deploy, capture:

- staging service ID and name;
- current staging URL;
- current successful staging deployment ID and full commit, when one exists;
- d75a10b target;
- e2e9092 implementation parent;
- rollback command or API payload;
- person authorized to trigger rollback.

Rollback is staging-only. It must never target production.

Trigger rollback when:

- health fails;
- deployed commit differs;
- staging redirects to production;
- build ID is absent or wrong;
- post-deploy smoke fails materially;
- service-worker behavior makes the preview stale or unusable;
- browser errors or provider configuration create unsafe family exposure;
- production non-change evidence detects a possible production effect.

Preferred rollback target is the exact prior successful staging deployment captured before forward deploy. For a newly created service with no prior successful deployment, the only permitted code rollback is e2e90925aa1b83ecaae4dbf0e39ccfade49546b1. If Render cannot deploy that exact revision, suspend public staging access and report BLOCKED.

After rollback, repeat health, build identity, URL separation, and production non-change checks. Record rollback ID, requested revision, observed revision, result, timestamps, actor, and reason in rollback-record.json.

Do not delete production or staging resources automatically. Resource deletion requires a separate Product Owner and infrastructure authorization.

## 17. Acceptance criteria

MARZI-063 is acceptable only when all of the following are true:

1. Product Owner approved the package allocation and infrastructure decisions.
2. MARZI-063 appears exactly once in the roadmap and has one authoritative package spec.
3. Only allowed files changed.
4. render.yaml and the production service contract are byte-identical to baseline.
5. Runtime, provider, prompt, session, transcript-domain, storage, learning, mastery, reward, plan, entitlement, economy, privacy, analytics, dependency-at-runtime, main, and production diffs are empty.
6. A separate render.staging.yaml defines only marzi-staging-r4a.
7. Staging has a distinct service ID, URL, environment, protected environment, credential set, and deploy path.
8. Auto-deploy is disabled and main cannot trigger staging.
9. No production credential, database, disk, learner data, domain, hook, or service ID is used.
10. The independent runner is pinned and reproducible.
11. The dedicated lockfile is committed and npm ci succeeds without drift.
12. Exact d75a10b checkout and e2e9092 ancestry are proven.
13. Application passes 51/51 independently.
14. Learning contracts pass 36/36 independently.
15. MARZI-061 passes 30/30 independently.
16. MARZI-062 package passes 24/24 independently.
17. Complete browser suite passes 675/675 independently.
18. MARZI-062 browser group passes 107/107 independently.
19. Conflict-marker, syntax, and both diff-whitespace checks pass.
20. No suite output contains SKIP or an accepted missing dependency.
21. All sixteen layout cases have complete screenshots and measurements.
22. All six conversation states have complete evidence.
23. Interaction, accessibility, RTL, 200% text, and qualitative review pass.
24. The complete artifact set exists, is non-empty, hashed, downloadable, and contains no secret or real learner data.
25. Codex independently approves the MARZI-063 control-plane diff and Gate C evidence.
26. The protected staging environment approval is recorded.
27. Render reports d75a10bb96e83045090190777dda5c8a692bed55 as the deployed staging commit.
28. The staging URL is distinct, healthy, and displays the exact MARZI-062 build ID.
29. Post-deployment smoke passes and artifacts are uploaded.
30. A staging-only rollback target and tested procedure exist.
31. origin/main remains 7395cd0a75fc206077e19ecc60e4c1e978dd2c89.
32. Production configuration, service, URL, deployment identity, and health evidence are unchanged.
33. Family access instructions contain privacy boundaries and no invented feedback.
34. No PR, merge, production deploy, tag, release, or production mutation occurred.

Automated assertions are necessary but do not compel visual approval. Codex or the designated independent visual reviewer may return CHANGES REQUIRED for genuine presentation defects even when numeric assertions pass.

## 18. Decision rule

The only successful final status is:

    APPROVED — STAGING PREVIEW READY FOR FAMILY FEEDBACK

It may be used only when every acceptance criterion passes, the staging URL is validated, the exact target commit is deployed, downloadable evidence exists, production non-change is proven, and the Product Owner has approved family exposure.

Use:

    CHANGES REQUIRED

when infrastructure and dependencies are available but a correctable code, configuration, test, accessibility, interaction, responsive, or visual defect remains.

Use:

    BLOCKED

when any of the following is unavailable or unprovable:

- exact d75a10b checkout;
- required parent or protected-main objects;
- clean isolated worktrees;
- pinned Node, npm, Playwright, Chromium, operating-system dependencies, or lockfile;
- required test artifact or exact count;
- independent runner;
- full visual evidence;
- separate Render staging service;
- distinct staging URL;
- staging-only credentials needed for approved family functionality;
- exact-commit Render deployment;
- rollback target;
- protected-environment approval;
- production non-change evidence.

Never downgrade BLOCKED to APPROVED because the MARZI-062 implementation report claimed a pass.

## 19. Final implementation report format

The final MARZI-063 report must use this order:

1. Final status
   - one of the three exact statuses from section 18.

2. Package and provenance
   - MARZI-063 control commit;
   - target d75a10b;
   - parent e2e9092;
   - protected main;
   - branch;
   - clean-tree evidence.

3. Product Owner decisions
   - roadmap allocation;
   - service and cost;
   - staging credential policy;
   - artifact retention;
   - family exposure.

4. Changed-file audit
   - exact name-status list;
   - confirmation that every path is allowed;
   - forbidden diff results.

5. Staging architecture
   - service name and non-secret ID;
   - staging URL;
   - Blueprint path and hash;
   - branch;
   - auto-deploy state;
   - environment-variable names only;
   - proof of no database, disk, production environment group, domain, hook, or credential sharing.

6. Independent runner provenance
   - run ID and URL;
   - action SHAs;
   - image digest;
   - Node, npm, Playwright, and Chromium versions;
   - executable and lockfile hashes;
   - target checkout proof.

7. Mandatory test table
   - command;
   - expected count;
   - actual count;
   - pass, fail, or blocked;
   - report path and SHA-256.

8. Visual matrix
   - all sixteen cases;
   - numeric measurements;
   - screenshot path and hash;
   - qualitative reviewer result and notes.

9. State and interaction evidence
   - all six states;
   - transcript, translation, slow repeat, normal replay, timer, plan, keyboard, focus, RTL, and recovery results.

10. Artifact handoff
    - artifact name and URL;
    - byte count;
    - retention;
    - SHA256SUMS hash;
    - missing-artifact count, which must be zero.

11. Deployment
    - approval record;
    - deployment ID;
    - requested and observed full commit;
    - timestamps;
    - staging URL and health;
    - visible build ID.

12. Post-deployment smoke
    - exact cases;
    - result;
    - screenshots and machine report.

13. Production protection
    - before and after main SHA;
    - before and after production deployment identity;
    - render.yaml hash;
    - production URL and health;
    - production deploy-event count during the window;
    - conclusion.

14. Rollback
    - prior staging deployment or e2e9092;
    - command or payload;
    - readiness;
    - execution result if used.

15. Family-feedback handoff
    - validated staging URL;
    - access instructions;
    - privacy boundaries;
    - known limitations;
    - explicit statement that no participant result or feedback has been invented.

16. Residual blockers and decisions
    - every unresolved item, owner, and required next action.

Do not print secret values. Do not claim a specialist, family participant, Product Owner, Codex, staging, or production result that did not occur.

## 20. Independent review handoff

Claude Code must stop after producing the bounded implementation commit and its local static report. It must not call its own run independent merely because it executes on another local process.

The handoff to Codex must include:

- full MARZI-063 control commit SHA and parent;
- exact changed-file list;
- roadmap and decision approvals;
- workflow file and pinned dependency hashes;
- staging Blueprint hash;
- package-validator output;
- instructions for triggering the no-secret independent verification job;
- expected artifact schema;
- statement that deployment is still disabled.

After the independent job, the handoff must include:

- GitHub run ID and immutable URL;
- verification job conclusion;
- complete artifact URL and manifest hash;
- exact suite counts;
- screenshot inventory and hashes;
- qualitative visual-review worksheet;
- any failed or blocked criterion.

Only after Codex accepts the control-plane diff and independent evidence may the protected staging deployment job be approved. After staging smoke and production non-change checks, the Product Owner decides whether to expose the URL for family feedback.

No independent approval authorizes merge or production release.

## 21. Stop conditions

Stop immediately and report BLOCKED when:

- Product Owner approval is missing;
- another canonical package has already claimed MARZI-063;
- branch, target, parent, or protected main differs;
- the repository is dirty and changes cannot be isolated;
- a required file outside the allowed list appears necessary;
- the staging Blueprint would affect production;
- exact-commit deployment is unsupported;
- Playwright, Chromium, required dependencies, lockfile, or artifacts are unavailable;
- the browser runner reports SKIP;
- any mandatory exact count differs;
- required screenshots or JSON results are missing;
- production secrets or learner data would be required;
- the staging service cannot be proven distinct;
- rollback cannot be made staging-only;
- production non-change cannot be proven;
- a critical test, interaction, accessibility, responsive, or visual defect remains.

Preserve all review evidence available at the point of failure. Do not deploy, merge, or attempt a production fallback.

## 22. Completion boundary

This package is complete only at:

    APPROVED — STAGING PREVIEW READY FOR FAMILY FEEDBACK

That status means an independently verified d75a10b staging preview is available for controlled feedback. It does not mean MARZI-062 is merged, production-ready, released, linguistically approved, accessibility-certified, or commercially approved.

Everything beyond controlled staging feedback requires a later Product Owner decision and the repository governance sequence.
