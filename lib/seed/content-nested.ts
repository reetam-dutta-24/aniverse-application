import type { ContentNestedSeed } from "./helpers";
import { generateMovieNested, generateSeriesNested, poster } from "./helpers";

const p = poster;

/** Rich nested data for flagship titles; others get auto-generated in seed.ts. */
export const CONTENT_NESTED: Record<string, ContentNestedSeed> = {
  "jujutsu-kaisen": {
    seasons: [
      { label: "Season 1", episodeCount: 24 },
      { label: "Season 2", episodeCount: 23 },
    ],
    episodes: [
      { seasonNumber: 1, number: 1, title: "Ryomen Sukuna", duration: "24 Min", description: "Yuji swallows a cursed finger and becomes Sukuna's vessel.", thumbnailUrl: p("jujutsu-kaisen"), language: "japanese", rating: 9.1 },
      { seasonNumber: 1, number: 2, title: "For Myself", duration: "24 Min", description: "Yuji enrolls at Tokyo Jujutsu High.", thumbnailUrl: p("jujutsu-kaisen"), language: "japanese", rating: 8.9 },
      { seasonNumber: 1, number: 3, title: "Girl of Steel", duration: "24 Min", description: "Nobara joins the team on a mission in Roppongi.", thumbnailUrl: p("jujutsu-kaisen"), language: "japanese", rating: 8.8 },
      { seasonNumber: 1, number: 4, title: "Curse Womb Must Die", duration: "24 Min", description: "The first-years face a special-grade curse.", thumbnailUrl: p("jujutsu-kaisen"), language: "japanese", rating: 9.0 },
      { seasonNumber: 2, number: 1, title: "Hidden Inventory", duration: "24 Min", description: "Gojo's past with Geto begins to unfold.", thumbnailUrl: p("jujutsu-kaisen"), language: "japanese", rating: 9.2 },
    ],
    characters: [
      { name: "Yuji Itadori", role: "Main", voiceActor: "Junya Enoki", accent: "blue" },
      { name: "Megumi Fushiguro", role: "Main", voiceActor: "Yuma Uchida", accent: "cyan" },
      { name: "Nobara Kugisaki", role: "Main", voiceActor: "Asami Seto", accent: "pink" },
      { name: "Satoru Gojo", role: "Teacher", voiceActor: "Yuichi Nakamura", accent: "sky" },
      { name: "Sukuna", role: "Antagonist", voiceActor: "Junichi Suwabe", accent: "red" },
    ],
    relatedSlugs: ["demon-slayer", "chainsaw-man", "tokyo-ghoul", "mob-psycho-100"],
    featuredTrackSlugs: ["kaikai-kitan", "lost-in-paradise"],
    catalogReviews: [
      { authorName: "Reetam Dutta", authorAvatarColor: "#ff00cc", rating: 9, headline: "MAPPA at its best", body: "Fluid fights, sharp character writing, and one of the best opening seasons in years.", accent: "blue", likeCount: 42 },
      { authorName: "Aanya Rao", authorAvatarColor: "#00ff8c", rating: 8.5, body: "Shibuya arc animation is insane. Gojo carries every scene he's in.", accent: "cyan", likeCount: 28 },
    ],
  },
  "demon-slayer": {
    ...generateSeriesNested("demon-slayer", {
      seasonCount: 1,
      episodesPerSeason: 8,
      prefix: "Arc",
      episodeTitles: [
        "Cruelty", "Trainer Sakonji Urokodaki", "Sabito and Makomo",
        "Final Selection", "My Own Steel", "Swordsman Accompanying",
        "Muzan Kibutsuji", "The Smell of Enchanting Blood",
      ],
    }),
    characters: [
      { name: "Tanjiro Kamado", role: "Main", voiceActor: "Natsuki Hanae", accent: "green" },
      { name: "Nezuko Kamado", role: "Main", voiceActor: "Akari Kito", accent: "pink" },
      { name: "Zenitsu Agatsuma", role: "Main", voiceActor: "Hiro Shimono", accent: "yellow" },
      { name: "Inosuke Hashibira", role: "Main", voiceActor: "Yoshitsugu Matsuoka", accent: "blue" },
    ],
    relatedSlugs: ["jujutsu-kaisen", "chainsaw-man", "naruto-shippuden"],
    featuredTrackSlugs: ["gurenge", "homura"],
    catalogReviews: [
      { authorName: "Bishal Deb", rating: 9, body: "Ufotable animation plus LiSA openings equals instant classic.", accent: "purple", likeCount: 55 },
    ],
  },
  "attack-on-titan": {
    ...generateSeriesNested("attack-on-titan", { seasonCount: 1, episodesPerSeason: 6, prefix: "Episode" }),
    characters: [
      { name: "Eren Yeager", role: "Main", voiceActor: "Yuki Kaji", accent: "green" },
      { name: "Mikasa Ackerman", role: "Main", voiceActor: "Yui Ishikawa", accent: "red" },
      { name: "Armin Arlert", role: "Main", voiceActor: "Marina Inoue", accent: "cyan" },
      { name: "Levi Ackerman", role: "Captain", voiceActor: "Hiroshi Kamiya", accent: "indigo" },
    ],
    relatedSlugs: ["vinland-saga", "code-geass", "death-note"],
    featuredTrackSlugs: ["shinzou-wo-sasageyo"],
    catalogReviews: [
      { authorName: "Reetam Dutta", rating: 9.5, headline: "A modern epic", body: "Few shows land an ending this ambitious. Peak fiction for a generation.", accent: "cyan", likeCount: 120 },
    ],
  },
  "suzume": {
    ...generateMovieNested("suzume", "Suzume no Tojimari", "122 Min"),
    characters: [
      { name: "Suzume Iwato", role: "Main", voiceActor: "Nanoka Hara", accent: "cyan" },
      { name: "Souta Munakata", role: "Main", voiceActor: "Hokuto Matsumura", accent: "blue" },
      { name: "Daijin", role: "Cat", accent: "yellow" },
    ],
    relatedSlugs: ["your-name", "weathering-with-you", "spirited-away"],
    featuredTrackSlugs: ["suzume", "kanata-haluka"],
    catalogReviews: [
      { authorName: "Aanya Rao", rating: 8.5, body: "Makoto Shinkai's door motif hits emotionally. Stunning vistas throughout.", accent: "cyan", likeCount: 34 },
    ],
  },
  "your-name": {
    ...generateMovieNested("your-name", "Your Name", "106 Min"),
    relatedSlugs: ["weathering-with-you", "suzume", "a-silent-voice"],
    featuredTrackSlugs: ["zenzenzense", "sparkle"],
    catalogReviews: [
      { authorName: "Bishal Deb", rating: 9, body: "RADWIMPS soundtrack plus Shinkai visuals — perfection.", accent: "sky", likeCount: 88 },
    ],
  },
  "oshi-no-ko": {
    ...generateSeriesNested("oshi-no-ko", { seasonCount: 1, episodesPerSeason: 6 }),
    characters: [
      { name: "Aqua Hoshino", role: "Main", accent: "blue" },
      { name: "Ruby Hoshino", role: "Main", accent: "pink" },
      { name: "Ai Hoshino", role: "Idol", accent: "fuchsia" },
    ],
    relatedSlugs: ["spy-x-family", "classroom-of-elite"],
    featuredTrackSlugs: ["idol", "sign"],
    catalogReviews: [
      { authorName: "Reetam Dutta", rating: 9, headline: "Dark idol drama", body: "YOASOBI's Idol hits different after episode 1. Bold storytelling.", accent: "fuchsia", likeCount: 67 },
    ],
  },
  "frieren": {
    ...generateSeriesNested("frieren", { seasonCount: 1, episodesPerSeason: 6 }),
    characters: [
      { name: "Frieren", role: "Mage", accent: "green" },
      { name: "Fern", role: "Mage", accent: "purple" },
      { name: "Stark", role: "Warrior", accent: "orange" },
    ],
    relatedSlugs: ["vinland-saga", "dungeon-meshi", "spy-x-family"],
    catalogReviews: [
      { authorName: "Aanya Rao", rating: 9.5, body: "Quiet, melancholic, and beautiful. Best anime of 2023.", accent: "green", likeCount: 95 },
    ],
  },
  "chainsaw-man": {
    ...generateSeriesNested("chainsaw-man", { seasonCount: 1, episodesPerSeason: 6 }),
    relatedSlugs: ["jujutsu-kaisen", "tokyo-ghoul", "cyberpunk-edgerunners"],
    featuredTrackSlugs: ["kick-back", "first-death"],
    catalogReviews: [
      { authorName: "Bishal Deb", rating: 8.5, body: "Raw, chaotic energy. MAPPA does Fujimoto justice.", accent: "pink", likeCount: 41 },
    ],
  },
  "crash-landing-on-you": {
    ...generateSeriesNested("crash-landing-on-you", { seasonCount: 1, episodesPerSeason: 6, prefix: "Episode" }),
    relatedSlugs: ["extraordinary-attorney-woo", "squid-game"],
    catalogReviews: [
      { authorName: "Reetam Dutta", rating: 9, body: "Peak K-drama rom-com. Hyun Bin and Son Ye-jin have insane chemistry.", accent: "pink", likeCount: 72 },
    ],
  },
  "spirited-away": {
    ...generateMovieNested("spirited-away", "Spirited Away", "125 Min"),
    relatedSlugs: ["your-name", "a-silent-voice"],
    catalogReviews: [
      { authorName: "Aanya Rao", rating: 9.5, body: "Studio Ghibli masterpiece. Still magical decades later.", accent: "emerald", likeCount: 110 },
    ],
  },
};
