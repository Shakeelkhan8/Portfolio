import type { Metadata } from "next";
import { buildPageMetadata, getMetadataContext } from "@/lib/metadata";
import { routes } from "@/config/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const ctx = await getMetadataContext();
  return buildPageMetadata(ctx, {
    title: "Writing",
    description:
      "Technical articles on backend engineering, system design, and software craftsmanship.",
    path: routes.writing,
  });
}

export { default } from "./writing-page";
