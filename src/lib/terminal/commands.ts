/**
 * The /terminal page's commands, as plain functions over the portfolio's
 * public data: a typed line goes in, lines to print come out. No DOM, so
 * every command is unit-tested (tests/unit/terminal-commands.test.ts).
 *
 * Everything here is already public on the site. The phone number never
 * reaches this module: WhatsApp is a server-built wa.me link.
 */

export type TerminalProject = {
  slug: string;
  title: string;
  summary: string;
  /** "In production", "Paused", … from the project's context line, if any. */
  status: string | null;
  stack: string[];
};

export type TerminalData = {
  name: string;
  title: string;
  intro: string;
  availability: string;
  email: string;
  /** Profile links (GitHub, LinkedIn, …, WhatsApp), already public. */
  links: Array<{ label: string; href: string }>;
  resumePdf: string | null;
  projects: TerminalProject[];
  skills: Array<{ category: string; skills: string[] }>;
  experience: Array<{ role: string; company: string; period: string }>;
};

export type Line =
  | { kind: "text"; text: string; tone?: "muted" | "accent" | "error" }
  | { kind: "link"; label: string; href: string }
  | { kind: "rows"; rows: Array<{ term: string; detail: string; href?: string }> }
  | { kind: "blank" };

export type CommandResult =
  | { type: "print"; lines: Line[] }
  | { type: "clear" }
  | { type: "navigate"; href: string; lines: Line[] };

export const COMMANDS = [
  { name: "help", usage: "help", description: "List the commands" },
  { name: "whoami", usage: "whoami", description: "Who I am and whether I'm available" },
  { name: "about", usage: "about", description: "A short introduction" },
  { name: "ls", usage: "ls", description: "What you can look at" },
  { name: "projects", usage: "projects", description: "Everything I've built" },
  { name: "cat", usage: "cat <project>", description: "One project in detail, e.g. cat keystone" },
  { name: "skills", usage: "skills [group]", description: "My stack, all of it or one group" },
  { name: "experience", usage: "experience", description: "Where I've worked" },
  { name: "contact", usage: "contact", description: "How to reach me" },
  { name: "resume", usage: "resume", description: "The full resume" },
  { name: "clear", usage: "clear", description: "Clear the screen" },
  { name: "exit", usage: "exit", description: "Back to the main site" },
] as const;

/** Commands shown as buttons for people who'd rather not type. */
export const QUICK_COMMANDS = [
  "whoami",
  "projects",
  "skills",
  "experience",
  "contact",
  "help",
  "clear",
] as const;

const ALIASES: Record<string, string> = {
  open: "cat",
  "?": "help",
  cls: "clear",
  gui: "exit",
  quit: "exit",
  work: "projects",
};

const text = (value: string, tone?: "muted" | "accent" | "error"): Line =>
  tone ? { kind: "text", text: value, tone } : { kind: "text", text: value };
const blank: Line = { kind: "blank" };
const print = (...lines: Line[]): CommandResult => ({ type: "print", lines });

/** Splits "cat  keystone" into ["cat", "keystone"]; the command is lowercased. */
export function parse(input: string): { command: string; args: string[] } {
  const [first = "", ...args] = input.trim().split(/\s+/).filter(Boolean);
  const command = first.toLowerCase();
  return { command: ALIASES[command] ?? command, args };
}

function findProject(data: TerminalData, query: string) {
  const q = query.toLowerCase();
  return (
    data.projects.find((project) => project.slug === q) ??
    data.projects.find((project) => project.title.toLowerCase() === q) ??
    data.projects.find((project) => project.slug.startsWith(q))
  );
}

function findSkillGroup(data: TerminalData, query: string) {
  const q = query.toLowerCase();
  return data.skills.find((group) => group.category.toLowerCase().startsWith(q));
}

export function runCommand(input: string, data: TerminalData): CommandResult {
  const { command, args } = parse(input);
  if (!command) return print();

  switch (command) {
    case "help":
      return print(
        text("Commands", "accent"),
        { kind: "rows", rows: COMMANDS.map((c) => ({ term: c.usage, detail: c.description })) },
        blank,
        text("Tab completes, ↑ and ↓ go through what you've typed.", "muted"),
      );

    case "whoami":
      return print(
        text(`${data.name}: ${data.title}`, "accent"),
        ...(data.availability ? [text(data.availability)] : []),
      );

    case "about":
      return print(
        text(data.intro),
        blank,
        { kind: "link", label: "More on the About page", href: "/about" },
      );

    case "ls":
      return print({
        kind: "rows",
        rows: [
          { term: "projects/", detail: `${data.projects.length} case studies` },
          { term: "skills/", detail: `${data.skills.length} groups` },
          { term: "experience/", detail: `${data.experience.length} roles` },
          { term: "contact", detail: "email, LinkedIn, WhatsApp" },
          { term: "resume", detail: "the full resume" },
        ],
      });

    case "projects":
      return print(
        {
          kind: "rows",
          rows: data.projects.map((project) => ({
            term: project.slug,
            detail: project.status ? `${project.title} · ${project.status}` : project.title,
          })),
        },
        blank,
        text("Type cat <project> for one in detail, e.g. cat " + (data.projects[0]?.slug ?? "keystone"), "muted"),
      );

    case "cat": {
      if (args.length === 0) {
        return print(text("Usage: cat <project>. Type projects to list them.", "error"));
      }
      // "cat projects/keystone" works too.
      const query = args.join(" ").replace(/^projects\//, "");
      const project = findProject(data, query);
      if (!project) {
        return print(text(`cat: ${query}: no such project. Type projects to list them.`, "error"));
      }
      return print(
        text(project.title, "accent"),
        ...(project.status ? [text(project.status, "muted")] : []),
        text(project.summary),
        ...(project.stack.length ? [text(`Stack: ${project.stack.join(", ")}`, "muted")] : []),
        { kind: "link", label: "Read the case study", href: `/projects/${project.slug}` },
      );
    }

    case "skills": {
      if (args.length > 0) {
        const group = findSkillGroup(data, args.join(" "));
        if (!group) {
          return print(
            text(`skills: no group called "${args.join(" ")}".`, "error"),
            text(`Groups: ${data.skills.map((g) => g.category).join(", ")}`, "muted"),
          );
        }
        return print(text(group.category, "accent"), text(group.skills.join(", ")));
      }
      return print({
        kind: "rows",
        rows: data.skills.map((group) => ({ term: group.category, detail: group.skills.join(", ") })),
      });
    }

    case "experience":
      return print(
        {
          kind: "rows",
          rows: data.experience.map((entry) => ({
            term: entry.period,
            detail: `${entry.role}, ${entry.company}`,
          })),
        },
        blank,
        { kind: "link", label: "The full timeline", href: "/experience" },
      );

    case "contact":
      return print(
        ...(data.email ? [{ kind: "link", label: data.email, href: `mailto:${data.email}` } as Line] : []),
        ...data.links
          .filter((link) => /linkedin|whatsapp/i.test(link.label))
          .map((link): Line => ({ kind: "link", label: link.label, href: link.href })),
        { kind: "link", label: "Or write to me on the contact form", href: "/#contact" },
      );

    case "resume":
      return print(
        { kind: "link", label: "Open the resume", href: "/resume" },
        ...(data.resumePdf ? [{ kind: "link", label: "Download the PDF", href: data.resumePdf } as Line] : []),
      );

    case "clear":
      return { type: "clear" };

    case "exit":
      return { type: "navigate", href: "/", lines: [text("Back to the main site…", "muted")] };

    case "sudo":
      return print(text("Nice try. This terminal is read-only.", "error"));

    case "echo":
      return print(text(args.join(" ")));

    default:
      return print(text(`command not found: ${command}. Type help to see what's available.`, "error"));
  }
}

/**
 * Tab completion: the completed input when exactly one candidate fits,
 * otherwise the candidates to show. Completes command names, then project
 * slugs after cat/open, then skill groups after skills.
 */
export function complete(
  input: string,
  data: TerminalData,
): { value: string | null; candidates: string[] } {
  const hasArgument = /\s/.test(input.trimStart());
  if (!hasArgument) {
    const q = input.trim().toLowerCase();
    const candidates = COMMANDS.map((c) => c.name).filter((name) => name.startsWith(q));
    return candidates.length === 1
      ? { value: `${candidates[0]} `, candidates }
      : { value: null, candidates };
  }

  const { command, args } = parse(input);
  const q = args.join(" ").toLowerCase();
  const pool =
    command === "cat"
      ? data.projects.map((project) => project.slug)
      : command === "skills"
        ? data.skills.map((group) => group.category)
        : [];
  const candidates = pool.filter((item) => item.toLowerCase().startsWith(q));
  const typed = input.trimStart().split(/\s+/)[0];
  return candidates.length === 1
    ? { value: `${typed} ${candidates[0]}`, candidates }
    : { value: null, candidates };
}
