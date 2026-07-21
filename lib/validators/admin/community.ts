import { z } from "zod";
import { accentEnum } from "@/lib/validators/admin/catalog-shared";
import { communityCategories } from "@/lib/validators/community";

const optionalString = z.string().trim().max(500).optional().or(z.literal(""));
const optionalLongString = z.string().trim().max(3000).optional().or(z.literal(""));

export const adminCommunityFormSchema = z.object({
  name: z.string().trim().min(2, "Name is required.").max(120),
  slug: z
    .string()
    .trim()
    .min(2, "Slug is required.")
    .max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens"),
  category: z.enum(communityCategories).default("Anime"),
  description: optionalLongString,
  visibility: z.enum(["PUBLIC", "PRIVATE"]).default("PUBLIC"),
  activityLevel: z
    .enum(["very-active", "active", "moderate", "quiet"])
    .default("active"),
  accent: accentEnum.optional(),
  imageUrl: optionalString,
  wallpaperUrl: optionalString,
});

export type AdminCommunityFormInput = z.infer<typeof adminCommunityFormSchema>;

export const adminCommunityListQuerySchema = z.object({
  q: z.string().trim().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(50),
});
