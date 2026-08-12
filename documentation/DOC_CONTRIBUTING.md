# How to Contribute Safely

This guide points you to the canonical process documents. Follow these links for authoritative rules—do not rely on duplicated text elsewhere.

## Before You Start

1. **Workflow SSOT** – [`.agents/skills/finish/SKILL.md`](../.agents/skills/finish/SKILL.md)  
   - Commit format, versioning, changelog sync  
   - Run this command before committing

2. **Branch strategy** – [`.cursor/rules/git-workflow/RULE.mdc`](../.cursor/rules/git-workflow/RULE.mdc)  
   - Branch naming, Model A flow (`feature/*` -> `develop` -> promote -> `main`), PRs, production promotion

3. **Protected files** – [`.cursor/rules/agent-behavior/RULE.mdc`](../.cursor/rules/agent-behavior/RULE.mdc)  
   - Files requiring explicit user approval before agent edits

4. **Architecture SSOT** – [`.cursor/rules/architecture/RULE.mdc`](../.cursor/rules/architecture/RULE.mdc)  
   - Layer rules, code placement, import patterns  
   - See also: [ARCHITECTURE.md](../ARCHITECTURE.md), [projectStructure.config.cjs](../projectStructure.config.cjs), [.dependency-cruiser.cjs](../.dependency-cruiser.cjs)

5. **Release & changelog SSOT** – [`.agents/skills/finish/SKILL.md`](../.agents/skills/finish/SKILL.md)  
   - Version bump rules, changelog format, version sync

## CI Gate Expectations

**Pre-commit hook** runs staged tests (related or full), type-check, and validators on app-surface commits. See `documentation/DOC_AGENT_WORKFLOW_LAYERS.md` § Local git.

**Before opening a PR**, ensure CI parity locally:

| Check | Command |
|-------|---------|
| Classifier + executor tests | `pnpm test:classify` |
| Vitest suite | `pnpm test:run` |
| Preview staged test selection | `pnpm test:staged` (after `git add`) |
| Type check | `pnpm type-check` |
| Lint | `pnpm lint` |
| Format | `pnpm format:check` |
| Version/changelog sync | `pnpm validate:version-sync` |
| Structure | `pnpm validate:structure` |
| Architecture | `pnpm arch:check:ci` |
| Build | `pnpm build` |

CI runs these on every push to `main` or `develop` and every PR targeting `main` or `develop`. The **merge gate** is the green CI `test` job on `develop`.

## How to write tests

See **[DOC_TESTING.md](./DOC_TESTING.md)** — runner choice, colocated file placement, naming (`should … when …`), and `tests/test-utils` helpers.

## Release Direction

- Model A: `feature/*` -> `develop` (via squash PR after checks and validation)
- `develop` deploys to stable staging (Cloudflare Workers Builds); optional per-branch previews for PRs
- Production: run **Promote to production** workflow (`promote-to-production.yml`) to fast-forward `main` to `develop` — no squash PR `develop` -> `main`, no back-merge `main` -> `develop`
- Never push directly to `main` or `develop` — rulesets require PRs (except promote workflow on `main`)

## Finding Authoritative Rules

- **≤3 clicks**: Start at [documentation/DOC_INDEX.md](./DOC_INDEX.md) → DOC_CONTRIBUTING → SSOT links above.
- **Protected files** (e.g. `.cursor/**`, `.husky/**`, `projectStructure.config.cjs`) require explicit approval before changes.
