import { NextResponse } from "next/server";
import {
  formatEngagementCount,
  getContentRecordBySlug,
  recordContentPageView,
} from "@/lib/services/content.service";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function POST(_request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const record = await getContentRecordBySlug(slug);
  if (!record) {
    return NextResponse.json({ error: "Content not found." }, { status: 404 });
  }

  try {
    const views = await recordContentPageView(slug);
    if (views == null) {
      return NextResponse.json({ error: "Content not found." }, { status: 404 });
    }

    return NextResponse.json({
      views,
      formattedViews: formatEngagementCount(views),
    });
  } catch (error) {
    console.error("[content view POST]", error);
    return NextResponse.json(
      { error: "Could not record page view." },
      { status: 500 },
    );
  }
}
