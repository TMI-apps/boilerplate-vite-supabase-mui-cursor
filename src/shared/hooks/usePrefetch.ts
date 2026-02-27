import { useQueryClient } from "@tanstack/react-query";
import { sharedQueryKeys } from "@shared/utils/queryKeys";
import { fetchConfigSection } from "@features/setup/services/configService";
import type { ConfigSetupSectionId } from "@features/setup/types/config.types";

const STALE_TIME_MS = 1000 * 60 * 10; // 10 min, matches useConfigurationQuery

const SETUP_SECTIONS: ConfigSetupSectionId[] = ["supabase", "airtable", "hosting", "theme"];

/**
 * Hook for prefetching query data on hover or before navigation.
 * Use sparingly – only for critical routes where prefetch improves perceived performance.
 *
 * @example
 * const { prefetchSetup } = usePrefetch();
 * <Link to="/setup" onMouseEnter={prefetchSetup}>Setup</Link>
 */
export const usePrefetch = () => {
  const queryClient = useQueryClient();

  return {
    /**
     * Prefetch config sections used by SetupPage.
     * Call on hover over Setup link for faster page load.
     */
    prefetchSetup: () => {
      for (const section of SETUP_SECTIONS) {
        void queryClient.prefetchQuery({
          queryKey: sharedQueryKeys.config.section(section),
          queryFn: () => fetchConfigSection(section),
          staleTime: STALE_TIME_MS,
        });
      }
    },
  };
};
