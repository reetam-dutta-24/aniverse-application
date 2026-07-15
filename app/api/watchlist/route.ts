import { NextResponse } from "next/server";
import { requireUserApi } from "@/lib/api-auth";
import { mapWatchlistItemToContent } from "@/lib/mappers/watchlist.mapper";
import {
  addWatchlistItem,
  getAllWatchlistItems,
  getHighPriorityWatchlist,
  getWatchlistStatsForUser,
  isWatchlistConflict,
  WatchlistConflictError,
} from "@/lib/services/watchlist.service";
import { watchlistFormSchema } from "@/lib/validators/watchlist";

export async function GET() {
  const auth = await requireUserApi();
  if (auth.error) return auth.error;

  const [stats, highPriority, allItems] = await Promise.all([
    getWatchlistStatsForUser(auth.userId),
    getHighPriorityWatchlist(auth.userId),
    getAllWatchlistItems(auth.userId),
  ]);

  return NextResponse.json({ stats, highPriority, allItems });
}

export async function POST(request: Request) {
  const auth = await requireUserApi();
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const parsed = watchlistFormSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input." },
        { status: 400 },
      );
    }

    const row = await addWatchlistItem(auth.userId, parsed.data);
    return NextResponse.json(
      { item: mapWatchlistItemToContent(row) },
      { status: 201 },
    );
  } catch (error) {
    if (isWatchlistConflict(error)) {
      return NextResponse.json(
        { error: new WatchlistConflictError().message },
        { status: 409 },
      );
    }
    console.error("[watchlist POST]", error);
    return NextResponse.json(
      { error: "Could not add to watchlist." },
      { status: 500 },
    );
  }
}
