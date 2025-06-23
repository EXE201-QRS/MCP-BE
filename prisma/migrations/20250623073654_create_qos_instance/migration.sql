-- CreateEnum
CREATE TYPE "QosInstanceStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'MAINTENANCE', 'DEPLOYING', 'ERROR');

-- CreateTable
CREATE TABLE "QosInstance" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "subscriptionId" INTEGER NOT NULL,
    "dbUrl" VARCHAR(1000),
    "statusDb" "QosInstanceStatus" NOT NULL DEFAULT 'INACTIVE',
    "frontEndUrl" VARCHAR(1000),
    "statusFE" "QosInstanceStatus" NOT NULL DEFAULT 'INACTIVE',
    "backEndUrl" VARCHAR(1000),
    "statusBE" "QosInstanceStatus" NOT NULL DEFAULT 'INACTIVE',
    "serverInfo" JSONB,
    "dbSize" DOUBLE PRECISION DEFAULT 0.0,
    "lastBackup" TIMESTAMP(3),
    "lastPing" TIMESTAMP(3),
    "responseTime" DOUBLE PRECISION DEFAULT 0.0,
    "uptime" DOUBLE PRECISION DEFAULT 0.0,
    "version" VARCHAR(50),
    "deployedAt" TIMESTAMP(3),
    "createdById" INTEGER,
    "updatedById" INTEGER,
    "deletedById" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "QosInstance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "QosInstance_subscriptionId_key" ON "QosInstance"("subscriptionId");

-- CreateIndex
CREATE INDEX "QosInstance_deletedAt_idx" ON "QosInstance"("deletedAt");

-- AddForeignKey
ALTER TABLE "QosInstance" ADD CONSTRAINT "QosInstance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QosInstance" ADD CONSTRAINT "QosInstance_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QosInstance" ADD CONSTRAINT "QosInstance_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QosInstance" ADD CONSTRAINT "QosInstance_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QosInstance" ADD CONSTRAINT "QosInstance_deletedById_fkey" FOREIGN KEY ("deletedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
