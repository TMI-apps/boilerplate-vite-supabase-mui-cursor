#!/usr/bin/env node
/**
 * Dump full Airtable base structure via Meta API (tables + fields; no row values).
 *
 *   node scripts/airtable-meta-dump.js [--out path] [--pretty]
 *
 * Without `--out`: prints JSON to stdout.
 * Requires: `.env` or `.env.local` with `VITE_AIRTABLE_API_KEY` and `VITE_AIRTABLE_BASE_ID`.
 *
 * Do not commit dump files if they expose sensitive operational metadata; prefer paths outside the repo.
 */
import { writeFileSync } from "node:fs";
import { loadViteAirtableEnv } from "./load-airtable-env.js";

const args = process.argv.slice(2);
let outPath = null;
let pretty = false;
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--out" && args[i + 1]) {
    outPath = args[++i];
  } else if (args[i] === "--pretty") {
    pretty = true;
  }
}

const creds = loadViteAirtableEnv();
if (!creds) {
  console.error(
    "Set VITE_AIRTABLE_API_KEY and VITE_AIRTABLE_BASE_ID in .env or .env.local"
  );
  process.exit(1);
}

const { apiKey, baseId } = creds;
const response = await fetch(
  `https://api.airtable.com/v0/meta/bases/${baseId}/tables`,
  {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
  }
);

if (!response.ok) {
  console.error("Meta API error:", response.status, response.statusText);
  process.exit(1);
}

const body = await response.json();
const { tables } = body;
if (!Array.isArray(tables)) {
  console.error("Unexpected Meta response: missing tables[]");
  process.exit(1);
}

const envelope = {
  generatedAt: new Date().toISOString(),
  baseId,
  source: "airtable-meta-api:v0/meta/bases/{baseId}/tables",
  tableCount: tables.length,
  fieldCount: tables.reduce((n, t) => n + (t.fields?.length ?? 0), 0),
  tables,
};

const text = pretty ? JSON.stringify(envelope, null, 2) : JSON.stringify(envelope);

if (outPath) {
  writeFileSync(outPath, text, "utf8");
  console.error(
    `Wrote ${envelope.tableCount} tables (${envelope.fieldCount} fields) to ${outPath}`
  );
} else {
  console.log(text);
}
