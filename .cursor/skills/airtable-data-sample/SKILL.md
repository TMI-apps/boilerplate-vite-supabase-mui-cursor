---

## name: airtable-data-sample

description: >-
  Fetch a few Airtable rows to inspect cell shapes (attachments, rich text, URLs,
  linked-record ids) with fld… keys. Requires schema skill first. Safe defaults:
  low maxRecords, optional fields allowlist, redact PII in chat. Triggers: sample
  rows, cell shape, returnFieldsByFieldId, verify wire JSON vs app normalization.
disable-model-invocation: true

# Airtable: data (sample rows)

## Depends on (required)

Run `**.cursor/skills/airtable-schema-structure/SKILL.md**` first: full field list (names, `fld…`, types) for the table, mapped to what the app uses. This skill only makes sense once you know which `fld…` values to pass to `--fields`.

## Goal

See **what values** look like: attachment arrays, rich text wrappers, URLs, linked record id lists — with `**fld…` keys** as returned when `returnFieldsByFieldId=true` (same style as id-based API consumers).

## Boilerplate vs wire shape

- `**scripts/airtable-sample-records.js`** hits the **public Airtable REST API** and prints JSON (`records[].fields`).
- `**src/shared/services/airtableService.ts`** may normalize or select fields for the UI. For “what does the REST API return today?”, **run the script** (or an equivalent fetch); reading the service alone shows app behavior, not necessarily the raw envelope.

## Security

- Never paste full production rows if they may contain names, emails, or internal content.
- Prefer **1–3 records**, `--fields` allowlist when possible, and **truncate or redact** in chat.
- Do not commit raw JSON samples without review.

## Commands (repo root)

Requires `VITE_AIRTABLE_API_KEY`, `VITE_AIRTABLE_BASE_ID` in `.env` or `.env.local`.

**Default table:** if you omit both `--table` and `--table-name`, the script uses `**VITE_AIRTABLE_TABLE_ID`** (same as the setup wizard primary table). If it is missing or still the placeholder, pass `--table` or `--table-name` explicitly.

```bash
pnpm airtable:sample -- --max-records 2

node scripts/airtable-sample-records.js --table tblXXXXXXXXXXXXXX --max-records 1

node scripts/airtable-sample-records.js --table-name "Your table" --max-records 1 --fields fldAAA,fldBBB
```

Output is JSON: `records[].fields` keyed by `**fld…**`.

## When to use vs other skills


| Question                           | Skill                                               |
| ---------------------------------- | --------------------------------------------------- |
| What is the type/shape of values?  | **This skill**                                      |
| What fields exist / types / links? | `.cursor/skills/airtable-schema-structure/SKILL.md` |


## Workflow

1. **Structure:** Full field list from Meta (see schema skill).
2. **Pick fields:** Choose `fld…` ids for `--fields` when narrowing PII or payload size.
3. Run `**pnpm airtable:sample`** or `node scripts/airtable-sample-records.js` with low `--max-records`.
4. Relate shapes to helpers in `src/shared/services/airtableService.ts` (and fork code).

## Related

- `.cursor/skills/airtable-schema-structure/SKILL.md`
- `src/features/setup/README.md`

