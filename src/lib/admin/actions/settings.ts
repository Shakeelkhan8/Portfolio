"use server";

import { revalidateAfterSettingsChange } from "@/lib/db/revalidate";
import { requireAdmin } from "@/lib/admin/require-admin";
import { sanitizeCustomCss } from "@/lib/security/sanitize";
import type { AdminActionState } from "@/lib/validators/content";
import {
  analyticsSettingsSchema,
  customScriptSchema,
  githubSettingsSchema,
  parseOptionalString,
  seoDefaultsSchema,
  siteSettingsSchema,
  themeSettingsSchema,
} from "@/lib/validators/settings";

async function logAdminAction(
  supabase: Awaited<ReturnType<typeof requireAdmin>>["supabase"],
  userId: string,
  action: string,
  entityType: string,
  entityId?: string,
) {
  await supabase.from("audit_logs").insert({
    actor_id: userId,
    action,
    entity_type: entityType,
    entity_id: entityId ?? null,
    metadata_json: {},
  });
}

async function syncIdentityLinks(
  supabase: Awaited<ReturnType<typeof requireAdmin>>["supabase"],
  input: { email: string; githubUsername: string | null },
) {
  await supabase
    .from("social_links")
    .update({ url: `mailto:${input.email}` })
    .eq("platform", "email");

  if (!input.githubUsername) {
    return;
  }

  await Promise.all([
    supabase
      .from("social_links")
      .update({
        url: `https://github.com/${input.githubUsername}`,
      })
      .eq("platform", "github"),
    supabase
      .from("github_settings")
      .update({ username: input.githubUsername })
      .not("id", "is", null),
  ]);
}

export async function upsertSiteSettingsAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const parsed = siteSettingsSchema.safeParse({
    siteName: formData.get("siteName"),
    legalName: formData.get("legalName"),
    tagline: formData.get("tagline"),
    description: formData.get("description"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    location: formData.get("location"),
    city: formData.get("city"),
    timezone: formData.get("timezone"),
    yearsOfExperience: formData.get("yearsOfExperience"),
    copyrightText: formData.get("copyrightText"),
    availabilityStatus: formData.get("availabilityStatus"),
    availabilityMessage: formData.get("availabilityMessage"),
    githubUsername: formData.get("githubUsername"),
    resumeSummary: formData.get("resumeSummary"),
    responseTimeText: formData.get("responseTimeText"),
    maintenanceEnabled: formData.get("maintenanceEnabled") === "on",
    maintenanceMessage: formData.get("maintenanceMessage"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const id = formData.get("id");
  if (typeof id !== "string" || !id) {
    return { error: "Missing site settings id." };
  }

  const { supabase, user } = await requireAdmin();
  const { error } = await supabase
    .from("site_settings")
    .update({
      site_name: parsed.data.siteName,
      legal_name: parsed.data.legalName,
      tagline: parsed.data.tagline,
      description: parsed.data.description,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      location: parsed.data.location,
      city: parsed.data.city || null,
      timezone: parsed.data.timezone,
      years_of_experience: parsed.data.yearsOfExperience,
      copyright_text: parsed.data.copyrightText || null,
      availability_status: parsed.data.availabilityStatus,
      availability_message: parsed.data.availabilityMessage,
      github_username: parsed.data.githubUsername || null,
      resume_summary: parsed.data.resumeSummary || null,
      response_time_text: parsed.data.responseTimeText || null,
      maintenance_enabled: parsed.data.maintenanceEnabled ?? false,
      maintenance_message: parsed.data.maintenanceMessage || null,
    })
    .eq("id", id);

  if (error) return { error: error.message };

  await syncIdentityLinks(supabase, {
    email: parsed.data.email,
    githubUsername: parsed.data.githubUsername ?? null,
  });

  await logAdminAction(supabase, user.id, "update", "site_settings", id);
  revalidateAfterSettingsChange();
  return { success: "Site settings saved." };
}

export async function upsertSeoDefaultsAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const parsed = seoDefaultsSchema.safeParse({
    defaultTitle: formData.get("defaultTitle"),
    defaultDescription: formData.get("defaultDescription"),
    defaultOgImageId: formData.get("defaultOgImageId"),
    defaultRobots: formData.get("defaultRobots"),
    twitterCardType: formData.get("twitterCardType"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const id = formData.get("id");
  if (typeof id !== "string" || !id) {
    return { error: "Missing SEO defaults id." };
  }

  const { supabase, user } = await requireAdmin();
  const { error } = await supabase
    .from("seo_defaults")
    .update({
      default_title: parsed.data.defaultTitle,
      default_description: parsed.data.defaultDescription,
      default_og_image_id: parsed.data.defaultOgImageId ?? null,
      default_robots: parsed.data.defaultRobots,
      twitter_card_type: parsed.data.twitterCardType,
    })
    .eq("id", id);

  if (error) return { error: error.message };

  await logAdminAction(supabase, user.id, "update", "seo_defaults", id);
  revalidateAfterSettingsChange();
  return { success: "SEO defaults saved." };
}

export async function upsertThemeSettingsAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const parsed = themeSettingsSchema.safeParse({
    primaryColor: formData.get("primaryColor"),
    accentColor: formData.get("accentColor"),
    backgroundColor: formData.get("backgroundColor"),
    foregroundColor: formData.get("foregroundColor"),
    fontHeading: formData.get("fontHeading"),
    fontBody: formData.get("fontBody"),
    fontMono: formData.get("fontMono"),
    customCss: formData.get("customCss"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const id = formData.get("id");
  if (typeof id !== "string" || !id) {
    return { error: "Missing theme settings id." };
  }

  const { supabase, user } = await requireAdmin();
  const { error } = await supabase
    .from("theme_settings")
    .update({
      primary_color: parsed.data.primaryColor,
      accent_color: parsed.data.accentColor || null,
      background_color: parsed.data.backgroundColor || null,
      foreground_color: parsed.data.foregroundColor || null,
      font_heading: parsed.data.fontHeading,
      font_body: parsed.data.fontBody,
      font_mono: parsed.data.fontMono,
      custom_css: sanitizeCustomCss(parsed.data.customCss) || null,
    })
    .eq("id", id);

  if (error) return { error: error.message };

  await logAdminAction(supabase, user.id, "update", "theme_settings", id);
  revalidateAfterSettingsChange();
  return { success: "Theme settings saved." };
}

export async function upsertAnalyticsSettingsAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const parsed = analyticsSettingsSchema.safeParse({
    plausibleEnabled: formData.get("plausibleEnabled") === "on",
    plausibleDomain: formData.get("plausibleDomain"),
    ga4Enabled: formData.get("ga4Enabled") === "on",
    ga4MeasurementId: formData.get("ga4MeasurementId"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const id = formData.get("id");
  if (typeof id !== "string" || !id) {
    return { error: "Missing analytics settings id." };
  }

  const { supabase, user } = await requireAdmin();
  const { error } = await supabase
    .from("analytics_settings")
    .update({
      plausible_enabled: parsed.data.plausibleEnabled ?? false,
      plausible_domain: parsed.data.plausibleDomain?.trim() || null,
      ga4_enabled: parsed.data.ga4Enabled ?? false,
      ga4_measurement_id: parsed.data.ga4MeasurementId?.trim() || null,
    })
    .eq("id", id);

  if (error) return { error: error.message };

  await logAdminAction(supabase, user.id, "update", "analytics_settings", id);
  revalidateAfterSettingsChange();
  return { success: "Analytics settings saved." };
}

export async function upsertGitHubSettingsAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const parsed = githubSettingsSchema.safeParse({
    username: formData.get("username"),
    showLiveStats: formData.get("showLiveStats") === "on",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const id = formData.get("id");
  if (typeof id !== "string" || !id) {
    return { error: "Missing GitHub settings id." };
  }

  const { supabase, user } = await requireAdmin();
  const { error } = await supabase
    .from("github_settings")
    .update({
      username: parsed.data.username,
      show_live_stats: parsed.data.showLiveStats ?? true,
    })
    .eq("id", id);

  if (error) return { error: error.message };

  await logAdminAction(supabase, user.id, "update", "github_settings", id);
  revalidateAfterSettingsChange();
  return { success: "GitHub settings saved." };
}

export async function upsertCustomScriptAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const parsed = customScriptSchema.safeParse({
    name: formData.get("name"),
    scriptContent: formData.get("scriptContent"),
    placement: formData.get("placement"),
    enabled: formData.get("enabled") === "on",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const { supabase, user } = await requireAdmin();
  const id = parseOptionalString(formData.get("id"));

  if (id) {
    const { error } = await supabase
      .from("custom_scripts")
      .update({
        name: parsed.data.name,
        script_content: parsed.data.scriptContent,
        placement: parsed.data.placement,
        enabled: parsed.data.enabled ?? false,
      })
      .eq("id", id);

    if (error) return { error: error.message };
    await logAdminAction(supabase, user.id, "update", "custom_script", id);
  } else {
    const { data, error } = await supabase
      .from("custom_scripts")
      .insert({
        name: parsed.data.name,
        script_content: parsed.data.scriptContent,
        placement: parsed.data.placement,
        enabled: parsed.data.enabled ?? false,
      })
      .select("id")
      .single();

    if (error) return { error: error.message };
    await logAdminAction(supabase, user.id, "create", "custom_script", data.id);
  }

  revalidateAfterSettingsChange();
  return { success: "Custom script saved." };
}

export async function deleteCustomScriptAction(formData: FormData) {
  const id = formData.get("id");
  if (typeof id !== "string" || !id) {
    return { error: "Missing script id." };
  }

  const { supabase, user } = await requireAdmin();
  const { error } = await supabase.from("custom_scripts").delete().eq("id", id);

  if (error) return { error: error.message };

  await logAdminAction(supabase, user.id, "delete", "custom_script", id);
  revalidateAfterSettingsChange();
  return { success: "Custom script deleted." };
}
