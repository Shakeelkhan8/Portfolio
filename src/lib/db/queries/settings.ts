import { unstable_cache } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { CACHE_TAGS } from "@/lib/db/cache-tags";
import {
  getFallbackAnalyticsSettings,
  getFallbackGitHubSettings,
  getFallbackSeoDefaults,
  getFallbackThemeSettings,
} from "@/lib/db/fallback/settings";
import {
  mapAnalyticsSettings,
  mapCustomScript,
  mapGitHubSettings,
  mapSeoDefaults,
  mapThemeSettings,
} from "@/lib/db/mappers/settings";
import type {
  AnalyticsSettingsRecord,
  CustomScriptRecord,
  GitHubSettingsRecord,
  SeoDefaultsRecord,
  SiteConfig,
  ThemeSettingsRecord,
} from "@/types/cms";

async function resolveMediaUrl(mediaId: string | null) {
  if (!mediaId) {
    return null;
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("media_files")
    .select("public_url")
    .eq("id", mediaId)
    .maybeSingle();

  return data?.public_url ?? null;
}

async function fetchSeoDefaultsFromDb(): Promise<SeoDefaultsRecord | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("seo_defaults")
    .select(
      "id, default_title, default_description, default_og_image_id, default_robots, twitter_card_type",
    )
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  const ogImageUrl = await resolveMediaUrl(data.default_og_image_id);
  return mapSeoDefaults({ ...data, ogImageUrl });
}

export const getSeoDefaults = unstable_cache(
  async (): Promise<SeoDefaultsRecord> => {
    if (!isSupabaseConfigured()) {
      return getFallbackSeoDefaults();
    }

    try {
      const seo = await fetchSeoDefaultsFromDb();
      return seo ?? getFallbackSeoDefaults();
    } catch {
      return getFallbackSeoDefaults();
    }
  },
  ["cms-seo-defaults"],
  { tags: [CACHE_TAGS.site] },
);

async function fetchThemeSettingsFromDb(): Promise<ThemeSettingsRecord | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("theme_settings")
    .select("*")
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return mapThemeSettings(data);
}

export const getThemeSettings = unstable_cache(
  async (): Promise<ThemeSettingsRecord> => {
    if (!isSupabaseConfigured()) {
      return getFallbackThemeSettings();
    }

    try {
      const theme = await fetchThemeSettingsFromDb();
      return theme ?? getFallbackThemeSettings();
    } catch {
      return getFallbackThemeSettings();
    }
  },
  ["cms-theme-settings"],
  { tags: [CACHE_TAGS.site] },
);

async function fetchAnalyticsSettingsFromDb(): Promise<AnalyticsSettingsRecord | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("analytics_settings")
    .select("*")
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return mapAnalyticsSettings(data);
}

export const getAnalyticsSettings = unstable_cache(
  async (): Promise<AnalyticsSettingsRecord> => {
    if (!isSupabaseConfigured()) {
      return getFallbackAnalyticsSettings();
    }

    try {
      const analytics = await fetchAnalyticsSettingsFromDb();
      return analytics ?? getFallbackAnalyticsSettings();
    } catch {
      return getFallbackAnalyticsSettings();
    }
  },
  ["cms-analytics-settings"],
  { tags: [CACHE_TAGS.site] },
);

async function fetchGitHubSettingsFromDb(): Promise<GitHubSettingsRecord | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("github_settings")
    .select("id, username, show_live_stats")
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return mapGitHubSettings(data);
}

export const getGitHubSettings = unstable_cache(
  async (): Promise<GitHubSettingsRecord> => {
    if (!isSupabaseConfigured()) {
      return getFallbackGitHubSettings();
    }

    try {
      const settings = await fetchGitHubSettingsFromDb();
      return settings ?? getFallbackGitHubSettings();
    } catch {
      return getFallbackGitHubSettings();
    }
  },
  ["cms-github-settings"],
  { tags: [CACHE_TAGS.site] },
);

async function fetchCustomScriptsFromDb(
  enabledOnly: boolean,
): Promise<CustomScriptRecord[]> {
  const supabase = await createClient();
  let query = supabase
    .from("custom_scripts")
    .select("id, name, script_content, placement, enabled")
    .order("name", { ascending: true });

  if (enabledOnly) {
    query = query.eq("enabled", true);
  }

  const { data, error } = await query;

  if (error || !data) {
    return [];
  }

  return data.map(mapCustomScript);
}

export const getEnabledCustomScripts = unstable_cache(
  async (): Promise<CustomScriptRecord[]> => {
    if (!isSupabaseConfigured()) {
      return [];
    }

    try {
      return await fetchCustomScriptsFromDb(true);
    } catch {
      return [];
    }
  },
  ["cms-custom-scripts-enabled"],
  { tags: [CACHE_TAGS.site] },
);

export async function getAllCustomScripts(): Promise<CustomScriptRecord[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  try {
    return await fetchCustomScriptsFromDb(false);
  } catch {
    return [];
  }
}

export type SettingsBundle = {
  seo: SeoDefaultsRecord;
  theme: ThemeSettingsRecord;
  analytics: AnalyticsSettingsRecord;
  scripts: CustomScriptRecord[];
};

export async function getSettingsBundle(): Promise<SettingsBundle> {
  const [seo, theme, analytics, scripts] = await Promise.all([
    getSeoDefaults(),
    getThemeSettings(),
    getAnalyticsSettings(),
    getAllCustomScripts(),
  ]);

  return { seo, theme, analytics, scripts };
}

export type AdminSettingsData = {
  site: {
    id: string;
    siteName: string;
    legalName: string;
    tagline: string;
    description: string;
    email: string;
    phone: string;
    location: string;
    city: string;
    timezone: string;
    yearsOfExperience: number;
    copyrightText: string;
    availabilityStatus: SiteConfig["availability"]["status"];
    availabilityMessage: string;
    githubUsername: string;
    resumeSummary: string;
    responseTimeText: string;
    maintenanceEnabled: boolean;
    maintenanceMessage: string;
  };
  seo: SeoDefaultsRecord;
  theme: ThemeSettingsRecord;
  analytics: AnalyticsSettingsRecord;
  github: GitHubSettingsRecord;
  scripts: CustomScriptRecord[];
};

export async function getAdminSettingsData(): Promise<AdminSettingsData | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = await createClient();
  const [
    siteResult,
    seoResult,
    themeResult,
    analyticsResult,
    githubResult,
    scriptsResult,
  ] = await Promise.all([
    supabase.from("site_settings").select("*").limit(1).maybeSingle(),
    supabase.from("seo_defaults").select("*").limit(1).maybeSingle(),
    supabase.from("theme_settings").select("*").limit(1).maybeSingle(),
    supabase.from("analytics_settings").select("*").limit(1).maybeSingle(),
    supabase.from("github_settings").select("*").limit(1).maybeSingle(),
    supabase
      .from("custom_scripts")
      .select("id, name, script_content, placement, enabled")
      .order("name", { ascending: true }),
  ]);

  if (
    !siteResult.data ||
    !seoResult.data ||
    !themeResult.data ||
    !analyticsResult.data ||
    !githubResult.data
  ) {
    return null;
  }

  const ogImageUrl = seoResult.data.default_og_image_id
    ? (
        await supabase
          .from("media_files")
          .select("public_url")
          .eq("id", seoResult.data.default_og_image_id)
          .maybeSingle()
      ).data?.public_url ?? null
    : null;

  return {
    site: {
      id: siteResult.data.id,
      siteName: siteResult.data.site_name,
      legalName: siteResult.data.legal_name,
      tagline: siteResult.data.tagline,
      description: siteResult.data.description,
      email: siteResult.data.email,
      phone: siteResult.data.phone ?? "",
      location: siteResult.data.location,
      city: siteResult.data.city ?? "",
      timezone: siteResult.data.timezone,
      yearsOfExperience: siteResult.data.years_of_experience,
      copyrightText: siteResult.data.copyright_text ?? "",
      availabilityStatus: siteResult.data.availability_status,
      availabilityMessage: siteResult.data.availability_message,
      githubUsername: siteResult.data.github_username ?? "",
      resumeSummary: siteResult.data.resume_summary ?? "",
      responseTimeText: siteResult.data.response_time_text ?? "",
      maintenanceEnabled: siteResult.data.maintenance_enabled,
      maintenanceMessage: siteResult.data.maintenance_message ?? "",
    },
    seo: mapSeoDefaults({ ...seoResult.data, ogImageUrl }),
    theme: mapThemeSettings(themeResult.data),
    analytics: mapAnalyticsSettings(analyticsResult.data),
    github: mapGitHubSettings(githubResult.data),
    scripts: (scriptsResult.data ?? []).map(mapCustomScript),
  };
}
