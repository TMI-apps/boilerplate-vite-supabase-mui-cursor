# Development plan: Agent-only workflow glue

## Summary

- **Goal:** Close the **routing and intake gaps** identified in the agent-only audit — without duplicating `finish`, `push`, `validate`, `plan`, or `feature`. Wire existing skills into a default chain so humans who only file features/bugs are not required to coordinate git, CI, or protected-file stalls.
- **Why:** Repo already documents most of the lifecycle; failures at scale are **disconnected handoffs** (push without CI follow-through), **unstructured bug intake**, **agents saying “done” before user app test**, and **missing implement gates** (classifier denylist). Audit: grill session 2026-07-11.
- **Complexity:** XS — skill/router/doc edits only; no `src/` app code, migrations, or hooks.
- **Plan review:** Not required (XS; no user-visible product behavior — agent routing only).
- **Scope / constraints:**
  - **In:** Thin patches to `router`, `dev-cycle-matrix`, `debug`, `finish`, `implement`, `validate` (optional checklist line), `DOC_AGENT_WORKFLOW_LAYERS.md`; document standing protected-file consent pattern (user rules, not weakening `workflow/RULE.md`).
  - **Out:** New ticket system, new commands, rewriting existing skills, changing protected-file policy in `.cursor/rules/workflow/RULE.md`, mandatory `ci-investigator` subagent, `app-tasks.json` bug board, Nx/CI sharding.
  - **Branch:** `feature/agent-only-glue` off synced `develop`.
  - **Design principle:** **Glue only** — each change is a pointer, checklist, or next-skill handoff; no duplicated steps from SSOT skills.

## Phase overview

| Phase | Goal | Gate | Status |
|-------|------|------|--------|
| 1 | Router + dev-cycle: land chain + bug routing | Matrix lists `push` → `babysit`; bug reports route to `debug` intake | Done |
| 2 | `debug` chat intake checklist | Bug one-liner triggers structured ask before code | Done |
| 3 | `finish` user-test handoff | Agents never “complete” without handoff card | Done |
| 4 | `implement` classifier denylist gate | New staged validators → `TEST_INFRA_EXACT` in same PR | Done |
| 5 | Layers doc + validate pointer | Agent-only contract + optional validate audit line | Done |

## Conflict & compliance

- **Applicable rules:**
  - `workflow/RULE.md` — protected files (`.agents/skills/**`); **do not** weaken § Protected Files; document user-rule standing consent separately.
  - `file-placement/RULE.md` — plan under `documentation/jobs/temp_job_*/`; doc under `documentation/DOC_*.md`.
  - `testing/RULE.md` — handoff references CI merge gate (existing SSOT).
  - No `architecture` / `database` / app-layer impact.

- **File placements (confirmed):**

  | Path | Action |
  |------|--------|
  | `.agents/skills/router/SKILL.md` | Extend happy-path handoffs — **protected** |
  | `.agents/skills/router/references/dev-cycle-matrix.md` | Add steps 8–9: push → babysit; user test — **protected** |
  | `.agents/skills/debug/SKILL.md` | § Chat intake before §0 Preflight — **protected** |
  | `.agents/skills/finish/SKILL.md` | § User test handoff (new) — **protected** |
  | `.agents/skills/implement/SKILL.md` | Gate bullet: `scripts/` validators — **protected** |
  | `.agents/skills/validate/SKILL.md` | One-line classifier audit when scope touches `scripts/change-classify.cjs` — **protected** |
  | `documentation/DOC_AGENT_WORKFLOW_LAYERS.md` | § Agent-only mode + standing consent pointer |

- **Protected-file consent:** Batch approval required before implement (`.agents/skills/**` edits). `DOC_AGENT_WORKFLOW_LAYERS.md` is not protected.

- **Risks / attention points:**
  - **`babysit`** lives in `~/.cursor/skills-cursor/` (user-level) — router must say “invoke babysit skill” not assume repo copy.
  - **Auto-babysit** after every push may be heavy for WIP pushes — handoff is “after push **when PR opened to develop**,” not every `git push`.
  - **Bug intake** must not block `debug` when user already supplied full repro — checklist is “fill gaps, don’t re-ask.”
  - **finish handoff** must not contradict “user decides success” in `debug` / user rules — use “ready for you to test,” never “fixed” or “complete.”
  - **Standing protected consent** belongs in **Cursor user rules** — repo doc only points to pattern; `workflow/RULE.md` stays strict.

- **Open questions:** None — audit + grill resolved scope to glue-only patches.

- **Standards diversions:** None — extends existing skill-router pattern (SSOT per skill, router wires sequence).

## Pattern & precedent

**Pattern review:** Skipped — XS agent-routing docs; no product contract.

| Field | Value |
|-------|--------|
| **Capability** | Default agent chain from user message → land → CI → user test handoff. |
| **Precedents** | GitHub Actions “merge when green”; Linear/Jira minimal bug template; internal router/dev-cycle SSOT. |
| **Verdict** | Aligns — glue between existing skills, not a parallel workflow engine. |

## Source / context

- Grill-me session: agent-only mode audit (six gaps vs existing skills).
- User: “don’t reinvent the wheel; audit gaps; `/plan` thin patches.”

## Existing functionality (reuse — do not duplicate)

| Asset | Role | Reuse |
|-------|------|-------|
| `finish` | Commit, version, changelog | Handoff **after** commit; don’t restate commit steps |
| `push` | Remote push, PR to `develop` | Babysit triggers **after** successful push + PR |
| `babysit` (user skill) | CI loop, comments, conflicts | Next skill in chain |
| `debug` §0 Preflight | Environment, repro during incident | Intake **feeds** preflight slots |
| `validate` | impl-full / gate | Optional denylist audit line only |
| `change-classify.cjs` `TEST_INFRA_EXACT` | Denylist SSOT | implement gate points here |
| `DOC_AGENT_WORKFLOW_LAYERS.md` | Git/test tiers | Add agent-only § |

## Scope / out-of-scope

| In | Out |
|----|-----|
| Router chain `push` → `babysit` | New `agent-only` skill file |
| Debug intake checklist | Full bug tracker / GitHub Issues template |
| Finish “ready to test” card | Auto-merge PRs |
| Implement denylist reminder | Auto-sync denylist from filesystem |
| Layers doc standing-consent pointer | Weakening protected-file rule |

---

## Phase 1 — Router + dev-cycle land chain

### Goal

Agents know the **default post-land sequence** without user saying “watch CI.”

### Steps

1. **`dev-cycle-matrix.md`** — Extend optimistic happy path:
   - Step 8: **`push`** (after `finish`).
   - Step 9: **`babysit`** when a PR to `develop` exists (CI green + mergeable is agent responsibility; user does not watch checks).
   - Step 10 (label only): **User app test** — agent emits handoff from `finish` § User test; user pass/fail is closure.
2. **`router/SKILL.md`** — In § `finish` vs `push` vs `bundle-ship`, add:
   - After successful **`push`** that created/updated a PR to `develop` → **read and run `babysit`** (user-level skill) unless user waived CI wait in **Decisions made**.
   - On CI failure in scope → fix and re-push; on out-of-scope CI failure → `ci-investigator` or report to user.
3. **Router situation table** — Add row: “Pushed feature branch; PR open; CI unknown” → `babysit`.
4. **Bug routing** — In gate 1 / situation table: user message is **bug / error / broken / regression** (not feature request) → **`debug`** first (intake § Chat intake), not `implement`.

### Gate

```text
rg "babysit" .agents/skills/router
→ dev-cycle step 9 + router handoff after push present
rg "bug.*debug|debug.*bug" .agents/skills/router -i
→ bug routing present
```

---

## Phase 2 — `debug` chat intake

### Goal

One-line bug reports get **minimum viable repro** before hypotheses or code.

### Steps

1. Add **`## Chat intake (before Preflight)`** above §0 Mandatory Preflight:
   - When user reports a bug without structured context, **ask in one message** (or fill from chat history) before editing code:
     - **Where tested:** local dev / staging preview URL / production / other
     - **Repro steps:** numbered, minimal
     - **Expected vs actual:** one line each
     - **Since when:** always / after recent change / unknown
   - If all four are already in the thread → skip re-ask; populate Preflight slots directly.
   - Never claim fixed; intake is for alignment only.
2. Cross-link `finish` § User test handoff for closure after fix lands.

### Gate

- Section exists; no duplicate of full Preflight content
- `pnpm validate:docs` (if doc refs added)

---

## Phase 3 — `finish` user-test handoff

### Goal

Agents stop saying “implementation complete” when work is only **commit-ready**.

### Steps

1. Add **`## User test handoff (mandatory before closure)`** before Boundaries:
   - After commit (and after push/PR if applicable), output a **handoff card** for the user:

     ```markdown
     ## Ready for you to test
     - **What changed:** …
     - **Where to test:** <preview URL or "local dev — agent runs dev server">
     - **Steps:** 1. … 2. …
     - **Edge/deploy note:** (only if edge functions / env-specific)
     - **CI:** <pending | green on PR #N | not pushed yet>
     ```

   - **Forbidden phrases** after land: “implementation complete,” “fixed,” “done,” “should work” — use “ready for you to test” until user confirms.
   - Squash merge / production: point to existing § Production promotion; user tests **staging** before promote.
2. Link `documentation/DOC_CLOUDFLARE_WORKERS.md` for preview URL discovery when hosting task done.

### Gate

```text
rg "Ready for you to test|ready for you to test" .agents/skills/finish
rg "implementation complete" .agents/skills/finish
→ handoff present; "complete" only in boundaries/context where appropriate
```

---

## Phase 4 — `implement` classifier denylist gate

### Goal

New enforcement scripts don’t silently weaken pre-commit until CI.

### Steps

1. In **`implement` §3 Gate → Repo quality**, add bullet:
   - When adding or renaming **`scripts/*staged*`, `scripts/*validator*`, `scripts/change-classify.cjs`, `scripts/test-staged.cjs`** → verify `TEST_INFRA_EXACT` / `TEST_INFRA_PREFIXES` in `scripts/change-classify.cjs` in the **same PR**; run `pnpm test:classify`.
2. One line in phase **Decisions made** template example if waived.

### Gate

- Bullet present in `implement/SKILL.md`
- No code change required in this phase (policy only)

---

## Phase 5 — Layers doc + validate pointer

### Goal

Single human-readable **agent-only contract** and optional validate reminder.

### Steps

1. **`DOC_AGENT_WORKFLOW_LAYERS.md`** — New subsection **§ Agent-only mode (human files features/bugs)**:
   - Human: feature request or bug report + app testing only.
   - Agent chain: `router` → … → `validate` → `finish` → `push` → `babysit` (PR) → user test handoff.
   - **Standing protected-file consent:** optional Cursor **user rule** listing categories agents may edit without per-task ask (e.g. `.agents/skills/**` for workflow glue); repo `workflow/RULE.md` unchanged.
   - Link `DOC_TESTING.md` for test tiers (no duplication).
2. **`validate/SKILL.md`** — In gate mode tooling or report format, one line: when diff touches `scripts/change-classify.cjs` or new `scripts/*staged*`, flag if new paths missing from `TEST_INFRA_EXACT` (manual check; no new script).
3. **`DOC_INDEX.md`** — Optional one-line under Agent workflow layers if subsection title is discoverable.

### Gate

```text
pnpm validate:docs
rg "Agent-only mode" documentation/DOC_AGENT_WORKFLOW_LAYERS.md
```

---

## Notes during development

(Leave empty in the initial plan.)

## Decisions made

| # | Topic | Choice | User asked? |
|---|-------|--------|-------------|
| 1 | Scope | Glue-only patches; no new skill file | Yes — grill + `/plan` |
| 2 | CI follow-through | `babysit` after push when PR to `develop` | No — audit default |
| 3 | Protected files | Document user-rule standing consent; do not weaken workflow rule | No — audit default |
| 4 | `ci-investigator` | Optional on babysit blocker; not in happy path | No — keep XS |
