import { NextResponse } from "next/server";
import { requireUserApi } from "@/lib/api-auth";
import {
  formatEngagementCount,
  getContentEngagementStats,
  getContentRecordBySlug,
} from "@/lib/services/content.service";
import {
  startContentWatching,
  WatchlistNotFoundError,
} from "@/lib/services/watchlist.service";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function POST(_request: Request, context: RouteContext) {
  const auth = await requireUserApi();
  if (auth.error) return auth.error;

  const { slug } = await context.params;

  try {
    const result = await startContentWatching(auth.userId, slug);
    const record = await getContentRecordBySlug(slug);
    const watching = record
      ? (await getContentEngagementStats(record.id)).watching
      : result.watching;

    return NextResponse.json({
      onWatchlist: result.onWatchlist,
      watching,
      formattedWatching: formatEngagementCount(watching),
    });
  } catch (error) {
    if (error instanceof WatchlistNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    console.error("[content watch-start POST]", error);
    return NextResponse.json(
      { error: "Could not start watching." },
      { status: 500 },
    );
  }
}
