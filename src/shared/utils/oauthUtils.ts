/**
 * Detects if the current page load is returning from an OAuth redirect.
 */
export const isOAuthRedirectInProgress = (): boolean => {
  const url = new URL(window.location.href);
  const searchParams = url.searchParams;
  const hash = url.hash;

  const hasCode = searchParams.has("code");
  const hasError = searchParams.has("error");
  const hasAccessTokenInHash = hash.includes("access_token") || hash.includes("refresh_token");

  return hasCode || hasError || hasAccessTokenInHash;
};

/**
 * Detects a password recovery redirect via hash fragment.
 */
export const isPasswordRecoveryRedirect = (): boolean => {
  const hash = window.location.hash;
  if (!hash) {
    return false;
  }

  const params = new URLSearchParams(hash.startsWith("#") ? hash.slice(1) : hash);
  return params.get("type") === "recovery";
};

/**
 * Cleans up OAuth redirect parameters from URL without logging sensitive data.
 */
export const cleanOAuthRedirectFromUrl = (): void => {
  if (!isOAuthRedirectInProgress()) {
    return;
  }

  const cleanUrl = `${window.location.origin}${window.location.pathname}`;
  window.history.replaceState({}, document.title, cleanUrl);
};
