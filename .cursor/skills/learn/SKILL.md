---
name: learn
description: >-
  Turns recent code changes, failures, and conversation mistakes into durable guidance.
  Use when the user runs /learn, asks for a retrospective or to sharpen rules, or after
  resolving a multi-turn struggle (e.g. 3+ failed attempts, critical CI fix).
disable-model-invocation: true
---

# Learn from changes and sharpen rules

Extract lessons from **what just happened** (diffs, errors, retries) and persist them where the assistant will see them **before** the same mistake repeats. This includes **adding** new guidance *and* **removing or narrowing** existing guidance that contributed to the problem. Prefer **one primary home** per lesson; cross-link instead of duplicating.

**Related:** Rule quality heuristics: `.cursor/skills/improve-rule/SKILL.md`. Finish/changelog flow: `.cursor/skills/finish/SKILL.md`.

**This project:** In-repo skills live under `.cursor/skills/<name>/SKILL.md` (whitelisted in `projectStructure.config.cjs`). Add new skills as new folders with a `SKILL.md`; do not create other file types under `skills/` unless the whitelist is extended.

---

## Goal

Durable, discoverable guidance with minimal duplication.

---

## Triggers

- **Manual:** User invokes learn, asks for a retrospective, or “sharpen rules.”
- **Proactive:** After a loop (3+ failed attempts), a critical CI fix, or a non-obvious repo discovery — only when the user is clearly done debugging.

---

## Steps

### 0. Context audit

- Read `.cursor/rules/INDEX.md` and any rule files that match the lesson domain.
- **Deduplicate:** Update an existing subsection if the lesson fits; add new only when no home fits.

### 1. Inspect what happened

- **The loop:** What broke the cycle (the “aha” moment)?
- **Git:** `git diff`, `git log` (full messages if needed) for intent and scope.
- **Conversation:** User corrections, wrong assumptions, failed tool calls.
- **CI / checks:** Failing job names; snippets from `pnpm lint`, `pnpm validate:structure`, `pnpm arch:check`, etc.

Summarize in 3–7 bullets: **symptom → root cause → fix** (facts only).

### 1b. Reverse Audit — trace the cause to existing guidance

Using the root cause from Step 1, check whether existing guidance **steered the assistant toward** the mistake.

- **Scan:** Search `.cursor/rules/` and `.cursor/skills/` for lines related to the root cause.
- **Classify each hit:**
  - **Misleading** — the rule directly caused or encouraged the wrong behavior → recommend **delete** or **rewrite**.
  - **Overly broad** — correct in spirit but its wording invites misapplication → recommend **narrow** (add scope qualifier or exception).
  - **Outdated** — was once valid but the codebase or tooling has changed → recommend **delete**.
  - **Innocent** — did not contribute → leave alone.
- **Record findings** as a short list: `file : section/line → classification → proposed action`.
- If nothing in existing guidance contributed, state that explicitly and move on.

### 2. Form the lesson

- **Trigger:** When should the assistant remember this?
- **Constraint:** What must it do or avoid?
- **Scope:** One domain (e.g. migrations, React, Edge, structure validation).

Merge near-duplicates; drop one-off noise.

### 3. Choose where it lives

Pick **one primary** location. Cross-link elsewhere in one line if needed — never paste the same paragraph in three files.

| Lesson type | Primary location (this repo) |
|-------------|-------------------------------|
| Postgres migrations, Supabase schema, RLS, idempotent migrations | `.cursor/rules/database/RULE.md` |
| Local dev URLs, `pnpm dev`, env wiring, Supabase setup testing | `.cursor/rules/workflow/RULE.md` and/or `documentation/DOC_TESTING_SUPABASE_SETUP.md`, `src/features/setup/docs/testing-supabase-setup.md` |
| Auth, secrets, validation | `.cursor/rules/security/RULE.md` |
| Folder placement, imports, layers, path aliases | `.cursor/rules/architecture/RULE.md` or `.cursor/rules/file-placement/RULE.md` |
| Vitest, coverage, test layout | `.cursor/rules/testing/RULE.md` |
| Changelog, version, finish / branch strategy | `.cursor/rules/workflow/RULE.md` or `.cursor/skills/finish/SKILL.md` |
| Known symptom → fix pattern (repeatable) | `.cursor/skills/debug/SKILL.md` § **Common Error Pattern Recognition** |
| Edge Functions vs frontend | `.cursor/rules/cloud-functions/RULE.md` |
| TanStack Query, server state | `ARCHITECTURE.md`, `documentation/DOC_TANSTACK_QUERY.md`, or feature `api/` keys patterns (one primary) |
| Long procedural workflow | Relevant `.cursor/skills/<name>/SKILL.md` |
| Reusable multi-step procedure (not a one-line rule) | New or existing `.cursor/skills/<name>/SKILL.md` in this repo, or a user-level skill outside the repo |

Confirm ownership via `.cursor/rules/INDEX.md`.

**Procedures vs rules:** Single-line constraints belong in the right `RULE.md`. Use a **skill** (this folder pattern or user skills) when the lesson is a reusable workflow the agent should follow step-by-step.

**Tiering:** Use `[CRITICAL]` / `[HINT]` only if the target file already uses that style; otherwise use clear “Always” / “Never” per `.cursor/skills/improve-rule/SKILL.md`.

### 4. Apply the edit

- Read the target file (or section); match tone and structure.
- **Imperatives:** Direct verbs (“Always…”, “Never…”).
- **Examples:** Short `// BAD` / `// GOOD` only where this repo already uses code in that file (e.g. `debug.md` patterns). For `RULE.md` edits, prefer concise bullets; follow `.cursor/skills/improve-rule/SKILL.md` when tightening prose.
- **Minimal diff:** Small subsection or bullet group; merging duplicates in the same section is fine. Large rewrites need **explicit user confirmation**.
- **Deletions & narrowing (from Step 1b):** When the Reverse Audit flagged misleading or outdated guidance, present each proposed removal or rewrite to the user **before** applying. Never delete or substantially rewrite rule content without explicit user approval.

### 5. Report

- **TL;DR:** What was learned (1–2 sentences).
- **Location:** The exact file path and section heading where it was saved.
- **Removals:** List any rules proposed for deletion or narrowing, with the user's decision (applied / deferred / rejected). If none, omit this line.
- **Omissions:** Briefly list anything explicitly *not* saved and why.
- **Stop.** Wait for next instructions. Do not print the whole file or long code blocks.

---

## Anti-patterns

- Pasting long SQL or stack traces into rules — summarize; reference migration filenames if useful.
- Duplicating the same lesson across many files.
- Putting secrets or new credentials in rules or skills.
- Rewriting large rule sections without approval.
- Deleting or silently rewriting existing rules without presenting the offending line and recommendation to the user first.
- Adding files under `.cursor/skills/` that are not allowed by `projectStructure.config.cjs` (currently: each subfolder may contain `SKILL.md` only).
