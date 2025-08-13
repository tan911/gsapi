/*
  Warnings:

  - A unique constraint covering the columns `[artistId,day_of_week]` on the table `recurring_availabilities` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "recurring_availabilities_artistId_day_of_week_key" ON "recurring_availabilities"("artistId", "day_of_week");
