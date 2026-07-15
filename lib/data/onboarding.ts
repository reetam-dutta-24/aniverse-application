import type { Collection, Community, ContentItem, MusicTrack } from "@/types";
import {
  getRecommendedCommunities,
  getGlobalCommunities,
} from "@/lib/data/community";
import {
  getGlobalPublicCollections,
  getRecentlyUsedCollections,
} from "@/lib/data/collections";
import { listArtistSearchItems } from "@/lib/services/feed.service";
import {
  getMusicForYourTaste,
  getNewReleases,
  getRecommendedForYou,
  getTrendingMusic,
  getTrendingThisWeek,
} from "@/lib/data/discover";

/**
 * Onboarding taste test — option catalogs and the recommendation builder
 * that turns quiz answers into personalized picks from the existing pools.
 */

export interface OnboardingOption {
  id: string;
  emoji: string;
  label: string;
  hint?: string;
}

export interface OnboardingSelection {
  contentTypes: string[];
  genres: string[];
  musicTastes: string[];
  goals: string[];
  favoriteTitles: string[];
  moods: string[];
  watchHabits: string[];
  artists: string[];
}

export interface OnboardingStepConfig {
  id: keyof OnboardingSelection;
  title: string;
  subtitle: string;
  options: OnboardingOption[];
  min: number;
  /** When set, caps how many options the user can pick. */
  max?: number;
}

export interface TasteBreakdownItem {
  label: string;
  value: number;
}

export interface OnboardingGoalLink {
  id: string;
  emoji: string;
  label: string;
  href: string;
}

export interface OnboardingRecommendations {
  tasteScore: number;
  tasteBreakdown: TasteBreakdownItem[];
  summaryChips: string[];
  content: ContentItem[];
  tracks: MusicTrack[];
  communities: Community[];
  collections: Collection[];
  artists: ContentItem[];
  starterWatchlist: ContentItem[];
  goalLinks: OnboardingGoalLink[];
}

const g = (id: string, label: string) => ({ id, label });
const poster = (slug: string) => `/images/posters/${slug}.jpg`;

/** Curated spotlight titles for the quick-pick step. */
const favoriteTitleOptions: OnboardingOption[] = [
  { id: "jujutsu-kaisen", emoji: "🌀", label: "Jujutsu Kaisen" },
  { id: "attack-on-titan", emoji: "🧱", label: "Attack on Titan" },
  { id: "demon-slayer", emoji: "🔥", label: "Demon Slayer" },
  { id: "death-note", emoji: "📓", label: "Death Note" },
  { id: "spy-x-family", emoji: "🕵️", label: "Spy x Family" },
  { id: "frieren", emoji: "🧝", label: "Frieren" },
  { id: "chainsaw-man", emoji: "⛓️", label: "Chainsaw Man" },
  { id: "your-name", emoji: "☄️", label: "Your Name" },
];

const artistOptions: OnboardingOption[] = [
  { id: "twice", emoji: "💖", label: "TWICE" },
  { id: "newjeans", emoji: "🐰", label: "NewJeans" },
  { id: "lisa", emoji: "🎤", label: "LiSA" },
  { id: "radwimps", emoji: "🌧️", label: "RADWIMPS" },
  { id: "chase-atlantic", emoji: "🌊", label: "Chase Atlantic" },
  { id: "aespa", emoji: "✨", label: "aespa" },
];

const artistCatalog: ContentItem[] = [
  {
    id: "twice",
    title: "TWICE",
    type: "artist",
    imageUrl: "/images/artists/twice.jpg",
    genres: [g("kpop", "K-Pop")],
    rating: 9.4,
    matchScore: 96,
    meta: "Girl Group",
  },
  {
    id: "newjeans",
    title: "NewJeans",
    type: "artist",
    imageUrl: "/images/hero-4.png",
    genres: [g("kpop", "K-Pop")],
    rating: 9.4,
    matchScore: 95,
    meta: "Girl Group",
  },
  {
    id: "lisa",
    title: "LiSA",
    type: "artist",
    imageUrl: poster("jujutsu-kaisen"),
    genres: [g("jpop", "J-Pop")],
    rating: 9.2,
    matchScore: 93,
    meta: "OST Artist",
  },
  {
    id: "radwimps",
    title: "RADWIMPS",
    type: "artist",
    imageUrl: poster("your-name"),
    genres: [g("jpop", "J-Pop")],
    rating: 9.1,
    matchScore: 92,
    meta: "Band",
  },
  {
    id: "chase-atlantic",
    title: "Chase Atlantic",
    type: "artist",
    imageUrl: "/images/album-swim.png",
    genres: [g("english", "English")],
    rating: 8.9,
    matchScore: 88,
    meta: "Alternative",
  },
  {
    id: "aespa",
    title: "aespa",
    type: "artist",
    imageUrl: poster("demon-slayer"),
    genres: [g("kpop", "K-Pop")],
    rating: 9.3,
    matchScore: 94,
    meta: "Girl Group",
  },
];

export const onboardingSteps: OnboardingStepConfig[] = [
  {
    id: "contentTypes",
    title: "🎬 What do you love watching?",
    subtitle: "Pick at least one — we'll tune your universe around it.",
    min: 1,
    options: [
      { id: "anime", emoji: "🎌", label: "Anime" },
      { id: "movie", emoji: "🎬", label: "Movies" },
      { id: "show", emoji: "📺", label: "Shows" },
      { id: "kdrama", emoji: "🇰🇷", label: "K-Dramas" },
      { id: "documentary", emoji: "🎥", label: "Documentaries" },
    ],
  },
  {
    id: "genres",
    title: "🎭 Pick your favorite genres",
    subtitle: "Choose 3 or more so the AI match gets sharp.",
    min: 3,
    max: 6,
    options: [
      { id: "action", emoji: "⚔️", label: "Action" },
      { id: "thriller", emoji: "🕵️", label: "Thriller" },
      { id: "fantasy", emoji: "🐉", label: "Fantasy" },
      { id: "drama", emoji: "🎭", label: "Drama" },
      { id: "romance", emoji: "💘", label: "Romance" },
      { id: "comedy", emoji: "😂", label: "Comedy" },
      { id: "horror", emoji: "👻", label: "Horror" },
      { id: "crime", emoji: "🚔", label: "Crime" },
      { id: "sports", emoji: "🏐", label: "Sports" },
      { id: "psychological", emoji: "🧠", label: "Psychological" },
    ],
  },
  {
    id: "favoriteTitles",
    title: "❤️ Any favorites you already love?",
    subtitle: "Pick up to 4 — we'll find more like these first.",
    min: 0,
    max: 4,
    options: favoriteTitleOptions,
  },
  {
    id: "moods",
    title: "😊 What mood are you usually in?",
    subtitle: "Pick at least one vibe — recommendations follow your mood.",
    min: 1,
    max: 3,
    options: [
      { id: "intense", emoji: "⚡", label: "Intense", hint: "Action & thrillers" },
      { id: "emotional", emoji: "💧", label: "Emotional", hint: "Drama & heartfelt" },
      { id: "cozy", emoji: "🍵", label: "Cozy", hint: "Warm & comforting" },
      { id: "lighthearted", emoji: "😄", label: "Lighthearted", hint: "Comedy & fun" },
      { id: "mysterious", emoji: "🌙", label: "Mysterious", hint: "Crime & psychological" },
    ],
  },
  {
    id: "musicTastes",
    title: "🎵 What's on your playlist?",
    subtitle: "Pick at least one — songs, OSTs, and artists follow your taste.",
    min: 1,
    options: [
      { id: "kpop", emoji: "🇰🇷", label: "K-Pop" },
      { id: "jpop", emoji: "🇯🇵", label: "J-Pop" },
      { id: "ost", emoji: "🎼", label: "Anime OSTs" },
      { id: "english", emoji: "🎤", label: "English Pop" },
      { id: "albums", emoji: "💿", label: "Full Albums" },
    ],
  },
  {
    id: "artists",
    title: "🎤 Any artists you're into?",
    subtitle: "Optional — pick up to 3 to sharpen music matches.",
    min: 0,
    max: 3,
    options: artistOptions,
  },
  {
    id: "watchHabits",
    title: "📺 How do you usually watch?",
    subtitle: "Pick one — we'll pace recommendations for your style.",
    min: 1,
    max: 1,
    options: [
      { id: "binge", emoji: "📺", label: "Binge Sessions", hint: "Long runs" },
      { id: "weekly", emoji: "📅", label: "Weekly Drops", hint: "Seasonal releases" },
      { id: "casual", emoji: "☕", label: "Casual Viewer", hint: "A few episodes" },
      { id: "background", emoji: "🎧", label: "Background", hint: "Music-first" },
    ],
  },
  {
    id: "goals",
    title: "🚀 What brings you to AniVerse?",
    subtitle: "Pick at least one — we'll surface those features first.",
    min: 1,
    max: 3,
    options: [
      { id: "recommendations", emoji: "🎯", label: "Smart Recommendations", hint: "AI-matched picks" },
      { id: "communities", emoji: "👥", label: "Fandom Communities", hint: "Chat & watch parties" },
      { id: "collections", emoji: "📒", label: "Collections & Watchlist", hint: "Organize everything" },
      { id: "analytics", emoji: "📊", label: "Taste Analytics", hint: "Track your patterns" },
    ],
  },
];

export const emptyOnboardingSelection: OnboardingSelection = {
  contentTypes: [],
  genres: [],
  musicTastes: [],
  goals: [],
  favoriteTitles: [],
  moods: [],
  watchHabits: [],
  artists: [],
};

const moodGenreBoost: Record<string, string[]> = {
  intense: ["action", "thriller"],
  emotional: ["drama", "romance"],
  cozy: ["comedy", "fantasy"],
  lighthearted: ["comedy"],
  mysterious: ["crime", "psychological", "thriller"],
};

const musicLanguageMap: Record<string, string[]> = {
  kpop: ["kpop", "korean"],
  jpop: ["jpop", "japanese"],
  english: ["english", "english pop"],
};

const goalLinksCatalog: Record<string, OnboardingGoalLink> = {
  recommendations: {
    id: "for-you",
    emoji: "🎯",
    label: "Explore For You",
    href: "/dashboard/for-you",
  },
  communities: {
    id: "community",
    emoji: "👥",
    label: "Browse Communities",
    href: "/dashboard/community",
  },
  collections: {
    id: "collections",
    emoji: "📒",
    label: "View Collections",
    href: "/dashboard/collections",
  },
  analytics: {
    id: "analytics",
    emoji: "📊",
    label: "Open Analytics",
    href: "/dashboard/analytics",
  },
};

function scoreContent(item: ContentItem, selection: OnboardingSelection) {
  let score = (item.matchScore ?? 70) / 25;
  if (selection.contentTypes.includes(item.type)) score += 3;
  if (selection.favoriteTitles.includes(item.id)) score += 8;
  for (const genre of item.genres) {
    if (selection.genres.includes(genre.id)) score += 2;
  }
  for (const mood of selection.moods) {
    for (const genreId of moodGenreBoost[mood] ?? []) {
      if (item.genres.some((g) => g.id === genreId)) score += 1.5;
    }
  }
  return score;
}

function scoreTrack(track: MusicTrack, selection: OnboardingSelection) {
  let score = (track.matchScore ?? 70) / 25;
  const language = track.language?.toLowerCase() ?? "";
  for (const taste of selection.musicTastes) {
    if (musicLanguageMap[taste]?.some((l) => language.includes(l))) score += 3;
  }
  if (selection.musicTastes.includes("ost") && track.kind === "ost") score += 3;
  if (selection.musicTastes.includes("albums") && track.kind === "album") score += 3;
  if (selection.watchHabits.includes("background")) score += 1;
  return score;
}

function scoreArtist(artist: ContentItem, selection: OnboardingSelection) {
  let score = (artist.matchScore ?? 70) / 25;
  if (selection.artists.includes(artist.id)) score += 10;
  for (const taste of selection.musicTastes) {
    if (taste === "kpop" && artist.genres.some((g) => g.id === "kpop")) score += 3;
    if (taste === "jpop" && artist.genres.some((g) => g.id === "jpop")) score += 3;
    if (taste === "english" && artist.genres.some((g) => g.id === "english")) score += 3;
  }
  return score;
}

function scoreCommunity(community: Community, selection: OnboardingSelection) {
  let score = (community.avgMatchScore ?? 70) / 25;
  const category = community.category.toLowerCase();
  if (selection.contentTypes.includes("anime") && category.includes("anime")) score += 3;
  if (selection.contentTypes.includes("show") && category.includes("show")) score += 3;
  if (selection.musicTastes.includes("kpop") && category.includes("kpop")) score += 3;
  if (
    (selection.musicTastes.includes("english") ||
      selection.musicTastes.includes("albums")) &&
    category.includes("pop")
  )
    score += 2;
  if (selection.goals.includes("communities")) score += 2;
  if (selection.watchHabits.includes("weekly")) score += 1;
  return score;
}

function scoreCollection(collection: Collection, selection: OnboardingSelection) {
  let score = 50;
  if (selection.goals.includes("collections")) score += 4;
  if (selection.contentTypes.includes("anime")) score += 2;
  if (selection.musicTastes.length > 0) score += 1;
  return score + (collection.favoriteCount ?? 0) / 20;
}

function dedupeBy<T>(items: T[], key: (item: T) => string): T[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const k = key(item);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

function rank<T>(pool: T[], score: (item: T) => number, take: number): T[] {
  return pool
    .map((item) => ({ item, score: score(item) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, take)
    .map((entry) => entry.item);
}

function buildTasteBreakdown(
  selection: OnboardingSelection,
): TasteBreakdownItem[] {
  const genreScore = Math.min(100, 55 + selection.genres.length * 7);
  const musicScore = Math.min(100, 50 + selection.musicTastes.length * 10 + selection.artists.length * 8);
  const communityScore = Math.min(
    100,
    45 + (selection.goals.includes("communities") ? 25 : 0) + selection.moods.length * 5,
  );
  const discoveryScore = Math.min(
    100,
    50 + selection.contentTypes.length * 8 + selection.favoriteTitles.length * 6,
  );

  return [
    { label: "Genre Fit", value: genreScore },
    { label: "Music Taste", value: musicScore },
    { label: "Community Vibe", value: communityScore },
    { label: "Discovery", value: discoveryScore },
  ];
}

function buildSummaryChips(selection: OnboardingSelection): string[] {
  const chips: string[] = [];
  for (const id of selection.contentTypes) {
    const opt = onboardingSteps[0].options.find((o) => o.id === id);
    if (opt) chips.push(`${opt.emoji} ${opt.label}`);
  }
  for (const id of selection.genres.slice(0, 4)) {
    const opt = onboardingSteps[1].options.find((o) => o.id === id);
    if (opt) chips.push(opt.label);
  }
  for (const id of selection.moods) {
    const opt = onboardingSteps.find((s) => s.id === "moods")?.options.find((o) => o.id === id);
    if (opt) chips.push(`${opt.emoji} ${opt.label}`);
  }
  if (selection.watchHabits[0]) {
    const opt = onboardingSteps.find((s) => s.id === "watchHabits")?.options.find(
      (o) => o.id === selection.watchHabits[0],
    );
    if (opt) chips.push(opt.label);
  }
  return chips.slice(0, 10);
}

export async function buildOnboardingRecommendations(
  selection: OnboardingSelection,
): Promise<OnboardingRecommendations> {
  const [
    trending,
    recommended,
    releases,
    tasteMusic,
    trendingMusic,
    recCommunities,
    globalCommunities,
    publicCollections,
    recentCollections,
  ] = await Promise.all([
    getTrendingThisWeek(),
    getRecommendedForYou(),
    getNewReleases(),
    getMusicForYourTaste(),
    getTrendingMusic(),
    getRecommendedCommunities(),
    getGlobalCommunities(),
    getGlobalPublicCollections(),
    getRecentlyUsedCollections(),
  ]);

  const contentPool = dedupeBy(
    [...trending, ...recommended, ...releases],
    (item) => item.id,
  );
  const trackPool = dedupeBy(
    [...tasteMusic, ...trendingMusic],
    (track) => track.id,
  );
  const communityPool = dedupeBy(
    [...recCommunities, ...globalCommunities],
    (community) => community.id,
  );
  const collectionPool = dedupeBy(
    [...recentCollections, ...publicCollections],
    (collection) => collection.id,
  );

  const picks =
    selection.contentTypes.length +
    selection.genres.length +
    selection.musicTastes.length +
    selection.goals.length +
    selection.favoriteTitles.length +
    selection.moods.length +
    selection.artists.length;

  const content = rank(contentPool, (i) => scoreContent(i, selection), 8);
  const goalLinks = selection.goals
    .map((goal) => goalLinksCatalog[goal])
    .filter(Boolean);

  return {
    tasteScore: Math.min(78 + picks * 1.5, 97),
    tasteBreakdown: buildTasteBreakdown(selection),
    summaryChips: buildSummaryChips(selection),
    content,
    tracks: rank(trackPool, (t) => scoreTrack(t, selection), 8),
    communities: rank(communityPool, (c) => scoreCommunity(c, selection), 4),
    collections: rank(collectionPool, (c) => scoreCollection(c, selection), 4),
    artists: rank(await listArtistSearchItems(20), (a) => scoreArtist(a, selection), 6),
    starterWatchlist: content.slice(0, 3),
    goalLinks,
  };
}
