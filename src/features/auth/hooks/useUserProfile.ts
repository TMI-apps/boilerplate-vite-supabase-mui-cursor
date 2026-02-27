import { useUserProfileQuery } from "./useUserProfileQuery";
import type { User, UserProfile } from "../types/auth.types";

export type { UserProfile, UserRole } from "../types/auth.types";

interface UseUserProfileReturn {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch user profile data from the users table.
 * Wrapper around useUserProfileQuery for backward compatibility.
 *
 * @deprecated Prefer useUserProfileQuery for new code. This wrapper is kept for existing consumers.
 */
export const useUserProfile = (user: User | null): UseUserProfileReturn => {
  const {
    data: profile,
    isLoading: loading,
    error: queryError,
    refetch: queryRefetch,
  } = useUserProfileQuery(user?.id ?? null);

  const refetch = async (): Promise<void> => {
    await queryRefetch();
  };

  return {
    profile: profile ?? null,
    loading,
    error: queryError?.message ?? null,
    refetch,
  };
};
