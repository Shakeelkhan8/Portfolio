export function parseMonthDate(value: string): string {
  const [year, month] = value.split("-");
  return `${year}-${month.padStart(2, "0")}-01`;
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
