# Full skills + rules audit synthesis (2026-06-29)

**Method:** improve-skill-library Phases 0–4 via six Composer 2.5 read-only subagents (registry, separation, SSOT, conflicts, composition, rules quality).

**Corpus:** 26 editable skills, 12 rule files, router spine, layers doc.

**Live workflow health:** Model A on disk; `main`/`develop` aligned @ `9c3a0ff`; rulesets match design (`main`: deletion+non_ff; `develop`: PR+test+non_ff+deletion).

---

## Executive summary

| Area | Verdict |
|------|---------|
| **Model A branch strategy** | ✅ SSOT in `workflow/RULE.md`; rules aligned after recent fixes |
| **Router spine** | ⚠️ 2 orphan skills (`hypothesis`, `caveman`); duplicate situation rows (`validate`, `consolidate`) |
| **Rules ↔ skills boundary** | ❌ Largest debt: `debugging/RULE` duplicates `debug` skill; `workflow/RULE` duplicates `finish` semver/changelog |
| **Feature skill** | ❌ Phases 5–7 conflict with `implement` handoff |
| **Rules meta** | ⚠️ INDEX/README wrong new-rule path; README claims global SSOT leadership |

---

## Must-fix (blast radius order)

| # | Finding | Owner | Proposed fix | Risk if ignored |
|---|---------|-------|--------------|-----------------|
| **M1** | `hypothesis` not in router; collides with `debug` | `router`, `hypothesis` | Add router row + tiebreak; cross-link `debug` ↔ `hypothesis` | Wrong debug skill fires |
| **M2** | `feature` Phases 5–7 implement in-skill vs handoff to `plan`→`implement` | `feature` | Remove/rename Ph 5–7; handoff only | Dual execution paths |
| **M3** | `debugging/RULE.md` duplicates `debug/SKILL.md` scientific method | `debugging/RULE.md` | Trim to logging + pointer | Agents follow conflicting procedures |
| **M4** | `workflow/RULE.md` duplicates semver/changelog/commit format from `finish` | `workflow/RULE.md` | Keep SSOT map + links only | Version/changelog drift |
| **M5** | `implement`/`quick-piv`/`plan` lack branch stop on `main`/`develop` | Those skills | Add gate linking `workflow` § Branch Strategy | Code edits on protected branches |
| **M6** | Protected-files manifest split (workflow vs `.claude/git-workflow` vs finish partial list) | `workflow/RULE.md` | Single manifest; others link | Wrong files edited without approval |
| **M7** | `finish` mandatory changelog vs no-bump commit types (`docs:`, `chore:`) | `finish` | Gate changelog on change class / classify script | Spurious version bumps |
| **M8** | `DOC_CHANGESETS.md` mentions `.changeset/*.md`; `finish` silent | `finish` or `DOC_CHANGESETS` | Align or demote changesets | Release flow confusion |
| **M9** | `file-placement` types row: only `shared/types/` | `file-placement/RULE.md` | Match architecture (`features/*/types/`) | Wrong type file placement |
| **M10** | Stale `documentation/jobs/skill-library/REGISTRY.md` lists removed `check` skill | Registry artifact | Refresh or archive | Audit false positives |

---

## Nice-to-have

| # | Finding | Fix |
|---|---------|-----|
| N1 | Router duplicate rows for `validate`, `consolidate` | Merge situation-table rows |
| N2 | `caveman` orphan | Index as communication overlay (not workflow) |
| N3 | `dev-cycle-matrix` missing `validate(plan-review)` step | Add between review-dev-plan and implement |
| N4 | Dead ends: `challenge`, `review`, `consolidate`, `optimize2`, `start` | Add **Next:** lines |
| N5 | `workflow` § During Development "commit frequently" vs finish-only | Clarify agent vs human dev |
| N6 | `workflow` legacy `npm --prefix functions` deploy | Point to `cloud-functions/RULE` + Supabase |
| N7 | `code-style` `any` ban vs import exception | Reconcile |
| N8 | INDEX/README wrong `rules/[category]/[rule-name]/` template | Fix to `RULE.md` |
| N9 | INDEX `projectStructure.config.js` typo | → `.cjs` |
| N10 | README omits `project-specific`; claims SSOT leadership | Demote README; INDEX = catalog |
| N11 | Root `README.md` release wording ambiguous vs Model A | One-line + link workflow |
| N12 | `.claude/rules/git-workflow.md` missing `develop` guard | Align with Model A |
| N13 | `feature/SKILL.md` `projectStructure.config.js` typo | → `.cjs` |
| N14 | `architecture` § Performance cost risk without router chain | Link web-perf → optimize2 → react-perf-vite |

---

## SSOT ownership (canonical)

| Concept | Owner |
|---------|-------|
| Branch / promote | `workflow/RULE.md` |
| Semver / changelog / commit | `finish/SKILL.md` |
| Changeset narrative | `DOC_CHANGESETS.md` |
| Pre-commit light path | `DOC_AGENT_WORKFLOW_LAYERS.md` + `change-classify.cjs` |
| Scientific debugging procedure | `debug/SKILL.md` |
| Hypothesis loop | `hypothesis/SKILL.md` (route via `debug`) |
| Debug patterns | `debug/patterns.md` |
| Validate depths | `validate/SKILL.md` |
| Skill routing | `router/SKILL.md` |
| App layers | `architecture/RULE.md` |
| File placement | `file-placement/RULE.md` |
| Cloudflare deploy | `DOC_CLOUDFLARE_WORKERS.md` |

---

## Decision gate (pick batches to apply)

**Batch A — Router + orphans (low risk):** M1, N1, N2, N3

**Batch B — SSOT trim rules (medium):** M3, M4, N6, N8–N10

**Batch C — Skill handoffs (medium):** M2, N4, M5

**Batch D — Finish/release alignment (medium):** M7, M8, M6

**Batch E — Small fixes (low):** M9, M10, N11–N14

**Batch F — Full library re-audit content ledger + no-loss pass** after any Batch A–E edits

---

## Subagent references

| Lens | Agent ID (session) |
|------|---------------------|
| Registry | `baddc2e3-d284-4769-9525-36b52d094b9b` |
| Separation | `1a260f9b-602b-4a8c-9c5d-77bd82ceca01` |
| SSOT | `5bca688f-a109-403f-8085-925d906981f0` |
| Conflicts | `84332d98-41f9-4d9b-b2b1-a9a250876dec` |
| Composition | `31491313-5b9c-441d-a055-795db9a4998f` |
| Rules quality | `236b6b6f-8fcb-4feb-ac6d-498f18268d98` |
