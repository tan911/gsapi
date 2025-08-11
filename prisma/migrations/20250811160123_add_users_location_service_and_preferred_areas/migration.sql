CREATE EXTENSION IF NOT EXISTS postgis;

-- CreateTable
CREATE TABLE "users_location" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "address" VARCHAR(100) NOT NULL,
    "state" VARCHAR(100) NOT NULL,
    "city" VARCHAR(100) NOT NULL,
    "country" VARCHAR(100) NOT NULL,
    "postal_code" VARCHAR(20) NOT NULL,
    "latitude" DECIMAL(10,8) NOT NULL,
    "longitude" DECIMAL(11,8) NOT NULL,
    "location" geography(Point,4326) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "artist_service_areas" (
    "id" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "travel_radius_km" INTEGER NOT NULL,
    "manual_accept_outside_radius" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "artist_service_areas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "artist_preferred_service_areas" (
    "id" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT,
    "country" TEXT NOT NULL,
    "latitude" DECIMAL(10,8),
    "longitude" DECIMAL(11,8),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "artist_preferred_service_areas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "artist_service_areas_artistId_locationId_key" ON "artist_service_areas"("artistId", "locationId");

-- CreateIndex
CREATE UNIQUE INDEX "artist_preferred_service_areas_artistId_city_state_country_key" ON "artist_preferred_service_areas"("artistId", "city", "state", "country");

-- AddForeignKey
ALTER TABLE "users_location" ADD CONSTRAINT "users_location_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "artist_service_areas" ADD CONSTRAINT "artist_service_areas_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "artist_service_areas" ADD CONSTRAINT "artist_service_areas_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "users_location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "artist_preferred_service_areas" ADD CONSTRAINT "artist_preferred_service_areas_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artists"("id") ON DELETE CASCADE ON UPDATE CASCADE;
