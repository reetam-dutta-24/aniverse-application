import { z } from "zod";

export const watchlistFormSchema = z.object({
  contentSlug: z.string().min(1, "Select content to add."),
  priority: z.enum(["NORMAL", "HIGH"]).default("NORMAL"),
  status: z
    .enum(["PENDING", "WATCHING", "COMPLETED", "DROPPED"])
    .default("PENDING"),
});

export const watchlistUpdateSchema = z.object({
  priority: z.enum(["NORMAL", "HIGH"]).optional(),
  status: z.enum(["PENDING", "WATCHING", "COMPLETED", "DROPPED"]).optional(),
});

export type WatchlistFormInput = z.infer<typeof watchlistFormSchema>;
export type WatchlistUpdateInput = z.infer<typeof watchlistUpdateSchema>;
