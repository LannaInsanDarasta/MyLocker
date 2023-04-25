/*
  Warnings:

  - You are about to drop the column `profilId` on the `History` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "History" DROP CONSTRAINT "History_profilId_fkey";

-- AlterTable
ALTER TABLE "History" DROP COLUMN "profilId",
ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "History" ADD CONSTRAINT "History_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
