import { NextResponse } from "next/server";
import { requireUserApi } from "@/lib/api-auth";
import { deleteUserAccount } from "@/lib/services/user-settings.service";

export async function DELETE() {
  const auth = await requireUserApi();
  if (auth.error) return auth.error;

  try {
    await deleteUserAccount(auth.userId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[users/me DELETE]", error);
    return NextResponse.json(
      { error: "Could not delete account." },
      { status: 500 },
    );
  }
}
