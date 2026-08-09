/**
 * Classify staged paths for Husky pre-commit fast paths and test selection.
 * SSOT: documentation/DOC_AGENT_WORKFLOW_LAYERS.md
 */

const {execSync} = require('child_process');

/** @typedef {'full' | 'related' | 'skip-vitest' | 'node-scripts-only'} TestRunMode */

const APP_SURFACE_PREFIXES = ['src/', 'supabase/functions/'];

const FULL_SUITE_EXACT = [
  'package.json',
  'pnpm-lock.yaml',
  'projectStructure.config.cjs',
  '.dependency-cruiser.cjs',
];

const FULL_SUITE_PREFIXES = ['tsconfig.', 'vite.config.', 'vitest.config.'];

const TEST_INFRA_PREFIXES = ['tests/', '.husky/'];

const TEST_INFRA_EXACT = [
  'scripts/change-classify.cjs',
  'scripts/test-staged.cjs',
  'scripts/is-staged-precommit-light.js',
  'scripts/validate-staged.js',
  'scripts/arch-check-staged.js',
  'scripts/validate-feature-size-staged.js',
  'scripts/project-structure-validator.js',
];

/**
 * @returns {number}
 */
function getFullSuiteSrcThreshold() {
  const parsed = Number.parseInt(
    process.env.PRECOMMIT_SRC_THRESHOLD ?? '25',
    10,
  );
  return Number.isNaN(parsed) ? 25 : parsed;
}

/**
 * @param {string} filePath
 * @returns {string}
 */
function normalizePath(filePath) {
  return filePath.replace(/\\/g, '/').trim();
}

/**
 * @param {string} n
 * @param {string[]} prefixes
 * @returns {boolean}
 */
function startsWithAny(n, prefixes) {
  return prefixes.some((prefix) => n.startsWith(prefix));
}

/**
 * @param {string} filePath
 * @returns {boolean}
 */
function isDocsOnlyFile(filePath) {
  const n = normalizePath(filePath);
  if (!n) {
    return false;
  }
  if (n === 'CHANGELOG.md') {
    return true;
  }
  if (n.startsWith('.changeset/') && n.endsWith('.md')) {
    return true;
  }
  if (n.startsWith('documentation/')) {
    return true;
  }
  if (n.startsWith('.cursor/')) {
    return true;
  }
  if (n.startsWith('.agents/')) {
    return true;
  }
  return n.endsWith('.md');
}

/**
 * SQL under supabase/migrations or seed.sql — no app TypeScript surface.
 *
 * @param {string} filePath
 * @returns {boolean}
 */
function isMigrationsOnlyFile(filePath) {
  const n = normalizePath(filePath);
  if (!n) {
    return false;
  }
  if (n === 'supabase/seed.sql') {
    return true;
  }
  return n.startsWith('supabase/migrations/') && n.endsWith('.sql');
}

/**
 * @returns {string[]}
 */
function getStagedFiles() {
  const out = execSync(
    'git diff --cached --name-only --diff-filter=ACDMRT',
    {encoding: 'utf-8', stdio: ['ignore', 'pipe', 'pipe']},
  ).trim();
  if (!out) {
    return [];
  }
  return out.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
}

/**
 * @param {string} filePath
 * @returns {boolean}
 */
function isFullSuiteTriggerFile(filePath) {
  const n = normalizePath(filePath);
  if (!n) {
    return false;
  }
  if (FULL_SUITE_EXACT.includes(n)) {
    return true;
  }
  return startsWithAny(n, FULL_SUITE_PREFIXES);
}

/**
 * @param {string} filePath
 * @returns {boolean}
 */
function isTestInfraFile(filePath) {
  const n = normalizePath(filePath);
  if (!n) {
    return false;
  }
  if (TEST_INFRA_EXACT.includes(n)) {
    return true;
  }
  return startsWithAny(n, TEST_INFRA_PREFIXES);
}

/**
 * @param {string} filePath
 * @returns {boolean}
 */
function isStagedSrcFile(filePath) {
  const n = normalizePath(filePath);
  return (
    n.startsWith('src/') &&
    (n.endsWith('.ts') || n.endsWith('.tsx')) &&
    !isStagedTestFile(filePath)
  );
}

/**
 * @param {string} filePath
 * @returns {boolean}
 */
function isStagedTestFile(filePath) {
  const n = normalizePath(filePath);
  return /\.(test|spec)\.(ts|tsx)$/.test(n);
}

/**
 * @param {string} filePath
 * @returns {boolean}
 */
function isStagedAppFile(filePath) {
  const n = normalizePath(filePath);
  if (isStagedSrcFile(filePath) || isStagedTestFile(filePath)) {
    return true;
  }
  return (
    n.startsWith('supabase/functions/') &&
    (n.endsWith('.ts') || n.endsWith('.tsx'))
  );
}

/**
 * @param {string} filePath
 * @returns {boolean}
 */
function isSharedKernelFile(filePath) {
  return normalizePath(filePath).startsWith('src/shared/');
}

/**
 * @param {string} filePath
 * @returns {boolean}
 */
function isSupabaseFunctionFile(filePath) {
  const n = normalizePath(filePath);
  return (
    n.startsWith('supabase/functions/') &&
    (n.endsWith('.ts') || n.endsWith('.tsx'))
  );
}

/**
 * @param {string} filePath
 * @returns {boolean}
 */
function isScriptsFile(filePath) {
  return normalizePath(filePath).startsWith('scripts/');
}

/**
 * App/runtime TS surface — staged changes here need type-check and structure/arch.
 *
 * @param {string} filePath
 * @returns {boolean}
 */
function requiresFullPrecommit(filePath) {
  const n = normalizePath(filePath);
  if (startsWithAny(n, APP_SURFACE_PREFIXES)) {
    return true;
  }
  if (isFullSuiteTriggerFile(filePath) || isTestInfraFile(filePath)) {
    return true;
  }
  return false;
}

/**
 * @param {string[]} staged
 * @returns {string[]}
 */
function getStagedSrcPaths(staged) {
  const paths = staged.filter(isStagedSrcFile).map(normalizePath);
  return [...new Set(paths)];
}

/**
 * @param {string[]} staged
 * @returns {string[]}
 */
function getStagedTestPaths(staged) {
  const paths = staged.filter(isStagedTestFile).map(normalizePath);
  return [...new Set(paths)];
}

/**
 * @param {string[]} staged
 * @returns {{ light: boolean, kind: 'docs' | 'migrations' | 'no-src' | null }}
 */
function classifyChanges(staged) {
  if (staged.length === 0) {
    return {light: false, kind: null};
  }
  if (staged.some(isTestInfraFile) || staged.some(isFullSuiteTriggerFile)) {
    return {light: false, kind: null};
  }
  if (staged.every(isDocsOnlyFile)) {
    return {light: true, kind: 'docs'};
  }
  if (staged.every(isMigrationsOnlyFile)) {
    return {light: true, kind: 'migrations'};
  }
  if (!staged.some(requiresFullPrecommit)) {
    return {light: true, kind: 'no-src'};
  }
  return {light: false, kind: null};
}

/**
 * @param {string[]} staged
 * @returns {string | null}
 */
function resolveFullSuiteReason(staged) {
  if (staged.some(isFullSuiteTriggerFile)) {
    return 'full-suite trigger file';
  }
  if (staged.some(isTestInfraFile)) {
    return 'test-infra file';
  }
  if (staged.some(isSharedKernelFile)) {
    return 'src/shared kernel';
  }
  const testPaths = getStagedTestPaths(staged);
  if (testPaths.length > getFullSuiteSrcThreshold()) {
    return 'staged test file count exceeds threshold';
  }
  if (staged.some(isSupabaseFunctionFile)) {
    return 'supabase edge function surface';
  }
  const srcPaths = getStagedSrcPaths(staged);
  if (srcPaths.length > getFullSuiteSrcThreshold()) {
    return 'staged src file count exceeds threshold';
  }
  return null;
}

/**
 * @param {string[]} staged
 * @returns {{ mode: 'related', reason: string, relatedPaths: string[] } | null}
 */
function resolveRelatedTestRun(staged) {
  const testPaths = getStagedTestPaths(staged);
  if (testPaths.length > 0) {
    return {
      mode: 'related',
      reason: 'staged test files',
      relatedPaths: testPaths,
    };
  }
  const srcPaths = getStagedSrcPaths(staged);
  if (srcPaths.length > 0) {
    return {
      mode: 'related',
      reason: 'staged src files',
      relatedPaths: srcPaths,
    };
  }
  return null;
}

/**
 * @param {string[]} staged
 * @returns {{ mode: TestRunMode, reason: string, relatedPaths?: string[] }}
 */
function classifyTestRun(staged) {
  if (process.env.PRECOMMIT_TEST_FULL === '1') {
    return {mode: 'full', reason: 'env override'};
  }
  if (staged.length === 0) {
    return {mode: 'skip-vitest', reason: 'no staged files'};
  }

  const fullReason = resolveFullSuiteReason(staged);
  if (fullReason) {
    return {mode: 'full', reason: fullReason};
  }

  const related = resolveRelatedTestRun(staged);
  if (related) {
    return related;
  }

  if (staged.some(isScriptsFile) && !staged.some(isStagedAppFile)) {
    return {mode: 'node-scripts-only', reason: 'scripts only'};
  }

  return {mode: 'skip-vitest', reason: 'no app test surface'};
}

/** @deprecated Use classifyChanges */
const classifyPrecommitLight = classifyChanges;

module.exports = {
  APP_SURFACE_PREFIXES,
  FULL_SUITE_EXACT,
  FULL_SUITE_PREFIXES,
  getFullSuiteSrcThreshold,
  TEST_INFRA_EXACT,
  TEST_INFRA_PREFIXES,
  normalizePath,
  isDocsOnlyFile,
  isMigrationsOnlyFile,
  isFullSuiteTriggerFile,
  isTestInfraFile,
  isStagedSrcFile,
  isStagedTestFile,
  isStagedAppFile,
  isSharedKernelFile,
  isSupabaseFunctionFile,
  isScriptsFile,
  requiresFullPrecommit,
  getStagedFiles,
  getStagedSrcPaths,
  getStagedTestPaths,
  classifyChanges,
  classifyTestRun,
  resolveFullSuiteReason,
  resolveRelatedTestRun,
  classifyPrecommitLight,
  /** @deprecated Use getFullSuiteSrcThreshold() */
  get FULL_SUITE_SRC_THRESHOLD() {
    return getFullSuiteSrcThreshold();
  },
};
