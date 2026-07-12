import type { AccentColor, Community, UserSummary } from "@/types";

/**
 * Mock data layer — Community page.
 */

const accents: AccentColor[] = [
  "cyan",
  "purple",
  "pink",
  "blue",
  "green",
  "yellow",
];

export interface CommunityStats {
  joined: number;
  totalMembers: string;
  postsViewed: number;
  avgCompatibility: number;
}

export const communityGenres = [
  "All",
  "Anime",
  "Movies",
  "Shows",
  "Music",
  "Mixed",
] as const;

export const communitySorts = [
  "Recently Updated",
  "Alphabetical",
  "Largest",
  "Newest",
] as const;

const posterSlugs = [
  "death-note",
  "frieren",
  "demon-slayer",
  "jujutsu-kaisen",
  "attack-on-titan",
  "spy-x-family",
  "haikyu",
  "your-name",
  "blue-lock",
  "chainsaw-man",
  "vinland-saga",
  "oshi-no-ko",
  "classroom-of-the-elite",
  "naruto-shippuden",
  "suzume",
  "tokyo-ghoul",
  "monster",
  "code-geass",
];

const poster = (slug: string) => `/images/posters/${slug}.jpg`;

function buildCommunity(
  id: string,
  name: string,
  accent: AccentColor,
  index: number,
  opts: Partial<Community> = {},
): Community {
  return {
    id,
    name,
    category: "Anime",
    memberCount: 42000,
    postCount: 1248,
    visibility: "private",
    activityLevel: "very-active",
    avgMatchScore: 96,
    lastActiveAt: "2 hrs Ago",
    accent,
    imageUrl: poster(posterSlugs[index % posterSlugs.length]),
    ...opts,
  };
}

const favouriteCommunities: Community[] = Array.from({ length: 15 }, (_, i) =>
  buildCommunity(
    `comm-fav-${i}`,
    "Reetam Dutta's Anime Community",
    accents[i % accents.length],
    i,
    {
      visibility: i % 3 === 0 ? "public" : "private",
      memberCount: 42000 + i * 1200,
      postCount: 1248 + i * 40,
      avgMatchScore: 94 + (i % 4),
    },
  ),
);

const mostActiveCommunities: Community[] = Array.from({ length: 12 }, (_, i) =>
  buildCommunity(
    `comm-active-${i}`,
    "Reetam Dutta's Anime Community",
    accents[i % accents.length],
    i + 2,
    {
      lastActiveAt: `${1 + (i % 5)} hrs Ago`,
      memberCount: 38000 + i * 2000,
    },
  ),
);

const recommendedCommunities: Community[] = Array.from({ length: 12 }, (_, i) =>
  buildCommunity(
    `comm-rec-${i}`,
    "Reetam Dutta's Anime Community",
    accents[(i + 2) % accents.length],
    i + 4,
    {
      avgMatchScore: 90 + (i % 7),
      memberCount: 35000 + i * 1500,
    },
  ),
);

const globalCommunities: Community[] = Array.from({ length: 12 }, (_, i) =>
  buildCommunity(
    `comm-global-${i}`,
    "Global Anime Community",
    accents[i % accents.length],
    i + 6,
    {
      visibility: "public",
      createdAt: "23rd Aug, 2025",
      lastActiveAt: undefined,
      memberCount: 52000 + i * 3000,
      postCount: 2100 + i * 80,
    },
  ),
);

const mockMembers: UserSummary[] = [
  { id: "m1", name: "Reetam", avatarColor: "#ff00cc" },
  { id: "m2", name: "Riya", avatarColor: "#e5ff00" },
  { id: "m3", name: "Ravi", avatarColor: "#00ff8c" },
];

export async function getCommunityStats(): Promise<CommunityStats> {
  return {
    joined: 24,
    totalMembers: "18.4K",
    postsViewed: 1283,
    avgCompatibility: 92,
  };
}

export async function getCommunityGenres(): Promise<readonly string[]> {
  return communityGenres;
}

export async function getCommunitySorts(): Promise<readonly string[]> {
  return communitySorts;
}

export async function getFavouriteCommunities(): Promise<Community[]> {
  return favouriteCommunities;
}

export async function getMostActiveCommunities(): Promise<Community[]> {
  return mostActiveCommunities;
}

export async function getRecommendedCommunities(): Promise<Community[]> {
  return recommendedCommunities;
}

export async function getGlobalCommunities(): Promise<Community[]> {
  return globalCommunities;
}

export async function getCommunityMemberPreview(): Promise<UserSummary[]> {
  return mockMembers;
}
