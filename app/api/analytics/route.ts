import { NextResponse } from "next/server";
import { requireUserApi } from "@/lib/api-auth";
import { getAnalyticsForUser } from "@/lib/services/analytics.service";

export async function GET() {
  const auth = await requireUserApi();
  if (auth.error) return auth.error;

  try {
    const analytics = await getAnalyticsForUser(auth.userId);
    return NextResponse.json({ analytics });
  } catch (error) {
    console.error("[analytics GET]", error);
    return NextResponse.json(
      { error: "Could not load analytics." },
      { status: 500 },
    );
  }
}
