/*
  Warnings:

  - You are about to drop the column `shortId` on the `Locker` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Locker_shortId_key";

-- AlterTable
ALTER TABLE "Locker" DROP COLUMN "shortId";
