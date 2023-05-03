-- CreateTable
CREATE TABLE "History" (
    "id" TEXT NOT NULL,
    "cardNumber" TEXT,
    "timeSchedule" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "profilId" TEXT,

    CONSTRAINT "History_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "History" ADD CONSTRAINT "History_profilId_fkey" FOREIGN KEY ("profilId") REFERENCES "Profil"("id") ON DELETE SET NULL ON UPDATE CASCADE;
