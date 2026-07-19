"use client";

import { useEffect } from "react";
import { useOptionalContentEngagement } from "@/components/content/content-engagement-context";

function viewSessionKey(contentSlug: string) {
  return `aniverse-content-view-${contentSlug}`;
}

export function ContentPageViewTracker({ contentSlug }: { contentSlug: string }) {
  const engagement = useOptionalContentEngagement();

  useEffect(() => {
    const sessionKey = viewSessionKey(contentSlug);
    if (typeof window !== "undefined" && sessionStorage.getItem(sessionKey)) {
      return;
    }

    void fetch(`/api/content/${encodeURIComponent(contentSlug)}/view`, {
      method: "POST",
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { views?: number } | null) => {
        if (data?.views != null) {
          engagement?.applyViews(data.views);
          sessionStorage.setItem(sessionKey, "1");
        }
      })
      .catch(() => undefined);
  }, [contentSlug, engagement]);

  return null;
}
