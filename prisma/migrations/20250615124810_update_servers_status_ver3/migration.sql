/*
  Warnings:

  - Made the column `statusFrontEnd` on table `Server` required. This step will fail if there are existing NULL values in that column.
  - Made the column `statusBackEnd` on table `Server` required. This step will fail if there are existing NULL values in that column.
  - Made the column `statusDatabase` on table `Server` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Server" ALTER COLUMN "statusFrontEnd" SET NOT NULL,
ALTER COLUMN "statusBackEnd" SET NOT NULL,
ALTER COLUMN "statusDatabase" SET NOT NULL;
