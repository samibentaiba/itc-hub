/*
  Warnings:

  - You are about to drop the column `attendees` on the `Event` table. All the data in the column will be lost.
  - The `duration` column on the `Event` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `_ProfileWorkingOn` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[headId]` on the table `Department` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "TicketStatus" ADD VALUE 'PENDING';

-- DropForeignKey
ALTER TABLE "_ProfileWorkingOn" DROP CONSTRAINT "_ProfileWorkingOn_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProfileWorkingOn" DROP CONSTRAINT "_ProfileWorkingOn_B_fkey";

-- AlterTable
ALTER TABLE "Department" ADD COLUMN     "color" TEXT,
ADD COLUMN     "headId" TEXT;

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "attendees",
ADD COLUMN     "departmentId" TEXT,
ALTER COLUMN "description" DROP NOT NULL,
DROP COLUMN "duration",
ADD COLUMN     "duration" INTEGER,
ALTER COLUMN "type" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Profile" ALTER COLUMN "realName" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "leaderId" TEXT;

-- AlterTable
ALTER TABLE "Ticket" ALTER COLUMN "description" DROP NOT NULL;

-- DropTable
DROP TABLE "_ProfileWorkingOn";

-- CreateTable
CREATE TABLE "_TicketCollaborators" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_TicketCollaborators_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_EventAttendees" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_EventAttendees_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_TicketCollaborators_B_index" ON "_TicketCollaborators"("B");

-- CreateIndex
CREATE INDEX "_EventAttendees_B_index" ON "_EventAttendees"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Department_headId_key" ON "Department"("headId");

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_headId_fkey" FOREIGN KEY ("headId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_leaderId_fkey" FOREIGN KEY ("leaderId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TicketCollaborators" ADD CONSTRAINT "_TicketCollaborators_A_fkey" FOREIGN KEY ("A") REFERENCES "Ticket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TicketCollaborators" ADD CONSTRAINT "_TicketCollaborators_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventAttendees" ADD CONSTRAINT "_EventAttendees_A_fkey" FOREIGN KEY ("A") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventAttendees" ADD CONSTRAINT "_EventAttendees_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
