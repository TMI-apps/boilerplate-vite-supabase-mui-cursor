# Domain — `AGENTS.md`

Audited by **Lens 6 (catalog drift)** and **Lens 8 (loadability)**.

## Scope

- Portable catalog rows (path + YAML `description` + `alwaysApply` / `globs`)
- `@` imports (Cursor double-load risk)
- Defaults section cross-links

## SSOT rules

| Concept | Owner |
|---------|-------|
| Rule bodies | `.cursor/rules/**/RULE.mdc` |
| Short "what for" | YAML `description` on each `RULE.mdc` |
| Portable catalog copy | `AGENTS.md` tables |
| Deep topic map | `.cursor/rules/INDEX.md` |

## Common findings

- Catalog row path still says `RULE.md` after `.mdc` migration
- `@` import duplicates an `alwaysApply: true` rule body (Cursor double-load)
- Description in catalog diverges from YAML without update order note

## Resolution patterns

- Update YAML first, then catalog row
- Drop `@` imports for rules Cursor loads via `.mdc`; keep catalog for Claude/Codex
- Link to rule body; never inline prose from rules
