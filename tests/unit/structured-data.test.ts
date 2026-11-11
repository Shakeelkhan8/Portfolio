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

  /*
   * Regression: the Person node carried the legal name and a PostalAddress
   * (city, country) on every page, after the privacy fix had removed those
   * fields from everything else the page ships.
   */
  it("keeps the legal name and location out of the page", () => {
    const json = JSON.stringify(getRootSchemaGraph(site));

    for (const value of [site.legalName, site.city, site.location]) {
      if (value) expect(json).not.toContain(value);
    }
    expect(json).not.toContain("PostalAddress");
  });

  // sameAs is how search engines tie the profiles to one person; the Upwork
  // profile was configured but missing from it.
  it("lists every configured profile in sameAs", () => {
    const person = getRootSchemaGraph(site)["@graph"].find(
      (node) => node["@type"] === "Person",
    );

    expect(person?.sameAs).toEqual([
      "https://github.com/Shakeelkhan8",
      "https://www.linkedin.com/in/shakeelkhan8",
      "https://www.upwork.com/freelancers/~01414f35cd2f50292d",
    ]);
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
