#!/usr/bin/env node
/**
 * Validate file references inside .cursor/rules and .cursor/skills markdown files.
 *
 * Goal:
 * Catch stale references early (e.g. deleted docs still referenced by rules/commands/skills).
 *
 * Parsing notes:
 * - Strips ``` fenced blocks first so diagram/ASCII fences do not break inline `...` pairing.
 * - Resets the global regex lastIndex per file; skips multi-line backtick spans (invalid path refs).
 */

const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const TARGET_DIRS = [
  path.join(".cursor", "rules"),
  path.join(".cursor", "skills"),
];

const CODE_REF_REGEX = /`([^`]+)`/g;

/**
 * Remove fenced code blocks (``` ... ```) before scanning inline backticks.
 * Prevents spurious multi-line `...` spans from diagram/ASCII blocks pairing
 * with later prose backticks and hiding real repo-path references.
 */
function stripMarkdownFencedCodeBlocks(content) {
  return content.replace(/```[\s\S]*?```/g, "\n");
}

const ALLOWED_MISSING = new Set([
  "architecture.md",
  "documentation/PROJECT-STRUCTURE-VALIDATION.md",
]);

function toPosix(inputPath) {
  return inputPath.replace(/\\/g, "/");
}

function collectMarkdownFiles(dirPath, output) {
  if (!fs.existsSync(dirPath)) {
    return;
  }
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      collectMarkdownFiles(fullPath, output);
      continue;
    }
    if (entry.isFile() && entry.name.endsWith(".md")) {
      output.push(fullPath);
    }
  }
}

function isPlaceholderOrPattern(value) {
  return /[*<>\[\]{}|]/.test(value);
}

function isExplicitRootFile(value) {
  return [
    "README.md",
    "CHANGELOG.md",
    "ARCHITECTURE.md",
    "architecture.md",
    "package.json",
    "projectStructure.config.cjs",
    ".dependency-cruiser.cjs",
  ].includes(value);
}

function looksLikeRepoPath(value) {
  if (!value || value.includes(" ")) {
    return false;
  }
  if (value === "@" || value.startsWith("@/")) {
    return false;
  }
  if (value.startsWith("http://") || value.startsWith("https://")) {
    return false;
  }
  if (isPlaceholderOrPattern(value)) {
    return false;
  }
  if (isExplicitRootFile(value)) {
    return true;
  }

  const rootPrefixes = [
    ".cursor/",
    "src/",
    "documentation/",
    "scripts/",
    "supabase/",
    "cloud-functions/",
    "migrations/",
    "public/",
    "tests/",
  ];
  const allowedRefExt = /\.(md|cjs|js|json|yml|yaml|toml)$/i;
  if (rootPrefixes.some((prefix) => value.startsWith(prefix))) {
    return allowedRefExt.test(value);
  }

  // Allow shorthand intra-rules references like architecture/RULE.md
  if (/^[a-z0-9-]+\/RULE\.md$/i.test(value)) {
    return true;
  }

  return false;
}

function resolveCandidatePath(refPath, sourceFilePath) {
  // Shorthand rule ref like architecture/RULE.md or cloud-functions/RULE.md
  if (/^[a-z0-9-]+\/RULE\.md$/i.test(refPath)) {
    const posix = toPosix(sourceFilePath);
    const inRules = posix.includes("/.cursor/rules/");
    const inSkills = posix.includes("/.cursor/skills/");
    if (inRules || inSkills) {
      return path.join(ROOT, ".cursor", "rules", refPath);
    }
  }

  if (isExplicitRootFile(refPath)) {
    return path.join(ROOT, refPath);
  }
  if (refPath.startsWith(".cursor/") || refPath.startsWith("src/") || refPath.startsWith("documentation/")) {
    return path.join(ROOT, refPath);
  }
  if (refPath.startsWith("scripts/") || refPath.startsWith("supabase/") || refPath.startsWith("cloud-functions/")) {
    return path.join(ROOT, refPath);
  }
  if (refPath.startsWith("migrations/") || refPath.startsWith("public/") || refPath.startsWith("tests/")) {
    return path.join(ROOT, refPath);
  }

  return path.join(ROOT, refPath);
}

function validateFile(filePath) {
  const relFile = toPosix(path.relative(ROOT, filePath));
  const content = fs.readFileSync(filePath, "utf8");
  const scanContent = stripMarkdownFencedCodeBlocks(content);
  const issues = [];

  CODE_REF_REGEX.lastIndex = 0;
  let match;
  while ((match = CODE_REF_REGEX.exec(scanContent)) !== null) {
    const raw = (match[1] || "").trim();
    // Repo paths in references are always single-line; skip broken pairings.
    if (raw.includes("\n")) {
      continue;
    }
    if (!looksLikeRepoPath(raw)) {
      continue;
    }

    const normalized = toPosix(raw.replace(/^\.\//, "").replace(/\/+$/, ""));
    if (!normalized) {
      continue;
    }
    if (ALLOWED_MISSING.has(normalized)) {
      continue;
    }

    const absolute = resolveCandidatePath(normalized, filePath);
    if (!fs.existsSync(absolute)) {
      issues.push({
        file: relFile,
        ref: normalized,
      });
    }
  }

  return issues;
}

function main() {
  const files = [];
  for (const relDir of TARGET_DIRS) {
    collectMarkdownFiles(path.join(ROOT, relDir), files);
  }

  const allIssues = [];
  for (const filePath of files) {
    allIssues.push(...validateFile(filePath));
  }

  if (allIssues.length === 0) {
    console.log("✅ Cursor docs reference validation passed.");
    process.exit(0);
  }

  console.error("❌ Cursor docs reference validation failed.\n");
  for (const issue of allIssues) {
    console.error(`- ${issue.file} references missing path: ${issue.ref}`);
  }
  console.error("\nUpdate or remove stale references.");
  process.exit(1);
}

main();
