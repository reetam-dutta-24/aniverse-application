import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/auth-card";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign In — AniVerse",
  description: "Sign in to continue your entertainment universe.",
};

export default function LoginPage() {
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
