import type {
  AccentColor,
  ArtistGenre,
  CatalogLanguage,
  ContentGenre,
  SongGenre,
} from "@/lib/catalog-enums";
import { roundRating } from "@/lib/format-rating";
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

function catalogRating(base: number, offset: number): number {
  return roundRating(base + offset) ?? base;
}

function review(
  author: string,
  rating: number,
  body: string,
  accent?: AccentColor,
): CatalogReviewSeed {
  return {
    authorName: author,
    authorAvatarColor: "#ff00cc",
    rating: roundRating(rating) ?? rating,
    body,
    accent: accent ?? "pink",
    likeCount: 8 + (Math.floor(rating) % 40),
    headline: body.slice(0, 64),
  };
}

// ─── Title catalogs (100 total: 40 anime + 30 movie + 30 show) ───────────────

const ANIME_TITLES = [
  { title: "Jujutsu Kaisen", native: "呪術廻戦", studio: "MAPPA", author: "Gege Akutami" },
  { title: "Demon Slayer", native: "鬼滅の刃", studio: "ufotable", author: "Koyoharu Gotouge" },
  { title: "Attack on Titan", native: "進撃の巨人", studio: "Wit Studio / MAPPA", author: "Hajime Isayama" },
  { title: "Death Note", native: "デスノート", studio: "Madhouse", author: "Tsugumi Ohba" },
  { title: "Fullmetal Alchemist: Brotherhood", native: "鋼の錬金術師", studio: "Bones", author: "Hiromu Arakawa" },
  { title: "Steins;Gate", native: "シュタインズ・ゲート", studio: "White Fox", author: "5pb. / Nitroplus" },
  { title: "Hunter x Hunter", native: "ハンター×ハンター", studio: "Madhouse", author: "Yoshihiro Togashi" },
  { title: "One Piece", native: "ワンピース", studio: "Toei Animation", author: "Eiichiro Oda" },
  { title: "Naruto Shippuden", native: "ナルト 疾風伝", studio: "Pierrot", author: "Masashi Kishimoto" },
  { title: "Bleach", native: "ブリーチ", studio: "Pierrot", author: "Tite Kubo" },
  { title: "My Hero Academia", native: "僕のヒーローアカデミア", studio: "Bones", author: "Kohei Horikoshi" },
  { title: "Chainsaw Man", native: "チェンソーマン", studio: "MAPPA", author: "Tatsuki Fujimoto" },
  { title: "Spy x Family", native: "スパイファミリー", studio: "Wit Studio / CloverWorks", author: "Tatsuya Endo" },
  { title: "Frieren: Beyond Journey's End", native: "葬送のフリーレン", studio: "Madhouse", author: "Kanehito Yamada" },
  { title: "Vinland Saga", native: "ヴィンランド・サガ", studio: "Wit Studio / MAPPA", author: "Makoto Yukimura" },
  { title: "Mob Psycho 100", native: "モブサイコ100", studio: "Bones", author: "ONE" },
  { title: "Code Geass", native: "コードギアス", studio: "Sunrise", author: "Ichiro Okouchi" },
  { title: "Cowboy Bebop", native: "カウボーイビバップ", studio: "Sunrise", author: "Shinichiro Watanabe" },
  { title: "Neon Genesis Evangelion", native: "新世紀エヴァンゲリオン", studio: "Gainax", author: "Hideaki Anno" },
  { title: "Haikyu!!", native: "ハイキュー!!", studio: "Production I.G", author: "Haruichi Furudate" },
  { title: "Blue Lock", native: "ブルーロック", studio: "8bit", author: "Muneyuki Kaneshiro" },
  { title: "Solo Leveling", native: "俺だけレベルアップな件", studio: "A-1 Pictures", author: "Chugong" },
  { title: "Dandadan", native: "ダンダダン", studio: "Science SARU", author: "Yukinobu Tatsu" },
  { title: "Oshi no Ko", native: "【推しの子】", studio: "Doga Kobo", author: "Aka Akasaka" },
  { title: "Bocchi the Rock!", native: "ぼっち・ざ・ろっく！", studio: "CloverWorks", author: "Aki Hamaji" },
  { title: "Kaguya-sama: Love Is War", native: "かぐや様は告らせたい", studio: "A-1 Pictures", author: "Aka Akasaka" },
  { title: "Re:Zero", native: "Re:ゼロから始める異世界生活", studio: "White Fox", author: "Tappei Nagatsuki" },
  { title: "Violet Evergarden", native: "ヴァイオレット・エヴァーガーデン", studio: "Kyoto Animation", author: "Kana Akatsuki" },
  { title: "Made in Abyss", native: "メイドインアビス", studio: "Kinema Citrus", author: "Akihito Tsukushi" },
  { title: "Tokyo Ghoul", native: "東京喰種", studio: "Pierrot", author: "Sui Ishida" },
  { title: "Parasyte", native: "寄生獣", studio: "Madhouse", author: "Hitoshi Iwaaki" },
  { title: "Erased", native: "僕だけがいない街", studio: "A-1 Pictures", author: "Kei Sanbe" },
  { title: "March Comes in Like a Lion", native: "3月のライオン", studio: "Shaft", author: "Chica Umino" },
  { title: "Ranking of Kings", native: "王様ランキング", studio: "Wit Studio", author: "Sosuke Tokita" },
  { title: "Cyberpunk: Edgerunners", native: "サイバーパンク エッジランナーズ", studio: "Trigger", author: "CD Projekt Red" },
  { title: "Samurai Champloo", native: "サムライチャンプルー", studio: "Madhouse", author: "Shinichiro Watanabe" },
  { title: "Trigun Stampede", native: "トライガン スタンピード", studio: "Orange", author: "Yasuhiro Nightow" },
  { title: "Hell's Paradise", native: "地獄楽", studio: "MAPPA", author: "Yuji Kaku" },
  { title: "Dr. Stone", native: "Dr.STONE", studio: "TMS Entertainment", author: "Riichiro Inagaki" },
  { title: "Your Name", native: "君の名は。", studio: "CoMix Wave Films", author: "Makoto Shinkai" },
] as const;

const MOVIE_TITLES = [
  { title: "Spirited Away", native: "千と千尋の神隠し", studio: "Studio Ghibli", director: "Hayao Miyazaki" },
  { title: "Akira", native: "アキラ", studio: "Tokyo Movie Shinsha", director: "Katsuhiro Otomo" },
  { title: "Ghost in the Shell", native: "攻殻機動隊", studio: "Production I.G", director: "Mamoru Oshii" },
  { title: "Perfect Blue", native: "パーフェクトブルー", studio: "Madhouse", director: "Satoshi Kon" },
  { title: "Paprika", native: "パプリカ", studio: "Madhouse", director: "Satoshi Kon" },
  { title: "The Garden of Words", native: "言の葉の庭", studio: "CoMix Wave Films", director: "Makoto Shinkai" },
  { title: "Weathering With You", native: "天気の子", studio: "CoMix Wave Films", director: "Makoto Shinkai" },
  { title: "Suzume", native: "すずめの戸締まり", studio: "CoMix Wave Films", director: "Makoto Shinkai" },
  { title: "Belle", native: "竜とそばかすの姫", studio: "Studio Chizu", director: "Mamoru Hosoda" },
  { title: "Promare", native: "プロメア", studio: "Trigger", director: "Hiroyuki Imaishi" },
  { title: "Inception", studio: "Warner Bros.", director: "Christopher Nolan" },
  { title: "Interstellar", studio: "Paramount Pictures", director: "Christopher Nolan" },
  { title: "Blade Runner 2049", studio: "Warner Bros.", director: "Denis Villeneuve" },
  { title: "The Matrix", studio: "Warner Bros.", director: "Lana & Lilly Wachowski" },
  { title: "Dune", studio: "Legendary Pictures", director: "Denis Villeneuve" },
  { title: "Everything Everywhere All at Once", studio: "A24", director: "Daniel Kwan & Daniel Scheinert" },
  { title: "Parasite", native: "기생충", studio: "Barunson E&A", director: "Bong Joon-ho" },
  { title: "Oldboy", native: "올드보이", studio: "Show East", director: "Park Chan-wook" },
  { title: "Train to Busan", native: "부산행", studio: "Next Entertainment World", director: "Yeon Sang-ho" },
  { title: "Your Lie in April", native: "四月は君の嘘", studio: "A-1 Pictures", director: "Kyohei Ishiguro" },
  { title: "The Dark Knight", studio: "Warner Bros.", director: "Christopher Nolan" },
  { title: "Pulp Fiction", studio: "Miramax", director: "Quentin Tarantino" },
  { title: "Fight Club", studio: "20th Century Fox", director: "David Fincher" },
  { title: "Whiplash", studio: "Bold Films", director: "Damien Chazelle" },
  { title: "La La Land", studio: "Summit Entertainment", director: "Damien Chazelle" },
  { title: "Mad Max: Fury Road", studio: "Warner Bros.", director: "George Miller" },
  { title: "The Shawshank Redemption", studio: "Castle Rock Entertainment", director: "Frank Darabont" },
  { title: "Ponyo", native: "崖の上のポニョ", studio: "Studio Ghibli", director: "Hayao Miyazaki" },
  { title: "Howl's Moving Castle", native: "ハウルの動く城", studio: "Studio Ghibli", director: "Hayao Miyazaki" },
  { title: "Princess Mononoke", native: "もののけ姫", studio: "Studio Ghibli", director: "Hayao Miyazaki" },
] as const;

const SHOW_TITLES = [
  { title: "Breaking Bad", studio: "AMC", director: "Vince Gilligan", network: "AMC" },
  { title: "Stranger Things", studio: "21 Laps Entertainment", director: "The Duffer Brothers", network: "Netflix" },
  { title: "The Last of Us", studio: "HBO", director: "Craig Mazin", network: "HBO" },
  { title: "Arcane", studio: "Fortiche Production", director: "Pascal Charrue", network: "Netflix" },
  { title: "Wednesday", studio: "MGM Television", director: "Tim Burton", network: "Netflix" },
  { title: "Dark", studio: "Wiedemann & Berg", director: "Baran bo Odar", network: "Netflix" },
  { title: "Black Mirror", studio: "Zeppotron", director: "Charlie Brooker", network: "Netflix" },
  { title: "The Mandalorian", studio: "Lucasfilm", director: "Jon Favreau", network: "Disney+" },
  { title: "House of the Dragon", studio: "HBO", director: "Ryan Condal", network: "HBO" },
  { title: "The Boys", studio: "Amazon MGM Studios", director: "Eric Kripke", network: "Prime Video" },
  { title: "Severance", studio: "Red Hour Productions", director: "Ben Stiller", network: "Apple TV+" },
  { title: "Fallout", studio: "Kilter Films", director: "Jonathan Nolan", network: "Prime Video" },
  { title: "Shogun", studio: "FX Productions", director: "Rachel Kondo", network: "FX / Hulu" },
  { title: "True Detective", studio: "HBO", director: "Nic Pizzolatto", network: "HBO" },
  { title: "Westworld", studio: "HBO", director: "Jonathan Nolan", network: "HBO" },
  { title: "The Witcher", studio: "Platige Image", director: "Lauren Schmidt Hissrich", network: "Netflix" },
  { title: "Loki", studio: "Marvel Studios", director: "Kate Herron", network: "Disney+" },
  { title: "Andor", studio: "Lucasfilm", director: "Tony Gilroy", network: "Disney+" },
  { title: "Invincible", studio: "Skybound Entertainment", director: "Robert Kirkman", network: "Prime Video" },
  { title: "Peacemaker", studio: "DC Studios", director: "James Gunn", network: "Max" },
  { title: "The Office", studio: "Reveille Productions", director: "Greg Daniels", network: "NBC" },
  { title: "Game of Thrones", studio: "HBO", director: "David Benioff & D.B. Weiss", network: "HBO" },
  { title: "Better Call Saul", studio: "Sony Pictures Television", director: "Vince Gilligan", network: "AMC" },
  { title: "The Bear", studio: "FX Productions", director: "Christopher Storer", network: "FX / Hulu" },
  { title: "Succession", studio: "HBO", director: "Jesse Armstrong", network: "HBO" },
  { title: "Ted Lasso", studio: "Doozer Productions", director: "Jason Sudeikis", network: "Apple TV+" },
  { title: "Chernobyl", studio: "HBO", director: "Craig Mazin", network: "HBO" },
  { title: "The Crown", studio: "Left Bank Pictures", director: "Peter Morgan", network: "Netflix" },
  { title: "Mr. Robot", studio: "USA Network", director: "Sam Esmail", network: "USA Network" },
  { title: "Dexter", studio: "Showtime", director: "James Manos Jr.", network: "Showtime" },
] as const;

const ARTIST_NAMES: Array<{
  slug: string;
  title: string;
  nativeTitle?: string;
  isGroup: boolean;
  genre: ArtistGenre;
  label: string;
  debutYear: number;
  languages?: CatalogLanguage[];
  members?: { name: string; role: string }[];
}> = [
  { slug: "lisa", title: "LiSA", nativeTitle: "リサ", isGroup: false, genre: "jpop", label: "Sacra Music", debutYear: 2010 },
  { slug: "yoasobi", title: "YOASOBI", isGroup: true, genre: "jpop", label: "Sony Music", debutYear: 2019, members: [{ name: "Ayase", role: "Composer" }, { name: "ikura", role: "Vocalist" }] },
  { slug: "radwimps", title: "RADWIMPS", isGroup: true, genre: "rock", label: "Universal Music", debutYear: 2001, members: [{ name: "Yojiro Noda", role: "Vocalist" }, { name: "Tomoya Ohashi", role: "Guitar" }] },
  { slug: "kenshi-yonezu", title: "Kenshi Yonezu", nativeTitle: "米津玄師", isGroup: false, genre: "jpop", label: "Sony Music", debutYear: 2013 },
  { slug: "aimer", title: "Aimer", isGroup: false, genre: "ballad", label: "Sony Music", debutYear: 2011 },
  { slug: "king-gnu", title: "King Gnu", isGroup: true, genre: "rock", label: "Sony Music", debutYear: 2013, members: [{ name: "Tsuneda Daiki", role: "Vocalist" }, { name: "Satoru Iguchi", role: "Guitar" }] },
  { slug: "eve", title: "Eve", isGroup: false, genre: "jpop", label: "Harapeco-Punch", debutYear: 2009 },
  { slug: "ado", title: "Ado", isGroup: false, genre: "jpop", label: "Universal Music", debutYear: 2020 },
  { slug: "milet", title: "milet", isGroup: false, genre: "pop", label: "SME Records", debutYear: 2018 },
  { slug: "fujii-kaze", title: "Fujii Kaze", nativeTitle: "藤井風", isGroup: false, genre: "pop", label: "Universal Music", debutYear: 2020 },
  { slug: "bts", title: "BTS", nativeTitle: "방탄소년단", isGroup: true, genre: "kpop", label: "HYBE", debutYear: 2013, members: [{ name: "RM", role: "Leader" }, { name: "Jungkook", role: "Vocalist" }, { name: "Jimin", role: "Vocalist" }] },
  { slug: "blackpink", title: "BLACKPINK", isGroup: true, genre: "kpop", label: "YG Entertainment", debutYear: 2016, members: [{ name: "Jennie", role: "Rapper" }, { name: "Lisa", role: "Dancer" }, { name: "Rosé", role: "Vocalist" }] },
  { slug: "newjeans", title: "NewJeans", isGroup: true, genre: "kpop", label: "ADOR", debutYear: 2022, members: [{ name: "Minji", role: "Vocalist" }, { name: "Hanni", role: "Vocalist" }, { name: "Haerin", role: "Vocalist" }] },
  { slug: "twice", title: "TWICE", isGroup: true, genre: "kpop", label: "JYP Entertainment", debutYear: 2015, members: [{ name: "Nayeon", role: "Vocalist" }, { name: "Momo", role: "Dancer" }, { name: "Sana", role: "Vocalist" }] },
  { slug: "stray-kids", title: "Stray Kids", isGroup: true, genre: "kpop", label: "JYP Entertainment", debutYear: 2018, members: [{ name: "Bang Chan", role: "Leader" }, { name: "Felix", role: "Rapper" }] },
  { slug: "iu", title: "IU", nativeTitle: "아이유", isGroup: false, genre: "kpop", label: "EDAM Entertainment", debutYear: 2008 },
  { slug: "hikaru-utada", title: "Hikaru Utada", nativeTitle: "宇多田ヒカル", isGroup: false, genre: "jpop", label: "Sony Music", debutYear: 1998 },
  { slug: "oneokrock", title: "ONE OK ROCK", isGroup: true, genre: "rock", label: "Fueled by Ramen", debutYear: 2007, members: [{ name: "Taka", role: "Vocalist" }, { name: "Toru", role: "Guitar" }] },
  { slug: "linked-horizon", title: "Linked Horizon", isGroup: true, genre: "rock", label: "Pony Canyon", debutYear: 2012, members: [{ name: "Revo", role: "Composer / Vocalist" }] },
  { slug: "joe-hisaishi", title: "Joe Hisaishi", nativeTitle: "久石譲", isGroup: false, genre: "classical", label: "Wonder City", debutYear: 1974 },
  // Global English-language artists
  { slug: "taylor-swift", title: "Taylor Swift", isGroup: false, genre: "pop", label: "Republic Records", debutYear: 2006, languages: ["english"] },
  { slug: "ed-sheeran", title: "Ed Sheeran", isGroup: false, genre: "pop", label: "Atlantic Records", debutYear: 2011, languages: ["english"] },
  { slug: "the-weeknd", title: "The Weeknd", isGroup: false, genre: "rnb", label: "XO / Republic Records", debutYear: 2010, languages: ["english"] },
  { slug: "drake", title: "Drake", isGroup: false, genre: "hip-hop", label: "OVO Sound / Republic", debutYear: 2009, languages: ["english"] },
  { slug: "adele", title: "Adele", isGroup: false, genre: "ballad", label: "Columbia Records", debutYear: 2008, languages: ["english"] },
  { slug: "beyonce", title: "Beyoncé", isGroup: false, genre: "rnb", label: "Parkwood Entertainment", debutYear: 1997, languages: ["english"] },
  { slug: "billie-eilish", title: "Billie Eilish", isGroup: false, genre: "indie", label: "Darkroom / Interscope", debutYear: 2015, languages: ["english"] },
  { slug: "bruno-mars", title: "Bruno Mars", isGroup: false, genre: "pop", label: "Atlantic Records", debutYear: 2010, languages: ["english"] },
  { slug: "coldplay", title: "Coldplay", isGroup: true, genre: "rock", label: "Parlophone", debutYear: 1998, languages: ["english"], members: [{ name: "Chris Martin", role: "Vocalist" }, { name: "Jonny Buckland", role: "Guitar" }, { name: "Guy Berryman", role: "Bass" }, { name: "Will Champion", role: "Drums" }] },
  { slug: "ariana-grande", title: "Ariana Grande", isGroup: false, genre: "pop", label: "Republic Records", debutYear: 2013, languages: ["english"] },
  { slug: "post-malone", title: "Post Malone", isGroup: false, genre: "hip-hop", label: "Republic Records", debutYear: 2015, languages: ["english"] },
  { slug: "rihanna", title: "Rihanna", isGroup: false, genre: "rnb", label: "Roc Nation / Def Jam", debutYear: 2005, languages: ["english"] },
  { slug: "eminem", title: "Eminem", isGroup: false, genre: "hip-hop", label: "Shady Records", debutYear: 1999, languages: ["english"] },
  { slug: "kendrick-lamar", title: "Kendrick Lamar", isGroup: false, genre: "hip-hop", label: "Top Dawg Entertainment", debutYear: 2003, languages: ["english"] },
  { slug: "imagine-dragons", title: "Imagine Dragons", isGroup: true, genre: "rock", label: "Interscope Records", debutYear: 2008, languages: ["english"], members: [{ name: "Dan Reynolds", role: "Vocalist" }, { name: "Wayne Sermon", role: "Guitar" }, { name: "Ben McKee", role: "Bass" }] },
  { slug: "dua-lipa", title: "Dua Lipa", isGroup: false, genre: "pop", label: "Warner Records", debutYear: 2015, languages: ["english"] },
  { slug: "arijit-singh", title: "Arijit Singh", nativeTitle: "अरिजीत सिंह", isGroup: false, genre: "ballad", label: "T-Series", debutYear: 2011, languages: ["hindi", "english"] },
  // More western artists
  { slug: "lady-gaga", title: "Lady Gaga", isGroup: false, genre: "pop", label: "Interscope Records", debutYear: 2008, languages: ["english"] },
  { slug: "justin-bieber", title: "Justin Bieber", isGroup: false, genre: "pop", label: "Def Jam / RBMG", debutYear: 2009, languages: ["english"] },
  { slug: "harry-styles", title: "Harry Styles", isGroup: false, genre: "pop", label: "Columbia Records", debutYear: 2017, languages: ["english"] },
  { slug: "sza", title: "SZA", isGroup: false, genre: "rnb", label: "Top Dawg / RCA", debutYear: 2012, languages: ["english"] },
  { slug: "katy-perry", title: "Katy Perry", isGroup: false, genre: "pop", label: "Capitol Records", debutYear: 2008, languages: ["english"] },
  { slug: "maroon-5", title: "Maroon 5", isGroup: true, genre: "pop", label: "222 / Interscope", debutYear: 1994, languages: ["english"], members: [{ name: "Adam Levine", role: "Vocalist" }, { name: "James Valentine", role: "Guitar" }] },
  { slug: "foo-fighters", title: "Foo Fighters", isGroup: true, genre: "rock", label: "Roswell / RCA", debutYear: 1994, languages: ["english"], members: [{ name: "Dave Grohl", role: "Vocalist" }, { name: "Chris Shiflett", role: "Guitar" }] },
  { slug: "linkin-park", title: "Linkin Park", isGroup: true, genre: "rock", label: "Warner Records", debutYear: 1996, languages: ["english"], members: [{ name: "Chester Bennington", role: "Vocalist" }, { name: "Mike Shinoda", role: "Rapper" }] },
  { slug: "queen", title: "Queen", isGroup: true, genre: "rock", label: "EMI / Hollywood", debutYear: 1970, languages: ["english"], members: [{ name: "Freddie Mercury", role: "Vocalist" }, { name: "Brian May", role: "Guitar" }, { name: "Roger Taylor", role: "Drums" }] },
  { slug: "michael-jackson", title: "Michael Jackson", isGroup: false, genre: "pop", label: "Epic Records", debutYear: 1964, languages: ["english"] },
  { slug: "fleetwood-mac", title: "Fleetwood Mac", isGroup: true, genre: "rock", label: "Warner Records", debutYear: 1967, languages: ["english"], members: [{ name: "Stevie Nicks", role: "Vocalist" }, { name: "Lindsey Buckingham", role: "Guitar" }] },
  { slug: "metallica", title: "Metallica", isGroup: true, genre: "metal", label: "Blackened Recordings", debutYear: 1981, languages: ["english"], members: [{ name: "James Hetfield", role: "Vocalist" }, { name: "Kirk Hammett", role: "Guitar" }] },
  { slug: "shawn-mendes", title: "Shawn Mendes", isGroup: false, genre: "pop", label: "Island Records", debutYear: 2014, languages: ["english"] },
];

const COMMUNITY_NAMES = [
  "Jujutsu Kaisen Sorcerers", "Demon Slayer Corps", "Anime OST Lounge", "K-Pop Universe",
  "J-Pop Central", "Studio Ghibli Society", "Mecha Pilots HQ", "Romance Anime Den",
  "Horror & Thriller Fans", "Sports Anime Arena", "Isekai Explorers", "Manga Readers Guild",
  "Attack on Titan Theories", "One Piece Grand Fleet", "Chainsaw Man Church", "Spy x Family Fans",
  "Neon Nights Anime", "Marvel & Anime Crossover", "Retro Anime Vault", "Seinen Cinema Club",
  "Shoujo Sparkle", "Voice Actor Appreciation", "Watch Party Central", "Film Score Society",
  "Global Anime Watch",
] as const;

const USER_PROFILES = [
  { name: "Reetam Dutta", handle: "reetam_dutta", email: "reetam@aniverse.local", location: "Kolkata, India", bio: "Building taste profiles and binge-watching everything neon. I collect OSTs, debate rankings in communities, and keep my watchlist ruthlessly organised. Always looking for the next series that blends spectacle with real emotional weight." },
  { name: "Aisha Khan", handle: "aisha_khan", email: "aisha@aniverse.local", location: "Mumbai, India", bio: "J-pop devotee. Frieren evangelist. Always listening to RADWIMPS. I host watch parties, curate music collections, and chase opening themes with the same energy most people reserve for season finales." },
  { name: "Vikram Patel", handle: "vikram_patel", email: "vikram@aniverse.local", location: "Bangalore, India", bio: "K-pop curator and community watch party host. I split time between chart-topping singles, anime OST deep-dives, and building public collections other fans can actually use. If it has a great hook and a story behind it, I have probably already saved it." },
] as const;

export interface UserSeed {
  email: string;
  password: string;
  name: string;
  handle: string;
  avatarColor: string;
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
  posts: Array<{
    authorEmail: string;
    title: string;
    content: string;
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
  favoriteCount: number;
  items?: string[];
  tracks?: string[];
}

const VOICE_ACTORS = [
  "Yuki Kaji", "Natsuki Hanae", "Mamoru Miyano", "Maaya Sakamoto", "Hiroshi Kamiya",
  "Rie Takahashi", "Jun Fukuyama", "Saori Hayami", "Kana Hanazawa", "Daisuke Ono",
];

const COMPOSERS = [
  "Yuki Kajiura", "Hiroyuki Sawano", "Joe Hisaishi", "Kevin Kiner", "Ludwig Göransson",
  "Hans Zimmer", "Ramin Djawadi", "Bear McCreary", "Yoko Kanno", "Kenji Kawai",
];

function buildContentItem(
  entry: { title: string; native?: string; studio?: string; director?: string; author?: string; network?: string },
  type: "anime" | "show" | "movie",
  index: number,
): ContentSeedBase {
  const slug = slugify(entry.title);
  const accent = pick(ACCENTS, index);
  const genreA = pick(CONTENT_GENRES, index);
  const genreB = pick(CONTENT_GENRES, index + 3);
  const year = 1998 + (index % 28);
  const isMovie = type === "movie";
  const seasons = isMovie ? undefined : 1 + (index % 3);
  const episodes = isMovie ? undefined : 12 + (index % 13);

  const lang: CatalogLanguage =
    type === "show" || (type === "movie" && !entry.native) ? "english" : "japanese";

  const studio = entry.studio ?? pick(["MAPPA", "ufotable", "Madhouse", "Bones", "Netflix"], index);
  const director = entry.director ?? pick(["Sunghoo Park", "Christopher Nolan", "Bong Joon-ho", "Makoto Shinkai", "Denis Villeneuve"], index);
  const network = entry.network ?? (type === "show" ? pick(["Netflix", "HBO", "Crunchyroll", "Disney+"], index) : type === "anime" ? "TV Tokyo" : undefined);

  return {
    slug,
    title: entry.title,
    nativeTitle: entry.native,
    type,
    accent,
    genreLabels: [genreA, genreB, pick(CONTENT_GENRES, index + 7)],
    languages: type === "anime" ? [lang, "english"] : [lang],
    rating: catalogRating(7.2, (index % 23) * 0.1),
    year,
    meta: isMovie ? "Feature Film" : `${seasons} Season${seasons === 1 ? "" : "s"}, ${episodes} Episodes`,
    seasonCount: seasons,
    episodeCount: episodes,
    seasonLabel: seasons ? "Season 1" : undefined,
    studio,
    director,
    composer: pick(COMPOSERS, index),
    originalAuthor: entry.author ?? (type === "anime" ? pick(["Gege Akutami", "Hajime Isayama", "Eiichiro Oda"], index) : undefined),
    sourceMaterial: type === "anime" ? pick(["Manga", "Light Novel", "Original"], index) : type === "show" ? "Original Screenplay" : "Original",
    producers: pick(["Aniplex", "KADOKAWA", "Netflix", "HBO", "A24"], index),
    network,
    country: type === "anime" ? "Japan" : type === "show" ? pick(["USA", "UK", "South Korea"], index) : pick(["Japan", "USA", "South Korea"], index),
    status: index % 4 === 0 ? "Ongoing" : "Completed",
    ageRating: index % 5 === 0 ? "18+" : "16+",
    imdbRating: catalogRating(7, (index % 20) * 0.1),
    malScore: type === "anime" ? catalogRating(7.5, (index % 15) * 0.1) : undefined,
    airedFrom: `Oct ${year}`,
    airedTo: index % 4 === 0 ? "Present" : `Dec ${year + (seasons ?? 0)}`,
    broadcast: type === "anime" ? "Fridays 11:00 PM JST" : type === "show" ? pick(["Sundays 9:00 PM EST", "Wednesdays 8:00 PM PST"], index) : undefined,
    airingDay: type !== "movie" ? pick(["Friday", "Sunday", "Wednesday"], index) : undefined,
    episodeDuration: isMovie ? "2h 15m" : "24 Min",
    lastUpdate: `Jul ${year + 1}`,
    highlightTags: [pick(CONTENT_GENRES, index), isMovie ? "Feature Film" : `${episodes} Episodes`, "Fan Favorite"],
    trendingLabel: `Trending Globally At #${(index % 9) + 1} in ${type === "anime" ? "Anime" : type === "movie" ? "Movies" : "Shows"}`,
    creditLabel: `${studio} · ${director}`,
    description: `${entry.title} is a ${type} experience curated for AniVerse — rich characters, layered storytelling, and unforgettable world-building. Every scene pushes the ${genreA} and ${genreB} threads forward with purpose, whether you are discovering it for the first time or revisiting a favourite moment. Fans praise its pacing, emotional weight, and the way it rewards close attention without ever feeling slow.`,
    synopsis: `In ${entry.title}, worlds collide under electric skies. Follow unforgettable characters through ${pick(["betrayal", "redemption", "discovery", "war", "love"], index)} as the narrative unfolds across ${isMovie ? "one breathtaking film" : `${episodes ?? 12} episodes`}. A must-watch for fans of ${genreA} and ${genreB}. The story builds tension with precision, lands its biggest turns with confidence, and leaves room for debate long after the credits roll. On AniVerse, this title is a cornerstone pick for anyone building a serious watchlist.`,
  };
}

export function generateContentItems(): ContentSeedBase[] {
  const items: ContentSeedBase[] = [];
  ANIME_TITLES.forEach((entry, i) => items.push(buildContentItem(entry, "anime", i)));
  MOVIE_TITLES.forEach((entry, i) => items.push(buildContentItem(entry, "movie", 40 + i)));
  SHOW_TITLES.forEach((entry, i) => items.push(buildContentItem(entry, "show", 70 + i)));
  return items;
}

function artistLanguages(artist: (typeof ARTIST_NAMES)[number]): CatalogLanguage[] {
  if (artist.languages?.length) return artist.languages;
  if (artist.genre === "kpop") return ["korean", "english"];
  if (artist.genre === "jpop") return ["japanese", "english"];
  return ["english"];
}

export function generateArtistItems(): ArtistSeed[] {
  return ARTIST_NAMES.map((artist, index) => ({
    slug: artist.slug,
    title: artist.title,
    nativeTitle: artist.nativeTitle,
    accent: pick(ACCENTS, index),
    rating: catalogRating(7.8, (index % 12) * 0.1),
    rankLeft: `#${(index % 10) + 1} in ${artist.genre.toUpperCase()}`,
    rankRight: `#${(index % 5) + 1} in your favourite artist`,
    genreLabels: [artist.genre, pick(ARTIST_GENRES, index + 2)],
    languages: artistLanguages(artist),
    label: artist.label,
    debutYear: artist.debutYear,
    isGroup: artist.isGroup,
    members: artist.isGroup
      ? artist.members ?? [
          { name: `${artist.title} Member 1`, role: "Vocalist" },
          { name: `${artist.title} Member 2`, role: "Producer" },
        ]
      : undefined,
    primaryTags: [artist.genre, artist.isGroup ? "Group" : "Solo", "Trending"],
    synopsis: `${artist.title} defines the ${artist.genre} soundscape on AniVerse — from arena anthems to intimate ballads, their catalog shapes how fans discover music and anime OSTs alike. ${artist.isGroup ? "As a group, their chemistry on stage and in the studio translates into performances that feel both polished and personal." : "Their solo work balances mainstream appeal with artistic depth, making every release feel like an event."} Whether you are here for opening themes, chart-topping singles, or deep-cut album tracks, this profile captures why ${artist.title} remains essential listening across the platform.`,
    catalogReviews: [
      review("AniVerse Curator", catalogRating(8.5, (index % 10) * 0.1), `${artist.title} delivers consistent quality across albums and live performances. Essential listening for anyone exploring ${artist.genre} on AniVerse. The production is sharp, the vocal identity is unmistakable, and the discography rewards both casual playlists and deep dives.`, pick(ACCENTS, index)),
      review(pick(USER_PROFILES, index).name, catalogRating(8, index % 5), `Been on repeat all week. ${artist.title} never misses — every track feels intentional, and the emotional range keeps me coming back. Already added three songs to my collections.`, pick(ACCENTS, index + 1)),
    ],
  }));
}

/** Real tracks with correct artist + source content links. */
const REAL_TRACKS: Array<{
  title: string;
  nativeTitle?: string;
  artistSlug: string;
  kind: "song" | "ost" | "album";
  contentSlug?: string;
  album?: string;
  genre: SongGenre;
  year: number;
  durationLabel: string;
  durationSeconds: number;
  lyrics?: string;
}> = [
  { title: "Gurenge", nativeTitle: "紅蓮華", artistSlug: "lisa", kind: "ost", contentSlug: "demon-slayer", genre: "ost", year: 2019, durationLabel: "3:57", durationSeconds: 237, lyrics: "強くなれる理由を知った\n僕を連れて進め" },
  { title: "Homura", nativeTitle: "炎", artistSlug: "lisa", kind: "ost", contentSlug: "demon-slayer", genre: "ost", year: 2020, durationLabel: "4:35", durationSeconds: 275 },
  { title: "Kaikai Kitan", nativeTitle: "廻廻奇譚", artistSlug: "eve", kind: "ost", contentSlug: "jujutsu-kaisen", genre: "ost", year: 2020, durationLabel: "3:43", durationSeconds: 223 },
  { title: "SPECIALZ", artistSlug: "king-gnu", kind: "ost", contentSlug: "jujutsu-kaisen", genre: "ost", year: 2023, durationLabel: "3:26", durationSeconds: 206 },
  { title: "Guren no Yumiya", nativeTitle: "紅蓮の弓矢", artistSlug: "linked-horizon", kind: "ost", contentSlug: "attack-on-titan", genre: "ost", year: 2013, durationLabel: "5:14", durationSeconds: 314 },
  { title: "Shinzou wo Sasageyo!", nativeTitle: "心臓を捧げよ！", artistSlug: "linked-horizon", kind: "ost", contentSlug: "attack-on-titan", genre: "ost", year: 2017, durationLabel: "5:22", durationSeconds: 322 },
  { title: "KICK BACK", artistSlug: "kenshi-yonezu", kind: "ost", contentSlug: "chainsaw-man", genre: "ost", year: 2022, durationLabel: "3:14", durationSeconds: 194 },
  { title: "Mixed Nuts", artistSlug: "yoasobi", kind: "ost", contentSlug: "spy-x-family", genre: "ost", year: 2022, durationLabel: "3:30", durationSeconds: 210 },
  { title: "Idol", nativeTitle: "アイドル", artistSlug: "yoasobi", kind: "ost", contentSlug: "oshi-no-ko", genre: "ost", year: 2023, durationLabel: "3:33", durationSeconds: 213 },
  { title: "Peace Sign", artistSlug: "kenshi-yonezu", kind: "ost", contentSlug: "my-hero-academia", genre: "ost", year: 2017, durationLabel: "4:00", durationSeconds: 240 },
  { title: "Again", artistSlug: "aimer", kind: "ost", contentSlug: "fullmetal-alchemist-brotherhood", genre: "ost", year: 2009, durationLabel: "4:15", durationSeconds: 255 },
  { title: "unravel", artistSlug: "eve", kind: "ost", contentSlug: "tokyo-ghoul", genre: "ost", year: 2014, durationLabel: "4:00", durationSeconds: 240 },
  { title: "Tank!", artistSlug: "joe-hisaishi", kind: "ost", contentSlug: "cowboy-bebop", genre: "jazz", year: 1998, durationLabel: "3:48", durationSeconds: 228 },
  { title: "A Cruel Angel's Thesis", nativeTitle: "残酷な天使のテーゼ", artistSlug: "hikaru-utada", kind: "ost", contentSlug: "neon-genesis-evangelion", genre: "ost", year: 1995, durationLabel: "4:04", durationSeconds: 244 },
  { title: "Zenzenzense", artistSlug: "radwimps", kind: "ost", contentSlug: "your-name", genre: "ost", year: 2016, durationLabel: "4:48", durationSeconds: 288, lyrics: "何度でも\n何度でも" },
  { title: "Sparkle", artistSlug: "radwimps", kind: "ost", contentSlug: "your-name", genre: "ost", year: 2016, durationLabel: "8:54", durationSeconds: 534 },
  { title: "Grand Escape", artistSlug: "radwimps", kind: "ost", contentSlug: "weathering-with-you", genre: "ost", year: 2019, durationLabel: "3:13", durationSeconds: 193 },
  { title: "Suzume", artistSlug: "radwimps", kind: "ost", contentSlug: "suzume", genre: "ost", year: 2022, durationLabel: "3:53", durationSeconds: 233 },
  { title: "One Summer Day", artistSlug: "joe-hisaishi", kind: "ost", contentSlug: "spirited-away", genre: "ost", year: 2001, durationLabel: "3:09", durationSeconds: 189 },
  { title: "Merry-Go-Round of Life", artistSlug: "joe-hisaishi", kind: "ost", contentSlug: "howl-s-moving-castle", genre: "ost", year: 2004, durationLabel: "2:13", durationSeconds: 133 },
  { title: "Bling-Bang-Bang-Born", artistSlug: "yoasobi", kind: "ost", contentSlug: "dandadan", genre: "ost", year: 2024, durationLabel: "2:48", durationSeconds: 168 },
  { title: "Dynamite", artistSlug: "bts", kind: "song", genre: "kpop", year: 2020, durationLabel: "3:19", durationSeconds: 199, lyrics: "Cause I, I, I'm in the stars tonight\nSo watch me bring the fire" },
  { title: "Butter", artistSlug: "bts", kind: "song", genre: "kpop", year: 2021, durationLabel: "2:42", durationSeconds: 162 },
  { title: "Pink Venom", artistSlug: "blackpink", kind: "song", genre: "kpop", year: 2022, durationLabel: "3:07", durationSeconds: 187 },
  { title: "How You Like That", artistSlug: "blackpink", kind: "song", genre: "kpop", year: 2020, durationLabel: "3:01", durationSeconds: 181 },
  { title: "Super Shy", artistSlug: "newjeans", kind: "song", genre: "kpop", year: 2023, durationLabel: "2:34", durationSeconds: 154 },
  { title: "Ditto", artistSlug: "newjeans", kind: "song", genre: "kpop", year: 2022, durationLabel: "3:05", durationSeconds: 185 },
  { title: "God's Menu", artistSlug: "stray-kids", kind: "song", genre: "kpop", year: 2020, durationLabel: "2:48", durationSeconds: 168 },
  { title: "S-Class", artistSlug: "stray-kids", kind: "song", genre: "kpop", year: 2023, durationLabel: "3:10", durationSeconds: 190 },
  { title: "Fancy", artistSlug: "twice", kind: "song", genre: "kpop", year: 2019, durationLabel: "3:34", durationSeconds: 214 },
  { title: "Lemon", artistSlug: "kenshi-yonezu", kind: "song", genre: "jpop", year: 2018, durationLabel: "4:15", durationSeconds: 255 },
  { title: "Pretender", artistSlug: "king-gnu", kind: "song", genre: "jpop", year: 2019, durationLabel: "5:26", durationSeconds: 326 },
  { title: "Usseewa", artistSlug: "ado", kind: "song", genre: "jpop", year: 2020, durationLabel: "3:27", durationSeconds: 207 },
  { title: "Odo", artistSlug: "ado", kind: "song", genre: "jpop", year: 2021, durationLabel: "3:24", durationSeconds: 204 },
  { title: "Inside You", artistSlug: "milet", kind: "song", genre: "jpop", year: 2019, durationLabel: "4:07", durationSeconds: 247 },
  { title: "Matsuri", artistSlug: "fujii-kaze", kind: "song", genre: "jpop", year: 2020, durationLabel: "3:40", durationSeconds: 220 },
  { title: "First Love", artistSlug: "hikaru-utada", kind: "song", genre: "jpop", year: 1999, durationLabel: "4:17", durationSeconds: 257 },
  { title: "Wherever You Are", artistSlug: "oneokrock", kind: "song", genre: "rock", year: 2014, durationLabel: "4:15", durationSeconds: 255 },
  { title: "Brave Shine", artistSlug: "aimer", kind: "ost", contentSlug: "vinland-saga", genre: "ost", year: 2015, durationLabel: "4:00", durationSeconds: 240 },
  { title: "Zankyosanka", artistSlug: "aimer", kind: "ost", contentSlug: "demon-slayer", genre: "ost", year: 2021, durationLabel: "3:59", durationSeconds: 239 },
  // Global English-language hits
  { title: "Anti-Hero", artistSlug: "taylor-swift", kind: "song", genre: "pop", year: 2022, durationLabel: "3:20", durationSeconds: 200, lyrics: "It's me, hi, I'm the problem, it's me\nAt tea time, everybody agrees" },
  { title: "Shake It Off", artistSlug: "taylor-swift", kind: "song", genre: "pop", year: 2014, durationLabel: "3:39", durationSeconds: 219 },
  { title: "Blank Space", artistSlug: "taylor-swift", kind: "song", genre: "pop", year: 2014, durationLabel: "3:51", durationSeconds: 231 },
  { title: "Shape of You", artistSlug: "ed-sheeran", kind: "song", genre: "pop", year: 2017, durationLabel: "3:53", durationSeconds: 233 },
  { title: "Perfect", artistSlug: "ed-sheeran", kind: "song", genre: "ballad", year: 2017, durationLabel: "4:23", durationSeconds: 263 },
  { title: "Blinding Lights", artistSlug: "the-weeknd", kind: "song", genre: "rnb", year: 2019, durationLabel: "3:20", durationSeconds: 200 },
  { title: "Starboy", artistSlug: "the-weeknd", kind: "song", genre: "rnb", year: 2016, durationLabel: "3:50", durationSeconds: 230 },
  { title: "God's Plan", artistSlug: "drake", kind: "song", genre: "hip-hop", year: 2018, durationLabel: "3:18", durationSeconds: 198 },
  { title: "Hello", artistSlug: "adele", kind: "song", genre: "ballad", year: 2015, durationLabel: "4:55", durationSeconds: 295 },
  { title: "Rolling in the Deep", artistSlug: "adele", kind: "song", genre: "ballad", year: 2010, durationLabel: "3:48", durationSeconds: 228 },
  { title: "Halo", artistSlug: "beyonce", kind: "song", genre: "rnb", year: 2008, durationLabel: "4:21", durationSeconds: 261 },
  { title: "bad guy", artistSlug: "billie-eilish", kind: "song", genre: "indie", year: 2019, durationLabel: "3:14", durationSeconds: 194 },
  { title: "What Was I Made For?", artistSlug: "billie-eilish", kind: "song", genre: "ballad", year: 2023, durationLabel: "3:42", durationSeconds: 222 },
  { title: "Uptown Funk", artistSlug: "bruno-mars", kind: "song", genre: "pop", year: 2014, durationLabel: "4:30", durationSeconds: 270 },
  { title: "Viva La Vida", artistSlug: "coldplay", kind: "song", genre: "rock", year: 2008, durationLabel: "4:01", durationSeconds: 241 },
  { title: "Yellow", artistSlug: "coldplay", kind: "song", genre: "rock", year: 2000, durationLabel: "4:26", durationSeconds: 266 },
  { title: "thank u, next", artistSlug: "ariana-grande", kind: "song", genre: "pop", year: 2018, durationLabel: "3:27", durationSeconds: 207 },
  { title: "Circles", artistSlug: "post-malone", kind: "song", genre: "pop", year: 2019, durationLabel: "3:35", durationSeconds: 215 },
  { title: "Umbrella", artistSlug: "rihanna", kind: "song", genre: "rnb", year: 2007, durationLabel: "4:35", durationSeconds: 275 },
  { title: "Lose Yourself", artistSlug: "eminem", kind: "song", genre: "hip-hop", year: 2002, durationLabel: "5:26", durationSeconds: 326 },
  { title: "HUMBLE.", artistSlug: "kendrick-lamar", kind: "song", genre: "hip-hop", year: 2017, durationLabel: "2:57", durationSeconds: 177 },
  { title: "Radioactive", artistSlug: "imagine-dragons", kind: "song", genre: "rock", year: 2012, durationLabel: "3:06", durationSeconds: 186 },
  { title: "Levitating", artistSlug: "dua-lipa", kind: "song", genre: "pop", year: 2020, durationLabel: "3:23", durationSeconds: 203 },
  { title: "Tum Hi Ho", nativeTitle: "तुम ही हो", artistSlug: "arijit-singh", kind: "song", genre: "ballad", year: 2013, durationLabel: "4:22", durationSeconds: 262, lyrics: "Hum tere bin ab reh nahi sakte\nTere bina kya wajood mera" },
  { title: "Kesariya", nativeTitle: "केसरिया", artistSlug: "arijit-singh", kind: "song", genre: "ballad", year: 2022, durationLabel: "4:28", durationSeconds: 268 },
  { title: "Channa Mereya", nativeTitle: "चन्ना मेरेया", artistSlug: "arijit-singh", kind: "song", genre: "ballad", year: 2016, durationLabel: "4:49", durationSeconds: 289 },
  { title: "Apna Bana Le", nativeTitle: "अपना बना ले", artistSlug: "arijit-singh", kind: "song", genre: "ballad", year: 2022, durationLabel: "4:20", durationSeconds: 260 },
  // More western hits
  { title: "Poker Face", artistSlug: "lady-gaga", kind: "song", genre: "pop", year: 2008, durationLabel: "3:57", durationSeconds: 237 },
  { title: "Shallow", artistSlug: "lady-gaga", kind: "song", genre: "ballad", year: 2018, durationLabel: "3:35", durationSeconds: 215 },
  { title: "Sorry", artistSlug: "justin-bieber", kind: "song", genre: "pop", year: 2015, durationLabel: "3:20", durationSeconds: 200 },
  { title: "Peaches", artistSlug: "justin-bieber", kind: "song", genre: "pop", year: 2021, durationLabel: "3:18", durationSeconds: 198 },
  { title: "As It Was", artistSlug: "harry-styles", kind: "song", genre: "pop", year: 2022, durationLabel: "2:47", durationSeconds: 167 },
  { title: "Watermelon Sugar", artistSlug: "harry-styles", kind: "song", genre: "pop", year: 2019, durationLabel: "2:54", durationSeconds: 174 },
  { title: "Kill Bill", artistSlug: "sza", kind: "song", genre: "rnb", year: 2022, durationLabel: "2:33", durationSeconds: 153 },
  { title: "Snooze", artistSlug: "sza", kind: "song", genre: "rnb", year: 2022, durationLabel: "3:21", durationSeconds: 201 },
  { title: "Firework", artistSlug: "katy-perry", kind: "song", genre: "pop", year: 2010, durationLabel: "3:47", durationSeconds: 227 },
  { title: "Roar", artistSlug: "katy-perry", kind: "song", genre: "pop", year: 2013, durationLabel: "3:42", durationSeconds: 222 },
  { title: "Sugar", artistSlug: "maroon-5", kind: "song", genre: "pop", year: 2014, durationLabel: "3:55", durationSeconds: 235 },
  { title: "Memories", artistSlug: "maroon-5", kind: "song", genre: "pop", year: 2019, durationLabel: "3:09", durationSeconds: 189 },
  { title: "Everlong", artistSlug: "foo-fighters", kind: "song", genre: "rock", year: 1997, durationLabel: "4:10", durationSeconds: 250 },
  { title: "The Pretender", artistSlug: "foo-fighters", kind: "song", genre: "rock", year: 2007, durationLabel: "4:29", durationSeconds: 269 },
  { title: "In the End", artistSlug: "linkin-park", kind: "song", genre: "rock", year: 2000, durationLabel: "3:36", durationSeconds: 216 },
  { title: "Numb", artistSlug: "linkin-park", kind: "song", genre: "rock", year: 2003, durationLabel: "3:05", durationSeconds: 185 },
  { title: "Bohemian Rhapsody", artistSlug: "queen", kind: "song", genre: "rock", year: 1975, durationLabel: "5:55", durationSeconds: 355 },
  { title: "Don't Stop Me Now", artistSlug: "queen", kind: "song", genre: "rock", year: 1978, durationLabel: "3:29", durationSeconds: 209 },
  { title: "Billie Jean", artistSlug: "michael-jackson", kind: "song", genre: "pop", year: 1982, durationLabel: "4:54", durationSeconds: 294 },
  { title: "Thriller", artistSlug: "michael-jackson", kind: "song", genre: "pop", year: 1982, durationLabel: "5:57", durationSeconds: 357 },
  { title: "Dreams", artistSlug: "fleetwood-mac", kind: "song", genre: "rock", year: 1977, durationLabel: "4:14", durationSeconds: 254 },
  { title: "The Chain", artistSlug: "fleetwood-mac", kind: "song", genre: "rock", year: 1977, durationLabel: "4:30", durationSeconds: 270 },
  { title: "Enter Sandman", artistSlug: "metallica", kind: "song", genre: "metal", year: 1991, durationLabel: "5:31", durationSeconds: 331 },
  { title: "Nothing Else Matters", artistSlug: "metallica", kind: "song", genre: "metal", year: 1991, durationLabel: "6:28", durationSeconds: 388 },
  { title: "Stitches", artistSlug: "shawn-mendes", kind: "song", genre: "pop", year: 2015, durationLabel: "3:26", durationSeconds: 206 },
  { title: "Señorita", artistSlug: "shawn-mendes", kind: "song", genre: "pop", year: 2019, durationLabel: "3:10", durationSeconds: 190 },
];

const SONG_TITLE_PARTS = [
  "Neon", "Midnight", "Crystal", "Echo", "Pulse", "Gravity", "Horizon", "Velvet",
  "Phantom", "Radiant", "Static", "Aurora", "Crimson", "Silver", "Golden", "Shadow",
];

export function generateMusicItems(artists: ArtistSeed[], content: ContentSeedBase[]): MusicSeed[] {
  const artistBySlug = new Map(artists.map((a) => [a.slug, a]));
  const contentSlugs = new Set(content.map((c) => c.slug));
  const tracks: MusicSeed[] = [];

  for (let i = 0; i < REAL_TRACKS.length; i++) {
    const entry = REAL_TRACKS[i]!;
    const artist = artistBySlug.get(entry.artistSlug);
    if (!artist) continue;
    const contentSlug = entry.contentSlug && contentSlugs.has(entry.contentSlug) ? entry.contentSlug : undefined;
    const slug = slugify(`${entry.artistSlug}-${entry.title}`);

    tracks.push({
      slug,
      title: entry.title,
      nativeTitle: entry.nativeTitle,
      artist: artist.title,
      artistSlug: artist.slug,
      kind: entry.kind,
      description: `${entry.title} by ${artist.title}${contentSlug ? ` — featured in ${content.find((c) => c.slug === contentSlug)?.title}` : ""} is a defining track on AniVerse. The arrangement balances melody and momentum, and the vocal delivery gives the song a clear identity from the first bar. Fans keep returning to it for playlists, OST deep-dives, and late-night listening sessions alike.`,
      lyrics: entry.lyrics ?? (entry.kind === "song" ? `[Verse]\nNeon lights on ${entry.title}\nWe ride the pulse tonight\n[Chorus]\n${artist.title} — feel the glow` : undefined),
      source: contentSlug ? content.find((c) => c.slug === contentSlug)?.title : `${artist.title} — Studio Album`,
      contentSlug,
      album: entry.album ?? (entry.kind === "album" ? `${entry.title} (Complete Edition)` : `${artist.title} Singles`),
      language: artist.languages[0],
      genreLabels: [entry.genre, pick(SONG_GENRES, i + 4)],
      rating: catalogRating(7.5, (i % 20) * 0.1),
      year: entry.year,
      durationLabel: entry.durationLabel,
      durationSeconds: entry.durationSeconds,
      accent: pick(ACCENTS, i),
      trendingLabel: `Trending on AniVerse · ${entry.kind.toUpperCase()}`,
      creditLabel: `By ${artist.title}`,
      featuredRank: i < 20 ? i + 1 : undefined,
      catalogReviews: [
        review(pick(USER_PROFILES, i).name, catalogRating(8, (i % 3) * 0.3), `${entry.title} is on loop. Perfect ${entry.kind} energy — the hook lands immediately and the production still sounds fresh on repeat. Easily one of the best tracks in ${artist.title}'s catalog on AniVerse.`, pick(ACCENTS, i)),
      ],
    });
  }

  while (tracks.length < 100) {
    const i = tracks.length;
    const artist = pick(artists, i);
    const partA = pick(SONG_TITLE_PARTS, i);
    const partB = pick(SONG_TITLE_PARTS, i + 11);
    const title = `${partA} ${partB}`;
    const slug = slugify(`${artist.slug}-${title}-${i}`);
    const kind = i % 7 === 0 ? ("album" as const) : i % 5 === 0 ? ("ost" as const) : ("song" as const);
    const animeContent = content.filter((c) => c.type === "anime");
    const linkedContent = kind === "ost" ? pick(animeContent, i) : undefined;

    tracks.push({
      slug,
      title,
      artist: artist.title,
      artistSlug: artist.slug,
      kind,
      description: `${title} by ${artist.title} is a ${kind} track with cinematic production and AniVerse neon energy. The mix gives every instrument room to breathe while the vocal line carries the emotional centre of the song. It fits equally well on a focused listen or as part of a longer playlist session.`,
      lyrics: kind !== "album" ? `[Verse]\n${title} rises through the night\n${artist.title} leads the way\n[Chorus]\nFeel the pulse, feel the light` : undefined,
      source: kind === "ost" ? linkedContent?.title : `${artist.title} — Studio Album`,
      contentSlug: linkedContent?.slug,
      album: kind === "album" ? `${title} (Complete Edition)` : `${artist.title} Vol. ${1 + (i % 3)}`,
      language: artist.languages[0],
      genreLabels: [kind === "ost" ? "ost" : pick(SONG_GENRES, i), pick(SONG_GENRES, i + 4)],
      rating: catalogRating(7.5, (i % 20) * 0.1),
      year: 2015 + (i % 11),
      durationLabel: `${3 + (i % 4)}:${String(10 + (i % 50)).padStart(2, "0")}`,
      durationSeconds: 180 + (i % 120),
      accent: pick(ACCENTS, i),
      trendingLabel: `Trending on AniVerse · ${kind.toUpperCase()}`,
      creditLabel: `By ${artist.title}`,
      featuredRank: i < 30 ? (i % 20) + 1 : undefined,
      catalogReviews: [
        review(pick(USER_PROFILES, i).name, catalogRating(8, (i % 3) * 0.3), `${title} is on loop. Perfect ${kind} energy — sharp writing, confident delivery, and a chorus that sticks after one play. Already shared it with two friends in my community.`, pick(ACCENTS, i)),
      ],
    });
  }

  return tracks.slice(0, 100);
}

export function generateUserSeeds(): UserSeed[] {
  return USER_PROFILES.map((user, index) => ({
    email: user.email,
    password: "User123!",
    name: user.name,
    handle: user.handle,
    avatarColor: pick(["#ff00cc", "#00d4ff", "#ffd000", "#ae00ff", "#00ff88", "#ff6b35"], index),
    bio: user.bio,
    location: user.location,
    aiTasteScore: 72 + (index % 28),
  }));
}

export function generateCommunitySeeds(users: UserSeed[]): CommunitySeed[] {
  const categories = ["Anime", "Movies", "Shows", "Music", "Kpop", "Mixed"] as const;
  return COMMUNITY_NAMES.map((name, index) => {
    const author = pick(users, index);
    const coAuthor = pick(users, index + 1);
    return {
      slug: slugify(name),
      name,
      category: pick(categories, index),
      description: `${name} is where AniVerse fans gather to discuss theories, share recommendations, host watch parties, and celebrate ${pick(["anime", "music", "films", "K-pop", "OSTs"], index)} together. New members are welcome to jump into weekly threads, recommendation swaps, and live event planning without needing prior context. The community is built for thoughtful conversation, friendly debate, and discovering your next favourite title.`,
      visibility: index % 4 === 0 ? ("PRIVATE" as const) : ("PUBLIC" as const),
      activityLevel: pick(["very-active", "active", "moderate", "quiet"], index),
      accent: pick(ACCENTS, index),
      posts: [
        {
          authorEmail: author.email,
          title: `Welcome to ${name}!`,
          content: `Glad you're here. Introduce yourself and share what you're watching or listening to this week. Tell us your current binge, your all-time favourite OST, or the collection you are building right now. We keep things welcoming, spoiler-aware, and genuinely useful for finding what to watch next.`,
          kind: "ANNOUNCEMENT",
          likeCount: 120 + index * 3,
          commentCount: 18 + (index % 20),
          shareCount: 6 + (index % 8),
        },
        {
          authorEmail: coAuthor.email,
          title: `Weekly picks inside ${name}`,
          content: `Drop your top 3 recommendations — anime, songs, or collections. Let's build the ultimate list together and explain why each pick matters to you. Bonus points if you include a hidden gem most people have not heard of yet.`,
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
    { prefix: "Crystal", suffix: "Sessions", kind: "music" as const, category: "Music" },
    { prefix: "Aurora", suffix: "Picks", kind: "content" as const, category: "Movies" },
  ];

  for (let i = 0; i < 25; i++) {
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
      description: `A curated ${tpl.kind} collection by ${owner.name} — hand-picked for neon nights and perfect binge sessions on AniVerse. Each entry was chosen for quality, rewatch value, and how well it flows with the rest of the list. Use it as a starter vault, a mood playlist, or a shareable guide for friends who trust your taste.`,
      category: tpl.category,
      genreLabels: [pick(CONTENT_GENRES, i), pick(CONTENT_GENRES, i + 5)],
      kind: tpl.kind,
      visibility: i % 3 === 0 ? "PRIVATE" : "PUBLIC",
      accent: pick(ACCENTS, i),
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

export { VOICE_ACTORS };
