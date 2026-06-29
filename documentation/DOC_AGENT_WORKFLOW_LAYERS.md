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
| Commit | `finish` | `.husky/pre-commit` (see light path below) |
| Push | `push` | `.husky/pre-push` → `pnpm test:run` |

**Pre-commit light path** (SSOT: [`scripts/change-classify.cjs`](../scripts/change-classify.cjs)):

| Staged paths | Kind | Runs | Skips |
|--------------|------|------|-------|
| Always | — | `lint-staged`, `validate:feature-docs:staged` | — |
| Docs-only (`.md`, `documentation/`, `.cursor/**`, `.agents/**`, changesets) | `docs` | `validate:docs` | `type-check`, `validate:structure:staged`, `arch:check:staged` |
| SQL migrations / seed only | `migrations` | — | Same skips as docs (no `validate:docs`) |
| Tooling only (no `src/`, no edge functions, no TS toolchain configs) | `no-src` | — | Same skips |
| App surface (`src/`, `supabase/functions/`, `tsconfig*`, `vite`/`vitest` configs) | full | Full hook | — |

PR CI stays the full suite; classifier unit tests run via `pnpm test:classify` in [`.github/workflows/ci.yml`](../.github/workflows/ci.yml).

See `.cursor/rules/workflow/RULE.md` for branch strategy and protected files.

## Release and versioning

- Feature branches: `.changeset/*.md` + conventional commits (`finish` SSOT).
- Version bump lands with each feature PR to `develop`: `documentation/DOC_CHANGESETS.md`. Production promotion (`main`) is a separate **Promote to production** workflow step.

## When you change something

| You change… | Also update… |
|-------------|----------------|
| `.husky/pre-commit` | `workflow/RULE.md`, `finish` skill, this doc if hook scope changes |
| `finish` / `push` flow | Both skills, `router` matrix |
| New invocable workflow | `router/SKILL.md` (situation table + skill index) |
| Rules registry for skills | `.agents/skills/plan/references/rules-registry.md`; callers link only |
| Pattern / industry-standard review | `.agents/skills/pattern-review/` — see § Pattern / industry-standard review above |
| New cross-repo adoption guide | `write-adoption-guide` skill; file under `documentation/handoffs/*_ADOPTION_GUIDE.md` |

## Related

- Write adoption guides: `.agents/skills/write-adoption-guide/SKILL.md`
- Pattern review: `.agents/skills/pattern-review/SKILL.md`
- Doc hub: `documentation/DOC_INDEX.md`
- Changesets: `documentation/DOC_CHANGESETS.md`
- App vision: `documentation/DOC_APP_VISION.md`
