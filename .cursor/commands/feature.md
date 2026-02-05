# feature

Systematic engineering process for new feature requests. Follow phases sequentially. 

**CRITICAL: At every 🔴 DECISION POINT, you MUST:**
1. **STOP** all coding/implementation activities
2. Present the question/decision clearly to the user
3. **WAIT** for explicit user response before proceeding
4. Document the user's answer in the implementation document
5. Do NOT proceed to next phase until user confirms

**Violating decision points is a critical failure.**

---

## Phase 1: Pre-Development Analysis

### 1.1 Branch & Workflow Check
- [ ] Verify branch to be: `experimental` (workflow/RULE.md)

### 1.2 Rule Decision Tree
Check each rule category systematically:

**Backend/Secrets?**
- YES → Check `cloud-functions/RULE.md` (decision framework: security, secrets, testability)
- NO → Skip

**Database changes?**
- YES → Check `database/RULE.md` (migration patterns: idempotent, IF EXISTS, safe for fresh/existing DBs)
- NO → Skip

**File placement?**
- Check `file-placement/RULE.md` → `architecture/RULE.md`
- Determine location BEFORE creating files

**Code structure?**
- Check `architecture/RULE.md` (feature vs shared, layers, import direction, path aliases)

**Security?**
- Check `security/RULE.md` (auth, RLS, validation, secrets management)

**Implementation details?**
- Check `code-style/RULE.md` (naming, formatting, complexity: ≤10 cyclomatic, ≤15 cognitive, ≤100 lines)

### 1.3 Risk & Impact Assessment
- [ ] Identify breaking changes
- [ ] Assess impact on existing functionality
- [ ] Determine testability (experimental branch safe? Edge functions backup? Database has staging?)
- [ ] Flag high-risk decisions requiring user approval

**🔴 DECISION POINT:** 
- If high-risk identified → **STOP** immediately
- Present risk assessment to user
- Ask: "Should I proceed with this high-risk change?"
- **WAIT** for explicit user confirmation (yes/no)
- Document user's decision before proceeding

---

## Phase 2: Requirements & Design

### 2.1 User Stories
- [ ] Extract user stories with roles (unauthorized/free/premium/admin)
- [ ] Define acceptance criteria:
  - Happy path
  - Error states & edge cases
  - Loading & empty states
  - Accessibility requirements

### 2.1.1 User Journey & State Transition Mapping (MANDATORY)
**This section MUST be completed before proceeding to Phase 3. Map ALL user states and transitions:**

- [ ] **Initial States:** Document all entry points (unauthenticated, authenticated, anonymous, expired session, etc.)
- [ ] **State Transitions:** Map every possible transition:
  - What triggers each transition?
  - Where does user go after each action?
  - What happens on errors during transitions?
- [ ] **Navigation Flows:** Document complete navigation paths:
  - Entry → Feature → Exit
  - Error recovery paths
  - Back/forward navigation behavior
- [ ] **Edge Cases in User Flow:**
  - What happens if user navigates away mid-action?
  - What happens if session expires during feature use?
  - What happens on logout/logout from different states?
  - What happens if user loses network connectivity?
  - What happens if user refreshes page mid-flow?
- [ ] **Cross-Feature Interactions:** How does this feature interact with:
  - Authentication state changes
  - Other features that might trigger navigation
  - Global state changes (notifications, updates, etc.)

**Format:** Create a state diagram or transition table documenting all states and transitions. Include this in the implementation document.

**🔴 DECISION POINT:** Present the user journey map to user. Confirm completeness before proceeding. Ask: "Are there any user states, transitions, or edge cases missing from this map?"

### 2.2 Existing Functionality Search
**After user stories are defined**, search for existing functionality that could satisfy them:
- [ ] Search for similar functionality (semantic search)
- [ ] Identify reusable components/patterns (API design, state, error handling)
- [ ] Find components that could be abstracted/extended
- [ ] Check if user stories are already (partially) satisfied by existing code
- [ ] Document existing patterns found

### 2.3 Required Information Gathering
Categorize missing info:
- **External:** Database schema, API keys, dependency docs, response formats
- **App context:** Architecture, tech stack, auth patterns, adjacent functionality, state management
- **Design intent:** Only aspects NOT already established in codebase

**🔴 DECISION POINT:** 
- For missing info → Search codebase first
- If no codebase precedent exists → **STOP** and ask user
- Format question clearly: "I need to know [specific thing]. I searched the codebase and found no precedent. What should [specific thing] be?"
- **WAIT** for user answer
- Document answer before proceeding

### 2.4 Design Options (Progressive Complexity)
Present options from simplest to most complex:

**Option A: Simplification**
- Achieve by removing/simplifying existing code
- Minimal changes, maximum leverage

**Option B: Refactoring**
- Achieve by refactoring existing code
- Reuse patterns, extend components

**Option C: Minimal Addition**
- Achieve with minimal new code leveraging existing patterns
- New components/files only where necessary

**Option D: New Implementation** 
- New implementation required, but still uses existing functionality where possible
- hook into existing functionality from 2.2
- follow existing patterns, components, and design standards
- reuse existing utilities, hooks, services where applicable

**🔴 DECISION POINT:** 
- **STOP** implementation activities
- Present ALL options (A, B, C, D) with analysis
- Include existing functionality that supports each option
- Ask: "Which approach should I use: A, B, C, or D?"
- **WAIT** for user's explicit choice
- Document chosen option before proceeding

### 2.5 Decision Point Matrix
Identify **subjective** choices requiring user input.

**Subjective (ASK user):**
- Choices where NO codebase precedent exists
- Business logic decisions (what should happen)
- Feature scope decisions
- New interaction patterns not yet in app
- Risk/complexity tradeoffs
- **User journey decisions** (where users go after actions, error recovery paths)

**Objective (DO NOT ask, follow codebase standards):**
- Choices where codebase standards already exist
- Design system elements (spacing, colors, typography, shadows)
- Component patterns already used in app
- State management patterns already established
- Error handling patterns already established
- File structure and naming conventions

**🔴 DECISION POINT:** 
1. **STOP** and list all subjective choices identified
2. For EACH subjective choice, ask the user explicitly
3. Document user's answers in format:
   ```
   Q: [Question]
   A: [User's answer]
   Decision: [What was decided]
   ```
4. **DO NOT PROCEED** until all subjective choices have user answers documented
5. Verify no unanswered questions remain before moving to Phase 3

---

## Phase 3: Architecture & Structure Planning

### 3.1 Architecture Planning
- [ ] Determine feature structure (feature-based vs shared) - `architecture/RULE.md`
- [ ] Choose layer placement (components/hooks/services/utils) - `architecture/RULE.md`
- [ ] Understand import direction (downward only) - `architecture/RULE.md`
- [ ] Select path aliases (@/hooks/*, @/components/*, etc.) - `architecture/RULE.md`
- [ ] Decide: feature-specific vs shared code - `architecture/RULE.md`

### 3.2 Cloud Functions Planning (if backend needed)
- [ ] Use decision framework (`cloud-functions/RULE.md`): security, secrets, testability
- [ ] Decide: Edge Function vs frontend logic
- [ ] Organize by business capability if creating functions

### 3.3 Database Planning (if database changes needed)
- [ ] Plan migration patterns (`database/RULE.md`): idempotent, safe for fresh/existing DBs
- [ ] Use safe patterns (IF EXISTS, OR REPLACE, etc.)
- [ ] Handle empty tables in data migrations

### 3.4 Security Planning
- [ ] Authentication/authorization requirements (`security/RULE.md`)
- [ ] Input validation patterns (`security/RULE.md`)
- [ ] RLS policies if database changes (`security/RULE.md`)
- [ ] Secrets management if Edge Functions (`security/RULE.md`)
- [ ] Rate limiting if Edge Functions (`project-specific/RULE.md`)

### 3.5 File Placement Validation
- [ ] Validate against `projectStructure.config.js` (run `pnpm validate:structure`)
- [ ] Confirm correct location per `file-placement/RULE.md`
- [ ] Check whitelist compliance
- [ ] Determine file locations BEFORE creating

### 3.6 Complexity Projection
- [ ] Estimate cyclomatic complexity (target: ≤10)
- [ ] Estimate cognitive complexity (target: ≤15)
- [ ] Estimate function length (target: ≤100 lines)
- [ ] Estimate parameters (target: ≤5)

**🔴 DECISION POINT:** 
- If projections exceed thresholds → **STOP**
- Present complexity analysis to user
- Ask: "Complexity exceeds thresholds. Should I simplify the design, or proceed with your approval?"
- **WAIT** for user decision
- Document decision before proceeding

### 3.7 Integration Points Analysis
- [ ] Identify integration points with existing code
- [ ] Assess impact on existing functionality
- [ ] Plan backward compatibility if needed
- [ ] Document dependencies

---

## Phase 4: Implementation Plan

### 4.1 Component/API Design
- [ ] Leveraged existing functionality (from 2.2)
- [ ] Props interface (types, defaults)
- [ ] Follows existing patterns?
- [ ] Minimal API for common cases, flexible for advanced
- [ ] Composability with existing components

### 4.2 State & Data Flow
- [ ] State location (local/context/store)
- [ ] Async states (loading, error, empty, success)
- [ ] Side effects (API calls, subscriptions, timers)
- [ ] Data flow direction

### 4.3 UI/UX Considerations
- [ ] Layout and placement
- [ ] Responsive strategy (breakpoints)
- [ ] Interactive states (hover, active, disabled, loading, error)
- [ ] Empty and loading states

### 4.4 Accessibility Planning
- [ ] Keyboard interactions (Tab, Enter, Escape, arrows)
- [ ] ARIA attributes
- [ ] Focus management
- [ ] Semantic HTML

### 4.5 Technical Considerations
- [ ] Pseudo-code sketches
- [ ] New components: purpose, location (`file-placement/RULE.md`), reusability
- [ ] Performance (rendering, bundle size, lazy loading)
- [ ] Error scenarios and edge cases
- [ ] Dependencies (new needed? existing sufficient?)
- [ ] Integration points
- [ ] Impact on existing functionality

### 4.6 Validation & Testing Plan
- [ ] How to validate correctness
- [ ] Manual/user testing steps (default)
- [ ] Identify if automated tests are warranted (see 6.1 criteria)

### 4.7 Architecture Compliance Check (Plan Validation)
Verify the PLAN complies before implementation:
- [ ] Planned file placements comply with `projectStructure.config.js`
- [ ] Planned layer boundaries respect `architecture/RULE.md`
- [ ] No planned circular dependencies
- [ ] Planned complexity within thresholds (SSOT: `.eslintrc.json` lines 65-70)

*Note: Actual validation commands run after implementation in Phase 5.*

**🔴 DECISION POINT:** 
- **STOP** all implementation activities
- Present complete implementation plan summary:
  - User stories and acceptance criteria
  - Chosen design approach
  - User journey map (from 2.1.1)
  - All subjective decisions made (from 2.5)
  - Architecture decisions
  - File structure plan
  - State management approach
- Ask: "Does this implementation plan look correct? Should I proceed with implementation?"
- **WAIT** for explicit user approval ("yes", "proceed", "looks good", etc.)
- **DO NOT START CODING** until user explicitly approves
- Document approval in implementation document

---

## Phase 5: Implementation

### 5.1 Re-check Required Information
- [ ] Repeat Phase 1.2 for any missing information
- [ ] **STAY HERE UNTIL ALL REQUIRED INFORMATION IS COLLECTED**
- [ ] Verify all user questions from Phase 2.5 have documented answers
- [ ] Verify user journey map (2.1.1) is complete and approved
- [ ] Verify implementation plan (Phase 4) has explicit user approval

**🔴 VALIDATION CHECKPOINT:** 
Before proceeding to 5.2, confirm:
- [ ] All 🔴 decision points from previous phases have user answers documented
- [ ] User journey map exists and is complete
- [ ] Implementation plan has explicit user approval
- If ANY item is missing → **STOP** and complete it before proceeding

### 5.2 Create Implementation Document
Create/update `/documentation/jobs/temp_job_[jobname]` (create folder if needed) with:
- User stories with acceptance criteria
- **User journey & state transition map** (from 2.1.1)
- **All user questions and answers** (from 2.5, formatted as Q/A pairs)
- Chosen implementation plan
- Chosen design approach (A/B/C/D from 2.4)
- Component/API design decisions
- State management approach
- File placements (validated)
- Accessibility requirements
- Manual testing steps
- Files to create/modify
- **User approval confirmation** (from Phase 4.7)

### 5.3 Execute Implementation
- [ ] Follow implementation plan
- [ ] Make minimal code changes (reductive strategy)
- [ ] Avoid cyclomatic/cognitive complexity
- [ ] Follow code-style rules (`code-style/RULE.md`)
- [ ] Use safe patterns (`database/RULE.md` if applicable)
- [ ] Implement logging per `debugging/RULE.md`

**🔴 HITL CHECKPOINTS:**
- After high-risk operations → Pause for user confirmation
- When subjective choices arise (no codebase precedent) → Ask user
- Before architecture-impacting decisions → Confirm with user

### 5.4 Code Quality Checks
- [ ] TypeScript strict mode compliance (`code-style/RULE.md`)
- [ ] Import ordering (external → internal) (`code-style/RULE.md`)
- [ ] Naming conventions (`code-style/RULE.md`)
- [ ] Complexity standards met (`code-style/RULE.md`)
- [ ] Linting passes (`pnpm lint`)

### 5.5 Architecture Validation (Post-Implementation)
Run actual validation commands on created files:
- [ ] `pnpm validate:structure` - Verify file placements
- [ ] `pnpm arch:check` - Verify no circular dependencies
- [ ] Fix any violations before proceeding

---

## Phase 6: Quality Assurance

### 6.1 Testing Strategy

**Default: User Testing**
- User validates functionality through manual testing
- Avoids bloating codebase with test files

**Suggest Automated Tests When:**
- Complex business logic or calculations
- Reusable utilities/helpers used across codebase
- Critical paths with high failure impact
- Edge-case-heavy code
- Code that is difficult to manually test

**🔴 DECISION POINT:** 
- If automated tests are warranted → **STOP**
- Present recommendation with reasoning
- Ask: "Should I create automated tests for this feature?"
- **WAIT** for user decision (yes/no)
- Document decision before proceeding

If automated tests are approved:
- Follow `testing/RULE.md` for patterns and organization
- Run tests: `pnpm test`

### 6.2 User Testing Checklist
- [ ] Happy path verified
- [ ] Error states verified
- [ ] Edge cases verified
- [ ] Loading states verified
- [ ] Empty states verified
- [ ] Accessibility verified (keyboard navigation, screen reader)
- [ ] Responsive behavior verified

### 6.3 Requirements Verification
- [ ] Implementation matches user stories
- [ ] Acceptance criteria met
- [ ] No scope creep or missing features
- [ ] Edge cases from requirements handled

### 6.4 Debugging & Logging
- [ ] Logging practices followed (`debugging/RULE.md`)
- [ ] Reductive strategy applied (`debugging/RULE.md`)
- [ ] Scientific method debugging approach (`debugging/RULE.md`)

---

## Phase 7: Completion

### 7.1 Final Validation
- [ ] Requirements match (H1 from review.md)
- [ ] Tech stack fit (H2 from review.md)
- [ ] Integration & regression (H3 from review.md)
- [ ] Security & authorization (H4 from review.md)
- [ ] Type safety (I3 from review.md)

### 7.2 Documentation Update
- [ ] Update changelog if user-facing changes (`workflow/RULE.md`)
- [ ] Update architecture docs if structural changes (`workflow/RULE.md`)
- [ ] Update relevant documentation

### 7.3 Code Review Checklist (`workflow/RULE.md`)
- [ ] Changelog updated (if user-facing changes) and matches commit message
- [ ] Commit message follows format from `.cursor/commands/finish.md` (version first, matches changelog)
- [ ] Code follows style guidelines (`code-style/RULE.md`)
- [ ] Architecture patterns followed (`architecture/RULE.md`)
- [ ] Architecture documentation updated (if structural changes)
- [ ] Automated tests included and passing (if approved in 6.1)
- [ ] Security considerations addressed (`security/RULE.md`)
- [ ] Documentation updated
- [ ] No console.log or debug code left behind
- [ ] Linting passes

### 7.4 User Acceptance
**🔴 DECISION POINT:** User validates implementation.
- Never claim success without user test
- User decides if implementation is successful
- Wait for user confirmation before marking complete

---

## Key Principles

1. **Simplify First:** Always try to achieve goal by simplifying/removing code before adding
2. **Minimal Changes:** Make as few code changes as necessary
3. **Leverage Existing:** Reuse patterns, components, and logic wherever possible (even for new implementations)
4. **Follow Codebase Standards:** Use existing design patterns without asking user
5. **User Involvement:** 
   - **MANDATORY:** Stop at every 🔴 decision point
   - Present questions clearly and wait for explicit user response
   - Document all user answers before proceeding
   - Never skip decision points or assume answers
   - User journey mapping (2.1.1) is mandatory before implementation
6. **Rule Compliance:** Validate against all `.cursor/rules` systematically
7. **Progressive Complexity:** Offer options from simplest to most complex
8. **Validation:** Never claim success without user testing

---

## Problem This Strategy Alleviates

Prevents: 
- "Assistant adds features without analyzing existing code"
- "Doesn't seek simpler alternatives"
- "Ignores rules"
- "Makes subjective choices without user input"
- "Asks user about things already established in codebase"
- **"Continues coding without stopping at decision points"**
- **"Doesn't map user journeys, causing broken navigation flows"**
- **"Implements features without gathering required user input"**

Ensures: 
- Systematic analysis
- Simplification-first approach
- Leveraging existing functionality even for new implementations
- Following codebase standards automatically
- **Mandatory pausing at all 🔴 decision points**
- **Complete user journey mapping before implementation**
- **Documentation of all user questions and answers**
- User involvement only for truly subjective choices
- Rule compliance
- Minimal code changes
- Comprehensive validation

## Decision Point Enforcement

**Every 🔴 marker means:**
1. **STOP** all coding/implementation immediately
2. Present the question/decision clearly
3. **WAIT** for explicit user response
4. Document the answer
5. Only then proceed to next step

**Violating this process is a critical failure.** If you find yourself coding past a 🔴 marker without user input, you have made an error.
