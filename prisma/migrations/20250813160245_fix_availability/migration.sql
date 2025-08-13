/*
  Warnings:

  - Added the required column `date` to the `availabilities` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "availabilities" ADD COLUMN     "date" DATE NOT NULL,
ADD COLUMN     "timezone" TEXT NOT NULL DEFAULT 'UTC';

-- AlterTable
ALTER TABLE "recurring_availabilities" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "timezone" TEXT NOT NULL DEFAULT 'UTC';

-- CreateIndex
CREATE INDEX "availabilities_artistId_date_idx" ON "availabilities"("artistId", "date");

-- CreateIndex
CREATE INDEX "availabilities_artistId_status_idx" ON "availabilities"("artistId", "status");

-- CreateIndex
CREATE INDEX "recurring_availabilities_artistId_day_of_week_isActive_idx" ON "recurring_availabilities"("artistId", "day_of_week", "isActive");
