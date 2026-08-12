# Decisions — harness-skills

Job: `temp_job_harness-skills`
Updated: 2026-08-12

Scope: three harness-maintenance skills — `align-harness` (coherence audit), `update-harness` (external content intake), and a broadened `learn`.

## Closed

| id | topic | status | choice | source | notes |
|----|-------|--------|--------|--------|-------|
| D1 | Fate of `improve-skill-library` | closed | Absorb — rename to `align-harness` and widen scope in place; keep lens-subagent engine + no-loss gate; domains split into `references/domain-*.md` | plan-grill | Asked. Supersedes BACKLOG "do not stretch in place" — this is the dedicated task that backlog reserved (D10 of `temp_job_agents-md-complete-ruleset`) |
| D2 | Harness domains in scope | closed | `AGENTS.md`, `.cursor/rules/**` (bodies + YAML), `.cursor/rules/INDEX.md`, `.claude/rules/*`, `.agents/skills/**`, `ARCHITECTURE.md`, `documentation/DOC_AGENT_WORKFLOW_LAYERS.md`, subagent brief files | plan-grill | clear-winner — user enumerated these; alternatives (skills-only, rules-only) are what we are leaving behind |
| D3 | Ingest folder location | closed | `.agents/harness-inbox/**`, whitelisted in `projectStructure.config.cjs`, contents gitignored (tracked `README.md` only) | plan-grill | Asked. Rejected: `documentation/harness-inbox/*.md` (flat, no folder drops), tracked inbox (noisy diffs, vendored history) |
| D4 | `learn` upgrade depth + pipeline hook | closed | Broaden `learn` harness-wide and bloat-aware; capture mistake signals in existing `DEVELOPMENT_PLAN.md` § Notes during development during `implement`/`debug`; `finish` reads them and offers `/learn` before the handoff card; `bundle-ship` + `push` point at the same block | plan-grill | Asked. Rejected: retrospective-memory-only prompt in three skills; `finish`-only (bundle-ship bypasses it) |
| D5 | Job scope | closed | Author the skills + wire the spine, **then** run `align-harness` once; **apply** only capped trivial fixes in-job — structural fixes → follow-up job (D17) | plan-grill + review-dev-plan | Supersedes original "apply all approved fixes in this job". Phase 6 findings drive a separate `temp_job_harness-fixes` plan when blast radius is large |
| D6 | AGENTS ↔ rules YAML drift enforcement | closed | Audit-only lens inside `align-harness`; no dedicated catalog validator script, no CI wiring. D13 `harness_scan` may compare rows vs frontmatter as facts-only output | plan-grill | Rejected: `scripts/validate-harness-catalog.cjs` + CI. D13 supersedes the "no script" half for deterministic facts only |
| D7 | Skill names | closed | `align-harness` and `update-harness` | plan-grill | Asked. Rejected: `improve-harness` (backlog reservation; collides with `improve` facade), `harness-align`/`harness-update` pair |
| D8 | `align-harness` vs `update-harness` boundary | closed | `align-harness` = coherence of what is already in-repo; `update-harness` = intake of external content into the harness. Foreign-skill alarm is raised by `align-harness` and hands off to `update-harness` | plan-grill | clear-winner after enumerating alternatives |
| D9 | Persisted audit artifacts location | closed | Move live artifacts to `documentation/jobs/harness/` (registry, ledger, backlog, update reports); leave dated outputs in `documentation/jobs/skill-library/` as archive | plan-grill | clear-winner |
| D10 | Authoring path for the two skills | closed | Use `create-skill` for drafting/description work inside the plan phases; do not fork a second authoring procedure | plan-grill | clear-winner |
| D11 | Rule file extension (`.md` vs `.mdc`) | closed | Rename all 14 `.cursor/rules/*/RULE.md` → `RULE.mdc`; `AGENTS.md` stays the portable catalog | plan-grill | Evidence: cursor.com/docs/rules — plain `.md` in `.cursor/rules` is ignored |
| D12 | Always-on line budget | closed | Measure and report only in this job; over-budget is **advisory warning**, never hard block. Restructure 2,044 always-on lines → follow-up job | plan-grill | Sets severity tier for budget lens |
| D13 | Deterministic scan script | closed | `.agents/skills/align-harness/scripts/harness_scan.*` — light, structure-agnostic (D20); judgment lenses stay subagents; no CI/hook wiring | plan-grill | Whitelisted via `.agents/skills/*/scripts/*` |
| D14 | `AGENTS.md` `@` imports after `.mdc` rename | closed | **Option C:** drop `@` imports for the five rules Cursor auto-loads (`architecture`, `file-placement`, `code-style`, `workflow`, `agent-behavior`); keep portable **catalog rows** (path + YAML description) for Claude/Codex on-demand; keep `@.cursor/rules/INDEX.md` only | user + review-dev-plan | Avoids ~1,200-line double-load in Cursor; aligns with D12. `testing` / `debugging` / `security` stay catalog-only (no `@` today) |
| D15 | `update-harness` confirmation granularity | closed | Batch report confirm in one pass; per-item asks only for new-file creation, rejection, and protected-path writes | plan-grill | Batch = review; apply to `.cursor/**` still needs explicit approval per D18 |
| D16 | Inbox provenance record | closed | Committed update report is provenance SSOT; required fields: `origin`, `source URL or path`, `license/attribution` (or `unknown`), `content summary`, disposition | plan-grill | One-line origin note at drop time still required |
| D17 | Phase 7 scope | closed | Phase 6 = findings only (issue table, user picks). In-job apply cap: ≤5 **blocking** rows, no renames, no multi-file SSOT moves. Everything else → `documentation/jobs/temp_job_harness-fixes/` | review-dev-plan | Rebel + scale/mod consensus |
| D18 | Job-level protected-file consent | closed | One upfront scoped approval covering: `projectStructure.config.cjs` (×2), `.gitignore`, 14× rule renames, `.agents/skills/**` rewrites, and Phase 7 capped apply set. Record in plan **Decisions made** at implement start | review-dev-plan security lens | Per-path re-ask only when scope expands beyond this list |
| D19 | Concurrency policy | closed | Land or stash `feature/agents-md-portable-catalog` AGENTS work first; implement on dedicated `feature/harness-skills` branch; no parallel harness-maintenance agents on same checkout during Phases 1 and 6 | review-dev-plan | Thread continuation risk |
| D20 | `harness_scan` contract | closed | **Light + structure-agnostic:** discover by glob/link-walk from manifest entry points; emit facts not verdicts; fail soft (`unknown shape`) not hard error; no hardcoded file inventory; no import of `projectStructure.config.cjs` | user + review-dev-plan | Prevents script rot when harness layout changes |

## Open

| id | topic | status | options briefly | blocked phase |
|----|-------|--------|-----------------|---------------|
| — | — | — | — | — |

## Log

- 2026-08-12T08:5x — D1, D3, D4, D5 closed via plan-grill (asked)
- 2026-08-12T08:5x — D6, D7 closed via plan-grill (asked)
- 2026-08-12T08:5x — D2, D8, D9, D10 closed via plan-grill (clear-winner)
- 2026-08-12T09:2x — Precedent scan returned; HIGH risks raised
- 2026-08-12T09:26 — D11, D12, D13 closed via plan-grill (asked)
- 2026-08-12T09:2x — D15, D16 closed via plan-grill (clear-winner)
- 2026-08-12T09:2x — D14 opened (double-load risk)
- 2026-08-12T11:2x — `review-dev-plan` synthesis; D14 closed Option C (user); D17–D20 closed; D5 narrowed; plan updated
