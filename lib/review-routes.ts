export type ReviewTargetType = "content" | "song" | "artist" | "community";

export function reviewApiPath(
  target: ReviewTargetType,
  slug: string,
): string {
  if (target === "content") return `/api/content/${slug}/reviews`;
  if (target === "song") return `/api/song/${slug}/reviews`;
  if (target === "artist") return `/api/artist/${slug}/reviews`;
  return `/api/communities/${slug}/reviews`;
}
