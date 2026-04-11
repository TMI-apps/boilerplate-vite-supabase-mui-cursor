# CLAUDE.md

Project memory for Claude Code in this repository. Keep this file under 200 lines — push details into the linked rule files instead of restating them here.

## Project

**vite-mui-supabase-starter** — a Vite + React 19 + TypeScript + MUI 7 + Supabase + TanStack Query starter with a strict, enforced architecture and an in-app setup wizard.

- **Stack:** Vite 7, React 19, TypeScript 5.6 (strict), MUI 7, TanStack Query 5, Supabase 2, Airtable, React Router 7, Vitest 4, ESLint 9 + GTS + Prettier, Husky + lint-staged, dependency-cruiser, eslint-plugin-boundaries.
- **Package manager:** `pnpm@9.15.4` (enforced via the `packageManager` field — do **not** use npm or yarn).
- **Branches:** `feature/*` → `experimental` → `main`. `experimental` and `main` are long-lived and protected. Never commit to `main` directly.

## Workflow — use the slash commands

This repo's workflow is encoded as **Cursor skills** under `.cursor/skills/`. Cursor skills are the canonical source of truth. Claude Code mirrors the most-used ones as slash commands so they can be invoked here too. **Each slash command is a thin wrapper that points you at a `.cursor/skills/<name>/SKILL.md` file — read that file and execute the workflow it describes.**

| Slash command  | Wraps                              | Purpose                                                                       |
| -------------- | ---------------------------------- | ----------------------------------------------------------------------------- |
| `/plan`        | `.cursor/skills/plan/SKILL.md`     | Produce a `DEVELOPMENT_PLAN.md` under `documentation/jobs/temp_job_<name>/`   |
| `/implement`   | `.cursor/skills/implement/SKILL.md`| Execute the plan phase by phase                                               |
| `/validate`    | `.cursor/skills/validate/SKILL.md` | Rules + tooling review without making changes                                 |
| `/check`       | `.cursor/skills/check/SKILL.md`    | Architecture and code quality validation                                      |
| `/review`      | `.cursor/skills/review/SKILL.md`   | Code review against architecture rules                                        |
| `/finish`      | `.cursor/skills/finish/SKILL.md`   | Pre-commit finalization: version, changelog, staging gate, commit             |

For small scoped work, prefer `.cursor/skills/quick-piv/SKILL.md` (one-pass plan-implement-validate cycle).

## Rules — single source of truth

The canonical rules live in `.cursor/rules/`. The most load-bearing ones are imported below so they are always in context:

@.cursor/rules/INDEX.md
@.cursor/rules/architecture/RULE.md
@.cursor/rules/file-placement/RULE.md
@.cursor/rules/code-style/RULE.md
@.cursor/rules/workflow/RULE.md

Other rules to consult on demand (read them when relevant — not auto-imported, to keep context small):

- `.cursor/rules/testing/RULE.md`
- `.cursor/rules/security/RULE.md`
- `.cursor/rules/database/RULE.md`
- `.cursor/rules/debugging/RULE.md`
- `.cursor/rules/cloud-functions/RULE.md`
- `.cursor/rules/project-specific/RULE.md`

Claude-specific reminders:

@.claude/rules/file-placement.md
@.claude/rules/git-workflow.md

## Architecture

See `ARCHITECTURE.md` for the user-facing overview. Key facts to internalize:

- **Layer direction:** `pages → components → hooks → services`. Never reverse.
- **Path aliases:** `@common/*`, `@features/*`, `@shared/*`, `@layouts/*`, `@pages/*`, `@config/*`. See `tsconfig.app.json`.
- **Feature structure:** `src/features/<name>/{components,hooks,services,types,api}` plus a `README.md`.
- **File placement:** Whitelisted in `projectStructure.config.cjs`. Run `pnpm validate:structure` after structural additions. If a new directory is needed, propose a config edit and ask the user — do not modify the config silently.
- **Complexity ceilings:** cyclomatic ≤10, cognitive ≤15, function length ≤100 lines (often ≤50), nesting ≤4, params ≤3.

## Quality gates

Before declaring work done, run the relevant subset of:

```bash
pnpm lint            # ESLint + GTS
pnpm type-check      # tsc --noEmit
pnpm test:run        # Vitest one-shot
pnpm arch:check      # dependency-cruiser
pnpm validate:structure
```

These are also enforced by lint-staged via Husky on commit. Do **not** bypass with `--no-verify`.

## Protected files — ask before modifying

Per `.cursor/rules/workflow/RULE.md`, the following are protected and require **explicit user approval** before any edit:

- `.gitignore`
- `projectStructure.config.cjs`
- `.dependency-cruiser.cjs`, `.dependency-cruiser-baseline.json`
- `.eslintrc.json`, `eslint.config.js`, `eslint.ignores.js`
- `.cursor/**` and `.claude/**`
- `.husky/**`
- `package.json` (the `version` field is bumped only by `/finish`)

## Documentation policy

- `CHANGELOG.md` is updated **only by `/finish`** — never during planning or implementation.
- Per-feature `src/features/*/README.md` must be updated alongside feature code changes.
- Do **not** create new files under `documentation/` unless the user explicitly asks.

## Defaults Claude should follow

- **Always read before edit.** Run `pnpm validate:structure` if creating new files in unfamiliar locations.
- **Plan before non-trivial work.** Anything beyond a one-line fix should start with `/plan`.
- **Lean output.** Don't restate skill content — point to the file and follow it.
