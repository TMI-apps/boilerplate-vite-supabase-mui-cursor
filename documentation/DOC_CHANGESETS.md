# Changesets (release flow)

How version bumps on `develop` relate to feature work, production promotion, and **`finish`**.

Mode: `src/config/git-workflow.json`. Behavior: `.cursor/rules/git-workflow/RULE.md`.

## Model A — feature branches

- Add a changeset under `.changeset/*.md` when the change should appear in the next release (user-facing or semver-relevant).
- **`finish`** owns conventional commits, `package.json` version sync, and `CHANGELOG.md` on the feature branch (see `.agents/skills/finish/SKILL.md`).
- Version + changelog land with each feature PR via **`finish`** (squash-merged to `develop`).

## Model B — direct `develop`

- **`finish`** runs on `develop` (no feature branch). Version + changelog land with each push to `develop`.
- Prefer **one active agent per checkout** on `develop` — shared-branch contention is higher than Model A.
- Pushing to `develop` updates staging — it does **not** ship production.

## On `develop` (both modes)

- Merging or pushing to `develop` updates staging — it does **not** ship production.

## Production (`main`)

- Run **Promote to production** (`promote-to-production.yml`) to fast-forward `main` to `develop` after staging verification.
- Do not squash-merge `develop` into `main` or back-merge `main` into `develop`.

## Related

- Layer model: `documentation/DOC_AGENT_WORKFLOW_LAYERS.md` § Release and versioning
- Commit/changelog SSOT: `.agents/skills/finish/SKILL.md`
- Branch strategy SSOT: `.cursor/rules/git-workflow/RULE.md`
