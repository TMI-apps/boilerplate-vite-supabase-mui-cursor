# Claude rule: file placement

**Before writing any new file**, validate placement against `projectStructure.config.cjs` and the canonical rule at `.cursor/rules/file-placement/RULE.md`.

## Quick checklist

1. Is the target directory in the structure whitelist (`projectStructure.config.cjs`)?
2. Is the file pattern (extension, name) allowed in that directory?
3. Does the location respect layer boundaries from `.cursor/rules/architecture/RULE.md` (`pages → components → hooks → services`)?
4. If unsure, run `pnpm validate:structure` (read-only — safe to invoke at any time).

## If the location is invalid

- **Suggest the correct location** rather than changing config to fit the file.
- Explain why (cite the rule or whitelist entry).
- Modifying `projectStructure.config.cjs` requires **explicit user approval** — it is a protected file.

## Common landings

| Kind                  | Location                                                 |
| --------------------- | -------------------------------------------------------- |
| Page component (.tsx) | `src/pages/<name>/<Name>Page.tsx` (named, not `index.tsx`) |
| Reusable component    | `src/components/common/<Name>/`                          |
| Feature component     | `src/features/<feature>/components/`                     |
| Hook                  | `src/shared/hooks/` or `src/features/<feature>/hooks/`   |
| Service               | `src/shared/services/` or `src/features/<feature>/services/` |
| Type                  | `src/shared/types/` or `src/features/<feature>/types/`   |
| Validation schema     | `src/features/<feature>/types/*.schema.ts`               |
| Edge function         | `supabase/functions/<name>/index.ts`                     |
| Migration             | `supabase/migrations/`                                   |
| Job plan              | `documentation/jobs/temp_job_<name>/DEVELOPMENT_PLAN.md` |

When in doubt, read `.cursor/rules/file-placement/RULE.md` — it has examples for every common case and the rationale for each rule.
