---
name: plan-grill
description: >-
  Continuous product-fork gate during plan design: same ask triggers as grill-me,
  anti-dup via DECISIONS.md, ask only on true ties (clear winners logged, no Q).
  IF during plan Refine OR Investigate OR Create a product perimeter / ride-vs-new /
  non-goal fork has ≥2 Pareto-fair options AND that topic is absent from
  DECISIONS.md THEN use this skill before locking the choice into
  DEVELOPMENT_PLAN.md. IF the topic is already closed or open in DECISIONS.md THEN
  skip. Not for XS/quick-piv. Not for industry-precedent forks (pattern-review).
  Not for gate-2 acceptance/API examples alone (plan § Refine). Invoke even when
  the user did not say plan-grill — plan must call this at those forks.
disable-model-invocation: false
---

# plan-grill

Stop silent product locks while designing a plan. Reuse **`grill-me` ask triggers** (scope edges, interaction boundaries, ride-vs-new, non-goals). Ask only when options **tie**; log clear winners without asking. Never re-ask a closed decision.

**`plan` must call this** whenever Refine, Investigate, or Create surfaces a product fork — continuous gate, not a one-shot pre-plan interview.

## What this skill owns (SSOT)

| Owns | Does not own |
|------|----------------|
| Plan-time product-fork detection + tie asks | Pre-plan / gate-1 stress-test → `grill-me` |
| Anti-dup via `DECISIONS.md` | Industry/precedent A/B/C → `pattern-review` |
| Logging clear-winner product picks during plan | Gate-2 acceptance/API examples alone → `plan` § Refine |
| Shared ledger format (with `grill-me` / `feature`) | Writing `DEVELOPMENT_PLAN.md` body → `plan` |

**Skip gate:** XS / `quick-piv` — do not run. Zero product forks → no `DECISIONS.md`.

### Two decision stores (do not conflate)

| Store | Path | Holds |
|-------|------|--------|
| **Product / scope ledger** | `documentation/jobs/temp_job_<name>/DECISIONS.md` | Perimeter, non-goals, ride-vs-new, product ties — `grill-me`, `plan-grill`, `feature` |
| **Impl decisions** | `DEVELOPMENT_PLAN.md` § **Decisions made** | Choices made **while implementing** phases — `implement` fills; leave empty at plan create |

## Ledger — `DECISIONS.md`

**Path:** `documentation/jobs/temp_job_<name>/DECISIONS.md`

**Template:** [`references/decisions-template.md`](references/decisions-template.md)

**First writer creates the job folder** — whoever hits the first product decision (`grill-me`, `plan-grill`, or `feature`) creates `documentation/jobs/temp_job_<name>/` and `DECISIONS.md`. Derive `<name>` as kebab-case from the feature/topic; if ambiguous, ask once for the slug.

Create the file only when logging the first decision (tie ask opened **or** clear-winner closed). No empty stubs.

## Continuous gate (call sites)

`plan` invokes this skill at each phase when a **new** product fork appears:

1. **Refine** — scope meaning, perimeter, non-goals, success criteria.
2. **Investigate** — ride vs new, which neighbor absorbs work, greenfield confirmation.
3. **Create** — any product fork about to be written into phases/steps.

Before asking: read existing `DECISIONS.md` (if any). Skip topics already **closed** or already **open** awaiting answer.

## Ask vs log

| Situation | Action |
|-----------|--------|
| One option dominates all axes (grill clear-winner rule) | Log to **Closed** as clear-winner; no question |
| True tie (Pareto-fair options, distinct `[Wins: …]` axes) | One question (grill style); then **Closed** |
| Already in **Closed** / **Open** | Skip (anti-dup) |
| Industry/precedent only | Hand to `pattern-review`; do not ask here |
| Pure mechanism, no product edge | Agent decides; do not ask |

Question style, cost sketch, omnipresent escapes ("Explain the UX impact first", "Dig deeper in the codebase"): follow `.agents/skills/grill-me/SKILL.md` § Question style — do not fork a second format.

## Flow

1. **Detect** product fork in current `plan` phase.
2. **Resolve job folder** — existing `temp_job_*` for this work, or first-writer create.
3. **Load ledger** — read `DECISIONS.md` if present.
4. **Dedupe** — if topic closed/open, continue plan without asking.
5. **Classify** — clear winner → log; tie → ask once; precedent → `pattern-review`.
6. **Write ledger** — update Closed/Open/Log per template.
7. **Return to `plan`** — resume phase with the locked choice.

## Handoffs

| `plan-grill` owns | Hand off to |
|---|---|
| Product tie during plan design | User answer → ledger → back to `plan` |
| Clear-winner product pick | Ledger only → `plan` continues |
| Gate-1 / standalone stress-test | `grill-me` |
| Precedent / non-standard industry path | `pattern-review` |
| XS work | `quick-piv` (no `plan-grill`) |

**SSOT note:** Alignment for plan-time forks lives in `DECISIONS.md`; `DEVELOPMENT_PLAN.md` records how to build. `grill-me` and `plan-grill` share the ledger; `implement` soft-warns on open rows (no hard block).
