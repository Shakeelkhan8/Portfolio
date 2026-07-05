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
  getArticleBySlug,
  getArticleSlugs,
} from "@/lib/content";
import { createMetadata } from "@/lib/metadata";
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
  const article = await getArticleBySlug(slug);

  if (!article) return {};

  return createMetadata({
    title: article.title,
    description: article.excerpt,
    path: routes.article(slug),
  });
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const [article, site] = await Promise.all([
    getArticleBySlug(slug),
    getSiteConfig(),
  ]);

  if (!article) notFound();

  const articleUrl = `${site.url}${routes.article(slug)}`;
  const structuredData = [
    getArticleSchema(article),
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
              <Heading as="h1" size="xl">
                {article.title}
              </Heading>
              <Text muted>
                {formatDate(article.date)} · {article.readingTime} min read
              </Text>
              {article.tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              ) : null}
            </header>
          </FadeIn>
        </Container>
      </Section>

      <Section spacing="sm">
        <Container className="max-w-3xl">
          <FadeIn delay={0.1}>
            <Prose>
              <p>{article.content ?? article.excerpt}</p>
            </Prose>
          </FadeIn>
        </Container>
      </Section>
    </>
  );
}
