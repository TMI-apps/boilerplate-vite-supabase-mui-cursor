#!/usr/bin/env node
/**
 * Wrapper script for checking architecture of staged TypeScript files only
 * Gets staged .ts/.tsx files from git and passes them to dependency-cruiser
 */

const { execSync } = require('child_process');

try {
  // Get staged TypeScript files (Added, Copied, Modified, Renamed)
  const stagedFiles = execSync(
    'git diff --cached --name-only --diff-filter=ACMR -- "*.ts" "*.tsx"',
    {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    }
  )
    .trim()
    .split('\n')
    .filter((f) => f.trim());

  if (stagedFiles.length === 0) {
    // No staged TypeScript files, exit successfully
    process.exit(0);
  }

  // Run dependency-cruiser on staged files
  execSync(`depcruise --config .dependency-cruiser.cjs ${stagedFiles.join(' ')}`, {
    stdio: 'inherit',
  });
} catch (error) {
  // If git command fails or dependency-cruiser fails, exit with error code
  process.exit(error.status || 1);
}
