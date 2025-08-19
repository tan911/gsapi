/*
  Warnings:

  - You are about to drop the column `location` on the `artists` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `artists` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "artists" DROP COLUMN "location",
DROP COLUMN "rating",
ALTER COLUMN "bio" DROP NOT NULL,
ALTER COLUMN "experience_years" DROP NOT NULL,
ALTER COLUMN "experience_years" SET DATA TYPE DECIMAL(65,30);
