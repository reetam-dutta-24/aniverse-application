/** User uploads and static catalog art — serve originals, no optimizer downscale. */
export function shouldServeOriginalImage(src: string): boolean {
  return src.startsWith("/uploads/") || src.startsWith("/images/");
}
