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
  content: z.string().min(1, "Post content is required.").max(5000),
  imageUrl: imageUrlField,
});

export const communityPostUpdateSchema = communityPostFormSchema.partial();

export const joinCommunitySchema = z.object({
  slug: z.string().min(1, "Community slug is required."),
});

export type CommunityFormInput = z.infer<typeof communityFormSchema>;
export type CommunityUpdateInput = z.infer<typeof communityUpdateSchema>;
export type CommunityPostFormInput = z.infer<typeof communityPostFormSchema>;
export type CommunityPostUpdateInput = z.infer<typeof communityPostUpdateSchema>;
