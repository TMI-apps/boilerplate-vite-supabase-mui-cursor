# debug

# debug

Use **Scientific Method Debugging** 
The user does **not** edit code. The user only:
- Performs actions in the app.  
- Filters console logs if needed
- Copies and pastes console logs.  
- Performs actions in external dashboards (e.g. Supabase).  

You must never claim the issue is fixed; only the user decides when the issue is resolved.

---

### 1. Expected Input
Accept any of:
- Error message + stack trace  
- Console output  
- Description of what the user did  
- Mention of external systems involved  

If information is missing, proceed with assumptions and state them.

---

### 2. Component Nesting & Structure Analysis (React/UI Issues)
For UI/React issues, **always** analyze component nesting first, as nesting issues are often the root cause:

1. List all components/divs in which the problematic component is nested (full hierarchy).
2. List all properties being passed down through the component tree (prop drilling analysis).
3. Identify potential culprits:
   - CSS inheritance/overrides from parent components
   - Global styles affecting layout context (check body, html, #root for display: flex/grid that changes layout mode)
   - Overflow/stacking context issues (any element with overflow ≠ visible creates new stacking context)
   - Prop type mismatches or undefined props
   - Context providers affecting the component
   - Z-index/positioning conflicts from nesting
4. Form a hypothesis about which nesting level or prop is causing the issue.

This structural analysis informs the event chain reconstruction and helps identify if the issue is architectural rather than behavioral.

---

### 3. Event Chain Reconstruction
For each issue:
1. Reconstruct the chain from user action → app behavior → API calls/side effects → failure point.  
2. Present as a numbered list.  
3. Identify the most suspicious link.

All diagnostic steps must map back to **specific links in this chain**.

---

### 4. Hypotheses (Scientific Method)
For each issue propose 2–3 hypotheses:
- Each predicts **specific observable outcomes** the user can capture.  
- Each includes a **falsification condition**.  
- At least one involves an external configuration cause.  
- Each hypothesis must map to a **specific step** in the event chain.

Hypotheses must be designed so that logs or observations can **decide between them**.

---
### 5. Console log changes
- All hypotheseses must be verifyable by the user by simply performing an action and sharing the (filtered) console log output. 
- Console logs should include all possibly needed information for hypothesis falsification/verification.
- For API calls, raw API input an output can be needed. If so, log that to the console (take simple security measures to avoid exposing secrets)
---

### 6. Unified Diagnostic Steps (Single Ordered List)
Provide **one integrated numbered list** of user actions.  
These may include in-app interactions, devtools checks, network observations, or dashboard inspections.

Each step must:
- Correspond to a **specific location** in the event chain.  
- Clearly state **what observation supports or refutes each hypothesis**.  
- Aim to **cut the search space in half** with each action.  
- Indicate precisely what the user should copy/paste back.

Avoid category labels; all steps belong to one unified list.

---

### 7. Iterative Evidence Loop
When the user returns with logs or data:
1. Update the event chain using the new evidence.  
2. Mark each hypothesis as **supported**, **refuted**, or **uncertain**, and briefly **explain why**.  
3. Form a smaller, more precise hypothesis set.  
4. Provide the next unified action list.

Repeat until only the user declares the issue resolved.

---

### 8. External Configuration Awareness
Always include a configuration-based hypothesis when errors involve:
- Auth/permissions  
- RLS policies  
- API keys, tokens, or service URLs  
- Environment variable mismatches  
- Rate limits, quotas  
- Dev vs prod differences  

Provide specific checks and exact values the user should verify.

---

### 9. Common Error Pattern Recognition
When symptoms match known patterns, prioritize these hypotheses first:

**React "Maximum update depth exceeded":**
- Almost always: an object (not primitive) in a useCallback/useEffect dependency array
- Check: useMutation/useQuery return objects (unstable), Context values (unmemoized), inline objects
- Key question: "Is a callback being passed to Context via setState?" (classic loop pattern)
- Debug approach: Log which dependency actually changed using refs, don't guess

**N8N Webhook "Unused Respond to Webhook node found" (500 error):**
- Symptom: Webhook returns 500 with message "Unused Respond to Webhook node found in the workflow"
- Root cause: Webhook node Response Mode is set to auto-respond (default) but a Respond to Webhook node exists downstream
- Key question: "Is the Webhook node's Response Mode set to 'Using Respond to Webhook node'?"
- Debug approach: Check N8N workflow configuration, not code - verify Response Mode setting in Webhook node (N8N v1.114+ requires explicit configuration)

**Auth Context Race Condition - Protected Route Redirects Before Role Loads:**
- Symptom: Protected routes (e.g., admin pages) redirect to fallback route on page refresh, even though user has proper role. User sees redirect flash before staying on page, or gets redirected incorrectly.
- Root cause: `loading` state becomes `false` before `userRole` is fetched. useEffect that fetches role runs on mount when `user` is `null` (initial state) and sets `loading: false` prematurely, allowing ProtectedRoute to render and redirect before role is available.
- Key question: "Is the loading state being set to false before the initial session check completes?"
- Debug approach: Track when `loading` changes to `false` relative to when `user` is set and when `userRole` is fetched. Use a ref to track if initial session check has completed before allowing `loading` to be set to `false` for null/anonymous users.

**PowerShell Command Hangs - Long-Running Commands Get Stuck:**
- Symptom: Commands like `pnpm type-check`, `pnpm lint`, or `pnpm test` appear to hang indefinitely in PowerShell/Cursor, especially in hooks or scripts
- Root cause: PowerShell doesn't always propagate exit codes correctly. Commands may fail but PowerShell returns 0, causing Cursor to wait indefinitely for a clear termination signal
- Key question: "Is the command actually hanging, or is Cursor waiting for an exit code that never comes?"
- Debug approach: Check `.cursor/rules/workflow/RULE.md` for exit code handling patterns. Add explicit exit code handling: `command 2>&1; if ($LASTEXITCODE -ne 0) { exit 1 }` for PowerShell, or `command || exit 1` for bash scripts

**React Fast Refresh Context Provider Error During Hot Reload:**
- Symptom: Context hook throws "must be used within Provider" error during hot reload, but works fine on full page refresh. Error disappears after refresh.
- Root cause: React Fast Refresh temporarily unmounts providers during hot reload while components using the context are still rendering, causing context to be undefined
- Key question: "Is this error only happening during hot reload in development mode, not on full refresh?"
- Debug approach: Make context hook return a safe default in development mode instead of throwing. Check `import.meta.env?.MODE === 'development'` and return fallback context. Still throw in production to catch real bugs.

**React State/URL Desynchronization - Component Checks Only State, Ignores URL Params:**
- Symptom: Component creates new resources (conversations, items) on second action even though URL shows correct ID. State shows null/undefined but URL param exists.
- Root cause: Component checks only state (`currentConversationId`) but ignores URL params (`paramConversationId`). Race condition where routing effect hasn't loaded resource yet but URL already indicates existing resource.
- Key question: "Is the component checking both state AND URL params when determining resource context?"
- Debug approach: Check if `paramConversationId` exists in URL but state is null - if so, use `paramConversationId` as fallback. Log both values to identify desynchronization. Use `effectiveId = stateId ?? (paramId && hasData ? paramId : null)` pattern.

**Database UUID Type Error - Passing Array Index Instead of UUID:**
- Symptom: Database error "invalid input syntax for type uuid: '1'" or similar when saving records with foreign key relationships. Error occurs when creating linked records (files, messages, etc.).
- Root cause: Passing stringified array index (`String(index)`) instead of actual UUID from object. Common in `.map()` callbacks where index is mistakenly used instead of object ID property.
- Key question: "Is the ID being passed the actual UUID property from the object, or a stringified array index?"
- Debug approach: Check where ID is set in event handlers - verify it uses `(object as TypedObject).id` or `object.id`, not `String(index)`. Log the value being passed to identify if it's a numeric string vs UUID format.

**localStorage Persistence Issue - Routing Data Cleared on Logout:**
- Symptom: Feature works correctly on window close/reopen but fails after logout/login. Routing or state restoration doesn't work after login even though it works on refresh.
- Root cause: `clearUserLocalStorage()` function clears localStorage keys that should persist across logout/login. Keys are user-specific but being cleared unnecessarily, breaking persistence.
- Key question: "Is the localStorage clearing function removing keys that should persist across logout/login sessions?"
- Debug approach: Check `clearUserLocalStorage()` function - verify which keys are cleared. User-specific keys (e.g., `lastOpenedChat:v1:{userId}`) should typically persist unless there's a security/privacy reason to clear them. Compare behavior: window close/reopen (keys persist) vs logout/login (keys cleared).

**CORS Header Not Allowed - Generic "Failed" Error Message:**
- Symptom: Browser console shows "Request header field X-Header-Name is not allowed by Access-Control-Allow-Headers in preflight response" but frontend only shows generic "I encountered an error: Failed" message. Request fails before reaching server.
- Root cause: Edge function CORS configuration doesn't include custom headers being sent by frontend. Preflight OPTIONS request fails, causing fetch to throw generic error that gets truncated to just "Failed".
- Key question: "Are all custom headers (x-title, http-referer, etc.) listed in the edge function's Access-Control-Allow-Headers?"
- Debug approach: Check browser Network tab for OPTIONS preflight request - verify which headers are being sent vs allowed. Check edge function CORS configuration (`_shared/cors.ts`) - ensure all custom headers match exactly (case-sensitive). Improve frontend error handling to detect network/CORS errors and show clearer messages.

**React State Synchronization Bug - Local Array Copy Not Updated:**
- Symptom: Data appears in UI but disappears after save/reload, or save fails with validation errors. Only happens on first message or specific scenarios. Subsequent operations work fine.
- Root cause: Async function creates local copy of state array (`let localArray = initialArray`), updates React state via callbacks (`setState`), but local copy isn't updated. When function returns, it returns stale local copy instead of updated state.
- Key question: "Is the async function returning a local copy of state that was never updated, even though React state was updated via callbacks?"
- Debug approach: Check if async function returns state - verify returned value matches React state. Look for `let localArray = initialArray` pattern followed by `setState` updates but no `localArray = updatedArray`. Fix: Update local copy before returning, or return updated state from callback.

**Database Constraint Mismatch After Migration - ON CONFLICT References Old Primary Key:**
- Symptom: Database error `42P10` "there is no unique or exclusion constraint matching the ON CONFLICT specification" when upserting/inserting records. Error occurs after database migrations that changed primary keys or unique constraints.
- Root cause: Migration changed table constraints (e.g., primary key from `(assistant_id, tool_name)` to `(assistant_id, tool_id)`) but application code still references old constraint in `ON CONFLICT` clauses or queries.
- Key question: "Did a recent migration change the primary key or unique constraint that this code references?"
- Debug approach: Check migration files for table schema changes - verify current primary key/constraints match what code expects. Look for `ON CONFLICT` clauses, upsert operations, or unique constraint checks. Fix: Update code to use new constraint columns (may require lookup if old column is deprecated but kept for compatibility).

**Git env.exe "couldn't create signal pipe" Win32 error 5 (Windows):**
- Symptom: `git commit` fails with `env.exe: *** fatal error - couldn't create signal pipe, Win32 error 5` when run from Cursor's terminal/agent, but works on another PC or from external terminal.
- Root cause: Win32 error 5 = ACCESS_DENIED. Primary confirmed cause: Cursor's sandbox restricts pipe creation when running terminal commands, blocking env.exe from spawning. Other possible causes: (2) Antivirus/security software blocking process spawn, (3) User account lacks "Create global objects" permission, (4) Git for Windows version/corruption.
- Key question: "Does the commit work with full permissions (`all`) or from an external terminal (PowerShell, Windows Terminal)?"
- Debug approach: For Cursor agent: use `required_permissions: ["all"]` when running git commit. For manual commits: use external terminal instead of Cursor's terminal. If still failing: check AV exclusions, Group Policy, try running Cursor as Administrator.

**Vitest + MUI Material v7 ES Module Cycle Error:**
- Symptom: Vitest tests fail with `Error: Cannot require() ES Module ... @mui/material/esm/index.js in a cycle` when testing components that import MUI Material v7. Tests work on some machines but fail on others.
- Root cause: MUI Material v7 uses ESM-first exports with directory imports that Vitest cannot resolve. Vitest tries to use CommonJS `require()` for ESM modules, creating a cycle. May work on some machines due to different Node/pnpm versions, cache states, or dependency resolution.
- Key question: "Does the test work on another machine or after clearing Vite cache (`rm -rf node_modules/.vite`)?"
- Debug approach: Add `server.deps.inline: ["@mui/material", "@mui/icons-material"]` to `vitest.config.ts` to force pre-bundling. Also add `fallbackCJS: true` for ESM/CJS compatibility. Clear Vite cache if issue persists. Check Node/pnpm versions if working on other machines.

**Add other patterns here as they're discovered.**

---

### 10. Output Structure for Each Response
1. Quick Summary  
2. Component Nesting Analysis (if UI/React issue)
3. Event Chain  
4. Pattern Match Check (does this match a known pattern from §9?)
5. Hypotheses (with predictions + falsification conditions)  
6. Console log changes to verify/falsify all hypotheses
7. Unified Action Steps and code changes
8. What to Return  
9. Next Narrowing Step  
