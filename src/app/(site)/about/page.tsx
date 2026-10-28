import type { Metadata } from "next";
import { buildPageMetadata, getMetadataContext } from "@/lib/metadata";
import { routes } from "@/config/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const ctx = await getMetadataContext();
  return buildPageMetadata(ctx, {
    title: "About",
    description:
      "About Shakeel Khan, a senior backend engineer in Islamabad working in PHP, Laravel and PostgreSQL on multi-tenant SaaS, payments and integrations.",
    path: routes.about,
  });
}

export { default } from "./about-page";
