---
description: Plan a feature using the project's plan workflow (writes DEVELOPMENT_PLAN.md)
argument-hint: <feature name or description>
---

# /plan

Read `.cursor/skills/plan/SKILL.md` and execute the planning workflow it describes for the following request:

$ARGUMENTS

That file is the single source of truth for how planning works in this repo. Follow it verbatim — do not improvise or skip steps. The output is a `DEVELOPMENT_PLAN.md` under `documentation/jobs/temp_job_<name>/`.

Key reminders from the skill (do not substitute for reading the file):

- If the request is vague, refine it with the user **before** writing the plan.
- Run conflict & compliance analysis **before** writing phase steps.
- Every phase must have a gate.
- Do **not** update the changelog — that is `/finish`'s job.
- Validate file paths against `projectStructure.config.cjs` and the rules in `@.cursor/rules/INDEX.md`.

After writing the plan, present it to the user and iterate on feedback before considering planning complete.
