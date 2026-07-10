import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/layout/section";
import { PageHeader } from "@/components/shared/page-header";
import { Prose } from "@/components/typography/prose";
import { routes } from "@/config/navigation";
import { getPageBySlug } from "@/lib/content";
import { buildPageMetadata, getMetadataContext } from "@/lib/metadata";
import { sanitizeRichHtml } from "@/lib/security/sanitize";

export async function generateMetadata(): Promise<Metadata> {
  const [ctx, page] = await Promise.all([
    getMetadataContext(),
    getPageBySlug("privacy"),
  ]);

  return buildPageMetadata(ctx, {
    title: page?.metaTitle ?? page?.title ?? "Privacy Policy",
    description:
      page?.metaDescription ?? "Privacy policy for this portfolio website.",
    path: routes.privacy,
    ogImage: page?.ogImageUrl,
    canonicalUrl: page?.canonicalUrl,
    robots: page?.robots,
  });
}

export default async function PrivacyPage() {
  const page = await getPageBySlug("privacy");

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
        title={page.title}
        description={`Last updated: ${lastUpdated}`}
      />
      <Section spacing="sm" className="border-t border-border/60 pt-0">
        <Prose
          dangerouslySetInnerHTML={{
            __html: sanitizeRichHtml(page.contentHtml),
          }}
        />
      </Section>
    </>
  );
}
