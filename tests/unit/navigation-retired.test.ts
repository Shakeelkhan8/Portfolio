import { describe, expect, it } from "vitest";
import { mapNavigation } from "@/lib/db/mappers/site";
import type { NavigationItemRecord } from "@/types/cms";

const item = (
  href: string,
  navGroup: NavigationItemRecord["navGroup"] = "main",
): NavigationItemRecord => ({
  id: href,
  navGroup,
  title: href,
  href,
  external: false,
  displayOrder: 0,
  visible: true,
});

describe("navigation: retired pages", () => {
  // /services was removed on 2026-11-19. Its Admin row may still exist until
  // the user deletes it; the public menus must not link to the 404.
  it("leaves /services out of every public menu", () => {
    const nav = mapNavigation([
      item("/projects"),
      item("/services"),
      item("/services", "utility"),
      item("/services", "footer"),
      item("/contact"),
    ]);

    const hrefs = [...nav.mainNav, ...nav.utilityNav, ...nav.footerNav].map(
      (entry) => entry.href,
    );
    expect(hrefs).not.toContain("/services");
    expect(nav.mainNav.map((entry) => entry.href)).toEqual([
      "/projects",
      "/contact",
    ]);
  });
});
