# Development plan: Git workflow Model B (direct `develop` mode)

## Summary

- **Goal:** Add an opt-in **Model B** workflow where daily work happens directly on `develop` (commit + push, no `feature/*` branches), while keeping **Model A** as the default and preserving ff-only **Promote to production** → `main` in both modes.
- **Why:** Solo and small apps should not be forced through feature-branch PR ceremony; agents and docs today hardcode Model A in ~45 live files, causing drift risk when users want direct-`develop` flow.
- **Complexity:** **M** — cross-cutting rules/skills/docs refactor with a new config SSOT; no app-code or schema changes; durable plan for fork onboarding.
- **Plan review:** Done 2026-08-11 — six-lens critique accepted; must-fixes + strong agreement folded below (see `DECISIONS.md` #11–15).
- **Scope / constraints:**
  - **In:** `src/config/git-workflow.json` mode selector; refactor `.cursor/rules/git-workflow/RULE.md` for mode-aware behavior; thin hub update (**atomic with rule rewrite**); skills + human docs link to SSOT (no duplicated mode tables); `start` onboarding fork for Model B + **ruleset confirmation gate**; **required** `validate:git-workflow` (script + tests + structure + CI); Model B post-push branch CI babysit; mid-project migration doc; Model B promote bootstrap + staging-timing docs.
  - **Out:** Automated mid-project mode migration; changing `main` ruleset design; removing Model A; rewriting historical `documentation/jobs/temp_job_*` archives; fork-time single-path scaffold (rebel alternative deferred — DECISIONS #11); automated GitHub ruleset↔config verify script (v1 nice-to-have).
  - **Locked decisions:** See sibling `DECISIONS.md`.

### Review strong agreement (do not regress)

| Theme | Locked stance |
|-------|----------------|
| **SSOT shape** | Config → `git-workflow/RULE.md` § Mode-aware branch gate → skills/docs **link only** |
| **Production safety** | `main` + promote workflow unchanged; Model B weakens **staging**, not production |
| **`alwaysApply` hub** | Highest drift vector — Phase 2+3 land as one unit; hub must not hardcode `feature/*` |
| **Babysit gap** | External PR babysit ≠ Model B; branch `gh run watch` required |
| **Dual-mode tax** | Real and ongoing — one-time grep is not enough; CI-backed drift guards required |

## Phase overview

| Phase | Goal | Gate | Status |
|-------|------|------|--------|
| 1 | Mode config SSOT + required validator + tests | Config exists; `validate:git-workflow` + test:classify green; wired into structure + CI | Done |
| 2+3 | **Atomic:** rule rewrite + hub/entrypoint pointers | Gate § + hub mode-neutral; orphan sibling rules pointed; no `alwaysApply` Model A leftover | Done |
| 4 | Skills dedup (excl. `start`) + Model B post-push | Skills link gate §; `plan` special-case; push/router babysit mode-aware | Done |
| 5 | Human docs + **all** `start` onboarding | README/DOC dual-mode; `start` owns A/B choice + ruleset confirm + template skip; migration + bootstrap docs | Done |
| 6 | Audit + validation + babysit acceptance | Skills included in grep; validators + docs + classify green; babysit A/B table pass | Done |

## Conflict & compliance

### Applicable rules

| Rule / doc | Relevance |
|------------|-----------|
| `.cursor/rules/file-placement/RULE.md` | New `src/config/git-workflow.json`; `scripts/validate-git-workflow.cjs` + `.test.cjs` |
| `.cursor/rules/git-workflow/RULE.md` | Primary behavior SSOT — major edit (user-approved via this plan) |
| `.cursor/rules/workflow/RULE.md` | Hub stub must not hardcode `feature/*`; link to mode gate; clean § During Development |
| `.cursor/rules/agent-behavior/RULE.md` | Protected files — `.cursor/rules/**` edits need explicit approval (granted) |
| `.cursor/rules/testing/RULE.md` | Tooling under `scripts/` → `scripts/*.test.cjs` + `pnpm test:classify`; branch pointer |
| `documentation/DOC_AGENT_WORKFLOW_LAYERS.md` | Dev-cycle matrix references PR babysit — update for mode branch |
| `documentation/jobs/skill-library/2026-08-03-LENS-ssot.md` | SSOT discipline — one mode owner, others link |
| `.agents/skills/finish/SKILL.md` | Version/changelog on `develop` in Model B — link only; concurrency callout |
| `projectStructure.config.cjs` | Whitelist new config file |

### File placements

| Path | Action |
|------|--------|
| `src/config/git-workflow.json` | **Create** — `{ "mode": "model-a" }` default |
| `src/config/git-workflow.README.md` | **Create** — one screen + mid-project switch pointer |
| `scripts/validate-git-workflow.cjs` | **Create** — **required** — validates mode enum |
| `scripts/validate-git-workflow.test.cjs` | **Create** — missing file / bad JSON / bad mode / both valid modes |
| `package.json` | **Edit** — `validate:git-workflow`; include in structure and/or CI |
| `.github/workflows/ci.yml` | **Edit** — run `pnpm validate:git-workflow` (same tier as version-sync) |
| `projectStructure.config.cjs` | **Edit** — whitelist `git-workflow.json` (+ README if needed) |
| `.cursor/rules/git-workflow/RULE.md` | **Rewrite** — mode-aware (see Phase 2+3 map) |
| `.cursor/rules/workflow/RULE.md` | **Edit** — full hub cleanup (branch gate + During Development + SSOT map) |
| `.cursor/rules/INDEX.md`, `.cursor/rules/README.md` | **Edit** — dual mode |
| `.cursor/rules/testing/RULE.md`, `.cursor/rules/cloud-functions/RULE.md` | **Edit** — branch pointer only (orphan → Phase 2+3) |
| `.claude/rules/git-workflow.md` | **Edit** — strip Model A bullets; pointer + config + gate § only |
| `.agents/skills/{plan,feature,implement,quick-piv,push,finish,validate,router,prime,bundle-ship,learn}/SKILL.md` | **Edit** — Phase 4 (dedup + special cases) |
| `.agents/skills/start/SKILL.md` | **Edit** — **Phase 5 only** (all onboarding) |
| `.agents/skills/router/references/dev-cycle-matrix.md` | **Edit** — babysit row mode-aware |
| `.agents/skills/plan/references/rules-registry.md` | **Edit** — git-workflow row |
| `README.md`, `documentation/DOC_CONTRIBUTING.md`, `documentation/DOC_CHANGESETS.md`, `documentation/DOC_CLOUDFLARE_WORKERS.md`, `documentation/DOC_AGENT_WORKFLOW_LAYERS.md`, `documentation/DOC_INDEX.md` | **Edit** — dual-mode docs |
| `AGENTS.md` | **Edit** — mode SSOT pointer |
| `documentation/jobs/temp_job_*` (historical) | **No edit** |

### Risks / open questions

| Risk | Mitigation |
|------|------------|
| SSOT drift returns (mode logic copied into skills again) | Phase 4 link-only rule; Phase 6 grep **includes skills**; CI `validate:git-workflow` (+ optional drift patterns later) |
| Agent reads stale branch gate from `workflow/RULE.md` alwaysApply context | **Atomic Phase 2+3**; hub names config file; strip § During Development Model A prose |
| Model B user forgets to relax `develop` ruleset | `start` **confirmation gate** (`gh api` / user confirms ruleset); `DOC_CLOUDFLARE_WORKERS.md` Model B column |
| Staging deploys before CI green (Model B) | Document in rule + Cloudflare doc — Workers Builds on push ≠ PR pre-land gate (DECISIONS #13) |
| `finish` on `develop` bumps version shared with staging | Document in `DOC_CHANGESETS.md` |
| Concurrent agents on `develop` (Model B) | **Not** “unchanged vs feature branches” — document one-agent-per-checkout; reinforce `finish` smoke (DECISIONS #14) |
| Open `feature/*` PR when switching modes | Mid-project migration doc (Phase 5) — merge/close PRs + ruleset swap order |
| External babysit skill is PR-only | Model B: `push`/`router` use branch `gh run watch`; do not invoke PR babysit as sole path (DECISIONS #8) |
| Model B first promotion | Bootstrap doc: seed `promote-to-production.yml` onto `main` via local ff once (no PR path) |
| Hub lags rule rewrite | Implementer gate: Phase 2 incomplete until Phase 3 hub lands in same unit |

### Standards diversions

| Diversion | Intentional? | Notes |
|-----------|-------------|-------|
| Model B direct push to shared `develop` | **Yes (opt-in)** | Solo/small-team; trade PR review for speed. CI on push + promote gate on `main`. Staging may see red commits before checks finish. |
| Two coexisting branch models in one boilerplate | **Yes** | Uncommon for starters (most pick one); dual-mode tax accepted with SSOT + CI (DECISIONS #11). |

## Pattern & precedent

| Field | Value |
|-------|--------|
| **Capability** | Fork-time selectable git integration style for agent-driven development |
| **Precedents** | **Model A ≈** GitHub Flow + `develop` staging; **Model B ≈** GitLab-style environment branch with direct integration (TBD-on-`develop` hybrid, not pure trunk-on-`main`); solo-dev “commit to `dev`” |
| **Aspects reviewed** | Team scale fit; CI without PR; staging/production separation; agent determinism; user mental model; extensibility (dual-mode tax); concurrent agents on shared branch; hotfix path |
| **Findings** | Model B aligns with solo/small-team direct-integration; diverges from enterprise PR-every-change; `develop` staging + ff promote preserves **production** safety; Model B is hybrid TBD-on-integration-branch (not pure TBD on `main`); dual-mode boilerplate is uncommon — ongoing maintenance cost mitigated by SSOT + drift audit; Model B **increases** shared-branch contention vs feature-branch isolation; Model B drops human review gate (CI-only); hotfix in Model B = work on `develop` then promote, or rare manual `fix/*` exception |
| **Verdict** | **Acceptable product-specific** — explicit opt-in, Model A remains default |
| **If non-standard: options** | **A:** Document-only override (weak — rulesets still block). **B:** Config + rules refactor (this plan). **C:** Drop `develop`, trunk-only `main` (rejected — loses stable staging URL) |

## Phase 1 — Mode config SSOT + required validation

### Goal

Single machine-readable mode selector every agent reads at session start; validator is **required** machine authority (not optional).

### Steps

1. Create `src/config/git-workflow.json`:

   ```json
   {
     "mode": "model-a"
   }
   ```

   Allowed values: `"model-a"` | `"model-b"`. Strict JSON (no JSONC); prose in rule + README.

2. Add to `projectStructure.config.cjs` under `src/config/` children.

3. Add `scripts/validate-git-workflow.cjs` (**required**):
   - Assert file exists.
   - Assert valid JSON and `mode` ∈ enum.
   - Wire `pnpm validate:git-workflow`.
   - **Must** be invoked from `validate:structure` (or equivalent always-run path) **and** `.github/workflows/ci.yml`.

4. Add `scripts/validate-git-workflow.test.cjs` covering: missing file → fail; invalid JSON → fail; missing/`model-c` mode → fail; `model-a` / `model-b` → pass. Gate via `pnpm test:classify`.

5. Add `src/config/git-workflow.README.md` (one screen): what each mode means; link to `git-workflow/RULE.md`; pointer to mid-project switch section in `DOC_CONTRIBUTING.md`.

### Gate

- `pnpm validate:git-workflow` passes.
- `pnpm validate:structure` fails if config missing/invalid (wiring verified).
- `pnpm test:classify` covers new validator tests.
- CI step for `validate:git-workflow` present in `ci.yml`.

## Phase 2+3 — Atomic rule rewrite + hub / entrypoints

### Goal

One behavioral SSOT **and** `alwaysApply` hub that does not contradict it. **Land as one implement unit** — do not merge rule rewrite without hub cleanup.

### Content map — `git-workflow/RULE.md`

| Section | Action |
|---------|--------|
| Frontmatter `description` | `"Git branch models (Model A / Model B), PRs, and production promotion"` |
| **§ Workflow mode (new)** | Read `src/config/git-workflow.json`; table comparing A vs B; **forbidden:** guessing mode from branch name |
| **§ Mode-aware branch gate (new)** | Single gate agents invoke: read config → apply row below; anchor `#mode-aware-branch-gate` |
| **§ Branch Strategy** | Split **Model A** / **Model B**; Model B: no agent-created `feature/*`; `main` still forbidden for app code; Model B hotfix guidance (work on `develop` → promote; rare manual `fix/*`) |
| **§ Branch Protection** | Mode-conditional table; Model B: no `pull_request` on `develop`; keep checks + non-ff + deletion; state that checks ≠ PR pre-land gate |
| **§ Pull Requests** | Prefix: “**Model A only.**” Model B: skip PR for daily work; link to push flow |
| **§ Promote to production** | Unchanged for both modes; add **Model B first-promotion bootstrap** note (local ff seed when no PR path) |
| **§ Commit and Push Workflow** | Model B: `finish` on `develop` → `push` `develop` → watch branch `test` run (no PR) |
| **§ Staging timing (Model B)** | Push may deploy staging before CI green; production still promote-gated |

### Mode-aware branch gate (canonical table — implement verbatim)

| Mode | Allowed app-code branches | On `main` | On `develop` | On `feature/*` / `fix/*` |
|------|---------------------------|-----------|--------------|--------------------------|
| `model-a` | `feature/*`, `fix/*` only | **Stop** — create feature branch | **Stop** — create feature branch | Proceed |
| `model-b` | `develop` only (agents do not create feature branches) | **Stop** — never direct | **Proceed** | **Stop** — switch to `develop` |

Plans (`documentation/jobs/**/DEVELOPMENT_PLAN.md`) and rules (`.cursor/rules/**`) remain editable on any branch per § Exceptions.

### Hub + entrypoint steps (same unit)

1. **`.cursor/rules/workflow/RULE.md`**
   - § Branch gate → read config + apply gate §; do not infer mode from branch.
   - § During Development — remove “Humans on `feature/*` only” absolute; mode-neutral or link.
   - SSOT map row — dual mode + config path.
2. **`.cursor/rules/INDEX.md`** — Model A (default) or Model B; config + behavior SSOT paths.
3. **`.cursor/rules/README.md`** — dual mode (was “Model A” only).
4. **`AGENTS.md`** — Defaults bullet: link mode config.
5. **`.claude/rules/git-workflow.md`** — **Strip** Model A-only bullets; pointer only: config + gate §.
6. **Orphan sibling rules** (pointer-only): `.cursor/rules/testing/RULE.md`, `.cursor/rules/cloud-functions/RULE.md` — link gate § / config; no Model-A-only absolutes.

### Gate

- `#mode-aware-branch-gate` exists; gate table present for both modes.
- `feature/*` in `git-workflow/RULE.md` only in Model A sections or the gate table.
- `workflow/RULE.md` hub ≤ ~125 lines; `rg "feature/\*"` on hub is zero or only “see git-workflow”.
- Hub stub **names** `src/config/git-workflow.json`.
- `.claude/rules/git-workflow.md` has no “never commit to develop” absolute.
- Sibling `testing` / `cloud-functions` / `rules/README` pointer edits done.

## Phase 4 — Skills dedup (excluding `start`)

### Goal

Skills link to SSOT; they do not restate branch models. Model B post-push path is explicit. **`start/SKILL.md` is out of this phase** (Phase 5 owns all onboarding edits).

### Per-file edit pattern

Replace inline “verify `feature/*` / stop on `develop`” with:

> Read `src/config/git-workflow.json`. Apply `.cursor/rules/git-workflow/RULE.md` § Mode-aware branch gate.

### Files (live)

| Skill | Special attention |
|-------|-------------------|
| `push/SKILL.md` | **Model A:** PR + babysit PR checks. **Model B:** `git push` `develop`; **`gh run watch`** on branch `test` workflow; **no** `gh pr create`; reinforce fetch/behind-remote stop for shared branch |
| `router/SKILL.md` + `dev-cycle-matrix.md` | Step 10 / “Ready to land”: Model A → PR babysit; Model B → branch workflow watch (**not** PR babysit alone) |
| `bundle-ship/SKILL.md` | Deferred PR step → mode-conditional |
| **`plan/SKILL.md`** | **Special-case (must-fix):** remove absolute “route to `implement` only from `feature/*`”; Model B may implement from `develop` after gate § |
| `feature`, `implement`, `quick-piv`, `validate` | Branch gate § only |
| `finish/SKILL.md` | Model B commits on `develop` — link changesets; **one-agent-per-checkout** concurrency callout for Model B |
| `prime/SKILL.md` | Session start: **read `git-workflow.json` before** branch check |
| `learn/SKILL.md` | If Model-A-only — link to config + gate |

### Gate

- `rg "Model A" .agents/skills` — hits only where mode branching is intentional (`push`, `router`, matrix), plus links — **not** `start` yet (edited in Phase 5).
- `rg "never.*develop|feature/\*.*only" .agents/skills` — no absolute Model-A-only assertions outside mode-conditional blocks (excluding `start` until Phase 5).
- `plan/SKILL.md` does not hard-block `implement` on `develop` when mode is `model-b`.
- Push/router Model B path does not require a PR to exist.

## Phase 5 — Human docs + all `start` onboarding

### Goal

Humans and agents see the same fork-time choice; Cloudflare/ruleset docs cover both paths; **all** `start` edits land here once.

### Steps

1. **`README.md` § Branch workflow** — Model A (feature branches + PR) and Model B (direct `develop`); map to familiar names; link config.

2. **`documentation/DOC_CONTRIBUTING.md`**
   - Release Direction: mode-aware; remove absolute “Never push directly to develop”.
   - **Mid-project migration** section (DECISIONS #9): close/merge open `feature/*` PRs → change ruleset → flip `git-workflow.json` → pull fresh `develop`.

3. **`documentation/DOC_CHANGESETS.md`** — Model B: `finish` on `develop`; concurrent-agent note; cross-link (no duplicated mode tables).

4. **`documentation/DOC_CLOUDFLARE_WORKERS.md`** — Ruleset table: Model A vs Model B `develop` columns; Model B: no `pull_request`; **staging may deploy before CI green**.

5. **`documentation/DOC_AGENT_WORKFLOW_LAYERS.md`** — Dev-cycle step 10 + merge safety mode-aware (pair with Phase 4 matrix).

6. **`documentation/DOC_INDEX.md`** — Row for git workflow mode config.

7. **`start/SKILL.md` § Branch workflow gate** (**single owner — all start edits here**):
   - **Template repo:** skip Model B choice; stay `model-a` (DECISIONS #4).
   - **Fork:** Ask “Feature branches (Model A, default) or direct `develop` (Model B)?”
   - Write `src/config/git-workflow.json`.
   - Model A: existing ruleset + `feature/<name>` instructions.
   - Model B: `git switch develop`; ruleset without PR on `develop`; **do not** create `feature/*`.
   - **Ruleset confirmation gate (Model B):** user confirms (or agent runs `gh api` rulesets/branches) that `develop` has **no** `pull_request`, **has** `required_status_checks` (`test`), `non_fast_forward`, `deletion` — **do not** proceed past onboarding gate on instructions alone.
   - **First-promotion bootstrap (Model B):** document seeding promote workflow onto `main` via local ff once when no PR path exists.

8. Prefer fold mode choice into existing branch gate (no new onboarding task unless needed).

### Gate

- README presents both modes without contradicting `git-workflow/RULE.md`.
- `rg "Never push directly to develop" documentation/DOC_CONTRIBUTING.md` → 0 absolute hits.
- Mid-project migration section exists.
- `start` template path skips Model B; fork Model B path includes ruleset **confirmation** + bootstrap note.
- Cloudflare doc Model B column notes staging-before-CI.

## Phase 6 — Audit + validation + babysit acceptance

### Goal

Prove live tree is SSOT-clean; historical archives untouched; babysit A/B paths verified.

### Steps

1. Grep audit (**include skills and `.claude/rules`**; exclude historical jobs only):

   ```text
   rg -l "feature/\*|Model A only|never push.*develop|gh pr create --base develop|never commit.*develop" \
     --glob "!documentation/jobs/**" \
     .cursor .agents .claude README.md documentation/DOC_*.md AGENTS.md
   ```

   Also triage softer phrases if needed: `feature branch`, unconditional babysit+PR coupling.

   Triage each hit: link to SSOT, mode-conditional, or fix.

2. Run validators:
   - `pnpm validate:structure`
   - `pnpm validate:docs` (links **and** refs — not links-only)
   - `pnpm validate:git-workflow`
   - `pnpm test:classify`

3. **Babysit acceptance table** (manual / agent spot-check — required):

   | # | Mode | Action | Pass criterion |
   |---|------|--------|----------------|
   | 1 | B | Config `model-b` → gate on `develop` | Proceed; no `feature/*` creation instruction |
   | 2 | B | `router` step 10 / Ready to land | Branch workflow watch — not “PR to develop” alone |
   | 3 | B | `push` **Next** | No unconditional `gh pr create`; babysit = push-to-`develop` CI |
   | 4 | A | Same paths with `model-a` | PR + PR babysit unchanged |
   | 5 | Both | `rg babysit .agents/skills` | Mode-conditional or link-to-gate only |

### Gate

- Validators + `test:classify` green.
- Grep triage complete with zero unintended Model-A-only live assertions (**skills included**).
- Babysit acceptance table all rows pass.
- User confirms Model B path in a real or dry-run fork scenario before claiming success (user-test gate).

## Notes during development

- Phase 1: Wired `validate:git-workflow` into both `validate:structure` (chained) and CI; added `scripts/validate-git-workflow.test.cjs` to `test:classify`.
- Phase 2+3: Landed as one unit; hub has zero `feature/*` matches; `.claude/rules` stripped of absolute Model-A-only "never commit to develop".
- Phase 4: `plan` special-case allows `implement` from `develop` in Model B; babysit paths mode-conditional in `push`/`router`/`dev-cycle-matrix`.
- Phase 5: Mid-project switch doc in `DOC_CONTRIBUTING.md`; `start` template skips Model B; Model B ruleset confirmation + bootstrap documented.
- Phase 6: Grep triage — remaining `gh pr create --base develop` hits are Model-A-conditional only. Validators green. Babysit acceptance verified by prose spot-check (rows 1–5).

## Decisions made

| Decision | Context | Outcome | User asked? |
|----------|---------|---------|-------------|
| Plan review | Six-lens critique 2026-08-11 | Accepted; must-fixes folded into phases; Plan review → Done | Yes |
| Protected-file edits | Plan touches `.cursor/rules/**`, `.agents/skills/**`, `ci.yml`, `projectStructure.config.cjs` | Proceed under implement request + plan approval | Yes (implement) |
| Branch for this job | On `develop` at start | Created `feature/git-workflow-model-b` (Model A — this repo stays model-a) | No (gate) |
| `validate:structure` chaining | Need always-run path | `package.json` chains `validate-git-workflow.cjs` after structure validator | No |
