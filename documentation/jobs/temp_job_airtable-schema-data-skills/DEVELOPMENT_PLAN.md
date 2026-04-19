# DEVELOPMENT_PLAN.md — Airtable schema & sample skills (boilerplate adaptation)

## Summary

**Why:** Project Alpha maintains two Cursor Agent Skills — **`airtable-schema-structure`** and **`airtable-data-sample`** — plus small Node scripts (`airtable-meta-dump.js`, `airtable-sample-records.js`, `load-airtable-env.js`) so agents can inspect Airtable **Meta** (schema) and **Data API** (sample rows) in a repeatable, documented way. This boilerplate has Airtable wiring in the **setup** feature and `airtableService.ts` but **no** equivalent skills or CLI scripts.

**What:** Adapt those two skills into this repo with **generic, fork-friendly** wording and tooling: no hard-coded Alpha table/field IDs, no `projectAlphaAirtableIds.ts`, no Alpha-only Edge references unless explicitly framed as optional “if you add Edge later.” Provide the **minimum script stack** the skills depend on (Meta dump + sample records + shared env loader), wire **pnpm** convenience scripts if useful, and document how forks extend the pattern (optional ID constants file, per-table fetch scripts).

**Constraints:** Follow architecture and file-placement rules; do **not** update `CHANGELOG.md` here (handled in `/finish`). Secrets stay in `.env` / `.env.local` only; skills must reinforce **no keys in chat/commits**. Boilerplate has **no** `supabase/` tree today — any “DB + Airtable umbrella” skill stays **out of scope** unless Supabase is introduced later.

**Scope:** Skills + scripts + docs references that exist in-repo and pass `pnpm validate:docs:refs`. **Out of scope for this plan:** porting Alpha’s `fetch-*-fields.js` fleet, `check-airtable-ids-vs-meta.js` against a monolithic IDs file, Edge Functions, or moving PAT off `VITE_*` (document as follow-up).

---

## Source / context

- User request: adapt **`airtable-schema-structure`** and **`airtable-data-sample`** from **`project-alpha`** (`project-alpha/develop`) into this boilerplate, with **more abstract Airtable** guidance than the Alpha app.
- Investigation: two explore subagents (boilerplate layout vs alpha `git show` inventory) + local rules/config read.

---

## Existing functionality (reuse)

| Area | Location | Reuse in plan |
|------|----------|----------------|
| Meta API (in-app) | `src/shared/services/airtableService.ts` — `getAirtableTableStructure`, types `AirtableField`, `AirtableTableStructure`, `isAirtableConfigured` | Skills should point here for **runtime** behavior; scripts duplicate **read-only** Meta/Data HTTP for **CLI** (Node), not replace the service. |
| Env vars | `VITE_AIRTABLE_API_KEY`, `VITE_AIRTABLE_BASE_ID`, `VITE_AIRTABLE_TABLE_ID` + `src/vite-env.d.ts`, setup wizard | Align **scripts** with same vars Alpha uses (`VITE_*` + `load-airtable-env` pattern) so one `.env` works for app + CLI; document trade-off: PAT in Vite-exposed vars. |
| Setup docs | `src/features/setup/README.md`, `setup-states-and-transitions.md` | Add a short subsection: “Agent / CLI schema inspection” linking to skills + `pnpm` script names. |

---

## Scope / out-of-scope

| In scope | Out of scope (defer) |
|----------|----------------------|
| `.cursor/skills/airtable-schema-structure/SKILL.md` (generic) | `db-structure-airtable-supabase` umbrella skill |
| `.cursor/skills/airtable-data-sample/SKILL.md` (generic) | Alpha `fetch-*-fields.js`, `check-airtable-ids-vs-meta.js`, debug/sync Edge scripts |
| `scripts/load-airtable-env.js` (or equivalent shared module) | Changing Vite env strategy to non-`VITE_*` server-only secrets |
| `scripts/airtable-meta-dump.js` | CI that runs dumps against live bases |
| `scripts/airtable-sample-records.js` | Supabase migrations / live Postgres introspection |
| Optional `pnpm` scripts in root `package.json` | New `documentation/DOC_*` for this topic (permanent root docs use `DOC_` + `DOC_INDEX`; this work stays **feature-local** in `src/features/setup/README.md` only — see Decisions made) |

---

## Phase overview

| Phase | Goal | Gate | Status |
|-------|------|------|--------|
| 1 | Lock abstraction model (generic skill text, fork extension points, env contract) | Written decisions in “Decisions made” + no open blocking questions | Done (decisions recorded) |
| 2 | Add Node scripts (`load-airtable-env`, meta dump, sample records) | `node scripts/...` succeeds against a real `.env` (manual or user-provided); no structure validator errors | Done |
| 3 | Add two Cursor skills | Files at `.cursor/skills/<name>/SKILL.md`; content references only paths that exist or will exist post-phase-2 | Done |
| 4 | Wire `package.json` scripts + setup/README | `pnpm <script>` runs; README links skills | Done |
| 5 | Quality gate | `pnpm validate:structure`, `pnpm validate:docs:refs`, `pnpm lint`, `pnpm type-check` pass | Done |

---

## Conflict & compliance

### Applicable rules

| Rule / doc | Why |
|------------|-----|
| `.cursor/rules/architecture/RULE.md` | Skills are agent docs, not app layers; scripts stay under `scripts/` (allowed `*.js`). No business logic in scripts beyond I/O helpers. |
| `.cursor/rules/file-placement/RULE.md` + `projectStructure.config.cjs` | `.cursor/skills/* /SKILL.md` whitelisted; `scripts/*.js` whitelisted; `documentation/jobs/temp_job_*/DEVELOPMENT_PLAN.md` whitelisted. **No** `projectStructure.config.cjs` change required for standard additions. |
| `.cursor/rules/security/RULE.md` | Never echo API keys; skills must state redaction / low `maxRecords` / `--fields` allowlist; warn about PII in sample output. |
| `.cursor/rules/code-style/RULE.md` | Keep each script focused; avoid >100-line functions where reasonable; use small helpers in one file or split only if needed. |
| `.cursor/rules/workflow/RULE.md` | Implement on `develop`, not `main`. Changelog only in **finish**, not in this job. |
| `scripts/validate-cursor-doc-references.js` | All **file paths** cited inside new `SKILL.md` files must exist in the repo after implementation (or use phrasing “optional if you add …” without fake paths). |

### Planned placements

| Artifact | Path | Validator |
|----------|------|-----------|
| Env loader | `scripts/load-airtable-env.js` | `scripts/*.js` ✓ |
| Meta dump CLI | `scripts/airtable-meta-dump.js` | ✓ |
| Sample records CLI | `scripts/airtable-sample-records.js` | ✓ |
| Skills | `.cursor/skills/airtable-schema-structure/SKILL.md`, `.cursor/skills/airtable-data-sample/SKILL.md` | `.cursor/skills/*/SKILL.md` ✓ |

### Risks / attention

1. **Secrets in `VITE_*`:** Same as today — scripts reuse vars for DX parity with Alpha; document that production apps may want server-side or Edge-held tokens (follow-up).
2. **Field IDs vs names:** Boilerplate wizard already uses Meta for structure; skills must explain **`returnFieldsByFieldId=true`** for sample script alignment with production-style responses.
3. **No Supabase:** Do not promise `supabase/migrations` in schema skill; optional sentence “when this repo includes Supabase, use …” only.

### Resolved (user / product owner)

1. **Default table for `airtable-sample-records.js`:** When **`--table`** and **`--table-name`** are both omitted, use **`VITE_AIRTABLE_TABLE_ID`** from env (same as app “primary table” in setup). If that var is missing or placeholder, the script must error with a clear message (require explicit `--table` or complete setup env).
2. **Documentation placement:** **Only** `src/features/setup/README.md`, following this repo’s convention: operational / feature-scoped guidance lives in the feature README and `docs/` under the feature; permanent cross-cutting docs use root `documentation/DOC_*.md` + `documentation/DOC_INDEX.md` — **not** used here.

---

## Phase 1 — Abstraction model and contracts

### Goal

Define how boilerplate skills differ from Alpha: generic triggers, generic cross-checks (env + `airtableService.ts` + optional fork-owned `airtableIds` module), and explicit “fork extends here” guidance.

### Steps

1. Document **three layers** in skill prose: (a) **Agnostic** — Meta + Data API patterns; (b) **Boilerplate** — `airtableService.ts`, setup wizard, three env vars; (c) **Fork** — optional `src/shared/config/airtableConstants.ts` (name illustrative) for `tbl*`/`fld*` if a product needs SSOT like Alpha.
2. Replace Alpha-only references (`projectAlphaAirtableIds`, `DOC_PROJECT_AIRTABLE_DATA_EDGE`, Lesmateriaal field tables) with **placeholders or generic examples** (e.g. “your table id from Meta”).
3. Specify **CLI contract** for both scripts (flags: `--pretty`, `--out`, `--max-records`, `--fields`, `--table` / `--table-name`) matching Alpha behavior where possible for easy porting.
4. **Decisions made** is filled (see below); script and README text must match default table = `VITE_AIRTABLE_TABLE_ID` and docs **only** in setup README.

### Gate

Written abstraction summary (in repo: either this plan’s “Decisions made” filled, or a short comment block in a draft PR description is **not** sufficient — **decisions belong in the table below** before implementation merges).

---

## Phase 2 — Node scripts (generic)

### Goal

Ship `load-airtable-env.js`, `airtable-meta-dump.js`, and `airtable-sample-records.js` adapted from Alpha **minus** hard-coded table ids; use `fetch`, read `.env` then `.env.local` (align Alpha’s `load-airtable-env` behavior).

### Steps

1. Port **`load-airtable-env.js`** from `project-alpha/develop` with minimal edits (comments: boilerplate, reject placeholders consistent with `isAirtableConfigured` semantics where practical).
2. Port **`airtable-meta-dump.js`**: `GET …/meta/bases/{baseId}/tables`, write JSON or stdout; no imports from `src/`.
3. Port **`airtable-sample-records.js`**: Data API with `returnFieldsByFieldId=true`, resolve `--table-name` via Meta when needed. **Default table:** if neither `--table` nor `--table-name` is passed, use **`VITE_AIRTABLE_TABLE_ID`** (required non-placeholder); otherwise require explicit `--table` / `--table-name`.
4. Add **file header comments**: security reminders, no committed `meta.json` with secrets (output is schema-only but still operational metadata).
5. In skills or README: remind that dump output (e.g. `meta.json`) should not be committed if it contains sensitive operational detail; recommend output path outside repo or gitignored path (follow existing team practice).

### Gate

From repo root with valid `.env` / `.env.local`:  
`node scripts/airtable-meta-dump.js --pretty` prints valid JSON;  
`node scripts/airtable-sample-records.js --max-records 1` works for configured table (manual test).  
`pnpm validate:structure` passes.

**Verified in CI/agent environment:** Without credentials, both scripts exit `1` with the expected “Set VITE_AIRTABLE…” / “No table id…” messages; `pnpm validate:structure` passes. Full JSON against live Airtable requires a developer `.env` (manual confirmation).

---

## Phase 3 — Cursor Agent Skills

### Goal

Add two skills mirroring Alpha workflows but **boilerplate-neutral**.

### Steps

1. Create **`.cursor/skills/airtable-schema-structure/SKILL.md`** with frontmatter (`name`, `description`, `disable-model-invocation: true` if matching repo convention for similar skills). Sections: Goal, When to use, Security, Commands table, Workflow, Output template, “Fork extension” for optional constants file.
2. Create **`.cursor/skills/airtable-data-sample/SKILL.md`** with **explicit dependency** on schema skill; document `airtable-sample-records.js` usage; warn on PII; link to `airtableService` normalization vs wire shape.
3. Cross-link from **`.cursor/skills/prime/SKILL.md`** or **`.cursor/skills/plan/SKILL.md`** only if maintainers want discoverability (optional — **ask user**; default **skip** to minimize unrelated diffs).
4. Ensure every **path** in markdown exists or is clearly optional hypothetical.

### Gate

Files present; `pnpm validate:docs:refs` passes; manual read: no Alpha-only mandatory paths.

---

## Phase 4 — package.json + README

### Goal

Discoverability for humans and agents.

### Steps

1. Add **pnpm scripts** e.g. `airtable:meta-dump` and `airtable:sample` wrapping the node commands with documented args in `package.json` comments unnecessary — prefer **README** examples.
2. Update **`src/features/setup/README.md`** only: add a **Related** (or short dedicated) subsection for **CLI / agent tools** — link paths `.cursor/skills/airtable-schema-structure/SKILL.md` and `.cursor/skills/airtable-data-sample/SKILL.md`, plus example `pnpm` / `node` invocations. Match tone/structure of existing “Related” bullets in that README. **Do not** add `documentation/DOC_AIRTABLE_AGENT_TOOLS.md` or `DOC_INDEX` entries for this topic.

### Gate

`pnpm airtable:meta-dump` (or chosen names) runs; README renders correctly; no broken internal links.

---

## Phase 5 — Repo quality gate

### Goal

Ensure no regressions.

### Steps

1. Run `pnpm validate:structure`, `pnpm validate:docs`, `pnpm lint`, `pnpm type-check`, `pnpm test:run` (full or scoped if time-boxed — **prefer full** for small diff).

### Gate

All above exit zero.

---

## Notes during development

- [Phase 2] `load-airtable-env.js` extended with `getDefaultAirtableTableIdFromEnv()` for `VITE_AIRTABLE_TABLE_ID` default in sample script (per user decision).
- [Phase 3] Removed reference to non-existent `scripts/check-airtable-ids-vs-meta.js` from schema skill so `pnpm validate:docs:refs` passes.
- [Phase 4] `pnpm airtable:meta-dump` / `pnpm airtable:sample` invoke Node correctly; without `.env` they exit `1` (expected).
- [Phase 5] `pnpm lint` reports 0 errors (existing warnings only); `pnpm test:run` 98 tests passed; `pnpm validate:docs` passed.

---

## Decisions made

| Decision | Context | Outcome | User asked? |
|----------|---------|---------|---------------|
| Default table for `airtable-sample-records.js` | When `--table` / `--table-name` omitted | Use **`VITE_AIRTABLE_TABLE_ID`**; if unset or placeholder, fail with message to set env or pass flags explicitly | Yes |
| Documentation for agent/CLI Airtable tools | Root `DOC_*` vs feature README | **Only** `src/features/setup/README.md`, per project convention (feature-local ops; root `DOC_*` + `DOC_INDEX` for permanent cross-cutting docs only) | Yes |
| Prime/plan cross-links to new skills | Optional discoverability | **Skipped** (plan default: no edits to `prime` / `plan` skills) | No (plan default) |
