/**
 * The site-wide link preview. app/opengraph-image.tsx returns this id from
 * generateImageMetadata, and Next then serves the image at
 * /opengraph-image/<id>, not at /opengraph-image (that path is a 404).
 * Metadata and revalidation import the path from here so they cannot drift
 * from the route again.
 */
export const DEFAULT_OG_IMAGE_ID = "default";

export const DEFAULT_OG_IMAGE_PATH = `/opengraph-image/${DEFAULT_OG_IMAGE_ID}`;
