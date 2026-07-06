import type {
  AnalyticsSettingsRecord,
  CustomScriptRecord,
  GitHubSettingsRecord,
  PageRecord,
  SeoDefaultsRecord,
  ThemeSettingsRecord,
} from "@/types/cms";

export function mapSeoDefaults(row: {
  id: string;
  default_title: string;
  default_description: string;
  default_og_image_id: string | null;
  default_robots: string;
  twitter_card_type: string;
  ogImageUrl?: string | null;
}): SeoDefaultsRecord {
  return {
    id: row.id,
    defaultTitle: row.default_title,
    defaultDescription: row.default_description,
    defaultOgImageId: row.default_og_image_id,
    defaultOgImageUrl: row.ogImageUrl ?? null,
    defaultRobots: row.default_robots,
    twitterCardType: row.twitter_card_type,
  };
}

export function mapThemeSettings(row: {
  id: string;
  logo_media_id: string | null;
  favicon_media_id: string | null;
  primary_color: string;
  accent_color: string | null;
  background_color: string | null;
  foreground_color: string | null;
  font_heading: string;
  font_body: string;
  font_mono: string;
  custom_css: string | null;
}): ThemeSettingsRecord {
  return {
    id: row.id,
    logoMediaId: row.logo_media_id,
    faviconMediaId: row.favicon_media_id,
    primaryColor: row.primary_color,
    accentColor: row.accent_color,
    backgroundColor: row.background_color,
    foregroundColor: row.foreground_color,
    fontHeading: row.font_heading,
    fontBody: row.font_body,
    fontMono: row.font_mono,
    customCss: row.custom_css,
  };
}

export function mapAnalyticsSettings(row: {
  id: string;
  plausible_domain: string | null;
  plausible_enabled: boolean;
  ga4_measurement_id: string | null;
  ga4_enabled: boolean;
}): AnalyticsSettingsRecord {
  return {
    id: row.id,
    plausibleDomain: row.plausible_domain,
    plausibleEnabled: row.plausible_enabled,
    ga4MeasurementId: row.ga4_measurement_id,
    ga4Enabled: row.ga4_enabled,
  };
}

export function mapCustomScript(row: {
  id: string;
  name: string;
  script_content: string;
  placement: CustomScriptRecord["placement"];
  enabled: boolean;
}): CustomScriptRecord {
  return {
    id: row.id,
    name: row.name,
    scriptContent: row.script_content,
    placement: row.placement,
    enabled: row.enabled,
  };
}

export function mapGitHubSettings(row: {
  id: string;
  username: string;
  show_live_stats: boolean;
}): GitHubSettingsRecord {
  return {
    id: row.id,
    username: row.username,
    showLiveStats: row.show_live_stats,
  };
}

export function mapPageRecord(
  row: {
    id: string;
    slug: string;
    title: string;
    content_html: string | null;
    status: PageRecord["status"];
    meta_title: string | null;
    meta_description: string | null;
    og_image_id: string | null;
    canonical_url: string | null;
    robots: string | null;
    published_at: string | null;
    updated_at: string;
  },
  ogImageUrl?: string | null,
): PageRecord {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    contentHtml: row.content_html,
    status: row.status,
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
    ogImageId: row.og_image_id,
    ogImageUrl: ogImageUrl ?? null,
    canonicalUrl: row.canonical_url,
    robots: row.robots,
    publishedAt: row.published_at,
    updatedAt: row.updated_at,
  };
}
