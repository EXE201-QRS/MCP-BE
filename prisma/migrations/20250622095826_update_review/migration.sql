/*
  Warnings:

  - You are about to drop the column `respondedAt` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `respondedById` on the `Review` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_respondedById_fkey";

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "respondedAt",
DROP COLUMN "respondedById",
ADD COLUMN     "responsedAt" TIMESTAMP(3),
ADD COLUMN     "responsedById" INTEGER;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_responsedById_fkey" FOREIGN KEY ("responsedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
