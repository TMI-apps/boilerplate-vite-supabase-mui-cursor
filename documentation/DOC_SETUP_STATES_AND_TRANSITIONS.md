# Setup States and Transitions

This document codifies the expected setup flow states and transitions for the boilerplate setup wizard. It serves as the single source of truth for testable scenarios and aligns setup docs with implementation.

## Section Status Values

Each setup section (supabase, airtable, hosting, theme) can be in one of four states:

| Status        | Description                                      |
|---------------|--------------------------------------------------|
| `not-started` | User has not begun this section                  |
| `in-progress` | User has opened the section but not completed it |
| `completed`   | Section configured successfully                  |
| `skipped`     | User chose to skip this section                  |

## Storage

- **Setup sections state**: `localStorage["setup_sections_state"]` – JSON object with keys `supabase`, `airtable`, `hosting`, `theme` and values from the status table above.
- **Setup complete flag**: `localStorage["setup_complete"]` – `"true"` when the entire wizard is done (legacy/backward compatibility).

## State Transitions

### Supabase Section

| From          | Action                    | To          |
|---------------|---------------------------|-------------|
| not-started   | User opens dialog         | in-progress (implicit via UI) |
| not-started   | User clicks "Skip"        | skipped     |
| in-progress   | Test connection succeeds + write env succeeds | completed |
| in-progress   | User clicks "Skip"         | skipped     |
| completed     | (view only)               | completed   |

### Airtable Section

| From          | Action                    | To          |
|---------------|---------------------------|-------------|
| not-started   | User opens dialog         | in-progress |
| not-started   | User skips                | skipped     |
| in-progress   | Configure + write env    | completed   |
| completed     | Reset (dev only)          | not-started |

### Hosting Section

| From          | Action                    | To          |
|---------------|---------------------------|-------------|
| not-started   | User completes hosting    | completed   |
| not-started   | User skips                | skipped     |

### Theme Section

| From          | Action                    | To          |
|---------------|---------------------------|-------------|
| not-started   | User applies theme        | completed   |
| not-started   | User skips                | skipped     |

## Testable Scenarios

These scenarios are mirrored in unit tests under `src/features/setup/` and `src/utils/`:

1. **getSetupSectionsState** – Returns default when empty; returns parsed state when valid JSON stored; returns default when parse fails.
2. **updateSetupSectionStatus** – Updates one section, preserves others, persists to localStorage.
3. **getEnabledFeatures** – Returns section ids with status `completed`.
4. **skipSupabaseSetup** – Sets supabase to `skipped`.
5. **resetAirtableSetup** – Sets airtable to `not-started`.
6. **resetAllSetupSections** – Removes setup sections from localStorage.
7. **useConnectionTest** – Runs test, sets result, calls onSuccess on success, handles errors.
8. **useEnvWriter** – Writes env vars, sets envWritten on success, calls onError on failure.
9. **envWriterService** – Success/failure responses from `/api/write-env`.
10. **configService** – Success/failure of `syncConfiguration` (read-env + write-config).

## Connection and Write Flow Failure Handling

- **Connection test fails**: `useConnectionTest` sets `testResult: { success: false, error }`. UI shows error; user can retry or skip.
- **Env write fails**: `useEnvWriter` returns `{ success: false, error }` and calls `onError`. SupabaseSection uses this to set `testResult` to failure so the user sees the error.
- **Config sync fails**: `syncConfiguration` returns `{ success: false, error }`. View dialogs handle this silently; configuration display still works from cached/previous state.

## Restart-Sensitive Behavior

After writing env vars to `.env`, the dev server must be restarted for `import.meta.env` to reflect new values. The setup flow shows a restart warning when env vars have been written. Config sync (`app.config.json`) does not require a restart.
