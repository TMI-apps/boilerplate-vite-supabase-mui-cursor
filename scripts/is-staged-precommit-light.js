#!/usr/bin/env node
/**
 * Exit 0 when pre-commit can skip type-check, structure, and arch validation.
 * Light paths: docs-only, migrations-only, or no app TS surface (no-src).
 * @see scripts/change-classify.cjs
 */

const {
  getStagedFiles,
  classifyChanges,
} = require('./change-classify.cjs');

const staged = getStagedFiles();
const {light, kind} = classifyChanges(staged);

if (process.argv.includes('--echo-kind')) {
  if (light && kind) {
    process.stdout.write(kind);
    process.exit(0);
  }
  process.exit(1);
}

process.exit(light ? 0 : 1);
