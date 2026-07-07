/**
 * Security headers applied globally via next.config.ts.
 * Exported for tests and documentation parity.
 */
export const SECURITY_HEADERS = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
] as const;

/**
 * Content-Security-Policy.
 *
 * Notes on the chosen policy:
 * - `'unsafe-inline'` is required for scripts (next-themes bootstrap, Next.js
 *   runtime) and styles (Tailwind/Next inline styles). Without per-request
 *   nonce infrastructure this cannot be tightened safely.
 * - `https:` is permitted for scripts/connections so admin-configured
 *   analytics (Plausible/GA4) and Supabase/Sentry keep working.
 * - The real hardening here is `object-src 'none'`, `base-uri 'self'`,
 *   `frame-ancestors 'self'`, `form-action 'self'`, and
 *   `upgrade-insecure-requests`, which mitigate clickjacking, base-tag
 *   injection, plugin embedding, form hijacking, and mixed content.
 * - CMS-authored HTML is additionally sanitized server-side before render.
 *
 * Only applied in production (dev/HMR needs `'unsafe-eval'`).
 */
export const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "form-action 'self'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  "script-src 'self' 'unsafe-inline' https:",
  "connect-src 'self' https:",
  "frame-src 'self' https:",
  "upgrade-insecure-requests",
].join("; ");
