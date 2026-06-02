/*
  Warnings:

  - You are about to drop the column `role` on the `Agent` table. All the data in the column will be lost.
  - The primary key for the `GiftCard` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Agent" DROP COLUMN "role";

-- AlterTable
ALTER TABLE "GiftCard" DROP CONSTRAINT "GiftCard_pkey",
ALTER COLUMN "giftCardId" DROP DEFAULT,
ALTER COLUMN "giftCardId" SET DATA TYPE TEXT,
ADD CONSTRAINT "GiftCard_pkey" PRIMARY KEY ("giftCardId");
