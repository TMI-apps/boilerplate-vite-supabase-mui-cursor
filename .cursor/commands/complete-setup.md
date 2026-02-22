# complete-setup

Remove all setup wizard files and functionality from the boilerplate. Use when the app has been configured and the setup wizard is no longer needed.

## Scope

Delete all starter setup files and update references. The AI must trace imports and dependencies to ensure nothing breaks.

### 1. Files and Directories to Delete

**Pages & utils:**
- `src/pages/SetupPage.tsx`
- `src/utils/setupUtils.ts`

**Setup feature (entire directory):**
- `src/features/setup/` (all files: components, hooks, services, types, views)

**Scripts:**
- `scripts/finish-setup.js`

**Config & plugin:**
- `app.config.json`
- `vite-plugin-dev-api.ts`

### 2. Update Vite Config

- Remove `devApiPlugin` import and usage from `vite.config.ts`
- Remove `vite-plugin-dev-api.ts` from `tsconfig.node.json` include (if present)

### 3. Update App and Components

**App.tsx:**
- Remove `SetupPage` import
- Remove `<Route path="/setup" element={<SetupPage />} />`

**Topbar.tsx:**
- Remove the Setup button (`<Button component={Link} to="/setup">Setup</Button>`)

**HomePage.tsx:**
- Remove links to `/setup` (both the Typography link and the "Configure Supabase" Button)
- Simplify or remove the `!supabaseConfigured` Alert block that links to setup
- Keep the rest of the page logic (user greeting, etc.)

**LoginForm.tsx:**
- Remove the Alert block that links to `/setup` (or replace with a note that doesn't link to setup)

### 4. Verification

After changes:
- Run `pnpm type-check` — must pass
- Run `pnpm lint` — must pass
- Run `pnpm validate:structure` — must pass
- Run `pnpm test:run` — must pass

Fix any broken imports or references. Search for remaining references to: `setupUtils`, `SetupPage`, `@features/setup`, `app.config`, `/api/read-config`, `/api/write-config`, `/api/finish-setup`, `/api/write-env`, `/api/read-env`, `/api/remove-env-vars`.

### 5. projectStructure.config.cjs (Protected File)

Remove `app.config.json` and `vite-plugin-dev-api.ts` from the root-level whitelist in `projectStructure.config.cjs`. See workflow/RULE.md § Protected Files — **ASK user for approval before modifying** this file.

## Notes

- The setup wizard was the only consumer of `vite-plugin-dev-api.ts` (write-env, read-config, finish-setup, etc.). Removing the plugin is safe.
- `app.config.json` was written by the setup wizard. After removal, configuration lives in `.env` only.
- If `useSupabaseConfig` or `useAuthContext` are used in HomePage/LoginForm, keep those — they are auth-related, not setup-related.
