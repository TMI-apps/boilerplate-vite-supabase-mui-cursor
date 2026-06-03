---
name: grill-me
description: >-
  Interview the user relentlessly about a plan or design until reaching shared
  understanding, resolving each branch of the decision tree. Use when the user
  wants to stress-test a plan, get grilled on their design, or mentions "grill me".
disable-model-invocation: false
---

# Grill me

Interview the user relentlessly about every aspect of this plan until reaching shared understanding. Walk down each branch of the design tree, resolving dependencies between decisions one-by-one.

## Zoom out first (optional)

When the thread feels stuck or the chosen route is unclear, **step back** before interrogating:

- State what problem we are solving and which route we've chosen toward a solution.
- List the last couple of attempts and their outcomes.
- Reflect on a route we might take if we stepped back further and looked at the issue at large.
- Compare the pros and cons of that wider alternative vs the other most fruitful option.

Use this as a framing move; then proceed into the questions below. (No separate skill — this replaces the former `stepback`.)

## Roles

The user's role is to keep the app aligned with the vision: desired behavior, product feel, future direction, priorities, risk tolerance, and tradeoffs.

The agent's role is to translate those preferences into code. Do not ask the user to choose files, functions, layers, implementation details, or technical mechanisms unless the choice changes the product direction or future development posture.

## Question style

Ask questions one at a time.

Use a question tool call when available, so the user can answer with clickable options. Prefer multiple-choice options when the question has clear branches.

Every multiple-choice question must include these omnipresent options:

- "Explain the UX impact first" - when selected, research the relevant UI/user flow/code, explain what each decision would mean for users, then re-ask the same question.
- "Dig deeper in the codebase" - when selected, go beyond surface consistency: explore architecture, adjacent features, and applicable industry-standard patterns to propose the most elegant design for this decision; summarize findings and refined options, then re-ask the same question.

Ask detailed questions, but keep them at the level the user can answer:

- Good: "Should this align more with the existing library conventions, making it easier to maintain, or should we accept a more custom path because this behavior is central to your vision?"
- Good: "Should future features be able to reuse this behavior, or is it only important for this specific flow?"
- Bad: "Should I use `functionA()` or `functionB()`?"
- Bad: "Should this live in the hook or the service?"

If a question can be answered by exploring the codebase, explore the codebase instead. Convert any remaining uncertainty into a product, behavior, or future-development question before asking the user.

For every question about functionality that touches existing code:

1. Ask the raw question in plain text first, without options, to frame the research target.
2. Research the current codebase and identify which answer is most consistent with existing behavior, UI patterns, domain language, and implementation direction.
3. Ask the actual multiple-choice question only after that research.
4. Clearly mark the option that is most consistent with the current codebase, while still letting the user choose a different product direction.

## Recommendation timing

Do not provide recommendations during the grilling phase. Ask questions first.

Exception: for functionality questions that touch existing code, you may state which option is most consistent with the current codebase before the multiple-choice question. Treat this as codebase evidence, not as the final product recommendation.

When convinced there is shared understanding, end the grill session with:

- A concise summary of the user's vision and constraints.
- The remaining tradeoffs, expressed in product/future-development terms.
- The recommended direction, with code implementation left to the agent unless a technical decision materially affects the user's vision.

**Next:** Re-run **`.agents/skills/router/SKILL.md`** gates 1–2 → **`plan` § Refine** or **`feature`** when scope is bounded. Not **`implement`** until a `DEVELOPMENT_PLAN.md` exists.

---

## Boundaries

| Not `grill-me` | Use instead |
|----------------|-------------|
| Engineering acceptance / APIs / gates | `plan` § Refine |
| Execute or commit | `implement` / `finish` |
