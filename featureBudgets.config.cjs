/**
 * Feature size budgets — SSOT for anti-monolith enforcement.
 *
 * @relatedFiles
 * - scripts/validate-feature-size.js
 * - scripts/generate-feature-baseline.js
 * - .cursor/rules/architecture/RULE.md § Feature granularity
 */
/** @type {import('./scripts/feature-size-lib').FeatureBudgetsConfig} */
module.exports = {
  defaults: {
    maxFilesPerLayer: 10,
    maxFilesPerFeature: 25,
  },
  /** Per-feature waivers — `reason` is required (non-empty). */
  overrides: {},
  /**
   * Grandfathered snapshots for features that exceeded defaults at baseline time.
   * Regenerate: pnpm validate:feature-size:baseline
   * New files in a baseline feature fail once counts exceed the snapshot.
   */
  baseline: {
    auth: {
      totalFiles: 28,
      layers: {
        components: 5,
        hooks: 13,
        services: 8,
        types: 2,
      },
    },
  },
};
