/** Strip leading "Episode N" prefixes so UI shows names like "Rebirth" only. */
export function formatEpisodeDisplayTitle(
  title: string,
  episodeNumber?: number,
): string {
  const trimmed = title.trim();
  if (!trimmed) return trimmed;

  const withoutPrefix = trimmed
    .replace(/^Episode\s+\d+\s*[:\-–—|·]\s*/i, "")
    .replace(/^Episode\s+\d+\s+/i, "")
    .replace(/^E\d+\s*[:\-–—|·]\s*/i, "")
    .trim();

  if (withoutPrefix) return withoutPrefix;

  if (episodeNumber != null && /^Episode\s+\d+$/i.test(trimmed)) {
    return `Episode ${episodeNumber}`;
  }

  return trimmed;
}
