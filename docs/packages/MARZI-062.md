# MARZI-062 — Family Visual Staging Preview

## 1. Package identity

- Package ID: MARZI-062
- Canonical title: Family Visual Staging Preview
- Roadmap category: Product quality / staging preview
- Status: IMPLEMENTED — staging deployment gated, see section 29
- Specification owner: Codex
- Implementation owner: Claude Code
- Product owner: Marzi Product Owner
- Independent reviewer: Codex
- Target branch: `claude/marzi-017-product-refinement`
- Approved base commit: `e2e90925aa1b83ecaae4dbf0e39ccfade49546b1`
- Package version: v1 / 2026-08-04
- Supersedes: nothing. It completes no other package.

## 2. Objective

One safe, visibly identifiable staging build of the call screen that the
Product Owner and family can open on a phone and give feedback on, without any
production change and without any claim of educational, linguistic,
accessibility, release, or production approval.

## 3. User problem

The Product Owner and family cannot judge the app from a diff or a test count.
They need to hold it on a phone. Until now there has been no build they can
distinguish from whatever their phone already installed, no written way to give
structured feedback, and no measured evidence of how the call screen behaves at
a small viewport, at increased text size, or in Arabic.

## 4. Current evidence

Measured in Chromium against the local server at the approved base commit,
before any change in this package.

| Evidence ID | Source and exact location | Observation | Classification | Reproduction |
|---|---|---|---|---|
| E-01 | `public/index.html` `.call-mid` and its absolutely positioned children | Critical elements were free-floating overlays with no knowledge of each other | runtime defect (latent) | rendered measurement, 200% text |
| E-02 | `#vcSay` at 320×568, 200% text | Character line measured 271×308 of content inside a 196×308 box — the line was clipped | runtime defect | matrix case V07/V08 |
| E-03 | `#vcMarzi` vs `#vcSay` at 320×568, 200% text | 14 883 px² (Arabic) and 15 896 px² (German content) of overlap | runtime defect | matrix case V07/V08 |
| E-04 | `#vcMarzi` vs `#callId` at 320×568, 200% text | 7 930 px² and 7 211 px² of overlap | runtime defect | matrix case V07/V08 |
| E-05 | `#callStatus` vs `#vcSay` at 320×568, 200% text | 2 819 px² and 3 134 px² of overlap | runtime defect | matrix case V07/V08 |
| E-06 | `#vcMarzi` vs `#vcSay` at 390×844, 200% text | 34 308 px² of overlap | runtime defect | matrix case V09 |
| E-07 | All nine matrix cases at the base commit | `documentElement.scrollWidth` equalled `clientWidth`; zero interactive targets under 48×48; zero elements outside the viewport | confirmed passing behavior, not a defect | matrix V01–V09 |
| E-08 | `render.yaml`, `README.md`, repository-wide search | No `marzi-staging-r4a` service, staging blueprint, staging environment, or deployment CLI exists | environment limitation | section 29 |
| E-09 | `public/manifest.webmanifest`, `public/icons/**` | No rights-approved Marzi launcher asset exists at the baseline | asset gap | section 10 |

E-07 is recorded deliberately: the base commit already satisfied several
criteria this package is measured against, and those are reported as preserved
rather than as fixed.

## 5. In scope

- A persistent, checked-in, visible staging build identity.
- Bounded call-screen composition changes so critical elements occupy reserved,
  non-overlapping layout regions.
- Bounded containment so a long German compound noun and 200% text do not clip
  the character's line.
- Service-worker cache/version bump so an installed preview updates.
- Staging runbook, family-feedback form, package document, roadmap entry.
- A package validator and a browser evidence group.

Anything not listed is out of scope.

## 6. Explicitly out of scope

- Any production change, production deployment, or production data access.
- `main`.
- The launcher icon, the manifest, and every icon binary.
- Learning content, scenarios, localized strings, prompts, providers,
  `ConversationSession`, the transcript domain, storage, XP, coins, rewards,
  streaks, economy, Marzi evolution, outfits, Store, Profile, navigation, and
  Android back behavior.
- MARZI-024 environment and release control, MARZI-039 call shell and
  responsive composition, MARZI-040 Marzi identity and launcher, MARZI-050
  accessibility and Android PWA qualification, MARZI-061 external review.
  **MARZI-062 does not complete or supersede any of them.** It integrates a
  deliberately bounded visual subset for a disposable, non-production preview.

## 7. Frozen contracts

| Contract | Authority/current location | Required preservation | Verification |
|---|---|---|---|
| Session ownership | `createConversationSession` | semantic | `M062-014`, browser suite |
| Prompt semantics | `PromptBuilder.rolePlay` | semantic | `M062-014` |
| Transcript source and guards | `transcript.add`, duplicate/late-reply guards | semantic | `M062-014`, `M062-016` |
| Provider abstraction | `ENGINE.get("ai" \| "voice")` | semantic | `M062-014` |
| Word tap and translation | `tappable`, `loadWords` | semantic | `M062-016`, browser suite |
| Replay through TTS | `replayLastCharacterLine` | semantic | `M062-016`, browser suite |
| Slow repeat | `#repeatBtn` → `speak(text, true, …)` | semantic | `M062-016`, browser suite |
| Timer and plan limits | `S.timerId`, `planLimitToday` | semantic | `M062-014`, browser suite |
| Storage keys | `marzi.settings.v1`, `marzi.stats.v1` | byte-for-byte key names | `M062-014` |
| Scenario identities | 31 registry records (29 playable scenarios plus the `custom`/`random` entries each target pack carries), ids and localized titles | byte-for-byte | `M062-010`, `M062-013` |
| `Krankschreibung` | `empfang` scenario goal | byte-for-byte | `M062-013` |
| Manifest and icons | `public/manifest.webmanifest`, `public/icons/**` | byte-for-byte | `M062-011` SHA-256 |
| Service-worker lifecycle | `public/sw.js` fetch/activate handlers | semantic; version identifier only | `M062-021` |
| MARZI-021 learning contracts | `docs/learning/contracts/v1/**` | byte-for-byte | empty diff, `node test/learning-contracts.js` |
| MARZI-061 review artifacts | `docs/learning/reviews/marzi-061/**` | byte-for-byte | empty diff, `node test/marzi-061-external-review-readiness.js` |

## 8. Product decisions already approved

| Decision ID | Approved outcome | Approval evidence | Package implication |
|---|---|---|---|
| MARZI-062 allocation | Use the next unallocated canonical identifier for the family visual staging preview | `MARZI-062_VISUAL_STAGING_CLAUDE_CODE_MANDATE.md` §3 | Append MARZI-062 without renumbering any package |
| Staging-only preview | Family feedback happens on staging, never production | mandate §8 | No production target may be resolved |

## 9. Product decisions still required

| Decision ID | Question | Recommended option | Decision owner | Deadline | Work blocked |
|---|---|---|---|---|---|
| — | Which rights-approved source asset becomes the Marzi launcher icon | Commission or license one; do not crop a concept board | Product Owner | before any launcher-icon package | The icon replacement, not this preview |
| — | Whether a `marzi-staging-r4a` service is provisioned and how it is deployed | Define it in the environment and release-control package that owns deployment configuration | Product Owner with the environment owner | before the preview can be deployed | Staging deployment only; the implementation is complete and pushed |

## 10. Asset requirements

| Asset ID/path | Purpose | Required specification | Status | Source reference | Fallback | Blocks |
|---|---|---|---|---|---|---|
| `public/icons/icon-192.png` | installed launcher icon | unchanged | ready, **unchanged** | existing binary | none needed | nothing |
| `public/icons/icon-512.png` | launcher and maskable icon | unchanged | ready, **unchanged** | existing binary | none needed | nothing |
| Marzi launcher source art | a real branded launcher icon | rights-cleared vector or high-resolution source with maskable safe zone | **missing** | none — no concept board, screenshot or character art may be cropped | keep the current icon | a future launcher-icon package |

### ICON ASSET APPROVAL REQUIRED

This missing asset does not block the visual staging preview because the visible
MARZI-062 staging-build label distinguishes the preview. Acceptance of a new
launcher icon is NOT APPLICABLE for this implementation. Manifest validity and
unchanged icon-reference integrity must still pass.

This is a **non-blocking** branding handoff: it is recorded so the work is not
forgotten, and it stops nothing in this package. No launcher icon was produced,
cropped, generated, or replaced by this package.
`public/manifest.webmanifest` and both icon binaries are byte-identical to the
approved base commit, verified by SHA-256 in check `M062-011`.

## 11. Architecture

No new module, store, controller, provider, router, prompt builder, reward
calculator, timer, localization source, or asset identity system exists. Every
change is presentation.

- **Staging identity** is one element in `public/index.html` and one observer
  that publishes its measured height as `--staging-bar`. Dependency direction is
  one-way: layout reads the variable, nothing reads layout back. Failure
  boundary: when the element is absent the variable is unset, `var(--staging-bar, 0px)`
  resolves to `0px`, and every rule reduces to its previous value.
- **Call composition** replaces free-floating absolute overlays inside
  `.call-mid` with CSS grid areas. The existing abstraction — one flex column of
  top bar, middle band, bottom stack — is retained; only the middle band's
  internal placement changes. Grid areas cannot overlap by construction, which
  is why the geometry now holds at text scales the absolute layout could not
  anticipate.
- **The portrait, scrim and floor gradient stay absolute.** They are the
  backdrop, not critical boxes, and Marzi standing in front of the portrait is
  the established design.

## 12. State ownership

| State | Canonical owner | Readers | Writers | Lifetime | Persistence | Derived views |
|---|---|---|---|---|---|---|
| `--staging-bar` | the staging marker's measured height | CSS layout only | the resize observer | page | none | layout offsets |
| conversation state | `ConversationSession` + `S` | `callStateFor` | unchanged | call | none | status chip, live region, mic button |

The build identity is named explicitly as state that must **not** enter
learner state, analytics, prompts, transcripts, rewards, or persistence. It is
a static attribute and a static string; nothing writes it and nothing stores it.

## 13. Data/storage changes

- Schema/version before: unchanged
- Schema/version after: unchanged
- New or changed keys: none
- Validation and corruption behavior: unchanged
- Offline behavior: unchanged, network-first with an offline shell
- Backward compatibility: unchanged
- Export/deletion implications: none

Verified by an empty diff over every storage path and by check `M062-014`.

## 14. Migration strategy

No data migration exists. The only migration is service-worker cache authority:
the cache name changes from `telefontrainer-v37` to
`telefontrainer-v38-marzi-062-preview-1`, so the activate handler deletes the
previous cache and `clients.claim()` takes over. Downgrade is symmetric — a
revert restores the previous name and the same deletion happens in reverse.
Reinstall steps are in the runbook, section 7.

## 15. Accessibility

Measured, not certified. **No WCAG conformance, accessibility approval, or
assistive-technology validation is claimed**; that gate is MARZI-050 and the
MARZI-061 accessibility review, both pending.

Requirements this package holds itself to, each measured in a real browser:

- the staging marker has an accessible name and cannot intercept a control;
- every visible interactive target measures at least 48×48 CSS pixels;
- focus is visible on every focusable control and content order is logical;
- state is conveyed by icon **and** text, never by colour alone;
- status changes go through the existing polite live region;
- reduced motion preserves state meaning;
- identity text wraps rather than truncating;
- the character's line keeps a three-line reading budget at any text scale and
  scrolls inside its own bubble beyond that.

## 16. Localization/RTL

- No localized string was added, removed, or altered. The staging marker is a
  build identifier, deliberately untranslated, exactly as specified.
- `Krankschreibung` is unchanged and is exercised in its canonical `empfang`
  context at 200% text.
- Layout uses logical properties, so RTL reverses placement without reversing
  transcript chronology.
- Arabic is measured at 320×568 and 390×844, at 100% and 200% text.

## 17. Responsive requirements

Required viewports, portrait: **390×844** and **320×568**, each at 100% and
200% text, in English, Spanish, German content and Arabic RTL. Measured
invariants are listed in section 24.

- Scroll owner: the transcript sheet owns transcript overflow; the character's
  bubble owns its own overflow; the page owns none in the call.
- Safe-area owner: `.callscreen` remains the single owner of both call insets.
- Increased font behavior: the composition yields Marzi's size before it yields
  the character's line.

## 18. Performance budget

| Metric | Baseline | Maximum regression / target | Measurement environment | Evidence |
|---|---|---|---|---|
| Dependencies | 0 | 0 | repository | `package.json` unchanged |
| New observers | 0 | 1, bounded and disconnected on `pagehide` | Chromium | source |
| New timers/listeners/provider calls | 0 | 0 | Chromium | source, `M062-014` |
| Page errors during the matrix | 0 | 0 | Chromium 390×844 and 320×568 | browser evidence |

No framework, no dependency, no repeated full-screen rerender, and no
duplicated provider call, timer, listener, or handler was introduced.

## 19. Security/privacy

- Trust boundary unchanged. Dynamic transcript and identity content is still
  rendered through `esc`/`tappable`; no `innerHTML` path was added for dynamic
  content, verified by `M062-016`.
- No analytics, telemetry, tracker, cookie, remote form, upload, identifier, or
  network submission was added, verified by `M062-009`.
- The family-feedback process is documentation only. It collects nothing.
- No secret, token, account identifier, or production deploy command appears in
  any source or document, verified by `M062-017`.
- No raw transcript, audio, personal identity, or feedback is logged.
- Provider and prompt isolation unchanged.

## 20. Files permitted to change

- `docs/MARZI_MASTER_ROADMAP.md`
- `docs/packages/MARZI-062.md`
- `docs/staging/MARZI-062_STAGING_RUNBOOK.md`
- `docs/staging/MARZI-062_FAMILY_FEEDBACK.md`
- `public/index.html`
- `public/sw.js`
- `test/run.js`
- `test/browser/run.js`
- `test/marzi-062-visual-staging.js`

## 21. Files forbidden to change

- `server.js`
- `public/manifest.webmanifest`
- `public/icons/icon-192.png`, `public/icons/icon-512.png`
- `package.json` and every lockfile
- `.github/`
- `render.yaml` and every deployment or environment file
- `docs/learning/contracts/`
- `docs/learning/reviews/marzi-061/`
- `docs/MARZI_DECISION_REGISTER.md`
- every concept board and source artwork
- `main`, and every production service, domain, data store and configuration

Provider, prompt, `ConversationSession`, transcript-domain, storage,
learner-data, XP, coin, reward, streak, economy, evolution, outfit, Store and
Profile logic must not change, wherever it lives.

## 22. Implementation sequence

1. Verify branch, lineage, clean tree, protected main and the mandate artifact.
2. Inspect the allowed files, contracts, manifest, icons and deployment
   instructions once.
3. Capture baseline browser evidence before editing.
4. Implement the staging identity, then the call composition, then containment,
   then the cache bump, then documentation, validator and browser group.
5. Run one focused validation batch; repair root causes only.
6. Run one final complete validation batch.
7. Capture the after evidence and compare pairwise.
8. Audit scope and the protected diff.
9. One isolated commit, one push.
10. **Stop before deployment if the staging target cannot be proven.**

## 23. Automated tests

| Test ID | Layer | Behavior proven | Negative case | Failure signal | Command |
|---|---|---|---|---|---|
| T-01 | contract | 24 source contracts of this package hold | any contract removed | `MARZI062_*` | `node test/marzi-062-visual-staging.js` |
| T-02 | browser | rendered geometry, states and interaction paths | overlap, clipping, small target, missing state | `FAIL` line | `node test/browser/run.js marzi062` |
| T-03 | unit | presentation regressions in the Node suite | marker or composition removed | assertion | `node test/run.js` |
| T-04 | contract | MARZI-021 learning semantics unchanged | any contract edited | reason code | `node test/learning-contracts.js` |
| T-05 | contract | MARZI-061 structures and pending reviews unchanged | any review record edited | `M061_ER_*` | `node test/marzi-061-external-review-readiness.js` |

Source-text checks guard frozen symbols. They never substitute for rendered
measurement, and `test/marzi-062-visual-staging.js` says so in its own header.

## 24. Rendered-browser matrix

| Browser/context | Viewport | Locale/direction | Motion | Network/asset mode | Required measurements |
|---|---|---|---|---|---|
| Chromium top-level | 390×844 | en, es, German content, ar | normal | stubbed `/api/*`, portrait 200 | overflow, boxes, targets, focus, states |
| Chromium top-level | 320×568 | en, ar | normal | stubbed `/api/*` | as above, plus small-screen controls |
| Chromium top-level | 320×568 @200% | ar, German content | normal | stubbed `/api/*` | overflow, clipping, overlap, `Krankschreibung` |
| Chromium top-level | 390×844 @200% | en | normal | stubbed `/api/*` | text-scale hierarchy |

Text scale method: every absolute type token is doubled and the root font size
is set to 200%, with the resulting computed font size recorded. It is stated
explicitly because the shell's type tokens are absolute pixels, so an OS font
scale alone would not change them — a real finding that belongs to MARZI-050,
not to this preview.

## 25. Real-device matrix

| Device/context | OS/browser | Install mode | Input/accessibility mode | Scenario | Required evidence |
|---|---|---|---|---|---|
| Family Android phone | Android, Chrome | tab and installed | touch, device font scale | any call scenario | the family-feedback form |

**No real-device evidence has been collected by this package.** Emulated
Chromium is not a device. Device behavior — real font scale, real TalkBack, real
install — is exactly what the family preview exists to observe and what
MARZI-050 must qualify.

## 26. Regression requirements

- Each corrected defect (E-02 … E-06) is measured before and after at the same
  viewport, language, text scale, scenario and state.
- Every frozen contract in section 7 has a check.
- The existing application, learning-contract and MARZI-061 suites stay at their
  measured baseline counts.
- Interaction regressions cover word tap, translation, replay, slow repeat,
  timer, plan limits and transcript ownership.

## 27. Rollback strategy

`git revert <implementation-commit>`. One commit. No data migration, no learner
data deleted, no entitlement or economy value changed, no asset restored,
no history rewritten, never a reset or force push. The service worker reverts to
`telefontrainer-v37`, the activate handler deletes the preview cache, and the
runbook's reinstall steps apply unchanged. User impact during rollback is a
single shell refresh. Staging rollback targets `marzi-staging-r4a` only, by
restoring the prior known-good revision. See the runbook, section 11.

## 28. Evidence required

Implementation report with the full commit range; changed-file inventory; test
command outputs with exact counts; before/after rendered measurements and
screenshots with SHA-256; the text-scale method; overflow, target, focus, state
and overlap measurements; the staging preflight result; production non-change
evidence; and known limitations classified by type.

## 29. Stop conditions

The implementation is complete. **Deployment is stopped**, by design and by the
mandate's own rule.

The repository documents exactly one deployment convention — the Render
blueprint in `render.yaml`, which defines a single web service, `telefontrainer`,
the production service. No `marzi-staging-r4a` service, staging blueprint,
staging environment, staging credential, or deployment CLI exists in the
repository or the build environment. The mandate requires rejecting a deployment
when the repository lacks a staging procedure sufficient to distinguish staging
from production, and forbids using a production deploy command as a template
with an assumed argument changed. Both apply, so no deployment was attempted.

Unblocking this requires a separately authorized change to deployment
configuration, which is outside this package's allowed file scope.

## 30. Definition of done

Binary. MARZI-062 is done when all of the following hold:

1. MARZI-062 is allocated once, and MARZI-022, MARZI-024, MARZI-039, MARZI-040,
   MARZI-050 and MARZI-061 keep their identity.
2. Only the files in section 20 changed.
3. The build label `MARZI STAGING PREVIEW · MARZI-062 · BUILD MARZI-062-PREVIEW-1`
   is visible, accessibly named, non-intercepting, and readable at 320×568 and
   200% text.
4. At every matrix case: no horizontal document overflow, no critical element
   outside the viewport, no visible interactive target under 48×48, no critical
   overlap between the portrait's face region, Marzi, identity, state, the
   character's line and the controls.
5. `Krankschreibung` is unchanged and contained.
6. Transcript order, speaker ownership, word tap, translation, replay, slow
   repeat, timer and plan limits are unchanged and observed.
7. Listening, processing, speaking, disconnected and error each render with an
   icon, a text label and a non-colour cue.
8. Manifest and both icon binaries are byte-identical to the base commit.
9. The feedback template is complete, blank, privacy-minimal and claims nothing.
10. Application, learning-contract and MARZI-061 suites hold their measured
    counts; the MARZI-062 validator and browser group pass.
11. Provider, prompt, session, transcript-domain, storage, learning, economy,
    dependency, deployment-configuration, `main` and production diffs are empty.
12. One isolated commit, pushed normally, local `HEAD` equals remote `HEAD`.
13. Either the staging deployment targets `marzi-staging-r4a` and is verified,
    **or** the staging target could not be proven and that is reported as a
    blocker rather than worked around.

## 31. Independent review handoff

Codex receives: repository, branch, base SHA `e2e90925aa1b83ecaae4dbf0e39ccfade49546b1`,
the implementation SHA, the exact diff range, the changed-file list, the package
validator and browser check counts, the application and learning regression
counts, the before/after screenshot inventory with hashes, the staging preflight
result, and the explicit list of unverified claims and environment limitations.

Codex reviews the exact diff independently, distinguishes genuine application
defects from harness and environment limitations, does not modify the
implementation during review, and classifies findings as BLOCKER, HIGH, MEDIUM,
LOW or INFORMATIONAL.

Codex is asked to approve the preview for family feedback only. It is not asked
to approve merge, production, release, accessibility, education, linguistic or
specialist outcomes; every one of those gates remains pending.
