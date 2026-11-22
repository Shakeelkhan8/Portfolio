"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  complete,
  QUICK_COMMANDS,
  runCommand,
  type Line,
  type TerminalData,
} from "@/lib/terminal/commands";
import { cn } from "@/lib/utils";

type Entry =
  | { id: number; kind: "welcome" }
  | { id: number; kind: "output"; command: string | null; lines: Line[] };

function Prompt({ user }: { user: string }) {
  return (
    <span aria-hidden="true" className="shrink-0 select-none">
      <span className="text-emerald-400">{user}</span>
      <span className="text-foreground/60">@portfolio</span>
      <span className="text-foreground/60">:</span>
      <span className="text-sky-400">~</span>
      {/* A non-breaking space: a trailing space collapses in the flex row. */}
      <span className="text-foreground/60">${" "}</span>
    </span>
  );
}

function OutputLink({ label, href }: { label: string; href: string }) {
  const className =
    "text-sky-300 underline decoration-sky-300/30 underline-offset-4 transition-colors hover:text-sky-200 hover:decoration-sky-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={className}>
        {label}
      </Link>
    );
  }
  const newTab = href.startsWith("http");
  return (
    <a
      href={href}
      className={className}
      {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {label}
      {newTab ? <span className="sr-only"> (opens in a new tab)</span> : null}
    </a>
  );
}

function renderLine(line: Line, index: number) {
  switch (line.kind) {
    case "text":
      return (
        <p
          key={index}
          className={cn(
            "whitespace-pre-wrap",
            line.tone === "accent" && "font-semibold text-signal",
            line.tone === "muted" && "text-foreground/60",
            line.tone === "error" && "text-red-400",
            !line.tone && "text-foreground/85",
          )}
        >
          {line.text}
        </p>
      );
    case "link":
      return (
        <p key={index}>
          <span aria-hidden="true" className="text-foreground/60">→ </span>
          <OutputLink label={line.label} href={line.href} />
        </p>
      );
    case "rows":
      return (
        <dl
          key={index}
          className="grid grid-cols-1 gap-x-8 gap-y-1 sm:grid-cols-[minmax(10rem,auto)_minmax(0,1fr)]"
        >
          {line.rows.map((row) => (
            <div key={row.term} className="contents">
              <dt className="text-signal">{row.term}</dt>
              <dd className="mb-1.5 text-foreground/75 sm:mb-0">{row.detail}</dd>
            </div>
          ))}
        </dl>
      );
    case "blank":
      return <div key={index} aria-hidden="true" className="h-3" />;
  }
}

/**
 * The opening screen, in the style of neofetch: a ">_" mark beside the
 * essentials (who, role, availability, core stack, how many projects, how
 * to reach me), then a few commands to try.
 */
function Welcome({
  data,
  user,
  onRun,
}: {
  data: TerminalData;
  user: string;
  onRun: (command: string) => void;
}) {
  const stack = data.skills.slice(0, 3).flatMap((group) => group.skills.slice(0, 2));
  const rows: Array<[string, string]> = [
    ["Name", data.name],
    ["Role", data.title],
    ...(data.availability ? ([["Status", data.availability]] as Array<[string, string]>) : []),
    ...(stack.length ? ([["Stack", stack.join(", ")]] as Array<[string, string]>) : []),
    ["Projects", `${data.projects.length} case studies (type projects)`],
    ...(data.email ? ([["Contact", `${data.email} (type contact)`]] as Array<[string, string]>) : []),
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-10">
        {/* Box-drawing ASCII art fell back to a blurry blob in the mono
            font, so the mark is plain ">_" text, set large. */}
        <span
          aria-hidden="true"
          className="hidden shrink-0 bg-gradient-to-b from-signal to-signal/40 bg-clip-text pr-2 font-mono text-7xl leading-none font-bold text-transparent select-none sm:block"
        >
          &gt;_
        </span>
        <div className="min-w-0 space-y-1">
          <p>
            <span className="font-semibold text-emerald-400">{user}</span>
            <span className="text-foreground/60">@</span>
            <span className="font-semibold text-sky-400">portfolio</span>
          </p>
          <div aria-hidden="true" className="my-1.5 h-px w-40 bg-foreground/20" />
          <dl className="space-y-0.5">
            {rows.map(([term, detail]) => (
              <div key={term} className="flex gap-3">
                <dt className="w-20 shrink-0 font-semibold text-signal">{term}</dt>
                <dd className="min-w-0 text-foreground/85">
                  {term === "Status" ? (
                    <span aria-hidden="true" className="mr-2 inline-block size-2 rounded-full bg-emerald-400 align-middle" />
                  ) : null}
                  {detail}
                </dd>
              </div>
            ))}
          </dl>
          <p aria-hidden="true" className="flex gap-1 pt-3">
            {["bg-red-400", "bg-amber-300", "bg-emerald-400", "bg-sky-400", "bg-violet-400", "bg-signal"].map(
              (color) => (
                <span key={color} className={cn("h-3 w-6 rounded-sm", color)} />
              ),
            )}
          </p>
        </div>
      </div>
      <p className="text-foreground/60">
        Type <span className="text-foreground">help</span> for every command, or try{" "}
        {["whoami", "projects", `cat ${data.projects[0]?.slug ?? "keystone"}`].map((command, index) => (
          <span key={command}>
            {index > 0 ? ", " : ""}
            <button
              type="button"
              onClick={() => onRun(command)}
              className="rounded text-sky-300 underline decoration-sky-300/30 underline-offset-4 hover:text-sky-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {command}
            </button>
          </span>
        ))}
        .
      </p>
    </div>
  );
}

/**
 * An interactive terminal over the portfolio's public content. Commands are
 * plain functions (src/lib/terminal/commands.ts); this renders them, keeps
 * the history (↑ ↓), completes with Tab, and offers key-style buttons for
 * the common commands. Tab only completes when there is something typed and
 * something to complete; otherwise it moves focus as usual, so keyboard
 * users are never trapped. The input is focused on load only with a mouse
 * or trackpad, so a phone keyboard doesn't open by itself.
 */
export function Terminal({ data }: { data: TerminalData }) {
  const router = useRouter();
  const user = (data.name.split(" ")[0] || "guest").toLowerCase();
  const [entries, setEntries] = useState<Entry[]>([{ id: 0, kind: "welcome" }]);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState<number | null>(null);
  const nextId = useRef(1);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const output = outputRef.current;
    if (output) output.scrollTop = output.scrollHeight;
  }, [entries]);

  useEffect(() => {
    if (window.matchMedia("(pointer: fine)").matches) {
      inputRef.current?.focus({ preventScroll: true });
    }
  }, []);

  function push(command: string | null, lines: Line[]) {
    setEntries((current) => [...current, { id: nextId.current++, kind: "output", command, lines }]);
  }

  function run(command: string) {
    const typed = command.trim();
    if (typed) setHistory((current) => [...current, typed]);
    setCursor(null);
    setValue("");
    const result = runCommand(command, data);
    if (result.type === "clear") {
      setEntries([]);
      return;
    }
    if (result.type === "welcome") {
      push(command, []);
      setEntries((current) => [...current, { id: nextId.current++, kind: "welcome" }]);
      return;
    }
    push(command, result.lines);
    if (result.type === "navigate") {
      window.setTimeout(() => router.push(result.href), 350);
    }
  }

  function runAndFocus(command: string) {
    run(command);
    inputRef.current?.focus({ preventScroll: true });
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowUp") {
      if (history.length === 0) return;
      event.preventDefault();
      const next = cursor === null ? history.length - 1 : Math.max(0, cursor - 1);
      setCursor(next);
      setValue(history[next]);
    } else if (event.key === "ArrowDown") {
      if (cursor === null) return;
      event.preventDefault();
      const next = cursor + 1;
      if (next >= history.length) {
        setCursor(null);
        setValue("");
      } else {
        setCursor(next);
        setValue(history[next]);
      }
    } else if (event.key === "Tab" && !event.shiftKey && value.trim()) {
      const { value: completed, candidates } = complete(value, data);
      if (completed) {
        event.preventDefault();
        setValue(completed);
      } else if (candidates.length > 1) {
        event.preventDefault();
        push(value, [{ kind: "text", text: candidates.join("   "), tone: "muted" }]);
      }
    } else if (event.key === "l" && event.ctrlKey) {
      event.preventDefault();
      setEntries([]);
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-foreground/12 bg-[#0a0908] shadow-[0_40px_100px_-40px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.04)]">
      <div className="relative flex items-center border-b border-foreground/10 bg-foreground/[0.025] px-4 py-3">
        <span aria-hidden="true" className="flex gap-2">
          <span className="size-3 rounded-full bg-[#ff5f57]" />
          <span className="size-3 rounded-full bg-[#febc2e]" />
          <span className="size-3 rounded-full bg-[#28c840]" />
        </span>
        <span className="pointer-events-none absolute inset-x-0 text-center font-mono text-xs text-foreground/60">
          {user}@portfolio: ~
        </span>
      </div>

      <div
        ref={outputRef}
        role="log"
        aria-label="Terminal output"
        className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-5 font-mono text-[13px] leading-relaxed sm:px-6 sm:text-sm"
        onClick={(event) => {
          // Clicking empty space focuses the prompt; don't steal link clicks.
          if ((event.target as HTMLElement).closest("a, button")) return;
          if (!window.getSelection()?.toString()) inputRef.current?.focus({ preventScroll: true });
        }}
      >
        {entries.map((entry) =>
          entry.kind === "welcome" ? (
            <Welcome key={entry.id} data={data} user={user} onRun={runAndFocus} />
          ) : (
            <div key={entry.id} className="space-y-1">
              {entry.command !== null ? (
                <p className="flex flex-wrap">
                  <Prompt user={user} />
                  <span className="text-foreground">{entry.command}</span>
                </p>
              ) : null}
              {entry.lines.map(renderLine)}
            </div>
          ),
        )}
      </div>

      <div className="border-t border-foreground/10 bg-foreground/[0.02]">
        <div
          role="group"
          aria-label="Quick commands"
          className="flex flex-wrap items-center gap-1.5 px-5 pt-3 sm:px-6"
        >
          <span aria-hidden="true" className="mr-1 font-mono text-[11px] tracking-wider text-foreground/60 uppercase">
            Try
          </span>
          {QUICK_COMMANDS.map((command) => (
            <button
              key={command}
              type="button"
              onClick={() => runAndFocus(command)}
              className="min-h-7 rounded-md border border-b-2 border-foreground/15 bg-foreground/[0.04] px-2.5 font-mono text-xs text-foreground/80 transition-colors hover:border-signal/50 hover:text-foreground active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {command}
            </button>
          ))}
        </div>
        <form
          className="mx-3 mb-3 flex items-center gap-1 rounded-lg px-2 py-2.5 font-mono text-[13px] ring-1 ring-transparent ring-inset transition-[background-color,box-shadow] focus-within:bg-foreground/[0.04] focus-within:ring-signal/35 sm:mx-4 sm:text-sm"
          onSubmit={(event) => {
            event.preventDefault();
            run(value);
          }}
        >
          <label htmlFor="terminal-input" className="sr-only">
            Terminal command
          </label>
          <Prompt user={user} />
          <input
            ref={inputRef}
            id="terminal-input"
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
              setCursor(null);
            }}
            onKeyDown={onKeyDown}
            autoComplete="off"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="go"
            placeholder="type a command"
            // The global :focus-visible outline is unlayered and beat a plain
            // utility; the form's focus ring shows focus instead.
            className="min-w-0 flex-1 bg-transparent text-foreground caret-signal outline-none! placeholder:text-foreground/30"
          />
        </form>
      </div>
    </div>
  );
}
