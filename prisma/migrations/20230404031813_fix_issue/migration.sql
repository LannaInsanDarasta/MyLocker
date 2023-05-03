-- DropForeignKey
ALTER TABLE "Locker" DROP CONSTRAINT "Locker_rentId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_rentId_fkey";

-- DropIndex
DROP INDEX "User_rentId_key";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_rentId_fkey" FOREIGN KEY ("rentId") REFERENCES "Rent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Locker" ADD CONSTRAINT "Locker_rentId_fkey" FOREIGN KEY ("rentId") REFERENCES "Rent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
