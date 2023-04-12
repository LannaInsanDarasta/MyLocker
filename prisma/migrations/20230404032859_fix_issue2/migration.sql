/*
  Warnings:

  - A unique constraint covering the columns `[rentId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Locker" DROP CONSTRAINT "Locker_rentId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_rentId_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "User_rentId_key" ON "User"("rentId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_rentId_fkey" FOREIGN KEY ("rentId") REFERENCES "Rent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Locker" ADD CONSTRAINT "Locker_rentId_fkey" FOREIGN KEY ("rentId") REFERENCES "Rent"("id") ON DELETE SET NULL ON UPDATE CASCADE;
