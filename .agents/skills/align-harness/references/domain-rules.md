# Domain — `.cursor/rules/**`

Audited by **Lens 2 (SSOT)**, **Lens 6 (catalog drift)**, **Lens 8 (loadability)**.

## Scope

- `RULE.mdc` bodies and YAML frontmatter (`description`, `alwaysApply`, `globs`)
- Cross-rule references and INDEX deep links
- Always-on context budget (advisory)

## SSOT rules

| Concept | Owner |
|---------|-------|
| Rule prose | `.cursor/rules/<category>/RULE.mdc` |
| Short description | YAML `description` in same file |
| Topic index | `.cursor/rules/INDEX.md` |

## Common findings

- Stale `RULE.md` paths after migration
- Duplicate guidance across rules (supersede, don't parallel-copy)
- `alwaysApply: true` payload over advisory byte budget

## Resolution patterns

- Supersession note in body when absorbing another rule's section
- Mechanical drift → `harness_scan` facts + catalog lens
- Large budget fixes → follow-up plan (not blocking in cap apply)
