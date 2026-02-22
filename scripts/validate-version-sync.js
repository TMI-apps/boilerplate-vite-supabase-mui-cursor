#!/usr/bin/env node
/**
 * Validates that package.json version matches the latest release entry in CHANGELOG.md.
 * Used by CI to enforce version/changelog consistency.
 *
 * Exit 0 if consistent, 1 if mismatch.
 */

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const pkgPath = path.join(root, "package.json");
const changelogPath = path.join(root, "CHANGELOG.md");

function getPackageVersion() {
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  return pkg.version;
}

function getLatestChangelogVersion() {
  const content = fs.readFileSync(changelogPath, "utf8");
  const match = content.match(/^## \[(\d+\.\d+\.\d+)\]/m);
  if (!match) {
    return null;
  }
  return match[1];
}

function main() {
  const pkgVersion = getPackageVersion();
  const changelogVersion = getLatestChangelogVersion();

  if (!changelogVersion) {
    console.error("validate-version-sync: No version block found in CHANGELOG.md");
    process.exit(1);
  }

  if (pkgVersion !== changelogVersion) {
    console.error(
      `validate-version-sync: Version mismatch - package.json has "${pkgVersion}" but CHANGELOG.md latest is "[${changelogVersion}]"`
    );
    process.exit(1);
  }

  console.log(`validate-version-sync: OK (${pkgVersion})`);
  process.exit(0);
}

main();
