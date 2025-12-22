import { isSupabaseConfigured } from "@shared/services/supabaseService";
import { isAirtableConfigured } from "@shared/services/airtableService";
import type { DataProvider } from "./types";
import { SupabaseProvider } from "./supabaseProvider";
import { AirtableProvider } from "./airtableProvider";
import { BrowserStorageProvider } from "./browserStorageProvider";

/**
 * Get the appropriate data provider based on configuration
 * Priority: Supabase → Airtable → Browser Storage
 */
export function getDataProvider(): DataProvider {
  if (isSupabaseConfigured()) {
    return new SupabaseProvider();
  }
  if (isAirtableConfigured()) {
    return new AirtableProvider();
  }
  return new BrowserStorageProvider();
}
