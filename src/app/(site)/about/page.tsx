import type { Metadata } from "next";
import { buildPageMetadata, getMetadataContext } from "@/lib/metadata";
import { routes } from "@/config/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const ctx = await getMetadataContext();
  return buildPageMetadata(ctx, {
    title: "About",
    description:
      "About Shakeel Khan, a full stack developer and software engineer working in PHP/Laravel, TypeScript/Node.js and React on SaaS platforms, web applications, APIs and AI features, and how he works with clients.",
    path: routes.about,
  });
}

export { default } from "./about-page";
