---
name: marzi-pwa-lifecycle
description: Service-worker lifecycle and cache-integrity analysis. Use for any sw.js or offline/caching change.
---

# MARZI PWA Lifecycle

WHEN TO USE
Any service-worker, cache, offline or update change.

AUTHORITATIVE QUESTIONS
- install: can one missing precache entry reject install? activate: are old caches cleaned?
- fetch: which statuses may update the cache (only full 200; never 206/404/500/opaque)?
- What keeps async cache work alive after respondWith resolves? (event.waitUntil or a
  response promise that includes the cache write - a detached promise is best-effort and
  a Node setTimeout test does NOT prove browser lifetime)
- cache.put rejection must not break delivery; offline fallback must survive; /api/ never
  cached; CACHE bump only when shell behavior changes, documented.

FAILURE MODES
- Cache poisoning by status; partial Range responses in Cache API; worker termination
  racing detached writes; stale shell lock-in; gratuitous version churn.

MANDATORY PROOFS
- Executing the real fetch handler against status/rejection matrices; cached-good +
  network-bad survival; explicit statement of event-lifetime mechanism and its limits.

INVALID PROOFS
- Node-process timing as browser-lifetime proof; source string checks.

STOP CONDITIONS
- Behavior requiring installed-PWA device verification: report I CANNOT CONFIRM.