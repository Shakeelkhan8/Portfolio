"use client";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { ContentSearch } from "@/components/search/content-search";
import { getArticles } from "@/lib/content";

export default function WritingPage() {
  const articles = getArticles();

  return (
    <>
      <PageHeader
        title="Writing"
        description="Technical articles on backend systems, architecture, and engineering decisions."
      />
      <Section spacing="sm" className="border-t border-border pt-0">
        <Container className="space-y-8">
          <ContentSearch
            types={["article"]}
            placeholder="Search articles..."
          />

          {articles.length === 0 ? (
            <EmptyState
              title="Articles in progress"
              description="I'm working on technical articles covering multi-tenant architecture, API design, and production backend patterns. Check back soon."
            />
          ) : (
            <div className="space-y-4">
              {articles.map((article) => (
                <div key={article.slug}>{article.title}</div>
              ))}
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
