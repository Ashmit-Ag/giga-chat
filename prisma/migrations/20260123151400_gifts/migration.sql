/*
  Warnings:

  - The `giftsSent` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Mod" ADD COLUMN     "friends" JSONB,
ADD COLUMN     "giftsRecieved" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalGiftAmount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "totalGiftAmount" INTEGER NOT NULL DEFAULT 0,
DROP COLUMN "giftsSent",
ADD COLUMN     "giftsSent" INTEGER[];
