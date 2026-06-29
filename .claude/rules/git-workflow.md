# Claude rule: git workflow

SSOT: `.cursor/rules/workflow/RULE.md` for branch strategy, protected files, and agent behaviors. `.agents/skills/finish/SKILL.md` for commit format, versioning, and changelog.

**Key behavioral reminders:**

- **Branch model:** `feature/*` → `develop` → promote workflow → `main`. Never commit to `main` or `develop` directly. Never force-push protected branches.
- **Commits happen in `/finish` only** — never during `/plan` or `/implement`.
- **Staging gate:** Before committing, show staged + unstaged lists. If unstaged work exists, **stop and ask**.
- **Pre-commit hooks:** Never use `--no-verify`. Fix the underlying issue instead.
- **Protected files** (need explicit user approval): full manifest in `.cursor/rules/workflow/RULE.md` § Protected Files — do not duplicate the list here.
