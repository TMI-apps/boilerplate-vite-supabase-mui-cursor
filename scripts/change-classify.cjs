/**
 * Classify staged paths for Husky pre-commit fast paths.
 * SSOT: documentation/DOC_AGENT_WORKFLOW_LAYERS.md
 */

const {execSync} = require('child_process');

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
 * App/runtime TS surface — staged changes here need type-check and structure/arch.
 *
 * @param {string} filePath
 * @returns {boolean}
 */
function requiresFullPrecommit(filePath) {
  const n = normalizePath(filePath);
  if (n.startsWith('src/')) {
    return true;
  }
  if (n.startsWith('supabase/functions/')) {
    return true;
  }
  if (n === 'tsconfig.json' || n.startsWith('tsconfig.')) {
    return true;
  }
  if (/^vite\.config\./.test(n) || /^vitest\.config\./.test(n)) {
    return true;
  }
  return false;
}

/**
 * @param {string[]} staged
 * @returns {{ light: boolean, kind: 'docs' | 'migrations' | 'no-src' | null }}
 */
function classifyChanges(staged) {
  if (staged.length === 0) {
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

/** @deprecated Use classifyChanges */
const classifyPrecommitLight = classifyChanges;

module.exports = {
  normalizePath,
  isDocsOnlyFile,
  isMigrationsOnlyFile,
  requiresFullPrecommit,
  getStagedFiles,
  classifyChanges,
  classifyPrecommitLight,
};
