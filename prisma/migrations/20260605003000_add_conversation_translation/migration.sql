CREATE TABLE "ConversationTranslationHistory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "direction" TEXT NOT NULL DEFAULT 'JP_TO_VI',
    "title" TEXT,
    "participantsJson" JSONB NOT NULL,
    "linesJson" JSONB NOT NULL,
    "resultJson" JSONB NOT NULL,
    "jlptLevel" TEXT,
    "translationStyle" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConversationTranslationHistory_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ConversationTranslationHistory_userId_createdAt_idx"
ON "ConversationTranslationHistory"("userId", "createdAt");

ALTER TABLE "ConversationTranslationHistory"
ADD CONSTRAINT "ConversationTranslationHistory_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

INSERT INTO "AppSetting" ("key", "value", "updatedAt")
VALUES ('maxConversationParticipants', '5', CURRENT_TIMESTAMP)
ON CONFLICT ("key") DO NOTHING;

