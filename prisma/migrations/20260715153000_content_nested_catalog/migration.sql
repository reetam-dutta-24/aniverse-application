-- Nested content catalog + catalog reviews + track featured rank

CREATE TABLE IF NOT EXISTS "ContentSeason" (
    "id" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "episodeCount" INTEGER NOT NULL DEFAULT 0,
    "position" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "ContentSeason_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "ContentSeason_contentId_idx" ON "ContentSeason"("contentId");
DO $$ BEGIN
  ALTER TABLE "ContentSeason" ADD CONSTRAINT "ContentSeason_contentId_fkey"
    FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "ContentEpisode" (
    "id" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "seasonId" TEXT,
    "seasonNumber" INTEGER NOT NULL DEFAULT 1,
    "number" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "duration" TEXT,
    "description" TEXT,
    "thumbnailUrl" TEXT,
    "releaseDate" TEXT,
    "language" TEXT,
    "rating" DOUBLE PRECISION,
    "position" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "ContentEpisode_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "ContentEpisode_contentId_idx" ON "ContentEpisode"("contentId");
CREATE INDEX IF NOT EXISTS "ContentEpisode_seasonId_idx" ON "ContentEpisode"("seasonId");
DO $$ BEGIN
  ALTER TABLE "ContentEpisode" ADD CONSTRAINT "ContentEpisode_contentId_fkey"
    FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  ALTER TABLE "ContentEpisode" ADD CONSTRAINT "ContentEpisode_seasonId_fkey"
    FOREIGN KEY ("seasonId") REFERENCES "ContentSeason"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "ContentCharacter" (
    "id" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT,
    "voiceActor" TEXT,
    "imageUrl" TEXT,
    "accent" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "ContentCharacter_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "ContentCharacter_contentId_idx" ON "ContentCharacter"("contentId");
DO $$ BEGIN
  ALTER TABLE "ContentCharacter" ADD CONSTRAINT "ContentCharacter_contentId_fkey"
    FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "ContentFeaturedTrack" (
    "contentId" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "ContentFeaturedTrack_pkey" PRIMARY KEY ("contentId","trackId")
);
CREATE INDEX IF NOT EXISTS "ContentFeaturedTrack_contentId_idx" ON "ContentFeaturedTrack"("contentId");
DO $$ BEGIN
  ALTER TABLE "ContentFeaturedTrack" ADD CONSTRAINT "ContentFeaturedTrack_contentId_fkey"
    FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  ALTER TABLE "ContentFeaturedTrack" ADD CONSTRAINT "ContentFeaturedTrack_trackId_fkey"
    FOREIGN KEY ("trackId") REFERENCES "MusicTrack"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "ContentRelated" (
    "contentId" TEXT NOT NULL,
    "relatedId" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "ContentRelated_pkey" PRIMARY KEY ("contentId","relatedId")
);
CREATE INDEX IF NOT EXISTS "ContentRelated_contentId_idx" ON "ContentRelated"("contentId");
DO $$ BEGIN
  ALTER TABLE "ContentRelated" ADD CONSTRAINT "ContentRelated_contentId_fkey"
    FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  ALTER TABLE "ContentRelated" ADD CONSTRAINT "ContentRelated_relatedId_fkey"
    FOREIGN KEY ("relatedId") REFERENCES "Content"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "CatalogReview" (
    "id" TEXT NOT NULL,
    "contentId" TEXT,
    "trackId" TEXT,
    "artistId" TEXT,
    "authorName" TEXT NOT NULL,
    "authorAvatarColor" TEXT DEFAULT '#ff00cc',
    "rating" DOUBLE PRECISION NOT NULL,
    "headline" TEXT,
    "body" TEXT NOT NULL,
    "accent" TEXT,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CatalogReview_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "CatalogReview_contentId_idx" ON "CatalogReview"("contentId");
CREATE INDEX IF NOT EXISTS "CatalogReview_trackId_idx" ON "CatalogReview"("trackId");
CREATE INDEX IF NOT EXISTS "CatalogReview_artistId_idx" ON "CatalogReview"("artistId");
DO $$ BEGIN
  ALTER TABLE "CatalogReview" ADD CONSTRAINT "CatalogReview_contentId_fkey"
    FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  ALTER TABLE "CatalogReview" ADD CONSTRAINT "CatalogReview_trackId_fkey"
    FOREIGN KEY ("trackId") REFERENCES "MusicTrack"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  ALTER TABLE "CatalogReview" ADD CONSTRAINT "CatalogReview_artistId_fkey"
    FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE "MusicTrack" ADD COLUMN IF NOT EXISTS "featuredRank" INTEGER;
