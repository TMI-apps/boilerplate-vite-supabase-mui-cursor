---
name: improve-skill-library
description: >-
  Audit and improve the .agents/skills library so the skills form a symbiotic whole:
  clear separation of concerns, single source of truth (SSOT), and no routing or instruction
  conflicts. Runs parallel Task subagents per lens (inventory, separation/overlap, SSOT/duplication,
  conflicts, composition/handoffs) and ends with a critical no-information-loss pass that must
  pass before any edit is kept. Use when the user asks to harmonize, consolidate, deduplicate,
  or de-conflict skills, fix router/skill overlaps, or improve the skill library as a whole.
disable-model-invocation: false
---

# Improve Skill Library (`/improve-skill-library`)

## Config

```text
SUBAGENT_MODEL=composer-2.5
```

Every **Task** subagent uses `model` = slug above (must be valid for your Cursor build; edit the value only). Subagents are **self-contained** — they do not see this chat. Each brief is in [`references/subagent-briefs.md`](references/subagent-briefs.md).

## Purpose

Turn the skills corpus into one coherent system. This skill **discovers** structural problems (overlap, duplication, conflicts, broken handoffs), **proposes** fixes behind a decision gate, **executes** approved fixes, then runs a **critical no-information-loss pass** that blocks any change that silently drops content.

## Scope

| Set | Paths | Treatment |
|-----|-------|-----------|
| **Editable corpus** | `.agents/skills/*/SKILL.md` (+ their `references/`) | Audited and edited |
| **Routing spine** | `.agents/skills/router/SKILL.md`, `documentation/DOC_AGENT_WORKFLOW_LAYERS.md` | Audited; updated when skills are added/removed/renamed (per the layers doc "When you change something" coupling) |
| **Reference-only** | User skills (`~/.cursor/skills-cursor/`), plugin skills (`~/.cursor/plugins/`) | Read for overlap/conflict detection; **never edited** here |

## Triggers

- "Make the skills a symbiotic whole / one system", "harmonize / de-conflict the skills"
- "Find duplication / overlap between skills", "fix router collisions", "which skills conflict?"
- After adding several skills, or when routing feels ambiguous
- Periodic health check of `.agents/skills/`

## Invariants (the testable definition of "done")

The audit measures every skill against these. Each is falsifiable.

| Goal | Invariant |
|------|-----------|
| Separation of concerns | Each skill has exactly **one** primary outcome; no two skills can correctly fire on the same trigger without a documented tiebreak in the router. |
| SSOT | Every reusable concept (rubric, checklist, table, contract) has exactly **one** owning file; all others link, not copy. |
| No conflicts | No two skills give opposing instructions for the same action; the router maps each situation to one primary skill; each skill appears in the router exactly once. |
| Symbiotic whole | Skill handoffs form a coherent DAG where a predecessor's **output artifact** equals the successor's **declared input**; no orphans, no dead ends; the router is the single front door. |

## Workflow

```
INVENTORY + LEDGER -> PARALLEL LENS SUBAGENTS -> SYNTHESIS -> GATE -> EXECUTE -> NO-LOSS PASS -> RECONCILE
```

### Phase 0 — Inventory + content ledger (before any edit)

Run two subagents (briefs in references):

1. **Registry** — one row per skill: `name | one-sentence outcome | lifecycle phase | mutates? | scope | inputs | outputs | owns-concepts | links-to`.
2. **Content ledger** — per skill, enumerate the **atomic units** it carries (each distinct trigger, instruction, rule, table, link). This ledger is the ground truth for the no-loss pass; it is captured **before** any edit.

Persist both under `documentation/jobs/skill-library/` (registry table + ledger) so the no-loss pass can diff against them. State the path you used.

### Phase 1 — Concern-space axes

Before judging, fix the axes separation is measured on (lifecycle phase, mutation posture, domain, scope). Each skill should occupy a **distinct cell**; same-cell skills are overlap candidates. (Axes are listed in the registry brief.)

### Phase 2 — Parallel lens subagents (one turn)

Launch these **in parallel**, each with its self-contained brief from [`references/subagent-briefs.md`](references/subagent-briefs.md). Findings only — **no edits** in this phase.

| # | Lens | Produces |
|---|------|----------|
| 1 | **Separation / overlap** | N×N overlap matrix; one-outcome violations; missing "what this is NOT" sections; same-cell collisions |
| 2 | **SSOT / duplication** | Concept-ownership map; literal duplication across files; broken/stale cross-links |
| 3 | **Conflicts** | Contradictory instructions on shared actions (who commits/pushes, read-only defaults); router collisions; handoff contract mismatches |
| 4 | **Composition / handoffs** | Handoff DAG; orphans (nothing routes in); dead ends (no "next"); router single-front-door + each-skill-listed-once check |
| 5 | **Quality (optional)** | Per-skill structural score (triggers present, single outcome, negative space). Defer to `rule-quality` for deep scoring. |

Give each Task a short `description` (e.g. "— overlap", "— SSOT", "— conflicts", "— composition").

### Phase 3 — Synthesis

Merge lens outputs: deduplicate findings, mark **must-fix vs nice-to-have**, and flag any finding raised by **≥2 lenses**. Group by blast radius: routing collisions and contradictory commit/push instructions first; cosmetic duplication last.

### Phase 4 — Decision gate

**CRITICAL: do not edit before approval.** Present findings as a prioritized map (each finding: what, where, fix, target owner if moving a concept, risk). For any SSOT move, name the **single owner** the content will live in and which files will link to it. Wait for the user to choose which fixes to apply. If usage intent or an intentional divergence is ambiguous, ask before the gate.

### Phase 5 — Execute (approved fixes only)

- Apply one finding at a time; each edit is self-contained.
- When consolidating to a single owner, replace duplicates with a **link** to that owner — never delete content without a destination.
- When a skill is added/removed/renamed, update `router/SKILL.md` (situation table + skill index) and the layers doc per its coupling table.
- Touching protected files (`.cursor/**`, configs) requires explicit user approval first.

### Phase 6 — Critical no-information-loss pass (hard gate)

After edits, run the **no-loss verifier** subagent (brief in references). It compares the **pre-edit content ledger** (Phase 0) against the **git diff + current files** and classifies every atomic unit:

| Class | Meaning | Allowed? |
|-------|---------|----------|
| **PRESERVED** | Still present, same place | ✅ |
| **MOVED → `path`** | Relocated to its named SSOT owner; a link remains where it was | ✅ |
| **DROPPED (reason)** | Intentionally removed; reason recorded **and** user-approved at the gate | ✅ |
| **MISSING** | Unaccounted for — not preserved, not moved, not an approved drop | ❌ **blocks** |

Any **MISSING** unit fails the pass: restore it (or, with explicit user approval, reclassify as DROPPED) and re-run the verifier until zero MISSING. Output the coverage report (counts per class + every MOVED target and DROPPED reason).

### Phase 7 — Reconcile

Confirm the router still lists every skill exactly once, all cross-links resolve, and the registry table is updated. Summarize what changed. **Do not claim success — the user confirms via their own review/test.**

## Boundaries

| Use this skill for | Use instead |
|--------------------|-------------|
| Whole-library coherence: overlap, SSOT, conflicts, handoffs across **skills** | — |
| Duplication across **`src/` application code** | `consolidate` |
| Repo **rule** (`.cursor/rules`) compliance of a plan/impl | `validate` |
| Architecture/layer correctness of **app code** | `check`, `consolidate` § Semantic placement |
| Grading or rewriting a **single** rule/command file | `rule-quality` |
| Authoring/refactoring a **single new** skill's structure | `create-skill` (`~/.cursor/skills-cursor/`) |
| Deciding **where** a lesson belongs (rule vs skill vs doc) | `learn` |

## Anti-patterns

- Editing before the decision gate or skipping the no-loss pass.
- Deleting a checklist/table without a named link target (SSOT move with no destination).
- "Consolidating" two skills that occupy **different** concern-space cells (forces unrelated outcomes together).
- Letting subagents edit — lens subagents are **read-only**; only the main agent edits after approval.
- Adding/removing a skill without updating the router and layers-doc coupling.

## Related

- [`router`](../router/SKILL.md) — routing SSOT this skill validates and updates
- [`DOC_AGENT_WORKFLOW_LAYERS.md`](../../../documentation/DOC_AGENT_WORKFLOW_LAYERS.md) — layer model + "When you change something" coupling
- [`consolidate`](../consolidate/SKILL.md) — analogous audit for application code
- [`rule-quality`](../rule-quality/SKILL.md) — per-file grade + improve
- [`learn`](../learn/SKILL.md) — decides where durable knowledge lives
- [`references/subagent-briefs.md`](references/subagent-briefs.md) — self-contained prompts for every subagent
