---
description: "Development workflow, code review, and process standards"
alwaysApply: true
---

# Workflow Standards

Development workflows, code review standards, and process requirements. Includes agent-specific behaviors and corrections to compensate for default agent behavior.

## SSOT Map (Single Source of Truth)

| Topic | SSOT Location |
|-------|----------------|
| Semantic versioning, commit format, conventional commit types | `.cursor/commands/finish.md` |
| Changelog format, version sync workflow | `.cursor/commands/finish.md` (this rule references it) |
| Branch strategy, protected files, agent behaviors | `.cursor/rules/workflow/RULE.md` (this file) |
| Architecture patterns, layer rules, code placement | `.cursor/rules/architecture/RULE.md` |
| Project structure, file whitelist | `projectStructure.config.cjs` |
| Dependency/architecture enforcement | `.dependency-cruiser.cjs` |
| App config schema (boilerplate only; removed by complete-setup) | `documentation/DOC_APP_CONFIG_FILE.md` |

## Code Review Process

### Review Checklist
- [ ] Changelog updated (if user-facing changes) and matches commit message
- [ ] Commit message includes version number first and matches changelog
- [ ] Code follows style guidelines (`code-style/RULE.md`)
- [ ] Architecture patterns are followed (`architecture/RULE.md`)
- [ ] Architecture documentation updated (if structural changes)
- [ ] Tests are included and passing (`testing/RULE.md`)
- [ ] Security considerations addressed (`security/RULE.md`)
- [ ] Documentation changes are limited to required contract docs only
- [ ] Feature-local README updated when `src/features/*` code changed
- [ ] No console.log or debug code left behind
- [ ] Linting passes (GTS or project-specified tool)

### Review Focus Areas
- Functionality: Does it work as intended?
- Code Quality: Is it maintainable and readable?
- Performance: Are there obvious performance issues?
- Security: Are there security vulnerabilities?
- Testing: Is it adequately tested?

## Git Workflow

### Version Control Standards

#### Semantic Versioning

**SSOT:** See `.cursor/commands/finish.md` for semantic versioning rules (MAJOR.MINOR.PATCH format, version bump criteria, and conventional commit type mappings).

**Version Release Rule:**
- One commit per released version: Each version release should be a single commit

#### Changelog Synchronization
Commits and changelog must be synchronized:
- Always add a new version entry at the top of changelog before committing
- Git commit message must match the changelog version heading
- Version number should be first in the commit message

#### Commit Messages

**SSOT:** See `.cursor/commands/finish.md` for commit message format and standards.

**Key Requirements:**
- Format: `[VERSION] type: Feature/Change Title`
- Version number must be first (e.g., `[3.19.0] feat: User Profile Settings`)
- Commit message subject must exactly match changelog feature title (with type prefix)
- Commit body is required: Must include details about what changed
- Reference issue/ticket numbers when applicable
- Keep commits focused (one logical change per commit)

**Changelog Sections:**
Changelog entries use Keep-a-Changelog style sections:
- `### Added` - New features
- `### Changed` - Changes in existing functionality
- `### Deprecated` - Soon-to-be removed features
- `### Removed` - Removed features
- `### Fixed` - Bug fixes
- `### Security` - Security vulnerability fixes
- `### Documentation` - Documentation changes
- `### Tests` - Test-related changes
- `### Performance` - Performance improvements

**Changelog Update Requirements:**
- User-facing features: Required
- Bug fixes: Required
- Documentation: Required
- Internal refactoring: Optional (but commit must still be descriptive)
- Dependency updates: Optional

**Example Workflow:**
1. Update changelog: Add `## 3.19.0 - 2024-11-01` with feature description
2. Commit with matching message: `[3.19.0] feat: User Profile Settings` (see `.cursor/commands/finish.md` for format details)
3. Verify: Changelog title matches commit subject (minus version prefix)

#### Version Synchronization

**SSOT for release version:** `package.json` and `CHANGELOG.md` are the canonical sources. See `.cursor/commands/finish.md` for the full workflow.

When updating the changelog with a new version, update two locations to maintain consistency:

1. **Update `package.json`**: Change the `version` field to match the new changelog version
   - File: `package.json` (root level)
   - Ensures console output shows correct version when running `pnpm dev`

2. **Update changelog**: Add new entry at the top of `CHANGELOG.md` (root directory)

Both locations must use the same version number. If the app displays version in the UI (e.g. via `VITE_APP_VERSION`), update that location too; this boilerplate does not display version in ProfileMenu by default.

**Note:** When the setup wizard exists, `app.config.json` has its own `version` field for config schema compatibility; it is independent of release version. See `documentation/DOC_APP_CONFIG_FILE.md`. After running complete-setup, configuration lives in `.env` only.

### Branch Strategy

#### Project Branch Pattern

Project supports:
- `experimental` branch: Primary long-lived development/integration branch
- `main` branch: Production branch (protected, **never develop on main**)
- Feature branches (optional): Created from `experimental` for isolated feature work

**Workflow:**
- **Never develop directly on `main`.** All code changes must be made on `experimental` or feature branches.
- Push completed work to `experimental` first.
- Promote to `main` via Pull Request (`experimental` -> `main`) after checks are green.
- Do not push directly to `main` except an explicit emergency override.
- Feature branches merge to `experimental`, then `experimental` is promoted to `main` via PR.
- `experimental` is long-lived; do not rely on auto-deleting it after PR merge.

#### Branch Protection

**Critical Rule: Never Develop on Main**

The AI must verify the current git branch before editing any code file. **Development on `main` is prohibited.** `main` is for production-ready code only; all development happens on `experimental` or feature branches.

**Protected Main Merge Model (Current Repo Decision):**
- Require Pull Request for `main` updates (no direct push flow).
- Preferred merge method: **Squash merge** for PRs into `main`.
- Keep `experimental` as a persistent branch (do not auto-delete it as a default workflow behavior).

##### Verification Process

1. Check the current branch at the start of code-related conversations
2. If unsure, ask: "Which branch are you currently on?"
3. Proceed only after confirming the branch is NOT `main` (for code changes)

##### Branch-Specific Rules

- `experimental`: All code changes allowed (primary development branch)
- Feature branches: All code changes allowed (created from experimental)
- `main`: **Code changes blocked.** Never develop on main. Emergency override only (see below).
- Other branches: Ask user before proceeding

##### When User is on Main Branch

If code changes are requested while on `main`:

**Stop immediately.** Do not make any code changes. Display warning:
- You are on the `main` branch. **Never develop on main.**
- All code changes must be made on `experimental` or feature branches
- Switch branches: `git checkout experimental`
- Once switched, proceed with requested changes

Do not make code changes until user confirms they've switched.

##### Exceptions

**Safe to Edit on Any Branch**

These files may be edited on any branch after user confirmation:
- Documentation files (`documentation/*.md`)
- Cursor rules (`.cursor/rules/*.md`)
- README files

**Emergency Main Branch Changes (Rare Exception)**

Only proceed with main branch code changes when ALL of the following are true:
1. User explicitly states "emergency fix on main"
2. User confirms with "yes, proceed on main"
3. User acknowledges the risk

Default: **Never develop on main.** When in doubt, require branch switch to `experimental`.

##### Implementation Checklist

Before editing code files:
- [ ] Verify current branch (ask user if unsure)
- [ ] Confirm branch is `experimental`, a feature branch, OR user gave explicit override
- [ ] If on `main`, show warning and wait for branch switch
- [ ] Proceed with changes only after confirmation

##### Integration with Workflow

**During Development:**
- Start of session: "Which branch are you working on?"
- Before first code edit: Verify branch
- After user mentions testing: Confirm experimental branch
- Before deployment: Remind about branch-specific deploys

**During Git Operations:**
- Before providing commit instructions: Confirm correct branch
- When user requests merge: Verify experimental → main flow
- During changelog updates: Note which branch changes apply to

### Pull Requests
- Keep PRs focused and reasonably sized
- Include clear description of changes
- Link related issues or tickets
- Request reviews from appropriate team members
- For promotions to `main`, use PRs from `experimental` -> `main`
- Wait for required GitHub checks to pass before merging
- Use squash merge for `main` unless user explicitly requests a different merge strategy
- If repository setting "Automatically delete head branches" is enabled, ensure it does not remove long-lived `experimental`

## Development Process

### Before Starting Work
- Understand requirements clearly
- Check for existing solutions or patterns
- Consider edge cases and error handling
- Plan the approach before coding

### During Development
- Write tests alongside code (TDD when appropriate)
- Commit frequently with meaningful messages
- Refactor as you go (don't accumulate technical debt)
- Follow established patterns and conventions

### Before Submitting
- Update changelog if changes are user-facing (features, fixes, docs)
- Create commit with version number first and matching changelog title
- Run linters and fix all issues
- Run tests and ensure they pass
- Review your own code
- Update only required docs:
  - `CHANGELOG.md` for user-facing changes
  - `ARCHITECTURE.md` for structural changes
  - `src/features/*/README.md` when feature code changes
- Do not create new docs by default; only add deep docs with explicit user approval
- If feature code changed, stage `src/features/*/README.md` updates and run `pnpm validate:feature-docs:staged`
- Verify changelog and commit message match

## Agent-Specific Behaviors

### Agent Role and Control (When in agent mode)
- The agent has complete control over the application codebase
- The user is the tester and product-owner who provides user stories and tasks
- The agent turns user stories into architecture, logic, and code implementation
- Always respect user decisions and wait for validation before claiming success

### Success Validation
Never claim success without a user test:
- The user decides if an implementation is successful, not the agent
- Always wait for user confirmation before marking tasks as complete
- Avoid statements like "This should work" or "The implementation is complete"

### Protected Files - Require Explicit User Consent

**CRITICAL: Never modify these files without explicit user approval.**

The agent must STOP and ASK the user before modifying any of the following file categories:

**Configuration Files:**
- `.gitignore`, `.gitattributes`
- `projectStructure.config.cjs`
- `.eslintrc.json`, `eslint.config.js`, `eslint.ignores.js`
- `.dependency-cruiser.cjs`, `.dependency-cruiser-baseline.json`
- `.prettierrc.json`, `.prettierrc.js`
- `.editorconfig`
- `tsconfig*.json`

**Cursor Rules and Commands:**
- `.cursor/rules/**`
- `.cursor/commands/**`

**Git Hooks:**
- `.husky/**`

**CI/CD:**
- `.github/workflows/**`

**Required Behavior:**

1. **When a violation or issue requires modifying a protected file:**
   - STOP immediately
   - Inform user: "This requires modifying [file]. Options: [list options]"
   - Present options clearly (e.g., "Add X to .gitignore?" or "Update config to allow this file?")
   - WAIT for explicit user response
   - Only proceed after user explicitly approves the specific change
   - After receiving explicit user approval, proceed to make the change yourself

2. **Never assume consent:**
   - Even if the fix seems obvious, always ask
   - Even during automated workflows (like finish command), ask before modifying protected files
   - "NEVER adjust rules without explicit user request" applies to ALL protected files

3. **Examples of required behavior:**
   - Pre-commit finds `temp-file.json` → Ask: "Should I add this to .gitignore, or update projectStructure.config.cjs?"
   - Linting fails on new pattern → Ask: "Should I update .eslintrc.json to allow this?"
   - Architecture check fails → Ask: "Should I update the baseline or fix the violation?"

### Reductive Strategy (Bugs and New Features)

**Always simplify first**: When fixing bugs, implementing new features, or refactoring, always first simplify and reduce code.

- Default approach: Try to achieve the result by removing or simplifying existing code
- Only add code when: Simplification failed OR user explicitly gave permission to add code
- Prefer removing code over adding code
- Applies to: Bug fixes, feature requests, refactoring, and performance improvements

For complete debugging strategy, see `debugging/RULE.md`.

### Branch Protection

See Branch Strategy section above for detailed branch protection rules and verification process.

### Commit and Push Workflow

**Automated Workflow:** Use `.cursor/commands/finish.md` and `.cursor/commands/push.md` as a split workflow.

#### Agent-Executed Flow

1. **After completing changes**, the agent:
   - Summarizes what was changed
   - Shows the changelog entry that was added
   - Asks the user: "Are you ready to commit these changes?"

2. **User responds** with explicit confirmation or denial

3. **Finish phase (`finish` command):**
   - Runs local cleanup/check tasks
   - Updates changelog/version as required
   - Runs `git add` and `git commit` only after explicit user confirmation
   - Never pushes during `finish`

4. **Push phase (`push` command):**
   - Must verify clean working tree and existing local commits
   - Must never run `git add` or `git commit`
   - Pushes only already committed work after explicit user confirmation
   - Default push target is `experimental`; direct pushes to `main` are disallowed unless user explicitly requests an emergency override
   - Uses `required_permissions: ["all"]` when running git commands to avoid Win32 pipe errors (see `.cursor/commands/debug.md` § "Git env.exe couldn't create signal pipe")

5. **General commit safety:**
   - Never assume the user wants to commit just because changes are complete
   - Always require commit body - commit messages must include detailed body explaining changes

### Documentation Lookup
- When needing documentation info from a URL, visit it programmatically using the actual browser tool
- Don't rely on cached or outdated documentation
- Verify current documentation before implementing features

### Platform and Commands

**Environment:** Windows with PowerShell.

**Command Rules:**
- No Unix-style `&&` chaining
- No Unix-only flags like `rm -rf`
- Run commands as separate sequential calls (the agent executes them, not the user)

### Shell/PowerShell Handling

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

**Why This Pattern Prevents Crashes:**

1. **Explicit Exit Code Propagation**: PowerShell doesn't always propagate exit codes from child processes. When a command fails, the exit code may not be set correctly, leaving Cursor waiting indefinitely. The explicit check ensures Cursor gets a clear failure signal.

2. **Prevents Ambiguous States**: Without explicit handling, a command might fail but PowerShell returns 0, causing Cursor to treat it as success. This mismatch can cause crashes or hangs. The pattern forces an explicit `exit 1` on any non-zero exit code.

3. **Large Output Serialization**: When commands produce large output, Cursor may struggle to serialize the response (e.g., "serialize binary: invalid int 32" errors). Explicit exit handling provides a clear termination point, preventing serialization issues.

4. **PowerShell-Specific Behavior**: PowerShell's error handling differs from bash - exit codes aren't always propagated automatically. Explicit checks are more reliable for ensuring Cursor receives unambiguous termination signals.

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
- This pattern gives Cursor a clear, unambiguous termination signal, reducing crashes and hangs

### Environment Variables and Configuration

**Environment Variables:**
- Use `VITE_*` names for all client-side environment variables
- Access via `import.meta.env.VITE_*`
- Never commit real `.env` files containing secrets
  - Use `.env.example` for structure only if needed
  - Real values live in local environment and CI

**Supabase Environment Variables (Current):**
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous/public key
- Access in code: `import {supabase} from '../../config/supabase';`

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

## Deployment Process

### Cloud Functions Deployment
- When cloud functions have to be deployed (again) for changes to have effect, deploy them yourself
- Don't ask user to deploy unless there's a specific reason they need to do it
- Verify deployment was successful

### Pre-Deployment Linting
- Always run and pass the exact predeploy lint locally for the specific package before deployment
- Command: `npm --prefix functions run lint[:fix]`
- Fix all lints until clean:
  - max-len violations
  - JSDoc requirements
  - Unused variables
  - Escaping issues
- Never deploy with linting errors

## Examples

### Good Commit Message (with changelog sync)

**Changelog entry:**
- Version heading: `## 3.19.0 - 2024-11-01`
- Section: `### Added`
- Entry: User Authentication with JWT token-based authentication system

**Commit message:**
- Format: `[3.19.0] feat: User Authentication` (see `.cursor/commands/finish.md` for format SSOT)
- Body includes: Implementation details, middleware updates, service changes, test coverage
- References: Closes #123

Note: Commit body is required and must include details about what changed. Version number is first, commit type and title match changelog exactly. See `.cursor/commands/finish.md` for complete commit message standards.

### Bad Commit Message
- Generic messages like "fix stuff" without version, type, or details

### Good PR Description
- Clear changes section listing what was added/modified
- Testing section describing test coverage
- Related issues section with ticket references

## Related Rules

**When modifying this rule, check these rules for consistency:**
- `code-style/RULE.md` - Code review standards reference code style
- `architecture/RULE.md` - Review process may reference architecture
- `testing/RULE.md` - Review checklist includes testing requirements
- `security/RULE.md` - Review process includes security checks
- `cloud-functions/RULE.md` - Deployment processes reference cloud functions

**Rules that reference this rule:**
- All other rules may be referenced in code review processes
- `cloud-functions/RULE.md` - References deployment processes
