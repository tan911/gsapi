-- CreateEnum
CREATE TYPE "BookingPaymentStatus" AS ENUM ('unpaid', 'paid', 'partial', 'refunded');

-- CreateEnum
CREATE TYPE "BookingSource" AS ENUM ('web', 'app', 'phone', 'manual');

-- CreateEnum
CREATE TYPE "BookingLocationType" AS ENUM ('client', 'studio', 'other');

-- CreateEnum
CREATE TYPE "ReminderChannel" AS ENUM ('email', 'sms', 'push');

-- CreateEnum
CREATE TYPE "BlockedDateType" AS ENUM ('personal', 'vacation', 'sick', 'other');

-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "calendar_color" TEXT,
ADD COLUMN     "cancellation_reason" TEXT,
ADD COLUMN     "is_travel" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "payment_status" "BookingPaymentStatus" NOT NULL DEFAULT 'unpaid',
ADD COLUMN     "recurrence_rule" TEXT,
ADD COLUMN     "recurring" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "remindersSent" "ReminderChannel"[],
ADD COLUMN     "servicePrice" DECIMAL(65,30),
ADD COLUMN     "source" "BookingSource" NOT NULL DEFAULT 'web',
ADD COLUMN     "totalAmount" DECIMAL(65,30),
ADD COLUMN     "travelFee" DECIMAL(65,30) DEFAULT 0,
ADD COLUMN     "travel_distance_km" DECIMAL(65,30);

-- CreateTable
CREATE TABLE "booking_locations" (
    "id" SERIAL NOT NULL,
    "bookingId" INTEGER NOT NULL,
    "address" VARCHAR(100) NOT NULL,
    "city" VARCHAR(100) NOT NULL,
    "region" VARCHAR(100),
    "postal_code" VARCHAR(20),
    "latitude" DECIMAL(10,8),
    "longitude" DECIMAL(11,8),
    "type" "BookingLocationType" NOT NULL DEFAULT 'client',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "booking_locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking_attachments" (
    "id" SERIAL NOT NULL,
    "bookingId" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "booking_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "artist_blocked_dates" (
    "id" SERIAL NOT NULL,
    "artistId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "reason" TEXT,
    "type" "BlockedDateType" NOT NULL DEFAULT 'personal',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "artist_blocked_dates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "booking_locations_bookingId_key" ON "booking_locations"("bookingId");

-- CreateIndex
CREATE INDEX "booking_attachments_bookingId_idx" ON "booking_attachments"("bookingId");

-- CreateIndex
CREATE UNIQUE INDEX "artist_blocked_dates_artistId_date_key" ON "artist_blocked_dates"("artistId", "date");

-- AddForeignKey
ALTER TABLE "booking_locations" ADD CONSTRAINT "booking_locations_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_attachments" ADD CONSTRAINT "booking_attachments_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "artist_blocked_dates" ADD CONSTRAINT "artist_blocked_dates_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artists"("id") ON DELETE CASCADE ON UPDATE CASCADE;
