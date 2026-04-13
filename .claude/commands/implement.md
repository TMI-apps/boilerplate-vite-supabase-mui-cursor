---
description: Execute a DEVELOPMENT_PLAN phase by phase
argument-hint: <plan / job name, or leave blank to infer>
---

# /implement

Read `.cursor/skills/implement/SKILL.md` and execute the implementation workflow it describes for:

$ARGUMENTS

That file is the single source of truth for how implementation works in this repo. Follow it verbatim.

Key reminders from the skill (do not substitute for reading the file):

- Resolve which `documentation/jobs/temp_job_<name>/DEVELOPMENT_PLAN.md` applies. If ambiguous, **stop and ask**.
- Execute phases **in order**, one at a time. Each phase has Goal → Steps → Gate.
- Run the gate before moving on. If it fails, fix and re-run.
- Update `DEVELOPMENT_PLAN.md` after each phase: phase status, Notes during development, Decisions made.
- For unexpected obstacles or important choices: **STOP** and ask the user.
- Do **not** update the changelog — that is `/finish`'s job.
- Follow `@.cursor/rules/architecture/RULE.md` (layers, aliases) and `@.cursor/rules/file-placement/RULE.md` while coding.
- Run `pnpm lint`, `pnpm type-check`, and relevant tests at phase boundaries when code exists.
