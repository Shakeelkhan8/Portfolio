import type { Metadata } from "next";
import { buildPageMetadata, getMetadataContext } from "@/lib/metadata";
import { routes } from "@/config/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const ctx = await getMetadataContext();
  return buildPageMetadata(ctx, {
    title: "Contact",
    description:
      "Contact Shakeel Khan about a remote backend role or a Laravel project: payment integrations, AI features, upgrades, store sync or bug fixes.",
    path: routes.contact,
  });
}

export { default } from "./contact-page";
