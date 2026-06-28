#!/usr/bin/env node
/**
 * Snapshots oversized features into featureBudgets.config.cjs baseline.
 *
 * Usage: node scripts/generate-feature-baseline.js [--write]
 * Without --write: prints proposed baseline to stdout.
 *
 * @relatedFiles
 * - featureBudgets.config.cjs
 * - scripts/feature-size-lib.js
 */

const fs = require('fs');
const path = require('path');
const {
  loadConfig,
  discoverFeatureRoots,
  collectFeatureStats,
  buildBaselineFromOversized,
} = require('./feature-size-lib');

function main() {
  const write = process.argv.includes('--write');
  const cwd = process.cwd();
  const config = loadConfig(cwd);
  const stats = discoverFeatureRoots(cwd).map((key) => collectFeatureStats(key, cwd));
  const baseline = buildBaselineFromOversized(stats, config);

  if (!write) {
    console.log(JSON.stringify({ baseline }, null, 2));
    return;
  }

  const configPath = path.join(cwd, 'featureBudgets.config.cjs');
  const content = fs.readFileSync(configPath, 'utf8');
  const baselineJson = JSON.stringify(baseline, null, 2).replace(/\n/g, '\n  ');

  const updated = content.replace(
    /baseline:\s*\{[\s\S]*?\},/,
    `baseline: ${baselineJson.trim()},`,
  );

  if (updated === content) {
    console.error('Could not update baseline block in featureBudgets.config.cjs');
    process.exit(1);
  }

  fs.writeFileSync(configPath, updated, 'utf8');
  console.log(`✅ Wrote baseline for ${Object.keys(baseline).length} feature(s) to featureBudgets.config.cjs`);
}

main();
