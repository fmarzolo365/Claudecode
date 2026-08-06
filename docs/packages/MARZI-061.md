# MARZI-061 — External Review Readiness Package

## 1. Package identity

| Field | Value |
|---|---|
| Package ID | MARZI-061 |
| Canonical title | External Review Readiness Package |
| Program area | Governance / external review |
| Implementation owner | Claude Code |
| Independent reviewer | Codex |
| Reviewed artifact | MARZI-021 static learning contracts at `f20f805dc01cd8ff68f4862266b21bd5bf50dbc4` |
| Runtime changes | None |

### Product Owner allocation

Approved 2026-08-04:

> Preserve MARZI-022 as Domain Ownership and Event Contracts, assign MARZI-061 to
> External Review Readiness, update canonical governance accordingly, and replace
> the exported mandate with a MARZI-061 mandate before implementation.

The canonical allocation is therefore `MARZI-022 — Domain Ownership and Event
Contracts` and `MARZI-061 — External Review Readiness Package`. The earlier
external planning artifact named `MARZI-022_CLAUDE_CODE_MANDATE.md` is superseded
planning and is not an executable authority. MARZI-022 keeps its original title,
objective, dependencies, deliverables and acceptance criteria unchanged.

### Canonical status

| Dimension | State |
|---|---|
| Package preparation | PREPARED |
| Learning and pedagogy review | PENDING |
| Six-language linguistic review | PENDING |
| Accessibility review | PENDING |
| Moderated Android study | PENDING |
| Reviewer appointment, all tracks | NOT_APPOINTED |
| Review execution, all tracks | NOT_STARTED |
| Evidence, all tracks | NOT_COLLECTED |
| Findings, all tracks | NOT_RECORDED |
| Review completion, all tracks | NOT_COMPLETED |
| Decision status, all tracks | NOT_GRANTED |
| Decision, all tracks | NOT_REVIEWED |
| Independent approval of this package | NOT GRANTED |
| Runtime integration | NOT AUTHORIZED |
| Production approval | NOT AUTHORIZED |
| Deployment | NOT DEPLOYED |
| Release | NOT RELEASED |

Implementing this package prepares four reviews. It does not perform them and
grants no result. No reviewer has been appointed and no review has begun.

## 2. Objective

Give qualified humans everything they need to execute the learning and pedagogy
review, the six-language linguistic review, the accessibility review, and the
moderated Android study against the MARZI-021 static contracts — charters,
workflows, strict schemas, derived matrices, evidence structures, decision
records, and a deterministic validator — while making it structurally impossible
for the preparation itself to imply that any of those reviews happened.

## 3. User problem

MARZI-021 is technically approved for specialist review, but a reviewer opening
the repository has no charter, no scope boundary, no place to record evidence,
and no machine-checked link between a finding and the exact artifact it concerns.
Without that, the four gates cannot be executed, audited, or trusted, and there
is a standing risk that the existence of documentation is mistaken for approval.

## 4. Current evidence

| Evidence | Location | Implication |
|---|---|---|
| Approved static contracts | `docs/learning/contracts/v1/**` | 29 scenarios, 94 variants, 564 localized titles are the artifact under review |
| Canonical review record | `docs/learning/SPECIALIST_REVIEW.md` | Exists and is empty; every gate is pending |
| Independent technical approval | `MARZI-021-R2_CODEX_FINAL_REVIEW.md` | Authorizes specialist-review preparation only |
| Learning validator | `test/learning-contracts.js` | 36 checks; must remain unchanged and passing |
| Known accessibility defect | MARZI-021-R2 report | Arabic at 320×568 with 200% text overflows; recorded, not fixed |
| Locale set | `docs/learning/contracts/v1/scenarios.*.json` | `es`, `en`, `it`, `tr`, `ar`, `uk` |
| Package allocation | Product Owner decision 2026-08-04 | MARZI-022 unchanged; MARZI-061 is this package |

## 5. In scope

1. Canonical review-system entry point and shared governance model.
2. Four reviewer protocols, one per track.
3. Six locale checklists for the interface and correction languages.
4. Seven shared templates for issues, recommendations, summaries, decisions,
   evidence capture, remediation handoff, and participant feedback.
5. Eight strict schemas covering the manifest, review record, finding, decision,
   and the four track-specific record shapes.
6. A 94-entry learning evidence matrix derived from the canonical contracts.
7. A 564-entry linguistic matrix, 94 titles across six locales, copied verbatim.
8. An accessibility plan carrying `MARZI-A11Y-KNOWN-001` as OPEN.
9. An Android study protocol with empty participant and result collections.
10. Six positive and thirty negative fixtures with isolated reason codes.
11. A dependency-free 30-check validator.
12. Bounded roadmap, documentation-validator, specialist-index, and
    implementation-report updates.

## 6. Explicitly out of scope

- Performing, simulating, or predicting any of the four reviews.
- Appointing reviewers, recruiting participants, or obtaining consent.
- Any change to `docs/learning/contracts/v1/**` or `test/learning-contracts.js`.
- Any runtime, provider, prompt, storage, economy, or asset change.
- Fixing `MARZI-A11Y-KNOWN-001`.
- WCAG, legal, certification, or compliance claims.
- Reviewer identity or qualification verification.
- The separate `MARZI-GOV-001` documentation-validator issue.
- Any package represented as `MARZI-022 — External Review Readiness`.

## 7. Frozen contracts

- MARZI-D009 and MARZI-D016 remain APPROVED and unmodified.
- All MARZI-021 contracts, schemas, identifiers, and localized strings.
- The accepted inventories: 29 scenarios, 94 variants, 19/61 German, 10/33
  English, 564 titles, 282 required and 94 optional criteria, 18 acyclic edges.
- All 94 `supersedes` values remain `null`.
- The four open educational gates keep their `null` values.
- Release-mode refusal of the provisional learning package.
- MARZI-022 identity, purpose, and relationships.
- Every runtime, storage, reward, economy, and production contract.

## 8. Product decisions already approved

- The 2026-08-04 package allocation recorded in section 1.
- MARZI-D009 option A and MARZI-D016 option A, unchanged.
- Product Owner approval in principle of the MARZI-021 taxonomy and mastery
  presentation, still pending specialist review.

No further Product Owner decision is required to prepare the package.

## 9. Product decisions still required

- Appointment of a qualified learning specialist, six qualified linguistic
  reviewers, and a qualified accessibility reviewer.
- Legal and privacy approval of recruitment, consent wording, compensation,
  retention, and legal basis before the Android study runs.
- The four external-review decisions themselves.
- The four open MARZI-021 educational gates, which remain open here.

## 10. Asset requirements

None. No artwork, audio, icon, portrait, board crop, or generated asset is
created, referenced, or required.

## 11. Architecture

```text
MARZI-021 canonical contracts (read-only)
  -> package manifest with content hashes
  -> derived learning and linguistic matrices
  -> per-track protocols, schemas, templates
  -> reviewer-authored evidence records (later, separate commits)
  -> external decisions (later, human)
```

Dependency direction rules: the review system reads the learning contracts and
never writes them; a review record references an artifact path and hash and never
mutates it; a proposed correction is data, not an edit; nothing here is imported
by `public/**` or `server.js`.

## 12. State ownership

| State | Canonical owner |
|---|---|
| Learning contracts | MARZI-021; unchanged |
| Review governance model | `REVIEW_GOVERNANCE.md` |
| Track status tuples | `data/review-status.json` |
| Derived matrices | `data/*-matrix.json`, verified derivatives |
| Review record of record | `docs/learning/SPECIALIST_REVIEW.md` |
| Reviewer identity and qualification | Humans and external systems; never a schema |
| External decisions | Appointed reviewers; never this package |

## 13. Data/storage changes

Repository-static JSON and Markdown under
`docs/learning/reviews/marzi-061/v1/**` and
`test/fixtures/marzi-061-external-reviews/**` only. No runtime storage,
localStorage key, cookie, database, server table, analytics event, or user
migration. No participant, learner, transcript, credential, contact,
demographic, consent, or health data is stored anywhere in the package.

## 14. Migration strategy

Purely additive. Existing learning contracts, validators, fixtures, runtime, and
learner data are untouched. Genuine review evidence recorded later arrives in its
own commits and must never be mixed into this preparation commit.

## 15. Accessibility

The accessibility protocol defines the conditions a reviewer will examine:
semantic structure, screen-reader interpretation, focus order, keyboard
operation, 48×48 touch targets, contrast, visible focus, 200% text, zoom,
localization expansion, RTL, reduced motion, audio and speech alternatives,
transcripts, error identification, state communication, cognitive accessibility,
plain language, time limits, orientation, and the 320×568 and 390×844 viewports.

`MARZI-A11Y-KNOWN-001 — Arabic at 320×568 with 200% text can overflow` is
recorded once and remains OPEN. It is not fixed here, and no WCAG, accessibility,
or legal compliance is claimed. A matrix of review conditions is not a compliance
result.

## 16. Localization/RTL

The canonical review locales are exactly `es`, `en`, `it`, `tr`, `ar`, `uk`, with
`ar` right-to-left and the rest left-to-right. `ua` is never used for Ukrainian.
Review locale and target language are distinct axes: German and English remain
target languages carried by the scenario contracts. Localized strings are copied
verbatim into the linguistic matrix and never translated, normalized, trimmed,
repaired, or reformatted. Structural six-language coverage is not linguistic
approval.

## 17. Responsive requirements

This package renders no surface and makes no layout claim. The 320×568 and
390×844 viewports appear only as conditions the accessibility review and Android
study will examine.

## 18. Performance budget

The package validator is dependency-free and completes well within the two-second
budget the learning validator already observes. No browser bundle, startup path,
provider request, service-worker cache, or runtime memory is affected.

## 19. Security/privacy

Direct JSON parsing and argument arrays only: no `eval`, no `new Function`, no
`node:vm`, no shell interpolation, no dynamic imports, no dependency
installation, no network access, and no writes. Records may not contain personal
data, executable markup, external URLs, or secrets. Legal and privacy approval is
required before recruitment or any data collection. Schemas cannot authenticate a
reviewer, establish authority, validate consent, or prove compliance, and they
say so.

## 20. Files permitted to change

- `docs/MARZI_MASTER_ROADMAP.md` (bounded MARZI-061 addition)
- `.ai/bin/docs-validate` (bounded MARZI-061 recognition)
- `docs/IMPLEMENTATION_REPORT.md` (append)
- `docs/learning/SPECIALIST_REVIEW.md` (link the entry point)
- `docs/packages/MARZI-061.md`
- `docs/learning/reviews/marzi-061/v1/**`
- `test/marzi-061-external-review-readiness.js`
- `test/fixtures/marzi-061-external-reviews/**`

## 21. Files forbidden to change

`public/**`, `server.js`, `sw.js`, `manifest.webmanifest`, `package.json`,
lockfiles, runtime JavaScript, providers, prompts, `ConversationSession`,
transcript behavior, storage, learner data, XP, coins, rewards, streaks, economy,
timers, Marzi evolution, outfits, Store, Profile, navigation, Android Back,
icons and production assets, dependencies, deployment configuration,
`.github/**`, `.ai/bin/**` other than the bounded `docs-validate` update,
`docs/MARZI_DECISION_REGISTER.md`, `docs/learning/contracts/v1/**`,
`test/learning-contracts.js`, `test/run.js`, localized production strings, and
`main`.

## 22. Implementation sequence

1. Synchronize once and verify baseline, allocation, and main protection.
2. Update the roadmap and documentation validator narrowly.
3. Write this package document.
4. Write shared governance and the eight schemas.
5. Write the four protocols, six locale checklists, and seven templates.
6. Derive the 94-entry and 564-entry matrices from the canonical contracts.
7. Write the accessibility and Android plans.
8. Write six positive and thirty negative fixtures with the reason manifest.
9. Implement the 30-check validator.
10. Update the specialist index and append the implementation report.
11. Run the correction-focused batch, fix root causes, run the final batch.
12. Audit scope and protected diffs, commit once, push once, verify.

## 23. Automated tests

```text
node --check server.js
node --check test/run.js
node --check test/learning-contracts.js
node --check test/marzi-061-external-review-readiness.js
node test/conflict-markers.js
node test/learning-contracts.js
node test/marzi-061-external-review-readiness.js
node test/run.js
git diff --check
.ai/bin/docs-validate --json
```

`test/marzi-061-external-review-readiness.js` runs checks `M061-ER-001` through
`M061-ER-030` and must report 30/30. It proves structural preparation integrity
and never assesses pedagogical, linguistic, accessibility, usability, consent,
participant, or reviewer-qualification truth.

## 24. Rendered-browser matrix

Not applicable. MARZI-061 produces no runtime or browser change and makes no
rendered-surface claim.

## 25. Real-device matrix

Not applicable to this package. MARZI-061 prepares the moderated Android study
protocol; the study itself is executed later under separate legal, privacy, and
Product Owner approval, with its own device matrix.

## 26. Regression requirements

- `public/**` and `server.js` have no diff.
- `docs/learning/contracts/v1/**` and `test/learning-contracts.js` have no diff.
- `node test/learning-contracts.js` stays at 36/36.
- The application suite passes at its existing count with no failure.
- Accepted inventories and open gates are unchanged.
- The documentation validator gains no failure beyond the approved baseline.

## 27. Rollback strategy

Revert the single MARZI-061 implementation commit. That removes only the
preparation package and its bounded roadmap and tooling additions, restores the
prior roadmap range while preserving MARZI-022, preserves MARZI-021 and its
approval record, touches no runtime or learner data, and requires no migration.
Genuine external-review evidence recorded later lives in separate commits and
must not be deleted by this rollback without an explicit preservation plan.

## 28. Evidence required

Exact implementation baseline and commit; the recorded Product Owner allocation;
30/30 package validator output; unchanged 36/36 learning validator and
application suite; matrix counts of 94 and 564; the exact locale mapping; fixture
and reason-code counts with isolation proof; twelve adversarial mutation results;
accepted inventory counts; open-gate and release-refusal results; the preserved
known accessibility issue; documentation-validator baseline comparison; empty
runtime, dependency, configuration, and deployment diffs; the changed-file scope
audit; and the rollback command.

## 29. Stop conditions

Stop only if MARZI-022 no longer identifies Domain Ownership and Event Contracts;
the allocation is contradicted by a later authoritative decision; the MARZI-021-R2
baseline or approval is missing; canonical locales or learning artifacts are
absent; a correction would require a prohibited runtime or learning-contract
change; canonical sources are irreconcilably contradictory; unrelated working-tree
changes cannot be isolated; validation reveals source corruption; or the final
push fails after the commit exists.

Do not stop because reviewers, linguistic review, accessibility review, the
Android study, legal and privacy review, runtime integration, production
approval, or release remain pending.

## 30. Definition of done

MARZI-061 is done when MARZI-022 is unchanged, MARZI-061 exists exactly once as
External Review Readiness, only permitted files changed, prohibited diffs are
empty, the four tracks are prepared and genuinely pending, no reviewer or
participant or evidence or result or approval was invented, the matrices hold 94
and 564 verified entries, six locale checklists exist, the known Arabic issue
remains open, the Android protocol holds no results, all schemas are strict, six
positive fixtures pass and thirty negative fixtures fail for their exact reasons,
twelve adversarial mutations are detected, the package validator reports 30/30,
the learning validator stays at 36/36, inventories and open gates are unchanged,
and no external, runtime, production, deployment, release, legal, or
certification approval is claimed anywhere.

## 31. Independent review handoff

Codex must review the exact MARZI-061 implementation commit against its parent,
read-only, and verify: package-allocation integrity with MARZI-022 unchanged;
roadmap numbering MARZI-020–061 with 42 unique packages and dependency-graph
coverage; every one of the 30 validator checks; the six positive and thirty
negative fixtures and their reason isolation; the 94-entry and 564-entry matrices
against canonical content; the accepted inventories; `MARZI-A11Y-KNOWN-001`
remaining open; the truthfulness of all four external gates; empty runtime,
dependency, configuration, and deployment diffs; the documentation-validator
baseline; Git lineage and synchronization; and the rollback command. Return
exactly `APPROVED FOR EXTERNAL REVIEW EXECUTION`, `CHANGES REQUIRED`, or
`BLOCKED`. Approval means only that qualified humans may begin review execution;
it grants no specialist result, runtime authorization, production approval,
deployment, release, legal approval, or certification.
