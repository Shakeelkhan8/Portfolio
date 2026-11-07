import { createRequire } from "node:module";
import { describe, expect, it } from "vitest";

/**
 * Guard for vercel/next.js#99114, which made CI and production builds fail
 * at random with "next/font/google queries have exactly one entry".
 *
 * Google Fonts sometimes answers with extensionless font URLs
 * (fonts.gstatic.com/l/font?kit=...&skey=...). Next.js before 16.4.3 split
 * them on "&" (Turbopack) or took the extension from the end of the URL
 * (webpack), so whether a build passed depended on what Google returned.
 * 16.4.3 reads the type from the CSS format() hint instead.
 *
 * Turbopack's half of the fix is native code; it shipped in the same commit
 * as this parser change, so this test fails if Next.js is ever downgraded
 * below the fix. Reproduced end to end before upgrading: with mocked
 * extensionless URLs, `next build` failed on 16.2.10 and passed on 16.4.3.
 */
const require = createRequire(import.meta.url);
const { findFontFilesInCss } = require(
  "next/dist/compiled/@next/font/dist/google/find-font-files-in-css",
) as {
  findFontFilesInCss: (
    css: string,
    subsetsToPreload?: string[],
  ) => Array<{ googleFontFileUrl: string; preloadFontFile: boolean; ext?: string }>;
};

const extensionlessCss = `/* latin */
@font-face {
  font-family: 'IBM Plex Sans';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/l/font?kit=abc123&skey=def456&v=v20) format('woff2');
  unicode-range: U+0000-00FF;
}
`;

describe("next/font/google with extensionless font URLs", () => {
  it("takes the font type from the CSS format() hint", () => {
    const [file] = findFontFilesInCss(extensionlessCss, ["latin"]);

    expect(file?.googleFontFileUrl).toBe(
      "https://fonts.gstatic.com/l/font?kit=abc123&skey=def456&v=v20",
    );
    expect(file?.ext).toBe("woff2");
    expect(file?.preloadFontFile).toBe(true);
  });
});
