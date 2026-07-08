import type { Metadata } from "next";
import { buildPageMetadata, getMetadataContext } from "@/lib/metadata";
import { routes } from "@/config/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const ctx = await getMetadataContext();
  return buildPageMetadata(ctx, {
    title: "About",
    description:
      "Background, skills, and real engineering tradeoffs from Shakeel Khan, Senior Backend Engineer.",
    path: routes.about,
  });
}

export { default } from "./about-page";
