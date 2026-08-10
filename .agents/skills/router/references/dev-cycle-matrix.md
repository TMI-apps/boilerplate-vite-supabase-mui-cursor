# Dev-cycle matrix (router)

Compact guidance for **next-step mode**. Compress, skip, or reorder when scope, risk, or discoveries demand it.

**`/router`:** Thread continuation first (mid-task → logical next skill); backlog intake only when idle. See [router § `/router` — pick next action + skill](../SKILL.md).

**Skill inventory:** [`.agents/skills/router/SKILL.md`](../SKILL.md) § Skill index.

## Optimistic happy path

1. Spar / pin goal — router gates 1–2; optional `grill-me` warm start → `DECISIONS.md`.
2. **Plan corridor** — `plan` Refine → Investigate → Create with **`plan-grill` rail** (fork checklist each phase; anti-dup via `DECISIONS.md`); writes `DEVELOPMENT_PLAN.md` with Complexity and compliance.
3. **Pattern & precedent** — `pattern-review` `plan-section` when M/L or material behavioral design (part of `plan` step 5).
4. **Plan review** — `review-dev-plan` required for Complexity **M** or **L**; optional for **XS/S** unless risk or user request.
5. **Plan compliance** — `validate` (plan-review mode) for repo-rule compliance on the plan when M/L or user requests.
6. **Implement** — `implement` executes phases and gates.
7. **Validate** — repo rules and/or architecture gate when warranted (auto-selects impl-full / gate depth).
8. **Finish** — local commit, version, changelog.
9. **Push** — remote sync after commits exist.
10. **Babysit** — when a PR to `develop` exists after push: read and run `~/.cursor/skills-cursor/babysit/SKILL.md` (CI green + mergeable is agent responsibility; user does not watch checks). Skip only when waived in **Decisions made**.
11. **User app test** — agent emits **Ready for you to test** handoff (`finish` § User test); user pass/fail closes the loop.

Optional: `prime` when codebase or branch context is unfamiliar.

## Decision cues (router)

| Situation | Usually next |
|-----------|----------------|
| Goal unclear | `grill-me` (warm start) and/or `plan` § Refine (gate 2); if already in plan → `plan-grill` rail |
| Product/scope fork in plan corridor | `plan-grill` rail via `plan` (checklist; anti-dup `DECISIONS.md`) |
| Novel UX/API/architecture without documented precedent | `pattern-review` then `plan` with **Pattern & precedent** |
| Complexity M/L + plan review pending | `review-dev-plan` |
| Implementing without plan but material design questions | `pattern-review` `lite`; then `plan` or waiver in **Decisions made** |
| Ready to land | `finish` → `push` → `babysit` (PR to `develop`) → user test handoff |
| Bug / error / regression (not feature request) | `debug` (§ Chat intake) before `implement` |
| Pushed; PR to `develop` open; CI unknown | `babysit` |

## Plan depth and gates

- **XS/S** — lighter plan; `review-dev-plan` optional unless risk.
- **M/L** — full plan + **Pattern & precedent** + `review-dev-plan` before `implement` unless waived.

**`quick-piv`:** only when scope is small, risk low, and industry-precedent review is unnecessary or already satisfied.
