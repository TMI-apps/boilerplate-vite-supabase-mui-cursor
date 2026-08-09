# Lens 1 — Separation / overlap (2026-08-03)

Source: overlap subagent. Read-only. Not gate-approved.

## Must-fix (priority)

| Skills | Problem | Suggested fix |
|--------|---------|---------------|
| `purge-skill`, `router` | No situation row / skill index; overlaps delete/cleanup with implement/quick-piv/consolidate | Add router row + index + NOT table |
| `create-skill` (project), `router`, `improve-skill-library` | Router points to `~/.cursor/...`; project copy exists; dual SSOT with rule-quality | Unify path + name; router tiebreak |
| `improve`, `optimize2`, `react-perf-vite` | Vague make better/faster — MISSING tiebreak | Extend improve vs specialized with perf row |
| `improve`, `grill-me` | Vision-thin stress-test — MISSING tiebreak | Gate-1 → grill-me; /improve → improve |
| `consolidate` | Two primary modes (redundancy vs semantic placement) | Mode auto-select or split |
| `rule-quality` | Grade OR rewrite dual primary | Split triggers or subordinate Mode B |

## Nice

- pattern-review ↔ challenge on “best practice” existing flow
- write-adoption-guide ↔ learn
- Deduplicate improve / standards-align situation rows
- Standardize What this is NOT across ~12 skills

## One-outcome violations

must-fix: `rule-quality`, `consolidate`, `create-skill`  
nice: `challenge`, `standards-align`, `quick-piv`/`bundle-ship`, `purge-skill` name drift

## Same-cell collisions

must-fix: debug+hypothesis; improve+standards-align+layer-consistency-check; pattern-review+review-dev-plan  
(have tiebreaks — document in registry)

## Vague-trigger hotspots (Lens 5)

`improve`, `purge-skill`, `consolidate`, `optimize2`, `debug`, `pattern-review`, `grill-me`, `create-skill`
