import type {
  Collection,
  CollectionDetail,
  ContentItem,
  UserSummary,
} from "@/types";
import { normalizeCollectionSlug } from "@/lib/collection-routes";
import { formatDetailSynopsis } from "@/lib/data/content-detail";
import {
  getContinueWatching,
  getTrendingMusic,
  getTrendingThisWeek,
} from "@/lib/data/discover";

/**
 * Mock data layer — individual collection detail (`/collection/[collectionid]`).
 */

const g = (id: string, label: string) => ({ id, label });
const poster = (slug: string) => `/images/posters/${slug}.jpg`;

const contributors: UserSummary[] = [
  { id: "c1", name: "Rahul_89", avatarColor: "#ff00cc" },
  { id: "c2", name: "Lk45_89", avatarColor: "#ffd000" },
  { id: "c3", name: "Karan_singh45", avatarColor: "#00ff8c" },
];

const gridItems: ContentItem[] = [
  {
    id: "spy-x-family",
    title: "Spy x Family",
    type: "anime",
    imageUrl: poster("spy-x-family"),
    genres: [g("action", "Action"), g("comedy", "Comedy")],
    rating: 9.1,
    matchScore: 94,
    meta: "2 Seasons",
    year: 2022,
  },
  {
    id: "titanic",
    title: "Titanic",
    type: "movie",
    imageUrl: poster("your-name"),
    genres: [g("drama", "Drama"), g("romance", "Romance")],
    rating: 8.4,
    matchScore: 88,
    meta: "Film",
    year: 1997,
  },
  {
    id: "classroom-of-elite",
    title: "Classroom Of Elite",
    type: "anime",
    imageUrl: poster("classroom-of-the-elite"),
    genres: [g("drama", "Drama"), g("thriller", "Thriller")],
    rating: 9.2,
    matchScore: 90,
    meta: "3 Seasons",
    year: 2017,
  },
  {
    id: "death-note",
    title: "Death Note",
    type: "anime",
    imageUrl: poster("death-note"),
    genres: [g("thriller", "Thriller"), g("mystery", "Mystery")],
    rating: 9.7,
    matchScore: 98,
    meta: "1 Season",
    year: 2006,
  },
  {
    id: "demon-slayer",
    title: "Demon Slayer",
    type: "anime",
    imageUrl: poster("demon-slayer"),
    genres: [g("action", "Action"), g("fantasy", "Fantasy")],
    rating: 8.9,
    matchScore: 91,
    meta: "4 Seasons",
    year: 2019,
  },
  {
    id: "blue-lock",
    title: "Blue Lock",
    type: "anime",
    imageUrl: poster("blue-lock"),
    genres: [g("sports", "Sports"), g("action", "Action")],
    rating: 8.7,
    matchScore: 87,
    meta: "2 Seasons",
    year: 2022,
  },
  {
    id: "haikyu",
    title: "Haikyuu!!",
    type: "anime",
    imageUrl: poster("haikyu"),
    genres: [g("sports", "Sports"), g("comedy", "Comedy")],
    rating: 9.0,
    matchScore: 92,
    meta: "4 Seasons",
    year: 2014,
  },
  {
    id: "your-name",
    title: "Your Name",
    type: "movie",
    imageUrl: poster("your-name"),
    genres: [g("romance", "Romance"), g("drama", "Drama")],
    rating: 9.4,
    matchScore: 95,
    meta: "Film",
    year: 2016,
  },
];

const favoriteItems: ContentItem[] = [
  {
    ...gridItems[6],
    rating: 9.0,
    matchScore: 90,
  },
  {
    ...gridItems[7],
    rating: 9.0,
    matchScore: 92,
    genres: [g("love", "Love"), g("fantasy", "Fantasy")],
  },
  {
    ...gridItems[5],
    matchScore: 88,
  },
];

const watchedMost: ContentItem[] = [
  gridItems[3],
  {
    id: "code-geass",
    title: "Code Geass",
    type: "anime",
    imageUrl: poster("death-note"),
    genres: [g("action", "Action"), g("sci-fi", "Sci-Fi")],
    rating: 9.5,
    matchScore: 96,
    meta: "2 Seasons",
    year: 2006,
  },
  {
    id: "monster",
    title: "Monster",
    type: "anime",
    imageUrl: poster("monster"),
    genres: [g("thriller", "Thriller"), g("mystery", "Mystery")],
    rating: 9.6,
    matchScore: 97,
    meta: "1 Season",
    year: 2004,
  },
  gridItems[2],
  gridItems[4],
];

function makeSimilarCollections(): Collection[] {
  const accents = ["green", "pink", "purple", "blue"] as const;
  const slugs = ["death-note", "code-geass", "demon-slayer", "attack-on-titan"];
  const names = [
    "Anime Masterpieces",
    "Dark Fantasy Picks",
    "Shonen Legends",
    "Psychological Thrillers",
  ];
  return accents.map((accent, i) => ({
    id: `similar-col-${i + 1}`,
    name: names[i],
    description:
      "The greatest anime I've ever watched — curated for your taste.",
    itemCount: 42 + i * 4,
    favoriteCount: 16 + i * 3,
    visibility: i % 2 === 0 ? ("private" as const) : ("public" as const),
    createdAt: "23rd Aug, 2024",
    updatedAt: `${i + 1} days ago`,
    accent,
    imageUrl: poster(slugs[i]),
  }));
}

const animeMasterpieces: CollectionDetail = {
  id: "anime-masterpieces",
  name: "Anime Masterpieces",
  description: formatDetailSynopsis(
    "A hand-picked vault of the anime that defined your taste — psychological thrillers, sweeping action, and quiet character dramas saved in one private list. Curated over years of watching, rating, and rewatching the shows that still hit the same way they did the first time.",
  ),
  rating: 9.7,
  trendingLabel: "#5 in your private collections list",
  genres: [
    g("anime", "Anime"),
    g("thriller", "Thriller"),
    g("action", "Action"),
  ],
  visibility: "private",
  createdAt: "23rd Aug, 2025",
  updatedAt: "2 hrs ago",
  itemCount: 42,
  favoriteCount: 16,
  matchScore: 94,
  highlightTags: [],
  imageUrl: poster("death-note"),
  engagementStats: [
    { id: "ranked", label: "Ranked", value: "#5" },
    { id: "reviews", label: "Reviews", value: "56" },
    { id: "collections", label: "Collections", value: "34" },
    { id: "favorite", label: "Favourites", value: "16" },
  ],
  contributors,
  contributorSummary:
    "Rahul_89, Lk45_89 and Karan_singh45 are 3 contributors",
  favoriteItems,
  currentActivity: {
    title: "Death Note",
    statusLabel: "Currently Watching Death Note",
    episodeLabel: "Ep 32",
    seasonLabel: "Season 1",
    imageUrl: poster("death-note"),
    contentId: "death-note",
  },
  allItems: gridItems,
  continueWatching: [],
  watchedMost,
  musicTracks: [],
  similarCollections: makeSimilarCollections(),
  communities: [],
};

async function hydrateCollection(
  base: CollectionDetail,
): Promise<CollectionDetail> {
  const [continueWatching, trendingMusic, trending] = await Promise.all([
    getContinueWatching(),
    getTrendingMusic(),
    getTrendingThisWeek(),
  ]);

  return {
    ...base,
    continueWatching: continueWatching.slice(0, 6),
    musicTracks: trendingMusic.slice(0, 6),
    communities: [
      {
        id: "col-comm-1",
        name: "Kishlay Datta's Anime Community",
        category: "Anime",
        memberCount: 48200,
        postCount: 1842,
        visibility: "public",
        activityLevel: "very-active",
        avgMatchScore: 96,
        lastActiveAt: "1 hr Ago",
        accent: "yellow",
        imageUrl: poster("jujutsu-kaisen"),
      },
      {
        id: "col-comm-2",
        name: "Death Note Theorists",
        category: "Anime",
        memberCount: 31400,
        postCount: 920,
        visibility: "public",
        activityLevel: "active",
        avgMatchScore: 94,
        lastActiveAt: "3 hrs Ago",
        accent: "cyan",
        imageUrl: poster("death-note"),
      },
      {
        id: "col-comm-3",
        name: "Psychological Anime Hub",
        category: "Anime",
        memberCount: 22800,
        postCount: 640,
        visibility: "public",
        activityLevel: "active",
        avgMatchScore: 92,
        lastActiveAt: "5 hrs Ago",
        accent: "purple",
        imageUrl: poster("monster"),
      },
      {
        id: "col-comm-4",
        name: "Masterpiece Watch Party",
        category: "Mixed",
        memberCount: 15600,
        postCount: 410,
        visibility: "private",
        activityLevel: "moderate",
        avgMatchScore: 90,
        lastActiveAt: "1 day Ago",
        accent: "pink",
        imageUrl: poster("spy-x-family"),
      },
    ],
    watchedMost:
      base.watchedMost.length > 0 ? base.watchedMost : trending.slice(0, 6),
  };
}

const DETAIL_REGISTRY: Record<string, CollectionDetail> = {
  "anime-masterpieces": animeMasterpieces,
};

export async function getAllCollectionIds(): Promise<string[]> {
  return Object.keys(DETAIL_REGISTRY);
}

export async function getCollectionDetail(
  collectionId: string,
): Promise<CollectionDetail | null> {
  const slug = normalizeCollectionSlug(collectionId);
  const base = DETAIL_REGISTRY[slug];
  if (!base) return null;
  return hydrateCollection(base);
}
