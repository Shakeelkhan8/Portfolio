"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  complete,
  QUICK_COMMANDS,
  runCommand,
  type Line,
  type TerminalData,
} from "@/lib/terminal/commands";
import { cn } from "@/lib/utils";

type Entry = { id: number; command: string | null; lines: Line[] };

function Prompt({ user }: { user: string }) {
  return (
    <span aria-hidden="true" className="shrink-0 select-none">
      <span className="text-signal">{user}@portfolio</span>
      <span className="text-foreground/50">:</span>
      <span className="text-foreground/80">~</span>
      <span className="text-foreground/50">$ </span>
    </span>
  );
}

function OutputLink({ label, href }: { label: string; href: string }) {
  const className =
    "underline decoration-foreground/30 underline-offset-4 transition-colors hover:text-signal hover:decoration-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
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
            line.tone === "accent" && "font-semibold text-foreground",
            line.tone === "muted" && "text-foreground/55",
            line.tone === "error" && "text-destructive",
            !line.tone && "text-foreground/80",
          )}
        >
          {line.text}
        </p>
      );
    case "link":
      return (
        <p key={index} className="text-foreground/85">
          <span aria-hidden="true" className="text-foreground/40">→ </span>
          <OutputLink label={line.label} href={line.href} />
        </p>
      );
    case "rows":
      return (
        <dl key={index} className="grid grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-[minmax(9rem,auto)_minmax(0,1fr)]">
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
 * An interactive terminal over the portfolio's public content. Commands are
 * plain functions (src/lib/terminal/commands.ts); this renders them, keeps
 * the history (↑ ↓), completes with Tab, and offers buttons for each common
 * command. Tab only completes when there is something typed and something to
 * complete; otherwise it moves focus as usual, so keyboard users are never
 * trapped. The input is focused on load only with a mouse or trackpad, so a
 * phone keyboard doesn't open by itself.
 */
export function Terminal({ data }: { data: TerminalData }) {
  const router = useRouter();
  const user = (data.name.split(" ")[0] || "guest").toLowerCase();
  const [entries, setEntries] = useState<Entry[]>(() => [
    {
      id: 0,
      command: null,
      lines: [
        { kind: "text", text: `${data.name}: ${data.title}`, tone: "accent" },
        {
          kind: "text",
          text: "Type help to list commands, or pick one below. Type exit to go back.",
          tone: "muted",
        },
      ],
    },
  ]);
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
    setEntries((current) => [...current, { id: nextId.current++, command, lines }]);
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
    push(command, result.lines);
    if (result.type === "navigate") {
      window.setTimeout(() => router.push(result.href), 350);
    }
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
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-foreground/10 bg-black/40 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)]">
      <div className="flex items-center gap-3 border-b border-foreground/10 px-4 py-3">
        <span aria-hidden="true" className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-foreground/15" />
          <span className="size-2.5 rounded-full bg-foreground/15" />
          <span className="size-2.5 rounded-full bg-foreground/15" />
        </span>
        <span className="truncate font-mono text-xs text-foreground/55">{user}@portfolio: ~</span>
        <Link
          href="/"
          className="ml-auto inline-flex min-h-8 items-center gap-1.5 rounded-full border border-foreground/15 px-3 text-xs font-medium text-foreground/80 transition-colors hover:border-foreground/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ArrowLeft aria-hidden="true" className="size-3.5" />
          Back to the site
        </Link>
      </div>

      <div
        role="group"
        aria-label="Quick commands"
        className="flex flex-wrap gap-2 border-b border-foreground/10 px-4 py-3"
      >
        {QUICK_COMMANDS.map((command) => (
          <button
            key={command}
            type="button"
            onClick={() => {
              run(command);
              inputRef.current?.focus({ preventScroll: true });
            }}
            className="min-h-8 rounded-full border border-foreground/12 px-3 font-mono text-xs text-foreground/75 transition-colors hover:border-signal/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {command}
          </button>
        ))}
      </div>

      <div
        ref={outputRef}
        role="log"
        aria-label="Terminal output"
        className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4 font-mono text-[13px] leading-relaxed sm:px-5"
        onClick={(event) => {
          // Clicking empty space focuses the prompt; don't steal link clicks.
          if ((event.target as HTMLElement).closest("a, button")) return;
          if (!window.getSelection()?.toString()) inputRef.current?.focus({ preventScroll: true });
        }}
      >
        {entries.map((entry) => (
          <div key={entry.id} className="space-y-1">
            {entry.command !== null ? (
              <p className="flex flex-wrap">
                <Prompt user={user} />
                <span className="text-foreground">{entry.command}</span>
              </p>
            ) : null}
            {entry.lines.map(renderLine)}
          </div>
        ))}
      </div>

      <form
        className="flex items-center gap-1 border-t border-foreground/10 px-4 py-3 font-mono text-[13px] sm:px-5"
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
          placeholder="type help"
          className="min-w-0 flex-1 bg-transparent text-foreground caret-signal outline-none placeholder:text-foreground/30"
        />
      </form>
    </div>
  );
}
