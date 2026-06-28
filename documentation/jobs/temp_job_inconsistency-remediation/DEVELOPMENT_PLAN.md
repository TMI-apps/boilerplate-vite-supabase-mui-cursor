# Development plan: Codebase inconsistency remediation

## Summary

- **Goal:** Resolve all findings from the develop-branch inconsistency audit so imports, types, data-fetching, errors, styling, naming, and docs follow one consistent standard.
- **Why:** Cross-cutting drift (three alias families, split util roots, TanStack docs/code mismatch, duplicated type contracts, mixed error UX, stale documentation) compounds as new features land.
- **Complexity:** L — cross-cutting changes across `src/**`, alias config, rules, docs, and feature READMEs.
- **Plan review:** Waived — user approved implementation directly.
- **Alias decision:** Industry standard `@/` catch-all mapping to `src/*`.

## Phase overview

| Phase | Goal | Gate | Status |
|-------|------|------|--------|
| 1 | Lock alias SSOT in rules + config | `@/` only in config | Done |
| 2 | Migrate imports; consolidate `src/utils` → `src/shared/utils` | Zero granular aliases / `../` in `src/` | Done |
| 3 | Fix docs/rules drift | Docs match code | Done |
| 4 | Unify types & service contracts | Types from `types/` not hooks | Done |
| 5 | Align TanStack Query with architecture SSOT | `setQueryData` on profile mutation | Done |
| 6 | Standardize error handling & user feedback | Shared mapper + OAuth unified | Done |
| 7 | MUI styling & layout token cleanup | Auth layout tokens; chip/font fixes | Done |
| 8 | Naming/layout conventions + verification | lint, type-check, test, arch pass | Done |

## Decisions made

| # | Topic | Choice |
|---|-------|--------|
| 1 | Alias scheme | `@/` only (industry standard) |
| 2 | Scope | Full audit remediation |
| 3 | Tasks TanStack | Document as intentional exception |
| 4 | entreefederatie.ts | Deleted (orphan) |
| 5 | ProfileMenu placement | Keep in `components/common` |
| 6 | Error reporting (Sentry) | Deferred |

## Notes during development

- `authMessages.ts` holds user-facing auth strings so components do not import services directly (arch/lint gate).
- `validate:structure` on agent skills: only `.agents/skills/<name>/SKILL.md` (+ whitelisted `references/`) — no nested `AGENTS.md` under skills (removed with `vercel-react-best-practices` purge).
- Topbar moved to `Topbar/` folder + `index.ts` to match common component pattern.

## Chat footer

```
Plan: documentation/jobs/temp_job_inconsistency-remediation/DEVELOPMENT_PLAN.md
Complexity: L — completed
Next: finish skill / PR per phase group if splitting review
```
