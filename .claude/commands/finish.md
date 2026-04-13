---
description: Pre-commit finalization — version, changelog, staging gate, commit
---

# /finish

Read `.cursor/skills/finish/SKILL.md` and execute the finish workflow it describes.

That file is the single source of truth. Follow it verbatim — it has hard rules about staging, versioning, changelog, and protected files.

Critical reminders from the skill (do not substitute for reading the file):

- **MANDATORY:** Bump `package.json` `version` to match `CHANGELOG.md`, following semantic versioning. MAJOR bumps require explicit user confirmation.
- **MANDATORY:** Update `CHANGELOG.md` (Keep a Changelog format — see `@.cursor/rules/workflow/RULE.md`).
- **MANDATORY:** If staged changes touch `src/features/*` code, also stage matching `src/features/*/README.md` updates and run `pnpm validate:feature-docs:staged`.
- **MANDATORY: Staging Decision Gate** — show the user both staged and unstaged file lists. If unstaged work exists, **stop and ask** before deciding what to include. Never auto-stage everything.
- Use a Conventional Commit message (`feat:` / `fix:` / `docs:` / `chore:` …).
- If a pre-commit hook fails, **fix the underlying issue** — never use `--no-verify`.
- If a fix would touch protected files (`.gitignore`, `projectStructure.config.cjs`, `.eslintrc.json`, `.cursor/**`, `.claude/**`, `.husky/**`, etc.), **STOP and ask the user**.
- `/finish` is **local-only** — it ends at a successful commit. Do **not** push. After `/finish`, the user can run the `push` Cursor skill (`.cursor/skills/push/SKILL.md`) to handle remote.
