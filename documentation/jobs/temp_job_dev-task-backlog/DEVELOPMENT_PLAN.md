# Development plan: Dev-only in-app task backlog

## Summary

- **Goal:** `/tasks` backlog backed by `src/config/app-tasks.json` + archive; dev FAB; Vite `__dev` write API; router/finish integration.
- **Why:** In-repo SSOT for agents and UI with archive/restore.
- **Complexity:** L — plugin, feature UI (dnd-kit), skills, tests.
- **Plan review:** Waived — grill-me resolved product choices.
- **Scope / constraints:** Per user spec + grill: global dev FAB, minimal `/tasks` chrome, append-bottom create, disk-wins conflicts, multiple `in-progress`.

## Phase overview

| Phase | Goal | Gate | Status |
|-------|------|------|--------|
| 1 | Domain + plugin + JSON SSOT | Unit tests pass | Done |
| 2 | Feature UI + page + FAB | Manual dev smoke | Done |
| 3 | Router/finish skills | Skills match spec | Done |

## Conflict & compliance

- **Rules:** file-placement, architecture, workflow.
- **Placements:** `src/features/tasks/*`, `src/pages/tasks/TasksPage.tsx`, `src/components/common/DevTasksFab/`, `vite-plugin-dev-tasks.ts`, `src/config/app-tasks*.json`.
- **Risks:** `projectStructure.config.cjs` updated for JSON in `src/config`.

## Pattern & precedent

**Pattern review:** skipped — internal dev tool; precedents: local JSON + dev middleware (common).

## Decisions made

| # | Topic | Choice |
|---|-------|--------|
| 1 | FAB visibility | All `import.meta.env.DEV` |
| 2 | FAB scope | Global all routes |
| 3 | Conflicts | Disk wins, reload, drop pending text |
| 4 | New task | Append bottom |
| 5 | `/tasks` chrome | Minimal (no full Topbar) |
