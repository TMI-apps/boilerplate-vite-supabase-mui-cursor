# Subagent briefs — improve-skill-library

Self-contained prompts. Each subagent **does not see the chat**, so paste the full brief. All lens subagents are **read-only** (findings only). Only the no-loss verifier runs after edits. Use `SUBAGENT_MODEL` from `SKILL.md` § Config.

Every brief starts with the same **orient** step:

> Orient: read `.agents/skills/router/SKILL.md`, `documentation/DOC_AGENT_WORKFLOW_LAYERS.md`, and every `.agents/skills/*/SKILL.md` (and their `references/`). Treat user skills (`~/.cursor/skills-cursor/`) and plugin skills (`~/.cursor/plugins/`) as **reference-only**: read for overlap/conflict detection, never propose edits to them.

---

## Phase 0 — Registry

Orient (above). Then produce a markdown table, one row per **editable** skill:

`name | one-sentence outcome ("done") | lifecycle phase | mutates? (read-only / writes code / commits / pushes) | scope (repo-wide / targeted / single-component / single-feature) | inputs (artifacts consumed) | outputs (artifacts produced) | owns-concepts (SSOT it claims) | links-to (skills/docs referenced)`

Concern-space axes to populate consistently:
- **Lifecycle:** prime → clarify (grill-me / plan §Refine) → plan → review-dev-plan → pattern-review → implement → validate / check → review → finish → push; plus meta (learn, rule-quality) and integrations.
- **Mutation:** read-only vs writes vs commits vs pushes.
- **Domain:** product/vision · engineering · meta/rules · integrations.
- **Scope:** repo-wide · targeted · single-component · single-feature.

Return only the table. Do not edit any file.

---

## Phase 0 — Content ledger (ground truth for the no-loss pass)

Orient (above). For **each editable skill** emit a YAML block enumerating its **atomic units** — every distinct trigger, instruction, rule, table, and link the file carries. One stable id per unit so it can be tracked across edits.

```yaml
skill: <name>
file: .agents/skills/<name>/SKILL.md
units:
  - id: <name>.t1        # triggers
    kind: trigger
    text: "<verbatim or tight paraphrase>"
  - id: <name>.i1        # instruction / step
    kind: instruction
    text: "..."
  - id: <name>.c1        # checklist / table / rubric
    kind: table
    text: "<title + what it contains>"
  - id: <name>.l1        # cross-link
    kind: link
    text: "-> ../<other>/SKILL.md"
```

Return only the YAML blocks. This is captured **before** any edit; do not edit any file.

---

## Lens 1 — Separation / overlap (read-only)

Orient (above). Using the registry, produce:

1. **N×N overlap matrix:** mark every pair of skills that could correctly fire on the **same** user request. For each marked pair, state whether the router already has a tiebreak (cite the router subsection) or **MISSING tiebreak**.
2. **One-outcome violations:** skills whose description/body bundles two primary outcomes.
3. **Negative-space gaps:** skills lacking a clear "what this is NOT / use sibling X" statement.
4. **Same-cell collisions:** skills sharing the same (lifecycle × mutation × domain × scope) cell.

Return findings as a list: `severity (must-fix/nice) | skills involved | problem | suggested fix`. No edits.

---

## Lens 2 — SSOT / duplication (read-only)

Orient (above). Produce:

1. **Concept-ownership map:** for each reusable concept (e.g. pattern rubric, pre-commit light path, changeset flow, layer model, no-loss ledger), the **single file** that should own it vs everywhere it currently appears. Flag concepts owned in >1 place.
2. **Literal duplication:** identical/near-identical tables, checklists, or paragraphs appearing in 2+ files (cite paths + headings).
3. **Link integrity:** cross-links (`see X`, relative paths) that do not resolve, or that point at a non-owner copy.

Return findings: `concept | current owner(s) | proposed single owner | files that should link instead`. No edits.

---

## Lens 3 — Conflicts (read-only)

Orient (above). Produce:

1. **Shared-action contradictions:** build an `action → permitted skill(s)` table for sensitive actions (commit, push, edit protected files, default read-only). Flag any skill instruction that contradicts it.
2. **Router collisions:** any situation the router maps to >1 primary skill, or any skill not listed / listed >1 time in the router.
3. **Handoff contract mismatches:** where skill A says "hand to B" but B's declared inputs do not accept A's output artifact (e.g. `plan` emits `DEVELOPMENT_PLAN.md` — does `implement` declare it as input?).

Return findings: `type | skills/files | contradiction | suggested resolution`. No edits.

---

## Lens 4 — Composition / handoffs (read-only)

Orient (above). Using `links-to` from the registry:

1. **Handoff DAG:** list directed edges (A → B). For each edge, verify predecessor output = successor declared input; flag mismatches.
2. **Orphans:** skills nothing routes to (unreachable from the router front door).
3. **Dead ends:** skills that never state "what's next" where a successor is expected.
4. **Front-door check:** confirm the router is the only situation→skill map and that every skill is reachable and listed once.

Return: the edge list + a findings list `issue | skill(s) | fix`. No edits.

---

## No-loss verifier (runs AFTER edits — the critical pass)

Orient (above). Inputs: the **pre-edit content ledger** (path given by main agent), the **git diff** of this change, and the current files.

For **every unit id** in the pre-edit ledger, classify:

- **PRESERVED** — still present in the same file.
- **MOVED → `path`** — relocated to its named SSOT owner; verify a link remains at the original location.
- **DROPPED (reason)** — intentionally removed; the reason must be present in the change notes / approved at the gate.
- **MISSING** — none of the above (unaccounted for).

Return a coverage report:

```
NO-LOSS COVERAGE
  PRESERVED: n
  MOVED:     n   (list: id -> path)
  DROPPED:   n   (list: id -> reason)
  MISSING:   n   (list: id + last-known text)   <-- must be 0
```

If `MISSING > 0`, the pass **fails**: the main agent must restore each missing unit (or, with explicit user approval, reclassify as DROPPED) and re-run this verifier until `MISSING = 0`. Do not edit files yourself; report only.
