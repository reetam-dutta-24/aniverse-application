import { poster } from "./helpers";

export const DEMO_USER = {
  email: "reetam@aniverse.local",
  password: "User123!",
  name: "Reetam Dutta",
  handle: "reetam_dutta",
  avatarColor: "#ffd000",
  aiTasteScore: 94,
} as const;

export const DEMO_WATCHLIST = [
  { slug: "jujutsu-kaisen", priority: "HIGH" as const, status: "WATCHING" as const },
  { slug: "demon-slayer", priority: "HIGH" as const, status: "WATCHING" as const },
  { slug: "death-note", priority: "HIGH" as const, status: "PENDING" as const },
  { slug: "attack-on-titan", priority: "HIGH" as const, status: "PENDING" as const },
  { slug: "frieren", priority: "NORMAL" as const, status: "PENDING" as const },
  { slug: "spy-x-family", priority: "NORMAL" as const, status: "COMPLETED" as const },
  { slug: "chainsaw-man", priority: "NORMAL" as const, status: "PENDING" as const },
  { slug: "vinland-saga", priority: "HIGH" as const, status: "WATCHING" as const },
  { slug: "haikyu", priority: "NORMAL" as const, status: "PENDING" as const },
  { slug: "blue-lock", priority: "NORMAL" as const, status: "PENDING" as const },
] as const;

export const DEMO_COLLECTIONS = [
  {
    slug: "anime-masterpieces",
    name: "Anime Masterpieces",
    description:
      "A hand-picked vault of anime that defined your taste — psychological thrillers, sweeping action, and quiet character dramas.",
    category: "Anime",
    genreLabels: ["thriller", "crime", "mystery", "supernatural", "action", "fantasy"],
    kind: "content",
    visibility: "PRIVATE" as const,
    accent: "purple",
    imageUrl: poster("death-note"),
    favoriteCount: 16,
    items: [
      "death-note",
      "jujutsu-kaisen",
      "demon-slayer",
      "spy-x-family",
      "classroom-of-the-elite",
      "attack-on-titan",
      "vinland-saga",
      "frieren",
    ],
  },
  {
    slug: "weekend-binge",
    name: "Weekend Binge",
    description: "Movies and shorter series for a single-session watch.",
    category: "Movies",
    genreLabels: ["drama", "fantasy", "romance"],
    kind: "content",
    visibility: "PUBLIC" as const,
    accent: "blue",
    imageUrl: poster("your-name"),
    favoriteCount: 9,
    items: ["your-name", "suzume", "demon-slayer", "jujutsu-kaisen"],
  },
  {
    slug: "ost-favorites",
    name: "OST Favorites",
    description: "Anime openings, endings, and standout tracks.",
    category: "Music",
    genreLabels: ["action", "fantasy"],
    kind: "music",
    visibility: "PUBLIC" as const,
    accent: "pink",
    imageUrl: poster("gurenge"),
    favoriteCount: 12,
    tracks: ["gurenge", "kaikai-kitan", "idol", "kick-back"],
  },
] as const;

export const DEMO_COMMUNITIES = [
  {
    slug: "global-anime-community",
    name: "Global Anime Community",
    category: "Anime",
    description:
      "The world's largest anime discussion hub — rankings, recommendations, watch parties, and deep-dive debates on everything from classics to seasonal premieres.",
    visibility: "PUBLIC" as const,
    activityLevel: "very-active",
    accent: "cyan",
    imageUrl: poster("jujutsu-kaisen"),
    wallpaperUrl: poster("suzume"),
    posts: [
      {
        authorEmail: "reetam@aniverse.local",
        content: "New anime poster has just been posted — Oshi no Ko season hype is real.",
        imageUrl: poster("oshi-no-ko"),
        likeCount: 876,
        commentCount: 50,
        shareCount: 12,
      },
      {
        authorEmail: "content@aniverse.local",
        content:
          "Weekly recommendation thread is live — drop your hidden gems below!",
        imageUrl: poster("chainsaw-man"),
        likeCount: 624,
        commentCount: 94,
        shareCount: 18,
      },
    ],
    extraMembers: ["content@aniverse.local", "music@aniverse.local"],
  },
  {
    slug: "jjk-fanclub",
    name: "Jujutsu Kaisen Fanclub",
    category: "Anime",
    description: "Everything JJK — manga theories, episode reactions, and power scaling debates.",
    visibility: "PUBLIC" as const,
    activityLevel: "active",
    accent: "purple",
    imageUrl: poster("jujutsu-kaisen"),
    wallpaperUrl: poster("jujutsu-kaisen"),
    posts: [
      {
        authorEmail: "reetam@aniverse.local",
        content: "Shibuya arc rewatch this weekend — who is in?",
        imageUrl: poster("jujutsu-kaisen"),
        likeCount: 312,
        commentCount: 41,
        shareCount: 8,
      },
    ],
    extraMembers: ["artist@aniverse.local"],
  },
  {
    slug: "reetams-anime-lounge",
    name: "Reetam's Anime Lounge",
    category: "Mixed",
    description: "Private lounge for curated picks, watchlist swaps, and friend recommendations.",
    visibility: "PRIVATE" as const,
    activityLevel: "moderate",
    accent: "yellow",
    imageUrl: poster("spy-x-family"),
    wallpaperUrl: poster("spy-x-family"),
    posts: [
      {
        authorEmail: "reetam@aniverse.local",
        content: "Added Spy x Family and Frieren to the weekend queue.",
        imageUrl: poster("spy-x-family"),
        likeCount: 48,
        commentCount: 6,
        shareCount: 2,
      },
    ],
    extraMembers: [],
  },
] as const;
