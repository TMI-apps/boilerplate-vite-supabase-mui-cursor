/**
 * Service for managing app.config.json file
 *
 * This service syncs configuration state to app.config.json so Cursor agent
 * can read and understand the current app configuration.
 *
 * Security: API keys are NOT stored in this file - they remain in .env
 * This file only contains references and metadata.
 */

import type {
  AppConfig,
  Configurations,
  SetupConfig,
  ConfigSetupSectionId,
  ConfigSetupStatus,
} from "../types/config.types";
import { getSetupSectionsState, getEnabledFeatures, isSetupComplete } from "@utils/setupUtils";
import { getCustomTheme } from "@shared/theme/themeLoader";

/**
 * Read environment variables from .env file (server-side)
 * This allows us to get current values without requiring a restart
 */
const readEnvFromFile = async (): Promise<Record<string, string>> => {
  try {
    const response = await fetch("/api/read-env");
    const data = await response.json();
    if (data.success && data.env) {
      return data.env as Record<string, string>;
    }
  } catch {
    // Fallback to import.meta.env if endpoint fails
  }
  return {};
};

/**
 * Read an environment variable from file or fallback to import.meta.env
 */
const readEnvVar = (envVars: Record<string, string>, key: string): string | undefined => {
  return envVars[key] || import.meta.env[key];
};

/**
 * Check if a value is a placeholder (not configured)
 */
const isPlaceholder = (value: string | undefined, placeholders: string[]): boolean => {
  return value !== undefined && placeholders.includes(value);
};

/**
 * Build Supabase configuration section
 */
const buildSupabaseConfig = (envVars: Record<string, string>): Configurations["supabase"] => {
  const supabaseUrl = readEnvVar(envVars, "VITE_SUPABASE_URL");
  const supabasePublishableKey = readEnvVar(envVars, "VITE_SUPABASE_PUBLISHABLE_KEY");
  const supabaseAnonKey = readEnvVar(envVars, "VITE_SUPABASE_ANON_KEY");
  const supabaseKey = supabasePublishableKey || supabaseAnonKey;

  const supabaseConfigured = !!(
    supabaseUrl &&
    supabaseKey &&
    !isPlaceholder(supabaseUrl, ["your-project-url"])
  );

  const supabaseKeyName = supabasePublishableKey
    ? "VITE_SUPABASE_PUBLISHABLE_KEY"
    : "VITE_SUPABASE_ANON_KEY";
  const supabaseKeySet = !!(supabasePublishableKey || supabaseAnonKey);

  return {
    configured: supabaseConfigured,
    url: supabaseConfigured && supabaseUrl ? supabaseUrl : undefined,
    urlKey: {
      name: "VITE_SUPABASE_URL",
      set: !!supabaseUrl,
    },
    keyKey: {
      name: supabaseKeyName,
      set: supabaseKeySet,
    },
  };
};

/**
 * Build Airtable configuration section
 */
const buildAirtableConfig = (envVars: Record<string, string>): Configurations["airtable"] => {
  const airtableApiKey = readEnvVar(envVars, "VITE_AIRTABLE_API_KEY");
  const airtableBaseId = readEnvVar(envVars, "VITE_AIRTABLE_BASE_ID");
  const airtableTableId = readEnvVar(envVars, "VITE_AIRTABLE_TABLE_ID");

  const airtableConfigured = !!(
    airtableApiKey &&
    airtableBaseId &&
    airtableTableId &&
    !isPlaceholder(airtableApiKey, ["your-api-key"]) &&
    !isPlaceholder(airtableBaseId, ["your-base-id"]) &&
    !isPlaceholder(airtableTableId, ["your-table-id"])
  );

  return {
    configured: airtableConfigured,
    baseId: airtableConfigured && airtableBaseId ? airtableBaseId : undefined,
    tableId: airtableConfigured && airtableTableId ? airtableTableId : undefined,
    apiKey: {
      name: "VITE_AIRTABLE_API_KEY",
      set: !!airtableApiKey,
    },
    baseIdKey: {
      name: "VITE_AIRTABLE_BASE_ID",
      set: !!airtableBaseId,
    },
    tableIdKey: {
      name: "VITE_AIRTABLE_TABLE_ID",
      set: !!airtableTableId,
    },
  };
};

/**
 * Build theme configuration section
 */
const buildThemeConfig = (): Configurations["theme"] => {
  const customTheme = getCustomTheme();
  const hasCustomTheme = customTheme !== null;

  return {
    custom: hasCustomTheme,
    hasCustomTheme,
  };
};

/**
 * Build current configuration state from app state
 */
const buildConfig = async (): Promise<AppConfig> => {
  const setupState = getSetupSectionsState();
  const enabledFeatures = getEnabledFeatures();
  const setupComplete = isSetupComplete();

  // Read env vars from .env file (server-side) to get latest values
  const envVars = await readEnvFromFile();

  const configurations: Configurations = {
    supabase: buildSupabaseConfig(envVars),
    airtable: buildAirtableConfig(envVars),
    theme: buildThemeConfig(),
    hosting: {
      configured: setupState.hosting === "completed",
    },
  };

  const setup: SetupConfig = {
    completed: setupComplete,
    sections: {
      supabase: setupState.supabase as ConfigSetupStatus,
      airtable: setupState.airtable as ConfigSetupStatus,
      hosting: setupState.hosting as ConfigSetupStatus,
      theme: setupState.theme as ConfigSetupStatus,
    },
    enabledFeatures: enabledFeatures as ConfigSetupSectionId[],
  };

  return {
    version: "1.0.0",
    setup,
    configurations,
    lastUpdated: new Date().toISOString(),
  };
};

/**
 * Fetch a configuration section from app.config.json via API.
 * Used by useConfigurationQuery for TanStack Query caching.
 */
export const fetchConfigSection = async <T>(section: ConfigSetupSectionId): Promise<T> => {
  const response = await fetch("/api/read-config");
  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.error || "Failed to fetch configuration");
  }

  const config = result.config as AppConfig;
  return config.configurations[section] as T;
};

/**
 * Write configuration to app.config.json via API endpoint
 *
 * @returns Promise resolving to success/error
 */
export const syncConfiguration = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    const config = await buildConfig();

    const response = await fetch("/api/write-config", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(config),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      return { success: true };
    } else {
      return {
        success: false,
        error: data.message || "Failed to write configuration",
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to sync configuration",
    };
  }
};
