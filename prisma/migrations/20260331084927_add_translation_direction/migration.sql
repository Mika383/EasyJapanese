-- CreateEnum
CREATE TYPE "LanguageCode" AS ENUM ('JA', 'VI');

-- AlterTable (add new columns first)
ALTER TABLE "TranslationHistory"
ADD COLUMN "translationText" TEXT,
ADD COLUMN "sourceLang" "LanguageCode" NOT NULL DEFAULT 'JA',
ADD COLUMN "targetLang" "LanguageCode" NOT NULL DEFAULT 'VI';

-- Backfill from old column
UPDATE "TranslationHistory"
SET "translationText" = "translationVi"
WHERE "translationText" IS NULL;

-- Make required
ALTER TABLE "TranslationHistory"
ALTER COLUMN "translationText" SET NOT NULL;

-- Drop old column
ALTER TABLE "TranslationHistory"
DROP COLUMN "translationVi";
