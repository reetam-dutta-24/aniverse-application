"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Lock, Mail, User } from "lucide-react";
import { AuthInput } from "@/components/auth/auth-input";
import { SocialButtons } from "@/components/auth/social-buttons";
import { GradientButton } from "@/components/ui/gradient-button";

export function SignupForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = new FormData(e.currentTarget);
    const password = String(form.get("password") ?? "");
    const confirm = String(form.get("confirmPassword") ?? "");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setPending(true);

    // TODO(backend): call the registration API to create the user before
    // signing in. For now the demo credentials provider creates the session.
    const result = await signIn("credentials", {
      identifier: form.get("email"),
      password,
      redirect: false,
    });

    setPending(false);
    if (result?.error) {
      setError("Could not create your account. Please try again.");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
      <AuthInput
        icon={User}
        name="fullName"
        placeholder="Full Name"
        autoComplete="name"
        required
      />
      <AuthInput
        icon={User}
        name="username"
        placeholder="Username"
        autoComplete="username"
        required
      />
      <AuthInput
        icon={Mail}
        type="email"
        name="email"
        placeholder="Email Address"
        autoComplete="email"
        required
      />
      <AuthInput
        icon={Lock}
        type="password"
        name="password"
        placeholder="Password"
        autoComplete="new-password"
        required
      />
      <AuthInput
        icon={Lock}
        type="password"
        name="confirmPassword"
        placeholder="Confirm Password"
        autoComplete="new-password"
        required
      />

      <label className="flex cursor-pointer items-center gap-2 text-xs text-white">
        <input
          type="checkbox"
          name="terms"
          required
          className="size-3.5 cursor-pointer accent-brand-magenta"
        />
        <span>
          I agree to the{" "}
          <Link href="#" className="text-brand-magenta hover:text-brand-pink">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="#" className="text-brand-magenta hover:text-brand-pink">
            Privacy Policy
          </Link>
        </span>
      </label>

      {error ? <p className="text-xs text-red-400">{error}</p> : null}

      <GradientButton type="submit" size="md" disabled={pending} className="w-full">
        {pending ? "Creating Account..." : "Create Account"}
      </GradientButton>

      <SocialButtons />

      <p className="mt-1 text-center text-xs text-white">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-brand-magenta transition-colors hover:text-brand-pink"
        >
          Log In
        </Link>
      </p>
    </form>
  );
}
