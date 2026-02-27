import { useQuery } from "@tanstack/react-query";
import { sharedQueryKeys } from "@shared/utils/queryKeys";
import { fetchUserProfile } from "../services/userProfileService";

const STALE_TIME_MS = 1000 * 60 * 5; // 5 min
const GC_TIME_MS = 1000 * 60 * 30; // 30 min

/**
 * Fetches user profile via TanStack Query with caching.
 * Use useUserProfile for the legacy interface (profile, loading, error, refetch).
 */
export const useUserProfileQuery = (userId: string | null) =>
  useQuery({
    queryKey: sharedQueryKeys.user.profile(userId ?? ""),
    queryFn: () => fetchUserProfile(userId!),
    enabled: !!userId,
    staleTime: STALE_TIME_MS,
    gcTime: GC_TIME_MS,
  });
