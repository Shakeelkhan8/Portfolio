import type { Metadata } from "next";
import { buildPageMetadata, getMetadataContext } from "@/lib/metadata";
import { routes } from "@/config/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const ctx = await getMetadataContext();
  return buildPageMetadata(ctx, {
    title: "Contact",
    description:
      "Contact Shakeel Khan about a remote senior backend role or a Laravel project: new SaaS backends, payment integrations, or fixing slow systems.",
    path: routes.contact,
  });
}

export { default } from "./contact-page";
