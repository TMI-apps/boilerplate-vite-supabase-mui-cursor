# Extracted lens output

## Per-skill score table

Scores 1–5: triggers present · single primary outcome · negative-space.  
Vague-count = hits in `description`, `## Triggers`, routing/handoff lines, and routing instructions (not rubric checklist bullets).

| skill | triggers | outcome | negative-space | vague-count (must/nice) |
|-------|----------|---------|----------------|-------------------------|
| api-integrate | 4 | 5 | 3 | 0/1 |
| bundle-ship | 4 | 5 | 4 | 0/2 |
| caveman | 5 | 5 | 3 | 0/0 |
| challenge | 3 | 4 | 2 | 0/2 |
| consolidate | 4 | 4 | 3 | 0/2 |
| create-skill | 4 | 3 | 2 | 0/3 |
| debug | 5 | 5 | 4 | 0/0 |
| feature | 4 | 5 | 4 | 0/1 |
| finish | 4 | 5 | 4 | 0/4 |
| grill-me | 4 | 5 | 3 | 1/1 |
| hypothesis | 4 | 4 | 4 | 1/0 |
| implement | 4 | 5 | 4 | 0/0 |
| improve | 5 | 5 | 5 | 0/1 |
| improve-skill-library | 5 | 5 | 3 | 0/0 |
| layer-consistency-check | 5 | 5 | 5 | 1/0 |
| learn | 5 | 5 | 3 | 0/0 |
| optimize2 | 4 | 4 | 4 | 0/0 |
| pattern-review | 4 | 5 | 5 | 0/1 |
| plan | 4 | 5 | 4 | 0/3 |
| prime | 3 | 5 | 4 | 1/2 |
| purge-skill | 5 | 5 | 3 | 1/0 |
| push | 5 | 5 | 4 | 0/0 |
| quick-piv | 5 | 5 | 5 | 0/3 |
| react-perf-vite | 4 | 5 | 5 | 0/0 |
| review | 4 | 5 | 3 | 0/0 |
| review-dev-plan | 3 | 5 | 2 | 2/0 |
| rule-quality | 4 | 4 | 4 | 0/0 |
| router | 5 | 4 | 5 | 2/3 |
| standards-align | 5 | 5 | 5 | 1/0 |
| start | 4 | 5 | 3 | 0/1 |
| validate | 4 | 4 | 5 | 0/2 |
| write-adoption-guide | 4 | 5 | 4 | 0/0 |

**Totals:** 33 editable skills · **9 must-fix** · **32 nice-to-have** vague hits catalogued below.

---

## Cross-lens flags (overlap + vague trigger)

| Hotspot | Overlap / router issue | Vague trigger amplifies |
|---------|------------------------|-------------------------|
| **improve** | Facade over `standards-align`, `challenge`, `consolidate`, `layer-consistency-check`, `validate`, `review` — router tiebreak at `router/SKILL.md` § `improve` vs specialized | Low: description cites `/improve`, “clean up / make better”, etc. |
| **standards-align** | vs `pattern-review` (proactive plan gate) vs `challenge` — router tiebreak exists | **validate when appropriate** handoff (`standards-align/SKILL.md:149`) |
| **pattern-review** | vs `standards-align`, `layer-consistency-check`, `validate` — router tiebreak + order | Low: proactive cues are fairly concrete (M/L, novel contracts) |
| **layer-consistency-check** | vs `pattern-review`, `consolidate` § Semantic placement — router order tiebreak | **plan or quick-piv as appropriate** (`layer-consistency-check/SKILL.md:54`) |
| **challenge** | vs `standards-align`, `feature`, `improve` — router tiebreak | Weak negative-space (no sibling table); overlaps not driven by vague frontmatter |
| **consolidate** | vs `optimize2`, `layer-consistency-check` — router tiebreak | Soft lifecycle triggers in `## Triggers` (before major refactor / after organic growth) |
| **create-skill** | Local `.agents/skills/create-skill/` vs router → `~/.cursor/skills-cursor/create-skill/` — **not** in project skill index | Broad description bundles create + improve + eval (multi-outcome) |
| **purge-skill** | **Orphan:** not listed in `router/SKILL.md` skill index or situation tables | Proactive “sounds like it touches more than one file” in frontmatter |
| **hypothesis** | vs `debug` — router tiebreak exists | **“Use this whenever debugging…”** in frontmatter competes with `debug` |
| **review-dev-plan** | vs `validate` (plan-review), `pattern-review` (industry lens) — router plan-review stack | Weak **“Use when checking whether a plan is sound”** + **both when appropriate** |
| **prime** | vs `start`, clarification skills — router tiebreak | **“ambiguous tasks”** in description overlaps gate-1 routing |
| **grill-me** | vs `plan` § Refine — router Clarification-first | **“before feature or plan”** without gate-1 vs stress-test distinction |

---

## Findings list

Format: `severity | skill/file | phrase | family | suggested fix`

### must-fix

| severity | skill/file | phrase | family | suggested fix |
|----------|------------|--------|--------|---------------|
| must-fix | router/SKILL.md:7-9 (frontmatter `description`) | starts ambiguous work | Weak routing | IF user message has no clear primary outcome AND gates 1–2 not satisfied THEN read router § Clarification-first; IF mid-task signals present THEN thread continuation |
| must-fix | router/SKILL.md:65 | When unfamiliar with repo state mid-job | Deferred necessity | IF active job AND repo/branch context unknown THEN run `prime` once, then resume thread → next skill (do not backlog intake) |
| must-fix | hypothesis/SKILL.md:3 (frontmatter) | Use this whenever debugging a bug… | Weak routing | IF user invokes hypothesis mode OR naive fixes failed ≥1 THEN `hypothesis`; ELSE `debug` (cite router § debug vs hypothesis) |
| must-fix | grill-me/SKILL.md:8-9 (frontmatter) | Use to stress-test… before feature or plan | Weak routing | IF gate 1 fails (vision/tradeoffs) THEN `grill-me`; IF gate 2 fails (acceptance/APIs) THEN `plan` § Refine only; IF gates pass AND user wants stress-test THEN `grill-me` |
| must-fix | prime/SKILL.md:5 (frontmatter) | ambiguous tasks | Weak routing | IF new chat OR user asks what to do next without naming a skill THEN `prime`; do not use as substitute for `grill-me` / `plan` § Refine |
| must-fix | review-dev-plan/SKILL.md:5 (frontmatter) | Use when checking whether a plan is sound | Weak routing | IF `DEVELOPMENT_PLAN.md` exists AND Summary says `Plan review: Required: pending` (M/L) THEN `review-dev-plan`; not for repo-rule compliance (`validate` plan-review) |
| must-fix | review-dev-plan/SKILL.md:65 | run both when appropriate | Judgment handoff | IF Complexity M/L OR plan touches security/DB/workflow rules THEN run `review-dev-plan` AND `validate` (plan-review); IF only qualitative critique requested THEN `review-dev-plan` alone |
| must-fix | standards-align/SKILL.md:149 | Then `validate` when appropriate | Judgment handoff | IF Align-* or Mixed how choice changes `src/` OR pre-ship gate needed THEN `validate` (gate or impl-full); IF read-only gap report only THEN skip `validate` |
| must-fix | layer-consistency-check/SKILL.md:54 | hand off to `plan` or `quick-piv` as appropriate | Judgment handoff | IF structural path AND scope is XS/S THEN `quick-piv`; IF multi-phase/migration/contracts THEN `plan`; cite router § implement vs quick-piv |
| must-fix | purge-skill/SKILL.md:3 (frontmatter) | Also trigger proactively any time a deletion request sounds like… | Soft opt-in | IF user asks delete/remove AND target has call sites in tests/routes/config/docs (≥2 asset classes) THEN `purge-skill`; add router situation row + skill index entry |

### nice-to-have

| severity | skill/file | phrase | family | suggested fix |
|----------|------------|--------|--------|---------------|
| nice-to-have | api-integrate/SKILL.md:18 | Use this skill when researching an unfamiliar or new vendor/API | Weak routing | IF vendor is unfamiliar AND no fork-specific vendor skill AND not routine stack ops THEN `api-integrate` (link router § External API research) |
| nice-to-have | bundle-ship/SKILL.md:81 | archive task when applicable | Judgment handoff | IF session picked up or completed a backlog task THEN archive per `finish` § App task backlog before commit |
| nice-to-have | bundle-ship/SKILL.md:99 | use plain finish Option 3 if needed | Deferred necessity | IF other thread still active on same checkout THEN plain `finish` stash lane (user confirms pause) — not `bundle-ship` |
| nice-to-have | challenge/SKILL.md:200 | tests as applicable | Judgment handoff | IF option changes `src/` THEN run lint + type-check; IF behavior change THEN run related tests or manual repro steps |
| nice-to-have | challenge/SKILL.md:260 | Context questions (1-3 if needed) | Deferred necessity | IF target or goal missing after Phase 1 THEN ask ≤3 context questions before options |
| nice-to-have | consolidate/SKILL.md:27-28 (`## Triggers`) | Before a major refactor / After multiple features… | Soft opt-in | IF user names refactor/cleanup OR duplication audit requested THEN `consolidate`; remove proactive lifecycle triggers |
| nice-to-have | create-skill/SKILL.md:82,91 | as needed / As needed | Deferred necessity | Direct imperative: load `references/` when step requires template; scripts run without loading body |
| nice-to-have | create-skill/SKILL.md:461 | Read them when you need to spawn | Deferred necessity | IF spawning eval subagent THEN read `agents/` instructions for that subagent type |
| nice-to-have | feature/SKILL.md:215 | proactive — when applicable | Judgment handoff | IF Phase 3 architecture AND new user-visible/contracts THEN `pattern-review` `plan-section` per dev-cycle matrix |
| nice-to-have | finish/SKILL.md:13,27,177 | when applicable (backlog / onboarding / handoff) | Judgment handoff | IF `in-progress` task for session THEN archive; IF onboarding tasks completed THEN sync JSON; IF commit succeeded THEN output handoff card |
| nice-to-have | finish/SKILL.md:55 | paths when needed | Deferred necessity | IF stash lane AND untracked files belong to paused thread THEN include `-u` or explicit paths in stash |
| nice-to-have | finish/SKILL.md:144 | when applicable | Judgment handoff | IF ticket/issue id known THEN include in commit message |
| nice-to-have | grill-me/SKILL.md:15 | when relevant neighbors exist | Judgment handoff | IF perimeter names neighbor feature/route THEN read that neighbor before boundary questions |
| nice-to-have | improve/SKILL.md:68 | Vision check (only if needed) | Deferred necessity | IF `DOC_APP_VISION.md` thin/conflicting for target area THEN Phase 2; ELSE skip |
| nice-to-have | pattern-review/SKILL.md:80 | alert if needed | Deferred necessity | IF verdict is non-standard THEN post alert template and stop |
| nice-to-have | plan/SKILL.md:35 | Refine (if needed) | Deferred necessity | IF gates 1–2 fail THEN `plan` § Refine only (no `DEVELOPMENT_PLAN.md` yet) |
| nice-to-have | plan/SKILL.md:102 | update the plan as needed | Deferred necessity | IF `review-dev-plan` or user feedback changes scope THEN update affected plan sections |
| nice-to-have | plan/SKILL.md:147 | Optional sections (include when relevant) | Judgment handoff | IF plan touches DB/auth/API THEN include matching optional sections from template |
| nice-to-have | plan/references/rules-registry.md:15-18 | when applicable / when diagnosing | Judgment handoff | IF plan phase touches edge functions THEN link cloud-functions rule; IF debugging-heavy plan THEN link debugging rule |
| nice-to-have | prime/SKILL.md:29 | Skim DOC_TESTING when task adds tests | Activity gerund | IF task adds/changes tests THEN read `DOC_TESTING.md` during prime |
| nice-to-have | prime/SKILL.md:49 | when relevant | Judgment handoff | IF `documentation/jobs/temp_job_*/` exists THEN scan for active `DEVELOPMENT_PLAN.md` |
| nice-to-have | quick-piv/SKILL.md:86 | security/RULE.md when relevant | Judgment handoff | IF diff touches auth/RLS/secrets THEN read `security/RULE.md` during implement |
| nice-to-have | quick-piv/SKILL.md:87 | manual checks as appropriate | Judgment handoff | IF UI change THEN browser MCP gate; IF logic change THEN related tests or repro steps from quick plan |
| nice-to-have | quick-piv/SKILL.md:111 | Also when applicable | Judgment handoff | IF task touches queries or architecture THEN read `ARCHITECTURE.md` / `DOC_TANSTACK_QUERY.md` |
| nice-to-have | router/SKILL.md:361 | use when agent wiring dominates | Judgment handoff | IF building Agents SDK app THEN `agents-sdk`; IF exposing remote MCP server THEN `building-mcp-server-on-cloudflare` |
| nice-to-have | router/SKILL.md:458 | archiving session task when applicable | Judgment handoff | IF user invoked `/finish` OR thread signaled wrap-up THEN `finish` (includes archive when task in progress) |
| nice-to-have | router/SKILL.md:471 | prime (if needed) | Deferred necessity | IF idle backlog intake AND unfamiliar repo THEN `prime` before `grill-me`/`plan` |
| nice-to-have | start/SKILL.md:49 | optional Airtable/theme as applicable | Judgment handoff | IF fork backlog includes Airtable/theme tasks THEN verify those gates during onboarding |
| nice-to-have | validate/SKILL.md:46-47 | as applicable (conditional subagents) | Judgment handoff | Spawn `security`/`database`/`testing`/`workflow` subagents IFF plan/diff touches those domains |
| nice-to-have | validate/SKILL.md:154 | Use impl-full when you need the plan-vs-code comparison | Deferred necessity | IF `DEVELOPMENT_PLAN.md` governs scope THEN impl-full; IF no plan THEN gate |
| nice-to-have | write-adoption-guide/references/layer-mapping.md:3 | Use when writing §2 and §7 | Activity gerund | WHEN drafting adoption guide §2 and §7 THEN apply layer-mapping table |
| nice-to-have | api-integrate/references/vendor-airtable.md:11 | If you need a single SSOT | Deferred necessity | IF many `tbl`/`fld` constants needed THEN add shared module per file-placement rules |

---

## Structural notes (non-vague)

- **Strong negative-space:** `improve`, `layer-consistency-check`, `pattern-review`, `standards-align`, `quick-piv`, `validate`, `react-perf-vite`.
- **Weak negative-space:** `challenge`, `review-dev-plan`, `create-skill`, `consolidate` (siblings inline only).
- **Dual-outcome skills:** `consolidate` (redundancy audit vs semantic placement), `rule-quality` (Mode A vs B), `validate` (three auto modes — intentional), `create-skill` (create vs eval loop).
- **Router spine:** tiebreak coverage is broad; main gaps are **purge-skill** (missing from index) and **local create-skill** (router points to user-level path).

No files were edited.

[REDACTED]
