# Cursor Exit Code Serialization Error Fix

## Problem

When running validation commands (linting, type checking, etc.) that exit with non-zero codes, Cursor crashes with the following error:

```
[internal] serialize binary: invalid int 32: 4294967295
```

This occurs because Cursor's internal serialization system cannot handle certain exit code values properly, causing the IDE to crash.

## Root Cause

PowerShell's `$LASTEXITCODE` can sometimes return values that exceed the valid int32 range when commands fail, causing Cursor's binary serialization to fail. The solution is to explicitly normalize exit codes to 0 (success) or 1 (failure).

## Solution

Create a generic PowerShell wrapper script that:
1. Executes any command
2. Normalizes exit codes to 0 or 1
3. Prevents Cursor from crashing on command failures

## Implementation

### Step 1: Create the Generic Wrapper Script

Create `scripts/run-safe.ps1`:

```powershell
#!/usr/bin/env powershell
# Generic safe command runner for PowerShell
# Properly handles exit codes to prevent Cursor crashes
# Usage: ./scripts/run-safe.ps1 "<command>"
# Example: ./scripts/run-safe.ps1 "pnpm eslint . --max-warnings=0"

param(
    [Parameter(Mandatory=$true, Position=0)]
    [string]$Command
)

# Execute the command string
Invoke-Expression $Command

# Ensure proper exit code handling to prevent Cursor serialization errors
if ($LASTEXITCODE -ne 0) {
    exit 1
}

exit 0
```

### Step 2: Update package.json Scripts

Update your `package.json` scripts section to use the wrapper for commands that might fail:

**Before:**
```json
{
  "scripts": {
    "lint": "eslint . --max-warnings=0",
    "type-check": "tsc --noEmit",
    "arch:check": "depcruise --config .dependency-cruiser.js src",
    "validate:structure": "node scripts/project-structure-validator.js"
  }
}
```

**After:**
```json
{
  "scripts": {
    "lint": "powershell -File scripts/run-safe.ps1 \"pnpm eslint . --max-warnings=0\"",
    "type-check": "powershell -File scripts/run-safe.ps1 \"pnpm tsc --noEmit\"",
    "arch:check": "powershell -File scripts/run-safe.ps1 \"pnpm depcruise --config .dependency-cruiser.js src\"",
    "validate:structure": "powershell -File scripts/run-safe.ps1 \"node scripts/project-structure-validator.js\""
  }
}
```

**Note:** For Windows, use `powershell`. For PowerShell Core (cross-platform), use `pwsh` instead.

### Step 3: Test the Solution

Run a command that you know will fail (e.g., with linting errors):

```bash
pnpm lint
```

**Expected behavior:**
- Command executes normally
- Exit code is 1 (due to errors)
- Cursor does NOT crash
- Error output is displayed correctly

## How It Works

1. **Command Execution**: The wrapper uses `Invoke-Expression` to execute the command string passed as a parameter.

2. **Exit Code Normalization**: After execution, the script checks `$LASTEXITCODE`:
   - If non-zero (failure): Explicitly exits with code 1
   - If zero (success): Explicitly exits with code 0

3. **Cursor Safety**: By normalizing exit codes to standard 0/1 values, we prevent Cursor from encountering invalid int32 values during serialization.

## Usage Examples

### Basic Usage
```bash
# Run linting
pnpm lint

# Run type checking
pnpm type-check

# Run architecture validation
pnpm arch:check
```

### Custom Commands
You can use the wrapper for any command:

```json
{
  "scripts": {
    "custom-check": "powershell -File scripts/run-safe.ps1 \"your-command-here\""
  }
}
```

### Command with Arguments
Commands with arguments should be passed as a single quoted string:

```json
{
  "scripts": {
    "lint:fix": "powershell -File scripts/run-safe.ps1 \"eslint . --fix\""
  }
}
```

## Cross-Platform Considerations

### Windows (PowerShell 5.1)
```json
"lint": "powershell -File scripts/run-safe.ps1 \"pnpm eslint . --max-warnings=0\""
```

### PowerShell Core (Cross-platform)
If you have PowerShell Core installed, you can use `pwsh` for cross-platform compatibility:

```json
"lint": "pwsh -File scripts/run-safe.ps1 \"pnpm eslint . --max-warnings=0\""
```

**Note:** The script uses `#!/usr/bin/env powershell` shebang. For PowerShell Core, change to `#!/usr/bin/env pwsh`.

## Troubleshooting

### "powershell is not recognized"
- Ensure PowerShell is installed and in your PATH
- On Windows, PowerShell should be available by default
- Try using `pwsh` if you have PowerShell Core installed

### "pwsh is not recognized"
- Install PowerShell Core, or
- Use `powershell` instead of `pwsh` in package.json

### Script execution policy errors
If you encounter execution policy errors, you may need to set the execution policy:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Commands still causing crashes
- Ensure the wrapper script is being called correctly
- Verify the command string is properly quoted in package.json
- Check that `$LASTEXITCODE` is being checked after command execution

## Files Created/Modified

### Created
- `scripts/run-safe.ps1` - Generic wrapper script

### Modified
- `package.json` - Updated scripts to use the wrapper

## Benefits

1. **Prevents Cursor Crashes**: No more serialization errors when commands fail
2. **Minimal Changes**: Single wrapper script handles all commands
3. **Reusable**: One script works for all validation commands
4. **Maintainable**: Easy to update or extend
5. **Standard Exit Codes**: Normalizes to 0 (success) or 1 (failure)

## Alternative Approaches Considered

### Multiple Wrapper Scripts
**Rejected**: Creates unnecessary file duplication. The generic wrapper is more maintainable.

### Modifying Individual Commands
**Rejected**: Would require changes to many files. The wrapper approach centralizes the fix.

### Using npm/pnpm Scripts Directly
**Rejected**: Doesn't solve the PowerShell exit code serialization issue.

## Related Issues

This fix addresses:
- Cursor crashes on command failures
- Exit code serialization errors
- PowerShell `$LASTEXITCODE` handling
- Non-zero exit code propagation

## References

- PowerShell exit code handling: https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables#lastexitcode
- Cursor IDE: https://cursor.sh/
