---
name: finish
description: >-
  Completes implementation wrap-up: concurrent-agent smoke checks, version/changelog when
  required, commit, and coordination before push. Use when closing a job, after implement/validate,
  or when the user runs /finish. Not push-only (use push) and not planning (use plan).
---

# finish

Complete the implementation by doing what you haven't done yet of these tasks:

## App task backlog — archive before git (when applicable)

**Same behavior as choosing `done` on `/tasks`:** remove the task from `src/config/app-tasks.json` and append `{ title, description, status: "done" }` to `src/config/app-tasks-archive.json`. Do **not** leave `done` rows in the active file.

**Always include task-list changes in the commit:** Whenever `src/config/app-tasks.json` or `src/config/app-tasks-archive.json` have pending changes, they **must** be staged in the commit you are about to make — no matter what else that commit contains. Never leave task-list updates out of a commit. This applies even when no archive ran this session (e.g. status edits made via `/tasks`).

Run this block **before** version/changelog edits and **before** any `git add` / `git commit`.

1. Read **only** `src/config/app-tasks.json`.
2. **Resolve which task to archive:** prefer the task this session executed (usually the single `in-progress` you picked up). If the user named a task for this finish, use that row. **Zero** `in-progress`: ask — skip archiving, archive a named task, or pause finish. **Multiple** `in-progress`: ask which to archive. **Already archived** (user set `done` in UI): do not duplicate; continue finish.
3. **Archive** at the resolved **active index** (remove from active preserving order; append to archive on disk). Use the same semantics as `POST /__dev/tasks/archive` with `{ index }` when the dev server is available, or edit both JSON files directly with validated shapes.
4. **Before `git add`:** when step 3 ran, the **same commit** must stage **both** backlog JSON files. Missing either after archiving is an error — fix before commit.
5. Restore is **not** part of `/finish` unless the user explicitly asks.

### Onboarding task sync (when applicable)

When this session completed onboarding work (Supabase env, hosting, vision doc, optional Airtable/theme):

1. Re-read `src/config/app-tasks.json` and check actual state (env vars, `DOC_APP_VISION.md` status).
2. Archive tasks that are truly done (same archive flow as above) — e.g. Supabase task after `VITE_SUPABASE_*` is set and verified.
3. For declined optional tasks (Airtable), archive with a skip note in the description or leave as `to-do` per user intent.
4. Do not add task-board UI complexity — file edits only; disk-wins if the user edited tasks in `/tasks` during the session.

## Concurrent work / other agent threads (same branch, same checkout)

**Smoke signals:** Before any mandatory version or changelog edit, `git commit`, or `git push` (including when running `.agents/skills/push/SKILL.md` after a local commit), treat the working tree as **unstable** if you observe **any** of:

- Unexpected modified or staged files, **or** a `git status` / diff that **shifts between two fresh reads** from disk without this thread having edited those paths.
- Hunks or files that **do not match** this thread’s assumed scope for the current finish.
- `package.json` or `CHANGELOG.md` behaving oddly (for example unexpected concurrent edits, conflicts or merge markers, or metadata that **no longer matches** the current full diff).
- Husky / pre-commit hooks or commit failing due to files **outside** this thread’s stated work.
- A **non-fast-forward** push requirement, or a sudden need to integrate remote updates **without** a clear single-writer explanation from this thread.
- Firm knowledge that **another agent session** is active on the **same branch and same checkout**.

**When any smoke appears:** Do **not** silently bump the version, write or edit changelog entries for release, commit, or push until the user selects one option under **User choice** below.

### User choice (required when smoke is present)

Call **AskQuestion** once with **exactly** these four options (you may shorten labels for the UI; keep the meanings intact):

1. **Pause finish —** Stop before version/changelog/commit/push. Tell the user what you observed; wait while they resolve concurrency; do **no** further finish steps until they explicitly ask you to continue.
2. **Bundle finish —** Re-read `git status` and the **full** diff from disk. Treat the branch as **one** release increment. Widen changelog and commit scope (and the version bump per [Semantic Versioning](#semantic-versioning-ssot) here) so they accurately describe **everything** that will be included in the commit—**explicit joint ownership** of the snapshot. Then continue the normal finish flow from that baseline.
3. **Stash lane (other thread paused) —** **Only** if the user **explicitly confirms** the other thread or agent is paused: run `git stash push` with flags appropriate so nothing important is left out of the stash (for example include untracked or explicit paths when needed); use a **clear stash message**. Run the remainder of finish on the cleaned tree, then commit and push per this skill (push via `.agents/skills/push/SKILL.md` when applicable). Then `git stash pop`, or `git stash apply` followed by `git stash drop`. If stash apply produces conflicts, **stop and report**; do **not** silently discard work. After a successful apply, briefly tell the user when it is safe to resume the other agent (for example after they have pulled or confirmed the pushed tip).
4. **Wait and re-check —** Wait **~3 minutes once** for this selection (for example `sleep 180` in the shell—**no** tight polling loops). Then re-read status and full diff from disk. If smoke is **gone** and the tree **matches only this thread’s intended work**, continue finish **without** widening scope. If smoke remains or the diff still includes changes this thread does not own, **do not** commit or push—call **AskQuestion** again with the **same four** options. **Do not** run another automatic ~3 minute wait for Option 4 after one has already run **for the same user selection**; a further wait requires a **new** explicit user pick of Option 4.

**Guardrails:** You cannot stop or suspend other agents. Options that depend on another thread being idle (**3**) or on time passing (**4**) rely on **user-stated truth** or on **clock time plus a clean re-read**, not on the assistant controlling other processes. For Option 4, claiming the tree is “only this thread’s work” **must** be justified by a **clean second read** of status and full diff from disk, **not** by assumption.

- remove temporary console logs
- remove instrumentation
- remove redundant/legacy code
- **If this was a debugging session that resulted in a fix:** update `.agents/skills/debug/patterns.md` (the debug pattern library) **only** when the insight is reusable.
  - Capture the pattern at the level of a **bug class**, not a single incident.
  - Use format: **Symptom class -> Likely cause classes -> Discriminator question -> First diagnostic move**.
  - Prefer cross-feature language (e.g. race conditions, stale state, config drift, schema mismatch, effect dependency loops).
  - Avoid incident-only details (exact variable names, one endpoint, one literal, one file) unless they represent a broader class.
  - Add a pattern only if it would likely help in future unrelated debug sessions (rule of thumb: useful in >= 20% of similar bug reports).
  - Keep it concise: max 4 bullets; each bullet should be actionable.
  - **Pattern quality gate (must pass all):**
    - Can this be recognized from symptoms before reading this repo's specific code?
    - Does it suggest at least one falsifiable check?
    - Would a different team/project still benefit from this guidance?
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
- **After a successful commit:** Tell the user the commit succeeded and offer **`.agents/skills/push/SKILL.md`** — do **not** invoke `push` in the same turn unless the user explicitly asks to push. Push requires its own confirmation (see `push` skill and `.cursor/rules/workflow/RULE.md`).

## Ready to commit? (required)

Before `git add` / `git commit`, match `.cursor/rules/workflow/RULE.md`: summarize what will be committed and ask whether the user is **ready to commit**. Do not proceed to version/changelog/commit until they confirm (unless they already explicitly invoked `finish` to commit this work).

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

## Faster commit (pre-commit light path)

After `git add`, expect hook behavior per **`documentation/DOC_AGENT_WORKFLOW_LAYERS.md`** § Local git (classifier SSOT: `scripts/change-classify.cjs`). Do not duplicate the matrix here.

- Do **not** use `--no-verify` to avoid slow hooks on app-code commits; fix tests or split commits (docs/migrations separate from `src/`).
- `git commit --amend` with an empty index may run the full hook; re-stage or accept.
- Tests run on **push** (`.husky/pre-push`), not on commit.

## Boundaries

| Not `finish` | Use instead |
|--------------|-------------|
| Remote `git push` | `.agents/skills/push/SKILL.md` (after commits exist) |
| Plan/impl validation | `.agents/skills/validate/SKILL.md` (auto-selects depth incl. pre-merge gate) |
| Commits during optimization/debug without user invoking finish | Stop; user must request `finish` |

You have explicit access to use console commands for this task. 