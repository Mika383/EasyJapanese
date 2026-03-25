-- CreateEnum
CREATE TYPE "ReactionType" AS ENUM ('LIKE', 'DISLIKE');

-- AlterTable
ALTER TABLE "GrammarNote" ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "shareCode" TEXT,
ADD COLUMN     "sharedAt" TIMESTAMP(3),
ADD COLUMN     "title" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "GrammarReaction" (
    "id" TEXT NOT NULL,
    "grammarId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "ReactionType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "GrammarReaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GrammarSave" (
    "id" TEXT NOT NULL,
    "grammarId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "GrammarSave_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GrammarReaction_userId_type_idx" ON "GrammarReaction"("userId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "GrammarReaction_grammarId_userId_key" ON "GrammarReaction"("grammarId", "userId");

-- CreateIndex
CREATE INDEX "GrammarSave_userId_idx" ON "GrammarSave"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "GrammarSave_grammarId_userId_key" ON "GrammarSave"("grammarId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "GrammarNote_shareCode_key" ON "GrammarNote"("shareCode");

-- AddForeignKey
ALTER TABLE "GrammarReaction" ADD CONSTRAINT "GrammarReaction_grammarId_fkey" FOREIGN KEY ("grammarId") REFERENCES "GrammarNote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GrammarReaction" ADD CONSTRAINT "GrammarReaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GrammarSave" ADD CONSTRAINT "GrammarSave_grammarId_fkey" FOREIGN KEY ("grammarId") REFERENCES "GrammarNote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GrammarSave" ADD CONSTRAINT "GrammarSave_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
