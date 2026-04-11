---
description: Code review against architecture rules
argument-hint: <files, branch diff, or area to review>
---

# /review

Read `.cursor/skills/review/SKILL.md` and execute the review workflow it describes for:

$ARGUMENTS

That file is the single source of truth. Follow it verbatim.

Review is **read-only** — do not modify code. Produce a concise review report grouped by severity (blocker / suggestion / nit), with each item linking to:

- The file and line (use `path/to/file.ts:42` format)
- The rule it violates or the principle it conflicts with (e.g. `.cursor/rules/code-style/RULE.md` § Complexity)

If no rule applies, frame the suggestion as opinion and label it "subjective".
