import { NextResponse } from "next/server";
import { requireUserApi } from "@/lib/api-auth";
import { listConversationsForUser } from "@/lib/services/dm.service";

export async function GET() {
  const auth = await requireUserApi();
  if (auth.error) return auth.error;

  try {
    const conversations = await listConversationsForUser(auth.userId);
    return NextResponse.json({ conversations });
  } catch (error) {
    console.error("[dm conversations GET]", error);
    return NextResponse.json(
      { error: "Could not load conversations." },
      { status: 500 },
    );
  }
}
