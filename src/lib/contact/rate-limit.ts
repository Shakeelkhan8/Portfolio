export const CONTACT_RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
export const CONTACT_RATE_LIMIT_MAX = 5;

export function isContactRateLimitExceeded(submissionCount: number): boolean {
  return submissionCount >= CONTACT_RATE_LIMIT_MAX;
}
