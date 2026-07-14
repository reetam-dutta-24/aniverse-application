import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type {
  OnboardingGoalLink,
  OnboardingSelection,
  TasteBreakdownItem,
} from "@/lib/data/onboarding";

/** Where to send a user right after they authenticate. */
export async function getPostAuthPath(userId: string): Promise<string> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { onboardingCompletedAt: true },
  });

  return user?.onboardingCompletedAt ? "/dashboard" : "/onboarding";
}

export interface TasteProfilePayload {
  tasteScore: number;
  selection: OnboardingSelection;
  summaryChips: string[];
  tasteBreakdown: TasteBreakdownItem[];
  goalLinks: OnboardingGoalLink[];
}

/** Mark onboarding finished so returning logins skip straight to dashboard. */
export async function completeOnboarding(
  userId: string,
  tasteScore?: number,
  tasteProfile?: TasteProfilePayload,
) {
  const userUpdate = prisma.user.update({
    where: { id: userId },
    data: {
      onboardingCompletedAt: new Date(),
      ...(tasteScore != null ? { aiTasteScore: tasteScore } : {}),
    },
  });

  if (!tasteProfile) {
    return userUpdate;
  }

  const profileUpdate = prisma.tasteProfile.upsert({
    where: { userId },
    create: {
      userId,
      tasteScore: tasteProfile.tasteScore,
      selections: tasteProfile.selection as unknown as Prisma.InputJsonValue,
      summaryChips: tasteProfile.summaryChips as unknown as Prisma.InputJsonValue,
      tasteBreakdown: tasteProfile.tasteBreakdown as unknown as Prisma.InputJsonValue,
      goalLinks: tasteProfile.goalLinks as unknown as Prisma.InputJsonValue,
    },
    update: {
      tasteScore: tasteProfile.tasteScore,
      selections: tasteProfile.selection as unknown as Prisma.InputJsonValue,
      summaryChips: tasteProfile.summaryChips as unknown as Prisma.InputJsonValue,
      tasteBreakdown: tasteProfile.tasteBreakdown as unknown as Prisma.InputJsonValue,
      goalLinks: tasteProfile.goalLinks as unknown as Prisma.InputJsonValue,
      completedAt: new Date(),
    },
  });

  return prisma.$transaction([userUpdate, profileUpdate]);
}

/** Load saved taste-test answers for retake / dashboard display. */
export async function getTasteProfileForUser(userId: string) {
  return prisma.tasteProfile.findUnique({
    where: { userId },
  });
}
