---
name: grill-me
description: >-
  Interview the user until scope edges and interaction boundaries are aligned and the
  decision tree is resolved. Grounds every edge question in what already exists in the
  repo — existing loops, pipelines, and hook points — so ride-vs-new and boundary
  choices are concrete, not abstract. Chat-only alignment — authors no artifact.
  Use to stress-test scope/boundaries before feature or plan, or when the user says
  "grill me".
disable-model-invocation: false
---

# Grill me

Interview the user until there is shared understanding of the feature's **scope edges** and **interaction boundaries**, resolving the decision tree branch by branch — with each boundary informed by **what the codebase already does**, when relevant neighbors exist.

Agree on **where the feature stops**, **what it will NOT do or touch**, and **how it meets the functionality around it**. Stay at the perimeter: interior design comes only where an edge choice already constrains it.

**This is a scope stress-test grounded in the repo** — use codebase facts to sharpen boundary questions; keep product edge questions (perimeter, non-goals) central so loop narration supports alignment rather than replacing it.

## What this skill owns (SSOT)

`grill-me` owns **reaching alignment in chat** — not recording it. It produces shared understanding, **authors no file**, then hands the resolved tree to **`feature`** (to document as requirements) or **`plan` § Refine** (to turn into `DEVELOPMENT_PLAN.md`). Stay in conversation: user stories, journeys, and spec files belong in `feature` / `plan`.

**Skip gate:** trivial/XS change with no real edges → route to `quick-piv` instead of grilling.

## Codebase grounding (mandatory, scoped)

Ground edge questions in repo context so ride-vs-new and boundary choices are concrete. Search **only for neighbors implied by the agreed perimeter** (steps 1–3 below) — scope the search to named neighbors once perimeter is agreed.

| Stage | Action |
|---|---|
| **Steps 1–3** (problem, perimeter, non-goals) | Ask product questions; read `documentation/DOC_APP_VISION.md` when helpful. Defer codebase search until step 4. |
| **Step 4** (neighbor map) | For each neighbor from the agreed perimeter, search narrowly (its feature area + direct dependencies, ~3–5 files) and trace its flow end-to-end (UI → hook/service → API/edge → DB/storage) in one plain-language sentence. |
| **Per edge answer / when stuck** | Re-check the answer still fits the traced loop; step back (problem, route, evidence, alternative) if unclear, then resume. |

**Verify before you state.** Name loops and behaviors only after reading enough to be confident; when unsure, say `Uncertain — only read X so far` or `Not found in repo` and explore more or ask the user to confirm.

For each neighbor, surface a **hook map** in plain language (user-visible names — save file/symbol detail for `plan`) before the boundary question:

1. **Name** — what the user knows it as (auth, notifications, import…).
2. **Loop** — trigger → path → outcome, or `Not found` / `Uncertain`.
3. **Hook point** — where this rides, if it rides — mark **provisional** until that neighbor's edge decisions are agreed; use `TBD` when no loop exists.
4. **Fork cost** — one line on what a new path would duplicate, or `N/A`.

Use exploration to make boundary questions **evidence-based**. Keep mechanism choices with the agent; ask the user about scope, behavior, and edges. File-level paths, migrations, and API contracts belong in `plan` § Investigate — grill still learns what exists so alignment isn't abstract.

Run `prime` once at step 4 if the repo is unfamiliar, then trace each neighbor — a single prime pass supplements, not replaces, per-neighbor grounding.

## Interrogation priority (edges before interior)

Resolve in this order; a branch may open another. Treat integration hooks as **edge work** in step 4 — surface where new work attaches while mapping neighbors, before interior questions.

1. **Problem + success** — one sentence each.
2. **Perimeter (in scope)** — smallest set of capabilities that counts as this feature.
3. **Non-goals (out of scope)** — will NOT do / NOT touch (see below).
4. **Neighbor + hook map** — per neighbor: name, traced loop (or not found), provisional hook point, then **ride vs new**.
5. **Edge decisions** — one question per boundary: handoff, ownership, atomicity, precedence vs observed behavior.
6. **Interior** — only where an edge choice already constrains it.

### Ride vs new (default-greenfield check)

For each neighbor, trace the existing loop (or confirm absence), then ask whether this feature **rides** it (same flow/data path, extended) or forks a **parallel/new** one.

**Burden of proof is on greenfield** — state a repo-grounded reason the existing path can't absorb the work (divergent concept, incompatible constraints, unacceptable coupling) before proposing a fork. When no loop exists, greenfield is justified — confirm the user wants a new path and capture what it must not duplicate later.

This is a **scope/boundary** question for the user (riding vs forking changes consistency, divergence risk, coupling). Keep file/mechanism choices with the agent; look at the repo first so the question is concrete.

## Non-goals are first-class

Name what the feature will **NOT** do and **NOT** touch — often the highest-value grill output. Push on two lists, grounding **will NOT touch** in verified behavior when you have it:

- **Will NOT do** — capabilities a reasonable person might assume are included but are deferred or excluded.
- **Will NOT touch** — existing functionality/behavior that stays unchanged.

Mark each **deferred** ("not now") vs **excluded** ("not ever"). Pair as "In: X. Out: Y." When there genuinely are none, say so and move on.

## Roles

The user owns behavior, product feel, direction, priorities, tradeoffs; the agent translates that into code and ties the conversation to what already exists.

Ask about product direction, scope, and boundaries — ride-vs-new is such a boundary (see above). Reserve file/function/layer/mechanism choices for the agent unless they change product direction or scope.

Share findings plainly ("the app already does X via Y") or uncertainty ("no notifications pipeline found") so boundary questions are informed.

## Question style

Ask **one boundary question at a time**; a turn may include grounding prose plus the question. Use a question tool call when available; prefer multiple-choice when branches are clear.

**Offer Pareto-optimal options only** — each choice wins on a distinct axis (performance, code consistency, least code, reusability, UX, separation/ease-of-cutting). Label each option by the axis it wins on. When one choice dominates on every axis, state it and move on.

**State codebase evidence beside the question** — one line on what the repo shows (or `Uncertain`) before the choices. Keep options symmetric tradeoffs; let evidence inform without labeling a "default" option.

Every multiple-choice question includes two omnipresent options:

- **"Explain the UX impact first"** — research the flow, explain what each branch means for users, re-ask.
- **"Dig deeper in the codebase"** — widen exploration, update the hook map, re-ask.

Ask at the level the user can answer — behavior, scope, edges:

- Perimeter: "Is v1 just browsing cached data, or working fully offline and syncing later?"
- Grounded edge: *Evidence: save flow shows a toast today.* "Should this replace it, add a second toast, or only fire for async outcomes?"
- Grounded ride-vs-new: *Evidence: shared notifications pipeline exists (prefs + history).* "Ride that path, or fork — and if fork, what can't it handle?"
- Mechanism questions (`functionA` vs `functionB`, hook vs service) belong to `plan`, not grill.

When the codebase can answer a question, explore first, then ask the remaining scope/behavior/boundary uncertainty.

## Recommendation timing

During grilling, share hook-map findings and what each branch means for users. Save the consolidated **recommended direction** for the closing summary — mid-grill evidence informs; it doesn't prescribe.

## Ending the grill

Close with a **chat summary** (no file):

- **Vision & constraints** — concise.
- **In scope** — the agreed perimeter.
- **Non-goals** — "will NOT do" / "will NOT touch", each *deferred* or *excluded*.
- **Neighbor/boundary map** — per neighbor: verified loop (or greenfield), **agreed** hook point (promoted from provisional), ride vs new, resolved edges.
- **Open tradeoffs** — product-framed.
- **Recommended direction** — including which loops to extend; file-level detail for `plan` § Investigate.

**Next:** re-run `.agents/skills/router/SKILL.md` gates 1–2 → `plan` § Refine or `feature`. Proceed to `implement` only after a `DEVELOPMENT_PLAN.md` exists.

---

## Handoffs

| `grill-me` owns | Hand off to |
|---|---|
| Chat alignment on scope edges & decision tree | `feature` (Phase 2) to document requirements |
| Resolved scope ready for execution planning | `plan` § Refine → Investigate for file list, APIs, gates |
| Gate 2 acceptance / API shape detail | `plan` § Refine (grill informs; plan records) |
| Migrations, RLS policies, exact API contracts | `plan` § Investigate |
| Trivial/XS work with no real edges | `quick-piv` |
| Landed implementation | `implement` / `finish` |

**SSOT note:** `grill-me` aligns in conversation, grounded in what exists; `feature`/`plan` record the result.
