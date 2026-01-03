import { isSupabaseConfigured, testSupabaseConnection } from "@shared/services/supabaseService";

/**
 * Hook for Supabase setup functionality.
 * Provides configuration check and connection testing.
 * Wraps service calls to follow architecture rules (components cannot import services directly).
 */
export const useSupabaseSetup = () => {
  const isConfigured = isSupabaseConfigured();

  return {
    isConfigured,
    testSupabaseConnection,
  };
};
