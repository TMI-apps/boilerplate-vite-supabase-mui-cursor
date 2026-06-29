# Changesets (release flow)

How version bumps on `main` relate to feature work and **`finish`**.

## Feature branches

- Add a changeset under `.changeset/*.md` when the change should appear in the next release (user-facing or semver-relevant).
- **`finish`** owns conventional commits, `package.json` version sync, and `CHANGELOG.md` on the feature branch (see `.agents/skills/finish/SKILL.md`).

## On `main`

- Version + changelog land with each feature PR via **`finish`** (squash-merged to `main`).
- Agents: do not hand-edit release mechanics — follow **`finish`** on feature branches and the workflow in `.cursor/rules/workflow/RULE.md`.

## Related

- Layer model: `documentation/DOC_AGENT_WORKFLOW_LAYERS.md` § Release and versioning
- Commit/changelog SSOT: `.agents/skills/finish/SKILL.md`
