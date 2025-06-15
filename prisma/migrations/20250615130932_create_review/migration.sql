-- CreateEnum
CREATE TYPE "ReviewType" AS ENUM ('SERVICE', 'SERVER');

-- CreateTable
CREATE TABLE "Review" (
    "id" SERIAL NOT NULL,
    "customerFormsId" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "comment" VARCHAR(500) NOT NULL,
    "type" "ReviewType" NOT NULL DEFAULT 'SERVICE',
    "rating" INTEGER NOT NULL DEFAULT 0,
    "createdById" INTEGER,
    "updatedById" INTEGER,
    "deletedById" INTEGER,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Review_deletedAt_idx" ON "Review"("deletedAt");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_customerFormsId_fkey" FOREIGN KEY ("customerFormsId") REFERENCES "CustomerForm"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_deletedById_fkey" FOREIGN KEY ("deletedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
