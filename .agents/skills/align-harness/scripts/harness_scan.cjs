#!/usr/bin/env node
/* global process, Buffer */
// Node CJS, but outside the `scripts/` dir that eslint.ignores.js excludes.
/**
 * Light harness facts scanner (D13/D20).
 * Reads documentation/jobs/harness/entry-points.yaml.
 * Emits facts only — no verdicts. Fail soft on unknown shapes.
 */

const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const DEFAULT_MANIFEST = path.join("documentation", "jobs", "harness", "entry-points.yaml");

const LINK_REGEX = /\[[^\]]*]\(([^)]+)\)/g;
const FRONTMATTER_REGEX = /^---\r?\n([\s\S]*?)\r?\n---/;

/**
 * Path-shaped tokens are matched directly rather than via inline-backtick
 * pairs: a single stray backtick anywhere in a file skews every later pair
 * and silently hides real refs.
 */
const PATH_TOKEN_REGEX = /(?:\.cursor|\.agents|documentation|src)\/[A-Za-z0-9._<>[\]{}*@/-]+/g;
const RULE_SHORTHAND_REGEX = /\b[a-z0-9-]+\/RULE\.mdc\b/gi;
const RULE_SHORTHAND_EXACT = /^[a-z0-9-]+\/RULE\.mdc$/i;

/** Placeholders (`<name>`, `[feature]`) and globs are templates, not refs. */
const TEMPLATE_CHARS = /[<>[\]{}*?]/;

/** User-home Cursor artifacts — present on disk, but never repo-relative. */
const NON_REPO_PREFIXES = [".cursor/skills-cursor/", ".cursor/plugins/", ".cursor/cli-config.json"];

function stripFencedCodeBlocks(content) {
  return content.replace(/```[\s\S]*?```/g, "\n");
}

function extractRefs(content) {
  const refs = new Set();
  const add = (value) => {
    const cleaned = (value || "").trim().replace(/[.,;:!?)"'`]+$/, "");
    if (cleaned) {
      refs.add(cleaned);
    }
  };
  for (const regex of [PATH_TOKEN_REGEX, RULE_SHORTHAND_REGEX]) {
    regex.lastIndex = 0;
    let match;
    while ((match = regex.exec(content)) !== null) {
      add(match[0]);
    }
  }
  LINK_REGEX.lastIndex = 0;
  let link;
  while ((link = LINK_REGEX.exec(content)) !== null) {
    add((link[1] || "").split("#")[0]);
  }
  return refs;
}

function toPosix(inputPath) {
  return inputPath.replace(/\\/g, "/");
}

const DEFAULT_BUDGET_BYTES = 32768;
const LIST_SECTIONS = new Set(["roots", "domain_globs"]);

/** Returns the new section name, or null when the line is not a section header. */
function readSectionHeader(trimmed) {
  const header = trimmed.match(/^([a-z_]+):$/);
  return header && LIST_SECTIONS.has(header[1]) ? header[1] : null;
}

function applyManifestLine(trimmed, out, section) {
  const header = readSectionHeader(trimmed);
  if (header) {
    return header;
  }
  const budget = trimmed.match(/^always_on_budget_bytes:\s*(\d+)/);
  if (budget) {
    out.always_on_budget_bytes = Number(budget[1]);
    return section;
  }
  const item = trimmed.match(/^- (.+)$/);
  if (item && section) {
    out[section].push(item[1]);
  }
  return section;
}

function loadManifest(manifestPath) {
  const abs = path.isAbsolute(manifestPath) ? manifestPath : path.join(ROOT, manifestPath);
  const out = {
    roots: [],
    domain_globs: [],
    always_on_budget_bytes: DEFAULT_BUDGET_BYTES,
  };
  if (!fs.existsSync(abs)) {
    return out;
  }
  let section = null;
  for (const line of fs.readFileSync(abs, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      section = applyManifestLine(trimmed, out, section);
    }
  }
  return out;
}

function parseFrontmatter(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const match = content.match(FRONTMATTER_REGEX);
  if (!match) {
    return { ok: false, error: "missing frontmatter", alwaysApply: null };
  }
  const body = match[1];
  const always = body.match(/alwaysApply:\s*(true|false)/i);
  const desc = body.match(/description:\s*["']?([^"'\n]+)["']?/);
  return {
    ok: true,
    alwaysApply: always ? always[1].toLowerCase() === "true" : null,
    description: desc ? desc[1].trim() : null,
  };
}

function lineCount(filePath) {
  return fs.readFileSync(filePath, "utf8").split(/\r?\n/).length;
}

function collectRuleFiles() {
  const rulesDir = path.join(ROOT, ".cursor", "rules");
  const files = [];
  if (!fs.existsSync(rulesDir)) {
    return files;
  }
  for (const entry of fs.readdirSync(rulesDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) {
      continue;
    }
    const mdc = path.join(rulesDir, entry.name, "RULE.mdc");
    if (fs.existsSync(mdc)) {
      files.push(mdc);
    }
  }
  return files;
}

const REPO_PREFIXES = [".cursor/", ".agents/", "documentation/", "src/"];
const REJECT_PREFIXES = ["http://", "https://", ...NON_REPO_PREFIXES];

function looksLikeRepoPath(value) {
  if (!value || value.includes(" ") || TEMPLATE_CHARS.test(value)) {
    return false;
  }
  if (REJECT_PREFIXES.some((prefix) => value.startsWith(prefix))) {
    return false;
  }
  return (
    REPO_PREFIXES.some((prefix) => value.startsWith(prefix)) || RULE_SHORTHAND_EXACT.test(value)
  );
}

function resolveRef(ref, sourceFile) {
  const normalized = ref.replace(/^\.\//, "");
  if (/^[a-z0-9-]+\/RULE\.mdc$/i.test(normalized)) {
    return path.join(ROOT, ".cursor", "rules", normalized);
  }
  if (
    normalized.startsWith(".cursor/") ||
    normalized.startsWith(".agents/") ||
    normalized.startsWith("documentation/") ||
    normalized.startsWith("src/")
  ) {
    return path.join(ROOT, normalized);
  }
  return path.join(path.dirname(sourceFile), normalized);
}

function scanRefs(filePath) {
  const content = stripFencedCodeBlocks(fs.readFileSync(filePath, "utf8"));
  const missing = [];
  for (const raw of extractRefs(content)) {
    if (!looksLikeRepoPath(raw)) {
      continue;
    }
    // Directory refs resolve against the directory itself.
    const target = resolveRef(raw.replace(/\/$/, ""), filePath);
    if (!fs.existsSync(target)) {
      missing.push({ file: toPosix(path.relative(ROOT, filePath)), ref: raw });
    }
  }
  return missing;
}

function isReadableMarkdown(filePath) {
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    return false;
  }
  return [".md", ".mdc"].includes(path.extname(filePath).toLowerCase());
}

/** Existing files this document points at, as absolute paths. */
function linkedFiles(filePath) {
  const content = stripFencedCodeBlocks(fs.readFileSync(filePath, "utf8"));
  const out = [];
  for (const ref of extractRefs(content)) {
    const resolved = resolveRef(ref, filePath);
    if (fs.existsSync(resolved) && fs.statSync(resolved).isFile()) {
      out.push(resolved);
    }
  }
  return out;
}

function walkFromRoots(roots) {
  const visited = new Set();
  const queue = roots.map((rel) => path.join(ROOT, rel)).filter((abs) => fs.existsSync(abs));
  while (queue.length > 0) {
    const current = queue.shift();
    const key = toPosix(path.relative(ROOT, current));
    if (visited.has(key)) {
      continue;
    }
    visited.add(key);
    if (!isReadableMarkdown(current)) {
      continue;
    }
    for (const next of linkedFiles(current)) {
      if (!visited.has(toPosix(path.relative(ROOT, next)))) {
        queue.push(next);
      }
    }
  }
  return visited;
}

function globSimple(pattern) {
  const posix = toPosix(pattern);
  if (!posix.includes("**")) {
    const abs = path.join(ROOT, posix);
    return fs.existsSync(abs) ? [abs] : [];
  }
  const [prefix, suffix] = posix.split("/**/");
  const base = path.join(ROOT, prefix);
  const out = [];
  if (!fs.existsSync(base)) {
    return out;
  }
  function walkDir(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walkDir(full);
        continue;
      }
      if (entry.isFile() && full.replace(/\\/g, "/").endsWith(suffix.replace(/^\//, ""))) {
        out.push(full);
      }
    }
  }
  walkDir(base);
  return out;
}

function main() {
  const manifestArg = process.argv[2];
  const manifest = loadManifest(manifestArg || DEFAULT_MANIFEST);
  const ruleFiles = collectRuleFiles();
  const ruleFacts = [];
  let alwaysOnLines = 0;
  let alwaysOnBytes = 0;
  const frontmatterIssues = [];

  for (const rulePath of ruleFiles) {
    const rel = toPosix(path.relative(ROOT, rulePath));
    const fm = parseFrontmatter(rulePath);
    const lines = lineCount(rulePath);
    const bytes = Buffer.byteLength(fs.readFileSync(rulePath, "utf8"), "utf8");
    if (!fm.ok) {
      frontmatterIssues.push({ file: rel, error: fm.error });
    }
    if (fm.alwaysApply === true) {
      alwaysOnLines += lines;
      alwaysOnBytes += bytes;
    }
    ruleFacts.push({
      file: rel,
      lines,
      bytes,
      alwaysApply: fm.alwaysApply,
      description: fm.description,
    });
  }

  const reachable = walkFromRoots(manifest.roots);
  const domainFiles = new Set();
  for (const pattern of manifest.domain_globs) {
    for (const file of globSimple(pattern)) {
      domainFiles.add(toPosix(path.relative(ROOT, file)));
    }
  }
  const orphans = [...domainFiles].filter((f) => !reachable.has(f));

  const missingRefs = [];
  for (const rel of reachable) {
    const abs = path.join(ROOT, rel);
    missingRefs.push(...scanRefs(abs));
  }

  const report = {
    generatedAt: new Date().toISOString(),
    manifest: manifestArg || DEFAULT_MANIFEST,
    rules: ruleFacts,
    alwaysOn: {
      lineCount: alwaysOnLines,
      byteCount: alwaysOnBytes,
      budgetBytes: manifest.always_on_budget_bytes,
      overBudget: alwaysOnBytes > manifest.always_on_budget_bytes,
    },
    frontmatterIssues,
    missingRefs,
    reachableCount: reachable.size,
    orphanCandidates: orphans.sort(),
  };

  const json = JSON.stringify(report, null, 2);
  process.stdout.write(`${json}\n`);
  process.exit(0);
}

main();
