import { NextResponse } from "next/server";
import { requireUserApi } from "@/lib/api-auth";
import { mapReviewRow } from "@/lib/mappers/user-profile.mapper";
import {
  createReview,
  isReviewConflict,
  isReviewTargetNotFound,
  listReviewsForTarget,
} from "@/lib/services/review.service";
import { reviewFormSchema } from "@/lib/validators/review";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;

  try {
    const rows = await listReviewsForTarget("song", slug);
    return NextResponse.json({ reviews: rows.map((row) => mapReviewRow(row)) });
  } catch (error) {
    if (isReviewTargetNotFound(error)) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    console.error("[song reviews GET]", error);
    return NextResponse.json(
      { error: "Could not load reviews." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request, context: RouteContext) {
  const auth = await requireUserApi();
  if (auth.error) return auth.error;

  const { slug } = await context.params;

  try {
    const body = await request.json();
    const parsed = reviewFormSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input." },
        { status: 400 },
      );
    }

    const row = await createReview(auth.userId, "song", slug, parsed.data);
    return NextResponse.json({ review: mapReviewRow(row) }, { status: 201 });
  } catch (error) {
    if (isReviewTargetNotFound(error)) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    if (isReviewConflict(error)) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    console.error("[song reviews POST]", error);
    return NextResponse.json(
      { error: "Could not create review." },
      { status: 500 },
    );
  }
}
