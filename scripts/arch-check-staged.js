#!/usr/bin/env node
/**
 * Architecture check for staged TypeScript files that affect app import graph.
 * Filters to architecture-relevant paths; skips tests and declaration-only files.
 *
 * @relatedFiles
 * - .dependency-cruiser.cjs
 * - scripts/validate-staged.js
 */

const { execFileSync } = require('child_process');

const ARCH_PREFIXES = [
  'src/features/',
  'src/shared/',
  'src/components/',
  'src/pages/',
  'src/routes/',
  'src/layouts/',
  'src/config/',
  'src/lib/',
  'src/ai-capabilities/',
];

const ARCH_ROOT_FILES = new Set(['src/App.tsx', 'src/main.tsx', 'src/index.tsx']);

const TEST_PATTERN = /\.(test|spec)\.(ts|tsx)$/;

/**
 * @param {string} filePath
 * @returns {string}
 */
function normalizePath(filePath) {
  return filePath.replace(/\\/g, '/').trim();
}

/**
 * @param {string} filePath
 * @returns {boolean}
 */
function isArchitectureRelevant(filePath) {
  const normalized = normalizePath(filePath);
  if (!normalized.endsWith('.ts') && !normalized.endsWith('.tsx')) {
    return false;
  }
  if (normalized.endsWith('.d.ts')) {
    return false;
  }
  if (TEST_PATTERN.test(normalized)) {
    return false;
  }
  if (ARCH_ROOT_FILES.has(normalized)) {
    return true;
  }
  return ARCH_PREFIXES.some((prefix) => normalized.startsWith(prefix));
}

try {
  const stagedFiles = execFileSync(
    'git',
    ['diff', '--cached', '--name-only', '--diff-filter=ACMR', '--', '*.ts', '*.tsx'],
    { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] },
  )
    .trim()
    .split('\n')
    .map((filePath) => filePath.trim())
    .filter(Boolean);

  const relevantFiles = stagedFiles.filter(isArchitectureRelevant);

  if (relevantFiles.length === 0) {
    process.exit(0);
  }

  execFileSync(
    'depcruise',
    ['--config', '.dependency-cruiser.cjs', ...relevantFiles],
    { stdio: 'inherit' },
  );
} catch (error) {
  process.exit(error.status || 1);
}

module.exports = { isArchitectureRelevant, normalizePath };
