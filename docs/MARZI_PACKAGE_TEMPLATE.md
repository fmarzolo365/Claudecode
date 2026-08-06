# Marzi Implementation Package Template

Use this template for every executable package. Replace all bracketed prompts, remove instructional text that does not apply, and preserve every numbered section. A package is not READY FOR IMPLEMENTATION until all blocking decisions, assets, ownership questions, and acceptance evidence are explicit.

## 1. Package identity

- Package ID: MARZI-[NNN]
- Canonical title: [title from docs/MARZI_MASTER_ROADMAP.md]
- Roadmap category: [category]
- Status: DISCOVERY
- Specification owner: Codex
- Implementation owner: Claude Code
- Product owner: [role/name]
- Independent reviewer: Codex
- Target branch: [development branch]
- Approved base commit: [full SHA]
- Package version: [version/date]
- Supersedes: [prior package/specification or none]

## 2. Objective

[One testable outcome. Describe what becomes true, not the implementation technique.]

## 3. User problem

[Who experiences the problem, what happens now, and why it matters. Link to observed source, rendered measurement, device evidence, support evidence, or an approved decision.]

## 4. Current evidence

| Evidence ID | Source and exact location | Observation | Classification | Reproduction |
|---|---|---|---|---|
| E-01 | [file:line, screenshot, trace, or device] | [fact] | [runtime defect / product-quality gap / asset gap / technical debt / environment limitation] | [steps or not applicable] |

Separate confirmed application behavior from assumptions, placeholders, missing assets, and environment limitations.

## 5. In scope

- [Bounded deliverable]
- [Bounded deliverable]

Anything not listed is out of scope.

## 6. Explicitly out of scope

- [Behavior, architecture, file, or product rule that must not change]
- [Later roadmap package]

## 7. Frozen contracts

List each contract that must remain byte-for-byte or semantically unchanged, its authority, and the verification method.

| Contract | Authority/current location | Required preservation | Verification |
|---|---|---|---|
| [contract] | [file/function/decision] | [byte-for-byte / semantic] | [diff/test] |

If a frozen contract must change, stop and obtain an approved decision and a revised package.

## 8. Product decisions already approved

| Decision ID | Approved outcome | Approval evidence | Package implication |
|---|---|---|---|
| [MARZI-Dxxx] | [outcome] | [repository path/date] | [constraint] |

Do not treat a recommendation as an approval.

## 9. Product decisions still required

| Decision ID | Question | Recommended option | Decision owner | Deadline | Work blocked |
|---|---|---|---|---|---|
| [MARZI-Dxxx] | [question] | [recommendation only] | [owner] | [before step] | [scope] |

If none, write “None” and explain why implementation does not cross a product gate.

## 10. Asset requirements

| Asset ID/path | Purpose | Required specification | Status | Source reference | Fallback | Blocks |
|---|---|---|---|---|---|---|
| [asset] | [use] | [format, size, padding, variants, rights] | [ready / placeholder / missing] | [reference, not a crop] | [deterministic behavior] | [step] |

Never crop concept boards, fabricate production art, or silently ship a placeholder.

## 11. Architecture

Describe:

- component/module boundaries;
- dependency direction;
- integration points;
- failure boundaries;
- why existing abstractions are retained or changed;
- how the design avoids duplicated sources of truth.

Include a diagram when three or more ownership or dependency relationships would otherwise be ambiguous.

## 12. State ownership

| State | Canonical owner | Readers | Writers | Lifetime | Persistence | Derived views |
|---|---|---|---|---|---|---|
| [state] | [single owner] | [consumers] | [authorized writers] | [screen/session/user] | [none/key/schema] | [UI only] |

State that must not enter transcript, reward, navigation, or storage ownership should be named explicitly.

## 13. Data/storage changes

- Schema/version before: [version or none]
- Schema/version after: [version or unchanged]
- New or changed keys: [list]
- Validation and corruption behavior: [rules]
- Offline behavior: [rules]
- Backward compatibility: [rules]
- Export/deletion implications: [rules]

“No storage change” must be verified with a focused diff and regression test.

## 14. Migration strategy

Define:

- upgrade path from every supported schema;
- idempotency;
- failure recovery;
- partial-write handling;
- downgrade/rollback consequences;
- test fixtures for old, current, corrupt, missing, and future-version data.

If no data migration exists, describe any documentation, cache, asset, or service-worker authority migration.

## 15. Accessibility

Specify measurable requirements for:

- semantic roles, names, values, states, and live announcements;
- keyboard and switch navigation;
- focus entry, containment, dismissal, and restoration;
- TalkBack/screen-reader order;
- 48 by 48 CSS-pixel targets unless an approved text-interaction pattern applies;
- contrast and non-color-only meaning;
- increased text size and zoom;
- reduced motion and audio alternatives;
- disability-equitable learning and reward behavior.

## 16. Localization/RTL

Specify:

- interface, target, and correction language behavior;
- localization key ownership;
- language metadata for mixed-language content;
- Arabic RTL layout and reading order;
- long-string and plural handling;
- no embedded text in reusable art;
- locale fallback and missing-key failure behavior.

## 17. Responsive requirements

List required viewports and measured invariants. Default mobile matrix:

- 320×568;
- 360×640;
- 360×780;
- 375×667;
- 390×844;
- 412×915;
- agreed tablet portrait/landscape assessment.

Define scroll owner, safe-area owner, keyboard behavior, overflow limits, orientation behavior, and increased-font behavior.

## 18. Performance budget

| Metric | Baseline | Maximum regression / target | Measurement environment | Evidence |
|---|---|---|---|---|
| Startup | [value] | [target] | [device/network] | [trace] |
| Interaction latency | [value] | [target] | [state] | [trace] |
| Layout/repaint | [value] | [target] | [viewport] | [profile] |
| Asset/network bytes | [value] | [budget] | [cold/warm] | [report] |
| Memory/listeners | [value] | [budget] | [journey] | [report] |

Budgets must distinguish measured device targets from aspirations.

## 19. Security/privacy

Document:

- trust boundaries and untrusted inputs;
- DOM injection/XSS handling;
- provider and PromptBuilder isolation;
- sensitive content and logging;
- consent and data minimization;
- localStorage validation;
- authentication/entitlement implications;
- abuse cases;
- required security tests or legal/privacy gate.

## 20. Files permitted to change

List exact files or bounded path patterns. No other file is authorized.

- [exact path]

## 21. Files forbidden to change

Name critical files and broad forbidden categories.

- [exact path or category]

Generated changes, formatting noise, dependency locks, configuration, and assets count as changes.

## 22. Implementation sequence

1. [Precondition verification]
2. [Smallest safe change]
3. [Regression tests]
4. [Rendered-browser evidence]
5. [Device evidence]
6. [Reports and handoff]

Each step must preserve a reviewable state. State when implementation must stop.

## 23. Automated tests

For each test, define:

| Test ID | Layer | Behavior proven | Negative case | Failure signal | Command |
|---|---|---|---|---|---|
| T-01 | [unit/integration/browser/contract] | [runtime outcome] | [broken condition] | [assertion] | [command] |

Source-text checks may guard frozen symbols but cannot substitute for runtime behavior or rendered measurement.

## 24. Rendered-browser matrix

| Browser/context | Viewport | Locale/direction | Motion | Network/asset mode | Required measurements |
|---|---|---|---|---|---|
| Chromium top-level | [size] | [locale/dir] | [normal/reduced] | [online/offline, success/failure] | [invariants] |

Distinguish application failures from harness failures and environment limitations.

## 25. Real-device matrix

| Device/context | OS/browser | Install mode | Input/accessibility mode | Scenario | Required evidence |
|---|---|---|---|---|---|
| [device] | [version] | [tab/standalone] | [touch/TalkBack/font] | [journey] | [measurements/video/log] |

Where emulation cannot establish platform behavior, real-device evidence is mandatory before the corresponding release status.

## 26. Regression requirements

- Every corrected application defect has a test that fails on the approved base and passes on the implementation.
- Frozen-contract checks cover every named contract.
- Unrelated journeys receive focused smoke coverage.
- Negative, failure, retry, offline, reload, Back, and duplicate-action cases are included where relevant.
- Existing required suites remain passing.

## 27. Rollback strategy

Define:

- commit or feature-boundary rollback;
- data/cache compatibility;
- asset fallback;
- service-worker behavior;
- monitoring trigger;
- user impact during rollback;
- evidence that rollback was rehearsed or mechanically verified.

Rollback must not require deleting user progress or fabricating entitlement state.

## 28. Evidence required

List the exact artifacts required for handoff:

- implementation report and full commit range;
- changed-file inventory;
- test command outputs;
- rendered measurements and screenshots;
- device model/OS/browser/install mode;
- accessibility evidence;
- performance traces;
- asset provenance and hashes;
- migration fixtures;
- known limitations classified by type.

## 29. Stop conditions

Implementation must stop when:

- an unresolved decision would change product behavior;
- a required production asset or rights record is missing;
- implementation needs a forbidden file;
- a frozen contract must change;
- ownership is ambiguous or duplicated;
- migration cannot preserve supported data;
- privacy/security approval is absent;
- required evidence cannot be produced;
- the branch/base differs from the approved package.

Record the blocker in the package handoff; do not reinterpret scope.

## 30. Definition of done

A package is done only when:

- every in-scope deliverable exists;
- every acceptance criterion has reproducible evidence;
- all required tests pass;
- no unauthorized file changed;
- documentation/runtime/asset readiness are reported separately;
- product gates are recorded;
- independent review returns the required verdict;
- staging/device gates are complete for the requested status;
- rollback is viable;
- no unresolved blocker is hidden.

## 31. Independent review handoff

Provide Codex:

- repository, branch, base SHA, implementation SHA, and commit list;
- exact package specification version;
- Product Owner decision and asset approvals;
- changed files per commit;
- implementation and test reports;
- commands and environment needed to reproduce evidence;
- real-device evidence;
- explicit unverified claims and environment limitations.

Codex reviews the exact diff independently, distinguishes genuine application defects from test/harness/environment limitations, and does not modify the implementation during review.
