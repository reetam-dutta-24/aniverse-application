import { NextResponse } from "next/server";
import {
  AuthConflictError,
  createUser,
} from "@/lib/services/user.service";
import { registerSchema } from "@/lib/validators/auth";

/**
 * POST /api/auth/register
 *
 * Industry pattern: registration is a separate API route from login.
 * 1. Validate input with Zod
 * 2. Hash password and save user to PostgreSQL
 * 3. Client then calls signIn() to create the session
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      const message =
        parsed.error.issues[0]?.message ?? "Invalid registration data.";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const user = await createUser(parsed.data);

    return NextResponse.json(
      {
        message: "Account created successfully.",
        user: {
          id: user.id,
          email: user.email,
          handle: user.handle,
          name: user.name,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof AuthConflictError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }

    console.error("[register]", error);
    return NextResponse.json(
      { error: "Could not create account. Please try again." },
      { status: 500 },
    );
  }
}
