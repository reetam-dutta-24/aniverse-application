import { copyFileSync, mkdirSync } from "fs";
import path from "path";
import { ASSET_DIR, CONTENT_BANNER_KEYS, CONTENT_IMAGE_ASSETS } from "../lib/seed/content-images";

const destDir = path.join(process.cwd(), "public", "images", "content");
mkdirSync(destDir, { recursive: true });

if (CONTENT_IMAGE_ASSETS.length !== CONTENT_BANNER_KEYS.length) {
  throw new Error(
    `Expected ${CONTENT_BANNER_KEYS.length} banner keys, got ${CONTENT_IMAGE_ASSETS.length} assets`,
  );
}

for (let i = 0; i < CONTENT_BANNER_KEYS.length; i++) {
  const key = CONTENT_BANNER_KEYS[i]!;
  const src = path.join(ASSET_DIR, CONTENT_IMAGE_ASSETS[i]!);
  const dest = path.join(destDir, `${key}.png`);
  copyFileSync(src, dest);
  console.log(`${i + 1}. ${key} -> ${key}.png`);
}

console.log(`Installed ${CONTENT_BANNER_KEYS.length} content banners.`);
