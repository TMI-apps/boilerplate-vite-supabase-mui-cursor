#!/usr/bin/env node
/**
 * Validates feature folder size against featureBudgets.config.cjs.
 *
 * @relatedFiles
 * - featureBudgets.config.cjs
 * - scripts/feature-size-lib.js
 * - scripts/validate-feature-size-staged.js
 */

const { validateFeatureSizes, printViolations } = require('./feature-size-lib');

if (require.main === module) {
  const args = process.argv.slice(2);
  const format = args.includes('--format=json') ? 'json' : 'human';
  const result = validateFeatureSizes();

  if (!result.success) {
    printViolations(result.violations, format);
    process.exit(1);
  }

  if (format === 'json') {
    console.log(JSON.stringify({ violations: [], count: 0, stats: result.stats }, null, 2));
  } else {
    console.log('✅ All feature size budgets are valid!\n');
  }

  process.exit(0);
}

module.exports = { validateFeatureSizes };
