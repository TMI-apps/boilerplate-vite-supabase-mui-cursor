# AGENTS.md

Project memory for coding agents (Cursor, Claude Code, and other AGENTS.md-aware tools). Keep under 100 lines — the imported rule files carry the details.

## Project

**vite-mui-supabase-starter** — Vite + React 19 + TypeScript + MUI + Supabase + TanStack Query starter with strict, enforced architecture.

- **Stack:** Vite 8, React 19, TypeScript 6 (strict), MUI 9, TanStack Query 5, Supabase 2, Airtable, React Router 7, Vitest 4, ESLint 10 + GTS + Prettier, Husky + lint-staged, dependency-cruiser, eslint-plugin-boundaries. Pin versions in `package.json`.
- **Package manager:** `pnpm@9.15.4` (enforced via `packageManager` field — do **not** use npm or yarn).

## Workflow — agent skills

Project agent workflows live under **`.agents/skills/<name>/SKILL.md`**. **Full catalog and routing:** `.agents/skills/router/SKILL.md` § Skill index.

**Routing:** For ambiguous work, read `.agents/skills/router/SKILL.md` first.

**Product context:** Fill `documentation/DOC_APP_VISION.md` (see `.agents/skills/start/SKILL.md`).

Layer model: `documentation/DOC_AGENT_WORKFLOW_LAYERS.md`.

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
