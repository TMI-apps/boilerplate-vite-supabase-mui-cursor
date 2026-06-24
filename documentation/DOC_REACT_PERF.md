# React performance — Vite SPA

Stack-native performance guidance for agents and humans. **Procedure SSOT:** `.agents/skills/react-perf-vite/SKILL.md` and `rules/`.

## Stack context

| Layer | This repo | Not used |
|-------|-----------|----------|
| Build | Vite 8 | Next.js `optimizePackageImports` |
| UI | React 19 CSR SPA | RSC, Server Actions, SSR hydration |
| Server state | TanStack Query 5 | SWR |
| Code-splitting | `React.lazy` + `Suspense` | `next/dynamic` |
| API / edge | Cloudflare Workers, Supabase | Next.js route handlers |
| Components | MUI 9 deep imports (`@mui/material/Button`) | Barrel `@mui/material` |

## Already in place (0.32.x)

- MUI deep path imports (faster dev cold start)
- Lazy auth pages and route-level `Suspense` in `App.tsx`
- Memoized auth context; stable auth handler callbacks
- Dev-only dynamic import for React Query Devtools

## When to use which skill

| Goal | Skill |
|------|--------|
| Named hotspot — redesign vs memo vs delete | `optimize2` |
| Lookup a specific React perf pattern | `react-perf-vite` → `rules/` |
| Lighthouse / CWV measurement | `web-perf` (plugin) |
| TanStack cache, keys, mutations | `DOC_TANSTACK_QUERY.md` |

**Tiebreak:** `optimize2` owns structural refactors; `react-perf-vite` owns pattern lookup; `web-perf` owns measurement.

## High-impact patterns (quick reference)

### Waterfalls

- Independent async work → `Promise.all` (hooks, services, Workers).
- Defer `await` until the branch that needs the result.
- Check cheap sync guards before remote/flag awaits.

### Bundle

- Keep MUI/icon deep imports — never revert to barrel files.
- Lazy-load routes and heavy panels with `React.lazy`; wrap in `Suspense`.
- Preload on hover/focus before navigation to heavy routes.
- Defer analytics/logging until after first paint (`requestIdleCallback` or dynamic `import()`).

### Data fetching

- Use TanStack Query for shared server state — dedup is built-in.
- Follow optimistic + server-canonical merge in `architecture/RULE.md` — do not add SWR.

### Re-renders

- Do not define components inside components.
- Derive values during render; avoid effect → setState for props sync.
- Put click/submit side effects in event handlers, not effects.
- Functional `setState` when updating from previous state.
- Do not wrap trivial primitive expressions in `useMemo`.

### Workers

- Start independent fetches before awaiting; parallelize in handlers.
- Hoist static config/templates to module scope in Worker code.

## Explicitly out of scope

- Next.js Server Components, `React.cache()`, `after()`, RSC serialization
- SWR / `useSWR` / `useSWRMutation`
- `next/dynamic`, `next/script`, Next hydration flicker scripts
- Vendored full rule corpora with compiled `AGENTS.md` under `.agents/skills/`

## Upstream

Patterns adapted from [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) (MIT). The vendored `vercel-react-best-practices` tree was removed to eliminate ~106 KB of per-turn context bloat from nested `AGENTS.md`.
