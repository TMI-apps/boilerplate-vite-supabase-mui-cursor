# CLAUDE.md

Project memory for Claude Code. Keep under 100 lines — the imported rule files carry the details.

## Project

**vite-mui-supabase-starter** — Vite + React 19 + TypeScript + MUI 7 + Supabase + TanStack Query starter with strict, enforced architecture.

- **Stack:** Vite 7, React 19, TypeScript 5.6 (strict), MUI 7, TanStack Query 5, Supabase 2, Airtable, React Router 7, Vitest 4, ESLint 9 + GTS + Prettier, Husky + lint-staged, dependency-cruiser, eslint-plugin-boundaries.
- **Package manager:** `pnpm@9.15.4` (enforced via `packageManager` field — do **not** use npm or yarn).

## Workflow — agent skills

Project agent workflows live under **`.agents/skills/<name>/SKILL.md`** (cross-tool: Cursor, Claude Code, and other agents scan this folder).

**Routing:** For ambiguous work or “which skill?”, read `.agents/skills/router/SKILL.md` first.

**Product context:** Fill `documentation/DOC_APP_VISION.md` (see `.agents/skills/start/SKILL.md`) so planning and feature work align with your fork’s problem, persona, and app role.

| Skill | Purpose |
| ----- | ------- |
| `plan` | Produce a `DEVELOPMENT_PLAN.md` |
| `implement` | Execute the plan phase by phase |
| `validate` | Rules + tooling review (read-only by default) |
| `check` | Architecture and code-quality gate |
| `consolidate` | Cross-feature duplication and consolidation audit |
| `review` | Component review (170-point rubric) |
| `finish` | Pre-commit: version, changelog, staging gate, commit |

For small scoped work: `.agents/skills/quick-piv/SKILL.md`.

## Rules — single source of truth

The canonical rules live in `.cursor/rules/`. The imported rules below cover architecture, file placement, code style, workflow, and the rules index:

@.cursor/rules/INDEX.md
@.cursor/rules/architecture/RULE.md
@.cursor/rules/file-placement/RULE.md
@.cursor/rules/code-style/RULE.md
@.cursor/rules/workflow/RULE.md

Consult on demand (not auto-imported):

- `.cursor/rules/testing/RULE.md`
- `.cursor/rules/security/RULE.md`
- `.cursor/rules/database/RULE.md`
- `.cursor/rules/debugging/RULE.md`
- `.cursor/rules/cloud-functions/RULE.md`
- `.cursor/rules/project-specific/RULE.md`

Claude-specific behavioral reminders (thin pointers to the above):

@.claude/rules/file-placement.md
@.claude/rules/git-workflow.md

## Defaults

- **Always read before edit.** Run `pnpm validate:structure` if creating new files in unfamiliar locations.
- **Plan before non-trivial work.** Anything beyond a one-line fix should start with the `plan` skill (`.agents/skills/plan/SKILL.md`).
- **Lean output.** Don't restate skill content — point to the file and follow it.
