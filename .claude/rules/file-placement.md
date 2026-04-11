# Claude rule: file placement

SSOT: `.cursor/rules/file-placement/RULE.md` + `projectStructure.config.cjs`.

**Before writing any new file:**

1. Is the target directory in the structure whitelist? If unsure, run `pnpm validate:structure`.
2. Does the location respect layer boundaries (`pages → components → hooks → services`)?
3. If the location is invalid, **suggest the correct one** — do not silently modify `projectStructure.config.cjs` (protected file).
