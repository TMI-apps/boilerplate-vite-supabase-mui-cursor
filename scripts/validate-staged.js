#!/usr/bin/env node
/**
 * Wrapper script for validating staged files only
 * Gets staged files from git and passes them to project-structure-validator.js
 */

const { execSync } = require('child_process');
const path = require('path');

try {
  // Get staged files (Added, Copied, Modified, Renamed)
  const stagedFiles = execSync('git diff --cached --name-only --diff-filter=ACMR', {
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe'],
  })
    .trim()
    .split('\n')
    .filter((f) => f.trim());

  if (stagedFiles.length === 0) {
    // No staged files, exit successfully
    process.exit(0);
  }

  // Pass files to validator (use temp file to avoid Windows command-line length limits)
  const validatorPath = path.join(__dirname, 'project-structure-validator.js');
  const fs = require('fs');
  const os = require('os');
  const tmpFile = path.join(os.tmpdir(), `staged-structure-files-${process.pid}.txt`);
  fs.writeFileSync(tmpFile, stagedFiles.join('\n'), 'utf8');
  try {
    execSync(`node "${validatorPath}" --files-from="${tmpFile}"`, {
      stdio: 'inherit',
    });
  } finally {
    try {
      fs.unlinkSync(tmpFile);
    } catch {
      // ignore cleanup errors
    }
  }
} catch (error) {
  // If git command fails or validator fails, exit with error code
  process.exit(error.status || 1);
}
