# MARZI-020 — Canonical Product and Architecture Contracts

## 1. Package identity

- Package ID: MARZI-020
- Canonical title: Canonical Product and Architecture Contracts
- Roadmap category: Foundation
- Status: READY FOR REVIEW after the documentation-only commit; Product Owner approval is required before MARZI-021 may start
- Specification owner: Codex
- Implementation owner: Repository documentation writer; Claude Code is not authorized to change runtime in this package
- Product owner: Marzi Product Owner
- Independent reviewer: Codex
- Target branch: claude/marzi-017-product-refinement
- Approved base commit: 9cc605dd7ce9f26ba7acc143a7513b56c595909b
- Package version: 1.0
- Supersedes: Every earlier MARZI-020+ roadmap, queue, sequence, or package description after Product Owner approval

## 2. Objective

Persist one reviewable, repository-canonical product, architecture, decision, package-execution, and governance contract covering MARZI-020 through MARZI-060 without changing application runtime, configuration, tests, assets, dependencies, main, staging, or production.

## 3. User problem

Marzi’s implementation branch contains useful historical decisions but lacks a single persisted MARZI-019/019A authority. Later work could therefore select incompatible definitions of character evolution, language ownership, call composition, rewards, or architectural boundaries. This package makes disagreement visible before it becomes code.

The direct beneficiaries are the Product Owner, Codex, Claude Code, reviewers, and ultimately learners whose experience depends on consistent implementation.

## 4. Current evidence

| Evidence ID | Source and exact location | Observation | Classification | Reproduction |
|---|---|---|---|---|
| E-01 | docs/DECISIONS.md:5–15 | ADR-11 records six stages and maps seven learner ranks onto them, but also freezes the older family-approved call layout. | Active historical decision requiring scoped supersession |
| E-02 | docs/DECISIONS.md:53–57 | ADR-5 records seven 1:1 evolution stages and forces call Marzi to stage 5; this conflicts with the later six-stage earned-evolution contract. | Conflicting source of truth |
| E-03 | docs/DECISIONS.md:43–46 | ADR-7 defines target language separately from six help/correction languages, but it does not define a separately selectable interface language and correction language. | Product/architecture decision gap |
| E-04 | docs/DECISIONS.md:48–51 | ADR-6 approves flat-cartoon portraits while current product direction requires an asset audit and potentially new upper-body painterly portraits. | Visual decision conflict; asset gate |
| E-05 | docs/DECISIONS.md:64–68 and CLAUDE.md, Architecture | The dependency-free single-file architecture is current, while the definitive roadmap anticipates a measured modularization decision rather than a silent rewrite. | Frozen current architecture plus technical-discovery gate |
| E-06 | public/index.html:3059–3111 | A client-side idempotent reward ledger is implemented and is a frozen contract until an approved economy package. | Frozen runtime contract |
| E-07 | public/index.html:3123–3185 and 7373–7520 | First-run onboarding state and rendering already exist in the monolith and require later product, persistence, responsive, and accessibility packages. | Current runtime evidence; out of scope |
| E-08 | public/index.html:3643–3657 | Runtime has six Marzi stages with thresholds 0, 150, 400, 800, 1500, 2600. | Frozen runtime contract |
| E-09 | public/index.html:5565–5750 | systemPrompt, createTranscript, PromptBuilder, and ConversationSession are established authorities that later packages must preserve or migrate only through explicit contracts. | Frozen architecture evidence |
| E-10 | public/index.html:6857–6865, 6914, 7175 | Calls receive unique reward IDs, Premium is always false, and rewards are recorded at call end; economy changes require an explicit later gate. | Current runtime/business-rule evidence |
| E-11 | docs/automation/MARZI_QUEUE.md:1–7 | A historical MARZI-009–012 execution queue remains useful history but is not a MARZI-020+ program authority. | Historical coordination source |
| E-12 | Repository tree at base 9cc605d | No persisted master roadmap, Product Bible, decision register, canonical package template, MARZI-020 package, or program governance file existed at the approved base. | Documentation gap |

No item above authorizes runtime correction in MARZI-020.

## 5. In scope

- Create the complete definitive MARZI-020–060 roadmap and state its supersession rule.
- Create the permanent proposed Product Bible.
- Create an explicit unresolved Decision Register with recommendations that are not approvals.
- Create the 31-section package template.
- Create this executable MARZI-020 package.
- Create the program governance and status model.
- Record frozen contracts, authority boundaries, approval gates, dependencies, rollback expectations, evidence rules, and missing-decision/asset classes.
- Validate and commit exactly these six Markdown files.

## 6. Explicitly out of scope

- Any application, server, provider, test, workflow, package, configuration, dependency, or asset change.
- Resolving any OPEN Product Owner, asset, economy, commercial, legal, privacy, localization, or release decision.
- Modifying or deleting historical documentation.
- Rewriting docs/DECISIONS.md in this package; its conflicts remain visible and are governed by the supersession statement after approval.
- Implementing MARZI-021 or any later package.
- Changing ConversationSession, transcript ownership, PromptBuilder, prompts, providers, backend APIs, reward ledger, XP, coins, prices, buyPack, storage, scenario/character identity, or Premium.
- Merging, deploying, opening a pull request, modifying main, or changing production.

## 7. Frozen contracts

| Contract | Authority/current location | Required preservation | Verification |
|---|---|---|---|
| Application runtime | public/**, server.js | Byte-for-byte unchanged | Changed-file inventory and focused git diff |
| Tests and CI | test/**, .github/** | Byte-for-byte unchanged | Changed-file inventory |
| Dependencies/configuration | package files, manifest/runtime config | Byte-for-byte unchanged | Changed-file inventory |
| ConversationSession and transcript ownership | public/index.html:5602–5806 | Semantically and byte-for-byte unchanged in this package | Zero runtime diff |
| PromptBuilder and prompts | public/index.html:5565–5716 | Byte-for-byte unchanged | Zero runtime diff |
| Providers and backend interfaces | public/index.html provider layer; server.js | Byte-for-byte unchanged | Zero runtime/server diff |
| Reward ledger/idempotency | public/index.html:3059–3111 | Semantically and byte-for-byte unchanged | Zero runtime diff |
| Marzi stage thresholds | public/index.html:3643–3657 | Exactly 0, 150, 400, 800, 1500, 2600 | Documentation assertion plus zero runtime diff |
| Learner ranks vs Marzi evolution | existing runtime and approved MARZI-001 contract | Remain separate axes | No behavior change |
| Coins, prices, buyPack, usage/minutes | public/index.html reward/Store/plan functions | Unchanged | Zero runtime diff |
| Storage schemas | all current localStorage keys/readers | Unchanged | Zero runtime diff |
| Scenario and character identity | current scenario registry | Unchanged | Zero runtime diff |
| Premium | public/index.html:6914 | isPremium() remains false | Zero runtime diff |

## 8. Product decisions already approved

| Decision/authority | Approved outcome | Approval evidence | Package implication |
|---|---|---|---|
| MARZI-019A program-control directive | Persist the proposed definitive replacement roadmap from MARZI-020 through MARZI-060 and prepare MARZI-020 as documentation only. | Product Owner instruction initiating this package | Authorizes creation of the six documentation files and one docs-only commit/push. |
| Agent operating model | Product Owner owns product/economy/art/commercial decisions; Codex specifies/reviews; Claude Code implements scoped runtime packages. | Product Owner instruction and prior governance | Encoded without granting either technical agent product authority. |
| No runtime scope | Application, server, providers, tests, assets, dependencies, main, merge, and deployment are forbidden. | Product Owner instruction initiating this package | Any such diff is an immediate stop condition. |

These approvals authorize package preparation. They do not approve the Product Bible’s OPEN recommendations or release MARZI-021.

## 9. Product decisions still required

| Decision | Question | Recommended option | Decision owner | Deadline | Work blocked |
|---|---|---|---|---|---|
| MARZI-020-GATE-A | Does the Product Owner approve docs/MARZI_PRODUCT_BIBLE.md as the product authority, including its frozen contracts and explicitly unresolved items? | Approve after independent documentation review, recording any exceptions rather than silently editing intent. | Product Owner | Before MARZI-021 | Every later package |
| MARZI-020-GATE-B | Does the Product Owner approve docs/MARZI_MASTER_ROADMAP.md as the definitive MARZI-020–060 sequence? | Approve the full sequence and dependency gates; amend only through a recorded roadmap decision. | Product Owner | Before MARZI-021 | Every later package |
| MARZI-020-GATE-C | Does the Product Owner accept the 25 OPEN entries and owners in docs/MARZI_DECISION_REGISTER.md? | Approve the register as the decision queue without treating recommendations as outcomes. | Product Owner | Before MARZI-021; individual decisions by their deadlines | Packages listed per decision |
| MARZI-020-GATE-D | Does the Technical Architect approve the package template, ownership principles, frozen-contract inventory, and governance workflow? | Approve following exact-diff validation. | Codex | Before MARZI-021 | Package execution |

The recommended choices for every substantive open product decision are recorded in docs/MARZI_DECISION_REGISTER.md. No choice is silently resolved here.

## 10. Asset requirements

No asset is needed to complete MARZI-020.

The package must record, without fabricating:

- canonical Marzi art as ASSET REQUIRED;
- launcher/icon family as ASSET REQUIRED;
- six matched evolution stages as ASSET REQUIRED;
- outfit layering/composite strategy as PRODUCT OWNER DECISION REQUIRED and ASSET REQUIRED;
- upper-body call portraits/backgrounds as ASSET REQUIRED where existing sources fail the framing audit;
- coherent audio assets as ASSET REQUIRED.

References such as 01_home.png, 04_progress.png, and call concept boards remain source references, not production crops.

## 11. Architecture

MARZI-020 defines documentation authority, not runtime architecture:

~~~mermaid
flowchart TD
  PO[Product Owner approvals] --> Bible[Product Bible]
  PO --> Decisions[Decision Register]
  Bible --> Roadmap[Master Roadmap]
  Decisions --> Roadmap
  Roadmap --> Spec[Package specification]
  Template[Package Template] --> Spec
  Governance[Program Governance] --> Spec
  Spec --> Impl[Claude Code implementation]
  Impl --> Review[Independent Codex review]
  Review --> Stage[Staging and device validation]
  Stage --> Merge[Protected-main merge decision]
~~~

Authority rules:

- Product intent comes from the approved Product Bible and recorded Product Owner decisions.
- Sequence and dependencies come from the Master Roadmap.
- An individual package may narrow scope but may not contradict either authority.
- The Decision Register owns unresolved questions and approval evidence.
- Program Governance owns roles, statuses, transitions, evidence, and release controls.
- Historical ADRs remain historical evidence. An approved newer decision explicitly supersedes only the conflicting scope; useful unaffected content remains valid.
- Runtime source remains authoritative evidence of current implementation, not authority to invent future product behavior.

## 12. State ownership

| State/information | Canonical owner | Readers | Writers | Lifetime | Persistence | Derived views |
|---|---|---|---|---|---|---|
| Product principles and frozen product contracts | docs/MARZI_PRODUCT_BIBLE.md after approval | All agents and reviewers | Product Owner through approved documentation change | Program | Git | Package constraints |
| Package sequence/dependencies | docs/MARZI_MASTER_ROADMAP.md after approval | All agents | Codex specification change with Product Owner approval | Program | Git | Critical path/status views |
| Unresolved and approved decisions | docs/MARZI_DECISION_REGISTER.md | Product Owner, Codex, Claude Code | Named decision owner; repository writer records exact approval | Program | Git | Package gates |
| Package structure | docs/MARZI_PACKAGE_TEMPLATE.md | Spec writers/reviewers | Codex with governance approval | Program | Git | Individual specs |
| MARZI-020 scope/evidence | docs/packages/MARZI-020.md | Implementer/reviewer | Codex/spec repository writer | Package | Git | Review checklist |
| Workflow/status vocabulary | docs/MARZI_PROGRAM_GOVERNANCE.md | All agents | Governance owner with Product Owner approval where roles change | Program | Git | Status reports |
| Runtime state | Existing application owners | Runtime only | Existing authorized code paths | Runtime/session/user | Existing storage | Unchanged by MARZI-020 |

There is no runtime, transcript, navigation, reward, storage, provider, or entitlement state in this package.

## 13. Data/storage changes

- Application schema before: unchanged at base 9cc605d.
- Application schema after: unchanged.
- New runtime keys: none.
- Changed runtime keys: none.
- Storage reader/writer changes: none.
- Offline or corruption behavior changes: none.
- Backward compatibility impact: none.
- Export/deletion impact: none.
- Repository data added: six non-empty Markdown files under docs/.

## 14. Migration strategy

This is an authority migration, not an application-data migration.

1. Preserve all historical documents.
2. State that docs/MARZI_MASTER_ROADMAP.md supersedes every earlier MARZI-020+ roadmap after Product Owner approval.
3. Treat older queues/reports as historical evidence where they do not conflict.
4. Record unresolved conflicts in the Decision Register rather than silently choosing.
5. Require every later package to cite the canonical roadmap, Product Bible, decisions, and package template.
6. If Product Owner approval is withheld, revert the single documentation commit or amend it in a new reviewed documentation commit; runtime remains unaffected.

No service-worker, cache, localStorage, account, reward, or user-data migration exists.

## 15. Accessibility

MARZI-020 changes no interface. Its contract requires later packages to specify and evidence:

- semantics, accessible names/states, focus, TalkBack/keyboard operation;
- 48×48 CSS-pixel interactive targets except a separately approved accessible inline-text pattern;
- non-color-only communication;
- zoom/increased-font behavior;
- reduced motion and non-audio alternatives;
- RTL and mixed-language reading order;
- disability-equitable learning and reward rules;
- real-device evidence wherever emulation is insufficient.

Documentation acceptance: accessibility impact is present for every roadmap package and every substantive decision.

## 16. Localization/RTL

MARZI-020 changes no localized copy. It freezes the requirement to separate:

- interface/native language;
- target learning language;
- correction/explanation language.

The exact default relationship remains OPEN under MARZI-D010. Every later package must specify language metadata, fallback, Arabic RTL, long strings, pluralization, and no embedded language-specific art. Supported launch target languages remain OPEN under MARZI-D023.

## 17. Responsive requirements

No rendered UI changes and no browser matrix are required for MARZI-020.

The canonical package template requires later responsive packages to cover 320×568, 360×640, 360×780, 375×667, 390×844, 412×915, and a tablet assessment, with explicit scroll/safe-area/keyboard/orientation ownership.

## 18. Performance budget

Runtime startup, interaction, layout, network, memory, and bundle bytes must be byte-for-byte unaffected because no runtime file may change.

Documentation budget:

- all six files are plain Markdown;
- no generated binary or embedded base64 data;
- dependency count remains unchanged;
- repository validation completes with existing shell/Node tooling and no installed dependency.

## 19. Security/privacy

MARZI-020 processes no learner data and adds no runtime attack surface.

Documentation requirements:

- no secrets, credentials, personal learner content, or paid-service output;
- no hidden admin/upload/runtime asset path;
- server/provider key isolation remains frozen;
- analytics, cloud sync, pronunciation, retention, monetization, and release decisions remain gated;
- raw audio/transcript collection is not approved;
- recommendations cannot be interpreted as consent or legal approval.

## 20. Files permitted to change

Exactly:

- docs/MARZI_MASTER_ROADMAP.md
- docs/MARZI_PRODUCT_BIBLE.md
- docs/MARZI_DECISION_REGISTER.md
- docs/MARZI_PACKAGE_TEMPLATE.md
- docs/packages/MARZI-020.md
- docs/MARZI_PROGRAM_GOVERNANCE.md

All are newly created in this package.

## 21. Files forbidden to change

Every file not listed in section 20, including:

- public/index.html and every public/** runtime file or asset;
- server.js;
- provider implementations and backend interfaces;
- test/** and .github/**;
- package.json, lockfiles, dependencies, and configuration;
- manifest and service worker;
- docs/DECISIONS.md, docs/DESIGN_SYSTEM.md, docs/IMPLEMENTATION_REPORT.md, design references, concept boards, and historical automation records;
- .ai/**;
- secrets or environment configuration;
- main, tags, deployment state, production, and pull-request state.

## 22. Implementation sequence

1. Verify the correct repository, branch, exact start SHA, origin synchronization, origin/main SHA, merge base, and clean tree.
2. Read current architecture/governance, product/design, asset, implementation, automation, source-contract, test, manifest, service-worker, and concept-board references.
3. Persist the 41-package Master Roadmap with categories, full package contracts, Mermaid dependency graph, critical path, and decision gates.
4. Persist the Product Bible with 25 required product domains and explicit unresolved classifications.
5. Persist the Decision Register with all required impacts, owner, deadline, and blocked packages.
6. Persist the 31-section Package Template.
7. Persist this MARZI-020 package using that template.
8. Persist Program Governance, roles, readiness tracks, statuses, transitions, evidence, review, staging, merge, and release rules.
9. Run structural and diff validation.
10. Stage exactly the six permitted files, commit once, and push only the current development branch.
11. Hand off for independent documentation review and Product Owner approval.

## 23. Automated tests

| Test ID | Layer | Behavior proven | Negative case | Failure signal | Command/method |
|---|---|---|---|---|---|
| T-020-01 | Structure | All six required Markdown files exist and are non-empty. | Missing/empty file | Explicit path failure | Node filesystem validation |
| T-020-02 | Roadmap | Heading IDs are exactly MARZI-020 through MARZI-060, 41 unique packages. | Gap, duplicate, out-of-range ID | Set mismatch | Node heading parser |
| T-020-03 | Graph | Mermaid graph contains every pre-release package MARZI-020 through MARZI-053. | Missing node | Missing-ID report | Node Mermaid-section parser |
| T-020-04 | Template | Package Template contains numbered sections 1 through 31 exactly once and in order. | Missing/duplicate/reordered section | Sequence mismatch | Node heading parser |
| T-020-05 | Package conformance | MARZI-020 contains numbered sections 1 through 31 exactly once and in order. | Template drift | Sequence mismatch | Node heading parser |
| T-020-06 | Decisions | MARZI-D001 through MARZI-D025 are unique in the index and each has a detailed record. | Missing/duplicate detail | Set/count mismatch | Node decision parser |
| T-020-07 | Explicit uncertainty | Product Bible/Register contain every required unresolved classification. | Silent resolution/missing class | Missing-tag report | Node text validation |
| T-020-08 | Scope | Changed paths equal the six permitted Markdown files. | Runtime/config/test/asset/unexpected doc diff | Path-set mismatch | git diff --name-status plus Node assertion |
| T-020-09 | Whitespace | Patch contains no conflict markers or whitespace errors. | Marker/trailing whitespace | Nonzero/error match | git diff --check and conflict scan |
| T-020-10 | Branch integrity | Start ancestry and origin/main remain unchanged; final branch tracks only the docs commit. | main movement/wrong branch/divergence | SHA/count mismatch | git rev-parse, merge-base, rev-list |

No source-text test in this package claims to prove runtime behavior.

## 24. Rendered-browser matrix

Not applicable: this package contains Markdown only and has no application rendering effect.

The reviewer must not manufacture browser acceptance evidence for MARZI-020. Browser/device matrices are mandatory in later packages when they make runtime claims.

## 25. Real-device matrix

Not applicable: no installed PWA, browser, layout, interaction, accessibility, audio, provider, cache, or storage behavior changes.

The known Android staging confirmation at commit 9cc605d remains historical context, not evidence produced by this package.

## 26. Regression requirements

- Changed-file scope must prove an empty runtime/config/test/asset diff.
- Current branch start and origin/main SHA must be captured before and after.
- No historical document may be modified or deleted.
- Every roadmap ID, graph node, template section, package section, decision ID, and unresolved classification must receive structural validation.
- git diff --check must pass.
- A clean post-commit/post-push working tree and zero ahead/behind tracking state are required.

Running the application test suite is not required because no executable input may change; repository scope validation is the stronger relevant regression proof.

## 27. Rollback strategy

- Revert the single documentation-only commit if the Product Owner rejects the authority model.
- Do not reset, rewrite history, or delete historical records.
- No application data, cache, service worker, asset, dependency, deployment, or user progress needs rollback.
- If only a decision or package detail changes, use a new reviewed documentation commit preserving decision history.
- Until Product Owner approval, later packages remain blocked, so rollback cannot strand runtime work.

## 28. Evidence required

- Starting full SHA, branch, origin synchronization, origin/main SHA, and clean-tree output.
- Final full SHA and exact changed-file list.
- Structural validation output for six non-empty files.
- Exact 41-package/41-unique count.
- Mermaid pre-release coverage count MARZI-020–053.
- Exact 25-decision/25-unique count with detailed-section parity.
- Template and MARZI-020 section sequence 1–31.
- Unresolved-classification presence.
- git diff --check result.
- Proof of no runtime/config/test/asset change.
- Explicit commit and push output.
- Final zero ahead/behind result.
- Confirmation that main, staging, production, deployment, and PR state were not modified.

No screenshots, performance traces, or device recordings are required.

## 29. Stop conditions

Stop without guessing if:

- the repository, branch, start commit, origin synchronization, or merge-base differs from section 1;
- the worktree contains unexpected pre-existing changes;
- a requested change needs any forbidden file;
- any runtime/config/test/asset/dependency diff appears;
- a prior document must be deleted to establish authority;
- Product Owner intent must be silently chosen;
- artwork, economy, monetization, privacy, target-language, or release policy would be resolved rather than registered;
- a package ID/title cannot be reconciled with the approved MARZI-019A roadmap;
- main, staging, production, deployment, or PR state would change;
- commit/push would target any branch except claude/marzi-017-product-refinement.

## 30. Definition of done

MARZI-020 is implementation-complete and READY FOR REVIEW when:

- all six permitted Markdown files exist and are non-empty;
- roadmap, Product Bible, register, template, MARZI-020 spec, and governance meet their specified structures;
- all 41 packages are unique and graph coverage is complete through MARZI-053;
- all 25 decisions remain explicitly OPEN unless an approval record exists;
- previous MARZI-020+ roadmaps are explicitly superseded after Product Owner approval;
- only the six permitted files changed;
- all validation passes;
- one documentation-only commit is pushed to the current development branch;
- branch tracking is synchronized and main is untouched.

MARZI-020 becomes fully approved, and MARZI-021 becomes eligible for READY FOR IMPLEMENTATION, only after independent Codex review plus Product Owner approval of gates A–C.

## 31. Independent review handoff

Codex must independently review the exact diff from:

- Base: 9cc605dd7ce9f26ba7acc143a7513b56c595909b
- Head: the single MARZI-020 documentation commit
- Branch: claude/marzi-017-product-refinement

The review must verify:

1. exactly the six permitted Markdown files changed;
2. no runtime, server, provider, test, workflow, package, configuration, dependency, asset, historical document, main, staging, production, deployment, or PR change occurred;
3. every MARZI-020–060 package is present once, detailed, categorized, and supported by the dependency graph/critical path;
4. every package contains all roadmap contract fields required by program control;
5. the Product Bible contains all 25 required domains and labels every unresolved issue;
6. MARZI-D001–D025 contain all required fields and remain recommendations pending approval;
7. the Package Template and this file contain sections 1–31 in order;
8. governance roles/statuses/transitions/evidence rules match Product Owner instructions;
9. frozen contracts and historical-conflict handling are explicit;
10. all validation evidence is reproducible.

Codex must return either APPROVED or CORRECTIONS REQUIRED for this documentation package. Approval does not resolve Product Owner decisions. After Codex approval, the Product Owner must explicitly approve MARZI-020-GATE-A, B, and C before MARZI-021 begins.
