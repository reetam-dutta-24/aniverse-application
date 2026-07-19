-- AlterTable
ALTER TABLE "Content" ADD COLUMN "viewCount" INTEGER NOT NULL DEFAULT 0;

-- Backfill from existing watch events
UPDATE "Content" AS c
SET "viewCount" = (
  SELECT COUNT(*)::INTEGER FROM "WatchEvent" AS w WHERE w."contentId" = c."id"
);
