export function estimateReadingTimeMinutes(html: string) {
  const text = html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!text) {
    return 1;
  }

  const words = text.split(" ").length;
  return Math.max(1, Math.ceil(words / 200));
}
