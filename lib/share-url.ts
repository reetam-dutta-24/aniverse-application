/** Copy the current page URL to the clipboard (with optional Web Share API fallback). */
export async function shareCurrentUrl(options?: {
  title?: string;
  text?: string;
  preferClipboard?: boolean;
}): Promise<boolean> {
  if (typeof window === "undefined") return false;

  const url = window.location.href;

  if (!options?.preferClipboard && navigator.share) {
    try {
      await navigator.share({
        title: options?.title,
        text: options?.text,
        url,
      });
      return true;
    } catch {
      /* cancelled or unsupported */
    }
  }

  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch {
    return false;
  }
}

export async function copyTextToClipboard(text: string): Promise<boolean> {
  if (typeof navigator === "undefined") return false;
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
