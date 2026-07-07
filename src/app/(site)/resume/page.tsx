import type { Metadata } from "next";
import { buildPageMetadata, getMetadataContext } from "@/lib/metadata";
import { routes } from "@/config/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const ctx = await getMetadataContext();
  return buildPageMetadata(ctx, {
    title: "Resume",
    description:
      "Downloadable resume summary and professional background for Shakeel Khan.",
    path: routes.resume,
  });
}

export { default } from "./resume-page";
