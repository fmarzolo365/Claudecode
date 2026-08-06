# MARZI — DESIGN AND EXPORT THE FAMILY VISUAL STAGING PREVIEW MANDATE

## ABSOLUTE ZERO-INTERRUPTION AND APPROVAL-MINIMIZATION POLICY

Complete this task with ZERO avoidable user interruptions.

Approval target: ZERO.

Maximum approval budget:

1. one consolidated bounded read-only repository-inspection operation;
2. one atomic mandate-export operation.

Do not request separate approvals for individual Git commands, file reads, searches, comparisons, checksums, or test inspection.

Do not use /review.
Do not modify repository files.
Do not commit or push.
Do not deploy.
Do not ask routine questions.
Do not provide intermediate progress reports.
Do not search outside the repository.
Do not inspect Android storage paths before final export.
Do not use tool-enabled subagents that repeat repository inspection.

Perform all required repository inspection through one consolidated bounded read-only operation.

After collecting evidence, perform all prioritization, architecture, scope design, acceptance design, and mandate drafting in memory.

Then use one atomic operation to export the final mandate, measure its byte count, and calculate its SHA-256.

────────────────────────────────────────
ROLE
────────────────────────────────────────

Act as the Principal Product, UX, Runtime Integration, Mobile, PWA, and Staging Architect for MARZI.

Create one definitive self-contained Claude Code implementation mandate for a:

FAMILY VISUAL STAGING PREVIEW SPRINT

The objective is to produce a safe staging build that the Product Owner and family can see, use, compare, and evaluate visually before broader runtime integration or production work continues.

This sprint must not be treated as production approval or release authorization.

────────────────────────────────────────
PACKAGE ID
────────────────────────────────────────

Inspect the canonical roadmap and package registry.

Determine the correct existing or next available package ID for this visual staging preview.

Do not invent an ID that conflicts with an existing package.

Do not renumber existing packages.

Do not reuse:

- MARZI-021;
- MARZI-022;
- MARZI-061;

for a different purpose.

The final mandate must use the resolved canonical package ID consistently in:

- package title;
- directory names;
- documentation;
- validator identifiers;
- test names;
- commit message;
- staging build identity;
- rollback;
- review handoff.

If the roadmap already assigns this work to a package, reuse that package.

If Product Owner approval is genuinely required because of a package conflict, produce a concise decision requirement rather than guessing.

────────────────────────────────────────
AUTHORITATIVE BASELINE
────────────────────────────────────────

Development branch:

claude/marzi-017-product-refinement

Current branch includes the final MARZI-061 approval record after:

63d7bbd

Resolve and record its full SHA.

Protected main:

7395cd0a75fc206077e19ecc60e4c1e978dd2c89

Target staging service:

marzi-staging-r4a

Production must remain untouched.

Read and respect:

- the canonical MARZI visual direction;
- MARZI-005 call-screen requirements;
- MARZI-021 approved learning-contract boundaries;
- MARZI-061 external-review readiness boundaries;
- current runtime architecture;
- existing PWA manifest and icons;
- existing staging/deployment conventions;
- existing provider, ConversationSession, transcript, rewards, economy, and routing contracts.

Do not create a parallel runtime architecture.

────────────────────────────────────────
PRIORITY ORDER
────────────────────────────────────────

The future Claude Code mandate must enforce this exact order.

## P0 — Safe staging delivery

Require:

- staging only;
- no production deployment;
- no main modification;
- no production environment variables changed;
- no production data touched;
- isolated implementation commit;
- isolated staging deployment;
- visible staging build identifier;
- exact rollback procedure;
- before/after screenshots;
- validation of the deployed staging URL;
- confirmation that production remains unchanged.

The family must be able to distinguish the staging build from any older installed PWA.

## P1 — Call-screen visual and usability implementation

Implement or complete the previously approved call-screen requirements:

- correct portrait/Marzi overlap;
- correct truncated identity text;
- keep the primary call screen usable at 390×844;
- avoid unnecessary page scrolling;
- keep interactive controls at least 48×48 CSS pixels;
- add or complete scenario cards;
- show a strong selected-scenario state;
- reuse existing characters and assets;
- create no new character or avatar;
- show the existing character identity data clearly;
- render transcript turns as left/right speech bubbles;
- preserve word tap and translation behavior;
- preserve slow repeat;
- preserve replay through TTS;
- preserve the current timer and plan limits;
- show listening, processing, speaking, disconnected, and error states with icon, text, and visual distinction;
- preserve ConversationSession;
- preserve providers;
- preserve AI prompt behavior;
- preserve rewards, XP, coins, economy, streaks, timer, translations, character switching, review flow, and current data contracts.

The screen must still feel like an educational game, not a generic chatbot or WhatsApp clone.

## P1 — Marzi branding and installable icon

Inspect the canonical existing Marzi assets.

When an approved canonical Marzi logo/icon asset already exists:

- create the required PWA icon sizes from that asset;
- preserve visual clarity at launcher size;
- use appropriate maskable safe zones;
- update manifest references;
- update applicable cache/version references;
- ensure the installed Android PWA uses the new icon after reinstall;
- document cache and reinstall verification.

Do not invent a new mascot design.

Do not generate a new character.

When no approved canonical icon asset exists, do not block the entire sprint. Preserve the current icon and report:

ICON ASSET APPROVAL REQUIRED

as a separate non-blocking branding handoff.

## P2 — Responsive and accessibility presentation

Require validation at minimum for:

- 390×844;
- 320×568;
- portrait orientation;
- 100% text;
- 200% text;
- Arabic RTL;
- long German strings;
- English;
- Spanish.

Resolve the known Arabic overflow at 320×568 with 200% text in this staging visual package, provided the correction can be implemented through bounded presentation changes without altering approved localized text.

Do not remove or rewrite the proper noun “Krankschreibung” merely to fit the layout.

Use robust wrapping, layout, sizing, containment, or responsive presentation rules.

Preserve:

- readable focus;
- logical content order;
- touch targets;
- state communication;
- contrast;
- reduced-motion compatibility where applicable;
- screen-reader labels where already supported;
- no critical content hidden behind controls.

Do not claim full accessibility or WCAG approval.

## P2 — Family feedback readiness

Add a staging-only evaluation package containing:

- build ID;
- commit ID;
- staging URL;
- device/browser field;
- screen or flow tested;
- scenario tested;
- visual issue;
- usability issue;
- confusing wording;
- favorite element;
- missing element;
- severity;
- screenshot reference;
- family member role without requiring a real name;
- date;
- follow-up status.

Do not add analytics, tracking, cookies, identifiers, or external telemetry.

Do not collect health, identity, voice, or personal conversation data.

The package may be documentation or a local static review form, as supported by the current architecture.

────────────────────────────────────────
STRICTLY OUT OF SCOPE
────────────────────────────────────────

Do not change:

- approved MARZI-021 completion semantics;
- learning thresholds;
- mastery rules;
- placement rules;
- scenario educational meaning;
- XP rules;
- coin rules;
- rewards;
- streak rules;
- economy;
- Marzi evolution stages;
- outfit ownership;
- purchase logic;
- learner storage schema;
- production translations;
- AI provider architecture;
- speech provider architecture;
- voice provider architecture;
- production environment configuration;
- production deployment;
- main;
- specialist-review records;
- linguistic-review decisions;
- accessibility-review decisions;
- Android-study results.

Do not create:

- new characters;
- new avatars;
- fake family feedback;
- fake accessibility evidence;
- fake reviewer approvals;
- fake participant data;
- automatic external-review decisions.

────────────────────────────────────────
VISUAL ACCEPTANCE CRITERIA
────────────────────────────────────────

The future mandate must include binary acceptance criteria for at least:

1. Staging URL loads successfully.
2. Production URL and production state are unchanged.
3. Build identifier is visible in staging.
4. The call screen fits and remains usable at 390×844.
5. The call screen remains usable at 320×568.
6. Required controls remain at least 48×48 CSS pixels.
7. No portrait/Marzi overlap obscures critical content.
8. Identity text is not unintentionally truncated.
9. Scenario selection is visually unmistakable.
10. Transcript bubble direction is correct.
11. Word tap and translation still work.
12. Slow repeat still works.
13. Replay/TTS still works.
14. Timer and current plan limits remain correct.
15. All required conversation states remain visible and distinguishable.
16. Arabic RTL at 320×568 and 200% text no longer produces the known critical overflow.
17. Long German text wraps without breaking core controls.
18. Existing application regression tests pass.
19. Existing learning-contract tests pass.
20. Runtime changes are limited to the explicitly authorized presentation and PWA scope.
21. No production deployment occurred.
22. The staging PWA reinstall procedure produces the expected icon when an approved icon asset exists.
23. Family feedback materials are present but contain no fabricated responses.

────────────────────────────────────────
VALIDATION REQUIREMENTS
────────────────────────────────────────

Require Claude Code to perform:

- one synchronization operation;
- one bounded inspection;
- one implementation pass;
- one focused validation batch;
- one final full validation batch;
- Chromium mobile walkthrough;
- responsive screenshots;
- staging deployment;
- post-deployment staging validation;
- production non-change verification;
- exact Git scope audit;
- one implementation commit;
- one normal push;
- one staging deployment only;
- one final report.

Require actual measured evidence for:

- syntax;
- conflict markers;
- application tests;
- learning-contract tests;
- package-specific tests;
- viewport checks;
- touch-target measurements;
- overflow checks;
- RTL checks;
- manifest validity;
- PWA icon references;
- service-worker/cache behavior;
- staging build identity;
- local/remote synchronization;
- production non-change;
- rollback readiness.

Do not claim a visual check passed merely because a unit test passed.

Require screenshots or equivalent browser evidence for the principal target viewports.

────────────────────────────────────────
GIT AND DEPLOYMENT POLICY
────────────────────────────────────────

Require:

- development branch only;
- no main modification;
- no merge;
- no rebase;
- no squash;
- no force push;
- no tag;
- no production deploy;
- no PR;
- one isolated implementation commit;
- one normal push;
- one staging deployment;
- clean working tree;
- local HEAD equals remote HEAD;
- ahead 0;
- behind 0.

The implementation commit message must use the resolved package ID and describe:

visual staging preview and family feedback readiness

The final report must contain:

- resolved package ID;
- baseline;
- mandate-transfer commit;
- implementation commit;
- staging deployment identifier;
- staging URL;
- local/remote synchronization;
- files changed;
- visual changes;
- icon disposition;
- viewport evidence;
- accessibility presentation evidence;
- tests;
- production non-change verification;
- screenshots produced;
- known remaining issues;
- family feedback instructions;
- rollback command;
- exact independent Codex-review handoff.

Successful implementation must end exactly:

STAGING PREVIEW COMPLETE — READY FOR FAMILY FEEDBACK

Otherwise:

CHANGES REQUIRED

or

BLOCKED

────────────────────────────────────────
OUTPUT
────────────────────────────────────────

Produce one complete self-contained Claude Code mandate titled with the resolved canonical package ID.

The mandate must not depend on this conversation.

Export it atomically to:

/sdcard/Download/<RESOLVED_PACKAGE_ID>_VISUAL_STAGING_CLAUDE_CODE_MANDATE.md

The atomic operation must:

1. write UTF-8;
2. flush and close;
3. measure the exact byte count;
4. calculate SHA-256;
5. confirm the repository was not modified.

Return only:

EXPORT COMPLETE

Package ID: <resolved ID>
Path: <actual path>
Bytes: <actual byte count>
SHA-256: <actual checksum>
Product Owner decision required: <YES or NO>
Approvals requested: <actual number, maximum 2>
Repository modified: NO

When a Product Owner decision is genuinely required, return:

EXPORT BLOCKED

Reason: <exact package or scope decision required>
Recommended option: <one concise recommendation>
Approvals requested: <actual number>
Repository modified: NO
