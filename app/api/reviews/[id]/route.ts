import { NextResponse } from "next/server";
import { requireUserApi } from "@/lib/api-auth";
import { mapReviewRow } from "@/lib/mappers/user-profile.mapper";
import {
  deleteReview,
  isReviewForbidden,
  isReviewNotFound,
  updateReview,
} from "@/lib/services/review.service";
import { reviewUpdateSchema } from "@/lib/validators/review";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, context: RouteContext) {
  const auth = await requireUserApi();
  if (auth.error) return auth.error;

  const { id } = await context.params;

  try {
    const body = await request.json();
    const parsed = reviewUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input." },
        { status: 400 },
      );
    }

    if (
      parsed.data.rating === undefined &&
      parsed.data.headline === undefined &&
      parsed.data.body === undefined
    ) {
      return NextResponse.json(
        { error: "Nothing to update." },
        { status: 400 },
      );
    }

    const row = await updateReview(auth.userId, id, parsed.data);
    return NextResponse.json({ review: mapReviewRow(row) });
  } catch (error) {
    if (isReviewNotFound(error)) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    if (isReviewForbidden(error)) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error("[reviews PATCH]", error);
    return NextResponse.json(
      { error: "Could not update review." },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const auth = await requireUserApi();
  if (auth.error) return auth.error;

  const { id } = await context.params;

  try {
    await deleteReview(auth.userId, id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (isReviewNotFound(error)) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    if (isReviewForbidden(error)) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error("[reviews DELETE]", error);
    return NextResponse.json(
      { error: "Could not delete review." },
      { status: 500 },
    );
  }
}
