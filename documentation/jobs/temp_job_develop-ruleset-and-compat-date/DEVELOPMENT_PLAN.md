# Development Plan — Finalize Cloudflare Workers Builds template setup

## Summary

- **Goal:** Close the only verifiable template-side gap in the Cloudflare Workers Builds (CI-gated) deploy setup, and refresh `wrangler.jsonc` `compatibility_date`.
- **Why:** A full setup request was given, but discovery showed this workspace is the **fork-safe boilerplate template** (`vite-mui-supabase-starter`), where the deploy architecture was already implemented and merged in PR #23 (`[0.31.0]`). The repo intentionally omits `account_id`/custom-domain/dashboard/Supabase wiring (fork-specific). The remaining template-appropriate work is the `develop` branch ruleset and a date refresh.
- **Complexity:** XS
- **Plan review:** Not required (XS).
- **Scope:**
  - In: `develop` ruleset hardening (add PR-required + non_fast_forward to match `main`); `compatibility_date` → today.
  - Out (excluded by design — fork-specific, see `documentation/DOC_CLOUDFLARE_WORKERS.md`): `account_id`, custom-domain `routes`, Workers Builds dashboard config, old Pages retirement, Supabase/Google OAuth origins.
- **Constraints:** Work on a feature branch off `develop`, never `main`. LF endings. PowerShell (`;` chaining). Agent runs all CLI; user tests and confirms.

## Phase overview

| Phase | Goal | Gate | Status |
|-------|------|------|--------|
| 1 | Refresh `compatibility_date` + document scope | Gates pass (lint, type-check, build, validate:structure) | Pending |
| 2 | Harden `develop` ruleset to match `main` | `gh api` shows `pull_request` + `non_fast_forward` + `required_status_checks(test)` + `deletion` active on `develop` | Pending |
| 3 | PR `feature → develop`, CI gates it | PR open; `test` check required; merge blocked until green | Pending |

## Conflict & compliance

- **Applicable rules:** `workflow/RULE.md` (branch strategy, Cloudflare deploy SSOT, protected files), `file-placement/RULE.md` (plan path whitelist), `architecture/RULE.md`.
- **File placements:** `documentation/jobs/temp_job_*/DEVELOPMENT_PLAN.md` (whitelisted nested md); `wrangler.jsonc` (whitelisted root file, not in protected list). Confirmed.
- **Fork-safety (key compliance point):** `workflow/RULE.md` + `DOC_CLOUDFLARE_WORKERS.md` forbid committing `account_id` / custom-domain `routes` to this template. The original request's wrangler `account_id`/`routes` and dashboard/Supabase steps are therefore **intentionally not implemented here**; they belong in a downstream fork.
- **Ruleset note:** `main` already enforces PR + status check + non_fast_forward + deletion. `develop` currently has only `deletion` + `required_status_checks(test, integration_id 15368)`. We add `pull_request` (0 approvals, merge/squash/rebase) + `non_fast_forward` to match.
- **Risks:** Adding PR-required to `develop` (no bypass) means all `develop` updates must go through PRs — this is the intended, requested behavior and matches `main`.
- **Open questions:** None after refinement (user chose template-only scope).

## Phase 1 — Refresh compatibility_date + document scope

### Goal
Provide an in-scope, template-safe PR payload and keep `compatibility_date` current.

### Steps
- Bump `wrangler.jsonc` `compatibility_date` to `2026-06-23`.
- Add this plan documenting why fork-specific steps are excluded.

### Gate
`pnpm lint`, `pnpm type-check`, `pnpm build`, `pnpm validate:structure` pass.

## Phase 2 — Harden develop ruleset

### Goal
`develop` branch protection matches `main`.

### Steps
- `gh api PUT` ruleset 15259707 (develop) with rules: `deletion`, `non_fast_forward`, `pull_request` (required_approving_review_count 0; allowed_merge_methods merge/squash/rebase), `required_status_checks` (context `test`, integration_id 15368, strict false).

### Gate
`gh api .../rulesets/15259707` shows all four rules active.

## Phase 3 — PR and CI gate

### Goal
Land via PR with CI as the gate.

### Steps
- Commit, push branch, open PR `feature/develop-ruleset-and-compat-date → develop`.
- Confirm the `test` check is required and the PR is blocked until green.

### Gate
PR open; `gh pr view` shows `test` required; do not merge to `main` without user go-ahead.

## Notes during development

## Decisions made
