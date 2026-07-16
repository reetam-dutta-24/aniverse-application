CREATE TABLE IF NOT EXISTS "CollectionFavorite" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "collectionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CollectionFavorite_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "ContentFavorite" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ContentFavorite_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "CollectionFavorite_userId_collectionId_key" ON "CollectionFavorite"("userId", "collectionId");
CREATE INDEX IF NOT EXISTS "CollectionFavorite_userId_idx" ON "CollectionFavorite"("userId");
CREATE INDEX IF NOT EXISTS "CollectionFavorite_collectionId_idx" ON "CollectionFavorite"("collectionId");

CREATE UNIQUE INDEX IF NOT EXISTS "ContentFavorite_userId_contentId_key" ON "ContentFavorite"("userId", "contentId");
CREATE INDEX IF NOT EXISTS "ContentFavorite_userId_idx" ON "ContentFavorite"("userId");
CREATE INDEX IF NOT EXISTS "ContentFavorite_contentId_idx" ON "ContentFavorite"("contentId");

DO $$ BEGIN
  ALTER TABLE "CollectionFavorite" ADD CONSTRAINT "CollectionFavorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "CollectionFavorite" ADD CONSTRAINT "CollectionFavorite_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "ContentFavorite" ADD CONSTRAINT "ContentFavorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "ContentFavorite" ADD CONSTRAINT "ContentFavorite_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
