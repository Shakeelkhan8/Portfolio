import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/motion/fade-in";
import { JsonLd } from "@/components/seo/json-ld";
import { Heading } from "@/components/typography/heading";
import { Prose } from "@/components/typography/prose";
import { Text } from "@/components/typography/text";
import { routes } from "@/config/navigation";
import { getSiteConfig } from "@/lib/db/queries/site";
import {
  formatDate,
  getArticleDetailBySlug,
  getArticleSlugs,
} from "@/lib/content";
import { buildPageMetadata, getMetadataContext } from "@/lib/metadata";
import { sanitizeRichHtml } from "@/lib/security/sanitize";
import {
  getArticleSchema,
  getBreadcrumbSchema,
} from "@/lib/structured-data";

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
      <Section spacing="sm" className="pt-16 pb-8 md:pt-20">
        <Container className="max-w-3xl">
          <Breadcrumbs
            items={[
              { label: "Writing", href: routes.writing },
              { label: article.title },
            ]}
          />
          <FadeIn>
            <header className="space-y-4">
              <Heading as="h1" size="xl" className="text-foreground">
                {article.title}
              </Heading>
              <Text muted className="font-mono text-[12px] tracking-wide">
                {formatDate(article.date)} · {article.readingTime} min read
              </Text>
              {article.tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-muted/60">
                      {tag}
                    </Badge>
                  ))}
                </div>
              ) : null}
            </header>
          </FadeIn>
        </Container>
      </Section>

      <Section spacing="sm" className="pt-0">
        <Container className="max-w-3xl">
          <FadeIn delay={0.1}>
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
          </FadeIn>
        </Container>
      </Section>
    </>
  );
}
