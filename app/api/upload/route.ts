import { NextResponse } from "next/server";
import { requireUserApi } from "@/lib/api-auth";
import {
  saveUploadedImage,
  UploadValidationError,
} from "@/lib/services/upload.service";

export async function POST(request: Request) {
  const auth = await requireUserApi();
  if (auth.error) return auth.error;

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No image file provided." }, { status: 400 });
    }

    const url = await saveUploadedImage(file, auth.userId);
    return NextResponse.json({ url });
  } catch (error) {
    if (error instanceof UploadValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.error("[upload POST]", error);
    return NextResponse.json({ error: "Could not upload image." }, { status: 500 });
  }
}
