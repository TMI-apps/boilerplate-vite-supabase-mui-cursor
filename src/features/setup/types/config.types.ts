/**
 * Configuration file structure for app.config.json
 * This file stores the current state of app configuration for Cursor agent to read
 *
 * Note: Types are defined inline to avoid importing from non-types files
 * (architecture rule: types files should only import from other types files)
 */

/** Setup section identifiers (must match setupUtils.ts) */
export type ConfigSetupSectionId = "supabase" | "airtable" | "hosting" | "theme";

/** Setup section status values (must match setupUtils.ts) */
export type ConfigSetupStatus = "not-started" | "in-progress" | "completed" | "skipped";

export interface EnvVariable {
  name: string;
  set: boolean;
}

export interface SupabaseConfiguration {
  configured: boolean;
  url?: string;
  urlKey: EnvVariable; // VITE_SUPABASE_URL
  keyKey: EnvVariable; // VITE_SUPABASE_PUBLISHABLE_KEY or VITE_SUPABASE_ANON_KEY
}

export interface AirtableConfiguration {
  configured: boolean;
  baseId?: string;
  tableId?: string;
  apiKey: EnvVariable; // VITE_AIRTABLE_API_KEY
  baseIdKey: EnvVariable; // VITE_AIRTABLE_BASE_ID
  tableIdKey: EnvVariable; // VITE_AIRTABLE_TABLE_ID
}

export interface ThemeConfiguration {
  custom: boolean;
  hasCustomTheme: boolean;
}

export interface HostingConfiguration {
  configured: boolean;
  providerName?: string;
  deploymentUrl?: string;
}

export interface Configurations {
  supabase: SupabaseConfiguration;
  airtable: AirtableConfiguration;
  theme: ThemeConfiguration;
  hosting: HostingConfiguration;
}

export interface SetupConfig {
  completed: boolean;
  sections: Record<ConfigSetupSectionId, ConfigSetupStatus>;
  enabledFeatures: ConfigSetupSectionId[];
}

export interface AppConfig {
  version: string;
  setup: SetupConfig;
  configurations: Configurations;
  lastUpdated: string;
}
