import { unstable_cache } from "next/cache";
import { createReadClient } from "@/lib/supabase/read-client";
import { isSupabaseConfigured } from "@/lib/env";
import { CACHE_TAGS } from "@/lib/db/cache-tags";
import type { PortfolioQrConfig } from "@/types/cms";

const DEFAULT_LABEL = "Scan to view on your phone";

async function fetchPortfolioQrFromDb(): Promise<PortfolioQrConfig | null> {
  const supabase = createReadClient();
  const { data: site, error } = await supabase
    .from("site_settings")
    .select("qr_code_media_id, qr_target_url, qr_label, qr_enabled")
    .limit(1)
    .maybeSingle();

  if (error || !site || !site.qr_enabled || !site.qr_code_media_id) {
    return null;
  }

  const { data: media } = await supabase
    .from("media_files")
    .select("id, public_url, mime_type")
    .eq("id", site.qr_code_media_id)
    .maybeSingle();

  if (!media?.public_url) {
    return null;
  }

  const mime = media.mime_type ?? "";
  if (!mime.startsWith("image/")) {
    return null;
  }

  return {
    imageUrl: media.public_url,
    targetUrl: site.qr_target_url,
    label: site.qr_label?.trim() || DEFAULT_LABEL,
    mediaId: media.id,
  };
}

export const getPortfolioQr = unstable_cache(
  async (): Promise<PortfolioQrConfig | null> => {
    if (!isSupabaseConfigured()) {
      return null;
    }

    try {
      return await fetchPortfolioQrFromDb();
    } catch {
      return null;
    }
  },
  ["cms-portfolio-qr"],
  { tags: [CACHE_TAGS.site, CACHE_TAGS.media] },
);

export type AdminPortfolioQrData = {
  siteSettingsId: string;
  mediaId: string | null;
  imageUrl: string | null;
  targetUrl: string;
  label: string;
  enabled: boolean;
};

export async function getAdminPortfolioQrData(): Promise<AdminPortfolioQrData | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data: site, error } = await supabase
    .from("site_settings")
    .select("id, qr_code_media_id, qr_target_url, qr_label, qr_enabled")
    .limit(1)
    .maybeSingle();

  if (error || !site) {
    return null;
  }

  let imageUrl: string | null = null;
  if (site.qr_code_media_id) {
    const { data: media } = await supabase
      .from("media_files")
      .select("public_url")
      .eq("id", site.qr_code_media_id)
      .maybeSingle();
    imageUrl = media?.public_url ?? null;
  }

  return {
    siteSettingsId: site.id,
    mediaId: site.qr_code_media_id,
    imageUrl,
    targetUrl: site.qr_target_url ?? "",
    label: site.qr_label?.trim() || DEFAULT_LABEL,
    enabled: site.qr_enabled,
  };
}
