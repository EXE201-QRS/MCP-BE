-- STEP 1: Drop enum cũ nếu không còn dùng (nếu chưa có thì bỏ qua)

-- DropEnum
DROP TYPE IF EXISTS "CustomerStatus";

-- STEP 2: Tạo enum mới trước (vì bảng sẽ dùng nó)
CREATE TYPE "SubscriptionStatus" AS ENUM ('PENDING', 'PAID', 'ACTIVE', 'EXPIRED', 'CANCELLED');

-- STEP 3: Tạo bảng sử dụng enum
CREATE TABLE "Subscription" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "restaurantName" VARCHAR(500) NOT NULL,
    "restaurantAddress" VARCHAR(1000) NOT NULL,
    "restaurantPhone" VARCHAR(15) NOT NULL,
    "restaurantType" VARCHAR(200) NOT NULL,
    "description" VARCHAR(1000),
    "servicePlanId" INTEGER NOT NULL,
    "durationDays" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'PENDING',
    "createdById" INTEGER,
    "updatedById" INTEGER,
    "deletedById" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- STEP 4: Indexes
CREATE INDEX "Subscription_userId_idx" ON "Subscription"("userId");
CREATE INDEX "Subscription_status_idx" ON "Subscription"("status");
CREATE INDEX "Subscription_endDate_idx" ON "Subscription"("endDate");
CREATE INDEX "Subscription_deletedAt_idx" ON "Subscription"("deletedAt");

-- STEP 5: Foreign keys
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_servicePlanId_fkey" FOREIGN KEY ("servicePlanId") REFERENCES "ServicePlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_deletedById_fkey" FOREIGN KEY ("deletedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- STEP 6: Xoá index cũ không còn cần
DROP INDEX IF EXISTS "ServicePlan_name_idx";
