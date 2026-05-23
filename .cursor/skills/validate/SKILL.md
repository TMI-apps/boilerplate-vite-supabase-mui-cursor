---
name: validate
description: "validate"
---

# validate

Validate either (1) the plan document or (2) the implementation of an executed plan via a **parallel rule-shaped audit**: one read-only subagent per rule in `.cursor/rules/`, plus tooling and plan-compliance passes in implementation mode. Synthesize findings, surface unresolved ambiguity, then report.

**Critical:** Validation does **not** edit anything in steps 1–7. First synthesize and report, ask the user, then optionally act.

**Related:** Plan with `.cursor/skills/plan/SKILL.md`. Execute with `.cursor/skills/implement/SKILL.md`. Pre-merge architecture gate: `.cursor/skills/check/SKILL.md` (same fan-out, smaller default rule set, no plan-compliance pass). Small scoped PIV in one go: `.cursor/skills/quick-piv/SKILL.md`. Session context: `.cursor/skills/prime/SKILL.md`. Commits and changelog: `.cursor/skills/finish/SKILL.md`.

---

## Input

- User states what to validate (e.g. "validate the plan", "validate the implementation").
- **Context-based:** infer use case and which job from job name, open file, or recent discussion.
- If ambiguous which `temp_job_<name>/` applies, **stop** and ask.

**Plan location:** `documentation/jobs/temp_job_<name>/DEVELOPMENT_PLAN.md`

---

## Use case

| Use case | When | What runs in parallel |
|----------|------|-----------------------|
| **Plan review** | Plan not yet executed (or user asks for plan-only review) | Rule subagents only. No tooling, no plan-compliance subagent. |
| **Impl review** | Implementation exists or user asks to validate code | Rule subagents + tooling pass + plan-compliance subagent. |

Fan-out runs on **every** invocation. There is no "single-pass" mode.

---

## Subagent contract

Every rule subagent is invoked the same way. The parent calls the `Task` tool with `subagent_type: explore` and `readonly: true`, passing:

- **Mode** — `plan-review` or `impl-review`.
- **Scope** — plan path for plan review; changed paths or unified diff for impl review.
- **Rule file** — exactly one (e.g. `.cursor/rules/architecture/RULE.md`).
- **Output schema** — every subagent returns the structure below.

**Allowed reads:** the rule file, the scope, and configs the rule itself references (e.g. `projectStructure.config.cjs`, `.dependency-cruiser.cjs`, `ARCHITECTURE.md`, `documentation/DOC_TANSTACK_QUERY.md`, `documentation/DOC_FEATURE_LOCAL_README.md`, `documentation/DOC_APP_VISION.md`). Do **not** read other rule files; cross-rule overlap is handled by the parent.

**Output schema (required):**

```json
{
  "rule": ".cursor/rules/<name>/RULE.md",
  "applicable": true,
  "findings": [
    {
      "severity": "Blocker | Warning | Suggestion",
      "category": "<short>",
      "file": "<path or 'plan'>",
      "line": "<number or null>",
      "finding": "<text>",
      "rule_section": "<e.g. § Layer direction>",
      "ambiguity": "none | user-question-needed",
      "question": "<text or null>"
    }
  ]
}
```

If the rule does not apply to the scope, return `{ "applicable": false, "findings": [] }`. If the subagent fails, return the same shape with an additional `"error"` field describing the failure.

**Standards diversion** — any deviation from industry standards, framework best practices, or established repo conventions becomes a finding with `ambiguity: "user-question-needed"` and a concrete question.

**Applicability:** spawn a subagent for every rule plausibly relevant to the scope. Err toward inclusion — `applicable: false` is cheap and explicit.

---

## Non-rule passes (impl review only)

### Tooling pass

The parent runs these directly, in parallel with the subagent fan-out (deterministic shell, no value in delegating). Summarize failures only:

- `pnpm validate:structure`
- `pnpm validate:feature-docs:strict`
- `pnpm lint`
- `pnpm type-check`
- `pnpm arch:check`
- `pnpm test:run` — when the change touches tested logic or the plan requires tests
- `pnpm format:check` — optional, if style drift is in scope

Each failing command becomes one finding with `rule: "tooling"` and `rule_section: "<command>"`. The parent assigns severity (Blocker for structural / type / lint / arch failures; Warning for format drift; tests follow whether the plan required them).

### Plan-compliance subagent

One additional read-only subagent compares the code against `DEVELOPMENT_PLAN.md`:

- Phases marked done vs actual code.
- Gates implied by the plan vs reality.
- Feature `README.md` updates the plan required (`pnpm validate:feature-docs:strict` already covers presence; this subagent covers content alignment).

Same output schema, with `rule: "plan-compliance"`.

---

## Flow

1. **Determine mode** (plan or impl) from context and user wording.
2. **Compute scope** — plan path for plan review; `git diff` paths / unified diff for impl review.
3. **Fan out in parallel:**
   - One subagent per applicable rule in `.cursor/rules/` (registry below).
   - In impl mode, also run the tooling pass and the plan-compliance subagent.
4. **Aggregate** when everything returns.
5. **Synthesize:**
   - Deduplicate findings that overlap across rules (e.g. file-placement and architecture flagging the same path).
   - Group by category, sort by severity.
   - Surface any subagent that returned an `error` as **"not audited — rerun recommended"** rather than silently dropping it.
6. **Ambiguity gate** — collect every finding with `ambiguity: "user-question-needed"` and ask all questions in **one batch** before the report. The answers are recorded in the report alongside the affected findings.
7. **Report** — see format below. No edits in this step.
8. **Ask:** "What should I do with these findings — fix all, specific items, or nothing?" Wait for the user.
9. **Optionally act** — only if the user requests fixes; apply changes (plan markdown and/or source) while still following `.cursor/rules/` and the structure whitelist. Changelog remains the responsibility of `.cursor/skills/finish/SKILL.md` unless the user explicitly includes it in the requested fixes.

---

## Rules reference (subagent registry)

| Topic | Rule file |
|-------|-----------|
| Overview / index | `.cursor/rules/INDEX.md` |
| Architecture | `.cursor/rules/architecture/RULE.md` |
| File placement | `.cursor/rules/file-placement/RULE.md` (uses `projectStructure.config.cjs`) |
| Code style | `.cursor/rules/code-style/RULE.md` |
| Database | `.cursor/rules/database/RULE.md` |
| Security | `.cursor/rules/security/RULE.md` |
| Testing | `.cursor/rules/testing/RULE.md` |
| Workflow | `.cursor/rules/workflow/RULE.md` |

Other rule files in `.cursor/rules/` (e.g. `debugging/`, `cloud-functions/`, `project-specific/`) are spawned when the scope touches them.

---

## Report format

Open the report with: total findings, counts by severity, and any rules listed as **not audited**.

Group findings by category (categories follow the rule subagents — Architecture, File placement, Code style, … — plus Tooling and Plan vs code in impl mode). For each finding:

- **Finding** — what is wrong, missing, or risky
- **Suggestion** — concrete improvement
- **Rule** — `.cursor/rules/<name>/RULE.md` § section
- **Severity** — Blocker | Warning | Suggestion
- **Source** — `file:line` for impl review, plan section for plan review
- **Ambiguity answer** — when the finding had a `user-question-needed` flag, include the user's batched answer
