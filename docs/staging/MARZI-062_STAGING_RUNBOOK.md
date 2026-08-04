# MARZI-062 — Staging runbook

Staging-only procedure for the MARZI-062 family visual preview. Nothing in this
file may be used against production.

## 1. Target

| Field | Value |
|---|---|
| Staging service | `marzi-staging-r4a` |
| Branch | `claude/marzi-017-product-refinement` |
| Build label | `MARZI STAGING PREVIEW · MARZI-062 · BUILD MARZI-062-PREVIEW-1` |
| Cache name | `telefontrainer-v38-marzi-062-preview-1` |
| Production service | `telefontrainer` — **out of scope, never a target of this runbook** |
| Protected main | `7395cd0a75fc206077e19ecc60e4c1e978dd2c89` |

## 2. Environment preflight — the blocking gate

**The preflight below is a gate, not a formality. If any line fails, stop. Do
not deploy, and do not adapt a production command by changing an argument.**

Run and record each answer before any deploy command is issued:

1. Which deployment convention does this repository document?
   Currently: a single Render blueprint at `render.yaml`.
2. Which services does that convention define?
   Currently: exactly one — `type: web, name: telefontrainer`.
3. Is a service named `marzi-staging-r4a` defined in the repository?
4. Is a staging deploy command, staging blueprint, staging environment, staging
   API credential, or staging CLI available in this environment?
5. Does the resolved target name `marzi-staging-r4a` **explicitly**, rather than
   by assumption?
6. Would the command alter a production environment variable, secret, route,
   domain, data store, or service?
7. Would the command deploy `main` rather than the reviewed development-branch
   commit?

Reject the deployment if the resolved service is not exactly
`marzi-staging-r4a`, if the resolved environment is production, if any
production object would change, if `main` would be deployed, or if the
repository lacks a staging procedure that distinguishes staging from production.

### Status at the time of writing

Preflight lines 3, 4 and 5 fail. `render.yaml` defines only the production web
service `telefontrainer`; `README.md` documents only the production Render
blueprint flow; no `marzi-staging-r4a` service, staging blueprint, staging
environment variable, or deployment CLI exists in the repository or the build
environment. Under section 2 the correct action is therefore to stop before
deployment rather than to reinterpret the production command.

**To make this runbook executable, a separately authorized change must add the
staging service definition and its deploy procedure.** That change is outside
MARZI-062's allowed file scope and belongs to the environment and
release-control package that owns deployment configuration.

## 3. Build-label check

The label is checked into `public/index.html` as
`#stagingBar` with `data-marzi-build="MARZI-062-PREVIEW-1"`. It is
presentation-only: no telemetry, no learner state, no prompt, no transcript, no
reward, no persistence.

Verify, in this order:

1. `curl -sS <url>/ | grep -c 'MARZI-062-PREVIEW-1'` returns at least 1.
2. In a browser at the staging URL, the label is visible on first load without
   scrolling.
3. The label is still readable at 320×568 and at 200% text — it wraps, it does
   not truncate.
4. The label has an accessible name (`aria-label` on `#stagingBar`).
5. The label does not intercept taps (`pointer-events: none`) and no visible
   control measures under 48×48 CSS pixels with the label present.

## 4. Local test procedure

    ANTHROPIC_API_KEY=dummy PORT=5173 node server.js &
    node test/conflict-markers.js
    node test/run.js
    node test/learning-contracts.js
    node test/marzi-061-external-review-readiness.js
    node test/marzi-062-visual-staging.js
    node test/browser/run.js marzi062
    node --check server.js && node --check public/sw.js

All must pass before a deployment is even considered.

## 5. One-deploy procedure

Only after section 2 passes in full:

1. Confirm the working tree is clean and the branch is
   `claude/marzi-017-product-refinement`.
2. Record the exact implementation commit SHA. Deploy **that commit**, never an
   uncommitted tree and never a different SHA.
3. Confirm local `HEAD` equals remote `HEAD`, ahead 0, behind 0.
4. Issue the canonical staging deploy command for `marzi-staging-r4a`, with the
   service named explicitly in the command. Deploy once.
5. Record the staging revision/deployment identifier the command returns.

Do not deploy production. Do not merge. Do not tag. Do not open a pull request.

## 6. Staging URL verification

After deployment, record each measurement rather than assuming it:

| Check | Method |
|---|---|
| URL responds | HTTP status of `GET /` |
| Build label present | `MARZI-062-PREVIEW-1` in the served HTML |
| Revision maps to the commit | staging revision ↔ implementation SHA |
| Manifest served | `GET /manifest.webmanifest` parses as JSON |
| Icons served | `GET /icons/icon-192.png` and `/icons/icon-512.png` respond 200 |
| Service worker served | `GET /sw.js` contains the expected cache name |
| Call screen usable | 390×844 and 320×568, portrait |
| RTL usable | Arabic at 320×568 |
| Text scale usable | 200% at 320×568 |

## 7. Installed-PWA cache and reinstall

The service worker is network-first for same-origin requests and never caches
`/api/`. The cache name changed from `telefontrainer-v37` to
`telefontrainer-v38-marzi-062-preview-1`, so on the next successful load the
activate handler deletes every cache whose key is not the new one.

Expected update path, in order of increasing effort:

1. **Refresh.** Reopen the tab or pull to refresh. Network-first means a
   reachable server already returns the new shell.
2. **Reopen the installed app.** Close it fully and reopen; the new worker
   installs, `skipWaiting()` activates it, and `clients.claim()` takes over.
3. **Unregister and reinstall.** Browser settings → site settings for the
   staging origin → clear storage; or uninstall the home-screen app, reopen the
   staging URL, and install again.

A reviewer who still sees the previous shell after step 3 should report it as a
finding with the label they actually saw.

## 8. Unchanged-icon expectation

`public/manifest.webmanifest`, `public/icons/icon-192.png` and
`public/icons/icon-512.png` are **unchanged** by MARZI-062 and must stay
unchanged. The launcher icon in the installed staging preview will look exactly
as it does today. This is deliberate: no rights-approved Marzi launcher asset
exists, and cropping a concept board or generating a mascot is prohibited. See
the ICON ASSET APPROVAL REQUIRED handoff in `docs/packages/MARZI-062.md`.

A changed icon binary, a changed icon reference, or a new icon path is a
failure of this package, not an improvement.

## 9. Before/after screenshot matrix

Capture the same viewport, language, text scale, scenario and state on both
sides. Evidence lives in a task-owned temporary directory and is never staged as
an application asset.

| Case | Viewport | Text | Language/direction | Focus |
|---|---:|---:|---|---|
| V01 | 390×844 | 100% | English LTR | primary family preview |
| V02 | 390×844 | 100% | Spanish LTR | expansion and state labels |
| V03 | 390×844 | 100% | German content LTR | long scenario identity |
| V04 | 390×844 | 100% | Arabic RTL | logical layout |
| V05 | 320×568 | 100% | English LTR | small-screen controls |
| V06 | 320×568 | 100% | Arabic RTL | small-screen direction |
| V07 | 320×568 | 200% | Arabic RTL | known overflow regression |
| V08 | 320×568 | 200% | German content LTR | `Krankschreibung` containment |
| V09 | 390×844 | 200% | English LTR | text-scale hierarchy |

Plus the scenario-selected state and the listening, processing, speaking,
disconnected and error states.

Record for each: filename, dimensions, state, commit, and SHA-256. Screenshots
must show no conversation content beyond the stubbed fixture line, no personal
name, no voice, and no credential.

## 10. Production non-change check

Read-only metadata only. Never issue a production mutation to prove
non-mutation.

1. Record the production reference **before** the staging deployment.
2. After deployment confirm: no production deploy command ran; the production
   service revision and configuration are unchanged; the production URL's
   behavior or version marker is unchanged where the environment exposes one
   safely; `main` is still `7395cd0a75fc206077e19ecc60e4c1e978dd2c89`.
3. If production non-change cannot be measured without mutating something or
   reading a secret, record the bounded evidence available and claim no more
   than that.

## 11. Rollback

### Code

    git revert <implementation-commit>

One commit, independently reversible. It restores the previous call-screen
composition, removes the staging marker, and restores the previous cache name.
No data migration, no learner data deleted, no entitlement or economy value
changed, no MARZI-021 or MARZI-061 artifact touched, no history rewritten. Never
use reset, rebase, or force push to roll back.

### Staging service

Use the documented service-revision procedure for `marzi-staging-r4a` only:

1. Identify the prior known-good staging revision recorded in section 5.
2. Restore or route traffic to it.
3. Verify its build marker is the previous one, not `MARZI-062-PREVIEW-1`.
4. Leave production untouched.

### Installed PWA after a rollback

A rolled-back shell has the previous cache name, so reviewers follow section 7
in reverse: refresh, reopen, and if necessary clear storage and reinstall.

## 12. Privacy-safe evidence fields

Record only: URL, build label, commit SHA, staging revision, viewport,
device-pixel ratio, language and direction, text-scale method and measured
computed font size, document and viewport dimensions, overflow measurements,
bounding boxes, target dimensions, focus results, state results, screenshot
filename and SHA-256, and the test command outputs.

Never record: names, email addresses, phone numbers, health information, voice
recordings, credentials, tokens, account identifiers, private conversation
content, or photographs of people. Do not put a secret, token, account
identifier, or production mutation command in any document, screenshot, log, or
report.

## 13. Emergency stop

Stop immediately, and do not continue to deployment, if:

- the resolved deployment target is not exactly `marzi-staging-r4a`;
- any production object would be read for mutation or changed;
- a credential or secret would be required beyond staging;
- `main` moves from `7395cd0a75fc206077e19ecc60e4c1e978dd2c89`;
- the deployed revision does not map to the reviewed implementation commit;
- the manifest or an icon binary differs from the baseline;
- a required visual criterion cannot be measured in a real browser.

Preserve the committed and pushed work, execute no production fallback, and
report the exact failure and the rollback status.
