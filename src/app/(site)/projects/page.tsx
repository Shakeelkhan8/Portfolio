import type { Metadata } from "next";
import { buildPageMetadata, getMetadataContext } from "@/lib/metadata";
import { routes } from "@/config/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const ctx = await getMetadataContext();
  return buildPageMetadata(ctx, {
    title: "Projects",
    description:
      "Case studies and technical deep-dives into backend systems, APIs, and platform engineering work.",
    path: routes.projects,
  });
}

export { default } from "./projects-page";
