#!/usr/bin/env node
/**
 * Shared helpers for feature-local README enforcement (Option 1).
 * SSOT for: flat vs nested feature roots under src/features/.
 *
 * @relatedFiles
 * - scripts/validate-feature-docs.js
 * - scripts/validate-feature-docs-staged.js
 */

const fs = require("fs");
const path = require("path");

/** Segment names that indicate code/docs layers directly under a feature root. */
const FEATURE_LAYER_FOLDERS = new Set([
  "api",
  "components",
  "context",
  "docs",
  "hooks",
  "services",
  "store",
  "types",
]);

function normalizePath(filePath) {
  return filePath.replace(/\\/g, "/");
}

/**
 * True if `segment` looks like a file placed directly under `src/features/<name>/`
 * (e.g. index.ts, types.ts), not a nested feature folder name.
 */
function isFileLikeFeatureChild(segment) {
  if (segment === "README.md") {
    return true;
  }
  // Avoid treating real directories like `my.feature` as files — require common code extensions
  return /\.(ts|tsx|js|jsx|mjs|cjs)$/i.test(segment);
}

/**
 * Given a repo-relative path, return the feature root directory (e.g. src/features/auth)
 * or null if not under a feature.
 *
 * Supports:
 * - Flat: src/features/<feature>/<layer>/...
 * - Nested: src/features/<group>/<feature>/...
 */
function getFeatureRootFromRelativePath(relativePath) {
  const normalized = normalizePath(relativePath);
  if (!normalized.startsWith("src/features/")) {
    return null;
  }

  const parts = normalized.split("/").filter(Boolean);
  // ["src", "features", ...]
  if (parts.length < 4) {
    return null;
  }

  const first = parts[2];
  const second = parts[3];

  if (FEATURE_LAYER_FOLDERS.has(second) || second === "README.md") {
    return `src/features/${first}`;
  }

  // File directly under flat feature (e.g. src/features/chat/index.ts)
  if (isFileLikeFeatureChild(second)) {
    return `src/features/${first}`;
  }

  return `src/features/${first}/${second}`;
}

/**
 * Recursively collect file paths under dir (files only).
 * @param {string} dirAbsolute
 * @param {(rel: string) => void} onFile - repo-relative with forward slashes
 * @param {string} cwd
 */
function walkFiles(dirAbsolute, cwd, onFile) {
  let entries;
  try {
    entries = fs.readdirSync(dirAbsolute, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const full = path.join(dirAbsolute, entry.name);
    if (entry.isDirectory()) {
      walkFiles(full, cwd, onFile);
    } else if (entry.isFile()) {
      const rel = normalizePath(path.relative(cwd, full));
      onFile(rel);
    }
  }
}

/**
 * Discover all feature roots that have at least one file under them.
 * @param {string} cwd
 * @returns {string[]}
 */
function discoverFeatureRoots(cwd) {
  const featuresDir = path.join(cwd, "src", "features");
  if (!fs.existsSync(featuresDir)) {
    return [];
  }

  const roots = new Set();

  walkFiles(featuresDir, cwd, (rel) => {
    const root = getFeatureRootFromRelativePath(rel);
    if (root) {
      roots.add(root);
    }
  });

  return [...roots].sort();
}

/**
 * @param {string} featureRoot - e.g. src/features/auth
 * @param {string} cwd
 * @returns {boolean}
 */
function featureReadmeExists(featureRoot, cwd) {
  const readme = path.join(cwd, featureRoot, "README.md");
  return fs.existsSync(readme);
}

/** Required ## headings for strict mode (case-insensitive match on title text). */
const STRICT_REQUIRED_HEADINGS = ["purpose", "structure", "dependencies"];

/**
 * @param {string} featureRoot
 * @param {string} cwd
 * @returns {{ ok: boolean, missingHeadings: string[], readmePath: string }}
 */
function validateReadmeStrictSections(featureRoot, cwd) {
  const readmePath = path.join(cwd, featureRoot, "README.md");
  if (!fs.existsSync(readmePath)) {
    return {
      ok: false,
      missingHeadings: [...STRICT_REQUIRED_HEADINGS],
      readmePath: normalizePath(path.relative(cwd, readmePath)),
    };
  }

  const content = fs.readFileSync(readmePath, "utf8");
  /** @type {Set<string>} */
  const h2Titles = new Set();
  const h2Regex = /^##\s+(.+)$/gm;
  let match;
  while ((match = h2Regex.exec(content)) !== null) {
    const title = match[1].trim().toLowerCase();
    h2Titles.add(title);
  }

  const missingHeadings = [];
  for (const required of STRICT_REQUIRED_HEADINGS) {
    const found = [...h2Titles].some(
      (t) => t === required || t.startsWith(`${required} `) || t.startsWith(`${required}:`),
    );
    if (!found) {
      missingHeadings.push(required);
    }
  }

  return {
    ok: missingHeadings.length === 0,
    missingHeadings,
    readmePath: normalizePath(path.relative(cwd, readmePath)),
  };
}

module.exports = {
  FEATURE_LAYER_FOLDERS,
  normalizePath,
  getFeatureRootFromRelativePath,
  discoverFeatureRoots,
  featureReadmeExists,
  validateReadmeStrictSections,
  STRICT_REQUIRED_HEADINGS,
};
