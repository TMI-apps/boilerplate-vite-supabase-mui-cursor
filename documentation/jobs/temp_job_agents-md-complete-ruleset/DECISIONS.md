# Decisions — agents-md-complete-ruleset

Job: `temp_job_agents-md-complete-ruleset`
Updated: 2026-08-12

## Closed

| id | topic | status | choice | source | notes |
|----|-------|--------|--------|--------|-------|
| D1 | Problem + success (v1) | superseded | Portable single AGENTS.md full ruleset | grill-me | Superseded by D6 pivot |
| D2 | Perimeter (v1) | superseded | Full migrate + consolidate into AGENTS.md | grill-me | Superseded by D6 |
| D3 | Fate of `.cursor/rules/` | superseded | Delete after migrate | grill-me | Keep separate — D6 |
| D4 | Fate of `.claude/rules/` | superseded | Delete | grill-me | Out of scope after pivot |
| D5 | Skills vs AGENTS (v1) | cancelled | — | grill-me | Pivot cancelled |
| D6 | Problem + success (v2) | closed | Keep rules separate; AGENTS.md catalogs each rule with frontmatter `description` so agents know what each file is for | grill-me | Breadcrumbs alone insufficient; Claude needs in-file catalog |
| D7 | Perimeter (v2) | closed | Update AGENTS.md — portable rule catalog from YAML; do not inline bodies; do not delete `.cursor/rules/` | grill-me | Improve catalog, not migrate content |
| D8 | Catalog SSOT + Claude portability | closed | Short “what for” SSOT = YAML `description`; AGENTS = portable catalog; INDEX = Cursor-only deep topic map | grill-me | Claude loads AGENTS only |
| D9 | AGENTS↔YAML sync | closed | Audit-only in `align-harness` Lens 6; hand-copy for now | grill-me | Implemented in `temp_job_harness-skills` (D6) |
| D10 | Follow-up skill | closed | **Done** — `align-harness` + `update-harness` in `documentation/jobs/temp_job_harness-skills/`; see `documentation/jobs/harness/BACKLOG.md` | grill-me | Was: queue `improve-harness` |
| D11 | Catalog row fields | closed | Path + `description` + `alwaysApply` / `globs` | grill-me | Wins UX |
| D12 | Cursor `@` imports | closed | Keep current `@` imports unchanged; portable catalog follows YAML truth | grill-me | Accept `@` set ≠ alwaysApply set |
| D13 | AGENTS line budget | closed | Relax “keep under 100 lines” — catalog needs room | grill-me | clear-winner: rejected keep-100 (forces truncation) and split-file catalog (breaks Claude single-file load) |

## Open

| id | topic | status | options briefly | blocked phase |
|----|-------|--------|-----------------|---------------|
| — | — | — | — | — |

## Log

- 2026-08-12T06:32 — D1 closed via grill-me (asked): full AGENTS ruleset portability
- 2026-08-12T06:35 — D2 closed via grill-me (asked): migrate + consolidate
- 2026-08-12T06:37 — D3 closed via grill-me (asked): delete `.cursor/rules/`
- 2026-08-12T06:39 — D4 closed via grill-me (asked): delete `.claude/rules/`
- 2026-08-12T06:44 — Pivot: D1–D4 superseded; D5 cancelled; D6–D7 closed
- 2026-08-12T08:01 — UX explain: INDEX = `.cursor/rules/INDEX.md`
- 2026-08-12T08:03 — D8 closed via grill-me (asked)
- 2026-08-12T08:09 — D9–D10 closed via grill-me (asked): hand-copy; queue `improve-harness`
- 2026-08-12T08:34 — D11 closed via grill-me (asked): path + description + alwaysApply/globs
- 2026-08-12T08:35 — D12 closed via grill-me (asked): keep `@` imports; catalog = YAML truth
- 2026-08-12T08:35 — D13 closed via grill-me (clear-winner): relax 100-line budget
