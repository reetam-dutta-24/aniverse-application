import { z } from "zod";
import { ACCENT_OPTIONS } from "@/lib/catalog-enums";

const accentValues = ACCENT_OPTIONS.map((o) => o.value) as [
  string,
  ...string[],
];

export const userProfileUpdateSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(80).optional(),
  bio: z.string().trim().max(500).optional(),
  location: z.string().trim().max(80).optional(),
  profileAccent: z.enum(accentValues).optional(),
  portraitUrl: z.string().trim().max(2048).optional(),
  avatarUrl: z.string().trim().max(2048).optional(),
});

export type UserProfileUpdateInput = z.infer<typeof userProfileUpdateSchema>;

export const userSettingsUpdateSchema = z.object({
  notifications: z
    .object({
      newEpisodes: z.boolean().optional(),
      watchParties: z.boolean().optional(),
      musicDrops: z.boolean().optional(),
      communityPosts: z.boolean().optional(),
      weeklyRecap: z.boolean().optional(),
      emailDigest: z.boolean().optional(),
    })
    .optional(),
  privacy: z
    .object({
      publicProfile: z.boolean().optional(),
      showActivity: z.boolean().optional(),
      showWatchHistory: z.boolean().optional(),
      allowMessages: z.boolean().optional(),
    })
    .optional(),
  preferences: z
    .object({
      language: z.string().trim().max(40).optional(),
      autoplayPreviews: z.boolean().optional(),
      spoilerWarnings: z.boolean().optional(),
      matureContent: z.boolean().optional(),
      reducedMotion: z.boolean().optional(),
    })
    .optional(),
});

export type UserSettingsUpdateInput = z.infer<typeof userSettingsUpdateSchema>;

export const userPasswordUpdateSchema = z
  .object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string().min(1),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type UserPasswordUpdateInput = z.infer<typeof userPasswordUpdateSchema>;
