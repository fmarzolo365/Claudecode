# MARZI-018-R2 Independent Engineering Review

## 1. Executive verdict

MARZI-018-R2 is not ready to merge into **main**.

The review independently confirmed:

- correct Git ancestry and branch synchronization;
- the native **window.history** correction;
- transcript-first Back behavior;
- portrait success and deterministic fallback behavior;
- all six earned Marzi stages;
- state-resolver behavior;
- zero-inset responsive fit;
- Spanish and Arabic RTL direction;
- reduced-motion behavior;
- the top-bar breakpoint;
- service-worker delivery behavior;
- preservation of frozen business and architecture contracts.

Release readiness nevertheless fails because five High-severity application defects remain:

1. Stages 1–3 still do not fully satisfy the canonical Marzi visual-presence contract.
2. **#vcSay** presents a nonfunctional action.
3. Modal focus, naming, and background isolation are incomplete.
4. Safe-area insets still have duplicate ownership and cause layout collision when non-zero.
5. Some transcript controls fail the required 48×48 target size and keyboard semantics.

Additionally, required validation in installed Android Chrome with real device safe areas remains unverified.

There are no Critical findings.

---

## 2. Review scope and Git integrity

### Repository state

| Check | Result |
|---|---|
| Repository | **fmarzolo365/Claudecode** |
| Branch | **claude/marzi-017-product-refinement** |
| Expected tip | **94ea642** |
| Actual tip | **94ea642968eb9dbd9bb13d70be7b3aba2daad191** |
| Base main | **7395cd0a75fc206077e19ecc60e4c1e978dd2c89** |
| Working tree | Clean |
| Local/origin synchronization | 0 commits ahead, 0 commits behind |
| Merge base | Exactly **7395cd0** |
| Merge commits between main and HEAD | None |
| Main changed | No |
| Unmerged paths | None |

### Commit ancestry

The six MARZI-018 commits exist in the required linear order:

~~~text
0a2efd5
8998df1
cf474c4
84ad6ce
93aadda
94ea642
~~~

Two earlier branch commits appear between **main** and the MARZI-018 package:

~~~text
53929a5
846b909
~~~

All six original MARZI-018 commit objects remain present and ordered, which confirms that the reviewed commits were not squashed or rebased out of the final history.

Whether a remote force-push occurred at any earlier time cannot be proven from the current Git graph without provider-side reflog or audit records. There is no evidence of one in the final repository state.

### Files changed from 7395cd0..94ea642

~~~text
docs/DECISIONS.md
docs/DESIGN_SYSTEM.md
docs/IMPLEMENTATION_REPORT.md
docs/design/MARZI_ASSET_SPEC.md
docs/design/MARZI_ASSET_DELIVERY_CHECKLIST.md
docs/design/concept-boards/05_call_limits_premium.jpg
docs/design/concept-boards/05_call_limits_premium.md
docs/design/concept-boards/README.md
public/index.html
public/manifest.webmanifest
public/sw.js
test/run.js
~~~

Some of these files came from the two pre-MARZI-018 branch commits.

### Files changed by the six-commit MARZI-018 package

Measured from its immediate parent, **846b909**, the package changed only:

~~~text
docs/IMPLEMENTATION_REPORT.md
docs/design/concept-boards/05_call_limits_premium.jpg
docs/design/concept-boards/05_call_limits_premium.md
docs/design/concept-boards/README.md
public/index.html
public/sw.js
test/run.js
~~~

No server file, backend API, provider implementation, package file, dependency file, storage configuration, or deployment configuration was changed by these six commits.

### Files changed per commit

#### 0a2efd5

- Added **docs/design/concept-boards/05_call_limits_premium.jpg**
- Updated **test/run.js**

#### 8998df1

- Updated **public/index.html**
- Updated **test/run.js**

#### cf474c4

- Updated **public/index.html**
- Updated **test/run.js**

#### 84ad6ce

- Updated **docs/IMPLEMENTATION_REPORT.md**
- Updated **public/index.html**
- Updated **public/sw.js**
- Updated **test/run.js**

#### 93aadda

- Updated **public/index.html**
- Updated **test/run.js**

#### 94ea642

- Updated **docs/IMPLEMENTATION_REPORT.md**
- Added or updated **docs/design/concept-boards/05_call_limits_premium.md**
- Updated **docs/design/concept-boards/README.md**
- Updated **public/index.html**
- Updated **test/run.js**

### Imported concept board

**docs/design/concept-boards/05_call_limits_premium.jpg** is a valid baseline JPEG.

| Property | Value |
|---|---:|
| Byte size | 280,761 bytes |
| Width | 709px |
| Height | 1067px |
| Components | Three-component color JPEG |
| Git blob | **4c39b0ed061e267aa80bd316013d7df8839fe2a9** |

The blob at **94ea642** is unchanged from the object introduced by the import commit.

---

## 3. Complete findings table

| ID | Severity | Classification | Affected file/location | Evidence | Rationale and user impact | Required correction |
|---|---|---|---|---|---|---|
| R2-APP-01 | High | Application defect | **docs/design/concept-boards/05_call_limits_premium.md:208–212**; **public/index.html:1258–1264** | The visual source of truth specifies Marzi at approximately 30% viewport width and 25% viewport height and states that Marzi must never be reduced to a badge or chip. The implementation continues to render stages 1–3 using circular badge treatment. At 360×640, the rendered art measured 37.3% width but only 21.0% height. Arabic stage 2’s complete container was only 23.6% high. At 390×844, the art measured 45.1% width and 20.9% height. Bubble connection improved, but visual-presence height and treatment remain inconsistent with the board. | Early-stage Marzi still reads as a circular interface token rather than the primary companion. The issue is particularly visible in Arabic stage 2. This undermines the intended composition even though stage selection itself is correct. | Make a presentation-only correction so the actual artwork—not merely the containing box—satisfies the canonical visual-presence target. Remove badge/chip treatment for stages 1–3, preserve the earned stage, and preserve the corrected connection to the suggestion bubble. Add rendered measurement tests for stages 1–3 at both required viewports in Spanish and Arabic. |
| R2-APP-02 | High | Application defect | **public/index.html:1676**; **public/index.html:6050–6054**; related parent action at **public/index.html:7225** | **#vcSay** is a native button and receives an accessible label equivalent to “listen to it said correctly.” It has no direct functional action. In real Chromium, clicking it produced zero calls to the voice path. Clicking the surrounding **#vcBubble** continued to activate the existing bubble behavior. | The control is focusable and announces an action to assistive technology, but activating it does not perform that action. This is a false affordance for keyboard, screen-reader, and touch users. | Connect **#vcSay** to the existing approved replay/pronunciation path without creating a second speech implementation. If the specification does not authorize a separate action, remove the misleading button semantics and label through product-approved clarification. Add mouse, touch-equivalent, Enter, and Space activation tests, plus a negative test proving that one activation cannot produce duplicate playback. |
| R2-APP-03 | High | Application defect | Dialog markup around **public/index.html:4514–4630**; focus helper at **public/index.html:6957–6979**; plan/Premium/offline creation at **public/index.html:6995–7031**; transcript handling at **public/index.html:7145–7184** | Initial focus, Escape dismissal, Back dismissal for transcript, and focus return work. However, modal focus is not contained and background content is not inert. From transcript, Shift+Tab escaped to **#playBtn**; from plan and Premium it escaped to **#jrFullBtn**; from offline it escaped to **#jrNext**. Plan, Premium, and offline dialogs expose modal semantics without an **aria-label** or **aria-labelledby**. | An asserted modal does not behave as a modal for keyboard users. Users can navigate into hidden background controls. Screen readers receive unnamed dialog landmarks for three overlay states. | Give every dialog an accessible name. Implement complete forward and reverse focus containment while the dialog is open. Make background content inert or otherwise unavailable to keyboard and assistive-technology interaction. Preserve existing initial focus, Escape dismissal, transcript History behavior, and focus return. Add tests for Tab, Shift+Tab, background exclusion, accessible names, and focus restoration. |
| R2-APP-04 | High | Application defect | Safe-area variables at **public/index.html:47–48**; call-mode container rules at **public/index.html:139–151**; **.callscreen** rules at **public/index.html:1157–1163** | Safe-area ownership is still duplicated. **.callscreen** consumes the top and bottom insets, while **.call-top** and **.call-stack** consume them again. With deterministic injected insets of 44px top and 34px bottom, outer and inner top padding each computed to 52px and outer and inner bottom padding each computed to 42px. Effective reservation became 104px top and 84px bottom. At 360×640, Marzi and the character bubble overlapped by approximately 3,031px². | The zero-inset layout looks correct, but devices with meaningful cutout or gesture insets can receive a compressed, colliding composition. The current implementation therefore does not satisfy the safe-area requirement. | Assign top and bottom safe-area consumption to exactly one layout owner per edge. Remove duplicate inset application. Retest identity, portrait, bubble, Marzi, timer, transcript controls, and call controls using non-zero top and bottom values. Confirm the correction on an actual Android device or accepted Android emulator afterward. |
| R2-APP-05 | High | Application defect | **.mini** sizing at **public/index.html:448–453**; interactive word creation at **public/index.html:5906–5912**; transcript replay and handlers at **public/index.html:6080–6092** | The transcript music replay button measured approximately 23.67×48 CSS pixels at both audited viewport sizes. The CSS supplies minimum height but not minimum width. Clickable **.w** word spans are rendered as spans, receive click behavior, but are not native controls, have no keyboard role or tab stop, and remain word-sized rather than 48×48 targets. | The mandatory 48×48 target contract is not met. Some transcript functionality is difficult to activate by touch and unavailable through normal keyboard navigation. | Make the replay target at least 48×48. Represent interactive words using semantic buttons or provide complete equivalent role, tab, keyboard, and state behavior. Give each interaction a 48×48 hit region without changing transcript ownership or conversation behavior. Add rendered size and keyboard activation tests. |
| R2-VER-01 | High | Unverified requirement | Required Android/browser acceptance matrix; limitation acknowledged at **docs/IMPLEMENTATION_REPORT.md:1391–1395** | The independent matrix ran in real desktop Chromium 151 in a clean top-level application context with mobile viewport and touch emulation. Non-zero insets were injected deterministically into that top-level app. Installed Android Chrome, standalone display mode, real cutout values, Android gesture navigation, and device accessibility services were unavailable. | Desktop Chromium establishes application behavior and exposes the duplicate-inset defect, but it cannot prove clearance from Android browser chrome or gesture areas. The review decision rule explicitly makes missing mandatory native verification release-blocking. | After resolving the application findings, execute the complete matrix in installed Android Chrome or an accepted Android emulator/device with real non-zero insets. Record the inset values, element positions, gesture clearance, Back sequence, language, motion, portrait mode, stage, target sizes, and error logs. |
| R2-TEST-01 | Medium | Test weakness | **test/run.js:1108**; MARZI-018 tests at **test/run.js:1810–2038**; browser-assertion claim at **docs/IMPLEMENTATION_REPORT.md:1379–1389** | The committed suite contains 51 tests, not 484 browser assertions. The R2 test change is a source regex adjustment from the earlier breakpoint value to 420px. Several tests search source text or use static stub DOM. The latest-utterance test manually applies busy state rather than observing a real asynchronous transition. The safe-area tests pass even though duplicate ownership remains at runtime. No committed browser runner or browser dependency exists. | The repository test suite can remain green while the High defects in this report are present. The reported temporary browser coverage cannot be reproduced or code-reviewed from the repository. | Add a reproducible rendered-browser suite covering History, successful asynchronous turns, modal focus, accessible names, non-zero safe areas, target measurement, all six stages, RTL, reduced motion, portrait success/failure, offline retry, and negative cases. Retain source checks only as supplementary structural guards. |
| R2-DOC-01 | Medium | Documentation defect | **docs/IMPLEMENTATION_REPORT.md:121–122**; **215–216**; **253–255**; **1335–1397** | Historical sections continue to state that a global **history()** helper is present, although **93aadda** renamed it. The report does not clearly record **94ea642**, the original incorrect Android Back assertion, and its correction. Lines 1359–1363 state that duplicate safe-area ownership was removed, which is contradicted by source and measurement. Lines 1354–1358 overstate overlay accessibility. The Android and unresolved-art limitations are accurate. | Reviewers receive contradictory implementation status and may approve safe-area or accessibility requirements that remain incomplete. | Reconcile the cumulative report. Explicitly record both remediation commits, the History defect, the prior inaccurate Back claim, and the corrected behavior. Mark safe-area ownership, modal containment, naming, target sizing, and real Android validation as unresolved. Separate committed tests from temporary audit-harness assertions. |
| R2-TEST-02 | Low | Test weakness | **test/run.js:2006–2038** | The new platform-global guard detects the original top-level **function history()** declaration and unqualified calls. It does not detect assignments such as **window.history = …**, **globalThis.history = …**, or **Object.defineProperty** collisions. Conversely, it can reject harmless top-level lexical declarations that do not overwrite platform-owned window properties. It does not execute native History methods. | The guard can create false confidence around some unsafe patterns and false positives for legitimate code. | Narrow the source-pattern rule to actual global-overwrite risks. Pair it with a rendered-browser regression test that confirms native **back**, **pushState**, and **replaceState** remain callable and that transcript navigation works. |
| R2-GIT-01 | Low | Quality defect outside the six MARZI-018 commits | **docs/DECISIONS.md:109** | **git diff --check** on the clean working tree passed. A separate **git diff --check origin/main..HEAD** found a new blank line at EOF in **docs/DECISIONS.md**, introduced by pre-MARZI-018 commit **53929a5**. | There is no runtime impact, but the complete base-to-tip range does not satisfy a strict whitespace-clean quality gate. | Remove the trailing blank line in a separately scoped documentation correction if base-to-tip whitespace cleanliness is required. Do not combine it silently with application remediation. |

---

## 4. Native History verification

The **93aadda** History correction works in a clean, top-level real Chromium context.

### Native API preservation

The following evaluated as functions:

~~~text
typeof window.history.back
typeof window.history.pushState
typeof window.history.replaceState
~~~

No top-level application declaration replaced **window.history**.

The legacy application helper was renamed and no longer collides with the platform-owned global. Relevant source is:

~~~text
public/index.html:5581–5590
~~~

### Transcript History sequence

Before opening the transcript:

- route hash: **#talk**
- history length: 3
- call visible
- conversation session active

After opening the transcript:

- history length: 4
- history state included **{marziSheet: true}**
- transcript visible
- focus moved to the transcript close control

After the first native Back action:

- transcript closed;
- route remained **#talk**;
- call remained visible;
- the same conversation session remained active;
- focus returned to the transcript opener;
- no History error occurred.

After the next Back action:

- navigation moved from **#talk** to **#learn**;
- this followed the existing route-navigation contract.

History handling is located at:

~~~text
public/index.html:7152–7169
~~~

No silent History API failure was observed.

### Regression-guard quality

The source guard catches the exact former collision, so it is useful as a narrow regression check. It is not sufficient by itself because it neither covers every form of global overwrite nor executes the native API. This limitation is recorded as R2-TEST-02.

---

## 5. Real-Chromium responsive matrix

### Environment

The independent runtime matrix used:

- Chrome for Testing 151.0.7922.34
- ARM64 Linux desktop Chromium
- a clean top-level application page
- mobile viewport dimensions
- touch emulation
- the real application server
- no iframe as the application execution context

This was real Chromium rendering and event behavior, but it was not installed Android Chrome.

### Matrix combinations

The primary matrix covered all 16 combinations of:

- 360×640 and 390×844
- Spanish and Arabic
- normal and reduced motion
- portrait success and portrait failure

### Results that passed in every applicable combination

- **documentElement.scrollWidth === innerWidth**
- **scrollX === 0**
- no horizontal overflow
- body scroll height remained at the viewport height
- no background page scrolling
- no duplicate IDs
- no page errors
- primary call controls remained reachable
- primary call buttons measured at least 48×48
- only hang-up used the red danger treatment
- Spanish resolved to LTR
- Arabic resolved to RTL
- portrait success displayed the portrait and hid the fallback
- portrait failure displayed one accessible fallback
- reduced motion removed non-essential thinking animation
- call state remained understandable without animation

### Portrait success

On successful portrait load:

- the portrait was displayed;
- **#vcEmoji** was hidden;
- fallback **aria-hidden** was true;
- fallback role and label were removed;
- no overlap occurred between portrait and fallback.

### Portrait failure

On portrait failure:

- the failed image was hidden;
- one fallback was displayed;
- fallback received **role="img"**;
- fallback label was derived from the active character;
- no duplicate announcement node appeared.

### Reduced motion

Normal motion produced the expected thinking animation, including the **mThink** animation.

With reduced motion enabled:

- animation name resolved to **none**;
- animation duration resolved to zero;
- no interaction depended on completing an animation;
- state remained understandable.

### RTL

Arabic produced:

~~~text
dir="rtl"
~~~

The audited layouts had no horizontal overflow and retained usable visible ordering. No meaning inversion of the hang-up control was observed.

A physical Android RTL session and screen-reader reading-order session were not available, so those device-level claims remain unverified.

---

## 6. Marzi stage measurements

All six earned stages selected correctly at their exact thresholds:

| XP | Expected stage | Result |
|---:|---:|---|
| 0 | 1 | Pass |
| 150 | 2 | Pass |
| 400 | 3 | Pass |
| 800 | 4 | Pass |
| 1500 | 5 | Pass |
| 2600 | 6 | Pass |

### 360×640 Spanish

Stages 1–3:

- complete container: approximately 134.39×160.58
- container width: 37.3% of viewport
- container height: 25.1% of viewport
- actual art: approximately 134.39×134.39
- actual art height: approximately 21.0% of viewport
- bubble-to-art edge gap: approximately 8.8px

The tail nearly bridges the gap, confirming that bubble connection improved.

### 360×640 Arabic

Stages 1 and 3:

- container height: approximately 25.1%
- art height: approximately 21.0%

Stage 2:

- container: approximately 134.39×150.98
- container height: approximately 23.6%
- art height: approximately 21.0%

Arabic stage 2 is the least compliant early-stage composition.

### 390×844 Spanish

Stages 1–3:

- complete container: approximately 176×202.19
- container width: 45.1% of viewport
- container height: approximately 24.0%
- actual art: approximately 176×176
- actual art height: approximately 20.9%
- bubble and art overlap/connection: approximately 20.2px

### Stages 4–6

Stages 4–6 remained selected correctly and retained their larger presentation:

- approximately 40.9% width/27.1% height at 360×640
- approximately 46% width/26.1% height at 390×844

### Conclusion

The earned-stage behavior is correct, and the suggestion connection is materially improved. APP-01 remains because the early-stage artwork still uses circular badge treatment and the actual character art remains around 21% of viewport height rather than the approximately 25% character-presence target.

---

## 7. Safe-area verification

### Source ownership

Safe-area values are defined at:

~~~text
public/index.html:47–48
~~~

The call layout applies safe-area values at multiple levels:

~~~text
public/index.html:139–151
public/index.html:1157–1163
~~~

The outer **.callscreen** consumes the insets while child top and bottom layout regions consume the same values again.

### Deterministic non-zero simulation

A deterministic style/environment override applied:

- top safe-area inset: 44px
- bottom safe-area inset: 34px

This affected the real top-level application in desktop Chromium.

### Exact 360×640 measurements

| Element/property | Measurement |
|---|---:|
| **.callscreen** top padding | 52px |
| **.call-top** top padding | 52px |
| Effective top reservation | 104px |
| **.callscreen** bottom padding | 42px |
| **.call-stack** bottom padding | 42px |
| Effective bottom reservation | 84px |
| **.call-top** bounds | y=52 to 157.19 |
| Main area bounds | y=157.19 to 392 |
| Stack bounds | y=392 to 598 |
| Timer bottom edge | y=556 |
| Hang-up bottom edge | y=528 |
| Character bubble bounds | y=185.36 to 239.80 |
| Marzi bounds | y=218.63 to 392 |
| Character-bubble/Marzi overlap | approximately 3,031px² |

The timer and controls remained inside the simulated viewport, but duplicate inset ownership compressed the central composition enough to produce a real visual overlap.

### Desktop simulation versus Android evidence

The deterministic result proves a defect in the application’s CSS calculation.

It does not prove:

- installed Android Chrome behavior;
- standalone/PWA viewport behavior;
- actual cutout values;
- Android gesture-zone clearance;
- browser UI collapse/expansion behavior.

Those requirements remain unverified under R2-VER-01.

---

## 8. Marzi state-resolver verification

The state and asset resolution implementation is concentrated at:

~~~text
public/index.html:3644–3657
public/index.html:3703–3742
~~~

Limit and offline use the resolver at:

~~~text
public/index.html:6905
public/index.html:7006
~~~

### Verified state mapping

| Application state | Visual resolver result |
|---|---|
| Ready | Neutral |
| Listening | Listening |
| Processing | Thinking |
| Speaking | Speaking |
| Encouraging | Happy/encouraging path |
| Limit | Intended resolver fallback |
| Offline | Intended resolver fallback |
| Persistent error | Canonical error path |

### Error fallback

**marziCallArt(stage, "error")** resolves through the canonical stage error asset/fallback path.

The lower-level pose helper defaults unsupported poses to ready, but the higher-level art resolver handles the canonical error state before that fallback is used. The rendered error result is therefore deterministic.

### Encouraging

The encouraging path maps the hint/encouragement state to the intended happy/encouraging visual state without modifying earned stage.

### Limit and offline

Limit and offline states use the intended call-art resolver paths and generate deterministic fallback art when production artwork is unavailable.

### Missing assets

The production art registry was empty during the test.

Observed behavior:

- no **/assets/marzi/** request was emitted;
- no missing-file request occurred;
- no broken image appeared;
- deterministic SVG fallback was used;
- no concept-board crop was used;
- no CSS-fabricated artwork was represented as final production art.

---

## 9. Latest-utterance asynchronous verification

The latest-utterance requirement was exercised with an actual delayed **/api/chat** response.

Before the learner turn:

- greeting utterance was visible;
- call state was ready.

Immediately after sending the learner turn:

- call entered processing;
- busy state was true;
- the previous character utterance remained visible.

During the artificial network delay:

- the same utterance remained visible after 450ms;
- it was not erased or replaced by an empty processing placeholder.

After the successful asynchronous response:

- the new character utterance replaced the old visible line;
- the transcript contained the completed turn;
- transcript ownership remained with the existing transcript implementation.

This confirms the runtime behavior.

The committed test at **test/run.js:1810–1837** does not independently prove this because it manually constructs busy/static DOM state rather than observing the asynchronous transition.

A first temporary audit probe failed after the transition because the probe invoked nonexistent **transcript.all()**. The corrected probe used the application’s actual **transcript.list()** interface and passed. The original failure was an audit-harness-only defect, not an application defect.

---

## 10. Controls and interaction verification

### Primary call controls

The following primary controls measured at least 48×48 CSS pixels:

- microphone
- speaker
- hang-up
- repeat
- free/help
- transcript opener
- transcript close
- offline Retry
- offline exit
- limit-to-plans
- plan-to-Premium
- overlay close controls

Representative measurements included:

- microphone: approximately 64×64
- hang-up: approximately 72×72
- playback/speaker: approximately 64×64
- secondary call controls: at least 48 in each dimension

### Danger styling

Only the hang-up control used the red danger background:

~~~text
rgb(201, 70, 56)
~~~

No peer control shared the same danger treatment.

### Failing transcript controls

The transcript music replay control measured approximately:

~~~text
23.67×48 CSS pixels
~~~

It therefore fails the minimum-width requirement.

Clickable **.w** transcript word spans also remain:

- non-native controls;
- absent from normal tab order;
- without button role;
- without Enter/Space handling;
- smaller than the required hit area.

These failures are recorded as R2-APP-05.

### #vcSay

**#vcSay** itself measured at least 48×48 and had button semantics.

Its defect is functional rather than dimensional:

- the label promises pronunciation playback;
- activation causes no voice call;
- no direct handler exists.

This is R2-APP-02.

---

## 11. Transcript and overlay accessibility

### Transcript sheet

Confirmed:

- dialog/sheet role exists;
- accessible name exists;
- focus moves to the close control;
- close control is accessible;
- Escape closes the sheet;
- native Back closes the sheet first;
- focus returns to the opener;
- call remains active;
- visible page scrolling remains locked.

Not confirmed or failed:

- focus is not contained;
- Shift+Tab escapes to **#playBtn**;
- background content is not inert;
- keyboard users can reach content outside the asserted modal.

### Plan overlay

Confirmed:

- opens from the minutes flow;
- close actions work;
- Escape works;
- focus initially moves inside;
- focus returns after close.

Failed:

- no accessible dialog name;
- focus escapes to **#jrFullBtn**;
- background remains keyboard-interactive.

### Premium overlay

Confirmed:

- presentation opens;
- close actions work;
- Escape works;
- focus returns;
- no entitlement is granted.

Failed:

- no accessible dialog name;
- focus escapes to **#jrFullBtn**;
- background remains keyboard-interactive.

### Offline overlay

Confirmed:

- visually and semantically distinct from exhausted minutes;
- Retry exists;
- exit exists;
- Retry reconnects when connectivity is restored;
- balance and plan state remain unchanged;
- focus initially moves inside;
- focus returns after dismissal.

Failed:

- no accessible dialog name;
- focus escapes to **#jrNext**;
- background remains keyboard-interactive.

### Color-only state communication

The principal states include text, labels, structure, or iconography and are not communicated solely through color. The red danger treatment remains exclusive to hang-up.

### Screen-reader limitation

DOM semantics and accessibility properties were inspected, but a real Android screen-reader session was unavailable. Device-level reading order remains unverified.

---

## 12. Limit, plans, Premium, and offline flow

### Canonical balance

Minutes remain the canonical stored unit.

The **10 MB = 1 minute** relationship remains presentation-only.

No second wallet or secondary persisted data balance was introduced.

### Exhausted minutes

The exhausted-minutes state remains distinct from offline.

It continues to route to the approved plan presentation rather than silently adding minutes.

### Plans

Existing packages and prices remain unchanged.

The existing **buyPack** implementation remains unchanged.

### Premium

Premium remains presentation-only:

~~~text
isPremium() === false
~~~

No fake Premium activation, fake payment success, or entitlement mutation was introduced.

### Offline Retry

The independent retry test confirmed:

- offline overlay opened;
- exhausted-minutes state did not open simultaneously;
- Retry was visible;
- reconnecting and activating Retry reopened the active call;
- stored stats were byte-for-byte unchanged;
- plan snapshot remained unchanged;
- Premium remained false.

---

## 13. Top-bar breakpoint matrix

Balances tested:

~~~text
0
9
99
999
9999
~~~

Widths tested:

~~~text
379
380
390
399
400
401
404
408
410
420
421
~~~

This produced 55 balance/width combinations.

### Measurements

The rightmost visible edge remained eight CSS pixels inside the viewport:

| Viewport width | Rightmost edge |
|---:|---:|
| 379 | 371 |
| 380 | 372 |
| 390 | 382 |
| 399 | 391 |
| 400 | 392 |
| 401 | 393 |
| 404 | 396 |
| 408 | 400 |
| 410 | 402 |
| 420 | 412 |
| 421 | 413 |

No tested combination produced:

- horizontal overflow;
- wrapping;
- overlap;
- clipped balances;
- degraded row structure.

The compact top-bar variant remains active through 420px and changes at 421px. No nearby-width regression was found.

---

## 14. Architecture assessment

### Separation of concerns

The MARZI-018 sequence modifies presentation and browser interaction without changing business logic.

No new reward, XP, storage, provider, prompt, wallet, or Premium state source was introduced.

### State ownership

The existing conversation and transcript owners remain unchanged.

Marzi stage continues to derive from earned XP rather than a new UI-owned stage field.

No duplicated stage source was added.

### Resolver architecture

The existing combination of:

- **marziCallPose**
- **marziCallArt**
- earned-stage derivation

is sufficient for current requirements.

Declining a separate **UI.callStage** abstraction was technically justified because a new field would risk duplicating earned-stage state.

### Global-name collision

The former **history()** collision has been removed.

No remaining top-level declaration was observed replacing the reviewed History API methods.

### Portrait node stability

The portrait success/failure path toggles existing portrait and fallback nodes rather than recreating the portrait subtree during ordinary state rendering.

The successful portrait retained its state, and fallback did not reappear after success.

### Asset resolution

The resolver checks the known asset registry and chooses deterministic fallback output when an asset is absent.

It did not issue requests for missing production artwork.

### Remaining architectural concern

Modal behavior is centralized enough to share initial and return-focus behavior, but the helper’s contract is incomplete because it does not own:

- accessible naming;
- focus containment;
- background inertness.

This is an incomplete shared presentation abstraction rather than a business-architecture violation.

---

## 15. Confirmed claims from the implementation reports

The following claims were independently confirmed:

- Native **window.history** is restored.
- Transcript opening creates a genuine browser History entry.
- Android-style Back sequencing closes transcript before leaving the call in Chromium’s native History model.
- The call remains active after transcript dismissal.
- The next Back follows the existing route contract.
- Successful portrait load hides the fallback.
- Portrait failure restores one accessible fallback.
- Marzi’s earned stage is preserved.
- Bubble connection for stages 1–3 improved.
- The latest character utterance remains visible during a real asynchronous processing transition.
- All six stage thresholds resolve correctly.
- Encouraging, error, limit, and offline resolver paths are deterministic.
- Missing artwork does not produce broken requests.
- The top-bar threshold avoids overflow for the tested balances and widths.
- Reduced-motion styling disables non-essential animation.
- Offline Retry does not alter balance.
- Premium remains presentation-only.
- The concept board is present.
- Production artwork remains unresolved and intentionally placeholder-based.
- The committed Node suite reports 51/51 passing.
- Real Android verification remains unavailable.

---

## 16. Disproved or partially true claims

### APP-01 fully corrected

Partially true.

The bubble connection is improved, and the early-stage art is wider. The actual art remains around 21% of viewport height and retains circular badge treatment, contrary to the canonical “not a badge or chip” direction.

### #vcSay fully corrected

Disproved.

It has improved button semantics and labeling but no functional action.

### Overlay accessibility fully corrected

Disproved.

Initial focus, dismissal, and focus return work. Focus containment, background exclusion, and accessible names for three dialogs do not.

### Duplicate safe-area ownership removed

Disproved.

The same inset remains applied by both the outer call container and inner top/bottom layout regions.

### Every interactive target is at least 48×48

Disproved.

The transcript music replay target is approximately 23.67×48. Interactive word spans also lack the required hit area and keyboard behavior.

### The 484 browser assertions establish release readiness

Not substantiated.

The asserted browser suite is not present in the repository, cannot be inspected or reproduced, and apparently did not expose the independently confirmed High defects.

---

## 17. Claims that could not be confirmed

The following remain unverified:

- installed Android Chrome behavior;
- standalone/PWA behavior with real device insets;
- actual Android cutout handling;
- actual Android gesture-area clearance;
- Android browser-toolbar effects;
- physical-device transcript Back behavior;
- Android screen-reader reading order;
- the contents and rigor of the reported 484 temporary browser assertions;
- the negative cases in that temporary harness;
- whether a remote force-push occurred historically.

The final graph confirms current ancestry but cannot establish provider-side historical operations.

---

## 18. Test execution and quality assessment

| Command | Result |
|---|---|
| **node --check server.js** | Passed |
| **node --check test/run.js** | Passed |
| **node test/conflict-markers.js** | Passed |
| **node test/run.js** | 51/51 passed |
| **git diff --check** | Passed for clean working tree |
| **git diff --check origin/main..HEAD** | One pre-MARZI-018 EOF whitespace issue |

All 51 Node checks executed; no skip was reported.

### Test characteristics

#### test/run.js:1810–1837

Tests latest-utterance presentation using manually constructed busy/static state.

It does not independently prove:

- an actual asynchronous turn;
- preservation during network delay;
- successful replacement after completion.

The runtime behavior passed independently, but the committed regression protection remains weak.

#### test/run.js:1841–1893

Primarily checks source strings and rule presence for:

- call chrome;
- safe-area variables;
- responsive rules.

These tests can pass while CSS ownership or rendered geometry is broken.

#### test/run.js:1896–1949

Contains useful resolver coverage and missing-registry negative cases.

This is one of the stronger MARZI-018 test sections.

#### test/run.js:1951–1966

Primarily checks source patterns for Marzi presence and anchoring.

It does not establish rendered size or composition.

#### test/run.js:1969–2003

Uses stub DOM and source matching for offline behavior.

It does not fully reproduce real navigation, persistence, or modal accessibility.

#### test/run.js:2006–2038

Implements a source-only platform-global collision guard.

It catches the original defect but does not execute native History behavior.

### R2 test delta

The material R2 change near **test/run.js:1108** adjusts the expected breakpoint from the previous value to 420px.

It is a source-pattern assertion, not a rendered top-bar measurement.

### Browser-suite availability

The repository contains no committed:

- Playwright harness;
- Puppeteer harness;
- equivalent browser-test dependency;
- 484-assertion browser report with executable source.

The 484 assertions therefore cannot be independently code-reviewed or rerun from this branch.

---

## 19. Frozen-contract verification

The MARZI-018 package preserved the frozen business and technical contracts.

### Exact or semantic comparison

| Frozen contract | Result |
|---|---|
| **ConversationSession** | Unchanged |
| Conversation ownership | Unchanged |
| **createTranscript** | Unchanged |
| Transcript ownership | Unchanged |
| Provider registry | Unchanged |
| AI provider abstraction | Unchanged |
| Speech provider abstraction | Unchanged |
| Voice provider abstraction | Unchanged |
| **PromptBuilder** | Unchanged |
| System prompt | Unchanged |
| Role-play prompt | Unchanged |
| **server.js** | Byte-identical |
| Backend API interfaces | Unchanged |
| Reward ledger | Unchanged |
| Reward idempotency | Unchanged |
| XP thresholds | Unchanged |
| XP formula | Unchanged |
| Coins per completed call | 20, unchanged |
| Outfit prices | Unchanged |
| Minute-pack prices | Unchanged |
| **buyPack** | Unchanged |
| MB/minute presentation | 10 MB = 1 minute, unchanged |
| Canonical balance | Minutes, unchanged |
| Storage schema | Unchanged |
| Storage normalization | Unchanged |
| Scenario identities | Unchanged |
| Character identities | Unchanged |
| Premium entitlement | Remains false |
| Additional wallet | None added |
| Additional persisted balance | None added |

### XP thresholds

The exact thresholds remain:

~~~text
0
150
400
800
1500
2600
~~~

### XP and call rewards

The call-reward behavior remains unchanged:

- XP formula remains the existing formula;
- successful call reward remains 20 coins;
- reward idempotency remains intact.

### Rank implementation caveat

**rankFor** is textually different from **main**, but that difference was introduced before the MARZI-018 package.

It is byte-identical between:

~~~text
846b909
94ea642
~~~

The MARZI-018 sequence did not change rank thresholds, XP calculation, or progression behavior.

### Premium

**isPremium()** remains false.

The Premium interface remains presentation-only and cannot activate entitlement or simulate payment success.

---

## 20. Service-worker assessment

The service worker moved from cache version v36 to v37 in **84ad6ce**.

### Justification

The original MARZI-018 runtime UI change justified invalidating the previous cache.

### Changed runtime content

The only later changed runtime document was **public/index.html**.

Documentation, tests, and concept-board files are not production static dependencies.

### Fetch behavior

The service worker uses network-first behavior for same-origin runtime requests while excluding API paths.

Consequences:

- an online navigation receives the corrected **index.html**;
- the corrected response replaces the runtime-cached response;
- **93aadda** and **94ea642** did not require an additional cache-name bump;
- an already open application page requires an ordinary reload to execute new JavaScript;
- offline clients that have never fetched the new version cannot receive it until online, which is expected.

No additional stale-cache defect was identified.

No unnecessary cache invalidation beyond the justified v36→v37 transition was found.

---

## 21. Documentation assessment

### Accurate documentation

The report accurately preserves these limitations and decisions:

- true Android/browser verification remains unavailable;
- production Marzi artwork remains unresolved;
- placeholder artwork is intentional;
- Premium remains presentation-only;
- the concept board is now present;
- real device safe-area evidence is missing.

### History documentation defects

Stale text at:

~~~text
docs/IMPLEMENTATION_REPORT.md:121–122
docs/IMPLEMENTATION_REPORT.md:215–216
docs/IMPLEMENTATION_REPORT.md:253–255
~~~

continues to describe the old global **history()** helper as present.

The current implementation no longer has that collision.

The report should explicitly record:

- the original global-name defect;
- the prior inaccurate Android Back claim;
- commit **93aadda**;
- native History restoration;
- the corrected Back result.

### R2 documentation defects

The R2 section at:

~~~text
docs/IMPLEMENTATION_REPORT.md:1335–1397
~~~

does not clearly and unambiguously document **94ea642** as the final R2 correction.

The safe-area claim at:

~~~text
docs/IMPLEMENTATION_REPORT.md:1359–1363
~~~

states that duplicate ownership was removed. Source inspection and non-zero measurement disprove that claim.

The overlay-accessibility claim at:

~~~text
docs/IMPLEMENTATION_REPORT.md:1354–1358
~~~

is only partially true because modal naming and focus containment remain incomplete.

The reported 484 assertions at:

~~~text
docs/IMPLEMENTATION_REPORT.md:1379–1389
~~~

are not connected to committed executable test code.

The Android limitation at:

~~~text
docs/IMPLEMENTATION_REPORT.md:1391–1395
~~~

is accurate.

The unresolved-art limitation at:

~~~text
docs/IMPLEMENTATION_REPORT.md:1396–1397
~~~

is also accurate and is not treated as an implementation defect.

---

## 22. Release recommendation and full readiness justification

### Conditions required for READY

The review contract permits READY only if:

- no Critical or High defect remains;
- all required native Chromium checks pass;
- transcript Back behavior passes using native History;
- all six stages pass;
- both viewports pass;
- Spanish and Arabic RTL pass;
- normal and reduced motion pass;
- portrait success and failure pass;
- non-zero safe areas pass;
- all interactive call targets pass;
- frozen contracts remain unchanged.

### Conditions currently satisfied

The branch satisfies:

- no Critical defect;
- native History preservation;
- transcript-first Back behavior;
- subsequent route navigation;
- call-session preservation after transcript close;
- all six earned stages;
- both desktop-emulated viewport sizes;
- Spanish and Arabic direction;
- normal and reduced-motion behavior;
- portrait success and failure;
- no zero-inset horizontal overflow;
- no duplicate IDs;
- no browser page errors;
- primary call-control sizing;
- exclusive red hang-up treatment;
- top-bar balance/breakpoint behavior;
- deterministic missing-art fallback;
- frozen business and technical contracts.

### Conditions currently failed

The branch fails:

- stages 1–3 canonical visual-presence treatment;
- functional **#vcSay** behavior;
- complete modal focus containment;
- accessible naming for plan, Premium, and offline;
- background interaction exclusion;
- single-owner safe-area calculation;
- non-zero safe-area composition;
- 48×48 sizing for every interactive target;
- semantic keyboard behavior for transcript word interactions.

### Conditions still materially unverified

The branch lacks mandatory evidence for:

- installed Android Chrome;
- real Android non-zero safe areas;
- Android gesture-zone clearance;
- standalone/PWA device layout;
- Android screen-reader behavior.

### Why READY WITH CONDITIONS does not apply

READY WITH CONDITIONS is allowed only when remaining issues are non-runtime, low-risk, and explicitly bounded.

The remaining issues include:

- real nonfunctional UI behavior;
- modal accessibility failures;
- touch-target failures;
- a measured non-zero-inset layout collision;
- missing mandatory native verification.

These are runtime and release-gate issues, not documentation-only conditions.

### Release recommendation

Do not merge or deploy **94ea642**.

The branch must receive another correction package and independent review.

---

## 23. Exact MARZI-018-R3 remediation instructions

Claude Code should prepare a narrowly scoped **MARZI-018-R3** correction package.

### R3-01 — Early-stage Marzi presentation

Objective:

- make stages 1–3 satisfy the approved Marzi visual-presence contract.

Required work:

- remove circular badge/chip treatment from stages 1–3;
- ensure the actual visible artwork—not only the outer container—meets the approved approximate height;
- preserve earned stage;
- preserve the corrected Marzi-to-suggestion-bubble connection;
- verify Spanish and Arabic at 360×640 and 390×844;
- do not alter stage thresholds, XP, artwork identities, or resolver ownership.

Acceptance evidence:

- rendered width and height for stages 1, 2, and 3 in all four viewport/language pairs;
- screenshots or equivalent rendered evidence;
- no overlap with identity, suggestion bubble, timer, or controls;
- no horizontal overflow.

### R3-02 — #vcSay behavior

Objective:

- make the existing announced control perform its approved action.

Required work:

- route **#vcSay** through the existing replay/pronunciation implementation;
- do not create a second voice provider or playback path;
- ensure one activation produces at most one playback;
- support click, Enter, and Space;
- retain an accurate accessible label.

Acceptance evidence:

- positive mouse/touch-equivalent activation test;
- positive Enter and Space tests;
- negative duplicate-playback test;
- confirmation that providers and prompts are unchanged.

### R3-03 — Modal accessibility

Objective:

- make transcript, plan, Premium, and offline overlays behave consistently with their asserted modal semantics.

Required work:

- add accessible names to plan, Premium, and offline;
- contain focus on both Tab and Shift+Tab;
- prevent keyboard and assistive-technology access to background content;
- preserve Escape dismissal;
- preserve transcript-native-Back behavior;
- preserve focus return;
- preserve the active call when transcript closes.

Acceptance evidence:

- accessible-name inspection for all four overlays;
- forward and reverse focus-cycle tests;
- test proving background controls cannot receive focus;
- Escape and close-control tests;
- transcript Back and focus-return tests.

### R3-04 — Transcript targets and semantics

Objective:

- satisfy the minimum target-size and keyboard-accessibility contracts.

Required work:

- make transcript music replay at least 48×48 CSS pixels;
- replace clickable word spans with semantic buttons or complete equivalent semantics;
- provide Enter and Space behavior;
- provide visible focus;
- retain existing word/help behavior;
- do not alter transcript ownership or stored transcript structure.

Acceptance evidence:

- rendered measurements for every interactive transcript target;
- tab-order verification;
- Enter and Space activation;
- no duplicate interaction;
- Spanish and Arabic verification at both viewports.

### R3-05 — Safe-area ownership

Objective:

- ensure each safe-area edge is consumed once.

Required work:

- select one top-inset owner and one bottom-inset owner;
- remove duplicate application from the other call containers;
- preserve zero-inset layout;
- test deterministic non-zero values of at least 44px top and 34px bottom;
- ensure identity, transcript, timer, Marzi, suggestion bubble, and controls remain reachable;
- ensure no character-bubble/Marzi collision;
- ensure the bottom controls remain clear of the gesture region.

Acceptance evidence:

- computed inset ownership;
- exact positions at 360×640 and 390×844;
- zero overlap;
- zero horizontal overflow;
- real Android or accepted emulator measurements with non-zero safe areas.

### R3-06 — Reproducible browser regression coverage

Objective:

- replace unverifiable temporary assertions with reviewable behavioral coverage.

Required work:

- provide a committed or otherwise fully reproducible rendered-browser runner;
- exercise native History methods;
- observe a successful asynchronous utterance transition;
- measure stages and touch targets;
- verify portrait success/failure;
- verify RTL and reduced motion;
- verify modal names, containment, dismissal, and return focus;
- verify non-zero safe areas;
- include negative cases;
- distinguish application failure from harness/environment failure.

Acceptance evidence:

- executable test source;
- documented invocation;
- complete pass/fail output;
- no source-regex assertion presented as rendered behavior.

### R3-07 — Documentation reconciliation

Objective:

- make **docs/IMPLEMENTATION_REPORT.md** accurately describe the final state.

Required work:

- record **93aadda** and **94ea642** explicitly;
- explain the former global History collision;
- correct the previous Android Back claim;
- state which R2 issues remained and which R3 changes resolved them;
- remove the inaccurate claim that safe-area duplication was already fixed;
- accurately report modal behavior;
- distinguish the 51 committed tests from any external browser assertions;
- retain unresolved production-art limitations;
- retain the real-Android limitation until device evidence exists.

Acceptance evidence:

- every implementation claim maps to source or reproducible test evidence;
- no contradictory historical statement remains;
- unresolved requirements are explicitly marked unresolved.

### Frozen files and behaviors

R3 must not modify:

- **ConversationSession**
- transcript ownership
- provider abstractions
- provider registry
- **PromptBuilder**
- prompts
- backend APIs
- reward ledger
- XP thresholds
- XP formula
- 20-coins-per-call rule
- prices
- **buyPack**
- storage schema
- scenario identities
- character identities
- Premium entitlement
- minutes as canonical balance

### Mandatory post-R3 verification

Run:

~~~text
node --check server.js
node --check test/run.js
node test/conflict-markers.js
node test/run.js
git diff --check
~~~

Then run the complete browser/device matrix:

- 360×640
- 390×844
- Spanish
- Arabic RTL
- normal motion
- reduced motion
- portrait success
- portrait failure
- stages 1–6
- non-zero top and bottom safe areas
- all interactive target measurements
- modal focus and background exclusion
- native transcript History sequence
- overflow, duplicate-ID, page-error, and scrolling checks

Do not merge until a new independent review confirms all High findings are closed and the installed-Android requirement has passed.

---

## 24. Exact next action

Do not merge or deploy **94ea642**.

Claude Code should implement the narrowly scoped **MARZI-018-R3** remediation above, provide reproducible browser-test evidence, and supply measured installed-Android results for:

- 360×640;
- 390×844;
- Spanish;
- Arabic RTL;
- normal motion;
- reduced motion;
- portrait success;
- portrait failure;
- all six stages;
- non-zero top and bottom safe areas;
- every interactive target;
- modal focus containment;
- transcript native Back behavior;
- page errors, duplicate IDs, and overflow.

After those corrections, request another independent review against the new exact commit tip.

## 25. Final verdict

NOT READY
