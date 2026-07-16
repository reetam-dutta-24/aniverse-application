import { NextResponse } from "next/server";
import { requireUserApi } from "@/lib/api-auth";
import { auth } from "@/lib/auth";
import { mapReviewRow } from "@/lib/mappers/user-profile.mapper";
import { mapReviewsForViewer } from "@/lib/services/review.service";
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
  const session = await auth();

  try {
    const rows = await listReviewsForTarget("community", slug);
    const reviews = await mapReviewsForViewer(rows, session?.user?.id);
    return NextResponse.json({ reviews });
  } catch (error) {
    if (isReviewTargetNotFound(error)) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    console.error("[community reviews GET]", error);
    return NextResponse.json(
      { error: "Could not load reviews." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request, context: RouteContext) {
  const authResult = await requireUserApi();
  if (authResult.error) return authResult.error;

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

    const row = await createReview(
      authResult.userId,
      "community",
      slug,
      parsed.data,
    );
    return NextResponse.json({ review: mapReviewRow(row) }, { status: 201 });
  } catch (error) {
    if (isReviewTargetNotFound(error)) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    if (isReviewConflict(error)) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    console.error("[community reviews POST]", error);
    return NextResponse.json(
      { error: "Could not create review." },
      { status: 500 },
    );
  }
}
