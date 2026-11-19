import type { Metadata } from "next";
import { buildPageMetadata, getMetadataContext } from "@/lib/metadata";
import { routes } from "@/config/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const ctx = await getMetadataContext();
  return buildPageMetadata(ctx, {
    title: "Resume",
    description:
      "Resume of Shakeel Khan, full stack developer and software engineer: full-time with PHP and Laravel since 2022, on production SaaS, payments and integrations. Print or save as PDF.",
    path: routes.resume,
  });
}

export { default } from "./resume-page";
