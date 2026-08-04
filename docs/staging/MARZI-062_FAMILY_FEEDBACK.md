# MARZI-062 — Family feedback form and guide

This is a **blank** review form for the MARZI-062 family staging preview. Nothing
in it has been filled in, and nothing in it may be filled in speculatively.

Family review is **informal product feedback**. It is not specialist review, not
linguistic review, not accessibility approval, not legal or security review, and
not release or production approval. Those gates are separate and all of them are
still pending.

## Before you start

1. Open the staging URL your reviewer contact gave you. Do not use the
   production app for this.
2. Check the label at the very top of the screen. It must read:

   `MARZI STAGING PREVIEW · MARZI-062 · BUILD MARZI-062-PREVIEW-1`

3. **If you do not see that label**, you are looking at an older installed copy
   from your phone's cache. Fix it like this and say so in the form:
   - in the browser: pull down to refresh, or close and reopen the tab;
   - installed as an app: close it fully, reopen it, and wait a few seconds for
     it to update;
   - still wrong: uninstall the app from the home screen, reopen the staging URL
     in the browser, and install it again.
   - Report it under **Visual issue** as "old build label" and write which label
     you actually saw.
4. The launcher icon is deliberately **unchanged** in this preview. A different
   or missing icon is expected and is not worth reporting.

## Privacy — please read

**Do not write any personal data in this form.** Specifically, do not enter:

- names of any person, yours or anyone else's;
- email addresses, phone numbers, or postal addresses;
- health information about yourself or anyone else;
- voice recordings or audio files;
- passwords, PINs, or any credential;
- private conversation content;
- photographs of people.

Use a role instead of a name — "parent", "teenager", "grandparent", "friend".
Screenshots should show the app screen only.

The app collects nothing about this review. There is no analytics, no tracking,
no cookie, no upload, and no form submission anywhere in the preview. This
document is filled in and shared by hand, and only you decide what it contains.

## The form

Copy the block below once per issue. Leave a field blank rather than guessing.

~~~
Build ID:
Implementation commit ID:
Staging URL:
Device and browser:
Screen or flow tested:
Scenario tested:
Visual issue:
Usability issue:
Confusing wording:
Favorite element:
Missing element:
Severity:
Screenshot reference:
Family member role (no real name):
Review date:
Follow-up status:
~~~

### Field guide

| Field | What to write |
|---|---|
| Build ID | The label at the top of the screen, copied exactly |
| Implementation commit ID | The commit your reviewer contact gave you |
| Staging URL | The address you opened |
| Device and browser | e.g. "Android phone, Chrome" — model optional, no serial numbers |
| Screen or flow tested | e.g. "call screen", "picking a scenario" |
| Scenario tested | The practice situation you chose, e.g. "Beim Hausarzt anrufen" |
| Visual issue | Anything that looks broken, cut off, overlapping, or hard to read |
| Usability issue | Anything that was hard to do, hard to find, or behaved unexpectedly |
| Confusing wording | Any text you had to read twice, in any language |
| Favorite element | What worked well — this matters as much as the problems |
| Missing element | What you expected to be there and was not |
| Severity | One of the values below |
| Screenshot reference | A filename you keep yourself; do not paste images with people in them |
| Family member role | "parent", "teenager", "grandparent", "friend" — never a real name |
| Review date | The date you tested |
| Follow-up status | One of the values below; leave as NEW when you submit |

### Allowed severity values

| Value | Meaning |
|---|---|
| `BLOCKING` | I could not continue at all |
| `HIGH` | I could continue, but it was badly wrong |
| `MEDIUM` | Clearly a problem, but I worked around it |
| `LOW` | Small and cosmetic |
| `SUGGESTION` | Nothing is broken; this is an idea |

No other severity value is valid.

### Allowed follow-up values

| Value | Meaning | Who sets it |
|---|---|---|
| `NEW` | Just reported, nobody has looked yet | The reviewer |
| `TRIAGED` | Read and understood, not yet decided | The team |
| `ACCEPTED` | Will be worked on | The team |
| `DEFERRED` | Real, but not now | The team |
| `RESOLVED` | Changed and verified | The team |
| `NEEDS RECHECK` | Changed, waiting for the reviewer to confirm | The team |

No other follow-up value is valid.

## Observations are not decisions

An entry in this form records **what a person saw**. It does not record what will
be changed. Keep the two apart:

- The **Visual issue**, **Usability issue**, **Confusing wording**, **Favorite
  element** and **Missing element** fields are observations. Write what happened,
  not what the fix should be.
- **Follow-up status** is the only field that records a team decision, and only
  the team sets it.

Family feedback never approves anything. It cannot close an accessibility gate,
a specialist gate, a linguistic gate, a legal gate, or a release gate, and a
positive review is not Product Owner approval. Nobody may record a response,
screenshot reference, reviewer, date, severity, issue, outcome, or sign-off that
did not actually happen.

## What is deliberately not in this preview

- The launcher icon is unchanged — see the icon handoff in
  `docs/packages/MARZI-062.md`.
- Accessibility conformance is **not** claimed. The preview was measured, not
  certified, and no assistive-technology review has been performed.
- The learning content, corrections, rewards, coins, streaks and Marzi's
  evolution are unchanged from the current app. Feedback about them is welcome
  but is out of this package's scope.
