import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { Prose } from "@/components/typography/prose";
import { routes } from "@/config/navigation";
import { getSiteConfig } from "@/lib/db/queries/site";
import {
  formatDate,
  getArticleDetailBySlug,
  getArticleSlugs,
} from "@/lib/content";
import { buildPageMetadata, getMetadataContext } from "@/lib/metadata";
import { sanitizeRichHtml } from "@/lib/security/sanitize";
import { getArticleSchema, getBreadcrumbSchema } from "@/lib/structured-data";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const [ctx, article] = await Promise.all([
    getMetadataContext(),
    getArticleDetailBySlug(slug),
  ]);

  if (!article) return {};

  return buildPageMetadata(ctx, {
    title: article.metaTitle ?? article.title,
    description: article.metaDescription ?? article.excerpt,
    path: routes.article(slug),
    ogImage: article.ogImageUrl,
    canonicalUrl: article.canonicalUrl,
    robots: article.robots,
  });
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const [article, site] = await Promise.all([
    getArticleDetailBySlug(slug),
    getSiteConfig(),
  ]);

  if (!article) notFound();

  const articleUrl = `${site.url}${routes.article(slug)}`;
  const structuredData = [
    getArticleSchema(site, article),
    getBreadcrumbSchema([
      { name: "Home", url: site.url },
      { name: "Writing", url: `${site.url}${routes.writing}` },
      { name: article.title, url: articleUrl },
    ]),
  ];

  return (
    <>
      <JsonLd data={structuredData} />
      <Section
        spacing="none"
        className="border-b border-border pt-10 pb-12 sm:pt-14 sm:pb-14"
      >
        <Container className="max-w-3xl">
          <Breadcrumbs
            items={[
              { label: "Writing", href: routes.writing },
              { label: article.title },
            ]}
          />
          <header>
            <p className="label-mono">
              {formatDate(article.date)} · {article.readingTime} min read
              {article.tags.length > 0 ? ` · ${article.tags.join(", ")}` : null}
            </p>
            <h1 className="mt-4 font-heading text-[2.25rem] leading-[1.08] text-foreground sm:text-5xl">
              {article.title}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-pretty text-muted-foreground">
              {article.excerpt}
            </p>
          </header>
        </Container>
      </Section>

      <Section spacing="sm">
        <Container className="max-w-3xl">
          {article.content ? (
            <Prose
              dangerouslySetInnerHTML={{
                __html: sanitizeRichHtml(article.content),
              }}
            />
          ) : (
            <Prose>
              <p>{article.excerpt}</p>
            </Prose>
          )}
        </Container>
      </Section>
    </>
  );
}
