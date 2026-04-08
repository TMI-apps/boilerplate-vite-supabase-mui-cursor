---
name: check
description: "check"
disable-model-invocation: true
---

# check

## When the user requests a feature or functionality, follow these steps:

### 0. **Branch Verification (First Step)**
- [ ] Verify current git branch. If on `main`, **stop immediately** and instruct user to switch: `git checkout experimental`
- [ ] Never develop on `main`. All feature work must be on `experimental` or feature branches (see `workflow/RULE.md` § Branch Strategy)
- [ ] Proceed only after confirming branch is `experimental` or a feature branch
- [ ] If starting a new feature branch, ensure base is fresh (`git fetch` + sync with latest `origin/experimental`) before planning implementation

### 1. **Gather Required Information**
Collect ALL required info before proceeding. Use the checklists below to verify completeness.

---

#### **1a. Determine Feature Type**
Check all that apply - this determines which information is required:

- [ ] **API Integration** - Connects to external API or third-party service
- [ ] **Database Change** - New tables, columns, queries, or mutations
- [ ] **UI Component** - New visual element or modification
- [ ] **Business Logic** - New rules, calculations, or workflows
- [ ] **Authentication/Authorization** - Involves user roles or permissions

---

#### **1b. Required Information Checklist**

**Always required:**
- [ ] Clear description of desired outcome (what should happen?)
- [ ] Who uses this? (user roles: unauthorized/free/premium/admin)
- [ ] Where does this live? (page, component, or service location)

**If API Integration:**
- [ ] API documentation URL or content
- [ ] Authentication method (API key, OAuth, etc.)
- [ ] Request format (method, headers, body structure)
- [ ] Response format (actual example response, not just docs)
- [ ] Error response formats
- [ ] Rate limits or usage constraints

**If Database Change:**
- [ ] Relevant table schemas (run query or check Supabase dashboard)
- [ ] Existing related data patterns
- [ ] Required permissions (RLS policies)

**If UI Component:**
- [ ] Design reference (mockup, similar component, or description)
- [ ] Placement location (which page/section)
- [ ] Responsive requirements (mobile, tablet, desktop)
- [ ] Interactive states needed (hover, loading, error, empty, disabled)

**If Business Logic:**
- [ ] Input → Output examples (concrete cases)
- [ ] Edge cases to handle
- [ ] Existing similar logic to follow

**If Auth/Authorization:**
- [ ] Which roles are affected?
- [ ] What should each role see/do?
- [ ] Existing auth patterns in codebase

---

#### **1c. Completeness Gate**

**⛔ Do NOT proceed unless you can answer YES to all:**

1. Can I describe the exact expected behavior in concrete terms?
2. Do I have actual examples (not just descriptions) of inputs/outputs?
3. For APIs: Do I have a real response example (not just documentation)?
4. Do I know where this fits in the existing codebase?
5. Are there any "I'll figure it out later" items? (If yes, figure them out NOW)

**If any answer is "NO" or "don't know":** Ask the user for the specific missing information. Don't accept "here's the info" - verify against the checklist above.

---

### 2. **Identify Foundation Risk**
Determine what must work for everything else to matter:

**Ask:** "What's the riskiest assumption? What could invalidate the entire approach?"

Common foundations:
- **API integrations:** Response format, authentication, rate limits, error handling
- **Database operations:** Schema compatibility, query feasibility, permissions
- **Third-party services:** Availability, pricing, feature support
- **Novel algorithms:** Core logic correctness
- **Browser/platform APIs:** Compatibility, permissions

**Output:** Clearly state the foundation that must be validated first.

---

### 3. **Validate Foundation (Critical Gate)**
Before ANY planning, test the riskiest assumption:

1. **Create minimal proof-of-concept** - Smallest possible test to verify foundation works
2. **Execute the test** - Make the API call, run the query, test the algorithm
3. **Confirm results** - Does it work? Is the response format as expected?

**🔑 API Keys / Secrets:**
The assistant might not be able to access `.env` or API keys (hidden from assistant by default). When foundation validation requires authentication: **Request needed .env details from user in-chat** 

**⛔ GATE: Do NOT proceed until foundation is confirmed working.**

If foundation fails:
- Report to user immediately
- Investigate alternatives
- Return to Step 2 with new approach

---

### 4. **Refine into User Stories**
Extract user stories covering all relevant roles (may combine: "as an unauthorized/free/premium/admin user").

Include acceptance criteria:
- Happy path
- Error states and edge cases
- Loading and empty states
- Accessibility requirements

---

### 5. **Identify Existing Functionality**
Locate similar functionality to leverage:
- Files, functions, and their purpose
- Reusable components/patterns (API design, state, error handling, loading states)
- Components that, if abstracted, could be used for our intent
- Accessibility patterns already in use

---

### 6. **Draft & Document Phased Implementation Plan**

Build phases based on **risk** and **dependency gates**. Do uncertain things first; only proceed when each phase is proven.

**Output:** Create/update `/documentation/jobs/temp_job_[jobname]/IMPLEMENTATION_PLAN.md` with the plan. This file IS the deliverable - no separate documentation step.

**Feature-local docs (required):** When the work targets `src/features/*`, include `src/features/*/README.md` in the plan's files-to-modify list and keep it updated as implementation evolves.
**Deep docs (optional):** Add `src/features/*/docs/*.md` only with explicit user approval and only when cross-file behavior cannot be captured clearly in code/comments/tests.

**Inform user of opinionated choices** and mention viable alternatives.

---

#### **6a. List & Rank Work Items by Risk**

| Risk | Criteria | Examples |
|------|----------|----------|
| 🔴 **High** | Unproven, external, novel | New API integration, untested algorithm, unfamiliar library, third-party service |
| 🟡 **Medium** | Known patterns, new context | New component using existing patterns, new query on existing schema |
| 🟢 **Low** | Routine, proven, internal | Styling, copy, adding fields to existing forms, accessibility polish |

List all work items and assign a risk level.

---

#### **6b. Define Phases by Dependency Gates**

Group work into phases where each phase has a **gate** - a concrete test that must pass before proceeding.

**For each phase, define:**
1. **Goal:** What does this phase prove? (one sentence)
2. **Work:** Tasks included (group by dependency, not by type)
3. **Gate Test:** Specific, executable validation (not "it works" - concrete criteria)
4. **Fail Action:** What to do if gate fails

**Phase rules:**
- 🔴 High-risk items go in early phases, tested in isolation
- Never combine 🔴 with 🟡/🟢 in the same phase
- 🟡 and 🟢 CAN be combined if no dependency gate between them
- Ask: "Do I need to stop and verify before continuing?" If no → combine phases

---

#### **6c. Validate Phase Design**

Before finalizing, check each phase:

- [ ] **Demonstrable:** Can something be shown/tested after this phase?
- [ ] **Gated:** Is there a concrete pass/fail test?
- [ ] **Minimal:** Can this phase be combined with another without adding risk?
- [ ] **Ordered:** Are higher-risk items in earlier phases?

---

#### **Common Phase Patterns**

**API/Integration features (2-3 phases):**
1. 🔴 External service works (API responds correctly) → Gate: Real response matches expected format
2. 🟡 Data flows through app → Gate: Happy path works end-to-end
3. 🟢 Polish (errors, loading, edge cases, a11y) → Gate: Acceptance criteria met

**UI-heavy features (2-3 phases):**
1. 🟡 Component renders with real data → Gate: Core interaction works
2. 🟢 States and polish (loading, error, empty, responsive, a11y) → Gate: All states display correctly

**Logic-heavy features (2-3 phases):**
1. 🔴 Algorithm produces correct output (isolated) → Gate: Test cases pass
2. 🟡 Algorithm integrates with app state → Gate: Feature works in context
3. 🟢 Error handling and edge cases → Gate: Edge cases handled

**Simple features (1-2 phases):**
- If no 🔴 items and low complexity, may only need 1-2 phases
- Don't force artificial phase splits

---

#### **Phase Template**

```
**Phase N: [Descriptive Goal]**
- **Risk level:** 🔴/🟡/🟢
- **Work:**
  - Task 1
  - Task 2
- **Gate Test:** [Specific validation - what to check, expected result]
- **If gate fails:** [Reassess / investigate alternatives / return to Step 2]
```

---

#### **Technical Checklist (All Phases)**

- [ ] File placements comply with `projectStructure.config.js`
- [ ] Layer boundaries respected (`architecture/RULE.md`)
- [ ] No circular dependencies
- [ ] Complexity thresholds won't be exceeded (`.eslintrc.json` lines 65-70)
- [ ] Dependencies: new needed? existing sufficient?
- [ ] Impact on existing functionality assessed
- [ ] Feature-local documentation updated (`src/features/*/README.md`) when feature code changes
- [ ] No new deep documentation files added unless explicitly approved by user

Run `pnpm validate:structure` and `pnpm arch:check` to verify.

---

#### **Documentation File Structure**

The `IMPLEMENTATION_PLAN.md` must include:

```markdown
# [Feature Name]

## Foundation Validation
- What was tested:
- Result:

## User Stories
[From Step 4]

## Implementation Phases

### Phase 1: [Goal]
- Risk: 🔴/🟡/🟢
- Work: [tasks]
- Gate: [test]
- Files: [to create/modify]

### Phase 2: ...

## Technical Notes
[Architecture decisions, dependencies, gotchas]
```

---

### 7. **Get User Approval**
Present the documented plan (link to file). Wait for explicit approval before proceeding.

---

## Summary: The "Fail Fast" Flow

```
┌─────────────────────────────────────┐
│  0. Branch Check (never on main)     │
└──────────────────┬──────────────────┘
                   ▼
┌─────────────────────────────────────┐
│  1. Gather Info (stay until done)   │
└──────────────────┬──────────────────┘
                   ▼
┌─────────────────────────────────────┐
│  2. Identify Foundation Risk        │
└──────────────────┬──────────────────┘
                   ▼
┌─────────────────────────────────────┐
│  3. Validate Foundation             │
│     ⛔ GATE: Must pass to continue  │
└──────────────────┬──────────────────┘
                   ▼
┌─────────────────────────────────────┐
│  4. User Stories                    │
└──────────────────┬──────────────────┘
                   ▼
┌─────────────────────────────────────┐
│  5. Find Existing Functionality     │
└──────────────────┬──────────────────┘
                   ▼
┌─────────────────────────────────────┐
│  6. Draft & Document Plan           │
│     → IMPLEMENTATION_PLAN.md        │
│     Phase 1 → Gate → Phase 2 → ...  │
└──────────────────┬──────────────────┘
                   ▼
┌─────────────────────────────────────┐
│  7. Get User Approval               │
│     (review documented plan)        │
└─────────────────────────────────────┘
```

---

## Problem This Strategy Alleviates

**Old problem:** "Cursor agent builds complete plans before validating if the foundation works, leading to wasted effort when core assumptions fail."

**New approach:** Validate the riskiest assumption FIRST. Only invest in full planning after the foundation is proven. Chunk implementation into phases with gates to catch issues early.
