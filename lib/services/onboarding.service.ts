import { prisma } from "@/lib/prisma";

/** Where to send a user right after they authenticate. */
export async function getPostAuthPath(userId: string): Promise<string> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { onboardingCompletedAt: true },
  });

  return user?.onboardingCompletedAt ? "/dashboard" : "/onboarding";
}

/** Mark onboarding finished so returning logins skip straight to dashboard. */
export async function completeOnboarding(userId: string, tasteScore?: number) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      onboardingCompletedAt: new Date(),
      ...(tasteScore != null ? { aiTasteScore: tasteScore } : {}),
    },
  });
}
