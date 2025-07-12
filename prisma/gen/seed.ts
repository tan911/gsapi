import dotenv from 'dotenv'
import prisma from '../index'
import { createClientUsers } from './client'
import { createArtistUsers } from './artist'
import { createArtistProfiles } from './artist-profile'
import { createServices } from './artist-services'
import { createBookings } from './booking'

dotenv.config()

async function main() {
    // Clean existing data in correct order (respecting foreign key constraints)
    console.log('Cleaning existing data...')
    await prisma.booking.deleteMany()
    await prisma.service.deleteMany()
    await prisma.artist.deleteMany()
    await prisma.account.deleteMany()
    await prisma.session.deleteMany()
    await prisma.verification.deleteMany()
    await prisma.user.deleteMany()
    console.log('Cleanup completed!')

    const client = await createClientUsers()
    const artist = await createArtistUsers()

    const artistProfiles = await createArtistProfiles(artist)
    const services = await createServices(artistProfiles)
    const bookings = await createBookings(client, artist, services)

    const accounts = await Promise.all([
        prisma.account.create({
            data: {
                userId: client[0].id,
                accountId: 'google_123456789',
                providerId: 'google',
                accessToken: 'mock_access_token_1',
                refreshToken: 'mock_refresh_token_1',
                scope: 'email profile',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        }),
        prisma.account.create({
            data: {
                userId: artist[0].id,
                accountId: 'google_987654321',
                providerId: 'google',
                accessToken: 'mock_access_token_2',
                refreshToken: 'mock_refresh_token_2',
                scope: 'email profile',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        }),
    ])

    console.log('Seed completed successfully!')
    console.log(`Created ${client.length + artist.length} users`)
    console.log(`Created ${artist.length} artists`)
    console.log(`Created ${services.length} services`)
    console.log(`Created ${bookings.length} bookings`)
    console.log(`Created ${accounts.length} accounts`)
}

if (process.env.API_ENVIRONMENT === 'development') {
    console.log('seeding...')
    main()
        .then(async () => {
            await prisma.$disconnect()
        })
        .catch(async (e) => {
            console.log('prisma failed to seed: ', e)
            await prisma.$disconnect()
            process.exit(1)
        })
} else {
    console.log('No seeding in production!')
}
