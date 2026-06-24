---
name: react-perf-vite
description: >-
  Stack-native React performance patterns for this Vite SPA (React 19, MUI, TanStack Query,
  Cloudflare Workers). Use when optimizing bundles, waterfalls, re-renders, or client fetch
  behavior — not for repo-wide refactors (optimize2) or Lighthouse audits (web-perf).
---

# React performance (Vite SPA)

## Purpose

On-demand performance playbook for **this repo's stack**. Rules live in `rules/` — read only the files relevant to the task.

**SSOT for server state:** TanStack Query — see `documentation/DOC_TANSTACK_QUERY.md` and `architecture/RULE.md` § Plain optimistic + server-canonical response.

**Human overview:** `documentation/DOC_REACT_PERF.md`.

## What this is NOT

| Use instead | When |
|-------------|------|
| `optimize2` | Hotspot refactor across design → approach → efficiency → complexity; Rule of Three |
| `web-perf` | Browser-measured CWVs, traces, network (DevTools MCP) |
| `review` | Component quality rubric (props, MUI, a11y) |
| SWR / Next.js patterns | This repo uses TanStack Query + Vite — not applicable |

**Do not** add a compiled `AGENTS.md` in this folder — it would bloat every agent turn.

## When to apply

- Writing or refactoring React components, hooks, or routes
- Fixing waterfalls in services, hooks, or Worker handlers
- Bundle size, lazy routes, or third-party deferral
- Re-render bugs, unstable references, effect misuse
- Long lists, localStorage prefs, scroll listeners

## Rule index (by priority)

| Priority | Prefix | Rules |
|----------|--------|-------|
| CRITICAL | `async-` | `parallel`, `defer-await`, `cheap-condition-before-await` |
| CRITICAL | `bundle-` | `barrel-imports`, `lazy-routes`, `preload`, `defer-third-party` |
| HIGH | `worker-` | `parallel-fetch`, `hoist-static-io` |
| MEDIUM-HIGH | `client-` | `tanstack-dedup`, `passive-event-listeners`, `localstorage-schema` |
| MEDIUM | `rerender-` | `no-inline-components`, `derived-state-no-effect`, `move-effect-to-event`, `functional-setstate`, `simple-expression-in-memo` |
| MEDIUM | `rendering-` | `content-visibility`, `conditional-render` |
| LOW-MEDIUM | `js-` | `tosorted-immutable` |

## How to use

1. Identify the symptom (waterfall, bundle, re-render, list jank).
2. Read the matching `rules/<name>.md` only.
3. Apply with repo conventions (`@/` imports, feature layers, TanStack keys).
4. If the fix needs structural redesign, hand off to `optimize2`.

## Upstream

Adapted from [Vercel React Best Practices](https://github.com/vercel-labs/agent-skills) (MIT). Next.js / RSC / SWR rules were dropped; Vite + TanStack + Workers mappings added. Re-vendor upstream only into `documentation/vendor/` if refreshing — never restore a nested `AGENTS.md` under `.agents/skills/`.
