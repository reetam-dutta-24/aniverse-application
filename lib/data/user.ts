import type { UserSummary } from "@/types";

/**
 * Mock data layer — current user.
 * TODO(backend): resolve from the NextAuth session + DB profile.
 */
export async function getCurrentUser(): Promise<UserSummary> {
  return {
    id: "user-1",
    name: "Reetam Dutta",
    avatarColor: "#ff00cc",
  };
}
