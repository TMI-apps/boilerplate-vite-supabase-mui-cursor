import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sharedQueryKeys } from "@/shared/utils/queryKeys";
import type { UserProfileUpdate } from "@/features/auth/types/auth.types";
import { updateUserProfile } from "@/features/auth/services/userProfileService";

/**
 * Mutation hook to update user profile.
 * Merges the canonical server response into the profile query cache on success.
 */
export const useUpdateUserProfile = (userId: string | null) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UserProfileUpdate) => {
      if (!userId) throw new Error("User ID required");
      return updateUserProfile(userId, data);
    },
    onSuccess: (result) => {
      if (userId && result) {
        queryClient.setQueryData(sharedQueryKeys.user.profile(userId), result);
      }
    },
  });
};
