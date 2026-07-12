import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/layout/section";
import { PageHeader } from "@/components/shared/page-header";
import { Prose } from "@/components/typography/prose";
import { routes } from "@/config/navigation";
import { getPageBySlug, getPublishedPages } from "@/lib/content";
import { buildPageMetadata, getMetadataContext } from "@/lib/metadata";
import { sanitizeRichHtml } from "@/lib/security/sanitize";

const DEDICATED_PAGE_SLUGS = new Set(["privacy"]);

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const pages = await getPublishedPages();
  return pages
    .filter((page) => !DEDICATED_PAGE_SLUGS.has(page.slug))
    .map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  if (DEDICATED_PAGE_SLUGS.has(slug)) {
    return { title: "Page Not Found" };
  }

  const [ctx, page] = await Promise.all([
    getMetadataContext(),
    getPageBySlug(slug),
  ]);

  if (!page) {
    return { title: "Page Not Found" };
  }

  return buildPageMetadata(ctx, {
    title: page.metaTitle ?? page.title,
    description: page.metaDescription ?? undefined,
    path: routes.page(slug),
    ogImage: page.ogImageUrl,
    canonicalUrl: page.canonicalUrl,
    robots: page.robots,
  });
}

export default async function CmsPage({ params }: PageProps) {
  const { slug } = await params;

  if (DEDICATED_PAGE_SLUGS.has(slug)) {
    notFound();
  }

  const page = await getPageBySlug(slug);

  if (!page?.contentHtml) {
    notFound();
  }

  const lastUpdated = new Date(page.updatedAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <PageHeader
        eyebrow="Page"
        title={page.title}
        description={`Last updated: ${lastUpdated}`}
      />
      <Section spacing="sm" className="pt-0">
        <Prose
          dangerouslySetInnerHTML={{
            __html: sanitizeRichHtml(page.contentHtml),
          }}
        />
      </Section>
    </>
  );
}
