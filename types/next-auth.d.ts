import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      handle: string;
      onboardingCompleted: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    handle: string;
    onboardingCompleted?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    handle?: string;
    onboardingCompleted?: boolean;
  }
}
