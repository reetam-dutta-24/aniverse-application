import type {
  AccentColor,
  ArtistGenre,
  CatalogLanguage,
  ContentGenre,
  SongGenre,
} from "@/lib/catalog-enums";
import {
  avatarImage,
  backdropImage,
  posterImage,
} from "@/lib/seed/image-pool";
import type {
  ArtistSeed,
  CatalogReviewSeed,
  ContentSeedBase,
  MusicSeed,
} from "./helpers";

const ACCENTS: AccentColor[] = [
  "pink",
  "purple",
  "cyan",
  "blue",
  "fuchsia",
  "violet",
  "teal",
  "rose",
  "indigo",
  "emerald",
];

const CONTENT_GENRES: ContentGenre[] = [
  "action",
  "drama",
  "fantasy",
  "romance",
  "thriller",
  "comedy",
  "mystery",
  "sci-fi",
  "supernatural",
  "psychological",
];

const SONG_GENRES: SongGenre[] = [
  "jpop",
  "kpop",
  "pop",
  "rock",
  "electronic",
  "ost",
  "ballad",
  "hip-hop",
  "indie",
  "rnb",
];

const ARTIST_GENRES: ArtistGenre[] = [
  "jpop",
  "kpop",
  "pop",
  "rock",
  "electronic",
  "indie",
  "ballad",
  "metal",
  "jazz",
  "classical",
];

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function pick<T>(arr: T[], index: number): T {
  return arr[index % arr.length]!;
}

function review(author: string, rating: number, body: string, accent?: AccentColor): CatalogReviewSeed {
  return {
    authorName: author,
    authorAvatarColor: "#ff00cc",
    rating,
    body,
    accent: accent ?? "pink",
    likeCount: 8 + (rating % 40),
    headline: body.slice(0, 64),
  };
}

// ─── Title catalogs ───────────────────────────────────────────────────────────

const ANIME_TITLES = [
  "Jujutsu Kaisen", "Demon Slayer", "Attack on Titan", "Death Note", "Fullmetal Alchemist",
  "Steins;Gate", "Hunter x Hunter", "One Piece", "Naruto Shippuden", "Bleach",
  "My Hero Academia", "Chainsaw Man", "Spy x Family", "Frieren", "Vinland Saga",
  "Mob Psycho 100", "Code Geass", "Cowboy Bebop", "Neon Genesis Evangelion", "Your Name",
  "Haikyu!!", "Blue Lock", "Solo Leveling", "Dandadan", "Oshi no Ko",
  "Bocchi the Rock!", "Kaguya-sama: Love Is War", "Re:Zero", "Violet Evergarden", "Made in Abyss",
  "Tokyo Ghoul", "Parasyte", "Erased", "March Comes in Like a Lion", "Ranking of Kings",
  "Cyberpunk: Edgerunners", "Samurai Champloo", "Trigun Stampede", "Hell's Paradise", "Dr. Stone",
] as const;

const MOVIE_TITLES = [
  "Spirited Away", "Akira", "Ghost in the Shell", "Perfect Blue", "Paprika",
  "The Garden of Words", "Weathering With You", "Suzume", "Belle", "Promare",
  "Inception", "Interstellar", "Blade Runner 2049", "The Matrix", "Dune",
  "Everything Everywhere All at Once", "Parasite", "Oldboy", "Train to Busan", "Your Lie in April",
] as const;

const SHOW_TITLES = [
  "Breaking Bad", "Stranger Things", "The Last of Us", "Arcane", "Wednesday",
  "Dark", "Black Mirror", "The Mandalorian", "House of the Dragon", "The Boys",
  "Severance", "Fallout", "Shogun", "True Detective", "Westworld",
  "The Witcher", "Loki", "Andor", "Invincible", "Peacemaker",
] as const;

const KDRAMA_TITLES = [
  "Squid Game", "Crash Landing on You", "Goblin", "Vincenzo", "Itaewon Class",
  "Extraordinary Attorney Woo", "Kingdom", "Hellbound", "My Name", "All of Us Are Dead",
  "Business Proposal", "Hospital Playlist", "Reply 1988", "Move to Heaven", "D.P.",
] as const;

const DOC_TITLES = [
  "Planet Earth III", "The Last Dance", "Free Solo", "Won't You Be My Neighbor?", "Our Planet",
] as const;

const ARTIST_NAMES: Array<{
  slug: string;
  title: string;
  nativeTitle?: string;
  isGroup: boolean;
  genre: ArtistGenre;
  members?: { name: string; role: string }[];
}> = [
  { slug: "lisa", title: "LiSA", nativeTitle: "リサ", isGroup: false, genre: "jpop" },
  { slug: "yoasobi", title: "YOASOBI", isGroup: true, genre: "jpop", members: [{ name: "Ayase", role: "Composer" }, { name: "ikura", role: "Vocalist" }] },
  { slug: "radwimps", title: "RADWIMPS", isGroup: true, genre: "rock", members: [{ name: "Yojiro Noda", role: "Vocalist" }] },
  { slug: "kenshi-yonezu", title: "Kenshi Yonezu", nativeTitle: "米津玄師", isGroup: false, genre: "jpop" },
  { slug: "aimer", title: "Aimer", isGroup: false, genre: "ballad" },
  { slug: "king-gnu", title: "King Gnu", isGroup: true, genre: "rock" },
  { slug: "eve", title: "Eve", isGroup: false, genre: "jpop" },
  { slug: "ado", title: "Ado", isGroup: false, genre: "jpop" },
  { slug: "milet", title: "milet", isGroup: false, genre: "pop" },
  { slug: "fujii-kaze", title: "Fujii Kaze", nativeTitle: "藤井風", isGroup: false, genre: "pop" },
  { slug: "bts", title: "BTS", nativeTitle: "방탄소년단", isGroup: true, genre: "kpop", members: [{ name: "RM", role: "Leader" }, { name: "Jungkook", role: "Vocalist" }] },
  { slug: "blackpink", title: "BLACKPINK", isGroup: true, genre: "kpop", members: [{ name: "Jennie", role: "Rapper" }, { name: "Lisa", role: "Dancer" }] },
  { slug: "newjeans", title: "NewJeans", isGroup: true, genre: "kpop" },
  { slug: "twice", title: "TWICE", isGroup: true, genre: "kpop" },
  { slug: "stray-kids", title: "Stray Kids", isGroup: true, genre: "kpop" },
  { slug: "iu", title: "IU", nativeTitle: "아이유", isGroup: false, genre: "kpop" },
  { slug: "hikaru-utada", title: "Hikaru Utada", nativeTitle: "宇多田ヒカル", isGroup: false, genre: "jpop" },
  { slug: "oneokrock", title: "ONE OK ROCK", isGroup: true, genre: "rock" },
  { slug: "babymetal", title: "BABYMETAL", isGroup: true, genre: "metal" },
  { slug: "perfume", title: "Perfume", isGroup: true, genre: "electronic" },
  { slug: "daft-punk", title: "Daft Punk", isGroup: true, genre: "electronic" },
  { slug: "the-weeknd", title: "The Weeknd", isGroup: false, genre: "rnb" },
  { slug: "taylor-swift", title: "Taylor Swift", isGroup: false, genre: "pop" },
  { slug: "hans-zimmer", title: "Hans Zimmer", isGroup: false, genre: "classical" },
  { slug: "joe-hisaishi", title: "Joe Hisaishi", nativeTitle: "久石譲", isGroup: false, genre: "classical" },
  { slug: "sawano-hiroyuki", title: "Hiroyuki Sawano", nativeTitle: "澤野弘之", isGroup: false, genre: "electronic" },
  { slug: "linked-horizon", title: "Linked Horizon", isGroup: true, genre: "rock" },
  { slug: "flow", title: "FLOW", isGroup: true, genre: "rock" },
  { slug: "asian-kung-fu-generation", title: "ASIAN KUNG-FU GENERATION", isGroup: true, genre: "rock" },
  { slug: "utada-hikaru-ost", title: "Utada Hikaru", isGroup: false, genre: "jpop" },
] as const;

const COMMUNITY_NAMES = [
  "Jujutsu Kaisen Sorcerers", "Demon Slayer Corps", "Anime OST Lounge", "K-Pop Universe",
  "J-Pop Central", "Cyberpunk Watch Club", "Studio Ghibli Society", "Mecha Pilots HQ",
  "Romance Anime Den", "Horror & Thriller Fans", "Sports Anime Arena", "Isekai Explorers",
  "Manhwa & Webtoon Hub", "Cosplay Creators", "Figure Collectors", "Manga Readers Guild",
  "Attack on Titan Theories", "One Piece Grand Fleet", "Chainsaw Man Church", "Spy x Family Fans",
  "Neon Nights Anime", "K-Drama binge", "Marvel & Anime Crossover", "Retro Anime Vault",
  "Seinen Cinema Club", "Shoujo Sparkle", "Voice Actor Appreciation", "AMV Editors",
  "Watch Party Central", "Late Night Episodes", "Seasonal Anime 2026", "Film Score Society",
  "Synthwave & OST", "Indie Animation", "Pixel Art Anime", "Light Novel Library",
  "Gacha & Genshin Lounge", "VTuber Fan Zone", "Anime Debate Arena", "Fan Art Gallery",
  "Collector's Vault", "OST Composer Fans", "Battle Shounen League", "Slice of Life Cafe",
  "Psychological Thriller Lab", "Sci-Fi Anime Nexus", "Fantasy Realm", "Music Video Nights",
  "Global Anime Watch", "AniVerse Official Hub",
] as const;

const USER_PROFILES = [
  { name: "Reetam Dutta", handle: "reetam_dutta", email: "reetam@aniverse.local", location: "Kolkata, India", bio: "Building taste profiles and binge-watching everything neon." },
  { name: "Sakura Neon", handle: "sakura_neon", email: "sakura@aniverse.local", location: "Tokyo, Japan", bio: "J-pop devotee. Frieren evangelist. Always listening to RADWIMPS." },
  { name: "Min-jun Park", handle: "minjun_park", email: "minjun@aniverse.local", location: "Seoul, South Korea", bio: "K-drama and K-pop curator. NewJeans supremacy." },
  { name: "Alex Rivera", handle: "alex_rivera", email: "alex@aniverse.local", location: "Los Angeles, USA", bio: "Film nerd meets anime addict. Blade Runner nights only." },
  { name: "Yuki Tanaka", handle: "yuki_tanaka", email: "yuki@aniverse.local", location: "Osaka, Japan", bio: "Collecting OSTs since 2015. LiSA concerts are religion." },
  { name: "Priya Sharma", handle: "priya_sharma", email: "priya@aniverse.local", location: "Mumbai, India", bio: "Psychological anime and spicy community debates." },
  { name: "Noah Chen", handle: "noah_chen", email: "noah@aniverse.local", location: "Singapore", bio: "Mecha, cyberpunk, and synthwave playlists 24/7." },
  { name: "Emma Laurent", handle: "emma_laurent", email: "emma@aniverse.local", location: "Paris, France", bio: "Ghibli mornings, seinen evenings." },
  { name: "Diego Santos", handle: "diego_santos", email: "diego@aniverse.local", location: "São Paulo, Brazil", bio: "Sports anime hype man. Blue Lock tactics analyst." },
  { name: "Hana Mori", handle: "hana_mori", email: "hana@aniverse.local", location: "Kyoto, Japan", bio: "Slice-of-life connoisseur. Tea and Studio Ghibli." },
  { name: "Omar Hassan", handle: "omar_hassan", email: "omar@aniverse.local", location: "Cairo, Egypt", bio: "Epic soundtracks and historical anime buff." },
  { name: "Luna Vega", handle: "luna_vega", email: "luna@aniverse.local", location: "Mexico City, Mexico", bio: "Horror anime at midnight. Community mod energy." },
  { name: "Kai Nakamura", handle: "kai_nakamura", email: "kai@aniverse.local", location: "Yokohama, Japan", bio: "Ranking every season. Data-driven taste scores." },
  { name: "Zara Ahmed", handle: "zara_ahmed", email: "zara@aniverse.local", location: "London, UK", bio: "K-drama romcoms and cozy watch parties." },
  { name: "Ethan Brooks", handle: "ethan_brooks", email: "ethan@aniverse.local", location: "Toronto, Canada", bio: "Western animation meets anime crossover fan." },
  { name: "Mia Johansson", handle: "mia_johansson", email: "mia@aniverse.local", location: "Stockholm, Sweden", bio: "Nordic noir and dark anime aesthetic." },
  { name: "Ravi Kapoor", handle: "ravi_kapoor", email: "ravi@aniverse.local", location: "Delhi, India", bio: "Bollywood meets anime OST mashups." },
  { name: "Chloe Kim", handle: "chloe_kim", email: "chloe@aniverse.local", location: "Busan, South Korea", bio: "TWICE loops and community event planner." },
  { name: "Marcus Webb", handle: "marcus_webb", email: "marcus@aniverse.local", location: "Chicago, USA", bio: "Documentary buff exploring global storytelling." },
  { name: "Aiko Sato", handle: "aiko_sato", email: "aiko@aniverse.local", location: "Sapporo, Japan", bio: "Winter anime vibes and vinyl OST collector." },
] as const;

export interface UserSeed {
  email: string;
  password: string;
  name: string;
  handle: string;
  avatarColor: string;
  avatarUrl: string;
  portraitUrl: string;
  bio: string;
  location: string;
  aiTasteScore: number;
}

export interface CommunitySeed {
  slug: string;
  name: string;
  category: string;
  description: string;
  visibility: "PUBLIC" | "PRIVATE";
  activityLevel: string;
  accent: AccentColor;
  imageUrl: string;
  wallpaperUrl: string;
  posts: Array<{
    authorEmail: string;
    title: string;
    content: string;
    imageUrl?: string;
    kind?: "POST" | "ANNOUNCEMENT";
    likeCount: number;
    commentCount: number;
    shareCount: number;
  }>;
}

export interface CollectionSeed {
  slug: string;
  ownerEmail: string;
  name: string;
  description: string;
  category: string;
  genreLabels: string[];
  kind: "content" | "music";
  visibility: "PUBLIC" | "PRIVATE";
  accent: AccentColor;
  imageUrl: string;
  favoriteCount: number;
  items?: string[];
  tracks?: string[];
}

function buildContentItem(
  title: string,
  type: ContentSeedBase["type"],
  index: number,
): ContentSeedBase {
  const slug = slugify(title);
  const accent = pick(ACCENTS, index);
  const genreA = pick(CONTENT_GENRES, index);
  const genreB = pick(CONTENT_GENRES, index + 3);
  const year = 1998 + (index % 28);
  const isMovie = type === "movie" || type === "documentary";
  const seasons = isMovie ? undefined : 1 + (index % 3);
  const episodes = isMovie ? undefined : 12 + (index % 13);

  const lang: CatalogLanguage =
    type === "kdrama" ? "korean" : type === "show" || type === "movie" || type === "documentary" ? "english" : "japanese";

  return {
    slug,
    title,
    nativeTitle: type === "anime" || type === "kdrama" ? title : undefined,
    type,
    accent,
    genreLabels: [genreA, genreB, pick(CONTENT_GENRES, index + 7)],
    languages: [lang, "english"],
    rating: 7.2 + (index % 23) * 0.1,
    year,
    meta: isMovie ? "Feature Film" : `${seasons} Season${seasons === 1 ? "" : "s"}`,
    seasonCount: seasons,
    episodeCount: episodes,
    seasonLabel: seasons ? "Season 1" : undefined,
    studio: type === "anime" ? pick(["MAPPA", "ufotable", "Wit Studio", "Madhouse", "Bones"], index) : pick(["Netflix", "HBO", "A24", "Disney+", "CJ ENM"], index),
    director: pick(["Sunghoo Park", "Christopher Nolan", "Bong Joon-ho", "Makoto Shinkai", "Denis Villeneuve"], index),
    originalAuthor: type === "anime" ? pick(["Gege Akutami", "Gege Akutami", "Hajime Isayama", "Tsugumi Ohba"], index) : undefined,
    sourceMaterial: type === "anime" ? pick(["Manga", "Light Novel", "Original"], index) : type === "kdrama" ? "Original Screenplay" : "Original",
    status: index % 4 === 0 ? "Ongoing" : "Completed",
    ageRating: index % 5 === 0 ? "18+" : "16+",
    imdbRating: 7 + (index % 20) * 0.1,
    malScore: type === "anime" ? 7.5 + (index % 15) * 0.1 : undefined,
    airedFrom: `Jan ${year}`,
    airedTo: index % 4 === 0 ? undefined : `Dec ${year + (seasons ?? 0)}`,
    episodeDuration: isMovie ? "2h 15m" : "24 Min",
    highlightTags: [pick(CONTENT_GENRES, index), "Fan Favorite", "HD Remaster"],
    trendingLabel: `Trending on AniVerse · ${type.toUpperCase()}`,
    creditLabel: `${pick(["Studio", "Director", "Creator"], index)} Spotlight`,
    imageUrl: posterImage(index),
    backdropUrl: backdropImage(index),
    description: `${title} is a ${type} experience curated for AniVerse — rich characters, neon-soaked visuals, and a story that stays with you.`,
    synopsis: `In ${title}, worlds collide under electric skies. Follow unforgettable characters through ${pick(["betrayal", "redemption", "discovery", "war", "love"], index)} as the narrative unfolds across ${isMovie ? "one breathtaking film" : `${episodes ?? 12} episodes`}. A must-watch for fans of ${genreA} and ${genreB}.`,
  };
}

export function generateContentItems(): ContentSeedBase[] {
  const items: ContentSeedBase[] = [];
  ANIME_TITLES.forEach((title, i) => items.push(buildContentItem(title, "anime", i)));
  MOVIE_TITLES.forEach((title, i) => items.push(buildContentItem(title, "movie", 40 + i)));
  SHOW_TITLES.forEach((title, i) => items.push(buildContentItem(title, "show", 60 + i)));
  KDRAMA_TITLES.forEach((title, i) => items.push(buildContentItem(title, "kdrama", 80 + i)));
  DOC_TITLES.forEach((title, i) => items.push(buildContentItem(title, "documentary", 95 + i)));
  return items;
}

export function generateArtistItems(): ArtistSeed[] {
  return ARTIST_NAMES.map((artist, index) => ({
    slug: artist.slug,
    title: artist.title,
    nativeTitle: artist.nativeTitle,
    accent: pick(ACCENTS, index),
    rating: 7.8 + (index % 12) * 0.1,
    rankLeft: `#${(index % 10) + 1} in ${artist.genre.toUpperCase()}`,
    rankRight: `${12 + (index % 50)}M monthly listeners`,
    genreLabels: [artist.genre, pick(ARTIST_GENRES, index + 2)],
    languages: artist.genre === "kpop" ? ["korean", "english"] as CatalogLanguage[] : ["japanese", "english"],
    label: pick(["Sony Music", "Sacra Music", "HYBE", "YG Entertainment", "AniVerse Records"], index),
    debutYear: 1995 + (index % 25),
    isGroup: artist.isGroup,
    members: artist.members,
    primaryTags: [artist.genre, artist.isGroup ? "Group" : "Solo", "Trending"],
    imageUrl: posterImage(index + 5),
    synopsis: `${artist.title} defines the ${artist.genre} soundscape on AniVerse — from arena anthems to intimate ballads, their catalog shapes how fans discover music and anime OSTs alike.`,
    catalogReviews: [
      review("AniVerse Curator", 8.5 + (index % 10) * 0.1, `${artist.title} delivers consistent quality across albums and live performances. Essential listening.`, pick(ACCENTS, index)),
      review(pick(USER_PROFILES, index).name, 8 + (index % 5), `Been on repeat all week. ${artist.title} never misses.`, pick(ACCENTS, index + 1)),
    ],
  }));
}

const SONG_TITLE_PARTS = [
  "Neon", "Midnight", "Crystal", "Echo", "Pulse", "Gravity", "Horizon", "Velvet",
  "Phantom", "Radiant", "Static", "Aurora", "Crimson", "Silver", "Golden", "Shadow",
  "Dream", "Voltage", "Paradox", "Eclipse", "Infinity", "Solstice", "Mirage", "Catalyst",
];

export function generateMusicItems(artists: ArtistSeed[], content: ContentSeedBase[]): MusicSeed[] {
  const tracks: MusicSeed[] = [];
  for (let i = 0; i < 100; i++) {
    const artist = pick(artists, i);
    const partA = pick(SONG_TITLE_PARTS, i);
    const partB = pick(SONG_TITLE_PARTS, i + 11);
    const title = i < 30
      ? pick([
          "Gurenge", "Idol", "KICK BACK", "Kaiju", "Oshama", "unravel", "Again", "Peace Sign",
          "Red Swan", "Homura", "Lemon", "Pretender", "Paprika", "Racing into the Night",
          "Gunjou", "Mixed Nuts", "Bling-Bang-Bang-Born", "SPECIALZ", "Bite Me", "Ditto",
          "Super Shy", "Seven", "Dynamite", "Butter", "Pink Venom", "How You Like That",
          "S-Class", "God's Menu", "Thunderous", "Back Door",
        ], i)
      : `${partA} ${partB}`;
    const slug = slugify(`${artist.slug}-${title}-${i}`);
    const kind = i % 7 === 0 ? "album" as const : i % 5 === 0 ? "ost" as const : "song" as const;
    const linkedContent = kind === "ost" ? pick(content, i) : undefined;

    tracks.push({
      slug,
      title,
      nativeTitle: artist.genreLabels.includes("jpop") ? title : undefined,
      artist: artist.title,
      artistSlug: artist.slug,
      kind,
      description: `${title} by ${artist.title} — a ${kind} track with cinematic production and AniVerse neon energy.`,
      lyrics: kind === "song" ? `[Verse]\nNeon lights on ${title}\nWe ride the pulse tonight\n[Chorus]\n${artist.title} — feel the glow` : undefined,
      source: kind === "ost" ? linkedContent?.title : `${artist.title} — Studio Album`,
      contentSlug: linkedContent?.slug,
      album: kind === "album" ? `${title} (Complete Edition)` : pick([`${artist.title} Vol. ${1 + (i % 3)}`, "Singles Collection", "Live Sessions"], i),
      language: artist.languages[0],
      genreLabels: [kind === "ost" ? "ost" : pick(SONG_GENRES, i), pick(SONG_GENRES, i + 4)],
      rating: 7.5 + (i % 20) * 0.1,
      year: 2015 + (i % 11),
      durationLabel: `${3 + (i % 4)}:${String(10 + (i % 50)).padStart(2, "0")}`,
      durationSeconds: 180 + (i % 120),
      imageUrl: posterImage(i + 10),
      accent: pick(ACCENTS, i),
      trendingLabel: `Trending on AniVerse · ${kind.toUpperCase()}`,
      creditLabel: `By ${artist.title}`,
      featuredRank: i < 12 ? i + 1 : undefined,
      catalogReviews: [
        review(pick(USER_PROFILES, i).name, 8 + (i % 3) * 0.3, `${title} is on loop. Perfect ${kind} energy.`, pick(ACCENTS, i)),
      ],
    });
  }
  return tracks;
}

export function generateUserSeeds(): UserSeed[] {
  return USER_PROFILES.map((user, index) => ({
    email: user.email,
    password: "User123!",
    name: user.name,
    handle: user.handle,
    avatarColor: pick(["#ff00cc", "#00d4ff", "#ffd000", "#ae00ff", "#00ff88", "#ff6b35"], index),
    avatarUrl: avatarImage(index),
    portraitUrl: posterImage(index + 3),
    bio: user.bio,
    location: user.location,
    aiTasteScore: 72 + (index % 28),
  }));
}

export function generateCommunitySeeds(users: UserSeed[]): CommunitySeed[] {
  return COMMUNITY_NAMES.map((name, index) => {
    const author = pick(users, index);
    const coAuthor = pick(users, index + 5);
    return {
      slug: slugify(name),
      name,
      category: pick(["Anime", "Music", "K-Drama", "Movies", "Community", "Gaming", "Art"], index),
      description: `${name} is where AniVerse fans gather to discuss theories, share fan art, host watch parties, and celebrate ${pick(["anime", "music", "films", "K-pop", "OSTs"], index)} together.`,
      visibility: index % 9 === 0 ? "PRIVATE" as const : "PUBLIC" as const,
      activityLevel: pick(["very-active", "active", "moderate", "quiet"], index),
      accent: pick(ACCENTS, index),
      imageUrl: posterImage(index + 2),
      wallpaperUrl: backdropImage(index),
      posts: [
        {
          authorEmail: author.email,
          title: `Welcome to ${name}!`,
          content: `Glad you're here. Introduce yourself and share what you're watching or listening to this week.`,
          imageUrl: posterImage(index + 4),
          kind: "ANNOUNCEMENT",
          likeCount: 120 + index * 3,
          commentCount: 18 + (index % 20),
          shareCount: 6 + (index % 8),
        },
        {
          authorEmail: coAuthor.email,
          title: `Weekly picks inside ${name}`,
          content: `Drop your top 3 recommendations — anime, songs, or collections. Let's build the ultimate list.`,
          imageUrl: posterImage(index + 8),
          likeCount: 45 + index * 2,
          commentCount: 12 + (index % 15),
          shareCount: 3 + (index % 5),
        },
      ],
    };
  });
}

export function generateCollectionSeeds(
  users: UserSeed[],
  content: ContentSeedBase[],
  tracks: MusicSeed[],
): CollectionSeed[] {
  const collections: CollectionSeed[] = [];
  const templates = [
    { prefix: "Neon", suffix: "Vault", kind: "content" as const, category: "Anime" },
    { prefix: "Midnight", suffix: "Playlist", kind: "music" as const, category: "Music" },
    { prefix: "Cyber", suffix: "Watchlist", kind: "content" as const, category: "Mixed" },
    { prefix: "Crystal", suffix: "Sessions", kind: "music" as const, category: "OST" },
    { prefix: "Aurora", suffix: "Picks", kind: "content" as const, category: "Movies" },
  ];

  for (let i = 0; i < 50; i++) {
    const tpl = pick(templates, i);
    const owner = pick(users, i);
    const name = `${tpl.prefix} ${tpl.suffix} ${i + 1}`;
    const slug = slugify(`collection-${name}-${owner.handle}`);

    const itemSlugs = Array.from({ length: 6 }, (_, j) => content[(i * 3 + j) % content.length]!.slug);
    const trackSlugs = Array.from({ length: 8 }, (_, j) => tracks[(i * 2 + j) % tracks.length]!.slug);

    collections.push({
      slug,
      ownerEmail: owner.email,
      name,
      description: `A curated ${tpl.kind} collection by ${owner.name} — hand-picked for neon nights and perfect binge sessions on AniVerse.`,
      category: tpl.category,
      genreLabels: [pick(CONTENT_GENRES, i), pick(CONTENT_GENRES, i + 5)],
      kind: tpl.kind,
      visibility: i % 6 === 0 ? "PRIVATE" : "PUBLIC",
      accent: pick(ACCENTS, i),
      imageUrl: posterImage(i + 6),
      favoriteCount: 5 + (i % 40),
      items: tpl.kind === "content" ? itemSlugs : undefined,
      tracks: tpl.kind === "music" ? trackSlugs : undefined,
    });
  }
  return collections;
}

export const CONTENT_ITEMS = generateContentItems();
export const ARTIST_ITEMS = generateArtistItems();
export const MUSIC_ITEMS = generateMusicItems(ARTIST_ITEMS, CONTENT_ITEMS);
export const USER_SEEDS = generateUserSeeds();
export const COMMUNITY_SEEDS = generateCommunitySeeds(USER_SEEDS);
export const COLLECTION_SEEDS = generateCollectionSeeds(USER_SEEDS, CONTENT_ITEMS, MUSIC_ITEMS);

export const DEMO_USER = {
  email: USER_SEEDS[0]!.email,
  password: USER_SEEDS[0]!.password,
  name: USER_SEEDS[0]!.name,
  handle: USER_SEEDS[0]!.handle,
  avatarColor: USER_SEEDS[0]!.avatarColor,
  aiTasteScore: USER_SEEDS[0]!.aiTasteScore,
} as const;

export function buildWatchlistForUser(userIndex: number, content: ContentSeedBase[]) {
  const statuses = ["WATCHING", "PENDING", "COMPLETED"] as const;
  const priorities = ["HIGH", "NORMAL"] as const;
  return Array.from({ length: 8 }, (_, i) => ({
    slug: content[(userIndex * 4 + i) % content.length]!.slug,
    priority: pick(priorities, i),
    status: pick(statuses, userIndex + i),
  }));
}
