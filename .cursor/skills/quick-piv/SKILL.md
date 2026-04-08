---
name: quick-piv
description: "quick-piv"
disable-model-invocation: true
---

# quick-piv

Lightweight Plan → Implement → Validate in one workflow. Use for small, well-scoped tasks when the full formal PIV flow is overkill.

**Critical:** Still follow repo rules. No changelog updates (`.cursor/skills/finish/SKILL.md` handles that).

**Related:** Full formal cycle: `.cursor/skills/plan/SKILL.md` → `.cursor/skills/implement/SKILL.md` → `.cursor/skills/validate/SKILL.md`. Session context: `.cursor/skills/prime/SKILL.md`. Requirement depth before coding: `.cursor/skills/check/SKILL.md`.

---

## When to use

- Small, focused changes (e.g. fix a bug, small UI tweak, refactor one component).
- User wants to move fast without separate plan / implement / validate invocations.
- Task is scoped enough that a full `DEVELOPMENT_PLAN.md` is unnecessary.

**When NOT to use:** Large features, multi-phase work, database migrations, breaking changes, new features that need conflict & compliance written down → use full `plan` + `implement` + `validate` instead.

---

## Context detection (first step)

Determine whether an **active plan** exists:

- **Open / recent files:** Is a file under `documentation/jobs/temp_job_*/DEVELOPMENT_PLAN.md` open or recently viewed?
- **User message:** Job name, “the plan”, or explicit path to a job folder?
- **Recent context:** Was the thread about executing a specific `DEVELOPMENT_PLAN.md`?

If unclear, **ask** which branch applies.

### Branch A: Active plan exists

→ Load that `DEVELOPMENT_PLAN.md`. **Quick plan** = extend where appropriate (add phase, append steps, or state the extension clearly in chat). Update the plan file when you add to it. Then **implement**, then **quick validate**.

### Branch B: No active plan

→ **Vital:** Output the quick plan **in chat first** (user must see it). Only then **implement**, then **quick validate**. No `DEVELOPMENT_PLAN.md` required.

---

## Quick plan (always)

**Branch A:** Extension to existing plan — add a phase, append steps, or scope the extension in chat; update the plan doc when the doc is the source of truth.

**Branch B:** **Vital — plan appears in chat before any code changes.** Format:

```markdown
**Quick plan**

- **Goal:** [1 sentence]
- **Steps:** [3–5 bullet points, rules-compliant]
- **Gate:** [How we verify it works]
```

**Process:**

1. If the request is vague → ask 1–2 clarifying questions, then proceed.
2. Quick investigation: search codebase; skim `.cursor/rules/INDEX.md` for applicable rules; use `documentation/DOC_TANSTACK_QUERY.md` if server state / queries are involved.
3. Sanity-check file placement against `.cursor/rules/file-placement/RULE.md` and `projectStructure.config.cjs`.
4. **Branch B:** Output the quick plan in chat (vital). **Branch A:** Optionally extend the plan document.
5. Proceed to implementation (no separate approval wait unless the user stops you).

---

## Implement

1. **Branch A:** Run the extension (new phase/steps) or the next pending phase from the loaded plan.
2. **Branch B:** Execute the quick plan already shown in chat.
3. Follow `.cursor/rules/architecture/RULE.md`, `.cursor/rules/file-placement/RULE.md`, `.cursor/rules/code-style/RULE.md`, and `.cursor/rules/security/RULE.md` when relevant.
4. Run the **gate** from the quick plan (browser MCP when UI is involved; tests or manual checks as appropriate).
5. **Branch A:** Update the plan (phase status, Notes, Decisions) as you go.

---

## Validate (quick pass)

After implementation:

1. `pnpm validate:structure` — report failures.
2. `pnpm lint` — report failures.
3. `pnpm type-check` — report failures.
4. `pnpm arch:check` — report failures (dependency-cruiser; defined in `package.json`).
5. **Report:** Brief summary: “✅ All checks pass” or list findings with severity (blocker / warning / suggestion).
6. **If failures:** Ask: “Fix these? (all / specific / skip)” — only fix after the user chooses (same spirit as `.cursor/skills/validate/SKILL.md`, compressed).

---

## Rules reference (follow during implementation)

| Topic | Location |
|-------|----------|
| Overview | `.cursor/rules/INDEX.md` |
| Architecture | `.cursor/rules/architecture/RULE.md` |
| File placement | `.cursor/rules/file-placement/RULE.md` → `projectStructure.config.cjs` |
| Code style | `.cursor/rules/code-style/RULE.md` |

**Also when applicable:** `.cursor/rules/testing/RULE.md`, `.cursor/rules/database/RULE.md`, `.cursor/rules/security/RULE.md`, `ARCHITECTURE.md`, `documentation/DOC_TANSTACK_QUERY.md`.

---

## Summary flow

| Step | Branch A (has plan) | Branch B (no plan) |
|------|---------------------|---------------------|
| 1 | Load plan + extend where appropriate | **Output quick plan in chat first** (vital) |
| 2 | Implement (extension or next phase) | Implement |
| 3 | Quick validate | Quick validate |

**One workflow. One command. Fast.**
