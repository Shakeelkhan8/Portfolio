import { describe, expect, it } from "vitest";
import {
  COMMANDS,
  complete,
  parse,
  runCommand,
  type CommandResult,
  type Line,
  type TerminalData,
} from "@/lib/terminal/commands";

const data: TerminalData = {
  name: "Shakeel Khan",
  title: "Full Stack Developer & Software Engineer",
  intro: "I design, build and ship production software.",
  availability: "Open to full-time and remote roles.",
  email: "hello@example.com",
  links: [
    { label: "GitHub", href: "https://github.com/example" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/example" },
    { label: "WhatsApp", href: "https://wa.me/920000000000" },
  ],
  resumePdf: "/files/resume.pdf",
  projects: [
    {
      slug: "keystone",
      title: "Keystone",
      summary: "Subscriber automation for small ISPs.",
      status: "Paused",
      stack: ["Go", "PostgreSQL 16"],
    },
    {
      slug: "vantage",
      title: "Vantage",
      summary: "A job-hunting engine.",
      status: null,
      stack: ["Laravel 13"],
    },
  ],
  skills: [
    { category: "Languages", skills: ["TypeScript", "PHP 8.4"] },
    { category: "Payments and integrations", skills: ["Stripe"] },
  ],
  experience: [
    { role: "Full Stack Developer", company: "Elityx", period: "Nov 2025 – Present" },
  ],
};

/** Everything a result would print, as plain text. */
function printed(result: CommandResult): string {
  const lines: Line[] = result.type === "clear" ? [] : result.lines;
  return lines
    .map((line) => {
      if (line.kind === "text") return line.text;
      if (line.kind === "link") return `${line.label} -> ${line.href}`;
      if (line.kind === "rows") return line.rows.map((row) => `${row.term} ${row.detail}`).join("\n");
      return "";
    })
    .join("\n");
}

function links(result: CommandResult) {
  return result.type === "clear"
    ? []
    : result.lines.flatMap((line) => (line.kind === "link" ? [line.href] : []));
}

describe("terminal commands", () => {
  it("parses commands case-insensitively and resolves aliases", () => {
    expect(parse("  CAT   keystone ")).toEqual({ command: "cat", args: ["keystone"] });
    expect(parse("open vantage")).toEqual({ command: "cat", args: ["vantage"] });
    expect(parse("")).toEqual({ command: "", args: [] });
  });

  it("help lists every command", () => {
    const out = printed(runCommand("help", data));
    for (const command of COMMANDS) expect(out).toContain(command.usage);
  });

  it("whoami says who and whether available, never where", () => {
    // Location is a private site field (src/lib/public-site.ts).
    expect(printed(runCommand("whoami", data))).toBe(
      "Shakeel Khan: Full Stack Developer & Software Engineer\nOpen to full-time and remote roles.",
    );
  });

  it("projects lists slugs with title and status", () => {
    const out = printed(runCommand("projects", data));
    expect(out).toContain("keystone Keystone · Paused");
    expect(out).toContain("vantage Vantage");
  });

  it("cat shows a project and links its case study", () => {
    const result = runCommand("cat keystone", data);
    expect(printed(result)).toContain("Subscriber automation for small ISPs.");
    expect(printed(result)).toContain("Stack: Go, PostgreSQL 16");
    expect(links(result)).toEqual(["/projects/keystone"]);
    // By title, by prefix, and with a projects/ path.
    expect(links(runCommand("cat Vantage", data))).toEqual(["/projects/vantage"]);
    expect(links(runCommand("cat key", data))).toEqual(["/projects/keystone"]);
    expect(links(runCommand("cat projects/vantage", data))).toEqual(["/projects/vantage"]);
  });

  it("cat explains itself when the project is missing or unknown", () => {
    expect(printed(runCommand("cat", data))).toMatch(/Usage: cat <project>/);
    expect(printed(runCommand("cat nothing", data))).toMatch(/no such project/);
  });

  it("skills shows all groups, or one by prefix", () => {
    expect(printed(runCommand("skills", data))).toContain("Languages TypeScript, PHP 8.4");
    expect(printed(runCommand("skills pay", data))).toBe("Payments and integrations\nStripe");
    expect(printed(runCommand("skills cooking", data))).toMatch(/no group called "cooking"/);
  });

  it("contact links email, LinkedIn and WhatsApp, and the form", () => {
    expect(links(runCommand("contact", data))).toEqual([
      "mailto:hello@example.com",
      "https://www.linkedin.com/in/example",
      "https://wa.me/920000000000",
      "/#contact",
    ]);
  });

  it("resume links the page and the PDF", () => {
    expect(links(runCommand("resume", data))).toEqual(["/resume", "/files/resume.pdf"]);
    expect(links(runCommand("resume", { ...data, resumePdf: null }))).toEqual(["/resume"]);
  });

  it("clear clears and exit goes back to the site", () => {
    expect(runCommand("clear", data)).toEqual({ type: "clear" });
    expect(runCommand("cls", data)).toEqual({ type: "clear" });
    expect(runCommand("exit", data)).toMatchObject({ type: "navigate", href: "/" });
  });

  it("unknown input prints a hint and never throws", () => {
    expect(printed(runCommand("rm -rf /", data))).toBe(
      "command not found: rm. Type help to see what's available.",
    );
    expect(printed(runCommand("sudo make me a sandwich", data))).toMatch(/read-only/);
    expect(runCommand("   ", data)).toEqual({ type: "print", lines: [] });
  });

  it("never prints a phone number other than inside the wa.me link", () => {
    const everything = COMMANDS.map((c) => printed(runCommand(c.name, data))).join("\n");
    expect(everything.replace(/https:\/\/wa\.me\/\d+/g, "")).not.toMatch(/\d{9,}/);
  });
});

describe("terminal completion", () => {
  it("completes a unique command", () => {
    expect(complete("who", data)).toEqual({ value: "whoami ", candidates: ["whoami"] });
  });

  it("lists candidates when more than one fits", () => {
    expect(complete("c", data)).toEqual({ value: null, candidates: ["cat", "contact", "clear"] });
  });

  it("completes project slugs after cat or open", () => {
    expect(complete("cat ke", data).value).toBe("cat keystone");
    expect(complete("open va", data).value).toBe("open vantage");
    expect(complete("cat ", data).candidates).toEqual(["keystone", "vantage"]);
  });

  it("completes skill groups after skills", () => {
    expect(complete("skills pay", data).value).toBe("skills Payments and integrations");
  });

  it("offers nothing for arguments it doesn't know", () => {
    expect(complete("echo he", data)).toEqual({ value: null, candidates: [] });
  });
});
