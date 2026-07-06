import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import type { ArticleRecord } from "@/types/cms";

function mapArticleRecord(
  article: {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content_html: string | null;
    status: "draft" | "published";
    reading_time_minutes: number;
    meta_title: string | null;
    meta_description: string | null;
    og_image_id: string | null;
    canonical_url: string | null;
    robots: string | null;
    published_at: string | null;
  },
  tags: string[],
): ArticleRecord {
  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    contentHtml: article.content_html,
    status: article.status,
    readingTimeMinutes: article.reading_time_minutes,
    metaTitle: article.meta_title,
    metaDescription: article.meta_description,
    ogImageId: article.og_image_id,
    canonicalUrl: article.canonical_url,
    robots: article.robots,
    publishedAt: article.published_at,
    tags,
  };
}

async function fetchArticleTags(articleIds: string[]) {
  if (!articleIds.length) {
    return [];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("article_tags")
    .select("article_id, tag, display_order")
    .in("article_id", articleIds)
    .order("display_order", { ascending: true });

  if (error) {
    return [];
  }

  return data ?? [];
}

export async function getArticleRecords(): Promise<ArticleRecord[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await createClient();
  const { data: articles, error } = await supabase
    .from("articles")
    .select(
      "id, slug, title, excerpt, content_html, status, reading_time_minutes, meta_title, meta_description, og_image_id, canonical_url, robots, published_at",
    )
    .is("deleted_at", null)
    .order("published_at", { ascending: false, nullsFirst: false });

  if (error || !articles?.length) {
    return [];
  }

  const tags = await fetchArticleTags(articles.map((article) => article.id));

  return articles.map((article) =>
    mapArticleRecord(
      article,
      tags
        .filter((tag) => tag.article_id === article.id)
        .map((tag) => tag.tag),
    ),
  );
}

export async function getArticleRecordById(
  id: string,
): Promise<ArticleRecord | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = await createClient();
  const { data: article, error } = await supabase
    .from("articles")
    .select(
      "id, slug, title, excerpt, content_html, status, reading_time_minutes, meta_title, meta_description, og_image_id, canonical_url, robots, published_at",
    )
    .eq("id", id)
    .is("deleted_at", null)
    .maybeSingle();

  if (error || !article) {
    return null;
  }

  const tags = await fetchArticleTags([article.id]);

  return mapArticleRecord(
    article,
    tags.filter((tag) => tag.article_id === article.id).map((tag) => tag.tag),
  );
}
