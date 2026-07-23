import { createHash, randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";

const BCRYPT_ROUNDS = 10;

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function normalizeJoinCode(raw: string): string {
  return raw.trim().toUpperCase().replace(/\s+/g, "");
}

export function generateJoinCode(): string {
  const bytes = randomBytes(6);
  let suffix = "";
  for (let i = 0; i < 6; i += 1) {
    suffix += CODE_ALPHABET[bytes[i]! % CODE_ALPHABET.length];
  }
  return `ROOM-${suffix}`;
}

export function joinCodeLookup(normalizedCode: string): string {
  return createHash("sha256").update(normalizedCode).digest("hex");
}

export async function hashJoinCode(normalizedCode: string): Promise<string> {
  return bcrypt.hash(normalizedCode, BCRYPT_ROUNDS);
}

export async function verifyJoinCode(
  normalizedCode: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(normalizedCode, hash);
}
