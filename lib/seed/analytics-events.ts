import { prisma } from "@/lib/prisma";

const WATCH_SEED = [
  { slug: "jujutsu-kaisen", monthlyMinutes: [14, 16, 11, 17, 22, 19, 14, 16, 18, 15, 13, 14] },
  { slug: "attack-on-titan", monthlyMinutes: [10, 12, 9, 13, 16, 14, 10, 12, 13, 11, 9, 10] },
  { slug: "death-note", monthlyMinutes: [8, 9, 7, 10, 12, 11, 8, 9, 10, 8, 7, 8] },
  { slug: "demon-slayer", monthlyMinutes: [6, 7, 5, 8, 10, 9, 6, 7, 8, 7, 6, 6] },
  { slug: "vinland-saga", monthlyMinutes: [5, 6, 4, 7, 8, 7, 5, 6, 7, 6, 5, 5] },
  { slug: "spy-x-family", monthlyMinutes: [4, 5, 3, 6, 7, 6, 4, 5, 6, 5, 4, 4] },
] as const;

const LISTEN_SEED = [
  { slug: "gurenge", monthlyMinutes: [10, 12, 14, 11, 15, 16, 12, 14, 15, 13, 12, 14] },
  { slug: "idol", monthlyMinutes: [8, 9, 11, 10, 12, 13, 9, 11, 12, 10, 9, 11] },
  { slug: "kaikai-kitan", monthlyMinutes: [7, 8, 9, 8, 10, 11, 8, 9, 10, 8, 7, 9] },
  { slug: "kick-back", monthlyMinutes: [6, 7, 8, 7, 9, 10, 7, 8, 9, 7, 6, 8] },
] as const;

function eventDate(monthOffset: number, day: number, hour: number): Date {
  const date = new Date();
  date.setMonth(date.getMonth() - monthOffset, day);
  date.setHours(hour, 30, 0, 0);
  return date;
}

export async function seedAnalyticsEventsForUser(
  userId: string,
  contentSlugToId: Map<string, string>,
  trackSlugToId: Map<string, string>,
) {
  await prisma.watchEvent.deleteMany({ where: { userId } });
  await prisma.listenEvent.deleteMany({ where: { userId } });

    for (const entry of WATCH_SEED) {
    const contentId = contentSlugToId.get(entry.slug);
    if (!contentId) continue;

    for (let monthOffset = 0; monthOffset < entry.monthlyMinutes.length; monthOffset += 1) {
      const minutes = entry.monthlyMinutes[monthOffset];
      if (minutes <= 0) continue;
      await prisma.watchEvent.create({
        data: {
          userId,
          contentId,
          minutes,
          watchedAt: eventDate(monthOffset, 4 + (monthOffset % 20), 19 + (monthOffset % 3)),
        },
      });
    }
  }

  for (const entry of LISTEN_SEED) {
    const trackId = trackSlugToId.get(entry.slug);
    if (!trackId) continue;

    for (let monthOffset = 0; monthOffset < entry.monthlyMinutes.length; monthOffset += 1) {
      const minutes = entry.monthlyMinutes[monthOffset];
      if (minutes <= 0) continue;
      await prisma.listenEvent.create({
        data: {
          userId,
          trackId,
          minutes,
          listenedAt: eventDate(monthOffset, 8 + (monthOffset % 15), 21 + (monthOffset % 2)),
        },
      });
    }
  }

  // Recent streak events for the demo user.
  for (let day = 0; day < 24; day += 1) {
    const contentId = contentSlugToId.get("jujutsu-kaisen");
    if (!contentId) break;
    await prisma.watchEvent.create({
      data: {
        userId,
        contentId,
        minutes: 28 + (day % 5) * 4,
        watchedAt: eventDate(0, Math.max(1, 28 - day), 20),
      },
    });
  }
}
