import type {
  Collection,
  Community,
  ContentItem,
  StatMetric,
  UserSummary,
} from "@/types";

/**
 * Data layer for the landing page.
 *
 * Every accessor is async and currently resolves static mock data. When the
 * backend/database is ready, replace only the function bodies (Prisma,
 * Drizzle, fetch, etc.) — the UI components consuming these functions will
 * not need to change.
 */

export interface LandingFeature {
  title: string;
  body: string;
}

const features: LandingFeature[] = [
  {
    title: "✨ AI Match",
    body: "Get content, songs, artists, and communities matched to your taste.",
  },
  {
    title: "🎧 Music Hub",
    body: "Find OSTs, K-pop, J-pop, artists, albums, and playlists.",
  },
  {
    title: "🎬 Discover",
    body: "Explore anime, movies, shows, K-dramas, and trending titles.",
  },
  {
    title: "📁 Collections",
    body: "Organize your favorites into smart personal collections.",
  },
  {
    title: "💬 Communities",
    body: "Join fandoms, chats, watch rooms, and discussions.",
  },
  {
    title: "📊 Analytics",
    body: "Track your watching, listening, genres, and taste patterns.",
  },
  {
    title: "🎯 Watchlist",
    body: "Save anime, shows, movies, and songs you want to explore later.",
  },
  {
    title: "👤 Taste Profile",
    body: "Build a personalized profile from your watching, listening, and community activity.",
  },
];

const spotlightContent: ContentItem = {
  id: "jjk",
  title: "Jujutsu Kaisen",
  type: "anime",
  imageUrl: "/images/poster-jjk.png",
  genres: [
    { id: "action", label: "Action" },
    { id: "thriller", label: "Thriller" },
  ],
  matchScore: 93,
  description:
    "A dark action anime where cursed energy, brutal battles, and powerful sorcerers collide as a student is pulled into a world .....",
  meta: "4 Seasons",
  year: 2019,
};

const spotlightMusic: ContentItem = {
  id: "swim",
  title: "Swim",
  type: "song",
  imageUrl: "/images/album-swim.png",
  genres: [{ id: "english", label: "English" }],
  rating: 9.2,
  matchScore: 87,
  meta: "Chase Atlantic",
};

const featuredCommunity: Community = {
  id: "reetam",
  name: "Reetam Dutta’s Anime Community",
  category: "Anime",
  memberCount: 42000,
  postCount: 1248,
  visibility: "private",
  activityLevel: "very-active",
  avgMatchScore: 96,
  lastActiveAt: "2 hrs Ago",
  accent: "cyan",
};

const featuredCommunityMembers: UserSummary[] = [
  { id: "r1", name: "Reetam" },
  { id: "r2", name: "Ria" },
  { id: "r3", name: "Rahul" },
];

const featuredCollection: Collection = {
  id: "music-playlist",
  name: "Music Playlist",
  itemCount: 42,
  favoriteCount: 16,
  description: "The greatest anime I've ever watched.",
  visibility: "public",
  createdAt: "10 Jan, 2026",
  updatedAt: "2 hrs ago",
  accent: "blue",
};

const trendingCommunities: Community[] = [
  {
    id: "twice",
    name: "TWICE Fanverse",
    category: "Kpop",
    memberCount: 42000,
    postCount: 1248,
    visibility: "public",
    activityLevel: "very-active",
    avgMatchScore: 96,
    createdAt: "23rd Aug, 2025",
    accent: "yellow",
  },
  {
    id: "money-heist",
    name: "Money Heist Fanclub",
    category: "Show",
    memberCount: 30000,
    postCount: 1248,
    visibility: "public",
    activityLevel: "active",
    avgMatchScore: 96,
    createdAt: "23rd Aug, 2025",
    accent: "green",
  },
  {
    id: "pop-lounge",
    name: "Pop Music Lounge",
    category: "Pop",
    memberCount: 55000,
    postCount: 1248,
    visibility: "public",
    activityLevel: "active",
    avgMatchScore: 96,
    createdAt: "23rd Aug, 2025",
    accent: "cyan",
  },
  {
    id: "global-anime",
    name: "Global Anime Community",
    category: "Anime",
    memberCount: 40000,
    postCount: 1248,
    visibility: "public",
    activityLevel: "moderate",
    avgMatchScore: 96,
    createdAt: "23rd Aug, 2025",
    accent: "purple",
  },
];

const tasteStats: StatMetric[] = [
  { id: "watched", label: "Content Watched", value: "186" },
  { id: "listened", label: "Music Listened", value: "214 h" },
  { id: "communities", label: "Communities Joined", value: "24" },
  { id: "collections", label: "Collections Created", value: "18" },
];

export async function getLandingFeatures(): Promise<LandingFeature[]> {
  return features;
}

export async function getSpotlightContent(): Promise<{
  content: ContentItem;
  music: ContentItem;
}> {
  return { content: spotlightContent, music: spotlightMusic };
}

export async function getFeaturedCommunity(): Promise<{
  community: Community;
  members: UserSummary[];
}> {
  return { community: featuredCommunity, members: featuredCommunityMembers };
}

export async function getFeaturedCollection(): Promise<Collection> {
  return featuredCollection;
}

export async function getTrendingCommunities(): Promise<Community[]> {
  return trendingCommunities;
}

export async function getTasteStats(): Promise<StatMetric[]> {
  return tasteStats;
}
