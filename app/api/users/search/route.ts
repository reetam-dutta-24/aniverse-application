import { NextResponse } from "next/server";
import { searchUserProfiles } from "@/lib/services/user-profile.service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  const limit = Number(searchParams.get("limit") ?? "8");

  const profiles = await searchUserProfiles(
    q,
    Number.isFinite(limit) ? limit : 8,
  );

  return NextResponse.json({
    users: profiles.map((profile) => ({
      id: profile.id,
      handle: profile.handle,
      name: profile.name,
      portraitUrl: profile.portraitUrl,
      avatarColor: profile.avatarColor,
      followerCount: profile.followerCount,
    })),
  });
}
