# How to Contribute Safely

This guide points you to the canonical process documents. Follow these links for authoritative rules—do not rely on duplicated text elsewhere.

## Before You Start

1. **Workflow SSOT** – [`.cursor/commands/finish.md`](../.cursor/commands/finish.md)  
   - Commit format, versioning, changelog sync  
   - Run this command before committing

2. **Branch strategy & protected files** – [`.cursor/rules/workflow/RULE.md`](../.cursor/rules/workflow/RULE.md)  
   - Branch naming, protected files, agent behaviors

3. **Architecture SSOT** – [`.cursor/rules/architecture/RULE.md`](../.cursor/rules/architecture/RULE.md)  
   - Layer rules, code placement, import patterns  
   - See also: [ARCHITECTURE.md](../ARCHITECTURE.md), [projectStructure.config.cjs](../projectStructure.config.cjs), [.dependency-cruiser.cjs](../.dependency-cruiser.cjs)

4. **Release & changelog SSOT** – [`.cursor/commands/finish.md`](../.cursor/commands/finish.md)  
   - Version bump rules, changelog format, version sync

## CI Gate Expectations

Before pushing, ensure these pass locally:

| Check | Command |
|-------|---------|
| Type check | `pnpm type-check` |
| Lint | `pnpm lint` |
| Format | `pnpm format:check` |
| Version/changelog sync | `pnpm validate:version-sync` |
| App config | `pnpm validate:app-config` |
| Structure | `pnpm validate:structure` |
| Architecture | `pnpm arch:check:ci` |
| Tests | `pnpm test:run` |
| Build | `pnpm build` |

CI runs these on every push/PR to `main`, `develop`, and `experimental`.

## Finding Authoritative Rules

- **≤3 clicks**: Start at [documentation/DOC_INDEX.md](./DOC_INDEX.md) → DOC_CONTRIBUTING → SSOT links above.
- **Protected files** (e.g. `.cursor/**`, `.husky/**`, `projectStructure.config.cjs`) require explicit approval before changes.
