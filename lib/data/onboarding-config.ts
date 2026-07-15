import type { Collection, Community, ContentItem, MusicTrack } from "@/types";

/**
 * Client-safe onboarding config — no database imports.
 * Server recommendation building lives in onboarding-recommendations.service.ts.
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
