---
description: "Windows/PowerShell command rules and local environment configuration"
alwaysApply: false
---

# Platform and Environment

Windows/PowerShell command rules and local environment configuration for this repo.

## Platform and Commands

**Environment:** Windows with PowerShell.

**Command Rules:**
- No Unix-style `&&` chaining
- No Unix-only flags like `rm -rf`
- Run commands as separate sequential calls (the agent executes them, not the user)

## Shell/PowerShell Handling

**Critical - Select-Object Piping Issue:**

Never pipe directly to `Select-Object` without `Out-String` first. This triggers VS Code/Cursor network errors that crash the IDE environment.

**Wrong (Do Not Use - Triggers Network Error):**
- Piping directly to `Select-Object` without `Out-String` first

**Correct (Always Use One of These):**
- Option 1: Use `Out-String` before `Select-Object` (recommended)
- Option 2: Capture to variable first (also safe)
- Option 3: No output filtering (safest, but shows all output)

**Critical - Exit Code Handling to Prevent Cursor Crashes:**

Always check `$LASTEXITCODE` after external commands to prevent Cursor crashes. PowerShell doesn't always propagate exit codes correctly, and Cursor crashes when it receives error output but thinks the command succeeded (exit code 0).

**Required Pattern:**

```powershell
command 2>&1; if ($LASTEXITCODE -ne 0) { exit 1 }
```

- `command 2>&1` - Runs command, redirects stderr to stdout
- `;` - Command separator (PowerShell equivalent of `&&`)
- `$LASTEXITCODE` - PowerShell variable containing last command's exit code
- `if ($LASTEXITCODE -ne 0)` - Check if command failed
- `exit 1` - Force explicit failure exit code

**When to Use This Pattern:**
- Long-running commands (like `pnpm arch:check`, `pnpm lint`)
- Commands that might fail silently
- Commands producing large output
- Any command where Cursor might hang or crash
- npm/node commands (lint, test, build)
- Commands with output filtering

**Notes:**
- Check `$LASTEXITCODE` (not `$?`) after commands
- Use `exit $LASTEXITCODE` to preserve original exit code (or `exit 1` for explicit failure)

## Environment Variables and Configuration

**Environment Variables:**
- Use `VITE_*` names for all client-side environment variables
- Access via `import.meta.env.VITE_*`
- Never commit real `.env` files containing secrets
  - Use `.env.example` for structure only if needed
  - Real values live in local environment and CI

**Supabase Environment Variables (Current):**
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Your Supabase anonymous/public key (legacy name: `VITE_SUPABASE_ANON_KEY`)
- Access in code: `import { getSupabase, isSupabaseConfigured } from "@/shared/services/supabaseService"`

**For Edge Functions (set in Supabase Dashboard):**
- `GAMMA_API_KEY` - Gamma API key for presentation generation
- Other secrets configured via Supabase Dashboard → Project Settings → Edge Functions → Secrets

**Other Environment Variables:**
- `VITE_OPENROUTER_API_KEY` - OpenRouter API key for chat completion
- `VITE_ELEVENLABS_API_KEY` - ElevenLabs API key for TTS/STT

**Legacy Firebase Variables (may still be needed for hosting/deployment):**
- `VITE_FIREBASE_API_KEY` - Firebase API key (for hosting deployment)
- `VITE_FIREBASE_PROJECT_ID` - Firebase project ID (for hosting)
- `VITE_FIREBASE_APP_ID` - Firebase app ID (for hosting deployment)
- Note: Firebase variables are primarily used for Firebase Hosting deployment configuration. The app now uses Supabase for database, auth, and storage.

**Hidden Files:**
- Some files are not visible to the AI (for example `.env`)
- When an issue involves hidden files, the AI should:
  - Ask the user to confirm relevant values (without exposing full secrets), or
  - Ask the user to paste safe snippets (keys, not secrets)

**Server Restarts:**
- Explicitly mention when a restart is required, especially after:
  - Environment variable changes
  - Dependency or tooling changes
  - Vite config, tsconfig, or path alias changes
  - Backend or server configuration changes

---

## Related Rules

**When modifying this rule, check these rules for consistency:**

- `git-workflow/RULE.md` — PowerShell patterns for `gh` and git commands
- `workflow/RULE.md` — deployment pointers
- `security/RULE.md` — secrets handling

**Rules that reference this rule:**

- `.agents/skills/debug/patterns.md` — platform command SSOT
