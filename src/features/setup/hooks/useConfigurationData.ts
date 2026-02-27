import { useConfigurationQuery } from "./useConfigurationQuery";
import type { ConfigSetupSectionId } from "../types/config.types";

interface UseConfigurationDataReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch current configuration from app.config.json.
 * Wrapper around useConfigurationQuery for backward compatibility.
 *
 * @deprecated Prefer useConfigurationQuery for new code. This wrapper is kept for existing consumers.
 * @param section - The configuration section to fetch
 * @returns Configuration data, loading state, error, and refetch function
 */
export function useConfigurationData<T>(
  section: ConfigSetupSectionId
): UseConfigurationDataReturn<T> {
  const {
    data,
    isLoading: loading,
    error: queryError,
    refetch: queryRefetch,
  } = useConfigurationQuery<T>(section);

  const refetch = async (): Promise<void> => {
    await queryRefetch();
  };

  return {
    data: data ?? null,
    loading,
    error: queryError?.message ?? null,
    refetch,
  };
}
