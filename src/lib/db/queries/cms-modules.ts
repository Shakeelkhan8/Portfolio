import { unstable_cache } from "next/cache";
import { createReadClient } from "@/lib/supabase/read-client";
import { isSupabaseConfigured } from "@/lib/env";
import { CACHE_TAGS } from "@/lib/db/cache-tags";
import {
  getFallbackCertifications,
  getFallbackServices,
  getFallbackTestimonials,
} from "@/lib/db/fallback/cms-modules";
import {
  mapCertification,
  mapResumeVersion,
  mapService,
  mapTestimonial,
} from "@/lib/db/mappers/cms-modules";
import type {
  CertificationRecord,
  ResumeVersionRecord,
  ServiceRecord,
  TestimonialRecord,
} from "@/types/cms";

async function resolveMediaUrls(ids: Array<string | null>) {
  const uniqueIds = [...new Set(ids.filter(Boolean))] as string[];
  if (!uniqueIds.length) {
    return new Map<string, string>();
  }

  const supabase = createReadClient();
  const { data } = await supabase
    .from("media_files")
    .select("id, public_url")
    .in("id", uniqueIds);

  return new Map((data ?? []).map((file) => [file.id, file.public_url]));
}

async function fetchCertificationsFromDb(): Promise<CertificationRecord[] | null> {
  const supabase = createReadClient();
  const { data, error } = await supabase
    .from("certifications")
    .select("*")
    .eq("visible", true)
    .order("display_order", { ascending: true });

  if (error || !data) {
    return null;
  }

  const mediaMap = await resolveMediaUrls(data.map((row) => row.image_media_id));
  return data.map((row) =>
    mapCertification(row, mediaMap.get(row.image_media_id ?? "") ?? null),
  );
}

export const getCertifications = unstable_cache(
  async (): Promise<CertificationRecord[]> => {
    if (!isSupabaseConfigured()) {
      return getFallbackCertifications();
    }

    try {
      const rows = await fetchCertificationsFromDb();
      return rows ?? getFallbackCertifications();
    } catch {
      return getFallbackCertifications();
    }
  },
  ["cms-certifications"],
  { tags: [CACHE_TAGS.certifications] },
);

async function fetchTestimonialsFromDb(): Promise<TestimonialRecord[] | null> {
  const supabase = createReadClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("visible", true)
    .order("display_order", { ascending: true });

  if (error || !data) {
    return null;
  }

  const mediaMap = await resolveMediaUrls(data.map((row) => row.avatar_media_id));
  return data.map((row) =>
    mapTestimonial(row, mediaMap.get(row.avatar_media_id ?? "") ?? null),
  );
}

export const getTestimonials = unstable_cache(
  async (): Promise<TestimonialRecord[]> => {
    if (!isSupabaseConfigured()) {
      return getFallbackTestimonials();
    }

    try {
      const rows = await fetchTestimonialsFromDb();
      return rows ?? getFallbackTestimonials();
    } catch {
      return getFallbackTestimonials();
    }
  },
  ["cms-testimonials"],
  { tags: [CACHE_TAGS.testimonials] },
);

export async function getFeaturedTestimonials(
  limit = 3,
): Promise<TestimonialRecord[]> {
  const testimonials = await getTestimonials();
  return testimonials.filter((item) => item.featured).slice(0, limit);
}

async function fetchServicesFromDb(): Promise<ServiceRecord[] | null> {
  const supabase = createReadClient();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("visible", true)
    .order("display_order", { ascending: true });

  if (error || !data) {
    return null;
  }

  return data.map(mapService);
}

export const getServices = unstable_cache(
  async (): Promise<ServiceRecord[]> => {
    if (!isSupabaseConfigured()) {
      return getFallbackServices();
    }

    try {
      const rows = await fetchServicesFromDb();
      return rows ?? getFallbackServices();
    } catch {
      return getFallbackServices();
    }
  },
  ["cms-services"],
  { tags: [CACHE_TAGS.services] },
);

async function fetchActiveResumeFromDb(): Promise<ResumeVersionRecord | null> {
  const supabase = createReadClient();
  const { data, error } = await supabase
    .from("resume_versions")
    .select("id, title, file_media_id, is_active, display_order, uploaded_at")
    .eq("is_active", true)
    .order("display_order", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  const { data: media, error: mediaError } = await supabase
    .from("media_files")
    .select("public_url, original_filename")
    .eq("id", data.file_media_id)
    .maybeSingle();

  if (mediaError || !media) {
    return null;
  }

  return mapResumeVersion(data, media);
}

export const getActiveResumeVersion = unstable_cache(
  async (): Promise<ResumeVersionRecord | null> => {
    if (!isSupabaseConfigured()) {
      return null;
    }

    try {
      return await fetchActiveResumeFromDb();
    } catch {
      return null;
    }
  },
  ["cms-active-resume"],
  { tags: [CACHE_TAGS.resume] },
);

export async function getResumeVersions(): Promise<ResumeVersionRecord[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = createReadClient();
  const { data, error } = await supabase
    .from("resume_versions")
    .select("id, title, file_media_id, is_active, display_order, uploaded_at")
    .order("display_order", { ascending: true });

  if (error || !data?.length) {
    return [];
  }

  const mediaMap = await resolveMediaUrls(data.map((row) => row.file_media_id));
  const fileNames = new Map<string, string>();

  if (mediaMap.size) {
    const { data: files } = await supabase
      .from("media_files")
      .select("id, original_filename")
      .in("id", [...mediaMap.keys()]);

    for (const file of files ?? []) {
      fileNames.set(file.id, file.original_filename);
    }
  }

  return data
    .map((row) => {
      const url = mediaMap.get(row.file_media_id);
      const fileName = fileNames.get(row.file_media_id);
      if (!url || !fileName) {
        return null;
      }

      return mapResumeVersion(row, {
        public_url: url,
        original_filename: fileName,
      });
    })
    .filter((row): row is ResumeVersionRecord => row !== null);
}
