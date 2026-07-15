import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { emptyOnboardingSelection } from "@/lib/data/onboarding-config";
import { buildOnboardingRecommendations } from "@/lib/services/onboarding-recommendations.service";

const selectionSchema = z.object({
  contentTypes: z.array(z.string()).default([]),
  genres: z.array(z.string()).default([]),
  musicTastes: z.array(z.string()).default([]),
  goals: z.array(z.string()).default([]),
  favoriteTitles: z.array(z.string()).default([]),
  moods: z.array(z.string()).default([]),
  watchHabits: z.array(z.string()).default([]),
  artists: z.array(z.string()).default([]),
});

/** POST /api/onboarding/recommendations — build taste profile picks on the server. */
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const parsed = selectionSchema.safeParse(body.selection ?? body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid selection." },
        { status: 400 },
      );
    }

    const recommendations = await buildOnboardingRecommendations({
      ...emptyOnboardingSelection,
      ...parsed.data,
    });

    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error("[onboarding/recommendations]", error);
    return NextResponse.json(
      { error: "Could not build recommendations." },
      { status: 500 },
    );
  }
}
