# Vendor: Supabase (MCP path)

This fork's backend is Supabase. Supabase ships an MCP server (e.g. registered as `plugin-supabase-supabase` in this environment), so the default path is MCP-first, not raw REST/SQL scripts.

**Environment note — don't hardcode server names:** a workspace may have the generic Supabase plugin server, a project-specific server (naming varies per fork/user, e.g. `user-<project>-production` / `user-<project>-staging`), or both. Which one to use is an environment detail, not part of this generic procedure — run `GetMcpTools` and pick the server scoped to the project actually being worked on (see the "multiple servers match" row in the skill's fallback decision tree). Never copy a specific project's server name into fork-agnostic code, docs, or examples.

## Phase 0 — Locate

- Call `GetMcpTools` with `pattern: "supabase"` (or inspect the catalog) to find the registered Supabase MCP server(s) in the current workspace.
- If none exist, fall back to the Supabase CLI and docs (`supabase db ...`, `supabase functions ...` — see `.cursor/rules/database/RULE.mdc` and `.cursor/rules/cloud-functions/RULE.mdc` for the exact commands this fork uses) plus [supabase.com/docs](https://supabase.com/docs).

## Phase 1 — Schema/contract commands (MCP)

Typical Supabase MCP tools relevant to schema/contract research (exact names depend on the server version — call `GetMcpTools` for the current schema before using):

- `list_tables` — table/column structure before assuming a schema from memory
- `list_extensions`, `list_migrations` — what's actually applied, not just what's in a local migration file
- `get_advisors` — security/performance advisories worth checking before writing new queries against a table
- `generate_typescript_types` — confirm the current generated types match what you're about to write against

## Phase 2 — Sample/wire shape commands (MCP)

- `execute_sql` (read-only queries) for a real row-shape sample — same discipline as Airtable's sample phase: narrow scope, redact PII, don't paste full production rows into chat.
- `get_logs` / `get_advisors` when debugging an existing integration rather than researching a brand-new one.

## No-MCP fallback

If no Supabase MCP server is reachable in a given environment, fall back to:

- The latest applied migration file under `supabase/migrations/` for schema (never assume table/column names from memory — see `.cursor/rules/security/RULE.mdc` § Database Verification).
- `supabase gen types typescript --local` for a current TypeScript contract.
- `.cursor/rules/database/RULE.mdc` for the exact CLI commands this fork uses.

## Related

- `.cursor/rules/database/RULE.mdc` — migration/CLI commands for this fork's Postgres/Supabase backend
- `.cursor/rules/security/RULE.mdc` § Database Verification — MCP-first, migration-file fallback
- `.cursor/rules/cloud-functions/RULE.mdc` — Supabase Edge Functions deploy model
