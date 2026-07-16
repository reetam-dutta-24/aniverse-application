export type ChatAttachmentKind = "image" | "file";

export interface ChatAttachment {
  url: string;
  name: string;
  kind: ChatAttachmentKind;
}

export type ChatQuickAction =
  | "image"
  | "folder"
  | "file"
  | "attachment"
  | "emoji";

export const CHAT_QUICK_ACTIONS = [
  { emoji: "🖼️", label: "Upload image", action: "image" as const },
  { emoji: "📁", label: "Upload from folder", action: "folder" as const },
  { emoji: "📄", label: "Upload file", action: "file" as const },
  { emoji: "📎", label: "Attach file", action: "attachment" as const },
  { emoji: "😀", label: "Smile", action: "emoji" as const },
  { emoji: "❤️", label: "Heart", action: "emoji" as const },
  { emoji: "🔥", label: "Fire", action: "emoji" as const },
  { emoji: "✨", label: "Sparkle", action: "emoji" as const },
] as const;

export const CHAT_EMOJI_ACTIONS = CHAT_QUICK_ACTIONS.filter(
  (item) => item.action === "emoji",
);

export function isImageMime(type: string) {
  return type.startsWith("image/");
}

export function attachmentKindFromMime(type: string): ChatAttachmentKind {
  return isImageMime(type) ? "image" : "file";
}

export const CHAT_IMAGE_ACCEPT =
  "image/jpeg,image/png,image/webp,image/gif";

export const CHAT_FILE_ACCEPT =
  ".pdf,.txt,.zip,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.csv,.json,.mp3,.mp4,.webm";

export const CHAT_ANY_ACCEPT = `${CHAT_IMAGE_ACCEPT},${CHAT_FILE_ACCEPT}`;

export const CHAT_FOLDER_MAX_FILES = 5;
