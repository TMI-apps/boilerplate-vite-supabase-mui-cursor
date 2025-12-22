# check

## When the user requests a feature or functionality follow the following numbered steps.

### 1. **Identify Required Information**
Categorize required info for the implementation:

- **Info from outside of the repo:**
    - Database schema and relationships
    - API keys and external service documentation
    - Response formatting requirements
    - Dependency documentation (versions, breaking changes)

- **Info about the app:**
    - Architectural norms and folder structure
    - Tech stack and patterns in use
    - Authentication and authorization logic
    - Adjacent functions that may disturb or be disturbed by the new functionality
    - Existing state management approach (context, stores, local state)

- **Info about the user's design intent:** When asking about user's intent, **always offer multiple choices**.
    - Visual/UI expectations
    - Interaction patterns
    - Target devices/responsiveness needs

For all missing info:
- Act to find it, OR
- Ask the user to supply it

---

### 2. **Identify Existing Functionality**
Describe how much of it and where it (or the closest resemblance) is located:
- Name files, functions, and what they do
- Identify existing components that can be repurposed
- Identify existing patterns for: API design, state management, error handling, loading states
- Note any existing accessibility patterns in the codebase

---

### 3. **Refine the User's Request into User Stories**
Extract a list of user stories that combine to fully cover the user's intent for each relevant role. May use "as an unauthorized/free/premium/admin user" instead of separate user stories per role.

Include acceptance criteria that cover:
- Happy path behavior
- Error states and edge cases
- Loading and empty states
- Accessibility requirements (if applicable)

---

### 4. **Ask User Confirmation of User Stories**
Before moving to drafting implementation plans, get explicit confirmation.

---

### 5. **Draft Implementation Plans**
Draft concise implementation plans (in chat, not a file), ranging from matching the user's request to a more streamlined & lightweight implementation. Smart simplicity is the aim.

**Core Principles:**
- **Prioritize:** code efficiency, maintainability, consistency, and reuse
- **Minimize complexity** and avoid custom solutions where existing dependencies or patterns suffice
- **Review current functionality and intended end state**

**When formulating plans, inform the user of every opinionated choice** (e.g., dependency choice, architecture, UI placement), and mention an equally viable alternative. Beware of giving the user two choices that are bad in combination (e.g., 1A and 2B are fine choices but don't work well together). Inform the user when this is the case.

**Each implementation plan must include:**

#### A. Component/API Design
- Props interface: what props, what types, what defaults
- Does it follow existing patterns in the codebase?
- API surface: keep it minimal for common use cases, flexible for advanced
- Composability: can it integrate with existing components easily?

#### B. State & Data Flow
- Where does state live? (local, context, global store)
- What async states need handling? (loading, error, empty, success)
- What side effects are needed? (API calls, subscriptions, timers)
- Data flow: props down, callbacks up, or shared state?

#### C. UI/UX Considerations
- Layout approach and placement in the app
- Responsive strategy: desktop-first or mobile-first? Key breakpoints?
- Interactive states: hover, active, disabled, loading, error, success
- Empty states: what to show when there's no data?
- Loading states: skeleton, spinner, or progressive?

#### D. Accessibility Planning
- Keyboard interactions needed (Tab, Enter, Escape, arrows)
- ARIA attributes required for the component type
- Focus management (initial focus, focus trap, return focus)
- Semantic HTML elements to use

#### E. Technical Considerations
- Pseudo-code sketches of required components
- For any new components: specify purpose, location, and how they remain reusable and non-redundant
- Performance implications (rendering, bundle size, lazy loading)
- Error scenarios and edge cases
- Dependencies assessment (new deps needed? existing deps sufficient?)
- Integration points with existing code
- Impact on existing functionality
- Complexity assessment: will this exceed thresholds? (cyclomatic ≤10, nesting ≤4)

#### F. Validation & Testing Plan
- How to validate the implementation works correctly
- Key test cases to cover
- Manual testing steps

---

### 6. **Only Move On After User Preference is Clear**
Wait for explicit user approval of the chosen implementation plan.

---

### 7. **Re-check Required Information**
Repeat step 1 **Identify Required Information** for any missing information. **STAY IN THIS STEP UNTIL ALL REQUIRED INFORMATION IS COLLECTED.**

---

### 8. **Document the Implementation Plan**
Create/update a markdown file in `/documentation/jobs/job_[jobname]` (create folder if not present) where you place all information required, so if the chat history is cleared, the feature implementation can proceed with just that file and the repo as context.

The job file should include:
- User stories with acceptance criteria
- Chosen implementation plan
- Component/API design decisions
- State management approach
- Accessibility requirements
- Test cases to verify
- Files to create/modify

---

## Problem This Strategy Alleviates

These steps help mitigate the following problem: "Cursor agent will add features/functionality without analyzing the existing code for more efficient and thoughtful implementation. It does not look for more simplistic implementations than the exact feature the user asks for."

This ensures: Cursor agent will analyze the existing code to find more efficient and thoughtful implementations before adding features. It actively seeks out more simplistic implementations rather than just strictly building exactly what the user asks for.
