/*
  Warnings:

  - You are about to alter the column `email` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(500)`.
  - You are about to drop the `CustomerForm` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Review` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Server` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ServicePlan` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN_SYSTEM', 'CUSTOMER');

-- CreateEnum
CREATE TYPE "CustomerStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION');

-- DropForeignKey
ALTER TABLE "CustomerForm" DROP CONSTRAINT "CustomerForm_createdById_fkey";

-- DropForeignKey
ALTER TABLE "CustomerForm" DROP CONSTRAINT "CustomerForm_deletedById_fkey";

-- DropForeignKey
ALTER TABLE "CustomerForm" DROP CONSTRAINT "CustomerForm_servicePlanId_fkey";

-- DropForeignKey
ALTER TABLE "CustomerForm" DROP CONSTRAINT "CustomerForm_updatedById_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_createdById_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_customerFormsId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_deletedById_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_updatedById_fkey";

-- DropForeignKey
ALTER TABLE "Server" DROP CONSTRAINT "Server_createdById_fkey";

-- DropForeignKey
ALTER TABLE "Server" DROP CONSTRAINT "Server_customerFormsId_fkey";

-- DropForeignKey
ALTER TABLE "Server" DROP CONSTRAINT "Server_deletedById_fkey";

-- DropForeignKey
ALTER TABLE "Server" DROP CONSTRAINT "Server_updatedById_fkey";

-- DropForeignKey
ALTER TABLE "ServicePlan" DROP CONSTRAINT "ServicePlan_createdById_fkey";

-- DropForeignKey
ALTER TABLE "ServicePlan" DROP CONSTRAINT "ServicePlan_deletedById_fkey";

-- DropForeignKey
ALTER TABLE "ServicePlan" DROP CONSTRAINT "ServicePlan_updatedById_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "roleName" "Role" NOT NULL DEFAULT 'CUSTOMER',
ALTER COLUMN "email" SET DATA TYPE VARCHAR(500),
ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "phoneNumber" DROP NOT NULL;

-- DropTable
DROP TABLE "CustomerForm";

-- DropTable
DROP TABLE "Review";

-- DropTable
DROP TABLE "Server";

-- DropTable
DROP TABLE "ServicePlan";

-- DropEnum
DROP TYPE "FormStatus";

-- DropEnum
DROP TYPE "PlanDuration";

-- DropEnum
DROP TYPE "ReviewType";

-- DropEnum
DROP TYPE "ServerStatus";

-- CreateTable
CREATE TABLE "Customer" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "status" "CustomerStatus" NOT NULL DEFAULT 'INACTIVE',
    "restaurantName" VARCHAR(500),
    "restaurantAddress" VARCHAR(1000),
    "restaurantPhone" VARCHAR(50),
    "restaurantType" VARCHAR(200),
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "verificationCode" VARCHAR(10),
    "verificationExpires" TIMESTAMP(3),
    "createdById" INTEGER,
    "updatedById" INTEGER,
    "deletedById" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Customer_userId_key" ON "Customer"("userId");

-- CreateIndex
CREATE INDEX "Customer_deletedAt_idx" ON "Customer"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_deletedById_fkey" FOREIGN KEY ("deletedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
