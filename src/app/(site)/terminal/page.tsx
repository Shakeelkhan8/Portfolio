import type { Metadata } from "next";
import { buildPageMetadata, getMetadataContext } from "@/lib/metadata";
import { routes } from "@/config/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const ctx = await getMetadataContext();
  return buildPageMetadata(ctx, {
    title: "Terminal",
    description:
      "Shakeel Khan's portfolio as a command line: type whoami, projects, cat <project>, skills or contact.",
    path: routes.terminal,
  });
}

export { default } from "./terminal-page";
