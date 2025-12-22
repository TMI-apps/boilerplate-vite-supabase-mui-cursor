import { isSupabaseConfigured } from "@shared/services/supabaseService";

/**
 * Check if setup is marked as complete in localStorage
 */
export const isSetupComplete = (): boolean => {
  return localStorage.getItem("setup_complete") === "true";
};

/**
 * Check if setup wizard should be shown
 */
export const shouldShowSetup = (): boolean => {
  // Show setup if not configured OR if setup is not marked as complete
  return !isSupabaseConfigured() || !isSetupComplete();
};
