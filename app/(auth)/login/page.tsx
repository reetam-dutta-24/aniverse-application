import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/auth-card";
import { LoginForm } from "@/components/auth/login-form";
import { redirectAuthenticatedAway } from "@/lib/auth-guards";
import { isDiscordAuthEnabled, isGoogleAuthEnabled } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Sign In — AniVerse",
  description: "Sign in to continue your entertainment universe.",
};

export default async function LoginPage() {
  await redirectAuthenticatedAway();

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to continue your entertainment universe."
      sparkle
    >
      <LoginForm
        googleEnabled={isGoogleAuthEnabled()}
        discordEnabled={isDiscordAuthEnabled()}
      />
    </AuthCard>
  );
}
