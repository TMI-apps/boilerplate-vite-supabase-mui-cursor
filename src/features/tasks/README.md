# Dev task backlog (`/tasks`)

In-repo development backlog for coding agents and local UI.

## Purpose

- Dev-only task board at `/tasks` for onboarding and agent work
- SSOT for active and archived tasks in JSON files
- Pre-seeded onboarding checklist on fresh clones (Supabase, Hosting, App vision, Airtable optional, Theme)

## Structure

| Layer | Path | Purpose |
|-------|------|---------|
| Components | `components/` | `TasksBacklogPanel`, `ActiveTaskList`, `ArchiveTaskList`, task rows, `TasksAutosaveIndicator`, `TasksListEmptyState`, `taskStatusUi` |
| Hooks | `hooks/` | `useAppTasksBacklog` — CRUD, reorder, archive/restore, dirty-aware text autosave |
| Services | `services/` | `appTasksDomain` — validation, archive/restore logic |
| Types | `types/` | `AppTask`, `ActiveTaskStatus`, file path constants |

**Config SSOT:** `src/config/app-tasks.json` (active), `src/config/app-tasks-archive.json` (done).

**Dev API (Vite serve only):** `vite-plugin-dev-tasks.ts` — `/__dev/tasks`, `/__dev/tasks/archive`, `/__dev/tasks/restore`.

**UI entry:** `DevTasksFab` on all routes in dev; route `/tasks` with minimal chrome (card rows, toolbar autosave chip, no column headers).

## Dependencies

- `vite-plugin-dev-tasks.ts` (project root)
- MUI 9, dnd-kit (reorder)
- Agent skills: `.agents/skills/start/SKILL.md`, `router`, `finish` for task sync

## Onboarding

Fresh clones ship five pre-seeded tasks in `app-tasks.json`. Agents sync status at session boundaries per start/router/finish skills.
