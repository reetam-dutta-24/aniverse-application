/**
 * Data layer for the Analytics dashboard page.
 *
 * Every accessor is async and currently resolves static mock data. When the
 * backend/database is ready, replace only the function bodies — the UI
 * components consuming these functions will not need to change.
 */

export interface AnalyticsKpi {
  id: string;
  emoji: string;
  label: string;
  value: string;
  /** e.g. "+12% vs last month" */
  delta?: string;
  deltaUp?: boolean;
}

export interface RankedItem {
  id: string;
  title: string;
  subtitle?: string;
  /** 0–100, drives the progress bar. */
  percent: number;
  valueLabel: string;
}

export interface MonthComparisonRow {
  id: string;
  label: string;
  current: number;
  previous: number;
  unit?: string;
}

export interface AnalyticsData {
  kpis: AnalyticsKpi[];
  /** Monthly watch vs listen hours across the year. */
  timeTrend: { month: string; watching: number; listening: number }[];
  /** Watchlist status split. */
  watchlistStatus: { name: string; value: number; color?: string }[];
  /** Hours by genre. */
  genreDistribution: { name: string; value: number }[];
  /** Taste profile radar axes. */
  tasteProfile: { axis: string; value: number }[];
  /** Hours by weekday. */
  weeklyActivity: { day: string; watching: number; listening: number }[];
  /** Activity by time of day. */
  peakHours: { slot: string; hours: number }[];
  /** AI match accuracy trend. */
  matchAccuracy: { month: string; accuracy: number }[];
  /** How many titles were given each rating. */
  ratingsGiven: { rating: string; titles: number }[];
  /** Community engagement per month. */
  communityEngagement: { month: string; posts: number; likes: number; chats: number }[];
  /** Content type split. */
  contentTypes: { name: string; value: number }[];
  topTitles: RankedItem[];
  topArtists: RankedItem[];
  monthComparison: MonthComparisonRow[];
  milestones: { id: string; emoji: string; title: string; detail: string }[];
}

const kpis: AnalyticsKpi[] = [
  { id: "watch-time", emoji: "🎬", label: "Total Watch Time", value: "186 h", delta: "+12% vs last month", deltaUp: true },
  { id: "listen-time", emoji: "🎧", label: "Music Listened", value: "214 h", delta: "+8% vs last month", deltaUp: true },
  { id: "episodes", emoji: "📺", label: "Episodes Completed", value: "342", delta: "+26 this month", deltaUp: true },
  { id: "songs", emoji: "🎵", label: "Songs Played", value: "1,864", delta: "+142 this month", deltaUp: true },
  { id: "avg-rating", emoji: "⭐", label: "Avg Rating Given", value: "8.6", delta: "steady", deltaUp: true },
  { id: "match", emoji: "🎯", label: "AI Match Accuracy", value: "93%", delta: "+2% vs last month", deltaUp: true },
  { id: "streak", emoji: "🔥", label: "Day Streak", value: "24", delta: "personal best", deltaUp: true },
  { id: "reviews", emoji: "✍️", label: "Reviews Written", value: "57", delta: "-3 vs last month", deltaUp: false },
];

const timeTrend = [
  { month: "Aug", watching: 12, listening: 14 },
  { month: "Sep", watching: 15, listening: 16 },
  { month: "Oct", watching: 11, listening: 18 },
  { month: "Nov", watching: 17, listening: 15 },
  { month: "Dec", watching: 22, listening: 19 },
  { month: "Jan", watching: 19, listening: 21 },
  { month: "Feb", watching: 14, listening: 17 },
  { month: "Mar", watching: 16, listening: 20 },
  { month: "Apr", watching: 18, listening: 22 },
  { month: "May", watching: 15, listening: 18 },
  { month: "Jun", watching: 13, listening: 16 },
  { month: "Jul", watching: 14, listening: 18 },
];

const watchlistStatus = [
  { name: "Completed", value: 118, color: "#00ff8c" },
  { name: "Watching", value: 24, color: "#ff00cc" },
  { name: "Pending", value: 34, color: "#2563eb" },
  { name: "Dropped", value: 9, color: "#ae00ff" },
];

const genreDistribution = [
  { name: "Action", value: 46 },
  { name: "Thriller", value: 38 },
  { name: "Romance", value: 22 },
  { name: "Fantasy", value: 30 },
  { name: "Drama", value: 26 },
  { name: "Comedy", value: 18 },
];

const tasteProfile = [
  { axis: "Action", value: 92 },
  { axis: "Psychological", value: 88 },
  { axis: "Romance", value: 58 },
  { axis: "Fantasy", value: 76 },
  { axis: "Slice of Life", value: 44 },
  { axis: "Music / OST", value: 84 },
];

const weeklyActivity = [
  { day: "Mon", watching: 1.5, listening: 2.1 },
  { day: "Tue", watching: 1.2, listening: 1.8 },
  { day: "Wed", watching: 2.0, listening: 1.6 },
  { day: "Thu", watching: 1.4, listening: 2.4 },
  { day: "Fri", watching: 2.8, listening: 2.0 },
  { day: "Sat", watching: 4.6, listening: 3.2 },
  { day: "Sun", watching: 3.9, listening: 2.9 },
];

const peakHours = [
  { slot: "6-9 AM", hours: 4 },
  { slot: "9-12 PM", hours: 7 },
  { slot: "12-3 PM", hours: 11 },
  { slot: "3-6 PM", hours: 16 },
  { slot: "6-9 PM", hours: 28 },
  { slot: "9-12 AM", hours: 34 },
  { slot: "12-3 AM", hours: 12 },
];

const matchAccuracy = [
  { month: "Aug", accuracy: 78 },
  { month: "Sep", accuracy: 80 },
  { month: "Oct", accuracy: 83 },
  { month: "Nov", accuracy: 82 },
  { month: "Dec", accuracy: 86 },
  { month: "Jan", accuracy: 88 },
  { month: "Feb", accuracy: 87 },
  { month: "Mar", accuracy: 90 },
  { month: "Apr", accuracy: 91 },
  { month: "May", accuracy: 92 },
  { month: "Jun", accuracy: 92 },
  { month: "Jul", accuracy: 93 },
];

const ratingsGiven = [
  { rating: "≤5", titles: 6 },
  { rating: "6", titles: 12 },
  { rating: "7", titles: 28 },
  { rating: "8", titles: 47 },
  { rating: "9", titles: 39 },
  { rating: "10", titles: 21 },
];

const communityEngagement = [
  { month: "Feb", posts: 14, likes: 86, chats: 120 },
  { month: "Mar", posts: 18, likes: 112, chats: 155 },
  { month: "Apr", posts: 11, likes: 74, chats: 98 },
  { month: "May", posts: 22, likes: 134, chats: 176 },
  { month: "Jun", posts: 19, likes: 121, chats: 168 },
  { month: "Jul", posts: 25, likes: 158, chats: 204 },
];

const contentTypes = [
  { name: "Anime", value: 52 },
  { name: "Movies", value: 16 },
  { name: "Shows", value: 14 },
  { name: "K-Drama", value: 12 },
  { name: "Documentary", value: 6 },
];

const topTitles: RankedItem[] = [
  { id: "jujutsu-kaisen", title: "Jujutsu Kaisen", subtitle: "Anime · 4 Seasons", percent: 100, valueLabel: "38 h" },
  { id: "attack-on-titan", title: "Attack On Titan", subtitle: "Anime · 4 Seasons", percent: 84, valueLabel: "32 h" },
  { id: "death-note", title: "Death Note", subtitle: "Anime · 1 Season", percent: 66, valueLabel: "25 h" },
  { id: "money-heist", title: "Money Heist", subtitle: "Show · 5 Parts", percent: 58, valueLabel: "22 h" },
  { id: "demon-slayer", title: "Demon Slayer", subtitle: "Anime · 4 Seasons", percent: 47, valueLabel: "18 h" },
];

const topArtists: RankedItem[] = [
  { id: "twice", title: "TWICE", subtitle: "K-Pop · 284 plays", percent: 100, valueLabel: "31 h" },
  { id: "lisa", title: "LiSA", subtitle: "J-Pop / OST · 236 plays", percent: 82, valueLabel: "25 h" },
  { id: "chase-atlantic", title: "Chase Atlantic", subtitle: "English · 198 plays", percent: 68, valueLabel: "21 h" },
  { id: "newjeans", title: "NewJeans", subtitle: "K-Pop · 164 plays", percent: 55, valueLabel: "17 h" },
  { id: "radwimps", title: "RADWIMPS", subtitle: "J-Pop / OST · 121 plays", percent: 41, valueLabel: "13 h" },
];

const monthComparison: MonthComparisonRow[] = [
  { id: "watch", label: "Watch Hours", current: 14, previous: 12.5, unit: "h" },
  { id: "listen", label: "Listening Hours", current: 18, previous: 16.6, unit: "h" },
  { id: "episodes", label: "Episodes Finished", current: 26, previous: 21 },
  { id: "posts", label: "Community Posts", current: 25, previous: 19 },
  { id: "reviews", label: "Reviews Written", current: 4, previous: 7 },
  { id: "saves", label: "Watchlist Saves", current: 12, previous: 9 },
];

const milestones = [
  { id: "m1", emoji: "🏆", title: "100+ Titles Completed", detail: "Crossed 118 completed titles" },
  { id: "m2", emoji: "🔥", title: "24-Day Streak", detail: "Your longest streak yet" },
  { id: "m3", emoji: "🎧", title: "200h Listening Club", detail: "214 hours of music this year" },
  { id: "m4", emoji: "🎯", title: "93% AI Match", detail: "Taste profile all-time high" },
];

export async function getAnalyticsData(): Promise<AnalyticsData> {
  return {
    kpis,
    timeTrend,
    watchlistStatus,
    genreDistribution,
    tasteProfile,
    weeklyActivity,
    peakHours,
    matchAccuracy,
    ratingsGiven,
    communityEngagement,
    contentTypes,
    topTitles,
    topArtists,
    monthComparison,
    milestones,
  };
}
