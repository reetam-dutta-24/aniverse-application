import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/auth-card";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = {
  title: "Sign Up — AniVerse",
  description: "Start building your personalized entertainment universe.",
};

export default function SignupPage() {
  return (
    <AuthCard
      title="Create your account"
      subtitle="Start building your personalized entertainment universe."
    >
      <SignupForm />
    </AuthCard>
  );
}
