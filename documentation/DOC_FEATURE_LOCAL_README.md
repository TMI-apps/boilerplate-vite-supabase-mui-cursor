# Feature-local README (Option 1)

This document describes enforced **colocated feature documentation**: each feature under `src/features/` has a `README.md` at the feature root, and commits that change feature code must include an updated staged README.

**SSOT for process:** `.cursor/rules/file-placement/RULE.md`, `.cursor/rules/workflow/RULE.md`

## Contract

1. **Presence:** Every discovered feature root under `src/features/` must contain `README.md`.
2. **Staged updates:** If you stage non-documentation changes under a feature (anything other than that feature’s `README.md` or files under `docs/*.md`), you must also stage `src/features/<feature>/README.md` in the same commit workflow (enforced by the pre-commit hook).
3. **Strict headings (CI):** In CI, `README.md` must include these level-2 sections: **Purpose**, **Structure**, **Dependencies** (see [Strict mode](#strict-mode)).

Feature roots are **flat** (`src/features/<name>/`) or **nested** (`src/features/<group>/<name>/`). Detection matches `scripts/feature-readme-lib.js` (same rules as staged validation).

## Commands

| Script | Purpose |
|--------|---------|
| `pnpm validate:feature-docs` | Full repo: every feature root has `README.md` (presence). |
| `pnpm validate:feature-docs:strict` | Same as above plus required `##` headings (Purpose, Structure, Dependencies). |
| `pnpm validate:feature-docs:json` | Machine-readable report (`--format=json`). |
| `pnpm validate:feature-docs:staged` | Pre-commit: README must be staged when feature code is staged. |
| `pnpm validate:feature-docs:strict --verbose` | Prints feature count and duration (milliseconds). |

## Pipeline placement

| Stage | What runs |
|-------|-----------|
| **Local pre-commit** | `pnpm validate:feature-docs:staged` (after lint-staged), then docs reference checks, type-check, structure (staged), architecture (staged). See `.husky/pre-commit`. |
| **CI** | `pnpm validate:feature-docs:strict` immediately after `pnpm install`, before type-check and heavier steps. See `.github/workflows/ci.yml`. |

Hooks can be skipped locally with `--no-verify`; CI enforces the full-repo check so merges cannot bypass Option 1.

## Strict mode

Strict mode requires these markdown headings (level `##`), case-insensitive on the title text:

- `## Purpose`
- `## Structure`
- `## Dependencies`

Implementation: `scripts/validate-feature-docs.js --strict` using `scripts/feature-readme-lib.js`.

## Performance

On a typical small `src/features/` tree, full validation completes in **under 50ms** (presence or strict). If strict mode ever added more than ~40s to CI, reduce CI to `pnpm validate:feature-docs` only and keep strict as an optional local/PR check; current cost is negligible.

## Related files

- `scripts/feature-readme-lib.js` — shared feature root detection and strict heading check
- `scripts/validate-feature-docs.js` — full-repository validator
- `scripts/validate-feature-docs-staged.js` — staged-file gate for commits
