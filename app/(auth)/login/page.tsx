import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/auth-card";
import { LoginForm } from "@/components/auth/login-form";
import { redirectAuthenticatedAway } from "@/lib/auth-guards";

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
      <LoginForm />
    </AuthCard>
  );
}
