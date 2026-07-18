-- Track favorites for song detail pages
CREATE TABLE "TrackFavorite" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrackFavorite_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "TrackFavorite_userId_trackId_key" ON "TrackFavorite"("userId", "trackId");
CREATE INDEX "TrackFavorite_userId_idx" ON "TrackFavorite"("userId");
CREATE INDEX "TrackFavorite_trackId_idx" ON "TrackFavorite"("trackId");

ALTER TABLE "TrackFavorite" ADD CONSTRAINT "TrackFavorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TrackFavorite" ADD CONSTRAINT "TrackFavorite_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "MusicTrack"("id") ON DELETE CASCADE ON UPDATE CASCADE;
