#!/usr/bin/env node
/**
 * Validates src/config/git-workflow.json — mode enum SSOT for Model A / Model B.
 * Exit 0 if valid, 1 otherwise.
 */

const fs = require('fs');
const path = require('path');

const ALLOWED_MODES = new Set(['model-a', 'model-b']);

/**
 * @param {string} [rootDir]
 * @returns {{ok: true, mode: string} | {ok: false, error: string}}
 */
function validateGitWorkflow(rootDir = path.resolve(__dirname, '..')) {
  const configPath = path.join(rootDir, 'src', 'config', 'git-workflow.json');

  if (!fs.existsSync(configPath)) {
    return {ok: false, error: `Missing ${path.relative(rootDir, configPath)}`};
  }

  let raw;
  try {
    raw = fs.readFileSync(configPath, 'utf8');
  } catch (err) {
    return {ok: false, error: `Cannot read config: ${err.message}`};
  }

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    return {ok: false, error: `Invalid JSON: ${err.message}`};
  }

  if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return {ok: false, error: 'Config must be a JSON object'};
  }

  if (!Object.prototype.hasOwnProperty.call(parsed, 'mode')) {
    return {ok: false, error: 'Missing required key "mode"'};
  }

  const {mode} = parsed;
  if (typeof mode !== 'string' || !ALLOWED_MODES.has(mode)) {
    return {
      ok: false,
      error: `Invalid mode ${JSON.stringify(mode)}; allowed: model-a | model-b`,
    };
  }

  return {ok: true, mode};
}

function main() {
  const result = validateGitWorkflow();
  if (!result.ok) {
    console.error(`validate-git-workflow: ${result.error}`);
    process.exit(1);
  }
  console.log(`validate-git-workflow: OK (mode=${result.mode})`);
  process.exit(0);
}

if (require.main === module) {
  main();
}

module.exports = {validateGitWorkflow, ALLOWED_MODES};
