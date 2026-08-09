# Asset checklist — what "code + adjacent config" covers

This is the scope for `/purge`: everything living in the repo that could plausibly
reference a feature/component by name or by import, plus its adjacent configuration.
Work through these categories when mapping references (Phase 1) and when building the
removal plan (Phase 3). Not every category applies to every repo — skip what doesn't exist.

## In scope

- **Source references** — imports/requires/uses, function calls, component usage (JSX/templates),
  class inheritance or composition, decorators/annotations that register the target.
- **Routes / endpoints** — router registrations, URL patterns, API schema entries (OpenAPI/GraphQL),
  controller mappings.
- **Tests** — unit, integration, e2e/snapshot tests that exist solely to cover the target. Watch for
  shared test fixtures/factories that the target uses but other tests also depend on — those stay.
- **Types / interfaces / schemas** — type definitions, DB model classes (the class/ORM mapping itself,
  not the underlying table — see out of scope), GraphQL types, JSON schemas.
- **Feature flags** — flag keys in code and in any flag-service config file checked into the repo.
  If the flag service is external (LaunchDarkly, Statsig, etc.) and not represented in-repo, note it
  in the final report as a follow-up rather than trying to reach it.
- **Env vars / secrets references** — entries in `.env.example`, config loaders, secret-manager
  references *by name* (not the secret values themselves).
- **CI / build config** — GitHub Actions/GitLab CI/CircleCI jobs, Makefile targets, Dockerfiles or
  docker-compose services, build scripts that exist only for the target.
- **Docs** — README sections, in-repo docs/wiki pages, code comments referencing the target,
  changelog entries (leave changelog history alone — see out of scope).
- **i18n / translation strings** — locale files with keys or strings tied to the target.
- **Declared dependencies** — a `package.json`/`requirements.txt`/`go.mod`/`Cargo.toml` entry that
  was only ever pulled in for the target. Confirm nothing else imports it before removing the
  dependency itself — a false-positive here breaks the build for everyone.

## Explicitly out of scope

- **Database migrations, tables, and columns.** Removing these requires a real migration with its
  own rollout plan and is destructive in a way source deletion isn't (data loss, other services
  reading the same table). If you spot a migration or table that looks orphaned by this removal,
  call it out in the final report as a follow-up — don't generate a migration to drop it.
- **Data-warehouse / analytics assets** (event schemas, dashboards, pipelines reading the removed
  code's output). Same reasoning — flag, don't act.
- **Changelog / release-note history.** These are a record of the past, not live references; don't
  edit or delete old entries even if they mention the removed feature.
- **Anything outside this repo** (other services, other repos, published package consumers). If the
  target is part of a public API or a package other repos might import, say so explicitly in Phase 2
  as a reason something stays in "uncertain," since a single-repo scan can't see those consumers.
