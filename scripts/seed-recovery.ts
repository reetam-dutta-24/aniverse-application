import { PrismaClient } from "@prisma/client";
import { runRecoverySeed } from "../lib/seed/recovery-seed";

const prisma = new PrismaClient();

runRecoverySeed(prisma)
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
