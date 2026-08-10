# Development plan: Split monolithic workflow rule into hub + 3 domain rules

## Summary

- **Goal:** Decompose `.cursor/rules/workflow/RULE.md` (~534 lines, `alwaysApply: true`) into a thin hub plus three focused domain rules, following the `api-integration` extraction precedent and the layers doc principle (*rules link; avoid long duplicated checklists*).
- **Why:** Token cost every turn, mixed concerns (git / agent behavior / platform / env catalog / deployment), and known SSOT drift (audit **M4** semver duplication, **M6** protected-files manifest split, reductive strategy duplicated across `workflow` and `debugging`).
- **Complexity:** **M** — cross-cutting reference migration (~30 live files), three new rule folders, hub rewrite, no app-code changes.
- **Plan review:** Required: pending
- **Scope / constraints:**
  - **In:** New rules `git-workflow/`, `agent-behavior/`, `platform/`; thin `workflow/` hub; update all live references; expand `debugging/` as reductive SSOT; update `AGENTS.md`, `INDEX.md`, layers doc, skills, sibling rules, human docs.
  - **Out:** Historical `documentation/jobs/temp_job_*/DEVELOPMENT_PLAN.md` archives (leave as-is unless a link would confuse agents — prefer grep verification only); new skills; CI/workflow changes; weakening protected-file policy; env var renames.
  - **User choice (locked):** Option 1 — split into 3 rules + thin hub.

## Phase overview

| Phase | Goal | Gate | Status |
|-------|------|------|--------|
| 1 | Extract content into three new `RULE.md` files | New files exist; section anchors preserved; `alwaysApply` set per table below | Done |
| 2 | Rewrite `workflow/RULE.md` as thin hub | Hub ≤ ~120 lines; SSOT map updated; no duplicated git/agent/platform bodies | Done |
| 3 | Migrate all live cross-references | `rg 'workflow/RULE\.md'` shows only hub pointers or intentional historical archives | Done |
| 4 | Dedup SSOT debt (M4, M6, reductive) | `debugging` owns reductive; `finish`/`push` own commit flow; single protected-files manifest | Done |
| 5 | Catalog + agent entrypoints | `INDEX.md`, `README.md`, `AGENTS.md`, `DOC_*`, `rules-registry.md`, `.claude/rules/git-workflow.md` aligned | Done |
| 6 | Validation | `pnpm validate:structure`; reference grep clean; spot-read imported rules in Cursor context | Done |

## Conflict & compliance

### Applicable rules

| Rule / doc | Relevance |
|------------|-----------|
| `.cursor/rules/file-placement/RULE.md` | New folders under `.cursor/rules/*/` — whitelisted by `projectStructure.config.cjs` (`rules/*/RULE.md`) |
| `.cursor/rules/workflow/RULE.md` | Subject of refactor; editing `.cursor/rules/**` requires explicit user approval (granted by this plan request) |
| `documentation/DOC_AGENT_WORKFLOW_LAYERS.md` | Layer model: rules = principles + links |
| `.agents/skills/finish/SKILL.md`, `push/SKILL.md` | Commit/changelog SSOT — trim duplicates from extracted git content |
| Prior art: `api-integration` consolidation job | Rule absorbs section; old location = one-line pointer |

### File placements

| Path | Action |
|------|--------|
| `.cursor/rules/git-workflow/RULE.md` | **Create** |
| `.cursor/rules/agent-behavior/RULE.md` | **Create** |
| `.cursor/rules/platform/RULE.md` | **Create** |
| `.cursor/rules/workflow/RULE.md` | **Rewrite** (thin hub) |
| `.cursor/rules/debugging/RULE.md` | **Edit** (reductive SSOT) |
| `.cursor/rules/INDEX.md`, `README.md` | **Edit** |
| `AGENTS.md` | **Edit** (imports) |
| ~25 reference files (see Phase 3 matrix) | **Edit** paths/§ anchors |
| `projectStructure.config.cjs` | **No change** (wildcard already allows new rule folders) |

### Risks / open questions

| Risk | Mitigation |
|------|------------|
| Broken § anchors after split | Preserve section titles in child files; hub lists anchor map; Phase 3 grep audit |
| Agents miss git rules if not `alwaysApply` | Hub carries 5-line branch gate stub + links; skills already gate branch; add `git-workflow` to `AGENTS.md` consult list |
| `alwaysApply` token regression | Only `workflow` hub + `agent-behavior` stay `alwaysApply: true`; `git-workflow` + `platform` = `false` |
| Missed references in skills | Phase 3 exhaustive `rg`; update `rules-registry.md` as canonical skill table |

### Standards diversions

None intentional. Aligns with repo precedent (`api-integration` extraction) and June audit Batch B (SSOT trim).

## Content map (source → destination)

### `git-workflow/RULE.md` (~200 lines)

| From `workflow/RULE.md` | Notes |
|-------------------------|-------|
| § Git Workflow → Version Control Standards | Keep; link `finish` for semver/changelog (no duplication) |
| § Branch Strategy (full Model A) | SSOT owner moves here |
| § Branch Protection + Verification + Exceptions + Emergency | Include § Exceptions (Safe to Edit on Any Branch) — plan skill references it |
| § Pull Requests + merge-blocked diagnostics + Model A divergence | Full content |
| § Promote to production | Full content |
| § Commit and Push Workflow | **Trim** to agent flow bullets + links to `finish` / `push` skills (audit M4) |
| Duplicate § Branch Protection under Agent-Specific | **Drop** — link upward |

**Frontmatter:** `alwaysApply: false`, `description: "Git branch model (Model A), PRs, and production promotion"`

### `agent-behavior/RULE.md` (~100 lines)

| From `workflow/RULE.md` | Notes |
|-------------------------|-------|
| § Agent Role and Control | |
| § Decision Questioning Protocol | |
| § Success Validation | |
| § Protected Files (full manifest) | **Single SSOT** (audit M6) |
| § Reductive Strategy | **Move SSOT to `debugging/RULE.md`**; here = one-line pointer only if needed |

**Frontmatter:** `alwaysApply: true`, `description: "Agent decision protocol, success validation, and protected-file consent"`

### `platform/RULE.md` (~100 lines)

| From `workflow/RULE.md` | Notes |
|-------------------------|-------|
| § Platform and Commands | |
| § Shell/PowerShell Handling | Critical IDE crash prevention |
| § Environment Variables and Configuration | Env catalog lives here (not `project-specific` — that rule is Edge rate-limit scoped) |
| Hidden files + server restart bullets | |

**Frontmatter:** `alwaysApply: false`, `description: "Windows/PowerShell command rules and local environment configuration"`

### `workflow/RULE.md` thin hub (~80–120 lines)

| Keep (trimmed) | Notes |
|----------------|-------|
| SSOT map | Update rows to point at child rules |
| Code Review Process | Checklist only; link sibling rules |
| Development Process (Before / During / Before Submitting) | Link `finish`, `testing`, `file-placement` |
| Deployment Process | Pointers only (`DOC_CLOUDFLARE_WORKERS`, `cloud-functions/RULE`) |
| Examples | One-liner → `finish` § Commit Message Standards |
| **New:** Rule routing table | Which child rule for which concern |
| **New:** Minimal branch gate stub | 5 lines: verify `feature/*` before app-code edits; full detail → `git-workflow` |

| Remove (moved or deduped) | New SSOT |
|---------------------------|----------|
| Full branch/PR/promote bodies | `git-workflow/RULE.md` |
| Agent behaviors + protected files | `agent-behavior/RULE.md` |
| PowerShell + env vars | `platform/RULE.md` |
| Reductive strategy body | `debugging/RULE.md` |
| Semver/changelog/commit format detail | `finish/SKILL.md` |

## Pattern & precedent

| Field | Value |
|-------|--------|
| **Capability** | Maintainable, layered Cursor rules with clear SSOT per concern |
| **Precedents** | This repo's `api-integration/RULE.md` absorbing `workflow` § Documentation Lookup; Cursor's multi-rule `.cursor/rules/<category>/RULE.md` layout |
| **Aspects reviewed** | Separation of concerns; SSOT/DRY; agent token budget; reference stability |
| **Findings** | Aligns — same pattern as api-integration; hub + domain rules matches `DOC_AGENT_WORKFLOW_LAYERS` |
| **Verdict** | Aligns with precedent |
| **If non-standard** | N/A |

## Phase 1 — Extract three domain rules

### Goal

Create `git-workflow`, `agent-behavior`, and `platform` rules with preserved § headings where referenced externally.

### Steps

1. Create `.cursor/rules/git-workflow/RULE.md` — move git sections per content map; add Related Rules footer.
2. Create `.cursor/rules/agent-behavior/RULE.md` — move agent sections; protected-files manifest is canonical here.
3. Create `.cursor/rules/platform/RULE.md` — move platform/env sections.
4. Expand `.cursor/rules/debugging/RULE.md` § Reductive Strategy with the full text from `workflow` (currently only a pointer); remove body from workflow entirely.

### Gate

- Three new files pass markdown structure check (frontmatter + Related Rules).
- Section titles match migration table anchors (`§ Branch Strategy`, `§ Protected Files`, etc.).

## Phase 2 — Rewrite workflow hub

### Goal

Replace monolithic `workflow/RULE.md` with router + thin process content.

### Steps

1. Rewrite SSOT map table (branch → `git-workflow`; protected files / agent → `agent-behavior`; platform/env → `platform`; semver → `finish`).
2. Add **Rule routing** table:

   | Concern | SSOT |
   |---------|------|
   | Branch model, PRs, promote | `git-workflow/RULE.md` |
   | Protected files, decision protocol, user-test gate | `agent-behavior/RULE.md` |
   | PowerShell, env vars | `platform/RULE.md` |
   | Semver, changelog, commit | `finish/SKILL.md` |
   | Reductive / debug | `debugging/RULE.md` |

3. Keep trimmed Code Review + Development Process + Deployment pointers.
4. Add minimal branch-gate stub (link `git-workflow` for full Model A).
5. Replace removed sections with one-line pointers (same pattern as `api-integration` superseded block).

### Gate

- `workflow/RULE.md` line count ≤ ~120.
- No duplicate bodies of content now owned by child rules.

## Phase 3 — Reference migration (exhaustive)

### Goal

Every **live** reference points to the correct child rule and § anchor.

### Anchor migration table

| Old reference | New reference |
|---------------|---------------|
| `workflow/RULE.md` § Branch Strategy | `git-workflow/RULE.md` § Branch Strategy |
| `workflow/RULE.md` § Branch Protection | `git-workflow/RULE.md` § Branch Protection |
| `workflow/RULE.md` § Exceptions | `git-workflow/RULE.md` § Exceptions |
| `workflow/RULE.md` § Pull Requests | `git-workflow/RULE.md` § Pull Requests |
| `workflow/RULE.md` § Promote to production | `git-workflow/RULE.md` § Promote to production |
| `workflow/RULE.md` § Commit and Push Workflow | `git-workflow/RULE.md` § Commit and Push Workflow |
| `workflow/RULE.md` § Protected Files | `agent-behavior/RULE.md` § Protected Files |
| `workflow/RULE.md` § Decision Questioning Protocol | `agent-behavior/RULE.md` § Decision Questioning Protocol |
| `workflow/RULE.md` § Platform and Commands | `platform/RULE.md` § Platform and Commands |
| `workflow/RULE.md` § Reductive Strategy | `debugging/RULE.md` § Reductive Strategy |
| `workflow/RULE.md` § During Development | `workflow/RULE.md` § During Development (unchanged — stays in hub) |
| Generic `workflow/RULE.md` (catalog / hub) | `workflow/RULE.md` or `INDEX.md` |

### Files to update (live corpus)

#### Agent entrypoints

| File | Changes |
|------|---------|
| `AGENTS.md` | Keep `@workflow/RULE.md`; add `@agent-behavior/RULE.md` to always-imported; add `git-workflow`, `platform` to consult-on-demand list |
| `.claude/rules/git-workflow.md` | SSOT line → three child paths; protected files → `agent-behavior` |

#### Rules catalog & siblings

| File | Changes |
|------|---------|
| `.cursor/rules/INDEX.md` | Add 3 categories; trim workflow entry to hub scope; update consistency matrix |
| `.cursor/rules/README.md` | Add three SSOT bullets; demote workflow to hub |
| `.cursor/rules/architecture/RULE.md` | Reductive + Decision Questioning → new paths |
| `.cursor/rules/api-integration/RULE.md` | Related Rules: workflow hub pointer |
| `.cursor/rules/cloud-functions/RULE.md` | Branch model → `git-workflow` |
| `.cursor/rules/database/RULE.md` | Generic workflow refs → hub |
| `.cursor/rules/debugging/RULE.md` | Own reductive SSOT; fix Related Rules |
| `.cursor/rules/security/RULE.md` | Review process → hub |
| `.cursor/rules/testing/RULE.md` | Branch + During Development refs |
| `.cursor/rules/code-style/RULE.md` | Review ref → hub |

#### Skills (`.agents/skills/`)

| File | Old § / topic | New path |
|------|---------------|----------|
| `plan/SKILL.md` | § Exceptions, § Branch Strategy | `git-workflow` |
| `implement/SKILL.md` | § Branch Strategy, § Protected Files | `git-workflow`, `agent-behavior` |
| `finish/SKILL.md` | § Protected Files, promote, commit confirm | `agent-behavior`, `git-workflow`, hub |
| `push/SKILL.md` | § Commit and Push, § Pull Requests | `git-workflow` |
| `bundle-ship/SKILL.md` | § Pull Requests | `git-workflow` |
| `router/SKILL.md` | § Promote to production | `git-workflow` |
| `start/SKILL.md` | § Branch Strategy, § Branch Protection, § Promote | `git-workflow` |
| `validate/SKILL.md` | § Branch Strategy | `git-workflow` |
| `quick-piv/SKILL.md` | § Branch Strategy | `git-workflow` |
| `feature/SKILL.md` | § Branch Strategy | `git-workflow` |
| `prime/SKILL.md` | § Branch Strategy | `git-workflow` |
| `learn/SKILL.md` | generic workflow | hub + children as appropriate |
| `layer-consistency-check/references/alert-template.md` | § Decision Questioning Protocol | `agent-behavior` |
| `debug/patterns.md` | § Platform and Commands | `platform` |
| `plan/references/rules-registry.md` | Workflow row | split into 4 rows |

#### Human documentation

| File | Changes |
|------|---------|
| `documentation/DOC_INDEX.md` | Split branch / protected / platform rows |
| `documentation/DOC_AGENT_WORKFLOW_LAYERS.md` | Branch + protected → child paths; hook table |
| `documentation/DOC_CONTRIBUTING.md` | Link both `git-workflow` + `agent-behavior` |
| `documentation/DOC_CLOUDFLARE_WORKERS.md` | Branch model → `git-workflow` |
| `documentation/DOC_CHANGESETS.md` | Promote → `git-workflow` |
| `documentation/DOC_TESTING.md` | Layout polish ref → hub or `platform` |
| `documentation/DOC_FEATURE_LOCAL_README.md` | Process SSOT → hub |
| `README.md` | Promote link → `git-workflow` |
| `documentation/jobs/skill-library/REGISTRY.md` | Workflow deps → hub + children |
| `documentation/jobs/skill-library/2026-08-03-LENS-ssot.md` | Update SSOT ownership rows (branch → `git-workflow`, semver stays `finish`) |

#### Explicitly skip (historical)

- `documentation/jobs/temp_job_*/DEVELOPMENT_PLAN.md` (except if grep shows they'd be picked up by agents as SSOT — they're not; leave frozen)

### Steps

1. Run `rg 'workflow/RULE\.md' -l` → update each live file per matrix.
2. Run `rg 'workflow/RULE\.md §'` → fix every § anchor.
3. Run `rg '§ (Branch Strategy|Protected Files|Pull Requests|Promote|Decision Questioning|Platform and Commands|Reductive)'` → confirm no stale workflow targets.
4. Update `CHANGELOG.md` only in **finish** (not during this plan).

### Gate

- `rg 'workflow/RULE\.md § (Branch|Protected|Pull|Promote|Decision|Platform|Reductive)'` returns **zero** hits in live corpus (`.cursor/`, `.agents/`, `AGENTS.md`, `documentation/DOC_*.md`, `README.md`, `.claude/`).
- Remaining `workflow/RULE.md` references are hub-appropriate (During Development, code review, routing).

## Phase 4 — SSOT deduplication pass

### Goal

Close audit items M4 and M6; eliminate circular reductive pointers.

### Steps

1. **M6:** Confirm protected-files list exists only in `agent-behavior/RULE.md`; `finish`, `implement`, `.claude/rules/git-workflow.md` link there.
2. **M4:** In `git-workflow`, replace semver/changelog paragraphs with links to `finish/SKILL.md` (keep review checklist bullets in hub only).
3. **Reductive:** `debugging/RULE.md` holds full text; `architecture/RULE.md` points to `debugging`; remove reductive body from any remaining location.
4. Remove duplicate "§ Branch Protection" stub under old Agent-Specific section (already gone after Phase 2).

### Gate

- `rg 'Reductive Strategy' .cursor/rules/workflow` → 0 (pointer only at most).
- `rg 'Protected Files' .cursor/rules` → manifest text only in `agent-behavior`.

## Phase 5 — Catalog and agent entrypoints

### Goal

Discoverability for humans and agents matches new layout.

### Steps

1. Update `INDEX.md` § Workflow to describe hub; add `git-workflow`, `agent-behavior`, `platform` sections.
2. Update consistency check matrix (new rows; `workflow` checks children).
3. Update `AGENTS.md` imports per alwaysApply table.
4. Update `rules-registry.md` with four workflow-related rows.
5. Optional: add one row to `documentation/jobs/skill-library/2026-06-29-full-audit-synthesis.md` noting M4/M6 addressed (doc-only note in Phase 3 file list).

### `alwaysApply` final state

| Rule | `alwaysApply` | Rationale |
|------|---------------|-----------|
| `workflow/RULE.md` | `true` | Hub + dev process + review checklist |
| `agent-behavior/RULE.md` | `true` | Protected files + user-test gate every session |
| `git-workflow/RULE.md` | `false` | Invoked by skills at edit/commit/push time; hub stub covers basics |
| `platform/RULE.md` | `false` | Needed when running shell commands; skills/patterns link explicitly |

### Gate

- `INDEX.md` lists all four rules.
- `AGENTS.md` still under 100 lines after import changes.

## Phase 6 — Validation

### Goal

Repo structure and reference integrity verified.

### Steps

1. `pnpm validate:structure` (new rule folders).
2. `pnpm validate:docs` if rule paths are validated (fix any broken links reported).
3. `rg 'workflow/RULE\.md'` — manual review of remaining hits.
4. Spot-check: open `AGENTS.md` import set — hub + agent-behavior load; git-workflow reachable from `implement` skill.

### Gate

- Structure validation passes.
- No stale § anchors in live corpus.
- User spot-check in Cursor (agent sees branch gate + protected files without loading full old monolith).

## Notes during development

(Leave empty in the initial plan.)

## Decisions made

| Decision | Context | Outcome | User asked? |
|----------|---------|---------|-------------|
| Split shape | Monolithic workflow rule | Option 1: 3 child rules + thin hub | Yes |
| Env var catalog | Where platform config lives | `platform/RULE.md` (not `project-specific`) | No (plan default) |
| Reductive SSOT | Duplicated in workflow + debugging | `debugging/RULE.md` owns body | No (audit M3/M4 alignment) |
| Historical job plans | Many reference old paths | Skip — frozen archives | No |
| `git-workflow` alwaysApply | Token vs safety | `false`; hub stub + skills gate | No (prior recommendation) |
