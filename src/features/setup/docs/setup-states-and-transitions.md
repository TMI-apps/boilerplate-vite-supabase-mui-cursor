# Setup States and Transitions

This document codifies expected setup flow states and transitions for the setup wizard.

## Section Status Values

Each setup section (`supabase`, `airtable`, `hosting`, `theme`) can be in one of four states:

| Status        | Description                                      |
|---------------|--------------------------------------------------|
| `not-started` | User has not begun this section                  |
| `in-progress` | User has opened the section but not completed it |
| `completed`   | Section configured successfully                  |
| `skipped`     | User chose to skip this section                  |

## Storage

- Setup sections state: `localStorage["setup_sections_state"]`
- Setup complete flag: `localStorage["setup_complete"]` (`"true"` when wizard is done, legacy compatibility)

## State Transitions

### Supabase

| From          | Action                                    | To          |
|---------------|-------------------------------------------|-------------|
| not-started   | User opens dialog                         | in-progress |
| not-started   | User clicks "Skip"                        | skipped     |
| in-progress   | Connection succeeds + env write succeeds  | completed   |
| in-progress   | User clicks "Skip"                        | skipped     |
| completed     | View only                                 | completed   |

### Airtable

| From          | Action                 | To          |
|---------------|------------------------|-------------|
| not-started   | User opens dialog      | in-progress |
| not-started   | User skips             | skipped     |
| in-progress   | Configure + write env  | completed   |
| completed     | Reset (dev only)       | not-started |

### Hosting

| From          | Action                 | To        |
|---------------|------------------------|-----------|
| not-started   | User completes hosting | completed |
| not-started   | User skips             | skipped   |

### Theme

| From          | Action               | To        |
|---------------|----------------------|-----------|
| not-started   | User applies theme   | completed |
| not-started   | User skips           | skipped   |

## Testable Scenarios

These scenarios map to tests in `src/features/setup/` and `src/utils/`:

1. `getSetupSectionsState` default/valid/invalid JSON behavior
2. `updateSetupSectionStatus` updates one section and persists
3. `getEnabledFeatures` returns `completed` section ids
4. `skipSupabaseSetup` sets supabase to `skipped`
5. `resetAirtableSetup` sets airtable to `not-started`
6. `resetAllSetupSections` clears setup storage
7. `useConnectionTest` success/failure behavior
8. `useEnvWriter` success/failure behavior
9. `envWriterService` `/api/write-env` result handling
10. `configService` sync success/failure behavior

## Failure Handling

- Connection test failure: UI displays error and allows retry/skip
- Env write failure: `useEnvWriter` returns failure and calls `onError`
- Config sync failure: `syncConfiguration` returns failure; callers handle gracefully

## Restart Behavior

After writing env vars to `.env`, restart the dev server so `import.meta.env` reflects new values. Syncing `app.config.json` does not require restart.
