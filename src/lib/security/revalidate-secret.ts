import { createHash, timingSafeEqual } from "node:crypto";

/** Shorter secrets are treated as unset, so a placeholder can't open the endpoint. */
export const MIN_REVALIDATE_SECRET_LENGTH = 32;

export type RevalidateAuth = "ok" | "disabled" | "denied";

/**
 * Checks `Authorization: Bearer <secret>` against CONTENT_REVALIDATE_SECRET.
 * Both sides are hashed first so the comparison is constant time and the
 * same length whatever the caller sends.
 */
export function checkRevalidateAuth(
  authorization: string | null,
  secret: string | undefined,
): RevalidateAuth {
  if (!secret || secret.length < MIN_REVALIDATE_SECRET_LENGTH) return "disabled";
  const match = authorization?.match(/^Bearer (.+)$/);
  if (!match) return "denied";
  const digest = (value: string) => createHash("sha256").update(value).digest();
  return timingSafeEqual(digest(match[1]), digest(secret)) ? "ok" : "denied";
}
