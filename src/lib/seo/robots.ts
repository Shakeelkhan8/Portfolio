import type { Metadata } from "next";

/**
 * Parses a robots meta directive string (e.g. "index, follow" or "noindex, nofollow")
 * into Next.js Metadata robots configuration aligned with Googlebot guidance.
 */
export function parseRobotsDirective(
  directive?: string | null,
): Metadata["robots"] | undefined {
  if (!directive?.trim()) {
    return undefined;
  }

  const normalized = directive.toLowerCase();
  const index = !normalized.includes("noindex");
  const follow = !normalized.includes("nofollow");
  const noarchive = normalized.includes("noarchive");
  const nosnippet = normalized.includes("nosnippet");

  return {
    index,
    follow,
    ...(noarchive ? { noarchive: true } : {}),
    ...(nosnippet ? { nosnippet: true } : {}),
    googleBot: {
      index,
      follow,
      ...(noarchive ? { noarchive: true } : {}),
      ...(nosnippet ? { nosnippet: true } : {}),
      "max-image-preview": "large",
      "max-snippet": nosnippet ? 0 : -1,
      "max-video-preview": -1,
    },
  };
}
