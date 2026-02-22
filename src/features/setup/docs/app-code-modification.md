# App Code Modification Feature

Dev-only capability used by setup flow to update env/config and optionally remove setup-related code after completion.

## Overview

The setup feature can:

1. Write environment variables to `.env`
2. Sync configuration metadata to `app.config.json`
3. Trigger finish-setup cleanup that removes setup-specific code paths

## Architecture

### Vite Dev API Plugin

- File: `vite-plugin-dev-api.ts`
- Provides dev-only endpoints like:
  - `POST /api/write-env`
  - `POST /api/finish-setup`
  - `GET /api/read-env`
  - `POST /api/write-config`

These endpoints only exist in `vite dev`.

### Setup Services

- `src/features/setup/services/envWriterService.ts`
- `src/features/setup/services/setupService.ts`
- `src/features/setup/services/configService.ts`

Responsibilities:
- write env vars
- trigger finish setup
- build and sync app config state

### Setup Hooks

- `src/features/setup/hooks/useEnvWriter.ts`
- `src/features/setup/hooks/useSetupFinish.ts`

Responsibilities:
- state orchestration
- user feedback and error handling
- confirmation flow before irreversible cleanup

### Finish Script

- `scripts/finish-setup.js`

Responsibilities:
- remove setup-related files/code paths
- adjust imports/routes and config where required
- self-remove at end of finish operation

## Security Notes

1. Dev-only endpoints are excluded from production builds
2. Only allowed env variables are written
3. Setup cleanup requires explicit user confirmation

## Limits

- Cleanup logic relies on deterministic replacements and known code patterns
- Operation is intended as one-way finish behavior
