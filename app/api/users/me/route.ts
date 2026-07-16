import { NextResponse } from "next/server";
import { requireUserApi } from "@/lib/api-auth";
import {
  SettingsConflictError,
  updateUserProfile,
} from "@/lib/services/user-settings.service";
import { userProfileUpdateSchema } from "@/lib/validators/user-profile";

export async function PATCH(request: Request) {
  const auth = await requireUserApi();
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const parsed = userProfileUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input." },
        { status: 400 },
      );
    }

    const user = await updateUserProfile(auth.userId, parsed.data);
    return NextResponse.json({ user });
  } catch (error) {
    if (error instanceof SettingsConflictError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("[users/me PATCH]", error);
    return NextResponse.json(
      { error: "Could not update profile." },
      { status: 500 },
    );
  }
}
