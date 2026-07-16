DO $$ BEGIN
  CREATE TYPE "CommunityChatChannel" AS ENUM ('GENERAL', 'ANIME');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "CommunityChatMessage" (
    "id" TEXT NOT NULL,
    "communityId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "channel" "CommunityChatChannel" NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CommunityChatMessage_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "CommunityChatMessage_communityId_channel_createdAt_idx"
  ON "CommunityChatMessage"("communityId", "channel", "createdAt");

DO $$ BEGIN
  ALTER TABLE "CommunityChatMessage" ADD CONSTRAINT "CommunityChatMessage_communityId_fkey"
    FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "CommunityChatMessage" ADD CONSTRAINT "CommunityChatMessage_authorId_fkey"
    FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
