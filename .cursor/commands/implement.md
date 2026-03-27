# implement

Execute a development plan phase by phase. Use `DEVELOPMENT_PLAN.md` as the guide, run gates, and update the same document with progress, decisions, and notes.

**Critical:** Follow the plan. Follow repo rules during implementation. No shortcuts.

**Do NOT update the changelog.** Changelog updates are done in the finish command, not during implementation.

**Related:** Create or refresh plans with `.cursor/commands/plan.md`. For small tasks in one pass, `.cursor/commands/quick-piv.md`. After phases, use `.cursor/commands/validate.md` for a rules-and-tooling review before finish. For session context, `.cursor/commands/prime.md`. For commits and changelog, `.cursor/commands/finish.md`.

---

## Input

- User states what to implement (e.g. “implement the my-project redesign plan”).
- **Context-based:** Infer which plan from job name, open file, or recent discussion.
- If ambiguous which `temp_job_<name>/` folder applies, **stop** and ask.

**Plan location:** `documentation/jobs/temp_job_<name>/DEVELOPMENT_PLAN.md`

---

## Flow

### 1. Load plan

- [ ] Read `DEVELOPMENT_PLAN.md` for the resolved job folder.
- [ ] Verify mandatory sections exist: Summary, Phase overview, Conflict & compliance, Notes during development, Decisions made.
- [ ] Find the first phase in the overview that is not done (e.g. status `Pending`, empty, or not marked ✅).

### 2. Per phase: execute

For each phase **in order** (one phase at a time unless the plan explicitly allows parallel work):

1. **Read** the phase: Goal, Steps, Gate.
2. **Execute** the steps; match file layers, aliases, and patterns in `.cursor/rules/architecture/RULE.md` and `ARCHITECTURE.md`.
3. **Run** the gate (see below). It must pass before continuing.
4. **Update** `DEVELOPMENT_PLAN.md`:
   - **Phase overview:** set this phase’s status to `Done` or `✅` (use the wording/style already used in the table).
   - **Notes during development:** add entries when something notable happened.
   - **Decisions made:** add rows when a choice was made (see below).

### 3. Gate

- **Frontend:** Run the checks described in the plan (UI present, interactions, loading/error states, responsive if specified). Use the IDE browser MCP when available: navigate → snapshot → interact; follow the lock/unlock workflow in the MCP instructions.
- **Backend / Supabase:** As specified in the plan (e.g. migration applied, RLS checks, Edge Function invocation).
- **Repo quality:** When the plan or phase implies it, run `pnpm lint`, `pnpm type-check`, and relevant tests (`pnpm test:run` or scoped files). For structural changes, `pnpm validate:structure` and/or `pnpm arch:check` when adding imports across layers.
- If the gate fails: fix, re-run the gate, then continue.
- If the plan’s gate is impossible (missing env, no browser): document in Notes, **ask** the user, then proceed only after agreement.

### 4. Next phase

- Repeat until every phase in the overview is done.

---

## Rules reference (follow while coding)

See `.cursor/rules/INDEX.md` for the full set.

| Topic | Location |
|-------|----------|
| Architecture | `.cursor/rules/architecture/RULE.md` – layers, import direction, path aliases |
| File placement | `.cursor/rules/file-placement/RULE.md` and `projectStructure.config.cjs` |
| Code style | `.cursor/rules/code-style/RULE.md` – naming, complexity (≤10 cyclomatic, ≤15 cognitive, ≤100 lines per function) |
| Database | `.cursor/rules/database/RULE.md` – migrations |
| Security | `.cursor/rules/security/RULE.md` – auth, RLS, validation, secrets |
| Testing | `.cursor/rules/testing/RULE.md` |
| Workflow | `.cursor/rules/workflow/RULE.md` – branch strategy (changelog only in finish) |

**Also:** `.dependency-cruiser.cjs` / `pnpm arch:check` for layer violations; `documentation/DOC_TANSTACK_QUERY.md` when changing server state or queries.

---

## Notes during development

**When to add:**

- Technical debt from current or prior code
- Unexpected obstacles
- Gaps not covered in the plan
- Suggestions for later (refactor, cleanup)

**Format:** Chronological or by category.

**Example:**

```markdown
- [Phase 2] Removed legacy helper; orphan import in X.ts — clean up in a follow-up
- [Phase 3] Bar animation: MUI Transitions unsuitable for layout; used CSS transition instead
```

---

## Decisions made

**When to add:**

- Choices with no clear codebase precedent
- Subjective choices (design, UX, business rules)

**Important choices:**

1. **STOP** implementation
2. **ASK** the user explicitly
3. **WAIT** for an answer
4. **DOCUMENT** in Decisions made

**Format:**

```markdown
| Decision | Context | Outcome | User asked? |
|----------|---------|---------|-------------|
| Bar animation: CSS not MUI | MUI Transitions unsuitable for layout | CSS transition 300ms | Yes |
| Chips: hover state | No precedent | Match existing chip pattern | No |
```

---

## Unexpected obstacles

If something is not covered by the plan:

- Add an entry under **Notes during development**
- **STOP** and ask the user: “I hit [X]. The plan does not cover this. How should we proceed?”
- Wait for an answer, then continue and record any decision

---

## Documentation

If the plan requires doc updates (e.g. `src/features/<feature>/README.md`, `ARCHITECTURE.md`), do them in the phase that introduces the behavior. Follow the plan and `.cursor/rules/file-placement/RULE.md`.

---

## Checklist per phase

- [ ] Phase steps executed
- [ ] Gate passed
- [ ] Phase overview status updated
- [ ] Notes updated (if applicable)
- [ ] Decisions updated (if applicable)

---

## Completion

When all phases are done:

- [ ] Plan fully executed
- [ ] All gates passed
- [ ] Notes and Decisions sections are up to date

**Tell the user:** “Implementation complete. Anything else?”
