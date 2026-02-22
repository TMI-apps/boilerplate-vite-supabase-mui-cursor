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

### 2) Line endings gate (mandatory on Windows too)

Guide user to set LF line endings:
- VS Code/Cursor setting `files.eol` -> `\n`
- Git: `git config core.autocrlf false`

Verify by asking user to confirm they changed both.

### 3) Fork + clone gate

Guide user through README Option B:
1. Fork on GitHub
2. Clone their fork
3. `pnpm install`

If assistant cannot perform the fork UI step, instruct user exactly what to click in GitHub and wait for confirmation before continuing.

### 4) Branch workflow gate

Set up long-lived integration branch:
```bash
git switch -c experimental
git push -u origin experimental
```

Then guide user to configure GitHub branch protection rules for `main` and `experimental` (PRs required, status checks required, force-push disabled). If this is web-UI only, provide exact steps and wait for user confirmation.

### 5) Dev server gate

Run:
```bash
pnpm dev
```

Confirm app is reachable at the shown localhost URL and setup route is available.

### 6) Setup wizard gate (optional sections, explicit guidance)

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

### 7) Route verification gate

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
1. User confirms setup wizard steps they wanted are done
2. Route checks pass
3. Verification checklist passes
4. User confirms they are ready to proceed
