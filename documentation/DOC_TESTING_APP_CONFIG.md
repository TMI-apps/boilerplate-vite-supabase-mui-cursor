# Testing App Configuration File Feature

For setup state transitions and testable scenarios, see [DOC_SETUP_STATES_AND_TRANSITIONS.md](./DOC_SETUP_STATES_AND_TRANSITIONS.md).

## Prerequisites

1. **Start the dev server**:
   ```bash
   pnpm dev
   ```

2. **Open browser console** (F12 or right-click → Inspect → Console)

3. **Navigate to setup page**: `http://localhost:5173/setup`

## Test Scenarios

### 1. Test Manual Config Sync (Browser Console)

**Purpose**: Verify the `syncConfiguration()` function works independently

**Steps**:
1. Open browser console
2. Import and call the sync function:
   ```javascript
   // In browser console
   const { syncConfiguration } = await import('/src/features/setup/services/configService.ts');
   const result = await syncConfiguration();
   console.log('Sync result:', result);
   ```

**Expected Result**:
- `result.success` should be `true`
- No errors in console
- `app.config.json` file created/updated in project root

**Verify File**:
```bash
# In terminal
cat app.config.json
# or
type app.config.json  # Windows
```

### 2. Test API Endpoint Directly

**Purpose**: Verify `/api/write-config` endpoint works

**Steps**:
1. Open browser console
2. Make a POST request:
   ```javascript
   const testConfig = {
     version: "1.0.0",
     setup: {
       completed: false,
       sections: {
         supabase: "completed",
         airtable: "not-started",
         hosting: "skipped",
         theme: "completed"
       },
       enabledFeatures: ["supabase", "theme"]
     },
     configurations: {
       supabase: {
         configured: true,
         url: "https://test.supabase.co",
         keyLocation: ".env"
       },
       airtable: {
         configured: false,
         keyLocation: ".env"
       },
       theme: {
         custom: true,
         hasCustomTheme: true
       }
     },
     lastUpdated: new Date().toISOString()
   };

   const response = await fetch('/api/write-config', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify(testConfig)
   });
   
   const data = await response.json();
   console.log('API Response:', data);
   ```

**Expected Result**:
- `response.ok` should be `true`
- `data.success` should be `true`
- `app.config.json` file updated with test data

### 3. Test Finish Setup Flow (Full Integration)

**Purpose**: Verify config sync happens during finish setup

**Steps**:
1. **Setup some configuration**:
   - Go to `/setup`
   - Configure Supabase (or skip)
   - Configure Airtable (or skip)
   - Save theme (or skip)
   - Mark hosting as complete/skipped

2. **Check localStorage state**:
   ```javascript
   // In browser console
   const state = JSON.parse(localStorage.getItem('setup_sections_state'));
   console.log('Setup state:', state);
   ```

3. **Finish setup**:
   - Click "Finish Setup" button
   - Confirm in dialog
   - **Before page reloads**, check if config was synced

4. **Verify file after reload**:
   ```bash
   # In terminal (after page reloads)
   cat app.config.json
   ```

**Expected Result**:
- Config file should exist
- Should contain current setup state
- `setup.completed` should be `true` after finish
- `lastUpdated` timestamp should be recent

### 4. Test Config File Content Validation

**Purpose**: Verify config file has correct structure and no secrets

**Steps**:
1. Sync config (use test from scenario 1 or 3)
2. Read the file:
   ```bash
   cat app.config.json | jq .  # If you have jq
   # or just
   cat app.config.json
   ```

**Verify**:
- ✅ File is valid JSON
- ✅ Has `version`, `setup`, `configurations`, `lastUpdated` fields
- ✅ `setup.sections` has all 4 sections (supabase, airtable, hosting, theme)
- ✅ `setup.enabledFeatures` is an array
- ✅ `configurations.supabase.url` exists if Supabase configured
- ✅ `configurations.supabase.keyLocation` is `.env` (not the actual key!)
- ❌ **NO API keys** in the file
- ❌ **NO sensitive credentials**

### 5. Test Edge Cases

#### 5a. No Configuration (Fresh Start)

**Steps**:
1. Clear localStorage:
   ```javascript
   localStorage.clear();
   ```
2. Sync config:
   ```javascript
   const { syncConfiguration } = await import('/src/features/setup/services/configService.ts');
   await syncConfiguration();
   ```
3. Check file:
   ```bash
   cat app.config.json
   ```

**Expected**:
- All sections should be `"not-started"`
- `enabledFeatures` should be `[]`
- `setup.completed` should be `false`
- All `configured` flags should be `false`

#### 5b. Partial Configuration

**Steps**:
1. Configure only Supabase (skip others)
2. Sync config
3. Check file

**Expected**:
- `supabase` section: `"completed"`
- Other sections: `"not-started"` or `"skipped"`
- `enabledFeatures`: `["supabase"]`
- `configurations.supabase.configured`: `true`
- `configurations.airtable.configured`: `false`

#### 5c. Theme Configuration

**Steps**:
1. Save a custom theme:
   ```javascript
   const theme = { palette: { mode: 'dark', primary: { main: '#1976d2' } } };
   const { saveCustomTheme } = await import('/src/shared/theme/themeLoader.ts');
   saveCustomTheme(theme);
   ```
2. Sync config
3. Check file

**Expected**:
- `configurations.theme.custom`: `true`
- `configurations.theme.hasCustomTheme`: `true`

### 6. Test Error Handling

#### 6a. Invalid Config Structure

**Steps**:
```javascript
// Try to write invalid config
const response = await fetch('/api/write-config', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ invalid: 'structure' })
});
const data = await response.json();
console.log('Error response:', data);
```

**Expected**:
- `response.ok` should be `false`
- `data.error` should contain error message
- File should not be corrupted

#### 6b. Network Error (Dev Server Stopped)

**Steps**:
1. Stop dev server (`Ctrl+C`)
2. Try to sync config in browser console
3. Check error handling

**Expected**:
- Should catch error gracefully
- Should return `{ success: false, error: "..." }`
- Should not crash the app

## Quick Test Checklist

Run through this checklist to verify everything works:

- [ ] Dev server running (`pnpm dev`)
- [ ] Can call `syncConfiguration()` from browser console
- [ ] `/api/write-config` endpoint responds correctly
- [ ] `app.config.json` file created in project root
- [ ] File contains valid JSON
- [ ] File has correct structure (version, setup, configurations, lastUpdated)
- [ ] No API keys in config file (security check)
- [ ] Config syncs when finishing setup
- [ ] Config reflects current localStorage state
- [ ] Config reflects current environment variables (after restart)
- [ ] Theme configuration tracked correctly
- [ ] Empty state handled correctly (all not-started)
- [ ] Partial configuration handled correctly

## Automated Testing (Future)

For automated tests, you could add:

```typescript
// src/features/setup/services/configService.test.ts
import { describe, it, expect, vi } from 'vitest';
import { syncConfiguration } from './configService';

describe('configService', () => {
  it('should sync configuration successfully', async () => {
    // Mock fetch
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });

    const result = await syncConfiguration();
    expect(result.success).toBe(true);
  });
});
```

## Troubleshooting

### File Not Created

- **Check**: Is dev server running?
- **Check**: Are there console errors?
- **Check**: Is `/api/write-config` endpoint accessible?
- **Test**: Try calling endpoint directly (scenario 2)

### File Has Wrong Data

- **Check**: localStorage state matches file?
- **Check**: Environment variables in `.env` file are correct?
- **Note**: No restart needed - config reads directly from `.env` file via `/api/read-env`

### Circular Dependency Errors

- **Check**: Are you calling sync from the right place?
- **Note**: Only call `syncConfiguration()` from components/hooks, not from utils/services that are imported by configService

### Config Not Syncing on Finish Setup

- **Check**: Is `finishSetup()` being called?
- **Check**: Browser console for errors
- **Check**: Network tab for `/api/write-config` request
