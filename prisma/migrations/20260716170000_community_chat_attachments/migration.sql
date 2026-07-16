DO $$ BEGIN
  CREATE TYPE "CommunityChatAttachmentKind" AS ENUM ('IMAGE', 'FILE');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE "CommunityChatMessage" ADD COLUMN IF NOT EXISTS "attachmentUrl" TEXT;
ALTER TABLE "CommunityChatMessage" ADD COLUMN IF NOT EXISTS "attachmentName" TEXT;
ALTER TABLE "CommunityChatMessage" ADD COLUMN IF NOT EXISTS "attachmentKind" "CommunityChatAttachmentKind";
