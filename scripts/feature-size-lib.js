/**
 * Shared logic for feature size / granularity validation.
 *
 * @relatedFiles
 * - featureBudgets.config.cjs
 * - scripts/validate-feature-size.js
 * - scripts/generate-feature-baseline.js
 */

const fs = require('fs');
const path = require('path');

const FEATURES_ROOT = 'src/features';
const LAYER_DIRS = ['components', 'hooks', 'services', 'types', 'context', 'store', 'api'];
const SOURCE_FILE_PATTERN = /\.(ts|tsx)$/;

/**
 * @typedef {Object} FeatureBudgetsConfig
 * @property {{ maxFilesPerLayer: number, maxFilesPerFeature: number }} defaults
 * @property {Record<string, { maxFilesPerLayer?: number, maxFilesPerFeature?: number, reason: string }>} overrides
 * @property {Record<string, { totalFiles: number, layers: Record<string, number> }>} baseline
 */

/**
 * @typedef {Object} FeatureStats
 * @property {string} featureKey
 * @property {number} totalFiles
 * @property {Record<string, number>} layers
 */

/**
 * @typedef {Object} FeatureSizeViolation
 * @property {string} featureKey
 * @property {'layer' | 'feature' | 'config'} kind
 * @property {string} message
 * @property {string} expected
 * @property {string} [layer]
 * @property {number} [actual]
 * @property {number} [limit]
 */

/**
 * @param {string} [cwd]
 * @returns {FeatureBudgetsConfig}
 */
function loadConfig(cwd = process.cwd()) {
  const configPath = path.join(cwd, 'featureBudgets.config.cjs');
  // eslint-disable-next-line import/no-dynamic-require, global-require
  return require(configPath);
}

/**
 * @param {string} dir
 * @returns {number}
 */
function countSourceFilesInDir(dir) {
  if (!fs.existsSync(dir)) {
    return 0;
  }

  let count = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      count += countSourceFilesInDir(fullPath);
    } else if (SOURCE_FILE_PATTERN.test(entry.name)) {
      count += 1;
    }
  }
  return count;
}

/**
 * @param {string} [cwd]
 * @returns {string[]}
 */
function discoverFeatureRoots(cwd = process.cwd()) {
  const featuresRoot = path.join(cwd, FEATURES_ROOT);
  /** @type {string[]} */
  const features = [];

  /**
   * @param {string} relativePath
   */
  function walk(relativePath) {
    const fullPath = path.join(featuresRoot, relativePath);
    if (!fs.existsSync(fullPath)) {
      return;
    }

    const entries = fs.readdirSync(fullPath, { withFileTypes: true });
    const hasLayerDir = entries.some(
      (entry) => entry.isDirectory() && LAYER_DIRS.includes(entry.name),
    );

    if (hasLayerDir) {
      features.push(relativePath.replace(/\\/g, '/'));
      return;
    }

    for (const entry of entries) {
      if (!entry.isDirectory() || entry.name === 'docs') {
        continue;
      }
      const nextRelative = relativePath ? `${relativePath}/${entry.name}` : entry.name;
      walk(nextRelative);
    }
  }

  walk('');
  return features.sort();
}

/**
 * @param {string} featureKey
 * @param {string} [cwd]
 * @returns {FeatureStats}
 */
function collectFeatureStats(featureKey, cwd = process.cwd()) {
  const featureRoot = path.join(cwd, FEATURES_ROOT, featureKey);
  /** @type {Record<string, number>} */
  const layers = {};

  for (const layer of LAYER_DIRS) {
    const layerPath = path.join(featureRoot, layer);
    const count = countSourceFilesInDir(layerPath);
    if (count > 0) {
      layers[layer] = count;
    }
  }

  const rootFiles = fs.existsSync(featureRoot)
    ? fs.readdirSync(featureRoot, { withFileTypes: true })
    : [];
  let rootSourceCount = 0;
  for (const entry of rootFiles) {
    if (entry.isFile() && SOURCE_FILE_PATTERN.test(entry.name)) {
      rootSourceCount += 1;
    }
  }

  const layerTotal = Object.values(layers).reduce((sum, n) => sum + n, 0);
  const totalFiles = layerTotal + rootSourceCount;

  return { featureKey, totalFiles, layers };
}

/**
 * @param {FeatureBudgetsConfig} config
 * @returns {FeatureSizeViolation[]}
 */
function validateConfigShape(config) {
  /** @type {FeatureSizeViolation[]} */
  const violations = [];

  if (
    !config.defaults ||
    typeof config.defaults.maxFilesPerLayer !== 'number' ||
    typeof config.defaults.maxFilesPerFeature !== 'number'
  ) {
    violations.push({
      featureKey: '(config)',
      kind: 'config',
      message: 'featureBudgets.config.cjs defaults must define maxFilesPerLayer and maxFilesPerFeature',
      expected: 'defaults: { maxFilesPerLayer: number, maxFilesPerFeature: number }',
    });
  }

  for (const [featureKey, override] of Object.entries(config.overrides || {})) {
    if (!override?.reason || String(override.reason).trim().length === 0) {
      violations.push({
        featureKey,
        kind: 'config',
        message: `Override for "${featureKey}" missing required non-empty "reason"`,
        expected: 'Add reason documenting why this feature exceeds default budgets',
      });
    }
  }

  return violations;
}

/**
 * @param {string} featureKey
 * @param {FeatureBudgetsConfig} config
 * @returns {{ maxFeature: number, layerLimitFor: (layer: string) => number }}
 */
function getEffectiveLimits(featureKey, config) {
  const override = config.overrides?.[featureKey];
  const snapshot = config.baseline?.[featureKey];

  let maxFeature = override?.maxFilesPerFeature ?? config.defaults.maxFilesPerFeature;
  const baseLayerLimit = override?.maxFilesPerLayer ?? config.defaults.maxFilesPerLayer;

  if (snapshot) {
    maxFeature = Math.max(maxFeature, snapshot.totalFiles);
  }

  /**
   * @param {string} layer
   * @returns {number}
   */
  function layerLimitFor(layer) {
    let limit = baseLayerLimit;
    if (snapshot?.layers[layer] != null) {
      limit = Math.max(limit, snapshot.layers[layer]);
    }
    return limit;
  }

  return { maxFeature, layerLimitFor };
}

/**
 * @param {string} featureKey
 * @param {FeatureStats} stats
 * @param {FeatureBudgetsConfig} config
 * @returns {FeatureSizeViolation[]}
 */
function validateFeatureStats(featureKey, stats, config) {
  /** @type {FeatureSizeViolation[]} */
  const violations = [];
  const { maxFeature, layerLimitFor } = getEffectiveLimits(featureKey, config);

  if (stats.totalFiles > maxFeature) {
    violations.push({
      featureKey,
      kind: 'feature',
      actual: stats.totalFiles,
      limit: maxFeature,
      message: `Feature "${featureKey}" has ${stats.totalFiles} source files (limit ${maxFeature})`,
      expected:
        'Split into multiple bounded features (one domain concept each) or add a justified override in featureBudgets.config.cjs',
    });
  }

  for (const [layer, count] of Object.entries(stats.layers)) {
    const layerLimit = layerLimitFor(layer);
    if (count > layerLimit) {
      violations.push({
        featureKey,
        kind: 'layer',
        layer,
        actual: count,
        limit: layerLimit,
        message: `Feature "${featureKey}" layer "${layer}" has ${count} files (limit ${layerLimit})`,
        expected: `Split "${layer}" into sub-features or add a justified override in featureBudgets.config.cjs`,
      });
    }
  }

  return violations;
}

/**
 * @param {Object} [options]
 * @param {string[]} [options.featureKeys] - validate only these features
 * @param {string} [options.cwd]
 * @returns {{ success: boolean, violations: FeatureSizeViolation[], stats: FeatureStats[] }}
 */
function validateFeatureSizes(options = {}) {
  const cwd = options.cwd || process.cwd();
  const config = loadConfig(cwd);
  const configViolations = validateConfigShape(config);

  const allFeatures = discoverFeatureRoots(cwd);
  const targetFeatures =
    options.featureKeys && options.featureKeys.length > 0
      ? options.featureKeys.filter((key) => allFeatures.includes(key))
      : allFeatures;

  /** @type {FeatureStats[]} */
  const stats = targetFeatures.map((key) => collectFeatureStats(key, cwd));
  /** @type {FeatureSizeViolation[]} */
  const violations = [...configViolations];

  for (const featureStats of stats) {
    violations.push(...validateFeatureStats(featureStats.featureKey, featureStats, config));
  }

  return {
    success: violations.length === 0,
    violations,
    stats,
  };
}

/**
 * @param {string} filePath - repo-relative path
 * @returns {string | null}
 */
function featureKeyFromFilePath(filePath) {
  const normalized = filePath.replace(/\\/g, '/');
  const match = normalized.match(/^src\/features\/([^/]+(?:\/[^/]+)?)\//);
  if (!match) {
    return null;
  }

  const candidate = match[1];
  const cwd = process.cwd();
  const allFeatures = discoverFeatureRoots(cwd);

  if (allFeatures.includes(candidate)) {
    return candidate;
  }

  const topLevel = candidate.split('/')[0];
  if (allFeatures.includes(topLevel)) {
    return topLevel;
  }

  return null;
}

/**
 * @param {FeatureStats[]} stats
 * @param {FeatureBudgetsConfig} config
 * @returns {Record<string, { totalFiles: number, layers: Record<string, number> }>}
 */
function buildBaselineFromOversized(stats, config) {
  /** @type {Record<string, { totalFiles: number, layers: Record<string, number> }>} */
  const baseline = {};

  for (const featureStats of stats) {
    const violations = validateFeatureStats(featureStats.featureKey, featureStats, {
      ...config,
      baseline: {},
    });
    if (violations.length > 0) {
      baseline[featureStats.featureKey] = {
        totalFiles: featureStats.totalFiles,
        layers: { ...featureStats.layers },
      };
    }
  }

  return baseline;
}

/**
 * @param {FeatureSizeViolation[]} violations
 * @param {'human' | 'json'} format
 */
function printViolations(violations, format) {
  if (format === 'json') {
    console.log(JSON.stringify({ violations, count: violations.length }, null, 2));
    return;
  }

  console.error('❌ Feature size / granularity violations\n');
  console.error(`Found ${violations.length} violation(s):\n`);

  for (const violation of violations) {
    console.error(`Feature: ${violation.featureKey}`);
    if (violation.layer) {
      console.error(`Layer: ${violation.layer}`);
    }
    console.error(`Issue: ${violation.message}`);
    console.error(`Expected: ${violation.expected}`);
    console.error('');
  }

  console.error('Suggested fixes:');
  console.error('1. Split the feature into multiple bounded domains (e.g. world, combat, inventory)');
  console.error('2. Move cross-cutting code to src/shared/');
  console.error('3. Add a per-feature override with a non-empty reason in featureBudgets.config.cjs');
  console.error('4. Regenerate baseline after intentional grandfathering: pnpm validate:feature-size:baseline\n');
}

module.exports = {
  FEATURES_ROOT,
  LAYER_DIRS,
  loadConfig,
  discoverFeatureRoots,
  collectFeatureStats,
  validateConfigShape,
  validateFeatureStats,
  validateFeatureSizes,
  featureKeyFromFilePath,
  buildBaselineFromOversized,
  printViolations,
};
