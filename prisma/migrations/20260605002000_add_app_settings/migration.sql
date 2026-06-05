CREATE TABLE "AppSetting" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppSetting_pkey" PRIMARY KEY ("key")
);

INSERT INTO "AppSetting" ("key", "value", "updatedAt")
VALUES
  ('savedTranslationLimit', '10', CURRENT_TIMESTAMP),
  ('grammarDailyLimit', '10', CURRENT_TIMESTAMP)
ON CONFLICT ("key") DO NOTHING;

