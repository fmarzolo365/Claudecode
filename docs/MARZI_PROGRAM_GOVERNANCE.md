# Marzi Program Governance

Status: Proposed permanent operating model

Applies to: MARZI-020 through MARZI-060 and successor packages

Companion authorities: docs/MARZI_PRODUCT_BIBLE.md, docs/MARZI_MASTER_ROADMAP.md, docs/MARZI_DECISION_REGISTER.md, and docs/MARZI_PACKAGE_TEMPLATE.md

## 1. Purpose

This document prevents design, implementation, review, asset readiness, and release authority from collapsing into one role. It defines who may decide, who may specify, who may implement, what evidence is required, and how a package advances without silently changing Marzi’s product or frozen contracts.

## 2. Authority model

### Product Owner

The Product Owner:

- owns product vision, user experience, learning outcomes, economy, rewards, art direction, canonical identity, audio direction, monetization, commercial scope, target markets, and final product approval;
- approves or rejects decisions in docs/MARZI_DECISION_REGISTER.md;
- approves the Product Bible, roadmap, package-level product gates, staging exposure, merge readiness, and release go/no-go;
- may delegate specialist review, but remains accountable for the product outcome.

The Product Owner does not silently authorize a decision by allowing technical work to continue. Approval must be recorded.

### Codex

Codex:

- owns technical architecture validation, source-of-truth design, package specifications, task decomposition, acceptance criteria, independent code/documentation review, QA strategy, security, privacy-boundary review, performance, accessibility/compliance checks, and release-readiness assessment;
- writes specifications before implementation;
- checks Product Owner decisions without inventing them;
- distinguishes application defects from test weaknesses, audit-harness failures, asset gaps, and environment limitations;
- does not implement the package it independently reviews unless the Product Owner explicitly changes roles and assigns a different independent reviewer.

Codex cannot approve product, economy, art, or commercial choices on behalf of the Product Owner.

### Claude Code

Claude Code:

- implements only an approved package specification;
- performs integration, tests, compilation/syntax fixes, and approved defect corrections inside permitted scope;
- updates the required implementation report and evidence;
- must not redesign, simplify, reinterpret, expand scope, alter a frozen contract, invent an asset, or select an unresolved product decision;
- stops when ambiguity, a missing asset/decision, forbidden-file need, migration risk, or contract conflict appears.

Only one coding agent may modify application files at a time.

### Specialists and control owners

- Learning specialists validate competency, assessment, correction, pronunciation, mastery, and reward evidence.
- Accessibility specialists validate screen-reader, motor, cognitive, hearing, vision, RTL, zoom, and disability-equitable outcomes.
- Privacy/legal owners approve consent, retention, deletion, analytics, cloud, speech, children/age, market, and commercial obligations.
- Visual/audio production owners deliver rights-cleared assets against approved briefs.
- Release/operations owners validate staging, observability, rollback, support, and production controls.

Specialist advice does not replace the named decision owner.

## 3. Source-of-truth hierarchy

When sources disagree, use this order:

1. A recorded Product Owner decision in docs/MARZI_DECISION_REGISTER.md.
2. The approved docs/MARZI_PRODUCT_BIBLE.md.
3. The approved docs/MARZI_MASTER_ROADMAP.md.
4. The current package specification under docs/packages/.
5. docs/MARZI_PROGRAM_GOVERNANCE.md and docs/MARZI_PACKAGE_TEMPLATE.md.
6. Approved ADRs and design/asset specifications that have not been explicitly superseded.
7. Implementation reports, audits, screenshots, concept boards, and runtime source as evidence of current state.
8. Historical queues, automation reports, and superseded specifications.

Rules:

- A lower source cannot override a higher one.
- Runtime behavior proves what exists; it does not silently approve what should exist.
- Concept boards and screenshots may direct design but are not production assets.
- A package may narrow an approved roadmap objective but must escalate any contradiction.
- An older rule remains valid outside the exact scope explicitly superseded.

## 4. Required package artifacts

Every executable package requires:

1. a roadmap entry;
2. a specification using all 31 sections in docs/MARZI_PACKAGE_TEMPLATE.md;
3. linked Product Owner decisions and approval evidence;
4. asset readiness and provenance where relevant;
5. exact permitted and forbidden files;
6. acceptance criteria, automated tests, rendered-browser matrix, real-device matrix, rollback, and stop conditions;
7. an implementation report with commit range and reproducible evidence;
8. an independent Codex review;
9. staging/device evidence where the package changes runtime;
10. a merge/release decision appropriate to its status.

Every implementation must reference the approved package and roadmap ID. Every application defect corrected by the package must receive a regression test that fails on the approved base and passes on the implementation.

## 5. Three independent readiness tracks

Package status never hides readiness gaps. Report these tracks separately:

| Track | READY means | Typical blockers |
|---|---|---|
| Runtime readiness | Code, migrations, tests, security, performance, accessibility, rollback, and integration satisfy the approved specification. | Defect, missing behavior test, migration risk, performance regression, unsafe fallback. |
| Documentation readiness | Specification, decisions, implementation report, review, runbook, known limits, and evidence are complete and synchronized. | Unrecorded decision, inaccurate claim, stale acceptance evidence, conflicting authority. |
| Asset readiness | Every required production asset is approved, rights-cleared, versioned, integrated, accessible, performant, and backed by deterministic fallback. | Placeholder, missing variant, unclear provenance/rights, incorrect crop, unvalidated mask/frame. |

A package cannot advance beyond the least-ready mandatory track. “Runtime complete, asset placeholder” is not release-ready unless the approved package explicitly permits the placeholder for that environment.

## 6. Package statuses

### DISCOVERY

Purpose, evidence, ownership, feasibility, or decisions are still being established.

Entry:

- roadmap identifies the package;
- discovery is authorized.

Exit:

- a complete specification exists; and
- each open issue is either resolved or recorded as a blocker.

### BLOCKED

Implementation cannot safely continue because a named decision, asset, dependency, authority, environment, migration, security/privacy approval, or external system is missing.

Requirements:

- exact blocker and owner recorded;
- non-blocked preparation may continue only if it cannot prejudice the decision;
- no guessing, redesign, or scope expansion.

Exit:

- blocker evidence is recorded and specification updated/reapproved.

### READY FOR IMPLEMENTATION

The specification is approved and executable without product or technical guessing.

Required:

- prerequisites complete;
- Product Owner decisions recorded;
- required assets available or an approved bounded placeholder path exists;
- permitted/forbidden files exact;
- acceptance tests/evidence and rollback defined;
- branch/base verified;
- Codex architecture/specification approval recorded.

### IMPLEMENTING

One authorized coding agent holds the application-file modification lock.

Required:

- implementation follows the approved sequence;
- deviations stop work and create a change request;
- implementation report remains current;
- commits remain reviewable and scoped.

Exit:

- deliverables and tests complete; or
- status moves to BLOCKED.

### READY FOR REVIEW

Implementation is complete and handed to an independent reviewer.

Required:

- exact base/head/commit list;
- clean tree and changed-file inventory;
- implementation report;
- automated/rendered/device evidence;
- known limitations and unverified claims;
- no open implementer task.

No implementation changes occur during review without returning to IMPLEMENTING through a correction package.

### CHANGES REQUIRED

Independent review found a specification failure, application defect, unacceptable risk, unauthorized change, or missing mandatory evidence.

Required:

- findings include severity, location, evidence, impact, correction, and acceptance evidence;
- remediation is a versioned package or bounded revision;
- test/harness/environment limitations remain classified separately.

Exit:

- corrected implementation returns to READY FOR REVIEW with a new exact head.

### READY FOR STAGING

Independent review approves the package for a non-production environment.

Required:

- no unresolved release-blocking code/security/privacy defect;
- rollback path and feature/environment controls ready;
- staging plan and device matrix approved;
- documentation/runtime/asset tracks meet staging requirements.

### STAGING VALIDATED

The approved staging build passed its specified server, browser, installed-PWA, real-device, accessibility, localization, performance, offline/update, and rollback checks.

Required:

- deployed commit and environment identified;
- evidence links immutable;
- failures classified and resolved or explicitly bounded by Product Owner;
- production has not changed.

### READY FOR MERGE

The exact reviewed and staging-validated commit is approved to enter protected main.

Required:

- Product Owner approval;
- independent Codex approval;
- required specialist approvals;
- no branch drift since evidence;
- CI green;
- release notes, migrations, flags, asset versions, and rollback synchronized.

### MERGED

The approved commit is merged through the protected process to main.

Required:

- resulting main SHA recorded;
- merge contains only approved commits;
- no force-push or history rewrite;
- production remains unchanged until release authorization.

### RELEASED

The exact qualified main artifact is deployed through the approved staged release process.

Required:

- production SHA/artifact/version recorded;
- health, error, latency, update, entitlement, and data checks pass;
- rollback window monitored;
- release evidence and known issues published internally;
- Product Owner/Release Owner close the package.

## 7. State transitions

~~~mermaid
stateDiagram-v2
  [*] --> DISCOVERY
  DISCOVERY --> BLOCKED: unresolved gate
  BLOCKED --> DISCOVERY: gate supplied
  DISCOVERY --> READY_FOR_IMPLEMENTATION: spec and approvals complete
  READY_FOR_IMPLEMENTATION --> IMPLEMENTING: coding lock acquired
  IMPLEMENTING --> BLOCKED: ambiguity or missing dependency
  IMPLEMENTING --> READY_FOR_REVIEW: implementation evidence complete
  READY_FOR_REVIEW --> CHANGES_REQUIRED: independent finding
  CHANGES_REQUIRED --> IMPLEMENTING: correction scope approved
  READY_FOR_REVIEW --> READY_FOR_STAGING: independent approval
  READY_FOR_STAGING --> STAGING_VALIDATED: staging matrix passes
  STAGING_VALIDATED --> CHANGES_REQUIRED: staging defect
  STAGING_VALIDATED --> READY_FOR_MERGE: final approvals
  READY_FOR_MERGE --> MERGED: protected merge
  MERGED --> RELEASED: authorized staged deployment
~~~

Forbidden shortcuts:

- DISCOVERY to IMPLEMENTING;
- IMPLEMENTING directly to READY FOR STAGING;
- READY FOR REVIEW directly to MERGED;
- MERGED to RELEASED without release authorization and production checks;
- any transition that uses “tests pass” as a substitute for missing product, asset, privacy, or device approval.

## 8. Decision and change control

- Every unresolved product question receives a stable MARZI-Dxxx ID.
- Recommendations are advisory until the named owner records approval.
- A decision change creates an explicit superseding record and impact analysis.
- If implementation discovers ambiguity, Claude Code stops and records a change request; it does not reinterpret the package.
- Codex determines technical impact and revises the specification.
- Product Owner approves any changed outcome, scope, economy, art, learning rule, monetization, or commercial behavior.
- The implementer may fix compilation/syntax defects caused by its scoped work, but any behavioral choice returns through change control.
- No later package may silently alter a frozen contract inherited from an earlier package.

## 9. Application-file modification lock

- Exactly one coding agent owns the application-file lock at a time.
- Documentation, asset production outside the integration tree, review, content planning, and test design may run in parallel only when they cannot race with application integration or pre-empt an open decision.
- The lock owner, package ID, branch, base SHA, and start time are recorded in the implementation handoff.
- Reviewers do not edit the reviewed branch.
- Corrections return the lock to the authorized implementer under a bounded remediation specification.

## 10. Evidence standard

Evidence must be reproducible and tied to an exact commit.

Minimum:

- repository, branch, base/head full SHAs, ancestry, synchronization, and clean state;
- all changed files per commit and final diff;
- exact commands, exit status, test count, failures/skips, environment, and tool versions;
- runtime assertions that observe real state transitions rather than only source text;
- rendered measurements for layout claims;
- real top-level browser/device evidence for platform APIs, installed PWA, keyboard, safe areas, audio, speech, service worker, and gesture behavior;
- asset filename, hash, dimensions, format, provenance, rights, and approval;
- accessibility tree/manual evidence and focus order;
- performance traces with device/network context;
- migration fixtures and rollback verification;
- explicit unverified claims and environment limitations.

A temporary audit-harness failure is not an application defect. Conversely, a passing static selector or source-string assertion is not proof of runtime behavior.

## 11. Review and correction rules

- No package is merged without independent Codex review.
- The reviewer examines the exact approved base-to-head diff and current final tree.
- Findings state ID, severity, classification, exact location, evidence, user impact, required correction, and evidence needed.
- Severity reflects production/user risk, not implementation inconvenience.
- Only genuine application defects or unmet mandatory evidence block runtime readiness; test, documentation, asset, environment, and harness findings remain clearly classified but may still block the relevant readiness track.
- Correction work receives a bounded package/specification and a new exact head.
- The implementer’s report is evidence, never a substitute for independent verification.

## 12. Testing and quality gates

- Every application defect has a regression test.
- Critical behavior uses unit/contract, integration, rendered-browser, and real-device coverage in proportion to risk.
- Negative cases cover malformed, missing, repeated, cancelled, late, offline, retry, reload, Back, asset-failure, storage-corruption, and rollback paths where relevant.
- Frozen contracts receive focused guards.
- Layout claims use real computed geometry, not screenshot impression alone.
- Accessibility includes automated checks plus manual screen-reader/keyboard/device validation.
- CI cannot silently skip a mandatory browser because Chromium is absent.
- Conflict markers, syntax, diff whitespace, and generated/untracked scope are mandatory repository gates.
- Passing tests do not authorize scope outside the package.

## 13. Main, staging, and production

- main remains protected until the package reaches READY FOR MERGE.
- Development work stays on the approved development branch.
- Staging precedes production for every runtime package.
- The exact staging commit must equal the independently reviewed commit.
- Real-device validation is mandatory where browser emulation cannot prove platform behavior.
- A staging pass does not authorize merge or deployment by itself.
- Merge and deployment are separate explicit actions and approvals.
- No force-push, squash, rebase, or history rewrite is presumed; any approved history operation requires separate authority and renewed SHA-based evidence.
- Production changes only after release qualification and Product Owner/Release Owner authorization.

## 14. Release qualification

Before READY FOR MERGE, verify:

- scope and frozen contracts;
- functional acceptance and regression suite;
- security/privacy/legal gates;
- accessibility, localization, RTL, responsive and real-device matrices;
- performance budgets and provider latency/error behavior;
- storage migrations, corruption recovery, offline behavior, service-worker update, and installed-PWA upgrade;
- economy simulation and entitlement/payment integrity where relevant;
- asset readiness/provenance;
- observability, support, incident, rollback, and kill-switch readiness;
- accurate implementation/review/release documentation.

The release verdict applies only to the exact commit and qualified environment.

## 15. Parallel work rules

Parallel work is permitted when the Master Roadmap says yes and:

- dependencies are satisfied;
- teams own disjoint files or produce non-integrated artifacts;
- no two agents hold the application lock;
- one workstream cannot silently choose a decision needed by another;
- integration order is recorded;
- each package retains independent commits, tests, evidence, and review.

Typical safe parallel work:

- learning-model review;
- technical contract specification;
- CI/test infrastructure;
- localization architecture;
- rights-cleared asset production;
- privacy/legal discovery;
- audio production;
- device-matrix planning.

Runtime integration is serialized at shared architectural boundaries.

## 16. Governance exceptions

An exception requires:

- exact rule being waived;
- reason and bounded duration;
- risk and user impact;
- compensating controls;
- Product Owner approval for product/release impact;
- Codex approval for technical/quality impact;
- privacy/legal or specialist approval where applicable;
- expiry package/date and removal evidence.

No exception may authorize fabricated entitlement/payment success, exposed secrets, inaccessible critical paths, unreviewed production deployment, silent data loss, or hidden economy changes.

## 17. Program records

Each package record must make these facts answerable:

- What exact outcome was approved?
- Who approved each product/asset/economy/privacy/commercial decision?
- Which commit implements it?
- What changed and what remained frozen?
- Which automated, browser, device, accessibility, localization, performance, migration, security, and rollback evidence exists?
- Which claims remain unverified?
- What is the status of runtime, documentation, and asset readiness?
- Can the exact commit be staged, merged, released, or rolled back safely?

If any answer is missing, the package remains at or returns to the appropriate earlier status.
