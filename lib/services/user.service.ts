import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import type { RegisterInput } from "@/lib/validators/auth";

const BCRYPT_ROUNDS = 12;

/** Turn a username into a unique public handle slug. */
export function normalizeHandle(username: string): string {
  return username
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "")
    .slice(0, 30);
}

const AVATAR_COLORS = [
  "#ff00cc",
  "#ae00ff",
  "#2563eb",
  "#00e5ff",
  "#00ff8c",
  "#ffd000",
] as const;

function pickAvatarColor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export class AuthConflictError extends Error {
  field: "email" | "username";

  constructor(field: "email" | "username") {
    super(
      field === "email"
        ? "An account with this email already exists."
        : "This username is already taken.",
    );
    this.field = field;
    this.name = "AuthConflictError";
  }
}

/** Create a new user with hashed password and default preferences. */
export async function createUser(input: RegisterInput) {
  const handle = normalizeHandle(input.username);
  const email = input.email.toLowerCase();

  const [emailTaken, handleTaken] = await Promise.all([
    prisma.user.findUnique({ where: { email }, select: { id: true } }),
    prisma.user.findUnique({ where: { handle }, select: { id: true } }),
  ]);

  if (emailTaken) throw new AuthConflictError("email");
  if (handleTaken) throw new AuthConflictError("username");

  const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS);

  return prisma.user.create({
    data: {
      email,
      handle,
      name: input.fullName.trim(),
      passwordHash,
      avatarColor: pickAvatarColor(email),
      preferences: {
        create: {},
      },
    },
    select: {
      id: true,
      email: true,
      handle: true,
      name: true,
      avatarColor: true,
      createdAt: true,
    },
  });
}

/** Find a user by email or handle for login. */
export async function findUserForLogin(identifier: string) {
  const normalized = identifier.trim().toLowerCase();
  const isEmail = normalized.includes("@");

  return prisma.user.findFirst({
    where: isEmail ? { email: normalized } : { handle: normalizeHandle(identifier) },
    select: {
      id: true,
      email: true,
      handle: true,
      name: true,
      passwordHash: true,
      avatarColor: true,
      avatarUrl: true,
      onboardingCompletedAt: true,
      role: true,
    },
  });
}

/** Verify a plain password against the stored bcrypt hash. */
export async function verifyPassword(
  plain: string,
  hash: string | null | undefined,
): Promise<boolean> {
  if (!hash) return false;
  return bcrypt.compare(plain, hash);
}

/** Load the logged-in user for dashboard layouts and pages. */
export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      handle: true,
      email: true,
      avatarColor: true,
      avatarUrl: true,
      aiTasteScore: true,
      onboardingCompletedAt: true,
      role: true,
      createdAt: true,
    },
  });
}
