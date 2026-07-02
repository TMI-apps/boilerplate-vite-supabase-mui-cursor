---
name: grill-me
description: >-
  Interview the user until scope edges and interaction boundaries are aligned and the
  decision tree is resolved. Focuses on where the feature stops, what it will NOT do or
  touch, and how it meets other functionality. Chat-only alignment — authors no artifact.
  Use to stress-test scope/boundaries before feature or plan, or when the user says "grill me".
disable-model-invocation: false
---

# Grill me

Interview the user until there is shared understanding of the feature's **scope edges** and **interaction boundaries**, resolving the decision tree branch by branch.

The goal is not to design the interior. It is to agree on **where the feature stops**, **what it will NOT do or touch**, and **how it meets the functionality around it**.

## What this skill owns (SSOT)

`grill-me` owns **reaching alignment in chat** — not recording it. It produces shared understanding, **authors no file**, then hands the resolved tree to **`feature`** (to document as requirements) or **`plan` § Refine** (to turn into `DEVELOPMENT_PLAN.md`). Do not template user stories, journeys, or spec files here — if you are, you've left `grill-me`.

**Skip gate:** trivial/XS change with no real edges → don't grill; route to `quick-piv`.

## Interrogation priority (edges before interior)

Resolve in roughly this priority; follow dependencies where a branch opens another. Do not descend into interior behavior until the perimeter and edges are agreed.

1. **Problem + success** — one sentence each.
2. **Perimeter (in scope)** — smallest set of capabilities that counts as this feature.
3. **Non-goals (out of scope)** — what it will **NOT do** and **NOT touch** (see below).
4. **Neighbor map** — existing functionality this feature meets, by **user-visible name** (auth, settings, notifications, existing CRUD, admin, billing…), not by file.
5. **Edge decisions** — one question per boundary: handoff, ownership, atomicity, precedence vs existing behavior.
6. **Interior** — only where an edge choice already constrains it.

When stuck or the route is unclear, step back first: state the problem and chosen route, recap recent attempts, and weigh a wider alternative against the current best option — then resume the questions.

## Non-goals are first-class

The most valuable output of edge-alignment is naming what the feature will **NOT** do and **NOT** touch. Push on two lists:

- **Will NOT do** — capabilities a reasonable person might assume are included but are deferred or excluded (e.g. "no digest scheduling", "no partial import").
- **Will NOT touch** — existing functionality that stays unchanged, boundaries we refuse to cross (e.g. "does not alter the existing success toast", "does not bypass RLS").

For each, confirm it's intentional and mark **deferred** ("not now") vs **excluded** ("not ever"). Pair boundaries as "In: X. Out: Y." so the edge is unambiguous. If there genuinely are none, state that and move on — don't invent filler.

## Roles

The user keeps the app aligned with the vision: behavior, product feel, direction, priorities, risk, tradeoffs. The agent translates that into code. Don't ask the user to choose files, functions, layers, or mechanisms unless the choice changes product direction, scope, or a boundary with other functionality.

## Question style

Ask one at a time. Use a question tool call when available so the user can click options; prefer multiple-choice when branches are clear. Every multiple-choice question includes two omnipresent options:

- **"Explain the UX impact first"** — research the flow/code, explain what each branch means for users, then re-ask.
- **"Dig deeper in the codebase"** — explore architecture, adjacent features, and industry-standard patterns to propose the most elegant boundary; summarize, then re-ask.

Keep questions at the level the user can answer — behavior, scope, edges, not mechanisms:

- Good (perimeter): "Is v1 just browsing cached data, or working fully offline and syncing later?"
- Good (edge): "If import fails on row 47 of 200, are rows 1–46 already committed, or is the whole batch atomic?"
- Good (precedence): "When this fires on an action that already shows a success toast, does it replace it, duplicate it, or only fire for async outcomes?"
- Good (non-goal): "Should admin edits to a user's record be invisible, or appear in their history as 'edited by support'?"
- Bad: "Should I use `functionA()` or `functionB()`?" / "Hook or service?"

If a question can be answered by exploring the codebase, explore instead, then convert remaining uncertainty into a scope/behavior/boundary question. For any boundary question touching existing code: (1) ask the raw question in plain text to frame the research, (2) research which answer is most consistent with existing behavior/patterns/domain language, (3) ask the multiple-choice question, (4) mark the option most consistent with the codebase while letting the user pick a different direction.

## Recommendation timing

No recommendations during grilling. Exception: for boundary questions touching existing code, you may state which option is most consistent with the codebase before asking — treat as evidence, not the final recommendation.

## Ending the grill

When there is shared understanding, close with a **chat summary** (not a file):

- **Vision & constraints** — concise.
- **In scope** — the agreed perimeter.
- **Non-goals** — explicit "will NOT do" / "will NOT touch", each marked *deferred* or *excluded*.
- **Neighbor/boundary map** — each existing feature it meets and the resolved edge (ownership, precedence, atomicity).
- **Open tradeoffs** — product-framed.
- **Recommended direction** — code left to the agent unless a technical choice materially affects the vision.

**Next:** Re-run `.agents/skills/router/SKILL.md` gates 1–2 → `plan` § Refine or `feature` to record the resolved scope. Not `implement` until a `DEVELOPMENT_PLAN.md` exists.

---

## Boundaries

| Not `grill-me` | Use instead |
|----------------|-------------|
| Write the scope/requirements artifact | `feature` (Phase 2 documents it) |
| Write the execution plan / in-out section on file | `plan` § Refine → Investigate |
| Engineering acceptance / APIs / gates | `plan` § Refine |
| Trivial/XS change with no real edges | `quick-piv` |
| Execute or commit | `implement` / `finish` |

**SSOT note:** `grill-me` aligns on scope edges & the decision tree *in conversation*; `feature`/`plan` *record* the result.
