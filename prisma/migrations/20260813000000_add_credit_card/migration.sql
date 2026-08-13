-- CreateEnum
CREATE TYPE "CardStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "CreditCard" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "CardStatus" NOT NULL DEFAULT 'PENDING',
    "cardNumber" TEXT,
    "pin" TEXT,
    "creditLimit" DOUBLE PRECISION,
    "isFrozen" BOOLEAN NOT NULL DEFAULT false,
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvedAt" TIMESTAMP(3),

    CONSTRAINT "CreditCard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CreditCard_userId_key" ON "CreditCard"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CreditCard_cardNumber_key" ON "CreditCard"("cardNumber");

-- AddForeignKey
ALTER TABLE "CreditCard" ADD CONSTRAINT "CreditCard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
