import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import {
  attachmentKindFromMime,
  type ChatAttachmentKind,
} from "@/lib/chat-emojis";

const IMAGE_MAX_BYTES = 10 * 1024 * 1024;
const FILE_MAX_BYTES = 10 * 1024 * 1024;

const IMAGE_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const FILE_MIME = new Set([
  "application/pdf",
  "text/plain",
  "text/csv",
  "application/json",
  "application/zip",
  "application/x-zip-compressed",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "audio/mpeg",
  "audio/mp3",
  "video/mp4",
  "video/webm",
]);

const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "application/pdf": ".pdf",
  "text/plain": ".txt",
  "text/csv": ".csv",
  "application/json": ".json",
  "application/zip": ".zip",
  "application/x-zip-compressed": ".zip",
  "application/msword": ".doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    ".docx",
  "application/vnd.ms-excel": ".xls",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ".xlsx",
  "application/vnd.ms-powerpoint": ".ppt",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation":
    ".pptx",
  "audio/mpeg": ".mp3",
  "audio/mp3": ".mp3",
  "video/mp4": ".mp4",
  "video/webm": ".webm",
};

export class UploadValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UploadValidationError";
  }
}

function resolveExtension(file: File) {
  const fromMime = EXT_BY_MIME[file.type];
  if (fromMime) return fromMime;

  const fromName = path.extname(file.name);
  return fromName || ".bin";
}

function validateUpload(file: File) {
  if (file.size === 0) {
    throw new UploadValidationError(
      "The uploaded file is empty. Try again or choose a smaller file.",
    );
  }

  const isImage = IMAGE_MIME.has(file.type);
  const isFile = FILE_MIME.has(file.type);

  if (!isImage && !isFile) {
    throw new UploadValidationError(
      "Unsupported file type. Use images or common document/media formats.",
    );
  }

  const maxBytes = isImage ? IMAGE_MAX_BYTES : FILE_MAX_BYTES;
  if (file.size > maxBytes) {
    throw new UploadValidationError(
      isImage
        ? "Image must be 10 MB or smaller."
        : "File must be 10 MB or smaller.",
    );
  }

  return attachmentKindFromMime(file.type);
}

async function persistUpload(
  file: File,
  userId: string,
  subfolder: "images" | "files",
): Promise<string> {
  const ext = resolveExtension(file);
  const filename = `${randomUUID()}${ext}`;
  const relativeDir = path.join("uploads", userId, subfolder);
  const absoluteDir = path.join(process.cwd(), "public", relativeDir);

  try {
    await mkdir(absoluteDir, { recursive: true });

    const bytes = Buffer.from(await file.arrayBuffer());
    if (bytes.length === 0) {
      throw new UploadValidationError(
        "The uploaded file could not be read. Try a smaller file.",
      );
    }

    await writeFile(path.join(absoluteDir, filename), bytes);
  } catch (error) {
    if (error instanceof UploadValidationError) {
      throw error;
    }
    throw new UploadValidationError(
      "Could not save the file. Check that the app can write to public/uploads.",
    );
  }

  return `/${relativeDir.replace(/\\/g, "/")}/${filename}`;
}

export async function saveUploadedImage(
  file: File,
  userId: string,
): Promise<string> {
  if (!IMAGE_MIME.has(file.type)) {
    throw new UploadValidationError(
      "Only JPG, PNG, WebP, and GIF images are allowed.",
    );
  }

  if (file.size > IMAGE_MAX_BYTES) {
    throw new UploadValidationError("Image must be 10 MB or smaller.");
  }

  return persistUpload(file, userId, "images");
}

export async function saveUploadedChatFile(
  file: File,
  userId: string,
): Promise<{ url: string; name: string; kind: ChatAttachmentKind }> {
  const kind = validateUpload(file);
  const subfolder = kind === "image" ? "images" : "files";
  const url = await persistUpload(file, userId, subfolder);

  return {
    url,
    name: file.name,
    kind,
  };
}
