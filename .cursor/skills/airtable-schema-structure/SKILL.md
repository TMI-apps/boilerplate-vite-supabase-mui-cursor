---

## name: airtable-schema-structure

description: >-
  Inspect Airtable base structure (tables, field ids/types, links) via Meta API and
  repo SSOT. Schema only — no row data. Use before sampling cells or mapping fld/tbl
  constants. Triggers: Meta API, field id, linked tables, schema drift vs code.
disable-model-invocation: true

# Airtable: structure (schema only)

## Goal

Answer **what exists** in the base: table ids (`tbl…`), field ids (`fld…`), types, linked targets — **without** loading record contents. Use this **before** writing mappers or debugging “field not found” when the app uses field ids.

## Layers (boilerplate vs fork)

1. **Airtable-agnostic:** Meta API `GET /v0/meta/bases/{baseId}/tables`; Data API field ids vs display names.
2. **This boilerplate:** Env `VITE_AIRTABLE_`*; runtime Meta usage and types in `src/shared/services/airtableService.ts`; setup wizard under `src/features/setup/`.
3. **Fork / product:** If you need a single SSOT for many `tbl`* / `fld`* constants, add a small module under `src/shared/` following `.cursor/rules/file-placement/RULE.md` and `.cursor/rules/architecture/RULE.md` (this repo does not ship one).

## When to use vs other skills


| Question                                                       | Skill                                          |
| -------------------------------------------------------------- | ---------------------------------------------- |
| Which columns / types / links?                                 | **This skill**                                 |
| What do cell values look like (shape, attachments, rich text)? | `.cursor/skills/airtable-data-sample/SKILL.md` |


## Security

Never print API keys or raw `.env` lines. Meta responses contain **no row values**; still treat dumps as operational metadata — do not commit without review.

## Commands (repo root)

Requires `VITE_AIRTABLE_API_KEY` and `VITE_AIRTABLE_BASE_ID` in `.env` or `.env.local` (loaded by `scripts/load-airtable-env.js`).


| Command                                                       | Purpose                                                                  |
| ------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `pnpm airtable:meta-dump`                                     | Same as `node scripts/airtable-meta-dump.js` — full base tables + fields |
| `node scripts/airtable-meta-dump.js --pretty --out meta.json` | Pretty JSON to a file (prefer a path outside git)                        |


Forks may add their own drift-check script (compare a checked-in constants module to a saved Meta dump); this boilerplate does not ship one.

## Workflow

1. Run `pnpm airtable:meta-dump -- --pretty` (or `--out <path>`) with valid env.
2. For the relevant table, list **every** field: name, `id`, `type`, and link options if applicable.
3. Cross-check with `src/shared/services/airtableService.ts` (and any fork-owned id constants): fields present in Airtable but absent in code often cause drift bugs.

## Output template

```markdown
## Scope
[Table / feature]

## Meta / script
- Command: [...]
- Table id + name: [...]
- Columns (name | fld… | type): [...]

## Code alignment
- Matches `airtableService` / types: [...]
- Gaps: [...]

## Follow-up
- [Constants / mapper / wizard copy]
```

## Related

- `.cursor/skills/airtable-data-sample/SKILL.md` — sample rows after schema is known
- `src/features/setup/README.md` — CLI / agent entry points

