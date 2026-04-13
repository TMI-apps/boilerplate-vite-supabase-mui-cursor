---
description: Rules + tooling review of work in progress without changing anything
argument-hint: <optional scope hint>
---

# /validate

Read `.cursor/skills/validate/SKILL.md` and execute the validation workflow it describes for:

$ARGUMENTS

That file is the single source of truth. Follow it verbatim. Validation is **read-only** — do not modify code during this command.

Default validation surface for this stack:

```bash
pnpm lint
pnpm type-check
pnpm test:run
pnpm arch:check
pnpm validate:structure
pnpm validate:feature-docs:strict
```

Report findings to the user in a concise summary: what passed, what failed, and what (if anything) is worth opening an `/implement` or `/finish` step for. Do **not** auto-fix — surface issues so the user can decide.
