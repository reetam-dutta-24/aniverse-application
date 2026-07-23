import { NextResponse } from "next/server";
import { requireUserApi } from "@/lib/api-auth";
import { getDmUnreadSummary } from "@/lib/services/dm.service";

export async function GET() {
  const auth = await requireUserApi();
  if (auth.error) return auth.error;

  try {
    const summary = await getDmUnreadSummary(auth.userId);
    return NextResponse.json(summary);
  } catch (error) {
    console.error("[dm unread GET]", error);
    return NextResponse.json(
      { error: "Could not load unread messages." },
      { status: 500 },
    );
  }
}
