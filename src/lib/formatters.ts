export function formatDateRange(
  startDate: string,
  endDate: string | null,
): string {
  const start = formatMonthYear(startDate);
  const end = endDate ? formatMonthYear(endDate) : "Present";
  return `${start} – ${end}`;
}

/**
 * Parse a date that may be a plain `YYYY-MM-DD`, an ISO datetime, or any
 * value `Date` understands. Returns `null` when it can't be parsed so callers
 * can avoid rendering "Invalid Date".
 */
function parseDate(date: string | null | undefined): Date | null {
  if (!date) return null;

  // Plain calendar date (`YYYY-MM-DD` or `YYYY-MM`): build in local time to
  // avoid timezone drift that can shift the day backwards.
  const calendarMatch = /^(\d{4})-(\d{2})(?:-(\d{2}))?$/.exec(date.trim());
  if (calendarMatch) {
    const [, year, month, day] = calendarMatch;
    const parsed = new Date(Number(year), Number(month) - 1, Number(day ?? "1"));
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function formatMonthYear(date: string): string {
  const dateObj = parseDate(date);
  if (!dateObj) return "";
  return dateObj.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export function formatDate(date: string): string {
  const dateObj = parseDate(date);
  if (!dateObj) return "";
  return dateObj.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
