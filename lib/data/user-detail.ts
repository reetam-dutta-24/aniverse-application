import type {
  Collection,
  Community,
  ContentItem,
  MusicTrack,
  ProfileRecentActivityItem,
  Review,
  UserProfileDetail,
} from "@/types";
import { normalizeProfileSlug } from "@/lib/profile-routes";
import {
  getContinueListening,
  getContinueWatching,
  getMusicForYourTaste,
  getRecommendedForYou,
  getTrendingMusic,
  getTrendingThisWeek,
} from "@/lib/data/discover";
import { getRecommendedCommunities } from "@/lib/data/community";

/**
 * Mock data layer — user profile detail (`/profile/[userid]`).
 */

const g = (id: string, label: string) => ({ id, label });
const poster = (slug: string) => `/images/posters/${slug}.jpg`;
const portrait = "/images/hero-1.png";

const reetamAuthor = {
  id: "user-1",
  name: "Reetam Dutta",
  avatarColor: "#ffd000",
};

const profileReviews: Review[] = [
  {
    id: "pr-1",
    author: reetamAuthor,
    rating: 10,
    headline: "JJK Season 2 changed everything",
    content:
      "The Shibuya arc animation is unreal. Every episode felt like a movie — MAPPA outdid themselves and the OST hits at every emotional beat.",
    likeCount: 2840,
    createdAt: "8 Jan, 2026",
    accent: "cyan",
  },
  {
    id: "pr-2",
    author: reetamAuthor,
    rating: 9,
    headline: "FANCY is peak TWICE",
    content:
      "Still on repeat years later. The production, the choreography, the bridge — this is the song that made me dive deep into K-pop.",
    likeCount: 1920,
    createdAt: "14 Jan, 2026",
    accent: "pink",
  },
  {
    id: "pr-3",
    author: reetamAuthor,
    rating: 9,
    headline: "Death Note holds up perfectly",
    content:
      "Rewatched the full series and the cat-and-mouse tension between Light and L is still unmatched. A true thriller masterpiece.",
    likeCount: 1560,
    createdAt: "22 Jan, 2026",
    accent: "yellow",
  },
  {
    id: "pr-4",
    author: reetamAuthor,
    rating: 8,
    headline: "Spy x Family is comfort anime",
    content:
      "Wholesome, funny, and surprisingly heartfelt. Anya carries every scene and the Bond episodes are genuinely moving.",
    likeCount: 980,
    createdAt: "2 Feb, 2026",
    accent: "green",
  },
  {
    id: "pr-5",
    author: reetamAuthor,
    rating: 10,
    headline: "Demon Slayer Mugen Train still hits",
    content:
      "Rengoku's final moments get me every time. The flame motif, the score, the animation — cinema-level storytelling.",
    likeCount: 2140,
    createdAt: "9 Feb, 2026",
    accent: "purple",
  },
];

const profileCollections: Collection[] = [
  {
    id: "anime-masterpieces",
    name: "Anime Masterpieces",
    description: "The shows that defined my taste.",
    itemCount: 42,
    favoriteCount: 18,
    visibility: "public",
    createdAt: "5 Jan, 2026",
    accent: "cyan",
    imageUrl: poster("death-note"),
  },
  {
    id: "kpop-essentials",
    name: "K-Pop Magic",
    description: "TWICE, NewJeans, and everything in between.",
    itemCount: 48,
    favoriteCount: 22,
    visibility: "public",
    createdAt: "10 Jan, 2026",
    accent: "pink",
    imageUrl: "/images/artists/twice.jpg",
  },
  {
    id: "profile-col-3",
    name: "Late Night OSTs",
    description: "Soundtracks for midnight sessions.",
    itemCount: 31,
    favoriteCount: 11,
    visibility: "public",
    createdAt: "18 Jan, 2026",
    accent: "purple",
    imageUrl: poster("demon-slayer"),
  },
  {
    id: "profile-col-4",
    name: "Weekend Binge",
    description: "Movies and shows for long sessions.",
    itemCount: 24,
    favoriteCount: 9,
    visibility: "private",
    createdAt: "25 Jan, 2026",
    accent: "blue",
    imageUrl: poster("your-name"),
  },
];

const topArtists: ContentItem[] = [
  {
    id: "twice",
    title: "TWICE",
    type: "artist",
    genres: [g("kpop", "K-Pop"), g("pop", "Pop")],
    rating: 9.4,
    matchScore: 97,
    imageUrl: "/images/artists/twice.jpg",
    meta: "Girl Group",
  },
  {
    id: "charlie-puth",
    title: "Charlie Puth",
    type: "artist",
    genres: [g("pop", "Pop"), g("rnb", "R&B")],
    rating: 8.8,
    matchScore: 88,
    imageUrl: poster("jujutsu-kaisen"),
    meta: "Solo Artist",
  },
  {
    id: "newjeans",
    title: "NewJeans",
    type: "artist",
    genres: [g("kpop", "K-Pop")],
    rating: 9.2,
    matchScore: 94,
    imageUrl: poster("spy-x-family"),
    meta: "Girl Group",
  },
  {
    id: "justin-bieber",
    title: "Justin Bieber",
    type: "artist",
    genres: [g("pop", "Pop")],
    rating: 8.5,
    matchScore: 82,
    imageUrl: poster("blue-lock"),
    meta: "Solo Artist",
  },
  {
    id: "the-weeknd",
    title: "The Weeknd",
    type: "artist",
    genres: [g("rnb", "R&B"), g("pop", "Pop")],
    rating: 9.0,
    matchScore: 90,
    imageUrl: poster("chainsaw-man"),
    meta: "Solo Artist",
  },
];

const likedAlbums: MusicTrack[] = [
  {
    id: "twice-album-fancy-you",
    title: "FANCY YOU",
    artist: "TWICE",
    kind: "album",
    language: "Kpop",
    rating: 9.2,
    matchScore: 94,
    imageUrl: poster("jujutsu-kaisen"),
  },
  {
    id: "album-feel-special",
    title: "Feel Special",
    artist: "TWICE",
    kind: "album",
    language: "Kpop",
    rating: 9.0,
    matchScore: 92,
    imageUrl: poster("demon-slayer"),
  },
  {
    id: "album-eyes-wide-open",
    title: "Eyes Wide Open",
    artist: "TWICE",
    kind: "album",
    language: "Kpop",
    rating: 8.9,
    matchScore: 91,
    imageUrl: poster("spy-x-family"),
  },
  {
    id: "album-formula-of-love",
    title: "Formula of Love",
    artist: "TWICE",
    kind: "album",
    language: "Kpop",
    rating: 9.1,
    matchScore: 93,
    imageUrl: poster("death-note"),
  },
  {
    id: "album-between-1-and-2",
    title: "Between 1&2",
    artist: "TWICE",
    kind: "album",
    language: "Kpop",
    rating: 9.3,
    matchScore: 95,
    imageUrl: poster("attack-on-titan"),
  },
];

const recentActivityItems: ProfileRecentActivityItem[] = [
  {
    kind: "content",
    item: {
      id: "demon-slayer",
      title: "Demon Slayer",
      type: "anime",
      imageUrl: poster("demon-slayer"),
      genres: [g("fantasy", "Fantasy"), g("action", "Action")],
      rating: 8.9,
      matchScore: 91,
      meta: "4 Seasons",
      year: 2019,
    },
  },
  {
    kind: "music",
    track: {
      id: "twice-yes-or-yes",
      title: "Yes or Yes",
      artist: "TWICE",
      kind: "album",
      language: "Kpop",
      rating: 9.2,
      matchScore: 96,
      imageUrl: poster("jujutsu-kaisen"),
    },
  },
  {
    kind: "content",
    item: {
      id: "death-note",
      title: "Death Note",
      type: "anime",
      imageUrl: poster("death-note"),
      genres: [g("crime", "Crime"), g("thriller", "Thriller")],
      rating: 9.2,
      matchScore: 95,
      meta: "1 Season",
      year: 2006,
    },
  },
];

const reetamDutta: UserProfileDetail = {
  id: "reetam-dutta",
  name: "Reetam Dutta",
  handle: "Reetam_Dutta_2423",
  bio: "Anime, music, K-drama and product design lover. Curating my own entertainment universe through collections, communities and AI-powered discovery.",
  avatarColor: "#ffd000",
  portraitUrl: portrait,
  location: "India",
  online: true,
  followerCount: 125,
  joinedAt: "23rd Aug, 2025",
  activitySubtitle: "Currently Watching Death Note Ep 24",
  matchScore: 94,
  primaryTags: ["Anime", "K-Pop", "Action", "Pop", "Thriller"],
  engagementStats: [
    { id: "views", label: "Total Views", value: "12k" },
    { id: "following", label: "Total Following", value: "100" },
    { id: "followers", label: "Total Followers", value: "45" },
    { id: "collections", label: "Total Collections", value: "15" },
    { id: "watchtime", label: "Total Watch Time", value: "3.2k" },
  ],
  nowListening: {
    title: "FANCY",
    artist: "TWICE",
    artistId: "twice",
    songId: "twice-fancy",
  },
  currentlyWatching: {
    title: "Death Note",
    episodeLabel: "Episode 24",
    contentId: "death-note",
  },
  favoriteTypes: ["Anime", "K-pop", "English Shows"],
  favoriteGenres: ["Thriller", "Action", "Drama"],
  followers: [
    { id: "f1", name: "R", avatarColor: "#ff00cc" },
    { id: "f2", name: "L", avatarColor: "#b8ff00" },
    { id: "f3", name: "K", avatarColor: "#00ff8c" },
  ],
  followerSummary: "25 users follow Reetam_Dutta_2423",
  recentActivity: recentActivityItems,
  currentActivity: [],
  likedContent: [],
  watchedMost: [],
  likedSongs: [],
  mostPlayedSongs: [],
  likedAlbums,
  topArtists,
  collections: profileCollections,
  communities: [],
  reviews: profileReviews,
};

const profiles: Record<string, UserProfileDetail> = {
  "reetam-dutta": reetamDutta,
};

async function hydrateProfile(base: UserProfileDetail): Promise<UserProfileDetail> {
  const [continueWatching, recommended, trending, tasteMusic, trendingMusic, continueListening, communities] =
    await Promise.all([
      getContinueWatching(),
      getRecommendedForYou(),
      getTrendingThisWeek(),
      getMusicForYourTaste(),
      getTrendingMusic(),
      getContinueListening(),
      getRecommendedCommunities(),
    ]);

  const likedContent = recommended.slice(0, 8);
  const watchedMost = [...continueWatching, ...trending].slice(0, 8);
  const currentActivity = continueWatching.slice(0, 6);
  const likedSongs = tasteMusic.slice(0, 8);
  const mostPlayedSongs = [...continueListening, ...trendingMusic].slice(0, 8);

  return {
    ...base,
    currentActivity,
    likedContent,
    watchedMost,
    likedSongs,
    mostPlayedSongs,
    communities: communities.slice(0, 4),
  };
}

export async function getAllUserIds(): Promise<string[]> {
  return Object.keys(profiles);
}

export async function getUserDetail(userId: string): Promise<UserProfileDetail | null> {
  const slug = normalizeProfileSlug(userId);
  const base = profiles[slug];
  if (!base) return null;
  return hydrateProfile(base);
}
