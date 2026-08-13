# Product / scope ledger — git workflow Model B

| # | Topic | Status | Choice | Rationale |
|---|-------|--------|--------|-----------|
| 1 | Mode naming | Closed (clear-winner) | **Model A** (feature branches → `develop`) and **Model B** (direct `develop`) | Matches existing `Model A` language in `git-workflow/RULE.md` and CHANGELOG; avoids inventing a third vocabulary. |
| 2 | Config SSOT location | Closed (clear-winner) | **`src/config/git-workflow.json`** with `{ "mode": "model-a" \| "model-b" }` | Machine-readable, whitelistable, agent-readable at session start; rules/skills **link** here instead of duplicating mode prose. |
| 3 | Default for new forks | Closed (clear-winner) | **`model-a`** | Boilerplate stays team-safe; Model B is explicit opt-in during onboarding. |
| 4 | Template repo (boilerplate maintenance) | Closed (clear-winner) | Stay **`model-a`** | Template contributions benefit from PR review; do not offer Model B toggle for template-only work in `start` § Template repo. |
| 5 | `main` protection | Closed (clear-winner) | **Identical in both modes** — production-only, promote workflow ff-only | User requirement preserved; only daily integration path changes. |
| 6 | `develop` ruleset in Model B | Closed (clear-winner) | **Direct push allowed**; keep `non_fast_forward` + `deletion`; **drop `pull_request`**; keep **`required_status_checks` (`test`)** on push | Quality signal without PR ceremony; aligns with “push to develop deploys staging.” |
| 7 | Feature branches in Model B | Closed (clear-winner) | **Agents do not create `feature/*`**; daily app-code work on `develop` only | Matches user intent. Incidental manual branches are out of scope — agent still reads mode from config. |
| 8 | CI / babysit after push | Closed (clear-winner) | **Model A:** PR to `develop` → babysit PR checks. **Model B:** push `develop` → babysit branch `test` workflow run (`gh run watch`); **no** unconditional PR babysit | Same quality bar; different GitHub surface. External `~/.cursor/skills-cursor/babysit` is PR-centric — Model B must not invoke it as the sole path. |
| 9 | Mid-project mode switch | Closed (clear-winner) | **Document manual migration** in human doc; no automated switch script in v1 | Reduces scope; edges (open PRs, ruleset) need human judgment. |
| 10 | Historical job archives | Closed (clear-winner) | **Leave unchanged** | `documentation/jobs/temp_job_*` and skill-library audits are point-in-time; grep audit ensures live paths only. |
| 11 | Dual-mode vs fork-time scaffold | Closed (asked via review) | **Keep runtime dual-mode** (config + mode-aware gate); accept ongoing dual-mode tax + CI drift guards | Rebel alternative (fork-time single-path scaffold) is simpler long-term but deferred; v1 ships dual-mode with durable enforcement. |
| 12 | Validator / CI | Closed (clear-winner via review) | **`validate:git-workflow` is required** — script + `scripts/*.test.cjs` + wire into `validate:structure` + CI | Schema SSOT without CI is not machine authority. |
| 13 | Staging vs CI timing (Model B) | Closed (clear-winner via review) | **Document explicitly:** Workers Builds may deploy `develop` before `test` is green; production still gated by promote | `required_status_checks` ≠ pre-land PR gate; staging can see broken builds. |
| 14 | Model B concurrency | Closed (clear-winner via review) | **One active agent per checkout on `develop`**; serialize concurrent sessions; do not treat as equivalent to feature-branch isolation | Shared-branch contention is a Model B regression vs Model A. |
| 15 | Plan review acceptance | Closed (asked) | Accept six-lens critique; fold must-fixes into `DEVELOPMENT_PLAN.md`; **Plan review: Done 2026-08-11** | User requested plan update with all must-fixes + strong agreement. |
