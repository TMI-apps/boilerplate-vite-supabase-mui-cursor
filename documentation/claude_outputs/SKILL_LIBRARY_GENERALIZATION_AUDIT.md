# Skill library generalization audit

Audit of all 27 skills in `.agents/skills/` for how much of each is dev/repo-specific mechanics vs. a reusable knowledge-work method that could be abstracted into a general-purpose skill (usable outside a codebase — for planning, writing, research, ops, etc.).

Method: read every `SKILL.md` in full. For each skill: what it actually does, which parts are welded to this stack (git, pnpm, Cursor, React/MUI, Supabase, `.cursor/rules`), and what method survives if you delete the stack parts.

## Verdict summary

| Skill | Primary outcome | Generalization potential | Proposed general skill |
|---|---|---|---|
| `caveman` | Ultra-compressed communication mode | **High — already generic** | `terse-mode` (communication overlay) |
| `grill-me` | Interview to align on scope edges/non-goals, grounded in what exists | **High** | `scope-interview` |
| `challenge` (Flow Mode) | Reduce steps/decisions in a workflow | **High** | `process-simplifier` |
| `debug` | Scientific-method root-cause narrowing for incidents | **High** | `structured-troubleshooting` |
| `hypothesis` | Pre-registered falsifiable-hypothesis debugging loop | **High** | `hypothesis-driven-diagnosis` |
| `learn` | Turn a resolved struggle into durable, correctly-homed guidance | **High** | `retrospective` |
| `pattern-review` | Compare a proposal to external precedent/best practice before acting | **High** | `precedent-check` |
| `review-dev-plan` | Six-lens parallel critique of a plan (rebel, scale, precedent, +2) | **High** | `plan-red-team` |
| `router` | Three-gate triage (goal clarity → scope → size/risk) to the right process | **High** | `work-triage` |
| `rule-quality` | Grade/rewrite an instructional document against a rubric | **High** | `doc-quality-rubric` |
| `write-adoption-guide` | Write a portable guide so another team can replicate a capability | **High** | `adoption-guide-writer` |
| `consolidate` (audit method) | Discover/classify/prioritize repeated content across a corpus | **High**, discovery tooling is dev-specific | `redundancy-audit` |
| `optimize2` (4-level framework) | Fix problems at the right level: existence → approach → efficiency → structure | **High**, metrics are dev-specific | `level-based-optimizer` |
| `improve-skill-library` | Audit a procedure/skill corpus for overlap, SSOT, conflicts, broken handoffs | **High** | `playbook-health-audit` |
| `validate` | Parallel rule-shaped audit of a deliverable against a rulebook, synthesize before fixing | **Medium-High** | `compliance-audit` |
| `feature` | Systematic new-initiative scoping with mandatory decision stops | **Medium-High** | `structured-intake` |
| `prime` | Load context (docs, state, governance) before starting work | **Medium-High** | `context-load` |
| `quick-piv` | Compressed plan→do→check loop for small tasks in one sitting | **Medium-High** | `quick-loop` |
| `plan` | Research-first phased plan document with gates | **Medium** | `phased-plan` |
| `implement` | Execute a plan phase by phase, logging notes/decisions, gated | **Medium** | `phased-execution` |
| `start` | Sequential onboarding walkthrough with verification gates | **Medium** | `guided-onboarding` |
| `finish` | Completion checklist: concurrency check, staging gate, versioning, handoff card | **Medium** | `finalize-and-handoff` |
| `review` (rubric pattern) | Weighted 0–5 rubric across categories, thresholds, quick checklist | **Medium**, categories are 100% dev-specific | `weighted-quality-rubric` |
| `api-integrate` | Research a vendor/API (check existing tool first, contract before samples) | **Medium** | `vendor-research` |
| `bundle-ship` | Coordinate multiple concurrent contributors into one landed snapshot | **Low-Medium** | folds into `finalize-and-handoff` |
| `push` | Remote-sync-only step, strictly no authoring | **Low** | folds into `finalize-and-handoff` |
| `react-perf-vite` | Stack-specific performance rule lookup table | **Low — not portable** | n/a, content is 100% React/Vite |

---

## Tier 1 — already generic (zero rework)

**`caveman`** is a pure communication-style overlay: drop filler, keep substance, exceptions for warnings/irreversible actions. Nothing in it references code. It would work verbatim as a general "terse mode" for any assistant conversation.

## Tier 2 — high-value abstraction candidates

These carry a genuinely reusable *method*; the dev-specific parts are a thin shell around it.

**`grill-me` → `scope-interview`.** The core move — interrogate perimeter and non-goals before interior detail, ground every boundary question in what already exists, ask one question at a time with Pareto-optimal options, close with a chat summary of scope/non-goals/open tradeoffs — has nothing to do with code. Swap "search the codebase for neighbor features" for "search existing docs/systems/precedent for this org," and it becomes a general pre-work scoping interview for any new initiative: a campaign, an event, a policy change, a research project.

**`challenge` (Flow Mode) → `process-simplifier`.** The eight challenge lenses (existence, value, redundancy, timing, defaulting, combination, trust boundary, failure mode) and the five-step reduction order (remove → merge → reorder → automate/default → refactor) apply to any workflow: an approval process, an intake form, a support escalation path. Code Mode (the "code audit lenses") is the only dev-locked half and can simply be dropped.

**`debug` + `hypothesis` → `structured-troubleshooting`.** `debug`'s event-chain reconstruction, "recent changes are suspects," environment-first discipline, and hypothesis-with-falsifier structure is textbook root-cause analysis — directly reusable for any operational incident (a broken process, a failed campaign, a data discrepancy). `hypothesis` adds the sharper discipline of pre-registering what a *failed* fix would prove, tracking ruled-out vs. still-open causes each iteration. Together these form a general diagnostic method; only the Supabase/RLS/React-specific hypothesis examples are dev-locked.

**`learn` → `retrospective`.** Inspect what happened → reverse-audit whether *existing guidance* caused the mistake (misleading/overly-broad/outdated/innocent) → form a trigger+constraint+scope lesson → pick one canonical home and cross-link, never duplicate. This is a strong general continuous-improvement pattern for any team that keeps SOPs or playbooks, not just a rules folder.

**`pattern-review` → `precedent-check`.** "Before committing to a plan, name external precedent and tradeoffs, don't just say 'we already do it this way'" is universal — pricing decisions, HR policy, marketing plans all benefit from an explicit precedent check with a stop-and-flag on real divergence.

**`review-dev-plan` → `plan-red-team`.** Running fixed "rebel" (clean-slate alternative) and "scalability/evolution" lenses plus 2 user-chosen lenses in parallel, then synthesizing must-fix vs. nice-to-have, is a strong general method for stress-testing any significant plan before committing resources.

**`router` → `work-triage`.** The three-gate model — is the goal falsifiable? is scope bounded? what size/risk is the delivery? — plus "thread continuation beats restarting triage" is a genuinely general work-intake pattern for any request queue, not just code tasks.

**`rule-quality` → `doc-quality-rubric`.** The six-criterion weighted rubric (clarity, ambiguity handling, structure, completeness, actionability, guardrails) grades *any* instructional document — an SOP, a prompt, a policy memo — not just a `.cursor/rules` file. Mode B's rewrite standards (brevity, SSOT/DRY, positive framing, imperative voice) are equally general.

**`write-adoption-guide` → `adoption-guide-writer`.** Already framed as writing for outside readers; the "illustrative not prescriptive," "what it is / is not," "link the SSOT, don't duplicate it" discipline generalizes cleanly to writing any cross-team playbook, not just porting a code pattern to another repo.

**`consolidate` (audit method) → `redundancy-audit`.** The Rule of Three, "consolidation ≠ abstraction" (accept duplication / standardize without extracting / extract a utility / build a configurable abstraction, cheapest first), the four redundancy types (literal/structural/conceptual/inconsistent-usage), and the priority scoring formula are all content-agnostic — they'd work identically auditing a library of document templates, spreadsheet formulas, or slide decks. Only Phase 1's discovery commands (`rg`, git churn) are dev tools; swap for generic search across the target corpus.

**`optimize2` (4-level framework) → `level-based-optimizer`.** "Fix at the right level" — does this need to exist at all? is the approach/algorithm right? is it efficient? is the structure overcomplicated? — plus the Rule of Three and "over-engineering indicators" is a genuinely general optimization philosophy. It maps directly onto business-process optimization (eliminate the step → change the approach → speed it up → simplify the structure) if you swap cyclomatic/cognitive complexity metrics for a generic "how many decision points / handoffs / exceptions" proxy.

**`improve-skill-library` → `playbook-health-audit`.** Auditing a corpus of procedures for one-outcome-per-item, single-source-of-truth, no contradicting instructions, and a coherent handoff DAG — with a hard no-information-loss gate before any edit survives — is directly reusable for auditing any org's SOP/wiki/playbook collection, which is exactly the kind of audit this document itself is a small instance of.

## Tier 3 — medium value (real method, but more dev scaffolding to strip)

**`validate` → `compliance-audit`.** Spawning one read-only reviewer per applicable policy, aggregating findings by severity, batching ambiguous questions, and never auto-fixing without asking is a solid general audit pattern — but its "modes" (plan-review/impl-full/gate) and tooling pass are git/CI-shaped and would need a rework for a non-code rulebook (e.g., brand guidelines, legal review).

**`feature` → `structured-intake`.** The mandatory-decision-stop discipline, ambiguity-elimination gate, user-journey mapping, and "progressive complexity options ordered simplest to most complex" generalize well to scoping any new initiative with real stakeholders. But roughly half the phases (rule decision tree, cyclomatic/cognitive complexity projection, file-placement validation) are pure software architecture and would need full replacement.

**`prime` → `context-load`.** "Read the key docs, check recent activity, note active work-in-progress, flag governance before touching anything" is a good general "get oriented before starting" ritual — but every concrete step (read `ARCHITECTURE.md`, `git log`, `.dependency-cruiser.cjs`) is repo-specific and would be a full rewrite per domain.

**`quick-piv` → `quick-loop`.** The compressed plan→implement→validate-inline loop for small scoped work, with a mandatory "vital: post the plan in chat before touching anything," is a nice general small-task pattern. The validate step is pure `pnpm` tooling and would need swapping.

**`plan` / `implement` → `phased-plan` / `phased-execution`.** Research-first plan documents with mandatory gates per phase, and executing them phase-by-phase while logging notes/decisions, are standard project-management method — but the bulk of both files (rule registries, architecture layers, migration patterns) is dev-specific; what remains generic is really just "phase / goal / steps / gate" as a template shape.

**`start` → `guided-onboarding`.** Sequential gates with mandatory user confirmation at each step, "never claim complete without verification," and exact click-path instructions for manual steps generalize to any structured onboarding walkthrough — but the content of every gate here is this repo's setup.

**`finish` → `finalize-and-handoff`.** The valuable general pieces are the concurrency/"is someone else mid-edit" smoke check, the staging decision gate (show what's in/out, never silently include unrelated work), and the mandatory handoff card with forbidden premature-success language ("ready for you to test," not "done"). The version-bump/changelog/commit mechanics are pure git and wouldn't transfer.

**`review` (rubric pattern) → `weighted-quality-rubric`.** The *shape* — weighted sections, 0–5 scoring, a percentage threshold table, a fast pre-check before the full rubric — is a reusable review template for any deliverable. Every actual category (props typing, MUI consistency, ARIA) is 100% component-review content and would need total replacement per domain.

**`api-integrate` → `vendor-research`.** "Check whether you already have a tool/connector for this before building something custom, then research contract/shape before sampling real data" generalizes to evaluating any new vendor, SaaS tool, or data source — the MCP-specific fallback tree is this stack's particular version of "check existing integrations first."

## Tier 4 — low value to abstract

**`bundle-ship`** and **`push`** are almost entirely git mechanics (staging, stashing, remote fast-forward checks). The one transferable idea — don't finalize a shared deliverable while someone else might still be mid-edit — is already captured better inside `finish`'s concurrency-smoke-check, so these don't need a separate generic skill.

**`react-perf-vite`** is a flat lookup table of React/Vite-specific performance rules with zero abstractable method — it's a reference doc, not a process. There's nothing here to generalize; a different domain would need an entirely different reference table, not a reworded version of this one.

## Recommendation

If building a general knowledge-work skill pack, the fourteen Tier 2 skills above are the ones worth porting first — each already separates a domain-agnostic method from a thin dev-specific shell. `grill-me`, `debug`+`hypothesis`, `learn`, and `router` in particular read as strong standalone skills for any non-technical work: structured scoping, structured troubleshooting, retrospectives, and work triage are useful well outside a codebase. The Tier 3 items are worth porting only if there's a template shape to keep (`plan`/`implement`'s phase-goal-steps-gate structure, `validate`'s parallel-audit-then-ask pattern); their current content is not.
