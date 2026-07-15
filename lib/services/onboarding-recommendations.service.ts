import "server-only";

import type { Collection, Community, ContentItem, MusicTrack } from "@/types";
import { getGlobalPublicCollections } from "@/lib/data/collections";
import { getGlobalCommunities } from "@/lib/data/community";
import {
  getMusicForYourTaste,
  getNewReleases,
  getRecommendedForYou,
  getTrendingMusic,
  getTrendingThisWeek,
} from "@/lib/data/discover";
import {
  onboardingSteps,
  type OnboardingGoalLink,
  type OnboardingRecommendations,
  type OnboardingSelection,
  type TasteBreakdownItem,
} from "@/lib/data/onboarding-config";
import { listArtistSearchItems } from "@/lib/services/feed.service";

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
  for (const genre of item.genres ?? []) {
    if (selection.genres.includes(genre.id)) score += 2;
  }
  for (const mood of selection.moods) {
    for (const genreId of moodGenreBoost[mood] ?? []) {
      if (item.genres?.some((g) => g.id === genreId)) score += 1.5;
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
    if (taste === "kpop" && artist.genres?.some((g) => g.id === "kpop")) score += 3;
    if (taste === "jpop" && artist.genres?.some((g) => g.id === "jpop")) score += 3;
    if (taste === "english" && artist.genres?.some((g) => g.id === "english")) score += 3;
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
  const musicScore = Math.min(
    100,
    50 + selection.musicTastes.length * 10 + selection.artists.length * 8,
  );
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
    const opt = onboardingSteps
      .find((s) => s.id === "watchHabits")
      ?.options.find((o) => o.id === selection.watchHabits[0]);
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
    globalCommunities,
    publicCollections,
    artistPool,
  ] = await Promise.all([
    getTrendingThisWeek(),
    getRecommendedForYou(),
    getNewReleases(),
    getMusicForYourTaste(),
    getTrendingMusic(),
    getGlobalCommunities(),
    getGlobalPublicCollections(),
    listArtistSearchItems(20),
  ]);

  const contentPool = dedupeBy(
    [...trending, ...recommended, ...releases],
    (item) => item.id,
  );
  const trackPool = dedupeBy(
    [...tasteMusic, ...trendingMusic],
    (track) => track.id,
  );
  const communityPool = dedupeBy(globalCommunities, (community) => community.id);
  const collectionPool = dedupeBy(publicCollections, (collection) => collection.id);

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
    artists: rank(artistPool, (a) => scoreArtist(a, selection), 6),
    starterWatchlist: content.slice(0, 3),
    goalLinks,
  };
}
