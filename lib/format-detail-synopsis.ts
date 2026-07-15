/** Fixed word count keeps the detail hero layout consistent across all content. */
export const DETAIL_SYNOPSIS_WORDS = 52;

export function formatDetailSynopsis(raw: string): string {
  const words = raw.trim().split(/\s+/).filter(Boolean);
  if (words.length <= DETAIL_SYNOPSIS_WORDS) return words.join(" ");
  return `${words.slice(0, DETAIL_SYNOPSIS_WORDS).join(" ")}…`;
}
