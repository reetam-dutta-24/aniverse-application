export function normalizeSearchQuery(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

/** Higher score = better match. */
export function scoreSearchMatch(text: string, query: string): number {
  const hay = text.toLowerCase();
  const q = normalizeSearchQuery(query);
  if (!q) return 0;
  if (hay === q) return 100;
  if (hay.startsWith(q)) return 85;
  if (hay.includes(q)) return 70;
  const tokens = q.split(" ").filter(Boolean);
  if (tokens.length > 1 && tokens.every((t) => hay.includes(t))) return 65;
  return 0;
}

export function bestFieldScore(
  fields: (string | undefined)[],
  query: string,
): number {
  return fields.reduce(
    (best, field) => Math.max(best, field ? scoreSearchMatch(field, query) : 0),
    0,
  );
}
