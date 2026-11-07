import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";
import { withSentryConfig } from "@sentry/nextjs";
import { PHASE_PRODUCTION_BUILD } from "next/constants";
import { assertProductionSecurityEnv } from "@/lib/env";
import {
  CONTENT_SECURITY_POLICY,
  SECURITY_HEADERS,
} from "@/lib/security/headers";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const securityHeaders = [
  ...SECURITY_HEADERS,
  ...(process.env.NODE_ENV === "production"
    ? [{ key: "Content-Security-Policy", value: CONTENT_SECURITY_POLICY }]
    : []),
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      {
        source: "/favicon.ico",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

const analyzedConfig = withBundleAnalyzer(nextConfig);

const sentryOrg = process.env.SENTRY_ORG;
const sentryProject = process.env.SENTRY_PROJECT;
const sentryAuthToken = process.env.SENTRY_AUTH_TOKEN;

const resolvedConfig =
  sentryOrg && sentryProject && sentryAuthToken
    ? withSentryConfig(analyzedConfig, {
        org: sentryOrg,
        project: sentryProject,
        authToken: sentryAuthToken,
        silent: !process.env.CI,
        tunnelRoute: "/monitoring",
        widenClientFileUpload: true,
      })
    : analyzedConfig;

/**
 * Production env is checked while building, not at server boot: a bad env then
 * fails the deploy and Vercel keeps serving the last good one, instead of every
 * server-rendered route returning 500. See assertProductionSecurityEnv().
 */
export default function config(phase: string): NextConfig {
  if (phase === PHASE_PRODUCTION_BUILD) {
    assertProductionSecurityEnv();
  }

  return resolvedConfig;
}
