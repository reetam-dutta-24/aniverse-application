import { prisma } from "@/lib/prisma";
import { formatCardDate } from "@/lib/format-dates";
import { getProfilePath } from "@/lib/profile-routes";
import {
  accentToAvatarColor,
  resolveProfileAccent,
} from "@/lib/profile-theme";
import { verifyPassword } from "@/lib/services/user.service";
import type {
  AppPreferences,
  NotificationPreferences,
  PrivacyPreferences,
  SettingsData,
} from "@/lib/data/settings";
import type {
  UserPasswordUpdateInput,
  UserProfileUpdateInput,
  UserSettingsUpdateInput,
} from "@/lib/validators/user-profile";

export class SettingsConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SettingsConflictError";
  }
}

function mapPreferences(row: {
  newEpisodes: boolean;
  watchParties: boolean;
  musicDrops: boolean;
  communityPosts: boolean;
  weeklyRecap: boolean;
  emailDigest: boolean;
  publicProfile: boolean;
  showActivity: boolean;
  showWatchHistory: boolean;
  allowMessages: boolean;
  language: string;
  autoplayPreviews: boolean;
  spoilerWarnings: boolean;
  matureContent: boolean;
  reducedMotion: boolean;
}) {
  const notifications: NotificationPreferences = {
    newEpisodes: row.newEpisodes,
    watchParties: row.watchParties,
    musicDrops: row.musicDrops,
    communityPosts: row.communityPosts,
    weeklyRecap: row.weeklyRecap,
    emailDigest: row.emailDigest,
  };
  const privacy: PrivacyPreferences = {
    publicProfile: row.publicProfile,
    showActivity: row.showActivity,
    showWatchHistory: row.showWatchHistory,
    allowMessages: row.allowMessages,
  };
  const preferences: AppPreferences = {
    language: row.language,
    autoplayPreviews: row.autoplayPreviews,
    spoilerWarnings: row.spoilerWarnings,
    matureContent: row.matureContent,
    reducedMotion: row.reducedMotion,
  };
  return { notifications, privacy, preferences };
}

export async function getSettingsForUser(userId: string): Promise<SettingsData> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { preferences: true, tasteProfile: true },
  });

  if (!user) throw new SettingsConflictError("User not found.");

  const prefs = user.preferences ?? {
    newEpisodes: true,
    watchParties: true,
    musicDrops: true,
    communityPosts: false,
    weeklyRecap: true,
    emailDigest: false,
    publicProfile: true,
    showActivity: true,
    showWatchHistory: false,
    allowMessages: true,
    language: "English",
    autoplayPreviews: true,
    spoilerWarnings: true,
    matureContent: false,
    reducedMotion: false,
  };

  const mapped = mapPreferences(prefs);

  return {
    email: user.email,
    handle: user.handle,
    profilePath: getProfilePath(user.handle),
    tasteScore: user.aiTasteScore || user.tasteProfile?.tasteScore || 0,
    memberSince: formatCardDate(user.createdAt),
    ...mapped,
  };
}

export async function updateUserProfile(
  userId: string,
  input: UserProfileUpdateInput,
) {
  const accent = input.profileAccent
    ? resolveProfileAccent(input.profileAccent)
    : undefined;

  return prisma.user.update({
    where: { id: userId },
    data: {
      ...(input.name != null ? { name: input.name } : {}),
      ...(input.bio != null ? { bio: input.bio } : {}),
      ...(input.location != null ? { location: input.location } : {}),
      ...(input.portraitUrl != null ? { portraitUrl: input.portraitUrl || null } : {}),
      ...(input.avatarUrl != null ? { avatarUrl: input.avatarUrl || null } : {}),
      ...(accent
        ? {
            profileAccent: accent,
            avatarColor: accentToAvatarColor(accent),
          }
        : {}),
    },
    select: {
      id: true,
      handle: true,
      name: true,
      bio: true,
      location: true,
      avatarColor: true,
      avatarUrl: true,
      portraitUrl: true,
      profileAccent: true,
    },
  });
}

export async function updateUserSettings(
  userId: string,
  input: UserSettingsUpdateInput,
) {
  const data: Record<string, boolean | string> = {};

  if (input.notifications) {
    Object.assign(data, input.notifications);
  }
  if (input.privacy) {
    Object.assign(data, input.privacy);
  }
  if (input.preferences) {
    Object.assign(data, input.preferences);
  }

  if (Object.keys(data).length === 0) {
    return getSettingsForUser(userId);
  }

  await prisma.userPreferences.upsert({
    where: { userId },
    create: { userId, ...data },
    update: data,
  });

  return getSettingsForUser(userId);
}

export async function updateUserPassword(
  userId: string,
  input: UserPasswordUpdateInput,
) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { passwordHash: true },
  });

  if (!user?.passwordHash) {
    throw new SettingsConflictError(
      "Password change is not available for this account.",
    );
  }

  const valid = await verifyPassword(input.currentPassword, user.passwordHash);
  if (!valid) {
    throw new SettingsConflictError("Current password is incorrect.");
  }

  const bcrypt = await import("bcryptjs");
  const passwordHash = await bcrypt.hash(input.newPassword, 12);

  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
  });
}

export async function clearUserWatchHistory(userId: string) {
  await Promise.all([
    prisma.watchEvent.deleteMany({ where: { userId } }),
    prisma.listenEvent.deleteMany({ where: { userId } }),
  ]);
}

export async function deleteUserAccount(userId: string) {
  await prisma.user.delete({ where: { id: userId } });
}
