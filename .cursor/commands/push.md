# push

Push previously finished work to remote. This command is push-only.

## Preconditions (Mandatory)

1. `finish` must have been executed first for the changes you want to push.
   - `finish` is the only command that may prepare and commit those changes.
2. Working tree must be clean before push:
   - no unstaged changes
   - no staged but uncommitted changes
   - no untracked files that belong to the intended change set
3. There must be at least one local commit to push.

## Hard Restrictions

- **Never run `git add` in this command.**
- **Never run `git commit` in this command.**
- **Never create, amend, or modify commits in this command.**
- If there are uncommitted changes, STOP and instruct the user to run `finish` first.

## Push Safety Flow

1. Verify branch (never push from `main` for development flow).
2. Verify clean working tree.
3. Verify commits exist to push.
4. Verify remote freshness before push:
   - Run `git fetch origin`
   - Check whether local branch is behind its remote counterpart
   - If behind, STOP and sync first (rebase or merge) before pushing
5. Confirm push target relevance:
   - **Preferred**: push feature branch (`feature/*`) and merge via PR
   - **Shared branches** (`experimental`): avoid direct push in shared workflows; prefer PR-based updates
   - **App-specific changes**: ensure remote points to app repo, not boilerplate repo
6. Ask user for explicit confirmation: "Ready to push these already-committed changes?"
7. Execute push only after confirmation.

## Relationship with `finish`

- `finish` and `push` are intentionally split.
- `finish` = cleanup + version/changelog sync + commit (local only).
- `push` = remote validation + push (no commit operations).
- If `push` detects anything that still needs committing, it must stop and redirect to `finish`.

You have explicit access to use console commands for this task.
