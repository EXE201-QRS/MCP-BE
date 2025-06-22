/*
  Warnings:

  - The `durationDays` column on the `Subscription` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "DurationDays" AS ENUM ('ONE_MONTH', 'THREE_MONTHS', 'SIX_MONTHS');

-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "durationDays",
ADD COLUMN     "durationDays" "DurationDays" NOT NULL DEFAULT 'ONE_MONTH';
