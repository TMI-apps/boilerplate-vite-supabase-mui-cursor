---
name: pattern-review
description: >-
  PROACTIVE: Compare a development plan or implementation proposal to industry standards
  and common best practice before application code — without waiting for the user to ask.
  The agent selects relevant aspects (UX, APIs, identity, async, coupling, etc.) per change.
  Use at planning (especially M/L), feature architecture, router intake on novel behavior,
  review-dev-plan industry lens, or when the user asks for best practice / industry standard check.
  Not repo rule compliance (use validate for that).
disable-model-invocation: false
---

# pattern-review

**Scope:** External **industry / product precedent** for plans and proposals — not `validate` (repo rules).

**Feedback first** — surface risks and options; do not edit product code or plans unless the user asks afterward.

## Proactive obligation (agents)

Apply **without being asked** when you are about to propose or write a plan, RFC, or material UX/API/architecture design — especially before novel `src/` work.

**Do:** follow [`references/rubric.md`](references/rubric.md) → choose relevant aspects → compare to precedents → verdict → **Pattern risk** alert if non-standard → **stop** until owner picks A/B/C or waives.

**Do not:** treat “we already do it in the codebase” as sufficient without naming **external** precedent and tradeoffs.

## Where everything lives

Per [`documentation/DOC_AGENT_WORKFLOW_LAYERS.md`](../../../documentation/DOC_AGENT_WORKFLOW_LAYERS.md).

| What | Path |
|------|------|
| **Procedure** (this file) | `.agents/skills/pattern-review/SKILL.md` |
| **Rubric** (lens, verdicts, plan fields) | `.agents/skills/pattern-review/references/rubric.md` |
| **Alert template** | `.agents/skills/pattern-review/references/alert-template.md` |
| **Plan section** | `.agents/skills/plan/references/implementation-plan-template.md` § Pattern & precedent |

---

## When to run

| Situation | Mode |
|-----------|------|
| User asks best practice / industry standard | `scan` |
| Intake or plan touches new user-visible behavior or contracts | `scan` or `plan-section` |
| Writing `DEVELOPMENT_PLAN.md` | `plan-section` (required for Complexity **M/L**) |
| `review-dev-plan` industry lens | Uses same rubric; no separate invoke required |
| Mid-implementation, no plan | `lite` |

---

## Procedure

1. Read [`references/rubric.md`](references/rubric.md).
2. Gather context: plan path, proposal, or changed scope.
3. **Classify** the capability; **pick precedents**; **select dimensions** that matter for this change (agent judgment — not a fixed checklist).
4. If review is **not needed** (trivial / no new behavioral contract) → one short paragraph and stop.
5. If **aligned** or **acceptable product-specific** with documented tradeoffs → short summary; proceed under normal gates.
6. If **non-standard** → post alert from [`references/alert-template.md`](references/alert-template.md); **stop** until owner decides.
7. For `plan-section`, record in `DEVELOPMENT_PLAN.md` § **Pattern & precedent**.

---

## Modes

### `scan` (default)

Full lens: precedents → chosen aspects → verdict → alert if needed.

### `plan-section`

Write § **Pattern & precedent** in the plan (see template).

### `lite`

Rubric § Lite pass; escalate to full alert if material divergence.

---

## Integration

| Caller | How |
|--------|-----|
| `plan` | Step 5: `plan-section` when M/L or material behavioral design |
| `review-dev-plan` | Industry precedent agent reads `references/rubric.md` |
| `router` | Novel behavior → pattern-review before `src/`; see dev-cycle matrix |
| `feature` | § 3.1b at architecture phase |
| `validate` | Does **not** replace this skill |

---

## Output (chat)

```markdown
Pattern review: <skipped — reason | aligned | non-standard — see below>
```

If non-standard, include **Pattern risk** block, then:

```markdown
Next: owner pick A/B/C or waive → then plan / implementation
```

---

## Related

- [`review-dev-plan`](../review-dev-plan/SKILL.md)
- [`plan`](../plan/SKILL.md)
- [`validate`](../validate/SKILL.md)
