import { z } from "zod";
import { ACCENT_OPTIONS } from "@/lib/catalog-enums";
import { imageUrlField } from "@/lib/validators/image-url";

const accentValues = ACCENT_OPTIONS.map((option) => option.value) as [
  string,
  ...string[],
];

export const communityCategories = [
  "Anime",
  "Movies",
  "Shows",
  "Music",
  "Kpop",
  "Mixed",
] as const;

export const communityFormSchema = z.object({
  name: z.string().min(2, "Name is required.").max(120),
  slug: z
    .string()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens.")
    .optional(),
  category: z.enum(communityCategories).default("Anime"),
  description: z.string().max(3000).optional(),
  visibility: z.enum(["PUBLIC", "PRIVATE"]).default("PUBLIC"),
  activityLevel: z
    .enum(["very-active", "active", "moderate", "quiet"])
    .optional(),
  accent: z.enum(accentValues).optional(),
  imageUrl: imageUrlField,
  wallpaperUrl: imageUrlField,
});

export const communityUpdateSchema = communityFormSchema.partial();

export const communityPostFormSchema = z.object({
  title: z.string().min(1, "Post title is required.").max(200),
  imageUrl: imageUrlField.refine((value) => Boolean(value?.trim()), {
    message: "Post image is required.",
  }),
  content: z.string().max(5000).optional(),
  kind: z.enum(["POST", "ANNOUNCEMENT"]).default("POST"),
});

export const communityPostUpdateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  imageUrl: imageUrlField,
  content: z.string().max(5000).optional(),
});

export const voiceChannelFormSchema = z.object({
  title: z.string().min(1, "Channel title is required.").max(120),
  memberLimit: z.coerce.number().int().min(2).max(100).default(10),
});

export const voiceChannelUpdateSchema = voiceChannelFormSchema.partial();

export const watchChannelFormSchema = z
  .object({
    title: z.string().min(1, "Channel title is required.").max(120),
    memberLimit: z.coerce.number().int().min(2).max(100).default(20),
    contentSlug: z.string().optional(),
    trackSlug: z.string().optional(),
  })
  .refine((value) => Boolean(value.contentSlug?.trim() || value.trackSlug?.trim()), {
    message: "Select content or music for the watch channel.",
    path: ["contentSlug"],
  });

export const watchChannelUpdateSchema = z.object({
  title: z.string().min(1).max(120).optional(),
  memberLimit: z.coerce.number().int().min(2).max(100).optional(),
  contentSlug: z.string().optional(),
  trackSlug: z.string().optional(),
});

export const joinCommunitySchema = z.object({
  slug: z.string().min(1, "Community slug is required."),
});

export type CommunityFormInput = z.infer<typeof communityFormSchema>;
export type CommunityUpdateInput = z.infer<typeof communityUpdateSchema>;
export type CommunityPostFormInput = z.infer<typeof communityPostFormSchema>;
export type CommunityPostUpdateInput = z.infer<typeof communityPostUpdateSchema>;
export type VoiceChannelFormInput = z.infer<typeof voiceChannelFormSchema>;
export type VoiceChannelUpdateInput = z.infer<typeof voiceChannelUpdateSchema>;
export type WatchChannelFormInput = z.infer<typeof watchChannelFormSchema>;
export type WatchChannelUpdateInput = z.infer<typeof watchChannelUpdateSchema>;
