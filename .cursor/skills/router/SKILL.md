---
name: router
description: Routes new or ambiguous work to the right workflow before planning or coding. Use when scope is unclear, the ask is still being negotiated, or which skill to run next is not obvious (plan, quick-piv, implement, debug, review, validate).
disable-model-invocation: true
---

# router

Clarify the user's desired outcome and boundaries, then **route** to the appropriate workflow skill.

This skill is an intake gate. It should reduce premature planning, coding, or investigation when the user is still deciding what the work should include.

**Related:** After scope is clear, hand off to `.cursor/skills/plan/SKILL.md` for substantial work, `.cursor/skills/quick-piv/SKILL.md` for small well-scoped work, `.cursor/skills/implement/SKILL.md` for executing an existing plan, `.cursor/skills/debug/SKILL.md` for broken behavior, `.cursor/skills/review/SKILL.md` for critique, or `.cursor/skills/validate/SKILL.md` for rules and tooling checks.

---

## Core rule

Do not skip the scope decision phase.

If the user is still deciding what the work should include:

- Ask focused questions that narrow the ask.
- Do not create an implementation plan yet.
- Do not edit files.
- Do not run deep codebase investigation unless discovery is part of the requested scoping work.
- Keep questions practical: outcome, boundaries, constraints, examples, priority, and desired next workflow.

---

## Flow

### 1. Classify intake state

Classify the current situation as one of:

- **Scoping:** The desired outcome, boundaries, or priority are not clear yet.
- **Planning:** Scope is mostly clear and the user wants an implementation approach.
- **Implementation:** Scope and desired behavior are clear enough to change files.
- **Debugging:** Something is broken, unexpected, flaky, or unclear at runtime.
- **Review:** The user wants critique, risk analysis, or feedback.
- **Validation:** The user wants checks against rules, tooling, plans, or implementation gates.

If ambiguous, treat it as **Scoping** first.

### 2. Scope decision phase

During scoping, clarify only what is needed to choose the next workflow.

Ask about:

- The user-facing or operational outcome.
- What is explicitly in scope.
- What is explicitly out of scope.
- Must-have versus optional behavior.
- Constraints, examples, screenshots, affected areas, roles, data, environments, or deadlines.
- Whether the user wants discovery, a plan, implementation, debugging, review, validation, or advice after scope is defined.

Prefer a small set of high-signal questions. When offering options, make them progressively more complete.

### 3. Scope gate

Leave scoping only when you can state all of this clearly:

- "You want X."
- "In scope: A, B."
- "Out of scope: C."
- "Next step: plan / quick-piv / implement / debug / review / validate."

If any part is uncertain, ask another focused question.

### 4. Hand off

After the scope gate:

- **Substantial or multi-phase work:** Use `plan` before implementation.
- **Small, well-scoped work:** Use `quick-piv`; show the quick plan before edits.
- **Existing plan execution:** Use `implement`; if the applicable plan is ambiguous, ask first.
- **Broken behavior:** Use `debug`; gather observations and evidence before changing code.
- **Critique or quality feedback:** Use `review`; findings come before summary.
- **Rules/tooling confirmation:** Use `validate`; report findings before making fixes.

Do not use `quick-piv` as a shortcut out of active scoping. Use it only after scope is clear enough to summarize.

---

## Output pattern

When scope is unclear, respond with concise questions:

```markdown
I need to pin down the scope before choosing the workflow:

1. What outcome should the user see?
2. Is [possible boundary] in or out of scope?
3. After scope is clear, do you want a plan first or should I implement directly if it is small?
```

When scope is clear, summarize the gate and next workflow:

```markdown
You want [outcome].

In scope: [items].
Out of scope: [items].
Next step: [workflow], because [short reason].
```

Do not claim success without user verification when the work later moves into implementation or debugging.
