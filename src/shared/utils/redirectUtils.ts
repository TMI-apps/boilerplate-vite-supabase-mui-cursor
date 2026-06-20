/**
 * Utility functions for managing redirect paths in sessionStorage.
 * Used to redirect users back to their intended page after authentication.
 */

const REDIRECT_PATH_KEY = "auth_redirect_path";

const BLOCKED_PATH_PREFIXES = ["/login", "/reset-password", "/auth", "/signup"];

/**
 * Validates that a redirect path is a safe internal path.
 */
export const isSafeRedirectPath = (path: string): boolean => {
  if (!path.startsWith("/")) {
    return false;
  }

  if (path.startsWith("//")) {
    return false;
  }

  if (/^https?:\/\//i.test(path)) {
    return false;
  }

  return !BLOCKED_PATH_PREFIXES.some(
    (blockedPrefix) => path === blockedPrefix || path.startsWith(`${blockedPrefix}/`)
  );
};

/**
 * Stores the current path as the redirect target.
 * Should be called before redirecting to login.
 */
export const storeRedirectPath = (path: string): void => {
  if (!isSafeRedirectPath(path)) {
    return;
  }

  try {
    sessionStorage.setItem(REDIRECT_PATH_KEY, path);
  } catch (error) {
    console.warn("Failed to store redirect path:", error);
  }
};

/**
 * Retrieves and removes the stored redirect path.
 * Returns null if no path is stored or if it's invalid.
 */
export const getAndClearRedirectPath = (): string | null => {
  try {
    const storedPath = sessionStorage.getItem(REDIRECT_PATH_KEY);
    if (storedPath) {
      sessionStorage.removeItem(REDIRECT_PATH_KEY);
      if (isSafeRedirectPath(storedPath)) {
        return storedPath;
      }
    }
    return null;
  } catch (error) {
    console.warn("Failed to retrieve redirect path:", error);
    return null;
  }
};

/**
 * Clears the stored redirect path without retrieving it.
 */
export const clearRedirectPath = (): void => {
  try {
    sessionStorage.removeItem(REDIRECT_PATH_KEY);
  } catch (error) {
    console.warn("Failed to clear redirect path:", error);
  }
};
