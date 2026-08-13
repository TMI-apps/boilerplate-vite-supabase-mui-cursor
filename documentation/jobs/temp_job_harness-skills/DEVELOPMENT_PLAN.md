# Development plan: Harness maintenance skills (`align-harness`, `update-harness`, `learn` v2)

## Summary

- **Goal:** Give the repo a maintained process for its own agent harness: migrate rules to `.mdc` (the extension Cursor loads), add `align-harness` (harness-wide coherence audit), `update-harness` (external content intake), and a removal-first `learn` v2 with finish-pipeline hooks.
- **Why:** `improve-skill-library` only covers `.agents/skills/`. `AGENTS.md`, `.cursor/rules/**`, INDEX, `.claude/rules/`, `ARCHITECTURE.md`, layers doc, and subagent briefs drift with no owner. BACKLOG queued this work; `temp_job_agents-md-complete-ruleset` D9 deferred AGENTS↔YAML drift here.
- **Complexity:** **L** — 14-file `.mdc` migration (**228** `RULE.md` path references across **~65** live files per repo scan), three skills authored/rewritten, spine rewiring, two protected config changes, live `align-harness` run, capped in-job fixes (D17).
- **Plan review:** Done 2026-08-12 (`review-dev-plan` six-lens synthesis incorporated below)
- **Scope / constraints:**
  - **In:** `.md` → `.mdc` + D14 Option C (`AGENTS.md` catalog-only for auto-loaded rules); `align-harness` + `harness_scan` (D13/D20); `update-harness` + inbox; `learn` v2 + hooks; spine wiring; Phase 6 audit; Phase 7 **capped** apply (D17).
  - **Out:** Full Phase 7 structural fixes → `temp_job_harness-fixes` follow-up. Always-on line restructure (D12 advisory only). No CI gate for harness checks (D6). No `src/` app code.
  - **Ledger:** [`DECISIONS.md`](./DECISIONS.md) (D1–D20 closed).

### Pre-implement gates (mandatory)

| Gate | When | Pass criteria |
|------|------|---------------|
| **Plan review** | Before `implement` | This document reviewed; Summary `Plan review: Done` |
| **`validate` plan-review** | Before `implement` | Repo-rule compliance on plan; blockers resolved or waived in **Decisions made** |
| **D18 consent** | Start of `implement` | Job-level protected-file scope recorded in **Decisions made** |
| **D19 branch** | Start of Phase 1 | Dedicated `feature/harness-skills`; conflicting AGENTS branch work landed or stashed |
| **`validate` impl-full** | Before `finish` | Full diff passes validate after all phases |

## Phase overview

| Phase | Goal | Gate | Status |
|-------|------|------|--------|
| 0 | Pre-implement gates + D18/D19 | Consent logged; branch clean | Done |
| 1 | Rules `RULE.md` → `RULE.mdc`; D14 Option C; validators + live refs updated | Loadability checklist passed; `validate:structure` + `validate:docs` + `pnpm test:classify` green; live `RULE.md` grep zero | Done |
| 2 | `align-harness` (rename + widen) + `harness_scan` + entry-points manifest | Script + unit test green; `improve-skill-library` live refs zero | Done |
| 3 | `update-harness` + gitignored `.agents/harness-inbox/` | Dry-run + confirm-apply scenarios pass | Done |
| 4 | `learn` v2 + mistake capture + finish/bundle-ship/push hooks | Clean-session no-op + correction-session offer verified | Done |
| 5 | Spine: router tiebreaks, layers doc, job artifacts | Router lists each skill once; `validate:docs` green | Done |
| 6 | First `align-harness` run → tiered issue table | User selects fixes; no edits before choice | In progress |
| 7 | **Capped** apply (≤5 blocking rows) + no-loss pass | `MISSING: 0`; remainder → follow-up job plan | Pending |

---

## Conflict & compliance

**Applicable rules**

| Rule | Bearing on this plan |
|------|----------------------|
| `.cursor/rules/file-placement/RULE.md` | Validate paths against `projectStructure.config.cjs` before creation |
| `.cursor/rules/architecture/RULE.md` | Structure-config changes need explicit approval (D18) |
| `.cursor/rules/agent-behavior/RULE.md` | Protected files; user-confirmed success; D18 scoped consent |
| `.cursor/rules/git-workflow/RULE.md` | Model A — `feature/*` branch (D19) |
| `.cursor/rules/testing/RULE.md` | `harness_scan` unit test; register in `package.json` `test:classify` or explicit `node --test` in gate |
| `.cursor/rules/workflow/RULE.md` | Changelog in `finish` only |

**File placements**

| Path | Status |
|------|--------|
| `.cursor/rules/*/RULE.mdc` (14 files) | **Needs config change** — whitelist `RULE.mdc`; keep `RULE.md` during transition |
| `.agents/skills/align-harness/` (`SKILL.md`, `references/`, `scripts/`) | Confirmed |
| `.agents/skills/update-harness/` | Confirmed |
| `.agents/harness-inbox/**` | **Needs config change** — extend `.agents` whitelist (D18) |
| `.gitignore` | Confirmed — **protected**; D18 approval required (Phase 3) |
| `documentation/jobs/harness/` | Confirmed — date-prefixed update reports only (one nesting level) |

**Risks / mitigations**

| # | Risk | Mitigation |
|---|------|------------|
| 1 | **Rename blast radius** — 228 refs / ~65 live files (`AGENTS.md` 20, `rules-registry.md` 14, skills, configs) | Dependency-order sweep; historical `documentation/jobs/**` + `CHANGELOG.md` untouched |
| 2 | **Validators silently skip `.mdc`** | Update `validate-cursor-doc-references.js` + `validate-markdown-links.js` **before** `git mv`; gate asserts `.mdc` coverage |
| 3 | **Phase 1 step-change** — 2,044 always-on lines go live | Loadability gate **blocking**; record effective budget per tool in § Notes |
| 4 | **D14 double-load** | **Resolved — Option C:** drop five `@` rule imports; Cursor loads via `.mdc`; Claude/Codex via catalog rows |
| 5 | **Phase 7 scope creep** | D17 cap; escalation → `temp_job_harness-fixes` |
| 6 | **Concurrency** | D19 — dedicated branch; no parallel harness agents |
| 7 | **Inbox trust boundary** | Pre-flight: secret scan, never execute inbox scripts, untrusted input (Phase 3) |
| 8 | **Router overlap** | Phase 5 tiebreaks **before** Phase 6 live run |
| 9 | **`harness_scan` rot** | D20 contract + optional `documentation/jobs/harness/entry-points.yaml` manifest |

**Standards diversions (accepted)**

- No CI/pre-commit gate for harness scan (D6) — docs-as-code stacks normally pair lint + CI; we accept drift between manual runs. Mitigation: optional future `pnpm harness:scan` alias (non-blocking).
- Gitignored inbox (D3) — mitigated by committed report (D16).
- Advisory budget only (D12) — follow-up restructure job.

---

## Pattern & precedent

| Field | Value |
|-------|--------|
| **Capability** | Repo-maintained harness coherence, external intake, threshold-triggered lessons |
| **Precedents** | Anthropic progressive disclosure; docs-as-code lint + two severity tiers; changesets committed fragments; knip mark-and-sweep orphans; Codex/Cursor feedback-loop for `AGENTS.md`; Google `third_party` provenance |
| **Aspects reviewed** | Context budget · script/judgment split · intake lifecycle · retrospective triggers · continuous compliance · multi-tool loading |
| **Findings** | **Aligns:** removal-first `learn`, tiered issue table, batched confirmation. **Corrected:** D13 script, D15 batch, D16 provenance, D14 Option C. **Accepted divergence:** no CI gate; gitignored inbox |
| **Verdict** | `Acceptable product-specific` — valid after D14 closed and enforcement waiver named |

### Verified harness facts (2026-08-12)

| Fact | Value |
|------|-------|
| `.mdc` files in `.cursor/rules` | **0** (all 14 are `RULE.md`) |
| `alwaysApply: true` payload | **2,044 lines** across 8 rules |
| `RULE.md` path references | **228** matches, **~65** files (live + historical) |
| `AGENTS.md` `@` imports today | 5 rule bodies + `INDEX.md` — five bodies **removed** by D14 Option C |

### Precedent risks — resolution

| id | Risk | Level | Resolution |
|----|------|-------|------------|
| HIGH-1 | `.md` rules ignored by Cursor | HIGH | **D11** — `.mdc` rename |
| HIGH-2 | 2,044 always-on lines vs 32 KiB cap | HIGH | **D12** — advisory measure; follow-up restructure |
| HIGH-3 | Double-load via `@` + `.mdc` | HIGH | **D14 Option C** — drop five `@` imports; catalog rows for Claude/Codex |
| MED-1 | Gitignored inbox | MEDIUM | **D16** — committed report SSOT |
| MED-2 | Per-file confirmation fatigue | MEDIUM | **D15** — batch confirm |
| MED-3 | Judgment-only audit | MEDIUM | **D13/D20** — light `harness_scan` |

### Design rules (every phase)

- Issue table: **blocking** vs **advisory** (budget always advisory).
- **Supersession over deletion** for removals (no-loss pass compatible).
- Foreign content = unreferenced **AND** (broken internal refs **OR** no provenance).
- `learn` hook = no-op on clean sessions; lesson is the edit, not a log file.
- Mechanical lessons → enforcement (`validate:structure`, `harness_scan`, etc.), not prose.

---

## Phase 0 — Pre-implement gates

### Goal

Consent, branch, and validation gates satisfied before any file edits.

### Steps

1. Record **D18** scoped protected-file consent in **Decisions made** (below).
2. **D19:** land/stash `feature/agents-md-portable-catalog` AGENTS work; create/checkout `feature/harness-skills`.
3. Run **`validate` plan-review** on this document; resolve blockers.
4. Confirm **Plan review: Done** in Summary (already set).

### Gate

All pre-implement gates table rows green.

---

## Phase 1 — `.md` → `.mdc` rule migration + D14 Option C

### Goal

14 rules use `.mdc`; validators cover them; D14 avoids Cursor double-load; Claude/Codex retain on-demand catalog access.

### Steps

1. **Job-level approval (D18):** `projectStructure.config.cjs` whitelist for `RULE.mdc` (keep `RULE.md` during transition).
2. **Validators first (before any `git mv`):**
   - `scripts/validate-cursor-doc-references.js` — `RULE.mdc` shorthand + `allowedRefExt`; keep `RULE.md` during transition.
   - `scripts/validate-markdown-links.js` — scan `.mdc` under `.cursor/rules`.
   - Add fixture or manual check: broken link in a test `.mdc` is caught.
3. `git mv` each `.cursor/rules/<category>/RULE.md` → `RULE.mdc` (14 files); frontmatter unchanged.
4. **`AGENTS.md` (D14 Option C):**
   - Update catalog rows: paths → `RULE.mdc`; bodies SSOT line → `RULE.mdc`.
   - **Remove** `@` imports for: `architecture`, `file-placement`, `code-style`, `workflow`, `agent-behavior`.
   - **Keep** `@.cursor/rules/INDEX.md` (deep topic map, not a rule body).
   - `testing`, `debugging`, `security`: catalog rows only (no `@` — unchanged).
5. Update live references (dependency order): `featureBudgets.config.cjs` → `AGENTS.md` (done) → `INDEX.md` + `README.md` → rule cross-refs → `.agents/skills/**` (`rules-registry.md`, `learn`, `plan`, `router`, etc.) → `.claude/rules/*` → `README.md`, `ARCHITECTURE.md`, `DOC_*.md` → configs/scripts.
6. Leave `documentation/jobs/**` (historical) and `CHANGELOG.md` unchanged.
7. **Pre-commit path:** confirm staged `.cursor/**/*.mdc` still routes through docs classifier → `validate:docs`. Prettier: N/A for `.mdc` today (only `src/**`) — document as acceptable.
8. **Loadability checklist (blocking, user-confirmed):**
   - Fresh Cursor session: 8 `alwaysApply: true` rules active.
   - No duplicate bodies from removed `@` imports.
   - Record **effective always-on line count per tool** (Cursor vs Claude/Codex catalog-only) in § Notes.

### Gate

- Loadability checklist passed.
- `pnpm validate:structure && pnpm validate:docs && pnpm lint` green.
- `rg 'rules/[a-z-]+/RULE\.md'` over live paths (exclude `documentation/jobs/**`, `CHANGELOG.md`) → **zero** hits.
- Validator regression: `.mdc` files are scanned.

---

## Phase 2 — `align-harness` (rename, widen, deterministic pass)

### Goal

`improve-skill-library` → `align-harness` with harness-wide scope, `harness_scan` (D13/D20), tiered issue table, optional quick/full modes.

### Steps

1. `git mv .agents/skills/improve-skill-library .agents/skills/align-harness`.
2. Rewrite `SKILL.md`: `name: align-harness`; observable triggers; negative space vs `standards-align`, `create-skill`, `rule-quality`, `learn`, `consolidate`, `update-harness`.
3. Add `documentation/jobs/harness/entry-points.yaml` — roots for scan + Lens 8 (`AGENTS.md`, `router/SKILL.md`, domain globs). **SSOT for discovery** — script reads this, not hardcoded paths (D20).
4. Add `.agents/skills/align-harness/scripts/harness_scan.cjs` (D13/D20):
   - Input: `entry-points.yaml`.
   - Output: JSON/markdown facts — line counts vs budgets (advisory), always-on total vs 32 KiB, unresolved links, frontmatter parse, orphans (mark-and-sweep from entry points).
   - **Non-goals:** no `projectStructure` import; no verdicts; fail soft on unknown shapes.
5. Unit test: `scripts/harness_scan.test.cjs` **or** colocated test — register in `package.json` `test:classify` list (repo `scripts/` tests are not auto-discovered from skill folder).
6. Add `references/domain-*.md`, `references/foreign-content.md`.
7. Extend `references/subagent-briefs.md`: Lenses 6–8 (catalog drift, foreign, loadability); orient covers all D2 domains.
8. Issue table contract: `# | tier | domain | where | issue | why | resolution | SSOT owner`.
9. **Modes:** `--quick` (scan + lenses 3,4,6) vs `--full` (Phase 0 ledger + all lenses). Default first run: `--full`; periodic: `--quick`.
10. Escalation: >handful of files or structural SSOT move → stop, run `plan`.
11. Sweep live `improve-skill-library` pointers.

### Gate

- `node .agents/skills/align-harness/scripts/harness_scan.cjs` exits 0 with report.
- `pnpm test:classify` green (includes scan test).
- `pnpm validate:structure && pnpm validate:docs` green.
- Live `improve-skill-library` grep → zero.

---

## Phase 3 — `update-harness` + `.agents/harness-inbox/`

### Goal

Drop external harness content → batched disposition report → confirmed apply; inbox pre-flight safety.

### Steps

1. **D18 approval:** `projectStructure.config.cjs` — `.agents/harness-inbox/**` nested files allowed.
2. **D18 approval:** `.gitignore` — ignore `.agents/harness-inbox/*`, negate `README.md`.
3. `.agents/harness-inbox/README.md` — drop rules, origin line required, gitignored, cleared after ingest.
4. `update-harness/SKILL.md` workflow: inventory → classify → read-only subagent per item → batched report → **one-pass confirm** (D15); per-item asks for new files, rejections, protected writes only.
5. **Pre-flight (before subagents read inbox):**
   - Secret/credential pattern scan → stop and redact if hit.
   - **Never execute** inbox `scripts/`.
   - Treat all inbox content as untrusted (prompt-injection aware).
6. `references/disposition-rubric.md`, `subagent-briefs.md`, `report-template.md`.
7. Report → `documentation/jobs/harness/<YYYY-MM-DD>-UPDATE_REPORT.md` with D16 fields: `origin | source | license | summary | overlap | disposition | target | decision | applied`.
8. Protected-file STOP restated in skill: batch review ≠ batch write to `.cursor/**` without D18 scope or explicit per-path OK.

### Gate

- **Dry-run:** sample in inbox → full report → **zero** harness writes.
- **Confirm-apply:** user approves → targeted writes → inbox cleared → `validate:structure` green.
- `pnpm validate:docs` green.

---

## Phase 4 — `learn` v2 and wrap-up hooks

### Goal

Harness-wide, removal-first `learn`; threshold-triggered finish hook; no ritual on clean sessions.

### Steps

1. Widen § 3 routing table (`AGENTS.md`, `.claude/rules/*`, `INDEX.md`, `ARCHITECTURE.md`, layers doc, subagent briefs).
2. Removal-first + bloat budget; supersede don't silently delete.
3. Route mechanical lessons to enforcement (incl. `harness_scan` gaps).
4. Mistake shape: `request → wrong action → fix → lesson → add|narrow|delete|enforce`.
5. One line in `implement` + `debug`: record mistake signal in plan § Notes on correction/revert/repeat failure.
6. `finish` § Lesson check before handoff: read § Notes → offer `/learn` if signals exist; **no-op otherwise**. `bundle-ship` + `push` point to `learn` SSOT only.
7. Structural conflicts → hand off to `align-harness`.

### Gate

- **Clean session:** finish runs → no `/learn` offer.
- **Correction session:** § Notes has signal → finish offers `/learn`.
- Links resolve; procedure exists only in `learn`.

---

## Phase 5 — Spine wiring

### Goal

Router, layers doc, and job artifacts describe harness family once each. **Must complete before Phase 6.**

### Steps

1. `router/SKILL.md`: `align-harness` + `update-harness` rows; skill index; tiebreaks vs `standards-align`, `create-skill`, `rule-quality`, `learn`, `consolidate`, `update-harness`.
2. `skill-relationship-flow.md`: `align-harness` → `update-harness` (foreign); `learn` → `align-harness` (structural).
3. `DOC_AGENT_WORKFLOW_LAYERS.md`: § Harness maintenance + "When you change something" rows (`.mdc`, inbox, skills).
4. `AGENTS.md`: harness-maintenance pointer + inbox convention (catalog/imports done in Phase 1).
5. Move `REGISTRY.md`, `BACKLOG.md` → `documentation/jobs/harness/`; mark BACKLOG consumed.
6. Link from `temp_job_agents-md-complete-ruleset/DECISIONS.md` D9/D10.

### Gate

`pnpm validate:docs && pnpm validate:structure` green; each harness skill listed **once** in router.

---

## Phase 6 — First `align-harness` run (findings only)

### Goal

Tiered issue table from real harness; user picks fixes (D5/D17).

### Steps

1. `harness_scan` (facts).
2. Phase 0: registry + **capped first ledger** — minimum: routing spine + rules frontmatter + `AGENTS.md` catalog; expand in follow-up if needed.
3. Parallel judgment lenses (read-only).
4. Synthesize: blocking vs advisory; ≥2-lens flags first; budget = advisory.
5. Present issue table + mark rows **in-job** (≤5 blocking, no structural) vs **follow-up job**.
6. User selects which in-job rows to apply.

### Gate

Issue table presented; in-job vs follow-up split agreed. **No edits** before user choice.

---

## Phase 7 — Capped apply + no-loss pass (D17)

### Goal

Apply ≤5 **blocking** in-job findings only; defer structural work; no silent content loss.

### Steps

1. Apply selected rows one at a time; link don't duplicate; supersede don't delete.
2. Protected-file writes: within D18 scope or explicit per-path approval.
3. If cap exceeded or structural fix needed → stop; draft `documentation/jobs/temp_job_harness-fixes/DEVELOPMENT_PLAN.md` for remainder.
4. No-loss verifier vs Phase 6 pre-edit ledger → `MISSING: 0`.
5. Reconcile router + registry.
6. **`validate` impl-full** on full diff.
7. Hand to `finish`.

### Applied (2026-08-12) — 5 rows, within D17 cap

| Row | Fix | Files |
|-----|-----|-------|
| 2 | Stale `RULE.md` prose → `RULE.mdc`; added explicit "Cursor ignores plain `.md` here" note | `.cursor/rules/README.md`, `.cursor/rules/INDEX.md` |
| 3 | Audit output schema + report line emit `RULE.mdc` | `.agents/skills/validate/SKILL.md` |
| 4 | Lesson-routing prose emits `RULE.mdc` | `.agents/skills/learn/SKILL.md` |
| 5 | `harness_scan` false-orphan + false-missing defects (below) | `harness_scan.cjs`, `harness_scan.test.cjs` |
| 7 | `@`-import wording corrected to match verified Cursor behavior | `AGENTS.md` |

**Row 5 detail — two scanner defects, both found by running it:**

1. **False orphans.** Refs were extracted from paired inline backticks. A single stray or fenced backtick skews every later pair, so `bundle-ship` and `caveman` read as unrouted despite four router references each — exactly the false "foreign content" alarm the lens must not raise. Fixed by extracting path-shaped tokens directly (`PATH_TOKEN_REGEX`), making extraction independent of markdown emphasis. Orphans: 2 → 0; reachable 106 → 119. Regression test added.
2. **False missing refs.** Placeholders (`<name>`, `[feature]`), globs (`DOC_*`, `**`), and user-home Cursor paths (`.cursor/skills-cursor/**`) were reported as broken. 182 → 40, and the remainder is real signal.

**Lint coverage note (D20 consequence):** `eslint.ignores.js` excludes `scripts/`, so repo tool scripts are unlinted — but a *skill-local* script under `.agents/` is not excluded and is linted as browser code. Handled inside the file (`/* global process, Buffer */` + complexity refactor of `loadManifest` / `walkFromRoots`) rather than by editing protected lint config. Any future skill-local script hits the same edge; `create-skill` should mention it.

### Deferred to `temp_job_harness-fixes` (structural / out of cap)

- **`AGENTS.md` § Defaults instructs every agent to read `src/config/git-workflow.json` — the file does not exist.** Always-on instruction pointing at nothing; decide whether to create the file or drop the mode gate.
- **`documentation/PROJECT-STRUCTURE-VALIDATION.md` missing but referenced 3×** from `architecture/RULE.mdc` (always-on), `file-placement/RULE.mdc` (always-on), and `review/SKILL.md`.
- `.husky/pre-commit` references `documentation/CHANGELOG.md`; `architecture/RULE.mdc` puts `CHANGELOG.md` at root.
- D12 always-on restructure (2,044 lines).

### Gate

- No-loss `MISSING: 0` — no content removed; all row edits were in-place term replacements plus additive notes.
- `pnpm validate:docs && pnpm validate:structure` green; `pnpm test:classify` 44/44.
- User confirms harness reads correctly. ← **pending**

---

## Notes during development

- [Phase 0] D18 consent granted by user ("plan is ready for implementation"). D19: stashed `feature/agents-md-portable-catalog` AGENTS/REGISTRY work; branch `feature/harness-skills` from `develop`. Plan-review waived — `review-dev-plan` already Done 2026-08-12.
- [Phase 1] 14 rules renamed to `.mdc`; validators updated first; 58 live files ref-swept. `pnpm validate:structure`, `validate:docs`, `lint` green. Always-on payload: **2,044 lines** (8 rules) — advisory per D12.
- [Phase 1] **Loadability checklist: PASSED** (user-verified 2026-08-12, fresh Cursor session). 8 `alwaysApply: true` rules active, all `.mdc`; `architecture`/`file-placement`/`code-style`/`workflow`/`agent-behavior` each appear **once**; `git-workflow` + `platform` correctly agent-requestable only.
- [Phase 1] **Finding — `@` imports do not expand in Cursor.** `AGENTS.md` is injected as an always-applied workspace rule, but its `@` lines stay literal (`INDEX.md` and `.claude/rules/*` contents absent from context). Implications: (a) D14 Option C removed imports that were not loading bodies anyway — zero context regression; (b) `@.cursor/rules/INDEX.md` is effectively Claude/Codex-only; (c) effective Cursor always-on = 2,044 rule lines + `AGENTS.md`, not 2,044 + INDEX. Advisory input for the D12 follow-up restructure job.
- [Phase 2] `improve-skill-library` → `align-harness`; `harness_scan.cjs` + `entry-points.yaml`; lenses 6–8; `pnpm test:classify` includes scan test.
- [Phase 3] `update-harness` skill + `.agents/harness-inbox/` (gitignored); `projectStructure` + `.gitignore` updated.
- [Phase 4] `learn` v2 (removal-first, mistake shape, finish/bundle-ship/push hooks); `implement` § Notes mistake signals.
- [Phase 5] Router tiebreaks; `DOC_AGENT_WORKFLOW_LAYERS` § Harness maintenance; `REGISTRY`/`BACKLOG` → `documentation/jobs/harness/`; agents-md D9/D10 linked.

## Decisions made

Impl-time only (`implement` fills). Product/scope forks → sibling [`DECISIONS.md`](./DECISIONS.md).

| # | Topic | Choice | User asked? |
|---|-------|--------|-------------|
| D18 | Protected-file scope | Approved — `projectStructure.config.cjs`, `.gitignore` (Phase 3), 14× rule renames, `.agents/skills/**`, Phase 7 capped apply | Yes |
| D19 | Branch / concurrency | Stashed agents-md WIP; `feature/harness-skills` from `develop` | No |
| — | Plan-review gate | Waived — review-dev-plan Done in Summary | No |
| — | Phase 6 in-job vs follow-up split | _(after issue table)_ | |
