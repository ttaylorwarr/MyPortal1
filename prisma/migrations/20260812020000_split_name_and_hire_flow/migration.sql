-- AlterTable: add the new name columns nullable first so existing rows can be backfilled
ALTER TABLE "User" ADD COLUMN "firstName" TEXT;
ALTER TABLE "User" ADD COLUMN "lastName" TEXT;

-- Data migration: split the existing single "name" on the first space
UPDATE "User"
SET
  "firstName" = split_part("name", ' ', 1),
  "lastName" = CASE
    WHEN position(' ' in "name") > 0 THEN substring("name" from position(' ' in "name") + 1)
    ELSE ''
  END
WHERE "firstName" IS NULL;

-- AlterTable: now safe to enforce required, and drop the old column
ALTER TABLE "User" ALTER COLUMN "firstName" SET NOT NULL;
ALTER TABLE "User" ALTER COLUMN "lastName" SET NOT NULL;
ALTER TABLE "User" DROP COLUMN "name";

-- AlterTable: passwordHash becomes optional - a hired account starts without one
-- until the new hire activates their account with their Safe-Code
ALTER TABLE "User" ALTER COLUMN "passwordHash" DROP NOT NULL;

-- AlterTable: new hire/payroll fields
ALTER TABLE "User" ADD COLUMN "hourlyPayRate" DOUBLE PRECISION;
ALTER TABLE "User" ADD COLUMN "safeCode" TEXT;
CREATE UNIQUE INDEX "User_safeCode_key" ON "User"("safeCode");
