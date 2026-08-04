# Marzi Master Roadmap

**Status:** Proposed definitive implementation sequence

**Package range:** MARZI-020 through MARZI-061

**Authority:** Product Owner approves product/economy/art/commercial decisions; Codex specifies and independently reviews; Claude Code implements approved packages.

**Supersession:** This document supersedes every earlier MARZI-020+ roadmap, queue, sequence, or package description. Where an older document conflicts with this roadmap, this document governs after Product Owner approval.

## Execution rules

- No package starts before its prerequisites and approval gate are satisfied.
- Every package receives a package specification based on `docs/MARZI_PACKAGE_TEMPLATE.md`.
- One coding agent may modify application files at a time.
- “Parallel: yes” permits independent discovery, art, content, test preparation, or isolated work; application integration remains serialized.
- Every implementation updates an implementation report and produces reproducible evidence.
- Every application defect receives a regression test.
- No package may silently change a frozen contract, economy rule, asset decision, entitlement, privacy promise, or approved scope.
- Main remains protected. Staging and independent review precede merge; release qualification precedes production.

## Relative implementation size

| Size | Meaning |
|---|---|
| XS | Focused documentation or isolated change |
| S | Small bounded package |
| M | Multi-area package with moderate integration |
| L | High-impact cross-component package |
| XL | Program-scale package requiring specialist or external work |

# Foundation

## MARZI-020 — Canonical Product and Architecture Contracts

- **Objective:** Persist one authoritative product, architecture, governance, and roadmap contract before runtime work begins.
- **Problem solved:** The branch contains older, incompatible decisions and no repository-canonical MARZI-019/019A program contract.
- **Why it exists:** Every later package otherwise risks implementing a different interpretation of Marzi.
- **Prerequisites:** Clean development branch; Product Owner accepts MARZI-019A as the proposed replacement roadmap.
- **Dependencies:** Existing `docs/DECISIONS.md`, `docs/DESIGN_SYSTEM.md`, asset specifications, implementation report, current source contracts, Product Owner decisions.
- **Packages unblocked:** MARZI-021 through MARZI-060.
- **Exact deliverables:** This roadmap; Product Bible; Decision Register; Package Template; Program Governance; superseding ADR/contract plan; frozen-contract inventory; unresolved-decision gates.
- **Expected files/areas:** Documentation only: `docs/MARZI_*.md`, `docs/packages/MARZI-020.md`; future `.ai/` synchronization is separately authorized.
- **Measurable acceptance criteria:** All 42 package IDs appear once; active conflicts are identified; Product Owner decisions remain unresolved unless approved; runtime diff is empty; prior roadmaps are explicitly superseded.
- **Required automated tests:** Markdown non-empty check; package-ID uniqueness/coverage; Mermaid node coverage; link/path checks; `git diff --check`; documentation-only diff check.
- **Required real-device tests:** None; this package changes no runtime.
- **Product-owner approval gate:** Approve the Product Bible, definitive package sequence, frozen contracts, and decision ownership before MARZI-021 implementation.
- **Asset dependency:** None; records asset gates only.
- **Economic-system dependency:** None; freezes current thresholds/prices until later approval.
- **Security/privacy impact:** Documents ownership and future gates; no data processing.
- **Accessibility/localization impact:** Establishes mandatory governance, no runtime behavior.
- **Implementation risk:** Low technical, Critical governance if incomplete.
- **Rollback strategy:** Revert the documentation-only commit; no runtime or data rollback.
- **Estimated engineering effort:** S.
- **Can run in parallel:** No; root prerequisite.
- **Completion evidence required:** Clean documentation-only diff, validation transcript, commit SHA, independent Codex review, Product Owner approval.

## MARZI-021 — Learning Competency, Curriculum, and Mastery Model

- **Objective:** Define what Marzi teaches and the evidence required for participation, completion, mastery, and review.
- **Problem solved:** Current scenarios and XP do not share a validated learning model.
- **Why it exists:** Reward, placement, assistance, and recommendations cannot be trustworthy without pedagogical definitions.
- **Prerequisites:** MARZI-020 approved.
- **Dependencies:** CEFR principles, current scenario inventory, target-language content, learning specialist.
- **Packages unblocked:** MARZI-028, MARZI-031, MARZI-034, MARZI-037, MARZI-043, MARZI-044, MARZI-056, MARZI-057, MARZI-060.
- **Exact deliverables:** Competency taxonomy; scenario objective schema; prerequisite graph; meaningful-attempt definition; partial/full completion; mastery confidence; placement model; review rules; assistance-sensitive evidence contract.
- **Expected files/areas:** `docs/learning/**`, scenario/content specifications, later content data modules; no reward implementation yet.
- **Measurable acceptance criteria:** Every production scenario maps to measurable objectives; “not enough evidence” exists; mastery differs from XP; pronunciation is excluded without acoustic evidence; learning specialist signs off.
- **Required automated tests:** Schema validation; objective coverage; invalid/unknown objective rejection; level-boundary fixtures.
- **Required real-device tests:** Moderated comprehension of objectives and progress language on at least one small Android device; no scoring validation yet.
- **Product-owner approval gate:** Approve learning objectives, completion semantics, and mastery presentation.
- **Asset dependency:** None.
- **Economic-system dependency:** Defines evidence inputs but does not choose XP values.
- **Security/privacy impact:** Defines minimum evidence and retention needs; raw audio remains excluded.
- **Accessibility/localization impact:** Objectives and progress explanations must be localizable and understandable without color.
- **Implementation risk:** High product-validity risk.
- **Rollback strategy:** Version learning contracts; retain previous schema reader until migrated content is verified.
- **Estimated engineering effort:** M plus learning-specialist review.
- **Can run in parallel:** Yes, with MARZI-022–027 after MARZI-020.
- **Completion evidence required:** Objective coverage report, specialist approval, sample scenario mappings, rejected-edge-case tests.

## MARZI-022 — Domain Ownership and Event Contracts

- **Objective:** Freeze ownership for session lifecycle, transcript, annotations, prompts, rewards, usage, wallet, navigation, and entitlements.
- **Problem solved:** `ConversationSession.transcript`, `S.turns`, provider metadata, UI state, evaluation, and rewards currently overlap.
- **Why it exists:** Later modules need one dependency direction and one canonical source per domain.
- **Prerequisites:** MARZI-020; learning-domain input from MARZI-021 before final approval.
- **Dependencies:** Current `ConversationSession`, `createTranscript`, `PromptBuilder`, provider registry, reward ledger, localStorage, browser History.
- **Packages unblocked:** MARZI-023, MARZI-027, MARZI-030–035, MARZI-043, MARZI-045, MARZI-047.
- **Exact deliverables:** Ownership matrix; immutable session/turn/attempt/annotation/reward IDs; event schemas; service boundaries; cancellation contract; dependency diagram; navigation/history contract.
- **Expected files/areas:** Architecture docs first; later `public/js/core/**`, `public/js/conversation/**`, storage/reward/provider adapters.
- **Measurable acceptance criteria:** ConversationSession alone owns ordered utterances; UI owns no history; rewards consume domain evidence; usage is independent of reward; provider payloads are adapters, not canonical state.
- **Required automated tests:** Contract tests for state transitions, duplicate/late events, ID stability, forbidden dependency imports, native History preservation.
- **Required real-device tests:** Android Back/lifecycle scenarios are specified; execution occurs in implementing packages.
- **Product-owner approval gate:** Product Owner confirms ownership does not change desired behavior; Technical Architect approves boundaries.
- **Asset dependency:** None.
- **Economic-system dependency:** Separates reward and usage ownership without changing values.
- **Security/privacy impact:** Defines data minimization and server/client trust boundaries.
- **Accessibility/localization impact:** Ensures presentation state cannot overwrite semantic content/language metadata.
- **Implementation risk:** Critical architecture risk.
- **Rollback strategy:** Introduce adapters and parity tests; retain legacy path behind a temporary flag until canonical events pass.
- **Estimated engineering effort:** M.
- **Can run in parallel:** Yes during specification; implementation is a critical path.
- **Completion evidence required:** Approved ownership table, event examples, contract tests, architecture review.

## MARZI-023 — Quality Gates and Test Infrastructure

- **Objective:** Make behavioral, rendered, migration, accessibility, and performance regressions mandatory CI failures.
- **Problem solved:** Current CI does not require rendered-browser execution and some tests only inspect source strings.
- **Why it exists:** Large UI/domain migrations are unsafe without behavior-level evidence.
- **Prerequisites:** MARZI-020; draft MARZI-022 contracts.
- **Dependencies:** `.github/workflows/ci.yml`, `test/run.js`, `test/browser/**`, Chromium/Playwright environment.
- **Packages unblocked:** Every implementation package; especially MARZI-027, MARZI-031, MARZI-034–053.
- **Exact deliverables:** Test pyramid; mandatory browser CI; fixture factories; negative-case catalogue; migration harness; rendered measurement helpers; performance budgets; evidence-report format.
- **Expected files/areas:** `.github/workflows/**`, `test/**`, browser harness documentation, test fixtures; no product redesign.
- **Measurable acceptance criteria:** Missing Chromium fails CI; behavioral assertions observe transitions; layout claims use measurements; conflict/syntax gates remain; all frozen contracts have tests.
- **Required automated tests:** Self-tests proving each gate fails when intentionally violated; fixture determinism; no skipped mandatory suite.
- **Required real-device tests:** Define evidence-capture format and device matrix; no product device validation required for this infrastructure package.
- **Product-owner approval gate:** None for technical mechanics; Product Owner approves any telemetry-like evidence collection.
- **Asset dependency:** Test fixtures may use approved placeholders only.
- **Economic-system dependency:** Reward fixtures freeze existing values until MARZI-043.
- **Security/privacy impact:** Test artifacts must exclude secrets and personal learner content.
- **Accessibility/localization impact:** Adds required axe/manual semantics, RTL, zoom, target-size, and reduced-motion gates.
- **Implementation risk:** Medium.
- **Rollback strategy:** Revert CI/test-only changes; never weaken a proven production regression silently.
- **Estimated engineering effort:** M.
- **Can run in parallel:** Yes.
- **Completion evidence required:** Green CI, intentional-failure demonstrations, browser execution log, review report.

## MARZI-024 — Release Control, Feature Flags, and Environment Strategy

- **Objective:** Make high-risk migrations cohort-controlled, observable, reversible, and environment-safe.
- **Problem solved:** Qualification alone cannot disable a failing onboarding, chat, reward, streaming, or asset migration.
- **Why it exists:** Marzi needs staged activation without hidden admin routes or entitlement-changing client flags.
- **Prerequisites:** MARZI-020 and MARZI-023.
- **Dependencies:** Branch/deployment model, PWA cache lifecycle, storage-version policy, staging service.
- **Packages unblocked:** MARZI-027, MARZI-034–053.
- **Exact deliverables:** Environment contract; versioned flag registry; safe defaults; migration cohorts; kill switches; compatibility windows; canary/rollback procedure; flag ownership/audit rules.
- **Expected files/areas:** Deployment/release docs; later server/app configuration modules and tests; no production change without separate approval.
- **Measurable acceptance criteria:** Every high-risk package can be disabled without data loss; flags cannot grant XP/coins/Premium; old/new readers coexist for the approved window; rollback tested in staging.
- **Required automated tests:** Default-off checks; unknown flag rejection; entitlement/economy non-interference; compatibility tests.
- **Required real-device tests:** Flagged and unflagged installed-PWA upgrade/rollback paths on Android staging.
- **Product-owner approval gate:** Approve cohort exposure and any user-visible fallback.
- **Asset dependency:** Asset flags reference manifest versions only.
- **Economic-system dependency:** Reward/economy flags never alter stored value without migration approval.
- **Security/privacy impact:** No secret client flag or hidden admin control.
- **Accessibility/localization impact:** Both flag paths must meet the same accessibility/localization minimum.
- **Implementation risk:** Medium with High operational impact.
- **Rollback strategy:** Server/config kill switch plus compatible client path; preserve data written by either version.
- **Estimated engineering effort:** S–M.
- **Can run in parallel:** Yes.
- **Completion evidence required:** Flag matrix, staging rollback log, compatibility results, operations approval.

## MARZI-025 — Design System and Reusable Component Foundation

- **Objective:** Establish reusable components and layout contracts before onboarding and call reconstruction.
- **Problem solved:** Independent screen patches recreate spacing, safe-area, target-size, focus, and responsive defects.
- **Why it exists:** World-class consistency requires shared primitives, not repeated inline fixes.
- **Prerequisites:** MARZI-020 and MARZI-023.
- **Dependencies:** `docs/DESIGN_SYSTEM.md`, current tokens/components, concept boards as references only.
- **Packages unblocked:** MARZI-026, MARZI-034, MARZI-036–042, MARZI-050.
- **Exact deliverables:** Canonical tokens; app/onboarding/call shells; buttons; chips; status; messages; sheets/dialogs; sticky actions; loading/error/empty/offline; motion/elevation rules.
- **Expected files/areas:** `docs/DESIGN_SYSTEM.md`, later `public/css/**`, `public/js/components/**`, rendered component fixtures.
- **Measurable acceptance criteria:** Components pass 320–412 px and tablet assessment; targets ≥48×48; 200% zoom; RTL; reduced motion; one safe-area owner; no absolute positioning for primary actions.
- **Required automated tests:** Token parity; component semantics; target bounds; overflow; focus; reduced-motion styles; visual regression baselines.
- **Required real-device tests:** Android small/large phone, large font, gesture navigation, TalkBack component walkthrough.
- **Product-owner approval gate:** Approve component visual language and hierarchy.
- **Asset dependency:** Uses approved assets only; supports deterministic placeholders without inventing art.
- **Economic-system dependency:** Resource components display canonical values but never mutate them.
- **Security/privacy impact:** Components render untrusted strings as text only.
- **Accessibility/localization impact:** Primary purpose; WCAG 2.2 AA target, logical properties, locale expansion.
- **Implementation risk:** Medium.
- **Rollback strategy:** Introduce components behind parity tests; revert per component without changing domain data.
- **Estimated engineering effort:** M.
- **Can run in parallel:** Yes, with MARZI-026–029.
- **Completion evidence required:** Component catalogue, measurement matrix, accessibility results, Product/UI approval.

## MARZI-026 — Accessibility and Language-axis Foundation

- **Objective:** Make accessibility, RTL, and the interface/target/correction language model structural.
- **Problem solved:** Current help language also drives interface copy, and late accessibility fixes would cause rework.
- **Why it exists:** Every subsequent screen and content schema depends on language and semantic ownership.
- **Prerequisites:** MARZI-020, MARZI-022, MARZI-023.
- **Dependencies:** Current `T`/`TARGETS`, HTML semantics, focus/history behavior, supported locale policy.
- **Packages unblocked:** MARZI-027–028, MARZI-034, MARZI-036–039, MARZI-044, MARZI-050, MARZI-056.
- **Exact deliverables:** Three-axis language schema; locale-key contract; `lang`/`dir` rules; logical CSS standard; focus/modal utilities; live-region policy; pseudo-locale; TalkBack/zoom/large-font matrices.
- **Expected files/areas:** Localization/accessibility docs; later locale modules, settings, semantic components, CSS foundations.
- **Measurable acceptance criteria:** Three axes can differ; target content is tagged; Arabic reading/focus order is logical; semantic icons are not incorrectly mirrored; no interaction depends on animation/color/audio/pointer alone.
- **Required automated tests:** Locale parity; pseudo-locale overflow; direction metadata; focus restoration; live-region duplication; logical-property lint.
- **Required real-device tests:** TalkBack in Spanish and Arabic; large system font; gesture navigation; reduced motion; keyboard-only where supported.
- **Product-owner approval gate:** Approve supported interface/correction languages and default relationships.
- **Asset dependency:** Assets contain no embedded localizable text unless explicitly approved.
- **Economic-system dependency:** None.
- **Security/privacy impact:** Language choices are ordinary preferences; no sensitive inference.
- **Accessibility/localization impact:** Critical foundation.
- **Implementation risk:** High if delayed, Medium when implemented early.
- **Rollback strategy:** Version locale/settings schema and preserve previous preference mapping.
- **Estimated engineering effort:** M.
- **Can run in parallel:** Yes.
- **Completion evidence required:** Locale schema, pseudo-locale report, TalkBack plan/results, accessibility approval.

## MARZI-027 — Persistence, Migration, Data Portability, and Recovery

- **Objective:** Provide versioned, transactional, recoverable storage before new product state is introduced.
- **Problem solved:** Current and legacy keys are incomplete in export/import and domain migrations are inconsistent.
- **Why it exists:** Onboarding, annotations, rewards, outfits, accounts, and mastery must not risk existing learner data.
- **Prerequisites:** MARZI-022, MARZI-023, MARZI-026.
- **Dependencies:** Current localStorage schemas, reward ledger, settings, history, Store state, legacy keys.
- **Packages unblocked:** MARZI-034–035, MARZI-042–044, MARZI-047, MARZI-051, MARZI-055.
- **Exact deliverables:** Versioned schemas; idempotent migrations; complete export/import; secret exclusion; transactional validation; corruption isolation; rollback snapshot; quota-failure handling; deletion operation.
- **Expected files/areas:** Storage/migration modules, Profile data operations, migration tests, privacy docs.
- **Measurable acceptance criteria:** XP/rank/stage/coins/minutes/purchases/settings/scenarios/history survive; round trip is complete; invalid import writes nothing; one corrupt domain does not wipe all; failed migration restores prior state.
- **Required automated tests:** Every version path; repeated migration; corrupt/truncated/oversize input; quota failure; secret exclusion; rollback; backward readers.
- **Required real-device tests:** Upgrade an existing installed PWA with representative data; background/kill during migration; export/import via Android file picker.
- **Product-owner approval gate:** Approve retention and deletion behavior; no data reset without explicit approval.
- **Asset dependency:** Stores asset IDs, never binary production art.
- **Economic-system dependency:** Wallet and ledger migration is frozen until MARZI-043 approval.
- **Security/privacy impact:** Critical data portability, minimization, and secret handling.
- **Accessibility/localization impact:** Data controls require accessible/localized explanations and errors.
- **Implementation risk:** Critical.
- **Rollback strategy:** Pre-migration snapshot, versioned readers, transactional commit, tested downgrade compatibility window.
- **Estimated engineering effort:** M–L.
- **Can run in parallel:** Yes after contracts freeze.
- **Completion evidence required:** Migration matrix, checksum/round-trip evidence, Android upgrade results, independent data review.

## MARZI-028 — Content Authoring and Localization Pipeline

- **Objective:** Move scenarios and learning content into a validated, versioned editorial system.
- **Problem solved:** Scenario data, prompt assumptions, speaker references, and translations are distributed through application code.
- **Why it exists:** Content expansion and quality review must not require unrelated runtime edits.
- **Prerequisites:** MARZI-021, MARZI-022, MARZI-026.
- **Dependencies:** Current scenarios, target registry, character identities, learning objectives, native reviewers.
- **Packages unblocked:** MARZI-030–031, MARZI-034, MARZI-037–038, MARZI-044, MARZI-056.
- **Exact deliverables:** Scenario schema; stable IDs; objective/prerequisite references; content versions; locale parity; proper-name rules; cultural/native review; deprecation/migration; linting; author guide.
- **Expected files/areas:** `docs/content/**`, later `public/data/**` or server content registry, locale packs, validation tests.
- **Measurable acceptance criteria:** Every scenario validates; identities remain stable; missing translations fail CI; prompts/assets reference IDs; content changes avoid unrelated application logic; native approval recorded.
- **Required automated tests:** Schema, ID uniqueness, objective coverage, locale parity, speaker/asset references, forbidden embedded UI strings.
- **Required real-device tests:** Render representative long and RTL content; conduct native-speaker scenario walkthrough.
- **Product-owner approval gate:** Approve production scenario set, tone, cultural treatment, and supported locales.
- **Asset dependency:** References approved manifest IDs; never guesses paths.
- **Economic-system dependency:** Scenario difficulty may inform later rewards but has no value here.
- **Security/privacy impact:** Authored content is trusted/versioned; custom user topics remain separately sanitized.
- **Accessibility/localization impact:** Core concern; content length, language metadata, plain-language explanations.
- **Implementation risk:** High editorial risk.
- **Rollback strategy:** Version content packs; retain previous pack until migration and prompt compatibility pass.
- **Estimated engineering effort:** M.
- **Can run in parallel:** Yes.
- **Completion evidence required:** Validated content pack, native-review signoff, schema/test report.

## MARZI-029 — Visual and Audio Asset Pipeline

- **Objective:** Govern approved source assets from delivery through validation, optimization, manifesting, and caching.
- **Problem solved:** Runtime registries are empty and concept boards are unsuitable as production files.
- **Why it exists:** Brand, portrait, outfit, icon, and audio packages need one safe delivery mechanism.
- **Prerequisites:** MARZI-020 and MARZI-025.
- **Dependencies:** `docs/design/MARZI_ASSET_SPEC.md`, delivery checklist, concept boards as references, illustrator/audio sources.
- **Packages unblocked:** MARZI-040–042, MARZI-046, MARZI-049, MARZI-059.
- **Exact deliverables:** Manifest schema; provenance/license/approval metadata; naming; SVG hygiene; dimensions/anchors/transparency/size checks; responsive formats; missing-reference CI; cache-version linkage; audio normalization.
- **Expected files/areas:** `docs/design/**`, future `public/assets/**`, asset manifest/generator/validators, service-worker manifest integration.
- **Measurable acceptance criteria:** Only declared assets are requested; board crops fail; unsafe SVG fails; anchors/padding/budgets validate; provenance is traceable; missing optional art falls back deterministically.
- **Required automated tests:** Manifest/schema; duplicate IDs; missing files; SVG scripts/external refs; dimension/size/anchor rules; cache coverage; audio format/peak checks.
- **Required real-device tests:** Icon mask/install inspection; representative stage/portrait/outfit at target densities; audio playback on Android.
- **Product-owner approval gate:** Product/family approves every canonical asset family before registration.
- **Asset dependency:** This package establishes it; assets may be produced in parallel.
- **Economic-system dependency:** Outfit asset presence constrains what may be sold.
- **Security/privacy impact:** Rejects unsafe SVG/external references; no runtime upload/admin path.
- **Accessibility/localization impact:** No embedded language text by default; alt/semantic metadata is separate.
- **Implementation risk:** Medium technical, High schedule dependency.
- **Rollback strategy:** Version manifests and cache namespaces; retain last approved asset set.
- **Estimated engineering effort:** S–M plus specialist production.
- **Can run in parallel:** Yes.
- **Completion evidence required:** Validator output, manifest inventory, provenance/approval record, device previews.

# Reliability and observability

## MARZI-030 — Server-owned Prompt Registry and PromptBuilder Purification

- **Objective:** Make prompt construction pure, deterministic, versioned, and server-controlled.
- **Problem solved:** The client currently supplies system text, while `PromptBuilder.rolePlay()` temporarily mutates global application state.
- **Why it exists:** Streaming, evaluation, safety, and content versioning cannot rely on mutable globals or client-authoritative instructions.
- **Prerequisites:** MARZI-021, MARZI-022, MARZI-028.
- **Dependencies:** Current `systemPrompt`, `PromptBuilder`, `/api/chat`, scenario/locale registries, provider adapter.
- **Packages unblocked:** MARZI-031, MARZI-033, MARZI-035, MARZI-037, MARZI-045, MARZI-048.
- **Exact deliverables:** Server prompt registry; prompt IDs/versions; pure builder; domain turn request; client-system rejection; scenario/level/language validation; compatibility adapter; snapshots.
- **Expected files/areas:** `server.js` or extracted server modules, conversation/provider adapters, prompt tests, docs; no provider redesign beyond approved interface.
- **Measurable acceptance criteria:** Client cannot choose system instructions; no prompt builder reads/mutates global `S`; identical inputs yield identical output; unknown IDs fail; German semantics remain frozen unless approved.
- **Required automated tests:** Snapshot matrix; concurrency/reentrancy; malicious system input rejection; version mismatch; unknown scenario/level/language; provider payload mapping.
- **Required real-device tests:** One complete staging call per supported target and correction-language pair; no prompt internals exposed in errors.
- **Product-owner approval gate:** Approve prompt semantics/version migration and any German copy change.
- **Asset dependency:** None.
- **Economic-system dependency:** Prompt does not award rewards; it exposes evidence only.
- **Security/privacy impact:** Critical trust-boundary correction; messages remain minimized and redacted from routine logs.
- **Accessibility/localization impact:** Level/language inputs are explicit; output remains separable for semantic rendering.
- **Implementation risk:** Critical.
- **Rollback strategy:** Feature-flag old/new prompt path; retain previous version server-side; never accept arbitrary client system text as rollback.
- **Estimated engineering effort:** M–L.
- **Can run in parallel:** No for prompt implementation; yes with assets/UX preparation.
- **Completion evidence required:** Prompt diffs, snapshots, security rejection tests, staged conversation evidence, independent review.

## MARZI-031 — AI Evaluation, Safety, and Quality Harness

- **Objective:** Prove that replies, translations, corrections, assistance, and completion evaluations are suitable for learners.
- **Problem solved:** Current strict JSON validates shape, not pedagogical accuracy, level adherence, role safety, or evaluator validity.
- **Why it exists:** Learning progress and rewards must not depend on an unmeasured AI judgment.
- **Prerequisites:** MARZI-021, MARZI-023, MARZI-028, MARZI-030.
- **Dependencies:** Versioned prompts/content, provider candidates, native reviewers, learning objectives.
- **Packages unblocked:** MARZI-035, MARZI-037, MARZI-043, MARZI-045, MARZI-054.
- **Exact deliverables:** Golden corpus; level/goal/role tests; correction/translation/proper-name checks; injection/unsafe-content cases; evaluator confidence/abstention; provider thresholds; regression report.
- **Expected files/areas:** `test/ai/**`, fixtures, evaluation scripts/docs, provider test adapters; no learner production data.
- **Measurable acceptance criteria:** Exact learner speech is never rewritten; proper names survive; role/prompt injection fails; evaluator returns insufficient evidence; approved thresholds pass across production scenarios/locales.
- **Required automated tests:** Corpus replay; JSON/schema failures; hallucinated completion; incorrect language; overcorrection; unsafe input; deterministic scoring envelope.
- **Required real-device tests:** Staging conversations covering beginner/advanced, accented STT text, interruptions, Arabic correction UI; human review of captured synthetic fixtures.
- **Product-owner approval gate:** Approve quality thresholds, correction tone, and evaluator use in rewards.
- **Asset dependency:** None.
- **Economic-system dependency:** Blocks reward scoring until approved.
- **Security/privacy impact:** Uses synthetic/consented fixtures; tests prompt injection and unsafe content.
- **Accessibility/localization impact:** Feedback must be concise, localizable, correctly tagged, and not over-announced.
- **Implementation risk:** Critical learning/trust risk.
- **Rollback strategy:** Pin prior prompt/evaluator version; abstain rather than score when new validation fails.
- **Estimated engineering effort:** L plus specialist review.
- **Can run in parallel:** Yes with MARZI-032/033 after MARZI-030.
- **Completion evidence required:** Corpus coverage, scorecard, failed-case inventory, native/learning/AI-safety approvals.

## MARZI-032 — Observability, Analytics, and Privacy Foundation

- **Objective:** Measure reliability and product outcomes without collecting unnecessary learner content.
- **Problem solved:** Latency, abandonment, migrations, provider failures, and reward rejection are otherwise invisible.
- **Why it exists:** Commercial operation needs diagnosable SLOs and explicit privacy boundaries before telemetry is added ad hoc.
- **Prerequisites:** MARZI-020, MARZI-022, MARZI-023.
- **Dependencies:** Privacy promises, legal pages, server logs, future account/analytics decisions.
- **Packages unblocked:** MARZI-033, MARZI-043–045, MARZI-047–048, MARZI-051, MARZI-057, MARZI-060.
- **Exact deliverables:** Event taxonomy; classification; operational/product separation; consent rules; redaction; latency/error/migration/reward events; retention; SLOs/alerts; privacy impact plan.
- **Expected files/areas:** Observability/privacy docs, later server/client instrumentation, tests, dashboards/configuration outside secrets.
- **Measurable acceptance criteria:** No raw transcript/audio/PIN/prompt/credential in routine telemetry; every field has purpose/retention; analytics is disableable; operational diagnosis works without content.
- **Required automated tests:** Redaction; forbidden-field scan; consent gating; event schema; retention configuration; correlation-ID format.
- **Required real-device tests:** Verify consent/no-consent network behavior and diagnostics during real staging failures.
- **Product-owner approval gate:** Explicit approval for analytics purpose, consent model, and retention.
- **Asset dependency:** None.
- **Economic-system dependency:** May record qualified/rejected reason, never silently alter value.
- **Security/privacy impact:** Critical primary scope; requires legal/privacy review.
- **Accessibility/localization impact:** Consent and privacy controls must be accessible/plain-language/localized.
- **Implementation risk:** High.
- **Rollback strategy:** Disable analytics transport; preserve essential local operational errors only under approved retention.
- **Estimated engineering effort:** M.
- **Can run in parallel:** Yes.
- **Completion evidence required:** Data inventory, event examples, redaction results, privacy/legal approval.

## MARZI-033 — Backend and Provider Reliability

- **Objective:** Bound STT/LLM/TTS/static-service failures, cost, concurrency, retries, and cancellation.
- **Problem solved:** Current proxy/provider flow lacks a complete production reliability and cost-control contract.
- **Why it exists:** Streaming and commercial scale are unsafe without provider isolation and predictable failure behavior.
- **Prerequisites:** MARZI-022, MARZI-030, MARZI-032.
- **Dependencies:** Server endpoints, provider APIs, deployment topology, rate limits, optional PIN/authentication.
- **Packages unblocked:** MARZI-035, MARZI-041, MARZI-045, MARZI-048, MARZI-053.
- **Exact deliverables:** Request IDs; body/rate/concurrency limits; credential transport correction; cancellation/timeouts; controlled retries; circuit breakers; quota/cost telemetry; health checks; sanitized errors; static portrait production path.
- **Expected files/areas:** `server.js` or extracted server modules, provider adapters, deployment docs/config tests; no secrets committed.
- **Measurable acceptance criteria:** Secrets never appear in URLs; ended calls cancel work; retries do not duplicate turns; provider exhaustion is bounded; internal errors are sanitized; per-call cost/failure is measurable without content.
- **Required automated tests:** Timeout, cancellation, 413/429/502, retry idempotency, circuit open/half-open, concurrency, malformed provider response, log-redaction.
- **Required real-device tests:** Staging offline/slow/drop/reconnect during STT, LLM, TTS; background/foreground; hang-up during request.
- **Product-owner approval gate:** Approve user-visible fallback and provider-cost/SLO limits.
- **Asset dependency:** Approved static portrait resolver replaces normal dynamic-generation dependency when assets exist.
- **Economic-system dependency:** Provider failure cannot reward or double-charge minutes.
- **Security/privacy impact:** High; authentication, limits, logs, provider isolation.
- **Accessibility/localization impact:** Failure states are semantic, localized, focus-safe, and not color-only.
- **Implementation risk:** High.
- **Rollback strategy:** Provider-specific feature flags; revert adapter/version; preserve session/reward idempotency.
- **Estimated engineering effort:** L.
- **Can run in parallel:** Yes with product UI work after contracts freeze.
- **Completion evidence required:** Fault-injection results, cost/SLO report, staging device evidence, security review.

# Core product

## MARZI-034 — Responsive Onboarding and Placement

- **Objective:** Deliver a short, persistent, accessible first-run path to meaningful learning.
- **Problem solved:** Continue clips horizontally/vertically on Android, language roles are incomplete, and stored goals do not drive value.
- **Why it exists:** A broken first experience prevents every later product benefit.
- **Prerequisites:** MARZI-021, MARZI-023, MARZI-025–028.
- **Dependencies:** Onboarding migration, locale packs, learning goals, optional placement content, permission policies.
- **Packages unblocked:** MARZI-044, MARZI-050, MARZI-052.
- **Exact deliverables:** Reusable shell; three language axes; goals; 5/10/20/custom commitment; optional placement; JIT microphone rationale; persistent steps; Back/keyboard/orientation/backgrounding behavior.
- **Expected files/areas:** Onboarding modules/CSS, localization, storage migration, rendered tests; current monolith only through approved modular path.
- **Measurable acceptance criteria:** Pass 320×568, 360×640, 360×780, 375×667, 390×844, 412×915, tablet; zero horizontal overflow; CTA safe; 200% zoom; large font; RTL; progress persists; first value ≤90 seconds target.
- **Required automated tests:** State machine; validation; persistence/migration; Back/forward; overflow/bounds; locale parity; permission denial; keyboard viewport simulation.
- **Required real-device tests:** Browser and installed Android PWA; TalkBack; gesture navigation; keyboard; rotation; background/kill; Spanish/Arabic; non-zero safe areas.
- **Product-owner approval gate:** Approve maximum steps, optional placement, language defaults, permission timing, deferred account/notification flow.
- **Asset dependency:** Canonical onboarding Marzi is gated by MARZI-040; approved fallback until then.
- **Economic-system dependency:** Daily commitment informs targets, never billing/minutes.
- **Security/privacy impact:** Placement/permissions minimized; no microphone before rationale/consent.
- **Accessibility/localization impact:** Critical primary scope.
- **Implementation risk:** High UX/data risk.
- **Rollback strategy:** Feature flag; migrate v2 without deleting v1; restore prior completed state.
- **Estimated engineering effort:** L.
- **Can run in parallel:** Yes with MARZI-035 preparation; integration serialized.
- **Completion evidence required:** Full measurement matrix, screenshots, TalkBack recording/report, migration results, Product approval.

# Conversation

## MARZI-035 — ConversationSession and Canonical Transcript

- **Objective:** Implement the approved lifecycle, immutable turn events, annotations, cancellation, and projection boundary.
- **Problem solved:** Conversation state has overlapping canonical and render mirrors.
- **Why it exists:** Chat, assistance, rewards, streaming, and history all require stable turn ownership.
- **Prerequisites:** MARZI-022–023, MARZI-027, MARZI-030–031, MARZI-033.
- **Dependencies:** Provider registry, prompt request/result, storage adapter, History/navigation contract.
- **Packages unblocked:** MARZI-036–039, MARZI-043, MARZI-045.
- **Exact deliverables:** Stable session/attempt/turn IDs; immutable events; annotation store; cancellation/late guards; speaker switching; persistence/projection adapters; removal of `S.turns` as independent truth.
- **Expected files/areas:** Conversation/session/transcript modules, provider adapters, persistence, unit/integration tests.
- **Measurable acceptance criteria:** One utterance owner; rendering never mutates data; exact learner speech immutable; late reply dropped; duplicate send/ask rejected; restored transcript maintains identity/order.
- **Required automated tests:** Lifecycle, concurrency, cancellation, late provider, duplicate content/ID, second speaker, persistence restore, provider error, native History noncollision.
- **Required real-device tests:** Start/listen/send/background/end/reopen; Android Back; network loss; hang-up while pending; speaker switching.
- **Product-owner approval gate:** Confirm no conversation-flow/business change beyond approved ownership.
- **Asset dependency:** None.
- **Economic-system dependency:** Emits evidence; does not award value.
- **Security/privacy impact:** Transcript minimization/retention follows MARZI-027/032.
- **Accessibility/localization impact:** Events carry language/speaker metadata for semantic rendering.
- **Implementation risk:** Critical.
- **Rollback strategy:** Flagged compatibility adapter; dual-read verification without dual canonical writes; revert before deleting legacy data.
- **Estimated engineering effort:** L.
- **Can run in parallel:** No; central critical path.
- **Completion evidence required:** Contract/unit/integration results, state diagrams, diff review, real-device lifecycle report.

## MARZI-036 — Integrated Live-chat Surface

- **Objective:** Make canonical conversation history the primary in-call learning surface.
- **Problem solved:** Current portrait, bubbles, translation, corrections, help, and transcript sheet are fragmented.
- **Why it exists:** Conversation—not the portrait—is Marzi’s core product.
- **Prerequisites:** MARZI-025–026 and MARZI-035.
- **Dependencies:** Transcript projection, message semantics, scroll/focus utilities, replay service.
- **Packages unblocked:** MARZI-037–039, MARZI-045, MARZI-050.
- **Exact deliverables:** Remote/learner/Marzi/correction/system messages; Recent/Full modes; one scroll owner; new-message affordance; replay by turn ID; thinking-state preservation.
- **Expected files/areas:** Call/chat components and CSS, accessibility/locales, browser tests; no duplicate transcript store.
- **Measurable acceptance criteria:** Current exchange understandable without another page; ownership explicit; Full uses same data; latest utterance visible during processing; scroll stable; Back Full→Recent; no background/horizontal scrolling.
- **Required automated tests:** Real async state transition; append/autoscroll pause; replay correct ID; Full/Recent; focus/Back; duplicate DOM ID; ownership semantics.
- **Required real-device tests:** 360×640/390×844, Spanish/Arabic, normal/reduced motion, keyboard/TalkBack, long conversation.
- **Product-owner approval gate:** Approve chat-first composition and recent-history window.
- **Asset dependency:** Works with deterministic portrait placeholder; final scene is MARZI-041.
- **Economic-system dependency:** None.
- **Security/privacy impact:** Provider content rendered as text; history retention remains canonical.
- **Accessibility/localization impact:** Semantic list, restrained live regions, RTL logical ownership.
- **Implementation risk:** High.
- **Rollback strategy:** Chat-v2 flag; preserve transcript data; revert presentation only.
- **Estimated engineering effort:** L.
- **Can run in parallel:** No until projection stabilizes; downstream preparation may parallel.
- **Completion evidence required:** Rendered transition videos/screenshots, scroll measurements, accessibility tree, browser/device matrix.

## MARZI-037 — Translation, Correction, and Adaptive AI Help

- **Objective:** Integrate learner-controlled assistance without contaminating the transcript.
- **Problem solved:** Always-visible suggestions can be mistaken for learner speech; translation/correction are fragmented.
- **Why it exists:** Assistance must support autonomy and remain pedagogically attributable.
- **Prerequisites:** MARZI-021, MARZI-026, MARZI-028, MARZI-031, MARZI-036.
- **Dependencies:** Structured turn annotations, locale packs, assistance policy, reward evidence contract.
- **Packages unblocked:** MARZI-043–044, MARZI-050.
- **Exact deliverables:** Inline source/translation; visibility preference; OFF/HINT/FULL; Marzi ownership; correction annotations; assistance evidence; level defaults; proper-name behavior.
- **Expected files/areas:** Call messages, AI schema/prompt, annotation persistence, locales, tests.
- **Measurable acceptance criteria:** Toggle makes no duplicate request; suggestions never become learner history; exact speech preserved; source/translation associated; hidden help collapses; scroll stable; FULL is visible to evaluator.
- **Required automated tests:** Mode/state/persistence; duplicate-request negative; annotation ownership; proper names; translation failure; RTL; screen-reader state.
- **Required real-device tests:** Toggle during live call, slow response, rotation/background, Spanish/Arabic/TalkBack, 360/390 widths.
- **Product-owner approval gate:** Approve default by level, persistence model, translation defaults, and reward effects.
- **Asset dependency:** Marzi-help marker uses approved icon/asset when available; accessible label is mandatory regardless.
- **Economic-system dependency:** Assistance use informs but never directly mutates reward.
- **Security/privacy impact:** Assistance/translation content follows transcript retention; no extra hidden request.
- **Accessibility/localization impact:** Primary scope; labels, language association, RTL, announcements.
- **Implementation risk:** High.
- **Rollback strategy:** Disable modes to approved safe default while retaining annotations; never rewrite transcript.
- **Estimated engineering effort:** L.
- **Can run in parallel:** Yes with MARZI-038/039 after MARZI-036 API freezes.
- **Completion evidence required:** Request-count traces, transcript diff, mode matrix, native-language review, device evidence.

## MARZI-038 — Vocabulary Interaction and Review Capture

- **Objective:** Allow accessible word exploration without disrupting sentence flow.
- **Problem solved:** Per-word 48×48 buttons create excessive spacing and wrong repeated-word activation risk.
- **Why it exists:** Vocabulary support must be optional and context-preserving.
- **Prerequisites:** MARZI-021, MARZI-025, MARZI-028, MARZI-036.
- **Dependencies:** Stable turn/token identity, word storage, future review queue.
- **Packages unblocked:** MARZI-044 and MARZI-050.
- **Exact deliverables:** Plain paragraph rendering; per-message Explore action; vocabulary sheet/popover; turn-ID+token-index identity; word saving; review evidence contract.
- **Expected files/areas:** Message renderer, vocabulary components/storage adapter, tokenization tests, accessibility/locales.
- **Measurable acceptance criteria:** Natural wrapping; no per-word controls in reading mode; repeated words resolve correctly; punctuation/apostrophes/Arabic/German compounds pass; focus returns; context retained.
- **Required automated tests:** Tokenization; repeated-token negative; click/keyboard/TalkBack selection; sentence layout; persistence; RTL.
- **Required real-device tests:** Dense German paragraph at 320/360; Arabic; TalkBack; touch accuracy; large font.
- **Product-owner approval gate:** Approve vocabulary-mode interaction and saved-word behavior.
- **Asset dependency:** None.
- **Economic-system dependency:** Saving/exploring grants no reward unless later explicitly approved.
- **Security/privacy impact:** Stores selected text/context under retention rules.
- **Accessibility/localization impact:** Critical touch/reading/focus scope.
- **Implementation risk:** Medium.
- **Rollback strategy:** Disable Explore action; preserve saved-word records; plain transcript remains functional.
- **Estimated engineering effort:** M.
- **Can run in parallel:** Yes with MARZI-037/039.
- **Completion evidence required:** Layout measurements, token identity tests, accessibility evidence, saved-context round trip.

## MARZI-039 — Call Shell, Controls, and Responsive Composition

- **Objective:** Deliver a stable, phone-like, safe-area-aware call shell.
- **Problem solved:** Ambiguous duplicate controls and oversized portrait reduce clarity and conversation space.
- **Why it exists:** Core interaction must remain predictable across call states and small Android screens.
- **Prerequisites:** MARZI-025–026, MARZI-035–036.
- **Dependencies:** Stable controls, call state projection, safe-area/focus utilities, later scene assets.
- **Packages unblocked:** MARZI-041, MARZI-045–046, MARZI-050.
- **Exact deliverables:** Replay; centered red End; green Tap to Speak; translation/help/history controls; optional Auto-listen settings; timer/minutes; one safe-area owner; responsive budgets.
- **Expected files/areas:** Call component/CSS, state/focus/history integration, locales, rendered tests.
- **Measurable acceptance criteria:** End only red; no duplicate mic/replay; targets ≥48×48 (primary ≥56 where possible); controls stable across renders; 360/390 fit; timer/chat reachable; Back correct.
- **Required automated tests:** Bounds at widths/heights/balances; focus retention; control state; danger-color uniqueness; safe-area injection; overflow; Back/history.
- **Required real-device tests:** Android PWA/browser, non-zero insets, gesture navigation, TalkBack, RTL, reduced motion, portrait success/failure.
- **Product-owner approval gate:** Approve control hierarchy, Auto-listen placement/default, and region budgets.
- **Asset dependency:** Final portrait/background waits for MARZI-041; shell must work without them.
- **Economic-system dependency:** Displays canonical minutes only; controls do not alter balance directly.
- **Security/privacy impact:** Microphone state/permission is explicit; no background capture.
- **Accessibility/localization impact:** Critical primary scope.
- **Implementation risk:** High.
- **Rollback strategy:** Call-shell flag; preserve session/data; revert presentation while old compatible shell remains.
- **Estimated engineering effort:** M–L.
- **Can run in parallel:** Yes after MARZI-036 contract freeze.
- **Completion evidence required:** Full responsive measurements, safe-area positions, accessibility tree, interaction recordings.

# Identity and assets

## MARZI-040 — Canonical Marzi Identity, Launcher, and Evolution

- **Objective:** Replace identity drift with one approved Marzi system across install surfaces, navigation, onboarding, progression, calls, Store, rewards, and states.
- **Problem solved:** The current launcher, header, evolution stages, call companion, and placeholders do not consistently depict the approved character.
- **Why it exists:** Recognition and emotional continuity require one production identity before visual polish or public launch.
- **Prerequisites:** MARZI-020, MARZI-025, MARZI-029; MARZI-D001–D004 approved; production asset set delivered.
- **Dependencies:** 01_home.png and 04_progress.png as direction only; asset manifest/security pipeline; current six-stage resolver and earned-stage contract.
- **Packages unblocked:** MARZI-041, MARZI-044, MARZI-050, MARZI-053, MARZI-059.
- **Exact deliverables:** Rights-cleared canonical art; language-neutral launcher/icon family; six matched stages (eggs, tadpole, legs, young, studious, expert); header/onboarding/state variants; manifest/service-worker version plan; localized stage metadata; deterministic fallback.
- **Expected files/areas:** Approved assets, asset manifest/resolver, manifest icons/favicon/splash, Marzi presentation components, localization, service-worker static version, tests and asset documentation.
- **Measurable acceptance criteria:** One visual DNA everywhere; no flag/embedded claim/emoji/generic frog/board crop; six earned stages map without forced stage; any/maskable icons pass Android masks; missing variants issue no broken request; old installs receive documented update behavior.
- **Required automated tests:** Asset schema/hash/dimension/security; six-stage mapping including invalid XP; resolver negative cases; icon manifest coverage; cache version/update; no unauthorized or orphan Marzi assets.
- **Required real-device tests:** Android install/upgrade at supported masks; 320–412 widths and tablet; Spanish/Arabic; TalkBack labels; reduced motion; offline cached fallback.
- **Product-owner approval gate:** Approve final canonical model, launcher composition, six artworks, stage 5/6 props, and every production export.
- **Asset dependency:** Blocking; MARZI-D001–D004.
- **Economic-system dependency:** Existing XP thresholds and earned stage remain unchanged.
- **Security/privacy impact:** Asset pipeline rejects active/external SVG content and records rights/provenance.
- **Accessibility/localization impact:** Localized names and non-image state meaning; no embedded copy; RTL-safe layout.
- **Implementation risk:** High visual/release risk, Medium technical risk.
- **Rollback strategy:** Versioned manifest with the previous approved set retained; revert asset-map/cache commit without changing earned stage.
- **Estimated engineering effort:** L plus external art production.
- **Can run in parallel:** Yes; asset production may run beside MARZI-034–039, integration is serialized.
- **Completion evidence required:** Approval sheet, hashes/provenance, asset matrix, icon-mask captures, six-stage/device matrix, cache-upgrade proof.

## MARZI-041 — Call Portraits, Outfits, and Living Scene

- **Objective:** Deliver an immersive upper-body remote character scene that preserves conversation space and visibly reflects the equipped outfit.
- **Problem solved:** Oversized face crops hide clothing and make the character compete with the learning conversation.
- **Why it exists:** A purchased outfit must create an obvious emotional value loop without turning the call scene into an interactive Store.
- **Prerequisites:** MARZI-029, MARZI-033, MARZI-039, MARZI-040; MARZI-D005–D006 approved; scenario completion contract from MARZI-D016.
- **Dependencies:** Canonical character/outfit inventory, portrait resolver, call shell region budgets, provider/avatar fallback, Store ownership/equip state.
- **Packages unblocked:** MARZI-044, MARZI-046, MARZI-050, MARZI-053, MARZI-059.
- **Exact deliverables:** Upper-body portrait specs/assets; scenario backgrounds; outfit/accessory composition matrix; equipped-state resolver; noninteractive call rendering; speaker-switch state preservation; success/failure fallback; preload and memory policy.
- **Expected files/areas:** Character/scene assets and manifests, portrait/outfit composition module, call scene component/CSS, Store/profile adapter reads, tests and asset delivery records.
- **Measurable acceptance criteria:** Full head/shoulders/about half torso visible at 390×844; decoration shrinks first at 360×640; actual equipped compatible outfit visible and nonclickable; no chin/neck crop; portrait node/state survives renders and speaker switches; fallback is singular, named, accessible, and deterministic.
- **Required automated tests:** Ownership/equip compatibility; missing outfit/portrait; speaker switch; no node recreation; noninteractive clothing; region geometry; asset request allow-list; memory/listener cleanup.
- **Required real-device tests:** 360×640 and 390×844, browser/standalone, portrait success/failure, multiple stages/outfits, RTL, large text, reduced motion, low-memory reload.
- **Product-owner approval gate:** Approve portrait framing, each production portrait/background, outfit strategy, compatibility matrix, and fallback appearance.
- **Asset dependency:** Blocking; MARZI-D005–D006 plus MARZI-040.
- **Economic-system dependency:** Ownership, prices, stage restrictions, and equip logic are preserved.
- **Security/privacy impact:** No runtime upload/replacement or untrusted SVG; portraits reveal no personal data.
- **Accessibility/localization impact:** Scene is supplementary; owner/state/outfit remain textually available; backgrounds contain no text.
- **Implementation risk:** High asset-combinatorics and responsive risk.
- **Rollback strategy:** Scene feature flag to approved simple portrait/fallback; preserve outfit ownership/equipped data.
- **Estimated engineering effort:** L plus external art production.
- **Can run in parallel:** Yes for asset production; runtime integration follows MARZI-039/040.
- **Completion evidence required:** Framing measurements, outfit matrix, resolver tests, memory profile, device videos, asset provenance.

# Learning system

## MARZI-042 — Learning Feedback, Pronunciation, and Marzi Coaching

- **Objective:** Turn canonical turns into clear, evidence-bounded correction, pronunciation feedback, coaching, and post-call learning insight.
- **Problem solved:** Feedback is fragmented and risks conflating recognized speech, corrected speech, provider confidence, and mastery.
- **Why it exists:** Learners need useful next steps without false precision or rewritten history.
- **Prerequisites:** MARZI-021–023, MARZI-027–029, MARZI-035–038; MARZI-D016 and MARZI-D019 decisions.
- **Dependencies:** Immutable utterances/annotations, evaluation quality harness, learning objectives, correction language, approved Marzi coaching states/assets.
- **Packages unblocked:** MARZI-043, MARZI-044, MARZI-050, MARZI-056, MARZI-060.
- **Exact deliverables:** Correction/pronunciation/coach annotation contracts; uncertainty and insufficient-evidence states; assistance-use analysis; post-call strengths/next step; Marzi coaching presentation; non-speech alternative.
- **Expected files/areas:** Learning/evaluation services, annotation schema/storage adapters, feedback/call/reward-summary components, locales, Marzi state resolver/assets, tests.
- **Measurable acceptance criteria:** Exact learner speech remains immutable; correction is separately attributed; no pronunciation score without acoustic evidence; low confidence is disclosed; users unable/unwilling to speak receive an equitable route; coaching maps to approved objectives.
- **Required automated tests:** Annotation immutability; malformed/late evaluation; no-acoustic negative; confidence boundaries; assistance attribution; cancellation/reload; localization and screen-reader semantics.
- **Required real-device tests:** Successful/failed speech, noisy input, denied mic, text alternative, Spanish/Arabic, TalkBack, reduced motion, small/large text.
- **Product-owner approval gate:** Approve feedback depth, tone, pronunciation policy/disclosure, coaching outcomes, and assistance-sensitive analysis.
- **Asset dependency:** Approved Marzi coaching states from MARZI-040; audio/animation is optional until MARZI-046.
- **Economic-system dependency:** Produces evidence only; no XP/coin effect until MARZI-043 approval.
- **Security/privacy impact:** Speech-derived data minimization, retention, consent, and provider confidence review.
- **Accessibility/localization impact:** Critical; language-tagged source/correction, non-speech route, no score-only meaning.
- **Implementation risk:** High learning-validity, bias, and trust risk.
- **Rollback strategy:** Disable derived coaching/pronunciation annotations; preserve canonical transcript and base correction path.
- **Estimated engineering effort:** L plus learning/accessibility/privacy validation.
- **Can run in parallel:** Yes during model/asset preparation; integration follows transcript and evaluation contracts.
- **Completion evidence required:** Annotated fixtures, bias/uncertainty report, immutable-transcript tests, moderated/device evidence, specialist sign-off.

# Economy

## MARZI-043 — Meaningful Rewards and Anti-Farming

- **Objective:** Award XP and coins only from approved, meaningful, idempotent learning evidence.
- **Problem solved:** Starting and immediately ending calls or repeating low-evidence behavior can create progress that does not represent learning.
- **Why it exists:** Progression and currency lose motivational value when navigation or farming is rewarded.
- **Prerequisites:** MARZI-021–023, MARZI-027, MARZI-031–032, MARZI-035, MARZI-037, MARZI-042; MARZI-D014–D019 approved.
- **Dependencies:** Completion/mastery contracts, immutable attempt/session evidence, reward ledger/idempotency, observability/privacy policy, economy simulation.
- **Packages unblocked:** MARZI-044, MARZI-047, MARZI-050, MARZI-053, MARZI-057.
- **Exact deliverables:** Versioned eligibility evaluator; minimum-meaningful-call rules; completion/quality/assistance inputs; anti-restart/repeat/inactivity protections; auditable reason codes; bounded formula/caps; migration and economy simulator.
- **Expected files/areas:** Reward policy/domain service, ledger adapter, session result events, storage migration if approved, reward UI/copy, fixtures, simulations, tests/docs.
- **Measurable acceptance criteria:** Open/hang-up, inactivity, duplicate/retry, and restart farming earn zero; valid completion awards once; ledger remains idempotent; formula matches approved table; reward explanation is transparent; existing data migrates without loss or double grant.
- **Required automated tests:** Base/new policy fixtures; duplicate/concurrent/offline/reload claims; boundary/cap/repeat cases; accessibility accommodations; migration/corruption/rollback; long-run economy simulation.
- **Required real-device tests:** Immediate hang-up, valid short/long completion, retry/offline, app kill/reopen, assistance modes, denied speech alternative, reward announcement.
- **Product-owner approval gate:** Approve exact eligibility, completion, minimum evidence, numeric XP/coin/streak/difficulty/pronunciation formula, caps, repeat treatment, and migration.
- **Asset dependency:** Reward celebration may use approved MARZI-040 assets; formula does not wait on decorative art.
- **Economic-system dependency:** Blocking and material; no value changes before explicit approval.
- **Security/privacy impact:** Protect client-event trust boundary; anti-abuse evidence is minimized/auditable and not hidden surveillance.
- **Accessibility/localization impact:** Equitable eligibility, localized reason/breakdown, no time/speech-only discrimination.
- **Implementation risk:** Critical economy, data, and trust risk.
- **Rollback strategy:** Versioned policy and reversible reader; prevent new-policy grants before rollback; never delete ledger/progress; reconcile idempotently.
- **Estimated engineering effort:** XL including simulation and specialist approval.
- **Can run in parallel:** No for runtime integration; simulation/test preparation may run in parallel.
- **Completion evidence required:** Signed formula, simulations, before/after fixtures, exploit matrix, migration/rollback proof, device journeys, independent security/economy review.

## MARZI-044 — Progress, Store, and Outfit Value Loop

- **Objective:** Connect learning goals, mastery, evolution, Store ownership, equipped outfits, and rewards without merging their sources of truth.
- **Problem solved:** Progress and purchased cosmetics are scattered and do not consistently show what the learner achieved or equipped.
- **Why it exists:** A coherent value loop improves motivation only when learning evidence and cosmetic economy remain honest and legible.
- **Prerequisites:** MARZI-021, MARZI-025–028, MARZI-034, MARZI-037–038, MARZI-040–043; MARZI-D005, D014–D018, and D020 decisions as applicable.
- **Dependencies:** Learning map/objectives, mastery evidence, reward policy, Store/wallet/ownership/equip contracts, canonical assets, localized content.
- **Packages unblocked:** MARZI-047, MARZI-050, MARZI-052–053, MARZI-056–057, MARZI-059.
- **Exact deliverables:** Coherent Learn/Profile/progress/evolution views; mastery vs XP explanation; Store preview/ownership/equip; outfit visibility links; post-call reward/progress detail; empty/loading/error/offline states.
- **Expected files/areas:** Learn/map/Profile/progress/Store/reward components, domain selectors/adapters, localization, approved assets, browser/device tests.
- **Measurable acceptance criteria:** One wallet and one ownership/equip authority; XP/rank/evolution/mastery are distinguishable; prices and purchase semantics match approved policy; equipped compatible outfit appears in every approved surface; no fake Premium/payment; all states remain operable offline as specified.
- **Required automated tests:** Cross-screen state consistency; buy/equip insufficient/repeated/locked cases; reward-to-progress projection; reload/migration; missing asset; no duplicate wallet; RTL/a11y/rendered layout.
- **Required real-device tests:** Full earn/buy/equip/call/reward loop on small Android, offline/reopen, large text, TalkBack, Arabic RTL, reduced motion.
- **Product-owner approval gate:** Approve hierarchy, mastery/progression language, outfit surfaces, Store merchandising, and any monetization boundary.
- **Asset dependency:** MARZI-040–041 and approved outfit production matrix.
- **Economic-system dependency:** Uses MARZI-043 exactly; prices/buyPack remain frozen unless separately approved.
- **Security/privacy impact:** Local ownership integrity and migration; no entitlement simulation or hidden admin path.
- **Accessibility/localization impact:** Critical cross-screen semantics, localized stage/item/mastery text, non-color-only locks/ownership.
- **Implementation risk:** High cross-domain coupling risk.
- **Rollback strategy:** Feature-flag new projections while retaining canonical data; revert presentation/adapters without rolling back purchases or rewards.
- **Estimated engineering effort:** L.
- **Can run in parallel:** No for integrated runtime; content/asset/accessibility preparation can parallelize.
- **Completion evidence required:** End-to-end state ledger, cross-screen screenshots/measurements, purchase/reload fixtures, device journey, frozen-contract diff.

# Audio and AI performance

## MARZI-045 — Low-Latency Streaming Conversation Pipeline

- **Objective:** Reduce speech-end-to-useful-response latency while preserving transcript, prompt, provider, cancellation, safety, and voice correctness.
- **Problem solved:** Sequential STT → LLM → TTS work makes live calls feel slow and can leave stale work alive after a state change.
- **Why it exists:** Perceived responsiveness is essential to conversational confidence and retention.
- **Prerequisites:** MARZI-022–024, MARZI-030–033, MARZI-035–039; measured baseline and approved performance budgets.
- **Dependencies:** ConversationSession event contract, PromptBuilder/prompt registry, provider adapters, cancellation, browser speech/audio lifecycle, observability.
- **Packages unblocked:** MARZI-046, MARZI-048, MARZI-050, MARZI-053, MARZI-058.
- **Exact deliverables:** End-to-end latency trace; warm scenario context; safe prompt precomputation; streaming text boundary; sentence-safe incremental TTS where supported; cancellation/backpressure; timeout/retry policy; fallback path; SLO dashboard inputs.
- **Expected files/areas:** Conversation orchestration, provider/server adapters, streaming transport if approved, TTS queue, call-state projection, performance tests/docs.
- **Measurable acceptance criteria:** Approved p50/p95 speech-end-to-first-text and first-audio targets pass on reference device/network; no duplicated/truncated/reordered transcript or audio; stale turns cancel; nonstreaming providers retain a working fallback; prompt bytes/roles remain correct.
- **Required automated tests:** Chunk ordering; partial JSON/unsafe boundary; cancellation/race/timeout/retry; provider fallback; transcript exactly-once; TTS interruption; no prompt leakage; latency-budget CI fixtures.
- **Required real-device tests:** Android PWA with fast/slow/unstable network, rapid hang-up/restart, speaker/mic interruption, screen background/return, long response, offline transition.
- **Product-owner approval gate:** Approve perceived-latency behavior, interruption semantics, and any first-sentence streaming tradeoff; no business-rule change.
- **Asset dependency:** Voice assets/providers only; visual placeholders do not block.
- **Economic-system dependency:** Usage metering remains canonical and independent of reward; streaming cost must be modeled.
- **Security/privacy impact:** Streaming boundaries, cancellation, logging minimization, provider isolation, prompt/output safety.
- **Accessibility/localization impact:** Live states announced without chatter; captions precede/follow audio consistently; sentence boundaries validated per target.
- **Implementation risk:** Critical async, provider, and cost risk.
- **Rollback strategy:** Per-provider/session feature flag to the existing sequential pipeline; compatible event/transcript contract; drain/cancel active streams.
- **Estimated engineering effort:** XL.
- **Can run in parallel:** No for orchestration integration; provider prototypes and measurement tooling may parallelize.
- **Completion evidence required:** Traces by percentile/device/network, race matrix, transcript/audio parity, provider fallback, cost analysis, staging recordings.

## MARZI-046 — Premium Audio Identity and Playback Orchestration

- **Objective:** Add one polished, unobtrusive sonic identity without interfering with speech recognition, TTS, privacy, accessibility, or performance.
- **Problem solved:** Current calls and rewards lack coherent state feedback, while ad hoc effects would create overlap and inconsistency.
- **Why it exists:** Sound can make connection, action, success, purchase, and evolution feel intentional when governed as a system.
- **Prerequisites:** MARZI-029, MARZI-039, MARZI-041, MARZI-045; MARZI-D007 approved; rights-cleared audio delivered.
- **Dependencies:** Audio focus/lifecycle, TTS/STT orchestration, user preferences, call/reward/Store/evolution events, asset pipeline.
- **Packages unblocked:** MARZI-050, MARZI-053, MARZI-059.
- **Exact deliverables:** Audio palette; connection/hang-up/control/success/reward/evolution/purchase cues; mixer/priority policy; mute/preference; preload/lazy-load budget; interruption/fallback; versioned assets/licenses.
- **Expected files/areas:** Approved audio assets/manifest, audio manager, event adapters, preferences/locales, service-worker cache, performance/accessibility tests/docs.
- **Measurable acceptance criteria:** No overlap with listening capture or intelligible TTS; essential state never sound-only; cues obey user setting and platform interruption; no autoplay violation; assets meet byte/latency budget; missing audio is silent and safe.
- **Required automated tests:** Event-to-cue mapping; priority/duck/cancel; mute/reload; missing/corrupt asset; repeated action throttling; no cue during mic capture where forbidden; cache coverage.
- **Required real-device tests:** Speaker/Bluetooth/headphones, volume/mute, interruption/phone notification, denied autoplay, background/foreground, TalkBack, reduced motion, low network/offline.
- **Product-owner approval gate:** Approve every cue, volume hierarchy, default, licensing source, and celebration intensity.
- **Asset dependency:** Blocking; MARZI-D007.
- **Economic-system dependency:** Purchase/reward cues confirm only committed idempotent outcomes.
- **Security/privacy impact:** No recording/telemetry expansion; licensed provenance recorded.
- **Accessibility/localization impact:** Non-audio equivalents; nonverbal cues preferred; spoken sound requires localization.
- **Implementation risk:** Medium technical, High perceived-quality risk.
- **Rollback strategy:** Global audio-effects kill switch; preserve TTS/STT and user preference; remove cache entries through versioned update.
- **Estimated engineering effort:** M plus audio production.
- **Can run in parallel:** Yes for production after event contracts; integration follows MARZI-045.
- **Completion evidence required:** Asset/license register, audio-event tests, device playback matrix, byte profile, Product Owner listening approval.

# Commercial readiness

## MARZI-047 — Entitlements, Payments, and Monetization Integrity

- **Objective:** Implement real, restorable, auditable commercial entitlements only after a complete commercial decision.
- **Problem solved:** Premium is currently presentation-only; pretending otherwise would create false activation, payment, wallet, and support states.
- **Why it exists:** Monetization must earn trust and survive payment failure, reinstall, offline use, refunds, and cross-device questions.
- **Prerequisites:** MARZI-020, MARZI-022–024, MARZI-027, MARZI-032, MARZI-043–044; MARZI-D020 and release-platform/account decisions approved.
- **Dependencies:** Platform billing/backend receipt validation, entitlement authority, account/device identity policy, wallet/usage independence, privacy/legal/support.
- **Packages unblocked:** MARZI-051–053, MARZI-058.
- **Exact deliverables:** Approved product/price/benefit model; server-authoritative entitlement; purchase/confirm/pending/fail/cancel/restore/refund/expiry flows; offline grace; support/audit records; migration from presentation-only UI.
- **Expected files/areas:** Server billing/entitlement services and APIs, client purchase adapter/UI, storage/cache, Store/plans/Premium screens, configuration/secrets via approved ops path, tests/runbooks.
- **Measurable acceptance criteria:** isPremium reflects verified authority only; no fake success; duplicate/replayed receipts are idempotent; restore works; failure leaves balances/entitlement unchanged; prices/terms are market-correct; minutes/wallet remain separate and canonical.
- **Required automated tests:** Receipt/auth validation; duplicate/concurrent/pending/refund/expiry; offline grace; restore/reinstall; tampered client state; region/currency; entitlement-feature boundaries; rollback.
- **Required real-device tests:** Approved sandbox billing on every release platform; interruption/cancel/failure/restore; reinstall/device switch if supported; offline/expired; TalkBack/RTL/localized terms.
- **Product-owner approval gate:** Commercial Owner approves offering, prices, benefits, trials, markets, support/refund policy, and rollout; legal/privacy/platform approval required.
- **Asset dependency:** Approved Premium art/copy required for release, never fabricated.
- **Economic-system dependency:** Critical; wallet, minute packs, Store prices, and reward emission interactions require signed simulation.
- **Security/privacy impact:** Highest: authenticated server validation, replay protection, least-privilege secrets, audit/redaction, fraud and account recovery.
- **Accessibility/localization impact:** Terms/prices/errors/restore fully accessible and legally localized; no dark patterns.
- **Implementation risk:** Critical commercial, security, legal, and support risk.
- **Rollback strategy:** Stop new sales via server/config; retain/restore valid purchased rights; never revoke paid entitlement through client rollback.
- **Estimated engineering effort:** XL plus backend, legal, billing, and support work.
- **Can run in parallel:** Yes for legal/commercial/backend discovery; entitlement integration is serialized.
- **Completion evidence required:** Commercial approval, threat model, sandbox receipts, restore/refund matrix, accessibility/legal localization, rollback rehearsal.

# Reliability and observability — product operations

## MARZI-048 — Privacy-Safe Analytics and Operational Telemetry

- **Objective:** Make activation, learning, latency, errors, anti-farming, and release health measurable without collecting sensitive conversation content by default.
- **Problem solved:** Product/reliability decisions lack production evidence, while broad analytics could expose highly sensitive speech and transcript data.
- **Why it exists:** A commercial product needs actionable health signals and a trustworthy data contract.
- **Prerequisites:** MARZI-022–024, MARZI-030, MARZI-032–033, MARZI-043, MARZI-045; MARZI-D018, D021, and D024 approved.
- **Dependencies:** Typed event taxonomy, consent/legal basis, redaction, local queue/retry, retention/deletion, operational SLOs, incident response.
- **Packages unblocked:** MARZI-050, MARZI-052–053, MARZI-057–058, MARZI-060.
- **Exact deliverables:** Data inventory; consent modes; minimal event schema; no-content identifiers; latency/error/reward reason events; offline queue; redaction; retention/deletion; dashboards/alerts; audit and data-quality checks.
- **Expected files/areas:** Analytics/telemetry client and server adapters, consent/settings UI, storage queue/migration, observability config/runbooks, tests and privacy docs.
- **Measurable acceptance criteria:** No raw audio/transcript/prompt/correction by default; denied consent emits only approved essential operations data; events are typed/versioned/idempotent; deletion/expiry work; dashboards distinguish provider/app/network; no secrets/PII in logs.
- **Required automated tests:** Consent allow/deny/change; schema/redaction; offline retry/duplicate/order; retention/deletion; malformed payload; clock skew; event-budget; deliberate-secret/content leak negatives.
- **Required real-device tests:** Consent accessibility/localization; offline/online queue; app kill/update; network/provider errors; data deletion; low-bandwidth overhead.
- **Product-owner approval gate:** Product Owner approves metrics; Privacy/Legal approves purpose, basis, consent, fields, retention, processors, and markets.
- **Asset dependency:** None.
- **Economic-system dependency:** Economy events use reason/value IDs without raw learning content; cannot become reward authority.
- **Security/privacy impact:** Critical privacy/security scope.
- **Accessibility/localization impact:** Consent/settings avoid dark patterns and remain readable/operable in all locales.
- **Implementation risk:** Critical trust/compliance risk.
- **Rollback strategy:** Server-side ingestion disable and client kill switch; retain consent/deletion controls; safely drain/delete queued events per policy.
- **Estimated engineering effort:** L–XL.
- **Can run in parallel:** Yes for legal/schema/dashboard work; client integration follows domain contracts.
- **Completion evidence required:** Approved data map, privacy review, payload samples, leak tests, consent/device matrix, dashboard/alert demonstration.

# Accessibility and localization

## MARZI-049 — Multi-Language Expansion and Content Qualification

- **Objective:** Make language expansion capability-driven and release only target/interface/correction combinations that pass content, provider, voice, learning, and accessibility gates.
- **Problem solved:** A technically selectable language can still have incomplete scenarios, unsafe prompts, poor voices, missing correction copy, or invalid RTL.
- **Why it exists:** Global expansion requires a repeatable quality gate, not scattered conditionals or language-specific branding.
- **Prerequisites:** MARZI-021, MARZI-026, MARZI-028–031, MARZI-037–038, MARZI-042; MARZI-D010, D019, and D023 approved.
- **Dependencies:** Three-axis language model, target capability registry, content/localization pipeline, provider/voice matrix, evaluation harness, asset text rules.
- **Packages unblocked:** MARZI-050, MARZI-052–053, MARZI-056, MARZI-060.
- **Exact deliverables:** Per-language readiness schema; launch-list flags; complete UI/correction content; scenario/prompt/voice/STT qualification; mixed-language metadata; RTL; glossary/proper-name rules; fallback/support policy.
- **Expected files/areas:** Locale/target registries and resources, content bundles, prompt/voice capability adapters, language metadata, QA fixtures, release docs.
- **Measurable acceptance criteria:** No language exposed without 100% mandatory key/content/capability coverage; interface/target/correction axes never conflate; Arabic RTL/read order pass; proper names remain stable; unsupported capabilities fail honestly with an alternative.
- **Required automated tests:** Locale parity/plurals/long strings; capability combinations; missing-key/content/provider negatives; prompt/voice selection; lang/dir DOM; RTL geometry; pseudo-localization.
- **Required real-device tests:** Every launch locale/target on reference Android, TalkBack pronunciation/language changes, Arabic RTL, large font, speech/TTS, offline/update.
- **Product-owner approval gate:** Approve launch languages/order and localized product voice; learning/content and privacy specialists sign off per language.
- **Asset dependency:** Language-neutral MARZI-040 assets; any spoken/localized audio variant approved through MARZI-046.
- **Economic-system dependency:** Difficulty/reward calibration must not disadvantage a language; no value change here.
- **Security/privacy impact:** Per-provider language/data-region disclosure and minimization.
- **Accessibility/localization impact:** Primary package purpose; no partial “supported” language claim.
- **Implementation risk:** High content/provider/combinatorial risk.
- **Rollback strategy:** Disable an unqualified target via capability registry while preserving user data/readability; never silently switch target language.
- **Estimated engineering effort:** XL per launch wave.
- **Can run in parallel:** Yes by language after shared architecture freezes.
- **Completion evidence required:** Readiness scorecard per language, content/provider/voice results, RTL/device captures, specialist approvals, fallback tests.

## MARZI-050 — Accessibility, Responsive, and Android PWA Qualification

- **Objective:** Prove the complete product is usable across supported small screens, system settings, assistive technology, browser/standalone modes, safe areas, keyboard, and call states.
- **Problem solved:** Component-level fixes do not prove end-to-end accessibility or real Android platform behavior.
- **Why it exists:** Public readiness requires measured device evidence, not only desktop emulation or static checks.
- **Prerequisites:** MARZI-023, MARZI-025–026, MARZI-034, MARZI-036–046, MARZI-049; all release UI/assets integrated.
- **Dependencies:** Device lab, deterministic safe-area simulation plus real insets, screen-reader expertise, rendered test harness, performance and PWA update paths.
- **Packages unblocked:** MARZI-052–053.
- **Exact deliverables:** WCAG-oriented audit; first-run/call/overlay/Store/Profile/learning journey matrix; target/focus/semantics/zoom/RTL/reduced-motion checks; Android browser/standalone/keyboard/safe-area/back/gesture evidence; bounded remediation report.
- **Expected files/areas:** Browser/device test suites and fixtures, accessibility helpers, approved UI corrections only through scoped remediation, evidence and release docs.
- **Measurable acceptance criteria:** Required viewports 320×568 through 412×915 plus tablet pass; no horizontal overflow/clipped CTA/gesture collision; one scroll/safe-area owner; all interactive paths operable; correct TalkBack/focus/Back; no essential color/audio/motion-only meaning.
- **Required automated tests:** Axe/semantic checks; rendered geometry/overflow/targets/focus/modal; zoom/font/RTL/reduced-motion; duplicate IDs/errors; history/safe-area simulation; failure-mode coverage.
- **Required real-device tests:** Supported Android versions/devices, Chrome tab and installed PWA, gesture/3-button navigation, keyboard/orientation/background/reload, TalkBack, font/display scaling, Spanish and Arabic, portrait success/failure, offline/update.
- **Product-owner approval gate:** Product Owner accepts any bounded visual tradeoff; Accessibility Owner must approve release matrix and exceptions.
- **Asset dependency:** All release assets from MARZI-040–041/046 must be present; placeholders tracked separately cannot pass public asset readiness.
- **Economic-system dependency:** Reward/Store/Premium/limit paths included without changing policy.
- **Security/privacy impact:** Permission/consent/payment/accessibility flows included; device evidence contains no learner secrets.
- **Accessibility/localization impact:** Primary package purpose.
- **Implementation risk:** High integration and device-coverage risk.
- **Rollback strategy:** Each defect correction is independently revertible/flagged; qualification itself changes no runtime; no waiver hides a failed critical path.
- **Estimated engineering effort:** XL including device lab and remediation cycles.
- **Can run in parallel:** Yes across device/locale matrices after a frozen candidate; runtime corrections are serialized.
- **Completion evidence required:** Full measurement ledger, accessibility tree/manual notes, device metadata/videos, failure/retest links, exception approvals.

# Commercial readiness

## MARZI-051 — Accounts, Cloud Sync, and User Data Control

- **Objective:** If approved, provide secure optional account recovery/synchronization with explicit data classes, conflicts, deletion, and local-first resilience.
- **Problem solved:** Device-local progress can be lost or unavailable across devices, but hidden sync would introduce identity, privacy, and conflict risk.
- **Why it exists:** Cross-device/recovery value must be separated from UI polish and designed as a full trust architecture.
- **Prerequisites:** MARZI-022–024, MARZI-027, MARZI-032, MARZI-043–044, MARZI-047–048; MARZI-D022 and D024 approved.
- **Dependencies:** Authentication/account recovery, server data authority, schema versions, conflict resolution, encryption, entitlement restoration, consent/deletion/export.
- **Packages unblocked:** MARZI-052–053, MARZI-055, MARZI-058.
- **Exact deliverables:** Approved account mode; per-data-class sync policy; secure auth/recovery; offline queue; deterministic conflict resolution; encryption/access controls; export/delete; migration from local-only; entitlement/reward reconciliation.
- **Expected files/areas:** Server auth/data services/APIs, client account/sync adapters/UI, storage/migration, privacy/settings/support, security and integration tests.
- **Measurable acceptance criteria:** Local use remains available if approved; no silent overwrite/loss/double reward; conflicts are deterministic and auditable; logout/revoke/delete work; paid rights restore correctly; corrupt/old/offline clients recover safely.
- **Required automated tests:** Auth/session fixation/CSRF as applicable; authorization isolation; sync conflict/order/duplicate/clock skew; offline/reinstall; schema versions; delete/export; ledger/entitlement reconciliation; threat negatives.
- **Required real-device tests:** Create/sign-in/recover/logout/delete; two-device conflict; offline edits/reconnect; reinstall/update; accessibility/localization; interrupted migration.
- **Product-owner approval gate:** Product Owner approves account requirement/optionality and synced data classes; Privacy/Legal/Security approve identity, retention, deletion, processors, and markets.
- **Asset dependency:** None beyond approved account UI icons/brand.
- **Economic-system dependency:** Server authority and idempotent reconciliation are mandatory for rewards/purchases; no silent value rewrite.
- **Security/privacy impact:** Critical authentication, authorization, encryption, account recovery, data subject rights.
- **Accessibility/localization impact:** Accessible recovery alternatives and legally localized consent/errors.
- **Implementation risk:** Critical security/data/program risk; package may be deferred if device-local v1 is approved.
- **Rollback strategy:** Stop new sync, retain local read/write and server export/delete; preserve server records per policy; never downgrade paid rights or discard unsynced changes.
- **Estimated engineering effort:** XL.
- **Can run in parallel:** Yes for backend/security/privacy discovery; end-to-end integration is serialized.
- **Completion evidence required:** Approved data map, threat model/pentest, migration/conflict corpus, two-device matrix, delete/export proof, rollback rehearsal.

## MARZI-052 — Support, Commercial, and Release Operations

- **Objective:** Establish the human and operational system required to support real learners, purchases, privacy requests, incidents, staged rollout, and rollback.
- **Problem solved:** A technically passing build is not commercially operable without support ownership, runbooks, service levels, and controlled releases.
- **Why it exists:** Trust failures often occur after deployment through unclear support, restore, deletion, incident, or update handling.
- **Prerequisites:** MARZI-024, MARZI-034, MARZI-044, MARZI-047–051; MARZI-D020–D025 and applicable legal decisions approved.
- **Dependencies:** Entitlement/account decisions, analytics/alerts, platform matrix, privacy rights, localization, PWA/TWA distribution, staging environment.
- **Packages unblocked:** MARZI-053.
- **Exact deliverables:** Support taxonomy/macros/escalation; purchase/restore/refund and privacy request runbooks; incident/SLO/on-call; staged rollout/canary/rollback; release checklist; version/support policy; status communication; store/listing requirements.
- **Expected files/areas:** Operations/release/support/privacy docs, deployment configuration only in a separately approved implementation, dashboards/alerts, support tooling/tests.
- **Measurable acceptance criteria:** Every Critical journey/failure has an owner and runbook; rollback and kill switches rehearsed; support can identify exact version/entitlement without secrets; privacy requests meet policy; listings accurately describe support/platform/language scope.
- **Required automated tests:** Runbook/link/schema validation; release artifact/SHA checks; configuration/environment separation; rollback drills; support redaction fixtures; deployment guard self-tests.
- **Required real-device tests:** Staging install/update/rollback; purchase/restore/support journey if enabled; privacy/account controls; locale listings/content; offline/stale-client recovery.
- **Product-owner approval gate:** Product Owner/Commercial/Release owners approve support scope, SLAs, markets, platform/listing copy, rollout, and rollback authority; legal approves policies.
- **Asset dependency:** Final icons/screenshots/store assets required for chosen distribution.
- **Economic-system dependency:** Support/refund/reconciliation procedures must match approved rewards/payments.
- **Security/privacy impact:** Incident response, access controls, redacted support data, privacy request authentication.
- **Accessibility/localization impact:** Accessible support channels and localized critical/legal communications.
- **Implementation risk:** High operational/commercial risk.
- **Rollback strategy:** Pause rollout or sales, retain staging/previous artifact, communicate status, preserve user rights/data.
- **Estimated engineering effort:** L across engineering, support, legal, and operations.
- **Can run in parallel:** Yes after policies stabilize; final rehearsal uses the release candidate.
- **Completion evidence required:** Signed runbooks/RACI, drill transcripts, environment/SHA proofs, support scenarios, listing/market approvals.

# Release

## MARZI-053 — Public Release Qualification and Go/No-Go

- **Objective:** Qualify one exact artifact for public release using product, runtime, documentation, asset, device, privacy, commercial, operational, and rollback evidence.
- **Problem solved:** Passing tests or staging alone cannot prove a world-class, supportable public release.
- **Why it exists:** Release must be a controlled evidence decision, not the accidental result of merging.
- **Prerequisites:** All mandatory pre-release packages MARZI-020–052 complete or explicitly deferred by an approved noncritical decision; MARZI-D001–D025 resolved as release scope requires.
- **Dependencies:** Frozen release candidate, independent reviews, full CI/browser/device/security/performance/localization/accessibility matrices, assets, operations, staged deployment.
- **Packages unblocked:** MARZI-054–060 post-launch program and production release authorization.
- **Exact deliverables:** Release-candidate manifest/SBOM; complete acceptance ledger; unresolved-risk register; staging soak; update/offline/rollback proof; security/privacy/commercial/accessibility sign-offs; go/no-go record; production and rollback plan.
- **Expected files/areas:** Release/evidence documentation; only separately approved qualification corrections may touch runtime before the candidate refreezes.
- **Measurable acceptance criteria:** No Critical/High defect; every mandatory check verified on exact SHA; runtime/docs/assets READY; performance/SLO and device/language/platform matrices pass; main/production changes remain separately authorized; rollback proven.
- **Required automated tests:** Entire required CI suite, dependency/security/SBOM, migrations, browser matrices, service-worker/install/update, contract/economy/entitlement, release artifact reproducibility.
- **Required real-device tests:** Every supported platform/install mode/locale/accessibility path on the frozen artifact; real network/offline/update/rollback; staging soak.
- **Product-owner approval gate:** Exact final go/no-go by Product Owner with Codex, Release, Security/Privacy, Accessibility, Learning, Commercial, and Asset approvals as applicable.
- **Asset dependency:** Every public asset production-ready, approved, rights-cleared, versioned, and cached correctly; no unapproved placeholder.
- **Economic-system dependency:** Economy simulation, migration, fraud/entitlement, Store and limit behavior match approved release policy.
- **Security/privacy impact:** Final threat/privacy/compliance/incident readiness gate.
- **Accessibility/localization impact:** Final supported-matrix gate; unsupported combinations not claimed.
- **Implementation risk:** Critical release risk.
- **Rollback strategy:** No-go or staged stop; revert to last qualified artifact via rehearsed process; preserve data/entitlements and communicate.
- **Estimated engineering effort:** L–XL qualification effort.
- **Can run in parallel:** No for final verdict; evidence collection can parallelize against one frozen candidate.
- **Completion evidence required:** Signed acceptance ledger, exact SHA/artifact/hash, full test/device results, staging soak, risk decisions, rollback drill, go/no-go record.

# Post-launch

## MARZI-054 — Continuous AI and Prompt Quality Evaluation

- **Objective:** Detect conversation-quality, safety, correction, language, and prompt regressions before they reach broad cohorts.
- **Problem solved:** Provider/model behavior can drift even when application code and static tests do not.
- **Why it exists:** A conversational learning product needs continuous evidence against its own learning and trust rubric.
- **Prerequisites:** MARZI-021, MARZI-030–031, MARZI-045, MARZI-048, MARZI-053.
- **Dependencies:** Versioned prompt/provider registry, consent-safe evaluation corpus, human learning/safety rubric, cost/capacity controls.
- **Packages unblocked:** MARZI-056, MARZI-058, MARZI-060 and provider/model upgrades.
- **Exact deliverables:** Curated synthetic/rights-safe evaluation sets; automated rubric; human review sampling; drift/canary gates; prompt/model comparison; rollback thresholds; failure taxonomy.
- **Expected files/areas:** Evaluation datasets/config, offline harness, CI/scheduled jobs, dashboards/runbooks, prompt/provider release documentation; runtime changes only through later reviewed packages.
- **Measurable acceptance criteria:** Every prompt/provider version has reproducible baseline; safety/JSON/language/identity/learning metrics cannot silently regress; evaluator disagreement is measured; no raw learner content enters the corpus by default.
- **Required automated tests:** Dataset/schema integrity; deterministic fixtures; known-good/bad calibration; evaluator failure/bias; model timeout/rate/cost; threshold/rollback self-tests.
- **Required real-device tests:** None for offline evaluation itself; any user-visible provider change re-enters the appropriate call/device qualification.
- **Product-owner approval gate:** Approve quality rubric and acceptable tradeoffs; Learning/Safety/Privacy approve corpus and thresholds.
- **Asset dependency:** None.
- **Economic-system dependency:** Tracks provider/evaluation cost; cannot alter learner rewards.
- **Security/privacy impact:** Corpus provenance, prompt/output redaction, provider data-use and access control.
- **Accessibility/localization impact:** Evaluation stratified by language, accent/access route, and assistance mode without false pronunciation claims.
- **Implementation risk:** High evaluator-validity and recurring-cost risk.
- **Rollback strategy:** Revert prompt/model registry pointer; retain evidence; disable a faulty evaluator without disabling safety gates blindly.
- **Estimated engineering effort:** L initially, ongoing operations.
- **Can run in parallel:** Yes after production contracts stabilize.
- **Completion evidence required:** Baselines, calibration confusion matrix, corpus/privacy approval, canary demonstration, rollback exercise.

## MARZI-055 — Storage Evolution, Export, and Long-Term Compatibility

- **Objective:** Keep years of learner data readable, portable, recoverable, and safely migratable as local and optional cloud schemas evolve.
- **Problem solved:** One-time migrations do not provide a durable compatibility and data-ownership strategy.
- **Why it exists:** Long-term trust requires upgrade, downgrade, export, deletion, corruption, and abandoned-version policies.
- **Prerequisites:** MARZI-027, MARZI-043–044, MARZI-051 if cloud sync ships, MARZI-053.
- **Dependencies:** Schema registry, migration harness, ledger integrity, account/sync policy, retention/export/deletion decisions.
- **Packages unblocked:** Future data-model, economy, account, and learning-history packages.
- **Exact deliverables:** Compatibility window; migration registry; canonical export format; import validation if approved; recovery/repair tooling; future-version behavior; archival/retention and deprecation runbooks.
- **Expected files/areas:** Storage/migration modules, export/settings UI, server sync schema if applicable, fixtures, compatibility CI, support/privacy docs.
- **Measurable acceptance criteria:** Every supported historical fixture upgrades idempotently; unknown future data is not destroyed; export is complete/documented; corruption is bounded and user-visible; rollback preserves ledger/entitlement/progress.
- **Required automated tests:** Version matrix; missing/corrupt/partial/quota/future schemas; repeated/concurrent migration; export round trip and redaction; rollback/downgrade; large dataset performance.
- **Required real-device tests:** Multi-version installed-PWA upgrade, quota pressure, app kill during migration, export/delete/reinstall, optional sync conflict.
- **Product-owner approval gate:** Approve supported history/compatibility window and export/import scope; Privacy/Legal approves retained/deleted data classes.
- **Asset dependency:** None.
- **Economic-system dependency:** Currency/ledger/purchase history receives stricter immutable and reconciliation rules.
- **Security/privacy impact:** Sensitive export protection, data minimization, deletion exceptions, schema validation.
- **Accessibility/localization impact:** Recovery/export/deprecation messages accessible and localized; no inaccessible data-loss path.
- **Implementation risk:** High irreversible-data risk.
- **Rollback strategy:** Copy-on-write/version checkpoints where feasible; retain old reader during window; never reset all user data as fallback.
- **Estimated engineering effort:** L, increasing with supported history.
- **Can run in parallel:** Yes after schema owners freeze; migration integration is serialized.
- **Completion evidence required:** Fixture archive, compatibility report, export specification, interrupted-migration/device proof, privacy/support approval.

## MARZI-056 — Curriculum and Scenario Expansion

- **Objective:** Expand Marzi’s scenario catalogue through the approved competency/content/localization pipeline without reducing conversation quality.
- **Problem solved:** Hand-added scenarios can create gaps in objectives, level, prompts, translations, identity, accessibility, and evaluation.
- **Why it exists:** Sustainable learning breadth requires a repeatable content operation rather than code edits.
- **Prerequisites:** MARZI-021, MARZI-026, MARZI-028, MARZI-042, MARZI-044, MARZI-049, MARZI-053–054.
- **Dependencies:** Competency graph, scenario schema/editor, localization/target readiness, prompt evaluation, character/voice availability.
- **Packages unblocked:** New domains/languages, MARZI-057 and MARZI-060 analyses.
- **Exact deliverables:** Approved content waves; objective/level/prerequisite mapping; localized scenario/character copy; evaluation fixtures; content QA/release/rollback; deprecation/version rules.
- **Expected files/areas:** Content data/bundles and authoring tools, locale resources, evaluation datasets, asset references, learning map and tests; no business-rule change.
- **Measurable acceptance criteria:** 100% schema/objective/localization/provider/evaluation coverage; no duplicate scenario/character ID; appropriate difficulty; safe/culturally reviewed dialogue; hidden until its language wave qualifies.
- **Required automated tests:** Schema/ID/references; objective/level coverage; locale parity; prompt strict JSON/safety; asset/provider capability; content diff and rollback.
- **Required real-device tests:** Moderated sample from each wave on small Android, speech/TTS/correction/translation, TalkBack/RTL where applicable, slow network.
- **Product-owner approval gate:** Approve domains, characters, goals, sequence, tone, cultural content, and launch wave; Learning/Localization/Safety sign off.
- **Asset dependency:** New characters/backgrounds/voices follow MARZI-029/040–041; missing art is explicit and may block release.
- **Economic-system dependency:** Difficulty/completion inputs require MARZI-043 calibration; no scenario-specific reward invention.
- **Security/privacy impact:** Sensitive scenarios receive safety, crisis, provider, and data-minimization review.
- **Accessibility/localization impact:** Primary content quality scope across language and alternative modalities.
- **Implementation risk:** High content-scale and quality-consistency risk.
- **Rollback strategy:** Versioned content flags remove a bad scenario without deleting history; retain ID for historical records.
- **Estimated engineering effort:** M–XL per wave.
- **Can run in parallel:** Yes by independently reviewed content wave.
- **Completion evidence required:** Coverage report, specialist approvals, evaluation scores, device samples, content/version manifest.

## MARZI-057 — Habit, Retention, and Ethical Experimentation

- **Objective:** Improve first value, daily practice, return behavior, and emotional engagement using consent-safe experiments that preserve learning and trust.
- **Problem solved:** Retention changes can optimize clicks or rewards while harming learning, accessibility, privacy, or economic integrity.
- **Why it exists:** Sustainable habit formation needs evidence and guardrails aligned with Marzi’s identity.
- **Prerequisites:** MARZI-021, MARZI-032, MARZI-043–044, MARZI-048, MARZI-053; analytics/privacy and experiment policies approved.
- **Dependencies:** Learning outcomes, typed events, cohort/flag controls, economy simulator, notification/consent policy, support.
- **Packages unblocked:** Validated onboarding/habit/recommendation improvements and MARZI-060 outcome analysis.
- **Exact deliverables:** Ethical experiment charter; activation/retention/learning guardrails; cohort assignment; experiment registry; first-value and return hypotheses; stopping rules; result/decision archive.
- **Expected files/areas:** Experiment/flag configuration, analytics schemas/dashboards, bounded UI variants through separate specs, notification/settings if approved, docs/tests.
- **Measurable acceptance criteria:** Every experiment has a learning hypothesis, guardrails, sample/stopping plan, consent basis, accessibility/localization parity, no dark pattern, no hidden reward/price change, and an archival decision.
- **Required automated tests:** Deterministic assignment; exclusion/consent; flag isolation; no entitlement/economy bypass; event schema; stale experiment cleanup; rollback.
- **Required real-device tests:** Every user-visible variant across required locale/device/a11y matrix before exposure; notification behavior only after contextual permission.
- **Product-owner approval gate:** Approve each hypothesis/variant/exposure and success metric; Economy/Privacy/Accessibility/Learning owners approve affected guardrails.
- **Asset dependency:** Variant art/audio must be separately approved; no placeholder exposed as production.
- **Economic-system dependency:** No reward, streak, price, or scarcity experiment without an explicit economy decision/simulation.
- **Security/privacy impact:** Consent, cohort privacy, minimization, no sensitive-content segmentation.
- **Accessibility/localization impact:** Equal eligibility and functional parity; retention metrics stratified carefully without discrimination.
- **Implementation risk:** High product-ethics and false-causality risk.
- **Rollback strategy:** Immediate flag shutdown; preserve user progress/preferences; remove expired assignment/events per retention policy.
- **Estimated engineering effort:** M platform plus ongoing small packages.
- **Can run in parallel:** Yes for independent experiments under one governance registry.
- **Completion evidence required:** Approved experiment cards, exposure/guardrail dashboards, accessibility matrix, statistical/result review, rollback proof.

## MARZI-058 — Capacity, Cost, and Vendor Resilience

- **Objective:** Keep conversational quality and availability sustainable under growth, provider incidents, quota limits, and cost pressure.
- **Problem solved:** Low latency and rich AI/audio features can become unreliable or economically unsustainable at production scale.
- **Why it exists:** Scale must not trigger silent quality reduction, exposed keys, unsafe fallbacks, or unplanned learner limits.
- **Prerequisites:** MARZI-032–033, MARZI-045, MARZI-047–048 if commercial, MARZI-053–054.
- **Dependencies:** Provider registry/SLOs, usage/cost telemetry, capacity model, rate limits, fallback quality gates, commercial forecasts.
- **Packages unblocked:** Provider diversification, market expansion, and sustainable post-launch growth.
- **Exact deliverables:** Load/cost model; quota/circuit-breaker policy; provider failover qualification; caching boundaries; capacity alarms; degraded-mode UX; cost/performance optimization register; disaster/vendor-exit plan.
- **Expected files/areas:** Server/provider infrastructure, load/evaluation suites, operational config/runbooks, degraded-state UI through separate reviewed scope, dashboards.
- **Measurable acceptance criteria:** Approved peak load passes SLO; provider outage degrades honestly; no API response/prompt/audio privacy breach through caching; failover meets quality/language gates; per-session cost and capacity headroom are observable.
- **Required automated tests:** Load/soak; rate/quota/circuit-breaker; failover ordering; duplicate request/reward prevention; cache isolation; timeout/backpressure; configuration/secrets; cost-budget alerts.
- **Required real-device tests:** Staging under induced latency/outage/rate limit; degraded/offline/recovery; active-call continuity; message and balance integrity.
- **Product-owner approval gate:** Approve user-visible degraded behavior and any limit/pricing implication; Technical/Commercial owners approve SLO/cost tradeoffs.
- **Asset dependency:** Fallback UI uses approved existing states; no new asset required unless Product Owner chooses one.
- **Economic-system dependency:** Usage limits/prices cannot change as an optimization without explicit economy/commercial approval.
- **Security/privacy impact:** Provider data handling, key isolation, tenant/cache boundaries, incident/vendor exit.
- **Accessibility/localization impact:** Degraded/error/recovery states accessible and localized; fallback support per language.
- **Implementation risk:** Critical operational and vendor-coupling risk.
- **Rollback strategy:** Disable new routing/cache policy; restore last qualified provider/config; preserve active session/usage/reward idempotency.
- **Estimated engineering effort:** L initially, ongoing capacity operations.
- **Can run in parallel:** Yes for modeling/load harness; routing integration is serialized.
- **Completion evidence required:** Load/cost report, outage/failover drills, quality comparison, security cache tests, approved SLO/capacity runbook.

## MARZI-059 — Asset, Outfit, and Seasonal Content Expansion

- **Objective:** Expand Marzi’s visual/audio catalogue without breaking canonical identity, device budgets, outfit compatibility, accessibility, or Store integrity.
- **Problem solved:** One-off production additions can reintroduce inconsistent art, combinatorial variants, oversized caches, and missing fallbacks.
- **Why it exists:** A durable content pipeline lets the product feel alive while protecting the core character.
- **Prerequisites:** MARZI-029, MARZI-040–041, MARZI-044, MARZI-046, MARZI-053; catalog/commercial decisions for each wave.
- **Dependencies:** Versioned manifests, production briefs, compatibility matrix, rights/licensing, Store/ownership/equip, performance/cache budgets.
- **Packages unblocked:** Future catalogue, celebrations, campaigns, and culturally localized art/audio waves.
- **Exact deliverables:** Approved art/audio waves; outfit/accessory compatibility; preview/call/profile/reward variants; seasonal lifecycle; manifest/cache updates; archival/fallback/deprecation plan.
- **Expected files/areas:** Approved assets and manifests, catalogue/content records, preview/composition adapters, localization, service-worker/static cache, asset/performance tests/docs.
- **Measurable acceptance criteria:** Every asset matches canonical DNA and provenance; no board crop/embedded claim; compatible items render across promised surfaces; missing/retired items fall back honestly; byte/cache/memory budgets pass; owned items never disappear silently.
- **Required automated tests:** Manifest/security/hash/dimension; compatibility matrix; ownership/equip across asset versions; missing/retired/offline cache; localization; performance and orphan checks.
- **Required real-device tests:** Representative stage/outfit/accessory combinations, Store-to-call visibility, low storage/network, update/rollback, RTL, TalkBack, reduced motion/audio setting.
- **Product-owner approval gate:** Approve each catalogue theme/item/cue, merchandising, availability, price impact, cultural fit, and asset exports.
- **Asset dependency:** Primary package purpose; all files production-ready and rights-cleared.
- **Economic-system dependency:** Any price, scarcity, availability, purchase, or reward relationship needs explicit economy/commercial approval.
- **Security/privacy impact:** Asset validation/provenance; no runtime upload/admin path.
- **Accessibility/localization impact:** Textual names/states, language-neutral art, cultural/localization review, nonessential audio/motion controls.
- **Implementation risk:** Medium technical, High brand/catalogue risk.
- **Rollback strategy:** Versioned catalogue/manifest; remove availability without removing ownership; retain compatible fallback and previous cached release as required.
- **Estimated engineering effort:** M–XL per wave.
- **Can run in parallel:** Yes across independently approved production waves; integration is serialized per manifest.
- **Completion evidence required:** Approval/provenance register, compatibility/byte matrix, Store-call device journey, update/rollback proof.

## MARZI-060 — Learning Efficacy and Product Outcomes

- **Objective:** Determine whether Marzi measurably improves real conversational capability and use the evidence to govern future curriculum, assistance, rewards, and AI work.
- **Problem solved:** Engagement, XP, call count, and self-reported satisfaction do not prove learning transfer.
- **Why it exists:** A world-class learning product must validate its central promise and correct course when evidence disagrees.
- **Prerequisites:** MARZI-021, MARZI-032, MARZI-042–044, MARZI-048–049, MARZI-053–057; approved research/privacy plan.
- **Dependencies:** Competency/mastery model, validated assessments, learning/usage data minimization, consent, experiment governance, specialist/statistical review.
- **Packages unblocked:** Evidence-based revisions to curriculum, coaching, assistance, difficulty, rewards, target-language rollout, and product strategy.
- **Exact deliverables:** Outcome framework; pre/post/retention assessments; transfer and confidence measures; cohort/attrition/bias analysis; qualitative research; reporting cadence; decision archive; remediation hypotheses.
- **Expected files/areas:** Research protocols, consent/materials, analysis pipeline and de-identified datasets, dashboards/reports; product changes require separate packages.
- **Measurable acceptance criteria:** Outcomes measure target competencies rather than XP; sample/attrition/uncertainty are reported; no unsupported causal claim; accessibility/language cohorts reviewed; negative/neutral findings are retained and acted on.
- **Required automated tests:** Assessment/schema/scoring reproducibility; de-identification/access; cohort/attrition calculations; missing-data/uncertainty; analysis versioning; result integrity.
- **Required real-device tests:** Research journey and assessments on supported devices/access modes; any new product behavior uses its own package matrix.
- **Product-owner approval gate:** Product Owner/Learning/Research approve questions and decisions; Privacy/Legal/Ethics approve consent, data, recruitment, retention, and publication.
- **Asset dependency:** Research uses approved product assets; none created by default.
- **Economic-system dependency:** Reward/retention correlations do not authorize formula changes; economy revisions require a new decision/simulation.
- **Security/privacy impact:** Critical research consent, minimization, de-identification, access, retention, deletion, and publication controls.
- **Accessibility/localization impact:** Instruments valid across supported languages and access needs; exclude no cohort silently.
- **Implementation risk:** High research-validity, privacy, and strategic risk.
- **Rollback strategy:** Stop collection, preserve/delete data according to consent/policy, withdraw invalid analysis; product runtime remains unchanged until a separate approved package.
- **Estimated engineering effort:** XL research program.
- **Can run in parallel:** Yes for approved research work after stable measures; product changes remain separate.
- **Completion evidence required:** Approved protocol, instrument validity, privacy record, reproducible analysis, limitations, specialist review, Product Owner decision log.

## MARZI-061 — External Review Readiness Package

- **Objective:** Prepare qualified humans to execute the four external reviews MARZI-021 depends on — learning and pedagogy, six-language linguistic, accessibility, and a moderated Android study — without performing, inferring, or granting any of them.
- **Problem solved:** MARZI-021 is technically approved for specialist review, but there is no charter, workflow, schema, matrix, evidence structure, or decision record for a reviewer to actually work from, so the four gates cannot be executed or audited.
- **Why it exists:** External review is the gate between a technically validated static curriculum and any educational, linguistic, accessibility, runtime, or release claim. Preparation must be bounded, auditable, and incapable of self-granting a result.
- **Prerequisites:** MARZI-021 static contracts with independent technical approval; Product Owner package-allocation decision of 2026-08-04.
- **Dependencies:** `docs/learning/contracts/v1/**` as the reviewed artifact; `docs/learning/SPECIALIST_REVIEW.md` as the canonical review record; the MARZI-021 learning validator; the canonical six-locale set.
- **Packages unblocked:** Execution of the four external-review tracks, and through them MARZI-034, MARZI-042–044 and any package whose gate names specialist, linguistic, or accessibility approval.
- **Exact deliverables:** Review governance model; four reviewer protocols; six locale checklists; seven shared templates; eight strict schemas; a 94-entry learning evidence matrix; a 564-entry linguistic matrix; an accessibility plan carrying the open Arabic issue; an Android study protocol with no results; positive and negative fixtures; a 30-check dependency-free validator.
- **Expected files/areas:** `docs/packages/MARZI-061.md`, `docs/learning/reviews/marzi-061/v1/**`, `test/marzi-061-external-review-readiness.js`, `test/fixtures/marzi-061-external-reviews/**`, plus bounded updates to this roadmap, `.ai/bin/docs-validate`, `docs/learning/SPECIALIST_REVIEW.md`, and the implementation report.
- **Measurable acceptance criteria:** Exactly four tracks exist, each PREPARED and still PENDING, unappointed, unstarted, unevidenced and undecided; the learning matrix has 94 entries and the linguistic matrix 564 across `ar,en,es,it,tr,uk`; every copied string equals its canonical contract value; `MARZI-A11Y-KNOWN-001` remains open; no reviewer, participant, evidence, result or approval is invented; the runtime diff is empty.
- **Required automated tests:** `node test/marzi-061-external-review-readiness.js` at 30/30; unchanged `node test/learning-contracts.js` at 36/36; unchanged application suite; schema and fixture reason isolation; twelve adversarial mutation proofs; `git diff --check`; documentation validation.
- **Required real-device tests:** None. This package prepares the moderated Android study; it does not run it. Device execution belongs to the study itself under separate legal, privacy and Product Owner approval.
- **Product-owner approval gate:** The 2026-08-04 allocation decision authorizes preparation only. Reviewer appointment, study recruitment, participant consent, legal and privacy approval, and every external-review decision remain separate later gates.
- **Asset dependency:** None. No artwork, audio, icon, or generated production asset is created or referenced.
- **Economic-system dependency:** None. No XP, coin, price, entitlement, streak, or reward value is read, written, or referenced.
- **Security/privacy impact:** Stores no participant, learner, transcript, credential, contact, demographic, consent, or health data. Recruitment and data collection require legal and privacy approval before the study runs.
- **Accessibility/localization impact:** Establishes the accessibility review conditions and six-locale review structure. Structural coverage is not linguistic or accessibility approval, and `MARZI-A11Y-KNOWN-001` is recorded as OPEN rather than fixed.
- **Implementation risk:** Low technical risk, high governance risk if preparation were ever mistaken for approval; the validator exists to make that mistake fail.
- **Rollback strategy:** Revert the single preparation commit. It removes only MARZI-061 preparation and its bounded roadmap and tooling additions, preserves MARZI-021 and MARZI-022, touches no runtime or learner data, and requires no migration. Genuine review evidence recorded later must never be mixed into this commit.
- **Estimated engineering effort:** M.
- **Can run in parallel:** Yes. Preparation may proceed alongside architecture specification; the external decisions it enables remain gates before the relevant runtime or release claims.
- **Completion evidence required:** 30/30 package validator, unchanged learning and application suites, matrix and inventory counts, fixture reason isolation, adversarial mutation results, empty prohibited diffs, and independent review of the exact implementation commit.

**Product Owner allocation, approved 2026-08-04:** preserve MARZI-022 as Domain
Ownership and Event Contracts, assign MARZI-061 to External Review Readiness,
update canonical governance accordingly, and replace the exported mandate with a
MARZI-061 mandate before implementation. The earlier external planning artifact
named `MARZI-022_CLAUDE_CODE_MANDATE.md` was superseded before implementation and
is not an executable authority; MARZI-022 keeps its original title, objective,
dependencies, deliverables, acceptance criteria and package relationships
unchanged. Implementing this preparation package does not mean MARZI-061 has
been externally reviewed.

# Dependency graph

The graph contains every pre-release package. Parallel edges describe dependency eligibility, not authorization for two agents to edit application files simultaneously.

~~~mermaid
flowchart LR
  P020["MARZI-020"] --> P021["MARZI-021"]
  P020 --> P022["MARZI-022"]
  P020 --> P023["MARZI-023"]
  P020 --> P024["MARZI-024"]
  P020 --> P025["MARZI-025"]
  P020 --> P026["MARZI-026"]
  P020 --> P027["MARZI-027"]
  P020 --> P028["MARZI-028"]
  P020 --> P029["MARZI-029"]

  P021 --> P022
  P021 --> P034["MARZI-034"]
  P021 --> P042["MARZI-042"]
  P021 --> P043["MARZI-043"]
  P021 --> P044["MARZI-044"]
  P022 --> P023
  P022 --> P027
  P022 --> P030["MARZI-030"]
  P022 --> P035["MARZI-035"]
  P023 --> P024
  P023 --> P025
  P023 --> P026
  P023 --> P027
  P023 --> P028
  P023 --> P029
  P024 --> P034
  P024 --> P035
  P024 --> P040["MARZI-040"]
  P024 --> P043
  P024 --> P045["MARZI-045"]
  P024 --> P047["MARZI-047"]
  P025 --> P026
  P025 --> P034
  P025 --> P036["MARZI-036"]
  P025 --> P039["MARZI-039"]
  P025 --> P040
  P026 --> P034
  P026 --> P036
  P026 --> P037["MARZI-037"]
  P026 --> P038["MARZI-038"]
  P026 --> P039
  P026 --> P044
  P026 --> P049["MARZI-049"]
  P026 --> P050["MARZI-050"]
  P027 --> P034
  P027 --> P035
  P027 --> P042
  P027 --> P043
  P027 --> P044
  P027 --> P047
  P027 --> P051["MARZI-051"]
  P028 --> P030
  P028 --> P031["MARZI-031"]
  P028 --> P034
  P028 --> P037
  P028 --> P038
  P028 --> P044
  P028 --> P049
  P029 --> P040
  P029 --> P041["MARZI-041"]
  P029 --> P042
  P029 --> P046["MARZI-046"]
  P029 --> P049

  P030 --> P031
  P030 --> P033["MARZI-033"]
  P030 --> P035
  P030 --> P037
  P030 --> P045
  P030 --> P048["MARZI-048"]
  P031 --> P035
  P031 --> P037
  P031 --> P042
  P031 --> P043
  P031 --> P045
  P032["MARZI-032"] --> P033
  P032 --> P043
  P032 --> P045
  P032 --> P047
  P032 --> P048
  P032 --> P051
  P033 --> P035
  P033 --> P041
  P033 --> P045
  P033 --> P048

  P034 --> P044
  P034 --> P050
  P034 --> P052["MARZI-052"]
  P035 --> P036
  P035 --> P037
  P035 --> P038
  P035 --> P039
  P035 --> P042
  P035 --> P043
  P035 --> P045
  P036 --> P037
  P036 --> P038
  P036 --> P039
  P036 --> P045
  P036 --> P050
  P037 --> P042
  P037 --> P043
  P037 --> P044
  P037 --> P050
  P038 --> P044
  P038 --> P050
  P039 --> P041
  P039 --> P045
  P039 --> P046
  P039 --> P050

  P040 --> P041
  P040 --> P044
  P040 --> P050
  P040 --> P053["MARZI-053"]
  P041 --> P044
  P041 --> P046
  P041 --> P050
  P041 --> P053
  P042 --> P043
  P042 --> P044
  P042 --> P050
  P043 --> P044
  P043 --> P047
  P043 --> P050
  P043 --> P053
  P044 --> P047
  P044 --> P050
  P044 --> P052
  P044 --> P053
  P045 --> P046
  P045 --> P048
  P045 --> P050
  P045 --> P053
  P046 --> P050
  P046 --> P053
  P047 --> P051
  P047 --> P052
  P047 --> P053
  P048 --> P050
  P048 --> P052
  P048 --> P053
  P049 --> P050
  P049 --> P052
  P049 --> P053
  P050 --> P052
  P050 --> P053
  P051 --> P052
  P051 --> P053
  P052 --> P053
  P021 --> P061["MARZI-061"]
  P061 --> P034
  P061 --> P042
  P061 --> P049
~~~

# Critical path

MARZI-020 is the root gate. The executable critical path is a set of converging lanes:

1. **Product/learning/domain lane:** MARZI-020 → MARZI-021 → MARZI-022 → MARZI-035 → MARZI-036 → MARZI-037 → MARZI-042 → MARZI-043 → MARZI-044.
2. **Quality/release-control lane:** MARZI-020 → MARZI-023 → MARZI-024 → every high-risk runtime migration.
3. **AI/reliability lane:** MARZI-020 → MARZI-022 → MARZI-030 → MARZI-031/033 → MARZI-035 → MARZI-045 → MARZI-048.
4. **Identity/asset lane:** MARZI-020 → MARZI-029 → MARZI-040 → MARZI-041 → MARZI-044/046.
5. **Accessibility/localization lane:** MARZI-020 → MARZI-025 → MARZI-026 → MARZI-034/036/039/049 → MARZI-050.
6. **Commercial/data lane when in launch scope:** MARZI-020 → MARZI-027/032 → MARZI-043/047/048 → MARZI-051 → MARZI-052.
7. **Release convergence:** MARZI-044 + MARZI-045 + MARZI-046 + MARZI-047 (if monetized) + MARZI-048 + MARZI-049 + MARZI-050 + MARZI-051 (if cloud is in scope) + MARZI-052 → MARZI-053.

MARZI-051 may be deferred if MARZI-D022 explicitly approves a device-local release. MARZI-047 may remain presentation-only if MARZI-D020 explicitly defers monetization. Deferral does not waive truthful UI, privacy, support, or qualification requirements.

# Mandatory decision gates

Implementation must stop at these gates until approval is recorded in docs/MARZI_DECISION_REGISTER.md:

| Gate | Required decision/evidence | Stops |
|---|---|---|
| G-020 Authority | Product Owner approves this roadmap, Product Bible, frozen contracts, governance, and Decision Register ownership. | MARZI-021 and every later package |
| G-LEARN | Competency/mastery/completion/placement model and onboarding length are approved, including MARZI-D008–D009 and D016. | MARZI-021, 034, 042–044, 056, 060 |
| G-LANGUAGE | Interface/target/correction relationship, assistance/translation/microphone defaults, pronunciation policy, and launch languages are approved: MARZI-D010–D013, D019, D023. | MARZI-026, 034, 037, 039, 042, 049 |
| G-ASSET | Canonical Marzi, launcher, six stages, stage props, outfits, portraits/backgrounds, and audio are approved and delivered: MARZI-D001–D007. | MARZI-040, 041, 046 and public asset readiness |
| G-ECONOMY | Eligibility, meaningful call, completion, formula, coins/streak/difficulty/pronunciation, and anti-farming are approved: MARZI-D014–D019. | MARZI-043 and dependent economy/progress work |
| G-COMMERCIAL | Monetization/Premium and release-market decisions are approved: MARZI-D020 and D025. | MARZI-047, commercial parts of 052, monetized public release |
| G-PRIVACY | Analytics, sync/account, retention/deletion, speech/research handling receive Privacy/Legal approval: MARZI-D019, D021, D022, D024. | MARZI-048, 051–053, 057, 060 as applicable |
| G-QUALIFICATION | Exact release candidate has independent review, complete real-device matrix, production assets, operations/rollback, and no Critical/High defect. | MARZI-053 go/no-go, merge, and production |

No recommendation in this roadmap satisfies a gate by itself. Approval must name the decision, selected option, conditions, owner, date, evidence, and packages released.
