#!/usr/bin/env node
/**
 * Validates feature size for features touched by staged files.
 * Counts the whole feature, not just staged files.
 *
 * @relatedFiles
 * - scripts/validate-feature-size.js
 * - scripts/validate-staged.js
 */

const { execSync } = require('child_process');
const {
  validateFeatureSizes,
  printViolations,
  featureKeyFromFilePath,
} = require('./feature-size-lib');

try {
  const stagedFiles = execSync('git diff --cached --name-only --diff-filter=ACMR', {
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe'],
  })
    .trim()
    .split('\n')
    .filter((filePath) => filePath.trim());

  if (stagedFiles.length === 0) {
    process.exit(0);
  }

  const featureKeys = [
    ...new Set(
      stagedFiles.map((filePath) => featureKeyFromFilePath(filePath)).filter(Boolean),
    ),
  ];

  if (featureKeys.length === 0) {
    process.exit(0);
  }

  const result = validateFeatureSizes({ featureKeys });

  if (!result.success) {
    printViolations(result.violations, 'human');
    process.exit(1);
  }

  process.exit(0);
} catch (error) {
  process.exit(error.status || 1);
}
