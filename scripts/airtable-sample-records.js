#!/usr/bin/env node
/**
 * Fetch a small sample of Airtable records (Data API) to inspect cell shapes.
 *
 *   node scripts/airtable-sample-records.js [--table <tblId>] [--table-name "Name"] [--max-records 3] [--fields fld1,fld2]
 *
 * If both `--table` and `--table-name` are omitted, uses `VITE_AIRTABLE_TABLE_ID` from `.env` / `.env.local`
 * (same default table as the setup wizard). If that is unset or still the placeholder, pass `--table` or `--table-name`.
 *
 * Uses `returnFieldsByFieldId=true` so `record.fields` keys are `fld…` ids (aligned with field-id-based clients).
 * Requires: `VITE_AIRTABLE_API_KEY`, `VITE_AIRTABLE_BASE_ID`; default table mode also needs `VITE_AIRTABLE_TABLE_ID`.
 */
import {
  loadViteAirtableEnv,
  getDefaultAirtableTableIdFromEnv,
} from "./load-airtable-env.js";

function parseArgs(argv) {
  const out = {
    table: null,
    tableName: null,
    maxRecords: 3,
    fields: null,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--table" && argv[i + 1]) {
      out.table = argv[++i];
    } else if (a === "--table-name" && argv[i + 1]) {
      out.tableName = argv[++i];
    } else if (a === "--max-records" && argv[i + 1]) {
      out.maxRecords = Math.min(100, Math.max(1, parseInt(argv[++i], 10) || 3));
    } else if (a === "--fields" && argv[i + 1]) {
      const raw = argv[++i];
      out.fields = raw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
  }
  return out;
}

const creds = loadViteAirtableEnv();
if (!creds) {
  console.error(
    "Set VITE_AIRTABLE_API_KEY and VITE_AIRTABLE_BASE_ID in .env or .env.local"
  );
  process.exit(1);
}

const { apiKey, baseId } = creds;
const opts = parseArgs(process.argv.slice(2));

let tableId = opts.table;
if (!tableId && opts.tableName) {
  const metaRes = await fetch(
    `https://api.airtable.com/v0/meta/bases/${baseId}/tables`,
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    }
  );
  if (!metaRes.ok) {
    console.error("Meta API error (resolve table name):", metaRes.status);
    process.exit(1);
  }
  const { tables } = await metaRes.json();
  const t = tables?.find((x) => x.name === opts.tableName);
  if (!t) {
    console.error(`Table not found by name: ${opts.tableName}`);
    process.exit(1);
  }
  tableId = t.id;
}

if (!tableId) {
  tableId = getDefaultAirtableTableIdFromEnv();
}

if (!tableId) {
  console.error(
    "No table id: pass --table <tblId> or --table-name <name>, or set VITE_AIRTABLE_TABLE_ID in .env (not the placeholder)."
  );
  process.exit(1);
}

const params = new URLSearchParams();
params.set("maxRecords", String(opts.maxRecords));
params.set("returnFieldsByFieldId", "true");
if (opts.fields?.length) {
  for (const f of opts.fields) {
    params.append("fields[]", f);
  }
}

const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(
  tableId
)}?${params.toString()}`;

const response = await fetch(url, {
  headers: {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  },
});

if (!response.ok) {
  const errText = await response.text();
  console.error("Data API error:", response.status, errText.slice(0, 500));
  process.exit(1);
}

const data = await response.json();
const envelope = {
  fetchedAt: new Date().toISOString(),
  baseId,
  tableId,
  recordCount: data.records?.length ?? 0,
  records: data.records ?? [],
};

console.log(JSON.stringify(envelope, null, 2));
