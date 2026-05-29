---
name: start
description: >-
  Human onboarding: README Quick Start, gates, verification. Requires filling
  documentation/DOC_APP_VISION.md (problem, persona, app role) before fork/clone unless user
  defers. Use for first-time setup and /start-style requests.
---

# start

Guide a new user through first-time setup of this boilerplate by following the README flow end-to-end, validating each step, and only moving forward when each gate passes.

## Core behavior

- Be careful, explicit, and beginner-friendly.
- Follow the Quick Start flow from `README.md` in order.
- Validate every step before proceeding.
- Never claim setup is complete without user confirmation and successful verification checks.
- If a step requires a web interface or account action the assistant cannot do itself (GitHub, Supabase dashboard, browser auth prompts, settings pages, etc.), clearly hand it to the user with exact click-by-click instructions and then wait for confirmation.

## Flow (README-aligned)

### 1) Prerequisites gate

Run these commands first and inspect output:
```bash
node -v
pnpm -v
git --version
```

Required versions:
- Node.js 20+
- pnpm 9.15.4+
- Git

If versions are missing/too low:
- Stop and do not continue setup
- Provide install or upgrade instructions for the user's OS
- Re-run the version-check commands until all pass

Only continue when all three checks pass.

### 2) App vision & goals gate (mandatory before fork/clone and setup)

This fork’s **product SSOT** is `documentation/DOC_APP_VISION.md` (problem statement, user persona, app’s role).

- Read that file **now**.
- If the vision line still shows **`DRAFT`** (per the status callout at the top), **stop forward progress** on onboarding: walk the user through filling each section in their own words. Use the placeholders only as prompts; they must be **replaced** with real prose, then set the status token to **`ACTIVE`** on that same line.
- **Do not** continue to **Fork + clone** (next gate) until either:
  - the vision status is **`ACTIVE`**, or
  - the user **explicitly** instructs you to defer (e.g. exploring the repo only) — in that case, record in chat that feature/plan work should run **`start`** vision gate or fill `DOC_APP_VISION.md` before product decisions.

Optional: open `documentation/DOC_APP_VISION.md` in the editor for the user when the environment supports it.

### 3) Line endings gate (mandatory on Windows too)

Guide user to set LF line endings:
- VS Code/Cursor setting `files.eol` -> `\n`
- Git: `git config core.autocrlf false`

Verify by asking user to confirm they changed both.

### 4) Fork + clone gate

Guide user through README Option B:
1. Fork on GitHub
2. Clone their fork
3. `pnpm install`

If assistant cannot perform the fork UI step, instruct user exactly what to click in GitHub and wait for confirmation before continuing.

### 5) Branch workflow gate

Set up long-lived integration branch:
```bash
git switch -c develop
git push -u origin develop
```

Then guide user to configure GitHub branch protection rules for `main` and `develop` (PRs required, status checks required, force-push disabled). If this is web-UI only, provide exact steps and wait for user confirmation.

### 6) Dev server gate

Run:
```bash
pnpm dev
```

Confirm app is reachable at the shown localhost URL and setup route is available.

### 7) Setup wizard gate (optional sections, explicit guidance)

Walk through setup wizard sections one-by-one:
- Supabase (optional, required for auth/database)
- Airtable (optional)
- Theme customization (optional)

For Supabase:
- If assistant cannot perform dashboard actions, instruct user exactly:
  - Open Supabase project
  - Go to Project Settings -> API
  - Copy Project URL + Publishable Key
- Guide user to enter values in setup wizard and create `.env` in project root.
- Remind user to restart dev server after `.env` changes.
- If the user needs **Sign in with Google**, do **not** invent parallel steps: use **`documentation/DOC_SUPABASE_GOOGLE_OAUTH.md` as the SSOT** for Supabase + Google Cloud Console setup (callback URL, origins, client ID format). Link or open that file; README Quick Start step 6 points to the same doc.

### 8) Route verification gate

Verify routes from README:
- `/`
- `/setup`
- `/login` (when Supabase configured)

If a route fails, troubleshoot before continuing.

## Mandatory verification checklist ("test for everything")

Run and verify all relevant checks:
```bash
pnpm lint
pnpm format:check
pnpm type-check
pnpm validate:structure
pnpm test:run
pnpm build
```

If any check fails:
- Stop and fix in smallest safe steps
- Re-run failed check(s)
- Re-run full checklist before final confirmation

## Communication rules during start

- Use short steps and numbered instructions.
- After each gate, explicitly ask user for confirmation.
- For any manual web-interface action, provide:
  - where to go
  - what to click
  - what value to copy/paste
  - what outcome to expect
- Do not skip gates even if user is experienced, unless user explicitly asks to skip.

## Completion criteria

Only consider onboarding complete when:
1. **`documentation/DOC_APP_VISION.md`** is **`ACTIVE`** (or user explicitly deferred with reason recorded)
2. User confirms setup wizard steps they wanted are done
3. Route checks pass
4. Verification checklist passes
5. User confirms they are ready to proceed

---

## Teardown: remove setup wizard (after the app is configured)

Run **only** when the user confirms the app is configured and the starter setup wizard is no longer needed. Trace imports/dependencies so nothing breaks. (Formerly the `complete-setup` skill.)

### 1. Files and directories to delete

**Pages & utils:** `src/pages/SetupPage.tsx`, `src/utils/setupUtils.ts`
**Setup feature (entire directory):** `src/features/setup/` (components, hooks, services, types, views)
**Scripts:** `scripts/validate-app-config.js`
**Config & plugin:** `app.config.json`, `vite-plugin-dev-api.ts`

### 2. Update Vite config
- Remove `devApiPlugin` import and usage from `vite.config.ts`.
- Remove `vite-plugin-dev-api.ts` from `tsconfig.node.json` include (if present).

### 3. Update app and components
- **App.tsx:** remove `SetupPage` import and `<Route path="/setup" element={<SetupPage />} />`.
- **Topbar.tsx:** remove the Setup button (`<Button component={Link} to="/setup">Setup</Button>`).
- **HomePage.tsx:** remove links to `/setup` (Typography link and "Configure Supabase" Button); simplify/remove the `!supabaseConfigured` Alert block that links to setup; keep the rest (user greeting, etc.).
- **LoginForm.tsx:** remove the Alert block that links to `/setup` (or replace with a non-linking note).

### 4. Verification
After changes, all must pass: `pnpm type-check`, `pnpm lint`, `pnpm validate:structure`, `pnpm test:run`.
Fix broken imports/references. Search for remaining references to: `setupUtils`, `SetupPage`, `@features/setup`, `app.config`, `/api/read-config`, `/api/write-config`, `/api/finish-setup`, `/api/write-env`, `/api/read-env`, `/api/remove-env-vars`.

### 5. projectStructure.config.cjs (protected file)
Remove `app.config.json` and `vite-plugin-dev-api.ts` from the root-level whitelist. See `workflow/RULE.md` § Protected Files — **ASK user for approval before modifying** this file.

### 6. Remove app config validation
- Remove `validate:app-config` script from `package.json`.
- Remove the "App config validation" step from `.github/workflows/ci.yml`.
- Delete `scripts/validate-app-config.js`.

### 7. Delete boilerplate-only documentation
Delete: `documentation/DOC_APP_CONFIG_FILE.md`, `documentation/DOC_SETUP_STATES_AND_TRANSITIONS.md`, `documentation/DOC_TESTING_SUPABASE_SETUP.md`, `documentation/DOC_TESTING_APP_CONFIG.md`, `documentation/DOC_APP_CODE_MODIFICATION.md`.

### 8. Update remaining docs
- **`documentation/DOC_INDEX.md`:** remove links to the deleted docs; remove "App config schema" from the SSOT Map table.
- **`documentation/DOC_CONTRIBUTING.md`:** remove the "App config" row from the CI Gate Expectations table.

### 9. Repo-wide reference sweep (mandatory)
Search for and update/remove references to deleted files (`DOC_APP_CONFIG_FILE.md`, `DOC_SETUP_STATES_AND_TRANSITIONS.md`, `DOC_TESTING_SUPABASE_SETUP.md`, `DOC_TESTING_APP_CONFIG.md`, `DOC_APP_CODE_MODIFICATION.md`). Fix dead links in README/ARCHITECTURE/`documentation/*`. If hits appear under protected files (e.g. `.cursor/**`), ask the user first.

### 10. Remove setup tests
The setup feature directory is deleted in step 1 (includes its tests). Additionally delete `src/utils/setupUtils.test.ts`.

### 11. Delete the start skill (this file)
Once teardown is complete, delete **`.agents/skills/start/SKILL.md`** (this skill) and its now-empty folder, and remove its router entries — onboarding and teardown are no longer needed for a configured app.

### Teardown notes
- The setup wizard was the only consumer of `vite-plugin-dev-api.ts` (write-env, read-config, finish-setup, etc.); removing the plugin is safe.
- `app.config.json` was written by the wizard; afterward configuration lives in `.env` only.
- If `useSupabaseConfig` or `useAuthContext` are used in HomePage/LoginForm, keep those — they are auth-related, not setup-related.

---

## Boundaries

| Not `start` | Use instead |
|-------------|-------------|
| Agent session technical context | `prime` |
| Feature/plan work | `plan` / `feature` |

**App vision procedure SSOT:** § App vision in this skill; content SSOT: `documentation/DOC_APP_VISION.md`.
**Setup teardown** lives in this skill's **Teardown** section (formerly `complete-setup`).
