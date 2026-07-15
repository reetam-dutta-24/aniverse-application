import { z } from "zod";

const absoluteImageUrl = /^https?:\/\/.+/i;
const relativeImagePath = /^\/[^\s?#]+$/;

/** Accepts empty, absolute URLs, or site-relative paths like /uploads/... */
export const imageUrlField = z
  .string()
  .trim()
  .max(500)
  .refine(
    (value) =>
      value === "" || absoluteImageUrl.test(value) || relativeImagePath.test(value),
    { message: "Enter a valid image URL or path." },
  )
  .optional()
  .or(z.literal(""));
