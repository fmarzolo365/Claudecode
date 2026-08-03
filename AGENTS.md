# Repository Agent Instructions

These instructions apply to the entire repository and to Codex, Claude Code, delegated subagents, reviewers, automation agents, and future agents.

## Mandatory startup

Before repository work, read and follow:

1. [.ai/EXECUTION_POLICY.md](.ai/EXECUTION_POLICY.md) — canonical command execution and approval policy;
2. CLAUDE.md — repository architecture and implementation constraints;
3. the active package specification under docs/packages/ when one exists;
4. docs/MARZI_PROGRAM_GOVERNANCE.md, docs/MARZI_PRODUCT_BIBLE.md, docs/MARZI_MASTER_ROADMAP.md, and applicable recorded decisions.

Do not duplicate or reinterpret the execution policy here. If a referenced instruction is missing, unreadable, or conflicts with a higher-priority system, developer, host, or active-task instruction, follow the higher-priority and narrower safe scope and report the conflict.

## Role and scope discipline

- Product Owner approval is required for product, economy, art, commercial, release, and other Product Owner decisions.
- Codex owns architecture, specification, validation, and independent review.
- Claude Code implements only approved, bounded packages.
- No agent may silently broaden scope or change a frozen contract.
- Only one coding agent may modify application files at a time.
- Repository policy never disables host-enforced approval dialogs or grants authority outside the active task.
