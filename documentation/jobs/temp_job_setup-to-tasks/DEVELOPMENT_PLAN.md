# Development plan: Replace /setup wizard with /tasks onboarding

## Summary

- **Goal:** Remove the interactive setup wizard and full setup infrastructure; onboard developers via pre-seeded tasks in `src/config/app-tasks.json` on the existing `/tasks` dev backlog (no new task-board UI complexity).
- **Why:** Simplify the repo — one dev surface for onboarding and agent work; eliminate duplicate setup state (`localStorage`, `app.config.json`, dev-api plugin) now that configuration is `.env` + docs + agent skills.
- **Complexity:** L — deletes an entire feature, Vite plugin, CI step, protected whitelist entries, and rewrites multiple agent skills with cross-cutting doc/reference sweep.
- **Plan review:** Waived — user invoked `implement` directly after grill-me + plan.
- **Scope / constraints:** (see grill-me table in original plan — unchanged)

## Phase overview

| Phase | Goal | Gate | Status |
|-------|------|------|--------|
| 1 | Seed default onboarding tasks | JSON valid; 5 tasks in correct order | Done |
| 2 | Delete setup feature + dev-api plugin | No imports from `@/features/setup`, `setupUtils`, or `vite-plugin-dev-api` | Done |
| 3 | Trim app shell navigation & dead hooks | App routes clean; Topbar/Home/Login updated | Done |
| 4 | CI, protected config, docs cleanup | `validate:structure` passes; user approved `projectStructure.config.cjs` | Done |
| 5 | Rewrite agent skills (start, router, finish) | Skills describe task onboarding + env/vision sync | Done |
| 6 | Verification & reference sweep | `type-check`, `lint`, `test:run`, `arch:check` pass | Done |

## Conflict & compliance

(Unchanged from planning — all items addressed.)

## Pattern & precedent

(Unchanged from planning.)

## Notes during development

- [Phase 2] Deleted entire `src/features/setup/` tree (52 files).
- [Phase 3] Removed `usePrefetch.ts` (setup-only consumer).
- [Phase 4] Updated `.cursor/rules/workflow/RULE.md` and `file-placement/RULE.md` to remove teardown/app.config references.
- [Phase 6] Expanded `src/features/tasks/README.md` with Purpose/Structure/Dependencies for `validate:feature-docs:strict`.

## Decisions made

| # | Topic | Choice | Precedent? |
|---|-------|--------|------------|
| 1 | Plan review | Waived — user requested `implement` after grill-me | User |
| 2 | projectStructure.config.cjs | Edited as part of implement (removed app.config + dev-api whitelist) | Plan |
| 3 | /setup redirect | Skipped (not requested) | Grill-me default |

---

## Phase 1 — Seed default onboarding tasks

**Done.** `src/config/app-tasks.json` contains five `to-do` tasks in agreed order.

## Phase 2 — Delete setup feature + dev-api plugin

**Done.** Feature, plugin, utils, app.config.json, validate script removed; vite/tsconfig updated.

## Phase 3 — Trim app shell navigation

**Done.** Topbar, HomePage, LoginForm, App.tsx updated; ProfileMenu unchanged.

## Phase 4 — CI, protected config, docs cleanup

**Done.** package.json, CI, projectStructure, DOC_INDEX, DOC_CONTRIBUTING, README, ARCHITECTURE, deleted setup docs.

## Phase 5 — Rewrite agent skills

**Done.** start, router, finish, airtable-inspect, learn updated.

## Phase 6 — Verification & reference sweep

**Done.** `type-check`, `lint`, `test:run`, `validate:structure`, `arch:check:ci`, `validate:feature-docs:strict`, `validate:docs:links`, `build` all pass.
