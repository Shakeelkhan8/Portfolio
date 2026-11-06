import * as Sentry from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn,
  enabled: Boolean(dsn),
  environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  // Replay is added after load (below), not here.
  integrations: [],
});

/**
 * Session Replay is lazy-loaded from Sentry's CDN once the page is idle.
 *
 * Importing `replayIntegration` statically put rrweb into the first-load
 * bundle of every page: a ~165 KB gzipped chunk, the largest script on the
 * site, downloaded even when no DSN is configured. Loading it after idle
 * keeps the same sample rates; the trade-off is that an error in the first
 * second or two of a visit, before the integration arrives, has no replay.
 * The CDN script is allowed by the CSP (`script-src https:`). If it fails to
 * load, error and performance monitoring carry on without Replay.
 */
if (dsn && typeof window !== "undefined") {
  const loadReplay = () => {
    Sentry.lazyLoadIntegration("replayIntegration")
      .then((replayIntegration) => Sentry.addIntegration(replayIntegration()))
      .catch(() => {
        // Ad blockers commonly block the Sentry CDN; monitoring continues.
      });
  };

  const whenIdle = () => {
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(loadReplay, { timeout: 4000 });
    } else {
      setTimeout(loadReplay, 2000);
    }
  };

  if (document.readyState === "complete") whenIdle();
  else window.addEventListener("load", whenIdle, { once: true });
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
