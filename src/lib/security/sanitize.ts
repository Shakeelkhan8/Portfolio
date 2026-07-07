import sanitizeHtml from "sanitize-html";

const RICH_TEXT_ALLOWED_TAGS = [
  ...sanitizeHtml.defaults.allowedTags,
  "img",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
];

const RICH_TEXT_ALLOWED_ATTRIBUTES: sanitizeHtml.IOptions["allowedAttributes"] =
  {
    ...sanitizeHtml.defaults.allowedAttributes,
    img: ["src", "alt", "title", "width", "height", "loading"],
    a: ["href", "name", "target", "rel"],
    code: ["class"],
    span: ["class"],
    pre: ["class"],
  };

/**
 * Sanitizes admin-authored HTML before persistence and public rendering.
 * Strips scripts, event handlers, and dangerous URL schemes.
 */
export function sanitizeRichHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: RICH_TEXT_ALLOWED_TAGS,
    allowedAttributes: RICH_TEXT_ALLOWED_ATTRIBUTES,
    allowedSchemes: ["http", "https", "mailto"],
    allowedSchemesByTag: {
      img: ["http", "https"],
    },
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", {
        rel: "noopener noreferrer",
      }),
    },
  });
}

const HEX_COLOR_PATTERN = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

export function sanitizeCssColor(
  value: string | null | undefined,
  fallback: string,
): string {
  if (!value?.trim()) {
    return fallback;
  }

  return HEX_COLOR_PATTERN.test(value.trim()) ? value.trim() : fallback;
}

/**
 * Restricts admin-authored custom CSS to declaration blocks only.
 */
export function sanitizeCustomCss(css: string | null | undefined): string {
  if (!css?.trim()) {
    return "";
  }

  return css
    .replace(/<\/?style/gi, "")
    .replace(/<\/?script/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/expression\s*\(/gi, "")
    .replace(/@import/gi, "")
    .replace(/behavior\s*:/gi, "")
    .slice(0, 10_000);
}
