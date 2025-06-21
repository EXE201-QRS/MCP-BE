/*
  Warnings:

  - You are about to drop the column `emailVerified` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `verificationCode` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `verificationExpires` on the `Customer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "emailVerified",
DROP COLUMN "verificationCode",
DROP COLUMN "verificationExpires";
