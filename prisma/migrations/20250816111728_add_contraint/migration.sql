/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `artists` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "artists_userId_key" ON "artists"("userId");
