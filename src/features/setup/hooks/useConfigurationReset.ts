import { useState } from "react";
import { updateSetupSectionStatus } from "@utils/setupUtils";
import { syncConfiguration } from "../services/configService";
import type { ConfigSetupSectionId } from "../types/config.types";

interface UseConfigurationResetReturn {
  reset: () => Promise<void>;
  resetting: boolean;
  error: string | null;
}

/**
 * Environment variable keys for each configuration section
 */
const ENV_VARS_BY_SECTION: Record<ConfigSetupSectionId, string[]> = {
  supabase: ["VITE_SUPABASE_URL", "VITE_SUPABASE_PUBLISHABLE_KEY", "VITE_SUPABASE_ANON_KEY"],
  airtable: ["VITE_AIRTABLE_API_KEY", "VITE_AIRTABLE_BASE_ID", "VITE_AIRTABLE_TABLE_ID"],
  theme: [], // Theme is handled differently (removes customTheme.json)
  hosting: [], // Hosting doesn't use env vars
};

/**
 * Hook to handle resetting a configuration section
 *
 * @param section - The configuration section to reset
 * @param onSuccess - Optional callback when reset succeeds
 * @returns Reset function, resetting state, and error
 */
export function useConfigurationReset(
  section: ConfigSetupSectionId,
  onSuccess?: () => void
): UseConfigurationResetReturn {
  const [resetting, setResetting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = async () => {
    setResetting(true);
    setError(null);

    try {
      // Step 1: Remove environment variables
      const envVars = ENV_VARS_BY_SECTION[section];
      if (envVars.length > 0) {
        const response = await fetch("/api/remove-env-vars", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ variables: envVars }),
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.error || "Failed to remove environment variables");
        }
      }

      // Step 2: Handle theme-specific reset
      if (section === "theme") {
        // Remove custom theme from localStorage
        localStorage.removeItem("customTheme");
      }

      // Step 3: Update section status to not-started
      updateSetupSectionStatus(section, "not-started");

      // Step 4: Sync configuration to app.config.json
      const syncResult = await syncConfiguration();
      if (!syncResult.success) {
        throw new Error(syncResult.error || "Failed to sync configuration");
      }

      // Step 5: Call success callback
      onSuccess?.();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      throw err;
    } finally {
      setResetting(false);
    }
  };

  return {
    reset,
    resetting,
    error,
  };
}
