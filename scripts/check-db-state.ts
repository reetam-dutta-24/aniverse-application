import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const [content, collections, users, deathNote] = await Promise.all([
    prisma.content.count(),
    prisma.collection.count(),
    prisma.user.count(),
    prisma.content.findMany({
      where: { title: { contains: "Death", mode: "insensitive" } },
      select: { id: true, slug: true, title: true, createdAt: true, updatedAt: true },
    }),
  ]);
  console.log(JSON.stringify({ content, collections, users, deathNote }, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
