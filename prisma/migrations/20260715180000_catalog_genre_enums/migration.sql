-- Add genre enums storage for music tracks and artists
ALTER TABLE "MusicTrack" ADD COLUMN IF NOT EXISTS "genres" JSONB NOT NULL DEFAULT '[]';
ALTER TABLE "Artist" ADD COLUMN IF NOT EXISTS "genres" JSONB NOT NULL DEFAULT '[]';
