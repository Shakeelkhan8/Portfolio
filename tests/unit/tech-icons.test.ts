import { describe, expect, it } from "vitest";
import { skillGroups } from "@/content/skills";
import { contrastOnPage, techItem, withTechIcons } from "@/lib/tech-icons";

describe("tech stack icons", () => {
  it("gives every seeded skill an icon, brand or generic", () => {
    const items = withTechIcons(skillGroups).flatMap((group) => group.items);
    const missing = items.filter((item) => !item.path && !item.generic);
    expect(missing).toEqual([]);
    expect(items.length).toBe(skillGroups.flatMap((group) => group.skills).length);
  });

  it("uses the brand mark for brands and a generic icon for practices", () => {
    expect(techItem("TypeScript").path).toMatch(/^M/);
    expect(techItem("REST APIs")).toEqual({ name: "REST APIs", generic: "api" });
    expect(techItem("Idempotent webhooks").generic).toBe("webhook");
    // One logo would imply one tool, so this pair stays generic.
    expect(techItem("RabbitMQ / Kafka")).toEqual({
      name: "RabbitMQ / Kafka",
      generic: "queue",
    });
    expect(techItem("Something new").generic).toBe("code");
  });

  it("gives readable brands their own hover colour", () => {
    expect(techItem("Laravel").brandColor).toBe("#FF2D20");
    expect(techItem("Go").brandColor).toBe("#00ADD8");
    expect(techItem("PHP 8.4").brandColor).toBe("#777BB4");
  });

  it("keeps black or very dark marks on the default colour", () => {
    // These would vanish on the dark page (contrast under 3:1).
    for (const name of ["Next.js", "Express", "Vercel", "Prisma", "Sentry"]) {
      expect(techItem(name).brandColor, name).toBeUndefined();
      expect(techItem(name).path, name).toMatch(/^[Mm]/);
    }
  });

  it("only colours icons that meet 3:1 on the page", () => {
    const colours = withTechIcons(skillGroups)
      .flatMap((group) => group.items)
      .map((item) => item.brandColor)
      .filter((colour): colour is string => Boolean(colour));
    expect(colours.length).toBeGreaterThan(20);
    for (const colour of colours) {
      expect(contrastOnPage(colour.slice(1)), colour).toBeGreaterThanOrEqual(3);
    }
  });

  it("no longer lists iOS (Swift)", () => {
    expect(skillGroups.flatMap((group) => group.skills)).not.toContain("iOS (Swift)");
  });
});
