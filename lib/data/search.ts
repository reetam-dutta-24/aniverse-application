import type { Collection, Community, ContentItem, MusicTrack } from "@/types";
import { getArtistDetail } from "@/lib/data/artist-detail";
import { getGlobalCommunities } from "@/lib/data/community";
import { getGlobalPublicCollections } from "@/lib/data/collections";
import {
  getContinueWatching,
  getNewReleases,
  getRecommendedForYou,
  getTrendingThisWeek,
} from "@/lib/data/discover";
import { getUserDetail } from "@/lib/data/user-detail";
import { getArtistDetailPath } from "@/lib/artist-routes";
import { getCollectionDetailPath } from "@/lib/collection-routes";
import { getCommunityDetailPath } from "@/lib/community-routes";
import {
  getContentDetailPath,
  normalizeContentSlug,
} from "@/lib/content-routes";
import { getProfilePath } from "@/lib/profile-routes";
import { getSongDetailPath } from "@/lib/song-routes";
import {
  bestFieldScore,
  normalizeSearchQuery,
  scoreSearchMatch,
} from "@/lib/search/utils";
import type {
  ProfileSearchItem,
  SearchPageData,
  SearchPrimaryType,
  SearchResult,
  SearchResultType,
} from "@/lib/search/types";

const g = (id: string, label: string) => ({ id, label });
const poster = (slug: string) => `/images/posters/${slug}.jpg`;

const profileCatalog: ProfileSearchItem[] = [
  {
    id: "reetam-dutta",
    name: "Reetam Dutta",
    handle: "Reetam_Dutta_2423",
    avatarColor: "#ffd000",
    portraitUrl: "/images/hero-1.png",
    followerCount: 125,
    bio: "Anime lover · K-pop enthusiast · Building AniVerse.",
  },
  {
    id: "emily-carter",
    name: "Emily Carter",
    handle: "Emily_C_89",
    avatarColor: "#ff00cc",
    portraitUrl: "/images/hero-2.png",
    followerCount: 84,
    bio: "Moderator · Global Anime Community.",
  },
  {
    id: "lucas-silva",
    name: "Lucas Silva",
    handle: "Lucas_Anime",
    avatarColor: "#00e5ff",
    portraitUrl: "/images/hero-3.png",
    followerCount: 62,
    bio: "Watch party host · Shonen fan.",
  },
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
    year: 2015,
  },
];

const contentSimilarPool: ContentItem[] = [
  {
    id: "death-note",
    title: "Death Note",
    type: "anime",
    imageUrl: poster("death-note"),
    genres: [g("crime", "Crime"), g("thriller", "Thriller")],
    rating: 9.2,
    matchScore: 90,
    meta: "1 Season",
    year: 2006,
  },
  {
    id: "death-parade",
    title: "Death Parade",
    type: "anime",
    imageUrl: poster("monster"),
    genres: [g("thriller", "Thriller"), g("drama", "Drama")],
    rating: 8.9,
    matchScore: 88,
    meta: "1 Season",
    year: 2015,
  },
  {
    id: "code-geass",
    title: "Code Geass",
    type: "anime",
    imageUrl: poster("code-geass"),
    genres: [g("thriller", "Thriller"), g("action", "Action")],
    rating: 9.1,
    matchScore: 90,
    meta: "2 Seasons",
    year: 2006,
  },
  {
    id: "monster",
    title: "Monster",
    type: "anime",
    imageUrl: poster("monster"),
    genres: [g("thriller", "Thriller"), g("crime", "Crime")],
    rating: 9.3,
    matchScore: 92,
    meta: "1 Season",
    year: 2004,
  },
  {
    id: "classroom-of-elite",
    title: "Classroom Of Elite",
    type: "anime",
    imageUrl: poster("classroom-of-the-elite"),
    genres: [g("thriller", "Thriller"), g("drama", "Drama")],
    rating: 9.2,
    matchScore: 89,
    meta: "3 Seasons",
    year: 2017,
  },
  {
    id: "demon-slayer",
    title: "Demon Slayer",
    type: "anime",
    imageUrl: poster("demon-slayer"),
    genres: [g("action", "Action"), g("fantasy", "Fantasy")],
    rating: 8.9,
    matchScore: 87,
    meta: "4 Seasons",
    year: 2019,
  },
  {
    id: "tokyo-ghoul",
    title: "Tokyo Ghoul",
    type: "anime",
    imageUrl: poster("tokyo-ghoul"),
    genres: [g("horror", "Horror"), g("action", "Action")],
    rating: 8.7,
    matchScore: 85,
    meta: "4 Seasons",
    year: 2014,
  },
];

async function allContentItems(): Promise<ContentItem[]> {
  const pools = await Promise.all([
    getTrendingThisWeek(),
    getRecommendedForYou(),
    getNewReleases(),
    getContinueWatching(),
  ]);
  const seen = new Set<string>();
  const items: ContentItem[] = [];
  for (const pool of pools) {
    for (const item of pool) {
      const slug = normalizeContentSlug(item.id);
      if (seen.has(slug)) continue;
      seen.add(slug);
      items.push({ ...item, id: slug });
    }
  }
  for (const extra of [...contentSimilarPool, ...artistCatalog]) {
    if (!seen.has(extra.id)) {
      seen.add(extra.id);
      items.push(extra);
    }
  }
  return items;
}

async function allMusicTracks(): Promise<MusicTrack[]> {
  const tracks = await import("@/lib/data/discover").then((m) =>
    m.getTrendingMusic(),
  );
  const taste = await import("@/lib/data/discover").then((m) =>
    m.getMusicForYourTaste(),
  );
  const seen = new Set<string>();
  const merged: MusicTrack[] = [];
  for (const pool of [tracks, await taste]) {
    for (const track of pool) {
      if (seen.has(track.id)) continue;
      seen.add(track.id);
      merged.push(track);
    }
  }
  return merged;
}

function toSearchResult(
  type: SearchResultType,
  id: string,
  title: string,
  subtitle: string | undefined,
  imageUrl: string | undefined,
  href: string,
  score: number,
): SearchResult {
  return { type, id, title, subtitle, imageUrl, href, score };
}

function detectPrimaryType(
  query: string,
  ranked: SearchResult[],
): SearchPrimaryType {
  const q = normalizeSearchQuery(query);
  const top = ranked[0];
  if (!top) return "content";

  const byType = (type: SearchResultType) =>
    ranked.filter((r) => r.type === type).sort((a, b) => b.score - a.score)[0];

  const artistHit = byType("artist");
  const songHit = byType("song");
  const profileHit = byType("profile");
  const contentHit = byType("content");

  if (/\btwice\b|katseye|newjeans|red velvet|aespa|le sserafim|\bive\b/.test(q)) {
    return "artist";
  }
  if (/\bgurenge\b|sparkle|suzume|kaikai kitan|unravel/.test(q)) {
    return "song";
  }
  if (/reetam|dutta|emily.carter|lucas.silva/.test(q)) {
    return "profile";
  }

  const candidates: { type: SearchPrimaryType; score: number }[] = [];
  if (artistHit) candidates.push({ type: "artist", score: artistHit.score });
  if (songHit) candidates.push({ type: "song", score: songHit.score });
  if (profileHit) candidates.push({ type: "profile", score: profileHit.score });
  if (contentHit) candidates.push({ type: "content", score: contentHit.score });

  candidates.sort((a, b) => b.score - a.score);
  if (candidates[0]?.score >= 70) return candidates[0].type;

  if (top.type === "artist") return "artist";
  if (top.type === "song") return "song";
  if (top.type === "profile") return "profile";
  return "content";
}

export async function searchAutocomplete(
  query: string,
  limit = 8,
): Promise<SearchResult[]> {
  const q = normalizeSearchQuery(query);
  if (q.length < 2) return [];

  const [content, songs, collections, communities] = await Promise.all([
    allContentItems(),
    allMusicTracks(),
    getGlobalPublicCollections(),
    getGlobalCommunities(),
  ]);

  const results: SearchResult[] = [];

  for (const item of content) {
    const score = bestFieldScore(
      [item.title, item.type, ...item.genres.map((g) => g.label)],
      q,
    );
    if (score < 50) continue;
    const href =
      item.type === "artist"
        ? getArtistDetailPath(item.id)
        : getContentDetailPath(item.id);
    results.push(
      toSearchResult(
        item.type === "artist" ? "artist" : "content",
        item.id,
        item.title,
        item.type === "artist" ? "Artist" : item.type,
        item.imageUrl,
        href,
        score,
      ),
    );
  }

  for (const track of songs) {
    const score = bestFieldScore(
      [track.title, track.artist, track.source, track.language],
      q,
    );
    if (score < 50) continue;
    results.push(
      toSearchResult(
        "song",
        track.id,
        track.title,
        track.artist,
        track.imageUrl,
        getSongDetailPath(track.id),
        score,
      ),
    );
  }

  for (const profile of profileCatalog) {
    const score = bestFieldScore([profile.name, profile.handle, profile.bio], q);
    if (score < 50) continue;
    results.push(
      toSearchResult(
        "profile",
        profile.id,
        profile.name,
        `@${profile.handle}`,
        profile.portraitUrl,
        getProfilePath(profile.id),
        score,
      ),
    );
  }

  for (const collection of collections.slice(0, 8)) {
    const score = bestFieldScore([collection.name, collection.description], q);
    if (score < 55) continue;
    results.push(
      toSearchResult(
        "collection",
        collection.id,
        collection.name,
        "Collection",
        collection.imageUrl,
        getCollectionDetailPath(
          collection.id === "global-1" ? "anime-masterpieces" : collection.id,
        ),
        score,
      ),
    );
  }

  for (const community of communities.slice(0, 6)) {
    const score = bestFieldScore(
      [community.name, community.category],
      q,
    );
    if (score < 55) continue;
    results.push(
      toSearchResult(
        "community",
        community.id,
        community.name,
        community.category,
        community.imageUrl,
        getCommunityDetailPath(
          community.id === "twice" ? "global-anime-community" : community.id,
        ),
        score,
      ),
    );
  }

  return results.sort((a, b) => b.score - a.score).slice(0, limit);
}

export async function getSearchPageData(query: string): Promise<SearchPageData | null> {
  const q = normalizeSearchQuery(query);
  if (!q) return null;

  const suggestions = await searchAutocomplete(q, 24);
  const primaryType = detectPrimaryType(q, suggestions);

  const [contentPool, songPool, collections, communities, twiceArtist] =
    await Promise.all([
      allContentItems(),
      allMusicTracks(),
      getGlobalPublicCollections(),
      getGlobalCommunities(),
      getArtistDetail("twice"),
    ]);

  const similarArtists =
    twiceArtist?.similarArtists ??
    artistCatalog.filter((a) => a.id !== "twice");

  const findContent = (matcher: (item: ContentItem) => boolean) =>
    contentPool.find(matcher);

  const findSong = (matcher: (track: MusicTrack) => boolean) =>
    songPool.find(matcher);

  const topContent =
    findContent((item) => scoreSearchMatch(item.title, q) >= 70) ??
    findContent((item) => item.title.toLowerCase().includes("death")) ??
    contentPool[0];

  const topSong =
    findSong((track) => scoreSearchMatch(track.title, q) >= 70) ??
    songPool.find((t) => t.id === "gurenge") ??
    songPool[0];

  const topArtist =
    artistCatalog.find((a) => scoreSearchMatch(a.title, q) >= 60) ??
    artistCatalog[0];

  const topProfile =
    profileCatalog.find(
      (p) =>
        scoreSearchMatch(p.name, q) >= 60 ||
        scoreSearchMatch(p.handle, q) >= 60,
    ) ?? profileCatalog[0];

  const similarContent = contentSimilarPool
    .filter((item) => item.id !== topContent?.id)
    .slice(0, 8);

  const similarSongs = songPool
    .filter((t) => t.id !== topSong?.id)
    .slice(0, 8);

  const artistSongs = twiceArtist?.allSongs.slice(0, 18) ?? [];

  const similarProfiles = profileCatalog
    .filter((p) => p.id !== topProfile?.id)
    .slice(0, 4);

  const displayCollections = collections.slice(0, 8).map((c, i) => ({
    ...c,
    id: i === 0 ? "anime-masterpieces" : c.id,
    name: i === 0 ? "Anime Masterpieces" : c.name,
  }));

  const displayCommunities = communities.slice(0, 8).map((c, i) => ({
    ...c,
    id: i === 0 ? "global-anime-community" : c.id,
    name: i === 0 ? "Global Anime Community" : c.name,
  }));

  return {
    query: query.trim(),
    primaryType,
    topContent,
    topSong,
    topArtist,
    topProfile,
    similarContent,
    similarSongs,
    similarArtists,
    similarProfiles,
    artistSongs,
    collections: displayCollections,
    communities: displayCommunities,
  };
}

/** Hydrate profile top result with full detail when available. */
export async function enrichProfileSearch(
  profile: ProfileSearchItem,
): Promise<ProfileSearchItem> {
  const detail = await getUserDetail(profile.id);
  if (!detail) return profile;
  return {
    id: detail.id,
    name: detail.name,
    handle: detail.handle,
    avatarColor: detail.avatarColor,
    portraitUrl: detail.portraitUrl,
    followerCount: detail.followerCount,
    bio: detail.bio,
  };
}
