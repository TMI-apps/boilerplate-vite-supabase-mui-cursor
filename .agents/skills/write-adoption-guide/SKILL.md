---
name: write-adoption-guide
description: >-
  Writes cross-repo adoption guides (<SLUG>_ADOPTION_GUIDE.md) from an implemented pattern
  in the source repo. Layer-agnostic porting steps, what-is/is-not, reference file map,
  and target-repo checklist. Use when the user wants an adoption guide, playbook for
  other repos, or to document how to replicate a capability outside this codebase.
  Does not require the learn skill.
disable-model-invocation: false
---

# write-adoption-guide

Produce an **adoption guide** — durable documentation for **replicating a capability in other repositories**. Not a session handoff (temporary context for the next agent). Not a bilateral contract between two apps unless that is the whole topic.

---

## Configuration (change per repo when copying this skill)

```text
ADOPTION_GUIDE_OUTPUT_FOLDER = documentation/handoffs
ADOPTION_GUIDE_FILENAME_SUFFIX = _ADOPTION_GUIDE.md
SOURCE_REPO_DISPLAY_NAME         = vite-mui-supabase-starter (boilerplate)
WORKFLOW_LAYERS_DOC              = documentation/DOC_AGENT_WORKFLOW_LAYERS.md
```

**Slug (`SLUG`):** topic identifier in **UPPER_SNAKE** — e.g. `pattern-review` → `PATTERN_REVIEW` → file `PATTERN_REVIEW_ADOPTION_GUIDE.md`.

---

## Adoption guide vs other doc types

| Write an **adoption guide** when… | Write something else when… |
|-----------------------------------|----------------------------|
| Other repos should **install the same idea** with different folder layouts | Only **this repo** needs an update → edit skill/rule/`DOC_*` directly (no guide) |
| SSOT already exists here; guide **links** and explains porting | Two apps share a **DB/API contract** → contract handoff (out of scope) |
| Lesson is **process + layers**, not a PR checklist | Next agent continues **same branch/task** → session handoff (out of scope) |

See [`references/adoption-guide-template.md`](references/adoption-guide-template.md) for structure.

---

## Procedure

### 1. Confirm inputs

Gather from user and repo (read files; do not invent paths):

- **Topic slug** and one-line capability name
- **SSOT in source repo** — skill path, `DOC_*`, or script
- **Why** — problem, process gap, cost of not adopting
- **What was wired** — rules, skills, plan sections, indexes (use [`references/layer-mapping.md`](references/layer-mapping.md))
- **One teaching example** (optional)
- **Target audience** — TMI apps with Cursor, human-only teams, or both

If SSOT does not exist yet, **stop** — add the skill/rule/procedure first, then run this skill again.

### 2. Choose output path

```text
{ADOPTION_GUIDE_OUTPUT_FOLDER}/{SLUG}{ADOPTION_GUIDE_FILENAME_SUFFIX}
```

### 3. Draft the guide

Use [`references/adoption-guide-template.md`](references/adoption-guide-template.md).

### 4. Integrate in source repo (minimal)

| Action | File |
|--------|------|
| Link from workflow layers | `{WORKFLOW_LAYERS_DOC}` → § Related |
| Catalog | `.agents/skills/router/SKILL.md` § Skill index |

No mandatory changeset for docs-only.

### 5. Report to user

1. Path of the new guide
2. SSOT paths linked inside the guide
3. What to **copy to other repos** (skill folder + guide, or guide alone)

---

## Copying this skill to another project

Copy:

```text
.agents/skills/write-adoption-guide/
  SKILL.md
  references/adoption-guide-template.md
  references/layer-mapping.md
```

Then edit **Configuration** and `layer-mapping.md` source column.

**No dependency** on `learn`, `pattern-review`, or other boilerplate-specific skills.

---

## Related

- Template: [`references/adoption-guide-template.md`](references/adoption-guide-template.md)
- Layers: [`references/layer-mapping.md`](references/layer-mapping.md)
- Workflow layers: [`documentation/DOC_AGENT_WORKFLOW_LAYERS.md`](../../../documentation/DOC_AGENT_WORKFLOW_LAYERS.md)
