import { NextResponse } from "next/server";
import { requireUserApi } from "@/lib/api-auth";
import {
  SettingsConflictError,
  updateUserPassword,
} from "@/lib/services/user-settings.service";
import { userPasswordUpdateSchema } from "@/lib/validators/user-profile";

export async function PATCH(request: Request) {
  const auth = await requireUserApi();
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const parsed = userPasswordUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input." },
        { status: 400 },
      );
    }

    await updateUserPassword(auth.userId, parsed.data);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof SettingsConflictError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("[users/me/password PATCH]", error);
    return NextResponse.json(
      { error: "Could not update password." },
      { status: 500 },
    );
  }
}
