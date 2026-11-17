const WORDS_PER_MINUTE = 200;

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "2-digit",
  year: "numeric",
  timeZone: "UTC",
});

export function readingTime(html) {
  const words = String(html)
    .replace(/<[^>]+>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

export function formatDate(date) {
  return dateFormatter.format(date);
}

export function langMark(lang) {
  return String(lang).toUpperCase();
}
