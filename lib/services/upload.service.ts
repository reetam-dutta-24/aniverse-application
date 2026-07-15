import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

const MAX_BYTES = 5 * 1024 * 1024;

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

export class UploadValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UploadValidationError";
  }
}

export async function saveUploadedImage(
  file: File,
  userId: string,
): Promise<string> {
  if (!ALLOWED_MIME.has(file.type)) {
    throw new UploadValidationError(
      "Only JPG, PNG, WebP, and GIF images are allowed.",
    );
  }

  if (file.size > MAX_BYTES) {
    throw new UploadValidationError("Image must be 5 MB or smaller.");
  }

  const ext = EXT_BY_MIME[file.type];
  const filename = `${randomUUID()}${ext}`;
  const relativeDir = path.join("uploads", userId);
  const absoluteDir = path.join(process.cwd(), "public", relativeDir);

  await mkdir(absoluteDir, { recursive: true });

  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(absoluteDir, filename), bytes);

  return `/${relativeDir.replace(/\\/g, "/")}/${filename}`;
}
