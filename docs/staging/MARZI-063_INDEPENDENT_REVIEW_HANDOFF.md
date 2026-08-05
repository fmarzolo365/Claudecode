# MARZI-063 — Independent review handoff

For Codex and the designated independent visual reviewer.

**Deployment is disabled at the point this handoff is produced.** The staging
deployment job cannot run until the protected `marzi-staging-r4a` environment is
approved, and that approval should not be given before the control-plane diff and
the Gate C evidence have been accepted.

## 1. What you are reviewing

| Field | Value |
|---|---|
| Control-plane commit | the MARZI-063 commit on `claude/marzi-017-product-refinement` |
| Its parent | `a83422bedaeb7f0ae3a414c138a41e093b2238cf` (mandate transfer) |
| Revision under test | `d75a10bb96e83045090190777dda5c8a692bed55` |
| Its implementation parent | `e2e90925aa1b83ecaae4dbf0e39ccfade49546b1` |
| Protected main | `7395cd0a75fc206077e19ecc60e4c1e978dd2c89` |
| Control diff range | `d75a10bb96e83045090190777dda5c8a692bed55..HEAD` |
| MARZI-062 diff range | `e2e90925aa1b83ecaae4dbf0e39ccfade49546b1..d75a10bb96e83045090190777dda5c8a692bed55` |

The control-plane commit changes no application file. It is infrastructure,
workflow, pinned test tooling and documentation only.

## 2. Changed files to review

| Path | Why it is in scope |
|---|---|
| `docs/MARZI_MASTER_ROADMAP.md` | MARZI-063 allocated once; range extended |
| `docs/MARZI_DECISION_REGISTER.md` | MARZI-D026 … D030 recorded |
| `docs/packages/MARZI-063.md` | package specification and implementation report |
| `docs/staging/MARZI-063_STAGING_INFRA_BROWSER_RUNBOOK.md` | provisioning through handoff |
| `docs/staging/MARZI-063_INDEPENDENT_REVIEW_HANDOFF.md` | this file |
| `.github/workflows/marzi-063-independent-staging.yml` | verification and gated deployment |
| `.github/scripts/marzi-063-render-staging.mjs` | staging-only deploy control |
| `render.staging.yaml` | staging-only Blueprint |
| `test/independent/marzi-063/package.json` | pinned tooling manifest |
| `test/independent/marzi-063/package-lock.json` | **newly generated** dedicated lockfile |
| `test/independent/marzi-063/run.mjs` | independent runner |
| `test/marzi-063-staging-infra-browser.js` | package validator |
| `.ai/bin/docs-validate` | decision-register range moved from D025 to D030 |

## 3. Triggering the no-secret verification job

1. Actions → **MARZI-063 independent staging verification** → *Run workflow*.
2. Branch: `claude/marzi-017-product-refinement`.
3. `run_deploy`: **false**.

The `verify` job declares `contents: read` and `actions: read`, no environment
and no secrets. It cannot deploy. It checks out the control plane into
`control/` and exactly `d75a10b` into `sut/`.

## 4. Expected artifact schema

Artifact `marzi-063-independent-evidence`, retention 30 days:

    provenance.json              runner, image, Node, npm, Playwright, Chromium, hashes
    verification-summary.json    every count, command, exit code, duration, verdict
    suite-results.json           one record per gate, with log path and hash
    junit.xml                    CI-readable summary
    visual-results.json          16 layout cases, all measurements, screenshot hashes
    accessibility-results.json   per-case accessibility snapshots
    interaction-results.json     scenario keyboard selection, transcript, translation,
                                 slow repeat, normal replay, timer, plan, focus, RTL
    states-results.json          8 state records
    browser-console.jsonl        console errors
    page-errors.jsonl            uncaught exceptions
    network-failures.jsonl       failed local resources
    staging-smoke.json           NOT_RUN until the deploy job runs
    production-non-change.json   main SHA and render.yaml comparison
    deploy-record.json           NOT_RUN until the deploy job runs
    rollback-record.json         permitted targets
    SHA256SUMS                   covers every file except itself
    screenshots/layout/          viewport and full-page, per case
    screenshots/states/          one per state
    screenshots/interactions/    before/after pairs

Verify with `sha256sum -c SHA256SUMS` after downloading.

## 5. Reviewer checklist

### Control plane

- [ ] Only the thirteen paths above changed.
- [ ] `render.yaml` is byte-identical to `f710e1c0d1b1aab517da73aa355bf8e535240fe0edc8c9357acdcbc193c6dbab`.
- [ ] No application, provider, prompt, session, transcript, storage, learning, economy or privacy file changed.
- [ ] `render.staging.yaml` declares exactly one service, named `marzi-staging-r4a`, with auto-deploy off and the branch restricted.
- [ ] The staging Blueprint contains no secret value, no database, no disk, no domain, no production environment group.
- [ ] The deploy script has **no** service, URL, branch, environment or commit argument, and denies `telefontrainer`, the production URL and the protected main SHA.
- [ ] Every action is pinned to a full 40-character commit SHA; `runs-on` is not a `latest` label.
- [ ] The verification job has no secrets and no environment; the deploy job needs it and uses the protected environment.
- [ ] There is no `pull_request_target` and no push trigger.
- [ ] The lockfile contains only `playwright-core@1.62.1` with an integrity hash, and is recorded as newly generated.

### Independent evidence

- [ ] `verification-summary.json` verdict is `PASS`.
- [ ] Exact counts: 51/51, 36/36, 30/30, 24/24, 675/675, 107/107 — read from the JSON, not from prose.
- [ ] No suite log contains `SKIP`, `unavailable`, or a dependency-missing marker.
- [ ] `provenance.json` records Node 22.22.2, npm 10.9.7, playwright-core 1.62.1, the Chromium revision and executable SHA-256, and the lockfile SHA-256.
- [ ] The runner proved `sut` HEAD, its single parent, a clean tree, `origin/main`, checkout separation, and that no tooling reached `sut`.
- [ ] `SHA256SUMS` verifies and no required file is missing or empty.

### Visual judgement — the part automation cannot do

Numeric zeroes are necessary, not sufficient. Open **both** screenshots for each
of the sixteen cases at readable size.

- [ ] Every layout case reads as a usable call screen, not merely a measurable one.
- [ ] **320×568 at 200% text**, all four content profiles, judged explicitly:
      identity line visibility, Marzi's size, suggestion readability, control
      reachability, and which element owns the inner scrolling.
- [ ] Arabic RTL places controls and transcript logically and does not reverse chronology.
- [ ] Long German with `Krankschreibung` is contained and legible.
- [ ] All six states show icon and label, and the live region carries the same text.
- [ ] Error and disconnected keep reachable recovery controls at 320×568 / 200%.

Return **CHANGES REQUIRED** for a genuine presentation defect even when every
numeric assertion is zero. A result that is technically measurable but cramped,
ambiguous, clipped, or hard to operate is a defect.

## 6. Classify findings

`BLOCKER` · `HIGH` · `MEDIUM` · `LOW` · `INFORMATIONAL`

## 7. Final status template

Use exactly one:

    APPROVED — STAGING PREVIEW READY FOR FAMILY FEEDBACK
    CHANGES REQUIRED
    BLOCKED

`APPROVED — STAGING PREVIEW READY FOR FAMILY FEEDBACK` may be used only when the
control-plane diff is accepted, every independent gate passed at its exact
count, the visual review passed, the staging service is proven distinct, Render
reports `d75a10bb96e83045090190777dda5c8a692bed55` as the deployed commit,
post-deployment smoke passed, production non-change is proven, and the Product
Owner has approved family exposure.

No independent approval here authorizes merge, production release, accessibility
certification, linguistic approval, or educational approval.
