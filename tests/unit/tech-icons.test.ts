import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { skillGroups } from "@/content/skills";
import {
  DEVICON_FILES,
  MAPPED_SKILLS,
  techItem,
  withTechIcons,
  type TechItem,
} from "@/lib/tech-icons";

const items = withTechIcons(skillGroups).flatMap((group) => group.items);
const srcs = (item: TechItem) =>
  item.logos.flatMap((logo) => (logo.kind === "image" ? [logo.src] : []));

describe("tech stack icons", () => {
  it("has a deliberate entry for every skill on the site", () => {
    const skills = skillGroups.flatMap((group) => group.skills);
    expect(skills.filter((skill) => !MAPPED_SKILLS.includes(skill))).toEqual([]);
    expect(items.length).toBe(skills.length);
  });

  it("gives every tile an icon and a hover colour", () => {
    for (const item of items) {
      expect(item.logos.length > 0 || Boolean(item.generic), item.name).toBe(true);
      expect(item.glow, item.name).toMatch(/^(#[0-9A-F]{6}|var\(--signal\))$/i);
    }
  });

  it("ships every logo file it points to", () => {
    for (const file of DEVICON_FILES) {
      expect(existsSync(join("public", "icons", "tech", file)), file).toBe(true);
    }
    expect(existsSync(join("public", "icons", "tech", "LICENSE-devicon.txt"))).toBe(true);
  });

  it("uses each brand's original logo", () => {
    // The classic Redis cube, not its 2024 mark; Flutter's two-tone logo.
    expect(srcs(techItem("Redis"))).toEqual(["/icons/tech/redis-original.svg"]);
    expect(srcs(techItem("Flutter"))).toEqual(["/icons/tech/flutter-original.svg"]);
    // Go's logo is the "GO" mark; go-original is the gopher mascot.
    expect(srcs(techItem("Go"))).toEqual(["/icons/tech/go-original-wordmark.svg"]);
    expect(srcs(techItem("React Native"))).toEqual(["/icons/tech/react-original.svg"]);
  });

  it("doesn't borrow another product's logo", () => {
    // WebSockets isn't Socket.IO; OpenAI has no logo in either icon set.
    expect(techItem("WebSockets")).toMatchObject({ logos: [], generic: "realtime" });
    expect(techItem("OpenAI API")).toMatchObject({ logos: [], generic: "ai" });
  });

  it("shows both logos for a pair", () => {
    expect(srcs(techItem("RabbitMQ / Kafka"))).toEqual([
      "/icons/tech/rabbitmq-original.svg",
      "/icons/tech/apachekafka-original.svg",
    ]);
    expect(srcs(techItem("JWT / OAuth 2.0"))).toEqual([
      "/icons/tech/jwt-original.svg",
      "/icons/tech/oauth-original.svg",
    ]);
  });

  it("puts dark logos on a white backing so their colours show", () => {
    for (const name of ["Express", "Vercel", "Prisma", "MySQL", "Sentry", "Linux", "AWS (EC2, S3, RDS)", "Odoo", "OWASP web app audits"]) {
      expect(techItem(name).logos.some((logo) => logo.backdrop), name).toBe(true);
    }
    expect(techItem("Redis").logos.some((logo) => logo.backdrop)).toBe(false);
  });

  it("draws Simple Icons marks in the brand's own colour", () => {
    expect(techItem("Stripe").logos[0]).toMatchObject({ kind: "path", color: "#635BFF" });
  });

  it("no longer lists iOS (Swift)", () => {
    expect(skillGroups.flatMap((group) => group.skills)).not.toContain("iOS (Swift)");
  });
});
