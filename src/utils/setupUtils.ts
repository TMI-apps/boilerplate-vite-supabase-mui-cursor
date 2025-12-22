import { isSupabaseConfigured } from "@shared/services/supabaseService";

/**
 * Check if setup is marked as complete in localStorage
 */
export const isSetupComplete = (): boolean => {
  return localStorage.getItem("setup_complete") === "true";
};

/**
 * Check if Supabase setup was skipped
 */
export const isSupabaseSkipped = (): boolean => {
  return localStorage.getItem("supabase_skipped") === "true";
};

/**
 * Mark Supabase setup as skipped
 */
export const skipSupabaseSetup = (): void => {
  localStorage.setItem("supabase_skipped", "true");
};

/**
 * Check if setup wizard should be shown
 */
export const shouldShowSetup = (): boolean => {
  // Show setup if not configured AND not skipped AND setup is not marked as complete
  return !isSupabaseConfigured() && !isSupabaseSkipped() && !isSetupComplete();
};
