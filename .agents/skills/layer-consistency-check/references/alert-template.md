# Workaround alert template

Use when layer-consistency-check clears the severity filter. Summarize the same substance in chat; do not write the workaround code until the user chooses.

```markdown
⚠️ WARNING, WORKAROUND

What you're asking for: <plain restatement of the request>

Why it needs a workaround: <name the layer — physics/math constraint,
abstraction hierarchy, or architecture assumption — and describe specifically
what about the current system makes the literal request not fit it>

The workaround (if we proceed as asked): <what it would look like, and what
it will cost later — e.g. "every future product needs its own button
component", "this exception has to be remembered and excluded every time
the vision system is touched">

Structural alternative: <what would need to change in the design/system to
support this cleanly, and roughly what that costs now>
```

Then **stop and wait** for the user to pick workaround vs structural alternative. Only implement once they've chosen.

If presenting multiple options after the block, follow `.cursor/rules/workflow/RULE.md` § Decision Questioning Protocol.
