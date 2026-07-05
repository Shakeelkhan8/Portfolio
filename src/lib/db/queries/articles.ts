import { unstable_cache } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { CACHE_TAGS } from "@/lib/db/cache-tags";
import { articles as fallbackArticles } from "@/content/writing";
import { mapArticle } from "@/lib/db/mappers/content";
import type { Article } from "@/types";

async function fetchArticlesFromDb(): Promise<Article[] | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("articles")
    .select(
      "id, slug, title, excerpt, content_html, published_at, reading_time_minutes",
    )
    .eq("status", "published")
    .is("deleted_at", null)
    .order("published_at", { ascending: false });

  if (error || !data?.length) {
    return null;
  }

  const { data: tags, error: tagsError } = await supabase
    .from("article_tags")
    .select("article_id, tag, display_order")
    .order("display_order", { ascending: true });

  if (tagsError) {
    return null;
  }

  return data.map((row) =>
    mapArticle({
      slug: row.slug,
      title: row.title,
      excerpt: row.excerpt,
      content_html: row.content_html,
      published_at: row.published_at,
      reading_time_minutes: row.reading_time_minutes,
      tags: (tags ?? [])
        .filter((tag) => tag.article_id === row.id)
        .map((tag) => ({ tag: tag.tag })),
    }),
  );
}

export const getArticles = unstable_cache(
  async (): Promise<Article[]> => {
    if (!isSupabaseConfigured()) {
      return fallbackArticles.filter((article) => article.published);
    }

    try {
      const articles = await fetchArticlesFromDb();
      return articles ?? fallbackArticles.filter((article) => article.published);
    } catch {
      return fallbackArticles.filter((article) => article.published);
    }
  },
  ["cms-articles"],
  { tags: [CACHE_TAGS.articles] },
);

export async function getFeaturedArticles(limit = 3): Promise<Article[]> {
  const articles = await getArticles();
  return articles
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  const articles = await getArticles();
  return articles.find((article) => article.slug === slug);
}

export async function getArticleSlugs(): Promise<string[]> {
  const articles = await getArticles();
  return articles.map((article) => article.slug);
}
