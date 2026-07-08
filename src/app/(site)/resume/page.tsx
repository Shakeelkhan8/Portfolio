import type { Metadata } from "next";
import { buildPageMetadata, getMetadataContext } from "@/lib/metadata";
import { routes } from "@/config/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const ctx = await getMetadataContext();
  return buildPageMetadata(ctx, {
    title: "Resume",
    description:
      "Download Shakeel Khan’s resume — Senior Backend Engineer focused on production SaaS and APIs.",
    path: routes.resume,
  });
}

export { default } from "./resume-page";
