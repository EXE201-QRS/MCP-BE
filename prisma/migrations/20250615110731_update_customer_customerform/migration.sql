/*
  Warnings:

  - Added the required column `businessName` to the `CustomerForm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `servicePlanId` to the `CustomerForm` table without a default value. This is not possible if the table is not empty.
  - Made the column `address` on table `CustomerForm` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "FormStatus" AS ENUM ('PENDING', 'PROCESSING', 'PAID', 'COMPLETED', 'REJECTED');

-- AlterTable
ALTER TABLE "CustomerForm" ADD COLUMN     "businessName" VARCHAR(100) NOT NULL,
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "note" VARCHAR(500),
ADD COLUMN     "servicePlanId" INTEGER NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3),
ADD COLUMN     "status" "FormStatus" NOT NULL DEFAULT 'PENDING',
ALTER COLUMN "address" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "CustomerForm" ADD CONSTRAINT "CustomerForm_servicePlanId_fkey" FOREIGN KEY ("servicePlanId") REFERENCES "ServicePlan"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
