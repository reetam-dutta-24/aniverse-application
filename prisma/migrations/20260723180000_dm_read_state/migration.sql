-- CreateTable
CREATE TABLE "DirectConversationRead" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lastReadAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DirectConversationRead_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DirectConversationRead_userId_idx" ON "DirectConversationRead"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "DirectConversationRead_conversationId_userId_key" ON "DirectConversationRead"("conversationId", "userId");

-- AddForeignKey
ALTER TABLE "DirectConversationRead" ADD CONSTRAINT "DirectConversationRead_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "DirectConversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DirectConversationRead" ADD CONSTRAINT "DirectConversationRead_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
