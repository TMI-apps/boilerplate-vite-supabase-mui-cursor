#!/usr/bin/env node
/**
 * Enforces feature-local documentation freshness.
 *
 * Rule:
 * - If staged changes include non-doc files inside src/features/<feature>/...
 * - Then src/features/<feature>/README.md must also be staged.
 *
 * Supports both:
 * - Flat features: src/features/<feature>/
 * - Nested features: src/features/<group>/<feature>/
 */

const { execSync } = require("child_process");

const FEATURE_LAYER_FOLDERS = new Set([
  "components",
  "hooks",
  "services",
  "types",
  "context",
  "store",
  "docs",
]);

function normalizePath(filePath) {
  return filePath.replace(/\\/g, "/");
}

function getFeatureRoot(filePath) {
  const normalized = normalizePath(filePath);
  if (!normalized.startsWith("src/features/")) {
    return null;
  }

  const parts = normalized.split("/");
  // ["src", "features", ...]
  if (parts.length < 4) {
    return null;
  }

  const first = parts[2];
  const second = parts[3];

  // Flat feature: src/features/<feature>/<layer-or-file>
  if (FEATURE_LAYER_FOLDERS.has(second) || second === "README.md") {
    return `src/features/${first}`;
  }

  // Nested feature: src/features/<group>/<feature>/...
  return `src/features/${first}/${second}`;
}

function isDocOnlyChange(filePath, featureRoot) {
  const normalized = normalizePath(filePath);
  if (normalized === `${featureRoot}/README.md`) {
    return true;
  }
  if (normalized.startsWith(`${featureRoot}/docs/`)) {
    return true;
  }
  return normalized.endsWith(".md");
}

function getStagedFiles() {
  const output = execSync("git diff --cached --name-only --diff-filter=ACMR", {
    encoding: "utf8",
    stdio: ["pipe", "pipe", "pipe"],
  });

  return output
    .trim()
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map(normalizePath);
}

function main() {
  let stagedFiles;
  try {
    stagedFiles = getStagedFiles();
  } catch (error) {
    console.error("Failed to read staged files from git.");
    process.exit(error.status || 1);
  }

  if (stagedFiles.length === 0) {
    process.exit(0);
  }

  const stagedSet = new Set(stagedFiles);
  const featureChanges = new Map();

  for (const filePath of stagedFiles) {
    const featureRoot = getFeatureRoot(filePath);
    if (!featureRoot) {
      continue;
    }

    if (!featureChanges.has(featureRoot)) {
      featureChanges.set(featureRoot, []);
    }
    featureChanges.get(featureRoot).push(filePath);
  }

  if (featureChanges.size === 0) {
    process.exit(0);
  }

  const violations = [];

  for (const [featureRoot, files] of featureChanges.entries()) {
    const hasCodeChanges = files.some((filePath) => !isDocOnlyChange(filePath, featureRoot));
    if (!hasCodeChanges) {
      continue;
    }

    const requiredReadme = `${featureRoot}/README.md`;
    if (!stagedSet.has(requiredReadme)) {
      violations.push({
        featureRoot,
        requiredReadme,
        files,
      });
    }
  }

  if (violations.length === 0) {
    process.exit(0);
  }

  console.error("❌ Feature documentation validation failed.\n");
  console.error("When feature code changes are staged, the feature README must also be staged.\n");

  for (const violation of violations) {
    console.error(`Feature: ${violation.featureRoot}`);
    console.error(`Required: ${violation.requiredReadme}`);
    console.error("Staged files:");
    violation.files.forEach((filePath) => console.error(`  - ${filePath}`));
    console.error("");
  }

  console.error("Fix:");
  console.error("1. Update the feature README with relevant behavior/API/flow changes.");
  console.error("2. Stage the README: git add <feature>/README.md");
  console.error("3. Commit again.\n");

  process.exit(1);
}

main();
