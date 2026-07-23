-- AlterTable
ALTER TABLE "Community" ADD COLUMN "memberLimit" INTEGER;
ALTER TABLE "Community" ADD COLUMN "joinCodeLookup" TEXT;
ALTER TABLE "Community" ADD COLUMN "joinCodeHash" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Community_joinCodeLookup_key" ON "Community"("joinCodeLookup");
