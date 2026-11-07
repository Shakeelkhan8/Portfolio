import * as Sentry from "@sentry/nextjs";
import { getProductionSecurityEnvErrors } from "@/lib/env";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // Log, never throw: a throw here takes down every server-rendered route.
    // The build-time check in next.config.ts is what blocks a bad deploy.
    const envErrors = getProductionSecurityEnvErrors();
    if (envErrors.length) {
      console.error(
        `[env] Production security env check failed:\n- ${envErrors.join("\n- ")}`,
      );
    }

    await import("../sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("../sentry.edge.config");
  }
}

export const onRequestError = Sentry.captureRequestError;
