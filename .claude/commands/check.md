---
description: Architecture and code-quality gate
argument-hint: <optional scope hint — files, feature, or branch diff>
---

# /check

Read `.cursor/skills/check/SKILL.md` and execute the check workflow it describes for:

$ARGUMENTS

That file is the single source of truth. Follow it verbatim.

`/check` is an **architecture gate** — run before merging, before finishing, or when you need confidence that the codebase is structurally sound. It runs tooling (`pnpm lint`, `type-check`, `arch:check`, `validate:structure`) plus deeper architecture spot-checks (layer direction, path aliases, feature boundaries, complexity).

Report findings grouped by severity (blocker / warning / suggestion). Do not auto-fix — surface issues so the user can decide.
