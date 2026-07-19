"use client";

import { useEffect } from "react";

export function ContentWatchTracker({ contentSlug }: { contentSlug: string }) {
  useEffect(() => {
    void fetch(`/api/content/${encodeURIComponent(contentSlug)}/watch-event`, {
      method: "POST",
    }).catch(() => undefined);
  }, [contentSlug]);

  return null;
}
