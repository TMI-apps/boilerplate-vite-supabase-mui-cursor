# Job: View Configuration Feature

## Overview
Add "View Configuration" functionality to all setup sections, allowing users to view their current configuration in read-only mode and reset if needed.

## User Stories

### User Story 1: View Existing Configuration
**As a user** who has completed a configuration setup  
**I want to** click "View Configuration" instead of "Reconfigure"  
**So that** I can review my current settings in a read-only view

**Acceptance Criteria:**
- When status is "completed", button text shows "View Configuration"
- Clicking opens a read-only dialog showing current configuration
- Dialog has "Reset Configuration" and "Close" buttons
- No edit mode - users must reset and reconfigure

### User Story 2: Reset Configuration
**As a user** viewing my configuration  
**I want to** click "Reset Configuration"  
**So that** I can clear all settings and start fresh

**Acceptance Criteria:**
- "Reset Configuration" button is clearly labeled and styled (warning color)
- Clicking shows a confirmation dialog warning about data loss
- Confirming removes all env variables for that service
- Resets the section status to "not-started"
- Updates app.config.json
- Closes view dialog and updates UI

### User Story 3: Display Configuration Data (Service-Specific)
**As a user** viewing different service configurations  
**I want to** see service-specific relevant details  
**So that** I can verify what's currently configured

**Acceptance Criteria:**
- **Supabase**: 
  - URL: Full URL with copy button
  - API Key: Show "●●●●●●" with status indicator (which key type is set)
- **Airtable**:
  - Base ID: Full ID with copy button
  - Table ID: Full name with copy button
  - API Key: Show "●●●●●●" with status indicator
- **Theme**:
  - Custom theme active: Yes/No
  - Theme preview or JSON snippet
  - Option to view full theme JSON
- **Hosting**:
  - Hosting provider/type if applicable
  - Deployment URL if applicable
- All displays use consistent card/list layout
- Copy functionality for non-sensitive data

## Implementation Plan: Clean Separation (Plan B)

### Files to Create

#### 1. API Endpoints (in vite-plugin-dev-api.ts)
- `/api/read-config` - Read app.config.json and return as JSON
- `/api/remove-env-vars` - Remove specified env variables from .env file

#### 2. Hooks
- `src/features/setup/hooks/useConfigurationData.ts` - Fetch current config from app.config.json
- `src/features/setup/hooks/useConfigurationReset.ts` - Handle reset logic

#### 3. Components

**Dialog Wrappers:**
- `src/features/setup/components/ConfigurationViewDialog.tsx` - Generic view dialog wrapper
- `src/features/setup/components/ResetConfirmDialog.tsx` - Confirmation dialog for reset

**View Components (Service-Specific):**
- `src/features/setup/components/views/SupabaseConfigView.tsx`
- `src/features/setup/components/views/AirtableConfigView.tsx`
- `src/features/setup/components/views/ThemeConfigView.tsx`
- `src/features/setup/components/views/HostingConfigView.tsx`

**Shared Components:**
- `src/features/setup/components/ConfigurationItem.tsx` - Reusable item display (key-value with copy)
- `src/features/setup/components/SensitiveDataDisplay.tsx` - Display "●●●●●●" with status

### Files to Modify

#### 1. src/features/setup/components/SetupCard.tsx
- Change button text from "Reconfigure" to "View Configuration" when status = "completed"

#### 2. Section Components
- `src/features/setup/components/sections/SupabaseSection.tsx`
- `src/features/setup/components/sections/AirtableSection.tsx`
- `src/features/setup/components/sections/ThemeSection.tsx`
- `src/features/setup/components/sections/HostingSection.tsx`

**Changes needed:**
- Add state for view dialog open/closed
- Conditionally render view dialog vs configure dialog based on status
- Pass configuration data to view dialog

#### 3. vite-plugin-dev-api.ts
- Add `/api/read-config` endpoint
- Add `/api/remove-env-vars` endpoint

## Component Architecture

### ConfigurationViewDialog
```typescript
interface ConfigurationViewDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onReset: () => Promise<void>;
  sectionName: string;
  resetInProgress?: boolean;
}
```

### Service-Specific Views
```typescript
interface SupabaseConfigViewProps {
  config: SupabaseConfiguration;
}

interface AirtableConfigViewProps {
  config: AirtableConfiguration;
}

interface ThemeConfigViewProps {
  config: ThemeConfiguration;
}
```

### Hooks
```typescript
// useConfigurationData
const useConfigurationData = (section: 'supabase' | 'airtable' | 'theme' | 'hosting') => {
  return {
    data: Configuration | null,
    loading: boolean,
    error: string | null,
    refetch: () => Promise<void>
  }
}

// useConfigurationReset
const useConfigurationReset = (
  section: 'supabase' | 'airtable' | 'theme' | 'hosting',
  onSuccess?: () => void
) => {
  return {
    reset: () => Promise<void>,
    resetting: boolean,
    error: string | null
  }
}
```

## Reset Flow

1. User clicks "Reset Configuration" button
2. Show confirmation dialog with warning message
3. User confirms
4. Call `/api/remove-env-vars` with section-specific env var names
5. Update localStorage: set section status to "not-started"
6. Call `syncConfiguration()` to update app.config.json
7. Close view dialog
8. Trigger parent component refresh
9. UI shows "Configure" button again

## Data Display Patterns

### Sensitive Data (API Keys)
```
Label: VITE_SUPABASE_PUBLISHABLE_KEY
Value: ●●●●●●●● [✓ Set]
```

### Non-Sensitive Data (URLs, IDs)
```
Label: Supabase URL
Value: https://xxx.supabase.co [Copy Icon]
```

### Configuration Cards
Use MUI Card with:
- Title (Typography variant="h6")
- Key-value pairs (Grid or Stack layout)
- Copy button for copyable values
- Visual indicators (CheckCircle icon for set values)

## API Endpoints

### GET /api/read-config
**Returns:**
```json
{
  "success": true,
  "config": {
    "version": "1.0.0",
    "setup": { ... },
    "configurations": { ... }
  }
}
```

### POST /api/remove-env-vars
**Request:**
```json
{
  "variables": ["VITE_SUPABASE_URL", "VITE_SUPABASE_PUBLISHABLE_KEY"]
}
```

**Returns:**
```json
{
  "success": true,
  "message": "Environment variables removed"
}
```

## Testing Plan

### Manual Testing Steps

1. **View Configuration (Completed Setup)**
   - Complete Supabase setup
   - Verify button shows "View Configuration"
   - Click button, verify read-only dialog opens
   - Verify data displays correctly (URLs shown, keys masked)
   - Verify copy functionality works
   - Close dialog

2. **Reset Configuration**
   - Open view dialog for completed setup
   - Click "Reset Configuration"
   - Verify confirmation dialog appears
   - Cancel, verify nothing changes
   - Click reset again, confirm
   - Verify env vars removed from .env
   - Verify status changes to "not-started"
   - Verify button now shows "Configure"

3. **Service-Specific Views**
   - Test each service (Supabase, Airtable, Theme)
   - Verify service-specific data displays correctly
   - Verify all copy buttons work
   - Verify sensitive data is masked

4. **Edge Cases**
   - View configuration when .env file is manually edited
   - Reset when some env vars are missing
   - Multiple rapid clicks on reset

## Accessibility Requirements

- Dialogs must be keyboard accessible (Tab, Escape to close)
- Reset button must have warning color and clear label
- Confirmation dialog must have clear focus management
- Copy buttons must have clear labels/tooltips
- All interactive elements must be keyboard accessible

## Technical Notes

- Use existing `syncConfiguration()` from configService.ts
- Follow existing patterns from `EnvVariablesDisplay` for copy functionality
- Use MUI Alert with severity="warning" for reset confirmation
- Maintain consistency with existing dialog styling (SetupDialog)
- Ensure proper error handling for API calls
- Loading states for fetching config data

## Implementation Order

1. Create API endpoints (read-config, remove-env-vars)
2. Create hooks (useConfigurationData, useConfigurationReset)
3. Create shared components (ConfigurationItem, SensitiveDataDisplay)
4. Create dialog wrappers (ConfigurationViewDialog, ResetConfirmDialog)
5. Create service-specific view components
6. Modify SetupCard to change button text
7. Modify section components to integrate view dialogs
8. Test each service individually
9. Test reset functionality
10. Final integration testing
