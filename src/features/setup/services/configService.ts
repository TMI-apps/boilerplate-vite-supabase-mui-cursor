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
 * Build current configuration state from app state
 */
const buildConfig = async (): Promise<AppConfig> => {
  const setupState = getSetupSectionsState();
  const enabledFeatures = getEnabledFeatures();
  const setupComplete = isSetupComplete();

  // Read env vars from .env file (server-side) to get latest values
  const envVars = await readEnvFromFile();

  // Get Supabase URL from .env file (without key for security)
  const supabaseUrl = envVars.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey =
    envVars.VITE_SUPABASE_PUBLISHABLE_KEY ||
    envVars.VITE_SUPABASE_ANON_KEY ||
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    import.meta.env.VITE_SUPABASE_ANON_KEY;
  const supabaseConfigured = !!(supabaseUrl && supabaseKey && supabaseUrl !== "your-project-url");

  // Get Airtable IDs from .env file (without key for security)
  const airtableApiKey = envVars.VITE_AIRTABLE_API_KEY || import.meta.env.VITE_AIRTABLE_API_KEY;
  const airtableBaseId = envVars.VITE_AIRTABLE_BASE_ID || import.meta.env.VITE_AIRTABLE_BASE_ID;
  const airtableTableId = envVars.VITE_AIRTABLE_TABLE_ID || import.meta.env.VITE_AIRTABLE_TABLE_ID;
  const airtableConfigured = !!(
    airtableApiKey &&
    airtableBaseId &&
    airtableTableId &&
    airtableApiKey !== "your-api-key" &&
    airtableBaseId !== "your-base-id" &&
    airtableTableId !== "your-table-id"
  );

  // Check theme
  const customTheme = getCustomTheme();
  const hasCustomTheme = customTheme !== null;

  // Check which Supabase key is set (prefer publishable key, fallback to anon key)
  const supabasePublishableKey =
    envVars.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  const supabaseAnonKey = envVars.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;
  const supabaseKeyName = supabasePublishableKey
    ? "VITE_SUPABASE_PUBLISHABLE_KEY"
    : "VITE_SUPABASE_ANON_KEY";
  const supabaseKeySet = !!(supabasePublishableKey || supabaseAnonKey);

  const configurations: Configurations = {
    supabase: {
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
    },
    airtable: {
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
    },
    theme: {
      custom: hasCustomTheme,
      hasCustomTheme,
    },
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
