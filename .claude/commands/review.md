---
description: Component review using the 170-point rubric
argument-hint: <component file, feature, or area to review>
---

# /review

Read `.cursor/skills/review/SKILL.md` and execute the review workflow it describes for:

$ARGUMENTS

That file is the single source of truth. Follow it verbatim.

`/review` scores a component across nine sections (API & Props, UI/UX, Accessibility, Performance, State & Backend, Code Quality, Documentation, Requirements, Testing) on a 0–5 scale per item, producing a total out of 170. Review is **read-only** — do not modify code.

For architecture-level validation (not component-scoped), use `/check` instead.
