import type { DefaultSession } from "next-auth";
import type { PlatformRole } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      handle: string;
      onboardingCompleted: boolean;
      role: PlatformRole;
    } & DefaultSession["user"];
  }

  interface User {
    handle: string;
    onboardingCompleted?: boolean;
    role: PlatformRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    handle?: string;
    onboardingCompleted?: boolean;
    role?: PlatformRole;
  }
}
