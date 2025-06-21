/*
  Warnings:

  - The values [LOGIN] on the enum `VerificationCodeType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `Customer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Device` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SessionToken` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "VerificationCodeType_new" AS ENUM ('REGISTER', 'FORGOT_PASSWORD');
ALTER TABLE "VerificationCode" ALTER COLUMN "type" TYPE "VerificationCodeType_new" USING ("type"::text::"VerificationCodeType_new");
ALTER TYPE "VerificationCodeType" RENAME TO "VerificationCodeType_old";
ALTER TYPE "VerificationCodeType_new" RENAME TO "VerificationCodeType";
DROP TYPE "VerificationCodeType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Customer" DROP CONSTRAINT "Customer_createdById_fkey";

-- DropForeignKey
ALTER TABLE "Customer" DROP CONSTRAINT "Customer_deletedById_fkey";

-- DropForeignKey
ALTER TABLE "Customer" DROP CONSTRAINT "Customer_updatedById_fkey";

-- DropForeignKey
ALTER TABLE "Customer" DROP CONSTRAINT "Customer_userId_fkey";

-- DropForeignKey
ALTER TABLE "Device" DROP CONSTRAINT "Device_userId_fkey";

-- DropForeignKey
ALTER TABLE "SessionToken" DROP CONSTRAINT "SessionToken_deviceId_fkey";

-- DropForeignKey
ALTER TABLE "SessionToken" DROP CONSTRAINT "SessionToken_userId_fkey";

-- DropIndex
DROP INDEX "User_email_idx";

-- DropTable
DROP TABLE "Customer";

-- DropTable
DROP TABLE "Device";

-- DropTable
DROP TABLE "SessionToken";
