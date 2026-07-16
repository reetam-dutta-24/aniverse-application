import { z } from "zod";

export const dmSendSchema = z.object({
  content: z.string().trim().min(1, "Message cannot be empty.").max(4000),
  recipientHandle: z.string().trim().min(1),
});

export const dmEditSchema = z.object({
  content: z.string().trim().min(1, "Message cannot be empty.").max(4000),
});
