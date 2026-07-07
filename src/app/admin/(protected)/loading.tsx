export default function AdminLoading() {
  return (
    <div
      className="flex min-h-[50vh] items-center justify-center"
      role="status"
      aria-live="polite"
    >
      <span className="size-6 animate-spin rounded-full border-2 border-border border-t-primary" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
