import { z } from "zod";
import { ACCENT_OPTIONS, CONTENT_GENRE_OPTIONS } from "@/lib/catalog-enums";
import { imageUrlField } from "@/lib/validators/image-url";

const accentValues = ACCENT_OPTIONS.map((option) => option.value) as [
  string,
  ...string[],
];

const contentGenreValues = CONTENT_GENRE_OPTIONS.map((option) => option.value) as [
  string,
  ...string[],
];

export const collectionCategories = [
  "Anime",
  "Movies",
  "Shows",
  "Music",
  "Mixed",
] as const;

export const collectionKinds = ["content", "music"] as const;

export const collectionFormSchema = z.object({
  name: z.string().min(2, "Name is required.").max(120),
  slug: z
    .string()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens.")
    .optional(),
  description: z.string().max(2000).optional(),
  category: z.enum(collectionCategories).default("Mixed"),
  genreLabels: z.array(z.enum(contentGenreValues)).max(8).optional(),
  kind: z.enum(collectionKinds).default("content"),
  visibility: z.enum(["PUBLIC", "PRIVATE"]).default("PRIVATE"),
  accent: z.enum(accentValues).optional(),
  imageUrl: imageUrlField,
  initialContentSlugs: z.array(z.string().min(1)).max(24).optional(),
  initialTrackSlugs: z.array(z.string().min(1)).max(24).optional(),
});

export const collectionUpdateSchema = collectionFormSchema
  .omit({ initialContentSlugs: true, initialTrackSlugs: true })
  .partial();

export const collectionItemFormSchema = z
  .object({
    contentSlug: z.string().optional(),
    trackSlug: z.string().optional(),
  })
  .refine((data) => data.contentSlug || data.trackSlug, {
    message: "Provide a content or track slug.",
  });

export type CollectionFormInput = z.infer<typeof collectionFormSchema>;
export type CollectionUpdateInput = z.infer<typeof collectionUpdateSchema>;
export type CollectionItemFormInput = z.infer<typeof collectionItemFormSchema>;
