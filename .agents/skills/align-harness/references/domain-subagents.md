# Domain — subagent briefs

Audited by **Lens 2** and **Lens 4**.

## Scope

- `.agents/skills/*/references/subagent-briefs.md`
- Cursor/Claude subagent instruction files outside skills
- Task tool prompts duplicated in multiple skills

## SSOT rules

| Concept | Owner |
|---------|-------|
| Align-harness lens prompts | `align-harness/references/subagent-briefs.md` |
| Per-skill subagent prompts | That skill's `references/subagent-briefs.md` |

## Common findings

- Copy-pasted brief blocks across skills
- Brief references stale paths
- Lens subagent edits files (must stay read-only)

## Resolution patterns

- Link to SSOT brief; don't duplicate orient blocks
- One brief file per orchestrating skill
