import { z } from "zod";

const chatAttachmentSchema = z.object({
  url: z.string().trim().min(1),
  name: z.string().trim().min(1).max(255),
  kind: z.enum(["image", "file"]),
});

export const communityChatSendSchema = z
  .object({
    content: z.string().trim().max(2000, "Message is too long (max 2000 characters)."),
    attachment: chatAttachmentSchema.optional(),
  })
  .refine(
    (data) => data.content.length > 0 || data.attachment != null,
    "Message cannot be empty.",
  );

export const communityChatUpdateSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Message cannot be empty.")
    .max(2000, "Message is too long (max 2000 characters)."),
});

export type CommunityChatSendInput = z.infer<typeof communityChatSendSchema>;
export type CommunityChatUpdateInput = z.infer<typeof communityChatUpdateSchema>;
