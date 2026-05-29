# Pattern review rubric (reference)

Bundled reference for [`.agents/skills/pattern-review/SKILL.md`](../SKILL.md). Entry point: [`documentation/DOC_AGENT_WORKFLOW_LAYERS.md`](../../../../documentation/DOC_AGENT_WORKFLOW_LAYERS.md) § Pattern / industry-standard review.

Do not duplicate this file elsewhere — link here.

## Purpose

Evaluate a **development plan** or **implementation proposal** against **industry standards** and **common best practice** for the kind of product behavior being built — not against this repo’s internal rules (`validate` does that).

**The agent chooses** which aspects matter for *this* change. There is no fixed checklist of UI shapes or domains.

## Scope

| In scope | Out of scope |
|----------|----------------|
| UX, navigation, data flow, API shape, async behavior, identity, coupling, operability | Repo layout, lint, RLS, security review, performance tuning without design impact |
| Plans (`DEVELOPMENT_PLAN.md`) and pre-code proposals | Pure refactors that add no new behavioral contract |
| Naming divergence from familiar products **explicitly** | “We already do it in the codebase” without external precedent |

## Review lens (how to think)

1. **Classify the change** — What user-facing capability is this (CRUD, workflow, settings, integration, dashboard, etc.)?
2. **Pick precedents** — Name 1–3 familiar products, frameworks, or patterns users would recognize (*not* this repo’s history).
3. **Select relevant dimensions** — From the pool below, include only what applies; add others if the plan demands it.
4. **Compare** — For each chosen dimension: this design vs common practice vs cost of diverging.
5. **Verdict** — See labels below; if non-standard, offer options and stop for owner choice before new structural coupling in `src/`.

### Dimension pool (use what applies — not a mandatory list)

| Dimension | Questions the agent may use |
|-----------|----------------------------|
| **User mental model** | Does behavior match how users expect this category of app to work? |
| **Identity & navigation** | Can users bookmark, share, or return via stable ids/state? |
| **Presentation vs persistence** | Is what we show aligned with what we store, with an explicit contract? |
| **Composition** | Master–detail, wizard, modal, inline, dedicated surface — is the choice mainstream for this job? |
| **Async & consistency** | Loading, errors, retries, eventual consistency — industry-typical? |
| **API & integration** | REST/GraphQL/event patterns, versioning, idempotency — familiar shape? |
| **Extensibility** | Will the next feature pay a tax (heuristics, rediscovered layout rules)? |
| **Accessibility & states** | Empty, error, partial data — handled like mature products? |

Add dimensions when the plan touches them (e.g. offline, multi-tenant, real-time). **Omit** dimensions that are irrelevant — say so briefly.

## Verdict labels

| Verdict | Meaning |
|---------|---------|
| `Aligns with precedent` | Matches common practice for this capability; risks named and acceptable |
| `Acceptable product-specific` | Diverges but documented; owner accepts tradeoffs |
| `Non-standard — waiver recommended` | Material divergence without mitigation; owner must decide before structural code |

## When to run (judgment, not a trigger table)

Run pattern review when the work could introduce **new behavioral or structural choices** that a senior engineer would compare to the market — especially:

- New or changed user flows, screens, or navigation
- New persistence ↔ UI relationships
- New public or cross-feature contracts (routes, APIs, events)
- Complexity **M** or **L** plans (always document § Pattern & precedent)
- User asks for best practice / industry standard / pattern review

**Skip** when the change is trivial, purely internal, or copies an existing pattern with no new coupling (state that in one line).

## Lite pass (no full plan)

Answer in prose (3–5 sentences):

1. What capability is this?
2. What precedents apply?
3. Any material divergence from common practice?
4. Verdict — or escalate to full **Pattern risk** block if non-standard.

## Plan section (what to write in `DEVELOPMENT_PLAN.md`)

Capture the agent’s chosen aspects — not a fixed form. Minimum:

- **Capability & precedents** (what + 1–3 references)
- **Aspects reviewed** (bullet list of dimensions you actually used)
- **Findings** (short: align / diverge / risk per aspect)
- **Verdict** + **Options A/B/C** if non-standard

See [`../plan/references/implementation-plan-template.md`](../../plan/references/implementation-plan-template.md) § Pattern & precedent.
