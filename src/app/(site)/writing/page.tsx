import type { Metadata } from "next";
import { buildPageMetadata, getMetadataContext } from "@/lib/metadata";
import { routes } from "@/config/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const ctx = await getMetadataContext();
  return buildPageMetadata(ctx, {
    title: "Writing",
    description:
      "Notes by Shakeel Khan on backend engineering: multi-tenant data isolation, idempotent payment webhooks and keeping Laravel systems reliable.",
    path: routes.writing,
  });
}

export { default } from "./writing-page";
