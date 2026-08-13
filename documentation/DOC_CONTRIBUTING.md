# How to Contribute Safely

This guide points you to the canonical process documents. Follow these links for authoritative rules—do not rely on duplicated text elsewhere.

## Before You Start

1. **Workflow SSOT** – [`.agents/skills/finish/SKILL.md`](../.agents/skills/finish/SKILL.md)  
   - Commit format, versioning, changelog sync  
   - Run this command before committing

2. **Branch strategy** – [`.cursor/rules/git-workflow/RULE.mdc`](../.cursor/rules/git-workflow/RULE.mdc)  
   - Mode: [`src/config/git-workflow.json`](../src/config/git-workflow.json) (Model A default / Model B opt-in)  
   - § Mode-aware branch gate; PRs (Model A); production promotion (both)

3. **Protected files** – [`.cursor/rules/agent-behavior/RULE.mdc`](../.cursor/rules/agent-behavior/RULE.mdc)  
   - Files requiring explicit user approval before agent edits

4. **Architecture SSOT** – [`.cursor/rules/architecture/RULE.mdc`](../.cursor/rules/architecture/RULE.mdc)  
   - Layer rules, code placement, import patterns  
   - See also: [ARCHITECTURE.md](../ARCHITECTURE.md), [projectStructure.config.cjs](../projectStructure.config.cjs), [.dependency-cruiser.cjs](../.dependency-cruiser.cjs)

5. **Release & changelog SSOT** – [`.agents/skills/finish/SKILL.md`](../.agents/skills/finish/SKILL.md)  
   - Version bump rules, changelog format, version sync

## CI Gate Expectations

**Pre-commit hook** runs staged tests (related or full), type-check, and validators on app-surface commits. See `documentation/DOC_AGENT_WORKFLOW_LAYERS.md` § Local git.

**Before opening a PR** (Model A) **or pushing `develop`** (Model B), ensure CI parity locally:

| Check | Command |
|-------|---------|
| Classifier + executor tests | `pnpm test:classify` |
| Vitest suite | `pnpm test:run` |
| Preview staged test selection | `pnpm test:staged` (after `git add`) |
| Type check | `pnpm type-check` |
| Lint | `pnpm lint` |
| Format | `pnpm format:check` |
| Version/changelog sync | `pnpm validate:version-sync` |
| Git workflow mode config | `pnpm validate:git-workflow` |
| Structure | `pnpm validate:structure` |
| Architecture | `pnpm arch:check:ci` |
| Build | `pnpm build` |

CI runs these on every push to `main` or `develop` and every PR targeting `main` or `develop`. The **authoritative gate** is the green CI `test` job on `develop`.

## How to write tests

See **[DOC_TESTING.md](./DOC_TESTING.md)** — runner choice, colocated file placement, naming (`should … when …`), and `tests/test-utils` helpers.

## Release Direction

Read mode from `src/config/git-workflow.json`:

- **Model A:** `feature/*` → `develop` via squash PR after checks
- **Model B:** commit and push directly to `develop` (no daily PR); watch branch CI
- `develop` deploys to stable staging (Cloudflare Workers Builds); Model A may also use per-branch PR previews
- Production: **Promote to production** workflow — ff `main` ← `develop` (no squash PR `develop` → `main`, no back-merge)
- Never push app code to `main` (except promote workflow / rare emergency exception)

**Model B staging note:** Workers Builds may deploy a `develop` push before CI `test` is green. Production still requires green tip + promote.

## Mid-project mode switch

No automated migrator. Manual steps:

1. Finish or close open `feature/*` PRs (merge to `develop` or abandon).
2. Update GitHub `develop` ruleset to match the target mode (see `.cursor/rules/git-workflow/RULE.mdc` § Branch Protection).
3. Set `"mode"` in `src/config/git-workflow.json` to `model-a` or `model-b`.
4. `git switch develop && git pull origin develop` (or create a fresh `feature/*` if switching to Model A).
5. Confirm agents read the new mode (`pnpm validate:git-workflow`).

## Finding Authoritative Rules

- **≤3 clicks**: Start at [documentation/DOC_INDEX.md](./DOC_INDEX.md) → DOC_CONTRIBUTING → SSOT links above.
- **Protected files** (e.g. `.cursor/**`, `.husky/**`, `projectStructure.config.cjs`) require explicit approval before changes.
