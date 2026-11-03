import type { Metadata } from "next";
import { buildPageMetadata, getMetadataContext } from "@/lib/metadata";
import { routes } from "@/config/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const ctx = await getMetadataContext();
  return buildPageMetadata(ctx, {
    title: "About",
    description:
      "About Shakeel Khan, a senior backend engineer working on payments, integrations, multi-tenant SaaS and AI features, and how he works with clients.",
    path: routes.about,
  });
}

export { default } from "./about-page";
