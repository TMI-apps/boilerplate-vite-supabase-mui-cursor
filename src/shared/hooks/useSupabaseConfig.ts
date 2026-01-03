import { isSupabaseConfigured } from "@shared/services/supabaseService";

/**
 * Hook to check if Supabase is configured.
 * Wraps the service call to follow architecture rules (components cannot import services directly).
 */
export const useSupabaseConfig = () => {
  return {
    isConfigured: isSupabaseConfigured(),
  };
};
