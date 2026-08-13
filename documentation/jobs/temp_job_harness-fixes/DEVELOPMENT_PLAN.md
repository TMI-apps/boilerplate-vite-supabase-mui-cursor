# Development plan: Harness structural fixes (`temp_job_harness-fixes`)

## Summary

- **Goal:** Close the broken harness pointers deferred from `temp_job_harness-skills` Phase 7: restore the git-workflow mode SSOT chain (`git-workflow.json` → mode-aware rule → `AGENTS.md`), add the missing structure-validation user doc, and land a clean merge of `develop` (Model B, PR #50) onto the harness-skills line in **one integrated PR** that supersedes PR #51.
- **Why:** `feature/harness-skills` (`34de46e`) was cut before `develop` received Model B (`8d6da35`). `AGENTS.md` already tells every agent to read `src/config/git-workflow.json` and apply § Mode-aware branch gate — but neither the file nor that rule section exists on this branch. `documentation/PROJECT-STRUCTURE-VALIDATION.md` is referenced from two always-on rules and tooling but was never authored. PR #51 (`feature/harness-skills` → `develop`) is **CONFLICTING** until this reconciliation runs.
- **Complexity:** **M** — merge conflict resolution across ~25 overlapping files + full `RULE.md` → `RULE.mdc` rename collision, one new documentation file, validator whitelist cleanup; no `src/` app code.
- **Plan review:** Done 2026-08-13 — six-lens critique folded into phases below
- **Scope / constraints:**
  - **In:** consolidated protected-file consent; merge `origin/develop` + **atomic** conflict resolution; Model B SSOT on `.mdc` paths; mode-neutral `workflow/RULE.mdc` hub; create `documentation/PROJECT-STRUCTURE-VALIDATION.md`; fix `architecture.md` → `ARCHITECTURE.md` path contract; remove `ALLOWED_MISSING` band-aids; repo-wide stale `RULE.md` grep; close PR #51 when opening integrated PR; `validate` impl-full + CI parity before finish.
  - **Out:** D12 always-on context restructure (2,044 lines — separate job); optional `pnpm harness:scan` alias; editing historical `documentation/jobs/**` archives; `.husky/pre-commit` CHANGELOG comment (D4 — non-issue).
  - **Ledger:** [`DECISIONS.md`](./DECISIONS.md) (D1–D6).

## Phase overview

| Phase | Goal | Gate | Status |
|-------|------|------|--------|
| 0 | Pre-implement: branch, consent, `validate` plan-review | Consent recorded; `validate` plan-review green | Done |
| 1 | Merge `develop` + resolve all conflicts atomically | Model B SSOT chain truthful; no `RULE.md` on disk; merge commit pushable | Done |
| 2 | Structure doc + `ALLOWED_MISSING` cleanup | Doc exists; both allowlist entries resolved; `validate:docs` green | Done |
| 3 | CI parity audit, backlog, PR handoff | `validate` impl-full green; `harness_scan` targets clean; user confirms | In progress — CI + scan + stale RULE.md sweep done; follow-up PR after #52 |

---

## Conflict & compliance

### Applicable rules

| Rule | Bearing |
|------|---------|
| `.cursor/rules/git-workflow/RULE.mdc` | Primary merge target — develop's mode-aware rewrite must land in `.mdc`, not resurrect `RULE.md` |
| `.cursor/rules/workflow/RULE.mdc` | **Deliverable:** § Branch gate stub mode-neutral (links config + gate §) — not verification-only |
| `.cursor/rules/file-placement/RULE.mdc` | New doc at `documentation/PROJECT-STRUCTURE-VALIDATION.md` (subdirectory — no `DOC_` prefix) |
| `.cursor/rules/architecture/RULE.mdc` | Doc links to config/validators; live refs must use `ARCHITECTURE.md` (root), not lowercase `architecture.md` |
| `.cursor/rules/agent-behavior/RULE.mdc` | Protected files — **batch consent before merge resolution** (see Phase 0) |
| `.cursor/rules/testing/RULE.mdc` | `validate-git-workflow.test.cjs` in `test:classify`; CI parity (`test:run`, `type-check`) before finish |

### File placements

| Path | Action |
|------|--------|
| `src/config/git-workflow.json` | Restore from develop (merge) |
| `src/config/git-workflow.README.md` | Restore from develop; **retarget** behavior SSOT path to `RULE.mdc` (develop points at `RULE.md`) |
| `scripts/validate-git-workflow.cjs` + `.test.cjs` | Restore from develop (merge) |
| `.cursor/rules/git-workflow/RULE.mdc` | **Manual reconcile** — develop's mode-aware body → `.mdc` + frontmatter |
| `.cursor/rules/workflow/RULE.mdc` | **Rewrite** § Branch gate stub — mode-neutral |
| `.cursor/rules/testing/RULE.mdc`, `.cursor/rules/cloud-functions/RULE.mdc` | Port develop's Model B pointer deltas into `.mdc` |
| `.github/workflows/ci.yml` | Merge — verify `validate:git-workflow` step + no dropped CI steps |
| `documentation/PROJECT-STRUCTURE-VALIDATION.md` | **Create** — lean user guide |
| `scripts/validate-cursor-doc-references.js` | **Edit** — remove resolved paths from `ALLOWED_MISSING` |
| `documentation/jobs/harness/BACKLOG.md` | **Edit** — mark structural fixes consumed |

### Risks / mitigations

| # | Risk | Mitigation |
|---|------|------------|
| 1 | **Rename war** — develop has 14× `RULE.md`; harness-skills has 14× `RULE.mdc` (Git delete/add, not edit) | Mechanical recipe: for `git-workflow`, `workflow`, `testing`, `cloud-functions` take develop body → write `RULE.mdc` → delete `RULE.md`; then repo-wide `rg 'rules/[^/]+/RULE\.md([^c]|$)'` on live paths |
| 2 | **~25 files** overlap both branches (not ~12) | Conflict map in § Notes; harness wins `.mdc` paths + develop wins Model B prose |
| 3 | **Hub drift** — `workflow/RULE.mdc` hardcodes Model A (always-on) | Phase 1 **deliverable** — rewrite stub, then grep always-on rules for `feature/*` / "Model A only" |
| 4 | **`validate:git-workflow` scope** — JSON enum only; does not prove rule/AGENTS alignment | Phase 1 manual gates: `rg "Mode-aware branch gate"`, `Test-Path git-workflow.json`, `validate:docs` |
| 5 | **PR #51 race** — open CONFLICTING PR duplicates merge work | **D6:** one integrated PR supersedes #51; close #51 when opening harness-fixes PR |
| 6 | **CI red during merge** — expected on feature branch until Phase 1 completes | Do not open PR or run `finish` until Phase 3 gates green |
| 7 | **Protected-file consent too narrow** | Phase 0 batch list: `.cursor/**`, `.agents/skills/**`, `.github/workflows/ci.yml`, `projectStructure.config.cjs` |
| 8 | **`.claude/rules/git-workflow.md`** still Model A-only | Phase 1 reconcile — strip hardcoded bullets; pointer + config + gate § only |
| 9 | **`architecture.md` allowlist** — root `ARCHITECTURE.md` exists; lowercase ref is wrong | Phase 2: retarget live refs to `ARCHITECTURE.md`; remove from `ALLOWED_MISSING` |

### Standards diversions

None planned. Phase 0 merge-with-conflict-resolution on a feature branch (CI red until resolved) is acceptable; integration commits to `develop` stay green-gated at PR time only.

---

## Pattern & precedent

| Field | Value |
|-------|--------|
| **Capability** | Repair broken instruction pointers and reconcile diverged feature branches before integration |
| **Precedents** | Trunk/integration merge before follow-up fixes (GitHub Flow); policy-as-code triplets (machine config + narrative rule + entrypoint, validated in CI); docs-as-code link integrity (`validate:docs` / markdown link checkers) |
| **Aspects reviewed** | SSOT chain integrity · merge-before-patch · doc placement vs bloat · CI green contract · ALLOWED_MISSING governance · multi-surface instruction sync |
| **Findings** | **Aligns:** merge-before-patch; restore config chain; author missing referenced doc. **Acceptable tradeoff:** feature-branch CI red between merge start and resolution (not on `develop`). **Residual:** `validate-git-workflow` is shape-only — manual cross-surface checks required |
| **Verdict** | `Aligns with precedent` |
| **If non-standard: options** | No structural waiver. Acceptable tradeoffs: atomic merge session (not phased conflict markers); spot-check + grep vs automated cross-surface sync lint |

---

## Phase 0 — Pre-implement gates

### Goal

Branch exists; protected-file consent recorded; repo-rule plan validation green.

### Steps

1. Create `feature/harness-fixes` from `feature/harness-skills` (if not already on it).
2. **Consolidated protected-file consent (R2):** ask user to approve edits to conflict-expected paths in one batch:
   - `.cursor/rules/**` (all 14 rule files)
   - `.agents/skills/**` (merge-overlap skills: `finish`, `push`, `start`, `validate`, `router`, `plan`, `learn`, `bundle-ship`, `implement`, etc.)
   - `.github/workflows/ci.yml`
   - `projectStructure.config.cjs`
3. Record consent in **Decisions made** (user asked? = Yes).
4. Run **`validate` plan-review** on this plan document; resolve blockers before Phase 1.

### Gate

- Consent row in Decisions made.
- `validate` plan-review: no blockers (or waivers recorded).

---

## Phase 1 — Merge `develop` + reconcile atomically

### Goal

Single session: merge `origin/develop`, resolve every conflict, commit a pushable tree with Model B SSOT on `.mdc` paths. **No intermediate commit with conflict markers.**

### Steps

1. `git fetch origin develop && git merge origin/develop` (no squash).
2. Record conflict paths in § Notes (expect ~25 files): rules tree (rename war), `AGENTS.md`, `package.json`, `projectStructure.config.cjs`, `.github/workflows/ci.yml`, skills listed in Risk #1, `DOC_CONTRIBUTING`, `DOC_CHANGESETS`, `DOC_AGENT_WORKFLOW_LAYERS`, `README.md`, `.claude/rules/git-workflow.md`.
3. **Rule reconcile (mechanical):** for each of `git-workflow`, `workflow`, `testing`, `cloud-functions`:
   - Take develop's **body** (Model B prose where applicable).
   - Write into **`RULE.mdc`** with harness YAML frontmatter.
   - Delete any resurrected `RULE.md`.
4. **`git-workflow/RULE.mdc`:** ensure § Mode-aware branch gate, Model A/B tables, verification checklist; YAML `description` mentions Model A / Model B.
5. **`workflow/RULE.mdc` (R5 deliverable):** rewrite § Branch gate stub to link `src/config/git-workflow.json` + `git-workflow/RULE.mdc` § Mode-aware branch gate — **no** hardcoded `feature/*` / "Full Model A rules" in always-on context.
6. Restore and fix artifacts from develop:
   - `src/config/git-workflow.json` (`{ "mode": "model-a" }`)
   - `src/config/git-workflow.README.md` — retarget behavior SSOT to `.cursor/rules/git-workflow/RULE.mdc` (not `RULE.md`)
   - `scripts/validate-git-workflow.cjs` + `scripts/validate-git-workflow.test.cjs`
   - `package.json` → `validate:git-workflow`; chained in `validate:structure`
   - `.github/workflows/ci.yml` → standalone `pnpm validate:git-workflow` step; **verify no CI steps dropped** during conflict resolution
   - `projectStructure.config.cjs` → `git-workflow.json` whitelisted under `src/config/`
7. Reconcile overlapping skills/docs — **harness wins `.mdc` paths**; **develop wins Model B prose**. Required pass (not spot-check only): `finish`, `push`, `start`, `validate`, `router`, `plan`, `DOC_CONTRIBUTING`, `DOC_AGENT_WORKFLOW_LAYERS`, `.claude/rules/git-workflow.md`, `AGENTS.md` (catalog follows YAML; Defaults prose matches restored chain).
8. **Stale-path sweep (R6):** `rg 'rules/[^/]+/RULE\.md([^c]|$)'` over live paths (exclude `documentation/jobs/**`, `CHANGELOG.md`, historical archives); fix or document every hit. Include `git-workflow.README.md`, `documentation/jobs/harness/REGISTRY.md` if stale.
9. `git add` + merge commit when tree is clean.
10. Run `pnpm validate:git-workflow && pnpm test:classify`.

### Gate

- Merge commit exists; **no conflict markers**; branch is pushable.
- `Test-Path src/config/git-workflow.json` → true.
- `rg "Mode-aware branch gate" .cursor/rules/git-workflow/RULE.mdc` → hit.
- `rg 'rules/[^/]+/RULE\.md([^c]|$)' .cursor/rules` → zero.
- Repo-wide live-path stale `RULE.md` grep → zero (or documented exceptions in § Notes).
- `workflow/RULE.mdc` § Branch gate has no Model-A-only branch patterns.
- `pnpm validate:git-workflow` exit 0; `pnpm test:classify` green.

---

## Phase 2 — Structure doc + allowlist cleanup

### Goal

Every live reference to `documentation/PROJECT-STRUCTURE-VALIDATION.md` resolves; `ALLOWED_MISSING` band-aids removed for fixed paths.

### Steps

1. Create `documentation/PROJECT-STRUCTURE-VALIDATION.md` (~100–150 lines max):
   - What `pnpm validate:structure` / `validate:structure:staged` do
   - SSOT: `projectStructure.config.cjs` + `scripts/project-structure-validator.js`
   - When agents/humans must run it (before creating files, pre-commit full path)
   - Common failure patterns + fix (wrong folder, missing whitelist entry, `temp_` convention pointer)
   - Links to `.cursor/rules/file-placement/RULE.mdc`, `.cursor/rules/architecture/RULE.mdc`, `documentation/DOC_CONTRIBUTING.md` — **no duplicated rule text**
2. **`architecture.md` disposition (R6):** retarget live references (`architecture/RULE.mdc`, `file-placement/RULE.mdc`, script headers if needed) from lowercase `architecture.md` to root **`ARCHITECTURE.md`**; remove `architecture.md` from `ALLOWED_MISSING`.
3. Remove `"documentation/PROJECT-STRUCTURE-VALIDATION.md"` from `ALLOWED_MISSING` in `scripts/validate-cursor-doc-references.js`.
4. `pnpm validate:docs && pnpm validate:structure && pnpm test:classify` (re-run classify after validator edit).

### Gate

- `documentation/PROJECT-STRUCTURE-VALIDATION.md` exists.
- `ALLOWED_MISSING` contains neither `PROJECT-STRUCTURE-VALIDATION.md` nor `architecture.md`.
- `validate:docs` + `validate:structure` + `test:classify` green.

---

## Phase 3 — CI parity, audit, PR handoff

### Goal

Merge-safe validation; harness scan confirms fixes; backlog updated; integrated PR supersedes #51.

### Steps

1. **`harness_scan` audit:** run `node .agents/skills/align-harness/scripts/harness_scan.cjs`; inspect JSON output — assert **no `missingRefs`** entries for `git-workflow.json`, `PROJECT-STRUCTURE-VALIDATION.md`, or `git-workflow/RULE.md` (do not rely on exit code alone — scanner is report-only).
2. **CI parity block (R4):**
   - `pnpm test:classify && pnpm test:run`
   - `pnpm type-check`
   - `pnpm validate:git-workflow`
   - `pnpm validate:docs && pnpm validate:structure`
   - `pnpm lint`
   - `pnpm arch:check` (cheap insurance after `package.json` / CI merge)
3. Run **`validate` impl-full** on the full diff (tooling + plan-compliance).
4. Update `documentation/jobs/harness/BACKLOG.md` — mark structural fixes consumed; keep D12 restructure + optional `pnpm harness:scan` alias open.
5. **PR handoff (R3 / D6):** push `feature/harness-fixes`; open PR to `develop`; **close PR #51** as superseded (link new PR in close comment).
6. BACKLOG link to this job suffices — do not edit closed `temp_job_harness-skills` plan unless user explicitly approves.

### Gate

- `harness_scan` report: targeted `missingRefs` absent for Phase 1–2 fixes.
- CI parity commands above all green.
- `validate` impl-full: no blockers (or waivers in Decisions made).
- PR #51 closed; integrated PR open.
- User confirms harness instructions read correctly ← **pending** (agent-behavior gate).

---

## Notes during development

- [Phase 3] `harness_scan`: no missingRefs for `git-workflow.json`, `PROJECT-STRUCTURE-VALIDATION.md`, or `git-workflow/RULE.md` (other missingRefs pre-existing / out of scope).
- [Phase 3] CI parity block green (`test:classify`, `test:run` 72, type-check, validate:*, lint 0 errors, arch:check).
- [Phase 3] `validate` impl-full: no blockers; fixed residual live-path `RULE.md` shorthand (validate skill, layers doc, REGISTRY, rules README/INDEX) + dropped `architecture.md` / `RULE.md` whitelist entries in `projectStructure.config.cjs`.
- [Phase 3] PR #51 CLOSED; main harness landed via squash PR #52; residual RULE.md sweep needs follow-up PR onto `develop`.

## Decisions made

Impl-time only (`implement` fills). Product/scope forks → sibling [`DECISIONS.md`](./DECISIONS.md).

| # | Topic | Choice | User asked? |
|---|-------|--------|-------------|
| — | Merge conflict resolutions | _(per file — implement fills)_ | |
| R1 | Phase 0+1 collapse | **Folded** — Phase 1 is atomic merge+resolve; no conflict-marker checkpoint | — |
| R2 | Protected-file consent | **Folded** — Phase 0 batch consent before Phase 1 (paths: `.cursor/rules/**`, `.agents/skills/**`, `.github/workflows/ci.yml`, `projectStructure.config.cjs`) | Yes (`implement`) |
| R3 | PR #51 | **Folded** — Phase 3 step 5 closes #51 (already CLOSED when Phase 3 ran); #52 landed main body | — |
| R4 | Phase 3 CI parity | **Folded** — Phase 3 step 2 + `validate` impl-full | — |
| R5 | Hub mode-neutral | **Folded** — Phase 1 step 5 deliverable | — |
| R6 | Stale-path + allowlist | **Folded** — Phase 1 step 8 + Phase 2 step 2 + Phase 3 residual `RULE.md` sweep | — |
