---
name: plan
description: "plan"
disable-model-invocation: true
---

# plan

Create a development plan for a feature or job. Research how best to implement it, check repo rules, and produce `DEVELOPMENT_PLAN.md` in `documentation/jobs/temp_job_<name>/`.

**Critical:** Conflict and compliance is researched first; steps in each phase must reflect that (file placements, architecture, patterns). The plan documents *how* to implement according to repo rules.

**Do NOT update the changelog.** Changelog updates are done in the finish command, not during planning.

**Related:** For session context, use `.cursor/skills/prime/SKILL.md`. For requirement gates before building, use `.cursor/skills/check/SKILL.md`. For small scoped work without a full plan file, use `.cursor/skills/quick-piv/SKILL.md`. To execute this plan phase by phase, use `.cursor/skills/implement/SKILL.md`. To review the plan or resulting code without changing anything first, use `.cursor/skills/validate/SKILL.md`. For commits and changelog, use `.cursor/skills/finish/SKILL.md`.

---

## Flow

### 1. Input

- User describes what they want (e.g. add a capability, migrate X to Y).
- Optional: job name, reference to spec or ticket.

### 2. Refine (if needed)

**If the request is vague or unclear, do NOT write a plan yet.**

- Ask clarifying questions (scope, context, constraints).
- Continue until scope is clear.
- Only proceed to investigation once scope is clear.

### 3. Investigate

- [ ] Search the codebase for existing functionality to reuse (features under `src/features/`, shared under `src/shared/`, `src/components/common/`).
- [ ] Identify relevant rules from `.cursor/rules/` (start at `.cursor/rules/INDEX.md`).
- [ ] For server-cached data, check `documentation/DOC_TANSTACK_QUERY.md` and existing `api/keys.ts` patterns in features.
- [ ] Determine scope and boundaries (in-scope vs out-of-scope).

### 4. Create plan

- [ ] Run conflict and compliance analysis first (see below).
- [ ] Define phases in logical order (workable chunks).
- [ ] Write steps per phase aligned with compliance (concrete paths, layers, patterns).
- [ ] Add a gate for each phase.
- [ ] Write `DEVELOPMENT_PLAN.md` to `documentation/jobs/temp_job_<name>/`.

### 5. Present and iterate

- Present the plan to the user.
- Incorporate feedback and update the plan as needed.

---

## Output location

**Path:** `documentation/jobs/temp_job_<name>/DEVELOPMENT_PLAN.md`

**Naming:** Follow `.cursor/rules/file-placement/RULE.md`: folder `temp_job_<descriptive-name>/` (kebab-case, descriptive). Allowed by `projectStructure.config.cjs` under `documentation/jobs/` (nested `*.md` files).

**Note:** Older jobs in this repo may use other filenames (e.g. `IMPLEMENTATION_PLAN.md`); new plans from this command should standardize on **`DEVELOPMENT_PLAN.md`**.

---

## Plan document structure

### Mandatory sections (always include)

| Section | Purpose | Content |
|---------|---------|---------|
| **Summary** | Why and what, in brief | What we are building, why, scope, constraints |
| **Phase overview** | Table of all phases | Phase #, goal, gate, status |
| **Conflict & compliance** | Avoid technical debt, meet repo rules | See checklist below |
| **Notes during development** | For implementation | Leave empty in the plan; fill during implementation |
| **Decisions made** | For implementation | Leave empty in the plan; fill during implementation |

### Per phase (repeat for each phase)

Phases must be in logical order and split into workable chunks. **Each phase must have a gate.**

| Subsection | Required? | Content |
|------------|-----------|---------|
| **Goal** | Yes | What we achieve in this phase |
| **Steps** | Yes | Concrete steps aligned with conflict & compliance |
| **Gate** | Yes | How we validate this phase is complete |

### Optional sections (include when relevant)

- **Source/context** – Where the request came from (feedback, ticket, etc.).
- **User stories** – For user-facing features.
- **Existing functionality** – What we reuse.
- **Scope / out-of-scope** – Explicit boundaries.

---

## Rules reference (research before writing steps)

| Topic | Location |
|-------|----------|
| Overview | `.cursor/rules/INDEX.md` |
| Architecture | `.cursor/rules/architecture/RULE.md` – layers, import direction, path aliases, structure whitelist |
| File placement | `.cursor/rules/file-placement/RULE.md` and `projectStructure.config.cjs` |
| Code style | `.cursor/rules/code-style/RULE.md` – naming, complexity (≤10 cyclomatic, ≤15 cognitive, ≤100 lines per function where applicable) |
| Database | `.cursor/rules/database/RULE.md` – migrations, idempotent, safe patterns |
| Security | `.cursor/rules/security/RULE.md` – auth, RLS, validation, secrets |
| Testing | `.cursor/rules/testing/RULE.md` |
| Workflow | `.cursor/rules/workflow/RULE.md` – branch strategy (changelog only in finish) |
| Cloud / Edge | `.cursor/rules/cloud-functions/RULE.md` – when applicable |
| Debugging | `.cursor/rules/debugging/RULE.md` – when diagnosing complex issues |

**Boilerplate docs:** `ARCHITECTURE.md`, `documentation/DOC_INDEX.md`, and for query-based data `documentation/DOC_TANSTACK_QUERY.md`.

**Import boundaries:** `.dependency-cruiser.cjs` (and `pnpm arch:check`) for layer rules beyond ESLint.

---

## Conflict & compliance checklist

**Purpose:** Ensure the plan complies with project rules and does not introduce unnecessary technical debt.

During planning, work through (using the rules reference above):

- [ ] Identify applicable rules (architecture, file-placement, database, security, code-style, testing, workflow, etc.).
- [ ] Validate planned file paths against `projectStructure.config.cjs` (whitelist); run `pnpm validate:structure` after structural additions if unsure.
- [ ] Check architecture compliance: feature vs `src/shared/` vs `src/components/common/`, layer boundaries, import direction (pages → hooks → services).
- [ ] Estimate complexity (cyclomatic ≤10, cognitive ≤15, functions ≤100 lines per `.cursor/rules/code-style/RULE.md`); plan extractions if needed (see `.cursor/skills/optimize2/SKILL.md` for refactoring workflow).
- [ ] Note database impact if applicable (migrations under `supabase/migrations/`, idempotent, safe for fresh and existing DB).
- [ ] Note security impact if applicable (auth, RLS, validation, secrets in `.env` only).
- [ ] Document conflicts with existing code (pattern mismatches, breaking changes).
- [ ] Consider testing: new or changed logic should have tests per `.cursor/rules/testing/RULE.md`.
- [ ] Workflow: branch strategy per `.cursor/rules/workflow/RULE.md` (e.g. not developing on `main`). Changelog is updated in **finish**, not while planning.
- [ ] If a feature’s behavior changes: plan updates to `src/features/<feature>/README.md` in the same work as code (see file-placement rule).

**Output inside `DEVELOPMENT_PLAN.md`:** A **Conflict & compliance** section with:

- Applicable rules (by name/path).
- Planned file placements and validation status (confirmed vs needs config change — config changes require explicit approval per architecture rule).
- Known risks / attention points.
- Open questions for the user.

---

## Gate examples

Each phase must have a gate.

### Frontend (this stack: Vite + React + MUI)

- Browser: expected UI present; primary flows work; loading/error states; responsive behavior where relevant.

### Backend / Supabase

| Type | Gate |
|------|------|
| **Edge Functions** | Invoke locally or deployed; verify response (see `cloud-functions/RULE.md`). |
| **Database** | Apply migration to a test DB; verify schema; test RLS with representative roles if applicable. |

### Repo quality

- `pnpm lint`, `pnpm type-check`, and tests relevant to the change (`pnpm test:run` or targeted files) pass at phase boundaries when code exists.

---

## Notes during development (mandatory empty section)

**Purpose:** Filled during implementation with technical debt, obstacles, gaps vs plan, follow-up ideas.

**Behavior:** Leave empty in the initial plan.

---

## Decisions made (mandatory empty section)

**Purpose:** Record choices; for important ones, ask the user.

**Format:**

```markdown
| Decision | Context | Outcome | User asked? |
|----------|---------|---------|-------------|
| X | ... | ... | Yes |
| Y | ... | ... | No (codebase precedent) |
```

**Behavior:** Leave empty in the initial plan.

---

## Example phase overview table

```markdown
| Phase | Goal | Gate | Status |
|-------|------|------|--------|
| 1 | ... | ... | Pending |
| 2 | ... | ... | Pending |
```

---

## Key principles

1. **Refine first:** If the request is vague, ask questions before writing the plan.
2. **Phases are workable:** Each phase is a logical, testable chunk.
3. **Gates are mandatory:** Every phase has a gate.
4. **Compliance first:** Conflict & compliance before detailed steps; steps must be rules-compliant.
5. **Empty sections:** Notes during development and Decisions made start empty.
