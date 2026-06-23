---
name: start
description: >-
  Human onboarding: README Quick Start, dev task backlog (/tasks), gates, verification.
  Requires filling documentation/DOC_APP_VISION.md (problem, persona, app role) before fork/clone
  unless user defers. Use for first-time setup and /start-style requests.
---

# start

Guide a new user through first-time setup of this boilerplate by following the README flow end-to-end, working through the dev task backlog, validating each step, and only moving forward when each gate passes.

## Core behavior

- Be careful, explicit, and beginner-friendly.
- Follow the Quick Start flow from `README.md` in order.
- Use the **dev task backlog** (`src/config/app-tasks.json`, UI at `/tasks` via DevTasksFab in local dev) as the onboarding checklist.
- Validate every step before proceeding.
- Never claim setup is complete without user confirmation and successful verification checks.
- If a step requires a web interface or account action the assistant cannot do itself (GitHub, Supabase dashboard, browser auth prompts, settings pages, etc.), clearly hand it to the user with exact click-by-click instructions and then wait for confirmation.

## Dev task backlog (onboarding SSOT)

Fresh clones ship five pre-seeded tasks in priority order:

1. Configure Supabase
2. Configure Cloudflare Workers Builds (fork deploy) — agent one-shot brief in `app-tasks.json` description; SSOT `documentation/DOC_CLOUDFLARE_WORKERS.md`
3. Define app vision (`documentation/DOC_APP_VISION.md`)
4. Configure Airtable (optional)
5. Configure Theme

**Agent task sync (this skill + router + finish):**

- At session start: read `src/config/app-tasks.json`; set relevant task `in-progress` when picking up onboarding work.
- After completing a step: archive completed tasks (move to `app-tasks-archive.json`) or update descriptions (e.g. note Airtable skipped).
- Checks: Supabase env vars present; hosting configured per README; vision doc `ACTIVE`; optional Airtable/theme as applicable.
- **Conflict:** `/tasks` UI disk-wins — reconcile with user edits; do not fight pending UI state.

Configuration is via `.env`, README, and docs — there is no in-app setup wizard.

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

This fork's **product SSOT** is `documentation/DOC_APP_VISION.md` (problem statement, user persona, app's role).

- Read that file **now**.
- If the vision line still shows **`DRAFT`** (per the status callout at the top), **stop forward progress** on onboarding until task #3 (Define app vision) is addressed: walk the user through filling each section in their own words. Use the placeholders only as prompts; they must be **replaced** with real prose, then set the status token to **`ACTIVE`** on that same line.
- **Do not** continue to **Fork + clone** (next gate) until either:
  - the vision status is **`ACTIVE`**, or
  - the user **explicitly** instructs you to defer (e.g. exploring the repo only) — in that case, record in chat that feature/plan work should run this vision gate or fill `DOC_APP_VISION.md` before product decisions.

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

Confirm app is reachable at the shown localhost URL. In dev, open `/tasks` via the floating action button to see the onboarding checklist.

### 7) Configuration tasks gate (work through backlog)

Walk through backlog tasks in order (skip or archive optional items the user declines):

**Supabase (task #1):**

- If assistant cannot perform dashboard actions, instruct user exactly:
  - Open Supabase project
  - Go to Project Settings -> API
  - Copy Project URL + Publishable Key
- Guide user to create `.env` in project root with `VITE_SUPABASE_*` vars (see README).
- Remind user to restart dev server after `.env` changes.
- For **Sign in with Google**, use **`documentation/DOC_SUPABASE_GOOGLE_OAUTH.md` as the SSOT**.

**Hosting (task #2 — Configure Cloudflare Workers Builds):** Follow the agent one-shot brief in `src/config/app-tasks.json` task description and `documentation/DOC_CLOUDFLARE_WORKERS.md`. Fork must add `account_id`/custom domain; template intentionally omits them.

**App vision (task #3):** Collaborate on `DOC_APP_VISION.md`; set status to **`ACTIVE`**.

**Airtable (task #4, optional):** Add `VITE_AIRTABLE_*` to `.env` or archive/skip with note.

**Theme (task #5):** Customize `src/shared/theme/` or skip if defaults suffice.

Update `app-tasks.json` as each step completes.

### 8) Route verification gate

Verify routes from README:

- `/`
- `/tasks` (dev only, via FAB)
- `/login` (when Supabase configured)

If a route fails, troubleshoot before continuing.

### 9) Physical device testing (optional)

If the user needs mobile layout or mobile OAuth on local dev, link **`documentation/DOC_MOBILE_LOCAL_DEV.md`** (SSOT). Do not duplicate adb or redirect steps here.

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
2. User confirms configuration tasks they wanted are done (backlog archived or updated)
3. Route checks pass
4. Verification checklist passes
5. User confirms they are ready to proceed

---

## Boundaries

| Not `start` | Use instead |
|-------------|-------------|
| Agent session technical context | `prime` |
| Feature/plan work | `plan` / `feature` |

**App vision procedure SSOT:** § App vision in this skill; content SSOT: `documentation/DOC_APP_VISION.md`.
**Onboarding checklist SSOT:** `src/config/app-tasks.json` + `src/features/tasks/README.md`.
