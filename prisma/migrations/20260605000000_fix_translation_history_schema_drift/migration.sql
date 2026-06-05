-- Align an older TranslationHistory table shape with the current Prisma schema.
-- Some databases had translationText/sourceLang/targetLang from an earlier draft
-- while the application now reads and writes translationVi.

ALTER TABLE "TranslationHistory"
ADD COLUMN IF NOT EXISTS "translationVi" TEXT;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'TranslationHistory'
      AND column_name = 'translationText'
  ) THEN
    EXECUTE 'UPDATE "TranslationHistory" SET "translationVi" = COALESCE("translationVi", "translationText") WHERE "translationVi" IS NULL';
  END IF;
END $$;

UPDATE "TranslationHistory"
SET "translationVi" = ''
WHERE "translationVi" IS NULL;

ALTER TABLE "TranslationHistory"
ALTER COLUMN "translationVi" SET NOT NULL;

ALTER TABLE "TranslationHistory" DROP COLUMN IF EXISTS "translationText";
ALTER TABLE "TranslationHistory" DROP COLUMN IF EXISTS "sourceLang";
ALTER TABLE "TranslationHistory" DROP COLUMN IF EXISTS "targetLang";
