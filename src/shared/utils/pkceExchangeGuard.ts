const EXCHANGED_CODE_PREFIX = "auth_exchanged_code:";

/**
 * Guards against exchanging the same OAuth PKCE code twice (e.g. React Strict Mode).
 * Returns true when the code should be exchanged, false when already handled.
 */
export const shouldExchangeCode = (code: string): boolean => {
  const key = `${EXCHANGED_CODE_PREFIX}${code}`;
  try {
    if (sessionStorage.getItem(key)) {
      return false;
    }
    sessionStorage.setItem(key, "1");
    return true;
  } catch {
    return true;
  }
};
