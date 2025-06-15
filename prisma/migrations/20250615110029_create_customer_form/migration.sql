-- CreateTable
CREATE TABLE "CustomerForm" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "address" VARCHAR(500),
    "createdById" INTEGER,
    "updatedById" INTEGER,
    "deletedById" INTEGER,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomerForm_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CustomerForm_deletedAt_idx" ON "CustomerForm"("deletedAt");

-- AddForeignKey
ALTER TABLE "CustomerForm" ADD CONSTRAINT "CustomerForm_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "CustomerForm" ADD CONSTRAINT "CustomerForm_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "CustomerForm" ADD CONSTRAINT "CustomerForm_deletedById_fkey" FOREIGN KEY ("deletedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
