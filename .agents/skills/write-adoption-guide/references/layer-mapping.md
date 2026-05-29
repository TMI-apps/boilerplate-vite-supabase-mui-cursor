# Layer mapping (generic → source repo → target repo)

Use when writing §2 and §7 of an adoption guide. **Do not** assume every repo has `.agents/skills`.

| Generic layer | Purpose | Boilerplate example | Typical alternatives in other repos |
|---------------|---------|---------------------|-------------------------------------|
| **Procedure (SSOT)** | Full *how* — invocable by agents | `.agents/skills/<slug>/SKILL.md` | `.cursor/skills/`, `docs/agents/<slug>.md` |
| **Bundled references** | Rubric, templates, long checklists | `.agents/skills/<slug>/references/*.md` | `docs/architecture/`, ADR folder |
| **Always-on reminder** | Short principle + link to SSOT | `.cursor/rules/<category>/RULE.md` | `CONTRIBUTING.md` |
| **Workflow integration** | Router, plan, feature hooks | Other `.agents/skills/*` link to procedure | PR template, design-review checklist |
| **Plan / RFC gate** | Required section before implementation | `DEVELOPMENT_PLAN.md` § from plan template | `IMPLEMENTATION_PLAN.md`, Notion RFC |
| **Human index** | One line discoverability | `documentation/DOC_INDEX.md`, `DOC_AGENT_WORKFLOW_LAYERS.md` | `README`, `AGENTS.md` |
| **Cross-repo narrative** | Porting story (adoption guide) | `documentation/handoffs/*_ADOPTION_GUIDE.md` | `docs/guides/` |
| **Enforcement** | Machine checks | `.husky/*`, `pnpm validate:*` | CI workflow only |

**Copy between repos:** ideas + layer checklist — **not** a verbatim tree.
