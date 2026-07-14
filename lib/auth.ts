import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Discord from "next-auth/providers/discord";
import {
  findUserForLogin,
  verifyPassword,
} from "@/lib/services/user.service";
import { loginSchema } from "@/lib/validators/auth";

const providers: NextAuthConfig["providers"] = [
  Credentials({
    name: "Credentials",
    credentials: {
      identifier: { label: "Email or Username", type: "text" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      const parsed = loginSchema.safeParse(credentials);
      if (!parsed.success) return null;

      const { identifier, password } = parsed.data;
      const user = await findUserForLogin(identifier);
      if (!user) return null;

      const valid = await verifyPassword(password, user.passwordHash);
      if (!valid) return null;

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        handle: user.handle,
        image: user.avatarUrl ?? undefined,
        onboardingCompleted: !!user.onboardingCompletedAt,
        role: user.role,
      };
    },
  }),
];

if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
  providers.push(Google);
}
if (process.env.AUTH_DISCORD_ID && process.env.AUTH_DISCORD_SECRET) {
  providers.push(Discord);
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers,
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  trustHost: true,
  callbacks: {
    /**
     * JWT callback — runs when a user signs in.
     * We copy the database user id into the token so every request
     * knows who is logged in without hitting the DB on every call.
     */
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.handle = user.handle;
        token.onboardingCompleted = user.onboardingCompleted ?? false;
        token.role = user.role;
      }

      // Client calls session.update() after onboarding completes
      if (trigger === "update" && session?.onboardingCompleted === true) {
        token.onboardingCompleted = true;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.handle = token.handle as string;
        session.user.onboardingCompleted = token.onboardingCompleted === true;
        session.user.role = (token.role as import("@prisma/client").PlatformRole) ?? "USER";
      }
      return session;
    },
  },
});
