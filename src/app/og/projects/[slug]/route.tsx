import { ImageResponse } from "next/og";
import { getProjectBySlug, getProjectSlugs, getSiteConfig } from "@/lib/content";
import { OG_SIZE, OgCard } from "@/lib/og/og-card";

// Node.js runtime: next/og's renderer exceeds the Edge bundle limit on Vercel
// (same reason as app/opengraph-image.tsx).
export const runtime = "nodejs";
export const dynamic = "force-static";

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

/**
 * Link-preview image for one case study: its context, title, summary and
 * headline result. Used as the page's og:image unless the CMS sets one.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const [project, site] = await Promise.all([
    getProjectBySlug(slug),
    getSiteConfig(),
  ]);

  if (!project) {
    return new Response("Not found", { status: 404 });
  }

  return new ImageResponse(
    (
      <OgCard
        eyebrow={project.context}
        title={project.title}
        description={project.summary}
        metric={project.metrics[0] ?? null}
        footer={`${site.name} · Case study`}
      />
    ),
    { ...OG_SIZE },
  );
}
