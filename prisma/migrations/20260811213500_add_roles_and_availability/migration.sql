-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'MANAGER', 'MEMBER');

-- AlterTable
ALTER TABLE "Property" ADD COLUMN "isAvailable" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable: add the new role column alongside the old isAdmin column
ALTER TABLE "User" ADD COLUMN "role" "Role" NOT NULL DEFAULT 'MEMBER';

-- Data migration: carry existing admins over to the new role column
UPDATE "User" SET "role" = 'ADMIN' WHERE "isAdmin" = true;

-- AlterTable: now safe to drop the old column
ALTER TABLE "User" DROP COLUMN "isAdmin";
