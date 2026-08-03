# Repository Agent Instructions

These instructions apply to the entire repository and to Codex, Claude Code, delegated subagents, reviewers, automation agents, and future agents.

## Mandatory startup

Before repository work, read and follow:

1. [.ai/EXECUTION_POLICY.md](.ai/EXECUTION_POLICY.md) — canonical command execution and approval policy;
2. CLAUDE.md — repository architecture and implementation constraints;
3. the active package specification under docs/packages/ when one exists;
4. docs/MARZI_PROGRAM_GOVERNANCE.md, docs/MARZI_PRODUCT_BIBLE.md, docs/MARZI_MASTER_ROADMAP.md, and applicable recorded decisions.

Do not duplicate or reinterpret the execution policy here. If a referenced instruction is missing, unreadable, or conflicts with a higher-priority system, developer, host, or active-task instruction, follow the higher-priority and narrower safe scope and report the conflict.

## Stable inspection entry points

For supported read-only work, prefer the stable .ai/bin/ entry points defined in the execution policy:

- run .ai/bin/repo-inspect once and reuse its structured repository report;
- use .ai/bin/commit-inspect for variable commits and refs;
- use .ai/bin/docs-validate for the consolidated documentation gate;
- use .ai/bin/file-inspect for file discovery, metadata, counts, hashes, and bounded reads;
- use .ai/bin/browser-inspect for local rendered-browser inspection.

Batch related inspections and cache their output for the current task. Fall back to a raw safe command only when no wrapper supports the required operation, and report the unsupported operation for later wrapper review. Never route a mutation through a read-only wrapper or ask the host to remember a dynamic command string containing a SHA, path, port, viewport, or temporary name.

## Role and scope discipline

- Product Owner approval is required for product, economy, art, commercial, release, and other Product Owner decisions.
- Codex owns architecture, specification, validation, and independent review.
- Claude Code implements only approved, bounded packages.
- No agent may silently broaden scope or change a frozen contract.
- Only one coding agent may modify application files at a time.
- Repository policy never disables host-enforced approval dialogs or grants authority outside the active task.
