import { unstable_cache } from "next/cache";
import { createReadClient } from "@/lib/supabase/read-client";
import { isSupabaseConfigured } from "@/lib/env";
import { CACHE_TAGS } from "@/lib/db/cache-tags";
import {
  getFallbackAchievements,
  getFallbackEducation,
  getFallbackExperience,
} from "@/lib/db/fallback";
import { toIsoMonth } from "@/lib/db/mappers/site";
import type {
  AchievementRecord,
  EducationRecord,
  ExperienceRecord,
} from "@/types/cms";
import type { Education, ExperienceEntry } from "@/types";

async function fetchExperienceFromDb(): Promise<ExperienceRecord[] | null> {
  const supabase = createReadClient();

  const { data: experiences, error } = await supabase
    .from("experiences")
    .select(
      "id, legacy_id, company, role, location, start_date, end_date, description, featured, display_order",
    )
    .order("display_order", { ascending: true });

  if (error || !experiences?.length) {
    return null;
  }

  const [highlightsResult, technologiesResult] = await Promise.all([
    supabase
      .from("experience_highlights")
      .select("experience_id, text, display_order")
      .order("display_order", { ascending: true }),
    supabase
      .from("experience_technologies")
      .select("experience_id, technology, display_order")
      .order("display_order", { ascending: true }),
  ]);

  return experiences.map((experience) => ({
    id: experience.id,
    legacyId: experience.legacy_id,
    company: experience.company,
    role: experience.role,
    location: experience.location,
    startDate: toIsoMonth(experience.start_date) ?? experience.start_date,
    endDate: toIsoMonth(experience.end_date),
    description: experience.description,
    featured: experience.featured,
    displayOrder: experience.display_order,
    highlights: (highlightsResult.data ?? [])
      .filter((item) => item.experience_id === experience.id)
      .map((item) => item.text),
    technologies: (technologiesResult.data ?? [])
      .filter((item) => item.experience_id === experience.id)
      .map((item) => item.technology),
  }));
}

export const getExperienceRecords = unstable_cache(
  async (): Promise<ExperienceRecord[]> => {
    if (!isSupabaseConfigured()) {
      return getFallbackExperience();
    }

    try {
      const records = await fetchExperienceFromDb();
      return records ?? getFallbackExperience();
    } catch {
      return getFallbackExperience();
    }
  },
  ["cms-experience-records"],
  { tags: [CACHE_TAGS.experience] },
);

export async function getExperience(): Promise<ExperienceEntry[]> {
  const records = await getExperienceRecords();
  return records.map((record) => ({
    id: record.legacyId ?? record.id,
    role: record.role,
    company: record.company,
    location: record.location,
    startDate: record.startDate,
    endDate: record.endDate,
    highlights: record.highlights,
    featured: record.featured,
  }));
}

export async function getFeaturedExperience(): Promise<ExperienceEntry | undefined> {
  const experience = await getExperience();
  return experience.find((entry) => entry.featured) ?? experience[0];
}

async function fetchEducationFromDb(): Promise<EducationRecord[] | null> {
  const supabase = createReadClient();

  const { data: educations, error } = await supabase
    .from("educations")
    .select(
      "id, institution, degree, location, start_date, end_date, description, display_order",
    )
    .order("display_order", { ascending: true });

  if (error || !educations?.length) {
    return null;
  }

  const { data: achievements } = await supabase
    .from("education_achievements")
    .select("education_id, text, display_order")
    .order("display_order", { ascending: true });

  return educations.map((education) => ({
    id: education.id,
    institution: education.institution,
    degree: education.degree,
    location: education.location,
    startDate: toIsoMonth(education.start_date) ?? education.start_date,
    endDate: toIsoMonth(education.end_date),
    description: education.description,
    displayOrder: education.display_order,
    achievements: (achievements ?? [])
      .filter((item) => item.education_id === education.id)
      .map((item) => item.text),
  }));
}

export const getEducationRecords = unstable_cache(
  async (): Promise<EducationRecord[]> => {
    if (!isSupabaseConfigured()) {
      return getFallbackEducation();
    }

    try {
      const records = await fetchEducationFromDb();
      return records ?? getFallbackEducation();
    } catch {
      return getFallbackEducation();
    }
  },
  ["cms-education-records"],
  { tags: [CACHE_TAGS.education] },
);

export async function getPrimaryEducation(): Promise<Education> {
  const records = await getEducationRecords();
  const primary = records[0];

  if (!primary) {
    const fallback = getFallbackEducation()[0];
    return {
      degree: fallback.degree,
      institution: fallback.institution,
      location: fallback.location,
      startDate: fallback.startDate,
      endDate: fallback.endDate ?? "",
    };
  }

  return {
    degree: primary.degree,
    institution: primary.institution,
    location: primary.location,
    startDate: primary.startDate,
    endDate: primary.endDate ?? "",
  };
}

async function fetchAchievementsFromDb(): Promise<AchievementRecord[] | null> {
  const supabase = createReadClient();
  const { data, error } = await supabase
    .from("achievements")
    .select("id, text, featured, display_order")
    .order("display_order", { ascending: true });

  if (error || !data?.length) {
    return null;
  }

  return data.map((item) => ({
    id: item.id,
    text: item.text,
    featured: item.featured,
    displayOrder: item.display_order,
  }));
}

export const getAchievements = unstable_cache(
  async (): Promise<AchievementRecord[]> => {
    if (!isSupabaseConfigured()) {
      return getFallbackAchievements();
    }

    try {
      const records = await fetchAchievementsFromDb();
      return records ?? getFallbackAchievements();
    } catch {
      return getFallbackAchievements();
    }
  },
  ["cms-achievements"],
  { tags: [CACHE_TAGS.achievements] },
);

export async function getResumeSummary(): Promise<string> {
  const { getSiteConfig } = await import("@/lib/db/queries/site");
  const site = await getSiteConfig();
  return site.resumeSummary;
}
