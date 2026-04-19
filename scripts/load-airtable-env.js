/**
 * Shared loader: `VITE_AIRTABLE_*` from repo-root `.env` then `.env.local` (later files override).
 * Used by `airtable-meta-dump.js` and `airtable-sample-records.js` (Node CLI only).
 *
 * Security: never log values from this module. PATs belong in local env only, not in git.
 */
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

/**
 * @returns {{ apiKey: string, baseId: string } | null}
 */
export function loadViteAirtableEnv() {
  for (const name of [".env", ".env.local"]) {
    const envPath = join(root, name);
    if (!existsSync(envPath)) continue;
    const text = readFileSync(envPath, "utf8");
    for (const line of text.split("\n")) {
      const t = line.trim();
      if (!t || t.startsWith("#")) continue;
      const i = t.indexOf("=");
      if (i <= 0) continue;
      const key = t.slice(0, i).trim();
      let val = t.slice(i + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      if (key.startsWith("VITE_AIRTABLE_")) {
        process.env[key] = val;
      }
    }
  }

  const apiKey = process.env.VITE_AIRTABLE_API_KEY?.trim();
  const baseId = process.env.VITE_AIRTABLE_BASE_ID?.trim();
  if (
    !apiKey ||
    !baseId ||
    apiKey === "your-api-key" ||
    baseId === "your-base-id"
  ) {
    return null;
  }
  return { apiKey, baseId };
}

/**
 * Primary table id from env (matches setup wizard / `isAirtableConfigured` in the app).
 * Call only after `loadViteAirtableEnv()` returned non-null so `.env` has been parsed.
 *
 * @returns {string | null}
 */
export function getDefaultAirtableTableIdFromEnv() {
  const tableId = process.env.VITE_AIRTABLE_TABLE_ID?.trim();
  if (!tableId || tableId === "your-table-id") {
    return null;
  }
  return tableId;
}
