/**
 * Hero scroll hint: "Scroll" with a mouse pointer, "Swipe up" on touch.
 * The dot's loop is a CSS animation (`.scroll-cue-dot`), so the compositor
 * runs it without a JavaScript frame loop; reduced motion stops it.
 */
export function ScrollCue() {
  return (
    <div className="flex flex-col items-center gap-2" aria-hidden="true">
      <div className="relative flex h-10 w-14 flex-col items-center rounded-md border border-foreground/35">
        <div className="flex h-6 w-full items-center justify-center border-b border-foreground/20">
          <span className="h-px w-3.5 rounded-full bg-foreground/45" />
        </div>
        <div className="relative flex h-4 w-full items-center justify-center">
          <span className="scroll-cue-dot absolute size-1 rounded-full bg-foreground/75" />
        </div>
      </div>
      <span className="text-[11px] font-medium tracking-[0.18em] text-foreground/55 uppercase">
        <span className="pointer-fine:hidden">Swipe up</span>
        <span className="hidden pointer-fine:inline">Scroll</span>
      </span>
    </div>
  );
}
