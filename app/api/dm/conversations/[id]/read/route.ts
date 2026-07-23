import { NextResponse } from "next/server";
import { requireUserApi } from "@/lib/api-auth";
import {
  DmForbiddenError,
  DmNotFoundError,
  markConversationRead,
} from "@/lib/services/dm.service";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(_request: Request, context: RouteContext) {
  const auth = await requireUserApi();
  if (auth.error) return auth.error;

  const { id } = await context.params;

  try {
    const result = await markConversationRead(auth.userId, id);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof DmNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    if (error instanceof DmForbiddenError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error("[dm conversation read POST]", error);
    return NextResponse.json(
      { error: "Could not mark conversation as read." },
      { status: 500 },
    );
  }
}
