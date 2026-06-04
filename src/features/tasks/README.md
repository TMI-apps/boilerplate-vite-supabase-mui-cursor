# Dev task backlog (`/tasks`)

In-repo development backlog for coding agents and local UI.

## SSOT files

| File | Role |
|------|------|
| `src/config/app-tasks.json` | Active work (`to-do`, `in-progress` only); top = highest priority |
| `src/config/app-tasks-archive.json` | Completed tasks (`done` only); append order = completion timeline |

## Dev API (Vite serve only)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/__dev/tasks` | GET / POST | Read / replace active array |
| `/__dev/tasks/archive` | GET / POST | Read newest-first / archive at active index |
| `/__dev/tasks/restore` | POST | Restore from archive display index |

Implemented in `vite-plugin-dev-tasks.ts` (`apply: "serve"`). Not available in production builds or `pnpm preview` writes.

## UI

- Route: `/tasks` (minimal chrome; production shows dev-only message).
- Dev FAB: `DevTasksFab` on all routes when `import.meta.env.DEV`.

Domain helpers: `services/appTasksDomain.ts`.
