# Testing App Configuration File Feature

Manual validation guide for setup-driven `app.config.json` sync behavior.

## Prerequisites

1. Start dev server: `pnpm dev`
2. Open browser console
3. Navigate to `/setup`

## Core Scenarios

### 1) Manual Sync from Browser Console

```javascript
const { syncConfiguration } = await import('/src/features/setup/services/configService.ts');
const result = await syncConfiguration();
console.log('Sync result:', result);
```

Expected:
- `result.success === true`
- `app.config.json` exists and updates in project root

### 2) Direct `/api/write-config` Endpoint Test

Send a POST request with a valid config payload and confirm:
- `response.ok === true`
- response includes `success: true`

### 3) Finish Setup Integration

1. Configure/skip sections in `/setup`
2. Finish setup
3. Verify resulting `app.config.json` reflects current setup state

## Validation Checklist

- Valid JSON structure (`version`, `setup`, `configurations`, `lastUpdated`)
- `setup.sections` includes all setup sections
- `setup.enabledFeatures` matches completed sections
- No secrets or raw API keys are written
- Theme flags (`custom`, `hasCustomTheme`) update when theme changes

## Edge Cases

- Fresh start (`localStorage.clear()`) produces `not-started` defaults
- Partial configuration updates only relevant sections/features
- Dev server stopped returns graceful sync failure (no crash)
