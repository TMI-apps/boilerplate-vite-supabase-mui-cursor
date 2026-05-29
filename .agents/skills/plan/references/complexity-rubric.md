# Plan complexity rubric (reference)

Used by [`.agents/skills/plan/SKILL.md`](../SKILL.md) and [`implementation-plan-template.md`](implementation-plan-template.md).

| Level | Typical signals |
|-------|-----------------|
| **XS** | One file or doc-only; no schema/auth change |
| **S** | Few files; one feature area; no migration |
| **M** | Multiple phases; migration or cross-cutting rules; durable plan for others |
| **L** | Breaking API; large UX/navigation coupling; many integration points |

When in doubt between two levels, choose the **higher** level for plan review and pattern-review gates.
