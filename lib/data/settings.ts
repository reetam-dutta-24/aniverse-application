/**
 * Data layer for the Settings page — loads from PostgreSQL.
 */

import { getSettingsForUser } from "@/lib/services/user-settings.service";

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
  email: string;
  handle: string;
  profilePath: string;
  notifications: NotificationPreferences;
  privacy: PrivacyPreferences;
  preferences: AppPreferences;
  tasteScore: number;
  memberSince: string;
}

export async function getSettingsData(userId: string): Promise<SettingsData> {
  return getSettingsForUser(userId);
}

export const languageOptions = ["English", "Japanese", "Korean", "Hindi"] as const;
