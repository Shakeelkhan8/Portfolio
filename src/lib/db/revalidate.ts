import { revalidatePath, revalidateTag } from "next/cache";
import { CACHE_TAGS, type CacheTag } from "@/lib/db/cache-tags";
import { DEFAULT_OG_IMAGE_PATH } from "@/lib/og/default-image";

export function revalidateContent(...tags: CacheTag[]) {
  for (const tag of tags) {
    revalidateTag(tag, "max");
  }

  revalidateTag(CACHE_TAGS.search, "max");
}

export function revalidatePublicPages() {
  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/experience");
  revalidatePath("/resume");
  revalidatePath("/projects");
  revalidatePath("/writing");
  revalidatePath("/contact");
  revalidatePath("/open-source");
  revalidatePath("/sitemap.xml");
  revalidatePath("/rss.xml");
}

export function revalidateAfterContentChange(...tags: CacheTag[]) {
  revalidateContent(...tags);
  revalidatePublicPages();
}

export function revalidateAfterProjectChange(options?: {
  slug?: string;
  previousSlug?: string;
}) {
  revalidateAfterContentChange(CACHE_TAGS.projects);

  if (options?.previousSlug && options.previousSlug !== options.slug) {
    revalidatePath(`/projects/${options.previousSlug}`);
  }

  if (options?.slug) {
    revalidatePath(`/projects/${options.slug}`);
  }
}

/**
 * Every public cache tag plus every public route. CMS queries cache with no
 * expiry, so content written outside the admin panel (scripts/sync-content.ts)
 * stays invisible until this runs.
 */
export function revalidateAllPublicContent() {
  revalidateContent(...Object.values(CACHE_TAGS));
  revalidatePublicPages();
  revalidatePath(DEFAULT_OG_IMAGE_PATH);
}

export function revalidateAfterMediaChange() {
  revalidateTag(CACHE_TAGS.media, "max");
}

export function revalidateAfterArticleChange(options?: {
  slug?: string;
  previousSlug?: string;
}) {
  revalidateAfterContentChange(CACHE_TAGS.articles);

  if (options?.previousSlug && options.previousSlug !== options.slug) {
    revalidatePath(`/writing/${options.previousSlug}`);
  }

  if (options?.slug) {
    revalidatePath(`/writing/${options.slug}`);
  }
}

export function revalidateAfterSettingsChange() {
  revalidateAfterContentChange(CACHE_TAGS.site, CACHE_TAGS.pages);
  revalidatePath("/privacy");
  revalidatePath("/manifest.webmanifest");
  revalidatePath(DEFAULT_OG_IMAGE_PATH);
  revalidatePath("/icon");
  revalidatePath("/robots.txt");
}

export function revalidateAfterPageChange(options?: {
  slug?: string;
  previousSlug?: string;
}) {
  revalidateAfterContentChange(CACHE_TAGS.pages);

  if (options?.previousSlug && options.previousSlug !== options.slug) {
    revalidatePath(`/${options.previousSlug}`);
    if (options.previousSlug === "privacy") {
      revalidatePath("/privacy");
    }
  }

  if (options?.slug) {
    revalidatePath(`/${options.slug}`);
    if (options.slug === "privacy") {
      revalidatePath("/privacy");
    }
  }
}

export function revalidateAfterResumeChange() {
  revalidateAfterContentChange(CACHE_TAGS.resume);
  revalidatePath("/resume");
}
