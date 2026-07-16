import { z } from "zod";

const optionalHeadline = z
  .string()
  .trim()
  .max(200)
  .optional()
  .or(z.literal(""));

export const reviewFormSchema = z.object({
  rating: z.coerce.number().min(0).max(10),
  headline: optionalHeadline,
  body: z.string().trim().min(1, "Write your review.").max(5000),
});

export const reviewUpdateSchema = z.object({
  rating: z.coerce.number().min(0).max(10).optional(),
  headline: optionalHeadline,
  body: z.string().trim().min(1).max(5000).optional(),
});

export type ReviewFormInput = z.infer<typeof reviewFormSchema>;
export type ReviewUpdateInput = z.infer<typeof reviewUpdateSchema>;
