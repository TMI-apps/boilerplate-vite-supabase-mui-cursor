---
name: check
description: >-
  Architecture and code-quality gate via parallel rule-shaped fan-out (smaller default rule set,
  no plan-compliance pass). Use pre-merge, pre-finish, or after large refactors. Read-only by
  default. Not full plan/implementation validation (validate) or component rubric (review).
---

# check

Architecture and code-quality gate. Run before merging, before finishing, or when you need confidence that the codebase is structurally sound. More architecture-focused than `validate`: same parallel rule-shaped fan-out, smaller default rule set, no plan-compliance pass.

**Read-only by default.** Synthesize findings, then ask before fixing.

**Related:** For planning, use `.agents/skills/plan/SKILL.md`. For full plan or implementation review (and plan-vs-code compliance), use `.agents/skills/validate/SKILL.md`. For component-level review rubric, use `.agents/skills/review/SKILL.md`. For commits and changelog, use `.agents/skills/finish/SKILL.md`.

---

## When to use

- Pre-merge or pre-finish confidence check.
- After large refactors or multi-phase implementations.
- When you suspect architecture drift or structural issues.

---

## Flow

### 1. Scope

Determine what to check:
- **Explicit:** user names files, a feature, or a branch diff.
- **Implicit:** recent changes (`git diff --name-only` or `git diff --name-only --cached`).
- If unclear, ask.

### 2. Branch verification

Verify not on `main`. If on `main`, **stop** — instruct: `git checkout develop` (see `.cursor/rules/workflow/RULE.md` § Branch Strategy).

### 3. Fan out in parallel

Use the subagent contract defined in `.agents/skills/validate/SKILL.md` (read-only `Task` with `subagent_type: explore`, one rule per subagent, structured output schema, dedupe and ambiguity gate handled by the parent).

**Default rule subagents (always spawn):**
- `.cursor/rules/architecture/RULE.md`
- `.cursor/rules/file-placement/RULE.md`
- `.cursor/rules/code-style/RULE.md`

**Conditional rule subagents (include when the scope touches them):**
- `.cursor/rules/security/RULE.md` — auth, RLS, secrets, input validation.
- `.cursor/rules/database/RULE.md` — migrations, schema, queries.
- `.cursor/rules/testing/RULE.md` — test files added or removed.
- `.cursor/rules/workflow/RULE.md` — CI / branch / commit-process changes.

Err toward inclusion; `applicable: false` is cheap.

**Plan-compliance is intentionally excluded.** Use `.agents/skills/validate/SKILL.md` when you need the plan-vs-code comparison.

### 4. Tooling pass

The parent runs these directly in parallel with the subagent fan-out, summarizing failures only:

- `pnpm validate:structure`
- `pnpm lint`
- `pnpm type-check`
- `pnpm arch:check`
- `pnpm test:run` — when scoped changes touch tested logic

Each failing command becomes one finding (`rule: "tooling"`, severity **Blocker** by default; demote to **Warning** only when the parent has clear context for it).

### 5. Synthesize

Deduplicate findings that overlap across rules, group by category, sort by severity. Surface any subagent that returned an `error` as **"not audited — rerun recommended"** rather than silently dropping it.

### 6. Ambiguity gate

Collect every finding with `ambiguity: "user-question-needed"` and ask all questions in **one batch** before the report. Record the answers alongside the affected findings.

### 7. Report

Group findings by severity:

| Severity | Meaning |
|----------|---------|
| **Blocker** | Must fix before merge / finish |
| **Warning** | Should fix; risks tech debt |
| **Suggestion** | Nice to have |

Per finding: **file:line**, **finding**, **rule** (e.g. `.cursor/rules/architecture/RULE.md` § Layer boundaries).

### 8. Ask

"Fix all, specific items, or nothing?" — wait for user direction. If the user wants fixes, apply them while still following `.cursor/rules/` and the structure whitelist.

**Next:**

- **Pass (or user waived warnings):** Offer **`.agents/skills/finish/SKILL.md`** when the user wants to commit.
- **Blockers:** **`.agents/skills/implement/SKILL.md`** for plan-driven work, or fix here if the user requested fixes.
- **Semantic placement after tooling green:** **`.agents/skills/consolidate/SKILL.md`** § Semantic placement mode (not a substitute for this gate).

## Boundaries

| Not `check` | Use instead |
|-------------|-------------|
| Plan vs code compliance | `.agents/skills/validate/SKILL.md` |
| Industry precedent | `.agents/skills/pattern-review/SKILL.md` |
| Single React component rubric | `.agents/skills/review/SKILL.md` |
| Commit / push | `.agents/skills/finish/SKILL.md` / `push` |

---

## Rules reference

Subagent contract: **`.agents/skills/validate/SKILL.md`**. Rule paths: [`.cursor/rules/INDEX.md`](../../../.cursor/rules/INDEX.md), [`.agents/skills/plan/references/rules-registry.md`](../plan/references/rules-registry.md).
