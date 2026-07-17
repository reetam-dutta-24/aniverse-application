/** Normalize catalog ratings to a single decimal place (e.g. 8.8, 7.6). */
export function roundRating(value: number | null | undefined): number | null {
  if (value == null || Number.isNaN(value)) return null;
  return Number(Number(value).toFixed(1));
}

/** Display helper — always one digit after the decimal. */
export function formatRating(value: number | null | undefined): string {
  const rounded = roundRating(value);
  if (rounded == null) return "—";
  return rounded.toFixed(1);
}
