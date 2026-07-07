import { unstable_cache } from "next/cache";
import { createReadClient } from "@/lib/supabase/read-client";
import { isSupabaseConfigured } from "@/lib/env";
import { CACHE_TAGS } from "@/lib/db/cache-tags";
import {
  getFallbackAboutContent,
  getFallbackSkillCategories,
} from "@/lib/db/fallback";
import type { AboutContent, SkillCategoryRecord } from "@/types/cms";
import type { SkillGroup } from "@/types";

function mapToSkillGroups(categories: SkillCategoryRecord[]): SkillGroup[] {
  return categories.map((category) => ({
    category: category.name,
    skills: category.skills
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map((skill) => skill.name),
  }));
}

async function fetchSkillCategoriesFromDb(): Promise<SkillCategoryRecord[] | null> {
  const supabase = createReadClient();

  const { data: categories, error } = await supabase
    .from("skill_categories")
    .select("id, name, slug, display_order")
    .order("display_order", { ascending: true });

  if (error || !categories?.length) {
    return null;
  }

  const { data: skills, error: skillsError } = await supabase
    .from("skills")
    .select("id, category_id, name, icon, level, display_order")
    .order("display_order", { ascending: true });

  if (skillsError) {
    return null;
  }

  return categories.map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    displayOrder: category.display_order,
    skills: (skills ?? [])
      .filter((skill) => skill.category_id === category.id)
      .map((skill) => ({
        id: skill.id,
        name: skill.name,
        icon: skill.icon,
        level: skill.level,
        displayOrder: skill.display_order,
      })),
  }));
}

export const getSkillCategories = unstable_cache(
  async (): Promise<SkillCategoryRecord[]> => {
    if (!isSupabaseConfigured()) {
      return getFallbackSkillCategories();
    }

    try {
      const categories = await fetchSkillCategoriesFromDb();
      return categories ?? getFallbackSkillCategories();
    } catch {
      return getFallbackSkillCategories();
    }
  },
  ["cms-skill-categories"],
  { tags: [CACHE_TAGS.skills] },
);

export async function getSkillGroups(): Promise<SkillGroup[]> {
  const categories = await getSkillCategories();
  return mapToSkillGroups(categories);
}

export const getAboutContent = unstable_cache(
  async (): Promise<AboutContent> => {
    if (!isSupabaseConfigured()) {
      return getFallbackAboutContent();
    }

    try {
      const supabase = createReadClient();
      const { data, error } = await supabase
        .from("about_paragraphs")
        .select("content")
        .order("display_order", { ascending: true });

      if (error || !data?.length) {
        return getFallbackAboutContent();
      }

      return { paragraphs: data.map((row) => row.content) };
    } catch {
      return getFallbackAboutContent();
    }
  },
  ["cms-about-content"],
  { tags: [CACHE_TAGS.site] },
);
