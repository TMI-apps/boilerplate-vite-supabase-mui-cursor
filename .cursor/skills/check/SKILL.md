---
name: check
description: "check"
disable-model-invocation: true
---

# check

Architecture and code-quality gate. Run before merging, before finishing, or when you need confidence that the codebase is structurally sound. More architecture-focused than a `validate` pass.

**Read-only by default.** Report findings, then ask before fixing.

**Related:** For planning, use `.cursor/skills/plan/SKILL.md`. For tooling-only validation or plan review, use `.cursor/skills/validate/SKILL.md`. For component-level review rubric, use `.cursor/skills/review/SKILL.md`. For commits and changelog, use `.cursor/skills/finish/SKILL.md`.

---

## When to use

- Pre-merge or pre-finish confidence check.
- After large refactors or multi-phase implementations.
- When you suspect architecture drift or structural issues.

---

## Flow

### 1. Scope

Determine what to check:
- **Explicit:** User names files, a feature, or a branch diff.
- **Implicit:** Recent changes (`git diff --name-only` or `git diff --name-only --cached`).
- If unclear, ask.

### 2. Branch verification

Verify not on `main`. If on `main`, **stop** — instruct: `git checkout develop` (see `.cursor/rules/workflow/RULE.md` § Branch Strategy).

### 3. Tooling pass

Run and summarize (failures only):

```bash
pnpm validate:structure
pnpm lint
pnpm type-check
pnpm arch:check
pnpm test:run   # when scoped changes touch tested logic
```

### 4. Architecture spot-checks

For each file in scope, verify against `.cursor/rules/architecture/RULE.md`:

- [ ] **Responsibility level:** logic lives in the correct layer per § Code Placement Rules — UI-only in components, lifecycle orchestration in hooks, pure logic in services/utils. Apply the § Logic Decision Flowchart to each piece of non-trivial logic. For edge cases, consult § Edge Case Placement Guide.
- [ ] **Scope level:** feature-specific code in `features/*/`, cross-feature code in `shared/`, presentation-only reusables in `components/common/`. If a page grew its own hooks/services, it should be a feature (§ Page Complexity Threshold).
- [ ] **Layer direction:** imports flow `pages → components → hooks → services`. No reverse imports.
- [ ] **Path aliases:** uses `@common/*`, `@features/*`, `@shared/*`, etc. — no bare `../../` crossing layer boundaries.
- [ ] **Feature boundaries:** feature code stays in its feature folder; shared code lives in `src/shared/` or `src/components/common/`.
- [ ] **File placement:** each file is in a whitelisted location per `projectStructure.config.cjs` and `.cursor/rules/file-placement/RULE.md`.
- [ ] **Complexity:** functions ≤ 10 cyclomatic, ≤ 15 cognitive, ≤ 100 lines, nesting ≤ 4, params ≤ 3.

### 5. Security & data (when applicable)

If scoped changes touch auth, RLS, or data:

- [ ] RLS policies cover new/changed tables (`.cursor/rules/security/RULE.md`).
- [ ] No secrets outside `.env`.
- [ ] Input validation present on user-facing inputs.

### 6. Report

Group findings by severity:

| Severity | Meaning |
|----------|---------|
| **Blocker** | Must fix before merge/finish |
| **Warning** | Should fix; risks tech debt |
| **Suggestion** | Nice to have |

Per finding: **file:line**, **finding**, **rule** (e.g. `.cursor/rules/architecture/RULE.md` § Layer boundaries).

### 7. Ask

"Fix all, specific items, or nothing?" — wait for user direction.

---

## Rules reference

| Topic | Location |
|-------|----------|
| Architecture | `.cursor/rules/architecture/RULE.md` |
| File placement | `.cursor/rules/file-placement/RULE.md` → `projectStructure.config.cjs` |
| Code style | `.cursor/rules/code-style/RULE.md` |
| Security | `.cursor/rules/security/RULE.md` |
| Database | `.cursor/rules/database/RULE.md` |
| Workflow | `.cursor/rules/workflow/RULE.md` |
