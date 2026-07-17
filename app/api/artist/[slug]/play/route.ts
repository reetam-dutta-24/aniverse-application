import { NextResponse } from "next/server";
import { getArtistPlayQueue } from "@/lib/services/artist-play.service";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const queue = await getArtistPlayQueue(slug);

  if (!queue) {
    return NextResponse.json({ error: "Artist not found." }, { status: 404 });
  }

  return NextResponse.json({ queue });
}
