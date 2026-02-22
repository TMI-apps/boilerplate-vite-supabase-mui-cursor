#!/usr/bin/env node
/**
 * Validate local markdown links in docs/rules/commands.
 *
 * Scope:
 * - documentation markdown files
 * - src/features README and docs markdown files
 * - .cursor/rules markdown files
 * - .cursor/commands markdown files
 *
 * Checks only relative links:
 * - [label](./path)
 * - [label](../path)
 * - [label](path)
 *
 * Ignores:
 * - http(s) links
 * - anchors (#section)
 * - mailto links
 */

const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();

const SEARCH_DIRS = [
  "documentation",
  path.join("src", "features"),
  path.join(".cursor", "rules"),
  path.join(".cursor", "commands"),
];

const MARKDOWN_EXT = ".md";
const LINK_REGEX = /\[[^\]]*]\(([^)]+)\)/g;

function toPosix(inputPath) {
  return inputPath.replace(/\\/g, "/");
}

function existsAsFileOrDirectory(targetPath) {
  return fs.existsSync(targetPath);
}

function stripHashAndQuery(linkTarget) {
  const noHash = linkTarget.split("#")[0];
  return noHash.split("?")[0];
}

function shouldIgnoreLink(linkTarget) {
  return (
    !linkTarget ||
    linkTarget.startsWith("http://") ||
    linkTarget.startsWith("https://") ||
    linkTarget.startsWith("#") ||
    linkTarget.startsWith("mailto:")
  );
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
    if (!entry.isFile()) {
      continue;
    }
    if (entry.name.endsWith(MARKDOWN_EXT)) {
      output.push(fullPath);
    }
  }
}

function shouldValidateFile(filePath) {
  const posix = toPosix(path.relative(ROOT, filePath));
  if (posix.startsWith("src/features/")) {
    return posix.endsWith("/README.md") || posix.includes("/docs/");
  }
  return true;
}

function validateFileLinks(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const issues = [];
  const fileDir = path.dirname(filePath);
  const relFile = toPosix(path.relative(ROOT, filePath));

  let match;
  while ((match = LINK_REGEX.exec(content)) !== null) {
    const rawTarget = (match[1] || "").trim();
    if (shouldIgnoreLink(rawTarget)) {
      continue;
    }
    const cleanTarget = stripHashAndQuery(rawTarget);
    if (!cleanTarget) {
      continue;
    }

    // Absolute-like site paths are out of scope for local file checks.
    if (cleanTarget.startsWith("/")) {
      continue;
    }

    const resolved = path.resolve(fileDir, cleanTarget);
    if (!existsAsFileOrDirectory(resolved)) {
      issues.push({
        file: relFile,
        target: cleanTarget,
      });
    }
  }

  return issues;
}

function main() {
  const markdownFiles = [];
  for (const relDir of SEARCH_DIRS) {
    collectMarkdownFiles(path.join(ROOT, relDir), markdownFiles);
  }

  const filesToCheck = markdownFiles.filter(shouldValidateFile);
  const allIssues = [];
  for (const filePath of filesToCheck) {
    allIssues.push(...validateFileLinks(filePath));
  }

  if (allIssues.length === 0) {
    console.log("✅ Markdown link validation passed.");
    process.exit(0);
  }

  console.error("❌ Markdown link validation failed.\n");
  for (const issue of allIssues) {
    console.error(`- ${issue.file} -> ${issue.target}`);
  }
  console.error("\nFix broken relative links before committing.");
  process.exit(1);
}

main();
