# Rules registry (SSOT for skill cross-links)

Canonical paths for `.cursor/rules/` when skills need a rules table. Full descriptions: [`.cursor/rules/INDEX.md`](../../../../.cursor/rules/INDEX.md).

| Topic | Rule file |
|-------|-----------|
| Overview / index | `.cursor/rules/INDEX.md` |
| Architecture | `.cursor/rules/architecture/RULE.md` — layers, import direction, path aliases, structure whitelist |
| File placement | `.cursor/rules/file-placement/RULE.md` and `projectStructure.config.cjs` |
| Code style | `.cursor/rules/code-style/RULE.md` — naming, complexity limits |
| Database | `.cursor/rules/database/RULE.md` — migrations, idempotent patterns |
| Security | `.cursor/rules/security/RULE.md` — auth, RLS, validation, secrets |
| Testing | `.cursor/rules/testing/RULE.md` |
| Workflow hub | `.cursor/rules/workflow/RULE.md` — code review, dev process, routing |
| Git workflow | `.cursor/rules/git-workflow/RULE.md` — branch strategy, PRs, promote |
| Agent behavior | `.cursor/rules/agent-behavior/RULE.md` — protected files, decision protocol |
| Platform | `.cursor/rules/platform/RULE.md` — PowerShell, env vars |
| Cloud / Edge | `.cursor/rules/cloud-functions/RULE.md` — when applicable |
| External API integration | `.cursor/rules/api-integration/RULE.md` — MCP-first, doc research, POC before code |
| Debugging | `.cursor/rules/debugging/RULE.md` — when diagnosing complex issues |
| Project-specific | `.cursor/rules/project-specific/RULE.md` — when applicable |

**Callers:** `plan`, `implement`, `quick-piv`, `validate` — link here; do not copy this table into skill bodies.
