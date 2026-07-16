import { NextResponse } from "next/server";
import { requireUserApi } from "@/lib/api-auth";
import {
  clearUserWatchHistory,
  getSettingsForUser,
  updateUserSettings,
} from "@/lib/services/user-settings.service";
import { userSettingsUpdateSchema } from "@/lib/validators/user-profile";

export async function GET() {
  const auth = await requireUserApi();
  if (auth.error) return auth.error;

  try {
    const settings = await getSettingsForUser(auth.userId);
    return NextResponse.json({ settings });
  } catch (error) {
    console.error("[users/me/settings GET]", error);
    return NextResponse.json(
      { error: "Could not load settings." },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  const auth = await requireUserApi();
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const parsed = userSettingsUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input." },
        { status: 400 },
      );
    }

    const settings = await updateUserSettings(auth.userId, parsed.data);
    return NextResponse.json({ settings });
  } catch (error) {
    console.error("[users/me/settings PATCH]", error);
    return NextResponse.json(
      { error: "Could not save settings." },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  const auth = await requireUserApi();
  if (auth.error) return auth.error;

  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  try {
    if (action === "watch-history") {
      await clearUserWatchHistory(auth.userId);
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  } catch (error) {
    console.error("[users/me/settings DELETE]", error);
    return NextResponse.json(
      { error: "Could not complete deletion." },
      { status: 500 },
    );
  }
}
