export type ReviewTargetType = "content" | "song" | "artist";

export function reviewApiPath(
  target: ReviewTargetType,
  slug: string,
): string {
  if (target === "content") return `/api/content/${slug}/reviews`;
  if (target === "song") return `/api/song/${slug}/reviews`;
  return `/api/artist/${slug}/reviews`;
}
