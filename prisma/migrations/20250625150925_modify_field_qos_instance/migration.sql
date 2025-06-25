/*
  Warnings:

  - You are about to drop the column `dbUrl` on the `QosInstance` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "QosInstance" DROP COLUMN "dbUrl",
ADD COLUMN     "dbName" VARCHAR(1000);
