# Decisions — don't reinvent the wheel

Job: `temp_job_dont-reinvent-the-wheel`
Updated: 2026-08-20

## Closed

| id | topic | status | choice | source | notes |
|----|-------|--------|--------|--------|-------|
| D1 | Skill location | closed | `.agents/skills/dont-reinvent-the-wheel/` (project, not `~/.cursor/skills/`) | plan-grill | clear-winner — must live with callers/router; personal skill cannot be wired into repo skills |
| D2 | Name + description | closed | Keep user `name` and `description` verbatim in frontmatter | plan-grill | clear-winner — create-skill verbatim rule; body may add repo Integration / What this is NOT without paraphrasing Steps 0–5 |
| D3 | Distinct from pattern-review | closed | Separate skill; do not merge | plan-grill | clear-winner — pattern-review = industry UX/API *design* fit; this = package-or-pattern *reuse* vs custom code. Order: this during Investigate (and feature 3.1) *before* locking build-from-scratch; then `pattern-review` on the chosen approach |
| D4 | Distinct from api-integrate | closed | Separate; this first when a client/SDK might exist | plan-grill | clear-winner — api-integrate researches a vendor contract; this asks whether a maintained client already covers the work |
| D5 | Primary call sites | closed | `plan` Investigate + `feature` § 3.1 + catch in `implement` / `quick-piv` | plan-grill | clear-winner — plan/feature before locking custom; implement/quick-piv only if Step 1 still true and no rec already recorded |
| D6 | Persistence of recommendation | closed | Compact rec in plan Conflict & compliance (existing reuse slot); `DECISIONS.md` only if license/coupling is a product fork | plan-grill | clear-winner — skill still stops at recommendation (no install/code); plan records it so implement does not re-search blindly |
| D7 | Wiring breadth | closed | Router + layers + callers + sibling NOT tables; no merge into other skills' procedures | plan-grill | clear-winner — `router` situation/overlap/index; `DOC_AGENT_WORKFLOW_LAYERS`; `plan`/`implement`/`quick-piv`/`feature`; `pattern-review`/`api-integrate`/`plan-grill`/`validate` "not" rows; `create-skill` Next; skip eval loop unless asked |
| D8 | Non-goals | closed | No install; no adapted code; no other-private-repo search; no eval/benchmark loop this job | plan-grill | clear-winner — user's "What this skill deliberately doesn't do" + create-skill evals deferred |
| D9 | Always-on reminder in architecture rule | closed | Thin `architecture/RULE.mdc` pointer + INDEX.md (same shape as Pattern risk) | plan-grill | asked — [Wins: trigger fidelity / code consistency] |

## Open

_(none)_

## Log

- 2026-08-20 — D1–D8 closed via plan-grill (clear-winner)
- 2026-08-20 — D9 opened via plan-grill (asked)
- 2026-08-20 — D9 closed via plan-grill (asked) — rule pointer
