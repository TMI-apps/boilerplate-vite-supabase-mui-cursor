# Development plan: Generic external API integration rule + skill (retire `airtable-inspect`, generalize Supabase wording)

## Summary

- **Goal:** Replace the Airtable-only `airtable-inspect` skill and the scattered, literal "Supabase" framing in `database/RULE.md`, `cloud-functions/RULE.md`, and `security/RULE.md` with one thin globs-scoped rule (`api-integration/RULE.md`, `alwaysApply: false`) plus one generic, MCP-aware procedure skill (`api-integrate/SKILL.md`) that any external API or backend research task routes through — Supabase and Airtable become worked examples inside it, not separate skills.
- **Why:** Agents integrating external APIs (in this repo and in forks built on this boilerplate) skip reading vendor docs thoroughly before writing integration code. The fix generalizes the one skill that already does this well (`airtable-inspect`'s phased schema→sample discipline) and makes MCP-first discovery (already real for Supabase via `plugin-supabase-supabase` / `user-supabase-mila-*`, not yet for Airtable) the default routing logic instead of a Supabase-only aside.
- **Complexity:** M — 18 files across three layers (rules, skills, docs) with cross-reference integrity to maintain and one file deletion with several backlinks; one config file (`src/config/app-tasks.json`, a plain-text onboarding description, not app logic) touched, no Edge Functions, no migrations, no user-facing app behavior change.
- **Plan review:** Done 2026-07-11 — `review-dev-plan` (6 lenses) ran; user chose "fix" (keep architecture, address all must-fixes) over "shrink" (Rebel's smaller-scope alternative) or "hybrid". Must-fixes incorporated below; see **Decisions made**.
- **Scope / constraints:** Rules/skills/docs layer, plus the one onboarding-description line in `src/config/app-tasks.json` noted above. No Edge Functions, no migrations, no other `src/` app code. Airtable's REST scripts (`scripts/airtable-*.js`) and DOC_SUPABASE_GOOGLE_OAUTH.md / `start` skill onboarding stay untouched (confirmed non-goals in grill). Router's vendor plugin-skill disambiguation rows (`supabase` vs `supabase-postgres-best-practices`, `cloudflare` vs `wrangler`, etc.) stay untouched — different concern (working inside a stack you're already on vs researching a brand-new external API) — but Phase 3 now adds an explicit **cross-reference** between that existing disambiguation and the new `api-integrate` skill so agents don't lose routing precision (review finding: Delivery + Fork-impact).

**Grill-me summary (chat, this thread):** Resolved forks — (1) Supabase's `database`/`cloud-functions`/`security` rule bodies get literal "Supabase" wording generalized while preserving load-bearing specifics (RLS syntax, Edge Function shared-project deploy model) as the fork's concrete example, not deleted. (2) Deliverable is a **rule that links to a skill** (existing repo convention), not one mega-file. (3) `airtable-inspect` is **retired** (deleted), its two-phase discipline and exact commands folded into `api-integrate` as the Airtable example. (4) `workflow/RULE.md` § Documentation Lookup (3 generic lines) **moves into** the new rule rather than staying duplicated.

---

## Phase overview

| Phase | Goal | Gate | Status |
|-------|------|------|--------|
| 1 | Author `api-integration/RULE.md` + `api-integrate/SKILL.md` (new, additive only) | Files exist, layer-convention-compliant, principles present | Done |
| 2 | Generalize Supabase wording in `database`/`cloud-functions`/`security` rules | Grep shows fork-specifics labeled, not deleted; lint clean | Done |
| 3 | Retire `airtable-inspect`; repoint all direct references | Zero remaining `airtable-inspect` references outside `CHANGELOG.md` | Done |
| 4 | Update routing/registry/index layer docs | New rule+skill discoverable from router, INDEX, DOC_INDEX, layers doc | Done |
| 5 | Repo quality gate | `pnpm lint`, `pnpm validate:docs`, `pnpm validate:structure` pass | Done |

---

## Conflict & compliance

**Applicable rules:**
- `.cursor/rules/file-placement/RULE.md` — new folders `.cursor/rules/api-integration/` and `.agents/skills/api-integrate/` match the existing per-category rule/skill folder pattern (10 existing rule categories, 40+ existing skill folders); no `projectStructure.config.cjs` change expected since the whitelist is pattern-based, not name-enumerated. Confirm with `pnpm validate:structure` in Phase 5.
- `documentation/DOC_AGENT_WORKFLOW_LAYERS.md` — Rule = principles + link only; Skill = full procedure (SSOT for *how*). The new rule must **not** copy the skill's phases/commands (same discipline as `pattern-review` / `architecture/RULE.md` § Pattern risk).
- `.cursor/rules/workflow/RULE.md` § Branch Strategy — current branch is `feature/testing-consistency` (unrelated in-flight work). **Before Phase 1 file creation for implementation**, switch to `develop`, pull, then create `feature/api-integration-consolidation`. (Planning itself may run on any branch per `plan` skill § Branch gate.)
- `documentation/jobs/skill-library/REGISTRY.md` convention — retired/merged skills get a footnote entry (see existing `airtable pair → airtable-inspect` example on that same line); add `airtable-inspect → api-integrate` there.

**File placements (planned, to confirm in Phase 1/5):**
- `.cursor/rules/api-integration/RULE.md` — new
- `.agents/skills/api-integrate/SKILL.md` — new
- `.agents/skills/airtable-inspect/SKILL.md` — **deleted** (Phase 3)

**Known risks / attention points:**
- **Reference sprawl (7 files, not 6):** `airtable-inspect` is referenced from `README.md`, `src/config/app-tasks.json`, `.agents/skills/router/SKILL.md` (×3 spots), `documentation/jobs/skill-library/REGISTRY.md`, `CHANGELOG.md`, **and** `documentation/jobs/temp_job_setup-to-tasks/DEVELOPMENT_PLAN.md` (historical job plan — found during `review-dev-plan`, missing from the original inventory).
- **`pnpm validate:docs` (= `validate:docs:links` + `validate:docs:refs`) does NOT cover everything the plan touches** (confirmed against the actual scripts during `review-dev-plan`, Delivery + Docs/tooling lenses): it scans `.cursor/rules/**`, `.agents/skills/**`, `documentation/**`, and `src/features/**/README.md` for inline backtick paths and relative markdown links. It does **not** scan **root `README.md`, `ARCHITECTURE.md`, `CHANGELOG.md`, or any `.json` file** (e.g. `src/config/app-tasks.json`) as sources. Every phase gate below that claims `validate:docs` coverage is paired with an explicit manual/`rg` check for these four blind-spot files — do not rely on `validate:docs` alone.
- **The final "zero hits" grep must exclude historical documents, not just `CHANGELOG.md`:** `documentation/jobs/**/DEVELOPMENT_PLAN.md` (including this plan's own file and `temp_job_setup-to-tasks`) and the `documentation/jobs/skill-library/REGISTRY.md` "Removed / merged (historical)" footnote will legitimately retain the string `airtable-inspect` by design. Use an **actionable-reference** grep (real paths: `airtable-inspect/SKILL\.md` or `\.agents/skills/airtable-inspect`), not a bare name match, for the pass/fail gate — see Phase 3/5.
- **`CHANGELOG.md` is historical** — do **not** edit past entries; only `finish` adds new changelog entries, and only if this change is changelog-worthy per that skill's gate. Per Fork-impact review finding, the `finish` step (outside this plan's scope) should add one line noting `airtable-inspect` retirement so forks diffing `CHANGELOG.md` on merge see it — flag this to `finish`, do not add it here.
- **MCP availability and failure modes vary per user/fork** (Scale/mod + Fork-impact review finding — elevated from "check MCP first, else fallback" to an explicit decision tree, see Phase 1 step 2): a matching MCP server may not exist, may exist but report `needsAuth`/`error`/`loading` (per the MCP meta-tool contract), may exist but the specific tool call may fail (auth, rate limit, wrong project), or multiple servers may match the same vendor name (e.g. this workspace has both `plugin-supabase-supabase` and fork-specific `user-supabase-mila-production`/`user-supabase-mila-staging`). The skill must handle all four states explicitly, not just "server exists vs doesn't," and must never bake a **fork-specific** server name into the generic worked example — see Phase 1 step 2.
- **`security/RULE.md` § Database Verification currently reads as a hard MCP requirement** ("ALWAYS check database schema using MCP tools before making assumptions") with no fallback — this directly contradicts the new rule's "degrade gracefully when no MCP server exists" principle (Fork-impact review finding). Phase 2 now rewords this to be conditional rather than just cross-linking around the contradiction.
- **Don't over-delete Supabase specifics:** `database/RULE.md`'s CLI commands (`supabase db reset`, `supabase gen types`), `security/RULE.md`'s RLS subquery syntax, and `cloud-functions/RULE.md`'s shared-project-across-branches deploy model are load-bearing correctness rules, not vendor-name flavor text — reword the *framing*, keep the *mechanics* verbatim, labeled as this fork's concrete backend.
- **`documentation/jobs/skill-library/REGISTRY.md` "links-to" cell** for the current `airtable-inspect` row points at a non-existent `src/features/setup/README.md` (no `setup` feature exists in `src/features/` today — Airtable onboarding lives in `README.md` § Airtable and `src/config/app-tasks.json` instead). Fix this dangling pointer while rewriting the row in Phase 3/4 rather than carrying it forward.
- **Worked-example growth ceiling:** per Scale/mod review finding, inline vendor worked examples inside `api-integrate/SKILL.md` will become an unbounded, mixed-concern file past ~4-5 vendors. Phase 1 now places worked examples in `references/vendors/<slug>.md` from the start (matching the existing `references/` convention used by `pattern-review`, `write-adoption-guide`, `router`), not inline in the skill body — cheap to do now, avoids a near-term split refactor.
- **`alwaysApply` on the new rule was not justified** (Rebel + Scale/mod review finding: "scales attention, not integrations" / "noise on non-integration work"). Phase 1 now sets `alwaysApply: false` with globs, matching `database/RULE.md` and `cloud-functions/RULE.md` (narrow, applies when the work touches API/vendor integration) rather than `security/RULE.md`'s always-on pattern (which fits because security applies to every edit; API research does not).

**Standards diversions:** None identified against **repo convention** — this plan follows the repo's own established rule-links-to-skill separation (used for `pattern-review`, `validate`, and others) rather than inventing a new layering pattern. (Industry/external alignment is assessed separately in **Pattern & precedent** above — repo-internal consistency alone was not treated as sufficient justification there, per `review-dev-plan` finding.)

**Open questions:** None outstanding after `grill-me` (perimeter Option B, rule-vs-skill split Option A, `airtable-inspect` disposition retire, `workflow/RULE.md` § Documentation Lookup ride/move) and `review-dev-plan` (direction: fix must-fixes within current architecture, not the Rebel's smaller-scope alternative — see **Decisions made**).

---

## Pattern & precedent

**Revised after `review-dev-plan`** (Industry precedent lens): original verdict `Aligns with precedent` leaned on internal repo convention as its primary citation, which the rubric explicitly treats as insufficient alone. Rewritten below to lead with genuine external precedent and separate industry alignment from repo-internal consistency (the latter belongs in **Conflict & compliance**, not here).

| Field | Value |
|-------|--------|
| **Capability** | Internal agent-workflow governance: how agents research an external API/backend before writing integration code. Not user-facing product behavior — no UI, navigation, identity, or persistence dimensions apply; omitted from Aspects reviewed below for that reason. |
| **Precedents** | (1) **MCP (Model Context Protocol) tool-discovery pattern** — check registered tools/servers before ad-hoc HTTP calls; this is the direct external analog for "MCP-first, REST/browser fallback," not an internal invention. (2) **OpenAPI / contract-first integration workflow** — read the spec (schema) before a live call (sample), widely used in Postman/Swagger UI/codegen pipelines (OpenAPI Generator, Speakeasy, Stainless); direct parallel to the Phase 0→1→2 schema→sample discipline. (3) **SDK-first vendor ecosystems** (Stripe, AWS, Google Cloud) — official client/plugin/MCP preferred over raw REST; supports the fallback ladder without repo-specific invention. |
| **Aspects reviewed** | Composition (thin policy vs detailed runbook — matches SRE principle-doc/runbook and ITIL policy/playbook separation), API & integration (MCP-first, contract-before-sample), Extensibility (one generic skill vs one-skill-per-vendor, weighed against the industry trend toward distributed MCP servers/plugins rather than a single growing procedural skill). |
| **Findings** | **Composition:** aligns with external practice (principle/runbook split is mainstream platform engineering, not just this repo's convention — though it also happens to match this repo's existing `pattern-review`/`validate` pattern, noted separately in Conflict & compliance as repo consistency). **API & integration:** aligns — MCP-first-then-fallback matches SDK-first vendor conventions and the OpenAPI contract-first workflow. **Extensibility:** partial tension — industry is trending toward distributed per-vendor MCP servers/plugins rather than one skill accumulating vendor worked examples; mitigated (not fully resolved) by moving worked examples to `references/vendors/<slug>.md` (Phase 1) so the skill body stays a thin dispatcher, closer to the distributed-plugin shape. |
| **Verdict** | `Acceptable product-specific` — downgraded from `Aligns with precedent`. The Composition and API & integration choices align well with named external precedent; the Extensibility choice (one consolidating skill vs distributed per-vendor tooling) is a documented, reasonable boilerplate-specific tradeoff rather than a full industry match, and is called out rather than glossed over. |

---

## Phase 1 — Author `api-integration/RULE.md` + `api-integrate/SKILL.md`

### Goal

Create the new rule (principles only, links out) and the new skill (full generic procedure, MCP-first, phased discovery→sample discipline generalized from `airtable-inspect`, with Supabase and Airtable as worked examples) — additive only, no deletions or edits to other files yet.

### Steps

1. Draft `.cursor/rules/api-integration/RULE.md`:
   - Frontmatter: `description`, **`alwaysApply: false`** with `globs` scoped to where integration work actually happens (e.g. `**/services/**`, `**/functions/**`, `supabase/functions/**`) — matches `database/RULE.md` / `cloud-functions/RULE.md`'s narrow-scope pattern, not `security/RULE.md`'s always-on pattern. *(Revised per `review-dev-plan`: Rebel + Scale/mod flagged `alwaysApply: true` as unjustified context cost for a concern that applies only when actually integrating a vendor.)*
   - Principles only (no procedure): read official docs before writing integration code; check for a matching MCP server (`GetMcpTools` pattern search on vendor name) before falling back to REST calls / scripts / browser fetch; cite the doc URL(s) or MCP tool(s) actually used; run a minimal POC before full integration code (cross-link `plan` skill § Optional: Foundation validation — do not duplicate); don't trust cached/stale docs.
   - Absorb `workflow/RULE.md` § Documentation Lookup's 3 lines here (superseded, not duplicated).
   - Link to `.agents/skills/api-integrate/SKILL.md` for the full procedure — do not inline phases/commands.
   - `Related Rules` section per existing rule-file convention (link `architecture/RULE.md`, `security/RULE.md`, `database/RULE.md`, `cloud-functions/RULE.md`, `project-specific/RULE.md` § external API costs).
2. Draft `.agents/skills/api-integrate/SKILL.md`, modeled on `.agents/skills/airtable-inspect/SKILL.md`'s structure but vendor-agnostic:
   - **Phase 0 — Locate:** official docs URL/OpenAPI/SDK; check `GetMcpTools` for a server matching the vendor name before assuming REST/browser is the only path.
   - **MCP fallback decision tree (explicit, not hand-wavy)** *(added per `review-dev-plan`: Scale/mod + Fork-impact flagged the original "check MCP, else fallback" as underspecified)*:
     - No server matches the vendor name → use docs/REST/scripts; state "no MCP server found for `<vendor>`" so the gap is visible, not silent.
     - Server matches but reports `needsAuth` / `error` / `loading` (per the MCP meta-tool contract) → treat as unusable, do not retry indefinitely; fall back and state which server was skipped and why.
     - Server matches and looks usable, but the specific tool call fails (auth, rate limit, wrong project/scope) → fall back after one retry; state the failure, do not silently trust a stale/partial result.
     - **Multiple servers match the same vendor** (e.g. a stack plugin skill's MCP server vs a fork's project-specific MCP server) → prefer the one scoped to the environment actually being worked in; state which was chosen and why. Never assume a fork-specific server name as the default — see worked examples below.
     - Always report **which path was used** (MCP tool name, or REST/script/docs) in the output, so the choice is auditable.
   - **Phase 1 — Schema/contract:** what exists (endpoints, auth method, required fields, types) — from docs or MCP schema tools, not memory; no request bodies/row data yet (mirrors `airtable-inspect` Phase 1 discipline).
   - **Phase 2 — Sample/wire shape:** one real request/response example (via MCP tool call, a minimal script, or a documented example) to see actual shapes (pagination envelope, error format, nested/linked structures) — mirrors `airtable-inspect` Phase 2.
   - **Worked examples live in `.agents/skills/api-integrate/references/vendor-<slug>.md`, not inline in `SKILL.md`** *(implemented as flat `references/vendor-supabase.md` and `references/vendor-airtable.md` — `projectStructure.config.cjs` allows only flat `references/*.md`, no subdirectories; see Notes during development)*:
     - `references/vendor-supabase.md` — **MCP path**, using the vendor-generic `plugin-supabase-supabase` server as the example, explicitly noting that project-specific servers (e.g. any `user-<project>-*` naming a fork happens to have) are an environment detail, not something to hardcode into the generic example. *(Fixed per `review-dev-plan`: Fork-impact flagged the original draft's use of this session's private `user-supabase-mila-production`/`-staging` server names as inappropriate to bake into a template skill.)*
     - `references/vendor-airtable.md` — **no-MCP path**, carrying over `airtable-inspect`'s exact commands (`scripts/airtable-meta-dump.js` then `scripts/airtable-sample-records.js`) and output template verbatim.
   - `SKILL.md` body stays a thin dispatcher: phases + fallback tree + a one-line pointer to `references/vendor-*.md` — mirrors how `pattern-review/SKILL.md` keeps the rubric out of the skill body.
   - Security callout matching `airtable-inspect`'s (never print keys/`.env` lines; redact PII in samples; low record limits).
   - Boundaries: hand off to `plan` § Investigate for file-level integration work; this skill only covers *researching* the API, not writing the integration code. Add one line distinguishing this skill from stack plugin skills (`supabase`, `cloudflare`, etc.): use `api-integrate` when researching an **unfamiliar** API/vendor; use the plugin skill when **operating inside a stack you're already on** — cross-reference the router disambiguation added in Phase 3.
3. Do not touch `workflow/RULE.md`, `database/RULE.md`, `cloud-functions/RULE.md`, `security/RULE.md`, or delete `airtable-inspect` yet — that's Phases 2–3, kept separate so each phase's gate is verifiable in isolation.

### Gate

- Both files exist at the planned paths, plus `references/vendor-supabase.md` and `references/vendor-airtable.md`.
- Manual checklist: rule contains no procedural steps/commands (principles + link only), `alwaysApply: false` with sensible globs; skill body contains the MCP-first phase with the full 4-state fallback tree, the two-phase discovery→sample discipline, and a pointer to both reference files (not inline examples); neither reference file names a fork-specific (non-plugin) MCP server.
- `pnpm lint` (markdown/prose lint if configured) passes on new files.
- `pnpm validate:structure` — confirm the new flat `references/vendor-*.md` files pass the whitelist alongside the rest of the skill folder (run now, not only in Phase 5, per `review-dev-plan` Delivery finding).

---

## Phase 2 — Generalize Supabase wording in `database`/`cloud-functions`/`security`

### Goal

Reword the *framing* of these three rules from "this is how Supabase works" to "this is how the configured backend works (this fork: Supabase)" — without deleting or diluting the load-bearing Supabase-specific mechanics.

### Steps

1. `database/RULE.md`:
   - Frontmatter `description`: reword from `"SQL migration best practices for Supabase/PostgreSQL..."` to `"SQL migration best practices for the configured relational database (this fork: Supabase/PostgreSQL)..."`.
   - Keep all SQL patterns, the new-table checklist, and CLI commands (`supabase db reset`, `supabase gen types typescript --local`, `supabase migration up`) verbatim — these are exact, correct-for-this-fork commands, not flavor text.
   - Add a line to `Related Rules` pointing to `api-integration/RULE.md` for "researching a new/unfamiliar backend or API before writing migrations against it."
2. `cloud-functions/RULE.md`:
   - Reword "Supabase Edge Functions MUST be housed in..." framing to lead with "this fork's serverless functions (Supabase Edge Functions)" — keep the exact path (`supabase/functions/`), deploy command, and the shared-project-across-branches fragility model verbatim (that's a real architectural constraint, not naming).
   - Add `Related Rules` line to `api-integration/RULE.md` for the "Server-Only Capabilities" / third-party API call case (Gamma API example already there — cross-link instead of re-explaining).
3. `security/RULE.md`:
   - § Database Verification currently reads as a **hard requirement** ("**ALWAYS** check database schema using MCP tools before making assumptions") with no fallback — this contradicts the new rule's graceful-degradation principle. **Reword to conditional** *(fixed per `review-dev-plan`: Fork-impact flagged this exact contradiction)*: "Check the database schema via MCP tools when a matching server is available (see `api-integration/RULE.md`); when none is configured, use the latest applied migration file or a schema export instead of relying on memory — never skip verification entirely, just the MCP-specific mechanism." Keep the "never assume table/column names" principle itself unchanged — only the MCP-or-nothing framing changes.
   - § Row Level Security (RLS) Performance: keep all SQL/syntax verbatim; add one-line label "(Postgres/Supabase-specific — this fork's backend)" at the section start so a fork on a different backend knows this section is conditional, not universal.
   - Add `Related Rules` line to `api-integration/RULE.md`.
4. `workflow/RULE.md` § Documentation Lookup: replace the 3 lines with a one-line pointer: "Superseded by `.cursor/rules/api-integration/RULE.md` (MCP-first, doc-freshness, POC-before-code)."

### Gate

- `rg -i "supabase" .cursor/rules/database/RULE.md .cursor/rules/cloud-functions/RULE.md .cursor/rules/security/RULE.md` — every remaining hit is either a command/syntax example or explicitly labeled as this fork's concrete backend, not stated as a universal fact.
- `pnpm lint` passes.
- No RLS syntax, CLI command, or deploy-model fact was altered — diff review confirms wording-only changes to framing sentences.

---

## Phase 3 — Retire `airtable-inspect`; repoint references

### Goal

Update every direct reference to point at `api-integrate` **first**, verify no dangling references remain, **then** delete the Airtable-only skill last — reordered per `review-dev-plan` (Delivery finding: deleting first risks a broken repo state if work stops mid-phase).

### Steps

1. `README.md` line ~206: `"See .agents/skills/airtable-inspect/SKILL.md for schema inspection"` → point to `.agents/skills/api-integrate/SKILL.md` (Airtable example section).
2. `src/config/app-tasks.json` — "Configure Airtable (optional)" task description: update the skill path reference the same way.
3. `.agents/skills/router/SKILL.md` — four spots (one more than originally scoped — found during `review-dev-plan`):
   - § This repo — integrations table row (`Inspect Airtable...` → generalize to "Research/integrate an external API or backend (MCP-first, schema→sample)" pointing at `api-integrate`).
   - § disambiguation section "Airtable: `airtable-inspect` phases" → replace with **"External API research: `api-integrate` vs stack plugin skills"**, explicitly stating: use `api-integrate` for an unfamiliar/new vendor; use the plugin skill (`supabase`, `cloudflare`, etc.) for operating inside a stack already configured; use a fork's own vendor-specific skill (if one exists, e.g. a fork-added `stripe-inspect`) when it's more specific than the generic path — don't force every integration through one skill. *(Expanded per `review-dev-plan`: Delivery + Fork-impact both flagged the original "fold or don't, agent's call" as too vague and a real discoverability regression risk.)*
   - § related-skills bullet list entry `.agents/skills/airtable-inspect/SKILL.md` → `.agents/skills/api-integrate/SKILL.md`.
   - **New:** near the existing "Supabase: `supabase` vs `supabase-postgres-best-practices`" disambiguation subsection, add one line pointing to the new "External API research" subsection above so the two related disambiguations are cross-linked (agents comparing plugin-skill choices will land near the research-skill choice too).
4. `documentation/jobs/skill-library/REGISTRY.md`:
   - Replace the `airtable-inspect` row with an `api-integrate` row (correct the stale `src/features/setup README` links-to cell — point at `README.md` § Airtable / `app-tasks.json` instead, since no `setup` feature exists in `src/`).
   - Append `; airtable-inspect → api-integrate` to the existing "Removed / merged (historical)" footnote line.
   - Refresh the file's editable-skill-count header if it tracks a running total.
5. `ARCHITECTURE.md` § API Integration: add a line pointing to `api-integration/RULE.md` / `api-integrate/SKILL.md` for "researching a new external API before wiring it up," alongside the existing Supabase/Airtable bullets (which stay, describing *what's configured*, not *how to research an API*).
6. **Interim reference check (before deletion):** run the actionable-reference grep below; confirm zero hits in the 5 live files just edited (README, app-tasks.json, router, REGISTRY, ARCHITECTURE) before proceeding.
7. **Delete `.agents/skills/airtable-inspect/` (the whole folder, not just `SKILL.md`)** — last step, after step 6 passes clean, so an empty orphaned folder never lands mid-phase.
8. Do **not** edit `CHANGELOG.md` (historical record — a retirement note is `finish`'s job, not this plan's, per Fork-impact finding above) or `DOC_SUPABASE_GOOGLE_OAUTH.md` / `start` skill (confirmed non-goals). `documentation/jobs/temp_job_setup-to-tasks/DEVELOPMENT_PLAN.md` is also historical and stays as-is.

### Gate

- **Actionable-reference grep** (not a bare name match — per `review-dev-plan`, a bare `airtable-inspect` match will always hit this plan's own filename and the REGISTRY historical footnote by design):
  ```
  rg -n "airtable-inspect/SKILL\.md|\.agents/skills/airtable-inspect" --glob '!CHANGELOG.md' --glob '!documentation/jobs/**/DEVELOPMENT_PLAN.md'
  ```
  Zero hits after step 7.
- `pnpm validate:docs` passes — **plus** manual confirmation that `README.md`, `ARCHITECTURE.md`, and `src/config/app-tasks.json` were actually updated (these are outside `validate:docs`'s scanned paths — see Conflict & compliance).
- Spot-check: following the chain README → `api-integrate` → `references/vendor-airtable.md` lands on the exact same commands `airtable-inspect` used to document.
- If the landing commit for this phase includes `src/config/app-tasks.json` alongside the `.md` changes, it is **not** a docs-only commit per `change-classify.cjs` — pre-commit will run the full path (type-check, structure) but **will not** auto-run `validate:docs`. Run `pnpm validate:docs` manually before commit; do not rely on the hook.

---

## Phase 4 — Update routing/registry/index layer docs

### Goal

Make the new rule+skill discoverable from every place the layer model requires (per `documentation/DOC_AGENT_WORKFLOW_LAYERS.md` § "When you change something": new invocable workflow → update `router/SKILL.md`; rules registry for skills → update `rules-registry.md`).

### Steps

1. `.cursor/rules/INDEX.md`:
   - Add a new `### API Integration (\`api-integration/RULE.md\`)` section (bullets: MCP-first check, doc-freshness, cite sources, POC-before-code, pointer to `api-integrate` skill) — same style as other rule categories.
   - Add a row to the **Consistency Check Matrix**: `api-integration | workflow, security, database, cloud-functions, project-specific`.
   - Add `api-integration` to the `workflow` and `security` rows' "Check These Rules" cells (bidirectional per existing matrix convention).
2. `.agents/skills/plan/references/rules-registry.md` — add a row: `| External API integration | .cursor/rules/api-integration/RULE.md — MCP-first, doc research, POC before code |`.
3. `documentation/DOC_AGENT_WORKFLOW_LAYERS.md` — add a new `## External API / backend integration research` section, same shape as the existing `## Pattern / industry-standard review` section (Procedure/Rubric-equivalent/Always-on-reminder table), so this concern has a single documented entry point like every other cross-cutting concern in that file.
4. `documentation/DOC_INDEX.md` — add one Quick Links row: `| Agent: external API integration (api-integrate) | .agents/skills/api-integrate/SKILL.md |`.
5. `documentation/jobs/skill-library/REGISTRY.md` — already updated in Phase 3; re-verify the row's `owns-concepts` and `links-to` cells match the new file's actual content after Phase 1 drafting.

### Gate

- Every new file is reachable within two hops from `AGENTS.md` → `.cursor/rules/INDEX.md` / `documentation/DOC_INDEX.md` / `.agents/skills/router/SKILL.md`.
- `pnpm validate:docs` passes.

---

## Phase 5 — Repo quality gate

### Goal

Final verification that nothing structural broke and no references were missed.

### Steps

1. `pnpm lint`
2. `pnpm validate:docs` (`validate:docs:links` + `validate:docs:refs`) — remember this does **not** cover `README.md`, `ARCHITECTURE.md`, `CHANGELOG.md`, or `.json` files; the manual checks below cover those.
3. `pnpm validate:structure` (confirm `.cursor/rules/api-integration/`, `.agents/skills/api-integrate/`, and flat `.agents/skills/api-integrate/references/vendor-*.md` all pass the whitelist with no config change needed; if a config change is required, stop and get explicit approval per `architecture/RULE.md` before proceeding)
4. Actionable-reference grep — same command as Phase 3's gate — zero hits:
   ```
   rg -n "airtable-inspect/SKILL\.md|\.agents/skills/airtable-inspect" --glob '!CHANGELOG.md' --glob '!documentation/jobs/**/DEVELOPMENT_PLAN.md'
   ```
5. Manual spot-check of the four files outside `validate:docs`'s scope: `README.md`, `ARCHITECTURE.md`, `src/config/app-tasks.json` point at `api-integrate`, not the deleted skill; `CHANGELOG.md` is untouched (historical).
6. Final read-through: `AGENTS.md` → `INDEX.md` → `api-integration/RULE.md` → `api-integrate/SKILL.md` → `references/vendor-{supabase,airtable}.md` chain reads coherently start to finish, and the router's new "External API research vs stack plugin skills" subsection is reachable from both the integrations table and the Supabase plugin-skill disambiguation.

### Gate

- All commands above pass with no errors.
- No dangling links, no orphaned mentions of the retired skill outside the historical files explicitly excluded above.

---

## Notes during development

- **Phase 1, worked-example file layout corrected during implementation:** `projectStructure.config.cjs`'s `references` whitelist entry only allows flat `*.md` files (`{ name: "references", children: [{ name: "*.md" }] }`) — no subdirectories. The planned `references/vendors/<slug>.md` layout failed `pnpm validate:structure`. No existing skill (`router`, `pattern-review`, `write-adoption-guide`) actually uses a `references/` subdirectory either — the plan's premise that this was already a real pattern was incorrect. Fixed by flattening to `references/vendor-<slug>.md` (`vendor-supabase.md`, `vendor-airtable.md`) instead of changing the whitelist config — avoids the "stop and get explicit approval" config-change gate in Phase 5 entirely.
- **Phase 3, router disambiguation:** implemented the "cross-link Supabase disambiguation to the new external-API-research subsection" requirement by directly extending the existing "Supabase: `supabase` vs `supabase-postgres-best-practices`" subsection into a three-way disambiguation (adding `api-integrate`) rather than adding a separate one-line pointer nearby — same outcome (discoverable cross-reference), tighter integration.
- **All 5 phases implemented and gated in one pass** (branch `feature/agent-only-glue`, already in-flight with unrelated work from other threads on the same checkout — per user instruction, no new branch was created to avoid branch sprawl). All phase gates passed: `pnpm lint` (0 errors, pre-existing warnings only), `pnpm validate:structure`, `pnpm validate:docs`, actionable-reference grep (zero hits outside this plan file), manual spot-checks on `README.md`/`ARCHITECTURE.md`/`src/config/app-tasks.json`/`CHANGELOG.md`.
- **Post-validate polish (2026-07-11):** Fixed all open `validate` findings — "always-on" → "globs-scoped" wording in `api-integrate/SKILL.md`, `router/SKILL.md`, `DOC_AGENT_WORKFLOW_LAYERS.md`; `DOC_AGENT_WORKFLOW_LAYERS.md` parity (conceptual intro, When-you-change row, Related link, Callers format); `security/RULE.md` § Database Verification third MCP-unusable state + target-environment migration wording; `api-integration/RULE.md` § Full procedure (SSOT in skill) heading + `**/lib/**` glob; plan body stale `references/vendors/` paths updated to flat `references/vendor-<slug>.md`.

## Decisions made

| # | Topic | Choice | Precedent? |
|---|-------|--------|------------|
| 1 | Overall direction after `review-dev-plan` | Keep the rule+skill architecture and Supabase-rewording/retirement scope; fix the concrete must-fixes (gates, MCP fallback tree, router disambiguation, `alwaysApply`, security contradiction, Pattern & precedent verdict, fork-specific server names) rather than shrinking to Rebel's smaller-scope alternative or the hybrid middle ground | Yes — user chose explicitly among 3 options |
| 2 | `alwaysApply` on `api-integration/RULE.md` | Changed from `true` to `false` with globs, matching `database`/`cloud-functions/RULE.md` | No (review finding, not asked — Rebel + Scale/mod both flagged; low-risk mechanical fix) |
| 3 | Worked-example placement | Moved from inline in `SKILL.md` to flat `references/vendor-<slug>.md` (not nested `references/vendors/` — structure whitelist) | No (review finding — matches existing repo convention, not asked) |
| 4 | Supabase worked example server name | Removed fork-specific `user-supabase-mila-*` names; use generic `plugin-supabase-supabase` | No (review finding — objectively fork-inappropriate, not asked) |
| 5 | Pattern & precedent verdict | Downgraded `Aligns with precedent` → `Acceptable product-specific`; precedents rewritten to lead with MCP/OpenAPI/SDK-first external citations | No (review finding, not asked) |
| 6 | `security/RULE.md` § Database Verification wording | Reworded from hard MCP requirement to conditional (MCP when available, schema export/migration file otherwise) | No (review finding — resolves a direct contradiction, not asked) |
