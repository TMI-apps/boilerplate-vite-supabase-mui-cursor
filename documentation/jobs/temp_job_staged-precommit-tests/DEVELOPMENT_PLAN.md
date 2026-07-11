# Development plan: Staged pre-commit test optimization

## Summary

- **Goal:** Add a staged-path test classifier + executor with `pnpm test:staged` (dry-run) and `pnpm test:staged:live`, wire **related** Vitest on commit for typical `src/` changes, and reserve the **full** suite for CI (plus `PRECOMMIT_TEST_FULL=1` escape hatch).
- **Why:** Pre-push `pnpm test:run` scales poorly as the suite grows (~8 files today; MILA measured ~101s at ~75 files). Small commits should get fast, trustworthy feedback (~2–10s related) without treating local green as merge-safe. CI (`ci.yml` job `test`) remains the required gate on `develop`.
- **Complexity:** S — tooling-only change (scripts, hooks, docs, package scripts); no app features, migrations, or UI.
- **Plan review:** Done 2026-07-09 — six-lens critique applied; sequencing, classification gaps, doc scope, and full-mode semantics updated below.
- **Scope / constraints:**
  - **In:** Extend `scripts/change-classify.cjs` (shared `PATH_RULES`); add `scripts/test-staged.cjs` + `scripts/test-staged.test.cjs`; `pnpm test:staged` / `test:staged:live`; pre-commit wiring; pre-push test policy change; classifier + executor unit tests; workflow docs; incremental `tsc` on commit full path.
  - **Out:** Replacing CI workflow; Nx/Turborepo adoption; changing Vitest include patterns beyond what related mode needs; user-facing app code; CI sharding (note at >150 files only).
  - **Sequencing invariant (from MILA):** CI full suite + required `test` check already exist — safe to narrow local testing.
  - **Phase order (review fix):** **1 → 3 → 2 → 4+5** (test-infra denylist before executor live mode; docs **same PR** as hooks).
  - **Branch:** Implement on `feature/staged-precommit-tests` off synced `develop` (not `main`/`develop` directly).

## Phase overview

| Phase | Goal | Gate | Status |
|-------|------|------|--------|
| 1 | Test-mode classifier + shared `PATH_RULES` in `change-classify.cjs` | `pnpm test:classify` green; mode/trigger matrix | Done |
| 3 | Tighten light-path + test-infra denylist | Test-infra staged alone → not light + `full` | Done |
| 2 | `test-staged.cjs` executor + dry-run + live scripts + executor tests | Dry-run + unit tests green | Done |
| 4 | Hook wiring (`.husky`, `tsconfig.app.json`) | Pre-commit runs executor; pre-push empty | Done |
| 5 | Docs + agent SSOT updates | Expanded grep gate; merge-safety contract | Done |

## Conflict & compliance

- **Applicable rules:**
  - `workflow/RULE.md` — branch strategy; **Protected Files** (see consolidated consent below).
  - `file-placement/RULE.md` — plan under `documentation/jobs/temp_job_*/`; new scripts under `scripts/*.cjs` (whitelisted).
  - `architecture/RULE.md` — no `src/` feature work; tooling only.
  - `code-style/RULE.md` — keep classifier/executor functions small; complexity limits.
  - `testing/RULE.md` — classifier + executor get `node --test` coverage.
  - `projectStructure.config.cjs` — `scripts/*.cjs` already allowed; no config change expected.
- **File placements (confirmed):**

  | Path | Action |
  |------|--------|
  | `scripts/change-classify.cjs` | Extend — SSOT for light + test modes + `PATH_RULES` |
  | `scripts/test-staged.cjs` | Create — executor |
  | `scripts/test-staged.test.cjs` | Create — executor unit tests (**required**) |
  | `scripts/change-classify.test.cjs` | Extend — classifier cases |
  | `package.json` | Add `test:staged`, `test:staged:live`; extend `test:classify` to run both `*.test.cjs` |
  | `.husky/pre-commit` | Wire executor — **protected** |
  | `.husky/pre-push` | Remove `test:run` and `type-check` |
  | `tsconfig.app.json` | Add `"incremental": true` — **protected** |
  | `documentation/DOC_AGENT_WORKFLOW_LAYERS.md` | Test modes matrix + type-check row |
  | `.cursor/rules/workflow/RULE.md` | Pre-commit test tiers — **protected** |
  | `.cursor/rules/testing/RULE.md` | § Local test authority — **protected** |
  | `.agents/skills/finish/SKILL.md` | § Faster commit — **protected** |
  | `.agents/skills/push/SKILL.md` | CI gate; pre-push no Vitest — **protected** |
  | `.agents/skills/validate/SKILL.md` | Merge authority = `test:run` — **protected** |
  | `.agents/skills/implement/SKILL.md` | `test:staged` during work — **protected** |
  | `.claude/settings.json` | Allow `node scripts/*.cjs` or rely on `pnpm test:staged:live` |

- **Consolidated user consent (before Phase 4+5):** Single approval batch for:
  - `.husky/pre-commit`, `.husky/pre-push`
  - `tsconfig.app.json`
  - `.cursor/rules/workflow/RULE.md`, `.cursor/rules/testing/RULE.md`
  - `.agents/skills/finish/SKILL.md`, `push/SKILL.md`, `validate/SKILL.md`, `implement/SKILL.md`

- **Risks / attention points:**
  - **Related ≠ merge-safe:** Vitest `related` uses import graph only — incomplete coverage vs full suite. Only CI `test` job is merge-safe. Document in finish, validate, push, layers doc.
  - **`vitest --changed` anti-pattern:** Executor uses **staged paths** from `git diff --cached`, not worktree delta.
  - **Windows:** `spawnSync(..., { shell: false })` for argv; validate live spawn on Windows manually.
  - **Silent pass:** Related with 0 on-disk paths or `/No test files found/i` → fallback to **full** (`test:classify` + `test:run`).
  - **`stdio`:** Related spawn uses `stdio: 'pipe'` (not `inherit`) so fallback detection works; still forward output to console.
  - **`src/shared/**`:** Force full — related can miss barrel consumers.
  - **`supabase/functions/**`:** App surface today (structure/arch run) but no Vitest coverage — classify as `full` (runs classify + vitest; document edge-function gap).
  - **Staged `*.test.*`:** Must run (related on test file paths or full) — never `skip-vitest`.
  - **Small suite today:** Speed win modest until growth; value now = architecture + `test:staged` agent ergonomics.
  - **Rollback:** Revert hook commit + restore pre-push `test:run` block if related spawn fails in the wild.

- **Open questions:** None — resolved in **Decisions made** (review 2026-07-09).

- **Standards diversions:**
  - **Intentional:** Full Vitest suite only on CI + `PRECOMMIT_TEST_FULL=1` — matches staged/affected norms; `develop` ruleset preserves safety.
  - **Extend `change-classify.cjs`** — repo SSOT precedent (v0.23.0); shared `PATH_RULES` avoids dual-list drift.

## Pattern & precedent

| Field | Value |
|-------|--------|
| **Capability** | Tiered local test selection: smallest trustworthy set on commit; CI full suite as merge gate. |
| **Precedents** | Jest `--findRelatedTests` + lint-staged; Vitest `related`; Nx/Turborepo affected tasks with dry-run preview. (MILA = internal port note — see Source/context.) |
| **Aspects reviewed** | Operability; async/consistency (local vs CI); test-selection accuracy; hook tier placement; extensibility. |

| Aspect | Aligns / diverges | Risk if we proceed |
|--------|-------------------|-------------------|
| **Operability** | Aligns — `pnpm test:staged` dry-run + `test:staged:live` matches Nx/Turbo preview patterns | Agents confuse dry-run with green tests unless docs state preview-only |
| **Async & consistency** | Aligns — fast local related; CI `test` authoritative | Related green before CI completes — document merge-safety contract |
| **Test-selection accuracy** | Diverges acceptably — custom classifier + graph `related` vs Nx graph | False negatives on cross-feature coupling not in trigger list; mitigated by `src/shared/**` + test-infra → full |
| **Hook tier** | Aligns — narrow local, required CI (today: full suite only pre-push; target: related on commit) | Removing pre-push `test:run` increases reliance on CI discipline |
| **Extensibility** | Risk — bespoke triggers need maintenance | Document trigger extension in layers doc; revisit Nx at >75 files |

| **Verdict** | **Aligns with precedent** |
| **Options** | A: Keep pre-push full (slow). **B: Related on commit + CI full (chosen).** C: CI-only local (too little signal). |

**Selection engine (secondary):** Custom `change-classify.cjs` + Vitest `related` (chosen) vs Nx affected (out of scope until suite pain).

## Source / context

- Prior Ask-mode analysis vs MILA adoption spec.
- MILA port follow-up: `pnpm test:staged` dry-run; full suite on CI + escape hatch; `.husky` needs OK.
- `/review-dev-plan` six-lens critique 2026-07-09.

## Existing functionality (reuse)

| Asset | Role today | Reuse |
|-------|------------|-------|
| `scripts/change-classify.cjs` | Light path SSOT | Add `PATH_RULES`, `classifyTestRun`, refactor `requiresFullPrecommit` |
| `scripts/is-staged-precommit-light.js` | Hook CLI | Unchanged entry |
| `.husky/pre-commit` | lint-staged → feature-docs → light/full validators | Insert test-staged → type-check on full path |
| `.husky/pre-push` | `type-check` + `test:run` | Remove both (type-check moves to pre-commit) |
| `.github/workflows/ci.yml` | `test:classify` + `test:run` + cold `type-check` | Prerequisite — no change |
| `vitest.config.ts` | `tests/setup.ts`, jsdom | `tests/**` as test-infra prefix |
| `pnpm test:classify` | `change-classify.test.cjs` only | Run all `scripts/*.test.cjs` |

## Scope / out-of-scope

| In scope | Out of scope |
|----------|----------------|
| Modes: `related`, `full`, `skip-vitest`, `node-scripts-only` | CI job rename / ruleset change |
| `test:staged` + `test:staged:live` | `lint-staged --concurrent false` (defer) |
| `PRECOMMIT_TEST_FULL=1` | `MILA_PRECOMMIT_TEST_FULL` alias |
| Pre-push removes `test:run` and `type-check` | Incremental tsc in CI |
| Phases 1–3 shippable without hooks | Nx/Turborepo adoption |

## Agent commands (SSOT for Phase 5)

| Intent | Command |
|--------|---------|
| Preview hook selection (no tests run) | `pnpm test:staged` |
| Run what the hook would run (no commit) | `pnpm test:staged:live` |
| Force full locally | `PRECOMMIT_TEST_FULL=1 pnpm test:staged` (PowerShell: `$env:PRECOMMIT_TEST_FULL=1; pnpm test:staged`) |
| CI / merge parity | `pnpm test:classify && pnpm test:run` |
| Staging prerequisite | Classifier reads `git diff --cached` — `git add` before `test:staged` |

---

## Phase 1 — Test-mode classifier + `PATH_RULES`

### Goal

Single SSOT decides **which tests run**, with shared path rules consumed by both `classifyChanges` and `classifyTestRun`.

### Steps

1. At top of `scripts/change-classify.cjs`, add shared **`PATH_RULES`** (single source for all predicates):

   ```js
   const APP_SURFACE_PREFIXES = ['src/', 'supabase/functions/'];
   const FULL_SUITE_EXACT = ['package.json', 'pnpm-lock.yaml', 'projectStructure.config.cjs', '.dependency-cruiser.cjs'];
   const FULL_SUITE_PREFIXES = ['tsconfig.', 'vite.config.', 'vitest.config.'];
   const TEST_INFRA_PREFIXES = ['tests/', '.husky/'];
   const TEST_INFRA_EXACT = [
     'scripts/change-classify.cjs', 'scripts/test-staged.cjs',
     'scripts/is-staged-precommit-light.js',
   ];
   const FULL_SUITE_SRC_THRESHOLD = 25; // env: PRECOMMIT_SRC_THRESHOLD optional follow-up
   ```

   Refactor `requiresFullPrecommit` to use `APP_SURFACE_PREFIXES` + toolchain prefixes (existing behavior preserved).

2. Add helpers built from `PATH_RULES`:
   - `isFullSuiteTriggerFile(path)`
   - `isTestInfraFile(path)` — test-infra ⊆ full-suite triggers
   - `isStagedAppFile(path)` — `src/**/*.ts(x)` + `supabase/functions/**/*.ts`
   - `isStagedSrcFile(path)` — `src/**/*.ts(x)` only (for related path list — **source files, not `*.test.*`**)
   - `isStagedTestFile(path)` — `**/*.{test,spec}.{ts,tsx}`
   - `isSharedKernelFile(path)` — `src/shared/**`
   - `getStagedSrcPaths(staged)` — normalized, deduped source paths

3. Add `classifyTestRun(staged)` decision order:
   1. `PRECOMMIT_TEST_FULL=1` → `full` / `env override`
   2. Empty staged → `skip-vitest` / `no staged files`
   3. Any `isFullSuiteTriggerFile` or `isTestInfraFile` → `full`
   4. Any `isSharedKernelFile` → `full`
   5. Any staged `isStagedTestFile` → `related` with those test file paths (or `full` if count > threshold)
   6. Any `supabase/functions/**` staged (app surface, no Vitest today) → `full`
   7. `> FULL_SUITE_SRC_THRESHOLD` staged `isStagedSrcFile` → `full`
   8. `1..25` staged `isStagedSrcFile` → `related` with source paths
   9. Staged `scripts/**` only → `node-scripts-only`
   10. Else → `skip-vitest`

4. Export new symbols; keep `classifyChanges` backward-compatible until Phase 3.

5. Extend `scripts/change-classify.test.cjs` — matrix cases C1–C12 (see review): env override, each trigger family, shared kernel, 25/26 threshold, `node-scripts-only`, `skip-vitest`, backslash normalization, decision-order precedence.

### Gate

- `pnpm test:classify` passes (classifier tests only until Phase 2 adds `test-staged.test.cjs` to script).

---

## Phase 3 — Tighten light path + test-infra (**before Phase 2 live**)

### Goal

Test-infra and toolchain edits cannot take light path or skip tests.

### Steps

1. Update `classifyChanges`:
   - Any `isTestInfraFile` or `isFullSuiteTriggerFile` → `light: false`
   - `requiresFullPrecommit` uses `APP_SURFACE_PREFIXES` from `PATH_RULES`
   - Keep true `no-src` for e.g. `documentation/` + `scripts/validate-staged.js` (non-infra)

2. Flip `change-classify.test.cjs` case at lines 77–87: test-infra bundle → **not light**. Add L1–L3 cross-tests (`classifyChanges` + `classifyTestRun` agree).

3. Verify: staging `vitest.config.ts` alone → not light, `classifyTestRun` → `full`.

### Gate

- `pnpm test:classify` passes.
- `node scripts/test-staged.cjs --dry-run` (after Phase 2 exists) with staged `.husky/pre-commit` → not light skip; `mode=full`.

---

## Phase 2 — Executor + scripts + executor tests

### Goal

Dry-run preview, live hook execution, and unit-tested orchestration.

### Steps

1. Create `scripts/test-staged.cjs`:
   - Read staged via `getStagedFiles()`.
   - If `classifyChanges(staged).light` → log `pre-commit: test mode=skip-vitest (light path: <kind>)`; exit 0.
   - Else `classifyTestRun(staged)`.
   - **`--dry-run`** (`pnpm test:staged`): log `pre-commit: test mode=<mode> (<reason>)` + related paths; exit 0; no spawn.
   - **Live** (`pnpm test:staged:live` / hook): per mode:
     - **`related`:** filter to existing paths; 0 paths or > threshold → upgrade `full`; `spawnSync('pnpm', ['exec', 'vitest', 'run', 'related', ...paths], { shell: false, stdio: 'pipe' })` — tee stdout/stderr; `/No test files found/i` → run `full`.
     - **`full`:** `pnpm test:classify` then `pnpm test:run` (**matches CI test steps**).
     - **`skip-vitest`:** exit 0.
     - **`node-scripts-only`:** `pnpm test:classify`.
   - Export pure helpers (`buildVitestArgv`, `resolveRunPlan`) for unit tests.
   - Non-zero exit on failure.

2. Create `scripts/test-staged.test.cjs` — cases E1–E8 (mocked spawn): dry-run output, light short-circuit, full upgrade on 0 paths, fallback on “No test files found”, `full` runs classify before vitest (mock order).

3. Update `package.json`:

   ```json
   "test:classify": "node --test scripts/change-classify.test.cjs scripts/test-staged.test.cjs",
   "test:staged": "node scripts/test-staged.cjs --dry-run",
   "test:staged:live": "node scripts/test-staged.cjs"
   ```

4. CI already runs `pnpm test:classify` — no workflow change needed once script includes both test files.

### Gate

| Check | Type |
|-------|------|
| `pnpm test:classify` | Auto |
| Staged `src/` → `pnpm test:staged` prints `mode=related` + paths | Auto |
| Staged `CHANGELOG.md` only → light skip | Auto |
| Staged `vitest.config.ts` → `mode=full` | Auto |
| Live related pass/fail on Windows | Manual |
| `full` live runs classify then vitest | Manual + E8 mock |

---

## Phase 4 — Hook wiring (requires consolidated user consent)

### Goal

Pre-commit runs related tests + type-check on full path; pre-push no longer runs tests or type-check.

> **Protected files:** See consolidated consent in Conflict & compliance. Implement only after explicit user approval.

### Steps

1. **`.husky/pre-commit`** — full path order:

   ```
   lint-staged
   validate:feature-docs:staged
   [light path → exit]
   node scripts/test-staged.cjs
   pnpm type-check          # incremental; moved from pre-push
   validate:structure:staged
   validate:feature-size:staged
   arch:check:staged
   ```

2. **`tsconfig.app.json`:** `"incremental": true` (`tsBuildInfoFile` already set).

3. **`.husky/pre-push`:** Remove `pnpm test:run` **and** `pnpm type-check` blocks. Add comment: full Vitest + cold tsc run in CI only.

4. Optional: `lint-staged --concurrent false` — defer unless Windows ESLint RAM spikes.

### Gate

| Check | Type |
|-------|------|
| Docs-only commit: fast, no Vitest | Manual |
| Single `src/` commit: related runs, &lt;30s Windows baseline | Manual |
| `git push`: no test/type-check output from pre-push | Manual |
| `pnpm test:classify && pnpm test:run` green | Auto |
| Emergency rollback doc in layers § Local git | Doc |

---

## Phase 5 — Documentation + agent SSOT (**same PR as Phase 4**)

### Goal

No stale “tests on push” guidance; merge-safety contract in all high-traffic agent paths.

### Steps — agent SSOT

- [x] `.agents/skills/finish/SKILL.md` — test tiers, `test:staged` / `test:staged:live`, staging prerequisite, related ≠ merge-safe, amend note
- [x] `.agents/skills/push/SKILL.md` — **add** CI `test` job gate; pre-push no Vitest/tsc
- [x] `.agents/skills/validate/SKILL.md` — `test:run` = merge authority; `test:staged` = preview only
- [x] `.agents/skills/implement/SKILL.md` — `test:staged` during work; `test:run` before validate
- [x] `.agents/skills/plan/SKILL.md` — phase gate wording
- [x] `.agents/skills/start/SKILL.md` — verification commands

### Steps — rules & layers

- [x] `.cursor/rules/workflow/RULE.md` — staged test modes; link layers doc
- [x] `.cursor/rules/testing/RULE.md` — § Local test authority (related / full / CI)
- [x] `documentation/DOC_AGENT_WORKFLOW_LAYERS.md` — finish→push table, test-mode matrix, type-check on pre-commit, rollback note, § When you change something
- [x] `.claude/rules/git-workflow.md` — one-line tier pointer
- [x] `.claude/settings.json` — `node scripts/*.cjs` or document `pnpm test:staged:live` only

### Steps — human docs

- [x] `documentation/DOC_CONTRIBUTING.md` — pre-commit hook vs CI parity
- [x] `README.md` — testing / contributing commands

### Steps — enforcement comments

- [x] `.husky/pre-commit` / `.husky/pre-push` header comments
- [x] `scripts/change-classify.cjs` header SSOT pointer

### Layers doc test-mode table

| Mode | When | Runner |
|------|------|--------|
| skip (light) | docs / migrations / no app surface | none |
| related | 1–25 `src/**` source files, no triggers | `vitest run related <paths>` |
| full | triggers, shared, test-infra, edge functions, &gt;25 files, env override | `pnpm test:classify && pnpm test:run` |
| node-scripts-only | `scripts/**` only | `pnpm test:classify` |
| dry-run | `pnpm test:staged` | log only |
| live (no commit) | `pnpm test:staged:live` | same as hook |

`CHANGELOG.md` — **finish** owns entry; do not edit during implement unless user invokes finish.

### Gate

```text
rg -i "tests on push|test:run.*pre-push|pre-push.*test:run|Tests run on .push" .agents .cursor documentation README.md .claude
→ only CHANGELOG / explicit removal notes

pnpm validate:docs
```

Spot-check: finish § Faster commit, push skill, validate tooling pass all mention CI `test` job as merge gate.

---

## Notes during development

- Implemented on `feature/staged-precommit-tests` (2026-07-09). Phases 1+3 combined in `change-classify.cjs`; executor + tests in `test-staged.cjs`.
- Validation fix pass (2026-07-09): executor spawn mocks (E4/E8), arch-validator test-infra denylist, `describe()` grouping, README + testing rule gaps, protected-file consent recorded.
- Gates: `pnpm test:classify`, `pnpm test:run`, `pnpm type-check`, `pnpm validate:docs`, `pnpm validate:structure` — all green after fix pass.
- Windows live spawn for related mode not manually re-verified in this session; unit tests mock spawn paths.

## Decisions made

| # | Topic | Choice | User asked? |
|---|-------|--------|-------------|
| 1 | Phase order | **1 → 3 → 2 → 4+5** (test-infra before live executor; docs same PR as hooks) | No — review-dev-plan consensus |
| 2 | Pre-push type-check | **Move to pre-commit full path only**; remove from pre-push when Phase 4 lands | No — review resolved open Q1 |
| 3 | Env var name | **`PRECOMMIT_TEST_FULL=1`** (repo-neutral) | No — plan default accepted |
| 4 | Executor `full` mode | **`pnpm test:classify` then `pnpm test:run`** — matches CI test steps | No — review must-fix |
| 5 | Executor tests | **`test-staged.test.cjs` required**; wired via extended `test:classify` | No — review must-fix |
| 6 | Hook policy | Related on commit; **drop pre-push `test:run`**; CI `test` job remains gate | No — plan default (Option B) |
| 7 | Phased rollout waiver | **Full plan** — not dry-run-only deferral (Rebel Option A rejected) | No — user accepted full plan updates |
| 8 | Protected-file consent | **Consolidated batch** before Phase 4+5 (husky + tsconfig + rules + skills) | Yes — user `implement` + `fix all` on validation |
| 9 | `test:staged:live` | **Add package script** for hook parity without committing | No — review agent-ops must-fix |
| 10 | Plan review | **Done 2026-07-09** | Yes — user: "apply plan updates" |
| 11 | Implementation | **Done 2026-07-09** on `feature/staged-precommit-tests` | Yes — user: "implement" |
| 12 | Scripts quote style | **Single quotes** for `scripts/*.cjs` (existing convention; Prettier scopes `src/` only) | Yes — user: "fix all" |
| 13 | `PRECOMMIT_SRC_THRESHOLD` | **Runtime env override** via `getFullSuiteSrcThreshold()` + unit test | Yes — user: "fix all" |
| 14 | Validation fixes | **All findings addressed** — executor mocks, denylist, docs, scope noise reverted | Yes — user: "fix all" |
