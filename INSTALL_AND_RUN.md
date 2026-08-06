# Install and run the MARZI Call Art System

## Installation

Extract this archive at the repository root.

It creates:

```text
.claude/skills/marzi-call-art-direction/SKILL.md
.claude/agents/marzi-visual-director.md
docs/design/MARZI_CALL_ASSET_SPEC.md
MARZI_PREMIUM_CALL_EXECUTION_PROMPT.md
```

## References to attach or locate

- `02_call.png`
- current call screenshots
- premium doctor reference
- canonical Marzi logo/art
- original character and Marzi assets

## Run

Start a fresh Claude Code session at the repository root with Fable 5 + Ultracode.

Invoke:

```text
/marzi-call-art-direction
```

Then attach or reference the visual files and paste the contents of:

```text
MARZI_PREMIUM_CALL_EXECUTION_PROMPT.md
```

Ask Claude to use the read-only `marzi-visual-director` before committing.

## Important

The skill improves consistency, implementation direction, and visual review. It does not replace missing production illustrations. The execution prompt requires honest temporary-asset reporting and production-ready drop-in architecture.
