# finish

Complete the implementation by doing what you haven't done yet of these tasks: 
- remove temporary console logs
- remove instrumentation
- remove redundant/legacy code
- **If this was a debugging session:** Check if a new error pattern was discovered that should be added to `.cursor/commands/debug.md` § "Common Error Pattern Recognition". Add it if:
  - The root cause was non-obvious and took multiple iterations to find
  - A senior developer hint would have significantly accelerated the fix
  - The pattern is generalizable (not repo-specific)
  - Format: 2-4 bullet points max (symptom, common causes, key question, debug approach)
- **MANDATORY:** Update version number in `package.json` to match changelog version
- **MANDATORY:** Update changelog (fetch date if unsure of date) - see `.cursor/rules/workflow/RULE.md` for Keep a Changelog format
- **MANDATORY:** If staged changes include `src/features/*` code, stage matching feature README updates (`src/features/*/README.md`)
- **MANDATORY:** Run feature-doc validation for staged files (`pnpm validate:feature-docs:staged`)
- **MANDATORY: Staging Decision Gate before commit**
  - Show both lists to the user:
    - staged files (`git diff --name-only --cached`)
    - unstaged files (`git diff --name-only`)
  - If unstaged changes exist, do **not** auto-decide. Inform user and ask what to do.
  - If unstaged changes overlap with staged/intended files, **STOP** and ask user to choose before committing.
  - If unstaged changes are unrelated, ask user explicitly whether to:
    - include them in this commit
    - keep them out and commit staged files only
    - abort finish for now
  - Never stage all changes automatically when unrelated unstaged work exists without explicit user confirmation.
- commit with proper message format (see commit message standards below)
- fix any issues found by pre-commit hook
- **CRITICAL:** If fixing requires modifying protected files (`.gitignore`, `projectStructure.config.cjs`, `.eslintrc.json`, `.cursor/**`, `.husky/**`, etc.), STOP and ASK the user first. See `workflow/RULE.md` § "Protected Files" for full list. NEVER modify these files without explicit user approval.
- check if architecture.md needs update
- do not create new deep docs during finish unless user explicitly requests it
- **Do NOT push in this command.** `finish` is local-only and ends at a successful commit.
- After `finish` creates the commit(s), run `.cursor/commands/push.md` to handle remote verification and push.

## Semantic Versioning (SSOT)

All projects must follow semantic versioning (MAJOR.MINOR.PATCH):
- **MAJOR (X.0.0):** Breaking changes
  - Major version bumps require explicit user confirmation before proceeding
  - Ask: "This is a MAJOR version bump (breaking change). Do you want to proceed?"
  - Only proceed after explicit user confirmation
- **MINOR (0.X.0):** New features (backwards compatible)
- **PATCH (0.0.X):** Bug fixes (backwards compatible)

**Conventional Commit Types to Version Mapping:**
- `feat:` - New feature (bumps MINOR version)
- `fix:` - Bug fix (bumps PATCH version)
- `docs:` - Documentation only changes (no version bump)
- `style:` - Code style changes (no version bump)
- `refactor:` - Code refactoring (no version bump)
- `perf:` - Performance improvements (bumps PATCH version)
- `test:` - Adding or updating tests (no version bump)
- `chore:` - Maintenance tasks, dependency updates (no version bump)

## Commit Message Standards (SSOT)

**Format:** `[VERSION] type: Feature/Change Title`

**Requirements:**
- Version number must be first (e.g., `[3.19.0]`)
- Use conventional commit types (see above)
- Commit message subject must match changelog feature title (with type prefix)
- **Commit body is REQUIRED** - must include details about what changed
- Reference issue/ticket numbers when applicable

**Example:**
```
[3.19.0] feat: User Profile Settings

- Implement user profile update functionality
- Add validation for profile fields
- Update user service to handle profile changes
- Add tests for profile update flow

Closes #123
```

**Note:** Commit message must match changelog entry. Husky pre-commit hook runs automatically (see `.husky/pre-commit` for SSOT). See `.cursor/rules/workflow/RULE.md` for Keep a Changelog format details and version synchronization requirements.

You have explicit access to use console commands for this task. 