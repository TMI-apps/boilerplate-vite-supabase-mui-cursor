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

**Nomenclature (doc type):** **adoption guide** — filename pattern below. (Abbreviations people use: *adoption guide* full phrase; in tables you may write *adoption guide* or *guide*; avoid confusing with *handoff*.)

---

## Configuration (change per repo when copying this skill)

Set these at the top of your mental model; when copying this skill to another project, edit this block in `SKILL.md`:

```text
ADOPTION_GUIDE_OUTPUT_FOLDER = documentation/handoffs
ADOPTION_GUIDE_FILENAME_SUFFIX = _ADOPTION_GUIDE.md
# Output path: {ADOPTION_GUIDE_OUTPUT_FOLDER}/{SLUG}{ADOPTION_GUIDE_FILENAME_SUFFIX}
# Example: documentation/handoffs/MOBILE_LOCAL_DEV_ADOPTION_GUIDE.md
SOURCE_REPO_DISPLAY_NAME         = vite-mui-supabase-starter (boilerplate)
WORKFLOW_LAYERS_DOC              = documentation/DOC_AGENT_WORKFLOW_LAYERS.md
```

**Slug (`SLUG`):** topic identifier in **UPPER_SNAKE** — e.g. `mobile-local-dev` → `MOBILE_LOCAL_DEV` → file `MOBILE_LOCAL_DEV_ADOPTION_GUIDE.md`.

---

## Voice and naming (target-repo readers)

Adoption guides are read by **agents implementing the learning in another repository**. The home repo is **one illustrative instance**, not instructions to clone its tree verbatim.

**Mandatory:** follow [`references/voice-and-naming.md`](references/voice-and-naming.md).

| Rule | Requirement |
|------|-------------|
| **Repo name** | `SOURCE_REPO_DISPLAY_NAME` **at most once** — in the purpose block only, e.g. `> **Reference implementation (vite-mui-supabase-starter):** …` |
| **§3** | Title `Illustrative wiring (home repository only)` + blockquote: paths/URLs are **not** copy-paste specs |
| **§4–§7, §9** | **Zero** repetitions of the home-repo product name |
| **§5** | Blockquote: teaching example is **illustrative only** |
| **§7.4** | `Illustrative mapping (home repo → your repo)` — left column is examples, not required names |
| **Wording** | Prefer *home repository*, *target repository*, *your repo*, *SSOT runbook (home repo)* |

Before done: search the guide body below the purpose block for the configured repo name — **must be zero matches**.

---

## Adoption guide vs other doc types

| Write an **adoption guide** when… | Write something else when… |
|-----------------------------------|----------------------------|
| Other repos should **install the same idea** with different folder layouts | Only **this repo** needs an update → edit skill/rule/`DOC_*` directly (no guide) |
| SSOT already exists here; guide **links** and explains porting | Two apps share a **DB/API contract** → contract handoff (`HANDOFF_*` to one consumer) |
| Lesson is **process + layers**, not a PR checklist | Next agent continues **same branch/task** → session handoff (out of scope; not this skill) |

Canonical example in this repo: [`documentation/handoffs/MOBILE_LOCAL_DEV_ADOPTION_GUIDE.md`](../../../documentation/handoffs/MOBILE_LOCAL_DEV_ADOPTION_GUIDE.md).

---

## Procedure

### 1. Confirm inputs

Gather from user and repo (read files; do not invent paths):

- **Topic slug** and one-line capability name
- **SSOT in source repo** — skill path, `DOC_*`, or script (procedure lives here; guide must not duplicate long checklists)
- **Why** — problem, process gap, cost of not adopting
- **What was wired** — rules, skills, plan sections, indexes (use [`references/layer-mapping.md`](references/layer-mapping.md))
- **One teaching example** in source repo (optional but recommended)
- **Target audience** — TMI apps with Cursor, human-only teams, or both

If SSOT does not exist yet, **stop** — tell the user to add the skill/rule/procedure first, then run this skill again.

### 2. Choose output path

```text
{ADOPTION_GUIDE_OUTPUT_FOLDER}/{SLUG}{ADOPTION_GUIDE_FILENAME_SUFFIX}
```

Default example: `documentation/handoffs/MOBILE_LOCAL_DEV_ADOPTION_GUIDE.md`.

### 3. Draft the guide

Use [`references/adoption-guide-template.md`](references/adoption-guide-template.md) and [`references/voice-and-naming.md`](references/voice-and-naming.md). Required sections:

1. Purpose block — **one** `Reference implementation ({SOURCE_REPO_DISPLAY_NAME})` line; links to SSOT + workflow layers
2. **What it is / what it is not** (early; prevents scope creep)
3. Problem → what to introduce → **illustrative wiring (home repo only)** → **portable substance** (repo-agnostic) → teaching example (one, illustrative) → workflow → adopt steps → summary

**Do not include in the guide:**

- Git status, commit messages, “what we deleted locally”
- Full duplicate of rubrics/procedures (link SSOT)
- “Suggested skills for next session”
- Sidecar-or-single-feature scope unless that *is* the whole topic

### 4. Integrate in source repo (minimal)

After writing the file:

| Action | File |
|--------|------|
| Link from workflow layers | `{WORKFLOW_LAYERS_DOC}` → § Related (one line to the new guide) |
| Optional one-line pointer | `AGENTS.md` only if the capability is repo-wide important |
| Catalog | `.agents/skills/router/SKILL.md` § Skill index — link **example** guide in Related if useful |

Do **not** require `learn`, `router`, or `finish` to run. No mandatory changeset for docs-only.

### 5. Report to user

1. Path of the new guide (using configured folder)
2. SSOT paths linked inside the guide
3. What to **copy to other repos** (this skill folder + guide file, or guide alone)
4. Reminder: adopters edit `ADOPTION_GUIDE_OUTPUT_FOLDER` in copied skill if their layout differs

---

## Copying this skill to another project

Copy the whole folder:

```text
.agents/skills/write-adoption-guide/
  SKILL.md
  references/adoption-guide-template.md
  references/voice-and-naming.md
  references/layer-mapping.md
```

Then in the target project’s `SKILL.md`:

1. Set `ADOPTION_GUIDE_OUTPUT_FOLDER` (e.g. `docs/guides` or `documentation/handoffs`)
2. Set `SOURCE_REPO_DISPLAY_NAME` and `WORKFLOW_LAYERS_DOC` if present
3. Add slug to that repo’s router skill index / meta list (here: `.agents/skills/router/SKILL.md`)
4. Point `layer-mapping.md` “source example” column at the new home repo

**No dependency** on `learn`, `pattern-review`, or other boilerplate-specific skills.

---

## Quality checklist (before done)

- [ ] Filename matches `{SLUG}_ADOPTION_GUIDE.md` under `ADOPTION_GUIDE_OUTPUT_FOLDER`
- [ ] What it is / is not table present
- [ ] SSOT linked once; rubric/procedure not duplicated in full
- [ ] **Voice:** `SOURCE_REPO_DISPLAY_NAME` appears **only** in purpose block; §3 has illustrative-only blockquote; §4–§9 have **zero** repo-name repeats
- [ ] §7 has discovery checklist + minimum vs recommended + anti-patterns
- [ ] Teaching example labeled *illustrative* / *one instance* with do-not-copy-verbatim blockquote
- [ ] `{WORKFLOW_LAYERS_DOC}` Related updated
- [ ] No session-handoff tone or git churn

---

## Related

- Template: [`references/adoption-guide-template.md`](references/adoption-guide-template.md)
- Voice: [`references/voice-and-naming.md`](references/voice-and-naming.md)
- Layers: [`references/layer-mapping.md`](references/layer-mapping.md)
- Workflow layers: [`documentation/DOC_AGENT_WORKFLOW_LAYERS.md`](../../../documentation/DOC_AGENT_WORKFLOW_LAYERS.md)
- Example output (doc runbook SSOT): [`documentation/handoffs/MOBILE_LOCAL_DEV_ADOPTION_GUIDE.md`](../../../documentation/handoffs/MOBILE_LOCAL_DEV_ADOPTION_GUIDE.md)
