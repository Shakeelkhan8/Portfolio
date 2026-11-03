import { siteConfig } from "@/config/site";
import type {
  AnalyticsSettingsRecord,
  GitHubSettingsRecord,
  PageRecord,
  SeoDefaultsRecord,
  ThemeSettingsRecord,
} from "@/types/cms";

/** ~60 characters: name first for branded searches, then the role people search for. */
export const DEFAULT_SEO_TITLE = `${siteConfig.name} | Laravel Backend Developer (Payments, APIs, AI)`;

/** Under 160 characters so search results show it whole. */
export const DEFAULT_SEO_DESCRIPTION =
  "Laravel backend developer: payment gateways and webhooks, AI features, APIs, upgrades and store sync. Open to remote roles and project work.";

export function getFallbackSeoDefaults(): SeoDefaultsRecord {
  return {
    id: "fallback-seo",
    defaultTitle: DEFAULT_SEO_TITLE,
    defaultDescription: DEFAULT_SEO_DESCRIPTION,
    defaultOgImageId: null,
    defaultOgImageUrl: null,
    defaultRobots: "index, follow",
    twitterCardType: "summary_large_image",
  };
}

export function getFallbackThemeSettings(): ThemeSettingsRecord {
  return {
    id: "fallback-theme",
    logoMediaId: null,
    faviconMediaId: null,
    primaryColor: "#111111",
    accentColor: "#2563eb",
    backgroundColor: "#fafafa",
    foregroundColor: "#171717",
    fontHeading: "Geist",
    fontBody: "Geist",
    fontMono: "Geist Mono",
    customCss: null,
  };
}

export function getFallbackAnalyticsSettings(): AnalyticsSettingsRecord {
  const envDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN?.trim();

  return {
    id: "fallback-analytics",
    plausibleDomain: envDomain || null,
    plausibleEnabled: Boolean(envDomain),
    ga4MeasurementId: null,
    ga4Enabled: false,
  };
}

export function getFallbackGitHubSettings(): GitHubSettingsRecord {
  return {
    id: "fallback-github",
    username: siteConfig.githubUsername,
    showLiveStats: true,
  };
}

export function getFallbackPrivacyPage(): PageRecord {
  return {
    id: "fallback-privacy",
    slug: "privacy",
    title: "Privacy Policy",
    contentHtml: `
      <h2>Overview</h2>
      <p>This privacy policy explains how ${siteConfig.name} ("I", "me") handles information when you visit this portfolio website at ${siteConfig.url}.</p>
      <h2>Information I Collect</h2>
      <p>If you use the contact form, I collect your name, email address, and message content solely to respond to your inquiry. I do not sell or share this information with third parties.</p>
      <h2>Contact Form</h2>
      <p>Contact form submissions are stored securely in the site database and may also be delivered to my email inbox via Resend so I can respond quickly.</p>
      <h2>Analytics</h2>
      <p>This site may use Plausible Analytics, a privacy-focused and cookieless analytics service. Plausible does not use cookies and does not collect personal data for advertising. Analytics are only enabled when configured for production deployment.</p>
      <h2>Error Monitoring</h2>
      <p>Error monitoring may be provided by Sentry to help diagnose production issues. When enabled, Sentry may collect error details, browser information, and session replays around errors.</p>
      <h2>Cookies</h2>
      <p>This site does not set cookies or store preferences in your browser. Light and dark mode follow your device settings.</p>
      <h2>Contact</h2>
      <p>Questions about this policy? Email <a href="mailto:${siteConfig.email}">${siteConfig.email}</a>.</p>
    `.trim(),
    status: "published",
    metaTitle: "Privacy Policy",
    metaDescription: "Privacy policy for this portfolio website.",
    ogImageId: null,
    ogImageUrl: null,
    canonicalUrl: null,
    robots: null,
    publishedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
