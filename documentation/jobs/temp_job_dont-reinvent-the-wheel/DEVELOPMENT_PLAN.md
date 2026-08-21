# Development plan: Don't reinvent the wheel skill

## Summary

- **Goal:** Land `.agents/skills/dont-reinvent-the-wheel/` with the user's procedure, wire callers/disambiguation, and add a thin always-on architecture pointer.
- **Why:** Agents skip live package/pattern search and over-anchor on first hits or stale memory; this repo already has `pattern-review` (design precedent) and `api-integrate` (vendor contract) but not reuse-vs-custom.
- **Complexity:** S — harness glue, no `src/` behavior; many files but mechanical.
- **Plan review:** Not required
- **Scope / constraints:** See sibling `DECISIONS.md` D1–D9. Skill stops at recommendation. No evals this job.

## Phase overview

| Phase | Goal | Gate | Status |
|-------|------|------|--------|
| 1 | Skill + architecture pointer + layers | Files exist; steps 0–5 intact; rule is a pointer only | Done |
| 2 | Callers + router + sibling NOT tables | Each listed skill has a one-line call or not-row; no duplicated procedure | Done |

## Conflict & compliance

- Applicable rules: `file-placement/RULE.mdc` (`.agents/skills/*/SKILL.md` whitelisted), `agent-behavior/RULE.mdc` (protected skills/rules — user asked for skill wiring + D9 for architecture), `architecture/RULE.mdc` (pointer only, do not copy the 5 steps), `workflow/RULE.mdc` routing table if needed (no — architecture owns this).
- File placements: `.agents/skills/dont-reinvent-the-wheel/SKILL.md`; edits to existing skills/docs/rules listed in phases.
- Risks: overlap with `pattern-review` / `api-integrate` if wording blurs; keep D3/D4 sentences.
- Standards diversions: none.

## Pattern & precedent

**Pattern review:** skipped — no new user-facing app contract; harness procedure only.

## Notes during development

_(empty)_

## Decisions made

Impl-time only. Product/scope forks → sibling `DECISIONS.md`.

| # | Topic | Choice | Precedent? |
|---|-------|--------|------------|

## Phase 1 — Skill + always-on pointer

### Goal

Ship the skill SSOT and the architecture reminder.

### Steps

1. Write `.agents/skills/dont-reinvent-the-wheel/SKILL.md`: frontmatter `name` + `description` verbatim from the user; `disable-model-invocation: false`; body = user Steps 0–5, examples, non-goals; add repo **Integration** (callers, order vs `pattern-review` / `api-integrate`, persist rec in plan Conflict & compliance).
2. Add thin § after Pattern risk in `architecture/RULE.mdc`; one INDEX.md bullet; `DOC_AGENT_WORKFLOW_LAYERS.md` section + "When you change" row.
3. Plan template: reuse / packages line under Conflict & compliance.

### Gate

Skill file <500 lines; architecture section links the skill and does not paste Steps 0–5.

## Phase 2 — Callers and disambiguation

### Goal

Agents hit the skill from plan/implement/feature/quick-piv/router without inventing a second procedure.

### Steps

1. `plan` Investigate: after existing internal reuse search, run this skill when Step 1 would continue; Related + Boundaries row.
2. `feature` new § 3.1a before 3.1b.
3. `implement` catch if no rec recorded and Step 1 still true; Boundaries row.
4. `quick-piv` investigation: same Step 1 gate.
5. `router`: situation row, overlap vs `pattern-review` and `api-integrate`, skill index; `dev-cycle-matrix` Investigate note; `skill-relationship-flow` side door.
6. NOT/handoff rows: `pattern-review`, `api-integrate`, `plan-grill`, `validate`, `layer-consistency-check`; `create-skill` Next.

### Gate

Grep for `dont-reinvent-the-wheel` hits each listed caller; procedure lives only in the new SKILL.md.
