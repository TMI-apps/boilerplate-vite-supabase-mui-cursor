# validate

Validate either (1) the plan document, or (2) the implementation of an executed plan. In both cases: investigate against rules, best practices, and project structure; report findings and suggestions; ask for feedback; **only then** optionally apply fixes.

**Critical:** Validation does **not** change the repo by default. First report, then wait for user direction, then optionally act.

**Related:** Create plans with `.cursor/commands/plan.md`. Execute with `.cursor/commands/implement.md`. Small scoped PIV in one go: `.cursor/commands/quick-piv.md`. Session context: `.cursor/commands/prime.md`. Commits and changelog: `.cursor/commands/finish.md`.

---

## Input

- User states what to validate (e.g. “validate the plan”, “validate the implementation”).
- **Context-based:** Infer use case and which job from job name, open file, or recent discussion.
- If ambiguous which `temp_job_<name>/` applies, **stop** and ask.

**Plan location:** `documentation/jobs/temp_job_<name>/DEVELOPMENT_PLAN.md`

---

## Use case (conditional)

| Use case | When | What to validate |
|----------|------|------------------|
| **Plan review** | Plan not yet executed (or user asks for plan-only review) | `DEVELOPMENT_PLAN.md` only: placements, structure, completeness, rules alignment. No code or `pnpm` checks unless user explicitly asks. |
| **Impl review** | Implementation exists or user asks to validate code | Run repo validation commands + compare code and docs to the plan. |

---

## Flow

1. **Determine use case** from context and user wording.
2. **Validate** using the checks below (read files, run commands for impl review).
3. **Report** findings and suggestions — **no edits** in this step.
4. **Ask feedback:** “What should I do with these findings — fix all, specific items, or nothing?”
5. **Wait** for the user’s answer.
6. **Optionally act** — only if the user requests fixes; then apply changes to the plan and/or code (still follow `.cursor/rules/` and structure whitelist).

---

## Plan review (document only)

**Checks:**

- `.cursor/rules/INDEX.md` and relevant rules: `.cursor/rules/architecture/RULE.md`, `.cursor/rules/file-placement/RULE.md`, `.cursor/rules/code-style/RULE.md`, `.cursor/rules/database/RULE.md`, `.cursor/rules/security/RULE.md`, `.cursor/rules/testing/RULE.md`, `.cursor/rules/workflow/RULE.md` (as applicable to the plan).
- `projectStructure.config.cjs`: are every **planned path** and folder allowed? Flag anything that would need config approval.
- **Completeness:** Summary, Phase overview (every phase has a gate), Conflict & compliance, Notes during development, Decisions made sections; phases have Goal, Steps, Gate.
- **Consistency:** Steps match Conflict & compliance; layer boundaries and import direction described correctly; complexity expectations align with `.cursor/rules/code-style/RULE.md`.
- **Boilerplate fit:** References to TanStack Query / features / shared layers match `ARCHITECTURE.md` and `documentation/DOC_TANSTACK_QUERY.md` when the plan touches server state.

**Output:** Structured report only. No file changes.

---

## Impl review (code + plan)

**Commands** (run and summarize failures; do not “fix” until user agrees):

- `pnpm validate:structure`
- `pnpm lint`
- `pnpm type-check`
- `pnpm arch:check` (dependency-cruiser; script: `arch:check` in `package.json`)
- `pnpm test:run` when the change touches logic covered by tests or when the plan requires tests
- Optionally `pnpm format:check` if style drift is in scope

**Manual / semantic checks:**

- **Plan compliance:** Phases marked done vs actual code; gates implied by plan vs reality; feature `README.md` updates if the plan required them.
- **Architecture:** Spot-check imports against `.cursor/rules/architecture/RULE.md` and `.dependency-cruiser.cjs` (especially new cross-layer paths).
- **Security / DB:** If the plan touched auth, RLS, or migrations, cross-check `.cursor/rules/security/RULE.md` and `.cursor/rules/database/RULE.md`.

**Output:** Structured report only. No file changes until the user opts in.

---

## Rules reference

| Topic | Location |
|-------|----------|
| Overview | `.cursor/rules/INDEX.md` |
| Architecture | `.cursor/rules/architecture/RULE.md` |
| File placement | `.cursor/rules/file-placement/RULE.md` → `projectStructure.config.cjs` |
| Code style | `.cursor/rules/code-style/RULE.md` |
| Database | `.cursor/rules/database/RULE.md` |
| Security | `.cursor/rules/security/RULE.md` |
| Testing | `.cursor/rules/testing/RULE.md` |
| Workflow | `.cursor/rules/workflow/RULE.md` |

**Docs:** `ARCHITECTURE.md`, `documentation/DOC_INDEX.md`, `documentation/DOC_TANSTACK_QUERY.md` when relevant.

---

## Report format

Group by category (e.g. Plan structure, File placement, Architecture, Tooling, Plan vs code). For each item:

- **Finding** — what is wrong, missing, or risky
- **Suggestion** — concrete improvement

Optional **severity:** Blocker | Warning | Suggestion.

---

## After report

1. Present the report.
2. Ask: “What do you want me to do with these findings — fix all, specific items, or nothing?”
3. Wait for the answer.
4. If the user wants fixes: apply them (plan markdown and/or source). Changelog remains the responsibility of `.cursor/commands/finish.md` unless the user explicitly includes it in the requested fixes.
