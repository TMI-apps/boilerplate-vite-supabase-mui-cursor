# Testing Supabase Setup Without Real Credentials

Guide for validating setup flow behavior without real Supabase credentials.

## Option 1: Dev Bypass (Fastest)

When running `pnpm dev`, use:

| Field | Value |
|-------|-------|
| Supabase URL | `https://test-local.supabase.co` |
| API Key | `test-anon-key-for-local-testing` |

Expected:
- Connection test succeeds immediately
- Env vars are written
- Section moves to completed on first save

## Option 2: Unit Tests with Mocks

Mock:
- `@shared/services/supabaseService` (`testSupabaseConnection`)
- `src/features/setup/services/envWriterService` (`writeEnvVariables`)

Assert first `Test & Save` marks section complete and updates UI state.

## Option 3: End-to-End Style Flow

Use dev bypass credentials and validate full flow:
1. Open `/setup`
2. Enter test credentials
3. Click `Test & Save`
4. Verify section completion and dialog behavior

## What to Verify

1. `updateSetupSectionStatus("supabase", "completed")` path runs
2. Status callback is triggered
3. UI reflects completion immediately
4. No second click needed to finalize status
