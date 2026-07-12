import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Discord from "next-auth/providers/discord";

/**
 * NextAuth (Auth.js v5) configuration.
 *
 * The credentials provider currently authenticates a demo user so the UI
 * flow works end-to-end without a database. When the backend is ready:
 *  1. Add a DB adapter (e.g. @auth/prisma-adapter) below.
 *  2. Replace `authorize` with a real user lookup + password hash check.
 *  3. Set AUTH_GOOGLE_ID/SECRET and AUTH_DISCORD_ID/SECRET to enable OAuth.
 */

const providers: NextAuthConfig["providers"] = [
  Credentials({
    name: "Credentials",
    credentials: {
      identifier: { label: "Email or Username", type: "text" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      const identifier = credentials?.identifier as string | undefined;
      const password = credentials?.password as string | undefined;

      // TODO(backend): replace with real user lookup + hashed password check.
      if (!identifier || !password || password.length < 6) {
        return null;
      }

      const isEmail = identifier.includes("@");
      return {
        id: "demo-user",
        name: isEmail ? identifier.split("@")[0] : identifier,
        email: isEmail ? identifier : `${identifier}@aniverse.demo`,
      };
    },
  }),
];

// OAuth providers are only registered when their env vars exist, so the
// app builds and runs before OAuth apps are configured.
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
});
