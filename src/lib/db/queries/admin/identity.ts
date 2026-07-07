import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import type {
  ExpertiseItemRecord,
  LanguageRecord,
  PhilosophyItemRecord,
  SocialLinkRecord,
} from "@/types/cms";

export async function getExpertiseItemRecords(): Promise<ExpertiseItemRecord[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("expertise_items")
    .select("id, title, display_order")
    .order("display_order", { ascending: true });

  if (error || !data) {
    return [];
  }

  return data.map((row) => ({
    id: row.id,
    title: row.title,
    displayOrder: row.display_order,
  }));
}

export async function getPhilosophyItemRecords(): Promise<
  PhilosophyItemRecord[]
> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("philosophy_items")
    .select("id, title, description, display_order")
    .order("display_order", { ascending: true });

  if (error || !data) {
    return [];
  }

  return data.map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    displayOrder: row.display_order,
  }));
}

export async function getLanguageRecords(): Promise<LanguageRecord[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("languages")
    .select("id, name, level, display_order")
    .order("display_order", { ascending: true });

  if (error || !data) {
    return [];
  }

  return data.map((row) => ({
    id: row.id,
    name: row.name,
    level: row.level,
    displayOrder: row.display_order,
  }));
}

export async function getSocialLinkRecords(): Promise<SocialLinkRecord[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("social_links")
    .select("id, platform, label, url, icon, display_order, visible")
    .order("display_order", { ascending: true });

  if (error || !data) {
    return [];
  }

  return data.map((row) => ({
    id: row.id,
    platform: row.platform,
    label: row.label,
    url: row.url,
    icon: row.icon,
    displayOrder: row.display_order,
    visible: row.visible,
  }));
}
