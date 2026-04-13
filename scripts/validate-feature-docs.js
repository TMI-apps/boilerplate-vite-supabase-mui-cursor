#!/usr/bin/env node
/**
 * Full-repository validation: every discovered feature root under src/features/
 * must have a README.md. Optional --strict enforces minimum ## headings.
 *
 * @relatedFiles
 * - scripts/feature-readme-lib.js
 * - scripts/validate-feature-docs-staged.js
 */

const {
  discoverFeatureRoots,
  featureReadmeExists,
  validateReadmeStrictSections,
} = require("./feature-readme-lib.js");

function parseArgs(argv) {
  return {
    strict: argv.includes("--strict"),
    json: argv.includes("--format=json") || argv.includes("--json"),
    verbose: argv.includes("--verbose"),
  };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const cwd = process.cwd();
  const t0 = Date.now();

  const roots = discoverFeatureRoots(cwd);
  const missingReadme = [];
  const strictViolations = [];

  for (const featureRoot of roots) {
    if (!featureReadmeExists(featureRoot, cwd)) {
      missingReadme.push(featureRoot);
      continue;
    }
    if (args.strict) {
      const result = validateReadmeStrictSections(featureRoot, cwd);
      if (!result.ok) {
        strictViolations.push({
          featureRoot,
          readmePath: result.readmePath,
          missingHeadings: result.missingHeadings,
        });
      }
    }
  }

  const elapsedMs = Date.now() - t0;
  const success = missingReadme.length === 0 && strictViolations.length === 0;

  if (args.json) {
    console.log(
      JSON.stringify(
        {
          success,
          featureRoots: roots,
          missingReadme,
          strictViolations,
          elapsedMs,
        },
        null,
        2,
      ),
    );
    process.exit(success ? 0 : 1);
  }

  if (args.verbose) {
    console.error(`validate-feature-docs: ${roots.length} feature root(s) in ${elapsedMs}ms`);
  }
  if (success) {
    console.log("✅ Feature README validation passed.\n");
    process.exit(0);
  }

  console.error("❌ Feature README validation failed.\n");

  if (missingReadme.length > 0) {
    console.error("Missing README.md:");
    for (const r of missingReadme) {
      console.error(`  - ${r}/README.md`);
    }
    console.error("");
  }

  if (strictViolations.length > 0) {
    console.error("Strict mode: missing required ## headings (Purpose, Structure, Dependencies):");
    for (const v of strictViolations) {
      console.error(`  - ${v.featureRoot} (${v.readmePath})`);
      console.error(`    missing: ${v.missingHeadings.join(", ")}`);
    }
    console.error("");
  }

  console.error("Fix: add or update src/features/<name>/README.md per project rules.");
  process.exit(1);
}

main();
