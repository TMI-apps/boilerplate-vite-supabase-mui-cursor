# Lens 4 — Composition / handoffs (2026-08-03)

Source: composition subagent. Read-only. Not gate-approved.

## Orphans

| skill | reachable from router? |
|-------|------------------------|
| `purge-skill` | **No** — description triggers on `/purge`, but router never maps removal situations |
| `create-skill` (repo) | **Only via** `improve-skill-library → create-skill`; not a direct router target |
| All other 30 project skills | **Yes** |

## Must-fix candidates (from findings)

1. Add router situation + skill index for `purge-skill` and repo `create-skill` (or document create-skill as improve-skill-library-only).
2. Deduplicate duplicate situation rows for `improve` and `standards-align` in router.
3. Align frontmatter `name` with folder: `purge` → `purge-skill`; `skill-creator` → `create-skill`.
4. Fix spurious handoff edges / **Next** lines: `prime→validate`, `validate→push`, `validate→review`, `feature→implement` (skip plan), `plan→finish`, `debug→implement`, `learn→finish`.
5. Add missing **Next:** for `push`→babysit, `api-integrate`→plan, `react-perf-vite`→optimize2, `purge-skill`→validate→finish, `create-skill`→improve-skill-library/router.

## Full findings table

| issue | skill(s) | fix |
|-------|----------|-----|
| I/O mismatch — chat report ≠ plan or diff | `prime → validate` | Drop validate from prime links-to |
| I/O mismatch — validation report ≠ commits | `validate → push` | Chain validate → finish → push |
| I/O mismatch — validation report ≠ component | `validate → review` | Remove spurious link |
| I/O mismatch — requirements ≠ DEVELOPMENT_PLAN | `feature → implement` | Align Next with plan first |
| I/O mismatch — plan ≠ staged diff | `plan → finish` | Remove finish from plan links-to |
| I/O mismatch — debug ≠ DEVELOPMENT_PLAN | `debug → implement` | Default next quick-piv/learn/finish |
| I/O mismatch — guidance ≠ staged diff | `learn → finish` | Remove finish link unless user asks commit |
| Registry vs SKILL gap | `create-skill` | Add Next → improve-skill-library or trim registry |
| Orphan | `purge-skill` | Router row + skill index |
| Orphan (repo copy) | `create-skill`, `router` | List repo path or document delegate-only |
| Front-door listing gap | `create-skill`, `purge-skill` | Add to project skill index |
| Duplicate situation rows | `improve`, `standards-align`, `router` | Merge duplicates |
| Dead end | `push` | Next → babysit when PR to develop |
| Dead end | `api-integrate` | Next → plan § Foundation |
| Dead end | `react-perf-vite` | Next → optimize2 / validate |
| Dead end | `purge-skill` | Next → validate → finish |
| Dead end | `create-skill` | Next → improve-skill-library or router |
| Name drift | `purge-skill` | Align name with folder |
| Name drift | `create-skill` | Align name with folder |
