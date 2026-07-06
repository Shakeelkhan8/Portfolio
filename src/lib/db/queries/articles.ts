import { unstable_cache } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { CACHE_TAGS } from "@/lib/db/cache-tags";
import { articles as fallbackArticles } from "@/content/writing";
import { mapArticle } from "@/lib/db/mappers/content";
import type { Article, ArticleDetail } from "@/types";

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

async function fetchArticleDetailFromDb(
  slug: string,
): Promise<ArticleDetail | null> {
  const supabase = await createClient();

  const { data: article, error } = await supabase
    .from("articles")
    .select(
      "id, slug, title, excerpt, content_html, published_at, reading_time_minutes, meta_title, meta_description, canonical_url, robots, og_image_id",
    )
    .eq("slug", slug)
    .eq("status", "published")
    .is("deleted_at", null)
    .maybeSingle();

  if (error || !article) {
    return null;
  }

  const [{ data: tags }, { data: ogImage }] = await Promise.all([
    supabase
      .from("article_tags")
      .select("tag, display_order")
      .eq("article_id", article.id)
      .order("display_order", { ascending: true }),
    article.og_image_id
      ? supabase
          .from("media_files")
          .select("public_url")
          .eq("id", article.og_image_id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  const mapped = mapArticle({
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    content_html: article.content_html,
    published_at: article.published_at,
    reading_time_minutes: article.reading_time_minutes,
    tags: (tags ?? []).map((tag) => ({ tag: tag.tag })),
  });

  return {
    ...mapped,
    metaTitle: article.meta_title,
    metaDescription: article.meta_description,
    ogImageUrl: ogImage?.public_url ?? null,
    canonicalUrl: article.canonical_url,
    robots: article.robots,
  };
}

const getCachedArticleDetail = unstable_cache(
  async (slug: string) => fetchArticleDetailFromDb(slug),
  ["cms-article-detail"],
  { tags: [CACHE_TAGS.articles] },
);

function mapFallbackArticleDetail(article: Article): ArticleDetail {
  return {
    ...article,
    metaTitle: null,
    metaDescription: null,
    ogImageUrl: null,
    canonicalUrl: null,
    robots: null,
  };
}

export async function getArticleSlugs(): Promise<string[]> {
  const articles = await getArticles();
  return articles.map((article) => article.slug);
}

export async function getArticleDetailBySlug(
  slug: string,
): Promise<ArticleDetail | undefined> {
  const fallback = fallbackArticles.find(
    (item) => item.published && item.slug === slug,
  );

  if (!isSupabaseConfigured()) {
    return fallback ? mapFallbackArticleDetail(fallback) : undefined;
  }

  try {
    const article = await getCachedArticleDetail(slug);
    if (article) {
      return article;
    }

    return fallback ? mapFallbackArticleDetail(fallback) : undefined;
  } catch {
    return fallback ? mapFallbackArticleDetail(fallback) : undefined;
  }
}
