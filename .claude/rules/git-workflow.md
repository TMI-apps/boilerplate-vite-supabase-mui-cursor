# Claude rule: git workflow

Canonical rule: `.cursor/rules/workflow/RULE.md`. This file is the Claude-side reminder.

## Branch strategy

`feature/*` → `experimental` → `main`

- **`main`** and **`experimental`** are long-lived and protected. Never commit to `main` directly. Never force-push either branch.
- New work goes on `feature/<short-name>`, branched from `experimental`.
- Merges into `main` happen through `experimental` only.

## Commit discipline

- Commits happen in `/finish`, **never** during `/plan` or `/implement`.
- `/finish` is local-only — it ends at a successful commit. Push happens via the `push` Cursor skill (`.cursor/skills/push/SKILL.md`) afterward.
- Use Conventional Commit prefixes:
  - `feat:` — new feature (bumps MINOR)
  - `fix:` — bug fix (bumps PATCH)
  - `docs:` — documentation only (no version bump)
  - `chore:`, `refactor:`, `test:`, `style:`, `perf:`, `build:`, `ci:` — see `.cursor/skills/finish/SKILL.md` for the full mapping
- MAJOR version bumps require **explicit user confirmation** before proceeding.

## Pre-commit hooks

- Husky + lint-staged enforce `eslint --fix`, `pnpm validate:structure`, and `pnpm arch:check` on staged files.
- **Never use `--no-verify`** to bypass these hooks. If a hook fails, fix the underlying issue and re-stage.

## Staging gate (from `/finish`)

Before committing, always show the user:

- Staged files: `git diff --name-only --cached`
- Unstaged files: `git diff --name-only`

If unstaged changes exist that overlap with or are adjacent to the staged set, **STOP and ask the user** what to include. Never auto-stage everything.

## Protected files

The following require **explicit user approval** before any edit, regardless of how routine the change seems:

- `.gitignore`
- `projectStructure.config.cjs`
- `.dependency-cruiser.cjs`, `.dependency-cruiser-baseline.json`
- `.eslintrc.json`, `eslint.config.js`, `eslint.ignores.js`
- `.cursor/**` and `.claude/**`
- `.husky/**`
- `package.json` (the `version` field is bumped only by `/finish`)
