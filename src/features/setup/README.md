# Setup Feature

Configuration wizard for Supabase, Airtable, hosting, and theme. Dev-only capabilities for writing env vars and syncing config for Cursor agent.

## Purpose

- Multi-step setup wizard (Supabase → Airtable → Hosting → Theme)
- Connection tests and env variable writing via dev API
- Config sync to `app.config.json` for agent discoverability
- Optional finish-setup flow (removes setup code when complete)

## Structure

| Layer | Path | Purpose |
|-------|------|---------|
| Hooks | `hooks/` | `useEnvWriter`, `useSupabaseSetup`, `useAirtableSetup`, `useWizardStep`, `useConfigurationData`, `useConfigurationReset`, `useConnectionTest` |
| Services | `services/` | `envWriterService`, `configService` – dev API calls, config sync |
| Components | `components/` | `SetupDialog`, `SetupCard`, sections (Supabase, Airtable, Hosting, Theme), config views |
| Types | `types/` | `AppConfig`, `Configurations`, `SetupConfig`, `ConfigSetupSectionId` |

## Main APIs

### `useEnvWriter({ onError? })`

Writes `VITE_*` env vars to `.env` via `POST /api/write-env`. Returns `{ writeEnv, writingEnv, envWritten }`.

### `configService`

- `getAppConfig()` – fetches `/api/config`, returns `AppConfig` for Cursor agent
- Syncs setup state, enabled features, and configuration metadata (no secrets in `app.config.json`)

### `useSupabaseSetup` / `useAirtableSetup`

Expose `isConfigured` and connection test helpers for their respective sections.

## Dev API Endpoints (Vite plugin)

- `POST /api/write-env` – write env vars
- `GET /api/read-env` – read env vars (server-side)
- `GET /api/config` – app config for agent
- `POST /api/finish-setup` – triggers code cleanup (optional)

**Security**: Endpoints exist only when running `vite dev`; not included in production builds.

## Dependencies

- `@utils/setupUtils` – `getSetupSectionsState`, `getEnabledFeatures`, `isSetupComplete`
- `@shared/theme/themeLoader` – `getCustomTheme`
- `vite-plugin-dev-api.ts` – dev API plugin

## Related

- `documentation/DOC_APP_CODE_MODIFICATION.md` – full app code modification flow
- `documentation/DOC_APP_CONFIG_FILE.md` – `app.config.json` structure
- `.cursor/commands/complete-setup.md` – removal of setup wizard when no longer needed
