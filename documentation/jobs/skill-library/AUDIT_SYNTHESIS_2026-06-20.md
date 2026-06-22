# Skill library audit synthesis (Phase 3)

**Date:** 2026-06-20  
**Base:** `origin/develop` @ `0b1167a` (includes `vercel-react-best-practices` from PR #28)  
**Focus:** New Vercel skill integration into routing spine  
**Status:** **Package C (full) applied** — user approved. No-loss pass: 0 MISSING.

## No-loss coverage (Phase 6)

All edits were additive or in-place expansions; no atomic unit dropped.

| Class | Count | Notes |
|-------|-------|-------|
| PRESERVED | all prior units | router/optimize2/review/finish/review-dev-plan original content intact |
| MOVED | 0 | no SSOT relocations this batch |
| DROPPED | 0 | — |
| MISSING | **0** | pass clears |

In-place edits verified: `finish` Option 3 (stash-pop sequence + push offer preserved, push-timing clarified); `review-dev-plan` Next (original `implement` handoff preserved, `validate` step prepended); `metadata.json` / `AGENTS.md` abstract (count corrected 40+ → 70, text otherwise intact).

## Applied fixes

| ID | File(s) | Result |
|----|---------|--------|
| V1 | `router/SKILL.md` | situation row + skill index entry + 4-way perf tiebreak |
| V2 | `DOC_AGENT_WORKFLOW_LAYERS.md` | § Vendored reference skills + coupling row |
| V3 | `vercel-react-best-practices/SKILL.md` | Stack scope (Vite) + Boundaries |
| V4 | `optimize2/SKILL.md`, `review/SKILL.md` | link-out to Vercel catalog (no duplication) |
| V5 | `REGISTRY.md` | 25 skills, Vercel row |
| H1 | `review-dev-plan/SKILL.md` | `validate` plan-mode in Next (completes plan-review stack) |
| H4 | `router/SKILL.md` | `grill-me` vs `challenge` tiebreak |
| H2 | `metadata.json`, `AGENTS.md` | rule count 40+ → 70 |
| H3 | `improve-skill-library/SKILL.md` | Vendored-skill scope row |
| N4 | `finish/SKILL.md` | Option 3 push-timing clarified (finish ends at commit) |
| N5 | `challenge/SKILL.md`, `consolidate/SKILL.md` | post-impl handoff to validate/check → finish |

---

## (Original gate analysis below)

---

## Executive summary

The prior audit (`AUDIT_SYNTHESIS.md`) left the corpus in good shape for the 24 first-party workflow skills. Adding `vercel-react-best-practices` **breaks one invariant**: it is an **orphan** — present on disk and in agent inventory, but **absent from `router/SKILL.md`** and `DOC_AGENT_WORKFLOW_LAYERS.md`. That causes silent co-fire with `optimize2`, `review`, and `web-perf` on React perf requests with **no documented tiebreak**.

Additionally, ~40% of the Vercel rule corpus targets **Next.js/RSC/server actions**, which do not apply to this **Vite + React 19 SPA** stack without an explicit applicability filter.

---

## Findings raised by ≥2 lenses

| Finding | Lenses |
|---------|--------|
| `vercel-react-best-practices` orphan (not in router index/situation table) | Overlap, SSOT, Conflicts, Composition |
| Missing tiebreak: vercel × optimize2 × web-perf × review | Overlap, SSOT, Conflicts, Composition |
| Next.js rules misfire on Vite SPA | Overlap, Conflicts, Composition |
| `REGISTRY.md` stale (24 vs 25 skills) | SSOT |
| SKILL.md Quick Reference duplicates `rules/*.md` (third index layer) | SSOT |
| `review-dev-plan` → `implement` skips plan-mode `validate` | Conflicts, Composition |
| `optimize2` L3 React perf bullets duplicate Vercel rules | SSOT, Overlap |

---

## Prioritized fix map (decision gate)

### Tier 1 — Must-fix (routing + Vercel focus)

| ID | What | Where | Fix | Risk |
|----|------|-------|-----|------|
| **V1** | Orphan skill | `router/SKILL.md` | Add situation row + skill index entry + tiebreak subsection `vercel-react-best-practices` vs `optimize2` vs `web-perf` vs `review` | Low |
| **V2** | Layers coupling | `DOC_AGENT_WORKFLOW_LAYERS.md` | Short § "React performance patterns" + row in "When you change something" for vendored reference skills | Low |
| **V3** | Vite applicability | `vercel-react-best-practices/SKILL.md` | Add **Boundaries** + **Stack scope** (apply client/rerender/bundle/rendering/js; skip `server-*`, Next-only rules unless SSR added) | Low |
| **V4** | SSOT links | `optimize2/SKILL.md` Boundaries; `review/SKILL.md` Boundaries | Link to Vercel skill for L3 perf patterns / §D deep-dive (replace inline duplication) | Low |
| **V5** | Registry | `documentation/jobs/skill-library/REGISTRY.md` | Already updated (25 skills) | — |

### Tier 2 — Should-fix (handoffs + metadata)

| ID | What | Where | Fix | Risk |
|----|------|-------|-----|------|
| **H1** | Plan review stack gap | `review-dev-plan/SKILL.md` Next block | Add `validate` (plan mode) before `implement` for M/L | Low |
| **H2** | Vercel metadata drift | `metadata.json`, `AGENTS.md` abstract | Align rule count "70" (not "40+") on next upstream sync — **do not hand-edit AGENTS.md** if treated as generated | Low |
| **H3** | Vendored skill class | `improve-skill-library/SKILL.md` scope table | Note `skills-lock.json` skills: router/layers edits OK; rule body edits = upstream sync | Low |
| **H4** | `grill-me` vs `challenge` tiebreak | `router/SKILL.md` | Clarify: gate-1 ambiguity → `grill-me`; named existing feature simplification → `challenge` | Low |

### Tier 3 — Nice-to-have (defer)

| ID | What | Fix |
|----|------|-----|
| **N1** | Trim SKILL.md Quick Reference (70 bullets) | Replace with category table + link to `rules/` or `AGENTS.md` — large no-loss surface; defer unless user wants slim entry file |
| **N2** | Fork to `vite-react-best-practices` | Strip Next-only rules — high maintenance; prefer V3 filter |
| **N3** | `PROJECT-STRUCTURE-VALIDATION.md` missing | Pre-existing broken link in `review` — separate fix |
| **N4** | `finish` Option 3 push wording | Clarify finish→push sequence |
| **N5** | `challenge`/`consolidate` post-impl handoff to `validate`/`finish` | Add Next blocks |

### Explicitly not recommended now

- **Removing** the Vercel skill (user just added it via PR #28)
- **Hand-editing** all 70 `rules/*.md` files for Vite wording
- **Merging** Vercel content into `.cursor/rules/` (wrong layer; vendored reference belongs in `.agents/skills/`)

---

## Proposed router tiebreak (draft for V1)

```markdown
### `vercel-react-best-practices` vs `optimize2` vs `web-perf` vs `review`

- **`web-perf`:** Primary when outcome = **measured** Core Web Vitals / trace / network (Chrome DevTools MCP).
- **`optimize2`:** Primary when outcome = **choose refactor depth** (design→complexity) for a named hotspot.
- **`vercel-react-best-practices`:** Primary when outcome = **apply React perf rule catalog** (Vite-applicable rules) during write or targeted audit.
- **`review`:** Primary when outcome = **170-point component rubric**; use vercel only for §D deep-dive if requested or D score weak.

Order when multiple required: `web-perf` → `optimize2` (decision) → `vercel-react-best-practices` (apply rules) → `review` (holistic score).
```

---

## Recommended approval packages

| Package | IDs | Blast radius | Effort |
|---------|-----|--------------|--------|
| **A — Vercel integration (recommended minimum)** | V1, V2, V3, V4, V5 | router, layers doc, 3 skills | ~30 min |
| **B — A + handoffs** | A + H1, H4 | +2 skills | ~45 min |
| **C — Full remediation** | B + H2, H3, N4, N5 | broader | ~90 min |
| **D — A + slim Vercel entry (N1)** | A + N1 | large no-loss pass on vercel SKILL.md | ~60 min |

---

## Next steps after approval

1. Execute approved fixes one at a time  
2. Run no-loss verifier against `CONTENT_LEDGER.md` (Phase 0 capture)  
3. Reconcile router index (25 skills listed once)  
4. User confirms via review — agent does not claim success
