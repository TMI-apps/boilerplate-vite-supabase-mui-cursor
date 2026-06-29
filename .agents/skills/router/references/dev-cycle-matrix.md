# Dev-cycle matrix (router)

Compact guidance for **next-step mode**. Compress, skip, or reorder when scope, risk, or discoveries demand it.

**`/router`:** Thread continuation first (mid-task → logical next skill); backlog intake only when idle. See [router § `/router` — pick next action + skill](../SKILL.md).

**Skill inventory:** [`.agents/skills/router/SKILL.md`](../SKILL.md) § Skill index.

## Optimistic happy path

1. Spar / pin goal — router gates 1–2 pass.
2. **Plan** — `plan` writes `DEVELOPMENT_PLAN.md` with Complexity and compliance.
3. **Pattern & precedent** — `pattern-review` `plan-section` when M/L or material behavioral design (part of `plan` step 5).
4. **Plan review** — `review-dev-plan` required for Complexity **M** or **L**; optional for **XS/S** unless risk or user request.
5. **Plan compliance** — `validate` (plan-review mode) for repo-rule compliance on the plan when M/L or user requests.
6. **Implement** — `implement` executes phases and gates.
7. **Validate** — repo rules and/or architecture gate when warranted (auto-selects impl-full / gate depth).
8. **Finish** → **Push**.

Optional: `prime` when codebase or branch context is unfamiliar.

## Decision cues (router)

| Situation | Usually next |
|-----------|----------------|
| Goal unclear | `grill-me` and/or `plan` § Refine |
| Novel UX/API/architecture without documented precedent | `pattern-review` then `plan` with **Pattern & precedent** |
| Complexity M/L + plan review pending | `review-dev-plan` |
| Implementing without plan but material design questions | `pattern-review` `lite`; then `plan` or waiver in **Decisions made** |
| Ready to land | `finish` / `push` |

## Plan depth and gates

- **XS/S** — lighter plan; `review-dev-plan` optional unless risk.
- **M/L** — full plan + **Pattern & precedent** + `review-dev-plan` before `implement` unless waived.

**`quick-piv`:** only when scope is small, risk low, and industry-precedent review is unnecessary or already satisfied.
