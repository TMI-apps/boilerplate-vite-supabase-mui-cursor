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

  // Pass files to validator
  const validatorPath = path.join(__dirname, 'project-structure-validator.js');
  const filesArg = stagedFiles.join(',');
  
  execSync(`node "${validatorPath}" --files=${filesArg}`, {
    stdio: 'inherit',
  });
} catch (error) {
  // If git command fails or validator fails, exit with error code
  process.exit(error.status || 1);
}
