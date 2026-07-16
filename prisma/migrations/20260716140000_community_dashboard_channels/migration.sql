-- CreateEnum
CREATE TYPE "CommunityPostKind" AS ENUM ('POST', 'ANNOUNCEMENT');

-- AlterTable
ALTER TABLE "CommunityPost" ADD COLUMN "title" TEXT NOT NULL DEFAULT '';
ALTER TABLE "CommunityPost" ADD COLUMN "kind" "CommunityPostKind" NOT NULL DEFAULT 'POST';
ALTER TABLE "CommunityPost" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "CommunityPost" ALTER COLUMN "content" DROP NOT NULL;

UPDATE "CommunityPost" SET "title" = LEFT("content", 200) WHERE "title" = '' AND "content" IS NOT NULL;

-- CreateTable
CREATE TABLE "CommunityVoiceChannel" (
    "id" TEXT NOT NULL,
    "communityId" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "memberLimit" INTEGER NOT NULL DEFAULT 10,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CommunityVoiceChannel_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CommunityVoiceChannelMember" (
    "id" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommunityVoiceChannelMember_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CommunityWatchChannel" (
    "id" TEXT NOT NULL,
    "communityId" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "contentId" TEXT,
    "trackId" TEXT,
    "mediaTitle" TEXT,
    "imageUrl" TEXT,
    "memberLimit" INTEGER NOT NULL DEFAULT 20,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CommunityWatchChannel_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CommunityWatchChannelMember" (
    "id" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommunityWatchChannelMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CommunityPost_communityId_kind_idx" ON "CommunityPost"("communityId", "kind");
CREATE INDEX "CommunityVoiceChannel_communityId_idx" ON "CommunityVoiceChannel"("communityId");
CREATE UNIQUE INDEX "CommunityVoiceChannelMember_channelId_userId_key" ON "CommunityVoiceChannelMember"("channelId", "userId");
CREATE INDEX "CommunityVoiceChannelMember_channelId_idx" ON "CommunityVoiceChannelMember"("channelId");
CREATE INDEX "CommunityWatchChannel_communityId_idx" ON "CommunityWatchChannel"("communityId");
CREATE UNIQUE INDEX "CommunityWatchChannelMember_channelId_userId_key" ON "CommunityWatchChannelMember"("channelId", "userId");
CREATE INDEX "CommunityWatchChannelMember_channelId_idx" ON "CommunityWatchChannelMember"("channelId");

-- AddForeignKey
ALTER TABLE "CommunityVoiceChannel" ADD CONSTRAINT "CommunityVoiceChannel_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CommunityVoiceChannel" ADD CONSTRAINT "CommunityVoiceChannel_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CommunityVoiceChannelMember" ADD CONSTRAINT "CommunityVoiceChannelMember_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "CommunityVoiceChannel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CommunityVoiceChannelMember" ADD CONSTRAINT "CommunityVoiceChannelMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CommunityWatchChannel" ADD CONSTRAINT "CommunityWatchChannel_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CommunityWatchChannel" ADD CONSTRAINT "CommunityWatchChannel_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CommunityWatchChannel" ADD CONSTRAINT "CommunityWatchChannel_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "CommunityWatchChannel" ADD CONSTRAINT "CommunityWatchChannel_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "MusicTrack"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "CommunityWatchChannelMember" ADD CONSTRAINT "CommunityWatchChannelMember_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "CommunityWatchChannel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CommunityWatchChannelMember" ADD CONSTRAINT "CommunityWatchChannelMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
