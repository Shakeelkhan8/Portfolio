import type { Metadata } from "next";
import { buildPageMetadata, getMetadataContext } from "@/lib/metadata";
import { routes } from "@/config/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const ctx = await getMetadataContext();
  return buildPageMetadata(ctx, {
    title: "Projects and case studies",
    description:
      "Backend case studies by Shakeel Khan: a multi-tenant dispatch SaaS, reporting automation, ISP billing, and open-source Laravel side projects.",
    path: routes.projects,
  });
}

export { default } from "./projects-page";
