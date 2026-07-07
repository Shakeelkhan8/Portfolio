import type { ArticleRecord } from "@/types/cms";
import { formatCsv } from "@/lib/admin/project-form-utils";

export function articleToFormDefaults(article?: ArticleRecord | null) {
  if (!article) {
    return {
      slug: "",
      title: "",
      excerpt: "",
      contentHtml: "",
      status: "draft",
      readingTimeMinutes: 1,
      metaTitle: "",
      metaDescription: "",
      ogImageId: "",
      canonicalUrl: "",
      robots: "index, follow",
      tags: "",
    };
  }

  return {
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    contentHtml: article.contentHtml ?? "",
    status: article.status,
    readingTimeMinutes: article.readingTimeMinutes,
    metaTitle: article.metaTitle ?? "",
    metaDescription: article.metaDescription ?? "",
    ogImageId: article.ogImageId ?? "",
    canonicalUrl: article.canonicalUrl ?? "",
    robots: article.robots ?? "index, follow",
    tags: formatCsv(article.tags),
  };
}
