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
- `scripts/validate-app-config.js`

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

### 6. Remove App Config Validation

- Remove `validate:app-config` script from `package.json`
- Remove the "App config validation" step from `.github/workflows/ci.yml`
- Delete `scripts/validate-app-config.js`

### 7. Delete Boilerplate-Only Documentation

Delete these docs (they reference setup wizard, app.config.json, or finish-setup flow):

- `documentation/DOC_APP_CONFIG_FILE.md`
- `documentation/DOC_SETUP_STATES_AND_TRANSITIONS.md`
- `documentation/DOC_TESTING_SUPABASE_SETUP.md`
- `documentation/DOC_TESTING_APP_CONFIG.md`
- `documentation/DOC_APP_CODE_MODIFICATION.md`

### 8. Update Remaining Docs

**`documentation/DOC_INDEX.md`:**
- Remove links to the deleted docs (DOC_APP_CONFIG_FILE, DOC_SETUP_STATES_AND_TRANSITIONS, DOC_TESTING_SUPABASE_SETUP, DOC_TESTING_APP_CONFIG, DOC_APP_CODE_MODIFICATION)
- Remove "App config schema" from the SSOT Map table

**`documentation/DOC_CONTRIBUTING.md`:**
- Remove the "App config" row from the CI Gate Expectations table

### 9. Repo-Wide Reference Sweep (Mandatory)

After deleting docs, run a repository-wide search and remove or update references to deleted files:

- Search for: `DOC_APP_CONFIG_FILE.md`, `DOC_SETUP_STATES_AND_TRANSITIONS.md`, `DOC_TESTING_SUPABASE_SETUP.md`, `DOC_TESTING_APP_CONFIG.md`, `DOC_APP_CODE_MODIFICATION.md`
- Update links in remaining docs (README, ARCHITECTURE, documentation/*) so there are no dead links
- If any hits appear under protected files (e.g. `.cursor/**`), do not auto-edit; ask the user first per workflow protected-file rules

### 10. Remove Setup Tests

The setup feature directory (`src/features/setup/`) is deleted in step 1, which includes its tests. Additionally delete:

- `src/utils/setupUtils.test.ts` (tests deleted `setupUtils.ts`)

## Notes

- The setup wizard was the only consumer of `vite-plugin-dev-api.ts` (write-env, read-config, finish-setup, etc.). Removing the plugin is safe.
- `app.config.json` was written by the setup wizard. After removal, configuration lives in `.env` only.
- If `useSupabaseConfig` or `useAuthContext` are used in HomePage/LoginForm, keep those — they are auth-related, not setup-related.
