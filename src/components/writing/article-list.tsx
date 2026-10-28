"use client";

import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { AppLink } from "@/components/shared/app-link";
import { EmptyState } from "@/components/shared/empty-state";
import { ContentSearch } from "@/components/search/content-search";
import { Reveal } from "@/components/motion/reveal";
import { useSiteDataSafe } from "@/components/providers/site-data-provider";
import { formatDate } from "@/lib/formatters";
import { LIST_SEARCH_MIN_ITEMS } from "@/lib/list-search";
import { filterSearchIndex } from "@/lib/search-utils";
import { routes } from "@/config/navigation";
import type { Article } from "@/types";

type ArticleListProps = {
  articles: Article[];
};

export function ArticleList({ articles }: ArticleListProps) {
  const siteData = useSiteDataSafe();
  const [query, setQuery] = useState("");
  const showSearch = articles.length >= LIST_SEARCH_MIN_ITEMS;

  const filteredArticles = useMemo(() => {
    if (!showSearch || !query.trim()) return articles;

    const index = siteData?.searchIndex ?? [];
    const matchingSlugs = new Set(
      filterSearchIndex(index, query)
        .filter((item) => item.type === "article")
        .map((item) => item.href.replace("/writing/", "")),
    );

    return articles.filter((article) => matchingSlugs.has(article.slug));
  }, [articles, query, showSearch, siteData?.searchIndex]);

  if (articles.length === 0) {
    return (
      <EmptyState
        title="Articles in progress"
        description="Technical articles covering multi-tenant architecture, API design, and production backend patterns are on the way."
      />
    );
  }

  return (
    <div className="space-y-8">
      {showSearch ? (
        <ContentSearch
          types={["article"]}
          placeholder="Search articles..."
          onQueryChange={setQuery}
        />
      ) : null}

      {filteredArticles.length === 0 ? (
        <EmptyState
          title="No matching articles"
          description="Try a different search term."
        />
      ) : (
        <Reveal>
          <div className="flex flex-col">
            {filteredArticles.map((article) => (
              <AppLink
                key={article.slug}
                href={routes.article(article.slug)}
                showExternalIcon={false}
                className="group -mx-3 flex items-start justify-between gap-6 rounded-xl px-3 py-6 transition-colors duration-300 hover:bg-foreground/[0.03] sm:-mx-4 sm:px-4 sm:py-7"
              >
                <div className="min-w-0">
                  <p className="font-heading text-base font-medium tracking-tight text-foreground sm:text-lg">
                    {article.title}
                  </p>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                    {article.excerpt}
                  </p>
                  <p className="mt-3 font-mono text-[11px] tracking-wide text-muted-foreground">
                    {[formatDate(article.date), `${article.readingTime} min read`]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>
                <ArrowRight className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:text-foreground" />
              </AppLink>
            ))}
          </div>
        </Reveal>
      )}
    </div>
  );
}
