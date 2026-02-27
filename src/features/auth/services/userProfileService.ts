import { getSupabase } from "@shared/services/supabaseService";
import type { UserProfile } from "../types/auth.types";

const USER_PROFILE_FIELDS = `
  id,
  email,
  display_name,
  photo_url,
  email_verified,
  disabled,
  role,
  provider_ids,
  creation_time,
  last_sign_in_time,
  updated_at,
  remaining_credits,
  credit_period,
  auth_provider,
  ef_nl_edu_person_home_organization,
  ef_nl_edu_person_home_organization_id,
  total_messages,
  total_tokens,
  total_cost,
  settings
`;

/**
 * Fetches user profile from the users table.
 * Returns null if no row (PGRST116); throws on other errors.
 */
export const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const { data, error } = await getSupabase()
    .from("users")
    .select(USER_PROFILE_FIELDS)
    .eq("id", userId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw new Error(error.message);
  }

  return data as UserProfile;
};

/** Partial profile data for updates (excludes id) */
export type UserProfileUpdate = Partial<Omit<UserProfile, "id">>;

/**
 * Updates user profile in the users table.
 * Invalidates the profile query via TanStack Query (caller's responsibility).
 */
export const updateUserProfile = async (
  userId: string,
  data: UserProfileUpdate
): Promise<UserProfile | null> => {
  const { data: updated, error } = await getSupabase()
    .from("users")
    .update(data)
    .eq("id", userId)
    .select(USER_PROFILE_FIELDS)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return updated as UserProfile;
};
