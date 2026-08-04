# MARZI-062 — Definitive Family Visual Staging Preview Implementation Mandate

## 1. Role and mission

You are Claude Code acting as MARZI’s senior Product, UX, runtime-integration, mobile, PWA, QA, and staging implementation engineer.

Implement MARZI-062 — Family Visual Staging Preview on the current development branch. Deliver one safe, visibly identifiable staging build that the Product Owner and family can use and compare before broader runtime integration or production work continues.

This is an implementation mandate. Do not stop after analysis or planning. Continue through bounded implementation, validation, one isolated commit, one normal push, one deployment to the named staging service, post-deployment verification, and one final report unless a hard blocker defined below occurs.

Implement the approved scope; do not redesign MARZI’s architecture, learning system, provider system, economy, data contracts, or product direction. Make routine technical decisions autonomously. Ask only when a hard blocker in this mandate makes safe progress impossible.

A successful result is a family-feedback staging preview. It is not approval to merge, release, deploy to production, certify educational quality, or claim accessibility compliance.

## 2. Authoritative repository state

Use these exact anchors:

- Development branch: claude/marzi-017-product-refinement
- Design-request transfer commit and starting repository HEAD: b2f038b9a4865077b0e891ef25f2f5bd05babd03
- Parent containing the final MARZI-061 approval record: 63d7bbd691b3386373f7c7288599f3a4b4d6b33d
- Protected main reference: 7395cd0a75fc206077e19ecc60e4c1e978dd2c89
- Staging service: marzi-staging-r4a
- Production: strictly out of scope and must remain untouched

At the beginning, synchronize once, resolve the commit containing this mandate if it has been transferred into the repository, and confirm that its lineage descends from b2f038b9a4865077b0e891ef25f2f5bd05babd03. Treat a mandate-transfer commit as an instruction artifact, not as an implementation change. The implementation comparison begins at that transfer commit; if there is no separate transfer commit, it begins at b2f038b9a4865077b0e891ef25f2f5bd05babd03.

Do not amend or rewrite any existing commit.

## 3. Canonical package resolution

The canonical registry assigns MARZI-020 through MARZI-061 exactly once. None is a family visual staging preview package:

- MARZI-024 owns the general environment and release-control architecture.
- MARZI-039 owns the full Call Shell, Controls, and Responsive Composition package.
- MARZI-040 owns Canonical Marzi Identity, Launcher, and Evolution.
- MARZI-050 owns full Accessibility, Responsive, and Android PWA Qualification.
- MARZI-061 owns External Review Readiness.
- MARZI-022 remains Domain Ownership and Event Contracts.

This sprint integrates a deliberately bounded visual subset for a disposable, non-production family preview. It must not masquerade as completion of MARZI-024, MARZI-039, MARZI-040, or MARZI-050.

The next unallocated canonical identifier is therefore:

MARZI-062 — Family Visual Staging Preview

This package assignment is authorized by the Product Owner’s request to use the correct existing or next available identifier. No further Product Owner package-number decision is required. Append MARZI-062 without renumbering, replacing, or weakening any existing package.

Use MARZI-062 consistently in the package title, package document, staging build identity, documentation, test identifiers, commit message, evidence, rollback, and independent-review handoff.

## 4. Zero-interruption execution protocol

Structure the work to minimize host-enforced approvals:

1. Fetch and synchronize once.
2. Use .ai/bin/repo-inspect once and reuse its structured result.
3. Use .ai/bin/commit-inspect and .ai/bin/file-inspect rather than SHA- or path-specific raw command families where they support the required read.
4. Inspect the correction-owned runtime, PWA, documentation, tests, assets, and deployment instructions once in one bounded batch.
5. Produce one concise internal plan.
6. Capture baseline browser evidence before editing.
7. Edit in coherent batches.
8. Run one focused validation batch, repair root causes, then run one final complete validation batch.
9. Create no intermediate commits and make no intermediate push.
10. Create one isolated MARZI-062 commit.
11. Push once normally.
12. Deploy once, and only to marzi-staging-r4a.
13. Validate staging and production non-change without issuing any production mutation.
14. Reuse all collected output in the final report.

Do not ask for routine command, path, viewport, port, test, or implementation choices. Repository policy cannot disable host-enforced dialogs, so use stable prefixes, direct argument arrays, batched operations, and cached results to minimize them.

Do not use shell evaluation or construct commands from untrusted data. Do not install dependencies. Do not access a paid service or a production secret.

## 5. Relationship to existing contracts

MARZI-062 is a presentation and staging integration package. Preserve all canonical contracts and behavior not expressly listed for visual presentation changes.

The following remain authoritative and must not regress:

- Learn, Talk, Store, Profile, and bottom navigation
- Android back behavior and native-history behavior
- ConversationSession ownership and cancellation
- AI provider abstraction
- speech/STT provider abstraction
- voice/TTS provider abstraction
- PromptBuilder and all prompt semantics
- transcript source, ordering, duplicate guards, and late-reply guards
- character switching and existing character identities
- word tapping and translation
- slow repeat
- replay through TTS
- timer, plan limits, and call termination
- review flow
- XP, coins, rewards, streaks, and economy
- Marzi evolution
- outfit ownership, equipped, locked, and purchasable states
- persistence and storage schema
- existing localization values
- MARZI-021 competency, evidence, mastery, placement, completion, review, and remediation contracts
- MARZI-061 external-review structures and pending review states
- current security and privacy boundaries
- existing regression behavior and canonical visual direction

Do not create a second state store, transcript, session controller, provider path, router, prompt builder, reward calculator, timer, localization source, or asset identity system.

## 6. Exact allowed file scope

Only the following repository paths may change:

- docs/MARZI_MASTER_ROADMAP.md
  - Append one MARZI-062 package entry and its dependency edges only.
  - Do not renumber or rewrite any existing package.
- docs/packages/MARZI-062.md
  - New canonical package document using the existing package template.
- docs/staging/MARZI-062_STAGING_RUNBOOK.md
  - New staging-only deployment, verification, cache, reinstall, rollback, production-protection, and evidence instructions.
- docs/staging/MARZI-062_FAMILY_FEEDBACK.md
  - New privacy-minimal family evaluation instructions and blank feedback template.
- public/index.html
  - Bounded call-screen presentation, staging-build identification, responsive behavior, semantic/accessibility presentation, and existing-handler wiring only.
- public/sw.js
  - Only the minimum existing cache/version update required to make the new staging shell observable after reinstall or refresh. Do not redesign caching.
- test/run.js
  - Only regression assertions necessary for the authorized presentation changes.
- test/browser/run.js
  - Only browser checks and evidence hooks for MARZI-062.
- test/marzi-062-visual-staging.js
  - New dependency-free, read-only, bounded package validator.

If an existing test convention requires putting the package validator under the repository’s already-established equivalent test subdirectory, use that existing location instead of creating a parallel test hierarchy, and record the resolved path in the report.

The authoritative mandate-transfer file, if committed, must not be edited by the implementation commit.

No other file may be staged. If a required change falls outside this list, stop unless it is only a path-equivalent adjustment demanded by an existing canonical repository convention and is still within documentation or test scope. Never generalize such an adjustment to runtime, deployment, dependencies, or production.

## 7. Files deliberately protected

Do not modify:

- server.js
- public/manifest.webmanifest
- current manifest-referenced icon files
- any concept board or source artwork
- package.json
- any lockfile
- .github/
- deployment configuration
- environment files
- providers
- prompts
- ConversationSession implementation
- transcript-domain implementation
- storage or learner-data schemas
- production localization strings
- learning contracts under docs/learning/contracts/
- MARZI-061 review artifacts or external-review decisions
- XP, coin, reward, streak, economy, evolution, outfit, store, or profile logic
- main
- production data, configuration, service, domain, or deployment

The expected provider, prompt, learning-contract, storage, economy, dependency, deployment-configuration, main, and production diffs are empty.

## 8. P0 — Safe staging delivery

### 8.1 Environment boundary

Use the repository’s existing documented deployment convention. Before deployment, resolve and display the target project, region, account context, and service name. The command must name marzi-staging-r4a explicitly.

Reject the operation before any deployment if:

- the resolved service is not exactly marzi-staging-r4a;
- the resolved environment is production;
- the command would alter a production environment variable, secret, route, domain, data store, or service;
- the command would deploy main rather than the reviewed development-branch commit;
- the repository lacks a documented staging procedure sufficient to distinguish staging from production.

Never use a production deploy command as a template with only an assumed argument changed.

### 8.2 Visible preview identity

Add a persistent, non-obscuring visible identity to the staging shell:

MARZI STAGING PREVIEW · MARZI-062 · BUILD MARZI-062-PREVIEW-1

Requirements:

- It is visible on first load and in the installed staging PWA.
- It does not cover content, intercept controls, or reduce a 48×48 target.
- It has an accessible name.
- It remains distinguishable at 320×568 and 200% text.
- It is presentation-only and does not enter learner state, analytics, prompts, transcripts, rewards, or persistence.
- It makes an old installed PWA visibly distinguishable from the MARZI-062 preview.
- The final report maps this checked-in build identity to the exact implementation commit and staging revision.

Do not add telemetry to obtain build identity.

### 8.3 Screenshots and evidence

Before editing, run the current application locally and capture the baseline call screen to a task-owned directory under:

/tmp/marzi-062-visual-staging/before/

After implementation, capture equivalent evidence under:

/tmp/marzi-062-visual-staging/after/

Use identical viewport, language, text-scale, scenario, and state settings for before/after pairs. Record filenames, dimensions, state, commit, and SHA-256 in the package evidence. Do not stage temporary screenshots as product assets. Do not expose conversations, names, voices, credentials, or personal data.

### 8.4 Production non-change proof

Before deployment, record the production reference named in canonical deployment documentation using read-only metadata only. After the staging deployment, verify that:

- no production deployment command ran;
- production service revision/configuration is unchanged;
- production URL behavior or its version marker remains unchanged, where the canonical environment exposes one safely;
- protected main remains 7395cd0a75fc206077e19ecc60e4c1e978dd2c89;
- the staging revision points to the exact MARZI-062 implementation commit.

If production non-change cannot be measured without mutating or accessing secrets, report the bounded evidence available and do not claim stronger verification.

## 9. P1 — Call-screen visual and usability implementation

All work in this section belongs in the existing call surface in public/index.html. Reuse the current DOM, state, event handlers, translation functions, character records, and CSS design tokens.

### 9.1 Portrait, Marzi, and identity composition

Correct the approved call-screen defects without changing identity data:

- Reserve independent layout regions for the active character portrait, Marzi, identity text, call state, transcript, and controls.
- Prevent the portrait and Marzi from obscuring one another or any critical text/control at the required viewports.
- Do not render an emoji or status mark over the character’s face.
- Keep Marzi present as the established learning companion rather than a tiny badge, while bounding Marzi so the transcript and controls remain usable.
- Display the existing character name and existing role/scenario identity clearly.
- Use min-width: 0, wrapping, logical sizing, and bounded line behavior so identity text is not unintentionally clipped or ellipsized.
- Provide the full existing identity through accessible text; do not invent a title, biography, character, or avatar.
- Preserve the latest character utterance while the system is processing until a later utterance replaces it.
- Use only existing approved runtime assets and fallbacks.

Binary geometry criterion: for each required viewport/state, the portrait, Marzi, identity, state label, transcript, and controls have non-overlapping critical bounding boxes, and no critical box is outside the viewport or its intended scroll container.

### 9.2 Scenario cards

Implement or complete scenario selection using the existing scenario identities and selection handler:

- Render each currently available scenario as a rounded educational-game card.
- Show its existing localized title and existing identity/character association.
- Preserve stable scenario IDs and the current selection event.
- Do not add, remove, reorder semantically, relabel, or rewrite learning scenarios.
- Selected state must have at least two cues: a non-color cue such as checkmark/border/label plus MARZI green styling.
- Expose selected state programmatically with the appropriate current-control semantic.
- Keep every selectable card at least 48×48 CSS pixels.
- Keyboard activation and focus must invoke the same existing selection path as pointer activation.

### 9.3 Transcript bubbles

Present canonical transcript turns as speech bubbles without changing the transcript source:

- Character turns occupy inline-start and learner turns occupy inline-end in a deliberate, consistent conversational layout.
- In left-to-right presentation this reads as left/right speech bubbles.
- RTL presentation uses logical properties and preserves clearly distinguishable speaker ownership.
- Speaker identity is available to assistive technology and is not conveyed by color or side alone.
- Preserve exact turn order, duplicate suppression, late-reply protection, word-token behavior, corrections, and translations.
- Word tapping must continue to open the existing translation behavior.
- Replay must invoke the existing TTS path.
- Slow repeat must invoke the existing slow-repeat path.
- Do not transform transcript text into HTML. Continue using safe text rendering.

The transcript, not the whole primary page, owns overflow when content grows. Bound transcript growth/presentation according to the existing contract; do not introduce a second history store.

### 9.4 Conversation states

Show each current state with an icon, text label, and a non-color visual cue:

- listening
- processing
- speaking
- disconnected
- error

Preserve any existing connecting, idle, ended, retry, or offline states and integrate them consistently.

Requirements:

- Only state presentation changes; ConversationSession remains authoritative.
- State text comes from existing localization infrastructure when such a key exists.
- No state is inferred from animation alone.
- Status changes use the existing appropriate live-region behavior without repeatedly announcing stable transcript content.
- Reduced-motion users receive the same meaning without required animation.
- Error and disconnected states retain the existing safe recovery actions.
- The timer, plan limits, hang-up behavior, cancellation, and Android back behavior remain unchanged.

### 9.5 Visual language

Preserve canonical MARZI presentation:

- cream background;
- MARZI green for primary actions, progress, and selection;
- rounded cards and controls;
- clear, readable hierarchy;
- cartoon-only illustration language;
- existing characters and Marzi;
- no photorealism;
- no generic chatbot, WhatsApp, corporate dashboard, or social-messenger treatment;
- no newly invented mascot, character, avatar, or production artwork.

Reuse existing design tokens before introducing a narrowly scoped token. Avoid unrelated restyling of Learn, Store, Profile, or other screens.

## 10. P1 — Marzi branding and installable icon disposition

The canonical baseline does not contain a rights-approved, crop-ready Marzi launcher/logo asset. Canonical documentation explicitly classifies launcher assets as ASSET REQUIRED and prohibits fabricating production art or cropping a concept board.

Therefore the MARZI-062 implementation must:

- preserve public/manifest.webmanifest;
- preserve every current manifest icon reference and icon binary;
- preserve the current installed icon;
- not crop 01_home.png, 04_progress.png, any concept board, screenshot, or character art into an icon;
- not generate a mascot or logo;
- not infer approval from an asset’s presence;
- document current cache/reinstall behavior and the steps that will be required once an approved source asset exists;
- place the following exact non-blocking handoff in the package document and final report:

ICON ASSET APPROVAL REQUIRED

This missing asset does not block the visual staging preview because the visible MARZI-062 staging-build label distinguishes the preview. Acceptance of a new launcher icon is NOT APPLICABLE for this implementation. Manifest validity and unchanged icon-reference integrity must still pass.

If an actually approved launcher asset is added by a separately authorized Product Owner asset decision before implementation starts, stop and obtain a revised mandate rather than silently expanding this package.

## 11. P2 — Responsive and accessibility presentation

### 11.1 Required matrix

Validate the call screen in portrait at minimum:

| Case | Viewport | Text scale | Language/direction | Required focus |
|---|---:|---:|---|---|
| V01 | 390×844 | 100% | English, LTR | primary family preview |
| V02 | 390×844 | 100% | Spanish, LTR | expansion and state labels |
| V03 | 390×844 | 100% | German, LTR | long scenario identity |
| V04 | 390×844 | 100% | Arabic, RTL | logical layout |
| V05 | 320×568 | 100% | English, LTR | small-screen controls |
| V06 | 320×568 | 100% | Arabic, RTL | small-screen direction |
| V07 | 320×568 | 200% | Arabic, RTL | known overflow regression |
| V08 | 320×568 | 200% | German, LTR | long-word containment |
| V09 | 390×844 | 200% | English, LTR | text-scale hierarchy |

Also exercise the exact proper noun “Krankschreibung” in its canonical context. Do not remove, abbreviate, transliterate, or rewrite it to make a test pass.

### 11.2 Measured layout invariants

For every applicable matrix case:

- documentElement.scrollWidth is no greater than documentElement.clientWidth, allowing only a one-CSS-pixel measurement tolerance;
- no critical element has a bounding edge outside the visual viewport;
- no critical element is hidden behind fixed controls, the bottom navigation, or safe-area insets;
- visible interactive targets have both measured width and height of at least 48 CSS pixels;
- identity text is readable and not unintentionally truncated;
- scenario selection remains visually and programmatically clear;
- transcript has an intentional scroll container when needed;
- the primary call shell does not introduce unnecessary page-level scrolling at 390×844;
- content order and focus order remain logical;
- focus is visible;
- contrast remains at least as strong as the current canonical tokens and is measured for new combinations;
- state meaning does not depend on color;
- RTL uses logical alignment and does not reverse transcript chronology;
- the software keyboard does not permanently obscure the active control or input;
- reduced motion preserves state meaning;
- screen-reader labels and live status remain meaningful;
- safe-area padding works at top, bottom, inline-start, and inline-end.

At 320×568 with 200% Arabic text, resolve MARZI-A11Y-KNOWN-001 through bounded presentation changes such as wrapping, min/max sizing, containment, flexible tracks, scroll ownership, or responsive composition. Do not change approved localized text. Update the MARZI-062 package evidence to state that this staging regression is resolved technically in the preview; do not rewrite MARZI-061 review history or claim independent accessibility approval.

Do not claim WCAG conformance, accessibility approval, native-device approval, or production readiness. Those gates remain pending.

## 12. P2 — Family feedback readiness

Use documentation, not runtime collection, for family feedback. Create docs/staging/MARZI-062_FAMILY_FEEDBACK.md as a blank, copyable review form and concise usage guide.

It must contain these fields:

- build ID
- implementation commit ID
- staging URL
- device and browser
- screen or flow tested
- scenario tested
- visual issue
- usability issue
- confusing wording
- favorite element
- missing element
- severity
- screenshot reference
- family member role, without requiring a real name
- review date
- follow-up status

Allowed severity values:

- BLOCKING
- HIGH
- MEDIUM
- LOW
- SUGGESTION

Allowed follow-up values:

- NEW
- TRIAGED
- ACCEPTED
- DEFERRED
- RESOLVED
- NEEDS RECHECK

Requirements:

- Ship the template blank.
- Include an explicit instruction not to enter names, email addresses, health information, voice recordings, credentials, private conversation content, or other personal data.
- Do not add analytics, telemetry, trackers, cookies, remote forms, uploads, identifiers, or network submission.
- Do not infer Product Owner approval from feedback.
- Do not fabricate a response, screenshot reference, family member, date, severity, issue, outcome, or sign-off.
- Explain how the family can identify the correct build label and how to report an old cached PWA.
- Separate observations from implementation decisions.
- State that family review is informal product feedback, not specialist, accessibility, legal, security, release, or production approval.

The package validator must reject a committed template that contains a populated response or an approval claim.

## 13. Documentation and roadmap work

Create docs/packages/MARZI-062.md from the canonical package template. It must include:

- objective and bounded preview purpose;
- dependencies and relationships to MARZI-024, MARZI-025, MARZI-026, MARZI-029, MARZI-039, MARZI-040, MARZI-050, and MARZI-061;
- explicit statement that it does not complete or supersede those packages;
- exact allowed and prohibited scopes;
- P0/P1/P2 priority order;
- visual, mobile, accessibility-presentation, PWA, privacy, security, test, deployment, rollback, evidence, and stop gates;
- icon disposition and exact ICON ASSET APPROVAL REQUIRED handoff;
- open human-review and asset gates;
- production prohibition;
- family-feedback boundaries;
- binary definition of done.

Append MARZI-062 to docs/MARZI_MASTER_ROADMAP.md with one unique ID and title. Add only the edges required to express that MARZI-062 consumes existing canonical visual/call/environment requirements and does not unblock production. Do not alter the meaning, ID, title, numbering, completion status, or ownership of MARZI-020 through MARZI-061.

Create docs/staging/MARZI-062_STAGING_RUNBOOK.md with:

- exact staging service;
- environment preflight;
- build-label check;
- local test procedure;
- one-deploy procedure using the existing canonical command;
- staging URL verification;
- installed-PWA cache/reinstall steps;
- unchanged-icon expectation;
- before/after screenshot matrix;
- production non-change check;
- staging revision rollback;
- Git revert rollback;
- privacy-safe evidence fields;
- emergency stop conditions.

Do not put secrets, tokens, account identifiers, or production mutation commands into documentation.

## 14. Package-specific validator

Create a dependency-free Node validator named for MARZI-062 at test/marzi-062-visual-staging.js, or the exact equivalent existing test location.

The validator must be deterministic, read-only, network-free, bounded to repository inputs, free of eval/new Function/node:vm, and must not execute repository content dynamically.

It must report structured PASS/FAIL output, check names, failures, warnings, files inspected, and an exact check count.

At minimum it must verify:

1. MARZI-062 appears exactly once in the roadmap.
2. MARZI-062 does not replace or rename MARZI-022, MARZI-039, MARZI-040, MARZI-050, or MARZI-061.
3. The package document and both staging documents exist and are non-empty.
4. The allowed-file and prohibited-file contracts are documented.
5. The visible build ID contains MARZI-062 and MARZI-062-PREVIEW-1.
6. Family-feedback fields and enum values are complete.
7. The committed feedback form is blank and contains no approval.
8. The privacy exclusions are present.
9. No analytics, telemetry, remote form, or upload endpoint was added for feedback.
10. No new character/avatar reference or generated art path was added.
11. Manifest and current icon files are unchanged from the implementation baseline.
12. The exact ICON ASSET APPROVAL REQUIRED handoff is present.
13. Existing scenario IDs and learning content are unchanged.
14. Existing provider, prompt, transcript, storage, reward, economy, and timer contracts are unchanged outside authorized presentation wiring.
15. Required state labels and semantic hooks exist.
16. Existing word-tap, translation, replay/TTS, and slow-repeat handlers remain wired.
17. No hard-coded production URL, credential, token, secret, or production deploy command was added.
18. No prohibited file changed in the implementation range.
19. The mandate-transfer artifact is unchanged.
20. Temporary screenshots are not staged as application assets.
21. Service-worker changes, if any, are limited to the existing cache/version lifecycle.
22. The roadmap and package do not claim production, merge, release, accessibility, specialist, linguistic, or Android-study approval.

Use deterministic failure codes prefixed MARZI062_. Do not claim a source-text check proves rendered layout. Rendered checks belong to the browser suite.

Add focused regression fixtures or source mutations only when the existing test convention supports isolated, automatically restored mutation checks. Prove at least the package-ID uniqueness, build-ID removal, forbidden manifest/icon change, fake feedback, production-target drift, and protected-contract drift checks. Mutations must operate on isolated in-memory or task-owned temporary copies, never canonical repository files.

## 15. Browser and interaction validation

Use the existing browser harness and .ai/bin/browser-inspect. Do not install Playwright or Chromium automatically.

Before running a browser check, start the existing local server on localhost only. Use a task-specific temporary output directory. Exercise real DOM behavior; do not treat source-string assertions as visual evidence.

For the required matrix and conversation states, report:

- URL and build label;
- viewport and device-pixel ratio;
- language and direction;
- text-scale method and measured computed font size;
- document and viewport dimensions;
- horizontal-overflow measurement;
- page-level vertical-scroll measurement;
- transcript scroll measurement;
- critical bounding boxes;
- all interactive target dimensions;
- focus order and visible-focus result;
- selected-scenario semantic and visual cues;
- portrait/Marzi intersection result;
- identity clipping result;
- transcript speaker alignment;
- state label, icon, live-region, and reduced-motion result;
- word tap/translation behavior;
- replay/TTS call path;
- slow-repeat call path;
- timer and plan-limit result;
- keyboard-safe result where applicable;
- screenshot path and SHA-256.

Capture at minimum:

- baseline and final call screen at 390×844 English;
- baseline and final call screen at 320×568 Arabic RTL at 200%;
- final 320×568 German at 200% showing Krankschreibung;
- final scenario selected state;
- final listening, processing, speaking, disconnected, and error states.

A visual criterion passes only from browser evidence. If the browser dependency is unavailable, stop before deployment and report BLOCKED; do not replace visual evidence with source inspection.

## 16. Security, privacy, performance, and PWA constraints

### Security and privacy

- No secrets in source, screenshots, logs, docs, or report.
- No paid or production service calls during local validation.
- No arbitrary HTML injection or use of innerHTML for dynamic transcript/identity content.
- Sanitize or text-render all dynamic content using the existing safe path.
- No raw transcript, audio, personal identity, or family feedback logging.
- No external feedback endpoint or analytics.
- Preserve existing CSP and provider boundaries where present.
- Failure states reveal no internal provider detail or credential.

### Performance

- Do not add a framework or dependency.
- Avoid repeated full-screen rerenders.
- Do not duplicate provider calls, timers, listeners, observers, or event handlers.
- Cancel or detach presentation observers/listeners with the existing lifecycle.
- Keep transcript rendering bounded by the existing contract.
- Do not block initialization on screenshots, feedback, or build metadata.
- Measure that call-state interaction remains responsive in the target mobile browser.
- Ensure animation respects reduced motion.

### PWA

- Validate manifest JSON and every icon reference even though icon files remain unchanged.
- Validate public/sw.js syntax.
- If public/sw.js changes, prove only the cache/version identifier or current allowlist changed as required, no API/provider response becomes cached, and a stale staging PWA updates predictably.
- Document uninstall/reinstall and cache-clearing behavior.
- Do not claim the unchanged icon is new.
- Keep staging and production cache identity distinguishable through the visible preview build and existing origin separation.

## 17. Validation sequence

Run this sequence, preserving actual commands, exact counts, and PASS/FAIL output.

### Phase A — one preflight and baseline

1. Read AGENTS.md and .ai/EXECUTION_POLICY.md.
2. Synchronize origin once and fast-forward only the current development branch when clean and required; no merge commit and no rebase.
3. Run .ai/bin/repo-inspect --fetch --json once; cache its output.
4. Verify branch, baseline/transfer lineage, clean tree, local/remote status, protected main, and staging service documentation.
5. Inspect all allowed files, referenced contracts, current manifest/icon files, and deployment instructions once.
6. Run baseline application, learning-contract, MARZI-061, conflict-marker, syntax, and documentation checks once.
7. Record the known nine-failure documentation-validator baseline exactly if it remains the pre-existing MARZI-GOV-001 issue; do not repair it in this package.
8. Capture baseline screenshots and DOM measurements.

### Phase B — one implementation pass

Implement documentation, roadmap allocation, build identity, call presentation, responsive/accessibility presentation, cache-version adjustment if necessary, package validator, and browser tests in coherent batches. Do not micro-test after every edit.

### Phase C — focused validation

Run once:

- node --check for every changed JavaScript file and extracted inline script using the repository’s established method;
- node test/marzi-062-visual-staging.js;
- the focused browser MARZI-062 group;
- JSON parse of public/manifest.webmanifest;
- service-worker/cache checks;
- targeted interaction regressions;
- viewport/RTL/text-scale matrix;
- screenshot capture.

Repair root causes only. Do not weaken criteria, delete fixtures, hide overflow, reduce target requirements, alter translations, or update expected output merely to force PASS.

### Phase D — final complete validation

Run once after corrections:

- conflict-marker validation: PASS;
- JavaScript syntax: PASS;
- full existing application suite: preserve the baseline count and PASS all checks;
- learning-contract suite: preserve 36/36 unless the measured canonical baseline differs, in which case explain rather than assume;
- MARZI-061 external-review validator: preserve 30/30 unless the measured canonical baseline differs;
- MARZI-062 validator: PASS every reported check;
- browser target matrix: PASS every required visual/interaction criterion;
- manifest validity and unchanged icon references: PASS;
- service-worker/cache behavior: PASS;
- git diff --check: PASS;
- documentation validation: no new failure and the exact approved MARZI-GOV-001 baseline exception only;
- no conflict markers;
- scope audit: only allowed files;
- provider/prompt/transcript-domain/storage/learning/economy/dependency/deployment-configuration/main diffs: EMPTY;
- production mutation: NONE;
- temporary screenshot files staged: NONE.

Report actual counts. Do not claim a test ran when it was inferred or skipped.

### Phase E — commit, push, and one staging deployment

Only after all local gates pass:

1. Inspect the final diff and stage only allowed files.
2. Create exactly one isolated implementation commit:

   MARZI-062: add visual staging preview and family feedback readiness

3. Push the current development branch normally once. Do not force push.
4. Confirm a clean tree and local/remote ahead 0, behind 0.
5. Deploy exactly that commit once to marzi-staging-r4a using the canonical staging command.
6. Do not deploy an uncommitted tree or a different SHA.
7. Validate the deployed staging URL, visible build label, principal browser matrix, service-worker update, and installed-PWA distinction.
8. Reconfirm production non-change and protected main.
9. Do not merge, open a PR, tag, publish, or deploy production.

If deployment fails, preserve the committed and pushed work, execute no production fallback, and report BLOCKED with the exact staging failure and rollback status.

## 18. Binary acceptance criteria

MARZI-062 is complete only when every applicable criterion is PASS:

1. The branch and exact baseline/mandate lineage are verified.
2. MARZI-062 is allocated once without renumbering or changing another package.
3. Only allowed files changed.
4. The implementation commit is isolated and reversible.
5. The staging deployment targets only marzi-staging-r4a.
6. The deployed staging URL loads successfully.
7. Production service, configuration, data, URL behavior, deployment, and main remain unchanged to the bounded extent measured.
8. MARZI-062-PREVIEW-1 is visible and accessible in staging.
9. The family can distinguish the preview from an older installed PWA.
10. The call screen is usable at 390×844 without unnecessary page-level scrolling.
11. The call screen is usable at 320×568.
12. Every visible required control measures at least 48×48 CSS pixels.
13. Portrait and Marzi do not obscure each other or critical content.
14. Existing identity text is readable and not unintentionally truncated.
15. Scenario selection is unmistakable visually and programmatically.
16. Transcript turn order remains canonical and speakers render as distinct logical speech bubbles.
17. Word tap and translation invoke the preserved behavior.
18. Slow repeat invokes the preserved behavior.
19. Replay invokes the preserved TTS behavior.
20. Timer and plan limits match the baseline contract.
21. Listening, processing, speaking, disconnected, and error each have icon, text, and a non-color cue.
22. Arabic RTL at 320×568 and 200% text has no critical horizontal overflow or obscured control.
23. Krankschreibung remains unchanged and fits through robust layout behavior.
24. Focus, content order, keyboard behavior, safe areas, contrast, reduced motion, and state announcements meet the measurable presentation requirements.
25. The family-feedback template is complete, blank, privacy-minimal, and contains no fabricated response.
26. Current manifest and icon assets are unchanged.
27. ICON ASSET APPROVAL REQUIRED is recorded as a non-blocking branding handoff.
28. Existing application tests all pass at the preserved measured count.
29. Learning-contract tests pass and approved MARZI-021 semantics are unchanged.
30. MARZI-061 structures and pending external reviews are unchanged.
31. MARZI-062 package-specific source and browser tests all pass.
32. Manifest, service worker, cache/update, conflict-marker, syntax, and diff-whitespace checks pass.
33. No new documentation-validator failure is introduced.
34. Provider, prompt, session, transcript-domain, persistence, rewards, economy, dependencies, deployment configuration, main, and production diffs are empty.
35. Before/after screenshots and DOM measurements exist for the required evidence cases.
36. The implementation commit is pushed normally and local HEAD equals remote HEAD with ahead 0 and behind 0.
37. The deployed staging revision maps to the exact implementation commit.
38. No merge, rebase, squash, force push, tag, PR, production deploy, publication, or release occurred.
39. No unsupported accessibility, specialist, linguistic, Android, production, or release approval is claimed.
40. Rollback is documented and executable without deleting learner data.

A conditional launcher-icon replacement criterion is NOT APPLICABLE because no approved launcher source asset exists at the authoritative baseline.

## 19. Rollback

Make the implementation independently reversible.

Record:

- the exact MARZI-062 implementation commit;
- its exact parent;
- the exact staging revision created;
- the prior known-good staging revision;
- whether public/sw.js changed;
- the cache name/version before and after;
- the staging URL and build label before and after.

Code rollback command:

git revert <exact-MARZI-062-implementation-commit>

Do not execute rollback during successful delivery.

Staging rollback must use the repository’s documented service-revision procedure and target only marzi-staging-r4a. Restore or route to the prior known-good staging revision, verify its build marker, and leave production untouched.

Rollback must:

- require no data migration;
- delete no learner data;
- change no entitlement or economy value;
- preserve MARZI-021 and MARZI-061 artifacts;
- preserve all historical commits;
- account for the staging PWA cache by documenting refresh/unregister/reinstall steps;
- never use reset, history rewriting, or force push.

## 20. Hard stop conditions

Stop only if:

- the expected baseline or mandate-transfer lineage is absent;
- the current branch is not claude/marzi-017-product-refinement;
- unrelated working-tree changes cannot be isolated safely;
- MARZI-062 has been allocated to a different canonical purpose after this mandate;
- the required visual fix would require changing a prohibited learning, provider, prompt, storage, economy, dependency, production, or external-review contract;
- the existing staging procedure cannot unambiguously target marzi-staging-r4a without production risk;
- the browser dependency is unavailable and required visual evidence cannot be collected;
- the target staging service is absent or deployment authentication fails after the isolated commit is safely created;
- a critical test or scope gate remains failed after root-cause correction;
- production non-change cannot be protected.

Do not stop because:

- no approved launcher asset exists;
- learning-specialist review is pending;
- linguistic review is pending;
- accessibility review is pending;
- moderated Android study is pending;
- production approval is pending;
- deployment to production is prohibited;
- routine CSS, semantic, test, documentation, or staging decisions are needed.

## 21. Final implementation report

Produce one self-contained report containing:

- package status;
- resolved package ID and title;
- branch;
- design baseline;
- mandate-transfer commit;
- implementation parent;
- implementation commit;
- local HEAD;
- remote HEAD;
- ahead/behind;
- protected-main SHA;
- staging service;
- staging deployment revision/identifier;
- staging URL;
- visible build identity;
- files created;
- files modified;
- files deliberately untouched;
- roadmap allocation;
- visual changes;
- call-screen changes;
- preserved runtime contracts;
- icon disposition and exact ICON ASSET APPROVAL REQUIRED handoff;
- before/after screenshot inventory and hashes;
- viewport, RTL, 200%-text, touch-target, overflow, focus, keyboard, safe-area, contrast, reduced-motion, and state evidence;
- interaction regression evidence for word tap, translation, slow repeat, replay/TTS, timer, plan limits, character switching, and Android back behavior;
- syntax, conflict-marker, application, learning-contract, MARZI-061, MARZI-062, manifest, service-worker, and documentation validation results with exact counts;
- scope audit;
- provider/prompt/session/transcript-domain/storage/learning/economy/dependency/configuration/deployment/main diff results;
- production non-change evidence;
- family feedback instructions and privacy boundaries;
- known limitations;
- pending asset and human-review gates;
- push result;
- local/remote synchronization;
- rollback command and staging rollback procedure;
- confirmation that no production deployment, merge, PR, tag, release, or main modification occurred.

Distinguish independently executed tests from inspected or inferred evidence. Never claim production readiness, accessibility compliance, educational approval, specialist approval, linguistic approval, Android-study completion, merge authorization, or release authorization.

## 22. Independent Codex review handoff

End the report with a copy-ready read-only review request containing:

- branch claude/marzi-017-product-refinement;
- exact implementation parent;
- exact MARZI-062 implementation commit;
- exact diff range;
- exact staging revision and URL;
- protected main 7395cd0a75fc206077e19ecc60e4c1e978dd2c89;
- mandate-transfer file, byte count, and SHA-256;
- complete changed-file list;
- package-specific check counts;
- application and learning regression counts;
- screenshot inventory and hashes;
- request to verify every binary acceptance criterion;
- request to confirm the deployed staging revision equals the reviewed commit;
- request to confirm production, main, dependencies, provider/prompt/session/transcript-domain/storage/learning/economy, and deployment configuration remain unchanged;
- request to classify findings as BLOCKER, HIGH, MEDIUM, LOW, or INFORMATIONAL;
- instruction to return APPROVED FOR FAMILY FEEDBACK only when no BLOCKER or HIGH finding remains and staging evidence is genuine.

Do not ask Codex to approve merge, production, release, accessibility, education, or specialist outcomes.

The implementation report must end with exactly one of:

STAGING PREVIEW COMPLETE — READY FOR FAMILY FEEDBACK

CHANGES REQUIRED

BLOCKED
