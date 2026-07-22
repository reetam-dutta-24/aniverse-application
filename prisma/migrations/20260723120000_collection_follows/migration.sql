-- AlterTable
ALTER TABLE "Collection" ADD COLUMN "followerCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "CollectionFollow" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "collectionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CollectionFollow_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CollectionFollow_userId_idx" ON "CollectionFollow"("userId");

-- CreateIndex
CREATE INDEX "CollectionFollow_collectionId_idx" ON "CollectionFollow"("collectionId");

-- CreateIndex
CREATE UNIQUE INDEX "CollectionFollow_userId_collectionId_key" ON "CollectionFollow"("userId", "collectionId");

-- AddForeignKey
ALTER TABLE "CollectionFollow" ADD CONSTRAINT "CollectionFollow_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionFollow" ADD CONSTRAINT "CollectionFollow_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
