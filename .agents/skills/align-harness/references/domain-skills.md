# Domain — `.agents/skills/**`

Audited by **Lenses 1–5** (inherited from skill-library audit).

## Scope

- `SKILL.md` + `references/` per skill
- Router situation table + skill index
- Handoff DAG vs `skill-relationship-flow.md`

## SSOT rules

| Concept | Owner |
|---------|-------|
| Situation → skill routing | `router/SKILL.md` |
| Per-skill procedure | That skill's `SKILL.md` |
| Relationship diagram | `router/references/skill-relationship-flow.md` |

## Common findings

- Two skills same trigger without router tiebreak
- Literal duplication of rubrics/checklists
- Skill added without router/layers update

## Resolution patterns

- One primary outcome per skill; tiebreak in router
- Move concept to single owner; link elsewhere
- Update router + layers doc on add/remove/rename
