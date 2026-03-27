---
name: learn
description: >-
  Turns recent code changes, failures, and conversation mistakes into durable guidance.
  Use when the user runs /learn, asks for a retrospective or to sharpen rules, or after
  resolving a multi-turn struggle (e.g. 3+ failed attempts, critical CI fix).
---

# Learn from changes and sharpen rules

Extract lessons from **what just happened** (diffs, errors, retries) and persist them where the assistant will see them **before** the same mistake repeats. Prefer **one primary home** per lesson; cross-link instead of duplicating.

**Related:** Rule quality heuristics: `.cursor/commands/improve-rule.md`. Finish/changelog flow: `.cursor/commands/finish.md`.

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
| Changelog, version, finish / branch strategy | `.cursor/rules/workflow/RULE.md` or `.cursor/commands/finish.md` |
| Known symptom → fix pattern (repeatable) | `.cursor/commands/debug.md` § **Common Error Pattern Recognition** |
| Edge Functions vs frontend | `.cursor/rules/cloud-functions/RULE.md` |
| TanStack Query, server state | `ARCHITECTURE.md`, `documentation/DOC_TANSTACK_QUERY.md`, or feature `api/` keys patterns (one primary) |
| Long procedural workflow | Relevant `.cursor/commands/*.md` |
| Reusable multi-step procedure (not a one-line rule) | New or existing `.cursor/skills/<name>/SKILL.md` in this repo, or a user-level skill outside the repo |

Confirm ownership via `.cursor/rules/INDEX.md`.

**Procedures vs rules:** Single-line constraints belong in the right `RULE.md`. Use a **skill** (this folder pattern or user skills) when the lesson is a reusable workflow the agent should follow step-by-step.

**Tiering:** Use `[CRITICAL]` / `[HINT]` only if the target file already uses that style; otherwise use clear “Always” / “Never” per `.cursor/commands/improve-rule.md`.

### 4. Apply the edit

- Read the target file (or section); match tone and structure.
- **Imperatives:** Direct verbs (“Always…”, “Never…”).
- **Examples:** Short `// BAD` / `// GOOD` only where this repo already uses code in that file (e.g. `debug.md` patterns). For `RULE.md` edits, prefer concise bullets; follow `.cursor/commands/improve-rule.md` when tightening prose.
- **Minimal diff:** Small subsection or bullet group; merging duplicates in the same section is fine. Large rewrites need **explicit user confirmation**.

### 5. Report

- **TL;DR:** What was learned (1–2 sentences).
- **Location:** File path and section heading.
- **Omissions:** What was not saved and why.
- **Stop.** Do not dump entire files or long stack traces.

---

## Anti-patterns

- Pasting long SQL or stack traces into rules — summarize; reference migration filenames if useful.
- Duplicating the same lesson across many files.
- Putting secrets or new credentials in rules or skills.
- Rewriting large rule sections without approval.
- Adding files under `.cursor/skills/` that are not allowed by `projectStructure.config.cjs` (currently: each subfolder may contain `SKILL.md` only).
