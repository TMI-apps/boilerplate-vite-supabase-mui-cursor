---
name: router
description: >-
  Picks the next action and skill, then invokes it (read that SKILL.md and execute the workflow
  in the same turn). Mid-thread: continue the logical next step on active work. Idle or new:
  fall back to gates and app-tasks.json backlog. Maps situations to project, user, and plugin
  skills; resolves overlaps. Product context SSOT: documentation/DOC_APP_VISION.md. Use when
  the user types /router, asks which skill to use, starts ambiguous work, or routes slash
  commands to SKILL.md files. Bare /router is next-action dispatch (not finish).
---

# Skill router

Use this file to pick **one primary skill** (sometimes two in sequence).

**Invocation contract (always):** After you decide the primary skill — and any secondary skill that must run **next** in order — **read that skill’s `SKILL.md` and execute its workflow starting in this same turn.** Invoking means load + follow steps, not naming a path or asking the user which skill file to open. If two skills apply sequentially (for example `plan` → `implement`), finish the first’s applicable step or hand off explicitly per that skill, then read and run the second without ending on a static routing table alone.

## `/router` — pick next action + skill

**Purpose:** `/router` means “decide the **most logical next step** for this thread, pick the skill, and **do it**.” The user should not have to name the skill.

**Resolution order (always):**

1. **Thread continuation** — active in-flight work in this conversation (see **Active thread work** below).
2. **Substantive request** — user message names a task, question, or change → **Decision model** gates + **Situation → skill** (skip backlog).
3. **Backlog intake** — only when step 1 finds **no** active thread work **and** the message is bare `/router` or equivalent idle dispatch (see **App task backlog**).

**Bare `/router`:** Message is only `/router` (optional whitespace) with **no substantive task or question**. Run step 1 first; if no active thread work, fall through to backlog intake. This is **not** `finish` and **not** “commit the working tree” unless thread continuation clearly left off at validated, landing-ready work **and** the user’s prior turn signaled wrap-up (otherwise prefer `validate` or the next implement phase — do not auto-commit).

**On continuation:** Briefly state one line — `Next: [action] → \`skill\`` — then read and run that skill. Do not re-run full backlog selection or restart gates 1–2 when the thread already has a bounded active job.

### Active thread work

Treat the thread as **mid-task** when **any** of these hold:

| Signal | Examples |
|--------|----------|
| **Conversation** | Recent turns executing `implement`, `quick-piv`, `feature`, `debug`, `grill-me`, or `plan` § Refine on a specific job; quick plan posted but implement/validate not done |
| **Open / recent files** | `documentation/jobs/temp_job_*/DEVELOPMENT_PLAN.md` tied to the current job |
| **Plan state** | Active plan has pending phases, `Plan review: Required: pending`, or incomplete **Pattern & precedent** when M/L requires it |
| **Working tree** | `git status` shows changes that match the thread’s stated scope (same job/files discussed) |

**Not** active thread work: new or idle chat; prior job explicitly completed in thread; user clearly changed topic; only unrelated uncommitted files with no in-thread narrative.

**Context gather (step 1):** Skim recent thread; note open/recent job paths; run `git status -sb` when the tree may inform the next step; load the active `DEVELOPMENT_PLAN.md` when one applies.

### Thread → next skill (mid-task)

Pick **one** primary by the **most blocking** row that applies (top wins). Then invoke it.

| Thread state | Next skill |
|--------------|------------|
| Active `debug` incident; root cause unknown | `debug` |
| `feature` phase incomplete | `feature` |
| Gates 1–2 still fail **on the current job** | `grill-me` or `plan` § Refine (same split as **Clarification-first routing**) |
| Plan exists; **Plan review** pending (M/L) | `review-dev-plan` |
| Plan exists; **Pattern & precedent** missing when required | `pattern-review` (`plan-section`) or resume `plan` |
| Plan exists; pending phase(s) | `implement` |
| Plan exists; XS/S in-thread extension only | `quick-piv` |
| No plan file; quick plan in chat; implement/validate incomplete | `quick-piv` |
| All planned phases done; full audit not yet run | `validate` |
| Validated; user/thread signaled landing | `finish` (only when wrap-up is the clear next step — not the default for bare `/router` on new work) |

Align with [dev-cycle matrix](references/dev-cycle-matrix.md). When unfamiliar with repo state mid-job, run **`prime`** once, then continue with the chosen skill — do not replace thread continuation with backlog intake.

**`/finish`** is only for explicit wrap-up — read `.agents/skills/finish/SKILL.md` when the user invokes finish or asks to commit completed work (not the default idle `/router` outcome).

**Quality bar:** Listed skills were reviewed for actionable structure (clear triggers, steps, or rubrics).

---

## Decision model: goals + requirements → skill

For **new or substantive** requests — and after **Active thread work** is ruled out — route in **three gates**. Answer in order; **do not skip gate 1 or 2** to reach `plan` or `implement`. When the thread is **mid-task**, use **Thread → next skill** instead of restarting gates unless the user explicitly changes scope.

### Gate 1 — Goal / outcome

**Question:** Can you state what “done” means in one sentence, with something verifiable (demo, test, or checklist)?

| State | Meaning |
|-------|---------|
| **Clear** | Intended behavior or artifact is agreed; success is falsifiable. |
| **Unclear** | Wish or direction only; conflicting interpretations possible; “make it better” with no bar. |

If unclear, ask about the user's intended app usage, product vision, priorities, or real user journey. **First read** `documentation/DOC_APP_VISION.md` when it may already answer “who / why / what the app is for”; if it is still **`DRAFT`**, route the user to complete it (`.agents/skills/start/SKILL.md` § App vision) or treat lack of vision as ambiguity until they defer in writing. Do not route into full planning until the answer removes ambiguity.

### Gate 2 — Scope / requirements

**Question:** Is **in-scope vs out-of-scope** explicit enough to choose layers and files without inventing product scope?

| State | Meaning |
|-------|---------|
| **Bounded** | Boundaries, constraints, and “not doing X” are understood (or intentionally left open **only** where documented). |
| **Unbounded** | Missing acceptance hints, unknown data/auth/API shape, or “everything flexible.” |

If the emerging direction would diverge from industry standards, framework best practices, or established repo conventions, ask whether the diversion is intentional or whether to align with best practices before routing to implementation.

### Gate 3 — Delivery shape (only after gates 1–2 pass)

**Question:** How big and how risky is the **engineering** change?

| Signal | Typical skill |
|--------|----------------|
| Single area, few files, no migration / no breaking API | `quick-piv` |
| Multiple phases, migrations, cross-cutting rules, or durable handoff doc | `plan` → `implement` |
| Dense product decisions, journeys, roles, explicit approval checkpoints | `feature` |

### Clarification-first routing (gate 1 or 2 fails)

**Do not open `DEVELOPMENT_PLAN.md` yet.** Pick by **what is missing**:

| Missing | Prefer |
|---------|--------|
| Vision, priorities, tradeoffs, UX intent | `.agents/skills/grill-me/SKILL.md`; ask app-usage questions until ambiguity is removed |
| Concrete behavior, APIs, data, acceptance examples | Follow **Refine** in `.agents/skills/plan/SKILL.md` (questions and tables there — stop before **Investigate** until gates pass); frame questions around the user's intended app usage when product meaning is unclear |
| You lack repo grounding while clarifying | `.agents/skills/prime/SKILL.md` **before or mixed with** clarification |

After gates 1–2 pass, **re-run** the flowchart from the top (especially if the user changed scope).

### Matrix (compact)

Rows = gate 1–2; columns = gate 3 applies only when both are **Clear / Bounded**.

| Goal | Scope | Next step |
|------|-------|-----------|
| Unclear | any | Clarify (`grill-me` and/or `plan` § Refine); optional `prime` |
| Clear | Unbounded | Bound scope (`plan` § Refine); optional `prime` |
| Clear | Bounded | Use flowchart below for `quick-piv` vs `plan` vs `feature` |

### Flowchart

```mermaid
flowchart TD
  A[New request] --> B{Gate 1: Goal clear?}
  B -->|No| C{Ambiguity flavor}
  C -->|Product / vision / tradeoffs| D[grill-me]
  C -->|Technical acceptance / examples| E[plan § Refine only]
  B -->|Yes| F{Gate 2: Scope bounded?}
  F -->|No| E
  F -->|Yes| G{Gate 3: Size and risk}
  G -->|Small localized change| H[quick-piv]
  G -->|Multi-phase migration cross-cutting doc| I[plan then implement]
  G -->|Heavy decisions journeys roles| J[feature]
  D --> K[Re-check gates 1 to 2]
  E --> K
  K --> B
```

Optional: run **`prime`** once when the codebase or branch context is unfamiliar — it does not replace gates 1–2.

**Dev-cycle (SSOT):** [`.agents/skills/router/references/dev-cycle-matrix.md`](references/dev-cycle-matrix.md) — full happy path, M/L gates, and plan depth. Do not duplicate that matrix here.

---

## Situation → skill

### This repo — workflow & delivery

| Situation | Skill |
|-----------|--------|
| User sends **only** `/router` (no substantive task); see **`/router` — pick next action + skill** | Thread continuation if mid-task; else `app-tasks.json` → `prime` → `grill-me` → `quick-piv` or `plan` |
| New chat / ambiguous task; map repo rules and recent git state | `.agents/skills/prime/SKILL.md` |
| **Goal and scope clear**; non-trivial job needing phased written plan + compliance | `.agents/skills/plan/SKILL.md` |
| Plan written; qualitative critique before implementation (especially Complexity M/L) | `.agents/skills/review-dev-plan/SKILL.md` |
| Industry standard / best practice / “is this how products usually do it?” | `.agents/skills/pattern-review/SKILL.md` |
| Write a cross-repo adoption guide from an implemented pattern | `.agents/skills/write-adoption-guide/SKILL.md` |
| Goal or scope **not** ready — clarify only (no `DEVELOPMENT_PLAN.md` yet); **one** primary by missing dimension (see **Clarification-first routing**) | Product/vision → `grill-me`; acceptance/APIs → `plan` **§ Refine** only |
| Execute an existing `DEVELOPMENT_PLAN.md` phase by phase | `.agents/skills/implement/SKILL.md` |
| Small scoped change; plan+implement+validate in one pass | `.agents/skills/quick-piv/SKILL.md` |
| Review plan or implementation **without** editing by default; pre-merge / post-refactor gate (auto-selects plan-review / impl-full / gate depth) | `.agents/skills/validate/SKILL.md` |
| Component-level rubric (props, MUI, a11y, tests) | `.agents/skills/review/SKILL.md` |
| Version, changelog, staging gate, **local** commit | `.agents/skills/finish/SKILL.md` |
| Bundle **all** uncommitted work from multiple agent threads (same checkout), then push | `.agents/skills/bundle-ship/SKILL.md` |
| Push already committed work (after `finish`) | `.agents/skills/push/SKILL.md` |
| Promote `develop` staging to production (`main`) | `gh workflow run promote-to-production.yml` — see `.cursor/rules/workflow/RULE.md` § Promote to production (not `finish`, not a squash PR) |
| Human onboarding; README quick start + dev task backlog | `.agents/skills/start/SKILL.md` (includes **App vision** gate → `documentation/DOC_APP_VISION.md`) |

### This repo — product & codebase shape

| Situation | Skill |
|-----------|--------|
| Full feature request with mandatory decision stops and phased spec | `.agents/skills/feature/SKILL.md` |
| Scientific debugging; hypotheses; user supplies runtime evidence | `.agents/skills/debug/SKILL.md` |
| Pre-registered hypothesis loop; naive fixes failed or user invokes hypothesis mode | `.agents/skills/hypothesis/SKILL.md` |
| Ultra-compressed communication (`/caveman`, "be brief", "less tokens") | `.agents/skills/caveman/SKILL.md` (overlay — not a workflow step) |
| Stress-test product/design when gates 1–2 already pass (not gate-1 ambiguity) | `.agents/skills/grill-me/SKILL.md` |
| Simplify **one** concrete feature (flows + code), reduce steps/complexity | `.agents/skills/challenge/SKILL.md` |
| Find cross-feature duplication, consolidation candidates, or semantic placement repair (after tooling is green) | `.agents/skills/consolidate/SKILL.md` |
| Optimize hotspots: design → approach → efficiency → complexity | `.agents/skills/optimize2/SKILL.md` |
| React perf patterns (bundle, waterfalls, re-renders) for Vite SPA | `.agents/skills/react-perf-vite/SKILL.md` |
| Retro from failures/diffs; persist lessons into rules or skills | `.agents/skills/learn/SKILL.md` |
| Audit/improve the **skill library** as a whole (overlap, SSOT, conflicts, handoffs); subagent lenses + no-loss pass | `.agents/skills/improve-skill-library/SKILL.md` |
| Grade **or** improve an attached rule/command file (rubric score and/or quality rewrite) | `.agents/skills/rule-quality/SKILL.md` |

### This repo — integrations

| Situation | Skill |
|-----------|--------|
| Inspect Airtable — schema (`tbl…` / `fld…`, no rows) then sample cell shapes | `.agents/skills/airtable-inspect/SKILL.md` (Phase 1 schema → Phase 2 sample) |

### User-level Cursor skills (`~/.cursor/skills-cursor/`)

| Situation | Skill |
|-----------|--------|
| Author or refactor Agent Skills (`SKILL.md`) | `~/.cursor/skills-cursor/create-skill/SKILL.md` |
| Migrate `.mdc` rules / slash commands → skills | `~/.cursor/skills-cursor/migrate-to-skills/SKILL.md` |
| Create `.cursor/rules` `.mdc` guidance | `~/.cursor/skills-cursor/create-rule/SKILL.md` |
| Cursor hooks (`hooks.json`, hook scripts) | `~/.cursor/skills-cursor/create-hook/SKILL.md` |
| Custom subagents | `~/.cursor/skills-cursor/create-subagent/SKILL.md` |
| PR merge-ready loop (comments, conflicts, CI) | `~/.cursor/skills-cursor/babysit/SKILL.md` |
| Split work into small PRs | `~/.cursor/skills-cursor/split-to-prs/SKILL.md` |
| Standalone analytical UI artifact (`.canvas.tsx`) | `~/.cursor/skills-cursor/canvas/SKILL.md` |
| IDE `settings.json` | `~/.cursor/skills-cursor/update-cursor-settings/SKILL.md` |
| CLI `~/.cursor/cli-config.json` | `~/.cursor/skills-cursor/update-cli-config/SKILL.md` |
| CLI status line | `~/.cursor/skills-cursor/statusline/SKILL.md` |
| User typed `/shell` — run remainder literally | `~/.cursor/skills-cursor/shell/SKILL.md` |

### Plugin skills (paths vary by install; discover under `~/.cursor/plugins/`)

| Situation | Skill (name) |
|-----------|----------------|
| Any Supabase product (Auth, DB, Edge, Realtime, Storage, MCP, migrations) | `supabase` |
| Postgres query/schema performance, pooling, RLS performance | `supabase-postgres-best-practices` |
| Cloudflare platform routing (“what product do I use?”) | `cloudflare` |
| Wrangler CLI commands and config | `wrangler` |
| Workers code author/review, anti-patterns | `workers-best-practices` |
| Durable Objects design/review | `durable-objects` |
| Agents SDK reference-heavy agent work | `agents-sdk` |
| Generate/deploy AI agent app on Cloudflare | `building-ai-agent-on-cloudflare` |
| Remote MCP server on Workers | `building-mcp-server-on-cloudflare` |
| Untrusted code execution / sandbox | `sandbox-sdk` |
| Core Web Vitals / Lighthouse-style audit (Chrome DevTools MCP) | `web-perf` |

---

## When more than one skill seems relevant

Choose by **primary outcome** (what must be true when done). If two outcomes are required, run skills **in order** (e.g. plan → implement → validate → finish). Use **Decision model** above first: neither `plan` nor `feature` should start until gates 1–2 pass (unless you are intentionally only running **`plan` § Refine** or **`grill-me`**).

### `plan` vs `feature`

- **`plan`:** Engineering execution plan (`DEVELOPMENT_PLAN.md`, phases, gates, repo compliance). Use when gates 1–2 are **Clear / Bounded** and the gap is **structured implementation**, not discovery of what to build.
- **`feature`:** Deep product/requirements process with **mandatory user decision stops** and journey mapping. Use when gate 3 calls for **high decision density** (roles, journeys, approvals) even though gates 1–2 may be partly filled as you go — still clarify unknowns early within that skill, especially app-usage ambiguity and intentional standards diversions.

### `plan` vs `quick-piv`

- **`quick-piv`:** Single pass; chat-sized plan OK; small scope.
- **`plan`:** Multi-phase, migrations, breaking changes, or anything needing a durable plan file others can follow.

### `validate` (auto-selects depth)

- **`validate`** auto-selects depth from context: **plan-review** (plan only), **impl-full** (rules + tooling + plan-compliance after implementing against a plan), or a lighter **gate** (pre-merge/post-refactor structural confidence on a diff with no governing plan). No user mode input needed. See `.agents/skills/validate/SKILL.md` § Mode auto-selection.

### `validate` gate vs `consolidate` § Semantic placement

- **`validate` (gate mode):** Routine pre-merge gate on current scope (rule subagents + scripts).
- **`consolidate` § Semantic placement mode:** After linters pass — **semantic** placement, duplication, cross-feature boundaries, refactoring impact.

### `consolidate` vs `optimize2`

- **`consolidate`:** **Repo-wide** redundancy audit and prioritization (discovery of shared patterns).
- **`optimize2`:** **Targeted** optimization at four levels for chosen code; Rule of Three for extractions. Use for **hot paths** or known-complex modules.

### `consolidate` — Redundancy audit vs Semantic placement mode

- **Redundancy audit (default):** “What repeats?” → unify abstractly (may stay duplicated by decision).
- **Semantic placement mode:** “Is code in the **wrong** layer/feature?” → move/refactor for boundaries (after tooling is green).

### `challenge` vs `optimize2`

- **`challenge`:** Question whether the **feature or workflow** should exist or be simpler (remove/merge steps).
- **`optimize2`:** Improve existing code **without** necessarily changing product scope.

### `debug` vs `hypothesis`

- **`debug`:** Default for runtime incidents — event chains, user-supplied evidence, iterative narrowing (`.agents/skills/debug/SKILL.md`).
- **`hypothesis`:** Pre-registered root-cause experiment when naive fixes already failed or the user invokes hypothesis mode (`.agents/skills/hypothesis/SKILL.md`).
- **Tiebreak:** User asks for hypothesis / repeated failed fixes → `hypothesis`; otherwise → `debug`. Cross-link both skills; do not run both as equal primaries in one pass.

### `debug` vs `learn`

- **`debug`:** Active incident; hypotheses; runtime evidence; possibly temporary instrumentation.
- **`learn`:** After resolution or struggle — **capture durable** rule/skill/debug-pattern updates.

### `rule-quality` vs `learn`

- **`rule-quality`:** Score (Mode A) or rewrite (Mode B) **provided rule/command text**.
- **`learn`:** Decide **where** lessons live (rules vs skills vs debug appendix) from incident context.

### `improve-skill-library` vs `rule-quality` / `consolidate`

- **`improve-skill-library`:** **System-level** audit of the whole `.agents/skills/` corpus — separation of concerns, SSOT, conflicts, handoffs — via parallel lens subagents and a no-information-loss gate. Edits skills + router/layers spine.
- **`rule-quality`:** One **rule/command file's** grade or prose. **`consolidate`:** duplication in **`src/` application code**, not skills.

### `rule-quality` vs `review`

- **`rule-quality`:** Grade or improve **rules/commands** (rubric + quality standards).
- **`review`:** Score **React/MUI components** with component rubric.

### `grill-me` vs `plan` § Refine

- **`grill-me`:** Product/design **Q&A** until shared understanding (questions first). Fits **gate 1** failures dominated by vision and tradeoffs. Includes an optional **Zoom out first** reflection (problem, recent attempts, wider alternative) — formerly the `stepback` skill.
- **`plan` § Refine:** Engineering-level clarification — acceptance and scope bounds (**gate 2**); stop before **Investigate**. Full **`plan`** only after gates 1–2 pass — then produce the plan document.

### `prime` vs `start`

- **`prime`:** Agent loads **technical** context for implementation.
- **`start`:** Human **first-time setup** walkthrough.

### `finish` vs `push` vs `bundle-ship`

- **`finish`:** Commit-ready locally (version, changelog, staging rules).
- **`bundle-ship`:** Multi-thread same-checkout landing — one bundled `finish` commit, then `push` in one invocation.
- **`push`:** Remote sync only **after** commits exist; never commit inside push.

### `canvas` vs `validate` / reporting

- **`canvas`:** Standalone **visual artifact** (tables, timelines, rich layouts) as deliverable.
- **`validate`:** Structured **text report**; default no edits.

### Airtable: `airtable-inspect` phases

- One skill, two phases: **Phase 1 schema first**, **Phase 2 samples second** (skill body enforces the order).

### Supabase: `supabase` vs `supabase-postgres-best-practices`

- **`supabase`:** Product workflows, Auth, RLS correctness, CLI/MCP, migrations narrative.
- **`supabase-postgres-best-practices`:** **Performance** tuning, query plans, indexing, pooling — narrow DB optimization.

### Cloudflare: `cloudflare` vs `wrangler` vs `workers-best-practices`

- **`cloudflare`:** Pick **product** (Workers vs Pages vs DO vs R2…).
- **`wrangler`:** **CLI** syntax and deploy/dev workflow.
- **`workers-best-practices`:** **Code/config review** against current Workers guidance.

### Cloudflare agents: `agents-sdk` vs `building-ai-agent-on-cloudflare`

- **`agents-sdk`:** Reference-led SDK usage (state, RPC, docs fetch).
- **`building-ai-agent-on-cloudflare`:** End-to-end **generated** agent app and deployment narrative.

### `building-mcp-server-on-cloudflare` vs `agents-sdk` (MCP sections)

- **`building-mcp-server-on-cloudflare`:** **Expose** tools as remote MCP with OAuth/deploy.
- **`agents-sdk`:** **Consume** or embed MCP patterns inside Agents SDK — use when agent wiring dominates.

### `web-perf` vs `optimize2` vs `react-perf-vite`

- **`web-perf`:** **Browser-measured** performance (CWVs, network, traces via DevTools MCP).
- **`optimize2`:** **Code-level** structure and complexity optimization (may include perf but not Lighthouse-centric); Rule of Three for extractions.
- **`react-perf-vite`:** **Pattern lookup** for stack-native React perf (lazy routes, TanStack dedup, re-render rules) — read `rules/` on demand; does not replace hotspot refactor.

**Order when multiple apply:** measure with **`web-perf`** if symptoms are CWV/Lighthouse → structural fix with **`optimize2`** → cite specific **`react-perf-vite`** rules while implementing.

### Plan review stack (ordered pipeline)

When the user asks to **review a plan** or before **implement** on Complexity **M/L**, run **in order** — do not pick multiple primaries for the same pass:

1. **`pattern-review`** (`plan-section`) during **`plan`** step 5 when M/L or new user-visible/contracts — fills **Pattern & precedent** in the plan.
2. **`review-dev-plan`** when Summary says `Plan review: Required: pending` (mandatory for M/L).
3. **`validate`** (plan-review mode) for **repo rule** compliance on the plan document.

Do **not** run standalone **`pattern-review`** `scan` in the same session if **`review-dev-plan`** already ran the industry-precedent lens (unless the user requests a delta review).

### `implement` vs `quick-piv`

- **`implement`:** Active `DEVELOPMENT_PLAN.md` with multi-phase or durable execution — phase-by-phase SSOT.
- **`quick-piv`:** **XS/S** scope only; chat-sized extension or no plan file. **Never** when plan **Complexity** is **M/L** or **Plan review** is pending — use **`implement`** after gates pass.

### `debug` vs `quick-piv`

- **`debug`:** Unknown cause, need hypotheses and runtime evidence.
- **`quick-piv`:** Root cause known; small scoped fix with clear gate.

### `challenge` vs `feature`

- **`feature`:** Net-new capability with mandatory 🔴 decision stops and journey mapping.
- **`challenge`:** Simplify an **existing** named feature/workflow (flow + code).

### `start` — onboarding

- **`start`:** Human first-time setup via README + dev task backlog (`/tasks`); app vision gate.

### `prime` vs clarification skills

- **`prime`:** Optional **once** for technical repo context — not a substitute for gates 1–2.
- **Order when both needed:** `prime` (if unfamiliar) → **`grill-me` OR `plan` § Refine`** (one primary) → re-run gates → delivery skill.

### `review` vs `optimize2`

- **`review`:** Qualitative **component** rubric score (170-point).
- **`optimize2`:** Structural/perf refactor of a **hotspot** at four levels.

### `quick-piv` vs `validate`

- **`quick-piv`:** Inline tooling checks only (“quick validate”) — not the **`validate`** skill fan-out.
- **`validate`:** Full rule subagents + plan-compliance when the user asks to validate or before merge/finish.

### `feature` vs `plan` / `implement` (orchestrator)

- **`feature`:** Primary outcome = product/requirements artifact + mandatory decision stops. **Not** the durable execution plan.
- **`plan`:** Produces `DEVELOPMENT_PLAN.md`. **`implement`:** Executes it. After **`feature`** Phase 4, run **`plan`** (or ensure `DEVELOPMENT_PLAN.md` exists) before **`implement`**.

### `quick-piv` (orchestrator)

- **Primary outcome:** Land a **small** scoped change in one session. Compresses plan/implement/validate steps — defers to **`validate`**, **`finish`**, and full **`plan`** for M/L, commits, and durable plans.

### Thread continuation vs backlog intake

- **Thread continuation:** Mid-task `/router` — resume the active job via **Thread → next skill**; do not read `app-tasks.json` first.
- **Backlog intake:** Idle thread + bare `/router` — pick from `app-tasks.json` per **App task backlog**.
- **Conflict:** If thread work and backlog `in-progress` disagree, **thread wins** unless the user explicitly asks to switch tasks.

### Bare `/router` vs `finish` (situation table)

- **Bare `/router`** (no task text): **next-action dispatch** — **Active thread work** first; only when idle, **backlog intake** from `src/config/app-tasks.json`. **Not** default `finish` on new/idle dispatch.
- **`/finish`:** explicit wrap-up — includes archiving the session task when applicable (see `finish` skill). Not the default for idle `/router`.

### App task backlog (SSOT)

- **Active:** `src/config/app-tasks.json` (`to-do` | `in-progress` only; array order = priority).
- **Archive:** `src/config/app-tasks-archive.json` (`done` only; append order = completion timeline). **Do not read** unless the user asks for completed history.
- **Coding agent pick up:** when the assistant **commits to execute** a backlog task, set `in-progress` in the active file **in the same turn** before `prime`, `grill-me`, `plan`, or code. User edits in `/tasks` UI do **not** trigger pick-up.
- **Onboarding tasks:** Fresh clones ship five seeded tasks (Supabase, Hosting, App vision, Airtable optional, Theme). Agents sync status at session boundaries per `start`, `router`, and `finish` — edit JSON directly or via `/__dev/tasks` when dev server runs. Disk-wins on UI conflicts.
- **Backlog intake** (fallback only — after **Active thread work** is ruled out):
  - Read only `src/config/app-tasks.json`.
  - If `in-progress` exists: ask continue that task vs first `to-do` by list order.
  - Else select first `to-do` by list order.
  - Apply pick up for the chosen task (skip if already `in-progress`).
  - Then `prime` (if needed) → `grill-me` unless `title` + `description` satisfy gates 1–2 → `quick-piv` or `plan` / `feature` per gate 3.
- If no actionable `to-do` or `in-progress`: say so; optional `prime` for repo context — do **not** invent tasks and do **not** default to `finish`.

---

## Skill index (paths)

### Project (this repo)

- `.agents/skills/router/SKILL.md` — this file
- `documentation/DOC_APP_VISION.md` — product SSOT (problem, persona, app’s role)
- `.agents/skills/plan/SKILL.md`
- `.agents/skills/implement/SKILL.md`
- `.agents/skills/validate/SKILL.md` (auto-selects plan-review / impl-full / gate depth)
- `.agents/skills/consolidate/SKILL.md`
- `.agents/skills/review/SKILL.md`
- `.agents/skills/finish/SKILL.md`
- `.agents/skills/bundle-ship/SKILL.md`
- `.agents/skills/push/SKILL.md`
- `.agents/skills/quick-piv/SKILL.md`
- `.agents/skills/prime/SKILL.md`
- `.agents/skills/start/SKILL.md` (onboarding via README + dev task backlog)
- `.agents/skills/learn/SKILL.md`
- `.agents/skills/challenge/SKILL.md`
- `.agents/skills/feature/SKILL.md`
- `.agents/skills/debug/SKILL.md`
- `.agents/skills/hypothesis/SKILL.md`
- `.agents/skills/caveman/SKILL.md` (communication overlay — not workflow)
- `.agents/skills/rule-quality/SKILL.md`
- `.agents/skills/improve-skill-library/SKILL.md`
- `.agents/skills/optimize2/SKILL.md`
- `.agents/skills/react-perf-vite/SKILL.md`
- `documentation/DOC_REACT_PERF.md` — human overview (links to skill)
- `.agents/skills/airtable-inspect/SKILL.md`
- `.agents/skills/grill-me/SKILL.md`
- `.agents/skills/pattern-review/SKILL.md`
- `.agents/skills/review-dev-plan/SKILL.md`
- `.agents/skills/write-adoption-guide/SKILL.md`

### Router references (not skills)

- `.agents/skills/router/references/dev-cycle-matrix.md` — dev-cycle happy path and M/L gates (SSOT)

### User Cursor bundle (`~/.cursor/skills-cursor/`)

- `create-skill`, `migrate-to-skills`, `create-rule`, `create-hook`, `create-subagent`, `babysit`, `split-to-prs`, `canvas`, `update-cursor-settings`, `update-cli-config`, `statusline`, `shell` — each under its own folder `SKILL.md`.

### Plugins

Resolve paths via workspace MCP descriptors or `~/.cursor/plugins/cache/` — skill names: `supabase`, `supabase-postgres-best-practices`, `cloudflare`, `wrangler`, `workers-best-practices`, `durable-objects`, `agents-sdk`, `building-ai-agent-on-cloudflare`, `building-mcp-server-on-cloudflare`, `sandbox-sdk`, `web-perf`.

---

## Not present in this workspace

The agent inventory may list skills that are **not** checked into this repo (e.g. generic architecture/TDD/issue PRD skills). If absent on disk, substitute **`plan` / `consolidate` / `validate`** or add a project skill before relying on them.
