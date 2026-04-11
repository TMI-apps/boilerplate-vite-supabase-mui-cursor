---
description: Architecture and code-quality validation gate
argument-hint: <optional scope hint>
---

# /check

Read `.cursor/skills/check/SKILL.md` and execute the check workflow it describes for:

$ARGUMENTS

That file is the single source of truth. Follow it verbatim.

`/check` is a **requirement gate** — typically run before building, before merging, or as a pre-commit sanity pass. It is stricter than `/validate` and more focused on architecture compliance and structural correctness.

If `/check` reveals violations, surface them to the user with the relevant rule path (e.g. `.cursor/rules/architecture/RULE.md` § Layer boundaries). Do not silently fix architectural violations — they often need user judgment.
