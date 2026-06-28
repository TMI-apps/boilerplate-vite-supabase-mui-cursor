import { useQuery } from "@tanstack/react-query";
import { sharedQueryKeys } from "@/shared/utils/queryKeys";
import { fetchUserProfile } from "@/features/auth/services/userProfileService";

const PROFILE_QUERY_DISABLED_KEY = "_disabled_" as const;

/**
 * Fetches user profile via TanStack Query with caching.
 */
export const useUserProfileQuery = (userId: string | null) =>
  useQuery({
    queryKey: sharedQueryKeys.user.profile(userId ?? PROFILE_QUERY_DISABLED_KEY),
    queryFn: () => fetchUserProfile(userId!),
    enabled: Boolean(userId),
  });
