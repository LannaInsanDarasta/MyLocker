/*
  Warnings:

  - You are about to drop the column `rentId` on the `Locker` table. All the data in the column will be lost.
  - You are about to drop the column `rentId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Rent` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[lockerId]` on the table `Rent` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Locker" DROP CONSTRAINT "Locker_rentId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_rentId_fkey";

-- DropIndex
DROP INDEX "Locker_rentId_key";

-- DropIndex
DROP INDEX "User_rentId_key";

-- AlterTable
ALTER TABLE "Locker" DROP COLUMN "rentId";

-- AlterTable
ALTER TABLE "Rent" ADD COLUMN     "lockerId" TEXT,
ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "rentId";

-- CreateIndex
CREATE UNIQUE INDEX "Rent_userId_key" ON "Rent"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Rent_lockerId_key" ON "Rent"("lockerId");

-- AddForeignKey
ALTER TABLE "Rent" ADD CONSTRAINT "Rent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rent" ADD CONSTRAINT "Rent_lockerId_fkey" FOREIGN KEY ("lockerId") REFERENCES "Locker"("id") ON DELETE CASCADE ON UPDATE CASCADE;
