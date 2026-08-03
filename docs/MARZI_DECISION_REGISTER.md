# Marzi Decision Register

Status: Canonical decision register

Applies to: MARZI-020 through MARZI-060

Authority: This register records choices that the roadmap and Product Bible intentionally do not resolve without the named owner.

## Operating rules

- An OPEN recommendation is not approval.
- A package listed as blocked must stop before implementation reaches the affected behavior, artwork, economy, commercial policy, or data practice.
- Approval must record the chosen option, approver, date, rationale, and affected package IDs in this file.
- If an approved decision changes, create a new decision record that supersedes the old one; do not rewrite history silently.
- Technical implementation may refine mechanics only inside the approved product outcome.

## Decision index

| ID | Topic | Class | Owner | Status | Blocks |
|---|---|---|---|---|---|
| MARZI-D001 | Canonical Marzi artwork | ASSET REQUIRED / PRODUCT OWNER DECISION REQUIRED | Product Owner | OPEN | 034, 036, 040–041, 044, 050, 053, 059 |
| MARZI-D002 | Launcher and install identity | ASSET REQUIRED / PRODUCT OWNER DECISION REQUIRED | Product Owner | OPEN | 040, 050, 052–053 |
| MARZI-D003 | Six evolution assets | ASSET REQUIRED / PRODUCT OWNER DECISION REQUIRED | Product Owner | OPEN | 034, 040–041, 044, 050, 053 |
| MARZI-D004 | Stage 5 and stage 6 canonical props | PRODUCT OWNER DECISION REQUIRED | Product Owner | OPEN | 040–041, 044 |
| MARZI-D005 | Outfit asset strategy | ASSET REQUIRED / PRODUCT OWNER DECISION REQUIRED | Product Owner | OPEN | 041, 044, 050, 053, 059 |
| MARZI-D006 | Call portrait and background production brief | ASSET REQUIRED / PRODUCT OWNER DECISION REQUIRED | Product Owner | OPEN | 039, 041, 050, 053 |
| MARZI-D007 | Audio identity and production source | ASSET REQUIRED / PRODUCT OWNER DECISION REQUIRED | Product Owner | OPEN | 046, 053 |
| MARZI-D008 | Onboarding step count and deferral policy | PRODUCT OWNER DECISION REQUIRED | Product Owner | OPEN | 034, 050, 052 |
| MARZI-D009 | Placement assessment policy | PRODUCT OWNER DECISION | Product Owner | APPROVED | MARZI-021 released; specialist/runtime gates remain for 034, 042–044 |
| MARZI-D010 | Interface and correction-language relationship | PRODUCT OWNER DECISION REQUIRED | Product Owner | OPEN | 026, 028, 030, 034, 037, 042, 049 |
| MARZI-D011 | Assistance default and persistence | PRODUCT OWNER DECISION REQUIRED | Product Owner | OPEN | 037, 042–044, 050 |
| MARZI-D012 | Translation default by learner level | PRODUCT OWNER DECISION REQUIRED | Product Owner | OPEN | 037, 042, 049–050 |
| MARZI-D013 | Auto-listen and tap-to-speak default | PRODUCT OWNER DECISION REQUIRED | Product Owner | OPEN | 034, 039, 045, 050 |
| MARZI-D014 | XP eligibility | PRODUCT OWNER DECISION REQUIRED | Product Owner | OPEN | 043, 050 |
| MARZI-D015 | Minimum meaningful call | PRODUCT OWNER DECISION REQUIRED | Product Owner | OPEN | 043 |
| MARZI-D016 | Conversation and scenario completion definition | PRODUCT OWNER DECISION | Product Owner | APPROVED | MARZI-021 released; specialist/runtime gates remain for 034–035, 041–044, 056 |
| MARZI-D017 | XP, coin, streak, and difficulty weighting | PRODUCT OWNER DECISION REQUIRED | Product Owner | OPEN | 043, 050 |
| MARZI-D018 | Reward anti-farming policy | PRODUCT OWNER DECISION REQUIRED | Product Owner | OPEN | 043, 048, 050 |
| MARZI-D019 | Pronunciation scoring and disclosure | PRODUCT OWNER DECISION REQUIRED / LEGAL/PRIVACY REVIEW REQUIRED | Product Owner and Privacy Owner | OPEN | 042, 043, 049 |
| MARZI-D020 | Monetization and Premium model | COMMERCIAL DECISION REQUIRED | Product Owner / Commercial Owner | OPEN | 044, 047, 052, 053 |
| MARZI-D021 | Analytics consent and event policy | LEGAL/PRIVACY REVIEW REQUIRED | Privacy Owner | OPEN | 048, 052, 053 |
| MARZI-D022 | Cloud synchronization and account model | PRODUCT OWNER DECISION REQUIRED / LEGAL/PRIVACY REVIEW REQUIRED | Product Owner and Privacy Owner | OPEN | 051–053 |
| MARZI-D023 | Supported target languages and rollout order | PRODUCT OWNER DECISION REQUIRED | Product Owner | OPEN | 028, 030–031, 049–050, 052–053, 056 |
| MARZI-D024 | Data retention and deletion policy | LEGAL/PRIVACY REVIEW REQUIRED | Privacy Owner | OPEN | 027, 032, 042, 048, 051–053, 055, 060 |
| MARZI-D025 | Release platforms and distribution sequence | COMMERCIAL DECISION REQUIRED | Product Owner / Release Owner | OPEN | 052, 053 |

## Detailed decisions

### MARZI-D001 — Canonical Marzi artwork

| Field | Record |
|---|---|
| Question | Which production artwork is the canonical Marzi model across launcher, header, onboarding, calls, progression, Store, rewards, offline, error, and empty states? |
| Options | A. Commission a coherent production set derived from the approved visual DNA in 01_home.png and 04_progress.png. B. Approve an existing delivered production set after an identity audit. C. Continue placeholders temporarily, explicitly marked non-production. |
| Recommended option | A, while retaining C only in non-release builds until delivery. |
| Rationale | References are authoritative direction but are not safe production crops; one commissioned model prevents further identity drift. |
| Product impact | Establishes recognition and emotional continuity. |
| Technical impact | Requires a versioned asset manifest, deterministic fallbacks, and replacement mapping. |
| Economic impact | Art commissioning and QA cost; no economy-rule change. |
| Accessibility impact | Every state needs equivalent accessible names and non-image state cues. |
| Localization impact | Artwork must contain no embedded language-specific text. |
| Decision owner | Product Owner, advised by visual-design lead. |
| Deadline | Approve before MARZI-033 enters implementation. |
| Packages blocked | MARZI-034, 036, 040, 041, 044, 050, 053, 059. |

### MARZI-D002 — Launcher and install identity

| Field | Record |
|---|---|
| Question | What exact mascot composition, background, maskable safe zone, and icon family will represent installed Marzi? |
| Options | A. Mascot-only canonical Marzi on a brand background, with separate any and maskable exports. B. Transparent mascot where platform treatment permits. C. Retain the current language-specific icon. |
| Recommended option | A; explicitly reject language flags and embedded learning claims. |
| Rationale | A language-neutral icon survives target-language expansion and Android adaptive masks. |
| Product impact | Improves recognition and removes misleading German-only identity. |
| Technical impact | New icon sizes, manifest entries, favicon/splash assets, cache versioning, and install-update instructions. |
| Economic impact | Production art cost only. |
| Accessibility impact | High-contrast recognizable silhouette; app accessible name remains textual. |
| Localization impact | No embedded copy, flag, or language-specific symbol. |
| Decision owner | Product Owner. |
| Deadline | Approve before MARZI-040 asset integration; deliver before MARZI-053 release qualification. |
| Packages blocked | MARZI-040, 050, 052, 053. |

### MARZI-D003 — Six evolution assets

| Field | Record |
|---|---|
| Question | Which six production files depict eggs, tadpole, tadpole with legs, young frog, studious frog, and expert frog as one evolving character? |
| Options | A. Commission all six as a matched set from 04_progress.png direction. B. Approve a complete existing set after visual audit. C. Mix existing and new art. |
| Recommended option | A; avoid C because mixed provenance recreates the current inconsistency. |
| Rationale | The evolution promise depends on unmistakable continuity across all six stages. |
| Product impact | Makes progression legible and emotionally credible. |
| Technical impact | Six versioned transparent assets, locked/earned presentation, fallbacks, responsive and RTL validation. |
| Economic impact | Art production cost; XP thresholds remain unchanged unless MARZI-D017 separately changes them. |
| Accessibility impact | Localized stage names and non-color-only locked/earned states. |
| Localization impact | No embedded text; localized labels live in UI resources. |
| Decision owner | Product Owner. |
| Deadline | Approve and deliver before MARZI-034 implementation. |
| Packages blocked | MARZI-034, 040, 041, 044, 050, 053. |

### MARZI-D004 — Canonical expert-stage props

| Field | Record |
|---|---|
| Question | Which props and styling distinguish the approved studious stage 5 and expert stage 6 without changing Marzi into a different character? |
| Options | A. Approve the exact reference props from 04_progress.png. B. Commission revised props consistent with that reference. C. Let implementation invent props. |
| Recommended option | A if source rights and production resolution permit; otherwise B. Never C. |
| Rationale | Props carry stage meaning and must be art-directed, not CSS- or developer-invented. |
| Product impact | Clarifies mastery progression. |
| Technical impact | Determines asset variants and outfit layering compatibility. |
| Economic impact | Possible additional art variants. |
| Accessibility impact | Meaning must also appear in localized stage labels. |
| Localization impact | Props must avoid culturally narrow or text-dependent meaning. |
| Decision owner | Product Owner. |
| Deadline | Before MARZI-040 art acceptance and MARZI-041 composition design. |
| Packages blocked | MARZI-040, 041, 044. |

### MARZI-D005 — Outfit asset strategy

| Field | Record |
|---|---|
| Question | Are outfits layered over a canonical body, delivered as full composite variants, or produced through a bounded hybrid matrix? |
| Options | A. Layered body/outfit/accessory assets with fixed anchors. B. Full composite per stage and outfit. C. Hybrid: layers for compatible adult stages, composites for exceptions. |
| Recommended option | C after a technical art-spike; use A only if all canonical silhouettes share reliable anchors. |
| Rationale | A minimizes files but can fail visually across evolution anatomy; B is reliable but grows combinatorially. |
| Product impact | Makes purchases visibly meaningful in calls, Profile, progress, Store preview, and rewards. |
| Technical impact | Asset matrix, compatibility rules, fallback order, preload and memory budgets. |
| Economic impact | Production cost and future catalog scalability; prices remain unchanged unless approved separately. |
| Accessibility impact | Equipped state needs textual confirmation; outfit visuals cannot be the sole ownership cue. |
| Localization impact | Names/descriptions localized separately from art. |
| Decision owner | Product Owner after technical-art recommendation. |
| Deadline | Pipeline discovery in MARZI-029; approval before MARZI-041. |
| Packages blocked | MARZI-041, 044, 050, 053, 059. |

### MARZI-D006 — Call portrait and background production brief

| Field | Record |
|---|---|
| Question | Which upper-body character portraits, outfit-compatible framing, and background treatments are approved for the chat-first call composition? |
| Options | A. Commission upper-body painterly portraits and subtle scenario backgrounds. B. Reframe existing high-resolution source files if they contain the required torso coverage. C. Crop concept boards. |
| Recommended option | Audit B first; choose A wherever source framing is insufficient; reject C. |
| Rationale | The current close crop cannot show clothing or preserve enough conversation space. |
| Product impact | Makes a call feel human while keeping conversation primary. |
| Technical impact | Responsive art direction, object-position metadata, portrait success/fallback states, preload budget. |
| Economic impact | Portrait and background art production. |
| Accessibility impact | Portrait is supplementary; call state and speaker ownership remain textual. |
| Localization impact | Backgrounds and clothing must avoid embedded copy and unintended cultural claims. |
| Decision owner | Product Owner. |
| Deadline | Asset audit in MARZI-029; approval before MARZI-041 implementation. |
| Packages blocked | MARZI-039, 041, 050, 053. |

### MARZI-D007 — Audio identity and production source

| Field | Record |
|---|---|
| Question | Which sonic palette and licensing source governs connection, hang-up, reward, evolution, purchase, success, and gentle control feedback? |
| Options | A. Commission a compact original sound family. B. License a curated family with documented rights. C. Use generic or browser-generated effects. |
| Recommended option | A where budget permits, otherwise B; reject inconsistent generic effects. |
| Rationale | A small coherent family provides premium feedback without audio clutter. |
| Product impact | Strengthens trust, state clarity, and celebration. |
| Technical impact | Versioned compressed assets, user mute policy, preload/lazy-load, interruption and reduced-motion equivalents. |
| Economic impact | Commissioning/licensing cost. |
| Accessibility impact | No essential information may be audio-only; respect platform and user sound preferences. |
| Localization impact | Prefer non-verbal cues; spoken clips require localized variants. |
| Decision owner | Product Owner. |
| Deadline | Before MARZI-046 implementation. |
| Packages blocked | MARZI-046, 053. |

### MARZI-D008 — Onboarding step count and deferral policy

| Field | Record |
|---|---|
| Question | How many required first-run steps are permitted, and which profile, permission, notification, evolution, account, or PIN steps are deferred? |
| Options | A. Five to seven required steps, with permissions contextual and account/notification/evolution details deferred. B. Preserve the complete current sequence. C. Three-step minimal setup with later mandatory calibration. |
| Recommended option | A, targeting first meaningful learning interaction within three minutes. |
| Rationale | It balances trustworthy configuration with low abandonment and future language support. |
| Product impact | Directly affects activation and first value. |
| Technical impact | Step graph, persistence, resumability, Back semantics, and deferred prompts. |
| Economic impact | Earlier value may improve conversion; no direct economy change. |
| Accessibility impact | Fewer screens reduce fatigue; each retained screen must remain keyboard/TalkBack complete. |
| Localization impact | Long-copy budgets and separate language configuration must be validated. |
| Decision owner | Product Owner. |
| Deadline | Before MARZI-034 implementation. |
| Packages blocked | MARZI-034, 050, 052. |

### MARZI-D009 — Placement assessment policy

| Field | Record |
|---|---|
| Question | Is initial placement optional, skippable, adaptive, and which modalities may it use? |
| Options | A. Optional short calibration using vocabulary/comprehension/listening, adding speech only after consent. B. Mandatory fixed quiz. C. Self-declared level only. |
| Status | **APPROVED** |
| Selected option | **Option A — optional, bounded placement calibration.** |
| Approver role | Product Owner |
| Approval date | 2026-08-03 |
| Product Owner rationale | Placement calibration must help personalize the learner path without blocking first use, forcing a high-stakes test, or presenting an unsupported proficiency certification. |
| Approval conditions | Calibration is optional and bounded in duration and scope.<br>The learner may skip it.<br>Results initialize recommendations, not permanent labels.<br>Confidence and insufficient-evidence states must be represented.<br>Accessibility accommodations must not lower mastery standards.<br>Calibration results may be revised by later evidence.<br>No external certification claim is permitted. |
| Product impact | Better initial difficulty and trust. |
| Technical impact | Assessment state, scoring boundary, deferred speech path, and persistence. |
| Economic impact | None directly. |
| Accessibility impact | Non-audio alternatives and extended-time usability required. |
| Localization impact | Calibration content required per target language and explanation language. |
| Decision owner | Product Owner; learning-specialist review remains required before runtime integration, educational approval, or production release. |
| Released package | MARZI-021 static contract authoring |
| Later gates | Specialist, accessibility, and localization review remain mandatory before runtime integration or release; later packages must also satisfy their own recorded product and economy decisions. |

### MARZI-D010 — Interface and correction-language relationship

| Field | Record |
|---|---|
| Question | How are interface/native language, target language, and correction/explanation language selected and defaulted? |
| Options | A. Store three independent fields; initially default correction language to interface language with explicit override. B. Force interface and correction language to match. C. Infer correction language invisibly. |
| Recommended option | A. |
| Rationale | It supports multilingual households and learners who prefer explanations in a different language. |
| Product impact | Reduces ambiguity and enables global expansion. |
| Technical impact | Versioned preference schema and migration; PromptBuilder receives explicit values rather than inference. |
| Economic impact | Translation-content scope grows with supported combinations. |
| Accessibility impact | Language metadata must follow the displayed text, not only UI locale. |
| Localization impact | Central architectural decision for all copy and prompt inputs. |
| Decision owner | Product Owner. |
| Deadline | Before MARZI-026/028 language contracts and MARZI-034 onboarding are frozen. |
| Packages blocked | MARZI-026, 028, 030, 034, 037, 042, 049. |

### MARZI-D011 — Assistance default and persistence

| Field | Record |
|---|---|
| Question | Which OFF, HINT, or FULL mode is the default, and is it remembered per call, scenario, or user? |
| Options | A. Level-based initial default with an explicit user override persisted globally. B. HINT for everyone, per call. C. FULL for everyone. D. OFF for everyone. |
| Recommended option | A: FULL for true beginners, HINT for intermediate, OFF for advanced, with immediate reversible control and a persisted user override. |
| Rationale | It supports autonomy while avoiding continuous answer exposure. |
| Product impact | Changes challenge, confidence, and learning integrity. |
| Technical impact | One canonical assistance state outside transcript content; toggling must not issue a new AI request. |
| Economic impact | Assistance usage may affect reward analysis only after MARZI-D017 approval. |
| Accessibility impact | Toggle state announced; no empty inaccessible regions when hidden. |
| Localization impact | Hints, labels, and translations use explicit language settings. |
| Decision owner | Product Owner with learning lead. |
| Deadline | Before MARZI-037. |
| Packages blocked | MARZI-037, 042, 043, 044, 050. |

### MARZI-D012 — Translation default by level

| Field | Record |
|---|---|
| Question | When is inline translation visible by default? |
| Options | A. Beginner visible, intermediate visible/collapsible, advanced hidden but one action away. B. Always visible. C. Always hidden. |
| Recommended option | A with a persistent user override. |
| Rationale | Translation should scaffold comprehension without preventing target-language processing. |
| Product impact | Affects learning difficulty and call clarity. |
| Technical impact | Presentation preference associated with canonical transcript messages; no duplicate provider request. |
| Economic impact | None if translations reuse canonical turn data. |
| Accessibility impact | Source and translation programmatically associated and language-tagged. |
| Localization impact | Requires reliable correction-language selection and RTL handling. |
| Decision owner | Product Owner with learning lead. |
| Deadline | Before MARZI-037/049. |
| Packages blocked | MARZI-037, 042, 049, 050. |

### MARZI-D013 — Auto-listen and tap-to-speak default

| Field | Record |
|---|---|
| Question | Does a call default to explicit tap-to-speak, automatic listening after remote speech, or a user-selected mode? |
| Options | A. Tap-to-speak default with an optional remembered auto-listen setting. B. Auto-listen default. C. Scenario-specific implicit behavior. |
| Recommended option | A. |
| Rationale | It is predictable, privacy-preserving, and accessible while retaining an advanced hands-free choice. |
| Product impact | Sets the primary conversation rhythm and microphone trust model. |
| Technical impact | Explicit call-state transitions, permission handling, and prevention of duplicate microphone controls. |
| Economic impact | None. |
| Accessibility impact | Clear state cues, keyboard control, and no reliance on color or animation. |
| Localization impact | Control labels and microphone explanations localized. |
| Decision owner | Product Owner. |
| Deadline | Before MARZI-034/039 interaction contracts. |
| Packages blocked | MARZI-034, 039, 045, 050. |

### MARZI-D014 — XP eligibility

| Field | Record |
|---|---|
| Question | Which evidence makes a learning action eligible for XP? |
| Options | A. Completed, meaningful learning events only, with explicit quality signals. B. Any call start/end. C. Time connected only. |
| Recommended option | A; opening or immediately ending a call must never qualify. |
| Rationale | Rewards should represent learning, not navigation or idle time. |
| Product impact | Restores progression credibility. |
| Technical impact | Eligibility evaluator consumes immutable session evidence before the existing ledger writes. |
| Economic impact | Material economy behavior change requiring explicit approval and migration analysis. |
| Accessibility impact | Learners using assistive technology must not be penalized for slower interaction. |
| Localization impact | Eligibility explanations and reward breakdowns localized. |
| Decision owner | Product Owner with economy lead. |
| Deadline | Before MARZI-043 specification approval. |
| Packages blocked | MARZI-043, 050. |

### MARZI-D015 — Minimum meaningful call

| Field | Record |
|---|---|
| Question | What minimum evidence distinguishes a meaningful call from immediate hang-up, inactivity, or restart farming? |
| Options | A. Require a bounded combination of completed learner turns, remote responses, active duration, and scenario progress. B. Duration threshold only. C. One learner utterance only. |
| Recommended option | A; calibrate numeric thresholds from staging telemetry and accessibility review. |
| Rationale | A single threshold is easy to game and can punish legitimate short scenarios. |
| Product impact | Defines whether a session can earn completion rewards. |
| Technical impact | Session evidence schema and deterministic eligibility tests; no transcript mutation. |
| Economic impact | Directly changes reward supply. |
| Accessibility impact | Thresholds need accommodations for speech-disabled and slower learners. |
| Localization impact | Scenario-length differences must not create language inequity. |
| Decision owner | Product Owner with learning/economy leads. |
| Deadline | Before MARZI-043 implementation; telemetry prerequisites decided in MARZI-048. |
| Packages blocked | MARZI-043. |

### MARZI-D016 — Completion definition

| Field | Record |
|---|---|
| Question | What constitutes conversation completion and scenario completion? |
| Options | A. Explicit scenario objectives and terminal criteria, independent of hang-up. B. Any graceful call end. C. Fixed turn count for all scenarios. |
| Status | **APPROVED** |
| Selected option | **Option A — objective-based completion with explicit Partial and Insufficient Evidence states.** |
| Approver role | Product Owner |
| Approval date | 2026-08-03 |
| Product Owner rationale | Completion must reflect demonstrated learning objectives rather than simple activity completion, while remaining understandable, fair, recoverable, and accessible. |
| Approval conditions | Completion is objective-based.<br>Partial and Insufficient Evidence are explicit states.<br>Absence of evidence is not treated as failure.<br>Accessibility accommodations are separated from mastery evidence.<br>Remediation and further-evidence opportunities remain available.<br>Learner-facing copy must avoid punitive or misleading language.<br>No unsupported educational certification claim is permitted. |
| Product impact | Powers feedback, learning map progress, and fair rewards. |
| Technical impact | Scenario metadata and ConversationSession result contract may need additive extension only after architecture review. |
| Economic impact | Determines completion bonuses and anti-farming inputs. |
| Accessibility impact | Alternative completion paths must preserve learning goals. |
| Localization impact | Objectives and terminal prompts require localized content. |
| Decision owner | Product Owner; learning-specialist review remains required before runtime integration, educational approval, or production release. |
| Released package | MARZI-021 static contract authoring |
| Later gates | Specialist, accessibility, and localization review remain mandatory before runtime integration or release; economy effects remain gated by MARZI-D014, D015, D017, and D018. |

### MARZI-021 — Taxonomy and mastery presentation approval

| Field | Record |
|---|---|
| Status | **APPROVED IN PRINCIPLE** for static MARZI-021 contract authoring |
| Approved scope | Competency taxonomy; objective families; stable competency and objective identifiers; mastery presentation states; Partial; Insufficient Evidence; objective-based completion copy; six-language-compatible domain architecture. |
| Approver role | Product Owner |
| Approval date | 2026-08-03 |
| Released package | MARZI-021 static contract authoring |
| Specialist status | A learning specialist is not yet named. Specialist review remains mandatory before educational approval, runtime integration, or production release. Specialist findings may require corrections to the static contracts before integration or release. |
| Conditions | Specialist educational review remains mandatory.<br>Six-language linguistic review remains mandatory.<br>Accessibility review remains mandatory.<br>This approval is not educational certification.<br>Implementation must preserve the frozen MARZI-021 contracts.<br>Runtime integration remains subject to later package gates. |
| Technical boundary | Static, versioned, dependency-free contract authoring and validation may proceed before specialist sign-off. This approval does not authorize application runtime, persistence, provider, prompt, reward, economy, or UI changes. |

### MARZI-D017 — XP, coin, streak, and difficulty weighting

| Field | Record |
|---|---|
| Question | Which approved formula awards XP and coins for completion, correctness, first attempt, pronunciation, difficulty, and streak without destabilizing the economy? |
| Options | A. Evidence-based bounded formula with caps and a published reward breakdown. B. Preserve all current grants indefinitely. C. Unbounded additive bonuses. |
| Recommended option | A after simulation; preserve current thresholds, prices, and 20-coin contract until the Product Owner approves exact replacements. |
| Rationale | The requested rebalance is a business-rule change and cannot be inferred from product intent alone. |
| Product impact | Controls motivation and perceived fairness. |
| Technical impact | Versioned reward policy behind the idempotent ledger, fixtures, simulation, and migration decision. |
| Economic impact | Highest; changes currency emission and progression pace. |
| Accessibility impact | Do not make speech quality the only path to equitable rewards. |
| Localization impact | Difficulty weights require language-specific calibration. |
| Decision owner | Product Owner with economy and learning leads. |
| Deadline | Before MARZI-043 implementation and MARZI-050 calibration. |
| Packages blocked | MARZI-043, 050. |

### MARZI-D018 — Reward anti-farming policy

| Field | Record |
|---|---|
| Question | How are repeated restarts, identical easy scenarios, inactivity, replay abuse, and offline retries treated? |
| Options | A. Deterministic eligibility plus diminishing repeated-completion bonuses, idempotency, daily caps only where simulation supports them, and transparent explanations. B. Hidden punitive heuristics. C. No protection. |
| Recommended option | A, excluding silent punishment and without deleting legitimate progress. |
| Rationale | Anti-farming must protect integrity without surprising or falsely accusing learners. |
| Product impact | Improves fairness and trust. |
| Technical impact | Stable attempt IDs, repeat classification, auditable reason codes, offline reconciliation. |
| Economic impact | Reduces exploit-driven emission and may affect retention. |
| Accessibility impact | Avoid classifying pauses, retries, or assistive workflows as abuse. |
| Localization impact | User-visible reason codes require localization. |
| Decision owner | Product Owner with economy lead. |
| Deadline | Before MARZI-043; observability event policy coordinated with MARZI-D021. |
| Packages blocked | MARZI-043, 048, 050. |

### MARZI-D019 — Pronunciation scoring and disclosure

| Field | Record |
|---|---|
| Question | Is pronunciation scored for feedback, rewards, placement, or all three, and how are uncertainty and accent fairness disclosed? |
| Options | A. Feedback-first confidence-bounded scoring, optional for rewards until validated. B. Immediate reward-bearing score. C. No pronunciation score. |
| Recommended option | A, with reward use blocked until bias, reliability, consent, and fallback reviews pass. |
| Rationale | Speech scores can be useful but are noisy across accents, devices, disabilities, and environments. |
| Product impact | Potentially strong coaching with substantial trust risk. |
| Technical impact | Provider confidence contract, calibration data, uncertainty UI, non-speech alternative. |
| Economic impact | Reward weighting remains unresolved until validation. |
| Accessibility impact | Must never exclude users unable or unwilling to speak. |
| Localization impact | Per-language and accent calibration required. |
| Decision owner | Product Owner and Privacy Owner, with learning/accessibility review. |
| Deadline | Before MARZI-042 feedback; separately before any MARZI-043 reward integration. |
| Packages blocked | MARZI-042, 043, 049. |

### MARZI-D020 — Monetization and Premium model

| Field | Record |
|---|---|
| Question | What is sold, at what entitlement level, on which platform, with which restoration and failure behavior? |
| Options | A. Define a transparent subscription/pack model after value and economy validation. B. Keep Premium presentation-only through beta. C. Simulate purchase success. |
| Recommended option | B for beta unless a complete commercial, legal, platform-billing, restoration, and support package is approved; never C. |
| Rationale | Payment UI without real entitlement integrity damages trust. |
| Product impact | Determines upgrade surfaces and feature access. |
| Technical impact | Entitlement authority, receipt verification, restore flow, offline state, and support tooling. |
| Economic impact | Defines revenue and interaction with minute packs/Store. |
| Accessibility impact | Purchase terms, prices, errors, and restoration must be screen-reader clear. |
| Localization impact | Pricing, legal copy, taxes, and currencies vary by market. |
| Decision owner | Product Owner / Commercial Owner. |
| Deadline | Before MARZI-044 economy-facing Store changes and definitively before MARZI-047. |
| Packages blocked | MARZI-044, 047, 052, 053. |

### MARZI-D021 — Analytics consent and event policy

| Field | Record |
|---|---|
| Question | Which events are collected, for what purpose, under which consent/legal basis, and with what minimization? |
| Options | A. Minimal typed event taxonomy with regional consent, no raw transcript/audio by default, and documented retention. B. Broad behavioral capture. C. No product analytics. |
| Recommended option | A after legal/privacy review; default to no sensitive-content collection. |
| Rationale | Launch decisions need evidence, but conversation data is unusually sensitive. |
| Product impact | Enables activation, latency, learning, and reliability measurement with trust safeguards. |
| Technical impact | Consent state, event schema, redaction, offline queue, deletion and audit controls. |
| Economic impact | Analytics infrastructure cost and monetization measurement. |
| Accessibility impact | Consent must be operable and understandable without dark patterns. |
| Localization impact | Consent and privacy disclosures need legally reviewed translations. |
| Decision owner | Privacy Owner with Product Owner. |
| Deadline | Before MARZI-048 implementation. |
| Packages blocked | MARZI-048, 052, 053. |

### MARZI-D022 — Cloud synchronization and account model

| Field | Record |
|---|---|
| Question | Will progress, purchases, transcripts, preferences, and rewards remain device-local or synchronize through accounts? |
| Options | A. Account-optional sync with explicit data classes and conflict policy. B. Mandatory account/cloud. C. Device-local only for v1. |
| Recommended option | C for early beta unless cross-device recovery is a launch requirement; design A through discovery before committing. |
| Rationale | Sync adds identity, security, privacy, migration, and conflict complexity that should not be hidden inside UI work. |
| Product impact | Affects recovery, multi-device use, and onboarding friction. |
| Technical impact | Authentication, server authority, conflict resolution, encryption, deletion, and offline reconciliation. |
| Economic impact | Backend and support cost; purchase restoration may independently require accounts. |
| Accessibility impact | Account recovery must offer accessible alternatives. |
| Localization impact | Account, recovery, consent, and error copy expand localization scope. |
| Decision owner | Product Owner and Privacy Owner. |
| Deadline | Discovery before MARZI-051; final decision before MARZI-052 release operations. |
| Packages blocked | MARZI-051, 052, 053. |

### MARZI-D023 — Supported target languages and rollout order

| Field | Record |
|---|---|
| Question | Which target languages are production-supported at beta and public launch, beyond the architecture being multi-language ready? |
| Options | A. Launch one validated target language, then add languages through a content/provider readiness gate. B. Launch all technically selectable targets. C. German-only architecture and branding. |
| Recommended option | A, while removing German-only architectural assumptions now. |
| Rationale | Product quality requires validated scenarios, prompts, voices, translations, scoring, and support per language. |
| Product impact | Sets credible market scope. |
| Technical impact | Locale capability registry and per-language readiness flags. |
| Economic impact | Content, voice, QA, and support cost per language. |
| Accessibility impact | Voice and text alternatives must be validated per language. |
| Localization impact | This is the primary rollout policy. |
| Decision owner | Product Owner. |
| Deadline | Before MARZI-028 content architecture; launch list fixed before MARZI-053. |
| Packages blocked | MARZI-028, 030, 031, 049, 050, 052, 053, 056. |

### MARZI-D024 — Data retention and deletion

| Field | Record |
|---|---|
| Question | How long are local/cloud transcripts, audio, analytics, account data, and reward records retained, and how can users export or delete them? |
| Options | A. Data-class-specific minimization schedule with user controls and legal exceptions. B. Indefinite retention. C. Delete all immediately after a call. |
| Recommended option | A after legal/privacy review; raw audio should not be retained by default. |
| Rationale | One rule cannot appropriately govern sensitive conversation content, ledger integrity, and operational logs. |
| Product impact | Material trust and support commitment. |
| Technical impact | Classification, expiry, deletion propagation, ledger/legal exception handling, and tests. |
| Economic impact | Storage and compliance operations. |
| Accessibility impact | Export/deletion controls and confirmations must be accessible. |
| Localization impact | Privacy notices and controls require reviewed translations. |
| Decision owner | Privacy Owner. |
| Deadline | Before MARZI-032/048 data contracts and MARZI-051 architecture. |
| Packages blocked | MARZI-027, 032, 042, 048, 051, 052, 053, 055, 060. |

### MARZI-D025 — Release platforms and distribution

| Field | Record |
|---|---|
| Question | Which browser/PWA/device markets constitute beta and public release, and what is the rollout sequence? |
| Options | A. Android installed PWA plus a bounded supported-browser matrix first, then expand from evidence. B. All browsers and app stores immediately. C. Browser tab only. |
| Recommended option | A, with explicit minimum versions, install/update testing, staged rollout, and rollback. |
| Rationale | Current real-device evidence is strongest on Android PWA; a bounded matrix makes release claims testable. |
| Product impact | Sets customer expectations and support surface. |
| Technical impact | CI/browser matrix, device lab, service-worker rollout, monitoring, and release runbooks. |
| Economic impact | Device coverage, QA, store/distribution, and support costs. |
| Accessibility impact | Platform accessibility qualification is part of support, not an exception. |
| Localization impact | Store/listing and release notes vary by market. |
| Decision owner | Product Owner / Release Owner. |
| Deadline | Before MARZI-052 release operations; final before MARZI-053 go/no-go. |
| Packages blocked | MARZI-052, 053. |

## Approval record template

When a decision is made, append this record beneath its detailed section:

| Field | Approval record |
|---|---|
| Status | APPROVED, REJECTED, or SUPERSEDED |
| Selected option | Exact approved outcome |
| Conditions | Any bounded conditions |
| Owner | Name/role |
| Approval date | ISO 8601 date |
| Evidence | Link or repository path |
| Packages released | Package IDs |
| Supersedes | Prior decision ID, if applicable |
