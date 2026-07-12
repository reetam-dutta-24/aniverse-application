import type {
  Collection,
  ContentItem,
  MusicCollectionDetail,
  MusicTrack,
  UserSummary,
} from "@/types";
import { normalizeMusicCollectionSlug } from "@/lib/music-collection-routes";
import { formatDetailSynopsis } from "@/lib/data/content-detail";
import {
  getContinueListening,
  getMusicForYourTaste,
  getTrendingMusic,
} from "@/lib/data/discover";

const g = (id: string, label: string) => ({ id, label });
const poster = (slug: string) => `/images/posters/${slug}.jpg`;
const hero = (n: 1 | 2 | 3 | 4) => `/images/hero-${n}.png`;
const twiceBanner = "/images/artists/twice.jpg";

const contributors: UserSummary[] = [
  { id: "c1", name: "Rahul_89", avatarColor: "#ff00cc" },
  { id: "c2", name: "Lk45_89", avatarColor: "#ffd000" },
  { id: "c3", name: "Karan_singh45", avatarColor: "#00ff8c" },
];

function itemToTrack(item: ContentItem): MusicTrack {
  return {
    id: item.id,
    title: item.title,
    artist: item.meta ?? "Unknown",
    kind: item.type === "album" ? "album" : "song",
    language: item.genres[0]?.label,
    rating: item.rating,
    matchScore: item.matchScore,
    imageUrl: item.imageUrl,
  };
}

function itemsToTracks(items: ContentItem[]): MusicTrack[] {
  return items.map(itemToTrack);
}

const musicGridItems: ContentItem[] = [
  {
    id: "twice-fancy",
    title: "FANCY",
    type: "song",
    imageUrl: poster("jujutsu-kaisen"),
    genres: [g("kpop", "K-Pop")],
    rating: 9.4,
    matchScore: 96,
    meta: "TWICE",
    year: 2019,
  },
  {
    id: "twice-feel-special",
    title: "Feel Special",
    type: "song",
    imageUrl: poster("demon-slayer"),
    genres: [g("kpop", "K-Pop")],
    rating: 9.2,
    matchScore: 94,
    meta: "TWICE",
    year: 2019,
  },
  {
    id: "twice-the-feels",
    title: "The Feels",
    type: "song",
    imageUrl: poster("attack-on-titan"),
    genres: [g("kpop", "K-Pop")],
    rating: 9.3,
    matchScore: 95,
    meta: "TWICE",
    year: 2021,
  },
  {
    id: "twice-album-fancy-you",
    title: "FANCY YOU",
    type: "album",
    imageUrl: poster("chainsaw-man"),
    genres: [g("kpop", "K-Pop")],
    rating: 9.1,
    matchScore: 93,
    meta: "Album",
    year: 2019,
  },
  {
    id: "gurenge",
    title: "Gurenge",
    type: "song",
    imageUrl: poster("demon-slayer"),
    genres: [g("jpop", "J-Pop")],
    rating: 9.0,
    matchScore: 91,
    meta: "LiSA",
    year: 2019,
  },
  {
    id: "sparkle",
    title: "Sparkle",
    type: "song",
    imageUrl: poster("your-name"),
    genres: [g("jpop", "J-Pop")],
    rating: 9.5,
    matchScore: 97,
    meta: "RADWIMPS",
    year: 2016,
  },
  {
    id: "suzume",
    title: "Suzume",
    type: "song",
    imageUrl: poster("suzume"),
    genres: [g("jpop", "J-Pop")],
    rating: 9.2,
    matchScore: 94,
    meta: "RADWIMPS",
    year: 2022,
  },
  {
    id: "twice-album-formula",
    title: "Formula of Love",
    type: "album",
    imageUrl: poster("spy-x-family"),
    genres: [g("kpop", "K-Pop")],
    rating: 9.3,
    matchScore: 96,
    meta: "Album",
    year: 2021,
  },
];

const favoriteItems: ContentItem[] = [
  musicGridItems[0],
  musicGridItems[2],
  musicGridItems[3],
];

const listenedMost: ContentItem[] = [
  musicGridItems[0],
  musicGridItems[4],
  musicGridItems[5],
  musicGridItems[1],
  musicGridItems[6],
  musicGridItems[7],
];

const popularArtists: ContentItem[] = [
  {
    id: "twice",
    title: "TWICE",
    type: "artist",
    imageUrl: twiceBanner,
    genres: [g("kpop", "K-Pop")],
    rating: 9.6,
    matchScore: 97,
    meta: "Girl Group",
  },
  {
    id: "newjeans",
    title: "NewJeans",
    type: "artist",
    genres: [g("kpop", "K-Pop")],
    rating: 9.4,
    matchScore: 95,
    imageUrl: hero(4),
    meta: "Girl Group",
  },
  {
    id: "red-velvet",
    title: "RED VELVET",
    type: "artist",
    genres: [g("kpop", "K-Pop")],
    rating: 9.2,
    matchScore: 93,
    imageUrl: hero(3),
    meta: "Girl Group",
  },
  {
    id: "aespa",
    title: "aespa",
    type: "artist",
    genres: [g("kpop", "K-Pop")],
    rating: 9.3,
    matchScore: 94,
    imageUrl: poster("demon-slayer"),
    meta: "Girl Group",
  },
  {
    id: "ive",
    title: "IVE",
    type: "artist",
    genres: [g("kpop", "K-Pop")],
    rating: 9.0,
    matchScore: 91,
    imageUrl: poster("attack-on-titan"),
    meta: "Girl Group",
  },
  {
    id: "le-sserafim",
    title: "LE SSERAFIM",
    type: "artist",
    genres: [g("kpop", "K-Pop")],
    rating: 9.1,
    matchScore: 92,
    imageUrl: poster("jujutsu-kaisen"),
    meta: "Girl Group",
  },
];

function makeSimilarCollections(): Collection[] {
  const accents = ["pink", "purple", "cyan", "green"] as const;
  const names = [
    "K-Pop Essentials",
    "Anime OST Vault",
    "Feel-Good Pop",
    "J-Pop Crossovers",
  ];
  const slugs = ["spy-x-family", "demon-slayer", "your-name", "chainsaw-man"];
  return accents.map((accent, i) => ({
    id: `music-similar-col-${i + 1}`,
    name: names[i],
    description: "Curated tracks and albums picked for your listening taste.",
    itemCount: 36 + i * 5,
    favoriteCount: 14 + i * 2,
    visibility: "public" as const,
    createdAt: "12 Jan, 2026",
    updatedAt: `${i + 1} hrs ago`,
    accent,
    imageUrl: poster(slugs[i]),
  }));
}

const kpopEssentials: MusicCollectionDetail = {
  id: "kpop-essentials",
  name: "K-Pop Essentials",
  description: formatDetailSynopsis(
    "Your ultimate K-pop listening vault — title tracks, fan-favourite B-sides, and full albums from TWICE, NewJeans, and the artists that dominate your repeat queue. Built for late-night playlists, workout runs, and every mood in between.",
  ),
  rating: 9.5,
  trendingLabel: "#2 in your music collections",
  genres: [g("kpop", "K-Pop"), g("pop", "Pop"), g("dance", "Dance")],
  visibility: "public",
  createdAt: "10 Jan, 2026",
  updatedAt: "1 hr ago",
  itemCount: 48,
  favoriteCount: 22,
  matchScore: 96,
  highlightTags: [],
  imageUrl: twiceBanner,
  engagementStats: [
    { id: "ranked", label: "Ranked", value: "#2" },
    { id: "reviews", label: "Reviews", value: "38" },
    { id: "collections", label: "Collections", value: "12" },
    { id: "favorite", label: "Favourites", value: "22" },
  ],
  contributors,
  contributorSummary:
    "Rahul_89, Lk45_89 and Karan_singh45 are 3 contributors",
  favoriteItems,
  currentActivity: {
    title: "FANCY",
    statusLabel: "Currently Listening FANCY",
    progressLabel: "TWICE · FANCY YOU",
    imageUrl: poster("jujutsu-kaisen"),
    contentId: "twice-fancy",
  },
  allItems: musicGridItems,
  continueWatching: [],
  watchedMost: listenedMost,
  musicTracks: [],
  similarCollections: makeSimilarCollections(),
  communities: [],
  popularArtists,
  allTracks: itemsToTracks(musicGridItems),
  favoriteTracks: itemsToTracks(favoriteItems),
  continueListeningTracks: [],
  mostListenedTracks: itemsToTracks(listenedMost),
  similarVibesSongs: [],
};

async function hydrateMusicCollection(
  base: MusicCollectionDetail,
): Promise<MusicCollectionDetail> {
  const [continueListening, tasteMusic, trendingMusic] = await Promise.all([
    getContinueListening(),
    getMusicForYourTaste(),
    getTrendingMusic(),
  ]);

  const musicAsItems: ContentItem[] = tasteMusic.slice(0, 6).map((track) => ({
    id: track.id,
    title: track.title,
    type: "song" as const,
    imageUrl: track.imageUrl ?? poster("demon-slayer"),
    genres: track.language ? [g(track.language.toLowerCase(), track.language)] : [],
    rating: track.rating,
    matchScore: track.matchScore,
    meta: track.artist,
  }));

  const continueAsItems: ContentItem[] = continueListening
    .slice(0, 6)
    .map((track) => ({
      id: track.id,
      title: track.title,
      type: "song" as const,
      imageUrl: track.imageUrl ?? poster("demon-slayer"),
      genres: track.language ? [g(track.language.toLowerCase(), track.language)] : [],
      rating: track.rating,
      matchScore: track.matchScore,
      meta: track.artist,
    }));

  const collectionIds = new Set(base.allTracks.map((track) => track.id));
  const similarVibesSongs = [...tasteMusic, ...trendingMusic]
    .filter((track) => !collectionIds.has(track.id))
    .filter(
      (track, index, arr) =>
        arr.findIndex((entry) => entry.id === track.id) === index,
    )
    .slice(0, 8);

  return {
    ...base,
    continueWatching:
      continueAsItems.length > 0 ? continueAsItems : musicAsItems.slice(0, 6),
    continueListeningTracks:
      continueListening.length > 0
        ? continueListening.slice(0, 6)
        : tasteMusic.slice(0, 6),
    musicTracks: trendingMusic.slice(0, 6),
    similarVibesSongs,
    communities: [
      {
        id: "twice",
        name: "TWICE Fanverse",
        category: "Kpop",
        memberCount: 42000,
        postCount: 1248,
        visibility: "public",
        activityLevel: "very-active",
        avgMatchScore: 96,
        lastActiveAt: "1 hr Ago",
        accent: "yellow",
      },
      {
        id: "kpop-girl-groups",
        name: "K-Pop Girl Groups Hub",
        category: "Kpop",
        memberCount: 28500,
        postCount: 890,
        visibility: "public",
        activityLevel: "active",
        avgMatchScore: 92,
        lastActiveAt: "2 hrs Ago",
        accent: "pink",
      },
      {
        id: "music-playlist",
        name: "Music Playlist Builders",
        category: "Music",
        memberCount: 19800,
        postCount: 640,
        visibility: "public",
        activityLevel: "active",
        avgMatchScore: 88,
        lastActiveAt: "4 hrs Ago",
        accent: "purple",
      },
      {
        id: "jyp-nation",
        name: "JYP Nation Fans",
        category: "Kpop",
        memberCount: 35200,
        postCount: 1102,
        visibility: "public",
        activityLevel: "very-active",
        avgMatchScore: 94,
        lastActiveAt: "6 hrs Ago",
        accent: "cyan",
      },
    ],
  };
}

const DETAIL_REGISTRY: Record<string, MusicCollectionDetail> = {
  "kpop-essentials": kpopEssentials,
};

export async function getAllMusicCollectionIds(): Promise<string[]> {
  return Object.keys(DETAIL_REGISTRY);
}

export async function getMusicCollectionDetail(
  collectionId: string,
): Promise<MusicCollectionDetail | null> {
  const slug = normalizeMusicCollectionSlug(collectionId);
  const base = DETAIL_REGISTRY[slug];
  if (!base) return null;
  return hydrateMusicCollection(base);
}
