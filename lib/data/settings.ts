/**
 * Data layer for the Settings page.
 * Async accessors — swap bodies when backend is wired.
 */

export interface SettingsProfile {
  name: string;
  handle: string;
  email: string;
  bio: string;
  location: string;
  avatarColor: string;
  profilePath: string;
}

export interface NotificationPreferences {
  newEpisodes: boolean;
  watchParties: boolean;
  musicDrops: boolean;
  communityPosts: boolean;
  weeklyRecap: boolean;
  emailDigest: boolean;
}

export interface PrivacyPreferences {
  publicProfile: boolean;
  showActivity: boolean;
  showWatchHistory: boolean;
  allowMessages: boolean;
}

export interface AppPreferences {
  language: string;
  autoplayPreviews: boolean;
  spoilerWarnings: boolean;
  matureContent: boolean;
  reducedMotion: boolean;
}

export interface SettingsData {
  profile: SettingsProfile;
  notifications: NotificationPreferences;
  privacy: PrivacyPreferences;
  preferences: AppPreferences;
  tasteScore: number;
  memberSince: string;
}

const settingsData: SettingsData = {
  profile: {
    name: "Reetam Dutta",
    handle: "Reetam_Dutta_2423",
    email: "reetam.dutta@aniverse.app",
    bio: "Anime, music, K-drama and product design lover. Curating my own entertainment universe through collections, communities and AI-powered discovery.",
    location: "Kolkata, India",
    avatarColor: "#ff00cc",
    profilePath: "/profile/reetam-dutta",
  },
  notifications: {
    newEpisodes: true,
    watchParties: true,
    musicDrops: true,
    communityPosts: false,
    weeklyRecap: true,
    emailDigest: false,
  },
  privacy: {
    publicProfile: true,
    showActivity: true,
    showWatchHistory: false,
    allowMessages: true,
  },
  preferences: {
    language: "English",
    autoplayPreviews: true,
    spoilerWarnings: true,
    matureContent: false,
    reducedMotion: false,
  },
  tasteScore: 91,
  memberSince: "23rd Aug, 2025",
};

export async function getSettingsData(): Promise<SettingsData> {
  return settingsData;
}

export const languageOptions = ["English", "Japanese", "Korean", "Hindi"] as const;
