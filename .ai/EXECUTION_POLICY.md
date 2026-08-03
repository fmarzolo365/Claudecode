# Marzi Repository Execution Policy

Status: Canonical permanent execution policy

Applies to: Codex, Claude Code, delegated subagents, automation agents, reviewers, and future repository agents

This policy governs command approval and execution inside this repository. It does not override system, developer, host-sandbox, security, or active-task instructions. It never expands the file, branch, environment, credential, deployment, or business scope granted by the active task. When rules differ, follow the narrowest safe scope and the higher-priority instruction.

## 1. Canonical policy and required reading

Every agent must read and follow:

1. the root AGENTS.md;
2. this file;
3. CLAUDE.md when present;
4. the active package specification and applicable governance/product documents.

This file is the canonical repository source for execution approvals. Root AGENTS.md points here instead of duplicating these rules.

## 2. General auto-approval rule

Treat an operation as pre-approved when its effect is limited to:

- reading;
- searching;
- inspecting;
- measuring;
- validating;
- rendering;
- testing;
- collecting repository metadata;
- creating temporary audit material under /tmp;
- running local servers used exclusively for testing;
- accessing localhost;
- producing temporary screenshots or reports;
- editing documentation files explicitly authorized by the active task.

Batch related operations whenever possible. Do not request repeated approval merely because command arguments, paths, branches, ports, viewports, locales, or task-owned temporary directory names differ.

Some approval dialogs are enforced by the host environment and cannot be disabled by repository instructions. When such a dialog appears, group commands under the broadest safe prefix supported by the environment, without broadening task scope.

## 3. Permanently safe Git inspection

Automatically execute read-only Git operations, including variants using:

- git -C <repository>;
- git -c safe.directory=<repository>.

Safe commands include:

- git status;
- git branch;
- git log;
- git show;
- git diff;
- git diff --check;
- git rev-parse;
- git rev-list;
- git merge-base;
- git symbolic-ref;
- git show-ref;
- git for-each-ref;
- git cat-file;
- git remote;
- git remote -v;
- git config --get for non-sensitive configuration;
- git ls-files;
- git describe;
- git tag --list;
- git fetch;
- git fetch origin;
- git fetch --all.

Git fetch may update remote-tracking references but must not merge, rebase, reset, check out, restore, or otherwise modify working-tree files. Remote and configuration output must not expose embedded credentials; redact sensitive URL/user-information if encountered.

Do not auto-approve:

- git commit;
- git push;
- git merge;
- git rebase;
- git reset;
- git clean;
- git checkout or git switch when it changes the active working tree;
- git restore when it changes files;
- Git tag creation or deletion;
- history rewriting;
- force operations.

An active task may explicitly authorize one or more of these operations. That authorization is bounded to the named repository, branch, files, and purpose.

## 4. File and repository inspection

Automatically execute read-only variants of:

- pwd;
- ls;
- tree;
- find;
- rg;
- grep;
- cat;
- less;
- head;
- tail;
- sed without in-place editing;
- awk without file writes;
- sort;
- uniq;
- wc;
- nl;
- stat;
- file;
- realpath;
- readlink;
- dirname;
- basename;
- md5sum;
- sha256sum;
- command -v;
- which;
- whereis;
- printenv for non-sensitive metadata or Boolean presence checks only;
- env used only to launch an approved temporary command.

Automatically inspect common repository instructions and configuration, including:

- AGENTS.md;
- .ai/AGENTS.md;
- .ai/EXECUTION_POLICY.md;
- CLAUDE.md;
- README.md;
- CONTRIBUTING.md;
- package.json;
- manifest files;
- test configuration;
- documentation files;
- source files;
- assets.

Read access does not authorize displaying secrets, personal data, private keys, credential values, or other sensitive content in command output or reports.

## 5. Temporary audit operations

Automatically execute safe temporary operations limited to a task-owned directory under /tmp, including:

- mktemp;
- mktemp -d;
- mkdir -p /tmp/...;
- temporary copies into /tmp;
- temporary audit clones;
- temporary work directories;
- temporary screenshots;
- temporary validation reports;
- cleanup strictly inside the task-owned /tmp directory.

Resolve and validate a cleanup target before deletion. Never delete outside the explicitly task-owned temporary directory, and never treat the repository root, a workspace root, /tmp itself, the home directory, or an unresolved variable as a cleanup target.

Temporary clones and copies are for inspection unless the active task separately authorizes persistent changes. They do not grant permission to push, merge, deploy, publish, or alter the source repository.

## 6. Local testing and rendering

Automatically execute:

- node --check;
- approved repository test scripts;
- documentation validators;
- conflict-marker checks;
- Playwright and Chromium inspection;
- browser rendering;
- responsive measurement;
- accessibility inspection;
- DOM inspection;
- screenshot generation;
- local performance measurement;
- localhost HTTP requests;
- temporary local HTTP servers;
- temporary environment variables such as PORT, MARZI_URL, MARZI_PLAYWRIGHT, NODE_ENV, DEBUG, and TMPDIR.

These operations must remain local, non-production, non-paid, and within the active task. They must not access paid services, production systems, external credentials, secrets, or learner data. A local server may write only task-owned temporary artifacts unless an active implementation package explicitly authorizes repository output.

Test commands that generate persistent repository files, snapshots, caches, coverage, lockfiles, or formatted source are mutating. They require active-scope authorization or must be redirected to a task-owned temporary directory.

## 7. Node inline-script safety

Automatically execute node -e only when static inspection confirms that it:

- reads files;
- parses data;
- validates documents;
- builds in-memory structures;
- calculates hashes or counts;
- emits reports to standard output;
- performs local browser inspection already authorized.

Require explicit approval when inline code performs or invokes:

- writeFile or appendFile;
- rename;
- unlink or rm;
- repository file creation;
- child-process mutation commands;
- dependency installation;
- external network access;
- credential access;
- deployment;
- Git mutation.

Documentation-writing scripts are allowed only when the active task explicitly authorizes the exact documentation paths. Prefer the repository’s normal patch/edit mechanism so the diff remains reviewable.

## 8. Sandbox recovery

If the sandbox loses the working directory or a read operation fails:

1. locate the repository root;
2. validate the repository identity, branch, and expected commit;
3. retry the read using git -C or git -c safe.directory=...;
4. continue automatically.

Do not request approval for read-only recovery unless the host environment itself requires a dialog.

If an authorized documentation edit fails inside the sandbox, retry outside it only for documentation files expressly permitted by the active task. Never generalize that permission to runtime code, tests, assets, configuration, dependencies, secrets, or unrestricted repository writes.

If the repository or required commit cannot be found, the tree is corrupt, or identity cannot be established, stop and report the exact blocker.

## 9. Batching and caching

Reduce approval volume by:

- batching related Git inspection into one operation;
- batching file checks;
- reusing repository metadata during the same task;
- avoiding repeated equivalent checks;
- avoiding one approval request per branch, filename, argument, viewport, locale, or temporary directory;
- using one structured repository-inspection result where practical.

Do not add runtime application infrastructure merely to optimize agent inspection. Cached metadata must be refreshed when a fetch, commit, branch operation, user action, or external change could make it stale.

## 10. Operations that always require explicit approval

Always request approval before:

- modifying runtime code unless the active implementation package explicitly authorizes it;
- modifying files outside active scope;
- deleting repository files;
- changing dependencies;
- installing software or packages;
- changing secrets or credentials;
- accessing paid external services;
- changing deployment configuration;
- committing, unless the active task explicitly authorizes a commit;
- pushing;
- merging;
- rebasing;
- rewriting history;
- force-pushing;
- deploying;
- publishing;
- opening or merging a pull request;
- changing main or another protected branch;
- changing production data or infrastructure.

Also require explicit scope before any persistent external side effect. A prior approval for inspection or one repository does not authorize mutation in another repository, branch, service, or environment.

## 11. Continuous policy maintenance

At the end of future substantial tasks, report only newly encountered command patterns that are not already covered here.

For each new pattern state:

- command family;
- purpose;
- read-only or mutating;
- recommended permanent classification.

Do not repeatedly list patterns already covered by this policy. Amend this policy only through an explicitly authorized, reviewed documentation change.

## 12. Compliance checklist

Before concluding a task, verify as applicable:

- all actions stayed inside active scope;
- pre-approved operations remained read-only, temporary, local-test-only, or expressly authorized documentation edits;
- no host approval was treated as broader product or repository authority;
- no push, merge, deployment, deletion, credential, secret, dependency, protected-branch, or unrestricted-write action occurred without explicit approval;
- temporary material is either retained for an explicit handoff or cleaned only from its validated task-owned /tmp directory;
- the final report identifies unavoidable host-enforced prompts and only newly encountered command patterns.
