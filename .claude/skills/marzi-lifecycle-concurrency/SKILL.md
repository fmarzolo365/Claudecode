---
name: marzi-lifecycle-concurrency
description: Async lifecycle and concurrency analysis for ASR, TTS, timers and call sessions. Use for any finding involving races, stale callbacks or overlapping operations.
---

# MARZI Lifecycle & Concurrency

WHEN TO USE
Any async flow: recognition, TTS, timers, provider calls, session switches.

AUTHORITATIVE QUESTIONS
- What identity exists BEFORE the first await? Who captures it?
- Can two same-session operations both pass the entry guard before either marks active?
  (mutual exclusion needs a pending-operation token, not only a post-hoc state flag)
- Who synchronously owns teardown at every lifecycle boundary (end, restart, replace)?
- For every continuation (then/catch/finally/callback/timer): what proves it still owns
  the live lifecycle? Is stale state also CLEANED, not merely ignored?
- What happens to the orphan resource (recognizer, audio, timer) itself?

FAILURE MODES
- Ownership captured after an await; reentrancy starting two resources; stale catch/finally;
  cleanup delegated to a callback that ignores stale events; S-flags diverging from real
  resource state; timers surviving replacement.

MANDATORY PROOFS
- A test ordering two overlapping starts; a test resolving/rejecting a pending permission
  after replacement; a test firing captured callbacks after replacement; teardown leaves
  flags AND resources coherent synchronously.

INVALID PROOFS
- "The guard exists in source"; happy-path single-operation tests; boots-without-error.

STOP CONDITIONS
- The lifecycle has no identity to capture; exclusion requires a product decision.