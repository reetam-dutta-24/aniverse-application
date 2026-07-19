import { NextResponse } from "next/server";
import { requireUserApi } from "@/lib/api-auth";
import { recordContentWatchEvent } from "@/lib/services/content.service";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function POST(_request: Request, context: RouteContext) {
  const auth = await requireUserApi();
  if (auth.error) return auth.error;

  const { slug } = await context.params;

  try {
    await recordContentWatchEvent(auth.userId, slug);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[content watch-event POST]", error);
    return NextResponse.json(
      { error: "Could not record watch event." },
      { status: 500 },
    );
  }
}
