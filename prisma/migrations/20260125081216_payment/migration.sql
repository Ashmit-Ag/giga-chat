-- AlterTable
ALTER TABLE "User" ADD COLUMN     "autopayEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "pendingPlanId" TEXT;
