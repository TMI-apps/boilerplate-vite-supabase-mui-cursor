# Changesets (release flow)

How version bumps on `develop` relate to feature work and **`finish`**.

## Feature branches

- Add a changeset under `.changeset/*.md` when the change should appear in the next release (user-facing or semver-relevant).
- **`finish`** owns conventional commits, `package.json` version sync, and `CHANGELOG.md` on the feature branch (see `.agents/skills/finish/SKILL.md`).

## On `develop`

- **Version packages:** `.github/workflows/version-packages.yml` consumes changesets and bumps versions.
- Agents: do not hand-edit release mechanics here — follow **`finish`** on feature branches and the workflow in `.cursor/rules/workflow/RULE.md`.

## Related

- Layer model: `documentation/DOC_AGENT_WORKFLOW_LAYERS.md` § Release and versioning
- Commit/changelog SSOT: `.agents/skills/finish/SKILL.md`
