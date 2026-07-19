import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  formatEngagementCount,
  getContentEngagementStats,
  getContentRecordBySlug,
} from "@/lib/services/content.service";
import { isContentFavorited } from "@/lib/services/favorite.service";
import { isContentOnWatchlist } from "@/lib/services/watchlist.service";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const record = await getContentRecordBySlug(slug);
  if (!record) {
    return NextResponse.json({ error: "Content not found." }, { status: 404 });
  }

  const stats = await getContentEngagementStats(record.id);
  const session = await auth();
  const viewer = session?.user?.id
    ? {
        favorited: await isContentFavorited(session.user.id, slug),
        onWatchlist: await isContentOnWatchlist(session.user.id, slug),
      }
    : null;

  return NextResponse.json({
    likes: stats.favorites,
    watching: stats.watching,
    views: stats.views,
    collections: stats.collections,
    formatted: {
      likes: formatEngagementCount(stats.favorites),
      watching: formatEngagementCount(stats.watching),
      views: formatEngagementCount(stats.views),
      collections: formatEngagementCount(stats.collections),
    },
    viewer,
  });
}
