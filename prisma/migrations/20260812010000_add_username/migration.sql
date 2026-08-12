-- AlterTable: add the column nullable first so existing rows can be backfilled
ALTER TABLE "User" ADD COLUMN "username" TEXT;

-- Data migration: derive a username for existing accounts from their email,
-- suffixed with part of their id to guarantee uniqueness with zero collisions.
UPDATE "User"
SET "username" = lower(regexp_replace(split_part("email", '@', 1), '[^a-zA-Z0-9_]', '', 'g')) || '_' || right("id", 6)
WHERE "username" IS NULL;

-- AlterTable: now safe to enforce required + unique
ALTER TABLE "User" ALTER COLUMN "username" SET NOT NULL;
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
