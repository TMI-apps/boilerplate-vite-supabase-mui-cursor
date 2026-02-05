# App Code Modification Feature

## Overview

The **App Code Modification** feature enables the UI to modify app source code and configuration files during development. This is a dev-only capability that powers the setup wizard's ability to:

1. Write environment variables to `.env` file
2. Remove unused feature code after setup completion
3. Update source files to remove unused imports and routes
4. Clean up `package.json` by removing unused dependencies

## Architecture

### Components

#### 1. Vite Plugin (`vite-plugin-dev-api.ts`)

A custom Vite plugin that adds dev-only API endpoints to the Vite dev server:

- **Location**: Project root (required for Vite plugin configuration)
- **Endpoints**:
  - `POST /api/write-env`: Writes environment variables to `.env` file
  - `POST /api/finish-setup`: Triggers code modification script

**Security**: These endpoints only exist when running `vite dev`. They are not included in production builds.

#### 2. Services (`src/features/setup/services/`)

Pure functions that call the dev API endpoints:

- **`envWriterService.ts`**: 
  - `writeEnvVariables()`: Writes VITE_ prefixed environment variables
  - Validates and merges with existing `.env` content
  - Preserves comments and non-VITE variables

- **`setupService.ts`**:
  - `finishSetup()`: Triggers code cleanup and modification
  - Calls `/api/finish-setup` endpoint
  - Reloads page after successful completion

#### 3. Hooks (`src/features/setup/hooks/`)

React hooks that manage state and call services:

- **`useEnvWriter`**: 
  - Manages loading state (`writingEnv`)
  - Tracks success state (`envWritten`)
  - Handles errors via callback

- **`useSetupFinish`**:
  - Manages dialog state
  - Handles finish setup flow
  - Shows confirmation dialog before irreversible changes

#### 4. Script (`scripts/finish-setup.js`)

Server-side Node.js script that performs actual code modifications:

- **File Operations**:
  - Removes setup-related files (`SetupPage.tsx`, `setupUtils.ts`, etc.)
  - Removes unused feature files (Supabase, Airtable if not enabled)
  - Removes entire directories recursively

- **Code Modifications**:
  - Updates `App.tsx`: Removes setup routes, unused imports
  - Updates `MainLayout.tsx`: Removes auth-related code if Supabase disabled
  - Updates `HomePage.tsx`: Removes conditional rendering based on features
  - Updates `package.json`: Removes unused dependencies

- **Called via**: `/api/finish-setup` endpoint (imported dynamically)

## Usage Flow

### Writing Environment Variables

```typescript
import { useEnvWriter } from "@features/setup/hooks/useEnvWriter";

const MyComponent = () => {
  const { writeEnv, writingEnv, envWritten } = useEnvWriter({
    onError: (error) => console.error(error),
  });

  const handleSave = async () => {
    const result = await writeEnv({
      VITE_SUPABASE_URL: "https://...",
      VITE_SUPABASE_PUBLISHABLE_KEY: "eyJ...",
    });
    
    if (result.success) {
      // Environment variables written successfully
    }
  };
};
```

### Finishing Setup (Code Modification)

```typescript
import { useSetupFinish } from "@features/setup/hooks/useSetupFinish";

const SetupPage = () => {
  const { 
    finishDialogOpen, 
    finishing, 
    handleOpenDialog, 
    handleFinish 
  } = useSetupFinish();

  return (
    <>
      <Button onClick={handleOpenDialog}>Finish Setup</Button>
      <FinishSetupDialog
        open={finishDialogOpen}
        onConfirm={handleFinish}
        finishing={finishing}
      />
    </>
  );
};
```

## What Gets Modified

### Environment Variables (`/api/write-env`)

- **File**: `.env` (project root)
- **Operations**:
  - Only writes `VITE_` prefixed variables
  - Merges with existing variables (new values override old)
  - Preserves comments and non-VITE variables
  - Adds separator between sections

### Code Modification (`/api/finish-setup`)

#### Files Removed

**Always removed**:
- `src/pages/SetupPage.tsx`
- `src/utils/setupUtils.ts`
- `scripts/finish-setup.js` (self-removal)

**Conditionally removed** (if feature not enabled):
- Supabase: `src/shared/services/supabaseService.ts`, auth pages, `src/features/auth/`
- Airtable: `src/shared/services/airtableService.ts`, Airtable setup components

#### Files Modified

**`src/App.tsx`**:
- Removes `SetupPage` import and route
- Removes `shouldShowSetup` import and check
- Removes setup redirect logic
- Removes auth-related imports/routes if Supabase disabled
- Removes Airtable-related imports if Airtable disabled

**`src/layouts/MainLayout.tsx`**:
- Removes Supabase imports if Supabase disabled
- Removes auth context usage
- Removes conditional rendering based on auth state

**`src/pages/HomePage.tsx`**:
- Removes Supabase imports if Supabase disabled
- Removes auth-related conditional rendering

**`package.json`**:
- Removes unused dependencies (e.g., `airtable` if Airtable disabled)

## Security Considerations

1. **Dev-Only**: Endpoints only exist in development mode (`vite dev`)
2. **No Production Impact**: Production builds don't include the plugin
3. **File System Access**: Scripts run with Node.js file system permissions
4. **Validation**: Only `VITE_` prefixed env vars are written
5. **Confirmation Required**: Code modification requires explicit user confirmation

## Error Handling

- **API Errors**: Returned as JSON with error messages
- **File Errors**: Caught and logged, returned in API response
- **Network Errors**: Handled in hooks with user-friendly messages
- **Validation Errors**: Invalid env vars are filtered out silently

## Limitations

1. **Regex-Based Code Modification**: Uses string replacement, not AST parsing
   - May not handle all edge cases
   - Comments and formatting may be affected

2. **One-Time Operation**: Finish setup is irreversible
   - Files are permanently deleted
   - No undo mechanism

3. **Dev Server Required**: Must be running `vite dev` for endpoints to work

4. **File System Permissions**: Requires write access to project files

## Future Enhancements

Potential improvements:

1. **AST-Based Modifications**: Use TypeScript compiler API for safer code changes
2. **Backup System**: Create backups before modifications
3. **Undo Capability**: Track changes and allow rollback
4. **Extensible API**: Allow other features to register code modification operations
5. **Dry Run Mode**: Preview changes before applying

## Related Files

- `vite-plugin-dev-api.ts`: Vite plugin providing API endpoints
- `scripts/finish-setup.js`: Code modification script
- `src/features/setup/services/envWriterService.ts`: Env writing service
- `src/features/setup/services/setupService.ts`: Setup finish service
- `src/features/setup/hooks/useEnvWriter.ts`: Env writing hook
- `src/features/setup/hooks/useSetupFinish.ts`: Setup finish hook
- `src/features/setup/components/FinishSetupDialog.tsx`: Confirmation dialog
