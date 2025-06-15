-- CreateEnum
CREATE TYPE "ServerStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'MAINTENANCE');

-- CreateTable
CREATE TABLE "Server" (
    "id" SERIAL NOT NULL,
    "customerFormsId" INTEGER NOT NULL,
    "frontEndUrl" VARCHAR(1000) DEFAULT '',
    "backEndUrl" VARCHAR(1000) DEFAULT '',
    "databaseUrl" VARCHAR(1000) DEFAULT '',
    "statusFrontEnd" "ServerStatus" DEFAULT 'SUSPENDED',
    "statusBackEnd" "ServerStatus" DEFAULT 'SUSPENDED',
    "statusDatabase" "ServerStatus" DEFAULT 'SUSPENDED',
    "createdById" INTEGER,
    "updatedById" INTEGER,
    "deletedById" INTEGER,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Server_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Server_customerFormsId_key" ON "Server"("customerFormsId");

-- CreateIndex
CREATE INDEX "Server_deletedAt_idx" ON "Server"("deletedAt");

-- AddForeignKey
ALTER TABLE "Server" ADD CONSTRAINT "Server_customerFormsId_fkey" FOREIGN KEY ("customerFormsId") REFERENCES "CustomerForm"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Server" ADD CONSTRAINT "Server_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Server" ADD CONSTRAINT "Server_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Server" ADD CONSTRAINT "Server_deletedById_fkey" FOREIGN KEY ("deletedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
