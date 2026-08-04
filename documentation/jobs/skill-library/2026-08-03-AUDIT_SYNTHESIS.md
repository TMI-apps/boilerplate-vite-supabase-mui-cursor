# Skill library audit synthesis — 2026-08-03

Phase 0 + Phase 2 complete. **No skill edits applied.** Gate required before Phase 5.

**Artifacts**
- `REGISTRY.md` (32 skills)
- `2026-08-03-CONTENT_LEDGER.yaml` (350 units)
- `2026-08-03-LENS-{overlap,ssot,conflicts,composition,trigger}.md`

## Consensus must-fix (≥2 lenses)

| ID | Finding | Lenses | Proposed fix |
|----|---------|--------|--------------|
| F1 | `purge-skill` orphan — no router situation/index/layers | overlap, conflicts, composition, SSOT, trigger | Add router row + skill index + layers coupling; NOT table; **Next:** validate→finish; align frontmatter `name` with folder |
| F2 | `create-skill` dual home — router→user path; project copy `name: skill-creator` | all 5 | **Pick A:** route to `.agents/skills/create-skill/` as project SSOT, rename frontmatter to `create-skill`, user path reference-only. **Pick B:** delete project copy; REGISTRY points user-only |
| F3 | Duplicate router situation rows: `improve`, `standards-align` (+ `debug`, `babysit`) | overlap, conflicts, composition, SSOT | Deduplicate to one row per skill |
| F4 | `challenge` Phase 7 implements vs footer delegates to quick-piv/implement | conflicts, composition | Reconcile: Phase 7 is execution SSOT; footer = Next after done → validate/finish; OR remove Phase 7 and always hand off |
| F5 | `consolidate` Phase 6 executes + §6.4 CHANGELOG vs finish SSOT / footer handoff | conflicts, composition, SSOT | Remove CHANGELOG edit; pick execute-in-skill OR plan-then-hand-off; align footer |
| F6 | `standards-align` A/B/C table duplicates `challenge` options | SSOT, overlap | Link to challenge for How options after Should-gate; keep gap-score/Should unique |
| F7 | Missing improve vs optimize2/react-perf-vite / grill-me tiebreaks | overlap | Extend router § improve vs specialized |
| F8 | Vague must-fix descriptions: hypothesis, grill-me, prime, review-dev-plan, purge proactive, router “ambiguous”, standards-align/layer “as appropriate” | trigger (+ overlap) | Observable IF/THEN rewrites per trigger lens |

## Consensus nice-to-have

| ID | Finding | Fix |
|----|---------|-----|
| N1 | Name drift purge/create frontmatter | Align with folder |
| N2 | Dead-end **Next:** push, api-integrate, react-perf-vite, create-skill, purge | Add Next lines |
| N3 | Handoff contracts: improve→validate/review/lcc; standards-align→challenge skip re-gate | Declare accepted inputs |
| N4 | Spurious links: prime→validate, validate→push/review, plan→finish, learn→finish, feature→implement | Trim or qualify |
| N5 | Layer-cue echoes in router/AGENTS → link workaround-shapes only | Shorten |
| N6 | Weak NOT tables: challenge, create-skill, review, grill-me, learn, … | Add NOT sections |
| N7 | consolidate dual mode / rule-quality dual mode | Document mode auto-select or split (defer split unless requested) |
| N8 | ~32 nice vague conditionals | Batch rewrite later via rule-quality |

## Recommended gate package (default)

**Apply:** F1–F8 + N1–N5 (routing/SSOT hygiene from this session’s new skills).  
**Defer:** N6–N8 (broader polish), consolidate/rule-quality skill splits (N7 split).

## Decision required

Reply with one of:
1. **`go defaults`** — apply recommended package
2. **`F1,F2A,F3,…`** — pick finding IDs (+ F2A or F2B)
3. **`all must-fix`** — F1–F8 only
4. **`stop`** — no edits
