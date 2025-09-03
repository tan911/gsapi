-- AlterTable
ALTER TABLE "users" ADD COLUMN     "onboarding_completed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "onboarding_step" INTEGER NOT NULL DEFAULT 1;
