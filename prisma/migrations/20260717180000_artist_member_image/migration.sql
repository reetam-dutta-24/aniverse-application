-- Band member portrait images for group artist detail pages
ALTER TABLE "ArtistMember" ADD COLUMN IF NOT EXISTS "imageUrl" TEXT;
