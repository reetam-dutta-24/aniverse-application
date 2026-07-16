-- Community reviews, collection collaborators, direct messages
ALTER TABLE "Review" ADD COLUMN "communityId" TEXT;
CREATE INDEX "Review_communityId_idx" ON "Review"("communityId");
ALTER TABLE "Review" ADD CONSTRAINT "Review_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "CollectionCollaborator" (
    "id" TEXT NOT NULL,
    "collectionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'editor',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CollectionCollaborator_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "CollectionCollaborator_collectionId_userId_key" ON "CollectionCollaborator"("collectionId", "userId");
CREATE INDEX "CollectionCollaborator_collectionId_idx" ON "CollectionCollaborator"("collectionId");
CREATE INDEX "CollectionCollaborator_userId_idx" ON "CollectionCollaborator"("userId");
ALTER TABLE "CollectionCollaborator" ADD CONSTRAINT "CollectionCollaborator_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CollectionCollaborator" ADD CONSTRAINT "CollectionCollaborator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "DirectConversation" (
    "id" TEXT NOT NULL,
    "participantLowId" TEXT NOT NULL,
    "participantHighId" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DirectConversation_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "DirectConversation_participantLowId_participantHighId_key" ON "DirectConversation"("participantLowId", "participantHighId");
CREATE INDEX "DirectConversation_participantLowId_idx" ON "DirectConversation"("participantLowId");
CREATE INDEX "DirectConversation_participantHighId_idx" ON "DirectConversation"("participantHighId");
ALTER TABLE "DirectConversation" ADD CONSTRAINT "DirectConversation_participantLowId_fkey" FOREIGN KEY ("participantLowId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DirectConversation" ADD CONSTRAINT "DirectConversation_participantHighId_fkey" FOREIGN KEY ("participantHighId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "DirectMessage" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "warnNonFriend" BOOLEAN NOT NULL DEFAULT false,
    "editedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DirectMessage_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "DirectMessage_conversationId_idx" ON "DirectMessage"("conversationId");
CREATE INDEX "DirectMessage_senderId_idx" ON "DirectMessage"("senderId");
ALTER TABLE "DirectMessage" ADD CONSTRAINT "DirectMessage_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "DirectConversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DirectMessage" ADD CONSTRAINT "DirectMessage_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
