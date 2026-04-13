import { updateSetupSectionStatus } from "@utils/setupUtils";
import { syncConfiguration } from "./configService";
import type { ConfigSetupSectionId } from "../types/config.types";

/**
 * Per-section reset: which env keys to remove and optional client-side cleanup.
 */
interface SectionResetConfig {
  readonly envKeys: readonly string[];
  readonly afterEnvRemove?: () => void;
}

const SECTION_RESET_CONFIG: Record<ConfigSetupSectionId, SectionResetConfig> = {
  supabase: {
    envKeys: ["VITE_SUPABASE_URL", "VITE_SUPABASE_PUBLISHABLE_KEY", "VITE_SUPABASE_ANON_KEY"],
  },
  airtable: {
    envKeys: ["VITE_AIRTABLE_API_KEY", "VITE_AIRTABLE_BASE_ID", "VITE_AIRTABLE_TABLE_ID"],
  },
  theme: {
    envKeys: [],
    afterEnvRemove: () => {
      localStorage.removeItem("customTheme");
    },
  },
  hosting: {
    envKeys: [],
  },
};

/**
 * Removes listed variables via the dev API. No-op when the list is empty.
 */
export async function removeEnvVarsViaApi(variables: readonly string[]): Promise<void> {
  if (variables.length === 0) {
    return;
  }

  const response = await fetch("/api/remove-env-vars", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ variables: [...variables] }),
  });

  const result: { success?: boolean; error?: string } = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.error || "Failed to remove environment variables");
  }
}

/**
 * Resets a setup section: optional env removal, section cleanup, status update, config sync.
 */
export async function resetSetupSection(section: ConfigSetupSectionId): Promise<void> {
  const config = SECTION_RESET_CONFIG[section];

  await removeEnvVarsViaApi(config.envKeys);
  config.afterEnvRemove?.();

  updateSetupSectionStatus(section, "not-started");

  const syncResult = await syncConfiguration();
  if (!syncResult.success) {
    throw new Error(syncResult.error || "Failed to sync configuration");
  }
}
