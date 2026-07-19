"use client";

import { ContentEngagementProvider } from "@/components/content/content-engagement-context";
import { ContentPageViewTracker } from "@/components/content/content-page-view-tracker";
import type { ContentEngagementStat } from "@/types";

export interface ContentDetailEngagementShellProps {
  contentSlug: string;
  initialStats: ContentEngagementStat[];
  initialFavorited?: boolean;
  initialOnWatchlist?: boolean;
  favoriteApiPath?: string;
  /** Record a catalog page view — enabled for show/movie content detail pages. */
  trackPageView?: boolean;
  children: React.ReactNode;
}

/** Wraps detail pages that render ContentDetailHero and shared KPI interactions. */
export function ContentDetailEngagementShell({
  contentSlug,
  initialStats,
  initialFavorited,
  initialOnWatchlist,
  favoriteApiPath,
  trackPageView = true,
  children,
}: ContentDetailEngagementShellProps) {
  return (
    <ContentEngagementProvider
      contentSlug={contentSlug}
      initialStats={initialStats}
      initialFavorited={initialFavorited}
      initialOnWatchlist={initialOnWatchlist}
      favoriteApiPath={favoriteApiPath}
    >
      {trackPageView ? <ContentPageViewTracker contentSlug={contentSlug} /> : null}
      {children}
    </ContentEngagementProvider>
  );
}
