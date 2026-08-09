#!/usr/bin/env python3
"""
reference_scan.py — textual-fallback reference finder for /purge.

Structural analysis (imports, calls, inheritance) misses references that only exist
as strings: feature-flag keys, config entries, CI job names, string-keyed dispatch
tables, i18n keys, docs mentions. This script is the "grep everything, everywhere"
safety net (the same role BigGrep plays for Meta's SCARF) so that layer isn't
reinvented by hand on every /purge run.

Usage:
    python reference_scan.py <repo_root> <base_name> [<base_name2> ...]

Given one or more base names (e.g. "OldCheckoutFlow" or "checkout-v1"), it generates
common case-variant spellings, greps the whole repo (skipping vendor/build dirs),
and prints JSON grouped by file with a rough category per hit (source / test / route / flag
/ dependency / env / ci / docs / i18n) so results map directly onto the asset checklist categories
-- you shouldn't need to re-derive "is this actually a route/flag file" by hand for each hit.

No third-party dependencies. Uses ripgrep if present on PATH (fast, respects
.gitignore), otherwise falls back to a pure-Python walk + regex scan.
"""

import json
import os
import re
import subprocess
import sys

SKIP_DIRS = {
    ".git", "node_modules", "dist", "build", "vendor", ".venv", "venv",
    "__pycache__", "target", ".next", "coverage", ".turbo", ".cache",
    "out", "bin", "obj",
}

CATEGORY_PATTERNS = [
    # Order matters: more specific buckets are checked before the generic
    # "env/config" catch-all, so e.g. a routes/router.js or a flags.json
    # doesn't just get dumped in with everything else and need re-sorting by hand.
    ("test", re.compile(r"(^|/)(tests?|__tests__|spec)(/|$)|\.(test|spec)\.", re.I)),
    ("ci", re.compile(r"(^|/)\.github/workflows/|\.gitlab-ci|circleci|Jenkinsfile", re.I)),
    ("docs", re.compile(r"\.md$|(^|/)docs?(/|$)|README", re.I)),
    ("i18n", re.compile(r"(^|/)(locales?|i18n|translations?)(/|$)", re.I)),
    ("route", re.compile(r"(^|/)(routes?|routers?|endpoints?|urls?)(/|\.)", re.I)),
    ("flag", re.compile(r"flags?[._-]|(^|/)flags?(/|\.)", re.I)),
    ("dependency", re.compile(r"(^|/)(package\.json|requirements.*\.txt|pyproject\.toml|go\.mod|Cargo\.toml|Gemfile)$", re.I)),
    ("env", re.compile(r"(^|/)\.env|(^|/)env(\.|/)|settings\.|config\.|(^|/)config(s)?(/|$)", re.I)),
]


def categorize(path: str) -> str:
    for label, pattern in CATEGORY_PATTERNS:
        if pattern.search(path):
            return label
    return "source"


def case_variants(name: str):
    """Generate spelling variants of a name so config/flag keys spelled differently
    from the code symbol still get caught (e.g. OldCheckoutFlow -> old-checkout-flow)."""
    # Split camel/Pascal case and existing separators into words.
    words = re.findall(r"[A-Z]+(?=[A-Z][a-z]|$)|[A-Z]?[a-z0-9]+|[A-Z]+", name.replace("_", " ").replace("-", " "))
    words = [w for w in words if w]
    if not words:
        return {name}

    pascal = "".join(w.capitalize() for w in words)
    camel = words[0].lower() + "".join(w.capitalize() for w in words[1:])
    snake = "_".join(w.lower() for w in words)
    kebab = "-".join(w.lower() for w in words)
    screaming = "_".join(w.upper() for w in words)
    human = " ".join(w.lower() for w in words)

    return {name, pascal, camel, snake, kebab, screaming, human}


def ripgrep_available() -> bool:
    try:
        subprocess.run(
            ["rg", "--version"], capture_output=True, check=True,
            stdin=subprocess.DEVNULL, timeout=5,
        )
        return True
    except Exception:
        return False


def scan_with_ripgrep(repo_root: str, terms: set):
    results = []
    glob_excludes = []
    for d in SKIP_DIRS:
        glob_excludes += ["--glob", f"!**/{d}/**"]
    for term in sorted(terms):
        # Always pass an explicit path ("."). Without one, ripgrep can end up waiting
        # on stdin in some shells/sandboxes instead of walking the current directory,
        # which hangs indefinitely -- stdin=DEVNULL is a second safety net for the same issue.
        # --hidden: dotfiles/dotdirs (.env*, .github/) are exactly where flags, CI jobs,
        # and env vars live, and ripgrep skips them by default -- missing them here would
        # defeat the point of the textual-fallback layer.
        cmd = ["rg", "--json", "-i", "--hidden", "--fixed-strings", term] + glob_excludes + ["."]
        proc = subprocess.run(
            cmd, cwd=repo_root, capture_output=True, text=True,
            stdin=subprocess.DEVNULL, timeout=30,
        )
        if not proc.stdout:
            continue
        for line in proc.stdout.splitlines():
            try:
                obj = json.loads(line)
            except json.JSONDecodeError:
                continue
            if obj.get("type") != "match":
                continue
            data = obj["data"]
            path = data["path"]["text"]
            line_no = data["line_number"]
            snippet = data["lines"]["text"].strip()
            results.append({
                "term": term,
                "file": path,
                "line": line_no,
                "snippet": snippet[:200],
                "category": categorize(path),
            })
    return results


def scan_with_python(repo_root: str, terms: set):
    results = []
    lower_terms = {t.lower(): t for t in terms}
    for dirpath, dirnames, filenames in os.walk(repo_root):
        # Only exclude SKIP_DIRS (which already lists .git, .venv, .next, etc.) -- do NOT
        # blanket-exclude every dotdir, or this fallback misses .github/ and similar,
        # which is exactly where CI config and other important references live.
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        for fname in filenames:
            fpath = os.path.join(dirpath, fname)
            rel = os.path.relpath(fpath, repo_root)
            try:
                with open(fpath, "r", errors="ignore") as f:
                    for i, line in enumerate(f, start=1):
                        low = line.lower()
                        for lt, orig_term in lower_terms.items():
                            if lt in low:
                                results.append({
                                    "term": orig_term,
                                    "file": rel,
                                    "line": i,
                                    "snippet": line.strip()[:200],
                                    "category": categorize(rel),
                                })
            except (UnicodeDecodeError, OSError):
                continue
    return results


def main():
    if len(sys.argv) < 3:
        print("Usage: python reference_scan.py <repo_root> <base_name> [<base_name2> ...]", file=sys.stderr)
        sys.exit(1)

    repo_root = sys.argv[1]
    base_names = sys.argv[2:]

    all_terms = set()
    for name in base_names:
        all_terms |= case_variants(name)

    if ripgrep_available():
        results = scan_with_ripgrep(repo_root, all_terms)
    else:
        results = scan_with_python(repo_root, all_terms)

    grouped = {}
    for hit in results:
        grouped.setdefault(hit["file"], []).append(hit)

    by_category = {}
    for hit in results:
        by_category.setdefault(hit["category"], 0)
        by_category[hit["category"]] += 1

    output = {
        "searched_terms": sorted(all_terms),
        "total_hits": len(results),
        "hits_by_category": by_category,
        "files": grouped,
    }
    print(json.dumps(output, indent=2))


if __name__ == "__main__":
    main()
