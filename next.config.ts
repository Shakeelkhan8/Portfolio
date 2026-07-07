import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";
import { withSentryConfig } from "@sentry/nextjs";
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

const config =
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

export default config;
