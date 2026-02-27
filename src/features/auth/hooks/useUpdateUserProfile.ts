import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sharedQueryKeys } from "@shared/utils/queryKeys";
import { updateUserProfile, type UserProfileUpdate } from "../services/userProfileService";

/**
 * Mutation hook to update user profile.
 * Invalidates the profile query on success so the UI refetches.
 */
export const useUpdateUserProfile = (userId: string | null) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UserProfileUpdate) => {
      if (!userId) throw new Error("User ID required");
      return updateUserProfile(userId, data);
    },
    onSuccess: () => {
      if (userId) {
        void queryClient.invalidateQueries({
          queryKey: sharedQueryKeys.user.profile(userId),
        });
      }
    },
  });
};
