import { describe, expect, it } from "vitest";
import { skillGroups } from "@/content/skills";
import { techItem, withTechIcons } from "@/lib/tech-icons";

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

  it("no longer lists iOS (Swift)", () => {
    expect(skillGroups.flatMap((group) => group.skills)).not.toContain("iOS (Swift)");
  });
});
