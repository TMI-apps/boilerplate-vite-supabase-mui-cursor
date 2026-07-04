# Subagent config (shared SSOT)

Shared configuration for skills that launch **Task** subagents (`review-dev-plan`, `improve-skill-library`, and any future fan-out skill).

```text
SUBAGENT_MODEL=composer-2.5
```

- Every **Task** subagent uses `model` = slug above. It must be a valid model slug for your Cursor build; edit **only** the value here.
- Subagents are **self-contained** — they do not see the calling chat. Paste full, self-sufficient briefs.
- Give each Task a short `description` naming its lens/role.
