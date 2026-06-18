# Layer mapping (generic → home repo → target repo)

Use when writing §2 and §7 of an adoption guide. **Do not** assume every repo has `.agents/skills`. In the adoption guide body, use **“example (home repo)”** — not the home product name (see [`voice-and-naming.md`](voice-and-naming.md)).

| Generic layer | Purpose | Example (home repo) | Typical alternatives in other repos |
|---------------|---------|---------------------|-------------------------------------|
| **Procedure (SSOT)** | Full *how* — invocable by agents | `.agents/skills/<slug>/SKILL.md` | `.cursor/skills/<slug>/SKILL.md`, `docs/agents/<slug>.md`, `.github/agents/`, RFC appendix |
| **Bundled references** | Rubric, templates, long checklists | `.agents/skills/<slug>/references/*.md` | `docs/architecture/`, ADR folder |
| **Always-on reminder** | Short principle + link to SSOT | `.cursor/rules/<category>/RULE.md` | `CONTRIBUTING.md`, ESLint doc, team handbook |
| **Workflow integration** | Router, plan, feature, finish hooks | Other `.agents/skills/*` link to procedure | PR template, design-review checklist |
| **Plan / RFC gate** | Required section before implementation | `DEVELOPMENT_PLAN.md` § from plan template | `IMPLEMENTATION_PLAN.md`, Notion RFC, `docs/rfcs/` template |
| **Human index** | One line discoverability | `AGENTS.md`, `documentation/DOC_INDEX.md`, `DOC_AGENT_WORKFLOW_LAYERS.md` | `README`, wiki index |
| **Cross-repo narrative** | Porting story (this guide) | `documentation/handoffs/*_ADOPTION_GUIDE.md` | `docs/guides/`, wiki, second repo copy |
| **Enforcement** | Machine checks | `.husky/*`, `scripts/guard-*.js`, `pnpm validate:*` | CI workflow only — optional for adoption |

**Copy between repos:** ideas + layer checklist + wiring diagram — **not** a verbatim `.cursor` or `.agents` tree.
