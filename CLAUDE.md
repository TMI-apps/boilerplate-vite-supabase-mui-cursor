# CLAUDE.md

Project memory for Claude Code. Keep under 100 lines — the imported rule files carry the details.

## Project

**vite-mui-supabase-starter** — Vite + React 19 + TypeScript + MUI 7 + Supabase + TanStack Query starter with strict, enforced architecture.

- **Stack:** Vite 7, React 19, TypeScript 5.6 (strict), MUI 7, TanStack Query 5, Supabase 2, Airtable, React Router 7, Vitest 4, ESLint 9 + GTS + Prettier, Husky + lint-staged, dependency-cruiser, eslint-plugin-boundaries.
- **Package manager:** `pnpm@9.15.4` (enforced via `packageManager` field — do **not** use npm or yarn).

## Workflow — slash commands

Each slash command reads and executes a `.cursor/skills/<name>/SKILL.md` file.

| Slash command | Wraps | Purpose |
| ------------- | ---------------------------------- | --------------------------------------------------------- |
| `/plan` | `.cursor/skills/plan/SKILL.md` | Produce a `DEVELOPMENT_PLAN.md` |
| `/implement` | `.cursor/skills/implement/SKILL.md`| Execute the plan phase by phase |
| `/validate` | `.cursor/skills/validate/SKILL.md` | Rules + tooling review (read-only by default) |
| `/check` | `.cursor/skills/check/SKILL.md` | Architecture and code-quality gate |
| `/consolidate` | `.cursor/skills/consolidate/SKILL.md` | Cross-feature duplication and consolidation audit |
| `/review` | `.cursor/skills/review/SKILL.md` | Component review (170-point rubric) |
| `/finish` | `.cursor/skills/finish/SKILL.md` | Pre-commit: version, changelog, staging gate, commit |

For small scoped work: `.cursor/skills/quick-piv/SKILL.md`.

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
- **Plan before non-trivial work.** Anything beyond a one-line fix should start with `/plan`.
- **Lean output.** Don't restate skill content — point to the file and follow it.
