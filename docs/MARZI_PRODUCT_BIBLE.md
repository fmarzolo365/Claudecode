# Marzi Product Bible

Status: Proposed permanent product source of truth; Product Owner approval required

Scope: Product intent and non-negotiable principles for MARZI-020 through MARZI-060 and successor work

Authority rule: Recorded Product Owner decisions may amend this Bible. Technical implementation, historical behavior, competitor convention, or an implementation report may not silently override it.

Marzi is its own product. Other learning and consumer products are quality benchmarks only; their features, interface, characters, and language are not Marzi’s design source.

## 1. Product vision

Marzi helps people become capable and confident in consequential real-world conversations in a language they are learning. It combines a safe conversational rehearsal partner, visible learning progress, compassionate correction, and an evolving companion whose growth reflects genuine learner effort.

The product should feel trustworthy, warm, focused, and premium. Technology is successful when it disappears behind a responsive conversation and clear learning feedback.

## 2. Core user problem

Learners often know vocabulary or lesson answers but cannot retrieve language quickly enough during a live call, appointment, service interaction, school conversation, workplace exchange, or relocation task. Ordinary lessons provide knowledge without enough realistic, low-risk practice. Unstructured AI chat can provide practice without a coherent curriculum, reliable correction, progression integrity, or emotional safety.

Marzi closes the gap between knowing and doing:

- rehearse realistic conversations before they matter;
- understand the current exchange without leaving the call;
- speak in the learner’s own words;
- receive correction without having the learner’s words rewritten;
- control how much help is visible;
- see growth based on meaningful learning rather than navigation or farming.

## 3. Marzi’s competitive advantage

Marzi’s advantage is the integration of:

- high-stakes and everyday scenario rehearsal;
- a chat-first live voice experience;
- explicit ownership of remote speech, learner speech, Marzi help, corrections, and system state;
- one canonical evolving companion;
- multilingual interface, target, and explanation architecture;
- assistance that adapts without pretending to be learner speech;
- trustworthy progress evidence and anti-farming rewards;
- installed-PWA immediacy and resilient local-first behavior;
- transparent limits, privacy, and failure states.

Marzi should compete through coherent identity, learning usefulness, conversational quality, trust, speed, and care—not through copied feature count.

## 4. Target users

Primary users include:

- adults and older learners preparing for relocation, healthcare, government services, school, work, travel, certification, social confidence, or daily life;
- beginners who need translation and full scaffolding;
- intermediate learners who need retrieval practice and selective hints;
- advanced learners who need lower assistance and more demanding scenarios;
- multilingual learners whose interface language and preferred correction language differ;
- users on modest Android devices, constrained networks, and installed PWA contexts;
- users with vision, hearing, speech, motor, cognitive, or learning-access needs.

Age range, child-directed positioning, supported markets, and any account eligibility are **LEGAL/PRIVACY REVIEW REQUIRED** before public release.

## 5. Learning principles

- Conversation practice serves explicit competencies and scenario objectives.
- Participation, completion, mastery, XP, and currency are different concepts.
- XP is motivation, not proof of mastery.
- Mastery requires sufficient evidence; “not enough evidence” is a valid result.
- Difficulty adapts from evidence, not solely a self-declared CEFR level.
- Retrieval and learner-generated speech are more valuable than copying a full answer.
- Translation and help scaffold learning but should be reducible as confidence grows.
- Feedback preserves the learner’s exact recognized utterance alongside any corrected form.
- Correction is concise, actionable, kind, and appropriate to the configured explanation language.
- Pronunciation claims require valid acoustic evidence and calibrated uncertainty.
- Review and recommendations should target weak or decaying competencies, not merely repeat popular scenarios.

The competency taxonomy, mastery model, completion semantics, and placement policy are **PRODUCT OWNER DECISION REQUIRED** with learning-specialist approval before reward redesign.

## 6. Conversation principles

- The conversation itself is the primary product surface.
- The learner always knows who said what and what the system is doing.
- Calls should remain useful during listening, thinking, speaking, retry, offline, limit, and persistent-error states.
- Recent dialogue, translations, recognized speech, corrections, and help belong in one coherent call experience.
- The learner is never credited with a suggestion they did not say.
- Provider latency must not erase the latest utterance or freeze the interface.
- ConversationSession remains the canonical ordered-utterance owner until an explicitly approved architecture package migrates that ownership with parity evidence.
- PromptBuilder and provider abstractions remain isolated from presentation.
- Cancellation, late responses, duplicate events, retry, and Back/navigation behavior must be deterministic.

The default microphone rhythm—tap-to-speak versus optional auto-listen—is **PRODUCT OWNER DECISION REQUIRED** under MARZI-D013.

## 7. Canonical Marzi identity

There is one Marzi: a warm frog companion whose visual DNA follows the approved direction in 01_home.png and 04_progress.png. The same character must be recognizable across:

- launcher/PWA icon and splash;
- header and onboarding;
- six evolution stages;
- Learn, Profile, progress, Store, rewards;
- call companion;
- offline, error, limit, encouragement, and success.

No second frog design, generic emoji, developer-invented SVG reinterpretation, CSS-fabricated final art, or screenshot crop may represent production Marzi.

The references establish direction, not reusable production files. A rights-cleared canonical production set is **ASSET REQUIRED** and its final selection is **PRODUCT OWNER DECISION REQUIRED**.

## 8. Character and asset rules

- Source references, production assets, placeholders, and missing assets are tracked as different states.
- Concept boards and screenshots are never cropped into production assets.
- Missing production art remains explicitly missing; implementation does not invent it.
- Every asset has a stable path, version, hash, dimensions, format, padding/framing contract, provenance, rights record, and approved fallback.
- Reusable artwork contains no embedded localized text.
- SVGs are validated against scripts, event handlers, foreignObject, external references, and unsafe runtime injection.
- Asset resolvers request only manifest-listed files and fail deterministically without broken speculative requests.
- Portraits preserve state during speaker changes and do not recreate nodes unnecessarily.
- Character identity, clothing, and accessibility labels are separate from decorative rendering.

Canonical art, launcher icon, evolution files, outfit strategy, upper-body portraits/backgrounds, and audio family are **ASSET REQUIRED**. Their detailed approval gates are MARZI-D001 through MARZI-D007.

## 9. Call-screen principles

The call is chat-first, not portrait-first.

At a 390×844 starting budget:

- header/status: approximately 8–12%;
- remote character: approximately 25–33%;
- conversation: approximately 38–47%;
- controls/status: approximately 18–22%.

At 360×640, decorative portrait height yields before readable conversation, controls, or safe-area clearance.

Requirements:

- show head, shoulders, roughly half the torso, clothing, and accessories where production assets permit;
- keep recent dialogue, translation, correction, and help visible in the primary surface;
- use a single clear red danger action for hang-up;
- provide microphone/tap-to-speak, replay, transcript/history, and AI Help controls with consistent hierarchy;
- eliminate duplicate or ambiguous microphone actions;
- preserve timer, connection, remaining-minute, listening/thinking/speaking/error state, and safe areas;
- one component owns top inset and one owns bottom inset;
- background content cannot scroll or receive interaction under a modal layer;
- controls meet accessible target requirements;
- the experience works in browser-tab and installed standalone contexts.

An optional full-history view may remain, but it cannot be the only place to understand the current exchange.

## 10. Translation and correction rules

- Target-language source text remains canonical and visible.
- Inline translation is associated with its source message and does not require a second AI request merely to show/hide it.
- The configured correction/explanation language—not an inferred browser translation—governs translation and correction UI.
- Proper names and scenario identities remain protected.
- Recognized learner speech is immutable transcript evidence.
- A correction is a separate annotation containing the proposed form, concise explanation, and optional translation.
- Correction never overwrites, retroactively edits, or impersonates the learner.
- Replay uses the correct source text/voice and cannot alter transcript ownership.
- Word interaction must preserve natural paragraph flow; 48×48 per-word boxes must not scatter sentences into isolated columns.
- Browser translation interference should be reduced through correct language metadata and eligible no-translate boundaries, without blocking user accessibility tools globally.

Translation defaults by learner level are **PRODUCT OWNER DECISION REQUIRED** under MARZI-D012.

## 11. Assistance modes

The learner controls assistance inside the call:

- OFF: no suggested response;
- HINT: intent, keywords, sentence opening, grammar cue, or short phrase;
- FULL: a complete target-language suggestion plus explanation-language translation.

Assistance:

- is immediately reachable and reversible;
- has an announced visible state;
- does not make a duplicate AI request merely when toggled;
- never enters the transcript as learner speech;
- never leaves a blank reserved region when hidden;
- preserves conversation scroll position;
- is explicitly labelled as Marzi help;
- supports RTL and all required viewports;
- is recorded as learning-analysis evidence only through an approved privacy/economy contract.

The default mode and persistence scope are **PRODUCT OWNER DECISION REQUIRED** under MARZI-D011. The recommended direction is a level-sensitive initial default plus a persistent explicit user override.

## 12. Transcript ownership

- ConversationSession owns the canonical ordered utterance history.
- An utterance has a stable ID, speaker/owner, source language, exact text, timestamp/order, and delivery state.
- Translation, correction, pronunciation, assistance-use, replay, and evaluation are annotations or derived views; they do not replace the utterance.
- UI state, provider payloads, DOM nodes, and storage caches are not parallel transcript authorities.
- The primary call surface renders a recent window from the same transcript.
- Full history renders the same canonical data with scroll restoration and accessible dismissal.
- Opening history may create browser History state; Android Back closes it first and returns focus while keeping the call active.
- The next Back action follows the separately documented call-navigation contract.
- Late/cancelled provider output cannot append into a closed or different session.

Any migration of transcript representation is **TECHNICAL DISCOVERY REQUIRED** and must preserve IDs, order, exact learner speech, old stored data, and provider/prompt behavior.

## 13. XP and reward principles

- Rewards represent meaningful learning evidence, not opening a screen, starting a call, immediate hang-up, inactivity, retry, or farming.
- Reward calculation consumes immutable session/learning evidence after the conversation; it does not own transcript state.
- The reward ledger remains idempotent.
- Participation, completion, first-attempt success, correctness, difficulty, pronunciation, and streak may influence rewards only after each signal is valid and explicitly approved.
- Reward results explain why value was or was not earned.
- Learners are not punished because accessibility support, assistance technology, connectivity, or a speech disability changes interaction speed.
- Existing six-stage thresholds, formulas, 20 coins per call, Store prices, minute-pack prices, and buyPack remain frozen until an approved economy package changes them.

XP eligibility, completion evidence, numeric formula, coin emission, streak weighting, and pronunciation use are **PRODUCT OWNER DECISION REQUIRED**. Economy simulation and migration impact are mandatory before approval.

## 14. Anti-farming principles

- Immediate hang-up, inactivity, repeated restart abuse, duplicate completion, replay-only activity, and fabricated client events do not create learning rewards.
- Attempt IDs, reward IDs, and ledger claims are stable and idempotent.
- Protection is deterministic, testable, auditable, and accompanied by reason codes.
- Repeated legitimate practice remains useful; any diminishing reward must be transparent and approved.
- Hidden punitive heuristics, accusations, irreversible deletion, and accessibility-hostile timing rules are forbidden.
- Offline retries and provider errors cannot double-award or erase legitimate earned value.

Minimum meaningful call, repeat policy, caps, diminishing returns, and server/client authority are **PRODUCT OWNER DECISION REQUIRED** under MARZI-D015–D018. Sensitive anti-abuse telemetry is **LEGAL/PRIVACY REVIEW REQUIRED**.

## 15. Store and outfit principles

- Store ownership, equipped state, stage restrictions, prices, and purchase effects have one canonical owner.
- A purchase is never presented as successful unless value was actually and idempotently exchanged.
- Equipped clothing is clearly visible in Store preview and, where compatible approved assets exist, calls, Profile, progress/evolution, and post-call rewards.
- Clothing and accessories are visual only during calls and are not interactive there.
- Missing outfit art uses an honest deterministic fallback; it is never fabricated.
- Outfit compatibility must account for changing evolution anatomy.
- Ownership/equipped state is conveyed textually as well as visually.
- Premium and Store currency are not fake wallets or duplicate balance authorities.

The layered/composite asset strategy is **PRODUCT OWNER DECISION REQUIRED** and **ASSET REQUIRED** under MARZI-D005. Monetization is **COMMERCIAL DECISION REQUIRED** under MARZI-D020.

## 16. Audio identity

Marzi needs a restrained, coherent sound family for:

- phone connection;
- hang-up;
- gentle control confirmation;
- learning success;
- XP/reward;
- evolution celebration;
- outfit purchase;
- recoverable error where sound adds clarity.

Rules:

- voice and learning content remain primary;
- feedback is subtle, short, consistent, and never essential by itself;
- respect user mute/sound preferences and platform interruption;
- avoid overlapping TTS, recognition, connection, and effects;
- compressed assets meet performance budgets and have documented rights;
- spoken clips require localization; prefer non-verbal cues where meaning is universal;
- reduced motion does not imply forced silence, but users control non-essential sound.

The sonic palette, production source, licensing, and mute default are **PRODUCT OWNER DECISION REQUIRED** and **ASSET REQUIRED**.

## 17. Motion principles

- Motion explains state, continuity, hierarchy, and success; it does not decorate every action.
- Interactions never wait on an animation.
- Reduced motion disables non-essential movement and preserves understandable state.
- No flashing, excessive parallax, motion-triggered nausea, or animation-only meaning.
- Entry/exit transitions preserve focus and do not recreate stateful nodes.
- Character emotion/state animations use approved assets, do not simulate missing final art, and remain bounded by battery/repaint budgets.
- Celebration intensity is proportional and interruptible.

Exact motion tokens and character animation assets remain **ASSET REQUIRED** where current placeholders cannot meet the approved design.

## 18. Accessibility principles

Accessibility is a product requirement, not release cleanup.

- Complete keyboard, switch, touch, TalkBack, and screen-reader operation.
- Logical focus order, visible focus, modal containment, dismissal, and restoration.
- Semantic roles, names, descriptions, values, states, and appropriately restrained announcements.
- Interactive controls at least 48×48 CSS pixels, except an explicitly designed accessible inline-text interaction that preserves natural reading.
- Increased system font, 200% zoom where applicable, long localized strings, orientation, and small screens remain usable.
- Color, animation, audio, position, and artwork are never the only carriers of meaning.
- Reduced motion and non-audio alternatives.
- RTL preserves meaning and reading order; telephone/hang-up semantics are not incorrectly mirrored.
- Speech, pronunciation, and timing-based learning paths have equitable alternatives.
- Accessibility evidence includes automated inspection and real-device/manual validation.

Any exception requires accessibility-owner and Product Owner approval with compensating controls.

## 19. Localization and multi-language architecture

Marzi separates three language axes:

1. interface/native language;
2. target learning language;
3. correction/explanation language.

The initial correction language may default from the interface language only if explicitly approved; users can understand and change the relationship.

Requirements:

- target capability registry, not German-only branching;
- correct lang and dir metadata for every mixed-language region;
- Arabic RTL, logical layout, reading order, punctuation/numerals, and control meaning;
- centralized keys, parity checks, pluralization, long-string tests, missing-key failure behavior;
- scenario identities and proper names preserved;
- art and icons contain no reusable embedded localized claims;
- prompts receive explicit language parameters through PromptBuilder;
- each production target language has validated scenarios, voice/STT/provider capability, translation quality, learning content, and support.

The exact defaults are **PRODUCT OWNER DECISION REQUIRED** under MARZI-D010. The public target-language rollout is **PRODUCT OWNER DECISION REQUIRED** under MARZI-D023.

## 20. Privacy and trust principles

- Explain why microphone, notification, account, analytics, or payment access is requested before asking.
- Tap-to-speak is the recommended privacy-safe default until MARZI-D013 is approved.
- Provider keys remain server-side and provider boundaries remain isolated.
- Do not retain raw audio by default.
- Do not collect raw transcripts, corrections, prompts, or speech for analytics by default.
- Collect only purpose-limited data with an approved legal basis/consent, retention, deletion, export, security, and incident plan.
- Never fake Premium, payment success, restored purchases, connectivity, progress, or pronunciation certainty.
- Offline, exhausted minutes, provider failure, storage failure, and unsupported speech are distinct and honest.
- Local data is validated, versioned, recoverable, and protected from silent corruption.
- Account/cloud sync is a separate product/privacy architecture, not an incidental UI addition.

Analytics, cloud sync, retention, deletion, age/market obligations, and pronunciation data are **LEGAL/PRIVACY REVIEW REQUIRED**.

## 21. Performance targets

Targets must be baselined and measured on representative Android hardware and networks before implementation values become release gates.

Product targets:

- every tap receives visible state feedback within 100 ms;
- non-network navigation remains responsive at small-device CPU/memory constraints;
- show listening/processing state immediately;
- minimize speech-end to first useful response;
- stream first safe text and begin TTS at a verified sentence boundary where provider contracts allow;
- cancel stale STT/LLM/TTS work when a session or turn ends;
- avoid layout thrash, unnecessary node recreation, leaking listeners, speculative missing-asset requests, and eager loading of noncritical media;
- keep installed-PWA startup, update, offline shell, and cache behavior measurable and recoverable;
- define budgets for bundle bytes, images/audio, memory, long tasks, call latency percentiles, and error rates.

Specific latency percentiles, device tiers, network profiles, and asset byte budgets are **TECHNICAL DISCOVERY REQUIRED** before MARZI-045 and MARZI-053.

## 22. PWA behavior

- Browser-tab and installed standalone modes are both first-class and honestly different.
- Browser chrome is platform-owned; the app does not fake removal.
- Installation uses the canonical language-neutral Marzi identity.
- One manifest/icon authority and one versioned service-worker update policy.
- Install, update, offline, cache migration, stale-client, and rollback paths are tested on real Android devices.
- New static runtime assets are versioned and covered without caching provider/API responses improperly.
- Installed-icon replacement limitations and user steps are documented.
- Pull-to-refresh interference is prevented only within an explicit scroll-ownership strategy; native navigation/accessibility is preserved.
- Staging and production registrations/caches cannot be confused.

Launcher assets are **ASSET REQUIRED**. Supported release platforms and distribution sequence are **COMMERCIAL DECISION REQUIRED** under MARZI-D025.

## 23. Quality bar

A Marzi feature is complete only when:

- it solves the approved user problem without scope invention;
- ownership and dependency direction are clear;
- product, runtime, documentation, and asset truth agree;
- success, failure, empty, loading, offline, retry, Back, reload, and rollback paths work;
- every corrected defect has a behavior-level regression test;
- browser claims use rendered measurements and platform claims use real devices;
- accessibility, RTL, long text, reduced motion, increased font, and small screens pass;
- security/privacy and data migrations are reviewed;
- performance budgets pass;
- implementation report is accurate about omissions and unverified claims;
- independent review approves the exact commit;
- staging validates the exact reviewed artifact before merge/release.

World-class means coherent, useful, fast, trustworthy, inclusive, and maintainable—not merely visually polished.

## 24. Non-negotiable frozen contracts

Until an explicitly approved package changes a named contract:

- ConversationSession remains the canonical conversation/session authority.
- createTranscript ownership and ordered utterance semantics remain stable.
- Provider registry, AIProvider, SpeechProvider, and VoiceProvider abstractions remain isolated.
- PromptBuilder, system prompt, and role-play prompt are unchanged except through an approved learning/conversation package with parity evidence.
- Backend API interfaces are unchanged.
- Reward ledger and reward idempotency remain intact.
- Learner rank and Marzi evolution remain separate axes.
- Six Marzi XP thresholds remain exactly 0, 150, 400, 800, 1500, 2600.
- Existing XP formula and reward values remain unchanged until an economy decision is approved.
- Existing 20 coins per completed-call path remains frozen until MARZI-D014–D018 are approved and migrated.
- Outfit and minute-pack prices remain unchanged.
- buyPack remains unchanged.
- Minutes remain the canonical usage unit; 10 MB = 1 minute is presentation only.
- No second wallet or persisted balance is added.
- Existing storage schemas remain readable; no silent destructive reset.
- Scenario and character identities remain unchanged.
- isPremium() remains false and Premium remains presentation-only until real entitlement architecture is approved.
- No fake payment or entitlement activation.
- No production art is fabricated or cropped from a board.

A frozen contract is not permanent by accident. It changes only through an explicit Product Owner decision, versioned specification, migration/rollback plan, tests, independent review, and staging evidence.

## 25. Explicitly unresolved decisions

The detailed options, recommendations, owners, deadlines, and blocked packages are in docs/MARZI_DECISION_REGISTER.md.

- Canonical Marzi artwork — **PRODUCT OWNER DECISION REQUIRED** and **ASSET REQUIRED**.
- Launcher icon composition and icon family — **PRODUCT OWNER DECISION REQUIRED** and **ASSET REQUIRED**.
- Six matched evolution assets — **PRODUCT OWNER DECISION REQUIRED** and **ASSET REQUIRED**.
- Stage 5/6 props and styling — **PRODUCT OWNER DECISION REQUIRED**.
- Outfit layered/composite/hybrid strategy — **PRODUCT OWNER DECISION REQUIRED** and **ASSET REQUIRED**.
- Upper-body call portrait/background strategy — **PRODUCT OWNER DECISION REQUIRED** and **ASSET REQUIRED**.
- Audio identity, licensing, and production source — **PRODUCT OWNER DECISION REQUIRED** and **ASSET REQUIRED**.
- Onboarding required-step count and deferral — **PRODUCT OWNER DECISION REQUIRED**.
- Placement policy and modalities — **PRODUCT OWNER DECISION REQUIRED**.
- Interface versus correction-language default — **PRODUCT OWNER DECISION REQUIRED**.
- Assistance default/persistence — **PRODUCT OWNER DECISION REQUIRED**.
- Translation defaults by level — **PRODUCT OWNER DECISION REQUIRED**.
- Tap-to-speak versus auto-listen default — **PRODUCT OWNER DECISION REQUIRED**.
- XP eligibility — **PRODUCT OWNER DECISION REQUIRED**.
- Minimum meaningful call — **PRODUCT OWNER DECISION REQUIRED**.
- Conversation/scenario completion definition — **PRODUCT OWNER DECISION REQUIRED**.
- XP, coin, streak, difficulty, and pronunciation weighting — **PRODUCT OWNER DECISION REQUIRED**.
- Anti-farming policy and repeat treatment — **PRODUCT OWNER DECISION REQUIRED**.
- Pronunciation scoring and reward use — **PRODUCT OWNER DECISION REQUIRED** and **LEGAL/PRIVACY REVIEW REQUIRED**.
- Premium/monetization/payment model — **COMMERCIAL DECISION REQUIRED**.
- Analytics events and consent — **LEGAL/PRIVACY REVIEW REQUIRED**.
- Cloud synchronization/account model — **PRODUCT OWNER DECISION REQUIRED** and **LEGAL/PRIVACY REVIEW REQUIRED**.
- Supported target-language rollout — **PRODUCT OWNER DECISION REQUIRED**.
- Retention, export, and deletion — **LEGAL/PRIVACY REVIEW REQUIRED**.
- Beta/public platforms and distribution — **COMMERCIAL DECISION REQUIRED**.
- Runtime modularization boundary and compatibility approach — **TECHNICAL DISCOVERY REQUIRED**.
- Quantified device/network performance budgets — **TECHNICAL DISCOVERY REQUIRED**.

Nothing in this section is approved merely because a recommendation exists. Work stops at the package deadline until the named owner records a decision.
