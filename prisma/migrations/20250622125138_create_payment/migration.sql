/*
  Warnings:

  - The values [THREE_MONTHS,SIX_MONTHS] on the enum `DurationDays` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('BANK_TRANSFER');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PROCESSING', 'PAID', 'FAILED', 'CANCELLED', 'EXPIRED', 'REFUNDED');

-- AlterEnum
BEGIN;
CREATE TYPE "DurationDays_new" AS ENUM ('ONE_MONTH');
ALTER TABLE "Subscription" ALTER COLUMN "durationDays" DROP DEFAULT;
ALTER TABLE "Subscription" ALTER COLUMN "durationDays" TYPE "DurationDays_new" USING ("durationDays"::text::"DurationDays_new");
ALTER TYPE "DurationDays" RENAME TO "DurationDays_old";
ALTER TYPE "DurationDays_new" RENAME TO "DurationDays";
DROP TYPE "DurationDays_old";
ALTER TABLE "Subscription" ALTER COLUMN "durationDays" SET DEFAULT 'ONE_MONTH';
COMMIT;

-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "subscriptionId" INTEGER NOT NULL,
    "paymentMethod" "PaymentMethod" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "payosOrderId" VARCHAR(500),
    "payosPaymentLinkId" VARCHAR(500),
    "payosTransactionId" VARCHAR(500),
    "payosQrCode" TEXT,
    "payosCheckoutUrl" VARCHAR(1000),
    "receivedAmount" DOUBLE PRECISION,
    "changeAmount" DOUBLE PRECISION,
    "gatewayResponse" JSONB,
    "failureReason" VARCHAR(1000),
    "paidAt" TIMESTAMP(3),
    "expiredAt" TIMESTAMP(3),
    "processedById" INTEGER,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Payment_payosOrderId_key" ON "Payment"("payosOrderId");

-- CreateIndex
CREATE INDEX "Payment_subscriptionId_idx" ON "Payment"("subscriptionId");

-- CreateIndex
CREATE INDEX "Payment_status_idx" ON "Payment"("status");

-- CreateIndex
CREATE INDEX "Payment_paymentMethod_idx" ON "Payment"("paymentMethod");

-- CreateIndex
CREATE INDEX "Payment_payosOrderId_idx" ON "Payment"("payosOrderId");

-- CreateIndex
CREATE INDEX "Payment_deletedAt_idx" ON "Payment"("deletedAt");

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_processedById_fkey" FOREIGN KEY ("processedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
