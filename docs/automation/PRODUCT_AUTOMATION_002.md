# PRODUCT-AUTOMATION-002 — MARZI-013 … MARZI-016

Sequential product queue. **One package at a time · one commit per package ·
full suite + Chromium (390×844 and 360×640) after each · stop on failure or
ambiguity · placeholders allowed for missing approved artwork · never merge ·
never deploy.**

State: `docs/automation/product-queue-state.json`. Resume from the first
package whose status is not `done`. **No package may be substituted, renamed,
reinterpreted or derived.**

Standing exclusions: server, prompts, providers, ConversationSession, XP rates,
coin rates, the six XP thresholds, existing package prices, `buyPack`, wallet
transaction integrity, reward-ledger semantics.

## MARZI-013 — Marzi States & Emotions
Canonical presentation states: `neutral · happy · listening · thinking ·
speaking · sad · error · celebrating`.
- Deterministic mapping from existing conversation and reward states.
- Current artwork remains the fallback; asset paths prepared for future
  approved production files; **no invented artwork**.
- Preserve ConversationSession, providers, prompts, XP, rewards, economy.
- Accessibility and reduced-motion support. Test every state and fallback.

## MARZI-014 — Premium + Internet/Minutes
Product flow from `docs/design/concept-boards/02_call.png`.
- Remaining daily call time; internet/MB presentation; out-of-time full-screen
  state; current coin package purchases; monthly Premium $4.99; annual Premium
  $39.99; "Save 33%"; board benefits; free and Premium states.
- No real payment processing; no changes to package prices or coin transaction
  integrity; no backend subscription service.

**Approved decisions.** Premium is **presentation only**: plans render as
approved, the purchase action states clearly that Premium is not yet
available, nothing is unlocked, and there is **no user-facing activation
switch** (a test-only hook verifies the visual state). **MB is a presentation
of the existing minutes allowance at the board ratio 10 MB = 1 minute**, from
one canonical underlying value — not a second consumable.

## MARZI-015 — Profile & Progress
Current Marzi stage + localized description; learner rank shown separately;
XP and next-stage progress; coin balance; completed calls; speaking time;
mistakes reviewed; current streak; owned and equipped outfits; achievements
**based only on verified existing data**; settings and accessibility controls.
**No fabricated statistics.**

## MARZI-016 — Map / Learning Journey
Visual learning map over **existing scenarios only**; completed, available,
recommended and future node states; current learner position; one clear
recommended next action; existing stage/XP progression only; accessible list
alternative; Map lives **inside Learn**; navigation unchanged; no new
characters, scenarios or simulated persistent town.
