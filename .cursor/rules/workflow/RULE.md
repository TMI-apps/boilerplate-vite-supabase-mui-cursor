---
description: "Development workflow hub — code review, dev process, deployment pointers"
alwaysApply: true
---

# Workflow Standards

Thin hub for development workflow, code review, and process requirements. Domain detail lives in child rules — do not duplicate here.

## Rule routing

| Concern | SSOT |
|---------|------|
| Branch model, PRs, promote, commit/push flow | `git-workflow/RULE.md` |
| Protected files, decision protocol, user-test gate | `agent-behavior/RULE.md` |
| PowerShell, env vars, shell crash prevention | `platform/RULE.md` |
| Semver, changelog, commit format | `.agents/skills/finish/SKILL.md` |
| Reductive strategy / debugging | `debugging/RULE.md` |
| API doc research | `api-integration/RULE.md` |

## Branch gate (minimal)

Before editing app code (`src/**`, configs, migrations, etc.): verify current branch is `feature/*` or `fix/*` — **not** `main` or `develop`. Stop and switch branches if on a protected branch. Full Model A rules: `git-workflow/RULE.md` § Branch Strategy.

## SSOT Map

| Topic | SSOT Location |
|-------|----------------|
| Semantic versioning, commit format, conventional commit types | `.agents/skills/finish/SKILL.md` |
| Branch strategy, PRs, production promotion | `git-workflow/RULE.md` |
| Protected files, agent behaviors | `agent-behavior/RULE.md` |
| PowerShell / local environment | `platform/RULE.md` |
| Architecture patterns, layer rules, code placement | `architecture/RULE.md` |
| Project structure, file whitelist | `projectStructure.config.cjs` |
| Dependency/architecture enforcement | `.dependency-cruiser.cjs` |
| Dev task backlog / onboarding | `src/config/app-tasks.json` + `src/features/tasks/README.md` |
| App vision & goals | `documentation/DOC_APP_VISION.md` |
| Agent workflow layers | `documentation/DOC_AGENT_WORKFLOW_LAYERS.md` |
| Supabase + Google OAuth setup | `documentation/DOC_SUPABASE_GOOGLE_OAUTH.md` |
| Feature-local README enforcement | `documentation/DOC_FEATURE_LOCAL_README.md` |

## Code Review Process

### Review Checklist
- [ ] Changelog updated (if user-facing changes) and matches commit message — `finish/SKILL.md`
- [ ] Commit message includes version number first and matches changelog when bumped
- [ ] Code follows style guidelines (`code-style/RULE.md`)
- [ ] Architecture patterns are followed (`architecture/RULE.md`)
- [ ] Architecture documentation updated (if structural changes)
- [ ] Tests are included and passing (`testing/RULE.md`)
- [ ] Security considerations addressed (`security/RULE.md`)
- [ ] Documentation changes are limited to required contract docs only
- [ ] Feature-local README updated when `src/features/*` code changed
- [ ] No console.log or debug code left behind
- [ ] Linting passes (GTS or project-specified tool)

### Review Focus Areas
- Functionality, code quality, performance, security, testing

## Development Process

### Before Starting Work
- Understand requirements clearly; check existing patterns; plan before coding

### During Development

**Agents:** Do not commit during `plan` or `implement` — commits happen in **`finish`** only (`.agents/skills/finish/SKILL.md`).

**Humans on `feature/*` branches:** May commit frequently; still use `finish` when agents wrap up work.

- Write tests per `testing/RULE.md` § When to use TDD / What to Test
- Refactor as you go; follow established patterns

### Before Submitting

- Changelog and version sync: **`finish/SKILL.md`** (not during plan/implement)
- Run linters and tests; review your own code
- Update only required docs: `CHANGELOG.md`, `ARCHITECTURE.md`, `src/features/*/README.md`
- Do not create new docs by default; deep docs need explicit user approval
- If feature code changed: stage README updates and run `pnpm validate:feature-docs:staged`

## Deployment Process

### Cloudflare Workers (frontend SPA)
- **SSOT:** `documentation/DOC_CLOUDFLARE_WORKERS.md` + `wrangler.jsonc`
- Push-to-deploy via Workers Builds; `develop` → preview, `main` → production

### Cloud Functions Deployment
- Deploy yourself when changes require it; verify success
- **SSOT:** `cloud-functions/RULE.md` — deploy commands, lint, Supabase Edge workflow

## Superseded sections (moved to child rules)

- **Git workflow, branch strategy, PRs, promote** → `git-workflow/RULE.md`
- **Agent behaviors, protected files** → `agent-behavior/RULE.md`
- **Platform, PowerShell, env vars** → `platform/RULE.md`
- **Reductive strategy** → `debugging/RULE.md`
- **Documentation lookup** → `api-integration/RULE.md`

Commit/changelog examples: **`.agents/skills/finish/SKILL.md`** § Commit Message Standards.

---

## Related Rules

**When modifying this rule, check these rules for consistency:**

- `git-workflow/RULE.md`, `agent-behavior/RULE.md`, `platform/RULE.md` — child domain rules
- `code-style/RULE.md`, `architecture/RULE.md`, `testing/RULE.md`, `security/RULE.md`
- `cloud-functions/RULE.md` — deployment processes

**Rules that reference this rule:**

- All other rules may be referenced in code review processes
