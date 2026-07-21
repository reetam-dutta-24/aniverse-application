import { z } from "zod";
import { accentEnum } from "@/lib/validators/admin/catalog-shared";
import {
  collectionCategories,
  collectionKinds,
} from "@/lib/validators/collection";

const optionalString = z.string().trim().max(500).optional().or(z.literal(""));
const optionalLongString = z.string().trim().max(2000).optional().or(z.literal(""));

export const adminCollectionFormSchema = z.object({
  name: z.string().trim().min(2, "Name is required.").max(120),
  slug: z
    .string()
    .trim()
    .min(2, "Slug is required.")
    .max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens"),
  description: optionalLongString,
  category: z.enum(collectionCategories).default("Mixed"),
  genreLabels: z.array(z.string().trim().min(1)).max(8).default([]),
  kind: z.enum(collectionKinds).default("content"),
  visibility: z.enum(["PUBLIC", "PRIVATE"]).default("PUBLIC"),
  accent: accentEnum.optional(),
  imageUrl: optionalString,
  contentSlugs: z.array(z.string().trim().min(1)).max(48).default([]),
  trackSlugs: z.array(z.string().trim().min(1)).max(48).default([]),
});

export type AdminCollectionFormInput = z.infer<typeof adminCollectionFormSchema>;

export const adminCollectionListQuerySchema = z.object({
  q: z.string().trim().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(50),
});
