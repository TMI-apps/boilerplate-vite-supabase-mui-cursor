# Disposition rubric

| Signal | Disposition | Default action |
|--------|-------------|----------------|
| Near-duplicate of existing skill section | **merge** | Patch owner `SKILL.md` / `references/` |
| New workflow, no owner | **new-skill** | Ask before creating folder |
| Rule prose fragment | **merge-rule** | Target `.cursor/rules/<cat>/RULE.mdc` — protected |
| Vendor template / wrong stack | **reject** | Report only; do not apply |
| Copy with license header | **ingest-attributed** | Preserve license row in report |
| Orphan with no inbound refs | **align-handoff** | Run `align-harness` foreign lens |

**Prefer:** merge > narrow existing > new file.

**Never:** auto-apply to `.cursor/**` without explicit protected-path approval.
