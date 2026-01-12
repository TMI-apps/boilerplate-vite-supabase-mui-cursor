import { useState, useEffect, useCallback } from "react";
import type { AppConfig, ConfigSetupSectionId } from "../types/config.types";

interface UseConfigurationDataReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch current configuration from app.config.json
 *
 * @param section - The configuration section to fetch
 * @returns Configuration data, loading state, error, and refetch function
 */
export function useConfigurationData<T>(
  section: ConfigSetupSectionId
): UseConfigurationDataReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConfig = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/read-config");
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to fetch configuration");
      }

      const config = result.config as AppConfig;
      const sectionData = config.configurations[section] as T;

      setData(sectionData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [section]);

  useEffect(() => {
    void fetchConfig();
  }, [fetchConfig]);

  return {
    data,
    loading,
    error,
    refetch: fetchConfig,
  };
}
