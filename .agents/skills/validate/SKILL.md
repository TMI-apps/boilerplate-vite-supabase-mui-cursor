---
name: validate
description: >-
  Validates a plan or an implementation via parallel read-only rule-shaped audits, then
  synthesizes findings before any fixes. Auto-selects depth: plan review, full implementation
  review (rules + tooling + plan-compliance), or a lighter pre-merge architecture gate. Use
  when validating a plan/implementation, before merge/finish, or after large refactors.
---

# validate

Validate either (1) a **plan document**, (2) the **implementation** of an executed plan, or (3) the **structural health** of a scope/diff before merge — via a **parallel rule-shaped audit**: one read-only subagent per relevant rule in `.cursor/rules/`, plus tooling and plan-compliance passes when an implementation is in scope. Synthesize findings, surface unresolved ambiguity, then report.

**Critical:** Validation does **not** edit anything in the audit/report steps. First synthesize and report, ask the user, then optionally act.

**Mode is auto-selected — no user input required.** The agent picks depth from context (see § Mode auto-selection). The user may still force a mode by wording (e.g. "just a quick architecture gate", "full validation").

---

## Mode auto-selection

Pick the mode from context. Resolve top-down; first match wins.

| Signal in context | Mode | What runs |
|---|---|---|
| Plan not yet executed, **or** user asks for plan-only review | **plan-review** | Rule subagents only. No tooling, no plan-compliance. |
| Active `DEVELOPMENT_PLAN.md` for this scope and code was implemented against it (pre-finish, post-implement) | **impl-full** | Rule subagents + tooling pass + **plan-compliance** subagent. |
| Code changes / diff / refactor with **no** governing plan to compare against; goal is pre-merge or post-refactor structural confidence | **gate** | Default rule subagents (smaller set) + tooling pass. **No plan-compliance.** |

**Disambiguation cues:**

- **plan-review vs impl-full** — is there code to audit yet? No code → plan-review. Code exists for the plan → impl-full.
- **impl-full vs gate** — is there a `DEVELOPMENT_PLAN.md` whose phases/gates this scope must match? Yes → impl-full (adds plan-compliance). No plan, just "is this structurally sound before I merge?" → gate.
- **When ambiguous between impl-full and gate, prefer impl-full** (superset; plan-compliance returns `applicable:false` cheaply if no plan is found).

State the chosen mode in one line at the top of the report (e.g. `Mode: gate — pre-merge architecture check on staged diff`).

Fan-out runs on **every** invocation. There is no "single-pass" mode.

---

## Mode rule sets

| Mode | Always-spawn rule subagents | Conditional subagents | Plan-compliance |
|---|---|---|---|
| **plan-review** | every rule plausibly relevant to the plan | as applicable | no |
| **impl-full** | every rule plausibly relevant to the diff | as applicable | **yes** |
| **gate** | `architecture` (incl. Feature granularity lens), `file-placement`, `code-style` | `security`, `database`, `testing`, `workflow` when scope touches them | no |

Err toward inclusion in all modes — `applicable: false` is cheap.

---

## Input & scope

- User states what to validate (e.g. "validate the plan", "validate the implementation", "check before merge"). Mode is inferred per § Mode auto-selection.
- **Context-based:** infer the job from job name, open file, or recent discussion.
- If ambiguous which `temp_job_<name>/` applies, **stop** and ask.

**Plan location:** `documentation/jobs/temp_job_<name>/DEVELOPMENT_PLAN.md`

**Scope:**
- **plan-review** — the plan path.
- **impl-full / gate** — explicit files/feature/branch if named; otherwise recent changes (`git diff --name-only` or `--cached`). If unclear, ask.

### Branch verification (impl-full / gate)

Verify not on `main`. If on `main`, **stop** — instruct `git switch -c feature/<name>` (see `.cursor/rules/workflow/RULE.md` § Branch Strategy).

---

## Subagent contract

Every rule subagent is invoked the same way. The parent calls `Task` with `subagent_type: explore` and `readonly: true`, passing:

- **Mode** — `plan-review`, `impl-full`, or `gate`.
- **Scope** — plan path for plan review; changed paths or unified diff otherwise.
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

## Non-rule passes

### Tooling pass (impl-full and gate)

The parent runs these directly, in parallel with the subagent fan-out (deterministic shell, no value in delegating). Summarize failures only.

**impl-full (full list):**

- `pnpm validate:structure`
- `pnpm validate:feature-size`
- `pnpm validate:feature-docs:strict`
- `pnpm lint`
- `pnpm type-check`
- `pnpm arch:check`
- `pnpm test:run` — when the change touches tested logic or the plan requires tests
- `pnpm format:check` — optional, if style drift is in scope

**gate (lighter list):**

- `pnpm validate:structure`
- `pnpm validate:feature-size`
- `pnpm lint`
- `pnpm type-check`
- `pnpm arch:check`
- `pnpm test:run` — when scoped changes touch tested logic

Each failing command becomes one finding (`rule: "tooling"`, `rule_section: "<command>"`). Severity: Blocker for structural / type / lint / arch failures; Warning for format drift; tests follow whether the plan required them. Demote to Warning only with clear context.

### Plan-compliance subagent (impl-full only)

One additional read-only subagent compares the code against `DEVELOPMENT_PLAN.md`:

- Phases marked done vs actual code.
- Gates implied by the plan vs reality.
- Feature `README.md` content alignment the plan required (`pnpm validate:feature-docs:strict` covers presence; this covers content).

Same output schema, with `rule: "plan-compliance"`.

**Plan-compliance is intentionally excluded from `gate`.** Use impl-full when you need the plan-vs-code comparison.

---

## Flow

1. **Determine mode** (§ Mode auto-selection) and state it in the report header.
2. **Compute scope** — plan path for plan review; `git diff` paths / unified diff otherwise. Run branch verification for impl-full / gate.
3. **Fan out in parallel:**
   - One subagent per applicable rule in `.cursor/rules/` (rule set per § Mode rule sets).
   - impl-full / gate: also run the tooling pass. impl-full: also run the plan-compliance subagent.
4. **Aggregate** when everything returns.
5. **Synthesize:**
   - Deduplicate findings that overlap across rules (e.g. file-placement and architecture flagging the same path).
   - Group by category, sort by severity.
   - Surface any subagent that returned an `error` as **"not audited — rerun recommended"** rather than silently dropping it.
6. **Ambiguity gate** — collect every finding with `ambiguity: "user-question-needed"` and ask all questions in **one batch** before the report. Record answers alongside the affected findings.
7. **Report** — see format below. No edits in this step.
8. **Ask:** "What should I do with these findings — fix all, specific items, or nothing?" Wait for the user.
9. **Optionally act** — only if the user requests fixes; apply changes (plan markdown and/or source) while still following `.cursor/rules/` and the structure whitelist. Changelog remains the responsibility of `.agents/skills/finish/SKILL.md` unless the user explicitly includes it.

**Next:**

- **impl-full / gate, no blockers (or user waived):** offer **`.agents/skills/finish/SKILL.md`** when the user wants to commit.
- **impl-full / gate, blockers:** hand back to **`.agents/skills/implement/SKILL.md`** (or fix here if requested).
- **plan-review only:** next is **`implement`** when gates pass, or back to **`plan`** if the plan must change.
- **Semantic placement after tooling green:** **`.agents/skills/consolidate/SKILL.md`** § Semantic placement mode (not a substitute for this gate).

---

## Report format

Open the report with: **Mode**, total findings, counts by severity, and any rules listed as **not audited**.

Group findings by category (Architecture, File placement, Code style, … — plus Tooling, and Plan vs code in impl-full). For each finding:

- **Finding** — what is wrong, missing, or risky
- **Suggestion** — concrete improvement
- **Rule** — `.cursor/rules/<name>/RULE.md` § section
- **Severity** — Blocker | Warning | Suggestion
- **Source** — `file:line` for impl/gate, plan section for plan review
- **Ambiguity answer** — when the finding had a `user-question-needed` flag, include the user's batched answer

Severity meaning:

| Severity | Meaning |
|----------|---------|
| **Blocker** | Must fix before merge / finish |
| **Warning** | Should fix; risks tech debt |
| **Suggestion** | Nice to have |

---

## Rules reference (subagent registry)

Spawn one subagent per applicable rule. Registry SSOT: [`.cursor/rules/INDEX.md`](../../../.cursor/rules/INDEX.md) and [`.agents/skills/plan/references/rules-registry.md`](../plan/references/rules-registry.md). Other rule files in `.cursor/rules/` (e.g. `debugging/`, `cloud-functions/`, `project-specific/`) are spawned when the scope touches them.

---

## Not in scope (use other skills)

| Topic | Use instead |
|-------|-------------|
| Industry standards / best practice vs plans and proposals (agent-chosen aspects) | [`.agents/skills/pattern-review/SKILL.md`](../pattern-review/SKILL.md) |
| Multi-lens qualitative plan critique (rebel, scale, industry precedent, …) | [`.agents/skills/review-dev-plan/SKILL.md`](../review-dev-plan/SKILL.md) |
| Single React component rubric | [`.agents/skills/review/SKILL.md`](../review/SKILL.md) |
| Commit / changelog / push | [`.agents/skills/finish/SKILL.md`](../finish/SKILL.md) / `push` |

For Complexity **M/L** plans, run **`review-dev-plan`** before implementation when the plan requires it; **`validate`** does not replace industry-precedent review.

---

## Boundaries

| Not `validate` | Use instead |
|----------------|-------------|
| Industry / product precedent | `pattern-review` |
| Six-lens qualitative plan critique | `review-dev-plan` |
| Single React component rubric | `review` |
| Commit / changelog | `finish` |
| Push only | `push` |
| Semantic wrong-layer repair (after tooling green) | `consolidate` § Semantic placement |
