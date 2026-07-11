# Agent workflow layers (boilerplate)

How **skills**, **rules**, **documentation**, and **scripts/hooks** fit together. Use this when adding or changing agent guidance so layers stay aligned.

## Layers

| Layer | Location | Purpose |
|-------|----------|---------|
| **Skill** | `.agents/skills/<slug>/SKILL.md` | Full procedure the agent runs (SSOT for *how*) |
| **Rule** | `.cursor/rules/<category>/RULE.md` | Always-on principles; **link** to skills/docs, avoid copying long checklists |
| **Human doc** | `documentation/DOC_*.md` | Product/process narrative for people and agents |
| **Enforcement** | `.husky/*`, `scripts/*`, `.github/workflows/*` | Machine checks; shared helpers in `scripts/*.cjs` |

**Catalog:** `.agents/skills/router/SKILL.md` § Skill index. **Routing:** `.agents/skills/router/SKILL.md` + `router/references/dev-cycle-matrix.md`.

**Commands:** This repo uses **skills only** (no `.cursor/commands/` hub). Invoke via slash commands that read `.agents/skills/<name>/SKILL.md` or attach the skill in chat.

## Pattern / industry-standard review (single entry point)

Compares **implementation proposals and plans** to **industry standards and common best practice** before coding. The agent **chooses relevant review aspects** per change (see rubric). Agents apply **proactively** per `pattern-review` skill and `architecture/RULE.md` § Pattern risk.

No separate `documentation/DOC_*` procedure for this workflow — invocable steps live in **skills** (link from docs and rules only).

| Audience | Start here |
|----------|------------|
| **Agents** | `.agents/skills/pattern-review/SKILL.md` |
| **Humans** | Same skill + `references/` below; router § Situation → skill |

| Content | Path |
|---------|------|
| Procedure (when / how / modes) | `.agents/skills/pattern-review/SKILL.md` |
| Review lens, dimension pool, verdicts | `.agents/skills/pattern-review/references/rubric.md` |
| Pattern risk alert block | `.agents/skills/pattern-review/references/alert-template.md` |
| Always-on reminder | `.cursor/rules/architecture/RULE.md` § Pattern risk |
| Plan section template | `.agents/skills/plan/references/implementation-plan-template.md` § Pattern & precedent |

**Callers:** `plan`, `router`, `feature`, `review-dev-plan` (industry lens). Do not duplicate the rubric elsewhere — link these paths.

**Not the same as:** `.agents/skills/validate/SKILL.md` (repo rule compliance).

## External API / backend integration research (single entry point)

Research an external API, vendor, or backend **before** writing integration code — MCP-first when a server exists, contract before sample. Agents route through `api-integrate` skill and `api-integration` rule (globs-scoped, not `alwaysApply`).

No separate `documentation/DOC_*` procedure for this workflow — invocable steps live in **skills** (link from docs and rules only).

| Audience | Start here |
|----------|------------|
| **Agents** | `.agents/skills/api-integrate/SKILL.md` |
| **Humans** | Same skill + `references/` below; router § External API research vs stack plugin skills |

| Content | Path |
|---------|------|
| Procedure (MCP fallback tree, phases) | `.agents/skills/api-integrate/SKILL.md` |
| Worked example — Supabase (MCP path) | `.agents/skills/api-integrate/references/vendor-supabase.md` |
| Worked example — Airtable (no-MCP path) | `.agents/skills/api-integrate/references/vendor-airtable.md` |
| Globs-scoped principles | `.cursor/rules/api-integration/RULE.md` (`alwaysApply: false`) |

**Callers:** `plan` § Optional: Foundation validation, `router`, `api-integrate`. Do not duplicate the MCP fallback tree or worked examples elsewhere — link these paths. (`security`, `database`, and `cloud-functions` rules cross-link here via Related Rules.)

**Not the same as:** stack plugin skills (`supabase`, `cloudflare`, etc.) — those cover operating inside a stack you're already on, not researching an unfamiliar vendor.

## Cross-repo adoption guides

**Doc type:** adoption guide (`<SLUG>_ADOPTION_GUIDE.md`) — how to replicate a capability in other repos; not a session handoff.

| Item | Path |
|------|------|
| How to write a guide | `.agents/skills/write-adoption-guide/SKILL.md` |
| Output folder (config in skill) | `documentation/handoffs/` |
| Template + voice rules | `.agents/skills/write-adoption-guide/references/adoption-guide-template.md`, `references/voice-and-naming.md` |

Copy `write-adoption-guide/` to other projects and adjust the skill **Configuration** block (output folder, repo display name).

## Local git: finish → push

| Step | Skill | Hook / script |
|------|-------|----------------|
| Commit | `finish` | `.husky/pre-commit` (light path + staged tests — see below) |
| Push | `push` | `.husky/pre-push` (no local tests; CI `test` job is merge gate) |

**Pre-commit light path** (SSOT: [`scripts/change-classify.cjs`](../scripts/change-classify.cjs)):

| Staged paths | Kind | Runs | Skips |
|--------------|------|------|-------|
| Always | — | `lint-staged`, `validate:feature-docs:staged` | — |
| Docs-only (`.md`, `documentation/`, `.cursor/**`, `.agents/**`, changesets) | `docs` | `validate:docs` | tests, `type-check`, `validate:structure:staged`, `arch:check:staged` |
| SQL migrations / seed only | `migrations` | — | Same skips as docs (no `validate:docs`) |
| Tooling only (no app surface, no test-infra) | `no-src` | — | Same skips |
| App / test-infra surface | full | Staged tests, `type-check`, structure, feature-size, arch | — |

**Pre-commit test modes** (SSOT: [`scripts/test-staged.cjs`](../scripts/test-staged.cjs), classifier: `change-classify.cjs`):

| Mode | When | Runner |
|------|------|--------|
| skip (light) | docs / migrations / no app surface | none |
| related | 1–25 `src/**` source files, no triggers | `vitest run related <paths>` |
| full | triggers, `src/shared/**`, test-infra, edge functions, >25 files, `PRECOMMIT_TEST_FULL=1` | `pnpm test:classify && pnpm test:run` |
| node-scripts-only | `scripts/**` only | `pnpm test:classify` |
| dry-run | `pnpm test:staged` | log only |
| live (no commit) | `pnpm test:staged:live` | same as hook |

**Merge safety:** Related or full pre-commit green is **not** merge-safe. Only the CI `test` job on `develop` is authoritative.

**Agent commands:** `pnpm test:staged` (preview after `git add`); `PRECOMMIT_TEST_FULL=1 pnpm test:staged` (force full preview); `pnpm test:classify && pnpm test:run` (CI parity).

**Rollback:** Revert hook commit and restore pre-push `test:run` if related spawn fails in the wild.

PR CI runs full `pnpm test:classify`, `pnpm test:run`, and cold `pnpm type-check` in [`.github/workflows/ci.yml`](../.github/workflows/ci.yml).

See `.cursor/rules/workflow/RULE.md` for branch strategy and protected files.

## Agent-only mode (human files features/bugs)

When the human only files feature requests or bug reports and tests in the app:

| Role | Responsibility |
|------|----------------|
| Human | Describe goal or bug; test in app; confirm pass/fail |
| Agent | Full delivery chain — no git/CI coordination required from human |

**Default agent chain:** `router` → plan/feature/debug as needed → `implement` or `quick-piv` → `validate` → `finish` → `push` → **`babysit`** when a PR to `develop` exists → **Ready for you to test** handoff (`finish` § User test).

**Standing protected-file consent:** Optional Cursor **user rule** listing categories agents may edit without per-task ask (e.g. `.agents/skills/**` for workflow glue). Repo `.cursor/rules/workflow/RULE.md` § Protected Files stays strict — the user rule is external standing consent, not a repo policy change.

**Test tiers:** See [`DOC_TESTING.md`](./DOC_TESTING.md) and pre-commit tables above; merge safety is CI `test` on `develop`, not pre-commit related mode alone.

## Release and versioning

- Feature branches: `.changeset/*.md` + conventional commits (`finish` SSOT).
- Version bump lands with each feature PR to `develop`: `documentation/DOC_CHANGESETS.md`. Production promotion (`main`) is a separate **Promote to production** workflow step.

## When you change something

| You change… | Also update… |
|-------------|----------------|
| `.husky/pre-commit` | `workflow/RULE.md`, `finish` skill, this doc if hook scope changes |
| `.husky/pre-push` | `workflow/RULE.md`, `push` skill, this doc if hook scope changes |
| `finish` / `push` flow | Both skills, `router` matrix |
| New invocable workflow | `router/SKILL.md` (situation table + skill index) |
| Rules registry for skills | `.agents/skills/plan/references/rules-registry.md`; callers link only |
| Pattern / industry-standard review | `.agents/skills/pattern-review/` — see § Pattern / industry-standard review above |
| External API / backend integration research | `.agents/skills/api-integrate/` — see § External API / backend integration research above |
| New cross-repo adoption guide | `write-adoption-guide` skill; file under `documentation/handoffs/*_ADOPTION_GUIDE.md` |

## Related

- Write adoption guides: `.agents/skills/write-adoption-guide/SKILL.md`
- Pattern review: `.agents/skills/pattern-review/SKILL.md`
- External API integration: `.agents/skills/api-integrate/SKILL.md`
- Doc hub: `documentation/DOC_INDEX.md`
- Changesets: `documentation/DOC_CHANGESETS.md`
- App vision: `documentation/DOC_APP_VISION.md`
