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
          <div className="overflow-hidden rounded-2xl border border-border/70 bg-surface/50 divide-y divide-border/60">
            {filteredArticles.map((article) => (
              <AppLink
                key={article.slug}
                href={routes.article(article.slug)}
                showExternalIcon={false}
                className="group flex items-center justify-between gap-4 px-6 py-5 transition-colors hover:bg-primary/5"
              >
                <div>
                  <p className="font-heading font-medium tracking-tight text-foreground transition-colors group-hover:text-primary">
                    {article.title}
                  </p>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    {article.excerpt}
                  </p>
                  <p className="mt-2 font-mono text-[11px] tracking-wide text-muted-foreground">
                    {[formatDate(article.date), `${article.readingTime} min read`]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>
                <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:text-primary" />
              </AppLink>
            ))}
          </div>
        </Reveal>
      )}
    </div>
  );
}
