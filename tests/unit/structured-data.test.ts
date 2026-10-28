import { describe, expect, it } from "vitest";
import { getFallbackSiteConfig } from "@/lib/db/fallback";
import { getProjectSchema, getRootSchemaGraph } from "@/lib/structured-data";

const site = getFallbackSiteConfig();

describe("root schema graph", () => {
  it("describes the site owner once and references them by @id", () => {
    const graph = getRootSchemaGraph(site)["@graph"];
    const people = graph.filter((node) => node["@type"] === "Person");
    const profile = graph.find((node) => node["@type"] === "ProfilePage");

    expect(people).toHaveLength(1);
    expect(profile?.mainEntity).toEqual({ "@id": people[0]!["@id"] });
  });

  it("leaves @context only on the document, not on each node", () => {
    const schema = getRootSchemaGraph(site);

    expect(schema["@context"]).toBe("https://schema.org");
    expect(schema["@graph"].some((node) => "@context" in node)).toBe(false);
  });
});

describe("project schema", () => {
  const base = {
    title: "Vantage",
    summary: "s",
    slug: "vantage",
    stack: ["Laravel", "PHP"],
  };

  it("uses SoftwareSourceCode with the repository when there is a GitHub link", () => {
    const schema = getProjectSchema(site, {
      ...base,
      links: [
        { label: "Code", href: "https://github.com/Shakeelkhan8/vantage" },
      ],
    });

    expect(schema["@type"]).toBe("SoftwareSourceCode");
    expect(schema).toHaveProperty(
      "codeRepository",
      "https://github.com/Shakeelkhan8/vantage",
    );
  });

  it("falls back to CreativeWork for private work", () => {
    const schema = getProjectSchema(site, { ...base, links: [] });

    expect(schema["@type"]).toBe("CreativeWork");
    expect(schema).not.toHaveProperty("codeRepository");
  });
});
