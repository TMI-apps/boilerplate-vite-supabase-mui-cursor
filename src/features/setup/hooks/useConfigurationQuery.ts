import { useQuery } from "@tanstack/react-query";
import { sharedQueryKeys } from "@shared/utils/queryKeys";
import { fetchConfigSection } from "../services/configService";
import type { ConfigSetupSectionId } from "../types/config.types";

const STALE_TIME_MS = 1000 * 60 * 10; // 10 min
const GC_TIME_MS = 1000 * 60 * 60; // 1 hour

/**
 * Fetches configuration section via TanStack Query with caching.
 * Use useConfigurationData for the legacy interface (data, loading, error, refetch).
 */
export const useConfigurationQuery = <T>(section: ConfigSetupSectionId) =>
  useQuery({
    queryKey: sharedQueryKeys.config.section(section),
    queryFn: () => fetchConfigSection<T>(section),
    staleTime: STALE_TIME_MS,
    gcTime: GC_TIME_MS,
  });
