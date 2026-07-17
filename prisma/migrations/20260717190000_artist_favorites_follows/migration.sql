-- CreateTable
CREATE TABLE "ArtistFavorite" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ArtistFavorite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArtistFollow" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ArtistFollow_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ArtistFavorite_userId_idx" ON "ArtistFavorite"("userId");

-- CreateIndex
CREATE INDEX "ArtistFavorite_artistId_idx" ON "ArtistFavorite"("artistId");

-- CreateIndex
CREATE UNIQUE INDEX "ArtistFavorite_userId_artistId_key" ON "ArtistFavorite"("userId", "artistId");

-- CreateIndex
CREATE INDEX "ArtistFollow_userId_idx" ON "ArtistFollow"("userId");

-- CreateIndex
CREATE INDEX "ArtistFollow_artistId_idx" ON "ArtistFollow"("artistId");

-- CreateIndex
CREATE UNIQUE INDEX "ArtistFollow_userId_artistId_key" ON "ArtistFollow"("userId", "artistId");

-- AddForeignKey
ALTER TABLE "ArtistFavorite" ADD CONSTRAINT "ArtistFavorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtistFavorite" ADD CONSTRAINT "ArtistFavorite_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtistFollow" ADD CONSTRAINT "ArtistFollow_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtistFollow" ADD CONSTRAINT "ArtistFollow_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;
