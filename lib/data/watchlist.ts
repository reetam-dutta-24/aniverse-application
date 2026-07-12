import type { ContentItem } from "@/types";

/**
 * Mock data layer — Watchlist page.
 */

const g = (id: string, label: string) => ({ id, label });
const poster = (slug: string) => `/images/posters/${slug}.jpg`;

function watchItem(
  id: string,
  title: string,
  type: ContentItem["type"],
  slug: string,
  genres: ReturnType<typeof g>[],
  rating: number,
  matchScore: number,
  priority = false,
): ContentItem {
  return {
    id,
    title,
    type,
    imageUrl: poster(slug),
    genres,
    rating,
    matchScore,
    description: `${title} — saved to your AniVerse watchlist.`,
    meta: type === "movie" ? "Film" : "2 Seasons",
    year: 2020,
    ...(priority ? {} : {}),
  };
}

const highPriority: ContentItem[] = [
  watchItem("wl-hp-haikyu", "Haikyu!!", "anime", "haikyu", [g("drama", "Drama"), g("sports", "Sports")], 9, 94, true),
  watchItem("wl-hp-your-name", "Your Name", "movie", "your-name", [g("romance", "Love"), g("fantasy", "Fantasy")], 9, 94, true),
  watchItem("wl-hp-blue", "Blue Lock", "anime", "blue-lock", [g("sports", "Sports"), g("drama", "Drama")], 8.5, 87, true),
  watchItem("wl-hp-classroom", "Classroom Of Elite", "anime", "classroom-of-the-elite", [g("drama", "Drama"), g("thriller", "Thriller")], 9.2, 90, true),
  watchItem("wl-hp-demon", "Demon Slayer", "anime", "demon-slayer", [g("fantasy", "Fantasy"), g("action", "Action")], 8.9, 91, true),
  watchItem("wl-hp-aot", "Attack on Titan", "anime", "attack-on-titan", [g("drama", "Drama"), g("action", "Action")], 9.3, 96, true),
  watchItem("wl-hp-tokyo", "Tokyo Ghoul", "anime", "tokyo-ghoul", [g("horror", "Horror"), g("action", "Action")], 8.5, 86, true),
  watchItem("wl-hp-death", "Death Note", "anime", "death-note", [g("crime", "Crime"), g("thriller", "Thriller")], 9.2, 95, true),
  watchItem("wl-hp-jjk", "Jujutsu Kaisen", "anime", "jujutsu-kaisen", [g("action", "Action"), g("thriller", "Thriller")], 9.5, 93, true),
  watchItem("wl-hp-frieren", "Frieren", "anime", "frieren", [g("fantasy", "Fantasy"), g("drama", "Drama")], 9.4, 96, true),
  watchItem("wl-hp-chainsaw", "Chainsaw Man", "anime", "chainsaw-man", [g("horror", "Horror"), g("action", "Action")], 8.8, 89, true),
  watchItem("wl-hp-spy", "Spy x Family", "anime", "spy-x-family", [g("comedy", "Comedy"), g("action", "Action")], 8.8, 88, true),
  watchItem("wl-hp-vinland", "Vinland Saga", "anime", "vinland-saga", [g("drama", "Drama"), g("action", "Action")], 9.1, 93, true),
  watchItem("wl-hp-monster", "Monster", "anime", "monster", [g("crime", "Crime"), g("mystery", "Mystery")], 9, 92, true),
  watchItem("wl-hp-geass", "Code Geass", "anime", "code-geass", [g("action", "Action"), g("thriller", "Thriller")], 9.1, 94, true),
  watchItem("wl-hp-oshio", "Oshi no Ko", "anime", "oshi-no-ko", [g("drama", "Drama"), g("mystery", "Mystery")], 8.9, 91, true),
  watchItem("wl-hp-naruto", "Naruto Shippuden", "anime", "naruto-shippuden", [g("action", "Action"), g("fantasy", "Fantasy")], 8.7, 88, true),
  watchItem("wl-hp-suzume", "Suzume", "movie", "suzume", [g("fantasy", "Fantasy"), g("romance", "Romance")], 8.7, 90, true),
  watchItem("wl-hp-ghost", "Ghost", "movie", "ghost", [g("romance", "Romance"), g("drama", "Drama")], 8.4, 85, true),
  watchItem("wl-hp-night", "Night Dancer", "song", "night-dancer", [g("music", "Music"), g("drama", "Drama")], 8.6, 87, true),
  watchItem("wl-hp-extra", "Vinland Saga S2", "anime", "vinland-saga", [g("drama", "Drama"), g("action", "Action")], 9, 92, true),
];

const allItems: ContentItem[] = [
  ...highPriority,
  watchItem("wl-all-jjk2", "Jujutsu Kaisen 0", "movie", "jujutsu-kaisen", [g("action", "Action"), g("fantasy", "Fantasy")], 8.8, 90),
  watchItem("wl-all-ds2", "Demon Slayer Movie", "movie", "demon-slayer", [g("fantasy", "Fantasy"), g("action", "Action")], 9, 93),
  watchItem("wl-all-coel2", "Classroom S3", "anime", "classroom-of-the-elite", [g("drama", "Drama"), g("thriller", "Thriller")], 9.1, 91),
  watchItem("wl-all-bl2", "Blue Lock S2", "anime", "blue-lock", [g("sports", "Sports"), g("drama", "Drama")], 8.6, 88),
  watchItem("wl-all-hq2", "Haikyu!! Final", "anime", "haikyu", [g("sports", "Sports"), g("comedy", "Comedy")], 9.1, 95),
  watchItem("wl-all-yn2", "Weathering With You", "movie", "your-name", [g("romance", "Romance"), g("fantasy", "Fantasy")], 8.5, 89),
  watchItem("wl-all-tg2", "Tokyo Ghoul:re", "anime", "tokyo-ghoul", [g("horror", "Horror"), g("action", "Action")], 8.3, 84),
  watchItem("wl-all-dn2", "Death Note Relight", "anime", "death-note", [g("crime", "Crime"), g("thriller", "Thriller")], 8.9, 93),
  watchItem("wl-all-aot2", "AOT Final Season", "anime", "attack-on-titan", [g("drama", "Drama"), g("action", "Action")], 9.4, 97),
  watchItem("wl-all-fr2", "Frieren Special", "anime", "frieren", [g("fantasy", "Fantasy"), g("drama", "Drama")], 9.3, 95),
  watchItem("wl-all-cm2", "Chainsaw Man Film", "movie", "chainsaw-man", [g("horror", "Horror"), g("action", "Action")], 8.7, 88),
  watchItem("wl-all-sp2", "Spy x Family S3", "anime", "spy-x-family", [g("comedy", "Comedy"), g("action", "Action")], 8.9, 89),
  watchItem("wl-all-vs2", "Vinland S2", "anime", "vinland-saga", [g("drama", "Drama"), g("action", "Action")], 9.2, 94),
  watchItem("wl-all-mn2", "Monster Complete", "anime", "monster", [g("crime", "Crime"), g("mystery", "Mystery")], 9.1, 93),
  watchItem("wl-all-cg2", "Code Geass R3", "anime", "code-geass", [g("action", "Action"), g("thriller", "Thriller")], 9, 93),
  watchItem("wl-all-on2", "Oshi no Ko S3", "anime", "oshi-no-ko", [g("drama", "Drama"), g("mystery", "Mystery")], 9, 92),
  watchItem("wl-all-nr2", "Naruto Movie", "movie", "naruto-shippuden", [g("action", "Action"), g("fantasy", "Fantasy")], 8.5, 87),
  watchItem("wl-all-sz2", "Suzume OST Live", "movie", "suzume", [g("fantasy", "Fantasy"), g("romance", "Romance")], 8.6, 88),
  watchItem("wl-all-gh2", "Ghost MV", "movie", "ghost", [g("romance", "Romance"), g("drama", "Drama")], 8.2, 84),
  watchItem("wl-all-nd2", "Night Dancer Remix", "song", "night-dancer", [g("music", "Music"), g("comedy", "Comedy")], 8.5, 86),
  watchItem("wl-all-ex1", "Extra Pick 1", "anime", "jujutsu-kaisen", [g("action", "Action"), g("thriller", "Thriller")], 9.2, 91),
  watchItem("wl-all-ex2", "Extra Pick 2", "anime", "demon-slayer", [g("fantasy", "Fantasy"), g("action", "Action")], 8.8, 90),
  watchItem("wl-all-ex3", "Extra Pick 3", "anime", "frieren", [g("fantasy", "Fantasy"), g("drama", "Drama")], 9.3, 94),
  watchItem("wl-all-ex4", "Extra Pick 4", "anime", "haikyu", [g("sports", "Sports"), g("comedy", "Comedy")], 9, 92),
  watchItem("wl-all-ex5", "Extra Pick 5", "movie", "your-name", [g("romance", "Romance"), g("fantasy", "Fantasy")], 9.1, 93),
  watchItem("wl-all-ex6", "Extra Pick 6", "anime", "blue-lock", [g("sports", "Sports"), g("drama", "Drama")], 8.7, 88),
  watchItem("wl-all-ex7", "Extra Pick 7", "anime", "classroom-of-the-elite", [g("drama", "Drama"), g("thriller", "Thriller")], 9, 90),
  watchItem("wl-all-ex8", "Extra Pick 8", "anime", "attack-on-titan", [g("drama", "Drama"), g("action", "Action")], 9.3, 95),
  watchItem("wl-all-ex9", "Extra Pick 9", "anime", "death-note", [g("crime", "Crime"), g("thriller", "Thriller")], 9.1, 94),
  watchItem("wl-all-ex10", "Extra Pick 10", "anime", "tokyo-ghoul", [g("horror", "Horror"), g("action", "Action")], 8.4, 85),
  watchItem("wl-all-ex11", "Extra Pick 11", "anime", "spy-x-family", [g("comedy", "Comedy"), g("action", "Action")], 8.7, 87),
  watchItem("wl-all-ex12", "Extra Pick 12", "anime", "chainsaw-man", [g("horror", "Horror"), g("action", "Action")], 8.9, 90),
  watchItem("wl-all-ex13", "Extra Pick 13", "anime", "vinland-saga", [g("drama", "Drama"), g("action", "Action")], 9, 91),
  watchItem("wl-all-ex14", "Extra Pick 14", "anime", "monster", [g("crime", "Crime"), g("mystery", "Mystery")], 9.2, 93),
  watchItem("wl-all-ex15", "Extra Pick 15", "anime", "code-geass", [g("action", "Action"), g("thriller", "Thriller")], 9.1, 92),
  watchItem("wl-all-ex16", "Extra Pick 16", "anime", "oshi-no-ko", [g("drama", "Drama"), g("mystery", "Mystery")], 8.8, 89),
  watchItem("wl-all-ex17", "Extra Pick 17", "anime", "naruto-shippuden", [g("action", "Action"), g("fantasy", "Fantasy")], 8.6, 86),
  watchItem("wl-all-ex18", "Extra Pick 18", "movie", "suzume", [g("fantasy", "Fantasy"), g("romance", "Romance")], 8.8, 89),
  watchItem("wl-all-ex19", "Extra Pick 19", "movie", "ghost", [g("romance", "Romance"), g("drama", "Drama")], 8.3, 83),
  watchItem("wl-all-ex20", "Extra Pick 20", "song", "night-dancer", [g("music", "Music"), g("drama", "Drama")], 8.5, 85),
  watchItem("wl-all-ex21", "Extra Pick 21", "anime", "jujutsu-kaisen", [g("action", "Action"), g("thriller", "Thriller")], 9.4, 94),
  watchItem("wl-all-ex22", "Extra Pick 22", "anime", "frieren", [g("fantasy", "Fantasy"), g("drama", "Drama")], 9.5, 96),
  watchItem("wl-all-ex23", "Extra Pick 23", "anime", "demon-slayer", [g("fantasy", "Fantasy"), g("action", "Action")], 9, 92),
  watchItem("wl-all-ex24", "Extra Pick 24", "anime", "haikyu", [g("sports", "Sports"), g("comedy", "Comedy")], 9.2, 93),
];

export interface WatchlistStats {
  savedItems: number;
  pending: number;
  highPriority: number;
  avgAiMatch: number;
}

export const watchlistGenres = [
  "All",
  "Anime",
  "Movies",
  "Shows",
  "Music",
  "Mixed",
] as const;

export async function getWatchlistStats(): Promise<WatchlistStats> {
  return {
    savedItems: 65,
    pending: 34,
    highPriority: 21,
    avgAiMatch: 91,
  };
}

export async function getHighPriorityWatchlist(): Promise<ContentItem[]> {
  return highPriority;
}

export async function getAllWatchlistItems(): Promise<ContentItem[]> {
  return allItems.slice(0, 65);
}

export async function getWatchlistGenres(): Promise<readonly string[]> {
  return watchlistGenres;
}
