-- CreateTable
CREATE TABLE "GrammarExplainUsage" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GrammarExplainUsage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GrammarExplainUsage_userId_periodStart_idx" ON "GrammarExplainUsage"("userId", "periodStart");

-- CreateIndex
CREATE UNIQUE INDEX "GrammarExplainUsage_userId_periodStart_key" ON "GrammarExplainUsage"("userId", "periodStart");

-- AddForeignKey
ALTER TABLE "GrammarExplainUsage" ADD CONSTRAINT "GrammarExplainUsage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
