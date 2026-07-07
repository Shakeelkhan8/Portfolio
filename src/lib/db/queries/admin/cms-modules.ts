import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
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
    return new Map<string, { url: string; name: string }>();
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("media_files")
    .select("id, public_url, original_filename")
    .in("id", uniqueIds);

  return new Map(
    (data ?? []).map((file) => [
      file.id,
      { url: file.public_url, name: file.original_filename },
    ]),
  );
}

export async function getCertificationRecords(): Promise<CertificationRecord[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("certifications")
    .select("*")
    .order("display_order", { ascending: true });

  if (error || !data) {
    return [];
  }

  const mediaMap = await resolveMediaUrls(data.map((row) => row.image_media_id));
  return data.map((row) =>
    mapCertification(
      row,
      mediaMap.get(row.image_media_id ?? "")?.url ?? null,
    ),
  );
}

export async function getTestimonialRecords(): Promise<TestimonialRecord[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .order("display_order", { ascending: true });

  if (error || !data) {
    return [];
  }

  const mediaMap = await resolveMediaUrls(data.map((row) => row.avatar_media_id));
  return data.map((row) =>
    mapTestimonial(
      row,
      mediaMap.get(row.avatar_media_id ?? "")?.url ?? null,
    ),
  );
}

export async function getServiceRecords(): Promise<ServiceRecord[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("display_order", { ascending: true });

  if (error || !data) {
    return [];
  }

  return data.map(mapService);
}

export async function getResumeVersionRecords(): Promise<ResumeVersionRecord[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("resume_versions")
    .select("id, title, file_media_id, is_active, display_order, uploaded_at")
    .order("display_order", { ascending: true });

  if (error || !data?.length) {
    return [];
  }

  const mediaMap = await resolveMediaUrls(data.map((row) => row.file_media_id));

  return data
    .map((row) => {
      const media = mediaMap.get(row.file_media_id);
      if (!media) {
        return null;
      }

      return mapResumeVersion(row, {
        public_url: media.url,
        original_filename: media.name,
      });
    })
    .filter((row): row is ResumeVersionRecord => row !== null);
}
