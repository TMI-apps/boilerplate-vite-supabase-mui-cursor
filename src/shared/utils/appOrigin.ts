/**
 * Returns the application origin including router basename when deployed under a subpath.
 */
export const getAppOrigin = (): string => {
  const base = import.meta.env.BASE_URL || "/";
  const normalizedBase = base.endsWith("/") ? base.slice(0, -1) : base;
  if (!normalizedBase || normalizedBase === "/") {
    return window.location.origin;
  }
  return `${window.location.origin}${normalizedBase}`;
};

/**
 * Builds an absolute URL for an internal app path.
 */
export const getAppUrl = (path: string): string => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getAppOrigin()}${normalizedPath}`;
};
