/**
 * Validates that a browser-originated API request comes from the configured site.
 * Non-browser requests without Origin/Referer are rejected in production.
 */
export function isTrustedSiteRequest(
  request: Request,
  siteUrl: string,
  options?: { requireOriginInProduction?: boolean },
): boolean {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const requireOrigin =
    options?.requireOriginInProduction ?? process.env.NODE_ENV === "production";

  if (!origin && !referer) {
    return !requireOrigin;
  }

  let allowedOrigin: string;

  try {
    allowedOrigin = new URL(siteUrl).origin;
  } catch {
    return false;
  }

  const candidates = [origin, referer].filter(
    (value): value is string => Boolean(value),
  );

  return candidates.some((value) => {
    try {
      return new URL(value).origin === allowedOrigin;
    } catch {
      return false;
    }
  });
}
