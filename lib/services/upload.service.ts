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

  if (file.size === 0) {
    throw new UploadValidationError(
      "The uploaded file is empty. Try again or choose a smaller image.",
    );
  }

  const ext = EXT_BY_MIME[file.type];
  const filename = `${randomUUID()}${ext}`;
  const relativeDir = path.join("uploads", userId);
  const absoluteDir = path.join(process.cwd(), "public", relativeDir);

  try {
    await mkdir(absoluteDir, { recursive: true });

    const bytes = Buffer.from(await file.arrayBuffer());
    if (bytes.length === 0) {
      throw new UploadValidationError(
        "The uploaded file could not be read. Try a smaller image.",
      );
    }

    await writeFile(path.join(absoluteDir, filename), bytes);
  } catch (error) {
    if (error instanceof UploadValidationError) {
      throw error;
    }
    throw new UploadValidationError(
      "Could not save the image. Check that the app can write to public/uploads.",
    );
  }

  return `/${relativeDir.replace(/\\/g, "/")}/${filename}`;
}
