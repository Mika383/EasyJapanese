-- CreateTable
CREATE TABLE "TranslationHistory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sourceText" TEXT NOT NULL,
    "kanaReading" TEXT,
    "romaji" TEXT,
    "translationVi" TEXT NOT NULL,
    "grammarJson" JSONB,
    "ocrText" TEXT,
    "notes" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TranslationHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TranslationHistory_userId_createdAt_idx" ON "TranslationHistory"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "TranslationHistory" ADD CONSTRAINT "TranslationHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
