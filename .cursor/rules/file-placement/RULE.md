---
description: "CRITICAL: Before creating any new file or folder, validate placement against projectStructure.config.js and architecture rules. Check structure whitelist, verify allowed file patterns, and suggest correct locations if invalid. Applies when user requests file/folder creation or assistant needs to create files."
alwaysApply: true
---

# File Placement Validation Rule

## Purpose

Ensures files/folders are created in correct locations per `projectStructure.config.js` and architecture rules.

**BEFORE creating any file/folder**, you MUST:

1. Check `projectStructure.config.js` for allowed locations
2. Validate against `.cursor/rules/architecture/RULE.md`
3. Confirm placement matches whitelist patterns
4. Suggest corrections if invalid

## Validation Process

1. **Check structure**: Run `pnpm validate:structure` or check `projectStructure.config.js`
2. **Determine location** per file type:
   - **Page Component** (`.tsx`) → `src/pages/<PageName>/<PageName>Page.tsx` (prefer named files, NOT `index.tsx`)
   - Component (`.tsx`) → `src/components/common/` or `src/features/*/components/`
   - Hook/Service/Util (`.ts`) → `src/shared/{hooks|services|utils}/` or `src/features/*/{hooks|services}/`
   - Types (`.ts`) → `src/shared/types/`
   - Edge Function → `supabase/functions/<name>/index.ts`
   - Cloud Function → `cloud-functions/<name>/`
   - Feature docs (`.md`) → `src/features/*/README.md` or `src/features/*/docs/*.md`
   - Docs (`.md`) → See Documentation Placement section below
   - Migration (`.sql`) → `supabase/migrations/` or `migrations/`
   - Layout hooks (`.ts`) → `src/shared/hooks/useLayout*.ts`
   - Route guards (`.tsx`) → `src/routes/guards/`
   - Feature context (`.tsx`) → `src/features/*/context/`
   - Feature state slice (`.ts`) → `src/features/*/store/`
   - Validation schema (`.ts`) → `src/features/*/types/*.schema.ts` or `src/shared/utils/validation/`
   - Data transformer (`.ts`) → Consumer's `services/` or `src/shared/utils/transformers/`
3. **Validate**: Directory exists in config, file pattern allowed, matches whitelist
4. **If invalid**: Identify violation, suggest correct location, explain why, offer to create

## Examples

**Page Component**: `ChatPage.tsx` → `src/pages/chat/ChatPage.tsx` (prefer named files, NOT `src/pages/chat/index.tsx`)
- ✅ CORRECT: `src/pages/files/FilesPage.tsx`
- ❌ WRONG: `src/pages/files/index.tsx` (causes ambiguity in editor tabs)
- ❌ WRONG: `src/pages/index.ts` (barrel files NOT allowed for pages - use direct imports)

**Component**: `UserProfile.tsx` → Check if feature-specific (`src/features/users/components/`) or reusable (`src/components/common/`)
- ⚠️ NOTE: Avoid `src/pages/*/components/` unless page truly has multiple page-specific components

**Root file**: `config.yaml` → Not whitelisted, suggest `documentation/` or update config

**Temp directory**: `temp/` → Not allowed, suggest `.gitignore` or `documentation/temp/`

**Edge function**: `send-email` → Create `supabase/functions/send-email/index.ts`

## Integration

Run `pnpm validate:structure` before creating files. Update `projectStructure.config.js` only for legitimate new structures (with approval).

## Error Prevention

**DO NOT**:
- ❌ Create files in unallowed locations
- ❌ Create directories not in the whitelist
- ❌ Use file patterns not allowed in that directory
- ❌ Modify `projectStructure.config.js` to accommodate violations
- ❌ Skip validation "because it's just a small file"

**DO**:
- ✅ **ALWAYS check structure BEFORE creating** (this is mandatory, not optional)
- ✅ **STOP and validate** if unsure about placement
- ✅ Suggest correct locations when user requests invalid placement
- ✅ Explain architecture reasoning
- ✅ Update config only for legitimate new structures (with user approval)
- ✅ Reference this rule explicitly when validating placement
- ✅ **Mark temporary files** with `temp_` prefix (see Temporary Files section below)

## Temporary Files

**IMPORTANT:** When creating files that are NOT intended to be permanent project artifacts, use the `temp_` prefix.

### What Qualifies as Temporary

Use `temp_` prefix for:
- 📋 **Planning documents**: Decision summaries, migration checklists, implementation plans
- 🔍 **Investigation notes**: Debug findings, analysis results, research summaries
- 📝 **Draft documentation**: Files created during discussion that may be consolidated later
- 🧪 **Test artifacts**: Temporary test data, mock files, one-off scripts
- 🔄 **Migration helpers**: Files tracking progress that will be deleted after completion

Do NOT use `temp_` prefix for:
- ✅ Permanent documentation (README, architecture docs, feature docs)
- ✅ Configuration files
- ✅ Source code files
- ✅ Migration SQL files (these are permanent)

### Naming Convention

```
temp_<descriptive-name>.<extension>

Examples:
- temp_pages-structure-decisions.md       ← Planning doc
- temp_migration-checklist.md             ← Migration tracker
- temp_debug-findings.md                  ← Investigation notes
- temp_api-response-sample.json           ← Test data
```

### Why This Matters

- Makes it clear which files are safe to delete
- Prevents temporary planning docs from cluttering permanent documentation
- Easy to search/filter: `git ls-files | grep temp_`
- Helps with cleanup: `find . -name "temp_*" -type f`

## Documentation Placement

**CRITICAL:** Documentation files have strict placement rules based on their permanence.

### Temporary Documentation

**Temporary documentation MUST be placed in one of these locations:**

- `documentation/jobs/` - For job/feature-related temporary docs
- `documentation/temp/` - For general temporary docs
- `documentation/jobs/temp_job_<name>/` - For grouped temporary docs

**Examples:**
- ✅ **CORRECT**: `documentation/jobs/temp_job_feature_name/ANALYSIS.md`
- ✅ **CORRECT**: `documentation/jobs/job_feature_implementation.md`
- ✅ **CORRECT**: `documentation/temp/debugging_notes.md`
- ❌ **WRONG**: `documentation/bug-analysis.md` (directly in documentation root)
- ❌ **WRONG**: `documentation/MY_NOTES.md` (missing DOC_ prefix for root-level)

**What qualifies as temporary documentation:**
- 📋 Planning documents (implementation plans, analysis, design decisions)
- 🔍 Investigation notes (bug analysis, debugging findings)
- 📝 Draft documentation created during development
- 🔄 Migration helpers and progress tracking files

### Feature-Local Documentation (Preferred for Feature Work)

When documentation is about a specific feature's behavior, API, flows, or constraints, keep it colocated with the feature:

- `src/features/<feature>/README.md` - Required feature overview and maintenance notes
- `src/features/<feature>/docs/*.md` - Optional deep dives, ADRs, and edge-case guides (explicit user approval required)
- `src/features/<group>/<feature>/README.md` - Same rule for nested features

**Maintenance rule:**
- If feature code changes are staged, stage updates to that feature's `README.md` in the same commit
- Pre-commit enforcement: `pnpm validate:feature-docs:staged`
- Default: do not create new deep docs; prefer code comments/tests unless cross-file knowledge requires a doc

**Use `documentation/` for cross-feature docs only:**
- Global architecture guides
- Multi-feature migration plans
- Temporary planning docs (`documentation/jobs/`, `documentation/temp/`)

### Permanent Documentation (DOC_ Prefix Required)

**CRITICAL: Root-level documentation files in `documentation/` MUST have the `DOC_` prefix.**

This naming convention:
- Enforces explicit approval for permanent documentation
- Makes permanent docs easily identifiable
- Prevents accidental creation of root-level docs
- Is validated by `projectStructure.config.cjs` (hard enforcement)

**Naming convention:**
```
documentation/DOC_<DESCRIPTIVE_NAME>.md

Examples:
- DOC_ARCHITECTURE_MIGRATION.md
- DOC_TESTING_GUIDE.md
- DOC_FEATURE_*.md
```

**What qualifies as permanent documentation:**
- ✅ Architecture documentation (`DOC_ARCHITECTURE_*.md`)
- ✅ Feature documentation (`DOC_FEATURE_*.md`)
- ✅ Project guides (`DOC_ARCHITECTURE_MIGRATION.md`, etc.)
- ⚠️ Boilerplate-only docs (e.g. DOC_APP_CONFIG_FILE, DOC_SETUP_*) are removed by complete-setup

**Workflow for permanent documentation:**
1. **STOP** before creating any file directly in `documentation/`
2. **ASK** the user: "Should this be permanent documentation with DOC_ prefix?"
3. **WAIT** for explicit approval
4. **USE** the `DOC_` prefix: `documentation/DOC_<name>.md`

**If unsure, default to temporary placement:**
- When in doubt, create in `documentation/jobs/` or `documentation/temp/`
- User can rename with DOC_ prefix later if it should be permanent
- Better to err on the side of temporary placement
- If uncertain whether a new deep doc is needed, ask the user first and avoid creating it by default

### Subdirectories in Documentation

Subdirectories in `documentation/` (e.g., `documentation/Authentication-main-app/`) are allowed for:
- Reference material and code examples
- Grouped documentation by topic
- Legacy documentation folders

Files within subdirectories do NOT require the DOC_ prefix.

### Why This Matters

- **Hard enforcement**: `projectStructure.config.cjs` only allows `DOC_*.md` at root level
- **Pre-commit validation**: Violations caught before commit via `pnpm validate:structure:staged`
- Makes it easy to identify temporary files for cleanup (`documentation/jobs/`, `documentation/temp/`)
- Prevents cluttering the main documentation folder with temporary files
- Ensures permanent documentation is intentional and approved
- Easy cleanup: `find documentation/jobs -name "temp_*"` or `find documentation/temp`

## ⚠️ CRITICAL: NEVER Move Files Programmatically

**The AI assistant MUST NEVER move, rename, or relocate files programmatically.**

When files need to be moved or renamed:

1. **DO NOT** use read_file + write + delete_file to move files
2. **DO NOT** attempt to update imports manually after moving files
3. **INSTEAD**, guide the user to perform the move in their IDE:
   - In VS Code/Cursor: Drag the file to the new location, or right-click → "Rename"
   - The IDE will automatically prompt to update all imports
   - This ensures BOTH directions of imports are updated:
     - Imports IN the moved file (what it imports)
     - Imports OF the moved file (other files importing it)

**Why this matters:**
- When AI moves files programmatically, it bypasses the IDE's import updating mechanism
- This breaks imports in BOTH directions, requiring extensive manual fixes
- The IDE's built-in file move handles this automatically

**Correct workflow for file restructuring:**
1. AI describes which files need to move and where
2. User performs the moves in IDE (gets auto-import updates)
3. AI verifies the result and continues with other changes

**Example response when file move is needed:**
```
To restructure this feature, please move the following files in your IDE 
(drag & drop or right-click → Rename). The IDE will update all imports automatically:

1. Move `src/components/chat/ChatContainer.tsx` → `src/features/chat/components/ChatContainer.tsx`
2. Move `src/hooks/useChat.ts` → `src/features/chat/hooks/useChat.ts`

Let me know once you've moved them and I'll continue with the remaining changes.
```

## Workflow

**STOP → CHECK → VALIDATE → CREATE**

Always validate placement before creating. If invalid, suggest correct location per architecture rules.

## Related Files

When updating this rule, also check:
- `scripts/project-structure-validator.js` - Main validator implementation
- `projectStructure.config.js` - Structure configuration file
- `package.json` - Scripts that call the validator (validate:structure)
- `documentation/PROJECT-STRUCTURE-VALIDATION.md` - User documentation
- `architecture.md` - Architecture documentation
- `.cursor/rules/architecture/RULE.md` - Architecture standards and structure

## Related Rules

- `.cursor/rules/architecture/RULE.md` - Architecture standards and structure
- `projectStructure.config.js` - Whitelist of allowed files/folders
- `scripts/project-structure-validator.js` - Validation tool

## SSOT Status

- This rule: SSOT for file creation workflow
- `architecture/RULE.md`: SSOT for project structure
- References `projectStructure.config.js` for whitelist implementation
