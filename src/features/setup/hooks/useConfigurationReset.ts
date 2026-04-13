import { useState } from "react";
import { resetSetupSection } from "../services/configurationResetService";
import type { ConfigSetupSectionId } from "../types/config.types";

interface UseConfigurationResetReturn {
  reset: () => Promise<void>;
  resetting: boolean;
  error: string | null;
}

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
      await resetSetupSection(section);
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
