# Development Plan — Cloudflare Workers Builds deploy (template, CI-gated)

## Summary

- **Goal:** Configure this boilerplate for a **Cloudflare Workers Builds–only** deploy with **GitHub as the CI/quality gate**. One deploy path: push → Cloudflare builds & deploys. GitHub runs CI only and blocks bad merges via rulesets. GitHub never deploys.
- **Why:** Adapt a proven product-repo setup to the template so any fork can connect to Workers with minimal edits, while keeping the deploy path single and the quality gate enforced.
- **Complexity:** M (config + CI/rulesets + docs; external dashboard step the agent cannot complete).
- **Plan review:** Lightweight (config/docs change, no app logic).
- **Branch:** `feature/cloudflare-workers-builds-deploy` → PR to `develop`. Never `main`.

### Scope

- **In scope:** `wrangler.jsonc` (plain assets-only SPA, fork-safe), remove `@cloudflare/vite-plugin`, deploy/preview scripts, `.node-version`, structure whitelist, docs (`DOC_CLOUDFLARE_WORKERS.md`, README, app-tasks, rules), enable `develop` ruleset, Workers Builds click-path.
- **Out of scope:** Committing `account_id` or a custom domain (fork-safety). Creating a deploy workflow or `CLOUDFLARE_API_TOKEN` secret. Touching unrelated Pages projects that already exist in the Cloudflare account.

### Decisions locked with user

| # | Decision | Choice |
|---|----------|--------|
| D1 | wrangler.jsonc approach | **Plain assets-only Worker** (remove Vite plugin) |
| D2 | account_id / custom domain in repo | **Fork-safe** — not committed; `CLOUDFLARE_ACCOUNT_ID` env + Workers Builds |
| D3 | Deploy the template itself | **Yes, the org account's `*.workers.dev` only**, no custom domain |
| D4 | Enable `develop` ruleset | **Yes, now** |

## Target architecture

- **GitHub (this repo):** source + `wrangler.jsonc`; `ci.yml` runs tests/lint/typecheck/build on PR + push; rulesets on `main` and `develop` require a PR and the `test` CI check before merge. **No deploy workflow. No `CLOUDFLARE_API_TOKEN` secret.**
- **Cloudflare Workers Builds:** builds and deploys on push. `develop` → preview build; `main` → production. Account fixed at connect time; `CLOUDFLARE_ACCOUNT_ID` + `VITE_*` set as build env vars.
- **Supabase:** same project for preview and production; auth URLs include the `workers.dev` origin(s).

## Discovery (done)

| Item | Finding |
|------|---------|
| Repo | The template repo (or your fork of it) |
| CI check name / integration | `test` / GitHub Actions integration_id `15368` |
| `main` ruleset | Active; PR + `required_status_checks(test,15368)` + non_fast_forward + deletion + merge/squash/rebase + strict=false — already matches spec |
| `develop` ruleset | Same rules, **`enforcement: disabled`** → only needs enabling |
| Deploy workflow | None (correct) |
| Old Pages project for this repo | None for this repo (any pre-existing Pages projects in the account are separate apps — do not touch) |
| Cloudflare account | Use your Cloudflare **org** account (not a personal one); set its id as `CLOUDFLARE_ACCOUNT_ID` (never committed) |
| Local tooling | Wrangler OAuth + `gh` with repo admin (account-specific; not committed) |
| `public/_redirects` | Absent (no SPA-rule conflict to remove) |
| `.node-version` | Absent → add `20` |

## Conflict & compliance

- **Rules:** `.cursor/rules/workflow/RULE.md` (branch flow, deployment, PowerShell), `.cursor/rules/file-placement/RULE.md` (root file whitelist + tooling-artifact ignores), `projectStructure.config.cjs` (whitelist `wrangler.jsonc`, `.node-version`).
- **File placements:** `wrangler.jsonc` (already whitelisted), `.node-version` (whitelist needed — config change, approved via D-set), `.wrangler/` ignored in `.gitignore` + validator.
- **Fork-safety (key risk):** committing `account_id`/custom domain would break forks → excluded by D2.
- **Version sync:** CI runs `validate:version-sync` → bump `package.json` + `CHANGELOG.md` together (0.30.0 → 0.31.0).
- **PowerShell:** chain with `;`, check `$LASTEXITCODE`; `&&` only inside package.json scripts (cross-platform script shell).

## Phase overview

| Phase | Goal | Gate | Status |
|-------|------|------|--------|
| 1 | Plain assets-only Worker config (remove plugin, wrangler.jsonc, scripts, .node-version, whitelist) | `pnpm build` → `dist/`; `wrangler deploy --dry-run` OK; `validate:structure` OK | Pending |
| 2 | Docs/tasks/rules updated to chosen architecture | `validate:docs:links` OK; responsibility split documented | Pending |
| 3 | Repo gates + version bump | lint, type-check, build, validate:structure, version-sync pass | Pending |
| 4 | PR feature → develop; enable develop ruleset | PR open; develop ruleset `enforcement: active` | Pending |
| 5 | Hand-off: Workers Builds dashboard click-path + Supabase auth URLs | User completes dashboard; live site serves `/assets/*.js` | Pending (user) |

## Phase details

### Phase 1 — Worker config
- Remove `@cloudflare/vite-plugin` from `vite.config.ts` and `package.json`.
- Rewrite `wrangler.jsonc`: `name`, `compatibility_date`, `workers_dev`, `preview_urls`, `assets.directory: ./dist`, `assets.not_found_handling: single-page-application`. No `account_id`, no `routes`, no `main`.
- Scripts: `deploy: pnpm build && wrangler deploy` (emergency local only), `preview:worker: pnpm build && wrangler dev`.
- Add `.node-version` = `20`; whitelist in `projectStructure.config.cjs`.
- **Gate:** `pnpm build` produces `dist/index.html` + `dist/assets/*`; `wrangler deploy --dry-run` reads root `wrangler.jsonc`; `pnpm validate:structure` passes.

### Phase 2 — Docs
- Rewrite `documentation/DOC_CLOUDFLARE_WORKERS.md`: Workers-Builds-only model, GitHub-vs-Cloudflare split, fork-safe account via `CLOUDFLARE_ACCOUNT_ID`, custom domain as per-fork opt-in, Build/Deploy commands + Root directory EMPTY + NODE_VERSION/VITE_* env, enable non-prod branch builds, `/assets/*.js` verification.
- Update README deployment section + `src/config/app-tasks.json` hosting task + workflow rule deployment subsection.
- **Gate:** `pnpm validate:docs:links` passes.

### Phase 3 — Gates + version
- Bump `package.json` 0.31.0; add `CHANGELOG.md` entry.
- **Gate:** lint, type-check, build, validate:structure, validate:version-sync pass.

### Phase 4 — PR + ruleset
- Commit, push, open PR feature → develop.
- `gh api --method PUT repos/<owner>/<repo>/rulesets/<develop-ruleset-id> --input <full-body>` to set `enforcement=active` (PUT re-validates the whole ruleset; send the full clean body).
- **Gate:** PR open; `gh api` confirms develop ruleset active.

### Phase 5 — Hand-off (user)
- Workers Builds dashboard connection (agent cannot: Builds API needs user API token, not OAuth) — provide exact click-path.
- Supabase Auth URL config for the `workers.dev` origin(s).
- **Gate (user-tested):** live site serves built assets; login works on production + develop preview; Workers Builds shows green builds.

## Notes during development

## Decisions made
