import { z } from "zod";

const mediaTypes = [
  "anime",
  "show",
  "movie",
  "documentary",
  "kdrama",
  "song",
  "album",
  "artist",
  "playlist",
] as const;

export const contentFormSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens"),
  type: z.enum(mediaTypes),
  description: z.string().trim().max(500).optional().or(z.literal("")),
  synopsis: z.string().trim().max(5000).optional().or(z.literal("")),
  imageUrl: z.string().trim().max(500).optional().or(z.literal("")),
  rating: z.coerce.number().min(0).max(10).optional(),
  year: z.coerce.number().int().min(1900).max(2100).optional(),
  meta: z.string().trim().max(120).optional().or(z.literal("")),
  accent: z
    .enum(["pink", "purple", "cyan", "blue", "green", "yellow"])
    .optional(),
  genreLabels: z.array(z.string().trim().min(1)).default([]),
});

export type ContentFormInput = z.infer<typeof contentFormSchema>;

export const contentListQuerySchema = z.object({
  q: z.string().trim().optional(),
  type: z.enum(mediaTypes).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});
