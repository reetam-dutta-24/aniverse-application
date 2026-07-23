import type { Community } from "@/types";

export const COMMUNITY_SORT_OPTIONS = [
  "Recently Updated",
  "Alphabetical",
  "Largest",
  "Newest",
] as const;

export type CommunitySortOption = (typeof COMMUNITY_SORT_OPTIONS)[number];

export function matchesCommunityGenre(
  community: Community,
  genre: string,
): boolean {
  if (genre === "All") return true;
  return community.category.toLowerCase() === genre.toLowerCase();
}

export function filterCommunitiesByGenre(
  communities: Community[],
  genre: string,
): Community[] {
  if (genre === "All") return communities;
  return communities.filter((community) =>
    matchesCommunityGenre(community, genre),
  );
}

export function sortCommunities(
  communities: Community[],
  sort: CommunitySortOption,
): Community[] {
  const copy = [...communities];

  switch (sort) {
    case "Alphabetical":
      return copy.sort((a, b) => a.name.localeCompare(b.name));
    case "Largest":
      return copy.sort((a, b) => b.memberCount - a.memberCount);
    case "Newest":
      return copy.sort(
        (a, b) => (b.createdAtTime ?? 0) - (a.createdAtTime ?? 0),
      );
    case "Recently Updated":
    default:
      return copy.sort(
        (a, b) => (b.updatedAtTime ?? 0) - (a.updatedAtTime ?? 0),
      );
  }
}

export function applyCommunityListFilters(
  communities: Community[],
  genre: string,
  sort: CommunitySortOption,
): Community[] {
  return sortCommunities(filterCommunitiesByGenre(communities, genre), sort);
}
