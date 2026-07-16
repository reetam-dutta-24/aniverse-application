import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getCollectionPlayQueue } from "@/lib/services/collection-play.service";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const session = await auth();
  const queue = await getCollectionPlayQueue(slug, session?.user?.id);

  if (!queue) {
    return NextResponse.json({ error: "Collection not found." }, { status: 404 });
  }

  return NextResponse.json({ queue });
}
