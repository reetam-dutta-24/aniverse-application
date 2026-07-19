-- AlterTable
ALTER TABLE "Content" ADD COLUMN IF NOT EXISTS "videoUrl" TEXT;

-- AlterTable
ALTER TABLE "ContentEpisode" ADD COLUMN IF NOT EXISTS "videoUrl" TEXT;
