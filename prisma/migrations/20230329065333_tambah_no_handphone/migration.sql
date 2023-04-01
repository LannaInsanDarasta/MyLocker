/*
  Warnings:

  - A unique constraint covering the columns `[noHandphone]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "noHandphone" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_noHandphone_key" ON "User"("noHandphone");
