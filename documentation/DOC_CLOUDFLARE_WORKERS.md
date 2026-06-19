# Cloudflare Workers deployment

Deploy this Vite + React SPA to **Cloudflare Workers** with static assets, using **Workers Builds** for CI/CD. GitHub is the **quality gate only** — it never deploys. This replaces the older Cloudflare **Pages** flow.

**Official migration reference:** [Migrate from Pages to Workers](https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/)

## Responsibility split (one deploy path)

| System | Responsibility |
|--------|----------------|
| **GitHub (this repo)** | Source + `wrangler.jsonc`. `ci.yml` runs type-check / lint / tests / build on PR + push. Branch **rulesets** require a PR and the `test` check before merge to `main`/`develop`. **No deploy workflow. No `CLOUDFLARE_API_TOKEN` secret.** |
| **Cloudflare Workers Builds** | Builds and deploys on push. `develop` → preview build; `main` → production. Account, build command, and `VITE_*`/`CLOUDFLARE_ACCOUNT_ID` env live in the dashboard connection. |
| **Supabase** | Same project for preview and production; auth URLs include the deployed origin(s). |

Push → Cloudflare builds & deploys. GitHub blocks bad merges. There is no GitHub → Cloudflare deploy step.

## What is configured in this repo

| Concern | How |
|--------|-----|
| Worker config | Root `wrangler.jsonc` — **assets-only SPA** (no `main`, no `ASSETS` binding) |
| Build output | Plain `vite build` → `dist/` (`assets.directory: "./dist"`) |
| SPA routing (React Router) | `assets.not_found_handling: "single-page-application"` |
| Preview URLs | `preview_urls: true`, `workers_dev: true` |
| Node version | `.node-version` = `20` |
| Emergency local deploy | `pnpm deploy` (`pnpm build && wrangler deploy`) |
| Local Workers preview | `pnpm preview:worker` (`pnpm build && wrangler dev`) |

### Fork-safe by design

This is a **template**, so account- and domain-specific values are **not committed**:

- **No `account_id`** in `wrangler.jsonc` — set `CLOUDFLARE_ACCOUNT_ID` instead (Workers Builds env var, and locally if your token sees multiple accounts). Avoids the `More than one account available` error without pinning a forked repo to someone else's account.
- **No `routes` / custom domain** — add one in your fork only (see Custom domain below).
- **`name`** is a placeholder — rename it per fork.

## Quick start

### 1. Rename the Worker

Edit `name` in [`wrangler.jsonc`](../wrangler.jsonc) to a unique name in your Cloudflare account (lowercase, hyphens).

### 2. Connect Workers Builds (dashboard — primary deploy path)

In the Cloudflare dashboard → **Workers & Pages → Create → Workers → Connect to Git**:

| Setting | Value |
|---------|-------|
| Repository | your repo |
| Production branch | `main` |
| Build command | `pnpm install && pnpm run build` |
| Deploy command | `npx wrangler deploy` |
| **Root directory** | **EMPTY (repo root)** — a stale root directory causes `Failed: root directory not found` |
| Build variables | `NODE_VERSION=20`, `CLOUDFLARE_ACCOUNT_ID=<your account id>`, plus build-time `VITE_*` (e.g. `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`) |

Then enable **non-production branch builds** so `develop` produces a preview deployment.

> `VITE_*` variables are embedded at **build time**. Workers Builds does **not** share runtime and build env vars — set every `VITE_*` your app needs in the build variables, or production will load an app with missing config.

### 3. Supabase auth URLs

Add the deployed origins to Supabase **Authentication → URL configuration** (Site URL + Redirect URLs), e.g.:

- `https://<your-worker>.<subdomain>.workers.dev/**` (production)
- the `develop` preview URL Workers Builds reports

For Google OAuth, also add those origins to Google Cloud **Authorized JavaScript origins** and the callback path. Full checklist: [DOC_SUPABASE_GOOGLE_OAUTH.md](./DOC_SUPABASE_GOOGLE_OAUTH.md).

### 4. Verify

After a push, confirm in the dashboard that Workers Builds shows a green build, then open the live URL. **View source** and confirm it loads built assets (`/assets/*.js`), not `/src/main.tsx` — the latter is the Pages-style dev/MIME-type symptom indicating the build/serve config is wrong.

## Custom domain (per fork, optional)

If your domain's nameservers are on Cloudflare, add a route to your fork's `wrangler.jsonc`:

```jsonc
"routes": [{ "pattern": "app.example.com", "custom_domain": true }]
```

The domain attaches on the next deploy. Keep this **out of the template** so forks don't try to bind a domain they don't own.

## Emergency local deploy

The dashboard connection is the normal path. For a one-off manual deploy:

```bash
pnpm exec wrangler login          # one-time
$env:CLOUDFLARE_ACCOUNT_ID="<id>" # PowerShell, if multiple accounts are visible
pnpm deploy                       # pnpm build && wrangler deploy
```

## Migrating an existing Pages project

| Pages | Workers (this repo) |
|-------|---------------------|
| `pages_build_output_dir` | `assets.directory: "./dist"` in `wrangler.jsonc` |
| Implicit SPA fallback | `not_found_handling: "single-page-application"` |
| `public/_redirects` SPA rule | **Remove it** — conflicts with `not_found_handling` and fails the build with `Infinite loop detected` |
| `wrangler pages deploy` / built-in CI | Workers Builds (push-to-deploy) |
| `wrangler pages dev` | `pnpm dev` (Vite) or `pnpm preview:worker` |
| `pages.dev` | `workers.dev` (`workers_dev: true`) |
| Pages Functions (`functions/`) | Add `worker/index.ts` + `main` in `wrangler.jsonc` — see [Vite plugin tutorial](https://developers.cloudflare.com/workers/vite-plugin/tutorial/) |

After validating production on Workers, delete the old Pages project (dashboard or `wrangler pages project delete`).

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| `Failed: root directory not found` (Workers Builds) | Set Root directory to **empty** (repo root) |
| `More than one account available` (local deploy) | Set `CLOUDFLARE_ACCOUNT_ID` env var |
| `Infinite loop detected` (build) | Remove `public/_redirects` SPA rule; rely on `not_found_handling` |
| Live page shows `/src/main.tsx` not `/assets/*.js` | Build didn't run / assets dir wrong — check Build command and `assets.directory` |
| Routes 404 in production | Confirm `not_found_handling: "single-page-application"` |
| Empty app / missing config in production | `VITE_*` not set as Workers Builds **build** variables |

**Agents:** after changing Wrangler/Cloudflare setup, keep `.wrangler/` in `.gitignore` and the structure validator ignore list (see `.cursor/rules/file-placement/RULE.md` § Tooling artifacts), and whitelist new root files in `projectStructure.config.cjs`.

## Related docs

- [Workers + React framework guide](https://developers.cloudflare.com/workers/framework-guides/web-apps/react/)
- [Static assets routing](https://developers.cloudflare.com/workers/static-assets/routing/)
- [Migrate from Pages to Workers](https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/)
