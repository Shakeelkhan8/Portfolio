export function formatDateRange(
  startDate: string,
  endDate: string | null,
): string {
  const start = formatMonthYear(startDate);
  const end = endDate ? formatMonthYear(endDate) : "Present";
  return `${start} – ${end}`;
}

export function formatMonthYear(date: string): string {
  const [year, month] = date.split("-");
  const dateObj = new Date(Number(year), Number(month) - 1);
  return dateObj.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export function formatDate(date: string): string {
  const [year, month, day] = date.split("-");
  const dateObj = new Date(Number(year), Number(month) - 1, Number(day ?? 1));
  return dateObj.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
